import * as d3 from 'd3';
import { tooltipValueFormatter, getRoundedTimestamp, type Metric } from '$lib/utils.js';

interface DataPoint extends Metric {
	timestamp: Date;
	duration: number;
	error: boolean;
}

export const generateLinearChart = (
	targetElement: SVGSVGElement,
	dataOriginal: Metric[],
	legendTracker: Map<string, string>
) => {
	const chart = d3.select(targetElement);
	const margin = { top: 20, right: 30, bottom: 50, left: 70 };
	const width = +chart.attr('width') - margin.left - margin.right;
	const height = +chart.attr('height') - margin.top - margin.bottom;

	const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');

	const data = dataOriginal.map((d) => {
		const epochToIso = new Date(d.start_time * 1000).toISOString();
		return {
			...d,
			timestamp: parseTime(epochToIso)
		};
	});

	//The format we want for the Timestamps
	const timestampFormat = d3.timeFormat('%Y-%m-%dT%H:%M:%S.%LZ');

	/*
		A map that will group metrics by Timestamp.
		It's going to be useful for the Tooltip's content.
		
		The Tooltip shows a summary of the Completion Response Time (duration) of 
		every plotted model.
	*/
	const timestampToModelsData = new Map();

	data.forEach((d) => {
		if (d.timestamp) {
			const timestampStr = getRoundedTimestamp(timestampFormat(d.timestamp));

			if (!timestampToModelsData.has(timestampStr)) {
				timestampToModelsData.set(timestampStr, []);
			}
			timestampToModelsData.get(timestampStr).push(d);
		}
	});

	const now = new Date();
	const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

	const extent = d3.extent(data, (d) => d.timestamp);
	const defaultExtent = [twelveHoursAgo, now];
	const x = d3
		.scaleTime()
		.domain(extent[0] === undefined ? defaultExtent : extent)
		.range([margin.left, width - margin.right]);

	const maxCompletionResponseTime = d3.max(data, (d) => d.completion_response_time) || 150;

	const y = d3
		.scaleLinear()
		.domain([0, maxCompletionResponseTime * 1.1])
		.range([height - margin.bottom, margin.top]);

	/*
		As we created a "copy" of the Data Object, and added a few 
		extra properties (see const data = dataOriginal above L:22 ),
		we are dealing with a new type!
	*/
	const line = d3
		.line<DataPoint>()
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

	// Add the Y Axis
	const yAxisElement = yAxisGroup
		.selectAll<SVGGElement, undefined>('.y-axis-label')
		.data([null])
		.join('g')
		.attr('transform', `translate(${margin.left}, 0)`)
		.attr('class', 'y-axis-label')
		.call(d3.axisLeft(y));

	yAxisElement
		.selectAll('.tick line')
		.data(y.ticks())
		.join('line')
		.attr('stroke-opacity', 0.2)
		.attr('x2', width)
		.attr('stroke', 'currentColor');

	const verticalLine = plottedDataGroup
		.append('line')
		.attr('class', 'vertical-line')
		.attr('y1', margin.top)
		.attr('y2', height - margin.bottom)
		.style('stroke', '#ccc')
		.style('stroke-width', 1)
		.style('stroke-dasharray', '5, 5')
		.style('opacity', 0);

	const horizontalLine = plottedDataGroup
		.append('line')
		.attr('class', 'horizontal-line')
		.attr('x1', margin.left)
		.attr('x2', width - margin.right)
		.style('stroke', '#ccc')
		.style('stroke-width', 1)
		.style('stroke-dasharray', '5, 5')
		.style('opacity', 0);

	//An be an invisible rect that we're using for detecting whenever the cursor enters the grid
	const mouseArea = chart
		.append('rect')
		.attr('x', margin.left)
		.attr('y', margin.top)
		.attr('width', width - margin.left - margin.right)
		.attr('height', height - margin.top - margin.bottom)
		.style('opacity', 0);

	mouseArea.on('mouseover', () => {
		d3.select('#tooltip').style('visibility', 'visible');
		verticalLine.style('opacity', 1);
		horizontalLine.style('opacity', 1);
		mouseArea.style('cursor', 'crosshair');
	});

	mouseArea.on('mouseout', () => {
		d3.select('#tooltip').style('visibility', 'hidden');
		verticalLine.style('opacity', 0);
		horizontalLine.style('opacity', 0);
		mouseArea.style('cursor', 'default'); // Change cursor back to default when leaving grid
	});

	mouseArea.on('mousemove', (event) => {
		const [xPos, yPos] = d3.pointer(event);
		const xValue = x.invert(xPos);
		const timestampStr = timestampFormat(xValue);

		// console.log(timestampStr);

		let tooltipContent = `<span>${tooltipValueFormatter(
			getRoundedTimestamp(timestampStr)
		)} (UTC)</span><br><br>`;

		const modelDataAtTimestamp = timestampToModelsData.get(getRoundedTimestamp(timestampStr));

		//Used to prevent duplicated labels glitch
		const uniqueModelDataAtTimestamp = [
			...new Set(modelDataAtTimestamp.map((data: DataPoint) => JSON.stringify(data)))
		].map((data: unknown) => JSON.parse(data as string));

		if (uniqueModelDataAtTimestamp) {
			// if (modelDataAtTimestamp) {
			// modelDataAtTimestamp.forEach((modelData: DataPoint) => {
			uniqueModelDataAtTimestamp.forEach((modelData: DataPoint) => {
				const colorSquare = `<div style="display: inline-block; width: 12px; height: 12px; background-color: ${legendTracker.get(
					modelData.model
				)};"></div>`;
				const modelName = `<div>${colorSquare} ${modelData.model}</div>`;
				const responseData = modelData.error
					? '<p>Request Error</p><br>'
					: `<p>${modelData.completion_response_time.toFixed(2)} s</p><br>`;

				tooltipContent += modelName + responseData;
			});
		} else {
			tooltipContent += '<p>No data for this timestamp</p>';
		}

		// Update the tooltip HTML
		d3.select('#tooltip').html(tooltipContent);

		// Determine the position of the tooltip based on the xPos value
		const tooltipXAxis = xPos > width - 200 ? event.clientX - 220 : event.clientX + 60;
		const tooltipYAxis = event.clientY + 20;

		// Update the tooltip position to follow the cursor
		d3.select('#tooltip')
			.style('left', tooltipXAxis + 'px')
			.style('top', tooltipYAxis + 'px');

		// Update the vertical line's X position
		verticalLine.attr('x1', xPos).attr('x2', xPos);
		horizontalLine.attr('y1', yPos).attr('y2', yPos);
	});

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

	/*
		This is d3.js way for getting nice colors for your lines, 
		but as you can see on the .forEach below ("modelColor"),
		we get the color from an already defined map, so we just use 
		this as a fallback that makes Typescript happy
	*/
	const color = d3
		.scaleOrdinal()
		.range([...d3.schemeTableau10, ...d3.schemeSet3, ...d3.schemePastel1]);

	plottedDataGroup.selectAll('path').remove();
	plottedDataGroup.selectAll('circle').remove();

	models.forEach((values, modelName) => {
		const modelColor: string =
			legendTracker.get(modelName) || (color(`${modelName}${Math.random()}`) as string);

		/*
			This is intended to handle the "failed metrics" in our dataset.
			A failed metric will have a "duration" (completion response time) of 0.
			Originally this was handled at the beginning of the file, but there was 
			a bug where lines were "polluting" other models' lines.

			As a plus, it makes Typescript happy because we are safely handling every value
		*/
		const validValues = values.map((d, i, arr) => {
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
				duration: duration,
				error: error
			};
		}) as DataPoint[];

		const path = plottedDataGroup
			.append('path')
			.datum(validValues)
			.attr('fill', 'none')
			.attr('stroke', modelColor)
			.attr('stroke-width', 3.5)
			.attr('d', (d) => line(d));

		validValues.forEach((d) => {
			plottedDataGroup
				.append('circle')
				.attr('cx', x(d.timestamp))
				.attr('cy', y(d.duration))
				.attr('r', 4)
				.attr('fill', d.error ? 'red' : modelColor)
				.style('opacity', d.error ? 1 : 0)
				.attr('data-model', d.model)
				.on('mouseover', function (event) {
					const [,] = d3.pointer(event);

					let tooltipContent = `<span>${tooltipValueFormatter(
						d.timestamp.toString()
					)} (UTC)</span><br><br>`;

					const timestampStr = timestampFormat(d.timestamp);
					const modelDataAtTimestamp = timestampToModelsData.get(timestampStr);

					/*
						The following three statements are for moving the hovered model
						to the first position in the Tooltip’s data.
					*/
					const hoveredModelName = d3.select(this).attr('data-model');

					const index = modelDataAtTimestamp.findIndex(
						(modelData: DataPoint) => modelData.model === hoveredModelName
					);

					if (index > -1) {
						const [modelData] = modelDataAtTimestamp.splice(index, 1);
						modelDataAtTimestamp.unshift(modelData);
					}

					/*
						Once our hovered model is first, we generate the Tooltip text with the Data
						of all the plotted models
					*/
					const uniqueModelDataAtTimestamp = [
						...new Set(modelDataAtTimestamp.map((data: DataPoint) => JSON.stringify(data)))
					].map((data: unknown) => JSON.parse(data as string));

					uniqueModelDataAtTimestamp.forEach((modelData: DataPoint) => {
						const colorSquare = `<div style="display: inline-block; width: 12px; height: 12px; background-color: ${legendTracker.get(
							modelData.model
						)};"></div>`;
						const modelName = `<div>${colorSquare} ${modelData.model}</div>`;
						const responseData = modelData.error
							? '<p>Request Error</p><br>'
							: `<p>${modelData.completion_response_time.toFixed(2)} (s)</p><br>`;
						tooltipContent += `${modelName}${responseData}`;
					});

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
				d3.select(this).transition().duration(200).attr('stroke-width', 5);
			})
			.on('mouseout', function () {
				d3.select(this).transition().duration(200).attr('stroke-width', 3.5);
			});
	});
};
