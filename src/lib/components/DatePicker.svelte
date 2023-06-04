<script lang="ts">
	import Flatpickr from 'svelte-flatpickr';
	import { Button } from 'carbon-components-svelte';
	import Calendar from 'carbon-icons-svelte/lib/Calendar.svelte';
	import SendFilled from 'carbon-icons-svelte/lib/SendFilled.svelte';
	import '$lib/flatpickr.css';
	import { metricStore } from '$lib/stores/metrics';
	import { timestampsStore } from '$lib/stores/timestamps';
	import { updateMetricsWithTimestamps, getDefaultUtcTimes } from '$lib/utils';

	let value: undefined | Date[] = undefined;
	let formattedValue: string;
	let flatpickr: { open: () => void; calendarContainer: { focus: () => void }; clear: () => void };
	let options: { [key: string]: string | string[] | boolean | ((...args: any[]) => void) };

	//Used to prevent unnecesary network requests
	let didTimestampChange = false;

	$: options = {
		mode: 'range',
		dateFormat: 'm-d-Y H:i',
		minDate: '06-02-2023 03:05',
		defaultDate: getDefaultUtcTimes(),
		enableTime: true,
		time_24hr: true,
		onChange(selectedDates: Array<Date>, dateStr: string) {
			//With this, we make flatpickr to use the UTC timezone
			const epochTimes = selectedDates.map((date: Date) => {
				const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
				const utcDate = new Date(date.getTime() - timezoneOffset);
				return Math.floor(utcDate.getTime() / 1000);
			});

			const epochTimestamps = { start: epochTimes[0], end: epochTimes[1] };
			timestampsStore.set(epochTimestamps);

			//We make this true in order to allow fetch requests again
			didTimestampChange = true;
		}
	};

	function handleOpen(event: MouseEvent) {
		event.preventDefault();

		if (flatpickr) {
			flatpickr.open();
			flatpickr.calendarContainer.focus();
		}
	}

	function handleClear() {
		if (flatpickr) {
			flatpickr.clear();
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		console.log($timestampsStore);
		if (!didTimestampChange) return;
		if (!$timestampsStore.start || !$timestampsStore.end) {
			window.alert('You must select a valid data and hour range!');
			return;
		}

		try {
			const results = await updateMetricsWithTimestamps(
				$metricStore.selectedModels,
				$timestampsStore
			);
			metricStore.set({
				selectedModels: results.models,
				metrics: results.metrics
			});
			didTimestampChange = false;
		} catch (error) {
			if (error instanceof Error) {
				window.alert(`An error occurred: ${error.message}`);
			} else {
				window.alert(`An unexpected error occurred: ${error}`);
			}
		}
	}
</script>

<div>
	<Button
		style={'margin-right: 10px;'}
		kind="tertiary"
		iconDescription="Open Calendar"
		icon={Calendar}
		on:click={handleOpen}
	/>

	<form on:submit={handleSubmit}>
		<Flatpickr
			class="flatpickr-field"
			{options}
			bind:value
			bind:formattedValue
			name="date"
			bind:flatpickr
			on:close={() => {
				console.log('closed');
			}}
		/>

		<Button
			type="submit"
			style="margin-left: 10px;"
			kind="tertiary"
			iconDescription="Reload Data"
			icon={SendFilled}
		/>
	</form>
</div>

<style>
	div {
		width: 100%;
		padding: 1em;
		margin-bottom: 1rem;
		display: flex;
		justify-content: center;
		align-content: center;
	}

	:global(.flatpickr-field) {
		border: 1px solid transparent;
		display: inline-block;
		width: 20rem;
		text-align: center;
		font-size: 1rem;
		font-weight: 400;
		color: var(--cds-text-primary);
		padding: 0.7rem;
		border-radius: 3px;
		background-color: var(--cds-field);
	}
</style>
