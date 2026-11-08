import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Optionaler kürzerer <title> für Suchmaschinen (max. ~60 Zeichen). H1 und Schema nutzen weiter `title`.
			seoTitle: z.string().optional(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			heroImageAlt: z.string().optional(),
			category: z.enum(['Grundlagen', 'Versicherungen', 'Einkommenssicherung', 'Vermögensaufbau', 'Altersvorsorge', 'Karriere & Einkommen', 'Private Equity']).optional(),
			tldr: z.string().optional(),
			faq: z.array(z.object({
				question: z.string(),
				answer: z.string(),
			})).optional(),
			sources: z.array(z.object({
				title: z.string(),
				url: z.string().url().optional(),
				publisher: z.string().optional(),
				year: z.number().int().optional(),
			})).optional(),
		}),
});

export const collections = { blog };
