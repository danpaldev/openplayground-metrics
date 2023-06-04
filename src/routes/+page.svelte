<script lang="ts">
	import '@carbon/charts/styles.css';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import ChartComponent from '$lib/components/ChartComponent.svelte';
	import ModelsMetricsTable from '$lib/components/ModelsMetricsTable.svelte';
	import ModelsCheckboxes from '$lib/components/ModelsCheckboxes.svelte';
	import { metricStore } from '$lib/stores/metrics';
	import { onMount } from 'svelte';

	export let data;

	//Set up the default models & metrics at first render
	onMount(() => {
		metricStore.set({ selectedModels: data.models, metrics: data.metrics });
	});
</script>

<section>
	<DatePicker />
	<ChartComponent />
	<ModelsCheckboxes />
	<ModelsMetricsTable />
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
