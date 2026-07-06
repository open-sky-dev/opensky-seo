import type { RequestHandler } from './$types';

// Stub generated-image endpoint demonstrating the contract behind og()/ogParams():
// query params in, image out. A production endpoint would render a card component
// to PNG with an engine like takumi or satori; a hand-built SVG keeps this example
// dependency-free (note that most scrapers do not accept SVG - use PNG for real).
export const GET: RequestHandler = ({ url }) => {
	const heading = url.searchParams.get('heading') ?? 'SvelteKit Meta Examples';
	const author = url.searchParams.get('author');
	const dark = url.searchParams.get('theme') === 'dark';

	const bg = dark ? '#111827' : '#f8fafc';
	const fg = dark ? '#f8fafc' : '#111827';
	const muted = dark ? '#9ca3af' : '#6b7280';

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<rect width="1200" height="630" fill="${bg}" />
	<text x="80" y="330" font-family="sans-serif" font-size="64" font-weight="bold" fill="${fg}">${escapeXml(heading)}</text>
	${author ? `<text x="80" y="420" font-family="sans-serif" font-size="36" fill="${muted}">${escapeXml(author)}</text>` : ''}
</svg>`;

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};

const XML_ESCAPES: Record<string, string> = {
	'<': '&lt;',
	'>': '&gt;',
	'&': '&amp;',
	"'": '&apos;',
	'"': '&quot;'
};

function escapeXml(value: string): string {
	return value.replace(/[<>&'"]/g, (char) => XML_ESCAPES[char]);
}
