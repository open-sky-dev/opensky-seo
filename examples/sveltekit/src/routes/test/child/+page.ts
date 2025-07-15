import { addMetaTags } from 'sveltekit-meta';

export async function load() {
	return {
		...addMetaTags.page({
			title: 'Child Page',
			description: 'This is a child page under the test layout demonstrating title template inheritance.',
			author: 'Child Author',
			type: 'basic'
		}),
		childPageData: 'Data from child page'
	};
}
