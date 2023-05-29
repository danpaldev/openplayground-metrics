<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';
	import { generateLinearChart } from '$lib/components/chartFunctions';

	let targetSVG: SVGSVGElement;
	export let data: unknown;

	/*
It's recommended to put the fetch in onMount rather than at the top level of the <script
because of server-side rendering (SSR). With the exception of onDestroy, lifecycle 
functions don't run during SSR, which means we can avoid fetching data that 
should be loaded lazily once the component has been mounted in the DOM.
    */

	onMount(() => generateLinearChart(targetSVG, data));
</script>

<!-- <div bind:this={targetDiv} id="chart" /> -->

<svg bind:this={targetSVG} width="900" height="500" id="chart" />

<style>
	svg {
		display: block;
		margin: auto;
	}
</style>
