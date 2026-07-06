export type Media = {
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

export type IconOpinionated = {
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

/**
 * Content type configuration
 * Used to determine appropriate meta tags and social card formats
 */
export type ContentType =
	| 'basic'
	| 'article'
	| 'largeImage'
	| 'player'
	| {
			twitter: 'summary' | 'largeImage' | 'player'
			og: 'website' | 'article'
	  }

/**
 * Template for constructing children page titles.
 * A plain string ('Staff: {page}') is scoped to the route of the layout that
 * declares it (when using the metaLoad/metaLoadWithData helpers). Pass
 * { route, template } to scope it to a different route explicitly.
 */
export type TitleTemplate =
	| string
	| {
			route?: string
			template: string
	  }

type MetadataCommon = {
	/** Canonical URL for the page (link:rel:canonical, og:url) */
	canonical?: string

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
	theme?: string | { light: string; dark: string }

	/** Color scheme preference for the page (meta:color-scheme) */
	colorScheme?: string

	// Basic Data
	/** Name of the website (og:site_name) */
	sitename?: string

	/** Page title - keep under 70 chars for Twitter (og:title, meta:title) */
	title?: string

	titleTemplate?: TitleTemplate

	/** Page description - keep under 200 chars for Twitter (og:description, twitter:description) */
	description?: string

	/** Content Author(s) (meta:author, og:author) */
	author?: string | string[]

	/** The X Account for the publishing site (twitter:site) */
	twitterSite?: string

	/** The X Account for the author/creator of this page (twitter:creator) */
	twitterCreator?: string

	/**
	 * Publication Date (og meta)
	 * @format ISO 8601
	 */
	date?: string

	/** Last Modified Date (og:modified-time, meta:last-modified) */
	modified?: string

	type?: ContentType
}

// image/images and video/videos are mutually exclusive - enforced at the type
// level so providing both is a compile error rather than a runtime warning
type ImageXor = { image?: string | Media; images?: never } | { image?: never; images?: Media[] }
type VideoXor = { video?: string | Media; videos?: never } | { video?: never; videos?: Media[] }

export type BaseMetadata = MetadataCommon & ImageXor & VideoXor
export type LayoutMetadata = BaseMetadata
// Omit must be applied to MetadataCommon (not the intersection) so the XOR
// unions survive; Omit over the full type would flatten them away
export type PageMetadata = Omit<MetadataCommon, 'titleTemplate'> & ImageXor & VideoXor
