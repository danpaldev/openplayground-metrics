<script>
	// import Header from './Header.svelte';
	import 'carbon-components-svelte/css/all.css';
	import './styles.css';
	import { Content, Grid, Row, Column } from 'carbon-components-svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<div class="app">
	<Header />
	<Content>
		<main>
			<slot />
		</main>
	</Content>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		/* flex: 1; */
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		/* box-sizing: border-box; */
	}
</style>
