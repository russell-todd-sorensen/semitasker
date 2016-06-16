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
	displayWidth: 255,
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

function hslRegisterSliderMove (evt) {
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

function hslColorChange(evt) {
	
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
 		var value = Math.round(evt.data.maxX * normValue);
 		var hexValue = toHex(value);
		break;
	}
	
	//evt.data.hexValue = hexValue;
	evt.data.value = value;
	//evt.data.color = hexValue;
	
	Log.Notice("hsl value ="+ value);
	
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

function hslSwatchUpdate(evt) {
	var swatch = evt.data.swatch;
	var value = evt.data.value;
	Log.Notice('hslSwatchUpdate value for ' + evt.data.name 
		+ ' = ' + value + ' fullcolor =' + swatch.hslColor());
	swatch[evt.data.component] = value;
	$(swatch.name).attr('fill', swatch.hslColor());
	swatch.hslUpdateGradients();
}

var Swatch = function (name) {
	this.name = name;
	this.components = ['r', 'g', 'b'];
	this.hslComponents = ['h', 's', 'l'];
	this.r = '80';
	this.g = '80';
	this.b = '80';
	this.a = 1.0;
	this.h = '180';
	this.s = '0';
	this.l = '50';
	
	this.sliders = [0,1,2];
	this.hslSliders = [3,4,5];
	this.color = function () {
		return "#" + this.r + this.g + this.b;
	};
	this.hslColor = function () {
		return "hsl(" + this.h + "," + this.s + "%," + this.l + "%)";
	};
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
	this.hslStopColor = function (stopPercent, component) {

		//var newVal = toHex(Math.round(stopPercent * 2.55));
		
		h = this.h;
		s = this.s;
		l = this.l;
		
		switch (component) {
		case 'h':
			h = Math.round(stopPercent*3.6);
			break;
		case 's':
			s = stopPercent;
			break;
		case 'l':
			l = stopPercent;
			break;
		}	
		return "hsl(" + h + "," + s + "%," + l + "%)";
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
	this.hslUpdateGradients = function () {
		var currentSlider, sliderStop, gradientStopSelector;
		for (var i = 0; i < this.hslSliders.length; i++) {
			currentSlider = sliders[this.hslSliders[i]];
			for (var j = 0; j< currentSlider.stops.length; j++) {
				sliderStop = currentSlider.stops[j];
				gradientStopSelector = getFullStopSelector(sliderStop);
			$(gradientStopSelector).attr('stop-color', this.hslStopColor(sliderStop.offset,currentSlider.component));
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
	this.displayWidth = sliderInfo.displayWidth;
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

var hslSlider = function (sliderIndex, swatch, component) {
	//this.slider = generateSliderName(sliderIndex);
	this.name = generateSliderName(sliderIndex);
	this.swatch = swatch; // reference to swatch 
	this.stops = [{id: sliderIndex, offset: 0},
		 						{id:sliderIndex, offset: 100}];
	this.mouseBox ='body';
	this.minX = 0;
	this.maxX = sliderInfo.maxX;
	this.displayWidth = sliderInfo.displayWidth;
	this.skewX = sliderInfo.sliderWidth/2;
	this.minY = 0;
	this.maxY = sliderInfo.maxX;
	this.skewY = sliderInfo.sliderHeight/2;
	this.orientation = 'horizontal';
	this.component =  component;
	this.hexValue = '80';
	this.value = '180'; // or 100 or 50, etc. 
	this.sliderType = 'h'; // or s or l;
	this.call = [hslRegisterSliderMove,hslColorChange];
	this.callParent =  [hslSwatchUpdate];
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
    // create rgb slider group
		var rgbSliderGroup = swatchGroup
				.append("g")
				.attr("id",  swatch.name.substring(1) + "-rgb-sliders")
				.style("display","none");
				
	  /// RGB SLIDER CODE 
    var sliderArray = [];
    var componentIndex = 0;
    for (var component in swatch.components) {
      var sliderIndex = appCounters.sliderIndex++;
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
      rgbSliderGroup
        .append("rect")
        .attr(sliderRectAttrs)
        .attr({
            "id": "r-" + sliderIndex,
            "width": slider.displayWidth,
            "height": 5,  // hard coded value !!!!!!
            "y": parseInt(sliderInfo.sliderStartY
							+ sliderInfo.sliderSpacing * componentIndex),
            "fill": "url(" + gradientName + ")"
        });
      var index = componentIndex;
      rgbSliderGroup
        .append("use")
        .attr(sliderHandleAttrs)
        .attr("y", sliderInfo.y(index))
        .attr("id", getSliderId(slider.name))
        ;

      $(slider.name)
        .bind('mousedown', sliders[sliderIndex], startMove);

      componentIndex++;
    }
    
    swatch.sliders = sliderArray;
		/// END RGB SLIDER CODE
		
		/// HSL SLIDER CODE 
		var hslSliderGroup = swatchGroup
				.append("g")
				.attr("id",  swatch.name.substring(1) + "-hsl-sliders")
				.style("display","block");
				
		var sliderArray = [];
    var componentIndex = 0;
    for (var component in swatch.hslComponents) {
      var sliderIndex = appCounters.sliderIndex++;
      sliderArray[sliderArray.length] = sliderIndex;
      sliders[sliderIndex] = new hslSlider(sliderIndex, swatch, swatch.hslComponents[component]);
      var slider = sliders[sliderIndex];
			
			switch (swatch.hslComponents[component]) {
			case 'h':
				slider.stops = [
					{id: sliderIndex, offset: 0, "stop-color": "hsl(0,100%,50%)"},
					{id: sliderIndex, offset: 17, "stop-color": "hsl(60,100%,50%)"},
					{id: sliderIndex, offset: 33, "stop-color": "hsl(120,100%,50%)"},
					{id: sliderIndex, offset: 50, "stop-color": "hsl(180,100%,50%)"},
					{id: sliderIndex, offset: 67, "stop-color": "hsl(240,100%,50%)"},
					{id: sliderIndex, offset: 83, "stop-color": "hsl(300,100%,50%)"},
					{id: sliderIndex, offset: 100, "stop-color": "hsl(360,100%,50%)"}
					];
				slider.value = 180;
				slider.minX = 0;
				slider.maxX = 360;
				slider.displayWidth = 255;
				break;
			case 's':
				slider.stops = [
					{id: sliderIndex, offset: 0, "stop-color": "hsl(0,0%,50%)"},
					{id: sliderIndex, offset: 0, "stop-color": "hsl(0,0%,50%)"},
					{id: sliderIndex, offset: 100, "stop-color": "hsl(0,100%,50%)"}
				];
				slider.value = 100;
				slider.minX = 0;
				slider.maxX = 100;
				slider.displayWidth = 255;
				break;
			case 'l':
				slider.stops = [
					{id: sliderIndex, offset: 0, "stop-color": "hsl(0,100%,0%)"},
					{id: sliderIndex, offset: 50, "stop-color": "hsl(0,100%,50%)"},
					{id: sliderIndex, offset: 100, "stop-color": "hsl(0,100%,100%)"}
				];
				slider.value = 50;
				slider.minX = 0;
				slider.maxX = 100;
				slider.displayWidth = 255;
				break;
			}
			
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
          .attr("offset", stop.offset + "%")
          .attr("stop-opacity", "1.0")
          .attr("id", getStopId(stopName))
          .attr("stop-color",swatch.hslStopColor(stop.offset,swatch.hslComponents[component]));
      }
      hslSliderGroup
        .append("rect")
        .attr(sliderRectAttrs)
        .attr({
            "id": "r-" + sliderIndex,
            "width": slider.displayWidth,
            "height": 5,  // hard coded value !!!!!!
            "y": parseInt(sliderInfo.sliderStartY
							+ sliderInfo.sliderSpacing * componentIndex),
            "fill": "url(" + gradientName + ")"
        });
      //var index = componentIndex;
      hslSliderGroup
        .append("use")
        .attr(sliderHandleAttrs)
        .attr("y", sliderInfo.y(componentIndex))
        .attr("id", getSliderId(slider.name))
        ;

      $(slider.name)
        .bind('mousedown', sliders[sliderIndex], startMove);

      componentIndex++;
    }
    
    swatch.sliders = sliderArray;
		// END HSL SLIDER CODE
		
  } // end iteration over swatches array
  
}


function getFullStopSelector (gradientStop) {
	return "#lg-" + gradientStop.id + "-" + gradientStop.offset;
}

function generateSwatchName(swatchIndex) {
	if (swatchIndex == undefined) {
		swatchIndex = appCounters.swatchIndex++;
	} 
	else if (appCounters.swatchIndex <= swatchIndex) {
		appCounters.swatchIndex = swatchIndex + 1;
	} else {
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