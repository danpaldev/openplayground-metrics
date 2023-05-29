<script lang="ts">
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	let mySvg: HTMLElement;

	// Sample data
	onMount(() => {
		const numIntervals = 72;
		const intervalMinutes = 10;
		const startDate = new Date(2021, 0, 1);
		const dates = Array.from(
			{ length: numIntervals },
			(_, i) => new Date(startDate.getTime() + i * intervalMinutes * 60000)
		);
		const mean = d3.range(10, 28, (28 - 10) / numIntervals);
		const stdDev = d3.range(2, 4, (4 - 2) / numIntervals);

		// Example determined values
		const detValues = Array.from({ length: numIntervals }, () => Math.random() * (32 - 8) + 8);
		const detDates = dates;

		// Chart dimensions
		const margin = { top: 20, right: 20, bottom: 30, left: 50 };
		const width = 960 - margin.left - margin.right;
		const height = 500 - margin.top - margin.bottom;

		// Define scales
		const x = d3.scaleUtc().domain(d3.extent(dates)).range([0, width]);
		const y = d3
			.scaleLinear()
			.domain([0, d3.max(detValues)])
			.nice()
			.range([height, 0]);

		// Create SVG for the chart
		const svg = d3
			.select(mySvg)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Create axes
		const xAxis = (g) =>
			g
				.attr('transform', `translate(0,${height})`)
				.call(
					d3
						.axisBottom(x)
						.ticks(width / 80)
						.tickSizeOuter(0)
				)
				.call((g) => g.selectAll('.tick text').attr('transform', 'rotate(-45) translate(-10,0)'));

		const yAxis = (g) => g.call(d3.axisLeft(y)).call((g) => g.select('.domain').remove());

		// Add axes to SVG
		svg.append('g').call(xAxis);
		svg.append('g').call(yAxis);

		// Create the line function
		const line = d3
			.line()
			.x((_, i) => x(dates[i]))
			.y((d) => y(d));

		// Draw mean and standard deviation lines
		svg
			.append('path')
			.attr('d', line(mean))
			.attr('stroke', 'blue')
			.attr('stroke-width', 1.5)
			.attr('fill', 'none');
		svg
			.append('path')
			.attr('d', line(mean.map((m, i) => m + stdDev[i])))
			.attr('stroke', 'green')
			.attr('stroke-width', 1.5)
			.attr('fill', 'none')
			.attr('stroke-dasharray', '3,3');
		svg
			.append('path')
			.attr('d', line(mean.map((m, i) => m - stdDev[i])))
			.attr('stroke', 'green')
			.attr('stroke-width', 1.5)
			.attr('fill', 'none')
			.attr('stroke-dasharray', '3,3');

		// Draw determined values as scatter plot
		const dots = svg
			.selectAll('.dot')
			.data(detValues)
			.join('circle')
			.attr('class', 'dot')
			.attr('cx', (_, i) => x(detDates[i]))
			.attr('cy', (d) => y(d))
			.attr('r', 3)
			.attr('fill', 'red');

		// Create a separate SVG for the legends
		const legendSvg = d3
			.select('#legend')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', 100);

		// Add legends
		const legendData = [
			{ label: 'Mean', color: 'blue' },
			{ label: '+1 std dev', color: 'green', dash: '3,3' },
			{ label: '-1 std dev', color: 'green', dash: '3,3' },
			{ label: 'Determined values', color: 'red', type: 'circle' }
		];

		const legend = legendSvg
			.selectAll('.legend')
			.data(legendData)
			.join('g')
			.attr('class', 'legend')
			.attr('transform', (_, i) => `translate(0,${i * 20})`);

		legend
			.append('rect')
			.attr('x', width / 2 - 50)
			.attr('width', 18)
			.attr('height', 18)
			.style('fill', (d) => d.color)
			.style('stroke-dasharray', (d) => d.dash || '');

		legend
			.append('circle')
			.attr('class', 'circle-legend')
			.attr('cx', width / 2 - 50 + 9)
			.attr('cy', 9)
			.attr('r', 3)
			.style('fill', (d) => (d.type === 'circle' ? d.color : 'none'));

		legend
			.append('text')
			.attr('x', width / 2 - 50 + 24)
			.attr('y', 9)
			.attr('dy', '.35em')
			.style('text-anchor', 'start')
			.text((d) => d.label);
	});
</script>

<div bind:this={mySvg} id="chart" />
<div id="legend" />

<style>
	.axis path,
	.axis line {
		fill: none;
		stroke: black;
		shape-rendering: crispEdges;
	}

	.axis text {
		font-family: sans-serif;
		font-size: 3rem;
	}

	.legend {
		font-family: sans-serif;
		font-size: 4rem;
	}
</style>
