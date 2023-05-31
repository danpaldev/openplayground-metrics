<script lang="ts">
	import { tick } from 'svelte';
	import { selectedModels } from '$lib/stores/models';
	import { timestamps, open_ai } from '$lib/timestamps';
	import { generateLinearChart } from './chartFunctions';

	let mySvg: SVGSVGElement;
	let legendColors: {} | undefined = {};

	// $: {
	// 	const data = open_ai.filter((item) => $selectedModels.includes(item.model));
	// 	if (mySvg && data.length) {
	// 		// console.log(data);
	// 		// generateLinearChart(mySvg, data);
	// 		tick().then(() => {
	// 			console.log(data);
	// 			legendColors = generateLinearChart(mySvg, data);
	// 		});
	// 	}
	// }

	$: {
		const data = open_ai.filter((item) => $selectedModels.includes(item.model));
		if (mySvg) {
			tick().then(() => {
				console.log(data);
				legendColors = generateLinearChart(mySvg, data);
			});
		}
	}

	$: {
		console.log(legendColors);
	}
</script>

<svg bind:this={mySvg} id="chart" width="900" height="500" />
<div id="tooltip" style="position: absolute; visibility: hidden" />

<style>
	/* :global(.checkbox-provider > *) {
		font-weight: 600;
	} */
	:global(#chart) {
		padding-left: 0.7rem;
		display: block;
		margin: auto;
		background: #fff;
		border: 1px solid #d2dff0;
		border-radius: 6px;
		margin-top: 16px;
		box-shadow: 0 -5px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05),
			0 10px 15px -3px #0000000d;
	}

	:global(.chart-legend) {
		font-weight: 800;
	}

	:global(.x-axis-label) {
		font-size: 0.8rem;
	}

	:global(.y-axis-label) {
		font-size: 0.7rem;
		color: black;
	}

	:global(.y-axis-label .domain) {
		stroke: rgb(204, 204, 204);
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
