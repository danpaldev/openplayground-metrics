<script lang="ts">
	export let checked = false;
	export let color = '';
	export let label = '';
	export let value = '';
	export let bold = false;
	export let loading: boolean;
	export let handleChange: (e: Event) => void = () => {};

	let id = Math.random().toString(36).substring(2);

	function onCheckboxChange(e: Event) {
		handleChange(e);
	}
</script>

<label for={id}>
	<input
		{id}
		class="hidden-checkbox"
		type="checkbox"
		bind:checked
		bind:value
		on:change={onCheckboxChange}
	/>
	<div class={checked ? 'container-checked' : 'container'}>
		{#if checked && loading}
			<div class="spinner-container">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					style="margin: auto; background: none; display: block; shape-rendering: auto;"
					width="18px"
					height="18px"
					viewBox="0 0 100 100"
					preserveAspectRatio="xMidYMid"
				>
					<circle
						cx="50"
						cy="50"
						r="32"
						stroke-width="8"
						stroke="#0f62fe"
						stroke-dasharray="50.26548245743669 50.26548245743669"
						fill="none"
						stroke-linecap="round"
					>
						<animateTransform
							attributeName="transform"
							type="rotate"
							repeatCount="indefinite"
							dur="1s"
							keyTimes="0;1"
							values="0 50 50;360 50 50"
						/>
					</circle>
				</svg>
			</div>
		{/if}
		{#if checked && !loading}
			<svg xmlns="http://www.w3.org/2000/svg" width="150%" height="150%" viewBox="0 0 512 512"
				><path
					fill={color}
					fill-rule="evenodd"
					d="M448 64v384H64V64h384Zm-80.659 82.773-136.024 154.02-68.657-63.485-26.653 33.317 101.991 90.127 162.66-187.325-33.317-26.654Z"
				/></svg
			>
		{/if}
	</div>

	<span class={bold ? 'label-text-bold' : 'label-text'}>{label}</span>
</label>

<style>
	label {
		display: flex;
		margin-bottom: 5px;
	}

	.container {
		width: 1.1rem;
		height: 1.1rem;
		border: 1px solid var(--cds-text-01);
		display: grid;
		place-items: center;
		border-radius: 2px;
	}

	.spinner-container {
		display: flex;
		justify-content: start;
	}

	.container-checked {
		width: 1.1rem;
		height: 1.1rem;
		display: grid;
		place-items: center;
		border-radius: 2px;
	}

	.label-text {
		margin-left: 8px;
		cursor: pointer;
		display: flex;
	}

	.label-text-bold {
		margin-left: 8px;
		cursor: pointer;
		display: flex;
		font-weight: 800;
	}

	.hidden-checkbox {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
</style>
