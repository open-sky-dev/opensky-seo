<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="page">
	<h1>Blog Home</h1>
	<p>
		This page demonstrates how nested layouts affect metadata inheritance:
	</p>

	<ul>
		<li><strong>Title Template:</strong> Should show "Blog Home | Blog | SvelteKit Meta Test"</li>
		<li><strong>Cascaded Metadata:</strong> Inherits from root layout AND blog layout</li>
		<li><strong>Author Override:</strong> Uses "Blog Team" from blog layout</li>
		<li><strong>Twitter Creator:</strong> Uses "@blogteam" from blog layout</li>
	</ul>

	<h2>Expected Title:</h2>
	<p><code>Blog Home | Blog | SvelteKit Meta Test</code></p>

	<h2>Key Points:</h2>
	<ol>
		<li>The root layout sets: <code>titleTemplate: "{page} | SvelteKit Meta Test"</code></li>
		<li>The blog layout overrides with: <code>titleTemplate: "{page} | Blog | SvelteKit Meta Test"</code></li>
		<li>This page sets: <code>title: "Blog Home"</code></li>
		<li>Result: The blog layout's title template is used</li>
	</ol>

	<p>
		<strong>Check the metadata debug section at the bottom</strong> to see how the metadata 
		has been merged through the layout hierarchy.
	</p>
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