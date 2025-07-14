import type { BaseMetadata, LayoutMetadata } from './types/metadata'
import { metadataSchema } from './types/metadata'
import { PREFIX } from './index'
import { z } from 'zod'

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
 * Handles titleTemplate specially by creating a route-specific key.
 *
 * @param metadata - The metadata object to transform
 * @returns Object with prefixed keys for SvelteKit data cascade
 *
 * @example
 * ```typescript
 * const result = transformMetadataKeys({
 *   title: "My Page",
 *   description: "Page description",
 *   titleTemplate: { route: "/blog", template: "Blog: {page}" }
 * });
 * // Returns: {
 * //   "_meta-title": "My Page",
 * //   "_meta-description": "Page description",
 * //   "_meta_blog-title-template": "Blog: {page}"
 * // }
 * ```
 */
export function transformMetadataKeys(data: LayoutMetadata | BaseMetadata): Record<string, any> {
	const result: Record<string, any> = {}

	for (const [key, value] of Object.entries(data)) {
		// Skip if value is nullish
		if (value === undefined || value === null) continue

		// Handle titleTemplate to use route in key
		if (isTitleTemplate(key, value)) {
			const route = value.route
			let routeKey: string

			// Handle the root route
			if (!route || route === '' || route === '/') {
				routeKey = 'root'
			} else {
				routeKey = route
					.replace(/[\[\]()]/g, '') // Remove brackets and parentheses
					.replace(/[^a-zA-Z0-9_]/g, '_') // Replace any non-alphanumeric chars with underscores
					.replace(/_+/g, '_') // Collapse multiple underscores into single
					.replace(/^_|_$/g, '') // Remove leading/trailing underscores
					.toLowerCase() // Convert to lowercase for consistency
			}

			result[`${PREFIX}_${routeKey}-title-template`] = value.template
			continue
		}

		// For all other top-level keys, prefix and set value
		result[`${PREFIX}-${key}`] = value
	}

	return result
}

const isTitleTemplate = (key: any, value: any): boolean => {
	if (key === 'titleTemplate') {
		if (typeof value === 'object' && 'route' in value && 'template' in value) {
			return true
		} else {
			console.warn('titleTemplate has error. Missing route or template in object')
			return false
		}
	} else {
		return false
	}
}

/**
 * Validates and cleans metadata tags using Zod schema validation.
 * This function performs the following validations:
 * - Validates all metadata against the Zod schema
 * - Provides detailed error messages for invalid data
 * - Handles character limits and format validation automatically
 *
 * @param tags - The metadata object to validate and clean
 * @returns The cleaned and validated metadata object
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
export function checkData(tags: BaseMetadata | LayoutMetadata): BaseMetadata | LayoutMetadata {
	try {
		// Validate with Zod - this will throw if invalid
		const validated = metadataSchema.parse(tags)
		return validated
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error('Metadata validation failed:', error.errors)
		}
		throw error
	}
}
