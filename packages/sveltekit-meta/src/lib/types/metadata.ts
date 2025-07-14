import { z } from 'zod'

// Sub-schemas
const iconOpinionatedSchema = z.object({
	svg: z.string().optional(),
	small: z
		.object({
			url: z.string(),
			size: z.number(),
			type: z.string().optional()
		})
		.optional(),
	large: z
		.object({
			url: z.string(),
			size: z.number(),
			type: z.string().optional()
		})
		.optional()
})

const mediaSchema = z.object({
	/** Primary URL for the media resource */
	url: z.string(),
	/** HTTPS URL for the media resource */
	secureUrl: z.string().optional(),
	/** MIME type of the media */
	type: z.string().optional(),
	/** Width in pixels */
	width: z.number().optional(),
	/** Height in pixels */
	height: z.number().optional(),
	/** Alt text description */
	alt: z.string().optional()
})

const contentTypeSchema = z.union([
	z.literal('basic'),
	z.literal('article'),
	z.literal('largeImage'),
	z.literal('player'),
	z.object({
		twitter: z.enum(['summary', 'largeImage', 'player']),
		og: z.enum(['website', 'article'])
	})
])

// Main metadata schema with JSDoc comments
export const metadataSchema = z.object({
	/** Canonical URL for the page */
	canonical: z.string().optional(), // og:url link:rel:canonical

	icon: z.union([z.string(), iconOpinionatedSchema]).optional(),

	/** Used for Safari Pinned Tabs */
	maskIcon: z
		.object({
			/** Should provide an svg file */
			url: z.string(),
			/** Should provide a color in a hex value */
			color: z.string().optional()
		})
		.optional(),

	/**
	 * Theme color for the browser UI elements
	 * You can provide a single string (hex, rgb, etc.)
	 * or an object with { light, dark } variants.
	 */
	theme: z
		.union([
			z.string(),
			z.object({
				light: z.string(),
				dark: z.string()
			})
		])
		.optional(),

	/** Color scheme preference for the page */
	colorScheme: z.string().optional(), // meta:color-scheme

	// Basic Data
	sitename: z.string().optional(), // og:sitename

	/** @maxLength 70 chars for Twitter */
	title: z.string().max(70).optional(), // og:title meta:title

	/**
	 * Template for constructing children page titles
	 * Example: { route: "/staff", template: "Staff: {page}" }
	 */
	titleTemplate: z
		.object({
			route: z.string(),
			template: z.string()
		})
		.optional(), // used to infer og:title meta:title twitter:title

	/** @maxLength 200 chars for Twitter */
	description: z.string().max(200).optional(), // og:description twitter:description meta:description

	/** Content Author(s) */
	author: z.union([z.string(), z.array(z.string())]).optional(), // meta:author og:author

	/** The X Account for the publishing site */
	twitterSite: z.string().optional(), // twitter:site

	/** The X Account for the author/creator of this page */
	twitterCreator: z.string().optional(), // twitter:creator

	/**
	 * Publication Date
	 * @format ISO 8601
	 */
	date: z.string().datetime().optional(), // og meta

	/** Last Modified Date */
	modified: z.string().datetime().optional(), // og:modified-time meta:modified meta:last-modified

	/**
	 * Content type configuration
	 * Used to determine appropriate meta tags and social card formats
	 */
	type: contentTypeSchema.optional(),

	/** Media configuration */
	image: z.union([z.string(), mediaSchema]).optional(),
	images: z.array(mediaSchema).optional(),
	video: z.union([z.string(), mediaSchema]).optional()
})

// Define the type with full JSDoc comments for IDE support
export type BaseMetadata = {
	/** Canonical URL for the page */
	canonical?: string // og:url link:rel:canonical

	icon?: string | IconOpinionated

	/** Used for Safari Pinned Tabs */
	maskIcon?: {
		/** Should provide an svg file */
		url: string
		/** Should provide a color in a hex value */
		color?: string
	}

	/**
	 * Theme color for the browser UI elements
	 * You can provide a single string (hex, rgb, etc.)
	 * or an object with { light, dark } variants.
	 */
	theme?:
		| string
		| {
				light: string
				dark: string
		  }

	/** Color scheme preference for the page */
	colorScheme?: string // meta:color-scheme

	// Basic Data
	sitename?: string // og:sitename

	/** @maxLength 70 chars for Twitter */
	title?: string // og:title meta:title

	/** @maxLength 200 chars for Twitter */
	description?: string // og:description twitter:description meta:description

	/** Content Author(s) */
	author?: string | Array<string> // meta:author og:author

	/** The X Account for the publishing site */
	twitterSite?: string // twitter:site

	/** The X Account for the author/creator of this page */
	twitterCreator?: string // twitter:creator

	/**
	 * Publication Date
	 * @format ISO 8601 */
	date?: string // og meta

	/** Last Modified Date */
	modified?: string // og:modified-time meta:modified meta:last-modified

	/**
	 * Content type configuration
	 * Used to determine appropriate meta tags and social card formats
	 */
	type?: ContentType
} & ImageConfig &
	VideoConfig

export type LayoutMetadata = BaseMetadata & {
	/**
	 * Template for constructing children page titles
	 * Example: { route: "/staff", template: "Staff: {page}" }
	 */
	titleTemplate?: TitleTemplate
}

export type PageMetadata = Omit<BaseMetadata, 'titleTemplate'>

// Keep the existing type definitions for compatibility
export type TitleTemplate = {
	route: string
	template: string
}

type IconOpinionated = {
	svg?: string
	small?: {
		url: string
		size: number
		type?: string
	}
	large?: {
		url: string
		size: number
		type?: string
	}
}

type ContentType = 'basic' | 'article' | 'largeImage' | 'player' | ContentTypeAdvanced

type ContentTypeAdvanced = {
	twitter: 'summary' | 'largeImage' | 'player'
	og: 'website' | 'article'
}

/**
 * Media object configuration
 */
type Media = {
	/** Primary URL for the media resource */
	url: string
	/** HTTPS URL for the media resource */
	secureUrl?: string
	/** MIME type of the media */
	type?: string
	/** Width in pixels */
	width?: number
	/** Height in pixels */
	height?: number
	/** Alt text description */
	alt?: string
}

// Make image/images mutually exclusive
type ImageConfig =
	| { image: string | Media; images?: never }
	| { image?: never; images: Array<Media> }
	| { image?: never; images?: never }

// Make video/videos mutually exclusive
type VideoConfig = {
	video?: string | Media
}
