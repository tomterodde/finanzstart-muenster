// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://finanzstart-muenster.de',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) =>
				!/\/(datenschutz|impressum|newsletter-bestaetigt)\/?$/.test(page),
		}),
	],
});
