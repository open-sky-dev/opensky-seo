import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.layout({
	title: 'Blog Posts',
	titleTemplate: 'Post - {page}',
	description: 'Read our latest articles and updates'
});
