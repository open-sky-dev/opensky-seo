import { pageMetaLoad } from 'sveltekit-meta';

export const load = pageMetaLoad({
	title: 'About Us',
	description: 'Learn about the SvelteKit Meta package and how it works',
	canonical: 'https://example.com/about',
	author: ['John Doe', 'Jane Smith'], // Override with multiple authors
	image: {
		url: '/about-image.jpg',
		alt: 'About us hero image',
		width: 1200,
		height: 630
	},
	type: 'article',
	date: '2024-01-15T10:00:00Z'
});