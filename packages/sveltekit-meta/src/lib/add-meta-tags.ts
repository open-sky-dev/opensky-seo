import type { Metadata } from './types/metadata'
import { deriveKeyFromRoute, checkData } from './utils'

/**
 * Helper function to add page metadata to an existing load function return value.
 * Use this when you want full control over your load function but still want to add metadata.
 *
 * @param context - The route context (route, params, url)
 * @param metaTags - The metadata to add
 * @returns An object to spread into your load function return
 *
 * @example
 * ```typescript
 * // +page.ts
 * export async function load({ data, route, params, url }) {
 *   const post = await fetchPost(params.slug);
 *
 *   return {
 *     ...data,
 *     post,
 *     ...addMetaTags.page({ route, params, url }, { title: post.title })
 *   };
 * }
 * ```
 */
export function addMetaTagsPage(
	context: { route: any; params: any; url: any },
	metaTags: Metadata
) {
	const { route, params, url } = context
	const metaKey = deriveKeyFromRoute({
		routeId: route.id,
		type: 'page'
	})

	const cleanedTags = checkData(metaTags)

	return {
		[metaKey]: {
			routeId: route.id,
			layerType: 'page',
			params,
			url,
			metadata: cleanedTags
		}
	}
}

/**
 * Helper function to add layout metadata to an existing load function return value.
 * Use this when you want full control over your load function but still want to add metadata.
 *
 * @param context - The route context (route, params)
 * @param metaTags - The metadata to add
 * @returns An object to spread into your load function return
 *
 * @example
 * ```typescript
 * // +layout.ts
 * export async function load({ data, route, params }) {
 *   const section = await fetchSection();
 *
 *   return {
 *     ...data,
 *     section,
 *     ...addMetaTags.layout({ route, params }, { title: section.title })
 *   };
 * }
 * ```
 */
export function addMetaTagsLayout(context: { route: any; params: any }, metaTags: Metadata) {
	const { route, params } = context
	const metaKey = deriveKeyFromRoute({
		routeId: route.id,
		type: 'layout'
	})

	const cleanedTags = checkData(metaTags)

	return {
		[metaKey]: {
			routeId: route.id,
			layerType: 'layout',
			params,
			metadata: cleanedTags
		}
	}
}

/**
 * Helper function to add reset metadata to an existing load function return value.
 * Use this to start fresh with new metadata in a custom load function.
 *
 * @param context - The route context (route, params)
 * @param metaTags - The metadata to add
 * @returns An object to spread into your load function return
 *
 * @example
 * ```typescript
 * // +layout.ts
 * export async function load({ data, route, params }) {
 *   const section = await fetchSection();
 *
 *   return {
 *     ...data,
 *     section,
 *     ...addMetaTags.resetLayout({ route, params }, { title: section.title })
 *   };
 * }
 * ```
 */
export function addMetaTagsResetLayout(context: { route: any; params: any }, metaTags: Metadata) {
	const { route, params } = context
	const metaKey = deriveKeyFromRoute({
		routeId: route.id,
		type: 'layout'
	})

	const cleanedTags = checkData(metaTags)

	return {
		[metaKey]: {
			routeId: route.id,
			layerType: 'layout',
			params,
			reset: true,
			metadata: cleanedTags
		}
	}
}
