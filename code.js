const vx1 = -100;
const vy1 = -150;
const vx2 = 800;
const vy2 = 500;

var lineGenerator = d3.line();

grad_to_point = (grad)=>{
    let k = Math.PI/180;
    let x = Math.cos(k * grad);
    let y = Math.sin(k * grad);
    return [x, y];
}

const N = 5;
const dG = 360/N;
const R1 = 50;
const R2 = 20;


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

const add_path = (main_g, p)=>{
    console.log(main_g)
    return main_g.append('g').append('path').attr('d', p)}


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
    .attr("viewBox", [vx1, vy1, vx2, vy2].join(' '));

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
let subcanvas = main_g.append('g')
subcanvas.attr('transform', 'translate (100, 100)')

const d_shift = 110;
let absolute_shift;
absolute_shift = 0;

points = gen_star_points(54, 22, 5)
p = gen_z_path(points)
let star_g = add_path(subcanvas, p)
star_g
.attr("transform", 'rotate(-90)')
absolute_shift++;

let cp = [absolute_shift*d_shift, 0]
subcanvas.append('circle').attr('cx', cp[0]).attr('cy', cp[1]).attr('r', 50)
absolute_shift++;

let L = 100
let rp = [-L/2 + absolute_shift*d_shift, -L/2]
subcanvas.append('rect') .attr('x', rp[0]) .attr('y', rp[1]) .attr('width', L) .attr('height', L)
absolute_shift++;

/*
let x_shift = 0;
points = [[L/2, 0], [L, L], [0, L]].map(p=>[p[0] + x_shift, p[1]])
p = gen_path(points)
let ga = add_path(main_g, p)
*/