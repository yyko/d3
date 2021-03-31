const L = 200;
const overlap = R*(1 - 0.2);
var svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 600)
    .attr("viewBox", [vx1, vy1, vx2, vy2].join(' '))

var left_g = svg.append('g')
    .attr('class', 'left_group')
    .attr("stroke", "black")
    .attr('fill', 'none')

var right_g = svg.append('g')
    .attr('class', 'right_group')
    .attr("stroke", "black")
    .attr('fill', 'none')

left_g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', R)
right_g.append('circle').attr('cx', 2*L).attr('cy', 0).attr('r', R)

d3.selectAll('.left_group')
     .transition()
    .duration(2000)
    .attr("transform", tr([L - overlap, 0]))
//     .ease(d3.easeLinear)

d3.selectAll('.right_group')
     .transition()
    .duration(2000)
    .attr("transform", tr([-(L - overlap), 0]))
//     .ease(d3.easeLinear)