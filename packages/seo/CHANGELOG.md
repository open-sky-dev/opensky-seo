# Changelog

## [1.2.0] - 2026-07-06

### Title Template Overhaul

Title templates are now stored in load data keyed by their route **verbatim** (e.g. `_meta-titleTemplate:/blog/[slug]`) instead of a lossy sanitized key, and are matched against SvelteKit route ids instead of URL pathnames. This fixes several matching bugs and enables a simpler API.

#### Features

- `titleTemplate` now accepts a plain string (e.g. `'Blog - {page}'`). When used with the `metaLoad`/`metaLoadWithData` helpers, it is automatically scoped to the declaring layout's route — no more manually keeping `route` in sync with the file's location. The `{ route, template }` object form still works, and `route` is now optional in it.
- `addMetaTags.layout` and `addMetaTags.resetLayout` accept an optional second argument `routeId` (pass `route.id` from your load function) to enable the same auto-scoping in manual load functions.
- `metaLoadWithData` callbacks may now be async and receive a typed `data` (narrowable via generic, e.g. `metaLoadWithData.page<{ post: Post }>(...)`).

#### Fixed

- The most specific (deepest) matching template now wins; previously the shallowest matched first.
- A section's template no longer applies to the section's own page: visiting `/staff` with a template declared at `/staff` now uses the parent template ("Site - Staff") as documented, instead of "Staff - Staff".
- Templates no longer match sibling routes sharing a string prefix (`/blog` vs `/blog-archive`).
- Templates on routes with dynamic segments (`/blog/[slug]`), route groups (`/(marketing)`), underscores, or uppercase characters now work; the old sanitized-key round trip silently broke them.
- `resetLayout` now clears inherited title templates (when the route is known, i.e. via helpers or by passing `routeId`).
- `canonical` now renders `<link rel="canonical">` in addition to `og:url`.
- Pages without an explicit `type` now emit default `og:type: website` and `twitter:card: summary` tags so every page has a card type.
- Added a `default` condition to package `exports` so non-Svelte-aware tooling (vitest, plain node) can resolve the package.

#### Zero Dependencies

- Removed Zod — the package now has no runtime dependencies. The metadata types are hand-written TypeScript (same shapes as before), so nothing ships to the client for validation.
- `image`/`images` and `video`/`videos` mutual exclusivity is now enforced at the type level: providing both is a compile error. At runtime (plain JS), the plural form still wins.
- Validation warnings (title/description length advisories, titleTemplate misconfiguration) only run in dev (`import.meta.env.DEV`) and are dead-code-eliminated from production bundles.
- The `metadataSchema` Zod schema is no longer exported. All type exports (`BaseMetadata`, `LayoutMetadata`, `PageMetadata`, `Media`, `IconOpinionated`, `ContentType`, `TitleTemplate`) are unchanged.

#### Removed

- The undocumented `additionalTags` pass-through in the head component. Use Svelte's native `<svelte:head>` for arbitrary extra tags — it composes with `SeoTags`.

## [1.0.0] - 2024-12-19

### Breaking Changes

This is a major refactor of the SvelteKit Meta API to remove `await parent` from load functions, allowing for asynchronous/parallel execution of load functions by SvelteKit. It also introduces a new API designed to be more consistent and easier to use.

#### API Restructure

- **Removed**: `baseMetaLoad`, `layoutMetaLoad`, `pageMetaLoad`, `advancedMetaLoad`, `parseMeta` functions
- **Added**: New modular API with three main categories, each providing `page`, `layout`, and `resetLayout` methods:
  - `metaLoad` - Quickest way to add meta tags. Allows for static metadata (no access to load context)
  - `metaLoadWithData` - Allows for dynamic metadata with access to load context
  - `addMetaTags` - For manual integration with existing load functions. Internally, this is what metaLoad and metaLoadWithData call

#### Data Structure Changes

All metadata is now added to the top level of loaded data with the `_meta` prefix (e.g., `_metaTitle`, `_metaDescription`). This should prevent any existing data from conflicting with the metadata. Switching to this approach allows SvelteKit to merge data down the routing tree automatically.

#### Title Template Changes

Because of these changes the `titleTemplate` property now requires you to explicitly specify the route where the template should apply. This is necessary to achieve the features we think necessary as well as avoiding awaiting parent data:

```typescript
// Before (v0.0.1)
titleTemplate: 'My Site - {page}'

// After (v1.0.0)
titleTemplate: { route: '/', template: 'My Site - {page}' }
```

#### Migration Guide

**Before (v0.0.1):**

```typescript
// Root layout
export const load = baseMetaLoad({
	title: 'My Site',
	description: 'Welcome'
})

// Page with dynamic data
export const load = advancedMetaLoad(async ({ event, parentTags }) => {
	const post = await fetchPost(event.params.slug)
	return {
		post,
		...parseMeta(parentTags, { title: post.title })
	}
})
```

**After (v1.0.0):**

```typescript
// Root layout
export const load = metaLoad.layout({
	title: 'My Site',
	description: 'Welcome'
})

// Page with dynamic data
export const load = metaLoadWithData.page(({ params, data }) => ({
	title: data.post.title,
	description: data.post.description
}))
```

#### Key Improvements

- **Simplified API**: Clearer function names and purposes
- **Better Type Safety**: Improved TypeScript support throughout
- **Reduced Boilerplate**: Less code needed for common use cases
- **Consistent Patterns**: All functions follow the same pattern for easier learning
- **Parallel Execution**: Removed `await parent` to allow SvelteKit's parallel load function execution

### Features

- New `metaLoad` helper for static metadata
- New `metaLoadWithData` helper for dynamic metadata
- New `addMetaTags` helper for manual integration
- Improved TypeScript definitions
- Better error handling and validation

### Bug Fixes

- Fixed data cascade issues with server load functions
- Improved metadata inheritance behavior
- Better handling of edge cases in metadata merging
