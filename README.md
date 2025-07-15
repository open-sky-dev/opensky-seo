# SvelteKit Meta

A powerful, lightweight solution for managing meta tags in SvelteKit applications with intelligent data cascading.

You define your metadata in `+page.ts` or `+layout.ts` load functions, using our helper functions for simpler code - like so:

```typescript
// src/routes/blog/[slug]/+page.ts
import { metaLoadWithData } from "sveltekit-meta";

export const load = metaLoadWithData.page(({ params, data }) => ({
  title: data.post.title,
  description: "This is a detailed description of my blog post",
}));
```

Ask [ChatGPT Questions](https://chatgpt.com/share/67fc80e9-b368-800d-9689-d0965fae8b86)

Read [blog post](https://github.com/notnotjake/sveltekit-meta/blob/master/design.md)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
  - [Data Cascade](#data-cascade)
  - [Available Helpers](#available-helpers)
- [Advanced Usage](#advanced-usage)
  - [Accessing Route Parameters](#accessing-route-parameters)
  - [Handling Server Data](#handling-server-data)
  - [Debugging](#debugging)
- [Supported Metadata Properties](#supported-metadata-properties)
- [Migration Guide](#migration-guide)
- [License](#license)

## Features

- **Data Cascade**: Define meta tags at the root level and override selectively at deeper levels
- **Simple API**: Straightforward helper functions for common load function patterns
- **Type Safe**: Fully typed with TypeScript for better developer experience
- **Flexible Integration**: Works with SvelteKit's layout and page structure
- **Performance Optimized**: Minimal runtime overhead
- **SEO-friendly warnings**: Fully supports server-side rendering! Plus built in warnings for meta tag issues

## Installation

```bash
bun add sveltekit-meta
# or
pnpm add sveltekit-meta
# or
npm install sveltekit-meta
```

## Quick Start

### 1. Set up base metadata in your root layout

```typescript
// src/routes/+layout.ts
import { metaLoad } from "sveltekit-meta";

export const load = metaLoad.layout({
  sitename: "My SvelteKit App",
  title: "Welcome",
  titleTemplate: "My SvelteKit App - {page}",
  description: "A fantastic SvelteKit application",
  icon: "./favicon.png",
});
```

### 2. Add the MetaTags component to your root layout template

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { MetaTags } from 'sveltekit-meta';

  let { children } = $props();
</script>

<MetaTags />

{@render children()}
```

### 3. Override metadata in pages or nested layouts

```typescript
// src/routes/blog/+layout.ts
import { metaLoad } from "sveltekit-meta";

export const load = metaLoad.layout({
  title: "Blog",
  titleTemplate: "Svelte Blog - {page}",
  description: "Read our latest articles and updates",
});
```

```typescript
// src/routes/blog/[slug]/+page.ts
import { metaLoadWithData } from "sveltekit-meta";

export const load = metaLoadWithData.page(({ params, data }) => ({
  title: data.post.title,
  description: "This is a detailed description of my blog post",
}));
```

And that's it! Your meta tags will be automatically generated and updated across your site.

## Core Concepts

### Data Cascade

SvelteKit Meta uses a data cascade pattern to efficiently manage metadata:

1. **Base Metadata**: Set at the root layout level or anywhere else in the project to override and start fresh.
2. **Layout Metadata**: Each layout can extend or override parent metadata. Unlike other tools, you can have many layers of layout metadata set.
3. **Page Metadata**: Pages can further customize metadata for specific routes

Metadata flows down through your application's routing hierarchy, with lower levels being able to selectively override higher-level values.

The provided helpers for writing the load functions take care of passing parent data and data from any `+page.server.ts` load functions down to the page. Other packages will lose the data from page server load functions, but using these helpers ensures that the page receives everything from the data cascade.

### Available Helpers

SvelteKit Meta provides several helper functions to simplify integration. You still have to create `+page.ts` and `+layout.ts` files but these make it simpler to define your meta tags with minimal boilerplate code

#### `metaLoad` - Static Metadata

Use these functions when you have metadata that doesn't depend on route parameters or server data.

- **`metaLoad.page(metaTags)`** - Creates a page load function with static metadata
- **`metaLoad.layout(metaTags)`** - Creates a layout load function with static metadata
- **`metaLoad.resetLayout(metaTags)`** - Creates a reset layout load function with static metadata

#### `metaLoadWithData` - Dynamic Metadata

Use these functions when you need to access route parameters, server data, or other context to generate metadata.

- **`metaLoadWithData.page(callback)`** - Creates a page load function with dynamic metadata
- **`metaLoadWithData.layout(callback)`** - Creates a layout load function with dynamic metadata
- **`metaLoadWithData.resetLayout(callback)`** - Creates a reset layout load function with dynamic metadata

#### `addMetaTags` - Manual Integration

Use these functions when you want full control over your load function but still want to add metadata.

- **`addMetaTags.page(metaTags)`** - Adds page metadata to load function return value
- **`addMetaTags.layout(metaTags)`** - Adds layout metadata to load function return value
- **`addMetaTags.resetLayout(metaTags)`** - Adds reset layout metadata to load function return value

## Advanced Usage

### Accessing Route Parameters

For dynamic routes, you can use the `metaLoadWithData` helper to incorporate route parameters:

```typescript
// src/routes/blog/[slug]/+page.ts
import { metaLoadWithData } from "sveltekit-meta";

export const load = metaLoadWithData.page(({ params, data }) => {
  const { slug } = params;

  // Fetch article data based on slug
  const article = await getArticleBySlug(slug);

  return {
    title: article.title,
    description: article.excerpt,
    image: article.featuredImage,
  };
});
```

### Handling Server Data

The `metaLoadWithData` helper automatically merges parent data, server data, and your callback's result:

```typescript
// +page.server.ts
export async function load() {
  return {
    serverData: await fetchSomeData(),
  };
}

// +page.ts
export const load = metaLoadWithData.page(({ data }) => {
  // serverData is automatically available in your page component
  return {
    title: "Page with Server Data",
    description: data.serverData.description,
  };
});
```

### Manual Integration

If you need full control over your load function, you can use the `addMetaTags` helpers:

```typescript
// +page.ts
export async function load({ data, route, params, url }) {
  const post = await fetchPost(params.slug);

  return {
    ...data,
    post,
    ...addMetaTags.page({ title: post.title }),
  };
}

// +layout.ts
export async function load({ data, route, params }) {
  const section = await fetchSection();

  return {
    ...data,
    section,
    ...addMetaTags.layout({ title: section.title }),
  };
}
```

### Debugging

Enable debug mode to see detailed logs during development:

```typescript
import { enableDebug } from "sveltekit-meta";

// Enable debug logs (disable in production)
enableDebug(import.meta.env.DEV);
```

## Migration Guide

If you're upgrading from v0.0.1, here's how to migrate your code:

### Before (v0.0.1)

```typescript
// Root layout
export const load = baseMetaLoad({
  title: "My Site",
  description: "Welcome",
});

// Page with dynamic data
export const load = advancedMetaLoad(async ({ event, parentTags }) => {
  const post = await fetchPost(event.params.slug);
  return {
    post,
    ...parseMeta(parentTags, { title: post.title }),
  };
});
```

### After (v1.0.0)

```typescript
// Root layout
export const load = metaLoad.layout({
  title: "My Site",
  description: "Welcome",
});

// Page with dynamic data
export const load = metaLoadWithData.page(({ params, data }) => ({
  title: data.post.title,
  description: data.post.description,
}));
```

## Supported Metadata Properties

SvelteKit Meta supports a comprehensive range of metadata properties:

| Property         | Description                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `canonical`      | Canonical URL for the page (og:url, link:rel:canonical)                                        |
| `icon`           | Favicon path as string or IconOpinionated object                                               |
| `maskIcon`       | Object with `url` (svg file) and optional `color` (hex) for Safari Pinned Tabs                 |
| `theme`          | Theme color for browser UI elements (string or `{ light, dark }` object)                       |
| `colorScheme`    | Color scheme preference for the page (meta:color-scheme)                                       |
| `sitename`       | Name of the website (og:sitename)                                                              |
| `title`          | Page title (warns if > 70 characters) (og:title, meta:title)                                   |
| `titleTemplate`  | Template for constructing child page titles (e.g., "Reviews - {page}")                         |
| `description`    | Page description (warns if > 200 characters) (og:description, twitter:description)             |
| `author`         | Content author(s) as string or array (meta:author, og:author)                                  |
| `twitterSite`    | The X Account for the publishing site (twitter:site)                                           |
| `twitterCreator` | The X Account for the author/creator of this page (twitter:creator)                            |
| `date`           | Publication date in ISO 8601 format (og meta)                                                  |
| `modified`       | Last modified date (og:modified-time, meta:modified, meta:last-modified)                       |
| `type`           | Content type configuration (`basic`, `article`, `largeImage`, `player` or ContentTypeAdvanced) |
| `image`          | Primary image for social sharing (string or Media object)                                      |
| `images`         | Multiple images for social sharing (array of Media objects)                                    |
| `video`          | Primary video for social sharing (string or Media object)                                      |
| `videos`         | Multiple videos for social sharing (array of Media objects)                                    |

### Media Object Structure

Media objects for images and videos can include:

```typescript
type Media = {
  url: string; // Primary URL for the media resource
  secureUrl?: string; // HTTPS URL for the media resource
  type?: string; // MIME type of the media
  width?: number; // Width in pixels
  height?: number; // Height in pixels
  alt?: string; // Alt text description
};
```

### Icon Configuration

Icons can be configured with more advanced options:

```typescript
type IconOpinionated = {
  svg?: string;
  small?: {
    url: string;
    size: number;
    type?: string;
  };
  large?: {
    url: string;
    size: number;
    type?: string;
  };
};
```

### Content Type Configuration

Content type can be configured with advanced options for different platforms:

```typescript
type ContentTypeAdvanced = {
  twitter: "summary" | "largeImage" | "player";
  og: "website" | "article";
};
```

> Note: Properties like `image`/`images` and `video`/`videos` are mutually exclusive. The library will warn and use the plural version if both are specified.

## License

MIT License
