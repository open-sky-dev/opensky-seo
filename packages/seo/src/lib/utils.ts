import type { BaseMetadata, LayoutMetadata, Media, PageMetadata } from './types/metadata'
import { isOgTemplate, isOgParams } from './og'

/** Prefixed on all metadata keys added to load data */
export const PREFIX = '_meta'

/**
 * Vite statically replaces import.meta.env.DEV, so dev-only validation
 * warnings are dead-code-eliminated from production bundles
 */
const DEV: boolean = import.meta.env?.DEV ?? false

/**
 * Every metadata key, nulled. The `satisfies` clause keeps this in sync with
 * BaseMetadata at compile time: a missing or extra key fails to type-check.
 */
const NULL_METADATA = {
	canonical: null,
	icon: null,
	maskIcon: null,
	theme: null,
	colorScheme: null,
	sitename: null,
	title: null,
	titleTemplate: null,
	description: null,
	author: null,
	twitterSite: null,
	twitterCreator: null,
	date: null,
	modified: null,
	type: null,
	image: null,
	images: null,
	video: null,
	videos: null
} satisfies Record<keyof BaseMetadata, null>

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
 * Generated image params get one key each (e.g. '_meta-image-param:heading')
 * so layouts and pages compose params per key through the cascade, the same
 * way title templates coexist.
 */
export const IMAGE_PARAM_PREFIX = `${PREFIX}-image-param:`

/** Alt text for the generated image; cascades independently, deepest wins */
export const IMAGE_ALT_KEY = `${PREFIX}-image-alt`

/**
 * Generates a reset object with null values for all possible metadata keys.
 * This ensures all metadata from parent layouts is cleared.
 */
export function generateResetData(): Record<string, null> {
	const resetData: Record<string, null> = {}

	for (const key of Object.keys(NULL_METADATA)) {
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

		// Handle generated image helpers on the image property
		if (key === 'image' && isOgTemplate(value)) {
			const { og: route, params, alt, width, height, type } = value
			result[`${PREFIX}-image`] = { og: route, width, height, type }
			if (alt !== undefined) result[IMAGE_ALT_KEY] = alt
			for (const [param, paramValue] of Object.entries(params)) {
				// null is written deliberately - it clears an inherited param
				if (paramValue === undefined) continue
				result[`${IMAGE_PARAM_PREFIX}${param}`] = paramValue
			}
			continue
		}
		if (key === 'image' && isOgParams(value)) {
			// Params only - the template key is left untouched so the parent's og() applies
			if (value.alt !== undefined) result[IMAGE_ALT_KEY] = value.alt
			for (const [param, paramValue] of Object.entries(value.ogParams)) {
				if (paramValue === undefined) continue
				result[`${IMAGE_PARAM_PREFIX}${param}`] = paramValue
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
		if (DEV) {
			console.warn(
				'titleTemplate must be a template string or a { route?, template } object - skipping'
			)
		}
		return null
	}

	if (route === undefined) {
		if (DEV) {
			console.warn(
				'titleTemplate needs a route. Pass { route, template } or use the metaLoad/metaLoadWithData helpers, which infer the route automatically - skipping'
			)
		}
		return null
	}

	return { route: normalizeRoute(route), template }
}

/** Ensures a leading slash and no trailing slash ('/blog/' -> '/blog', '/' -> '/') */
export function normalizeRoute(route: string): string {
	return '/' + route.split('/').filter(Boolean).join('/')
}

/** SvelteKit's placeholder origin during prerendering when kit.prerender.origin isn't configured */
const PRERENDER_PLACEHOLDER_ORIGIN = 'http://sveltekit-prerender'

/**
 * Resolves a URL against the site origin, since scrapers require absolute URLs
 * for og:image, og:url, and friends. Absolute URLs pass through untouched.
 * Left as-is when the origin is SvelteKit's prerender placeholder - set
 * kit.prerender.origin in svelte.config to get absolute URLs in prerendered pages.
 */
export function resolveUrl(url: string, origin: string): string {
	if (!url || !origin || origin === PRERENDER_PLACEHOLDER_ORIGIN) return url
	try {
		return new URL(url, origin).href
	} catch {
		return url
	}
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
 * handles that. The same rule holds at the root: the root template is the
 * fallback for every route except '/' itself, so the home page keeps its
 * hand-written title.
 */
const templateAppliesTo = (templateRoute: string, currentRoute: string): boolean =>
	templateRoute === '/' ? currentRoute !== '/' : currentRoute.startsWith(templateRoute + '/')

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
 * Resolves a generated image (defined via og()/ogParams()) from merged load
 * data into a renderable Media object. Params are collected from their
 * individual cascade keys, sorted for stable (cacheable) URLs, and nullish
 * params are dropped. Returns null when the image isn't a generated template
 * (plain string/Media values render directly).
 *
 * @param data - Merged page data (page.data)
 */
export function resolveOgImage(data: Record<string, unknown>): Media | null {
	const template = data[`${PREFIX}-image`]
	if (!isOgTemplate(template)) return null

	const params: [string, string][] = []
	for (const [key, value] of Object.entries(data)) {
		if (!key.startsWith(IMAGE_PARAM_PREFIX)) continue
		if (value === null || value === undefined) continue
		params.push([key.slice(IMAGE_PARAM_PREFIX.length), String(value)])
	}
	params.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))

	const query = new URLSearchParams(params).toString()
	const alt = data[IMAGE_ALT_KEY]

	return {
		url: query ? `${template.og}?${query}` : template.og,
		width: template.width,
		height: template.height,
		type: template.type,
		...(typeof alt === 'string' ? { alt } : {})
	}
}

/**
 * Cleans metadata tags and, in dev, warns about SEO issues.
 *
 * The image/images and video/videos exclusivity is enforced at the type level,
 * but plain-JS callers can still pass both - the plural form wins at runtime.
 * Character-limit warnings only run in dev and are stripped from production
 * bundles.
 *
 * @param tags - The metadata object to validate and clean
 * @returns The cleaned metadata object with conflicts resolved
 */
export function checkData(
	tags: BaseMetadata | LayoutMetadata | PageMetadata
): BaseMetadata | LayoutMetadata | PageMetadata {
	if (DEV) {
		// SEO advisories - can't be checked statically since values are often dynamic
		if (tags.title && tags.title.length > 70) {
			console.warn('Title exceeds recommended length of 70 characters')
		}
		if (tags.description && tags.description.length > 200) {
			console.warn('Description exceeds recommended length of 200 characters')
		}
	}

	// The XOR types make these conflicts unrepresentable for TypeScript callers
	// (narrowing them here collapses to never), so resolve them on a widened
	// copy for the sake of plain-JS callers
	const cleaned: Record<string, unknown> = { ...tags }

	if (cleaned.image != null && cleaned.images != null) {
		if (DEV) {
			console.warn('Both image and images properties specified - using images and ignoring image')
		}
		delete cleaned.image
	}

	if (cleaned.video != null && cleaned.videos != null) {
		if (DEV) {
			console.warn('Both video and videos properties specified - using videos and ignoring video')
		}
		delete cleaned.video
	}

	return cleaned as BaseMetadata | LayoutMetadata | PageMetadata
}
