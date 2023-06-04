import { writable, type Writable } from 'svelte/store';
import type { CarbonTheme } from 'carbon-components-svelte/types/Theme/Theme.svelte';

export const globalTheme: Writable<CarbonTheme> = writable('white');
