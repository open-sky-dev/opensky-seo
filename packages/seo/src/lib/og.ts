/**
 * Helpers for generated social share images.
 *
 * The contract is simple: an endpoint route renders an image from query
 * params. og() defines a generated-image template on the `image` metadata
 * property - the endpoint route, base params, and output dimensions.
 * ogParams() contributes params into the template inherited from a parent
 * layout without restating the route. Params merge across the route tree
 * per param, deepest value winning, exactly like the rest of the cascade.
 */

/** Values that can be serialized into the image URL's query string */
export type OgParamValue = string | number | boolean | null | undefined

export type OgParamsRecord = Record<string, OgParamValue>

export type OgImageOptions = {
	/** Rendered width in pixels (og:image:width) @default 1200 */
	width?: number
	/** Rendered height in pixels (og:image:height) @default 630 */
	height?: number
	/** MIME type of the endpoint's output (og:image:type) @default 'image/png' */
	type?: string
	/** Accessibility alt text (og:image:alt, twitter:image:alt) */
	alt?: string
}

/** Returned by og(); recognized by the metadata transform via the `og` route field */
export type OgImageTemplate = {
	/** The endpoint route that renders the image */
	og: string
	params: OgParamsRecord
	width: number
	height: number
	type: string
	alt?: string
}

/** Returned by ogParams(); contributes params without touching the template */
export type OgImageParams = {
	ogParams: OgParamsRecord
	alt?: string
}

/**
 * Defines a generated share image on the `image` property: an endpoint route
 * plus the params to send it. Pass the param shape as a generic (the og card
 * component's props type works well) to catch typos at compile time.
 *
 * Params set here (and by ogParams() at deeper levels) merge per param down
 * the route tree. Set a param to `null` to remove an inherited value.
 *
 * @example
 * ```typescript
 * // +layout.ts - every child page gets a generated card
 * export const load = metaLoad.layout({
 *   image: og('/og', { heading: 'My Site' })
 * })
 * ```
 */
export function og<Params extends OgParamsRecord = OgParamsRecord>(
	route: string,
	params?: Partial<Params>,
	options?: OgImageOptions
): OgImageTemplate {
	return {
		og: route,
		params: params ?? {},
		width: options?.width ?? 1200,
		height: options?.height ?? 630,
		type: options?.type ?? 'image/png',
		...(options?.alt !== undefined ? { alt: options.alt } : {})
	}
}

/**
 * Contributes params to the generated image template inherited from a parent
 * layout, without restating the route. Deepest value wins per param.
 *
 * @example
 * ```typescript
 * // +page.ts - fills in the card defined by a layout's og()
 * export const load = metaLoadWithData.page(({ data }) => ({
 *   title: data.post.title,
 *   image: ogParams({ heading: data.post.title, author: data.post.author })
 * }))
 * ```
 */
export function ogParams<Params extends OgParamsRecord = OgParamsRecord>(
	params: Partial<Params>,
	options?: Pick<OgImageOptions, 'alt'>
): OgImageParams {
	return {
		ogParams: params,
		...(options?.alt !== undefined ? { alt: options.alt } : {})
	}
}

export const isOgTemplate = (value: unknown): value is OgImageTemplate =>
	typeof value === 'object' && value !== null && typeof (value as OgImageTemplate).og === 'string'

export const isOgParams = (value: unknown): value is OgImageParams =>
	typeof value === 'object' &&
	value !== null &&
	typeof (value as OgImageParams).ogParams === 'object' &&
	(value as OgImageParams).ogParams !== null
