import { advancedMetaLoad, parseMeta } from 'sveltekit-meta';

export const load = advancedMetaLoad(async ({ event, parentTags }) => {
	// Simulate fetching dynamic data (in real app, this might be from an API)
	const dynamicData = {
		title: 'Advanced Dynamic Post',
		slug: 'advanced-dynamic-post',
		tags: ['sveltekit', 'metadata', 'advanced'],
		viewCount: 1337,
		publishedAt: '2024-01-15T12:00:00Z'
	};

	// Create dynamic metadata based on the fetched data
	const metaResult = parseMeta(parentTags, {
		title: dynamicData.title,
		description: `An advanced example post about ${dynamicData.tags.join(', ')}. Views: ${dynamicData.viewCount}`,
		canonical: `https://example.com/blog/${dynamicData.slug}`,
		author: 'Advanced User',
		image: {
			url: '/advanced-post-image.jpg',
			alt: `${dynamicData.title} featured image`,
			width: 1200,
			height: 630
		},
		type: 'article',
		date: dynamicData.publishedAt,
		twitterCreator: '@advanceduser',
		// Demonstrate additional tags feature
		additionalTags: [
			{
				tagType: 'meta',
				name: 'keywords',
				content: dynamicData.tags.join(', ')
			},
			{
				tagType: 'meta',
				property: 'article:tag',
				content: dynamicData.tags[0]
			},
			{
				tagType: 'link',
				rel: 'alternate',
				type: 'application/rss+xml',
				href: '/blog/rss.xml'
			}
		]
	});

	return {
		...metaResult,
		dynamicData // Pass the dynamic data to the component
	};
});