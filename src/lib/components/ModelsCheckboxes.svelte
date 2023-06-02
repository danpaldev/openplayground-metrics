<script lang="ts">
	import { PROVIDERS, MODELS_BY_PROVIDER } from '$lib/constants';
	import { legendTracker, selectedProviders } from '$lib/stores/models';
	import { metricStore } from '$lib/stores/metrics';
	import { fetchMetricsForModel, fetchMetricsForProvider } from '$lib/utils';
	import CustomCheckbox from './CustomCheckbox.svelte';

	const handleModelChange = async (e: Event) => {
		let target = e.target as HTMLInputElement;
		if (target.checked) {
			try {
				const metricsForModel = await fetchMetricsForModel(target.value);
				metricStore.update((prevState) => ({
					selectedModels: [...prevState.selectedModels, target.value],
					metrics: [...prevState.metrics, ...metricsForModel.metrics]
				}));
			} catch (error) {
				if (error instanceof Error) {
					window.alert(`An error occurred: ${error.message}`);
				} else {
					window.alert(`An unexpected error occurred: ${error}`);
				}
			}
		} else {
			metricStore.update((prevState) => ({
				selectedModels: prevState.selectedModels.filter((model) => model !== target.value),
				metrics: prevState.metrics.filter((metricObject) => metricObject.model !== target.value)
			}));
		}
	};

	const handleProviderChange = async (e: Event) => {
		let target = e.target as HTMLInputElement;

		if (target.checked) {
			try {
				const metricsForProvider = await fetchMetricsForProvider(target.value);
				metricStore.update((prevState) => ({
					selectedModels: [...prevState.selectedModels, ...metricsForProvider.models],
					metrics: [
						...prevState.metrics.filter((metricObj) => metricObj.provider !== target.value),
						...metricsForProvider.metrics
					]
				}));
			} catch (error) {
				if (error instanceof Error) {
					window.alert(`An error occurred: ${error.message}`);
				} else {
					window.alert(`An unexpected error occurred: ${error}`);
				}
			}
		} else {
			MODELS_BY_PROVIDER[target.value].includes('asdf');
			metricStore.update((prevState) => ({
				selectedModels: prevState.selectedModels.filter(
					(model) => !MODELS_BY_PROVIDER[target.value].includes(model)
				),
				metrics: prevState.metrics.filter((metricObject) => metricObject.provider !== target.value)
			}));
		}
	};

	$: {
		console.log($selectedProviders);
	}
</script>

<section class="checkbox-container">
	<div>
		<CustomCheckbox
			handleChange={handleProviderChange}
			label={PROVIDERS.OPEN_AI_TEXT}
			value={PROVIDERS.OPEN_AI_ID}
			checked={$selectedProviders.includes(PROVIDERS.OPEN_AI_ID)}
			color={$selectedProviders.includes(PROVIDERS.OPEN_AI_ID) ? 'black' : ''}
			bold={true}
		/>

		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.OPEN_AI_ID] as model}
				{#if $metricStore.selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{:else}
					<CustomCheckbox
						checked={$metricStore.selectedModels.includes(model)}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{/if}
			{/each}
		</div>
	</div>
	<div>
		<CustomCheckbox
			handleChange={handleProviderChange}
			label={PROVIDERS.ANTHROPIC_TEXT}
			value={PROVIDERS.ANTHROPIC_ID}
			checked={$selectedProviders.includes(PROVIDERS.ANTHROPIC_ID)}
			color={$selectedProviders.includes(PROVIDERS.ANTHROPIC_ID) ? 'black' : ''}
			bold={true}
		/>

		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.ANTHROPIC_ID] as model}
				{#if $metricStore.selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{:else}
					<CustomCheckbox
						checked={$metricStore.selectedModels.includes(model)}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{/if}
			{/each}
		</div>
	</div>
	<div>
		<CustomCheckbox
			handleChange={handleProviderChange}
			label={PROVIDERS.FOREFRONT_TEXT}
			value={PROVIDERS.FOREFRONT_ID}
			checked={$selectedProviders.includes(PROVIDERS.FOREFRONT_ID)}
			color={$selectedProviders.includes(PROVIDERS.FOREFRONT_ID) ? 'black' : ''}
			bold={true}
		/>
		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.FOREFRONT_ID] as model}
				{#if $metricStore.selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{:else}
					<CustomCheckbox
						checked={$metricStore.selectedModels.includes(model)}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{/if}
			{/each}
		</div>
	</div>
	<div>
		<CustomCheckbox
			handleChange={handleProviderChange}
			label={PROVIDERS.ALEPH_ALPHA_TEXT}
			value={PROVIDERS.ALEPH_ALPHA_ID}
			checked={$selectedProviders.includes(PROVIDERS.ALEPH_ALPHA_ID)}
			color={$selectedProviders.includes(PROVIDERS.ALEPH_ALPHA_ID) ? 'black' : ''}
			bold={true}
		/>
		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.ALEPH_ALPHA_ID] as model}
				{#if $metricStore.selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{:else}
					<CustomCheckbox
						checked={$metricStore.selectedModels.includes(model)}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{/if}
			{/each}
		</div>
	</div>
</section>

{#each $metricStore.selectedModels as model}
	<p>{model}</p>
{/each}

<style>
	.checkbox-container {
		display: flex;
		justify-content: space-around;
		flex-direction: row;
		width: 100%;
		margin-top: 3rem;
	}

	.models-checkbox-container {
		margin-top: 0.8rem;
	}

	:global(.checkbox-provider > *) {
		font-weight: 600;
	}
</style>
