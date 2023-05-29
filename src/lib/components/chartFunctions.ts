/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as d3 from 'd3';

export const generateLinearChart = (targetElement: SVGSVGElement, data: unknown): void => {
	const chart = d3.select(targetElement);
	const margin = { top: 20, right: 30, bottom: 50, left: 70 };
	const width = parseInt(chart.attr('width') || '0') - margin.left - margin.right;
	const height = parseInt(chart.attr('height') || '0') - margin.top - margin.bottom;

	const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S');
	data.forEach((d) => {
		d.timestamp = parseTime(d.timestamp);
	});

	const x = d3
		.scaleTime()
		.domain(d3.extent(data, (d) => d.timestamp))
		.range([margin.left, width - margin.right]);

	const y = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.duration)])
		.range([height - margin.bottom, margin.top]);

	const line = d3
		.line()
		.x((d) => x(d.timestamp))
		.y((d) => y(d.duration));

	const g = chart.append('g');

	// Add the lines
	const models = d3.group(data, (d) => d.model);
	models.forEach((values, modelName) => {
		g.append('path')
			.datum(values)
			.attr('fill', 'none')
			.attr('stroke', (d) => (d[0].model === 'gpt-3.5-turbo' ? 'blue' : 'red'))
			.attr('stroke-width', 1.5)
			.attr('d', line);
	});

	// Add the X Axis
	g.append('g')
		.attr('transform', `translate(0, ${height - margin.bottom})`)
		.call(d3.axisBottom(x));

	// Add the Y Axis
	g.append('g').attr('transform', `translate(${margin.left}, 0)`).call(d3.axisLeft(y));

	// Add axis labels
	chart
		.append('text')
		.attr('text-anchor', 'end')
		.attr('x', width - margin.right)
		.attr('y', height - margin.bottom + 30)
		.text('Time (Timestamp)');

	chart
		.append('text')
		.attr('text-anchor', 'end')
		.attr('transform', 'rotate(-90)')
		.attr('y', margin.left - 50)
		.attr('x', -margin.top)
		.text('Duration');
};
