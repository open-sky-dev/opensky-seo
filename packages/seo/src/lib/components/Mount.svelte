<script lang="ts">
	import { page } from '$app/state'
	import { resolveTitleTemplate, resolveUrl } from '../utils'

	// page from $app/state is reactive, so this stays current across navigations and invalidations
	const data = $derived(page.data)

	let { debug = false } = $props()
	// debug is a mount-time flag, so reading its initial value here is intentional
	// svelte-ignore state_referenced_locally
	if (debug) {
		// eslint-disable-next-line svelte/no-inspect -- opt-in debug feature; no-op in prod builds
		$inspect(data)
	}

	// Templates are matched against the route pattern so dynamic segments and
	// route groups behave; pathname is only a fallback (route.id is null on errors)
	const activeTitleTemplate = $derived.by(() => {
		const template = resolveTitleTemplate(data, page.route.id ?? page.url.pathname)
		if (debug) { console.log('🔍 [SeoTags] Active title template:', template) }
		return template
	})

	// Get the title from the current route level
	const currentTitle = $derived(data['_meta-title'] || null)

	// Combine title template with current title
	const combinedTitle = $derived(
		activeTitleTemplate && currentTitle
			? activeTitleTemplate.replace('{page}', currentTitle)
			: currentTitle
	)

	// Helper function to get metadata value
	const getMetaValue = (key: string) => {
		return data[`_meta-${key}`]
	}

	// Helper function to check if metadata exists
	const hasMeta = (key: string) => {
		return data[`_meta-${key}`] !== undefined && data[`_meta-${key}`] !== null
	}

	// Scrapers require absolute URLs for og:image/og:url; resolve relative paths
	// against the current origin (reads page.url reactively at render)
	const absUrl = (url: string) => resolveUrl(url, page.url.origin)
</script>

<svelte:head>
	<!-- SEO: Canonical URL -->
	{#if hasMeta('canonical')}
		{@const canonical = absUrl(getMetaValue('canonical'))}
		<link rel="canonical" href={canonical} />
		<meta property="og:url" content={canonical} />
	{/if}

	<!-- APPEARENCE: Icon -->
	{#if hasMeta('icon')}
		{@const icon = getMetaValue('icon')}
		{#if typeof icon === 'string'}
			<link rel="icon" href={icon} />
			<link rel="apple-touch-icon" href={icon} />
		{:else}
			{#if icon.svg}
				<link rel="icon" type="image/svg+xml" href={icon.svg} />
			{/if}
			{#if icon.small}
				<link rel="icon" type={icon.small.type || 'image/png'} href={icon.small.url} />
			{/if}
			{#if icon.large}
				<link rel="icon" type={icon.large.type || 'image/png'} href={icon.large.url} />
				<link rel="apple-touch-icon" type={icon.large.type || 'image/png'} href={icon.large.url} />
			{/if}
		{/if}
	{/if}

	<!-- APPEARENCE: Safari Pinned Tab Icon -->
	{#if hasMeta('maskIcon')}
		{@const maskIcon = getMetaValue('maskIcon')}
		<link rel="mask-icon" href={maskIcon.url} color={maskIcon.color} />
	{/if}

	<!-- APPEARENCE: Theme Color -->
	{#if hasMeta('theme')}
		{@const theme = getMetaValue('theme')}
		{#if typeof theme === 'object'}
			<meta name="theme-color" content={theme.light} media="(prefers-color-scheme: light)" />
			<meta name="theme-color" content={theme.dark} media="(prefers-color-scheme: dark)" />
		{:else}
			<meta name="theme-color" content={theme} />
		{/if}
	{/if}

	<!-- APPEARENCE: Color Scheme -->
	{#if hasMeta('colorScheme')}
		<meta name="color-scheme" content={getMetaValue('colorScheme')} />
	{/if}

	<!-- SHARING: Site Name -->
	{#if hasMeta('sitename')}
		<meta property="og:site_name" content={getMetaValue('sitename')} />
	{/if}

	<!-- SHARING: Title -->
	{#if combinedTitle}
		<title>{combinedTitle}</title>
		<meta property="og:title" content={combinedTitle} />
		<meta name="twitter:title" content={combinedTitle} />
	{/if}

	<!-- SHARING: Description -->
	{#if hasMeta('description')}
		{@const description = getMetaValue('description')}
		<meta name="description" content={description} />
		<meta property="og:description" content={description} />
		<meta name="twitter:description" content={description} />
	{/if}

	<!-- SHARING: Content Type -->
	{#if hasMeta('type')}
		{@const type = getMetaValue('type')}
		{#if typeof type === 'object'}
			<meta property="og:type" content={type.og} />
			<meta name="twitter:card" content={type.twitter} />
		{:else if type === 'article'}
			<meta property="og:type" content="article" />
			<meta name="twitter:card" content="summary" />
		{:else if type === 'largeImage'}
			<meta property="og:type" content="website" />
			<meta name="twitter:card" content="summary_large_image" />
		{:else if type === 'player'}
			<meta property="og:type" content="website" />
			<meta name="twitter:card" content="player" />
		{:else}
			<meta property="og:type" content="website" />
			<meta name="twitter:card" content="summary" />
		{/if}
	{:else}
		<!-- Sensible defaults so every page has a card type -->
		<meta property="og:type" content="website" />
		<meta name="twitter:card" content="summary" />
	{/if}

	<!-- SHARING: Author -->
	{#if hasMeta('author')}
		{@const author = getMetaValue('author')}
		{#if Array.isArray(author)}
			<meta name="author" content={author.join(', ')} />
			{#each author as authorName (authorName)}
				<meta property="article:author" content={authorName} />
			{/each}
		{:else}
			<meta name="author" content={author} />
			<meta property="article:author" content={author} />
		{/if}
	{/if}

	<!-- SHARING: Images -->
	{#if hasMeta('image')}
		{@const image = getMetaValue('image')}
		{#if typeof image === 'string'}
			{@const imageUrl = absUrl(image)}
			<meta property="og:image" content={imageUrl} />
			<meta name="twitter:image" content={imageUrl} />
		{:else}
			<meta property="og:image" content={absUrl(image.url)} />
			{#if image.secureUrl}<meta
					property="og:image:secure_url"
					content={absUrl(image.secureUrl)}
				/>{/if}
			<meta name="twitter:image" content={absUrl(image.url)} />
			{#if image.width}<meta property="og:image:width" content={image.width} />{/if}
			{#if image.height}<meta property="og:image:height" content={image.height} />{/if}
			{#if image.type}<meta property="og:image:type" content={image.type} />{/if}
			{#if image.alt}
				<meta property="og:image:alt" content={image.alt} />
				<meta name="twitter:image:alt" content={image.alt} />
			{/if}
		{/if}
	{/if}
	{#if hasMeta('images')}
		{@const images = getMetaValue('images')}
		{#each images as image, i (i)}
			<!-- Set twitter:image only for the first image -->
			{#if i === 0}
				<meta name="twitter:image" content={absUrl(image.url)} />
				{#if image.alt}
					<meta name="twitter:image:alt" content={image.alt} />
				{/if}
			{/if}
			<meta property="og:image" content={absUrl(image.url)} />
			{#if image.secureUrl}<meta
					property="og:image:secure_url"
					content={absUrl(image.secureUrl)}
				/>{/if}
			{#if image.width}<meta property="og:image:width" content={image.width} />{/if}
			{#if image.height}<meta property="og:image:height" content={image.height} />{/if}
			{#if image.type}<meta property="og:image:type" content={image.type} />{/if}
			{#if image.alt}
				<meta property="og:image:alt" content={image.alt} />
			{/if}
		{/each}
	{/if}

	<!-- SHARING: Video -->
	{#if hasMeta('video')}
		{@const video = getMetaValue('video')}
		{#if typeof video === 'string'}
			{@const videoUrl = absUrl(video)}
			<meta property="og:video" content={videoUrl} />
			<meta name="twitter:player" content={videoUrl} />
		{:else}
			<meta property="og:video" content={absUrl(video.url)} />
			<meta name="twitter:player" content={absUrl(video.url)} />
			{#if video.width}
				<meta property="og:video:width" content={video.width} />
				<meta name="twitter:player:width" content={video.width} />
			{/if}
			{#if video.height}
				<meta property="og:video:height" content={video.height} />
				<meta name="twitter:player:height" content={video.height} />
			{/if}
			{#if video.type}<meta property="og:video:type" content={video.type} />{/if}
		{/if}
	{/if}
	{#if hasMeta('videos')}
		{@const videos = getMetaValue('videos')}
		{#each videos as video, i (i)}
			<!-- Set twitter:player only for the first video -->
			{#if i === 0}
				<meta name="twitter:player" content={absUrl(video.url)} />
				{#if video.width}
					<meta name="twitter:player:width" content={video.width} />
				{/if}
				{#if video.height}
					<meta name="twitter:player:height" content={video.height} />
				{/if}
			{/if}
			<meta property="og:video" content={absUrl(video.url)} />
			{#if video.secureUrl}<meta
					property="og:video:secure_url"
					content={absUrl(video.secureUrl)}
				/>{/if}
			{#if video.width}<meta property="og:video:width" content={video.width} />{/if}
			{#if video.height}<meta property="og:video:height" content={video.height} />{/if}
			{#if video.type}<meta property="og:video:type" content={video.type} />{/if}
		{/each}
	{/if}

	<!-- SEO: Date Published -->
	{#if hasMeta('date')}
		<meta property="article:published_time" content={getMetaValue('date')} />
		<meta name="date" content={getMetaValue('date')} />
	{/if}

	<!-- SEO: Date Modified -->
	{#if hasMeta('modified')}
		<meta property="article:modified_time" content={getMetaValue('modified')} />
		<meta name="last-modified" content={getMetaValue('modified')} />
	{/if}

	<!-- TWITTER: Site/Publisher Account -->
	{#if hasMeta('twitterSite')}
		<meta name="twitter:site" content={getMetaValue('twitterSite')} />
	{/if}

	<!-- TWITTER: Creator Account -->
	{#if hasMeta('twitterCreator')}
		<meta name="twitter:creator" content={getMetaValue('twitterCreator')} />
	{/if}
</svelte:head>
