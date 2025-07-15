<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Dynamic Blog Post</h1>
<p>This page demonstrates dynamic metadata using metaLoadWithData with route parameters.</p>
<p>Current title should be: "Post: {data.slug || 'unknown'} | Blog | SvelteKit Meta Examples"</p>

<div>
	<h2>Post Details:</h2>
	<ul>
		<li><strong>Slug:</strong> {data.slug || 'unknown'}</li>
		<li><strong>Title:</strong> {data.title}</li>
		<li><strong>Author:</strong> {data.author}</li>
		<li><strong>Date:</strong> {data.date}</li>
		<li><strong>Modified:</strong> {data.modified}</li>
	</ul>
</div>

<div>
	<h2>Metadata Features Demonstrated:</h2>
	<ul>
		<li>Dynamic metadata based on route parameters</li>
		<li>Conditional author assignment</li>
		<li>Dynamic image URLs</li>
		<li>Conditional Twitter creator</li>
		<li>Title template inheritance from blog layout</li>
	</ul>
</div>

<p><a href="/blog">← Back to Blog</a></p>
