import type { PageLoad } from './$types';
import { metaLoadWithData } from 'sveltekit-meta';

export const load: PageLoad = metaLoadWithData.page(({ params }) => ({
	title: params.slug
}));
