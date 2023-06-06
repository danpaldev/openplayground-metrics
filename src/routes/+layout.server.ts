export async function load({ url }) {
	const themeQuery = url.searchParams.get('theme');
	return {
		theme: themeQuery || 'white'
	};
}
