const K = Math.PI/180;
const vx1 = -20;
const vy1 = -20;
const vx2 = 1000;
const vy2 = 500;
//::SvgGroup->SvgGroup
const star = (g)=>{
    let starPath = gen_z_path(gen_star_points(50, 9, 5))
    return g.append('path')
        .attr('d', starPath)
        .attr('transform', 'rotate(-90)')
}
const circle = (g)=>{
    return g.append('circle')
        .attr('cx', 0)
        .attr('yx', 0)
        .attr('r', 50)
}
const rect = (g)=>{
    return g.append('rect')
        .attr('x', -50)
        .attr('y', -50)
        .attr('width', 100)
        .attr('height', 100)
}
const triangle_norm = ()=>console.log('triangle norm')
const triangle_small = ()=>console.log('triangle small')
const triangle_big = ()=>console.log('triangle big')
let content = [
    [star, circle, rect],
    [star, star, star],
    [star, circle, rect],
]
/*let content = [
    [star, circle, rect],
    [triangle_norm, triangle_small, triangle_big],
    [star, circle,rect],
]
*/
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
        let fn = content[i][j]
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
        let gx = fn(frames)
        let trs = gx.attr('transform');
        if (trs) {
            gx.attr('transform', ' translate(' +[x+R, y+R].join(',')  + ')' + trs)
        } else {
            gx.attr('transform', ' translate(' +[x+R, y+R].join(',')  + ')')
        }
    })
})

