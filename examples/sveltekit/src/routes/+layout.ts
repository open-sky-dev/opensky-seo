import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.layout({
	sitename: 'My SvelteKit App',
	title: 'SvelteKit Example',
	titleTemplate: 'My SvelteKit App - {page}',
	description: 'A fantastic SvelteKit application',
	icon: './favicon.png'
});
