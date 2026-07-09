# @opensky/seo Design

Building a SvelteKit application with more than a handful of routes means managing a lot of `<svelte:head>` tags. Having previously used [11ty's data cascade](https://www.11ty.dev/docs/data-cascade/) and frontmatter metadata, I had been spoiled and knew things could be simpler and easier. After trying lots of the other _good-but-not-great_ packages out there, I decided to do what any self-respecting dev does and build it myself.

You might not like the way @opensky/seo makes you do some things or you might be wondering why, so in this document I want to explain why and how I arrived at the current design.

## The Three Core Goals

When adding meta/seo tags to a site, there are three requirements:

1. **Data Cascade** - Set metadata at the root level that flows down through your site hierarchy, with the ability to selectively override at any level (Bonus: title templates to intelligently merge data)
2. **Server-Side Rendering** - Ensure metadata is properly rendered during SSR for SEO bots, social media previews, and first page load
3. **Developer Experience** - Make it type-safe, intuitive, and minimize boilerplate

Let's dive into how each of these requirements shaped the package design.

## 1. Server-Side Rendering: The Load Function Approach

Metadata in the head needs to be server-side rendered for it to be useful for SEO, social media, and previews. These bots don't normally mount the page and run JavaScript - they just grab the response from the server and use that data.

This requirement eliminates a lot of possible solutions. There were lots of failed attempts at creating a meta tags system. I tried Svelte's context API and stores so you could set page and layout data with components instead of having to add `+page.ts` and `+layout.ts` files, but those don't work reliably with server-side rendering - they're not guaranteed to be populated during the initial server render. I tried using Svelte hooks to read a custom `meta.yaml` file you would add throughout the project. I even briefly attempted to write a Svelte preprocessor that would hook into the build system to compile meta tags.

Alas, the best solution for getting data cascade and server-side rendering is to use load functions defined in `+page.ts` and `+layout.ts` files. SvelteKit runs load functions from the root layout down to your page, and the merged result is available everywhere - including the root layout - via `page.data` from `$app/state`. This means one component (`SeoTags`), mounted once in the root layout, can render every tag into `<svelte:head>` for the whole site, fully server-rendered.

## 2. Data Cascade: Letting SvelteKit Do the Merging

SvelteKit shallow-merges the return values of every load function on the way down to `page.data`: for any given top-level key, the deepest load function that returned it wins. That *is* a data cascade - the trick is shaping our data so that SvelteKit's merge produces the behavior we want, without any coordination between levels.

Each metadata property becomes its own top-level key with a `_meta` prefix: `title` becomes `_meta-title`, `description` becomes `_meta-description`, and so on. A page that sets `title` overrides only `_meta-title`; everything else it inherits untouched. The prefix keeps our keys from colliding with your own load data.

### Why not `await parent()`?

An earlier version of this package merged metadata explicitly: each load function awaited its parent's data, merged the tags, and passed the result down. It worked, but it had two real costs:

1. **It serializes the waterfall.** SvelteKit runs load functions in parallel; `await parent()` forces each level to wait for the one above it.
2. **It multiplies re-runs.** A load function that consumes parent data re-runs whenever any parent's data invalidates.

The per-key cascade needs neither. Each load function returns only its own keys and never reads anyone else's, so everything stays parallel. The cost of this choice is that no load function can see the accumulated cascade - a constraint that shaped the title template design below.

A second subtlety: server load functions. The data from `+page.server.ts` is handed to the universal load function as `event.data`, and if your `+page.ts` doesn't explicitly spread it into its return value, it's lost. In testing, I found most metadata solutions drop it. The helpers in this package always spread `...data` into their return, so the server data cascade stays intact.

### Resetting

Sometimes a section of the site (an admin area, an embedded app) shouldn't inherit the marketing site's metadata. Since a child can't remove a parent's keys from the merge, `resetLayout` instead writes an explicit `null` for every known metadata key - nulling beats inheriting, and the renderer treats null as absent. The key list is derived from the metadata type at compile time (`satisfies Record<keyof BaseMetadata, null>`), so it can't silently drift as properties are added.

## 3. Title Templates: The Hard Part

A title template is a pattern like `"My Site - {page}"` set in a layout, applied to the titles of pages below it. This sounds like just another cascading property, but it isn't, for one reason: **the template and the title come from different levels of the tree, and the obvious encoding destroys the information needed to combine them correctly.**

Consider `/staff` with a layout that sets `title: 'Staff'` and a template `'Staff: {page}'` for its children, under a root layout with template `'My Site - {page}'`. Two requirements:

- At `/staff/jeff`, the staff template should apply: "Staff: Jeff".
- At `/staff` itself, the *root* template should apply: "My Site - Staff" - not "Staff: Staff". A section's template is for its children, not its own landing page.

If `titleTemplate` were a single cascading key, the staff layout's template would simply overwrite the root's, and both requirements become unanswerable - by the time the renderer runs, it can't know there ever were two templates, or where each came from.

### Why not accumulate templates in one object?

The natural fix is a single key holding all templates: `{ '/': ..., '/staff': ... }`, appended to at each level. But SvelteKit's merge is shallow - the staff layout's object would *replace* the root's, not extend it. Extending it requires reading the parent's object, which means `await parent()`, which reintroduces exactly the serialization and re-run costs the architecture avoids. I tried this; it's not worth it.

### The actual solution: the route is the key

Instead, every template gets its **own** top-level key, with its route embedded verbatim:

```
_meta-titleTemplate:/          →  "My Site - {page}"
_meta-titleTemplate:/staff     →  "Staff: {page}"
_meta-titleTemplate:/blog/[slug] →  "{page} | Blog"
```

Different routes produce different keys, so SvelteKit's shallow merge keeps them all - the cascade accumulates templates for free, with zero coordination and zero `await parent()`. (An earlier revision sanitized the route into the key - `/blog/[slug]` became `_meta_blog_slug-title-template` - but that encoding was lossy: dynamic segments, route groups, underscores, and uppercase couldn't survive the round trip, and matching silently failed. JS object keys accept any string, so the route just goes in verbatim. Lossless by construction.)

At render time, `SeoTags` collects the template keys from `page.data` and resolves the winner against the current `page.route.id` (the route *pattern*, so `[slug]` pages and `(group)` segments behave correctly):

- A template applies to routes **strictly below** its route - that's the own-route exclusion that makes `/staff` render "My Site - Staff".
- The root (`/`) template is the fallback for every other route, but the own-route exclusion applies to it too: the home page renders its title verbatim. (There's no `title.absolute`-style escape hatch, so if the root template also formatted `/`, a plain untemplated home title would be unexpressible.)
- Among matches, the deepest route wins.

Because the load helpers receive the SvelteKit event, they know `event.route.id` - so the route in a template is optional. Writing `titleTemplate: 'Staff: {page}'` in a layout automatically scopes it to that layout's route, which is what you mean 99% of the time. The `{ route, template }` form remains for explicit scoping, and `resetLayout` writes a boundary marker so inherited templates (whose dynamic keys can't be enumerated and nulled) are ignored beyond the reset.

## 4. Developer Experience

Writing load functions is annoying. It's a long way from a simple frontmatter YAML declaration, which is what many developers (myself included) prefer. So the package ships three tiers of helpers, from most to least magic:

- **`metaLoad.{page,layout,resetLayout}(tags)`** - static metadata; the helper generates the whole load function.
- **`metaLoadWithData.{...}(callback)`** - dynamic metadata; the callback (sync or async) receives `{ data, route, params, url }`.
- **`addMetaTags.{...}(tags, routeId?)`** - full manual control; returns an object you spread into your own load function's return.

All three funnel through the same transform, and all of them preserve parent and server data automatically.

### Type safety over runtime validation

The package used to ship a schema-validation library to warn about malformed metadata at runtime, in the browser console. That was the wrong place twice over: the warnings arrive after the fact, and every visitor pays the bundle cost for checks meant for the developer. The current design moves everything as early as possible:

- **Compile time**: the metadata types are plain TypeScript, and genuinely invalid states are unrepresentable - `image`/`images` (and `video`/`videos`) are mutually exclusive via XOR unions, so passing both is a red squiggle in your editor, not a console warning in production.
- **Dev only**: advisories that depend on runtime values (title length, description length - often dynamic CMS data no static tool can see) are gated behind `import.meta.env.DEV`. Vite replaces that statically, so the entire warning path is dead-code-eliminated from production builds.

The result is a package with **zero runtime dependencies**.

## Conclusion

Working within SvelteKit's architecture rather than against it turned out to be the whole game:

1. Load functions give reliable SSR.
2. Per-key data shapes let SvelteKit's own shallow merge implement the cascade - in parallel, with no `await parent()`.
3. Routes embedded verbatim in keys let multiple title templates coexist in that merge and be resolved precisely at render time.
4. TypeScript carries the validation load at compile time, so nothing ships to the client but the tags themselves.

Is it perfect? Not yet! But it solves the core challenges of metadata management in a way that feels natural to SvelteKit development.

Give it a try in your next project, and let me know what you think!
