var CurrentData;

var drawImageFromWorker = function (evt) {
    let data = evt.data,
        objId = data.objId,
        fractal = myFractalImages[objId],
        mouseBox = fractal.mouseBox;

    // Decimal does not make it though the transporter, reconstruct here
    data.objectInfo.startX = new Decimal(data.objectInfo.startX);
    data.objectInfo.startY = new Decimal(data.objectInfo.startY);
    data.objectInfo.endX   = new Decimal(data.objectInfo.endX);
    data.objectInfo.endY   = new Decimal(data.objectInfo.endY);

    CurrentData = data;
    fractal.counters = data.counters;
    fractal.polarity = data.polarity;
    fractal.objectInfo = data.objectInfo;
    fractal.height=data.objectInfo.height*1;
    fractal.width=data.objectInfo.width*1;

    $(mouseBox)
        .attr("style",`height:${fractal.height}px;width:${fractal.width}px;`);

    fractal.drawImage(data);
    CurrentData.pixels = fractal.pixels;
};

var profileCounters = function (counters) {
    let length = counters.length,
        maximum = 0,
        minimum = 1024,
        counts = new Array(),
        count;

    for (let i = 0; i<length;i++) {
        count = counters[i];
        if (counts[count])
        {
            counts[count]++;
        }
        else {
            counts[count] = 1;
            if (count > maximum)
            {
                maximum = count;
            }
            if (count < minimum)
            {
                minimum = count;
            }
        }
    }

    return {counts:counts,maximum:maximum,minimum:minimum};
};

var setupRect = function(evt) {
    let obj = evt.data;

    obj.target = evt.target;
    obj.height = evt.currentTarget.height;
    obj.width  = evt.currentTarget.width;
    obj.offsetLeft = evt.clientX - evt.offsetX;
    obj.offsetTop  = evt.clientY - evt.offsetY;
};

var setupRect2 = function(evt) {
    let obj = evt.data;
    obj.offsetLeft = evt.currentTarget.clientLeft;
    obj.offsetTop  = evt.currentTarget.clientTop;
};

var updateBoxCSS = function(evt) {
    let obj   = evt.data,
        borderWidth = 1,
        msg = `drawBox (#${obj.boxId})
    ofstX  = ${obj.offsetLeft},
    ofstY  = ${obj.offsetTop},
    minP   = (${obj.minX},${obj.minY}) ==> (${obj.minX-obj.offsetLeft},${obj.minY-obj.offsetTop}),
    maxP   = (${obj.maxX},${obj.maxY}) ==> (${obj.maxX-obj.offsetLeft},${obj.maxY-obj.offsetTop}),
    top    = ${(obj.minY-obj.offsetTop-borderWidth)},
    left   = ${(obj.minX-obj.offsetLeft-borderWidth)},
    height = ${(obj.maxY-obj.minY+borderWidth)},
    width  = ${(obj.maxX-obj.minX+borderWidth)}`;

    Log.Warning(msg);
    
    $('#' + obj.boxId).css({
        top:obj.minY-obj.offsetTop-borderWidth,
        left:obj.minX-obj.offsetLeft-borderWidth,
        height:obj.maxY-obj.minY+borderWidth,
        width:obj.maxX-obj.minX+borderWidth});
};

var updateBoxCSS2 = function(evt) {
    let obj   = evt.data,
        msg = `drawBox2 (#${obj.boxId})
    offsetX  = ${obj.offsetLeft},
    offsetY  = ${obj.offsetTop},
    minP   = (${obj.minX},${obj.minY}) ==> (${obj.minX+obj.offsetLeft},${obj.minY+obj.offsetTop}),
    maxP   = (${obj.maxX},${obj.maxY}) ==> (${obj.maxX+obj.offsetLeft},${obj.maxY+obj.offsetTop}),
    top    = ${(obj.minY+obj.offsetTop)},
    left   = ${(obj.minX+obj.offsetLeft)},
    height = ${(obj.maxY-obj.minY)},
    width  = ${(obj.maxX-obj.minX)}`;

    Log.Debug(msg);
    
    $('#' + obj.boxId).css({
        top:(obj.minY+obj.offsetTop),
        left:(obj.minX+obj.offsetLeft),
        height:obj.maxY-obj.minY,
        width:obj.maxX-obj.minX});
};

var drawBox = function(evt) {
    let obj = evt.data;

    if (obj.dragCurrent.y-obj.dragStart.y > 0)
    {
        obj.minY = obj.dragStart.y;
        obj.maxY = obj.dragCurrent.y;
    }
    else {
        obj.minY = obj.dragCurrent.y;
        obj.maxY = obj.dragStart.y;
    }
    if (obj.maxY-obj.minY < 2) {
        obj.maxY++
    }

    if (obj.dragCurrent.x-obj.dragStart.x > 0)
    {
        obj.minX = obj.dragStart.x;
        obj.maxX = obj.dragCurrent.x;
    }
    else {
        obj.minX = obj.dragCurrent.x;
        obj.maxX = obj.dragStart.x;
    }
    if (obj.maxX-obj.minX < 2) {
        obj.maxX++
    }

    updateBoxCSS(evt);

    Log.Debug('drawBox finished');
};

var drawBox2 = function(evt) {
    let obj = evt.data;

    if (obj.dragCurrent.y-obj.dragStart.y > 0)
    {
        obj.minY = obj.dragStart.y;
        obj.maxY = obj.dragCurrent.y;
    }
    else {
        obj.minY = obj.dragCurrent.y;
        obj.maxY = obj.dragStart.y;
    }

    if (obj.dragCurrent.x-obj.dragStart.x > 0)
    {
        obj.minX = obj.dragStart.x;
        obj.maxX = obj.dragCurrent.x;
    }
    else {
        obj.minX = obj.dragCurrent.x;
        obj.maxX = obj.dragStart.x;
    }

    updateBoxCSS2(evt);

    Log.Debug('drawBox2 finished');
};

var testCalcRect = function(evt) {
    evt = evt?evt:{
        data:{
            heightToWidthRatio:1,
            width:1000,
            height:1000,
            offsetTop:0,
            offsetLeft:0,
            rect:{
                start:{
                    x:new Decimal(-1),
                    y:new Decimal(-1)
                },
                end:{
                    x:new Decimal(1),
                    y:new Decimal(1)
                },
            },
            rectTmp:{
                start:{
                    x:new Decimal(0),
                    y:new Decimal(0)
                },
                end:{
                    x:new Decimal(0),
                    y:new Decimal(0)
                },
            },
            form:{
                data:{
                    scaleTypeId:"0,0",
                    maxWidth:1000,
                    maxHeight:1000,
                }
            },
            maxX:300,
            minX:200,
            maxY:75,
            minY:25,
        }
    };

    return calculateRect(evt);
}

var snapRect = function (evt) {
    let obj = evt.data,
        minX =-1,
        maxX =obj.width-1,
        minY =-1,
        maxY =obj.height-1;
         
    if (obj.minX < minX) {
        obj.minX = minX;
    }
    if (obj.maxX > maxX) {
        obj.maxX = maxX;
    }
    if (obj.minY < minY) {
        obj.minY = minY;
    }
    if (obj.maxY > maxY) {
        obj.maxY = maxY
    }

}

var calculateRect2 = function (evt) {

    let obj = evt.data,
        canvasCurrentWidth = obj.width,
        canvasCurrentHeight = obj.height,
        canvasSelectionWidth = 1;
}

var calculateRect = function (evt)  {

    let obj = evt.data,
        width = Decimal(obj.width),
        height = Decimal(obj.height),
        dxNew,
        dyNew,
        fractalWidth = obj.rect.end.x.minus(obj.rect.start.x),
        fractalHeight = obj.rect.end.y.minus(obj.rect.start.y),
        //form = processForm(),
        form = obj.form?obj.form:FormGlobal?FormGlobal:processForm(), // allow testing by passed in form
        scaleTypeId = form.data.scaleTypeId,
        pixelDim,
        heightToWidthRatio = fractalHeight.div(fractalWidth);

    // Change minX,Y and maxX,Y as needed:
        obj

        switch(scaleTypeId) {
        case "1,0":
            width = Decimal(obj.width);
            
            break;
        case "0,1":
        case "500,0":
        case "0,500":
        case "200,0":
        case "0,200":
        case "100,0":
        case "0,100":
        case "10,0":
        case "0,10":
        case "0,0": 
        default:
            if (form.data.maxWidth) {
                width = Decimal(form.data.maxWidth);
                height = width.times(heightToWidthRatio);
                pixelDim = fractalWidth.times(Decimal(obj.maxX-obj.minX).div(width));
            } else 
            if (form.data.maxHeight) {
                height = Decimal(form.data.maxHeight);
                width  = height.div(heightToWidthRatio);
                pixelDim = fractalHeight.times(Decimal(obj.maxY-obj.minY).div(height));
            } else {
                width  = Decimal(obj.width);
                height = Decimal(obj.height);
                pixelDim = fractalWidth.times(Decimal(obj.maxX-obj.minX).div(width));
            }
            break;
        }

    dxNew = fractalWidth.times(Decimal(obj.maxX-obj.minX).div(width)),
    dyNew = fractalHeight.times(Decimal(obj.maxY-obj.minY).div(height));

    let rectMinX = obj.rect.start.x.plus(
        (obj.rect.end.x.minus(obj.rect.start.x)).times(Decimal(obj.minX-obj.offsetLeft).div(width)));

    let rectMinY = obj.rect.start.y.plus(
        (obj.rect.end.y.minus(obj.rect.start.y)).times(Decimal(height-(obj.maxY-obj.offsetTop)).div(height))) ;

    let rectMaxX = obj.rect.end.x.minus(
        (obj.rect.end.x.minus(obj.rect.start.x)).times((width.minus(Decimal(obj.maxX-obj.offsetLeft))).div(width)));

    let rectMaxY = obj.rect.end.y.minus(
        (obj.rect.end.y.minus(obj.rect.start.y)).times(Decimal(obj.minY-obj.offsetTop).div(height)));

    let rectTmp = obj.rectTmp;

    rectTmp.start.x = rectMinX;
    rectTmp.start.y = rectMinY;
    rectTmp.end.x = rectMaxX;
    rectTmp.end.y = rectMaxY;
    //obj.heightToWidthRatio = height.div(width);
    obj.heightToWidthRatio = dyNew.div(dxNew);
    obj.height = parseInt(height); // replace with Math.floor(height) toFixed returns a string :(
    obj.width  = parseInt(width);   // replace with Math.floor(width)  toFixed returns a string :(

    Log.Debug(`calculateRect 
    width='${obj.width}'
    height='${obj.height}'
    minX ='${obj.minX}'
    minY='${obj.minY}'
    maxX='${obj.maxX}'
    maxY='${obj.maxY}'
    rectMinX='${rectMinX}'
    rectMinY='${rectMinY}'
    rectMaxX='${rectMaxX}'
    rectMaxY='${rectMaxY}'
    dxNew='${dxNew}'
    dyNew='${dyNew}'
    heightToWidthRatio='${obj.heightToWidthRatio}'`);

    return evt;
}

