<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="page">
	<h1>Sibling Page Example</h1>
	<p>
		This page demonstrates how a page at the same level as a layout (sibling page) 
		behaves with metadata inheritance:
	</p>

	<ul>
		<li><strong>Location:</strong> <code>/sibling</code> (same level as <code>/blog</code>)</li>
		<li><strong>Title Template:</strong> Should use root layout's template, not blog layout's</li>
		<li><strong>Expected Title:</strong> "Sibling Page | SvelteKit Meta Test"</li>
		<li><strong>NOT:</strong> "Sibling Page | Blog | SvelteKit Meta Test"</li>
	</ul>

	<h2>Key Differences from Blog Pages:</h2>
	<table>
		<thead>
			<tr>
				<th>Property</th>
				<th>Blog Pages</th>
				<th>This Sibling Page</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Title Template</td>
				<td>"{page} | Blog | SvelteKit Meta Test"</td>
				<td>"{page} | SvelteKit Meta Test"</td>
			</tr>
			<tr>
				<td>Author</td>
				<td>"Blog Team" (from blog layout)</td>
				<td>"Sibling Author" (from this page)</td>
			</tr>
			<tr>
				<td>Twitter Creator</td>
				<td>"@blogteam" (from blog layout)</td>
				<td>Inherited from root layout</td>
			</tr>
			<tr>
				<td>Description</td>
				<td>Blog-specific description</td>
				<td>Page-specific description</td>
			</tr>
		</tbody>
	</table>

	<h2>Why This Matters:</h2>
	<p>
		This demonstrates that:
	</p>
	<ol>
		<li>Pages only inherit from layouts in their path hierarchy</li>
		<li>Sibling pages don't inherit from neighboring layout files</li>
		<li>Title templates work correctly based on the layout hierarchy</li>
		<li>Each branch of the site can have its own metadata configuration</li>
	</ol>

	<h2>Expected Meta Tags:</h2>
	<ul>
		<li><code>&lt;title&gt;Sibling Page | SvelteKit Meta Test&lt;/title&gt;</code></li>
		<li><code>&lt;meta name="description" content="This page is at the same level..." /&gt;</code></li>
		<li><code>&lt;meta name="author" content="Sibling Author" /&gt;</code></li>
		<li><code>&lt;meta property="og:site_name" content="SvelteKit Meta Test Site" /&gt;</code> (inherited)</li>
	</ul>

	<div class="highlight">
		<h3>🔍 Test This:</h3>
		<p>
			Compare the title in your browser tab between this page and any blog page. 
			This page should NOT include "Blog" in the title, while blog pages should.
		</p>
	</div>
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

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 0.9rem;
	}

	th, td {
		padding: 0.75rem;
		text-align: left;
		border-bottom: 1px solid #ddd;
	}

	th {
		background-color: #f5f5f5;
		font-weight: bold;
		color: #333;
	}

	tr:hover {
		background-color: #f9f9f9;
	}

	.highlight {
		background: #fff3cd;
		border: 1px solid #ffeaa7;
		border-radius: 6px;
		padding: 1.5rem;
		margin-top: 2rem;
	}

	.highlight h3 {
		margin-top: 0;
		color: #856404;
	}

	.highlight p {
		margin-bottom: 0;
		color: #856404;
	}
</style>