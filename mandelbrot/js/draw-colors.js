drawColors = function (data) {

    var objId = data.objId;
    var fractal = myFractalImages[objId];
    var height = fractal.pixelImageHeight;
    var width = fractal.pixelImageWidth;
	var profile = fractal.profile;
    var p;
	var pixelsPerColor = Math.round(height*width/(fractal.counterMax+1));
	var pixelRowsPerColor =  Math.round(height/(fractal.counterMax+1));

    if (pixelRowsPerColor == 0) {
        pixelRowsPerColor = 1;
        height = fractal.counterMax+1;
        fractal.pixelImageHeight = height;
        fractal.colorCanvasImageData = fractal.colorCanvasContext.createImageData(
            fractal.pixelImageHeight,fractal.pixelImageWidth
        );
        fractal.colorCanvasPixels = fractal.colorCanvasImageData.data;

        for (var i=0, n=fractal.colorCanvasPixels.length; i<n; i++)
        {
            fractal.colorCanvasPixels[i] = 255;
        }
    }

	var colorCanvasPixels = fractal.colorCanvasPixels;

	for (var i = 0; i<fractal.counterMax+1;i++) {
		var color = fractal.colors[i];



		for (var r = 0; r<pixelRowsPerColor;r++) {
			var start = i*width*pixelRowsPerColor*4 + r*width*4;
			var end = start + 50*4 + profile.percents[i]*4;
			var end2 = start + width*4;
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

    writeColorPicker('pickContainer','');
};
