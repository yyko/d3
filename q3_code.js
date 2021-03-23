const doubleArc = arcFactory("black", null, 'green', null);
const comb = (...args) => (g) => {
    args.forEach(arg=>{
      arg(g);
    })
    return g
}
let a1 = comb(arc(1)(0), rect1(1)(0))
let a2 = comb(arc(1)(1), rect1(1)(1))
let a3 = comb(arc(1)(2), rect1(1)(2))
let b1 = comb(arc(1)(0))
let b2 = comb(arc(1)(4), rect1(1)(4))
let b3 = comb(arc(-1)(0), rect1(1)(5))
let c1 = comb(arc(1)(3), rect1(1)(3))//right answer
let c2 = comb(rect1(1)(0), rect1(1)(1))
let c3 = comb(arc(1)(1))

let content = [
    [a1, a2, a3],
    [b1, b2, b3],
    [c1, c2, c3],
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
        let pathX, pathY, x, y;
        x = j*H;y=i*H;
        pathX = "M" + [x, y].join(',') + "L" +  [x, y + H].join(',')
        pathY = "M" + [x, y].join(',') + "L" +  [x + H, y].join(',')
        let fn = content[i][j];//getting function that produced final svg group
        let cell_g = row.append('g').attr('class', 'cell')
        //cell_g.append('path').attr('d', pathX).attr('stroke', 'red')
        //cell_g.append('path').attr('d', pathY).attr('stroke', 'red')
        let cell = cell_g.append('g')
        let gx = fn(cell)
        if (gx) {
        let trs = gx.attr('transform');//lifting transforms of returned group
        //let trs_args = tr([x + R/2,  y + R/2]);//this row for centering
        let trs_args = tr([x,  y])
        if (trs){ trs_args+= trs} //adding lifted transformations
        gx.attr('transform', trs_args)
        } else {
            console.log(gx)
            console.log(fn)
        }
        //sometimes become undefined
    })
})

