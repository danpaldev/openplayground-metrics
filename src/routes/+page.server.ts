// /** @type {import('./$types').LayoutServerLoad} */
import type { MetricsResponseData } from '$lib/utils';
import { PUBLIC_HOST_URL } from '$env/static/public';

export async function load({ fetch }) {
	const res = await fetch(`${PUBLIC_HOST_URL}/metrics/`, {
		method: 'POST',
		body: JSON.stringify({})
	});
	const models_metrics: MetricsResponseData = await res.json();
	return { ...models_metrics };
}
