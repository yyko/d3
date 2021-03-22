const rect1 = (i) => (g) => {

}
const step = (xs, i) => (g) =>{
    let points;
    let h = 50
    let d = h/5
    g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', h)
        .attr('height', h)
        .attr('fill', 'none')
        .attr('stroke', 'black')

    rct(h-d, 0, d, d)(g)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    rct(0, h-d, d, d)(g)
    g.attr('transform', 'rotate(' + i*90 + ', ' + h/2 + ', ' + h/2 + ')')
    return g;

}
let content = [
    [step(['rect1'],0), step(['rect1'],1), step(['rect1'],2)],
    [step(['rect1'],3), encripted(8), encripted(6)],
    [encripted(7), encripted(4), encripted(9)],
]

var svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 600)
    .attr("viewBox", [vx1, vy1, vx2, vy2].join(' '))

var main_g = svg.append('g')
const H = 80
const R = H/2
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
        let frames = cell_g.append('g')
        let gx = fn(frames)
        let trs = gx.attr('transform');
        if (trs) {
            gx.attr('transform', ' translate(' +[x, y].join(',')  + ')' + trs)
        } else {
            gx.attr('transform', ' translate(' +[x, y].join(',')  + ')')
        }
    })
})

