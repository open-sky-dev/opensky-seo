<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="blog-layout">
	<div class="blog-header">
		<h1>Blog Section</h1>
		<p>This demonstrates nested layout metadata behavior.</p>
		<nav class="blog-nav">
			<a href="/blog">Blog Home</a>
			<a href="/blog/post-1">Post 1</a>
			<a href="/blog/advanced">Advanced Example</a>
		</nav>
	</div>

	<div class="blog-content">
		<slot />
	</div>

	<div class="blog-metadata-info">
		<h3>Blog Layout Metadata Changes:</h3>
		<ul>
			<li><strong>Title Template:</strong> Changed to include "Blog" section</li>
			<li><strong>Description:</strong> Override with blog-specific description</li>
			<li><strong>Author:</strong> Override with "Blog Team"</li>
			<li><strong>Twitter Creator:</strong> Added @blogteam</li>
		</ul>
	</div>
</div>

<style>
	.blog-layout {
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		padding: 1rem;
		margin: 1rem 0;
	}

	.blog-header {
		background: #f9f9f9;
		padding: 1rem;
		margin: -1rem -1rem 1rem -1rem;
		border-radius: 6px 6px 0 0;
	}

	.blog-header h1 {
		margin: 0 0 0.5rem 0;
		color: #555;
	}

	.blog-nav {
		margin-top: 1rem;
	}

	.blog-nav a {
		margin-right: 1rem;
		padding: 0.5rem 1rem;
		background: #0066cc;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.blog-nav a:hover {
		background: #0052a3;
	}

	.blog-content {
		margin: 1rem 0;
	}

	.blog-metadata-info {
		background: #f0f8ff;
		padding: 1rem;
		border-radius: 4px;
		margin-top: 1rem;
	}

	.blog-metadata-info h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
	}

	.blog-metadata-info ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.blog-metadata-info li {
		margin: 0.3rem 0;
	}
</style>