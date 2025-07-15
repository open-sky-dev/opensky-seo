import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.layout({
	title: 'Blog Posts',
	titleTemplate: { route: '/blog/', template: 'Blog Post: {page}' },
	description: 'Read our latest articles and updates'
});
