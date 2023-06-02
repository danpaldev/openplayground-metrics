import { writable, type Writable } from 'svelte/store';
import type { Metric } from '$lib/utils';

type MetricStore = {
	selectedModels: string[];
	metrics: Metric[];
};

export const metricStore: Writable<MetricStore> = writable({
	selectedModels: [],
	metrics: []
});
