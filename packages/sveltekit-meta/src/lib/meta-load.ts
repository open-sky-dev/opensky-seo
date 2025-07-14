import type { Metadata } from './types/metadata'
import type { Load } from '@sveltejs/kit'
import { deriveKeyFromRoute, checkData } from './utils'

/**
 * Creates a page load function that adds metadata to the load data.
 * Use this for static metadata that doesn't depend on route parameters or server data.
 *
 * @param metaTags - The metadata to add for this page
 * @returns A SvelteKit load function
 *
 * @example
 * ```typescript
 * // +page.ts
 * export const load = metaLoad.page({
 *   title: 'My Post',
 *   description: 'This is a great post'
 * });
 * ```
 */
export function metaLoadPage(metaTags: Metadata): Load {
	return async ({ data, route, params, url }) => {
		const metaKey = deriveKeyFromRoute({
			routeId: route.id,
			type: 'page'
		})

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
 * Creates a layout load function that adds metadata to the load data.
 * Use this for static metadata that doesn't depend on route parameters or server data.
 *
 * @param metaTags - The metadata to add for this layout
 * @returns A SvelteKit load function
 *
 * @example
 * ```typescript
 * // +layout.ts
 * export const load = metaLoad.layout({
 *   title: 'Blog',
 *   description: 'Read our latest articles'
 * });
 * ```
 */
export function metaLoadLayout(metaTags: Metadata): Load {
	return async ({ data, route, params }) => {
		console.log('AA', route.id)
		const metaKey = deriveKeyFromRoute({
			routeId: route.id,
			type: 'layout'
		})

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
 * Creates a reset layout load function that clears the metadata cascade.
 * Use this to start fresh with new metadata, ignoring any inherited metadata.
 *
 * @param metaTags - The metadata to add for this layout
 * @returns A SvelteKit load function
 *
 * @example
 * ```typescript
 * // +layout.ts
 * export const load = metaLoad.resetLayout({
 *   title: 'Fresh Start',
 *   description: 'New section with clean metadata'
 * });
 * ```
 */
export function metaLoadResetLayout(metaTags: Metadata): Load {
	return async ({ data, route, params }) => {
		const metaKey = deriveKeyFromRoute({
			routeId: route.id,
			type: 'layout'
		})

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
