let content = [
    [step([circle1], 0), step([rect1], 1), step([rect1], 2)],
    [step([rect1], 3), step([arc2],0), step([arc], 0)],
    [step([circle1, arc], 0), step([arc], 0), step([arc3, rect1], 1)],
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
        let fn = content[i][j]
        let pathX, pathY, x, y;
        x = j*H;y=i*H;
        pathX = "M" + [x, y].join(',') + "L" +  [x, y + H].join(',')
        pathY = "M" + [x, y].join(',') + "L" +  [x + H, y].join(',')
        let cell_g = row.append('g').attr('class', 'cell')
        cell_g.append('path').attr('d', pathX).attr('stroke', 'red')
        cell_g.append('path').attr('d', pathY).attr('stroke', 'red')
        let frames = cell_g.append('g')
        let gx = fn(frames)
        let trs = gx.attr('transform');
        let trs_args = tr([x + R/2,  y + R/2])
        //let trs_args = tr([x,  y])
        if (trs){ trs_args+= trs}
        gx.attr('transform', trs_args)
    })
})

