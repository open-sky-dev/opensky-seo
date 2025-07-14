import type { Metadata } from './types/metadata'
import type { Load } from '@sveltejs/kit'
import { deriveKeyFromRoute, checkData } from './utils'

/**
 * Creates a page load function that adds metadata with access to load context.
 * Use this when you need to access route parameters, server data, or other context.
 *
 * @param callback - Function that receives load context and returns metadata
 * @returns A SvelteKit load function
 *
 * @example
 * ```typescript
 * // +page.ts
 * export const load = metaLoadWithData.page(({ params, data }) => ({
 *   title: data.post.title,
 *   description: `Post about ${params.slug}`
 * }));
 * ```
 */
export function metaLoadWithDataPage(
	callback: (context: { data: any; route: any; params: any; url: any }) => Metadata
): Load {
	return async ({ data, route, params, url }) => {
		const metaKey = deriveKeyFromRoute({
			routeId: route.id,
			type: 'page'
		})

		const metaTags = callback({ data, route, params, url })
		const cleanedTags = checkData(metaTags)

		return {
			...data,
			[metaKey]: {
				routeId: route.id,
				layerType: 'page',
				params,
				url,
				metadata: cleanedTags
			}
		}
	}
}

/**
 * Creates a layout load function that adds metadata with access to load context.
 * Use this when you need to access route parameters, server data, or other context.
 *
 * @param callback - Function that receives load context and returns metadata
 * @returns A SvelteKit load function
 *
 * @example
 * ```typescript
 * // +layout.ts
 * export const load = metaLoadWithData.layout(({ data }) => ({
 *   title: data.section.title,
 *   description: data.section.description
 * }));
 * ```
 */
export function metaLoadWithDataLayout(
	callback: (context: { data: any; route: any; params: any; url: any }) => Metadata
): Load {
	return async ({ data, route, params, url }) => {
		const metaKey = deriveKeyFromRoute({
			routeId: route.id,
			type: 'layout'
		})

		const metaTags = callback({ data, route, params, url })
		const cleanedTags = checkData(metaTags)

		return {
			...data,
			[metaKey]: {
				routeId: route.id,
				layerType: 'layout',
				params,
				metadata: cleanedTags
			}
		}
	}
}

/**
 * Creates a reset layout load function with access to load context.
 * Use this to start fresh with dynamic metadata that depends on context.
 *
 * @param callback - Function that receives load context and returns metadata
 * @returns A SvelteKit load function
 *
 * @example
 * ```typescript
 * // +layout.ts
 * export const load = metaLoadWithData.resetLayout(({ data }) => ({
 *   title: data.fresh.title,
 *   description: data.fresh.description
 * }));
 * ```
 */
export function metaLoadWithDataResetLayout(
	callback: (context: { data: any; route: any; params: any; url: any }) => Metadata
): Load {
	return async ({ data, route, params, url }) => {
		const metaKey = deriveKeyFromRoute({
			routeId: route.id,
			type: 'layout'
		})

		const metaTags = callback({ data, route, params, url })
		const cleanedTags = checkData(metaTags)

		return {
			...data,
			[metaKey]: {
				routeId: route.id,
				layerType: 'layout',
				params,
				reset: true,
				metadata: cleanedTags
			}
		}
	}
}
