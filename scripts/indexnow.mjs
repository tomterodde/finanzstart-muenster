#!/usr/bin/env node
/**
 * IndexNow-Ping: meldet neue und geänderte Seiten an Bing, Yandex, Seznam, Naver & Co.
 * (api.indexnow.org verteilt an alle teilnehmenden Suchmaschinen).
 *
 * Modi:
 *   node scripts/indexnow.mjs --today
 *       Artikel mit pubDate oder updatedDate = heute (Europe/Berlin), dazu Startseite,
 *       Blog-Übersicht und betroffene Kategorieseiten. Für den täglichen Deploy.
 *   node scripts/indexnow.mjs --changed <base-sha> <head-sha>
 *       Alle Seiten, deren Quelldateien sich zwischen zwei Commits geändert haben
 *       und die bereits live sind. Für Pushes auf main.
 *
 * Zero-Dependency: Node-Built-ins + global fetch (Node ≥ 18).
 * Env: DRY_RUN=1 → nur ausgeben, nichts senden.
 *
 * Der Key ist bei IndexNow kein Geheimnis: Er liegt öffentlich unter /<key>.txt
 * und belegt nur, dass die Meldung vom Domain-Inhaber kommt.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'finanzstart-muenster.de';
const SITE = `https://${HOST}`;
const KEY = 'c854553a47b258bb619296be18af26ac';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BLOG_DIR = 'src/content/blog';

/** @type {Record<string, string>} */
const CATEGORY_SLUGS = {
	Grundlagen: 'grundlagen',
	Versicherungen: 'versicherungen',
	Einkommenssicherung: 'einkommenssicherung',
	Vermögensaufbau: 'vermoegensaufbau',
	Altersvorsorge: 'altersvorsorge',
	'Karriere & Einkommen': 'karriere-einkommen',
	'Private Equity': 'private-equity',
};

/** Seiten unter src/pages, die nicht gemeldet werden (noindex). */
const NOINDEX_PAGES = new Set(['datenschutz', 'impressum', 'newsletter-bestaetigt', 'finanzcheck', 'zusammenarbeiten']);

/** @returns {string} heutiges Datum in Europe/Berlin als YYYY-MM-DD */
function todayBerlin() {
	return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());
}

/**
 * Liest die für IndexNow relevanten Frontmatter-Felder eines Artikels.
 * @param {string} slug
 * @returns {{ pubDate: string | null, updatedDate: string | null, category: string | null } | null}
 */
function readPost(slug) {
	const file = join(ROOT, BLOG_DIR, `${slug}.md`);
	if (!existsSync(file)) return null;
	const text = readFileSync(file, 'utf8');
	/** @param {string} name */
	const field = (name) => {
		const m = text.match(new RegExp(`^${name}:\\s*['"]?([^'"\\n]+)['"]?\\s*$`, 'm'));
		return m ? m[1].trim() : null;
	};
	return { pubDate: field('pubDate'), updatedDate: field('updatedDate'), category: field('category') };
}

/**
 * @param {string} slug
 * @param {string} today
 * @returns {boolean} true, wenn der Artikel live ist (pubDate ≤ heute)
 */
function isLive(slug, today) {
	const post = readPost(slug);
	return Boolean(post?.pubDate && post.pubDate.slice(0, 10) <= today);
}

/**
 * URLs für den täglichen Lauf: heute veröffentlichte oder aktualisierte Artikel.
 * @param {string} today
 * @returns {string[]}
 */
function urlsForToday(today) {
	const slugs = readdirSync(join(ROOT, BLOG_DIR))
		.filter((f) => f.endsWith('.md'))
		.map((f) => f.slice(0, -3));
	const urls = new Set();
	for (const slug of slugs) {
		const post = readPost(slug);
		if (!post) continue;
		const published = post.pubDate?.slice(0, 10) === today;
		const updated = post.updatedDate?.slice(0, 10) === today;
		if (!published && !updated) continue;
		urls.add(`${SITE}/blog/${slug}/`);
		if (published) {
			urls.add(`${SITE}/`);
			urls.add(`${SITE}/blog/`);
			const cat = post.category ? CATEGORY_SLUGS[post.category] : undefined;
			if (cat) urls.add(`${SITE}/blog/kategorie/${cat}/`);
		}
	}
	return [...urls];
}

/**
 * URLs für einen Push: geänderte Quelldateien zwischen zwei Commits.
 * @param {string} base
 * @param {string} head
 * @param {string} today
 * @returns {string[]}
 */
function urlsForChanged(base, head, today) {
	const validBase = /^[0-9a-f]{7,40}$/.test(base) && !/^0+$/.test(base) ? base : `${head}~1`;
	const files = execFileSync('git', ['diff', '--name-only', '--diff-filter=AM', validBase, head], { cwd: ROOT, encoding: 'utf8' })
		.split('\n')
		.filter(Boolean);
	const urls = new Set();
	for (const file of files) {
		const post = file.match(/^src\/content\/blog\/([^/]+)\.mdx?$/);
		if (post) {
			if (isLive(post[1], today)) urls.add(`${SITE}/blog/${post[1]}/`);
			continue;
		}
		const page = file.match(/^src\/pages\/([^/[\]]+)\.astro$/);
		if (page) {
			if (page[1] === 'index') urls.add(`${SITE}/`);
			else if (!NOINDEX_PAGES.has(page[1])) urls.add(`${SITE}/${page[1]}/`);
			continue;
		}
		if (file === 'src/pages/blog/index.astro') urls.add(`${SITE}/blog/`);
		if (file.startsWith('src/pages/blog/kategorie/')) {
			for (const cat of Object.values(CATEGORY_SLUGS)) urls.add(`${SITE}/blog/kategorie/${cat}/`);
		}
	}
	return [...urls];
}

/**
 * @param {string[]} urlList
 * @returns {Promise<void>}
 */
async function submit(urlList) {
	if (urlList.length === 0) {
		console.log('IndexNow: keine URLs zu melden.');
		return;
	}
	console.log(`IndexNow: ${urlList.length} URL(s)\n${urlList.join('\n')}`);
	if (process.env.DRY_RUN === '1') {
		console.log('DRY_RUN=1 – nichts gesendet.');
		return;
	}
	const res = await fetch(ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
		body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urlList.slice(0, 10000) }),
	});
	if (res.status === 200 || res.status === 202) {
		console.log(`IndexNow: angenommen (HTTP ${res.status}).`);
		return;
	}
	const body = await res.text().catch(() => '');
	throw new Error(`IndexNow lehnte ab: HTTP ${res.status} ${body.slice(0, 300)}`);
}

async function main() {
	const [mode, base, head] = process.argv.slice(2);
	const today = todayBerlin();
	let urls;
	if (mode === '--today') urls = urlsForToday(today);
	else if (mode === '--changed' && head) urls = urlsForChanged(base ?? '', head, today);
	else throw new Error('Aufruf: --today | --changed <base-sha> <head-sha>');
	await submit(urls);
}

main().catch((err) => {
	console.error(err instanceof Error ? err.message : err);
	process.exit(1);
});
