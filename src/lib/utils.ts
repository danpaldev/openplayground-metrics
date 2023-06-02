// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tooltipValueFormatter = (value: any): string => {
	const hourRegex = /\b\d{1,2}:\d{2}:\d{2}\b/;
	const hourString = String(value).match(hourRegex);

	if (hourString) return String(hourString);
	return value;
};

type Timestamps = {
	start: string;
	end: string;
};

type Metric = {
	start_time: number;
	completion_response_time: number;
	average_token_second: number;
	first_byte_elapsed_time: number;
	model: string;
};

type MetricResponseData = {
	metrics: Metric[];
	models: string[];
};

export const fetchMetricsForModel = async (
	model: string,
	timestamps?: Timestamps
): Promise<MetricResponseData> => {
	const url = 'http://127.0.0.1:8000/metrics/'; // Replace with your URL
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

	// Do something with the metrics
	console.log(metrics);
	return metrics;
};
