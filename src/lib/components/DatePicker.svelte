<script lang="ts">
	import { metricStore } from '$lib/stores/metrics';
	import { timestampsStore } from '$lib/stores/timestamps';
	import { updateMetricsWithTimestamps } from '$lib/utils';
	import { TIME_RANGES } from '$lib/constants';
	import { InlineLoading } from 'carbon-components-svelte';
	import { ToastNotification } from 'carbon-components-svelte';

	let selectedTimeRange: string = TIME_RANGES.TWELVE_HOURS;
	let loading = false;
	let fetchError = false;
	let errorMessage = '';

	const updateMetrics = async () => {
		try {
			loading = true;
			fetchError = false;

			const results = await updateMetricsWithTimestamps(
				$metricStore.selectedModels,
				$timestampsStore
			);
			/*
				Sort the metrics by timestamp before applying them to the store.
				This fixes a bug where conflicting timestamps mess up with d3.js lines
			 */
			results.metrics.sort((a, b) => a.start_time - b.start_time);

			metricStore.set({
				selectedModels: results.models,
				metrics: results.metrics
			});
			loading = false;
		} catch (err) {
			loading = false;
			if (err instanceof Error) {
				errorMessage = `An error occurred: ${err.message}`;
				fetchError = true;
			} else {
				errorMessage = `An unexpected error occurred: ${err}`;
				fetchError = true;
			}
		}
	};

	const handleClick = async (event: MouseEvent | KeyboardEvent) => {
		const target = event.target as HTMLDivElement;
		//We make this to prevent unnecesary network requests
		if (selectedTimeRange === target.textContent) return;

		selectedTimeRange = target.textContent || '';

		const epochNow = Math.floor(new Date().getTime() / 1000);

		let start;

		switch (selectedTimeRange) {
			case TIME_RANGES.ONE_HOUR:
				start = epochNow - 60 * 60;
				break;
			case TIME_RANGES.TWELVE_HOURS:
				start = epochNow - 12 * 60 * 60;
				break;
			case TIME_RANGES.ONE_DAY:
				start = epochNow - 24 * 60 * 60;
				break;
			case TIME_RANGES.ONE_WEEK:
				start = epochNow - 7 * 24 * 60 * 60;
				break;
			case TIME_RANGES.FOUR_WEEKS:
				start = epochNow - 4 * 7 * 24 * 60 * 60;
				break;
			default:
				return;
		}

		timestampsStore.set({ start, end: epochNow });
		await updateMetrics();
	};
</script>

<section class="date-picker-container">
	<div class="loading-spinner">
		{#if loading}
			<InlineLoading description="Reloading metrics..." />
		{/if}
	</div>
	<div class="date-picker">
		<button
			class="date-option"
			on:click={handleClick}
			class:date-option-selected={selectedTimeRange == TIME_RANGES.ONE_HOUR}
		>
			{TIME_RANGES.ONE_HOUR}
		</button>
		<button
			class="date-option"
			on:click={handleClick}
			class:date-option-selected={selectedTimeRange == TIME_RANGES.TWELVE_HOURS}
		>
			{TIME_RANGES.TWELVE_HOURS}
		</button>
		<button
			class="date-option"
			on:click={handleClick}
			class:date-option-selected={selectedTimeRange == TIME_RANGES.ONE_DAY}
		>
			{TIME_RANGES.ONE_DAY}
		</button>
		<button
			class="date-option"
			on:click={handleClick}
			class:date-option-selected={selectedTimeRange == TIME_RANGES.ONE_WEEK}
			disabled={true}
		>
			{TIME_RANGES.ONE_WEEK}
		</button>
		<button
			class="date-option"
			on:click={handleClick}
			class:date-option-selected={selectedTimeRange == TIME_RANGES.FOUR_WEEKS}
			disabled={true}
		>
			{TIME_RANGES.FOUR_WEEKS}
		</button>
	</div>
</section>

{#if fetchError}
	<ToastNotification
		class="toast-date-picker"
		lowContrast
		timeout={10000}
		kind="error"
		title="Network Request Error"
		subtitle={errorMessage}
		caption={new Date().toISOString()}
	/>
{/if}

<style>
	.date-picker-container {
		display: flex;
		flex-direction: row;
		width: 95%;
		justify-content: flex-end;
		height: 2rem;
	}

	.date-picker {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-template-rows: auto;
		grid-auto-rows: 1fr;
		width: 40%;
		border: 1px solid var(--cds-border-strong);
	}

	.loading-spinner {
		width: 60%;
	}

	.date-option {
		display: grid;
		place-items: center;
		/* Disable all the default button's styles */
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}

	.date-option:disabled {
		display: grid;
		place-items: center;
		background: var(--cds-disabled-01);
		color: var(--cds-disabled-03);
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}

	.date-option:hover,
	.date-option-selected {
		display: grid;
		place-items: center;
		background-color: var(--cds-selected-ui);
		cursor: pointer;
	}

	:global(.toast-date-picker) {
		position: fixed;
		top: 7dvh;
		right: 0px;
		z-index: 9999;
	}
</style>
