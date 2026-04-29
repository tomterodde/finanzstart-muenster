import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

const STOPWORDS = new Set([
	'der', 'die', 'das', 'und', 'oder', 'aber', 'doch', 'mit', 'ohne', 'fuer', 'für',
	'von', 'vom', 'zum', 'zur', 'zu', 'bei', 'auf', 'als', 'wie', 'was', 'wer', 'wo',
	'wann', 'warum', 'ist', 'sind', 'war', 'waren', 'sein', 'haben', 'hat', 'hatte',
	'wird', 'werden', 'wurde', 'wurden', 'kann', 'koennen', 'können', 'soll', 'sollen',
	'muss', 'müssen', 'darf', 'duerfen', 'dürfen', 'mag', 'moegen', 'mögen',
	'ein', 'eine', 'einen', 'einer', 'eines', 'einem', 'kein', 'keine', 'keinen',
	'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'mich', 'dich', 'sich', 'uns', 'euch',
	'mein', 'dein', 'sein', 'unser', 'euer',
	'an', 'in', 'aus', 'nach', 'vor', 'ueber', 'über', 'unter', 'durch', 'gegen',
	'im', 'am', 'um', 'so', 'auch', 'nur', 'noch', 'schon', 'bereits',
	'bis', 'ab', 'seit', 'wegen', 'trotz', 'statt', 'waehrend', 'während',
	'guide', 'erklaert', 'erklärt', 'einfach', 'tipps', 'hilfe', 'lohnt',
	'sich', 'macht', 'machen', 'gibt', 'geht', 'beim', 'dem', 'den', 'des',
]);

function tokenize(text: string): Set<string> {
	const normalized = text
		.toLowerCase()
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
		.replace(/[^a-z0-9\s-]/g, ' ');

	const tokens = normalized
		.split(/[\s-]+/)
		.filter((t) => t.length >= 4 && !STOPWORDS.has(t));

	return new Set(tokens);
}

export function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], limit = 3): BlogPost[] {
	const now = new Date();
	const currentTokens = tokenize(`${currentPost.data.title} ${currentPost.id}`);
	const currentCategory = currentPost.data.category;

	const scored = allPosts
		.filter((post) => post.id !== currentPost.id)
		.filter((post) => post.data.pubDate <= now)
		.map((post) => {
			const tokens = tokenize(`${post.data.title} ${post.id}`);
			let overlap = 0;
			for (const token of tokens) {
				if (currentTokens.has(token)) overlap += 1;
			}
			const categoryBoost = currentCategory && post.data.category === currentCategory ? 3 : 0;
			return { post, score: overlap + categoryBoost };
		})
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
		});

	return scored.slice(0, limit).map((entry) => entry.post);
}
