
const margin = {top: 400, right: 0, bottom: 0, left: 0};
const chartDiv = document.getElementById('chart');

chartData = data.filter(d => ['DEU'].includes(d['countryCode']));

d3.select('svg').remove();
const svg = d3.select(chartDiv).append('svg')
const xAxis = svg.append('g')
    .attr('class', 'x axis');
const yAxis = svg.append('g')
    .attr('class', 'y axis');
const grid = svg.append('g')
    .attr('class', 'grid');
const dataRegion = svg.append('g')
    .attr('id', 'data');

function redraw () {
    svg.attr('viewBox', [0, 0, chartDiv.clientWidth, chartDiv.clientHeight]);

    // Create an array of minimum and maximum value for the 'year' property of the data
    // +- one year (ass padding) to use in the domain of x
    let minMaxYear = [
        d3.min(chartData.map(d => d.year)) - 1,
        d3.max(chartData.map(d => d.year)) + 1
    ];
    // Create an array of minimum and maximum value for the 'year' property of the data
    // scaled by 1% to use in the domain of y
    let minMaxValue = [
        d3.min(chartData.map(d => d.value)) * 0.99,
        d3.max(chartData.map(d => d.value)) * 1.01
    ];

    // Define axis x and y functions
    let x = d3.scaleLinear()
        .domain(minMaxYear)
        .range([50, chartDiv.clientWidth - 50]);
    let y = d3.scaleLog()
        .domain(minMaxValue)
        .range([chartDiv.clientHeight - 50, 50]);

    xAxis.call(g => g
        .attr('transform', `translate(0,${chartDiv.clientHeight - 50})`)
        .call(d3.axisBottom(x)));
    yAxis.call(g => g
        .attr('transform', `translate(50,0)`)
        .call(d3.axisLeft(y)
            .tickFormat((d) => d / 1000000 + 'M')));

    dataRegion.selectAll('rect')
        .data(chartData)
        .join('rect')
        .attr('x', d => x(+d.year))
        .attr('y', d => y(+d.value))
        .attr('width', '0')
        .attr('height', '0')
        .attr('transform', `translate(0,0)`);
    dataRegion.selectAll('rect')
        .transition()
        .delay(function (_, i) {return 5 * i;})
        .duration(270)
        .ease(d3.easeExp)
        .attr('width', '5')
        .attr('height', '5')
        .attr('transform', `translate(-2.5,-2.5)`);
}

redraw()

window.addEventListener("resize", redraw);
