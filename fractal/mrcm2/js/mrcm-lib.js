// All the following is screaming to be moved into 
// an class...


function generatePoints(m,p,count=numPoints,collectStats) {
    let rangeList = [],
        capture = false,
        cr = "",
        s = 3;

    if (collectStats) {
        capture=true;
        crObj = {}; // forces a global...(horrible design)
    }
    for (let i=0; i<m.length;i++) {
        rangeList[i] = m[i].pct;
    }
    let i = 0,
        r = getRangeIndex(rangeList),
        inv = m[r].invariant();

    if (capture) {
        cr += r;
    }

    if (inv.e) {
        inv.x = 0;
        inv.y = 0;
    }

    p[i] = {x:inv.x,y:inv.y,r:r,s:s}; //starting with invariant point of m[r]
    while (i<count) {
        r = getRangeIndex(rangeList);
        if (capture) {
            cr += r;
        }
        p[i+1] = {
            x:m[r].a * p[i].x + m[r].b * p[i].y + m[r].e,
            y:m[r].c * p[i].x + m[r].d * p[i].y + m[r].f,
            r:r,
        };
        i++;
    }

    if (capture) {
        crObj = {captureR:cr,inv:inv,rangeList:rangeList,p:p};
    }
}

function generatePoints2(m,p,count=numPoints) {
    var rangeList = [];
    for (var i = 0; i<m.length;i++) {
        rangeList[i] = m[i].pct;
    }
    var i = 0;
    var r = 0;
    p[i] = {x:m[0].e,y:0,r:0};
    while (i<count) {
        r = getRangeIndex(rangeList);
        p[i+1] = {
            x:m[r].ap * p[i].x + m[r].bp * p[i].y + m[r].e,
            y:m[r].cp * p[i].x + m[r].dp * p[i].y + m[r].f,
            r:r
        };
        i++;
    }
}

function generateImage(id,points) {
    var g = d3.select('#' + id);

    g.selectAll('circle')
     .data(points)
     .enter()
     .append('circle')
     .attr('r',2)
     .attr('cx', function(d,i) {return d.x})
     .attr('cy', function(d,i) {return d.y})
     .attr('fill', function(d,i) {
         return 'rgba(' + Math.abs((255-40*((d.r+1%3)))%255)
                 + ',' + Math.abs((255-40*(d.r%3))%255)
                 + ',' + Math.abs((255-40*((d.r+2)%3))%255)
                + ',1'
                + ')';
     })
}
function generateImage2(id,radius,points) {
    var g = d3.select('#' + id);
    g.html("");
    g.selectAll('circle')
     .data(points)
     .enter()
     .append('circle')
     .attr('r',radius)
     .attr('cx', function(d,i) {return d.x})
     .attr('cy', function(d,i) {return d.y})
     .attr('fill', function(d,i) {
         return 'rgba(' + Math.abs((255-40*((d.r+1%3)))%255)
                 + ',' + Math.abs((255-40*(d.r%3))%255)
                 + ',' + Math.abs((255-40*((d.r+2)%3))%255)
                + ',1'
                + ')';
     })
}

function generateImage3(id,radius,points) {
    let svg = d3.select('#' + id);
    svg.html("");
    let defs = svg.append("defs");

    defs.append("circle")
        .attr("r",radius)
        .attr("cx",0)
        .attr("cy",0)
        .attr("id","cir-1");
        //.attr("fill","hsl(180,0.85,0.5)")

    svg.selectAll('use')
     .data(points)
     .enter()
     .append('use')
     .attr("href","#cir-1")
     .attr("id",(d,i) => {return `c-${i}`})
     .attr('x', function(d,i) {return (d.x).toFixed(3)})
     .attr('y', function(d,i) {return (d.y).toFixed(3)})
     .attr('class', function(d,i) {
         return `fill-${d.r}`;
         //return `hsla(${(d.r*60)%360},0.85,0.5,1.0)`
     })
}
function generateImage4(id,radius,points) {
    let svg = d3.select('#' + id);
    svg.html("");

    svg.selectAll('circle')
     .data(points)
     .enter()
     .append('circle')
     .attr("id",(d,i) => {return `c-${i}`})
     .attr('class', (d,i) =>{return `fill-${d.r}`})
     .attr('cx', function(d,i) {return (d.x).toFixed(3)})
     .attr('cy', function(d,i) {return (d.y).toFixed(3)})
     .attr('r',radius)
}

function generateImage5(id,dims,points) {
    let svg = d3.select('#' + id);
    svg.html("");

    svg.selectAll('rect')
     .data(points)
     .enter()
     .append('rect')
     .attr("id",(d,i) => {return `r-${i}`})
     .attr('height',dims.h)
     .attr('width',dims.w)
     .attr('class', (d,i) =>{return `fill-${d.r}`})
     .attr('x', function(d,i) {return (d.x).toFixed(3)})
     .attr('y', function(d,i) {return (d.y).toFixed(3)})
     .attr('r',dims.r)
}
function changeImage(count=numPoints,hideTransforms=true,collectStats=true) {
    let id = parseInt($('#matrixId option:selected').val()),
        matrix = CM[id].M;
        slice = new Map();
    imageContractionEstimate(matrix);
    generatePoints(matrix,Points,count,collectStats);

    slice.set(0,0);
    slice.set(1,1);
    slice.set(2,2);
    slice.set(3,3);
    slice.set(w-2,4);
    slice.set(w-1,5);

    myImage = new fractalImage('myCanvas',w,h,Points,{slice:slice});
    myImage.drawImage();
    let matrixIndex = parseInt($('#matrixIndex option:selected').val());
    changeTransforms3(id,hideTransforms);
    return matrix[matrixIndex];
}

function changeTransforms3(id,hideTransforms=true) {

    let m = CM[parseInt(id)].M;

    for (let i = 0; i<6;i++) {
        d3.select('#box-' +i).style('display','none');
    }
    if (hideTransforms) { return }
    for (let i = 0;i<m.length;i++) {
        d3.select('#box-' + i)
            .attr('points',m[i].toPolygonPoints())
            .style('display','block');
    }
}

function loadMatrixTransform() {
    var mrcmId = parseInt($('#matrixId option:selected').val());
    var matrixIndex = parseInt($('#matrixIndex option:selected').val());
    var matrix = CM[mrcmId].M[matrixIndex];
    var pct = matrix.pct;
    var r = parseFloat($('#r').val(matrix.r));
    var s = parseFloat($('#s').val(matrix.s));
    var φ = parseFloat($('#t').val(matrix.φ));
    var ψ = parseFloat($('#u').val(matrix.ψ));
    var e = parseFloat($('#e').val(matrix.e));
    var f = parseFloat($('#f').val(matrix.f));

}

function updateMatrixTransform() {

    var mrcmId = parseInt($('#matrixId option:selected').val());
    var matrixIndex = parseInt($('#matrixIndex option:selected').val());
    var matrix = CM[mrcmId].M[matrixIndex];
    var pct = matrix.pct;
    Log.Notice('...pre updateMatrixTransform matrix=' + matrix);
    var r = parseFloat($('#r').val());
    var s = parseFloat($('#s').val());
    var φ = parseFloat($('#t').val());
    var ψ = parseFloat($('#u').val());
    var e = parseFloat($('#e').val());
    var f = parseFloat($('#f').val());
    CM[mrcmId].M[matrixIndex] = MatrixPre(r,s,φ,ψ,e,f,pct);
    changeImage();
}

function nonrandomselect(m,p,width,height) {
    var rangeList = [];
    for (var i = 0; i<m.length;i++) {
        rangeList[i] = m[i].pct;
    }
    let index = 0,
        r = 0;
    if (p.length != height*width) { // initialize points
        
    }
    for (let x=0;x<width;x++) {
        for (let y=0;y<height;y++) {
            r = getRangeIndex(rangeList);
            p[index] = {
                x:m[r].ap * x + m[r].bp * y + m[r].e,
                y:m[r].cp * x + m[r].dp * y + m[r].f,
                r:r
            };
            index++;
        }
    }
}
