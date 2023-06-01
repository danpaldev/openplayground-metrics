<script lang="ts">
	import { Checkbox } from 'carbon-components-svelte';
	import { PROVIDERS, MODELS_BY_PROVIDER, ALL_MODELS_TEXT } from '$lib/constants';
	import { selectedModels, legendTracker, selectedProviders } from '$lib/stores/models';
	import CustomCheckbox from './CustomCheckbox.svelte';

	const handleModelChange = (e: Event) => {
		let target = e.target as HTMLInputElement;
		if (target.checked) {
			selectedModels.update((prevSelections) => [...prevSelections, target.value]);
		} else {
			selectedModels.update((prevSelections) =>
				prevSelections.filter((model) => model !== target.value)
			);
		}
	};

	const handleProviderChange = (e: Event) => {
		let target = e.target as HTMLInputElement;

		if (target.checked) {
			$selectedProviders = [...$selectedProviders, target.value];
			selectedModels.update((prevSelections) => [
				...new Set([...prevSelections, ...MODELS_BY_PROVIDER[target.value]])
			]);
		} else {
			selectedProviders.update((prevSelections) =>
				prevSelections.filter((provider) => provider !== target.value)
			);
			selectedModels.update((prevSelections) =>
				prevSelections.filter((model) => !MODELS_BY_PROVIDER[target.value].includes(model))
			);
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
		/>

		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.OPEN_AI_ID] as model}
				{#if $selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{:else}
					<CustomCheckbox
						checked={$selectedModels.includes(model)}
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
		/>

		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.ANTHROPIC_ID] as model}
				{#if $selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{:else}
					<CustomCheckbox
						checked={$selectedModels.includes(model)}
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
			label={PROVIDERS.OTHERS_TEXT}
			value={PROVIDERS.OTHERS_ID}
			checked={$selectedProviders.includes(PROVIDERS.OTHERS_ID)}
			color={$selectedProviders.includes(PROVIDERS.OTHERS_ID) ? 'black' : ''}
		/>
		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.OTHERS_ID] as model}
				{#if $selectedModels.indexOf(model) !== -1}
					<CustomCheckbox
						checked={true}
						handleChange={handleModelChange}
						label={model}
						value={model}
						color={`${$legendTracker[model]}`}
					/>
				{:else}
					<CustomCheckbox
						checked={$selectedModels.includes(model)}
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

{#each $selectedModels as model}
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
		margin-top: 0.5rem;
	}

	:global(.checkbox-provider > *) {
		font-weight: 600;
	}
</style>
