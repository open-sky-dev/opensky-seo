import type { PageLoad } from './$types';
import { metaLoadWithData } from 'sveltekit-meta';

export const load: PageLoad = metaLoadWithData.page(({ params }) => {
	// Ensure slug exists
	const slug = params.slug || 'unknown';
	
	// Simulate fetching post data based on slug
	const postData = {
		title: `Post: ${slug}`,
		description: `This is a dynamic blog post about ${slug}. Generated using metaLoadWithData with route parameters.`,
		author: slug.includes('guide') ? 'Guide Author' : 'Dynamic Author',
		date: '2024-01-14T09:00:00.000Z',
		modified: '2024-01-14T16:45:00.000Z',
		type: 'article' as const,
		image: {
			url: `/posts/${slug}-image.jpg`,
			secureUrl: `https://example.com/posts/${slug}-image.jpg`,
			type: 'image/jpeg',
			width: 800,
			height: 400,
			alt: `Featured image for ${slug} post`
		},
		twitterCreator: slug.includes('guide') ? '@guideauthor' : '@dynamicauthor'
	};

	return postData;
});
