<script lang="ts">
	import { MetaTags } from 'sveltekit-meta';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<MetaTags metaTags={data.metaTags} />

<div class="app">
	<header>
		<h1>SvelteKit Meta Test Project</h1>
		<nav>
			<a href="/">Home</a>
			<a href="/about">About</a>
			<a href="/blog">Blog</a>
			<a href="/blog/post-1">Blog Post 1</a>
			<a href="/blog/advanced">Advanced Example</a>
			<a href="/sibling">Sibling Page</a>
		</nav>
	</header>

	<main>
		<slot />
	</main>

	<footer>
		<p>Test metadata cascading and title templates</p>
		<div class="metadata-debug">
			<h3>Current Metadata (for debugging):</h3>
			<pre>{JSON.stringify(data.metaTags, null, 2)}</pre>
		</div>
	</footer>
</div>

<style>
	.app {
		min-height: 100vh;
		font-family: Arial, sans-serif;
	}

	header {
		background: #f5f5f5;
		padding: 1rem;
		border-bottom: 1px solid #ddd;
	}

	nav {
		margin-top: 1rem;
	}

	nav a {
		margin-right: 1rem;
		text-decoration: none;
		color: #0066cc;
	}

	nav a:hover {
		text-decoration: underline;
	}

	main {
		padding: 2rem;
		min-height: 60vh;
	}

	footer {
		background: #f5f5f5;
		padding: 1rem;
		border-top: 1px solid #ddd;
		margin-top: 2rem;
	}

	.metadata-debug {
		margin-top: 1rem;
		background: #f0f0f0;
		padding: 1rem;
		border-radius: 4px;
	}

	.metadata-debug pre {
		background: white;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 0.9rem;
	}
</style>