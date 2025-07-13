<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="page">
	<h1>About Us</h1>
	<p>
		This page demonstrates metadata overriding and advanced features:
	</p>

	<ul>
		<li><strong>Title Override:</strong> "About Us | SvelteKit Meta Test"</li>
		<li><strong>Multiple Authors:</strong> Array of authors instead of single string</li>
		<li><strong>Rich Image Metadata:</strong> Image with alt text, dimensions</li>
		<li><strong>Content Type:</strong> Set to "article" type</li>
		<li><strong>Publication Date:</strong> ISO 8601 formatted date</li>
	</ul>

	<h2>What to Check:</h2>
	<ol>
		<li>Title should be "About Us | SvelteKit Meta Test"</li>
		<li>Multiple authors should appear in meta tags</li>
		<li>Image should have width, height, and alt attributes</li>
		<li>Content type should be set to "article"</li>
		<li>Publication date should be present</li>
	</ol>

	<h2>Expected Meta Tags (in addition to inherited):</h2>
	<ul>
		<li><code>&lt;title&gt;About Us | SvelteKit Meta Test&lt;/title&gt;</code></li>
		<li><code>&lt;meta name="author" content="John Doe, Jane Smith" /&gt;</code></li>
		<li><code>&lt;meta property="article:author" content="John Doe" /&gt;</code></li>
		<li><code>&lt;meta property="article:author" content="Jane Smith" /&gt;</code></li>
		<li><code>&lt;meta property="og:image" content="/about-image.jpg" /&gt;</code></li>
		<li><code>&lt;meta property="og:image:width" content="1200" /&gt;</code></li>
		<li><code>&lt;meta property="og:image:height" content="630" /&gt;</code></li>
		<li><code>&lt;meta property="og:image:alt" content="About us hero image" /&gt;</code></li>
		<li><code>&lt;meta property="og:type" content="article" /&gt;</code></li>
		<li><code>&lt;meta property="article:published_time" content="2024-01-15T10:00:00Z" /&gt;</code></li>
	</ul>
</div>

<style>
	.page {
		max-width: 800px;
	}

	h1 {
		color: #333;
		margin-bottom: 1rem;
	}

	h2 {
		color: #666;
		margin-top: 2rem;
		margin-bottom: 1rem;
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
		word-break: break-all;
	}
</style>