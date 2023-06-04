<script lang="ts">
	import { DataTable } from 'carbon-components-svelte';
	import { onDestroy } from 'svelte';
	import { metricStore } from '$lib/stores/metrics';
	import { timestampsStore } from '$lib/stores/timestamps';
	import { calculateAveragesByModel, epochToFormattedDate, type MetricAverages } from '$lib/utils';
	import { LEGENDS } from '$lib/constants';

	let averagesResults: Record<string, MetricAverages>;
	let tableLegend = LEGENDS.DEFAULT_TABLE_LEGEND;

	$: {
		const data = $metricStore;
		averagesResults = calculateAveragesByModel(data.metrics);
	}

	const unsubscribe = metricStore.subscribe((_) => {
		if ($timestampsStore) {
			console.log($timestampsStore);
			tableLegend = `All metrics in the table represent averages, calculated using metrics from ${epochToFormattedDate(
				$timestampsStore.start
			)} to ${epochToFormattedDate($timestampsStore.end)} (UTC) `;
		}
	});

	onDestroy(unsubscribe);
</script>

<div class="metrics-table-container">
	<p>{tableLegend}</p>
	<DataTable
		size="short"
		sortable
		headers={[
			{ key: 'model_name', value: 'Model' },
			{ key: 'completion_response_time', value: 'Completion Response Time' },
			{ key: 'tokens_per_second', value: 'Tokens per Second' },
			{ key: 'time_first_byte', value: 'Time To First Byte' }
		]}
		rows={Object.entries(averagesResults).map(([model_name, averages], id) => {
			return {
				id,
				model_name,
				completion_response_time: `${averages.completion_time_avg.toFixed(3)} sec.`,
				tokens_per_second: `${Math.round(averages.token_second_avg)}`,
				time_first_byte: `${Math.round(averages.first_byte_avg * 1000)} msec.`
			};
		})}
	/>
</div>

<style>
	.metrics-table-container {
		margin-top: 3rem;
	}

	p {
		text-align: center;
	}
</style>
