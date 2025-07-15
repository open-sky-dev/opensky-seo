<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Test Section</h1>
<p>This page demonstrates another nested layout with a different title template.</p>
<p>Current title should be: "Test Section - Test Section"</p>
<p>Layout data: {data.testLayoutData}</p>

<div>
	<h2>Test Section Features:</h2>
	<ul>
		<li>Different title template format</li>
		<li>Layout data inheritance</li>
		<li>Nested layout demonstration</li>
	</ul>
</div>

<p><a href="/test/child">Go to Child Page</a></p>
<p><a href="/">← Back to Home</a></p>
