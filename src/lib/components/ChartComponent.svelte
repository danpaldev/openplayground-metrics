<script lang="ts">
	import { tick } from 'svelte';
	import { legendTracker } from '$lib/stores/models';
	import { metricStore } from '$lib/stores/metrics';
	import { generateLinearChart } from './chartFunctions';
	import { globalTheme } from '$lib/stores/settings';

	let mySvg: SVGSVGElement;
	/*
	//We have to create a "local" copy of the legendTracker's store content
	to prevent an infinite loop on the reactive block!
	*/
	let legendColors: Map<string, string> = $legendTracker;

	$: {
		const data = $metricStore.metrics;
		if (mySvg) {
			tick().then(() => {
				let newLegendData = generateLinearChart(mySvg, data, legendColors);

				for (const [key, value] of Object.entries(newLegendData)) {
					legendTracker.update((prevMap) => prevMap.set(key, value));
				}
			});
		}
	}
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
	:global(.chart) {
		padding-left: 0.7rem;
		display: block;
		margin: auto;
		background: #fff;
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
		border-radius: 6px;
		margin-top: 16px;
		box-shadow: 0 -5px 10px -3px var(--cds-background-inverse);
		/* 0 2px 0px -8px var(--cds-background-inverse), 0 8px 10px -5px var(--cds-background-inverse); */
	}

	:global(.chart-legend) {
		fill: var(--cds-text-primary);
	}

	:global(.x-axis-label) {
		font-size: 0.8rem;
		fill: var(--cds-text-primary);
	}

	:global(.y-axis-label) {
		font-size: 0.7rem;
		color: var(--cds-text-primary);
	}

	:global(.y-axis-label .domain) {
		stroke: var(--cds-text-secondary);
	}

	:global(#tooltip) {
		font-size: 0.9rem;
		background: var(--cds-ui-02);
		color: var(--cds-text-primary);
		min-height: 1rem;
		max-height: 7rem;
		min-width: 1rem;
		max-width: 10rem;
		border: 1px solid transparent;
		border-radius: 6px;
		box-shadow: 0 -5px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05),
			0 10px 15px -3px #0000000d;
	}

	:global(#tooltip p) {
		display: inline-block; /* Allows the border to match the width of the text */
		border-bottom: 1px solid gray;
		font-weight: 400;
		font-size: 0.9rem;
		width: 100%;
		max-width: 100%;
	}

	:global(#tooltip span) {
		padding: 3px;
		font-size: 0.9rem;
	}
</style>
