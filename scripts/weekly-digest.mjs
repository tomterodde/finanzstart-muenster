#!/usr/bin/env node
/**
 * Wöchentlicher Newsletter-Digest → Kit (ConvertKit) v4 API
 *
 * Liest die Blog-Artikel, wählt "Neu diese Woche" + rotierende Lesetipps,
 * baut eine HTML-Mail aus dem vorhandenen `tldr`-Frontmatter und legt sie
 * als Kit-Broadcast an.
 *
 * Standardmodus: ENTWURF (send_at = null) → in Kit prüfen und manuell senden.
 * Auto-Versand: DIGEST_SEND_MODE=schedule → plant den Versand mit Puffer.
 *
 * Zero-Dependency: nutzt nur Node-Built-ins + global fetch (Node ≥ 18/22).
 *
 * Env:
 *   KIT_API_KEY          (Pflicht)  v4-API-Key aus Kit → Settings → Developer
 *   DIGEST_SEND_MODE     draft | schedule         (Default: draft)
 *   DIGEST_SCHEDULE_HOURS Stunden Puffer bei schedule (Default: 48)
 *   DIGEST_FEATURED_DAYS Fenster "neu diese Woche" (Default: 7)
 *   DIGEST_TIPP_COUNT    Anzahl Lesetipps          (Default: 2)
 *   SITE_URL             (Default: https://finanzstart-muenster.de)
 *   BOOKINGS_URL         (Default: gesetzter Bookings-Link)
 *   DRY_RUN              =1 → kein API-Call, HTML auf stdout
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG_DIR = join(ROOT, 'src/content/blog');

const SITE_URL = (process.env.SITE_URL || 'https://finanzstart-muenster.de').replace(/\/$/, '');
const BOOKINGS_URL =
  process.env.BOOKINGS_URL ||
  'https://outlook.office.com/bookwithme/user/f7d184a8790c451390cda05ae8b3fb18@tecis.de/meetingtype/cdie9Hia-EulszcibmFVfQ2?bookingcode=d1927a5d-5856-470c-894c-a255316c0f36&anonymous&ismsaljsauthenabled&ep=mlink&utm_source=newsletter&utm_medium=email&utm_campaign=digest';
const API_KEY = process.env.KIT_API_KEY;
const SEND_MODE = (process.env.DIGEST_SEND_MODE || 'draft').toLowerCase();
const SCHEDULE_HOURS = Number(process.env.DIGEST_SCHEDULE_HOURS || 48);
const FEATURED_DAYS = Number(process.env.DIGEST_FEATURED_DAYS || 7);
const TIPP_COUNT = Number(process.env.DIGEST_TIPP_COUNT || 2);
const FEATURED_MAX = 4;
const DRY_RUN = process.env.DRY_RUN === '1';

if (!API_KEY && !DRY_RUN) {
  console.error('FEHLER: KIT_API_KEY fehlt. Als GitHub-Secret setzen.');
  process.exit(1);
}

// --- Frontmatter-Parser (nur Top-Level-Skalare, ohne YAML-Dependency) -------
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    // nur Zeilen ohne Einrückung = Top-Level; Listen (faq:/sources:) werden so ignoriert
    const mm = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!mm) continue;
    let [, key, val] = mm;
    val = val.trim();
    if (val === '') continue; // Block-Keys wie "faq:" überspringen
    if (
      (val.startsWith("'") && val.endsWith("'")) ||
      (val.startsWith('"') && val.endsWith('"'))
    ) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }
  return fm;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ISO-Kalenderwoche (für deterministische Tipp-Rotation)
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
}

// --- Artikel laden ----------------------------------------------------------
const now = new Date();
const articles = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
  .map((f) => {
    const slug = f.replace(/\.(md|mdx)$/, '');
    const fm = parseFrontmatter(readFileSync(join(BLOG_DIR, f), 'utf8'));
    if (!fm || !fm.title || !fm.pubDate) return null;
    const pubDate = new Date(fm.pubDate);
    if (Number.isNaN(pubDate.getTime())) return null;
    return {
      slug,
      title: fm.title,
      description: fm.description || '',
      tldr: fm.tldr || '',
      category: fm.category || '',
      pubDate,
      url: `${SITE_URL}/blog/${slug}/`,
    };
  })
  .filter(Boolean)
  .filter((a) => a.pubDate <= now) // nur veröffentlichte (keine Pipeline-Future-Posts)
  .sort((a, b) => b.pubDate - a.pubDate);

if (articles.length === 0) {
  console.log('Keine veröffentlichten Artikel gefunden — kein Digest.');
  process.exit(0);
}

// Neu diese Woche
const cutoff = new Date(now.getTime() - FEATURED_DAYS * 86400000);
const featured = articles.filter((a) => a.pubDate >= cutoff).slice(0, FEATURED_MAX);

// Lesetipps: deterministische Rotation über die restlichen Artikel
const featuredSlugs = new Set(featured.map((a) => a.slug));
const pool = articles.filter((a) => !featuredSlugs.has(a.slug));
const week = isoWeek(now);
const tipps = [];
const seen = new Set();
for (let i = 0; i < TIPP_COUNT && pool.length > seen.size; i++) {
  let idx = (week * TIPP_COUNT + i) % pool.length;
  while (seen.has(idx)) idx = (idx + 1) % pool.length;
  seen.add(idx);
  tipps.push(pool[idx]);
}

if (featured.length === 0 && tipps.length === 0) {
  console.log('Nichts auszuspielen — kein Digest.');
  process.exit(0);
}

// --- HTML bauen -------------------------------------------------------------
function summary(a) {
  const s = a.tldr || a.description || '';
  return s.length > 230 ? s.slice(0, 227).trimEnd() + '…' : s;
}

function renderArticle(a) {
  const cat = a.category
    ? `<span style="display:inline-block;font-size:12px;color:#1a6b3c;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;">${escapeHtml(
        a.category
      )}</span><br>`
    : '';
  return `
    <tr><td style="padding:0 0 28px;">
      ${cat}
      <a href="${escapeHtml(a.url)}" style="font-size:18px;font-weight:700;color:#111;text-decoration:none;line-height:1.35;">${escapeHtml(
    a.title
  )}</a>
      <p style="margin:8px 0 10px;font-size:14px;color:#555;line-height:1.6;">${escapeHtml(summary(a))}</p>
      <a href="${escapeHtml(a.url)}" style="font-size:14px;font-weight:600;color:#1a6b3c;text-decoration:none;">Weiterlesen →</a>
    </td></tr>`;
}

function section(title, items) {
  if (!items.length) return '';
  return `
    <tr><td style="padding:0 0 14px;">
      <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#1a6b3c;margin:0;">${escapeHtml(
        title
      )}</h2>
    </td></tr>
    ${items.map(renderArticle).join('')}`;
}

const html = `<!doctype html><html lang="de"><body style="margin:0;background:#f4f6f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f4;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;padding:32px 32px 28px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="padding:0 0 20px;border-bottom:1px solid #eee;">
          <p style="margin:0;font-size:13px;color:#999;">Finanzstart Münster · Lesetipps der Woche</p>
        </td></tr>
        <tr><td style="height:24px;"></td></tr>
        ${section('Neu diese Woche', featured)}
        ${section('Lesetipp aus dem Archiv', tipps)}
        <tr><td style="padding:8px 0 0;border-top:1px solid #eee;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eaf3ed;border-radius:12px;margin-top:8px;">
            <tr><td style="padding:24px;text-align:center;">
              <p style="margin:0 0 12px;font-size:15px;color:#111;font-weight:600;">Fragen zu deiner eigenen Situation?</p>
              <a href="${escapeHtml(
                BOOKINGS_URL
              )}" style="display:inline-block;background:#1a6b3c;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 26px;border-radius:8px;">15-Min-Kennenlernen buchen →</a>
              <p style="margin:12px 0 0;font-size:12px;color:#888;">Kostenlos &amp; unverbindlich.</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:20px 0 0;font-size:12px;color:#aaa;line-height:1.6;">
          Du bekommst diese Mail, weil du dich auf finanzstart-muenster.de angemeldet hast.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

// --- Betreff + Preview ------------------------------------------------------
function clip(s, n) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
}
const subject =
  featured.length > 0
    ? clip(`Neu: ${featured[0].title}`, 72)
    : 'Finanzstart Münster — deine Lesetipps der Woche';
const previewText = clip(summary(featured[0] || tipps[0]), 120);

// --- DRY RUN ----------------------------------------------------------------
console.log(
  `Digest KW${week}: ${featured.length} neu, ${tipps.length} Tipp(s). Betreff: "${subject}"`
);
if (DRY_RUN) {
  console.log('\n--- DRY RUN: kein API-Call. HTML-Vorschau: ---\n');
  console.log(html);
  process.exit(0);
}

// --- Kit-Broadcast anlegen --------------------------------------------------
const sendAt =
  SEND_MODE === 'schedule'
    ? new Date(now.getTime() + SCHEDULE_HOURS * 3600000).toISOString()
    : null; // null = Entwurf

const body = {
  content: html,
  description: `Wochen-Digest ${now.toISOString().slice(0, 10)} (KW${week})`,
  public: false,
  published_at: now.toISOString(),
  preview_text: previewText,
  subject,
  send_at: sendAt,
  // subscriber_filter weggelassen → alle Abonnenten
};

const res = await fetch('https://api.kit.com/v4/broadcasts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Kit-Api-Key': API_KEY,
  },
  body: JSON.stringify(body),
});

const text = await res.text();
if (!res.ok) {
  console.error(`Kit-API-Fehler ${res.status}: ${text}`);
  process.exit(1);
}

console.log(
  SEND_MODE === 'schedule'
    ? `✅ Broadcast geplant für ${sendAt} (in ${SCHEDULE_HOURS}h).`
    : '✅ Broadcast als ENTWURF erstellt — in Kit prüfen und senden.'
);
