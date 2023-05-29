<script lang="ts">
	import '@carbon/charts/styles.css';
	import { tooltipValueFormatter } from '$lib/utils';
	import { selectedModels } from '$lib/stores/models';
	import { globalTheme } from '$lib/stores/settings';
	import { LineChart } from '@carbon/charts-svelte';
	import { timestamps } from '$lib/timestamps';

	// export let selectedProvider;
	// export let models;

	interface TimestampData {
		group: string;
		date: string;
		value: number;
	}

	$: data = timestamps?.slice(0, 300)?.reduce<TimestampData[]>((results, item) => {
		if ($selectedModels.includes(item.model)) {
			results.push({ group: item.model, date: item.timestamp, value: item.duration });
		}
		return results;
	}, []);
</script>

<!-- {#each data as item}
	<p>{item?.group}</p>
{/each} -->

{#if data}
	<LineChart
		theme={$globalTheme}
		bind:data
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
			height: '350px',
			// curve: 'curveNatural',
			tooltip: {
				valueFormatter: tooltipValueFormatter,
				truncation: {
					numCharacter: 18
				}
			},
			toolbar: {
				enabled: false
			},
			legend: {
				clickable: false
			}
		}}
	/>
{/if}
