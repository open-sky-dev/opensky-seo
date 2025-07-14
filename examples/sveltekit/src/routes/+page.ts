import { addMetaTags } from 'sveltekit-meta';

export async function load() {
	return {
		...addMetaTags.page({
			title: 'Test from root route'
		})
	};
}
