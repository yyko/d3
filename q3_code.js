const doubleArc = arcFactory("black", null, 'green', null);
const fire = (...agrs) => (g) => {
    agrs.forEach(arg=>{
      arg(g);
    })
}
let content = [
    [arc(1)(1), rect1(-1)(0), rect1(1)(1)],
    [step([rect1], 3), step([arc2],0), step([arc(1)], 0)],
    [step([circle1, arc(-1)], 0), step([arc(1)], 0), step([arc3, rect1], 1)],
]

var svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 600)
    .attr("viewBox", [vx1, vy1, vx2, vy2].join(' '))

var main_g = svg.append('g')
_.range(0, 3).forEach(i=>{
    let row = main_g.append('g')
    .attr('class', 'row')
    _.range(0, 3).forEach(j=>{
        let pathX, pathY, x, y;
        x = j*H;y=i*H;
        pathX = "M" + [x, y].join(',') + "L" +  [x, y + H].join(',')
        pathY = "M" + [x, y].join(',') + "L" +  [x + H, y].join(',')
        let fn = content[i][j];//getting function that produced final svg group
        let cell_g = row.append('g').attr('class', 'cell')
        let cell = cell_g.append('g')
        let gx = fn(cell)
        let trs = gx.attr('transform');//lifting transforms of returned group
        //let trs_args = tr([x + R/2,  y + R/2]);//this row for centering
        let trs_args = tr([x,  y])
        if (trs){ trs_args+= trs} //adding lifted transformations
        gx.attr('transform', trs_args)
    })
})

