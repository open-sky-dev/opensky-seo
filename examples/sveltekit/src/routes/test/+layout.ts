import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.layout({
	title: 'Test Layout',
	titleTemplate: 'Test - {page}'
});
