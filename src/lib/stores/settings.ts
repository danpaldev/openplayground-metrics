import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';
import { writable, type Writable } from 'svelte/store';

export const globalTheme = writable('white');
