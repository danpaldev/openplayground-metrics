<script lang="ts">
	import { PROVIDERS, MODELS_BY_PROVIDER, PROVIDER_FOR_EACH_MODEL } from '$lib/constants';
	import { legendTracker } from '$lib/stores/models';
	import { metricStore } from '$lib/stores/metrics';
	import { timestampsStore } from '$lib/stores/timestamps';
	import { fetchMetricsForModel, fetchMetricsForProvider } from '$lib/utils';
	import CustomCheckbox from './CustomCheckbox.svelte';
	import { ToastNotification } from 'carbon-components-svelte';

	let isModelLoading: string[] = [];
	let isProviderLoading: string[] = [];

	let selectedProviders: string[] = [];

	let fetchError = false;
	let errorMessage = '';

	const handleModelChange = async (e: Event) => {
		let target = e.target as HTMLInputElement;
		if (target.checked) {
			try {
				isModelLoading = [...isModelLoading, target.value];
				fetchError = false;
				const metricsForModel = await fetchMetricsForModel(target.value, $timestampsStore);
				metricStore.update((prevState) => ({
					selectedModels: [...prevState.selectedModels, target.value],
					metrics: [...prevState.metrics, ...metricsForModel.metrics]
				}));
				isModelLoading = isModelLoading.filter((provider) => provider !== target.value);
			} catch (err) {
				//We deactivate the spinner for that specific checkbox
				isModelLoading = isModelLoading.filter((provider) => provider !== target.value);
				//We clean the metricStore in order to trigger the "un-checking" of the failed checkbox.
				metricStore.update((prevState) => ({
					selectedModels: prevState.selectedModels.filter((model) => model !== target.value),
					metrics: prevState.metrics
				}));

				if (err instanceof Error) {
					errorMessage = `An error occurred: ${err.message}`;
					fetchError = true;
				} else {
					errorMessage = `An unexpected error occurred: ${err}`;
					fetchError = true;
				}
			}
		} else {
			metricStore.update((prevState) => ({
				selectedModels: prevState.selectedModels.filter((model) => model !== target.value),
				metrics: prevState.metrics.filter((metricObject) => metricObject.model !== target.value)
			}));

			selectedProviders = [
				...selectedProviders.filter(
					(provider) => provider !== PROVIDER_FOR_EACH_MODEL.get(target.value)
				)
			];
		}
	};

	const handleProviderChange = async (e: Event) => {
		let target = e.target as HTMLInputElement;

		if (target.checked) {
			try {
				selectedProviders = [...selectedProviders, target.value];
				isProviderLoading = [...isProviderLoading, target.value];
				fetchError = false;

				const metricsForProvider = await fetchMetricsForProvider(target.value, $timestampsStore);
				metricStore.update((prevState) => ({
					selectedModels: [...prevState.selectedModels, ...metricsForProvider.models],
					metrics: [
						...prevState.metrics.filter((metricObj) => metricObj.provider !== target.value),
						...metricsForProvider.metrics
					]
				}));
				isProviderLoading = isProviderLoading.filter((provider) => provider !== target.value);
			} catch (err) {
				//We deactivate the spinner for that specific checkbox
				isProviderLoading = isProviderLoading.filter((provider) => provider !== target.value);
				//We clean the selectedProviders in order to trigger the "un-checking" of the failed checkbox.
				selectedProviders = selectedProviders.filter((provider) => provider !== target.value);

				if (err instanceof Error) {
					errorMessage = `An error occurred: ${err.message}`;
					fetchError = true;
				} else {
					errorMessage = `An unexpected error occurred: ${err}`;
					fetchError = true;
				}
			}
		} else {
			metricStore.update((prevState) => ({
				selectedModels: prevState.selectedModels.filter(
					(model) => !MODELS_BY_PROVIDER[target.value].includes(model)
				),
				metrics: prevState.metrics.filter((metricObject) => metricObject.provider !== target.value)
			}));

			selectedProviders = [
				...selectedProviders.filter(
					(provider) => provider !== PROVIDER_FOR_EACH_MODEL.get(target.value)
				)
			];
		}
	};
</script>

<section class="checkbox-container">
	<div>
		<CustomCheckbox
			handleChange={handleProviderChange}
			label={PROVIDERS.OPEN_AI_TEXT}
			value={PROVIDERS.OPEN_AI_ID}
			checked={selectedProviders.includes(PROVIDERS.OPEN_AI_ID)}
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
						loading={isModelLoading.includes(model)}
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
			checked={selectedProviders.includes(PROVIDERS.ANTHROPIC_ID)}
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
						loading={isModelLoading.includes(model)}
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
			checked={selectedProviders.includes(PROVIDERS.FOREFRONT_ID)}
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
						loading={isModelLoading.includes(model)}
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
			checked={selectedProviders.includes(PROVIDERS.ALEPH_ALPHA_ID)}
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
						loading={isModelLoading.includes(model)}
					/>
				{/if}
			{/each}
		</div>
	</div>
</section>

{#if fetchError}
	<ToastNotification
		class="toast-models-checkboxes"
		lowContrast
		timeout={10000}
		kind="error"
		title="Network Request Error"
		subtitle={errorMessage}
		caption={new Date().toISOString()}
	/>
{/if}

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

	:global(.toast-models-checkboxes) {
		position: fixed;
		top: 7dvh;
		right: 0px;
		z-index: 9999;
	}
</style>
