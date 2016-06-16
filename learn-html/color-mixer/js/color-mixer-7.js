// Color-Mixer App

var xyStart = new Object();
var swatches = new Array();
var swatches = new Array();
var sliders = new Array();

var appCounters = new Object();
appCounters.appIndex = 0;
appCounters.swatchIndex = 0;
appCounters.gradientIndex = 0;

function startMove (evt) {
  
	 var mouseX = evt.pageX;
	 var mouseY = evt.pageY;
	 
	 xyStart["x"] = mouseX;
	 xyStart["y"] = mouseY;
	 var slider = evt.data.name;
	 var mouseBox = evt.data.mouseBox;
	 
	 /* consider changing to startX, startY with lastX/Y over/under
	    to suppress changes.
	 
	 xyStart[slider] = {
  startX: 100,
  startY: 200,
  lastX: 150,
  lastY: 200,
  overX: false,
  underX: false,
  overY: true,
  underY: true
	 }
	 */
	 xyStart[slider] = [parseFloat($(slider).attr('x')),parseFloat($(slider).attr('y'))];
	 $(mouseBox)
	 	.bind('mousemove',evt.data,moveSlider)
	 	.bind('mouseup',evt.data,endMoveSlider);
}

function moveSlider (evt) {
  var mouseX = evt.pageX;
  var mouseY = evt.pageY;
	
  var dx = mouseX - xyStart["x"];
  var dy = mouseY - xyStart["y"];
  var slider = evt.data.name;
	var skewX = evt.data.skewX;
	var skewY = evt.data.skewY;
	var currentX = xyStart[slider][0] + dx;
	var currentY = xyStart[slider][1] + dy;
	 
	 
	if (currentX > evt.data.maxX-skewX) {
  	currentX = evt.data.maxX-skewX;
	}
	else if (currentX < evt.data.minX-skewX) {
  	currentX = evt.data.minX-skewY;
	}
	 
	if (currentY > evt.data.maxY-skewY) {
  	currentY = evt.data.maxY-skewY;
	}
	else if (currentY < evt.data.minY-skewY) {
  	currentY = evt.data.minY-skewY;
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

function endMoveSlider (evt) {
	moveSlider(evt);
	$(evt.data.mouseBox)
		.unbind('mousemove')
		.unbind('mouseup');
}

function registerSliderMove (evt) {
	Log.Notice('new value=' + parseFloat(evt.data.currentX+evt.data.skewX));
}

function toHex(decimalNumber) {
	hexChars = "0123456789ABCDEF";
	if (decimalNumber > 255)
  return "??";
 
	var i = decimalNumber %16;
	var j = (decimalNumber - i)/16;
  return hexChars.charAt(j) + hexChars.charAt(i);
}

function toDecimal(hexNumber) {
	hexChars = "0123456789ABCDEF";
	var decimalNumber = 0;
	var hexCharValue;
	var exponent = 0;
	for (var i = hexNumber.length-1; i>= 0; i--) {
  	hexCharValue = hexChars.indexOf(hexNumber[i]);
  	decimalNumber = decimalNumber + hexCharValue * Math.pow(16, exponent++);
	}
  return decimalNumber;
}

function colorChange(evt) {
	
	// calculate new color  
	switch (evt.data.orientation) {
	case 'vertical':
		alert("colorChange: vertical not implemented!");
		return;
 	  break;
	case 'horizontal':
	default:
		var baseValue = evt.data.currentX+evt.data.skewX
 		var normValue = baseValue/(evt.data.maxX - evt.data.minX);
 		var rgbValue = Math.round(255 * normValue);
 		var hexValue = toHex(rgbValue);
		break;
	}
	
	evt.data.hexValue = hexValue;
	//evt.data.color = hexValue;
	
	Log.Notice('dec=' + rgbValue + ' hex=' + hexValue + ' backToDec =' + toDecimal(hexValue));
	
	for (var i = 0; i< evt.data.callParent.length; i++) {
   	evt.data.callParent[i](evt);
	}
}


function swatchUpdate(evt) {
	var swatch = evt.data.swatch;
	var rgbValue = evt.data.hexValue;
	Log.Notice('swatchUpdate rgbValue for ' + evt.data.name + ' = ' + rgbValue + ' fullcolor =' + swatch.color());
	swatch[evt.data.component] = evt.data.hexValue;
	$(swatch.name).attr('fill', swatch.color());
	swatch.updateGradients();
}

function getFullStopSelector (gradientStop) {
	return "#lg-" + gradientStop.id + "-" + gradientStop.offset;
}


var Swatch = function (name) {
	this.name = name;
	this.components = ['r', 'g', 'b'];
	this.r = '80';
	this.g = '80';
	this.b = '80';
	this.a = 1.0;
	this.sliders = [0,1,2];
	this.color = function () {
		return "#" + this.r + this.g + this.b;
	},
	this.stopColor = function (stopPercent, component) {

		var newVal = toHex(Math.round(stopPercent * 2.55));
		
		r = this.r;
		g = this.g;
		b = this.b;
		a = this.a;
		
		switch (component) {
		case 'r':
			r = newVal;
			break;
		case 'g':
			g = newVal;
			break;
		case 'b':
			b = newVal;
			break;
		}	
		return "#" + r + g + b;
	};
	this.updateGradients = function () {
		var currentSlider, sliderStop, gradientStopSelector;
		for (var i = 0; i < this.sliders.length; i++) {
			currentSlider = sliders[this.sliders[i]];
			for (var j = 0; j< currentSlider.stops.length; j++) {
				sliderStop = currentSlider.stops[j];
				gradientStopSelector = getFullStopSelector(sliderStop);
			$(gradientStopSelector).attr('stop-color', this.stopColor(sliderStop.offset,currentSlider.component));
			}
		}
	};
	return this;
}

var Slider = function (sliderId, swatch, component) {
	//this.slider = generateSliderName(sliderId);
	this.name = generateSliderName(sliderId);
	this.swatch = swatch; // reference to swatch 
	this.stops = [{id: sliderId, offset: 0}, {id:sliderId, offset: 100}];
	this.mouseBox ='body';
	this.minX = 0;
	this.maxX = sliderInfo.maxX;
	this.skewX = sliderInfo.sliderWidth/2;
	this.minY = 0;
	this.maxY = sliderInfo.maxX;
	this.skewY = sliderInfo.sliderHeight/2;
	this.orientation = 'horizontal';
	this.component =  component;
	this.hexValue = '80';
	this.call = [registerSliderMove,colorChange];
	this.callParent =  [swatchUpdate];
	return this;
}



function generateSliderName(sliderId) {
	return '#slider-' + sliderId;
}
function getSliderId(sliderName) {
	return sliderName.substring(1);
}
function generateGradientName() {
	return "#gradient-" + appCounters.gradientIndex++;
}
function getGradientId(gradientName) {
	return gradientName.substring(1);
}

function generateStopName(stop) {
	return "#lg-" + stop.id + "-" + stop.offset;
}

function getStopId(stopName) {
	return stopName.substring(1);
}