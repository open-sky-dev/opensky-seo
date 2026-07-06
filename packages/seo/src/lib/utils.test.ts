/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import {
	normalizeRoute,
	resolveTitleTemplate,
	stripRouteGroups,
	transformMetadataKeys,
	TEMPLATE_KEY_PREFIX,
	TEMPLATE_RESET_KEY
} from './utils'
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
