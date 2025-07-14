import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.layout({
	title: 'Blog Posts',
	titleTemplate: { route: '/blog/', template: 'Post: {page}' },
	description: 'Read our latest articles and updates'
});
