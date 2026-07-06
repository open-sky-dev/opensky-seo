import type { LayoutMetadata, PageMetadata } from './types/metadata'
import type { Load, LoadEvent } from '@sveltejs/kit'
import { addMetaTagsPage, addMetaTagsLayout, addMetaTagsResetLayout } from './add-meta-tags'

// Load data can't be typed precisely without the route-specific generated `./$types`,
// so default to a permissive record and let callers narrow it via the generic.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoadData = Record<string, any>

type LoadContext<Data> = {
	data: Data
	route: LoadEvent['route']
	params: LoadEvent['params']
	url: LoadEvent['url']
}

/**
 * Creates a page load function that adds metadata with access to load context.
 * Use this when you need to access route parameters, server data, or other context.
 * The callback may be async.
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
export function metaLoadWithDataPage<Data = LoadData>(
	callback: (context: LoadContext<Data>) => PageMetadata | Promise<PageMetadata>
): Load {
	return async ({ data, route, params, url }) => {
		const metaTags = await callback({ data: data as Data, route, params, url })

		return {
			...data,
			...addMetaTagsPage(metaTags)
		}
	}
}

/**
 * Creates a layout load function that adds metadata with access to load context.
 * Use this when you need to access route parameters, server data, or other context.
 * The callback may be async.
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
export function metaLoadWithDataLayout<Data = LoadData>(
	callback: (context: LoadContext<Data>) => LayoutMetadata | Promise<LayoutMetadata>
): Load {
	return async ({ data, route, params, url }) => {
		const metaTags = await callback({ data: data as Data, route, params, url })

		return {
			...data,
			...addMetaTagsLayout(metaTags, route.id)
		}
	}
}

/**
 * Creates a reset layout load function with access to load context.
 * Use this to start fresh with dynamic metadata that depends on context.
 * The callback may be async.
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
export function metaLoadWithDataResetLayout<Data = LoadData>(
	callback: (context: LoadContext<Data>) => LayoutMetadata | Promise<LayoutMetadata>
): Load {
	return async ({ data, route, params, url }) => {
		const metaTags = await callback({ data: data as Data, route, params, url })

		return {
			...data,
			...addMetaTagsResetLayout(metaTags, route.id)
		}
	}
}
