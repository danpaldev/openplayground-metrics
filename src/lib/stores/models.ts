import { writable, readable, type Readable } from 'svelte/store';
import { mapColorToModels } from '$lib/utils';

export const legendTracker: Readable<Map<string, string>> = readable(mapColorToModels());
export const selectedProviders = writable(['']);
