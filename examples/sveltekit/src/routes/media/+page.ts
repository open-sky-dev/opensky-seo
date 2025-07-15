import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.page({
	title: 'Media Examples',
	description: 'Demonstrating all media metadata types including images, videos, and multiple images.',
	author: 'Media Team',
	date: '2024-01-16T14:00:00.000Z',
	type: 'largeImage',
	// Single image
	image: {
		url: '/media/hero-image.jpg',
		secureUrl: 'https://example.com/media/hero-image.jpg',
		type: 'image/jpeg',
		width: 1200,
		height: 630,
		alt: 'Hero image for media examples page'
	},
	// Multiple images
	images: [
		{
			url: '/media/gallery-1.jpg',
			secureUrl: 'https://example.com/media/gallery-1.jpg',
			type: 'image/jpeg',
			width: 800,
			height: 600,
			alt: 'Gallery image 1'
		},
		{
			url: '/media/gallery-2.jpg',
			secureUrl: 'https://example.com/media/gallery-2.jpg',
			type: 'image/jpeg',
			width: 800,
			height: 600,
			alt: 'Gallery image 2'
		},
		{
			url: '/media/gallery-3.jpg',
			secureUrl: 'https://example.com/media/gallery-3.jpg',
			type: 'image/jpeg',
			width: 800,
			height: 600,
			alt: 'Gallery image 3'
		}
	],
	// Video
	video: {
		url: '/media/demo-video.mp4',
		secureUrl: 'https://example.com/media/demo-video.mp4',
		type: 'video/mp4',
		width: 1920,
		height: 1080,
		alt: 'Demo video showcasing media features'
	}
}); 