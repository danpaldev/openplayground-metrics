<script lang="ts">
	import { DataTable } from 'carbon-components-svelte';
	import { onDestroy } from 'svelte';
	import { metricStore } from '$lib/stores/metrics';
	import { timestampsStore } from '$lib/stores/timestamps';
	import { calculateAveragesByModel, epochToFormattedDate, type MetricAverages } from '$lib/utils';
	import { LEGENDS } from '$lib/constants';
	import { CodeSnippet, Accordion, AccordionItem } from 'carbon-components-svelte';

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
			{ key: 'completion_response_time_std', value: 'Completion Response Time STD' },
			{ key: 'tokens_per_second', value: 'Tokens per Second' },
			{ key: 'time_first_byte', value: 'Time To First Byte' }
		]}
		rows={Object.entries(averagesResults).map(([model_name, averages], id) => {
			return {
				id,
				model_name,
				completion_response_time: averages.completion_time_avg
					? `${averages.completion_time_avg.toFixed(3)} sec.`
					: 'NaN',
				completion_response_time_std: averages.completion_time_std
					? `${averages.completion_time_std.toFixed(3)} sec.`
					: 'NaN',
				tokens_per_second: `${Math.round(averages.token_second_avg)}`,
				time_first_byte: averages.first_byte_avg
					? `${Math.round(averages.first_byte_avg * 1000)} msec.`
					: 'NaN'
			};
		})}
	/>
	<div class="info-container">
		<Accordion size="xl">
			<AccordionItem title="How do we get and calculate the data?">
				All the data in the site is collected by performing a completion request for each of the
				listed models every five minutes. The next prompt is always used for all the models:
				<br /><br />
				<em
					>"Generate a Django application with Authentication, JWT, Tests, DB support. Show
					docker-compose for python and postgres. Show the complete code for every file!""</em
				> <br /><br />
				By requesting a "lengthy task", we ensure that the models generate the maximum amount of tokens
				possible in order to obtain more precise calculations. In addition, we use the same parameters
				for every request to allow fair comparisons between each one. These are the parameters:
				<br /><br />
				<br />
				<CodeSnippet
					type="multi"
					code={`"temperature": 0,\n"maximumLength": 525,\n"topP": 1,\n"topK": 1`}
				/>
				<br /><br />
				In order to get the <strong>completion response time</strong>, we calculate the time between
				the start of the request and the moment when the model reaches its 525 token limit. During
				this period, we also note how long it takes for the first token of the actual answer to
				arrive (<strong>First Byte Token</strong>).<br /><br /> And finally, after the request is
				done, we count the number of tokens received during the whole completion, and divide the
				number by the amount of seconds that the completion took to finalize (completion response
				time). This allows us to get the average number of <strong>Tokens per Second</strong>. By
				other hand, if the request for any model fails, this one will be registered with a 0
				completion response time and it will be plotted as a red dot in the graph.
			</AccordionItem>
		</Accordion>
	</div>
</div>

<style>
	.metrics-table-container {
		margin-top: 3rem;
		width: 95%;
	}

	p {
		text-align: center;
	}

	.info-container {
		margin-top: 3rem;
	}
</style>
