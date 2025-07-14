import { metaLoad } from 'sveltekit-meta';

export const load = metaLoad.page({
	title: 'Test Page'
});

// export async function load() {
// return {
// 	page: 'page data'
// };
// }
