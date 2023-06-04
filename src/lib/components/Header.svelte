<script lang="ts">
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderUtilities,
		HeaderGlobalAction,
		HeaderActionLink,
		SkipToContent
	} from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/all.css';
	import GithubIcon from '$lib/icons/GithubIcon.svelte';
	import DiscordIcon from '$lib/icons/DiscordIcon.svelte';
	import LightModeIcon from '$lib/icons/LightModeIcon.svelte';
	import DarkModeIcon from '$lib/icons/DarkModeIcon.svelte';

	import { Theme } from 'carbon-components-svelte';
	import { globalTheme } from '$lib/stores/settings';

	$: theme = $globalTheme;

	const toggleGlobalTheme = () => {
		globalTheme.update((oldTheme) => (oldTheme === 'white' ? 'g90' : 'white'));
	};
</script>

<Header company="Nat.dev">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
		<HeaderNavItem href="/" text="Playground" />
		<HeaderNavItem href="/" text="Compare" />
		<HeaderNavItem href="/" text="Chat" />
		<HeaderNavItem href="/" text="Metrics   " />
	</HeaderNav>
	<HeaderUtilities>
		<Theme bind:theme persist persistKey="__carbon-theme" />
		<HeaderActionLink
			target="_blank"
			href="https://discord.com/invite/JAdwnWKMth"
			aria-label="Discord Icon"
			icon={DiscordIcon}
		/>
		<HeaderActionLink
			target="_blank"
			href="https://github.com/nat/openplayground"
			aria-label="Github Icon"
			icon={GithubIcon}
		/>
		<HeaderGlobalAction
			aria-label="Global Theme Icon"
			icon={theme === 'white' ? DarkModeIcon : LightModeIcon}
			on:click={toggleGlobalTheme}
		/>
	</HeaderUtilities>
</Header>
