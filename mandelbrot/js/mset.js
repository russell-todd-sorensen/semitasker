// Fractal Image Library

var myFractalImages = new Array();
var myFractalImageId = myFractalImages.length;
var colorCanvas;
var rectInit = new Array();
var minimumPixelImageHeight = 768;

function logStartMove(evt) {
	Log.Notice('logStartMove was called evt.offsetX=' + evt.offsetX + ' evt.offsetY=' + evt.offsetY)
}

function captureMouseUp(evt) {
	obj = evt.data;
	$('#' + obj.boxId)
		.bind('mouseup',obj,endMove);
}

function unbindMouseUp(evt) {
	obj = evt.data;
	$('#' + obj.boxId)
		.unbind('mouseup');
}

function logDragMove(evt) {
	Log.Notice('logDragMove was called evt.offsetX=' + evt.offsetX + ' evt.offsetY=' + evt.offsetY)
}

function logEndMove(evt) {
	Log.Notice('logEndMove was called evt.offsetX=' + evt.offsetX + ' evt.offsetY=' + evt.offsetY)
}

//// Initial Rectangle is different for different fractal types ////
rectInit[0] = {
	start: {
		x: -2.3,
		y: -1.5
	},
	end: {
		x: 1.7,
		y: 1.5
	}
};

rectInit[1] = {
	start: {
		x: -2.3,
		y: -2.0
	},
	end: {
		x: 1.7,
		y: 1.5
	}
};
//////////////////// THIS IS THE FRACTAL IMAGE OBJECT  /////////////////////////////////////////////

var fractalImage = function(canvasId,boxId,height,width,startUpData) {
	this.id = canvasId;
	this.boxId = boxId;
	this.name = canvasId;
	this.mouseBox = '#' + canvasId;
	this.height = height;
	this.width = width;
	this.factor = 1.25;
	this.rect = {
		start: {
			x: -2.3,
			y: -1.5
		},
		end: {
			x: 1.7,
			y: 1.5
		}
	};
	this.rectTmp = {
		start: {
			x:-1.0,
			y:-1.0
		},
		end:{
			x:1.0,
			y:1.0
		}
	};
	this.dragStart = {
		x: 0.0,
		y: 0.0,
	};
	this.dragCurrent = {
		x: width,
		y: height,
	};
	this.dragEnd = {
		x: width,
		y: height,
	};
	this.dx = 2.0;
	this.dy = 2.0;
	this.heightToWidthRatio = 1.0;
	this.calculateHeightAndWidth = function (newFactor)
	{
		if (newFactor <= 2 || newFactor >= .2) {
			this.factor = newFactor;
		}

		this.dx = this.rect.end.x - this.rect.start.x;
		this.dy = this.rect.end.y - this.rect.start.y;
		this.heightToWidthRatio = this.dy/this.dx;

		Log.Debug('heightToWidthRatio=' + this.heightToWidthRatio);

		if (this.heightToWidthRatio >=1 )
		{
			this.width = 500*this.factor;
		} else {
			this.width = 1000*this.factor;
		}

		this.height = Math.round(this.width * this.heightToWidthRatio);
		this.width = Math.round(this.width);

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
	this.pixelImageHeight = 768 * 1.0;//this.factor;
	this.pixelImageWidth = 150 * 1.0;//this.factor;
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
		var rowArray;
		var counterLast = null;
		var counter,value;
		var counterIndexStart;
		this.rowPolygons = new Array();

		for (var row = 0;row<this.height;row++)
		{
			rowArray = new Array();
			counterIndexStart = 4*row*this.width;

			for (var col = 0;col<this.width;col++)
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
		var objectInfo = {};
		var fractalTypeId = data.fractalTypeId;
		if ( initialRect ) {
			this.rect.start.x = rectInit[fractalTypeId].start.x*1;
			this.rect.start.y = rectInit[fractalTypeId].start.y*1;
			this.rect.end.x   = rectInit[fractalTypeId].end.x*1;
			this.rect.end.y   = rectInit[fractalTypeId].end.y*1;
		}

		objectInfo.startX = this.rect.start.x*1;
		objectInfo.startY = this.rect.start.y*1;
		objectInfo.endX = this.rect.end.x*1;
		objectInfo.endY = this.rect.end.y*1;
		objectInfo.height = this.height*1;
		objectInfo.width = this.width*1;

		this.finiteMeasure = objectInfo.finiteMeasure = data.finiteMeasure*1;
		this.finiteMeasureFunction = objectInfo.finiteMeasureFunction = data.finiteMeasureFunction*1;
		this.counterMax = objectInfo.counterMax = data.counterMax*1;
		data.objectInfo = objectInfo;
		this.worker.postMessage(data);
	};

	this.drawImage = function (data) {

		this.canvas = document.getElementById(this.id);
		this.canvas.setAttribute('height',this.height);
		this.canvas.setAttribute('width',this.width);

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
	this.worker = new Worker('js/mset-web-worker-code-generalized.js');
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

	this.calculateHeightAndWidth(this.factor);
	this.callStartMove = [logStartMove,captureMouseUp,setupRect];
	this.callDragMove  = [drawBox, logDragMove];
	this.callEndMove   = [logEndMove,unbindMouseUp,calculateRect];
	return this;
};

var CurrentData;
var drawImageFromWorker = function (evt) {
	var data = evt.data;
	CurrentData = data;
	var objId = data.objId;
	var fractal = myFractalImages[objId];
	fractal.counters = data.counters;
	fractal.polarity = data.polarity;
	fractal.drawImage(data);
};

var profileCounters = function (counters) {
	var length = counters.length;
	var maximum = 0;
	var minimum = 1024;
	var counts = new Array();
	var count;

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
	var obj = evt.data;
	obj.target = evt.target;
	obj.height = evt.currentTarget.height;
	obj.width  = evt.currentTarget.width;
	obj.offsetLeft = evt.clientX - evt.offsetX;
	obj.offsetTop  = evt.clientY - evt.offsetY;

};

var drawBox = function(evt) {
	var obj = evt.data;

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

	var msg = 'drawBox top=' + (obj.minY-obj.offsetTop)
			+ ' left = ' + (obj.minX-obj.offsetLeft)
			+ ' height=' + (obj.maxY-obj.minY)
			+ ' width=' + (obj.maxX-obj.minX);

	Log.Warning(msg);

	$('#' + obj.boxId).css({
		top:obj.minY-obj.offsetTop,
		left:obj.minX-obj.offsetLeft,
		height:obj.maxY-obj.minY,
		width:obj.maxX-obj.minX}
	);

	Log.Debug('drawBox finished');
};

var calculateRect = function (evt)  {

	var obj = evt.data;
	var dxCurrent = obj.rect.end.x - obj.rect.start.x;
	var dyCurrent = obj.rect.end.y - obj.rect.start.y;
	var heightToWidthRatio = dyCurrent/dxCurrent;
	var height = obj.height*1.0;
	var width =  obj.width*1.0;

	var dxNew = (obj.maxX-obj.minX)/width*dxCurrent;
	var dyNew = (obj.maxY-obj.minY)/height*dyCurrent;

	var rectMinX = obj.rect.start.x
		+ (obj.minX-obj.offsetLeft)*(obj.rect.end.x-obj.rect.start.x)/width;

	var rectMinY = (obj.rect.start.y
		+ (height-(obj.maxY-obj.offsetTop))*(obj.rect.end.y-obj.rect.start.y)/height) ;
	var rectMaxX = obj.rect.end.x
		- (width-(obj.maxX-obj.offsetLeft))*(obj.rect.end.x-obj.rect.start.x)/width;
	var rectMaxY = obj.rect.end.y
		- (obj.minY-obj.offsetTop)*(obj.rect.end.y-obj.rect.start.y)/height;

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


var FormGlobal;

var processForm = function () {
	var colorOffsetAmount=parseInt($('#colorOffsetAmount').val());
	var fractalImageId=parseInt($('#fractalImageId').val());
	var fractalTypeId=parseInt($('#fractalTypeId').val());
	var pixelJump=parseInt($('#pixelJump').val());
	var pixelColorsId=parseInt($('#pixelColorsId').val());
	var refColorId=parseInt($('#refColorId').val());
	var scaleCounterId=parseInt($('#scaleCounterId').val());
	var hueFactor = parseFloat($('#hueFactor').val());
	var rampFactor = parseInt($('#rampFactor').val());
	var minLevel = parseFloat($('#minLevel').val());
	var maxLevel = parseFloat($('#maxLevel').val());
	var minSat = parseFloat($('#minSat').val());
	var maxSat = parseFloat($('#maxSat').val());
	var minBrt = parseFloat($('#minBrt').val());
	var maxBrt = parseFloat($('#maxBrt').val());
	var minInt = parseFloat($('#minInt').val());
	var maxInt = parseFloat($('#maxInt').val());
	var finiteMeasure = parseFloat($('#finiteMeasure').val());
	var finiteMeasureFunction = parseInt($('#finiteMeasureFunction option:selected').val());
	var counterMax = parseInt($('#counterMax').val());
	var id = parseInt($('#animationFunctionId option:selected').val());

	FormGlobal = {
		id:id,
		timeout:parseInt($('#timeout').val()),
		data:{
			objId:fractalImageId,
			fractalTypeId:fractalTypeId,
			animationFunctionId:id,
			amount:colorOffsetAmount,
			pixelJump:pixelJump,
			pixelColorsId:pixelColorsId,
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
			hslOrHsb:$('#hslOrHsb option:selected').val()
		}
	};

	return FormGlobal;
};

var startAnimationPre = function() {
	var formData = processForm(formData);
	startAnimation(formData.id,formData.timeout,formData.data);
};

var drawImagePre = function(redrawId,drawId) {

	var formData = processForm(formData);
	$('#' + redrawId).css({display:'inline-block'});
	$('#' + drawId).css({display:'none'});
	myFractalImages[formData.data.objId].calculateCounters(formData.data, true);

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
	var newFactor = fractal.factor;
	fractal.rect.start.x = fractal.rectTmp.start.x;
	fractal.rect.start.y = fractal.rectTmp.start.y;
	fractal.rect.end.x = fractal.rectTmp.end.x;
	fractal.rect.end.y = fractal.rectTmp.end.y;
	fractal.calculateHeightAndWidth(newFactor);
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
/*	});

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
