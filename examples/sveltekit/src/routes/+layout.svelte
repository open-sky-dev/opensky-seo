<script lang="ts">
	import '../app.css';
	import { SeoTags } from '@opensky/seo';

	let { children } = $props();
</script>

<SeoTags />
{@render children()}
