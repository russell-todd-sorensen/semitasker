// JavaScript Document

///////////// EXAMPLE USEAGE /////////////////////
//  myFractalImage = new fractalImage('myCanvas','box',500,1000);
//  ^-----Bind Object to startMove------------ -v
//  $(myFractalImage.mouseBox).bind('mousedown',myFractalImage,startMove);
//
// OBJECT USES CALLBACK FUNCTION ARRAYS:
//
//var fractalImage = function(canvasId,boxId,height,width) {
//  this.id = canvasId;
//  this.boxId = boxId;
//  this.name = canvasId;
//  this.mouseBox = '#' + canvasId;
//  this.height = height;
//  this.width = width;
//  this.dragStart = {
//    x: 0.0,
//    y: 0.0,
//  };
//  this.dragCurrent = {
//    x: width,
//    y: height,
//  };
//  this.dragEnd = {
//    x: width,
//    y: height,
//  };
//  this.callStartMove = [logStartMove,captureMouseUp,setupRect];
//  this.callDragMove = [drawBox, logDragMove];
//  this.callEndMove = [logEndMove,unbindMouseUp,calculateRect];
//  return this;
//};
//
// log callbacks are not required, but captureMouseUp and unbindMouseUp
// are required. After drawing of the box starts, the pointer is over
// the new box, so captureMouseUp binds the mouseUp event to the new box.
//
// setupRect and calculateRect are user defined functions. You can replace
// them with anything requried for your application.
//
/////////////////// END EXAMPLE ///////////////////////////////////////////

function startMove(evt) {

  var obj =  evt.data;
  obj.dragStart.x = evt.clientX;
  obj.dragStart.y = evt.clientY;

  $(obj.mouseBox)
    .bind('mousemove',obj,dragMove)
    .bind('mouseup',obj,endMove);

  for (var i = 0; i< obj.callStartMove.length; i++) {
    obj.callStartMove[i](evt);
  }
}

function dragMove(evt) {

  var obj =  evt.data;
  obj.dragCurrent.x = evt.clientX;
  obj.dragCurrent.y = evt.clientY;

  for (var i = 0; i< obj.callDragMove.length; i++) {
    obj.callDragMove[i](evt);
  }
}

function endMove(evt) {

  var obj = evt.data;
  obj.dragEnd.x = evt.clientX;
  obj.dragEnd.y = evt.clientY;

  $(obj.mouseBox)
    .unbind('mousemove')
    .unbind('mouseup');

  dragMove(evt);

  for (var i = 0; i< obj.callEndMove.length; i++) {
    obj.callEndMove[i](evt);
  }
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

// optional functions

function logStartMove(evt) {
	Log.Notice('logStartMove was called evt.offsetX=' + evt.offsetX + ' evt.offsetY=' + evt.offsetY)
}

function logDragMove(evt) {
	Log.Notice('logDragMove was called evt.offsetX=' + evt.offsetX + ' evt.offsetY=' + evt.offsetY)
}

function logEndMove(evt) {
	Log.Notice('logEndMove was called evt.offsetX=' + evt.offsetX + ' evt.offsetY=' + evt.offsetY)
}
