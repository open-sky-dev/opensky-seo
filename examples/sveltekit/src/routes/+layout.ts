import { addMetaTags } from 'sveltekit-meta';

export async function load() {
	return {
		...addMetaTags.layout({
			title: 'Test from root route',
			titleTemplate: { route: '/', template: 'Root Template: {page}' }
		}),
		rootLayout: 'test from root'
	};
}
