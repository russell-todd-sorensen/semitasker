var drawDxDyH = function(dx,dy) {
    return `M0,0 L${dx},0 ${dx},${dy} Z`
} 
var calcSVGPathFromTo = function (
    optionsUpdate
) {
    let options = Object.assign({
            x1:0,
            y1:0,
            x2:120,
            y2:120,
            dir:1,
            sweep:0,
            xdim:120,
            ydim:120,
            minimizeArea:true,
            testEllipse:["ellipseA","ellipseB","ellipseC","ellipseD"],
        }, optionsUpdate),
        dx  = (options.x2 - options.x1),
        dy  = (options.y2 - options.y1),
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
        midy = miny+cy
        pathData = {
            pathDataA:"",
            pathDataB:"",
            pathDataC:"",
            pathDataD:"",
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
                    pathDataA = `m0,0 a${halfXDim.toFixed(3)},${cy.toFixed(3)} ${deg.toFixed(3)} ${options.dir},${options.sweep} ${dx.toFixed(3)},${dy.toFixed(3)}`,
                    pathDataB = `m0,0 a${cx.toFixed(3)},${halfYDim.toFixed(3)} ${deg.toFixed(3)} ${options.dir},${options.sweep} ${((-1)*dx).toFixed(3)},${((-1)*dy).toFixed(3)}`,
                    pathDataC = `m0,0 a${halfXDim.toFixed(3)},${cy.toFixed(3)} 0 ${options.dir},${options.sweep} ${dx.toFixed(3)},${dy.toFixed(3)}`,
                    pathDataD = `m0,0 a${cx.toFixed(3)},${halfYDim.toFixed(3)} 0 ${options.dir},${options.sweep} ${((-1)*dx).toFixed(3)},${((-1)*dy).toFixed(3)}`,
                    pathDataTriangleA = drawDxDyH(dx,dy),
                    pathDataTriangleB = drawDxDyH(`${dx*-1}`,`${dy*-1}`),
                    pathDataTriangleC = drawDxDyH(dx,dy),
                    pathDataTriangleD = drawDxDyH(`${dx*-1}`,`${dy*-1}`),
                    ellipseA = document.getElementById(options.testEllipse[0]),
                    ellipseB = document.getElementById(options.testEllipse[1]),
                    ellipseC = document.getElementById(options.testEllipse[2]),
                    ellipseD = document.getElementById(options.testEllipse[3]),
                    triangleA = document.getElementById(`${options.testEllipse[0]}dxdyh`),
                    triangleB = document.getElementById(`${options.testEllipse[1]}dxdyh`),
                    triangleC = document.getElementById(`${options.testEllipse[2]}dxdyh`),
                    triangleD = document.getElementById(`${options.testEllipse[3]}dxdyh`),
                    ellipseCrotate = document.getElementById(`${options.testEllipse[2]}rotate`),
                    ellipseDrotate = document.getElementById(`${options.testEllipse[3]}rotate`);
                ellipseA.setAttribute("d",pathDataA);
                ellipseB.setAttribute("d",pathDataB);
                ellipseC.setAttribute("d",pathDataA);
                ellipseCrotate.setAttribute("transform",`rotate(${((-1)*deg).toFixed(3)})`);
                ellipseD.setAttribute("d",pathDataB);
                ellipseDrotate.setAttribute("transform",`rotate(${((-1)*deg).toFixed(3)})`);
                triangleA.setAttribute("d",pathDataTriangleA);
                triangleB.setAttribute("d",pathDataTriangleB);
                triangleC.setAttribute("d",pathDataTriangleC);
                triangleD.setAttribute("d",pathDataTriangleD);
                let rectA = ellipseA.getBoundingClientRect(),
                    rectB = ellipseB.getBoundingClientRect(),
                    rectC = ellipseC.getBoundingClientRect(),
                    rectD = ellipseD.getBoundingClientRect(),
                    areaA = rectA.width*rectA.height,
                    areaB = rectB.width*rectB.height,
                    areaC = rectC.width*rectC.height,
                    areaD = rectD.width*rectD.height;
                pathData = {
                    pathDataA:pathDataA,
                    pathDataB:pathDataB,
                    pathDataC:pathDataC,
                    pathDataD:pathDataD,
                    pathDataC:pathDataA,
                    pathDataD:pathDataB,
                    pathDataTriangleA:pathDataTriangleA,
                    pathDataTriangleB:pathDataTriangleB,
                    pathDataTriangleC:pathDataTriangleC,
                    pathDataTriangleD:pathDataTriangleD,
                    rectA:rectA,
                    rectB:rectB,
                    rectC:rectC,
                    rectD:rectD,
                    areaA:areaA,
                    areaB:areaB,
                    areaC:areaC,
                    areaD:areaD,
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

    let a2b = `m0,0 a${cx.toFixed(3)},${cy.toFixed(3)} ${deg.toFixed(3)} ${options.dir},${options.sweep} ${dx.toFixed(3)},${dy.toFixed(3)}`,
        b2a = `m0,0 a${cx.toFixed(3)},${cy.toFixed(3)} ${deg.toFixed(3)} ${options.dir},${options.sweep} ${((-1)*dx).toFixed(3)},${((-1)*dy).toFixed(3)}`;

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
