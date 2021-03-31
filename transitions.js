let content = [
    [star, circle, rect],
    [triangle_norm, rect, triangle_big],
    [star, triangle_small, circle],
]

var svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 600)
    .attr("viewBox", [vx1, vy1, vx2, vy2].join(' '))

var main_g = svg.append('g')
    .attr('class', 'main')
    .attr("stroke", "green")
    .attr('fill', 'yellow')

main_g.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 50)

d3.selectAll('.main')
     .transition()
    .duration(2000)
    .attr("transform", "translate(320, 0)")
     //.easeElasticInOut(2000)
     .ease(d3.easeLinear)