const d_shift = 210;

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
let row1 = main_g.append('g')
let row2 = main_g.append('g')
let row3 = main_g.append('g')

row1.attr('transform', 'translate (0, 100)')
row2.attr('transform', 'translate (0, 200)')
row3.attr('transform', 'translate (0, 300)')

//START adding letters
let absolute_shift;
absolute_shift = 0;

//adding  Ж
const R1 = 54
const R2 = 22
const N = 5

points = gen_star_points(R1, R2, N)
p = gen_z_path(points)
let star_g = add_path(row1, p)
let tr = 200;
star_g .attr("transform", ' translate(100, 0)')
absolute_shift++;

//adding О
let cp = [absolute_shift*d_shift, 0]
row1.append('circle').attr('cx', cp[0]).attr('cy', cp[1]).attr('r', 50)
absolute_shift++;

//adding П
let L = 100
let rp = [-L/2 + absolute_shift*d_shift, -L/2]
row1.append('rect') .attr('x', rp[0]) .attr('y', rp[1]) .attr('width', L) .attr('height', L)
absolute_shift++;
//END adding letters

//adding options - two rows for now
//optionGroup 1
points = [[L/2, 0], [L, L], [0, L]].map(p=>[p[0], p[1]])//triagnle
p = gen_path(points)
//add_path(row2, p) .attr('transform', 'translate (0, 0) scale(0.5, 0.5)')

//optionGroup 2
//let secondOption = add_path(row2, p)
//secondOption.attr('transform', 'translate (100, 0)')

//optionGroup 3
let thirdOption = add_path(row2, p)
//secondOption.attr('transform', ' translate (50, 0)')

//let secondOptionRow = add_path(row3, p)