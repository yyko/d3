const K = Math.PI/180;

var svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 600)

var main_g = svg.append('g')
    .attr('fill', 'red')
    .attr('stroke', 'none')
    .attr("stroke-width", 1)
//START cross creation
let points, p;
let cross_height = 2000;
points = [[-1, 0], [1, 0]].map(p=>p.map(x=>x*cross_height))
let p1 = gen_path(points);
add_path(main_g, p).attr('fill', 'red').attr('stroke', 'black').attr("stroke-width", 1)

points = [[0, 1], [0, -1]].map(p=>p.map(x=>x*cross_height))
let p2 = gen_path(points);
let cross = p1 + p2
add_path(main_g, cross).attr('fill', 'red').attr('stroke', 'black').attr("stroke-width", 1)
//END cross creation

//this could be generated based on data Data Driven Development
const rowHeight = 100;
const R = rowHeight/2
let rows = []
_.range(0, 3).forEach(i=>{
    let row = main_g.append('g')
    row.append('path').attr('d', "M0, " +  R + "L400, " + R).attr('stroke', 'green')
    rows[i] = row.attr('transform', 'translate (0, ' + (R +  i*rowHeight) +')')
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