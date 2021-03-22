const H = 80
const R = H/2
const CR = R/2

const arc = (i) => (g) => {
    let alfa = 10;
    let r = CR
    let dy = r * Math.cos(alfa*K)
    let dx = r * Math.sin(alfa*K)
    let trs_args = tr([r - dx,  r - dy])
    let path = "M 0 0 A " + r + " " + r + ", 0, 0, 1, " + 2*dx + " 0"
    path+= ["L", dx, dy/2].join(' ')
    path+="Z"
    g.append('path') .attr('d', path) .attr('transform', trs_args + 'rotate(0 ' + dx + ' ' + dy + ')')
    g.append('path') .attr('d', path) .attr('transform', trs_args + 'rotate(90 ' + dx + ' ' + dy + ')')
    g.append('path') .attr('d', path) .attr('transform', trs_args + 'rotate(-90 ' + dx + ' ' + dy + ')')
    g.append('path') .attr('d', path) .attr('transform', trs_args + 'rotate(180 ' + dx + ' ' + dy + ')')
    return g
}
const circle1 = (i) => (g) => {
    let trs_args = tr([R/2,  R/2])
    g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', CR)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('transform', trs_args)
}
const rect1 = (i) => (g) => {
    let h = R
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
const step = (xs, i) => (g) =>{
    xs.forEach(fn=>{
    fn(i)(g)
    })
    return g;
}
let content = [
    [step([circle1, arc], 0), step([rect1], 1), step([rect1], 2)],
    [step([rect1], 3), arc(8), encripted(6)],
    [encripted(7), encripted(4), encripted(9)],
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
        //let trs_args = tr([x + R/2,  y + R/2])
        let trs_args = tr([x,  y])
        if (trs){ trs_args+= trs}
        gx.attr('transform', trs_args)
    })
})

