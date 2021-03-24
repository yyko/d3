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
const rowHeight = 100;
const H = 110
const R = H/2
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
        let gx = fn(frames)
        let trs = gx.attr('transform');
        if (trs) {
            gx.attr('transform', ' translate(' +[x+R, y+R].join(',')  + ')' + trs)
        } else {
            gx.attr('transform', ' translate(' +[x+R, y+R].join(',')  + ')')
        }
    })
})

//START adding letters
//adding  Ж
const R2 = R/2.5
const N = 5

p = gen_z_path(gen_star_points(R, R2, N))
let colWidth = rowHeight*1.2

let star1 =  add_path(rows[0], p)
    //best transformation to move topleft coner as ancor point of the star
    .attr('transform', 'translate(' + (R + 5) + ',5) rotate(270) scale(1.1, 1.1)')

//adding О
rows[0].append('circle').attr('cx', 0).attr('cy', 0).attr('r', R)
.attr('transform', 'translate(' + (colWidth + R) + ', 0)')

//adding П
L = rowHeight
rows[0].append('rect') .attr('x', 0) .attr('y', 0) .attr('width', L) .attr('height', L)
.attr('transform', 'translate(' + 2*colWidth + ', ' + -R + ')')
//END adding letters

//adding options - two rows for now
//optionGroup 1
L = rowHeight/2
points = [[L/2, 0], [L, L], [0, L]].map(p=>[p[0], p[1]])//triagnle
p = gen_path(points)
//add_path(row2, p) .attr('transform', 'translate (0, 0) scale(0.5, 0.5)')

//optionGroup 2
//let secondOption = add_path(row2, p)
//secondOption.attr('transform', 'translate (100, 0)')

//optionGroup 3
let thirdOption = add_path(rows[1], p)
//secondOption.attr('transform', ' translate (50, 0)')

let secondOptionRow = add_path(rows[2], p)
