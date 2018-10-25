var myPhotos = new Array();
var myPhotoId = myPhotos.length;

var photo = function (canvasId, boxId, height, width, startUpData) {
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

    this.scale = 5;
    this.pixelImageHeight = 768 * 1.0;//this.factor;
    this.pixelImageWidth = 150 * 1.0;//this.factor;


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

		this.context.putImageData(this.imageData, 0, 0);
	};


	if (arguments.length == 5)
	{
		for (var prop in startUpData)
		{
			this[prop] = startUpData[prop];
		}
	}

    this.callStartMove = [captureMouseUp,setupRect];
	this.callDragMove  = [drawBox];
	this.callEndMove   = [unbindMouseUp,calculateRect];

	return this;
}

var setupRect = function(evt) {
	var obj = evt.data;
	obj.target = evt.target;
	obj.height = evt.currentTarget.height;
	obj.width  = evt.currentTarget.width;
	obj.offsetLeft = evt.clientX - evt.offsetX;
	obj.offsetTop  = evt.clientY - evt.offsetY;

};

var calculateMinMaxXY = function(evt) {
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
}

var drawBox = function(evt) {
	var obj = evt.data;
    calculateMinMaxXY(evt);
if (false) {
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

var resetBox = function(evt) {
	obj = evt.data;

	$('#' + obj.boxId).css({
		top:obj.offsetTop,
		left:obj.offsetLeft,
		height:0,
		width:0}
	);
};

var calculateRect = function (evt)  {

	var obj = evt.data;
	var dxCurrent = obj.rect.end.x - obj.rect.start.x;
	var dyCurrent = obj.rect.end.y - obj.rect.start.y;

    Log.Debug('calculateRect dxCurrent ="' + dxCurrent + '" dyCurrent="' + dyCurrent + '"');

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
};

var FormGlobal;

var processForm = function () {
	var photoId=parseInt($('#photoId').val());
    var photoSrc = $('#photoSrc').val();
	FormGlobal = {
		data:{
			objId:photoId,
            photoSrc:photoSrc,
		}
	};

	return FormGlobal;
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
	//var thisPhoto = myPhotos[objId];
	imageData = fractal.canvas.toDataURL(type,1.0);
	captureHandle = setInterval('resolve()', 1000);

};

var photoObject;

var loadPhoto = function () {
    var formData = processForm();
    var data = formData.data;
    var objId = data.objId;
    var myPhotoObject = myPhotos[objId];
    var photoUrl = data.photoSrc;

    photoObject = new Image();
    photoObject.src = photoUrl;
    photoObject.onload = function () {
        myPhotoObject.height = photoObject.height;
        myPhotoObject.width = photoObject.width;
        myPhotoObject.drawImage(data);
        myPhotoObject.context.drawImage(photoObject, 0, 0);
    }
}

var cropPhoto = function () {
	var formData = processForm();
	var data = formData.data;
	var objId = data.objId;
	var obj = myPhotos[objId];
	var photoUrl = data.photoSrc;

    var dummy = new Object();
    dummy.data = obj
    calculateMinMaxXY(dummy);

    if (false) {
	var start = obj.dragStart;
	var end   = obj.dragEnd;

	var newWidth  = end.x-start.x;
	var newHeight = end.y-start.y;

	var cropData = obj.context.getImageData(
		start.x,start.y,newWidth,newHeight
	);
}
    var cropData = obj.context.getImageData(
        obj.minX-obj.offsetLeft,
        obj.minY-obj.offsetTop,
        obj.maxX-obj.minX,
        obj.maxY-obj.minY
    )
	$('#' + obj.boxId).css({
		top:obj.offsetTop,
		left:obj.offsetLeft,
		height:0,
		width:0}
	);



	obj.context.putImageData(cropData,0,0);
	//obj.canvas.width = newWidth;
	//obj.canvas.height = newHeight;
}


var modifyPhoto = function () {
    var formData = processForm();
    var data = formData.data;
    var objId = data.objId;
    var myPhotoObject = myPhotos[objId];
    var photoUrl = data.photoSrc;
}
