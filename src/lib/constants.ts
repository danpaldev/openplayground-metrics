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

export const PROVIDER_FOR_EACH_MODEL = new Map([
	['text-ada-001', PROVIDERS.OPEN_AI_ID],
	['text-babbage-001', PROVIDERS.OPEN_AI_ID],
	['text-curie-001', PROVIDERS.OPEN_AI_ID],
	['text-davinci-003', PROVIDERS.OPEN_AI_ID],
	['gpt-3.5-turbo', PROVIDERS.OPEN_AI_ID],
	['gpt-4', PROVIDERS.OPEN_AI_ID],
	['claude-instant-v1', PROVIDERS.ANTHROPIC_ID],
	['claude-v1', PROVIDERS.ANTHROPIC_ID],
	['claude-v1-100k', PROVIDERS.ANTHROPIC_ID],
	['claude-instant-v1-100k', PROVIDERS.ANTHROPIC_ID],
	['luminous-supreme-control', PROVIDERS.ALEPH_ALPHA_ID],
	['luminous-base', PROVIDERS.ALEPH_ALPHA_ID],
	['luminous-supreme', PROVIDERS.ALEPH_ALPHA_ID],
	['luminous-extended', PROVIDERS.ALEPH_ALPHA_ID],
	['pythia-6.9b', PROVIDERS.FOREFRONT_ID],
	['pythia-12b', PROVIDERS.FOREFRONT_ID],
	['pythia-20b', PROVIDERS.FOREFRONT_ID],
	['gpt-j-6b-vanilla', PROVIDERS.FOREFRONT_ID],
	['gpt-neox-20b-vanilla', PROVIDERS.FOREFRONT_ID]
]);

export const LEGENDS = {
	DEFAULT_TABLE_LEGEND:
		'All metrics in the table represent averages, calculated using metrics from the past 12 hours.'
};

export const COLOR_PALETTE: string[] = [
	//Tableau 10
	'#4e79a7',
	'#f28e2c',
	'#e15759',
	'#76b7b2',
	'#59a14f',
	'#edc949',
	'#af7aa1',
	'#ff9da7',
	'#9c755f',
	'#bab0ab',
	//Set 3 without Yellow
	'#8dd3c7',
	'#bebada',
	'#fb8072',
	'#80b1d3',
	'#fdb462',
	'#b3de69',
	'#fccde5',
	'#d9d9d9',
	'#bc80bd',
	//Set 2
	'#66c2a5',
	'#fc8d62',
	'#8da0cb',
	'#e78ac3',
	'#a6d854',
	'#ffd92f',
	'#e5c494',
	'#b3b3b3'
];

export const TIME_RANGES = {
	ONE_HOUR: '1h',
	TWELVE_HOURS: '12h',
	ONE_DAY: '1d',
	ONE_WEEK: '1w',
	FOUR_WEEKS: '4w'
};
