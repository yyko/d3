const K = Math.PI/180;
const vx1 = -20;
const vy1 = -20;
const vx2 = 1000;
const vy2 = 500;

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
const rowHeight = 100;
const H = rowHeight
const R = rowHeight/2
let rows = []
_.range(0, 3).forEach(i=>{
    let row = main_g.append('g')
    .attr('class', 'row')
    _.range(0, 3).forEach(j=>{
        let pathX, pathY, x, y;
        x = j*H;y=i*H;
        pathX = "M" + [x, y].join(',') + "L" +  [x, y + H].join(',')
        pathY = "M" + [x, y].join(',') + "L" +  [x + H, y].join(',')
        let cell_g = row.append('g')
            .attr('class', 'cell')
        let frames;
        frames = cell_g.append('g')
        frames.append('path').attr('d', pathX).attr('stroke', 'green')
        frames = cell_g.append('g')
        frames.append('path').attr('d', pathY).attr('stroke', 'green')
        frames = cell_g.append('g')
        let startPath = gen_z_path(gen_star_points(20, 9, 5))
        let trianlgePath
        frames.append('path').attr('d', startPath)
        .attr('transform', 'translate(' + (x + R) + ', ' + (y + R) + ') rotate(-90)')
    })
})

