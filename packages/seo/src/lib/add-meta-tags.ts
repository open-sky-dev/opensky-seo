import type { LayoutMetadata, PageMetadata } from './types/metadata'
import { checkData, generateResetData, transformMetadataKeys, TEMPLATE_RESET_KEY } from './utils'

/**
 * Helper function to add page metadata to an existing load function return value.
 * Use this when you want full control over your load function but still want to add metadata.
 *
 * @param metaTags - The metadata to add
 * @returns An object to spread into your load function return
 *
 * @example
 * ```typescript
 * // +page.ts
 * export async function load({ data, params }) {
 *   const post = await fetchPost(params.slug);
 *
 *   return {
 *     ...data,
 *     post,
 *     ...addMetaTags.page({ title: post.title })
 *   };
 * }
 * ```
 */
export function addMetaTagsPage(metaTags: PageMetadata) {
	const cleanedTags = checkData(metaTags)
	return transformMetadataKeys(cleanedTags)
}

/**
 * Helper function to add layout metadata to an existing load function return value.
 * Use this when you want full control over your load function but still want to add metadata.
 *
 * @param metaTags - The metadata to add
 * @param routeId - The layout's route id (from the load event); scopes a titleTemplate
 *   that doesn't specify its own route
 * @returns An object to spread into your load function return
 *
 * @example
 * ```typescript
 * // +layout.ts
 * export async function load({ data, route }) {
 *   const section = await fetchSection();
 *
 *   return {
 *     ...data,
 *     section,
 *     ...addMetaTags.layout({ title: section.title, titleTemplate: '{page} | Docs' }, route.id)
 *   };
 * }
 * ```
 */
export function addMetaTagsLayout(metaTags: LayoutMetadata, routeId?: string | null) {
	const cleanedTags = checkData(metaTags)
	return transformMetadataKeys(cleanedTags, routeId ?? undefined)
}

/**
 * Helper function to add reset metadata to an existing load function return value.
 * Use this to start fresh with new metadata in a custom load function. Clears all
 * inherited metadata; when routeId is provided, inherited title templates declared
 * outside this route are cleared too.
 *
 * @param metaTags - The metadata to add
 * @param routeId - The layout's route id (from the load event); sets the template
 *   reset boundary and scopes a titleTemplate that doesn't specify its own route
 * @returns An object to spread into your load function return
 *
 * @example
 * ```typescript
 * // +layout.ts
 * export async function load({ data, route }) {
 *   const section = await fetchSection();
 *
 *   return {
 *     ...data,
 *     section,
 *     ...addMetaTags.resetLayout({ title: section.title }, route.id)
 *   };
 * }
 * ```
 */
export function addMetaTagsResetLayout(metaTags: LayoutMetadata, routeId?: string | null) {
	const resetTags = generateResetData()

	const cleanedTags = checkData(metaTags)
	const setMetaTags = transformMetadataKeys(cleanedTags, routeId ?? undefined)

	return {
		...resetTags,
		...(routeId ? { [TEMPLATE_RESET_KEY]: routeId } : {}),
		...setMetaTags
	}
}
