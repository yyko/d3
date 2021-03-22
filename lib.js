
const tr = (p)=>'translate(' + p.join(', ') + ')'
//::SvgGroup->SvgGroup
const star = (g)=>{
    let starPath = gen_z_path(gen_star_points(50, 25, 5))
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
const triangle_norm = (g)=>{
    let points;
    let L = 50
    let hL = L/2
    points = [[hL, 0], [L, L], [0, L]].map(p=>[p[0], p[1]])//triagnl
    let trianglePath = gen_z_path(points)
    return g.append('path')
        .attr('d', trianglePath)
        .attr('transform', tr([-hL, -hL]))
}

const triangle_small = (g)=>{
    let points;
    let L = 50
    let hL = L/2
    points = [[hL, 0], [L, L], [0, L]].map(p=>[p[0], p[1]])//triagnl
    let trianglePath = gen_z_path(points)
    let transformations
    transformations = 'scale(0.5, 0.5)'
    transformations += tr([-hL, -hL])
    return g.append('path')
        .attr('d', trianglePath)
        .attr('transform', transformations)
}

const triangle_big = (g)=>{
    let points;
    let L = 50
    let hL = L/2
    points = [[hL, 0], [L, L], [0, L]].map(p=>[p[0], p[1]])//triagnl
    let trianglePath = gen_z_path(points)
    let transformations
    transformations = 'scale(1.5, 1.5)'
    transformations += tr([-hL, -hL])
    return g.append('path')
        .attr('d', trianglePath)
        .attr('transform', transformations)
}

var lineGenerator = d3.line();

const grad_to_point = (grad)=>{
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
