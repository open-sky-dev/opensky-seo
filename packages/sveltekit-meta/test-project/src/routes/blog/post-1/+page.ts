import { pageMetaLoad } from 'sveltekit-meta';

export const load = pageMetaLoad({
	title: 'First Blog Post',
	description: 'This is our first blog post about SvelteKit Meta functionality and features.',
	canonical: 'https://example.com/blog/post-1',
	author: 'John Doe', // Override the blog layout author
	image: {
		url: '/blog-post-1-image.jpg',
		alt: 'First blog post featured image',
		width: 1200,
		height: 630
	},
	type: 'article',
	date: '2024-01-10T08:00:00Z',
	modified: '2024-01-12T10:30:00Z',
	twitterCreator: '@johndoe' // Override the blog layout twitter creator
});