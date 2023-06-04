// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import * as d3 from 'd3';
import { tooltipValueFormatter } from '$lib/utils.js';

export const generateLinearChart = (
	targetElement: SVGSVGElement,
	dataOriginal: unknown,
	legendTracker: Map<string, string>
) => {
	const chart = d3.select(targetElement);
	const margin = { top: 20, right: 30, bottom: 50, left: 70 };
	const width = chart.attr('width') - margin.left - margin.right;
	const height = chart.attr('height') - margin.top - margin.bottom;

	const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');

	const data = dataOriginal.map((d, i, arr) => {
		const epochToIso = new Date(parseInt(d.start_time) * 1000).toISOString();
		let duration = d.completion_response_time;
		let error = false;

		if (duration === 0) {
			error = true;
			for (let j = i - 1; j >= 0; j--) {
				if (arr[j].completion_response_time !== 0) {
					duration = arr[j].completion_response_time;
					break;
				}
			}
		}

		return {
			...d,
			timestamp: parseTime(epochToIso),
			duration: duration,
			error: error
		};
	});

	const x = d3
		.scaleTime()
		.domain(d3.extent(data, (d) => d.timestamp))
		.range([margin.left, width - margin.right]);

	const y = d3
		.scaleLinear()
		.domain([0, 150])
		.range([height - margin.bottom, margin.top]);

	const line = d3
		.line()
		.x((d) => x(d.timestamp))
		.y((d) => y(d.duration));

	const timeFormatHour = d3.timeFormat('%H:%M');
	const timeFormatDate = d3.timeFormat('%b %d');

	const plottedDataGroup = chart
		.selectAll('.plotted-data')
		.data([null])
		.join('g')
		.attr('class', 'plotted-data');

	const xAxisGroup = chart
		.selectAll('.x-axis-group')
		.data([null])
		.join('g')
		.attr('class', 'x-axis-group');
	const yAxisGroup = chart
		.selectAll('.y-axis-group')
		.data([null])
		.join('g')
		.attr('class', 'y-axis-group');

	// Add the X Axis
	const xAxis = xAxisGroup
		.attr('transform', `translate(0, ${height - margin.bottom})`)
		.selectAll('g')
		.data(x.ticks())
		.join('g')
		.attr('transform', (d) => `translate(${x(d)},0)`);

	xAxis
		.selectAll('line')
		.data((d) => [d])
		.join('line')
		.attr('stroke-opacity', 0.2)
		.attr('y2', -height)
		.attr('stroke', 'currentColor');

	xAxis
		.selectAll('text')
		.data((d) => [d])
		.join('text')
		.attr('y', margin.bottom - 25)
		.attr('class', 'x-axis-label')
		.attr('text-anchor', 'middle')
		.each(function (d, i) {
			if (i === 0 || timeFormatHour(d) === '00:00') {
				d3.select(this)
					.selectAll('tspan')
					.data([
						{ text: timeFormatHour(d), dy: null },
						{ text: timeFormatDate(d), dy: '1.2em' }
					])
					.join('tspan')
					.attr('x', 0)
					.attr('dy', (d) => d.dy)
					.text((d) => d.text);
			} else {
				d3.select(this).text(timeFormatHour(d));
			}
		});

	// Add the Y Axis (Updating existing elements instead of generating them again!!)
	const yAxisElement = yAxisGroup
		.selectAll('.y-axis-label')
		.data([null])
		.join('g')
		.attr('transform', `translate(${margin.left}, 0)`)
		.attr('class', 'y-axis-label')
		.call(d3.axisLeft(y));

	yAxisElement
		.selectAll('.tick line')
		.data(y.ticks(), (d) => d)
		.join('line')
		.attr('stroke-opacity', 0.2)
		.attr('x2', width)
		.attr('stroke', 'currentColor');

	// Add axis labels (Updating existing labels instead of generating them again!!)
	chart
		.selectAll('.chart-legend-x')
		.data([null])
		.join('text')
		.attr('class', 'chart-legend chart-legend-x')
		.attr('text-anchor', 'end')
		.attr('x', (width + margin.left + margin.right) / 2)
		.attr('y', height + margin.bottom - 30)
		.text('Time (UTC)');

	chart
		.selectAll('.chart-legend-y')
		.data([null])
		.join('text')
		.attr('class', 'chart-legend chart-legend-y')
		.attr('text-anchor', 'middle')
		.attr('transform', 'rotate(-90)')
		.attr('y', margin.left - 40)
		.attr('x', -height / 2)
		.text('Completion Response Time (s)');

	const models = d3.group(data, (d) => d.model);
	const color = d3
		.scaleOrdinal()
		.range([...d3.schemeTableau10, ...d3.schemeSet3, ...d3.schemePastel1]);
	// const colorMap: {
	// 	[key: string]: string;
	// } = {};

	plottedDataGroup.selectAll('path').remove();
	plottedDataGroup.selectAll('circle').remove();

	models.forEach((values, modelName) => {
		let modelColor;

		if (legendTracker.has(modelName)) {
			modelColor = legendTracker.get(modelName);
		} else {
			modelColor = color(`${modelName}${Math.random}`);
		}

		const path = plottedDataGroup
			.append('path')
			.datum(values)
			.attr('fill', 'none')
			.attr('stroke', modelColor)
			.attr('stroke-width', 3.5)
			.attr('d', line);

		values.forEach((d) => {
			plottedDataGroup
				.append('circle')
				.attr('cx', x(d.timestamp))
				.attr('cy', y(d.duration))
				.attr('r', 4)
				.attr('fill', d.error ? 'red' : modelColor) // Set the circle color based on the error property
				.style('opacity', d.error ? 1 : 0) // Set the opacity based on the error property
				.on('mouseover', function (event) {
					const [x, y] = d3.pointer(event);

					const errorTooltip = `<p>Time (UTC):</p><span>${tooltipValueFormatter(
						d.timestamp
					)}</span><br><br><div>Request Error</div><br>`;

					const normalTooltip = `<p>Time (UTC):</p></span> <span>${tooltipValueFormatter(
						d.timestamp
					)}</span><br><br><p>Response Time(s):</p><span>${d.duration.toFixed(2)} (s)</span>`;

					const tooltipContent = d.error ? errorTooltip : normalTooltip;

					d3.select('#tooltip')
						.style('left', event.clientX + 10 + 'px')
						.style('top', event.clientY - 10 + 'px')
						.style('visibility', 'visible')
						.html(tooltipContent);
				})
				.on('mouseout', function () {
					d3.select('#tooltip').style('visibility', 'hidden');
				});
		});

		path
			.on('mouseover', function () {
				d3.select(event.target).transition().duration(200).attr('stroke-width', 5);
			})
			.on('mouseout', function () {
				d3.select(event.target).transition().duration(200).attr('stroke-width', 3.5);
			});
	});

	// return colorMap;
};