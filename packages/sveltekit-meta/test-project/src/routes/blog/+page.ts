import { pageMetaLoad } from 'sveltekit-meta';

export const load = pageMetaLoad({
	title: 'Blog Home',
	description: 'Welcome to our blog! Here you can find articles about SvelteKit Meta.',
	canonical: 'https://example.com/blog/',
	image: '/blog-home-image.jpg'
});