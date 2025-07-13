<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="page">
	<h1>Advanced Dynamic Example</h1>
	<p class="meta-info">
		<strong>Title:</strong> {data.dynamicData.title} | 
		<strong>Views:</strong> {data.dynamicData.viewCount} | 
		<strong>Tags:</strong> {data.dynamicData.tags.join(', ')}
	</p>

	<p>
		This page demonstrates the <code>advancedMetaLoad</code> function with:
	</p>

	<ul>
		<li><strong>Dynamic Metadata:</strong> Generated based on simulated API data</li>
		<li><strong>Custom Title Template Application:</strong> Uses the blog layout's title template</li>
		<li><strong>Additional Tags:</strong> Custom meta tags, keywords, and RSS link</li>
		<li><strong>Full Control:</strong> Complete access to event, parentTags, and custom logic</li>
	</ul>

	<h2>Dynamic Data Used:</h2>
	<div class="data-display">
		<pre>{JSON.stringify(data.dynamicData, null, 2)}</pre>
	</div>

	<h2>What advancedMetaLoad Does:</h2>
	<ol>
		<li>Receives the SvelteKit load event and parent metadata</li>
		<li>Fetches or computes dynamic data (simulated here)</li>
		<li>Uses <code>parseMeta()</code> to merge parent and dynamic metadata</li>
		<li>Returns combined result with metadata and page data</li>
	</ol>

	<h2>Expected Results:</h2>
	<ul>
		<li><strong>Title:</strong> "Advanced Dynamic Post | Blog | SvelteKit Meta Test"</li>
		<li><strong>Dynamic Description:</strong> Includes tags and view count</li>
		<li><strong>Keywords Meta Tag:</strong> Generated from tags array</li>
		<li><strong>RSS Link:</strong> Added as additional tag</li>
		<li><strong>Article Tag:</strong> First tag as article:tag property</li>
	</ul>

	<h2>Additional Meta Tags to Check:</h2>
	<ul>
		<li><code>&lt;meta name="keywords" content="sveltekit, metadata, advanced" /&gt;</code></li>
		<li><code>&lt;meta property="article:tag" content="sveltekit" /&gt;</code></li>
		<li><code>&lt;link rel="alternate" type="application/rss+xml" href="/blog/rss.xml" /&gt;</code></li>
	</ul>

	<div class="content">
		<h3>Why Use advancedMetaLoad?</h3>
		<p>
			The <code>advancedMetaLoad</code> function is perfect when you need:
		</p>
		<ul>
			<li>Dynamic metadata based on route parameters</li>
			<li>Metadata computed from API responses</li>
			<li>Complex logic for generating meta tags</li>
			<li>Access to the full SvelteKit load event</li>
			<li>Custom additional meta tags</li>
		</ul>
		
		<p>
			It handles all the tedious work of merging parent data and server data while 
			giving you full control over the metadata generation process.
		</p>
	</div>
</div>

<style>
	.page {
		max-width: 800px;
	}

	h1 {
		color: #333;
		margin-bottom: 0.5rem;
	}

	.meta-info {
		color: #666;
		font-style: italic;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #eee;
	}

	h2 {
		color: #666;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	h3 {
		color: #555;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	ul, ol {
		margin: 1rem 0;
		padding-left: 2rem;
	}

	li {
		margin: 0.5rem 0;
	}

	code {
		background: #f0f0f0;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
	}

	.data-display {
		background: #f8f8f8;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 1rem;
		margin: 1rem 0;
	}

	.data-display pre {
		margin: 0;
		font-size: 0.9rem;
		overflow-x: auto;
	}

	.content {
		background: #f0f8ff;
		padding: 1.5rem;
		border-radius: 6px;
		margin-top: 2rem;
		border-left: 4px solid #0066cc;
	}

	.content p {
		margin: 1rem 0;
	}

	.content ul {
		margin: 0.5rem 0;
	}
</style>