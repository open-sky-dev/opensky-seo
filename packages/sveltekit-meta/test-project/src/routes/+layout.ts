import { baseMetaLoad } from 'sveltekit-meta';

export const load = baseMetaLoad({
	sitename: 'SvelteKit Meta Test Site',
	titleTemplate: '{page} | SvelteKit Meta Test',
	description: 'Testing SvelteKit Meta package functionality',
	author: 'SvelteKit Meta Team',
	canonical: 'https://example.com',
	theme: {
		light: '#ffffff',
		dark: '#000000'
	},
	twitterSite: '@sveltekit',
	icon: '/favicon.png'
});