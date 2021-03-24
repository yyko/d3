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
    .attr('fill', 'red')
    .attr('stroke', 'none')
    .attr("stroke-width", 1)
//this could be generated based on data Data Driven Development
const cellSide = 20;
let rows = []
_.range(0, 12).forEach(i=>{
    let row = main_g.append('g')
    .attr('class', 'row')
    _.range(0, 31).forEach(j=>{
        let pathX, pathY, x, y;
        x = j*cellSide;y=i*cellSide;
        pathX = "M" + [x, y].join(',') + "L" +  [x, y + cellSide].join(',')
        pathY = "M" + [x, y].join(',') + "L" +  [x + cellSide, y].join(',')
        pathX_ = "M" + [x, y + cellSide].join(',') + "L" +  [x + cellSide, y + cellSide].join(',')
        pathY_ = "M" + [x + cellSide, y].join(',') + "L" +  [x + cellSide, y + cellSide].join(',')
        let cell_g = row.append('g')
            .attr('class', 'cell')
        cell_g.append('path').attr('d', pathX).attr('stroke', 'red')
        cell_g.append('path').attr('d', pathY).attr('stroke', 'red');
        cell_g.append('path').attr('d', pathX_).attr('stroke', 'red');
        cell_g.append('path').attr('d', pathY_).attr('stroke', 'red');
    })
    //TODO add line to bottom
})

