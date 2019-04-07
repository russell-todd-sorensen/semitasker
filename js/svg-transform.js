// JavaScript Document

var SvgTransform = {};

SvgTransform.skewX = function(inputId) {

  var skewAngle = parseInt($('#' + inputId).val());
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).attr('transform','skewX(' + skewAngle + ')');
    //d3.select(selector).attr('transform', 'skewX(' + skewAngle + ')');
  }
  var call = "Data.saveInput('" + inputId + "','SvgTransform.skewX'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}

// hard coded inputIds
SvgTransform.matrixTransform = function (inputId) {
  var matrix = {a:1.0,b:1.0,c:1.0,d:1.0,e:0.0,f:0.0,r:1.0,s:1.0,φ:0.0,ψ:0.0};

};

SvgTransform.skewY = function(inputId) {

  var skewAngle = parseInt($('#' + inputId).val());
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).attr('transform','skewY(' + skewAngle + ')');
    //d3.select(selector).attr('transform', 'skewX(' + skewAngle + ')');
  }
  var call = "Data.saveInput('" + inputId + "','SvgTransform.skewY'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}

SvgTransform.SvgText = function(inputId) {

  var text = $('#' + inputId).val();
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).text(text);
  }
  var call = "Data.saveInput('" + inputId + "','SvgTransform.SvgText'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}

SvgTransform.changeImage = function (selectId) {
  var imageSelector = '#' + selectId + " option::selected";
  var imageUrl = $(imageSelector).val();

  var imageSelector, imageId;
  for (var i = 1; i < arguments.length; i++) {
    imageSelector = arguments[i];
    imageId = imageSelector.substring(1);
    node = document.getElementById(imageId);
    node.setAttributeNS('http://www.w3.org/1999/xlink','href',imageUrl);
  }

  var call = "Data.saveSelect('" + selectId + "','SvgTransform.changeImage'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}

SvgTransform.adjustImage = function (filterImageId, ellipseId) {
  var node;
  var xlink = 'http://www.w3.org/1999/xlink';
  node = document.getElementById(filterImageId);
  var imageSource = node.getAttributeNS(xlink,'href');

  if (this.Images[imageSource] == undefined) {
    this.Images[imageSource] = new Image();
    this.Images[imageSource].crossOrigin = 'anonymous';
    this.Images[imageSource].src = imageSource;


    this.Images[imageSource].onload = function ( ) {
      var height = Data.Images[imageSource].height;
      var width =  Data.Images[imageSource].width;
      //node.setAttribute('height', height);
      //node.setAttribute('width',width);

      node2 = document.getElementById(ellipseId);
      node2.setAttribute('rx', parseInt(width)/2);
      node2.setAttribute('ry', parseInt(height)/2);
      node2.setAttribute('cx', parseInt(width)/2);
      node2.setAttribute('cy', parseInt(height)/2);
    };
  } else {
      var height = Data.Images[imageSource].height;
      var width =  Data.Images[imageSource].width;
      //node.setAttribute('height', height);
      //node.setAttribute('width',width);

      node2 = document.getElementById(ellipseId);
      node2.setAttribute('rx', parseInt(width)/2);
      node2.setAttribute('ry', parseInt(height)/2);
      node2.setAttribute('cx', parseInt(width)/2);
      node2.setAttribute('cy', parseInt(height)/2);
  }
}

SvgTransform.adjustObjectHeightWidth = function (filterImageId) {

  var xlink = 'http://www.w3.org/1999/xlink';
  var node = document.getElementById(filterImageId);
  var imageSource = node.getAttributeNS(xlink,'href');

  if (Data.Images[imageSource] == undefined) {
    Data.Images[imageSource] = new Image();
    Data.Images[imageSource].crossOrigin = 'anonymous';
    Data.Images[imageSource].src = imageSource;
    Log.Notice("defining new image src=" + imageSource);
    var args = arguments;

    Data.Images[imageSource].onload = function ( ) {
      var height = Data.Images[imageSource].height;
      var width =  Data.Images[imageSource].width;
      var rectNode;
      Log.Notice('image function img=' + imageSource + ' height=' + height + ' width=' + width);
      for (var i = 1; i<args.length; i++) {
        rectNode = document.getElementById(args[i]);
        rectNode.setAttribute('height', height*1.2);
        rectNode.setAttribute('width', width*1.2);
      }
    };
  } else {
      var height = Data.Images[imageSource].height;
      var width =  Data.Images[imageSource].width;
      var rectNode;

      Log.Notice('image inline img=' + imageSource + ' height=' + height + ' width=' + width);
      for (var i = 1; i<arguments.length; i++) {
        rectNode = document.getElementById(arguments[i]);
        rectNode.setAttribute('height', height*1.2);
        rectNode.setAttribute('width', width*1.2);
      }
  }
}


SvgTransform.changeFilter = function (selectId) {
  var filterSelector = '#' + selectId + " option::selected";
  var filterUrl = $(filterSelector).val();

	Log.Notice("okay changeFilter to " + selectId)
  var elementSelector, elementId, node;
  for (var i = 1; i < arguments.length; i++) {
    elementSelector = arguments[i];
    elementId = elementSelector.substring(1);
    node = document.getElementById(elementId);
    node.setAttribute('filter',filterUrl);
  }

  var call = "Data.saveSelect('" + selectId + "','SvgTransform.changeFilter'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}


SvgTransform.rotate = function(inputId) {

  var rotateCx = parseInt($('#rotate-cx').val());
  var rotateCy = parseInt($('#rotate-cy').val());
  var rotateAngle = parseInt($('#rotate-angle').val());
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).attr('transform','rotate(' + rotateAngle + ',' + rotateCx + ',' + rotateCy + ')');
  }
  $('.center')
    .attr('cx', rotateCx)
    .attr('cy', rotateCy);

  var call = "Data.saveInput('" + inputId + "','SvgTransform.rotate'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}

SvgTransform.translateX = function(xInputId) {

  var charX;
  var yInputId = "";
  // get yInputId by synthesis from xInputId
  for (var i = 0; i< xInputId.length; i++) {
    charX = xInputId[i];
    if (charX == 'x') {
      yInputId += 'y';
    }
    else if (charX == 'X') {
      yInputId += 'Y';
    }
    else {
      yInputId += charX;
    }
  }

  var x = parseInt($('#' + xInputId).val());
  var y = parseInt($('#' + yInputId).val());

  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).attr('transform','translate(' + x + ',' + y + ')');
  }

  var call = "Data.saveInput('" + xInputId + "','SvgTransform.translateX'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}

SvgTransform.translateY = function(yInputId) {

  var charY;
  var xInputId = "";
  // get yInputId by synthesis from xInputId
  for (var i = 0; i< yInputId.length; i++) {
    charY = yInputId[i];
    if (charY == 'y') {
      xInputId += 'x';
    }
    else if (charY == 'Y') {
      xInputId += 'X';
    }
    else {
      xInputId += charY;
    }
  }

  var x = parseInt($('#' + xInputId).val());
  var y = parseInt($('#' + yInputId).val());

  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).attr('transform','translate(' + x + ',' + y + ')');
  }

  var call = "Data.saveInput('" + yInputId + "','SvgTransform.translateY'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}

SvgTransform.changeFill = function (selectId, graphicId, graphicAttribute) {

  var fillSelector = '#' + selectId + " option::selected";
  var fill = $(fillSelector).val();

  var selector,attribute;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i++];
    attribute = arguments[i];
    selector = selector.substring(1);
    node = document.getElementById(selector);
    //node.setAttributeNS('http://www.w3.org/1999/xlink','href',imageUrl);
    node.setAttribute(attribute,fill);
    //$(selector).attr("href",imageUrl);
  }


  var call = "Data.saveSelect('" + selectId + "','SvgTransform.changeFill'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;

}

function toggleFormInputType (evt) {
  var id = '#' + $(this).attr('for');
  Log.Notice("toggleFormInputType for id=" + id);
  var parent = $(this).parent();
  var type = $(id).attr('type');
  switch (type) {
  case 'text':
    d3.select(id).attr('type','range');
    var maximum = d3.select(id).attr('max');
    var minimum = d3.select(id).attr('min');
    d3.select(id + '::before').style('content',minimum);
    d3.select(id + '::after').style('content',maximum);
    parent.animate({'width': 250},500,'linear');
    break;
  case 'range':
    parent.animate({'width': 110},500,'linear');
    d3.select(id + '::before').style('content','');
    d3.select(id + '::after').style('content','');
    d3.select(id).attr('type','text');
    break;
  }
}


function getTranslationArray (transform) {
  var translateRegx = /translate\(((?:-)?[0-9]*(?:.)?[0-9]*),((?:-)?[0-9]*(?:.)?[0-9]*)\)/;
  var matchArray = new Array();
  matchArray = transform.match(translateRegx);

  return matchArray;
}

function getScaleArray (transform) {
  var translateRegx = /scale\(((?:-)?[0-9]*(?:.)?[0-9]*)\)/;
  var matchArray = new Array();
  matchArray = transform.match(translateRegx);

  return matchArray;
}

var currentCell = {
  id: null,
};

function enlargeCell (evt) {
  $('.cell').css('display','none');
  $('#font-form').show(200,'easeOutBack');
  var id = $(this).attr('id');
  var transform = $('#' + id).attr('transform');

  currentCell = {
    id: id,
    transform: transform
  };
  var cell = $(this);
  cell
    .attr('transform', 'scale(1.5)')
    .css('display','block');

  $(this).unbind('click').bind('click',shrinkCell);
  return false;
}

function shrinkCell (evt) {
  $('.cell').css('display','block');
  var cell = $(this);
  cell
    .attr('transform',currentCell.transform);

  $(this).unbind('click').bind('click',enlargeCell);
  return false;
}

SvgTransform.changeFillColor = function (inputId) {
  var r = document.getElementById(inputId).value;
  backgroundColor = 'rgb(' + r + ',' + r + ',' + r + ')';


  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    d3.selectAll(selector).style('fill',backgroundColor);
  }


  //saveInput(inputId, 'Data.changeBackgroundColor', '#svg');

  var call = "Data.saveInput('" + inputId + "','SvgTransform.changeFillColor'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }

  call += ");";
  setTimeout(call, 10);
  return false;
}
