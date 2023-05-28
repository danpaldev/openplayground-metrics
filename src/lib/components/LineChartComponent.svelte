<script>
	import '@carbon/charts/styles.css';
	import { tooltipValueFormatter } from '$lib/utils';
	import { globalTheme } from '$lib/stores/settings';
	import { LineChart } from '@carbon/charts-svelte';
	import timestamps from '$lib/timestamps';

	export let sortType;
</script>

<LineChart
	theme={$globalTheme}
	data={timestamps.map((item) => ({
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
