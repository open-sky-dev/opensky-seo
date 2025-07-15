# Changelog

## [1.0.0] - 2024-12-19

### Breaking Changes

This is a major refactor of the SvelteKit Meta API to provide better modularity and clearer separation of concerns.

#### API Restructure

- **Removed**: `baseMetaLoad`, `layoutMetaLoad`, `pageMetaLoad`, `advancedMetaLoad`, `parseMeta` functions
- **Added**: New modular API with three main categories:
  - `metaLoad` - For static metadata (no access to load context)
  - `metaLoadWithData` - For dynamic metadata (with access to load context)
  - `addMetaTags` - For manual integration with existing load functions

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
- **Automatic Data Handling**: No need to manually handle parent data or server data merging

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
