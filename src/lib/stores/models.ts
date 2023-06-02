import { writable } from 'svelte/store';

// export const selectedModels = writable(['gpt-4', 'gpt-3.5-turbo', 'claude-v1']);
export const selectedModels = writable([]);
export const legendTracker = writable({});
export const selectedProviders = writable(['']);
