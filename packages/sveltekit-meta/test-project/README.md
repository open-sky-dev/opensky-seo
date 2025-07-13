# SvelteKit Meta Test Project

This is a comprehensive test project for the SvelteKit Meta package that demonstrates all the core functionality in a real SvelteKit environment.

## 🚀 Quick Start

```bash
# From the sveltekit-meta package directory
cd test-project

# Install dependencies
npm install

# Build the sveltekit-meta package (required first)
cd ..
npm run build
cd test-project

# Start the development server
npm run dev
```

Then open your browser to `http://localhost:5173` and start testing!

## 🧪 What This Tests

### Core Functionality

#### 1. **Basic Metadata Inheritance** 
- **Route:** `/` (Home)
- **Tests:** Basic page metadata with title template application
- **Expected Title:** "Home | SvelteKit Meta Test"

#### 2. **Metadata Overriding**
- **Route:** `/about`
- **Tests:** Complex metadata overriding with multiple authors, rich images
- **Expected Title:** "About Us | SvelteKit Meta Test"

#### 3. **Nested Layout Metadata**
- **Route:** `/blog` and `/blog/post-1`
- **Tests:** How nested layouts override and extend metadata
- **Expected Titles:** 
  - Blog: "Blog Home | Blog | SvelteKit Meta Test"
  - Post: "First Blog Post | Blog | SvelteKit Meta Test"

#### 4. **Advanced Dynamic Metadata**
- **Route:** `/blog/advanced`
- **Tests:** `advancedMetaLoad` with dynamic data and additional tags
- **Expected Title:** "Advanced Dynamic Post | Blog | SvelteKit Meta Test"

#### 5. **Sibling Page Behavior**
- **Route:** `/sibling`
- **Tests:** How pages at the same level as layouts behave
- **Expected Title:** "Sibling Page | SvelteKit Meta Test" (note: NO "Blog" section)

## 🔍 How to Test

### 1. **Browser Tab Titles**
Navigate between pages and check that the browser tab titles match the expected values above.

### 2. **View Source / Dev Tools**
- Right-click → "View Page Source" or use F12 Developer Tools
- Look in the `<head>` section for meta tags
- Check for proper `og:title`, `twitter:title`, `og:description`, etc.

### 3. **Metadata Debug Section**
Each page includes a debug section at the bottom showing the raw metadata object. Use this to verify:
- Proper inheritance from parent layouts
- Correct overriding of specific properties
- Title template application

### 4. **Key Meta Tags to Verify**

#### Root Layout Provides:
```html
<meta property="og:site_name" content="SvelteKit Meta Test Site" />
<meta name="twitter:site" content="@sveltekit" />
<link rel="icon" href="/favicon.png" />
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
```

#### Page-Specific Examples:
```html
<!-- Home page -->
<title>Home | SvelteKit Meta Test</title>
<meta property="og:title" content="Home | SvelteKit Meta Test" />
<meta property="og:image" content="/home-image.jpg" />

<!-- Blog layout adds -->
<meta name="twitter:creator" content="@blogteam" />

<!-- Advanced page adds -->
<meta name="keywords" content="sveltekit, metadata, advanced" />
<link rel="alternate" type="application/rss+xml" href="/blog/rss.xml" />
```

## 📋 Test Scenarios

### Scenario 1: Title Template Inheritance
1. Go to `/` - should show "Home | SvelteKit Meta Test"
2. Go to `/blog` - should show "Blog Home | Blog | SvelteKit Meta Test"
3. Go to `/sibling` - should show "Sibling Page | SvelteKit Meta Test" (no "Blog")

### Scenario 2: Metadata Cascading
1. Compare metadata between `/` and `/about` - both should have site name, but different authors
2. Compare `/blog` vs `/blog/post-1` - post should override some blog layout metadata
3. Check `/sibling` - should NOT have blog-specific metadata

### Scenario 3: Dynamic Metadata
1. Go to `/blog/advanced`
2. Check that description includes view count (1337)
3. Look for custom meta tags like `keywords` and RSS link

### Scenario 4: Rich Media Metadata
1. Go to `/about` - should have image with width, height, alt text
2. Go to `/blog/post-1` - should have publication and modification dates
3. Check that Twitter cards use the first image when multiple images exist

## 🐛 Common Issues to Watch For

1. **Title Template Not Applied:** If titles don't include the template, check that `parentTitleTemplate` is in the metadata debug
2. **Missing Inherited Metadata:** If page-specific metadata is missing inherited properties, check the layout cascade
3. **Wrong Title Template:** If sibling pages use blog templates, there's an inheritance issue
4. **Duplicate Meta Tags:** Each meta property should appear only once in the final HTML

## 🔧 Extending the Tests

To add more test scenarios:

1. **Add a new route:** Create `+page.ts` and `+page.svelte` files
2. **Test specific metadata:** Use the appropriate load function (`pageMetaLoad`, `layoutMetaLoad`, etc.)
3. **Add to navigation:** Update the main navigation in `src/routes/+layout.svelte`
4. **Document expected behavior:** Add to this README

## 📝 Expected Results Summary

| Route | Title Template Source | Expected Title |
|-------|----------------------|----------------|
| `/` | Root layout | "Home \| SvelteKit Meta Test" |
| `/about` | Root layout | "About Us \| SvelteKit Meta Test" |
| `/blog` | Blog layout | "Blog Home \| Blog \| SvelteKit Meta Test" |
| `/blog/post-1` | Blog layout | "First Blog Post \| Blog \| SvelteKit Meta Test" |
| `/blog/advanced` | Blog layout | "Advanced Dynamic Post \| Blog \| SvelteKit Meta Test" |
| `/sibling` | Root layout | "Sibling Page \| SvelteKit Meta Test" |

## 🎯 Success Criteria

✅ **All browser tab titles match the expected format**  
✅ **Meta tags are properly rendered in HTML head**  
✅ **Metadata inheritance works correctly through layout hierarchy**  
✅ **Sibling pages don't inherit from neighboring layouts**  
✅ **Dynamic metadata generation works with `advancedMetaLoad`**  
✅ **Additional custom meta tags are rendered correctly**  

If all these work correctly, your SvelteKit Meta package is functioning properly! 🎉