import { writable, type Writable } from 'svelte/store';
import type { Timestamps } from '$lib/utils';

export const timestampsStore: Writable<Timestamps> = writable();
