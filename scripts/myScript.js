
const margin = {top: 400, right: 0, bottom: 0, left: 0};
const chartDiv = document.getElementById('chart');

chartData = data.filter(d => ['DEU', 'FRA', 'ITA', 'ESP'].includes(d['countryCode']));

d3.select('svg').remove();
const svg = d3.select(chartDiv).append('svg')
const xAxis = svg.append('g')
    .attr('id', 'x-axis');
const yAxis = svg.append('g')
    .attr('id', 'y-axis');
const grid = svg.append('g')
    .attr('id', 'grid');
const dataRegion = svg.append('g')
    .attr('id', 'data');
let legend = svg.append('g')
    .attr('id', 'legend');
let tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip');
let myColors = ["#0055A4", "#000000", "#008C45", "#DA0914"];

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
        .range([50, chartDiv.clientWidth - 200]);
    let y = d3.scaleLog()
        .domain(minMaxValue)
        .range([chartDiv.clientHeight - 50, 50]);
    let gg = g => g
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.15)
        .call(g => g.append("g")
            .selectAll("line")
            .data(x.ticks())
            .join("line")
            .attr("x1", d => 0.5 + x(d))
            .attr("x2", d => 0.5 + x(d))
            .attr("y1", 50)
            .attr("y2", chartDiv.clientHeight - 50))
        .call(g => g.append("g")
            .selectAll("line")
            .data(y.ticks())
            .join("line")
            .attr("y1", d => 0.5 + y(d))
            .attr("y2", d => 0.5 + y(d))
            .attr("x1", 50)
            .attr("x2", chartDiv.clientWidth - 200));

    xAxis.call(g => g
        .attr('transform', `translate(0,${chartDiv.clientHeight - 50})`)
        .call(d3.axisBottom(x)));
    yAxis.call(g => g
        .attr('transform', `translate(50,0)`)
        .call(d3.axisLeft(y)
            .tickFormat((d) => d / 1000000 + 'M')));
    grid.call(gg);

    let c = d3.scaleOrdinal()
        .domain(chartData.map(d => d.countryCode))
        .range(myColors);

    dataRegion.selectAll('rect')
        .data(chartData)
        .join('rect')
        .attr('x', d => x(+d.year))
        .attr('y', d => y(+d.value))
        .attr('width', '0')
        .attr('height', '0')
        .attr('transform', `translate(0,0)`)
        .attr('fill', d => c(d.countryCode));
    dataRegion.selectAll('rect')
        .transition()
        .delay(function (_, i) {return 5 * i;})
        .duration(270)
        .ease(d3.easeExp)
        .attr('width', '10')
        .attr('height', '10')
        .attr('transform', `translate(-5,-5)`);

    // Update Legend
    let legend = svg.selectAll('.legend')
        .data([...new Set(chartData.map(item => item.countryName))])
        .enter()
        .append('g')
        .attr('class', d => `legend`)
        .attr('transform', (d, i) => `translate(${chartDiv.clientWidth - 125},${i * 20 + 9 + 250})`)
        .on('mouseover', function (d) {
            dataRegion.selectAll('rect')
                .data(chartData)
                .filter(v => v.countryName === d)
                .attr('fill', d => c(d.countryCode));
            dataRegion.selectAll('rect')
                .data(chartData)
                .filter(v => v.countryName !== d)
                .attr('fill', d => '#ddd');
        })
        .on('mouseout', function () {
            dataRegion.selectAll('rect')
                .data(chartData)
                .attr('fill', d => c(d.countryCode));
        });

    legend.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', d => c(d));
    legend.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .text(d => d);

    // Update Tooltip
    svg.selectAll('rect')
        .on('mouseover', function (d) {
            if (!d.value) return null;
            tooltip.html('<b>' + d.countryName + '</b><br/>' + d.year + '<br/><small>' + ((d.value / 1000000).toFixed(2) + ' M') + '</small>');
            tooltip.style('display', 'block');
            tooltip.style('opacity', 1);
        })
        .on('mousemove', function (d) {
            if (!d.value) return null;
            tooltip.style('top', (d3.event.y + 10) + 'px')
                .style('left', (d3.event.x - 25) + 'px');
        })
        .on('mouseout', function () {
            tooltip.style('display', 'none');
            tooltip.style('opacity', 0);
        });
}

redraw()

window.addEventListener("resize", redraw);
