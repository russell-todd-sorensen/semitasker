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

/////////////////// END EXAMPLE ///////////////////////////////////////////

function startMove(evt) {

  var obj =  evt.data;
  obj.dragStart.x = evt.clientX;
  obj.dragStart.y = evt.clientY;

  $(obj.mouseBox)
    .bind('mousemove',obj,dragMove)
    .bind('mouseup',obj,endMove);

  for (var i = 0; i< evt.data.callStartMove.length; i++) {
    evt.data.callStartMove[i](evt);
  }
}

function dragMove(evt) {

  var obj =  evt.data;
  obj.dragCurrent.x = evt.clientX;
  obj.dragCurrent.y = evt.clientY; 
 
  for (var i = 0; i< evt.data.callDragMove.length; i++) {
    evt.data.callDragMove[i](evt);
  }
}

function endMove(evt) {
  
  $(evt.data.mouseBox)
    .unbind('mousemove')
    .unbind('mouseup');
  dragMove(evt);
  for (var i = 0; i< evt.data.callEndMove.length; i++) {
    evt.data.callEndMove[i](evt);
  }
}

