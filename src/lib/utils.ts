import { MODELS_BY_PROVIDER, COLOR_PALETTE } from '$lib/constants';
import { PUBLIC_HOST_URL } from '$env/static/public';

export const tooltipValueFormatter = (value: string): string => {
	const parts = value.split('T');

	const timeParts = parts[1].split(':');

	const time = timeParts[0] + ':' + timeParts[1];

	console.log(time);

	if (time) return time;
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

	return metrics;
};

// Functions for Averages
interface MetricGroup {
	count: number;
	completion_response_time: number;
	average_token_second: number;
	first_byte_elapsed_time: number;
	completion_times: number[];
}

export interface MetricAverages {
	completion_time_avg: number;
	token_second_avg: number;
	first_byte_avg: number;
	completion_time_std: number;
}

export const calculateAveragesByModel = (metrics: Metric[]): Record<string, MetricAverages> => {
	const groupedMetrics: Record<string, MetricGroup> = metrics.reduce(
		(acc: Record<string, MetricGroup>, metric) => {
			if (!acc[metric.model]) {
				acc[metric.model] = {
					count: 0,
					completion_response_time: 0,
					average_token_second: 0,
					first_byte_elapsed_time: 0,
					//We need them again to get the STF afterwards
					completion_times: []
				};
			}

			if (metric.completion_response_time > 0) {
				acc[metric.model].count++;
				acc[metric.model].completion_response_time += metric.completion_response_time;
				acc[metric.model].average_token_second += metric.average_token_second;
				acc[metric.model].first_byte_elapsed_time += metric.first_byte_elapsed_time;
				// We add each completion time to the array again in order to get the STF afterwards
				acc[metric.model].completion_times.push(metric.completion_response_time);
			}

			return acc;
		},
		{}
	);

	const averages: Record<string, MetricAverages> = {};

	for (const model in groupedMetrics) {
		const completion_time_avg =
			groupedMetrics[model].completion_response_time / groupedMetrics[model].count;

		//STD Calculation
		const sumOfSquares = groupedMetrics[model].completion_times.reduce((sum, value) => {
			const diff = value - completion_time_avg;
			return sum + diff * diff;
		}, 0);

		const stdDev = Math.sqrt(sumOfSquares / groupedMetrics[model].count);

		averages[model] = {
			completion_time_avg,
			token_second_avg: groupedMetrics[model].average_token_second / groupedMetrics[model].count,
			first_byte_avg: groupedMetrics[model].first_byte_elapsed_time / groupedMetrics[model].count,
			completion_time_std: stdDev
		};
	}

	return averages;
};

// Convert an epoch timestamp to a formatted string: 06-04-2023 02:06
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

export const mapColorToModels = (): Map<string, string> => {
	let models: string[] = [];
	for (const [, value] of Object.entries(MODELS_BY_PROVIDER)) {
		models = [...models, ...value];
	}

	const result: [string, string][] = models.map((model) => [
		model,
		COLOR_PALETTE.shift() as string
	]);
	const map: Map<string, string> = new Map(result);
	return map;
};

//It will round the Timestamp to have a minute that is multiple of 5
//In this way, it will match the nearest timestamp in out plot
//(Where our data is from every 5 minutes and therefore this will always work)
export const getRoundedTimestamp = (timestampStr: string) => {
	const timestamp = new Date(timestampStr);

	let minutes = timestamp.getUTCMinutes();
	const remainder = minutes % 5;

	if (remainder >= 3) {
		// if closer to the next multiple of 5
		minutes += 5 - remainder;
	} else {
		// if closer to the previous multiple of 5
		minutes -= remainder;
	}

	timestamp.setUTCMinutes(minutes);

	const year = timestamp.getUTCFullYear();
	const month = (timestamp.getUTCMonth() + 1).toString().padStart(2, '0');
	const day = timestamp.getUTCDate().toString().padStart(2, '0');
	const hour = timestamp.getUTCHours().toString().padStart(2, '0');
	const minute = timestamp.getUTCMinutes().toString().padStart(2, '0');

	return `${year}-${month}-${day}T${hour}:${minute}`;
};
