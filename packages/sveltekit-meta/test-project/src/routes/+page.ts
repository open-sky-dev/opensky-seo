import { pageMetaLoad } from 'sveltekit-meta';

export const load = pageMetaLoad({
	title: 'Home',
	description: 'Welcome to the SvelteKit Meta test project home page',
	canonical: 'https://example.com/',
	image: '/home-image.jpg'
});