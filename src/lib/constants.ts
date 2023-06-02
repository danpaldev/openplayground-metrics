//Dropdowns constants
export const ALL_MODELS_ID = 'all_models';
export const ALL_MODELS_TEXT = 'All Models';
export const BY_PROVIDER_ID = 'by_provider';
export const BY_PROVIDER_TEXT = 'By Provider';
export const RESPONSE_TIME_ID = 'response_time';
export const RESPONSE_TIME_TEXT = 'Response Time';
export const RESPONSE_TIME_DUAL_ID = 'response_time_dual_y';
export const RESPONSE_TIME_DUAL_TEXT = 'Response Time (Dual Y Axis)';
export const TOKENS_PER_SECOND_ID = 'tokens_per_second';
export const TOKENS_PER_SECOND_TEXT = 'Tokens/Second';

//Providers constants
export const PROVIDERS = {
	OPEN_AI_ID: 'openai',
	ANTHROPIC_ID: 'anthropic',
	OPEN_AI_TEXT: 'OpenAI',
	ANTHROPIC_TEXT: 'Anthropic',
	ALEPH_ALPHA_ID: 'aleph-alpha',
	ALEPH_ALPHA_TEXT: 'Aleph Alpha',
	FOREFRONT_ID: 'forefront',
	FOREFRONT_TEXT: 'Forefront'
};

export const PROVIDERS_INDEXES = new Map([
	[0, PROVIDERS.OPEN_AI_ID],
	[1, PROVIDERS.ANTHROPIC_ID]
]);

export const second_try = new Map([
	[
		0,
		{
			provider_id: 'open_ai',
			provider_name: 'OpenAI'
		}
	],
	[
		1,
		{
			provider_id: 'anthropic',
			provider_name: 'Anthropic'
		}
	],
	[
		2,
		{
			provider_id: 'others',
			provider_name: 'Others'
		}
	]
]);

export const MODELS_BY_PROVIDER = {
	[PROVIDERS.OPEN_AI_ID]: [
		'text-ada-001',
		'text-babbage-001',
		'text-curie-001',
		'text-davinci-003',
		'gpt-3.5-turbo',
		'gpt-4'
		// 'text-davinci-002'
	],
	[PROVIDERS.ANTHROPIC_ID]: [
		'claude-instant-v1',
		'claude-v1',
		'claude-v1-100k',
		'claude-instant-v1-100k'
	],
	[PROVIDERS.ALEPH_ALPHA_ID]: [
		'luminous-supreme-control',
		'luminous-base',
		'luminous-supreme',
		'luminous-extended'
	],
	[PROVIDERS.FOREFRONT_ID]: [
		'pythia-6.9b',
		'pythia-12b',
		'pythia-20b',
		'gpt-j-6b-vanilla',
		'gpt-neox-20b-vanilla'
	]
};
