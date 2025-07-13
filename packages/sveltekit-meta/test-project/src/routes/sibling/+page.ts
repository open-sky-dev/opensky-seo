import { pageMetaLoad } from 'sveltekit-meta';

export const load = pageMetaLoad({
	title: 'Sibling Page',
	description: 'This page is at the same level as the blog layout, testing sibling page behavior.',
	canonical: 'https://example.com/sibling',
	author: 'Sibling Author'
});