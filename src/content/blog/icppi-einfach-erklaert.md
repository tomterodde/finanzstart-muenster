---
title: 'iCPPI einfach erklärt: Wie fondsgebundene Rentenversicherungen Garantie und Rendite kombinieren'
description: 'Was ist iCPPI? Wie der tägliche Sicherungsmechanismus zwischen Sicherheits- und Chancen-Baustein funktioniert, wo die Grenzen liegen (Cash-Lock-Risiko) und welche Anbieter das Verfahren nutzen.'
pubDate: '2026-08-21'
heroImage: '../../assets/blog-placeholder-4.jpg'
category: 'Altersvorsorge'
tldr: 'iCPPI (Individualised Constant Proportion Portfolio Insurance) ist ein Wertsicherungsverfahren, das fondsgebundene Rentenversicherungen — darunter viele Riester-Fondstarife — nutzen, um eine Beitragsgarantie zum Laufzeitende mit Fondsrenditen zu kombinieren. Grundlage ist die CPPI-Methode (entwickelt von André Perold und Fischer Black in den 1980er-Jahren): Das Guthaben wird laufend zwischen einem Sicherheits-Baustein (Anleihen/Geldmarkt) und einem Chancen-Baustein (Fonds/Aktien) verschoben. Je größer der Puffer ("Cushion") zwischen aktuellem Wert und Garantieniveau ("Floor"), desto mehr darf riskiert werden. Anbieter in Deutschland u. a. DWS, Zurich, Union Investment und WWK. Die zentrale Schwäche ist das Cash-Lock-Risiko: Fällt der Puffer bei einem Crash auf null, bleibt das Kapital bis zur nächsten Erholungsphase in Sicherheits-Anlagen "gefangen" — eine anschließende Markterholung kann dann nicht mehr mitgenommen werden. Die Garantie gilt zudem nur zum vereinbarten Laufzeitende, nicht zwischenzeitlich.'
faq:
  - question: 'Was bedeutet iCPPI?'
    answer: 'iCPPI steht für "Individualised Constant Proportion Portfolio Insurance" — ein individualisiertes Wertsicherungsverfahren mit konstanter Portfolio-Absicherung. Es ist eine Variante der klassischen CPPI-Strategie aus der Finanzmathematik, angepasst auf einzelne Versicherungsverträge: Jeder Vertrag bekommt sein eigenes Guthaben laufend zwischen Sicherheits- und Chancen-Baustein umgeschichtet, statt dass alle Kunden einen gemeinsamen Fondstopf teilen.'
  - question: 'Wie unterscheidet sich iCPPI von einem klassischen Garantiefonds?'
    answer: 'Ein klassischer Garantiefonds sichert das eingesetzte Kapital meist über eine statische Mischung ab (z. B. feste Aktienquote plus Zinspapiere) oder über Optionen des Fondsanbieters. iCPPI arbeitet dynamisch und laufend individuell: Die Aufteilung zwischen sicherem und risikoreichem Anteil wird bei jedem Vertrag einzeln und meist täglich neu berechnet, abhängig davon, wie groß der Sicherheitspuffer gerade ist. Das kann bei guter Marktentwicklung eine höhere Aktienquote und damit mehr Renditechance ermöglichen als ein starres Garantiefonds-Konzept.'
  - question: 'Was ist das Cash-Lock-Risiko bei iCPPI?'
    answer: 'Sinkt der Kurs des risikoreichen Anteils so stark, dass der Sicherheitspuffer (Cushion) auf null fällt, wird das komplette Guthaben in den Sicherheits-Baustein umgeschichtet, um die Garantie zu erhalten. Da eine negative Position (Leerverkauf) im Sicherheits-Baustein nicht erlaubt ist, bleibt das Kapital dort "gefangen", bis über neue laufende Beiträge oder Zinsen wieder ein Puffer aufgebaut ist. Erholt sich der Aktienmarkt in dieser Phase, kann der Vertrag von diesem Kursanstieg nicht mehr profitieren — ein bekanntes Strukturproblem aller CPPI-basierten Verfahren, nicht nur von iCPPI.'
  - question: 'Welche Anbieter nutzen iCPPI in Deutschland?'
    answer: 'Das Verfahren wird von mehreren großen Lebens- und Fondsanbietern eingesetzt, darunter DWS, Zurich, Union Investment und WWK — meist unter eigenen Markennamen für die jeweilige Fondsrenten-Tarifgeneration. Die genaue Ausgestaltung (Rebalancing-Intervall, Multiplikator, Kosten) unterscheidet sich je Anbieter und Tarif und sollte im Angebot konkret verglichen werden.'
  - question: 'Für wen eignet sich eine Rentenversicherung mit iCPPI?'
    answer: 'Für alle, die eine Beitragsgarantie zum Laufzeitende nicht aufgeben wollen, aber trotzdem am Kapitalmarkt teilhaben möchten — typischerweise Riester-Sparer oder sicherheitsorientierte private Vorsorger mit langem Anlagehorizont. Wer die Garantie nicht braucht oder maximale Flexibilität will, fährt mit einem reinen ETF-Sparplan oft kostengünstiger. Welche Kombination im Einzelfall passt, hängt von Risikotragfähigkeit, Förderberechtigung und Anlagehorizont ab — eine pauschale Antwort gibt es nicht.'
sources:
  - title: 'Theory of Constant Proportion Portfolio Insurance'
    publisher: 'Perold, A. & Black, F. — Journal of Economic Dynamics and Control'
    year: 1992
---

Eine Beitragsgarantie und die Renditechancen eines Fonds gleichzeitig haben — das klingt nach einem Widerspruch. Genau das versprechen Rentenversicherungen, die mit **iCPPI** arbeiten. Der Begriff taucht selten in Werbematerial auf, aber oft im Kleingedruckten von Riester- und fondsgebundenen Rentenversicherungen mit Garantie.

Dieser Artikel erklärt, was sich hinter dem Kürzel verbirgt, wie der Mechanismus konkret funktioniert — und wo seine Grenzen liegen.

## Was ist iCPPI?

iCPPI steht für **Individualised Constant Proportion Portfolio Insurance** — zu Deutsch etwa: individualisierte Portfolioabsicherung mit konstanter Umschichtungslogik. Es ist eine Variante der CPPI-Methode, einer Wertsicherungsstrategie aus der Finanzmathematik, die die Ökonomen André Perold und Fischer Black in den 1980er-Jahren entwickelt haben.

Die Grundidee: Statt das Kapital einmalig und starr aufzuteilen, wird laufend — je nach iCPPI-Umsetzung meist täglich — neu berechnet, wie viel vom Vertragsguthaben in risikoreiche Anlagen (Fonds, Aktien) fließen darf, ohne die zugesagte Garantie zu gefährden. Das „i" für „Individualised" bedeutet: Diese Berechnung läuft **pro Einzelvertrag**, nicht für einen gemeinsamen Fondstopf aller Kunden.

## Der Mechanismus: Floor, Cushion und Multiplikator

Drei Größen steuern die tägliche Umschichtung:

| Begriff | Bedeutung |
|---|---|
| **Floor** | Der Mindestwert, den das Vertragsguthaben zum Laufzeitende erreichen muss — abgeleitet aus der zugesagten Beitragsgarantie, auf heute abgezinst |
| **Cushion** (Sicherheitspuffer) | Die Differenz zwischen aktuellem Vertragswert und Floor — dieser Betrag darf riskiert werden, ohne die Garantie zu gefährden |
| **Multiplikator** | Ein Faktor, der festlegt, wie aggressiv der Cushion in risikoreiche Anlagen investiert wird |

Die Formel dahinter: **risikoreicher Anteil = Multiplikator × Cushion.** Steigt der Vertragswert, wächst der Cushion — mehr Kapital darf in Fonds fließen. Fällt der Vertragswert, schrumpft der Cushion — mehr Kapital wandert zurück in den Sicherheits-Baustein (Anleihen, Geldmarkt). Die Strategie ist damit bewusst **prozyklisch**: Sie kauft bei steigenden Kursen zu und verkauft bei fallenden Kursen.

Das unterscheidet iCPPI von einem klassischen Garantiefonds: Dort ist die Aufteilung meist statisch oder wird über Optionen des Fondsanbieters abgesichert, nicht individuell pro Vertrag und Tag neu berechnet.

## Das Cash-Lock-Risiko: die zentrale Schwäche

Genau die Prozyklik erzeugt das bekannteste Problem von CPPI-basierten Verfahren: den **Cash-Lock**.

Fällt der Aktienmarkt so stark, dass der Cushion auf null sinkt, wird das gesamte verbleibende Guthaben in den Sicherheits-Baustein verschoben, um die Garantie zu sichern. Weil eine negative Position im Sicherheits-Baustein (also ein Leerverkauf zur „Vorfinanzierung" künftiger Aktienquote) nicht zulässig ist, bleibt das Kapital dort, bis über neue Beiträge oder Zinserträge wieder ein Puffer entsteht.

Das Tückische: Erholt sich der Aktienmarkt genau in dieser Phase, kann der Vertrag davon **nicht mehr profitieren** — das Geld steckt im Sicherheits-Baustein fest, während die Kurse längst wieder steigen. Wer beispielsweise 2008 oder 2020 in der akuten Crash-Phase in einen Cash-Lock geraten ist, hat die anschließende Erholung an den Aktienmärkten verpasst.

Das ist kein Konstruktionsfehler von iCPPI im Speziellen, sondern ein bekanntes Strukturproblem jeder CPPI-Strategie — die Anbieter versuchen es mit unterschiedlichen Multiplikator-Einstellungen und Rebalancing-Regeln abzumildern, ganz auflösen lässt es sich nicht.

## Wichtig: Die Garantie gilt nur zum Laufzeitende

Ein zweiter Punkt, der oft übersehen wird: Die Beitragsgarantie bei iCPPI-Verträgen greift **zum vereinbarten Laufzeitende**, nicht zwischenzeitlich. Wer während eines Cash-Lock oder generell in einer schwachen Marktphase kündigt, bekommt keine Garantie — sondern den aktuellen, ggf. niedrigeren Rückkaufswert. Das gilt für alle fondsgebundenen Rentenversicherungen mit Wertsicherungsverfahren, nicht nur für iCPPI, ist bei der langfristigen Bindung des Kapitals aber ein zentraler Punkt für die Vertragsentscheidung.

## Welche Anbieter nutzen iCPPI?

Das Verfahren ist in Deutschland bei mehreren großen Lebensversicherern und Fondsgesellschaften im Einsatz, darunter **DWS, Zurich, Union Investment und WWK** — jeweils unter eigenen Tarifnamen. Die konkrete Ausgestaltung (Rebalancing-Häufigkeit, Multiplikator-Bandbreite, Kostenstruktur) unterscheidet sich je Anbieter und Tarifgeneration spürbar und lässt sich nur im konkreten Angebotsvergleich beurteilen — pauschale Aussagen zu „dem" iCPPI-Vertrag gibt es nicht.

## Für wen ist das relevant?

iCPPI-Verfahren stecken meist in **Riester-Fondstarifen** und in privaten fondsgebundenen Rentenversicherungen mit Beitragsgarantie. Bei Riester ist die 100-%-Beitragsgarantie sogar gesetzlich vorgeschrieben — [wie sich Riester insgesamt lohnt](/blog/riester-rente-lohnt-sich/) und für wen, hängt aber von mehr Faktoren ab als nur vom Wertsicherungsverfahren im Hintergrund.

Grundsätzlich gilt: Wer die Garantie zum Laufzeitende nicht aufgeben will, aber trotzdem an Kapitalmarktchancen teilhaben möchte, bekommt mit iCPPI genau diese Kombination — bezahlt dafür aber mit Prozyklik-Risiko (Cash-Lock) und in der Regel höheren Kosten als bei einem ungehedgten [ETF-Sparplan](/blog/etf-sparplan-einsteiger-muenster/). Wie stark Rendite und Sicherheit sich in einem Portfolio überhaupt gegenseitig ausschließen, erklärt der Grundlagenartikel zu [systematischem und unsystematischem Risiko](/blog/systematisches-unsystematisches-risiko/).

Ob ein Vertrag mit iCPPI-Mechanik zur eigenen Situation passt, ist am Ende eine Frage von Risikotragfähigkeit, Förderberechtigung, Kosten und Anlagehorizont — die konkrete Einordnung im Vorsorge-Mix gehört in ein Beratungsgespräch. Einen Überblick über die verschiedenen Bausteine gibt der [Vergleich der Altersvorsorge-Optionen 2026](/blog/beste-altersvorsorge-vergleich-2026/).

## Fazit

iCPPI ist kein Produkt, sondern ein **Rechenverfahren im Hintergrund** vieler Riester- und fondsgebundener Rentenversicherungen: Es verschiebt das Guthaben täglich zwischen Sicherheit und Chance, um eine Garantie zum Laufzeitende mit Fondsrenditen zu verbinden. Das funktioniert gut in normalen und moderat schwankenden Märkten — in scharfen Crashs kann der Cash-Lock-Effekt dazu führen, dass eine anschließende Erholung verpasst wird. Wer einen Vertrag mit diesem Mechanismus hat oder abschließen will, sollte das wissen — und die konkrete Umsetzung beim jeweiligen Anbieter genau vergleichen lassen.

---

*Dieser Artikel dient der allgemeinen Finanzbildung und stellt keine individuelle Anlage- oder Finanzberatung dar. Für eine persönliche Beratung wende dich an einen zugelassenen Finanzberater.*
