// JavaScript Document

var canvasData = {
	name: 'myCanvas',
	
	
};

var fractalImage = function(canvasId,height,width) {
	this.id = canvasId,
	this.name = canvasId,
	this.height = height,
	this.width = width,
	this.dragStart = {
		x: 0.0,
		y: 0.0,
	},
	this.dragEnd = {
		x: width,
		y: height,
	}
	
	return this;
};

function startMove (evt) {
  
   var mouseX = evt.pageX;
   var mouseY = evt.pageY;
   
   xyStart["x"] = mouseX;
   xyStart["y"] = mouseY;
   var slider = evt.data.name;
   var mouseBox = evt.data.mouseBox;

   xyStart[slider] = [parseFloat($(slider).attr('x')),parseFloat($(slider).attr('y'))];
   $(mouseBox)
     .bind('mousemove',evt.data,dragMove)
     .bind('mouseup',evt.data,endMove);
}

function dragMove (evt) {
  var mouseX = evt.pageX;
  var mouseY = evt.pageY;
  
  var dx = mouseX - xyStart["x"];
  var dy = mouseY - xyStart["y"];
  var slider = evt.data.name;
  var skewX = evt.data.skewX;
  var skewY = evt.data.skewY;
  var currentX = xyStart[slider][0] + dx;
  var currentY = xyStart[slider][1] + dy;
   
  if (currentX > evt.data.displayWidth-skewX) {
    currentX = evt.data.displayWidth-skewX;
  }
  else if (currentX < evt.data.minX-skewX) {
    currentX = evt.data.minX-skewX;
  }
   
  if (currentY < evt.data.minY-skewY) {
    currentY = evt.data.minY-skewY;
  }
  else if (currentY > evt.data.maxY-skewY) {
    currentY = evt.data.maxY-skewY;
  }

  evt.data.currentX = currentX;
  evt.data.currentY = currentY;
   
  switch (evt.data.orientation) {
  case 'vertical':
    $(slider).attr('y', currentY);
     break;
  case 'horizontal':
  default:
    $(slider).attr('x', currentX);
     break;
  }
 // callback function
  for (var i = 0; i< evt.data.call.length; i++) {
    evt.data.call[i](evt);
   }
}

function endMove (evt) {
  dragMove(evt);
  $(evt.data.mouseBox)
    .unbind('mousemove')
    .unbind('mouseup');
}

//////############### SCHEDULE FUNCTION ###############///////////////

function scheduleFunction(funcRef, timeout, rescheduleOnSuccessP, passArgsP, args) {

	
	if (arguments.length > 1) {
		if (timeout <= 0 ) {
			timeout = 10; //milliseconds
		}
	}
	else {
		var timeout = 10; //ms
	}
	
	if (arguments.length < 3) {
		var rescheduleOnSuccessP = false;
	}
	
  if (arguments.length > 3) {
		if (passArgsP) {
			var funcArgs = args;
		} else {
			var funcArgs = {};
		}
	} 
	else {
    var passArgsP = false;
		var funcArgs = {};
	}
  
	var result = funcRef(args);
	
	if (rescheduleOnSuccessP && result) {
		setTimeout(scheduleFunction, timeout, 
		           funcRef, timeout, 
							 rescheduleOnSuccessP, 
							 passArgsP, args);
	}
}