import { writable } from 'svelte/store';

export const metricStore = writable({ selectedModels: [], metrics: [] });
