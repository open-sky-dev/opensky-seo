<script lang="ts">
	import '../app.css';
	import { MetaTags } from 'sveltekit-meta';

	let { children } = $props();
</script>

<MetaTags />
{@render children()}
