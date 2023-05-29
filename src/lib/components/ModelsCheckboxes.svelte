<script lang="ts">
	import { Checkbox } from 'carbon-components-svelte';
	import { PROVIDERS, MODELS_BY_PROVIDER, ALL_MODELS_TEXT } from '$lib/constants';
	import { selectedModels, selectedProviders } from '$lib/stores/models';

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
			// selectedProviders.update((prevSelections) => [...prevSelections, target.value]);

			selectedModels.update((prevSelections) => [
				...new Set([...prevSelections, ...MODELS_BY_PROVIDER[target.value]])
			]);
		} else {
			// selectedProviders.update((prevSelections) =>
			// 	prevSelections.filter((provider) => provider !== target.value)
			// );
			selectedModels.update((prevSelections) =>
				prevSelections.filter((model) => !MODELS_BY_PROVIDER[target.value].includes(model))
			);
		}
	};
</script>

<section class="checkbox-container">
	<div>
		<Checkbox
			class="checkbox-provider"
			on:change={handleProviderChange}
			labelText={PROVIDERS.OPEN_AI_TEXT}
			value={PROVIDERS.OPEN_AI_ID}
		/>
		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.OPEN_AI_ID] as model}
				{#if $selectedModels.indexOf(model) !== -1}
					<Checkbox on:change={handleModelChange} labelText={model} value={model} checked={true} />
				{:else}
					<Checkbox
						on:change={handleModelChange}
						labelText={model}
						value={model}
						checked={$selectedModels.includes(model)}
					/>
				{/if}
			{/each}
		</div>
	</div>
	<div>
		<Checkbox
			class="checkbox-provider"
			on:change={handleProviderChange}
			labelText={PROVIDERS.ANTHROPIC_TEXT}
			value={PROVIDERS.ANTHROPIC_ID}
		/>
		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.ANTHROPIC_ID] as model}
				{#if $selectedModels.indexOf(model) !== -1}
					<Checkbox on:change={handleModelChange} labelText={model} value={model} checked={true} />
				{:else}
					<Checkbox
						on:change={handleModelChange}
						labelText={model}
						value={model}
						checked={$selectedModels.includes(model)}
					/>
				{/if}
			{/each}
		</div>
	</div>
	<div>
		<Checkbox
			class="checkbox-provider"
			on:change={handleProviderChange}
			labelText={PROVIDERS.OTHERS_TEXT}
			value={PROVIDERS.OTHERS_ID}
		/>
		<div class="models-checkbox-container">
			{#each MODELS_BY_PROVIDER[PROVIDERS.OTHERS_ID] as model}
				{#if $selectedModels.indexOf(model) !== -1}
					<Checkbox on:change={handleModelChange} labelText={model} value={model} checked={true} />
				{:else}
					<Checkbox
						on:change={handleModelChange}
						labelText={model}
						value={model}
						checked={$selectedModels.includes(model)}
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
