// const body = document.getElementsByName('body');

let mX = 0;
let mY = 0;
let mode = 0;
explanations = [
    '(Modus 1) Die Breite und Höhe der viewBox ensprechen der Breite und Höhe der SVG. Diese hat die volle Seitenbreite und volle Seitenhöhe.',
    '(Modus 2) Die Breite und Höhe der viewBox ensprechen aktuellen Mausposition. Die Breite und Höhe der SVG entprechen dem verfügbaren Platz.',
    '(Modus 3) Die Breite und Höhe der viewBox entprechen dem verfügbaren Platz. Breite und Höhe der SVG ensprechen der aktuellen Mausposition.',
    '(Modus 4) Die Breite und Höhe der viewBox sowie die Breite und Höhe der SVG ensprechen der aktuellen Mausposition.',
];

const chartDiv = document.getElementById('chart');
const s = chartDiv.getBoundingClientRect();

d3.select('svg').remove();
const svg = d3.select(chartDiv).append('svg');
const dataRegion = svg.append('g')
    .attr('id', 'data');


let myColors = ["#670000", "#006700", "#000067"];
let colorScale = d3.scaleOrdinal()
    .domain([0, 2])
    .range(myColors);

for (let i = 0; i < 20; i++) {
    const x = Math.random() * chartDiv.clientWidth;
    const y = Math.random() * chartDiv.clientHeight;
    dataRegion.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', '50')
        .attr('height', '50')
        .attr('fill', colorScale(Math.floor(Math.random() * 3)));
    dataRegion.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('transform', 'translate(-30)')
        .text(`<${x.toFixed(0)},${y.toFixed(0)}>`);
}

redraw = () => {
    const vb = { vW: 100, vH: 100, w: 100, h: 100 };
    switch (mode) {
        case 1:
            vb.vW = mX;
            vb.vH = Math.max(0, mY - s.top);
            vb.w = chartDiv.clientWidth;
            vb.h = chartDiv.clientHeight;
            break;
        case 2:
            vb.vW = chartDiv.clientWidth;
            vb.vH = chartDiv.clientHeight;
            vb.w = mX;
            vb.h = Math.max(0, mY - s.top);
            break;
        case 3:
            vb.vW = mX;
            vb.vH = Math.max(0, mY - s.top);
            vb.w = mX;
            vb.h = Math.max(0, mY - s.top);
            break;
        default:
            vb.vW = chartDiv.clientWidth;
            vb.vH = chartDiv.clientHeight;
            vb.w = chartDiv.clientWidth;
            vb.h = chartDiv.clientHeight;
            break;
    }
    svg.attr('viewBox', [0, 0, vb.vW, vb.vH])
        .attr('width', vb.w)
        .attr('height', vb.h);

    document.getElementById('svg-shadow').innerText =
        `<svg viewBox="0,0,${vb.vW},${vb.vH}" width="${vb.w}" height="${vb.h}"> ... `;
}

refreshExplanation = () => {
    document.getElementById('explanation').innerText = explanations[mode];
};

redraw();
refreshExplanation();

window.addEventListener("resize", redraw);
document.addEventListener('mousemove', e => {
    mX = e.clientX;
    mY = e.clientY;
    redraw();
});

document.addEventListener("keydown", event => {
    if (event.keyCode >= 49 && event.keyCode <= 52) {
        mode = event.keyCode - 49;
        redraw();
        refreshExplanation();
    }
});
