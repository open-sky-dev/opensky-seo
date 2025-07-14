import type { Metadata } from './types/metadata'

/**
 * Converts a SvelteKit route ID to a safe object key for metadata storage.
 *
 * Transforms route patterns like "blog/[slug]" or "(marketing)/about" into
 * consistent keys like "_meta_blog_slug" or "_meta_marketing_about_page".
 *
 * Layout keys get no suffix, page keys get '_page' suffix, allowing natural
 * ordering by key length (shorter = higher in hierarchy). The '_meta_' prefix
 * helps separate metadata from application data in the page data object.
 *
 * @param routeId - The SvelteKit route pattern (e.g., "blog/[slug]", "(marketing)/about")
 * @param type - Whether this is from a layout or page load function
 * @returns A safe object key prefixed with "_meta_"
 *
 * @example
 * deriveKeyFromRoute({ routeId: "", type: "layout" }) // "_meta_root"
 * deriveKeyFromRoute({ routeId: "blog", type: "layout" }) // "_meta_blog"
 * deriveKeyFromRoute({ routeId: "blog/[slug]", type: "page" }) // "_meta_blog_slug_page"
 * deriveKeyFromRoute({ routeId: "(marketing)/about", type: "page" }) // "_meta_marketing_about_page"
 */
export function deriveKeyFromRoute({
	routeId,
	type
}: {
	routeId: string | null
	type: 'layout' | 'page'
}): string {
	const PREFIX = '_meta'

	const PAGE = type === 'page' ? '_page' : ''

	// Handle the root route
	if (!routeId || routeId === '') {
		return `${PREFIX}_root${PAGE}`
	}

	const baseKey = routeId
		.replace(/[\[\]()]/g, '') // Remove brackets and parentheses
		.replace(/[^a-zA-Z0-9_]/g, '_') // Replace any non-alphanumeric chars with underscores
		.replace(/_+/g, '_') // Collapse multiple underscores into single
		.replace(/^_|_$/g, '') // Remove leading/trailing underscores
		.toLowerCase() // Convert to lowercase for consistency

	return `${PREFIX}_${baseKey}${PAGE}`
}

/**
 * Validates and cleans metadata tags by checking character limits and handling mutual exclusivity conflicts.
 *
 * This function performs the following validations:
 * - Warns if title exceeds 70 characters (SEO best practice)
 * - Warns if description exceeds 200 characters (SEO best practice)
 * - Resolves conflicts between 'image' and 'images' properties (keeps 'images')
 * - Resolves conflicts between 'video' and 'videos' properties (keeps 'videos')
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
export function checkData(tags: Metadata): Metadata {
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

	return tags
}
