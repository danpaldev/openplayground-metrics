// /** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch, params }) {
	const res = await fetch('http://127.0.0.1:8000/metrics/', {
		method: 'POST',
		body: JSON.stringify({})
	});
	const models_metrics: {
		metrics: string[];
		models: string[];
	} = await res.json();
	return { ...models_metrics };
}
