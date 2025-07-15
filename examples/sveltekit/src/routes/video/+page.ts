import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.page({
	title: 'Video Player Example',
	description: 'This page demonstrates video content type with player metadata for social sharing.',
	author: 'Video Team',
	date: '2024-01-17T11:00:00.000Z',
	type: 'player',
	video: {
		url: '/video/demo-video.mp4',
		secureUrl: 'https://example.com/video/demo-video.mp4',
		type: 'video/mp4',
		width: 1920,
		height: 1080,
		alt: 'Demo video showcasing video player features'
	},
	image: {
		url: '/video/video-thumbnail.jpg',
		secureUrl: 'https://example.com/video/video-thumbnail.jpg',
		type: 'image/jpeg',
		width: 1280,
		height: 720,
		alt: 'Video thumbnail for demo video'
	},
	twitterSite: '@videosite',
	twitterCreator: '@videocreator'
}); 