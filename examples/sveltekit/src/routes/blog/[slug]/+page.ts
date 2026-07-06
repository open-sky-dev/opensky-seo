import type { PageLoad } from './$types';
import { metaLoadWithData, ogParams } from '@opensky/seo';

export const load: PageLoad = metaLoadWithData.page(({ params }) => {
	// Ensure slug exists
	const slug = params.slug || 'unknown';

	// Simulate fetching post data based on slug
	const post = {
		title: `Post: ${slug}`,
		description: `This is a dynamic blog post about ${slug}. Generated using metaLoadWithData with route parameters.`,
		author: slug.includes('guide') ? 'Guide Author' : 'Dynamic Author'
	};

	return {
		title: post.title,
		description: post.description,
		author: post.author,
		date: '2024-01-14T09:00:00.000Z',
		modified: '2024-01-14T16:45:00.000Z',
		type: 'article' as const,
		twitterCreator: slug.includes('guide') ? '@guideauthor' : '@dynamicauthor',
		// Hydrate the card defined by blog/+layout.ts - route and theme are
		// inherited, heading is overridden, author is added
		image: ogParams(
			{ heading: post.title, author: post.author },
			{ alt: `Card for ${post.title}` }
		)
	};
});
