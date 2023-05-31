<script lang="ts">
	import '@carbon/charts/styles.css';
	import { Dropdown, Button } from 'carbon-components-svelte';
	//NEW
	// import LinearChartComponent from '$lib/components/LinearChartComponent.svelte';
	//OLD
	import LineChartComponent from '$lib/components/LineChartComponent.svelte';
	import ChartComponent from '$lib/components/ChartComponent.svelte';
	import ModelInfoList from '$lib/components/ModelInfoList.svelte';
	import ModelsCheckboxes from '$lib/components/ModelsCheckboxes.svelte';
	import { ContentSwitcher, Switch } from 'carbon-components-svelte';
	import { data_mock, anthropic, open_ai } from '$lib/timestamps';
	import { selectedModels } from '$lib/stores/models';
	import {
		ALL_MODELS_ID,
		ALL_MODELS_TEXT,
		BY_PROVIDER_ID,
		BY_PROVIDER_TEXT,
		RESPONSE_TIME_ID,
		RESPONSE_TIME_TEXT,
		RESPONSE_TIME_DUAL_ID,
		RESPONSE_TIME_DUAL_TEXT,
		TOKENS_PER_SECOND_ID,
		TOKENS_PER_SECOND_TEXT,
		PROVIDERS,
		PROVIDERS_INDEXES
	} from '$lib/constants';

	let sortType = ALL_MODELS_ID;
	let graphType = RESPONSE_TIME_ID;

	let selectedIndex = 0;
	$: selectedProvider = PROVIDERS_INDEXES.get(selectedIndex);
</script>

<section>
	<!-- <LineChartComponent /> -->
	<ChartComponent />
	<ModelsCheckboxes />
	<div class="options-container">
		<Dropdown
			type="inline"
			size="sm"
			titleText="Graph by:"
			bind:selectedId={graphType}
			items={[
				{ id: RESPONSE_TIME_ID, text: RESPONSE_TIME_TEXT },
				{ id: RESPONSE_TIME_DUAL_ID, text: RESPONSE_TIME_DUAL_TEXT },
				{ id: TOKENS_PER_SECOND_ID, text: TOKENS_PER_SECOND_TEXT }
			]}
		/>
		<div class="custom-selection-button-container">
			<Button kind="ghost">Custom Model Selection</Button>
		</div>
	</div>
	<!-- {#each $selectedModels as model}
		<h1>{model}</h1>
	{/each} -->
	<ModelInfoList bind:selectedProvider />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	.options-container {
		display: grid;
		grid-template-columns: 1fr 3fr;
		grid-template-rows: 1fr;
		align-items: center;
		gap: 1rem;
		width: 100%;
		margin-bottom: 2rem;
		/* height: 100%; */
		/* border: 1px solid red; */
	}

	.custom-selection-button-container {
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.provider-tab-container {
		width: 100%;
		height: 100%;
		margin-bottom: 2rem;
	}
</style>
