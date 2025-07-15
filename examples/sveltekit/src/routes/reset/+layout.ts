import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.resetLayout({
	title: 'Reset Layout',
	titleTemplate: { route: '/reset', template: 'Reset: {page}' },
	description: 'This layout demonstrates resetLayout functionality that clears inherited metadata.',
	type: 'basic',
	author: 'Reset Author',
	theme: '#ff0000',
	colorScheme: 'light'
}); 