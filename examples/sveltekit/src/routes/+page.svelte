<h1>Welcome to SvelteKit Meta Examples</h1>
<p>This page demonstrates the root layout metadata and title template inheritance.</p>
<p>Current title should be: "Home | SvelteKit Meta Examples"</p>

<nav>
	<h2>Examples:</h2>
	<ul>
		<li><a href="/about">About Page</a> - Basic page metadata</li>
		<li><a href="/blog">Blog Layout</a> - Nested layout with title templates</li>
		<li><a href="/blog/static">Blog Static Page</a> - Page under blog layout</li>
		<li><a href="/blog/example-post">Blog Dynamic Post</a> - Dynamic metadata with params</li>
		<li><a href="/test">Test Layout</a> - Another nested layout</li>
		<li><a href="/test/child">Test Child</a> - Child page under test layout</li>
		<li><a href="/reset">Reset Layout</a> - Demonstrates resetLayout functionality</li>
		<li><a href="/media">Media Examples</a> - All media metadata types</li>
		<li><a href="/article">Article Example</a> - Article content type with full metadata</li>
		<li><a href="/video">Video Example</a> - Video content type</li>
	</ul>
</nav>

<style>
	nav ul {
		list-style: none;
		padding: 0;
	}
	nav li {
		margin: 0.5rem 0;
	}
	nav a {
		color: #0066cc;
		text-decoration: none;
	}
	nav a:hover {
		text-decoration: underline;
	}
</style>
