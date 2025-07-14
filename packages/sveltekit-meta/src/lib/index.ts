import { metaLoadPage, metaLoadLayout, metaLoadResetLayout } from './meta-load'
import {
	metaLoadWithDataPage,
	metaLoadWithDataLayout,
	metaLoadWithDataResetLayout
} from './meta-load-with-data'
import { addMetaTagsPage, addMetaTagsLayout, addMetaTagsResetLayout } from './add-meta-tags'

// Convenience objects for better organization
export const metaLoad = {
	page: metaLoadPage,
	layout: metaLoadLayout,
	resetLayout: metaLoadResetLayout
} as const

export const metaLoadWithData = {
	page: metaLoadWithDataPage,
	layout: metaLoadWithDataLayout,
	resetLayout: metaLoadWithDataResetLayout
} as const

export const addMetaTags = {
	page: addMetaTagsPage,
	layout: addMetaTagsLayout,
	resetLayout: addMetaTagsResetLayout
} as const

export { default as MetaTags } from './components/Mount.svelte'

export * from './types/metadata'

export default {
	metaLoad,
	metaLoadWithData,
	addMetaTags
}
