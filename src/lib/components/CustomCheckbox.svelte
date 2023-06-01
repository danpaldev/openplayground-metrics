<script lang="ts">
	export let checked = false;
	export let color = 'transparent';
	export let label = '';
	export let value = '';
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
	<div class="container">
		{#if checked}
			<svg xmlns="http://www.w3.org/2000/svg" width="150%" height="150%" viewBox="0 0 512 512"
				><path
					fill={color}
					fill-rule="evenodd"
					d="M448 64v384H64V64h384Zm-80.659 82.773-136.024 154.02-68.657-63.485-26.653 33.317 101.991 90.127 162.66-187.325-33.317-26.654Z"
				/></svg
			>
		{/if}
	</div>

	<span class="label-text">{label}</span>
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

	/* .checkbox::before {
		content: '';
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		width: 14px;
		height: 14px;
		background-color: currentColor;
		transform: translate(-50%, -50%) scale(var(--scale, 0));
		transition: transform 0.1s;
	} */

	/* .checkbox.checked::before {
		--scale: 1;
	} */

	.label-text {
		margin-left: 8px;
		cursor: pointer;
		display: flex;
		/* border: 8px; */
	}

	.hidden-checkbox {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}
</style>
