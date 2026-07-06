import { metaLoad, og } from '@opensky/seo';

export const load = metaLoad.layout({
	title: 'Blog',
	titleTemplate: '{page} | Blog | SvelteKit Meta Examples',
	description: 'Read our latest articles and updates about SvelteKit Meta',
	type: 'article',
	author: ['Blog Team', 'SvelteKit Meta'],
	twitterCreator: '@blogteam',
	// Generated share image: the /og endpoint renders a card from these params.
	// Pages below contribute their own params with ogParams() - see blog/[slug].
	image: og(
		'/og',
		{ heading: 'Blog', theme: 'dark' },
		{ type: 'image/svg+xml', alt: 'SvelteKit Meta Blog card' }
	)
});
