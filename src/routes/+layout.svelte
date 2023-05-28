<script>
	import 'carbon-components-svelte/css/all.css';
	import './styles.css';
	import { Content } from 'carbon-components-svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<svelte:head>
	<title>Openplayground Metrics</title>
	<meta name="description" content="AI Model Metrics Site" />
</svelte:head>

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
