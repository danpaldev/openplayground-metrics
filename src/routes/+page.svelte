<script lang="ts">
	import timestamps from '$lib/timestamps';
	import '@carbon/charts/styles.css';
	import { globalTheme } from '$lib/stores/settings';
	import { AreaChart, LineChart } from '@carbon/charts-svelte';

	let sortType = 'ALL';
	let graphType = 'RESPONSE_TIME';

	const tooltipValueFormatter = (value: any, _: string) => {
		let hourRegex = /\b\d{1,2}:\d{2}:\d{2}\b/;
		const hourString = String(value).match(hourRegex);

		if (hourString) return hourString;
		return value;
	};
</script>

<svelte:head>
	<title>Openplayground Metrics</title>
	<meta name="description" content="AI Model Metrics Site" />
</svelte:head>

<section>
	<LineChart
		theme={$globalTheme}
		data={timestamps.map((item, index) => ({
			group: item.model,
			date: item.timestamp,
			value: item.duration
		}))}
		options={{
			title: 'API response time tracker',
			axes: {
				bottom: {
					title: 'Time (UTC)',
					mapsTo: 'date',
					scaleType: 'time'
				},
				left: {
					mapsTo: 'value',
					title: 'Response Time (s)',
					scaleType: 'linear'
				}
			},
			height: '500px',
			// curve: 'curveNatural',
			tooltip: {
				valueFormatter: tooltipValueFormatter,
				truncation: {
					numCharacter: 18
				}
			},
			toolbar: {
				enabled: false
			}
		}}
	/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
