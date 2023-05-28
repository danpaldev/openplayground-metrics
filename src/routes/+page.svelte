<script lang="ts">
	import timestamps from '$lib/timestamps';
	import '@carbon/charts/styles.css';
	import { globalTheme } from '$lib/stores/settings';
	import { Dropdown } from 'carbon-components-svelte';
	import { LineChart } from '@carbon/charts-svelte';
	import { tooltipValueFormatter } from '$lib/utils';
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
		TOKENS_PER_SECOND_TEXT
	} from '$lib/constants';

	let sortType = ALL_MODELS_ID;
	let graphType = RESPONSE_TIME_ID;
</script>

<section>
	<div class="options-container">
		<Dropdown
			id="meme"
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
	</div>
	<LineChart
		theme={$globalTheme}
		data={timestamps.map((item, index) => ({
			group: item.model,
			date: item.timestamp,
			value: item.duration
		}))}
		options={{
			title: 'API response time tracker',
			axes: {
				bottom: {
					title: 'Time (UTC)',
					mapsTo: 'date',
					scaleType: 'time'
				},
				left: {
					mapsTo: 'value',
					title: 'Response Time (s)',
					scaleType: 'linear'
				}
			},
			height: '500px',
			// curve: 'curveNatural',
			tooltip: {
				valueFormatter: tooltipValueFormatter,
				truncation: {
					numCharacter: 18
				}
			},
			toolbar: {
				enabled: false
			}
		}}
	/>
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
</style>
