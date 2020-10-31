
var FormGlobal;
var imageData;
var captureHandle;

var processForm = function () {
    let doc = document,
        colorOffsetAmount=parseInt($('#colorOffsetAmount').val()),
        fractalImageId=parseInt($('#fractalImageId').val()),
        fractalTypeId=parseInt($('#fractalTypeId').val()),
        scaleTypeId=$("#scaleTypeId").val(),
        pixelJump=parseInt($('#pixelJump').val()),
        maxWidth=parseInt($("#maxWidth").val()),
        maxHeight=parseInt($("maxHeight").val()),
        pixelColorsId=parseInt($('#pixelColorsId').val()),
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
    let formData = processForm();
    startAnimation(formData.id,formData.timeout,formData.data);
};

var drawImagePre = function(redrawId,drawId) {

    let formData = processForm(),
        obj = myFractalImages[formData.data.objId];

    $('#' + redrawId).css({display:'inline-block'});
    $('#' + drawId).css({display:'none'});

   obj.calculateCounters(formData.data, true);

};

var startAnimation = function (animationFunctionId,timeout, data) {
    let objId = data.objId,
        animationFunction = addToPixels[animationFunctionId],
        fractal = myFractalImages[objId];

    fractal.continueAnimation = true;
    timeout = timeout<10?10:timeout;

    scheduleFunction(animationFunction, timeout, true, true, data);
};

var stopAnimation = function() {
    let formData = processForm(),
        data = formData.data,
        objId = data.objId,
        fractal = myFractalImages[objId];

    fractal.continueAnimation = false;
};

var reDrawImage = function () {
    let formData = processForm(),
        data = formData.data,
        objId = data.objId,
        fractal = myFractalImages[objId];

    fractal.rect.start.x = fractal.rectTmp.start.x;
    fractal.rect.start.y = fractal.rectTmp.start.y;
    fractal.rect.end.x = fractal.rectTmp.end.x;
    fractal.rect.end.y = fractal.rectTmp.end.y;

    //fractal.calculateHeightAndWidth(newFactor);
    fractal.calculateCounters(data, false);

    return fractal.continueAnimation;
};

var captureCanvas = function (type) {
    let formData = processForm(),
        data = formData.data,
        objId = data.objId,
        fractal = myFractalImages[objId];

    let resolve = function(imageData) {
        $('#imageGallery').append('<img height="20" src="' + imageData + '">');
        return imageData.length;
    }

    let reject = function (msg) {
        return msg;
    }

    let writeImage = new Promise(function(resolve, reject) {
        let imageData = fractal.canvas.toDataURL(type,1.0)
    });

};


var resolve = function() {
    if (imageData) {
        $('#imageGallery').append('<img height="20" src="' + imageData + '">');
        clearInterval(captureHandle);
    }
}

var captureCanvas2 = function (type) {

    let formData = processForm(),
        data = formData.data,
        objId = data.objId,
        fractal = myFractalImages[objId];

    imageData = fractal.canvas.toDataURL(type,1.0);
    captureHandle = setInterval('resolve()', 1000);
};
