drawColors = function (data) {
    return;
    let minHeight = 100,
        minWidth = 100,
        objId   = data.objId,
        fractal = myFractalImages[objId],
        height  = fractal.height<minHeight?minHeight:fractal.height,
        width   = fractal.width<minWidth?minWidth:fractal.width,
        profile = fractal.profile,
        pixelRowsPerColor =  Math.round(height/(fractal.counterMax+1)),
        p;

    if (pixelRowsPerColor < 2) {
        pixelRowsPerColor = 1;
        height = fractal.counterMax+1;
        fractal.pixelImageHeight = height;
    }

    $('#' + fractal.colorCanvasId).attr("height", height);

    fractal.colorCanvasImageData = fractal.colorCanvasContext.createImageData(
        fractal.pixelImageWidth,fractal.pixelImageHeight
    );

    fractal.colorCanvasPixels = fractal.colorCanvasImageData.data;

    for (let i=0, n=fractal.colorCanvasPixels.length; i<n; i++)
    {
        fractal.colorCanvasPixels[i] = 255;
    }

    for (let i = 0,color; i<fractal.counterMax+1;i++) {
        color = fractal.colors[i];

        for (let r = 0,start,end,end2; r<pixelRowsPerColor;r++) {
            start = i*width*pixelRowsPerColor*4 + r*width*4;
            end = start + 50*4 + profile.percents[i]*4;
            end2 = start + width*4;

            for (p = start; p < end; p+=4) {
                fractal.colorCanvasPixels[p+0] = color.r;
                fractal.colorCanvasPixels[p+1] = color.g;
                fractal.colorCanvasPixels[p+2] = color.b;
                fractal.colorCanvasPixels[p+3] = 255;
            }
            for (p = end; p < end2 ; p+=4) {
                fractal.colorCanvasPixels[p+0] = 0;
                fractal.colorCanvasPixels[p+1] = 0;
                fractal.colorCanvasPixels[p+2] = 0;
                fractal.colorCanvasPixels[p+3] = 255;
            }

        }
    }
    for (;p<fractal.colorCanvasPixels.length;p+=4) {
        fractal.colorCanvasPixels[p+0] = 0;
        fractal.colorCanvasPixels[p+1] = 0;
        fractal.colorCanvasPixels[p+2] = 0;
        fractal.colorCanvasPixels[p+3] = 255;
    }

    fractal.colorCanvasContext.putImageData(fractal.colorCanvasImageData, 0, 0);
    //fractal.colorCanvasContext.restore();

    //writeColorPicker('pickContainer','');
};
