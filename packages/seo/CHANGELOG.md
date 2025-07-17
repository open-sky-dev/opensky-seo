# Changelog

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
