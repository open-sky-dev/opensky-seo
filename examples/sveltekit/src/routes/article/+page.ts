import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.page({
	title: 'Comprehensive Article Example',
	description: 'This article demonstrates all metadata features including article content type, authors, dates, and rich media.',
	author: ['Jane Doe', 'John Smith', 'Editorial Team'],
	twitterSite: '@exampleblog',
	twitterCreator: '@janedoe',
	date: '2024-01-15T09:00:00.000Z',
	modified: '2024-01-16T16:30:00.000Z',
	type: {
		twitter: 'largeImage',
		og: 'article'
	},
	image: {
		url: '/article/featured-image.jpg',
		secureUrl: 'https://example.com/article/featured-image.jpg',
		type: 'image/jpeg',
		width: 1200,
		height: 630,
		alt: 'Featured image for comprehensive article example'
	},
	images: [
		{
			url: '/article/inline-1.jpg',
			secureUrl: 'https://example.com/article/inline-1.jpg',
			type: 'image/jpeg',
			width: 800,
			height: 400,
			alt: 'Inline article image 1'
		},
		{
			url: '/article/inline-2.jpg',
			secureUrl: 'https://example.com/article/inline-2.jpg',
			type: 'image/jpeg',
			width: 800,
			height: 400,
			alt: 'Inline article image 2'
		}
	],
	video: {
		url: '/article/embedded-video.mp4',
		secureUrl: 'https://example.com/article/embedded-video.mp4',
		type: 'video/mp4',
		width: 1280,
		height: 720,
		alt: 'Embedded video in article'
	}
}); 