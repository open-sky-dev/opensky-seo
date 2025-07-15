import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.page({
	title: 'Static Blog Post',
	description: 'This is a static blog post demonstrating metadata inheritance from the blog layout.',
	author: 'Static Author',
	date: '2024-01-12T10:00:00.000Z',
	modified: '2024-01-12T15:30:00.000Z',
	type: 'article',
	image: {
		url: '/static-post-image.jpg',
		secureUrl: 'https://example.com/static-post-image.jpg',
		type: 'image/jpeg',
		width: 800,
		height: 400,
		alt: 'Static blog post featured image'
	}
});
