// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tooltipValueFormatter = (value: any): string => {
	const hourRegex = /\b\d{1,2}:\d{2}:\d{2}\b/;
	const hourString = String(value).match(hourRegex);

	if (hourString) return String(hourString);
	return value;
};
