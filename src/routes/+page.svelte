<script lang="ts">
	import '@carbon/charts/styles.css';
	import { Dropdown } from 'carbon-components-svelte';
	import LineChartComponent from '$lib/components/LineChartComponent.svelte';
	import { ContentSwitcher, Switch } from 'carbon-components-svelte';
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
		PROVIDERS
	} from '$lib/constants';

	let sortType = ALL_MODELS_ID;
	let graphType = RESPONSE_TIME_ID;

	let selectedIndex = 0;
	$: selectedProvider = Object.keys(PROVIDERS)[selectedIndex];
</script>

<section>
	<div class="options-container">
		<Dropdown
			size="lg"
			titleText="Sort by"
			bind:selectedId={sortType}
			items={[
				{ id: ALL_MODELS_ID, text: ALL_MODELS_TEXT },
				{ id: BY_PROVIDER_ID, text: BY_PROVIDER_TEXT }
			]}
		/>

		<Dropdown
			size="lg"
			titleText="Graph by"
			bind:selectedId={graphType}
			items={[
				{ id: RESPONSE_TIME_ID, text: RESPONSE_TIME_TEXT },
				{ id: RESPONSE_TIME_DUAL_ID, text: RESPONSE_TIME_DUAL_TEXT },
				{ id: TOKENS_PER_SECOND_ID, text: TOKENS_PER_SECOND_TEXT }
			]}
		/>

		{#if sortType === BY_PROVIDER_ID}
			<div class="switch-container">
				<ContentSwitcher bind:selectedIndex>
					{#each Object.entries(PROVIDERS).map( ([key, value]) => ({ key, value }) ) as { key, value }}
						<Switch text={value} />
					{/each}
				</ContentSwitcher>
			</div>
		{/if}
	</div>
	<LineChartComponent sortType />
	<!-- <p>{selectedProvider}</p> -->
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
		grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr;
		align-items: center;
		gap: 2rem;
		width: 100%;
		margin-bottom: 2rem;
		/* height: 100%; */
		/* border: 1px solid red; */
	}

	.switch-container {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column-reverse;
		/* border: 1px solid red; */
	}
</style>
