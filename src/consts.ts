// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Finanzstart Münster';
export const SITE_DESCRIPTION = 'Finanzwissen für Berufseinsteiger und Studenten in Münster. Rente, Versicherungen, Investments – erklärt ohne Bullshit.';
export const SITE_URL = 'https://finanzstart-muenster.de';

// Schema.org-Bausteine: eine Organisation und eine Person mit festen @id,
// damit Artikel, Rechner und Startseite auf dieselben Entitäten verweisen.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/about/#person`;

export const PERSON_SCHEMA = {
	'@type': 'Person',
	'@id': PERSON_ID,
	name: 'Tom Terodde',
	url: `${SITE_URL}/about/`,
	jobTitle: 'Finanzberater',
	worksFor: { '@id': ORGANIZATION_ID },
	knowsAbout: [
		'Altersvorsorge',
		'Berufsunfähigkeitsversicherung',
		'Vermögensaufbau',
		'ETF-Investments',
		'Einkommenssicherung',
		'Finanzplanung für Berufseinsteiger',
	],
};

export const ORGANIZATION_SCHEMA = {
	'@type': 'Organization',
	'@id': ORGANIZATION_ID,
	name: SITE_TITLE,
	url: `${SITE_URL}/`,
	logo: {
		'@type': 'ImageObject',
		url: `${SITE_URL}/favicon.svg`,
	},
	description: SITE_DESCRIPTION,
	email: 'info@finanzstart-muenster.de',
	contactPoint: {
		'@type': 'ContactPoint',
		contactType: 'customer support',
		email: 'info@finanzstart-muenster.de',
		availableLanguage: 'de',
	},
	founder: { '@id': PERSON_ID },
	areaServed: { '@type': 'City', name: 'Münster' },
	knowsAbout: ['Altersvorsorge', 'Vermögensaufbau', 'Einkommenssicherung', 'Versicherungen', 'Private Equity'],
	inLanguage: 'de-DE',
};
