import type { BaseMetadata, LayoutMetadata, PageMetadata } from './types/metadata'
import { metadataSchema } from './types/metadata'
import { z } from 'zod'

/** Prefixed on all metadata keys added to load data */
export const PREFIX = '_meta'

/**
 * Title templates are keyed by their route verbatim (e.g. '_meta-titleTemplate:/blog/[slug]').
 * Keying by route lets multiple templates coexist in SvelteKit's shallow data merge,
 * and keeping the route verbatim makes the key -> route round trip lossless.
 */
export const TEMPLATE_KEY_PREFIX = `${PREFIX}-titleTemplate:`

/**
 * Written by the resetLayout helpers. Templates declared at routes outside
 * this boundary are ignored when resolving the active template.
 */
export const TEMPLATE_RESET_KEY = `${PREFIX}-titleTemplateResetAt`

/**
 * Generates a reset object with null values for all possible metadata keys.
 * This ensures all metadata from parent layouts is cleared.
 * Uses the Zod schema to automatically generate keys.
 */
export function generateResetData(): Record<string, null> {
	const resetData: Record<string, null> = {}

	// Get all keys from the Zod schema
	const schemaKeys = Object.keys(metadataSchema.shape)

	for (const key of schemaKeys) {
		resetData[`${PREFIX}-${key}`] = null
	}

	return resetData
}

/**
 * Transforms metadata object keys to prefixed format for SvelteKit data cascade.
 * Converts top-level keys like 'title', 'description' to '_meta-title', '_meta-description'.
 * Handles titleTemplate specially by creating a route-keyed entry.
 *
 * @param data - The metadata object to transform
 * @param routeId - The declaring route's id (from the load event); used to scope
 *   titleTemplate when no explicit route is given
 * @returns Object with prefixed keys for SvelteKit data cascade
 *
 * @example
 * ```typescript
 * const result = transformMetadataKeys(
 *   {
 *     title: 'My Page',
 *     titleTemplate: { route: '/blog', template: 'Blog: {page}' }
 *   }
 * );
 * // Returns: {
 * //   '_meta-title': 'My Page',
 * //   '_meta-titleTemplate:/blog': 'Blog: {page}'
 * // }
 * ```
 */
export function transformMetadataKeys(
	data: LayoutMetadata | BaseMetadata | PageMetadata,
	routeId?: string
): Record<string, unknown> {
	const result: Record<string, unknown> = {}

	for (const [key, value] of Object.entries(data)) {
		// Skip if value is nullish
		if (value === undefined || value === null) continue

		// Handle titleTemplate to key it by route
		if (key === 'titleTemplate') {
			const normalized = normalizeTitleTemplate(value, routeId)
			if (normalized) {
				result[`${TEMPLATE_KEY_PREFIX}${normalized.route}`] = normalized.template
			}
			continue
		}

		// For all other top-level keys, prefix and set value
		result[`${PREFIX}-${key}`] = value
	}

	return result
}

/**
 * Normalizes the accepted titleTemplate forms into { route, template }.
 * A plain string template (or an object without a route) is scoped to the
 * declaring route when one is available.
 */
function normalizeTitleTemplate(
	value: unknown,
	declaringRoute?: string
): { route: string; template: string } | null {
	let route: string | undefined = declaringRoute
	let template: string | undefined

	if (typeof value === 'string') {
		template = value
	} else if (typeof value === 'object' && value !== null) {
		const obj = value as { route?: unknown; template?: unknown }
		if (typeof obj.template === 'string') template = obj.template
		if (typeof obj.route === 'string') route = obj.route
	}

	if (template === undefined) {
		console.warn(
			'titleTemplate must be a template string or a { route?, template } object - skipping'
		)
		return null
	}

	if (route === undefined) {
		console.warn(
			'titleTemplate needs a route. Pass { route, template } or use the metaLoad/metaLoadWithData helpers, which infer the route automatically - skipping'
		)
		return null
	}

	return { route: normalizeRoute(route), template }
}

/** Ensures a leading slash and no trailing slash ('/blog/' -> '/blog', '/' -> '/') */
export function normalizeRoute(route: string): string {
	return '/' + route.split('/').filter(Boolean).join('/')
}

/** Removes group segments like '(marketing)', which don't appear in URLs */
export function stripRouteGroups(route: string): string {
	const segments = route.split('/').filter((s) => s && !(s.startsWith('(') && s.endsWith(')')))
	return '/' + segments.join('/')
}

const routeDepth = (route: string): number => (route === '/' ? 0 : route.split('/').length - 1)

const isAtOrBelow = (route: string, ancestor: string): boolean =>
	ancestor === '/' || route === ancestor || route.startsWith(ancestor + '/')

/**
 * A template applies to routes strictly below its declared route - a section's
 * template shouldn't format the section's own landing page; the parent template
 * handles that. The root template is the fallback and applies everywhere.
 */
const templateAppliesTo = (templateRoute: string, currentRoute: string): boolean =>
	templateRoute === '/' ? true : currentRoute.startsWith(templateRoute + '/')

/**
 * Resolves the active title template for the current route from merged load data.
 * The deepest template whose route is an ancestor of the current route wins.
 * Respects the reset boundary written by resetLayout helpers.
 *
 * @param data - Merged page data (page.data)
 * @param currentRoute - The current route id (page.route.id), or a pathname as fallback
 * @returns The winning template string, or null if none applies
 */
export function resolveTitleTemplate(
	data: Record<string, unknown>,
	currentRoute: string | null | undefined
): string | null {
	if (!currentRoute) return null
	const current = stripRouteGroups(currentRoute)

	const resetAt = data[TEMPLATE_RESET_KEY]
	const boundary = typeof resetAt === 'string' ? stripRouteGroups(resetAt) : null

	let best: { route: string; template: string } | null = null
	for (const [key, value] of Object.entries(data)) {
		if (!key.startsWith(TEMPLATE_KEY_PREFIX) || typeof value !== 'string') continue

		const route = stripRouteGroups(key.slice(TEMPLATE_KEY_PREFIX.length))
		if (boundary !== null && !isAtOrBelow(route, boundary)) continue
		if (!templateAppliesTo(route, current)) continue

		if (best === null || routeDepth(route) > routeDepth(best.route)) {
			best = { route, template: value }
		}
	}

	return best?.template ?? null
}

/**
 * Validates and cleans metadata tags by checking character limits and handling mutual exclusivity conflicts.
 * Also runs Zod validation for additional error checking.
 *
 * This function performs the following validations:
 * - Warns if title exceeds 70 characters (SEO best practice)
 * - Warns if description exceeds 200 characters (SEO best practice)
 * - Resolves conflicts between 'image' and 'images' properties (keeps 'images')
 * - Resolves conflicts between 'video' and 'videos' properties (keeps 'videos')
 * - Runs Zod validation for additional error checking
 *
 * @param tags - The metadata object to validate and clean
 * @returns The cleaned metadata object with conflicts resolved
 *
 * @example
 * ```typescript
 * const cleanedTags = checkData({
 *   title: 'A very long title that exceeds the recommended character limit',
 *   description: 'A description that is also too long for SEO best practices',
 *   image: 'single-image.jpg',
 *   images: ['image1.jpg', 'image2.jpg']
 * });
 * // Returns: { images: ['image1.jpg', 'image2.jpg'] }
 * // Console warnings for title and description length, and image/images conflict
 * ```
 */
export function checkData(
	tags: BaseMetadata | LayoutMetadata | PageMetadata
): BaseMetadata | LayoutMetadata | PageMetadata {
	// Handle character limit on title
	if (tags.title && tags.title.length > 70) {
		console.warn('Title exceeds recommended length of 70 characters')
	}

	// Handle character limit on description
	if (tags.description && tags.description.length > 200) {
		console.warn('Description exceeds recommended length of 200 characters')
	}

	// Handle mutual exclusivity for image/images
	if ('image' in tags && 'images' in tags) {
		console.warn('Both image and images properties specified - using images and ignoring image')
		// Remove 'image' and keep 'images'
		const { image, ...restData } = tags
		tags = restData
	}

	// Handle mutual exclusivity for video/videos
	if ('video' in tags && 'videos' in tags) {
		console.warn('Both video and videos properties specified - using videos and ignoring video')
		// Remove 'video' and keep 'videos'
		const { video, ...restData } = tags
		tags = restData
	}

	try {
		metadataSchema.parse(tags)
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.warn('Additional validation warnings:', error.issues)
		}
	}

	return tags
}
