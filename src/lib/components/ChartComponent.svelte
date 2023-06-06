<script lang="ts">
	import { tick, onMount } from 'svelte';
	import { legendTracker } from '$lib/stores/models';
	import { metricStore } from '$lib/stores/metrics';
	import { generateLinearChart } from '$lib/chartFunctions';
	import { globalTheme } from '$lib/stores/settings';

	let mySvg: SVGSVGElement;

	$: {
		const data = $metricStore.metrics;
		if (mySvg) {
			tick().then(() => {
				generateLinearChart(mySvg, data, $legendTracker);
			});
		}
	}

	onMount(() => {
		if (mySvg) {
			const svgWidth = mySvg.clientWidth;
			const svgHeight = (svgWidth / 16) * 9;
			mySvg.setAttribute('width', String(svgWidth));
			mySvg.setAttribute('height', String(svgHeight));
			mySvg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
		}
	});
</script>

<svg bind:this={mySvg} class="chart" class:chart-dark={$globalTheme !== 'white'} />
<div id="tooltip" style="position: absolute; visibility: hidden" />

<style>
	:global(.chart) {
		padding-left: 0.7rem;
		display: block;
		margin: auto;
		background: var(--cds-ui-background);
		border-radius: 6px;
		margin-top: 16px;
		width: 100%;
	}

	:global(.chart-dark) {
		padding-left: 0.7rem;
		display: block;
		margin: auto;
		background-color: #262626;
		border-radius: 6px;
		margin-top: 16px;
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
