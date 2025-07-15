import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.layout({
	title: 'Blog',
	titleTemplate: { route: '/blog', template: '{page} | Blog | SvelteKit Meta Examples' },
	description: 'Read our latest articles and updates about SvelteKit Meta',
	type: 'article',
	author: ['Blog Team', 'SvelteKit Meta'],
	twitterCreator: '@blogteam',
	image: {
		url: '/blog-og-image.jpg',
		secureUrl: 'https://example.com/blog-og-image.jpg',
		type: 'image/jpeg',
		width: 1200,
		height: 630,
		alt: 'SvelteKit Meta Blog - Latest articles and updates'
	}
});
