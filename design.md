# SvelteKit-Meta Design

Building a SvelteKit application with more than a handful of routes means managing a lot of `<svelte:head>` tags. Having previously used [11ty's data cascade](https://www.11ty.dev/docs/data-cascade/) and frontmatter metadata, I had been spoiled and knew things could be simpler and easier. After trying lots of the other _good-but-not-great_ packages out there, I decided to do what any self-respecting dev does and build it myself.

You might not like the way sveltekit-meta makes you do some things or you might be wondering why, so in this document I want to explain why and how I arrived at the current design.

## The Three Core Goals

When adding meta/seo tags to a site, there are three requirements:

1. **Data Cascade** - Set metadata at the root level that flows down through your site hierarchy, with the ability to selectively override at any level (Bonus: title templates to intelligently merge data)
2. **Server-Side Rendering** - Ensure metadata is properly rendered during SSR for SEO bots, social media previews, and first page load
3. **Developer Experience** - Make it type-safe, intuitive, and minimize boilerplate

Let's dive into how each of these requirements shaped the package design.

## 1. Data Cascade

The concept of a data cascade is simple on the surface: set a value at the root level, and it flows down to all children unless explicitly overridden. However, implementing this in practice requires careful consideration.

An example:

```typescript
// Root layout
export const load = MetaTags.baseMetaLoad({
  sitename: 'My App',
  icon: './favicon.png',
  title: 'Welcome',
  titleTemplate: '{sitename} - {page}'
});

// Blog section layout
export const load = MetaTags.layoutMetaLoad({
  title: 'Blog'
});

// Individual blog post
export const load = MetaTags.pageMetaLoad({
  title: 'Why Svelte Rocks',
  description: 'A deep dive into Svelte's reactivity model'
});
```

With this setup, your blog post page will have:
- The favicon from the root layout
- The title "My App - Why Svelte Rocks" (processed through the titleTemplate)
- The description from the page itself
- The sitename from the root layout

The cascade works because each level merges its metadata with what it inherits from its parent, with the child's values taking precedence when there are conflicts.

Svelte's built-in `<svelte:head>` kind of does this sometimes but seemed to not always work reliably and it doesn't handle more complicated data cascade merging like title templates, which is a critical feature for consistent site titling.

## 2. Server-Side Rendering: The Load Function Approach

Metadata in the head needs to be server-side rendered for it to be useful for SEO, social media, and previews. These bots don't normally mount the page and run JavaScript - they just grab the response from the server and use that data.

This requirement eliminates a lot of possible solutions. Context APIs and stores may work great for client-side data, but they're not guaranteed to be populated during the initial server render. We need something that works reliably during SSR.

### The Solution: Load Functions

There were lots of failed attempts at creating a meta tags system. I tried Svelte's context API and stores so you could set page and layout data with components instead of having to add `+page.ts` and `+layout.ts` files, but those don't work reliably with Server Side Rendering. I tried using Svelte hooks to read a custom `meta.yaml` file you would add throughout the project. I even briefly attempted to write a Svelte preprocessor that would hook into the build system to compile meta tags.

Alas, the best solution for getting data cascade and server-side rendering is to use load functions defined in `+page.ts` and `+layout.ts` files. SvelteKit runs load functions from the root layout down to your page and allows us to implement a data cascade pretty easily.

The real complications arise when working with server load functions (`+page.server.ts`, `+layout.server.ts`). In testing, I found that most solutions will override the server's returned data if you're not careful. The data from a page's server load function can be lost if the client-side load function doesn't explicitly include it in its return value.

And the data from the cascade is made available anywhere, including the root layout, with the `page` property from `$app/store`. This means we can create a single component that lives at the root layout to take care of mounting all our meta data to the head element for us.

## 3. Developer Experience

Writing load functions is annoying. It's a long way from a simple frontmatter YAML declaration, which is what many developers (myself included) prefer. So I wanted to make it easier.

### Helper Functions

The helper functions (`baseMetaLoad`, `layoutMetaLoad`, `pageMetaLoad`, and `advancedMetaLoad`) are designed to abstract away the complexity of merging data correctly. They handle the tedious work of:

1. Getting parent data with `await parent()`
2. Preserving server data from `event.data`
3. Merging your custom metadata with the inherited data
4. Handling title templates and other special cases

For simple cases, you can just define your metadata:

```typescript
export const load = MetaTags.pageMetaLoad({
  title: 'Contact Us'
});
```

No need to worry about how parent data is fetched or merged - the helper takes care of it all.

### Type Safety

The entire package is built with TypeScript, providing:

- Auto-completion for all metadata properties
- Validation for property types
- Clear documentation through type definitions
- Warnings about deprecated or incorrect usage

The `Metadata` type itself documents all the available properties and their constraints, making it easy to discover what you can set without constantly referring to documentation.

## How It Works: Implementation Guide

Now that we've covered the design principles, let's walk through how to actually use the package in a SvelteKit project.

### Basic Setup

First, you need to set up your root layout to establish your base metadata and mount the `MetaTags` component:

**Root +layout.ts**:
```typescript
import MetaTags from 'sveltekit-meta';

export const load = MetaTags.baseMetaLoad({
  sitename: 'My SvelteKit App',
  icon: './favicon.png',
  title: 'Welcome',
  titleTemplate: '{sitename} - {page}',
  description: 'A fantastic SvelteKit application'
});
```

**Root +layout.svelte**:
```svelte
<script lang="ts">
  import { MetaTags } from 'sveltekit-meta';
  
  let { children } = $props();
</script>

<MetaTags />

{@render children()}
```

The `baseMetaLoad` function establishes the foundation of your site's metadata. The `MetaTags` component reads the metadata from the page store and renders the appropriate tags in the document head.

### Creating Metadata Hierarchies

With the base setup in place, you can now customize metadata at different levels of your routing hierarchy:

**Section +layout.ts**:
```typescript
import MetaTags from 'sveltekit-meta';

export const load = MetaTags.layoutMetaLoad({
  title: 'Products',
  description: 'Browse our full catalog of products'
});
```

**Page +page.ts**:
```typescript
import MetaTags from 'sveltekit-meta';

export const load = MetaTags.pageMetaLoad({
  title: 'Premium Widgets',
  description: 'Our premium widget collection offers unmatched quality'
});
```

Each level merges with and selectively overrides the metadata from its parent. The `titleTemplate` from the root layout ensures that all page titles follow a consistent format.

### Handling Dynamic Routes

For routes with parameters or that require data fetching, the `advancedMetaLoad` helper gives you full control while still handling the merging automatically:

```typescript
import type { PageLoad } from './$types';
import MetaTags from 'sveltekit-meta';

export const load: PageLoad = MetaTags.advancedMetaLoad(async ({ event, parentTags }) => {
  const { slug } = event.params;
  const product = await getProductBySlug(slug);
  
  return {
	product, // This data will be available in your page component
	...MetaTags.parseMeta(parentTags, {
	  title: product.name,
	  description: product.shortDescription,
	  image: product.featuredImage
	})
  };
});
```

Here, the `advancedMetaLoad` gives you access to:
- The full SvelteKit `event` object with route parameters, fetch utilities, etc.
- The `parentTags` from the layout hierarchy
- Full control over data fetching and transformation

The `parseMeta` function then handles the merging of your dynamic metadata with the inherited parent metadata.

### Working with Server Load Functions

One of the trickiest parts of SvelteKit data management is correctly handling data from server load functions. Our helpers automatically preserve this data:

**+page.server.ts**:
```typescript
export async function load() {
  return {
	serverData: await fetchSensitiveDataFromDatabase()
  };
}
```

**+page.ts**:
```typescript
import MetaTags from 'sveltekit-meta';

export const load = MetaTags.pageMetaLoad({
  title: 'Dashboard'
});
```

Without our helpers, the `serverData` would be lost when the page load function runs. But with `pageMetaLoad`, it's automatically preserved and merged with your metadata.

## Conclusion

Building `sveltekit-meta` required working within SvelteKit's architecture to create a system that feels natural and integrated. By leveraging load functions and carefully managing data inheritance, we've created a solution that:

1. Preserves the data cascade pattern
2. Works seamlessly with server-side rendering
3. Minimizes boilerplate with helper functions
4. Provides type safety and validation

The result is a package that makes managing metadata in SvelteKit applications straightforward, even as your site grows in complexity.

Future plans include:
- Adding support for more metadata properties
- Creating a comprehensive documentation site
- Providing more example code and recipes
- Exploring alternative ways to define metadata while maintaining SSR compatibility

Is it perfect? Not yet! But it solves the core challenges of metadata management in a way that feels natural to SvelteKit development.

Give it a try in your next project, and let me know what you think!
