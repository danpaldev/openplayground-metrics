<script lang="ts">
	import { PROVIDERS, MODELS_BY_PROVIDER } from '$lib/constants';
	import { legendTracker, selectedProviders } from '$lib/stores/models';
	import { metricStore } from '$lib/stores/metrics';
	import { timestampsStore } from '$lib/stores/timestamps';
	import { fetchMetricsForModel, fetchMetricsForProvider } from '$lib/utils';
	import CustomCheckbox from './CustomCheckbox.svelte';

	let loading: boolean;
	let isProviderLoading: string[] = [];

	const handleModelChange = async (e: Event) => {
		let target = e.target as HTMLInputElement;
		if (target.checked) {
			try {
				loading = true;
				const metricsForModel = await fetchMetricsForModel(target.value, $timestampsStore);
				metricStore.update((prevState) => ({
					selectedModels: [...prevState.selectedModels, target.value],
					metrics: [...prevState.metrics, ...metricsForModel.metrics]
				}));
				loading = false;
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
				isProviderLoading = [...isProviderLoading, target.value];
				const metricsForProvider = await fetchMetricsForProvider(target.value, $timestampsStore);
				metricStore.update((prevState) => ({
					selectedModels: [...prevState.selectedModels, ...metricsForProvider.models],
					metrics: [
						...prevState.metrics.filter((metricObj) => metricObj.provider !== target.value),
						...metricsForProvider.metrics
					]
				}));
				isProviderLoading = isProviderLoading.filter((provider) => provider !== target.value);
			} catch (error) {
				if (error instanceof Error) {
					window.alert(`An error occurred: ${error.message}`);
				} else {
					window.alert(`An unexpected error occurred: ${error}`);
				}
			}
		} else {
			metricStore.update((prevState) => ({
				selectedModels: prevState.selectedModels.filter(
					(model) => !MODELS_BY_PROVIDER[target.value].includes(model)
				),
				metrics: prevState.metrics.filter((metricObject) => metricObject.provider !== target.value)
			}));
		}
	};
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
			loading={isProviderLoading.includes(PROVIDERS.OPEN_AI_ID)}
		/>

		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.OPEN_AI_ID] as model}
				{#if $metricStore.selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker.get(model) || 'transparent'}`}
						loading={false}
					/>
				{:else}
					<CustomCheckbox
						checked={$metricStore.selectedModels.includes(model)}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker.get(model) || 'transparent'}`}
						loading
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
			loading={isProviderLoading.includes(PROVIDERS.ANTHROPIC_ID)}
		/>

		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.ANTHROPIC_ID] as model}
				{#if $metricStore.selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker.get(model) || 'transparent'}`}
						loading={false}
					/>
				{:else}
					<CustomCheckbox
						checked={$metricStore.selectedModels.includes(model)}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker.get(model) || 'transparent'}`}
						loading
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
			loading={isProviderLoading.includes(PROVIDERS.FOREFRONT_ID)}
		/>
		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.FOREFRONT_ID] as model}
				{#if $metricStore.selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker.get(model) || 'transparent'}`}
						loading={false}
					/>
				{:else}
					<CustomCheckbox
						checked={$metricStore.selectedModels.includes(model)}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker.get(model) || 'transparent'}`}
						loading
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
			loading={isProviderLoading.includes(PROVIDERS.ALEPH_ALPHA_ID)}
		/>
		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.ALEPH_ALPHA_ID] as model}
				{#if $metricStore.selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker.get(model) || 'transparent'}`}
						loading={false}
					/>
				{:else}
					<CustomCheckbox
						checked={$metricStore.selectedModels.includes(model)}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker.get(model) || 'transparent'}`}
						loading
					/>
				{/if}
			{/each}
		</div>
	</div>
</section>

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
