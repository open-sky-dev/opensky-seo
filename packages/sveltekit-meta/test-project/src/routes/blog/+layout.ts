import { layoutMetaLoad } from 'sveltekit-meta';

export const load = layoutMetaLoad({
	titleTemplate: '{page} | Blog | SvelteKit Meta Test', // Override title template
	description: 'Our blog section with articles about SvelteKit Meta',
	canonical: 'https://example.com/blog',
	author: 'Blog Team',
	twitterCreator: '@blogteam',
	type: 'website'
});