# SvelteKit Meta Integration Testing

You're absolutely right that unit tests alone aren't sufficient for a SvelteKit package! I've created a comprehensive integration test project that runs in a real SvelteKit environment.

## What's Been Created

### 🎯 **Full SvelteKit Test Project**
Location: `test-project/`

This is a complete, runnable SvelteKit application that demonstrates and tests all the metadata functionality in practice.

### 🚀 **Quick Start Commands**

```bash
# Install test project dependencies
npm run test-project:install

# Build the package and run the test project
npm run test-project:dev
```

Then open `http://localhost:5173` and start testing!

## 📋 **What Gets Tested**

### 1. **Real Browser Testing**
- ✅ Actual browser tab titles
- ✅ HTML `<head>` meta tag generation
- ✅ Social media meta tags (OpenGraph, Twitter)
- ✅ SEO meta tags

### 2. **Metadata Cascading Scenarios**
- ✅ **Root Layout** (`/`) - Base metadata with title template
- ✅ **Simple Pages** (`/about`) - Metadata overriding
- ✅ **Nested Layouts** (`/blog/*`) - Layout inheritance
- ✅ **Sibling Pages** (`/sibling`) - Same-level-as-layout behavior
- ✅ **Dynamic Metadata** (`/blog/advanced`) - `advancedMetaLoad` usage

### 3. **Title Template Behavior**
This was your key concern - the test project validates:
- ✅ Root layout: `"{page} | SvelteKit Meta Test"`
- ✅ Blog layout: `"{page} | Blog | SvelteKit Meta Test"`
- ✅ Sibling pages use root template (not blog template)
- ✅ Nested pages use their layout's template

### 4. **Real SvelteKit Features**
- ✅ Actual SvelteKit load functions
- ✅ Real route structure and navigation
- ✅ Server-side rendering compatibility
- ✅ Client-side navigation

## 🔍 **How to Verify Everything Works**

### Browser Tab Titles
Navigate between these pages and check titles:
- `/` → "Home | SvelteKit Meta Test"
- `/blog` → "Blog Home | Blog | SvelteKit Meta Test"
- `/sibling` → "Sibling Page | SvelteKit Meta Test" (no "Blog"!)

### HTML Head Tags
Use browser dev tools or "View Source":
- Check for `<title>`, `<meta property="og:title">`, etc.
- Verify inheritance and overriding
- Look for custom additional tags

### Metadata Debug
Each page shows the raw metadata object at the bottom for debugging.

## 🎯 **Test Routes & Expected Behavior**

| Route | Purpose | Expected Title |
|-------|---------|----------------|
| `/` | Basic metadata | "Home \| SvelteKit Meta Test" |
| `/about` | Metadata overriding | "About Us \| SvelteKit Meta Test" |
| `/blog` | Nested layout | "Blog Home \| Blog \| SvelteKit Meta Test" |
| `/blog/post-1` | Deep nesting | "First Blog Post \| Blog \| SvelteKit Meta Test" |
| `/blog/advanced` | Dynamic metadata | "Advanced Dynamic Post \| Blog \| SvelteKit Meta Test" |
| `/sibling` | Sibling page behavior | "Sibling Page \| SvelteKit Meta Test" |

## 🧪 **Specific Test Scenarios**

### Scenario 1: Title Template Inheritance
**Test:** Compare `/blog/post-1` vs `/sibling`
**Expected:** Blog post includes "Blog", sibling page doesn't

### Scenario 2: Metadata Overriding  
**Test:** Compare author fields across pages
**Expected:** Each page can override parent metadata

### Scenario 3: Dynamic Metadata
**Test:** Check `/blog/advanced` description
**Expected:** Includes dynamic view count and tags

### Scenario 4: Additional Meta Tags
**Test:** Look for custom keywords and RSS link on advanced page
**Expected:** Custom meta tags are rendered

## ✅ **Success Criteria**

The integration tests pass when:
1. **All browser tab titles match expected format**
2. **HTML head contains proper meta tags**
3. **Metadata inheritance works through layout hierarchy**
4. **Sibling pages don't inherit from neighboring layouts**
5. **Dynamic metadata generation works correctly**
6. **Custom additional meta tags are rendered**

## 🔧 **Extending the Tests**

To add more test scenarios:
1. Create new routes in `test-project/src/routes/`
2. Use appropriate load functions (`pageMetaLoad`, `layoutMetaLoad`, etc.)
3. Add navigation links to test easily
4. Document expected behavior

## 🎉 **Why This is Better Than Unit Tests Alone**

1. **Real Environment**: Tests actual SvelteKit behavior, not mocks
2. **Visual Verification**: You can see titles in browser tabs
3. **HTML Validation**: Actual meta tags in real HTML
4. **Integration Issues**: Catches problems unit tests miss
5. **User Experience**: Tests what users actually see

This integration test project gives you confidence that your SvelteKit Meta package works correctly in real-world usage!