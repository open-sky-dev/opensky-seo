<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="page">
	<h1>Home Page</h1>
	<p>
		This is the home page of the SvelteKit Meta test project. It demonstrates:
	</p>

	<ul>
		<li><strong>Title Template:</strong> Should show "Home | SvelteKit Meta Test" in browser tab</li>
		<li><strong>Basic Metadata:</strong> Title, description, canonical URL, and image</li>
		<li><strong>Inherited Metadata:</strong> Site name, theme colors, Twitter site, etc.</li>
	</ul>

	<h2>What to Check:</h2>
	<ol>
		<li>Open browser dev tools and check the <code>&lt;head&gt;</code> section</li>
		<li>Look for proper meta tags like <code>og:title</code>, <code>twitter:title</code>, etc.</li>
		<li>Verify the title template is applied correctly in the browser tab</li>
		<li>Check that inherited metadata from the root layout is present</li>
	</ol>

	<h2>Expected Meta Tags:</h2>
	<ul>
		<li><code>&lt;title&gt;Home | SvelteKit Meta Test&lt;/title&gt;</code></li>
		<li><code>&lt;meta property="og:title" content="Home | SvelteKit Meta Test" /&gt;</code></li>
		<li><code>&lt;meta name="description" content="Welcome to the SvelteKit Meta test project home page" /&gt;</code></li>
		<li><code>&lt;meta property="og:site_name" content="SvelteKit Meta Test Site" /&gt;</code></li>
		<li><code>&lt;meta property="og:image" content="/home-image.jpg" /&gt;</code></li>
		<li>And many more inherited from the root layout...</li>
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
	}
</style>