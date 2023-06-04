import { MODELS_BY_PROVIDER } from '$lib/constants';
import { PUBLIC_HOST_URL } from '$env/static/public';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tooltipValueFormatter = (value: any): string => {
	const hourRegex = /\b\d{1,2}:\d{2}:\d{2}\b/;
	const hourString = String(value).match(hourRegex);

	if (hourString) return String(hourString);
	return value;
};

export type Timestamps = {
	start?: number;
	end?: number;
};

export type Metric = {
	start_time: number;
	completion_response_time: number;
	average_token_second: number;
	first_byte_elapsed_time: number;
	model: string;
	provider: string;
};

export type MetricsResponseData = {
	metrics: Metric[];
	models: string[];
};

export const fetchMetricsForModel = async (
	model: string,
	timestamps: Timestamps
): Promise<MetricsResponseData> => {
	const url = `${PUBLIC_HOST_URL}/metrics/`; // Replace with your URL
	const data = {
		models: [model],
		timestamps
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const metrics = await response.json();

	// console.log(metrics);
	return metrics;
};

export const fetchMetricsForProvider = async (
	provider: string,
	timestamps: Timestamps
): Promise<MetricsResponseData> => {
	const target_models: string[] = MODELS_BY_PROVIDER[provider];
	const url = `${PUBLIC_HOST_URL}/metrics/`;
	const data = {
		models: target_models,
		timestamps
	};
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const metrics = await response.json();

	// console.log(metrics);
	return metrics;
};

export const updateMetricsWithTimestamps = async (
	models: string[],
	timestamps: Timestamps
): Promise<MetricsResponseData> => {
	const url = `${PUBLIC_HOST_URL}/metrics/`;
	const data = {
		models: models,
		timestamps
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const metrics = await response.json();

	// console.log(metrics);
	return metrics;
};

// Functions for Averages
interface MetricGroup {
	count: number;
	completion_response_time: number;
	average_token_second: number;
	first_byte_elapsed_time: number;
}

export interface MetricAverages {
	completion_time_avg: number;
	token_second_avg: number;
	first_byte_avg: number;
}

export const calculateAveragesByModel = (metrics: Metric[]): Record<string, MetricAverages> => {
	const groupedMetrics: Record<string, MetricGroup> = metrics.reduce(
		(acc: Record<string, MetricGroup>, metric) => {
			if (!acc[metric.model]) {
				acc[metric.model] = {
					count: 0,
					completion_response_time: 0,
					average_token_second: 0,
					first_byte_elapsed_time: 0
				};
			}

			//When a completion request fails, the "completion_response_time" will always be zero
			//Therefore, in order to ignore those failed ones, we add this conditional
			if (metric.completion_response_time > 0) {
				acc[metric.model].count++;
				acc[metric.model].completion_response_time += metric.completion_response_time;
				acc[metric.model].average_token_second += metric.average_token_second;
				acc[metric.model].first_byte_elapsed_time += metric.first_byte_elapsed_time;
			}

			return acc;
		},
		{}
	);

	const averages: Record<string, MetricAverages> = {};

	for (const model in groupedMetrics) {
		averages[model] = {
			completion_time_avg:
				groupedMetrics[model].completion_response_time / groupedMetrics[model].count,
			token_second_avg: groupedMetrics[model].average_token_second / groupedMetrics[model].count,
			first_byte_avg: groupedMetrics[model].first_byte_elapsed_time / groupedMetrics[model].count
		};
	}

	return averages;
};

/*
	Get the range of Dates in the next format ['Timestamp 12 hours ago','Timestamp Now']
	We use a 12 hour range because the backend by default returns metrics for latest 12 hrs.
*/
export const getDefaultUtcTimes = (): Array<string> => {
	const currentUtcTime = new Date();

	const utcString =
		('0' + (currentUtcTime.getUTCMonth() + 1)).slice(-2) +
		'-' + // Months are 0 based
		('0' + currentUtcTime.getUTCDate()).slice(-2) +
		'-' +
		currentUtcTime.getUTCFullYear() +
		' ' +
		('0' + currentUtcTime.getUTCHours()).slice(-2) +
		':' +
		('0' + currentUtcTime.getUTCMinutes()).slice(-2);

	currentUtcTime.setUTCHours(currentUtcTime.getUTCHours() - 12);

	const utcStringMinus12 =
		('0' + (currentUtcTime.getUTCMonth() + 1)).slice(-2) +
		'-' + // Months are 0 based
		('0' + currentUtcTime.getUTCDate()).slice(-2) +
		'-' +
		currentUtcTime.getUTCFullYear() +
		' ' +
		('0' + currentUtcTime.getUTCHours()).slice(-2) +
		':' +
		('0' + currentUtcTime.getUTCMinutes()).slice(-2);

	return [utcStringMinus12, utcString];
};

// Convert an epoch timestamp to a formatted string
export const epochToFormattedDate = (epoch: number | undefined) => {
	if (epoch === undefined) {
		throw new Error('Epoch timestamp is undefined');
	}
	const date = new Date(epoch * 1000); // JavaScript uses milliseconds

	const dateString =
		('0' + (date.getUTCMonth() + 1)).slice(-2) +
		'-' + // Months are 0 based
		('0' + date.getUTCDate()).slice(-2) +
		'-' +
		date.getUTCFullYear() +
		' ' +
		('0' + date.getUTCHours()).slice(-2) +
		':' +
		('0' + date.getUTCMinutes()).slice(-2);

	return dateString;
};
