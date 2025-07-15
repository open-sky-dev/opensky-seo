import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.page({
	title: 'Home',
	description: 'Welcome to the SvelteKit Meta examples. Explore nested layouts, metadata types, and title templates.',
	type: 'basic'
});
