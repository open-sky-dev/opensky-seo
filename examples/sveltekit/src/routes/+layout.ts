import { addMetaTags } from 'sveltekit-meta';

export async function load() {
	return {
		...addMetaTags.layout({
			title: 'SvelteKit Meta Examples',
			titleTemplate: { route: '/', template: '{page} | SvelteKit Meta Examples' },
			description: 'Comprehensive examples demonstrating all features of sveltekit-meta including nested layouts, metadata types, and title templates.',
			sitename: 'SvelteKit Meta Examples',
			author: ['Jake', 'SvelteKit Meta Team'],
			twitterSite: '@sveltekitmeta',
			twitterCreator: '@jake',
			date: '2024-01-01T00:00:00.000Z',
			modified: '2024-01-15T12:00:00.000Z',
			type: 'basic',
			theme: {
				light: '#ffffff',
				dark: '#1a1a1a'
			},
			colorScheme: 'light dark',
			icon: {
				svg: '/favicon.svg',
				small: {
					url: '/favicon-16x16.png',
					size: 16,
					type: 'image/png'
				},
				large: {
					url: '/favicon-32x32.png',
					size: 32,
					type: 'image/png'
				}
			},
			maskIcon: {
				url: '/safari-pinned-tab.svg',
				color: '#000000'
			},
			image: {
				url: '/og-image.jpg',
				secureUrl: 'https://example.com/og-image.jpg',
				type: 'image/jpeg',
				width: 1200,
				height: 630,
				alt: 'SvelteKit Meta Examples - Comprehensive metadata management'
			}
		}),
		rootLayout: 'Root layout data'
	};
}
