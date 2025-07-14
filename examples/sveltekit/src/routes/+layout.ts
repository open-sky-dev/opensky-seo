import { metaLoad, addMetaTags } from 'sveltekit-meta';

// export const load = metaLoad.layout({
// sitename: 'My SvelteKit App',
// title: 'SvelteKit Example',
// titleTemplate: 'My SvelteKit App - {page}',
// description: 'A fantastic SvelteKit application',
// icon: './favicon.png'
// });

console.log('Layout load function:', load);

export async function load({ route, params }) {
	const test = addMetaTags.layout({ route, params }, { title: 'Test from root route' });
	console.log('Test R', route.id);
	console.log('Test', test);

	return {
		...addMetaTags.layout({ route, params }, { title: 'Test from root route' }),
		rootLayout: 'test from root'
	};
}
