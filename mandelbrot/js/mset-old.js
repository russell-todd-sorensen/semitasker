// Fractal Image Library

var myFractalImages = new Array();
var myFractalImageId = myFractalImages.length;
var colorCanvas;
var minimumPixelImageHeight = 768;


//////////////////// THIS IS THE FRACTAL IMAGE OBJECT  /////////////
var fractalImage = function(canvasId,boxId,height,width,startUpData) {
    this.id = canvasId;
    this.boxId = boxId;
    this.name = canvasId;
    this.mouseBox = '#' + canvasId;
    this.height = height;
    this.width = width;
    this.factor = new Decimal(1.25);
    this.rect = {
        start: {
            x: new Decimal(-2.3),
            y: new Decimal(-1.5)
        },
        end: {
            x: new Decimal(1.7),
            y: new Decimal(1.5)
        }
    };
    this.rectTmp = {
        start: {
            x: new Decimal(-1.0),
            y: new Decimal(-1.0)
        },
        end:{
            x: new Decimal(1.0),
            y: new Decimal(1.0)
        }
    };
    this.dragStart = {
        x: 0.0,
        y: 0.0,
    };
    this.dragCurrent = {
        x: width,           // what is width here?
        y: height,          // ...
    };
    this.dragEnd = {
        x: width,           // ??
        y: height,          // and here ?
    };
    this.fractalWidth = new Decimal(2.0);
    this.fractalHeight = new Decimal(2.0);
    this.heightToWidthRatio = new Decimal(1.0);

    this.calculateHeightAndWidth = function (newFactor)
    {
        if (newFactor <= 2 || newFactor >= 0.2) {
            this.factor = newFactor;
        }

        this.fractalWidth = this.rect.end.x.minus(this.rect.start.x);
        this.fractalHeight = this.rect.end.y.minus(this.rect.start.y);
        this.heightToWidthRatio = this.fractalHeight.div(this.fractalWidth).toNumber(); // not decimal using 4 decimal places

        Log.Debug('heightToWidthRatio=' + this.heightToWidthRatio);

        if (this.heightToWidthRatio >= 1 )
        {
            this.width = 500*this.factor;
        } else {
            this.width = 1000*this.factor;
        }

        this.height = Math.round(this.width*this.heightToWidthRatio);
        this.width  = Math.round(this.width);

        Log.Debug('width=' + this.width + ' height=' + this.height);
    };

    this.canvas = null;
    this.context = null;
    this.imageData = null;
    this.pixels = null;
    this.colors = new Array();
    this.polarity = new Array();
    this.counterMax = 255;
    this.finiteMeasure = 256.0; //256.0;
    this.finiteMeasureFunction = 2;
    this.counters = [];
    this.profile = {};
    this.scale = 5;
    this.pixelImageHeight = 768;//this.factor;
    this.pixelImageWidth = 150;//this.factor;
    this.clearProfile = function () {
        this.profile = {
            counts: [],
            minimum: this.counterMax,
            maximum: 0,
            infinite: 0
        };
    };
    this.animationRow = 0;
    this.rotationIndex = 0;
    this.rowPolygons = null;
    this.scaleCounter = function (value) {
        if (value < 10) {
            return value * 5;
        } else if (value < 50) {
            return 50 + value;
        } else {
            return 100;
        }
    };
    this.calculatePolygonRows = function( ) {
        let rowArray,
            counterIndexStart,
            counterLast = null,
            counter;

        this.rowPolygons = new Array();

        for (let row = 0;row<this.height;row++)
        {
            rowArray = new Array();
            counterIndexStart = 4*row*this.width;

            for (let col = 0;col<this.width;col++)
            {
                counter = this.counters[counterIndexStart + 4*col];
                if (col == 0 || col == this.width-1) {
                    rowArray[rowArray.length] = [col,counter];
                } else if (counter != counterLast) {
                    rowArray[rowArray.length] = [col,counter];
                }
                counterLast = counter;
            }

            this.rowPolygons[row] = rowArray;
        }
    };

    this.initColorArray = function () {
        this.colorCanvas = document.getElementById(this.colorCanvasId);
        this.colorCanvas.setAttribute('height',this.pixelImageHeight);
        this.colorCanvas.setAttribute('width',this.pixelImageWidth);

        if (!this.colorCanvas || !this.colorCanvas.getContext)
        {
            Log.Debug('initColorArray: canvas or canvas.getContext not found');
            return;
        }

        this.colorCanvasContext = this.colorCanvas.getContext('2d');

        if (!this.colorCanvasContext || !this.colorCanvasContext.putImageData)
        {
            Log.Debug('initColorArray: context or context.putImageData not found');
            return;
        }

        if (!this.colorCanvasContext.createImageData)
        {
            Log.Debug('initColorArray: context.createImage exists');
            this.colorCanvasImageData = this.colorCanvasContext.createImageData(
            this.pixelImageHeight, this.pixelImageWidth);
        }
        else if (this.colorCanvasContext.getImageData) {
            this.colorCanvasImageData = this.colorCanvasContext.getImageData(
                0, 0, this.pixelImageWidth, this.pixelImageHeight);
            Log.Notice('initColorArray: context.getImageData exists length='
                + this.colorCanvasImageData.data.length);
        }
        else {
            Log.Debug('initColorArray: using default image creation method');
            this.colorCanvasImageData = {
                'width': this.pixelImageWidth,
                'height': this.pixelImageHeight,
                'data':new Array(this.pixelImageWidth*this.pixelImageHeight*4)
            };
        }

        this.colorCanvasPixels = this.colorCanvasImageData.data;

        for (var i=0, n=this.colorCanvasPixels.length; i<n; i++)
        {
            this.colorCanvasPixels[i] = 255;
        }

    };

    this.calculateCounters = function (data,initialRect) {
        let objectInfo = {},
            fractalTypeId = data.fractalTypeId;

        if ( initialRect ) {
            this.rect.start.x = rectInit[fractalTypeId].start.x;
            this.rect.start.y = rectInit[fractalTypeId].start.y;
            this.rect.end.x   = rectInit[fractalTypeId].end.x;
            this.rect.end.y   = rectInit[fractalTypeId].end.y;

            /////////// FOR TESTING /////////////////

            switch (fractalTypeId) {
            case 2:// for testing
                this.height = 10;
                this.width  = 10;
                break;
            case 3:
                this.height = 1;
                this.width  = 100;
                break;
            case 4:// for testing
                this.height = 100;
                this.width  = 100;
                break;
            default:
                break;
            }
            //////// FINISH FOR TESTING /////////////
        }

        objectInfo.startX = this.rect.start.x;
        objectInfo.startY = this.rect.start.y;
        objectInfo.endX = this.rect.end.x;
        objectInfo.endY = this.rect.end.y;
        objectInfo.height = this.height;
        objectInfo.width = this.width;

        this.finiteMeasure = objectInfo.finiteMeasure = data.finiteMeasure;
        this.finiteMeasureFunction = objectInfo.finiteMeasureFunction = data.finiteMeasureFunction;
        this.counterMax = objectInfo.counterMax = data.counterMax;
 
        // Javascript can't serialize Decimal, so we do it ourselves
        objectInfo.startX = (objectInfo.startX).toJSON();
        objectInfo.startY = (objectInfo.startY).toJSON();
        objectInfo.endX   = (objectInfo.endX).toJSON();
        objectInfo.endY   = (objectInfo.endY).toJSON();
        data.objectInfo   = objectInfo;

        // we will reverse when we get message from worker
        this.worker.postMessage(data);
    };

    this.drawImage = function (data) {

        this.canvas = document.getElementById(this.id);
        this.canvas.setAttribute('height',this.height);
        this.canvas.setAttribute('width',this.width);
        
        // set container dimensions to match canvas
        $(`#${this.id}`)
            .parent().css({
                "height":`${this.height}px`,
                "width":`${this.width}px`
            });

        if (!this.canvas || !this.canvas.getContext)
        {
            Log.Debug('doImageStuff: canvas or canvas.getContext not found');
            return;
        }

        this.context = this.canvas.getContext('2d');

        if (!this.context || !this.context.putImageData)
        {
            Log.Debug('doImageStuff: context or context.putImageData not found');
            return;
        }

        if (!this.context.createImageData)
        {
            Log.Debug('doImageStuff: context.createImage exists');
            this.imageData = this.context.createImageData (this.height, this.width);
        }
        else if (this.context.getImageData) {
            this.imageData = this.context.getImageData(0, 0, this.width, this.height);
            Log.Notice('doImageStuff: context.getImageData exists length='
                + this.imageData.data.length);
        }
        else {
            Log.Debug('doImageStuff: using default image creation method');
            this.imageData = {
                'width': this.width,
                'height': this.height,
                'data':new Array(this.width*this.height*4)
            };
        }

        this.pixels = this.imageData.data;
        // This is where the new data should be used

        for (var i=0, n=this.pixels.length; i<n; i++)
        {
            this.pixels[i] = 255;
        }

        this.profile = data.profile;
        this.counters = data.counters;

        // Finish profile
        this.profile.total = 0;
        this.profile.percents = new Array();

        for (var i = 0; i < this.counterMax; i++)
        {
            if (this.profile.counts[i])
            {
                this.profile.total = this.profile.total + this.profile.counts[i];
            }
            else {
                this.profile.counts[i] = 0;
            }
        }

        // calculate percentages
      var value;

        for (var i = 0; i < this.profile.counts.length; i++)
        {
            value = Math.round(100*this.scale*this.profile.counts[i]/this.profile.total);
            this.profile.percents[i] = (value < 100 ? value : 100);
        }

        this.calculatePolygonRows();
        addToPixels[data.animationFunctionId](data);
        this.context.putImageData(this.imageData, 0, 0);
    };

    // Web Worker to calculate counters
    this.worker = new Worker('js/mset-web-worker-code-generalized-arb.js');
    this.worker.addEventListener('message', drawImageFromWorker)

    this.continueAnimation = false;

    this.animationModulus = 360*100;
    this.animationIndex = 0;

    if (arguments.length == 5)
    {
        for (var prop in startUpData)
        {
            this[prop] = startUpData[prop];
        }
    }

    //this.calculateHeightAndWidth(this.factor);
    this.callStartMove = [logStartMove,captureMouseUp,setupRect];
    this.callDragMove  = [drawBox, logDragMove];
    this.callEndMove   = [logEndMove,unbindMouseUp,calculateRect];
    return this;
};

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

    for (var i = 0; i<length;i++) {
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

var calculateRectOld = function (evt)  {

    let obj = evt.data,
        dxCurrent = obj.rect.end.x.minus(obj.rect.start.x),
        dyCurrent = obj.rect.end.y.minus(obj.rect.start.y),
        heightToWidthRatio = dyCurrent.div(dxCurrent),         // unused ??
        height = obj.height*1.0,
        width =  obj.width*1.0,
        dxNew = dxCurrent.times((obj.maxX-obj.minX)/width),
        dyNew = dyCurrent.times((obj.maxY-obj.minY)/height);

    let rectMinX = obj.rect.start.x.plus(
        (obj.rect.end.x.minus(obj.rect.start.x)).times((obj.minX-obj.offsetLeft)/width));

    let rectMinY = obj.rect.start.y.plus(
        (obj.rect.end.y.minus(obj.rect.start.y)).times((height-(obj.maxY-obj.offsetTop))/height)) ;

    let rectMaxX = obj.rect.end.x.minus(
        (obj.rect.end.x.minus(obj.rect.start.x)).times((width-(obj.maxX-obj.offsetLeft))/width));

    let rectMaxY = obj.rect.end.y.minus(
        (obj.rect.end.y.minus(obj.rect.start.y)).times((obj.minY-obj.offsetTop)/height));

    Log.Debug('calculateRect \nwidth=' + width
        + '\nheight=' + height + '\nminX =' + obj.minX
        + '\nminY=' + obj.minY + '\nmaxX=' + obj.maxX
        + '\nmaxY=' + obj.maxY
        + '\nrectMinX=' + rectMinX + '\nrectMinY=' + rectMinY
        + '\nrectMaxX=' + rectMaxX + '\nrectMaxY=' + rectMaxY);

    Log.Debug('calculateRect dxNew=' + dxNew + ' dyNew=' + dyNew);

    var rectTmp = obj.rectTmp;

    rectTmp.start.x = rectMinX;
    rectTmp.start.y = rectMinY;
    rectTmp.end.x = rectMaxX;
    rectTmp.end.y = rectMaxY;
}

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
        heightToWidthRatio = fractalHeight.div(fractalWidth);         // unused ??

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

    var rectTmp = obj.rectTmp;

    rectTmp.start.x = rectMinX;
    rectTmp.start.y = rectMinY;
    rectTmp.end.x = rectMaxX;
    rectTmp.end.y = rectMaxY;
    obj.height = height.toFixed(0);
    obj.width = width.toFixed(0);
    obj.heightToWidthRatio = height.div(width);
}


var FormGlobal;

var processForm = function () {
    let doc = document,
        colorOffsetAmount=parseInt($('#colorOffsetAmount').val()),
        fractalImageId=parseInt($('#fractalImageId').val()),
        fractalTypeId=parseInt($('#fractalTypeId').val()),
        scaleTypeId=$("#scaleTypeId").val(),
        pixelJump=parseInt($('#pixelJump').val()),
        maxWidth=parseInt($("#maxWidth").val()),
        maxHeight=parseInt($("maxHeight").val()),
        pixelColorsId=parseInt($('#pixelColorsId').val());
        refColorId=parseInt($('#refColorId').val()),
        scaleCounterId=parseInt($('#scaleCounterId').val()),
        hueFactor = parseFloat($('#hueFactor').val()),
        rampFactor = parseInt($('#rampFactor').val()),
        minLevel = parseFloat($('#minLevel').val()),
        maxLevel = parseFloat($('#maxLevel').val()),
        minSat = parseFloat($('#minSat').val()),
        maxSat = parseFloat($('#maxSat').val()),
        minBrt = parseFloat($('#minBrt').val()),
        maxBrt = parseFloat($('#maxBrt').val()),
        minInt = parseFloat($('#minInt').val()),
        maxInt = parseFloat($('#maxInt').val()),
        finiteMeasure = parseFloat($('#finiteMeasure').val()),
        finiteMeasureFunction = parseInt($('#finiteMeasureFunction option:selected').val()),
        counterMax = parseInt($('#counterMax').val()),
        animationFunctionId = parseInt($('#animationFunctionId option:selected').val()),
        hslOrHsb=$('#hslOrHsb option:selected').val();
    FormGlobal = {
        id:animationFunctionId,
        timeout:parseInt($('#timeout').val()),
        data:{
            objId:fractalImageId,
            fractalTypeId:fractalTypeId,
            scaleTypeId:scaleTypeId,
            pixelJump:pixelJump,
            maxWidth:maxWidth,
            maxHeight:maxHeight,
            pixelColorsId:pixelColorsId,
            animationFunctionId:animationFunctionId,
            amount:colorOffsetAmount,
            refColorId:refColorId,
            scaleCounterId:scaleCounterId,
            hueFactor:hueFactor,
            rampFactor:rampFactor,
            minLevel:minLevel,
            maxLevel:maxLevel,
            minSat:minSat,
            maxSat:maxSat,
            minBrt:minBrt,
            maxBrt:maxBrt,
            minInt:minInt,
            maxInt:maxInt,
            finiteMeasure:finiteMeasure,
            finiteMeasureFunction:finiteMeasureFunction,
            counterMax:counterMax,
            hslOrHsb:hslOrHsb,
        }
    };

    return FormGlobal;
};

var startAnimationPre = function() {
    var formData = processForm(formData);
    startAnimation(formData.id,formData.timeout,formData.data);
};

var drawImagePre = function(redrawId,drawId) {

    var formData = processForm(formData),
        obj = myFractalImages[formData.data.objId];

    $('#' + redrawId).css({display:'inline-block'});
    $('#' + drawId).css({display:'none'});

   obj.calculateCounters(formData.data, true);

};

var startAnimation = function (animationFunctionId,timeout, data) {
    var objId = data.objId;
    var animationFunction = addToPixels[animationFunctionId];
    var fractal = myFractalImages[objId];
    fractal.continueAnimation = true;
    if (timeout < 10) timeout = 10;
    scheduleFunction(animationFunction, timeout, true, true, data);
};

var stopAnimation = function() {
    var formData = processForm();
    var data = formData.data;
    var objId = data.objId;
    var fractal = myFractalImages[objId];
    fractal.continueAnimation = false;
};

var reDrawImage = function () {
    var formData = processForm();
    var data = formData.data
    var objId = data.objId;
    var fractal = myFractalImages[objId];
    //var newFactor = fractal.factor;
    fractal.rect.start.x = fractal.rectTmp.start.x;
    fractal.rect.start.y = fractal.rectTmp.start.y;
    fractal.rect.end.x = fractal.rectTmp.end.x;
    fractal.rect.end.y = fractal.rectTmp.end.y;
    //fractal.calculateHeightAndWidth(newFactor);
    fractal.calculateCounters(data, false);
    return fractal.continueAnimation;
};

var captureCanvas = function (type) {
    var formData = processForm();
    var data = formData.data;
    var objId = data.objId;
    var fractal = myFractalImages[objId];

    var resolve = function(imageData) {
        $('#imageGallery').append('<img height="20" src="' + imageData + '">');
        return imageData.length;
    }

    var reject = function (msg) {
        return msg;
    }

    var writeImage = new Promise(function(resolve, reject) {

        var imageData = fractal.canvas.toDataURL(type,1.0)
    });
/*    });

    writeImage.then(function(result) {
        console.log(result);
    }, function(err) {
        console.log(err);
    }); */

};

var imageData;
var captureHandle;

var resolve = function() {
    if (imageData) {
        $('#imageGallery').append('<img height="20" src="' + imageData + '">');
        clearInterval(captureHandle);
    }
}

var captureCanvas2 = function (type) {

    var formData = processForm();
    var data = formData.data;
    var objId = data.objId;
    var fractal = myFractalImages[objId];
    imageData = fractal.canvas.toDataURL(type,1.0);
    captureHandle = setInterval('resolve()', 1000);

};
