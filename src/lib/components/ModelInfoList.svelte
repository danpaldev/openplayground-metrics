<script lang="ts">
	import {
		StructuredList,
		StructuredListHead,
		StructuredListRow,
		StructuredListCell,
		StructuredListBody
	} from 'carbon-components-svelte';

	import { providersMap } from '$lib/timestamps';

	export let selectedProvider;

	$: getAvailableModels = Array.from(
		new Set(providersMap.get(selectedProvider)?.map((item) => item.model))
	);

	$: {
		// console.log(getAvailableModels);
	}

	const getRandomNumber = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
</script>

<StructuredList condensed>
	<StructuredListHead>
		<StructuredListRow head>
			<StructuredListCell head>Model</StructuredListCell>
			<StructuredListCell head>Response Time (Avg)</StructuredListCell>
			<StructuredListCell head>Token/Second</StructuredListCell>
		</StructuredListRow>
	</StructuredListHead>
	<StructuredListBody>
		{#each getAvailableModels as model}
			<StructuredListRow>
				<StructuredListCell noWrap>{model}</StructuredListCell>
				<StructuredListCell><span>{getRandomNumber(20, 60)}</span></StructuredListCell>
				<StructuredListCell>30.234</StructuredListCell>
			</StructuredListRow>
		{/each}
	</StructuredListBody>
</StructuredList>

<style>
	span {
		margin-left: 2rem;
	}
</style>
