var drawDxDyH = function(dx,dy) {
    return `M0,0 L${dx},0 ${dx},${dy} Z`
}
var chooseEllipseDims = function (cx,cy,minDim=90,mult=3) {
    cx = Math.abs(parseFloat(cx));
    cy = Math.abs(parseFloat(cy));
    // note cx and cy minimums are r

    let halfH = Math.sqrt(cx**2+cy**2);
    if (cy > minDim) {
        cy = minDim
    } 
    cx = halfH;
    return {cx:cx,cy:cy,halfH:halfH,minDim:minDim,mult:mult}
}
var drawAtoBpaths = function(pathData) {
    let p = Object.assign({
        x1:0,
        y1:0,
        x2:120,
        y2:120,
        dir:1,
        sweep:0,
    },pathData);

    p.dx  = (p.x2 - p.x1);
    p.dy  = (p.y2 - p.y1);
    p.bias = (p.dx*p.dy<0?1:-1);
    p.dbias = -p.bias;
    p.h=Math.sqrt(p.dx**2+p.dy**2);
    p.sin=p.h==0?1:p.dy/p.h;
    p.deg=(Math.asin(p.sin)*(180/Math.PI));

    p.r  = p.h/2;
    p.cx  = Math.abs(p.dx/2);
    p.cy  = Math.abs(p.dy/2);

    if (p.cx <= Number.EPSILON) {
        p.dx = 0;
        p.cx = r;
    }
    if (p.cy <= Number.EPSILON) {
        p.dy = 0;
        p.cy = r;
    }
    return {
        a2b:`m0,0 a${p.cx.toFixed(3)},${p.cy.toFixed(3)} ${p.deg.toFixed(3)} ${p.dir},${p.sweep} ${p.dx.toFixed(3)},${p.dy.toFixed(3)}`,
        b2a:`m0,0 a${p.cx.toFixed(3)},${p.cy.toFixed(3)} ${p.deg.toFixed(3)} ${p.dir},${p.sweep} ${((-1)*p.dx).toFixed(3)},${((-1)*p.dy).toFixed(3)}`,
    }
}
var calcSVGPathFromTo = function (
    optionsUpdate
) {
    let options = Object.assign({
            x1:0,
            y1:0,
            x2:180,
            y2:180,
            dir:1,
            sweep:0,
            xdim:180,
            ydim:180,
            minimizeArea:true,
            testEllipse:["ellipseA","ellipseB"],
        }, optionsUpdate),
        dx  = (options.x2 - options.x1),
        dy  = (options.y2 - options.y1),
        bias = (dx*dy<0?1:-1),
        dbias = bias*-1,
        h   = Math.sqrt(dx**2+dy**2),
        sin = h==0?1:dy/h,
        deg = (Math.asin(sin)*(180/Math.PI)),
         r  = h/2,
        cx  = Math.abs(dx/2),
        //cx  = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx)*0.5 : Math.abs(dy)*0.75,
        cy  = Math.abs(dy/2),
        //cy  = Math.abs(dy) > Math.abs(dx) ? Math.abs(dy)*0.5 : Math.abs(dx)*0.75,
        minx = options.x1<options.x2?options.x1:options.x2,
        miny = options.y1<options.y2?options.y1:options.y2,
        midx = minx+cx,
        midy = miny+cy,
        pathData = {
            pathDataA:"",
            pathDataB:"",
        };

        if (cx <= Number.EPSILON) {
            dx = 0;
            cx = r;
        }
        if (cy <= Number.EPSILON) {
            dy = 0;
            cy = r;
        }
        if (options.minimizeArea) {
            if (options.testEllipse.length) {
                let halfYDim  = options.ydim/2,
                    halfXDim  = options.xdim/2,
                    //pathDataA = `m0,0 a${halfXDim.toFixed(3)},${cy.toFixed(3)} ${deg.toFixed(3)} ${options.dir},${options.sweep} ${dx.toFixed(3)},${dy.toFixed(3)}`,
                    pathDataA = `m0,0 a${r.toFixed(3)},${(r>halfYDim?halfYDim:r).toFixed(3)} ${(bias*deg).toFixed(3)} ${options.dir},${options.sweep} ${dx.toFixed(3)},${dy.toFixed(3)}`,
                    //pathDataA = `m0,0 a${180},${60} ${(dbias*deg).toFixed(3)} ${options.dir},${options.sweep} ${dx.toFixed(3)},${dy.toFixed(3)}`,
                    //pathDataB = `m0,0 a${cx.toFixed(3)},${halfYDim.toFixed(3)} ${(dbias*deg).toFixed(3)} ${options.dir},${options.sweep} ${((-1)*dx).toFixed(3)},${((-1)*dy).toFixed(3)}`,
                    pathDataB = `m0,0 a${r.toFixed(3)},${(r>halfYDim?halfYDim:r).toFixed(3)} ${(bias*deg).toFixed(3)} ${options.dir},${options.sweep} ${((-1)*dx).toFixed(3)},${((-1)*dy).toFixed(3)}`,
                    //pathDataB = `m0,0 a${180},${60} ${(dbias*deg).toFixed(3)} ${options.dir},${options.sweep} ${((-1)*dx).toFixed(3)},${((-1)*dy).toFixed(3)}`,
                    pathDataTriangleA = drawDxDyH(dx,dy),
                    pathDataTriangleB = drawDxDyH(`${dx*-1}`,`${dy*-1}`),
                    ellipseA = document.getElementById(options.testEllipse[0]),
                    ellipseB = document.getElementById(options.testEllipse[1]),
                    triangleA = document.getElementById(`${options.testEllipse[0]}dxdyh`),
                    triangleB = document.getElementById(`${options.testEllipse[1]}dxdyh`);
                ellipseA.setAttribute("d",pathDataA);
                ellipseB.setAttribute("d",pathDataB);
                triangleA.setAttribute("d",pathDataTriangleA);
                triangleB.setAttribute("d",pathDataTriangleB);
                let rectA = ellipseA.getBoundingClientRect(),
                    rectB = ellipseB.getBoundingClientRect(),
                    areaA = rectA.width*rectA.height,
                    areaB = rectB.width*rectB.height;
                pathData = {
                    pathDataA:pathDataA,
                    pathDataB:pathDataB,
                    pathDataTriangleA:pathDataTriangleA,
                    pathDataTriangleB:pathDataTriangleB,
                    rectA:rectA,
                    rectB:rectB,
                    areaA:areaA,
                    areaB:areaB,
                }
                if (areaA < areaB) {
                    cx = halfXDim;
                } else {
                    cy = halfYDim;
                }
            } else {
                if (cx > cy) {
                    cx = h;
                    cy = options.ydim/2;
                } else {
                    cy = h;
                    cx = options.xdim/2;
                }
            }
        }

        let a2b = pathData.pathDataA,
            b2a = pathData.pathDataB;
        pathData.pathDataA = `m0,0 a${(((cx/cy)>3)?3:(cx/cy)).toFixed(3)},1.000 ${(bias*deg).toFixed(3)} ${options.dir},${options.sweep} ${dx.toFixed(3)},${dy.toFixed(3)}`,
        pathData.pathDataB = `m0,0 a${(((cx/cy)>3)?3:(cx/cy)).toFixed(3)},1.000 ${(bias*deg).toFixed(3)} ${options.dir},${options.sweep} ${((-1)*dx).toFixed(3)},${((-1)*dy).toFixed(3)}`;

    return {
        dx:dx,dy:dy,
        h:h,
        sin:sin,
        deg:deg,
        r:r,
        cx:cx,cy:cy,
        minx:minx,miny:miny,
        midx:midx,midy:midy,
        a2b:a2b,b2a:b2a,
        pathData:pathData,
        bias:bias,
    };
}

var testCalcPath = function(dataUpdate) {

    let data = Object.assign({
            minX:0,
            minY:0,
            maxX:480,
            maxY:480,
            stepX:120,
            stepY:120,
            sweep:0,
            dir:1,
            xdim:120, // width of box + spacing
            ydim:120, // height of box + spacing
            minimizeArea:true,
            maxPoints:5,
            startPoint:1,
            bias:1,
        }, dataUpdate),
        maxPoints = data.maxPoints,
        startPoint = data.startPoint,
        endPoint = startPoint+maxPoints-1,
        point = 0,
        results = [];

    bigloop:
    for (let y1 = data.minY;y1<=data.maxY;y1+=data.stepY) {
        for (let x1 = data.minX;x1<=data.maxX;x1+=data.stepX) {
            for (let y2 = data.minY;y2<=data.maxY;y2+=data.stepY) {
                for (let x2 = data.minX;x2<=data.maxX;x2+=data.stepX) {
                    point++;
                    if (point < startPoint) {
                        continue;
                    }
                    let input = Object.assign({},{
                        x1:x1,
                        y1:y1,
                        x2:x2,
                        y2:y2,
                        dir:data.dir,
                        sweep:data.sweep,
                        xdim:data.xdim,
                        ydim:data.ydim,
                    },data),
                    result = Object.assign(input,
                        calcSVGPathFromTo(input));
                    results.push(result);
                    if (point >= endPoint) {
                        break bigloop;
                    }
                }
            }
        }
    }
    return results;
}
