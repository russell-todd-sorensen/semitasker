// JavaScript Document


var canvasData = {
	name: 'myCanvas',
};

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

var drawBox;

var fractalImage = function(canvasId,boxId,height,width) {
	this.id = canvasId;
	this.boxId = boxId;
	this.name = canvasId;
	this.mouseBox = '#' + canvasId;
	this.height = height;
	this.width = width;
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
	this.callStartMove = [logStartMove,captureMouseUp,setupRect];
	this.callDragMove = [drawBox, logDragMove];
	this.callEndMove = [logEndMove,unbindMouseUp,calculateRect];
	this.rect = {
		start: {
			x: -2.0,
			y: -1.5
		},
		end: {
			x: 2.0,
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

	return this;
};

var setupRect = function(evt) {
	var obj = evt.data;
	obj.target = evt.target;
	obj.height = evt.currentTarget.height;
	obj.width = evt.currentTarget.width;
	obj.offsetLeft = evt.pageX - evt.offsetX;
	obj.offsetTop = evt.pageY - evt.offsetY;

}

var drawBox = function(evt) {
	var obj = evt.data;
	
	if (obj.dragCurrent.y-obj.dragStart.y > 0) {
		obj.minY = obj.dragStart.y;
		obj.maxY = obj.dragCurrent.y;
	} else {
		obj.minY = obj.dragCurrent.y;
		obj.maxY = obj.dragStart.y;
	}
	
	if (obj.dragCurrent.x-obj.dragStart.x > 0) {
		obj.minX = obj.dragStart.x;
		obj.maxX = obj.dragCurrent.x;
	} else {
		obj.minX = obj.dragCurrent.x;
		obj.maxX = obj.dragStart.x;
	}
	var msg = 'drawBox top=' + (obj.minY-obj.offsetTop) + ' left = ' + (obj.minX-obj.offsetLeft) + ' height=' + (obj.maxY-obj.minY) + ' width=' + (obj.maxX-obj.minX);
	Log.Warning(msg);
	
	$('#' + obj.boxId).css({
		top:obj.minY-obj.offsetTop,
		left:obj.minX-obj.offsetLeft,
		height:obj.maxY-obj.minY,
		width:obj.maxX-obj.minX});
		
	Log.Debug('drawBox finished');
}

var calculateRect = function (evt)  {
	
	var obj = evt.data;
	var dxCurrent = rect.end.x - rect.start.x;
	var dyCurrent = rect.end.y - rect.start.y;
	var heightToWidthRatio = dyCurrent/dxCurrent;
	var height = obj.height*1.0;
	var width =  obj.width*1.0;
	
	var dxNew = (obj.maxX-obj.minX)/width*dxCurrent;
	var dyNew = (obj.maxY-obj.minY)/height*dyCurrent;
	
	var rectMinX = rect.start.x + (obj.minX-obj.offsetLeft)*(rect.end.x-rect.start.x)/width;
	//var rectMinY = -(rect.start.y - ((obj.minY-obj.offsetTop)-height)*(rect.end.y-rect.start.y)/height) ;
	var rectMinY = (rect.start.y + (height-(obj.maxY-obj.offsetTop))*(rect.end.y-rect.start.y)/height) ;
	var rectMaxX = rect.end.x - (width-obj.maxX-obj.offsetLeft)*(rect.end.x-rect.start.x)/width;
	var rectMaxY = rect.end.y - (obj.minY-obj.offsetTop)*(rect.end.y-rect.start.y)/height;
	Log.Debug('calculateRect \nwidth=' + width + '\nheight=' + height + '\nminX =' + obj.minX 
	  + '\nminY=' + obj.minY + '\nmaxX=' + obj.maxX + '\nmaxY=' + obj.maxY 
	  +  '\nrectMinX=' + rectMinX + '\nrectMinY=' + rectMinY + '\nrectMaxX=' + rectMaxX + '\nrectMaxY=' + rectMaxY);
	Log.Debug('calculateRect dxNew=' + dxNew + ' dyNew=' + dyNew);
	
	//var rectTmp = obj.rectTmp;
	
	rectTmp.start.x = rectMinX;
	rectTmp.start.y = rectMinY;
	rectTmp.end.x = rectMaxX;
	rectTmp.end.y = rectMaxY;
}


