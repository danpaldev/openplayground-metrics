// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import * as d3 from 'd3';
import { tooltipValueFormatter } from '$lib/utils.js';

export const generateLinearChart = (targetElement: SVGSVGElement, dataOriginal: unknown) => {
	const chart = d3.select(targetElement);
	// chart.selectAll('*').remove();
	// const chart = d3.select('#chart');
	// if (!chart?.attr) return;
	// chart.selectAll('path,circle').remove();
	chart.selectAll('.plotted-data').remove();
	const margin = { top: 20, right: 30, bottom: 50, left: 70 };
	const width = chart.attr('width') - margin.left - margin.right;
	const height = chart.attr('height') - margin.top - margin.bottom;

	// const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S');
	const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');
	// data.forEach((d) => {
	// 	d.timestamp = parseTime(d.timestamp);
	// });

	const data = dataOriginal.map((d) => {
		const epochToIso = new Date(parseInt(d.start_time) * 1000).toISOString();
		// console.log(epochToIso);
		return {
			...d,
			timestamp: parseTime(epochToIso),
			duration: d.completion_response_time
		};
	});

	// console.log(data);

	const x = d3
		.scaleTime()
		.domain(d3.extent(data, (d) => d.timestamp))
		.range([margin.left, width - margin.right]);

	const y = d3
		.scaleLinear()
		// 0-60 seconds
		.domain([0, 150])
		.range([height - margin.bottom, margin.top]);

	const line = d3
		.line()
		.x((d) => x(d.timestamp))
		.y((d) => y(d.duration));

	const g = chart.append('g');

	//Step to add the lines to the chart
	const models = d3.group(data, (d) => d.model);
	const color = d3
		.scaleOrdinal()
		.range([...d3.schemeTableau10, ...d3.schemeSet3, ...d3.schemePastel1]);
	// Object that keeps track of models' color
	const colorMap = {};

	models.forEach((values, modelName) => {
		// Get unique color for each model
		const modelColor = color(modelName);
		colorMap[modelName] = modelColor;

		// Createing the line
		const path = g
			.append('path')
			.datum(values)
			.attr('fill', 'none')
			// Hover doesn't like classes
			//.attr("class", "chart-line")
			.attr('stroke', modelColor)
			.attr('stroke-width', 3.5)
			.attr('d', line)
			.attr('class', 'plotted-data');
		// Create an invisible circle for each data point in the line
		values.forEach((d) => {
			g.append('circle')
				.attr('cx', x(d.timestamp))
				.attr('cy', y(d.duration))
				.attr('r', 6) // Set a small radius for hover activation
				.style('opacity', 0) // We don't want to see the circle, just its hover
				.attr('class', 'plotted-data')
				.on('mouseover', function (event) {
					// Getting the cursor position
					const [x, y] = d3.pointer(event);

					d3.select('#tooltip')
						.style('left', event.clientX + 10 + 'px')
						.style('top', event.clientY - 10 + 'px')
						.style('visibility', 'visible')
						.html(
							`<strong>Time (UTC):</strong> <span>${tooltipValueFormatter(
								d.timestamp
							)}</span><br><br><strong>Duration:</strong> <span>${d.duration} (s)</span>`
						);
				})
				.on('mouseout', function () {
					d3.select('#tooltip').style('visibility', 'hidden');
				});
		});
		// Adding a hover effect to the line
		path
			.on('mouseover', function (d) {
				// On mouseover, make the line thicker
				d3.select(event.target).transition().duration(200).attr('stroke-width', 5);
			})
			.on('mouseout', function (d) {
				// On mouseout, revert the line to its original width
				d3.select(event.target).transition().duration(200).attr('stroke-width', 3.5); // Make the line thinner
			});
	});

	// Custom time format functions
	const timeFormatHour = d3.timeFormat('%H:%M');
	const timeFormatDate = d3.timeFormat('%b %d');

	// Add the X Axis
	const xAxis = g.append('g').attr('transform', `translate(0, ${height - margin.bottom})`);

	xAxis
		.selectAll('g')
		.data(x.ticks())
		.enter()
		.append('g')
		.attr('transform', (d) => `translate(${x(d)},0)`)
		.append('line')
		.attr('stroke-opacity', 0.2)
		.attr('y2', -height)
		.attr('stroke', 'currentColor');

	xAxis
		.selectAll('g')
		.append('text')
		.attr('y', margin.bottom - 25)
		.attr('class', 'x-axis-label')
		.attr('text-anchor', 'middle')
		.each(function (d, i) {
			if (i === 0 || timeFormatHour(d) === '00:00') {
				d3.select(this).append('tspan').attr('x', 0).text(timeFormatHour(d));
				d3.select(this)
					.append('tspan')
					.attr('x', 0)
					.attr('dy', '1.2em') // Firefox fix (increased 1.2em)
					.text(timeFormatDate(d));
			} else {
				d3.select(this).text(timeFormatHour(d));
			}
		});

	g.append('g')
		.attr('transform', `translate(${margin.left}, 0)`)
		.attr('class', 'y-axis-label')
		.call(d3.axisLeft(y))
		// .call((g) => g.select(".domain").remove()) // This line removes the y-axis line
		.call((g) => g.selectAll('.tick line').clone().attr('stroke-opacity', 0.2).attr('x2', width));

	// Add axis labels
	// Add X Axis legend
	chart
		.append('text')
		.attr('class', 'chart-legend')
		.attr('text-anchor', 'end')
		.attr('x', (width + margin.left + margin.right) / 2)
		.attr('y', height + margin.bottom - 30)
		.text('Time (UTC)');

	// Add Y Axis legend
	chart
		.append('text')
		.attr('class', 'chart-legend')
		.attr('text-anchor', 'middle')
		.attr('transform', 'rotate(-90)')
		.attr('y', margin.left - 40)
		.attr('x', -height / 2)
		.text('Duration');

	return colorMap;
};
