import { addMetaTags } from 'sveltekit-meta';

export async function load() {
	return {
		...addMetaTags.layout({
			title: 'Test Section',
			titleTemplate: { route: '/test', template: '{page} - Test Section' },
			description: 'This is a test section demonstrating nested layouts with different title templates.',
			type: 'basic',
			author: 'Test Team'
		}),
		testLayoutData: 'Data from test layout'
	};
}
