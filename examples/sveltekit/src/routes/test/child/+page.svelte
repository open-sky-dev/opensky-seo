<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Child Page</h1>
<p>This page demonstrates a child page under the test layout.</p>
<p>Current title should be: "Child Page - Test Section"</p>

<div>
	<p>Layout data: {data.testLayoutData}</p>
	<p>Child page data: {data.childPageData}</p>
</div>

<div>
	<h2>Features Demonstrated:</h2>
	<ul>
		<li>Title template inheritance from test layout</li>
		<li>Layout data inheritance</li>
		<li>Page-specific metadata</li>
		<li>Different title template format</li>
	</ul>
</div>

<p><a href="/test">← Back to Test Section</a></p>
