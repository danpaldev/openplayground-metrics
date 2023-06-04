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

export const LEGENDS = {
	DEFAULT_TABLE_LEGEND:
		'All metrics in the table represent averages, calculated using metrics from the past 12 hours.'
};
