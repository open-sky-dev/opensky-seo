<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="page">
	<h1>First Blog Post</h1>
	<p class="meta-info">
		<strong>Published:</strong> January 10, 2024 | 
		<strong>Modified:</strong> January 12, 2024 | 
		<strong>Author:</strong> John Doe
	</p>

	<p>
		This blog post demonstrates deep metadata inheritance and overriding:
	</p>

	<ul>
		<li><strong>Title:</strong> "First Blog Post | Blog | SvelteKit Meta Test"</li>
		<li><strong>Author Override:</strong> "John Doe" (overrides blog layout's "Blog Team")</li>
		<li><strong>Twitter Creator Override:</strong> "@johndoe" (overrides blog layout's "@blogteam")</li>
		<li><strong>Article Type:</strong> Set to "article" for proper social sharing</li>
		<li><strong>Dates:</strong> Both publication and modification dates</li>
		<li><strong>Rich Image:</strong> Full image metadata with dimensions and alt text</li>
	</ul>

	<h2>Metadata Inheritance Chain:</h2>
	<ol>
		<li><strong>Root Layout:</strong> Base metadata, site name, default title template</li>
		<li><strong>Blog Layout:</strong> Overrides title template, adds blog-specific metadata</li>
		<li><strong>This Page:</strong> Overrides specific fields while inheriting others</li>
	</ol>

	<h2>Expected Meta Tags (key ones):</h2>
	<ul>
		<li><code>&lt;title&gt;First Blog Post | Blog | SvelteKit Meta Test&lt;/title&gt;</code></li>
		<li><code>&lt;meta name="author" content="John Doe" /&gt;</code></li>
		<li><code>&lt;meta name="twitter:creator" content="@johndoe" /&gt;</code></li>
		<li><code>&lt;meta property="og:type" content="article" /&gt;</code></li>
		<li><code>&lt;meta property="article:published_time" content="2024-01-10T08:00:00Z" /&gt;</code></li>
		<li><code>&lt;meta property="article:modified_time" content="2024-01-12T10:30:00Z" /&gt;</code></li>
		<li><code>&lt;meta property="og:site_name" content="SvelteKit Meta Test Site" /&gt;</code> (inherited)</li>
	</ul>

	<div class="content">
		<p>
			This is the main content of the blog post. In a real application, this would contain 
			the actual article content.
		</p>
		
		<p>
			The key thing to test here is that:
		</p>
		<ul>
			<li>The title template comes from the blog layout (not the root layout)</li>
			<li>Some metadata is overridden at this page level</li>
			<li>Other metadata is inherited from parent layouts</li>
			<li>The final result combines all three levels correctly</li>
		</ul>
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

	.content {
		background: #f9f9f9;
		padding: 1.5rem;
		border-radius: 6px;
		margin-top: 2rem;
	}

	.content p {
		margin: 1rem 0;
	}
</style>