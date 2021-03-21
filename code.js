
var lineGenerator = d3.line();

grad_to_point = (grad)=>{
    let k = Math.PI/180;
    let x = Math.cos(k * grad);
    let y = Math.sin(k * grad);
    return [x, y];
}


const tf2 = x=>x.toFixed(2)
const gen_path = (points=>{
    let ls = points.slice(1, points.length).map(p=>"L" + p.map(tf2).join(',')).join('')
    let ms  = "M" + points[0].map(tf2).join(',')
    return ms + ls
})

const gen_z_path = (points=>{
    let ls = points.slice(1, points.length).map(p=>"L" + p.map(tf2).join(',')).join('')
    let ms  = "M" + points[0].map(tf2).join(',')
    return ms + ls +  "Z"
})

const add_path = (main_g, p)=>{return main_g.append('g').append('path').attr('d', p)}


const gen_star_points = function(r1, r2, n) {
    let dG = 360/n;
    let dr = dG/2;
    let grads = _.range(0, n).map(i=> { return i*dG; })
    let grads2 = grads.map(grad=>grad + dr)
    let points = grads.map(grad_to_point).map(p=>p.map(x=>x*r1))
    let points2 = grads2.map(grad_to_point).map(p=>p.map(x=>x*r2))
    return _.zip(points, points2).reduce((a, b)=>a.concat(b))
}


var svg = d3.select("#svgcontainer")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 600)

var main_g = svg.append('g')
    .attr('fill', 'red')
    .attr('stroke', 'none')
    .attr("stroke-width", 1)

let points, p;
let cross_height = 2000;
points = [[-1, 0], [1, 0]].map(p=>p.map(x=>x*cross_height))
let p1 = gen_path(points);
add_path(main_g, p).attr('fill', 'red').attr('stroke', 'black').attr("stroke-width", 1)

points = [[0, 1], [0, -1]].map(p=>p.map(x=>x*cross_height))
let p2 = gen_path(points);
let cross = p1 + p2
add_path(main_g, cross).attr('fill', 'red').attr('stroke', 'black').attr("stroke-width", 1)
let group1 = main_g.append('g')
group1.attr('transform', 'translate (100, 100)')

let group2 = main_g.append('g')
group2.attr('transform', 'translate (50, 200)')

const d_shift = 110;
let absolute_shift;
absolute_shift = 0;

//adding  Ж
points = gen_star_points(54, 22, 5)
p = gen_z_path(points)
let star_g = add_path(group1, p)
star_g .attr("transform", 'rotate(-90)')
absolute_shift++;

//adding О
let cp = [absolute_shift*d_shift, 0]
group1.append('circle').attr('cx', cp[0]).attr('cy', cp[1]).attr('r', 50)
absolute_shift++;

//adding П
let L = 100
let rp = [-L/2 + absolute_shift*d_shift, -L/2]
group1.append('rect') .attr('x', rp[0]) .attr('y', rp[1]) .attr('width', L) .attr('height', L)
absolute_shift++;

//adding options
//optionGroup 1
points = [[L/2, 0], [L, L], [0, L]].map(p=>[p[0], p[1]])
p = gen_path(points)
let firstOption = add_path(group2, p)
//firstOption.attr('transform', 'translate (20, 0) scale(5, 0.5)')

//optionGroup 2
let secondOption = add_path(group2, p)
secondOption.attr('transform', 'translate (100, 0)')