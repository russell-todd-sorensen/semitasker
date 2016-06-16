// Color-Mixer App

var xyStart = new Object();
var swatches = new Array();
var swatches = new Array();
var sliders = new Array();

var appCounters = new Object();
appCounters.appIndex = 0;
appCounters.swatchIndex = 0;
appCounters.gradientIndex = 0;
appCounters.sliderIndex = 0;

var linearGradientAttrs = {
  "gradientUnits": "objectBoundingBox",
  "color-interpolation": "sRGB"
}

var sliderInfo = {
  href: "#triangle-2",
  sliderId: function(sliderIndex) {
    return "slider-" + sliderIndex;
  },
  minX: 0,
  maxX: 255,
  fill: "#000",
  stroke: "#eee",
  strokeWidth: 1,
  sliderHeight: 10,
  sliderWidth: 10,
  sliderSpacing: 30,
  x: function () {
    return Math.ceil(this.maxX/2 - this.sliderWidth/2);
  },
  y: function (index) {
    return Math.ceil(sliderInfo.sliderStartY + sliderInfo.sliderHeight/2 + sliderInfo.sliderSpacing * index);
  },
  appTop: 40,
  sliderStartY: 20,
  swatchSpacing: 10,
};

var swatchRectAttrs = {
  x:0,
  y: -1 * sliderInfo.maxX,
  height:sliderInfo.maxX,
  width:sliderInfo.maxX,
  fill:'#808080',
  stroke:"none",
  strokeWidth: 0
};

var sliderRectAttrs = {
  x: 0,
  height: sliderInfo.sliderHeight,
  width: sliderInfo.maxX,
  fill: "url(#gradient-0)",
  stroke: "none"
};



var sliderHandleAttrs = {
  "x": sliderInfo.x(0),
  "y": sliderInfo.y(0),
  "minX": sliderInfo.minX,
  "maxX": sliderInfo.maxX,
  "xlink:href": sliderInfo.href,
  "fill": sliderInfo.fill,
  "stroke": sliderInfo.stroke,
  "stroke-width": sliderInfo.strokeWidth
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
	
	Log.Notice('dec=' + rgbValue + ' hex=' 
		+ hexValue + ' backToDec =' + toDecimal(hexValue));
	
	for (var i = 0; i< evt.data.callParent.length; i++) {
   	evt.data.callParent[i](evt);
	}
}


function swatchUpdate(evt) {
	var swatch = evt.data.swatch;
	var rgbValue = evt.data.hexValue;
	Log.Notice('swatchUpdate rgbValue for ' + evt.data.name 
		+ ' = ' + rgbValue + ' fullcolor =' + swatch.color());
	swatch[evt.data.component] = evt.data.hexValue;
	$(swatch.name).attr('fill', swatch.color());
	swatch.updateGradients();
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
			$(gradientStopSelector).attr('stop-color', this.stopColor(sliderStop.offset,currentSlider.component) + "%");
			}
		}
	};
	return this;
}

var Slider = function (sliderIndex, swatch, component) {
	//this.slider = generateSliderName(sliderIndex);
	this.name = generateSliderName(sliderIndex);
	this.swatch = swatch; // reference to swatch 
	this.stops = [{id: sliderIndex, offset: 0}, {id:sliderIndex, offset: 100}];
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

function writeSvg(appSelector) {
  var appId = appCounters.appIndex++;
  var app = d3.select(appSelector);
  var x = 0;
  var y = 0
  var width = (sliderInfo.maxX + 20 ) * 5;
  var height = sliderInfo.appTop + sliderInfo.maxX + sliderInfo.sliderSpacing * 3 + 30;
  var svg = app
        .append("svg")
        .attr("id", "swatch-app-" + appId)
        .attr({
          x: 0,
          y: 0,
          width: width,
          height: height,
          viewBox: "" + x + " " + y + " " + width + " " + height,
        });
    //    .attr("xmlns:xlink", "http://www.w3.org/1999/xlink");
 // var svgElement = document.getElementById("swatch-app-" + appId);
  
  var defs = svg
        .append("defs")
        .attr("id", "defs-" + appId);
  // make swatch area
  defs
        .append("path")
        //.attr({id: "triangle-2",d:"M 5 5 L 10 10 L 0 10 Z"});
        .attr({id: "triangle-2",d:"M 5 0 L 10 10 L 0 10 Z"});

  for (var i = 0; i<swatches.length; i++) {
    var swatchGroupSliders = [];
    var swatch = swatches[i];
    var swatchIndex = appCounters.swatchIndex++;
    var swatchGroup = svg
        .append("g")
        .attr({
            id: "color-" + swatchIndex,
            transform: "translate(" 
            + parseFloat(10 + (sliderInfo.maxX + sliderInfo.swatchSpacing) * swatchIndex) 
						+ "," 
            + parseInt(sliderInfo.maxX + sliderInfo.appTop) +")",
            class: "pointer"
        });
    swatchGroup
        .append("rect")
        .attr("id", swatch.name.substring(1))
        .attr(swatchRectAttrs);
        
    var sliderArray = [];
    var componentIndex = 0;
    for (var component in swatch.components) {
      var sliderIndex = sliders.length;
      sliderArray[sliderArray.length] = sliderIndex;
      sliders[sliderIndex] = new Slider(sliderIndex, swatch, swatch.components[component]);
      var slider = sliders[sliderIndex];
      var gradientName = generateGradientName();
      var gradientId = getGradientId(gradientName);
      var gradient = defs
        .append("linearGradient")
        .attr({id: gradientId})
        .attr(linearGradientAttrs);
        
      for (var j = 0; j < slider.stops.length; j++) {
        var stop = slider.stops[j];
        var stopName = generateStopName(stop);
        gradient
          .append("stop")
          .attr("offset", stop.offset)
          .attr("stop-opacity", "1.0")
          .attr("id", getStopId(stopName))
          .attr("stop-color",swatch.stopColor(stop.offset,swatch.components[component]));
        
      }
      swatchGroup
        .append("rect")
        .attr(sliderRectAttrs)
        .attr({
            "id": "r-" + sliderIndex,
            "width": slider.maxX,
            "height": 5,  // hard coded value !!!!!!
            "y": parseInt(sliderInfo.sliderStartY
							+ sliderInfo.sliderSpacing * componentIndex),
            "fill": "url(" + gradientName + ")"
        });
      var index = componentIndex;
      swatchGroup
        .append("use")
        .attr(sliderHandleAttrs)
        .attr("y", sliderInfo.y(index))
        .attr("id", getSliderId(slider.name))
        ;

      $(slider.name)
        .bind('mousedown', sliders[sliderIndex], startMove);

      componentIndex++;
    }
    if (false) {
      app
        .append("input")
        .attr("id", "swatch-color-" + swatchIndex)
        .attr("name", "swatch-color-" + swatchIndex)
        .attr("size",3)
        .attr("onChange", "newColor(" + swatchIndex + ")")
        .style("position", "absolute")
        .style("top", "" + parseInt(parseInt(svg.attr("height")) + 20) + "px")
        .style("left", ""
           +  parseFloat(10 + sliderInfo.maxX/3 
					 + (sliderInfo.maxX + sliderInfo.swatchSpacing) * swatchIndex) + "px")
    }
    swatch.sliders = sliderArray;
  } // end iteration over swatches array
  
}


function getFullStopSelector (gradientStop) {
	return "#lg-" + gradientStop.id + "-" + gradientStop.offset;
}

function generateSwatchName(swatchIndex) {
	if (swatchIndex == undefined) {
		swatchIndex = appCounters.swatchIndex++;
	}
	return "#swatch-" + swatchIndex;
}

function getSwatchId(swatchName) {
	return swatchName.substring(1);
}

function generateSliderName(sliderIndex) {
	return '#slider-' + sliderIndex;
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