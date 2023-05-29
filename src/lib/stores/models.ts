import { writable, derived } from 'svelte/store';

export const selectedModels = writable(['gpt-4', 'gpt-3.5-turbo', 'claude-v1']);
export const selectedProviders = writable(['']);

export const selectedModelsDerived = derived(selectedModels, ($selectedModels) => selectedModels);
