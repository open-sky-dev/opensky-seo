/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import {
	normalizeRoute,
	resolveOgImage,
	resolveTitleTemplate,
	resolveUrl,
	stripRouteGroups,
	transformMetadataKeys,
	IMAGE_ALT_KEY,
	IMAGE_PARAM_PREFIX,
	TEMPLATE_KEY_PREFIX,
	TEMPLATE_RESET_KEY
} from './utils'
import { og, ogParams } from './og'
import { addMetaTagsLayout, addMetaTagsPage, addMetaTagsResetLayout } from './add-meta-tags'

describe('transformMetadataKeys', () => {
	test('prefixes regular keys and skips nullish values', () => {
		const result = transformMetadataKeys({
			title: 'My Page',
			description: undefined
		})
		expect(result).toEqual({ '_meta-title': 'My Page' })
	})

	test('keys titleTemplate by its explicit route, verbatim', () => {
		const result = transformMetadataKeys({
			titleTemplate: { route: '/blog/[slug]', template: '{page} | Blog' }
		})
		expect(result).toEqual({
			[`${TEMPLATE_KEY_PREFIX}/blog/[slug]`]: '{page} | Blog'
		})
	})

	test('scopes a string titleTemplate to the declaring route', () => {
		const result = transformMetadataKeys({ titleTemplate: 'Staff: {page}' }, '/staff')
		expect(result).toEqual({ [`${TEMPLATE_KEY_PREFIX}/staff`]: 'Staff: {page}' })
	})

	test('scopes an object titleTemplate without route to the declaring route', () => {
		const result = transformMetadataKeys({ titleTemplate: { template: 'Docs: {page}' } }, '/docs')
		expect(result).toEqual({ [`${TEMPLATE_KEY_PREFIX}/docs`]: 'Docs: {page}' })
	})

	test('explicit route wins over the declaring route', () => {
		const result = transformMetadataKeys(
			{ titleTemplate: { route: '/blog', template: 'Blog: {page}' } },
			'/'
		)
		expect(result).toEqual({ [`${TEMPLATE_KEY_PREFIX}/blog`]: 'Blog: {page}' })
	})

	test('skips titleTemplate when no route can be resolved', () => {
		const result = transformMetadataKeys({ titleTemplate: 'Lost: {page}' })
		expect(result).toEqual({})
	})

	test('normalizes template routes (trailing slash)', () => {
		const result = transformMetadataKeys({
			titleTemplate: { route: '/blog/', template: 'Blog: {page}' }
		})
		expect(result).toEqual({ [`${TEMPLATE_KEY_PREFIX}/blog`]: 'Blog: {page}' })
	})
})

describe('route helpers', () => {
	test('normalizeRoute', () => {
		expect(normalizeRoute('/')).toBe('/')
		expect(normalizeRoute('/blog/')).toBe('/blog')
		expect(normalizeRoute('blog')).toBe('/blog')
	})

	test('resolveUrl makes relative URLs absolute against the origin', () => {
		expect(resolveUrl('/og.png', 'https://example.com')).toBe('https://example.com/og.png')
		expect(resolveUrl('./og.png', 'https://example.com')).toBe('https://example.com/og.png')
		expect(resolveUrl('og.png', 'https://example.com')).toBe('https://example.com/og.png')
	})

	test('resolveUrl passes absolute and protocol-relative URLs through', () => {
		expect(resolveUrl('https://cdn.example.com/og.png', 'https://example.com')).toBe(
			'https://cdn.example.com/og.png'
		)
		expect(resolveUrl('//cdn.example.com/og.png', 'https://example.com')).toBe(
			'https://cdn.example.com/og.png'
		)
	})

	test('resolveUrl leaves URLs alone for the prerender placeholder origin', () => {
		expect(resolveUrl('/og.png', 'http://sveltekit-prerender')).toBe('/og.png')
		expect(resolveUrl('/og.png', '')).toBe('/og.png')
	})

	test('stripRouteGroups', () => {
		expect(stripRouteGroups('/(marketing)/pricing')).toBe('/pricing')
		expect(stripRouteGroups('/(app)')).toBe('/')
		expect(stripRouteGroups('/blog/[slug]')).toBe('/blog/[slug]')
		expect(stripRouteGroups('/')).toBe('/')
	})
})

describe('resolveTitleTemplate', () => {
	const tpl = (route: string, template: string) => ({
		[`${TEMPLATE_KEY_PREFIX}${route}`]: template
	})

	test('root template applies everywhere, including the home page', () => {
		const data = { ...tpl('/', 'Acme — {page}') }
		expect(resolveTitleTemplate(data, '/')).toBe('Acme — {page}')
		expect(resolveTitleTemplate(data, '/about')).toBe('Acme — {page}')
	})

	test("a section template does not apply to the section's own page (README /staff scenario)", () => {
		const data = {
			...tpl('/', 'Acme — {page}'),
			...tpl('/staff', 'Staff: {page}')
		}
		expect(resolveTitleTemplate(data, '/staff')).toBe('Acme — {page}')
		expect(resolveTitleTemplate(data, '/staff/jeff')).toBe('Staff: {page}')
	})

	test('the deepest matching template wins', () => {
		const data = {
			...tpl('/', 'Acme — {page}'),
			...tpl('/blog', 'Blog — {page}'),
			...tpl('/blog/tech', 'Tech — {page}')
		}
		expect(resolveTitleTemplate(data, '/blog/tech/post')).toBe('Tech — {page}')
		expect(resolveTitleTemplate(data, '/blog/life')).toBe('Blog — {page}')
	})

	test('does not match sibling routes that share a string prefix', () => {
		const data = {
			...tpl('/', 'Acme — {page}'),
			...tpl('/blog', 'Blog — {page}')
		}
		expect(resolveTitleTemplate(data, '/blog-archive')).toBe('Acme — {page}')
	})

	test('matches route patterns with dynamic segments', () => {
		const data = { ...tpl('/blog', 'Blog — {page}') }
		expect(resolveTitleTemplate(data, '/blog/[slug]')).toBe('Blog — {page}')
	})

	test('ignores route group segments on both sides', () => {
		const data = {
			...tpl('/(marketing)', 'Marketing — {page}'), // strips to '/', acts as root
			...tpl('/shop', 'Shop — {page}')
		}
		expect(resolveTitleTemplate(data, '/(storefront)/shop/hats')).toBe('Shop — {page}')
		expect(resolveTitleTemplate(data, '/pricing')).toBe('Marketing — {page}')
	})

	test('respects the reset boundary', () => {
		const data = {
			...tpl('/', 'Acme — {page}'),
			...tpl('/app', 'App — {page}'),
			[TEMPLATE_RESET_KEY]: '/app'
		}
		// root template is outside the boundary and ignored; /app template still applies below it
		expect(resolveTitleTemplate(data, '/app/settings')).toBe('App — {page}')
		expect(resolveTitleTemplate(data, '/app')).toBeNull()
	})

	test('returns null with no route or no templates', () => {
		expect(resolveTitleTemplate({}, '/about')).toBeNull()
		expect(resolveTitleTemplate({ ...tpl('/', 'A — {page}') }, null)).toBeNull()
	})
})

describe('media exclusivity', () => {
	test('providing both image and images is a type error; plural wins at runtime', () => {
		const result = addMetaTagsLayout(
			// @ts-expect-error - image and images are mutually exclusive at the type level
			{ image: 'a.jpg', images: [{ url: 'b.jpg' }] },
			'/'
		)
		expect(result['_meta-image']).toBeUndefined()
		expect(result['_meta-images']).toEqual([{ url: 'b.jpg' }])
	})
})

describe('generated images (og / ogParams)', () => {
	test('og() explodes into a template key plus one key per param', () => {
		const result = transformMetadataKeys({
			image: og('/og', { heading: 'My Site', theme: 'dark' }, { alt: 'Site card' })
		})
		expect(result['_meta-image']).toEqual({
			og: '/og',
			width: 1200,
			height: 630,
			type: 'image/png'
		})
		expect(result[`${IMAGE_PARAM_PREFIX}heading`]).toBe('My Site')
		expect(result[`${IMAGE_PARAM_PREFIX}theme`]).toBe('dark')
		expect(result[IMAGE_ALT_KEY]).toBe('Site card')
	})

	test('ogParams() writes only param keys, leaving the template untouched', () => {
		const result = transformMetadataKeys({ image: ogParams({ heading: 'My Post' }) })
		expect(result['_meta-image']).toBeUndefined()
		expect(result[`${IMAGE_PARAM_PREFIX}heading`]).toBe('My Post')
	})

	test('scenario: layout defines the card, page hydrates it', () => {
		const pageData: Record<string, unknown> = {
			...addMetaTagsLayout({ image: og('/og', { heading: "Jake's Blog" }) }, '/'),
			...addMetaTagsPage({
				title: 'Why Svelte Rocks',
				image: ogParams({ heading: 'Why Svelte Rocks', author: 'Jane Doe' }, { alt: 'Post card' })
			})
		}

		expect(resolveOgImage(pageData)).toEqual({
			url: '/og?author=Jane+Doe&heading=Why+Svelte+Rocks',
			width: 1200,
			height: 630,
			type: 'image/png',
			alt: 'Post card'
		})
	})

	test('scenario: section swaps the route, params cascade through and null removes', () => {
		const pageData: Record<string, unknown> = {
			...addMetaTagsLayout({ image: og('/og', { heading: "Jake's Blog", theme: 'dark' }) }, '/'),
			...addMetaTagsLayout({ image: og('/og/product', { heading: null, badge: 'Shop' }) }, '/shop'),
			...addMetaTagsPage({ image: ogParams({ price: 29 }) })
		}

		// theme inherited across the route change, heading removed via null
		expect(resolveOgImage(pageData)?.url).toBe('/og/product?badge=Shop&price=29&theme=dark')
	})

	test('scenario: a plain image value overrides the generated template', () => {
		const pageData: Record<string, unknown> = {
			...addMetaTagsLayout({ image: og('/og', { heading: 'Site' }) }, '/'),
			...addMetaTagsPage({ image: '/photos/party.jpg' })
		}

		expect(pageData['_meta-image']).toBe('/photos/party.jpg')
		// leftover param keys are inert - resolveOgImage refuses non-template values
		expect(resolveOgImage(pageData)).toBeNull()
	})

	test('scenario: one-off page-level card with custom dimensions', () => {
		const pageData: Record<string, unknown> = {
			...addMetaTagsPage({
				image: og(
					'/og/event',
					{ title: 'Launch Party' },
					{ width: 1600, height: 900, type: 'image/webp', alt: 'Launch Party' }
				)
			})
		}

		expect(resolveOgImage(pageData)).toEqual({
			url: '/og/event?title=Launch+Party',
			width: 1600,
			height: 900,
			type: 'image/webp',
			alt: 'Launch Party'
		})
	})

	test('params are URL-encoded and sorted for stable URLs', () => {
		const pageData: Record<string, unknown> = {
			...addMetaTagsLayout({ image: og('/og', { z: 'a&b=c', a: 'Ünïcode & spaces' }) }, '/')
		}

		expect(resolveOgImage(pageData)?.url).toBe('/og?a=%C3%9Cn%C3%AFcode+%26+spaces&z=a%26b%3Dc')
	})

	test('og() without params produces a bare URL; alt cascades deepest-wins', () => {
		const pageData: Record<string, unknown> = {
			...addMetaTagsLayout({ image: og('/og', {}, { alt: 'Default card' }) }, '/'),
			...addMetaTagsPage({ image: ogParams({}, { alt: 'Specific card' }) })
		}

		const resolved = resolveOgImage(pageData)
		expect(resolved?.url).toBe('/og')
		expect(resolved?.alt).toBe('Specific card')
	})
})

describe('cascade integration (simulated SvelteKit shallow merge)', () => {
	test('templates from multiple layouts coexist and resolve per-route', () => {
		// SvelteKit shallow-merges each load's return into page.data, deepest wins per key
		const pageData: Record<string, unknown> = {
			...addMetaTagsLayout({ sitename: 'Acme', titleTemplate: 'Acme — {page}' }, '/'),
			...addMetaTagsLayout({ title: 'Blog', titleTemplate: 'Blog — {page}' }, '/blog'),
			...addMetaTagsPage({ title: 'My Post' })
		}

		expect(pageData['_meta-title']).toBe('My Post')
		expect(resolveTitleTemplate(pageData, '/blog/[slug]')).toBe('Blog — {page}')
		expect(resolveTitleTemplate(pageData, '/blog')).toBe('Acme — {page}')
	})

	test('resetLayout clears inherited metadata and templates', () => {
		const pageData: Record<string, unknown> = {
			...addMetaTagsLayout({ sitename: 'Acme', titleTemplate: 'Acme — {page}' }, '/'),
			...addMetaTagsResetLayout({ titleTemplate: 'Admin — {page}' }, '/admin'),
			...addMetaTagsPage({ title: 'Users' })
		}

		expect(pageData['_meta-sitename']).toBeNull()
		expect(resolveTitleTemplate(pageData, '/admin/users')).toBe('Admin — {page}')
		// the root template no longer leaks through the reset
		expect(resolveTitleTemplate(pageData, '/admin')).toBeNull()
	})
})
