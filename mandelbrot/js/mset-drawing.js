var CurrentData;

var drawImageFromWorker = function (evt) {
    let data = evt.data,
        objId = data.objId,
        fractal = myFractalImages[objId];

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

var calculateRect = function (evt)  {

    let obj = evt.data,
        width,
        height,
        dxNew,
        dyNew,
        fractalWidth = obj.rect.end.x.minus(obj.rect.start.x),
        fractalHeight = obj.rect.end.y.minus(obj.rect.start.y),
        form = FormGlobal,
        scaleTypeId = form.data.scaleTypeId,
        pixelDim,
        heightToWidthRatio = fractalHeight.div(fractalWidth);

        switch(scaleTypeId) {
        case "1,0":
            width = Decimal(obj.width);
            
            break;
        case "0,1":
            break;
        case "500,0":
            break;
        case "0,500":
            break;
        case "200,0":
            break;
        case "0,200":
            break;
        case "100,0":
            break;
        case "0,100":
            break;
        case "10,0":
            break;
        case "0,10":
            break;
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

    Log.Debug('calculateRect \nwidth=' + width.toFixed(0)
        + '\nheight=' + height.toFixed(0) + '\nminX =' + obj.minX
        + '\nminY=' + obj.minY + '\nmaxX=' + obj.maxX
        + '\nmaxY=' + obj.maxY
        + '\nrectMinX=' + rectMinX + '\nrectMinY=' + rectMinY
        + '\nrectMaxX=' + rectMaxX + '\nrectMaxY=' + rectMaxY);

    Log.Debug('calculateRect dxNew=' + dxNew + ' dyNew=' + dyNew);

    let rectTmp = obj.rectTmp;

    rectTmp.start.x = rectMinX;
    rectTmp.start.y = rectMinY;
    rectTmp.end.x = rectMaxX;
    rectTmp.end.y = rectMaxY;
    obj.height = height.toFixed(0);
    obj.width = width.toFixed(0);
    obj.heightToWidthRatio = height.div(width);
}

