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
appCounters.componentGroupIndex = 0;

var swatchSlots = [
  {name: "slot-base", index: 2},
  {name: "slot-sc-1", index: 1},
  {name: "slot-sc-2", index: 3},
  {name: "slot-sc-3", index: 0},
  {name: "slot-sc-4", index: 4},
  {name: "slot-complement", index: 1},
  {name: "slot-analogous-1", index: 1},
  {name: "slot-analogous-2", index: 3},
  {name: "slot-analogous-3", index: 0},
  {name: "slot-analogous-4", index: 4},
  {name: "slot-monochrom-1", index: 1},
  {name: "slot-monochrom-2", index: 3},
  {name: "slot-monochrom-3", index: 0},
  {name: "slot-monochrom-4", index: 4},
];

var linearGradientAttrs = {
  "gradientUnits": "objectBoundingBox",
  "color-interpolation": "sRGB"
}

var appInfo = {
  
  appTop: 20,
  
};


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
    return Math.ceil(this.displayWidth/2 - this.sliderWidth/2);
  },
  y: function (index) {
    return Math.ceil(sliderInfo.sliderStartY + sliderInfo.sliderHeight/2 + sliderInfo.sliderSpacing * index);
  },
  sliderStartY: 20,
  swatchSpacing: 10,
};

var swatchRectAttrs = {
  x:0,
  y: -1 * sliderInfo.displayWidth,
  height: sliderInfo.displayWidth,
  width: sliderInfo.displayWidth,
  fill:'#808080',
  stroke:"none",
  strokeWidth: 0
};

var sliderRectAttrs = {
  x: 0,
  height: sliderInfo.sliderHeight/2,
  width: sliderInfo.displayWidth,
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
   
   
  if (currentX > evt.data.displayWidth-skewX) {
    currentX = evt.data.displayWidth-skewX;
  }
  else if (currentX < evt.data.minX-skewX) {
    currentX = evt.data.minX-skewX;
  }
   
  if (currentY > evt.data.maxY-skewY) {
    currentY = evt.data.maxY-skewY;
  }
  else if (currentY < evt.data.displayWidth-skewY) {
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
  evt.data.rgbValue = toDecimal(hexValue);
  
  Log.Notice('dec=' + rgbValue + ' hex=' 
    + hexValue + ' backToDec =' + toDecimal(hexValue));
  
	var controlsId = evt.data.swatch.name + "-rgb-" + evt.data.component + "d";
	$(controlsId).text(rgbValue);
	
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
     var normValue = baseValue/evt.data.displayWidth;
     var value = Math.round((evt.data.maxX - evt.data.minX) * normValue);
     var hexValue = toHex(value);
    break;
  }
  Log.Notice("hslColorChange: baseValue=" + baseValue 
    + " normValue=" + normValue + " fullScaleValue="
    + evt.data.fullScaleValue + " value=" + value);
  //evt.data.hexValue = hexValue;
  evt.data.value = value;
  //evt.data.color = hexValue;
	var controlsValue = value;
	if (controlsValue != "100") {
			if (evt.data.component == 's' || evt.data.component == 'l') {
				controlsValue = controlsValue + "%";
			} 
	}
  var controlsId = evt.data.swatch.name + "-hsl-" + evt.data.component;
	$(controlsId).text(controlsValue);
	
  Log.Notice("hsl value ="+ value);
  
  for (var i = 0; i< evt.data.callParent.length; i++) {
     evt.data.callParent[i](evt);
  }
}


function swatchUpdate(evt) {
  var swatch = evt.data.swatch;
  var rgbValue = evt.data.rgbValue;
  var hexValue = evt.data.hexValue;
  Log.Notice('swatchUpdate for ' + evt.data.name 
    + ' rgbValue  = ' + rgbValue 
    + ' hexValue  = ' + hexValue
    + ' fullcolor =' + swatch.color());
  swatch[evt.data.component] = evt.data.hexValue;
  swatch.rgb2hsl();
  $(swatch.name).attr('fill', swatch.color());
  swatch.updateGradients();
}

function hslSwatchUpdate(evt) {
  var swatch = evt.data.swatch;
  var value = evt.data.value;
  swatch[evt.data.component] = value;
  swatch.hsl2rgb();
  Log.Notice('hslSwatchUpdate value for ' + evt.data.name 
    + ' = ' + value + ' fullcolor =' + swatch.hslColor());
  $(swatch.name).attr('fill', swatch.hslColor());
  swatch.hslUpdateGradients();
}

var ComponentGroup = function (name, description, type, definition) {
	this.name = name;
	this.description = description;
	this.type = type;
	//this.internalComponents = [];
	this.components = [];
	for (var i = 0; i< definition.length; i++) {
		var obj = definition[i];
		var name = obj.name;
		var type = obj.type;
		this.components[this.components.length] = name;
		if (type == 'undefined') {
			type = 'external';
		} 
		this[name] = {'default': obj.default, 'type': type};
	}
	
	return this;
};

var Components = [];

Components[appCounters.componentGroupIndex++] = new ComponentGroup ('rgbh', 'RGB Components in Hexidecimal', 'internal',
[{name: 'r',default: '80'},
 {name: 'g',default: '80'},
 {name: 'b', default: '80'},
 {name: 'a', type: 'internal', default: 1.0}
]);

Components[appCounters.componentGroupIndex++] = new ComponentGroup ('hex', 'HexaDecimal Value', 'external',
[{name: 'hexValue', default: '#808080', type: 'external'}]);

Components[appCounters.componentGroupIndex++] = new ComponentGroup ('rgbd', 'RGB Components in Decimal', 'external',
[{name: 'rd', default: 128},
 {name: 'gd', default: 128},
 {name: 'bd', default: 128},
 {name: 'ad', type: 'internal', default: 1.0}
]);

Components[appCounters.componentGroupIndex++] = new ComponentGroup ('rgba', 'RGBA Components in Decimal', 'internal',
[{name: 'rad',default: 128},
 {name: 'gad', default: 128},
 {name: 'bad', default: 128},
 {name: 'aad', default: 1.0}
]);

Components[appCounters.componentGroupIndex++] = new ComponentGroup ('hsl', 'HSL Components in Degrees and Percent', 'external',
[{name: 'h', default: 128},
 {name: 's', default: 0},
 {name: 'l', default: 50}]);


var Swatch = function (name, swatchIndex) {
  this.name = name;
  this.swatchIndex = swatchIndex;
  this.rgbhComponents = ['r', 'g', 'b'];
	this.rgbdComponents = ['rd', 'gd', 'bd'];
  this.hslComponents = ['h', 's', 'l'];
	this.hexComponents = ['hexValue'];
	this.components = {};
	this.components['rgbh'] = this.rgbhComponents;
	this.components['rgbd'] = this.rgbdComponents;
	this.components['hsl'] = this.hslComponents;
	this.components['hex'] = this.hexComponents;
  this.rgbSelector = null;
  this.hslSelector = null;
  this.r = '80';
  this.g = '80';
  this.b = '80';
	this.hexValue = '#808080';
  this.rd = 128;
  this.gd = 128;
  this.bd = 128;
  this.a = 1.0;
  this.h = 180;
  this.s = 0;
  this.l = 50;
  this.hsl = {};
  this.rgb = {};
  this.hsl2rgb = function () {
    this.hsl = d3.hsl(this.h, this.s/100, this.l/100);
    this.rgb = this.hsl.rgb();
    this.rd = this.rgb.r;
    this.gd = this.rgb.g;
    this.bd = this.rgb.b;
    this.r = toHex(this.rd);
    this.g = toHex(this.gd);
    this.b = toHex(this.bd);
		this.hexValue = '#' + this.r + this.g + this.b;
    return this.rgb;
  };
  this.rgb2hsl = function () {
    this.rd = toDecimal(this.r);
    this.gd = toDecimal(this.g);
    this.bd = toDecimal(this.b);
    this.rgb = d3.rgb(this.rd, this.gd, this.bd);
    // convert greyscale
    if (this.r == this.g && this.g == this.b) { 
      this.hsl = d3.hsl(this.rd/255*360, 0, this.rd/255);
    } else {
      this.hsl = this.rgb.hsl();
    }
    this.h = this.hsl.h;
    this.s = this.hsl.s * 100;
    this.l = this.hsl.l * 100;
    return this.hsl;
  };
  this.sliders = [0,1,2];
  this.hslSliders = [3,4,5];
  this.color = function () {
    this.rgb2hsl();
    return "#" + this.r + this.g + this.b;
  };
  this.decimalColor = function () {
    this.rgb2hsl();
    return "rgba(" + this.rd + "," + this.gd + "," + this.bd + "," + this.a + ")";
  };
  this.hslColor = function () {
    this.hsl2rgb();
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
  this.decimalStopColor = function (stopPercent, component) {

    var newVal = Math.round(stopPercent * 2.55);
    
    var rd = this.rd;
    var gd = this.gd;
    var bd = this.bd;
    var  a = this.a;
    
    switch (component) {
    case 'r':
      rd = newVal;
      break;
    case 'g':
      gd = newVal;
      break;
    case 'b':
      bd = newVal;
      break;
    }
    return "rgba(" + this.rd + "," + this.gd + "," + this.bd + "," + this.a + ")";
  };
  
  this.hslStopColor = function (stopPercent, component) {

    h = this.h;
    s = this.s;
    l = this.l;
    
    switch (component) {
    case 'h':
      h = Math.round(stopPercent * 3.6);
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
  this.mode = 'rgb'; //or hsl
  this.toggleHslRgb = function () {
    var mode;
    if (this.mode == 'rgb') {
      mode = 'hsl';
    } else {
      mode = 'rgb';
    }
    
    var slider;
    
    switch (mode) {
    case 'hsl': // swtich to hsl
      for (var i = 0; i<this.hslSliders.length; i++) {
        slider = sliders[this.hslSliders[i]];
        slider.value = this[slider.component];
        slider.positionHslSlider();
      }
      d3.select(this.rgbSelector).style('display', 'none');
      d3.select(this.hslSelector).style('display', 'block');
      break;
    case 'rgb': // switch to rgb
      for (var i = 0; i<this.sliders.length; i++) {
        slider = sliders[this.sliders[i]];
        slider.rgbValue = this[slider.component + "d"];
        slider.hexValue = this[slider.component];
        slider.positionRgbSlider();
      }
      d3.select(this.hslSelector).style('display', 'none');
      d3.select(this.rgbSelector).style('display', 'block');
      break;
    }
    this.mode = mode;
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
  this.getValue = function (baseValue) {
    var normValue = toDecimal(baseValue)/this.displayWidth;
    var value = (this.maxX - this.minX) * normValue;
    return value;
  };
  this.getPosition = function ( hexValue ) {
    if (hexValue == undefined) hexValue = this.hexValue;
    var normValue = (toDecimal(hexValue) * this.displayWidth/(this.maxX - this.minX)) - this.skewX;
    return normValue;
  };
  this.positionRgbSlider = function () {
    //this.swatch.rgb2hsl();
    this.value = this.swatch[this.component];
    var position = this.getPosition();
    d3.select(this.name).attr('x',position);
  };
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
  this.fullScaleValue = 360;
  this.value = 180; // or 100 or 50, etc. 
  this.getValue = function (baseValue) {
    var normValue = baseValue/this.displayWidth;
    var value = (this.maxX - this.minX) * normValue;
    return value;
  },
  this.getPosition = function ( value ) {
    if (value == undefined) value = this.value;
    var normValue = value * this.displayWidth / (this.maxX - this.minX)  - this.skewX;
    return normValue;
  };
  this.sliderType = 'h'; // or s or l;
  
  this.positionHslSlider = function () {
    //this.swatch.rgb2hsl();
    this.value = this.swatch[this.component];
    var position = this.getPosition();
    d3.select(this.name).attr('x',position);
  };
  
  this.call = [hslRegisterSliderMove,hslColorChange];
  this.callParent =  [hslSwatchUpdate];
  return this;
}

function writeSvg(appSelector) {
  var appId = appCounters.appIndex++;
  var app = d3.select(appSelector);
  var x = 0;
  var y = 0
  var width = (sliderInfo.displayWidth + 20 ) * 5;
  var height = appInfo.appTop + sliderInfo.displayWidth + sliderInfo.sliderSpacing * 3 + 30 + 200;
  var svg = app
        .select("svg");
			svg
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
        .select("defs");
	defs
        .attr("id", "defs-" + appId);
  // make swatch area
  defs
        .append("path")
        //.attr({id: "triangle-2",d:"M 5 5 L 10 10 L 0 10 Z"});
        .attr({id: "triangle-2",d:"M 5 0 L 10 10 L 0 10 Z"});

	defs
				.append("rect")
				.attr("id","rect-field-3")
				.attr("stroke", "hsl(180,0%,60%)")
				.attr("fill","none")
				.attr("stroke-width", 1)
				.attr("height", 15)
				.attr("width", 32);
	defs
				.append("rect")
				.attr("id","rect-field-4")
				.attr("stroke", "hsl(180,0%,60%)")
				.attr("fill","none")
				.attr("stroke-width", 1)
				.attr("height", 15)
				.attr("width", 72);
			
				
  for (var i = 0; i<swatches.length; i++) {
    var swatchGroupSliders = [];
    var swatch = swatches[i];
    var swatchIndex = swatch.swatchIndex;
    var swatchGroup = svg
        .append("g")
        .attr({
            id: "color-" + swatchIndex,
            transform: "translate(" 
            + parseFloat(10 + (sliderInfo.displayWidth + sliderInfo.swatchSpacing) * swatchIndex) 
            + "," 
            + parseInt(sliderInfo.displayWidth + appInfo.appTop) +")",
            class: "pointer"
        });
    swatchGroup
        .append("rect")
        .attr("id", swatch.name.substring(1))
        .attr(swatchRectAttrs)

    // create rgb slider group
    swatch.rgbSelector =  swatch.name + "-rgb-sliders";
    var rgbSliderGroup = swatchGroup
        .append("g")
        .attr("id",  swatch.rgbSelector.substring(1))
        .style("display","block");
        
    /// RGB SLIDER CODE 
    var sliderArray = [];
    var componentIndex = 0;
    for (var component in swatch.rgbhComponents) {
      var sliderIndex = appCounters.sliderIndex++;
      sliderArray[sliderArray.length] = sliderIndex;
      sliders[sliderIndex] = new Slider(sliderIndex, swatch, swatch.rgbhComponents[component]);
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
          .attr("stop-color",swatch.stopColor(stop.offset,swatch.rgbhComponents[component]));
        
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
    swatch.hslSelector = swatch.name + "-hsl-sliders";
    var hslSliderGroup = swatchGroup
        .append("g")
        .attr("id",  swatch.hslSelector.substring(1))
        .style("display","none");
        
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
        slider.fullScaleValue = 360;
        slider.minX = 0;
        slider.maxX = 360;
        slider.value = slider.getValue(180);
        break;
      case 's':
        slider.stops = [
          {id: sliderIndex, offset: 0, "stop-color": "hsl(0,0%,50%)"},
          {id: sliderIndex, offset: 100, "stop-color": "hsl(0,100%,50%)"}
        ];
        slider.fullScaleValue = 100;
        slider.minX = 0;
        slider.maxX = 100;
        slider.value = slider.getValue(360);
        break;
      case 'l':
        slider.stops = [
          {id: sliderIndex, offset: 0, "stop-color": "hsl(0,100%,0%)"},
          {id: sliderIndex, offset: 50, "stop-color": "hsl(0,100%,50%)"},
          {id: sliderIndex, offset: 100, "stop-color": "hsl(0,100%,100%)"}
        ];
        slider.fullScaleValue = 100;
        slider.minX = 0;
        slider.maxX = 100;
        slider.value = slider.getValue(180);
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
            height: 5,
            width: slider.displayWidth,
            "id": "r-" + sliderIndex,
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
    
    swatch.hslSliders = sliderArray;
    // END HSL SLIDER CODE
    writeSwatchControls(swatchGroup,swatch);
  } // end iteration over swatches array
  
}


function getFullStopSelector (gradientStop) {
  return "#lg-" + gradientStop.id + "-" + gradientStop.offset;
}

function generateSwatchName(swatchIndex) {
  if (arguments.length == 0) {
    swatchIndex = appCounters.swatchIndex++;
  } 
  else if (appCounters.swatchIndex <= swatchIndex) {
    appCounters.swatchIndex = swatchIndex + 1;
  } 
  return "#swatch-" + swatchIndex;
}

function getSwatchName(swatchIndex) {
  return "#swatch-" + swatchIndex;
};

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
function getGradientName(gradientIndex) {
  return "#gradient-" + gradientIndex;
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