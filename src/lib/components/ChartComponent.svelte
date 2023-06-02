<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { selectedModels, legendTracker } from '$lib/stores/models';
	import { metricStore } from '$lib/stores/metrics';
	import { timestamps, open_ai } from '$lib/timestamps';
	import { generateLinearChart } from './chartFunctions';
	import { globalTheme } from '$lib/stores/settings';
	import { mode } from 'd3';
	export let modelsMetrics;

	let mySvg: SVGSVGElement;
	let legendColors: {} | undefined = {};

	let metrics = modelsMetrics;

	$: {
		// const data = modelsmetrics;
		const data = $metricStore.metrics;
		// console.log(data);
		if (mySvg) {
			tick().then(() => {
				// let legendData = generateLinearChart(mySvg, data);
				let legendData = generateLinearChart(mySvg, data);
				legendTracker.set(legendData);
			});
		}
	}

	$: {
	}

	// $: {
	// 	console.log($legendTracker);
	// 	// modelsMetrics = modelsMetrics.filter((metricObj) => !$selectedModels.includes(metricObj.model));
	// }
</script>

<svg
	bind:this={mySvg}
	class="chart"
	class:chart-dark={$globalTheme !== 'white'}
	width="900"
	height="500"
/>
<div id="tooltip" style="position: absolute; visibility: hidden" />

<style>
	/* :global(.checkbox-provider > *) {
		font-weight: 600;
	} */
	:global(.chart) {
		padding-left: 0.7rem;
		display: block;
		margin: auto;
		background: #fff;
		/* background: red; */
		/* border: 1px solid hsl(214, 50%, 88%); */
		border-radius: 6px;
		margin-top: 16px;
		box-shadow: 0 -5px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05),
			0 10px 15px -3px #0000000d;
	}

	:global(.chart-dark) {
		padding-left: 0.7rem;
		display: block;
		margin: auto;
		background: var(--cds-ui-background);
		/* border: 1px solid var(--cds-background-inverse); */
		border-radius: 6px;
		margin-top: 16px;
		box-shadow: 0 -5px 10px -3px var(--cds-background-inverse);
		/* 0 2px 0px -8px var(--cds-background-inverse), 0 8px 10px -5px var(--cds-background-inverse); */
	}

	:global(.chart-legend) {
		/* font-weight: 800; */
		fill: var(--cds-text-primary);
		/* fill: red; */
	}

	:global(.x-axis-label) {
		font-size: 0.8rem;
		fill: var(--cds-text-primary);
	}

	:global(.y-axis-label) {
		font-size: 0.7rem;
		color: var(--cds-text-primary);
	}

	/* --cds-text-primary */

	:global(.y-axis-label .domain) {
		/* stroke: rgb(204, 204, 204); */
		stroke: var(--cds-text-secondary);
		/* stroke-width: 2; */
	}

	/* :global(.chart-line) {
		stroke-width: 3px;
	} */

	:global(#tooltip) {
		font-size: 0.9rem;
		/* font-weight: 100; */
		/* color: rgba(0, 0, 0, 1); */
		background: white;
		min-height: 1rem;
		max-height: 7rem;
		min-width: 1rem;
		max-width: 10rem;
		border: 1px solid transparent;
		border-radius: 6px;
		box-shadow: 0 -5px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05),
			0 10px 15px -3px #0000000d;
	}

	/* :global(#tooltip *) {
		font-family: 'IBM Plex Sans Condensed', sans-serif;
		/* font-weight: 100; */
	/* padding: 3px; */
	/* } */

	:global(#tooltip strong) {
		display: inline-block; /* Allows the border to match the width of the text */
		border-bottom: 1px solid gray;
		width: 100%;
		max-width: 100%;
	}

	:global(#tooltip span) {
		padding: 3px;
	}
</style>
