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

var theoryGroup = function (name, slots) {
	this.name = name;
	this.slots = slots;
	this.clear = [];
	var availableSlots = [0,1,2,3,4];
	for (var i = 0; i<availableSlots.length; i++) {
		if (this.slots.indexOf(availableSlots[i]) == -1) {
			this.clear[this.clear.length] = availableSlots[i];
		}
	}
	return this;
}

var Theory = new Array();
Theory['compliment'] = new theoryGroup('compliment', [2,3]);
Theory['split-compliment'] = new theoryGroup('split-compliment', [2,1,3]);
Theory['split-compliment-2'] = new theoryGroup('split-compliment-2', [2,1,3,0,4]);
Theory['analogous'] =   new theoryGroup('analogous', [2,1,3]);
Theory['analogous-2'] = new theoryGroup('analogous-2', [2,1,3,0,4]);
Theory['monochrom-1'] = new theoryGroup('monochrom-1', [0,1,2,3,4]);
Theory['monochrom-2'] = new theoryGroup('monochrom-2', [0,1,2,3,4]);
Theory['monochrom-3'] = new theoryGroup('monochrom-3', [0,1,2,3,4]);
Theory['monochrom-4'] = new theoryGroup('monochrom-4', [0,1,2,3,4]);


var linearGradientAttrs = {
  "gradientUnits": "objectBoundingBox",
  "color-interpolation": "sRGB"
}

var appInfo = {
  
  appTop: 350,
  
};


var sliderInfo = {
  href: "#lollypop-2",
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
  swatchSpacing: 30,
  swatchLeftSpacing: 15
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
  height: sliderInfo.sliderHeight,
  width: sliderInfo.displayWidth,
  fill: "url(#gradient-0)",
  stroke: "none",
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
   
  if (true) {
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
  if (evt.data.orientation == 'horizontal') {
    Log.Notice('registerSliderMove new X value=' + parseFloat(evt.data.currentX+evt.data.skewX));
  } else if (evt.data.orientation == 'vertical') {
    Log.Notice('registerSliderMove new Y value=' + parseFloat(evt.data.currentY+evt.data.skewY));
  }
}

function hslRegisterSliderMove (evt) {
  if (evt.data.orientation == 'horizontal') {
    Log.Notice('hslRegisterSliderMove new X value=' + parseFloat(evt.data.currentX+evt.data.skewX));
  } else if (evt.data.orientation == 'vertical') {
    Log.Notice('hslRegisterSliderMove new Y value=' + parseFloat(evt.data.currentY+evt.data.skewY));
  }
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

  for (var i = 0; i< evt.data.callParent.length; i++) {
     evt.data.callParent[i](evt);
  }
}

function hslColorChange(evt) {
  
  // calculate new color  
  switch (evt.data.orientation) {
  case 'vertical':
    //alert("hslColorChange: vertical not implemented!");
    var baseValue = evt.data.currentY+evt.data.skewY
    var normValue = baseValue/evt.data.displayWidth;
    //var value = Math.round((evt.data.maxY - evt.data.minY) * normValue);
		var value = (evt.data.maxY - evt.data.minY) * normValue; // changed
    value = (value + Math.abs(evt.data.minY))*100/evt.data.displayWidth;
    //var hexValue = toHex(value);
    break;
  case 'horizontal':
  default:
    var baseValue = evt.data.currentX+evt.data.skewX
     var normValue = baseValue/evt.data.displayWidth;
     var value = Math.round((evt.data.maxX - evt.data.minX) * normValue);
     var value = (evt.data.maxX - evt.data.minX) * normValue; // changed
    break;
  }
  
  Log.Notice("hslColorChange: baseValue=" + baseValue 
    + " normValue=" + normValue + " fullScaleValue="
    + evt.data.fullScaleValue + " value=" + value);

  evt.data.value = value;
  
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
  var swatchColor =  swatch.color();
  for (var i = 0; i< swatch.swatchSelectors.length; i++) {
    $(swatch.swatchSelectors[i]).attr('fill',swatchColor);
  }
  swatch.updateAllControls();
  swatch.updateGradients();
}

function hslSwatchUpdate(evt) {
  var swatch = evt.data.swatch;
  var value = evt.data.value;
  swatch[evt.data.component] = value;
  var swatchColor = swatch.hslColor();
  Log.Notice('hslSwatchUpdate value for ' + evt.data.name 
    + ' = ' + value + ' fullcolor =' + swatchColor);
  for (var i = 0; i< swatch.swatchSelectors.length; i++) {
    $(swatch.swatchSelectors[i]).attr('fill',swatchColor);
  }
  swatch.updateAllControls();
  swatch.hslUpdateGradients();
}

function hslMainSwatchUpdate(evt) {
  var swatch = evt.data.swatch;
  var value = evt.data.value;
  swatch[evt.data.component] = value;
  var swatchColor = swatch.hslColor();

  Log.Notice('hslMainSwatchUpdate value for ' + evt.data.name 
    + ' = ' + value + ' fullcolor =' + swatchColor);

  for (var i = 0; i< swatch.swatchSelectors.length; i++) {
    $(swatch.swatchSelectors[i]).attr('fill',swatchColor);
  }
  var stops = [
    {id: "#stop-1", offset: 0,   opacity: 1.0, color: '#808080'},
    {id: "#stop-2", offset: 0,   opacity: 1.0, color: '#808080'},
    {id: "#stop-3", offset: 100, opacity: 0.0, color: '#808080'}
  ];
  
  var l = swatch.l;
  var stop2Offset = Math.abs(100 - 2*l);
  var stopHex = toHex(Math.round(2.55 * l));
  var stopColor = '#' + stopHex + stopHex + stopHex;
  
  for (var i = 0; i<stops.length; i++) {
    $(stops[i].id)
      .attr('stop-color', stopColor);
    if (stops[i].id == '#stop-2') {
      $(stops[i].id)
        .attr('offset', stop2Offset + '%')
        //
    } else if (stops[i].id == '#stop-3') {
      $(stops[i].id)
        .attr('stop-opacity', stop2Offset + '%');
    }
  }

  swatch.hslUpdateGradients();
	
	var theory = $('#theory option::selected').val();
	var angle = $('#angle').val();
	generateTheoryColors(swatchColor,theory,angle);
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

Components[appCounters.componentGroupIndex++] = new ComponentGroup (
  'rgbh', 
  'RGB Components in Hexidecimal', 
  'internal',
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
  this.swatchSelectors = [name];
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
	this.newColor = function (colorValue) {
		this.rgb = d3.rgb(colorValue);
		this.rd = this.rgb.r;
		this.gd = this.rgb.g;
		this.bd = this.rgb.b;
		this.r = toHex(this.rd);
    this.g = toHex(this.gd);
    this.b = toHex(this.bd);
		if (this.r == this.g && this.g == this.b) { 
      this.hsl = d3.hsl(this.rd/255*360, 0, this.rd/255);
    } else {
      this.hsl = this.rgb.hsl();
    }
		this.hexValue = '#' + this.r + this.g + this.b;
		
		this.updateGradients();
		this.hslUpdateGradients();

		for (var i = 0; i < this.sliders.length; i++) {
			var slider = sliders[this.sliders[i]];
			slider.hexValue = this[slider.component];
			slider.positionRgbSlider();
		}
		for (var i = 0; i < this.hslSliders.length; i++) {
			var slider = sliders[this.hslSliders[i]];
			slider.value = this[slider.component];
			slider.positionHslSlider();
		}
		this.updateAllControls();
		var swatchColor;
		switch (this.mode) {
		case 'hsl':
			swatchColor = this.hslColor();
			break;
		case 'rgb':
		case 'rgbd':
		  swatchColor = this.color();
			break;
		}
		for (var i = 0; i< this.swatchSelectors.length; i++) {
			var selector = this.swatchSelectors[i];
    	$(selector).attr('fill',swatchColor);
  	}
	};
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
    this.hexValue = '#' + this.r + this.g + this.b;
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
			$(currentSlider.name).attr('fill', this.color());
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
			$(currentSlider.name).attr('fill', this.hslColor());
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
    if (this.mode == 'rgb' || this.mode == 'rgbd') {
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
			this.updateControls('hsl');
      break;
    case 'rgb':
		case 'rgbd': // switch to rgb
      for (var i = 0; i<this.sliders.length; i++) {
        slider = sliders[this.sliders[i]];
        slider.rgbValue = this[slider.component + "d"];
        slider.hexValue = this[slider.component];
        
        // GOOD PLACE TO UPDATE CONTROLS VALUES WITH SLIDER FUNCTION
        slider.positionRgbSlider();
      }
      d3.select(this.hslSelector).style('display', 'none');
      d3.select(this.rgbSelector).style('display', 'block');
      this.updateControls('rgbd');
      break;
    }
    this.updateControls('hex');
    this.mode = mode;
  };
  this.updateAllControls = function () {

    this.updateControls('rgbd');
    this.updateControls('hsl');
    this.updateControls('hex');
  };
  this.updateControls = function (controlType) {
    
    var swatchName = this.name;
    var typeConnect = "-" + controlType + "-";
    var components;
    switch (controlType) {
    case 'hsl':
      components = this.hslComponents;
      break;
    case 'rgb':
      components = this.rgbhComponents;
      break;
    case 'rgbd':
      components = this.rgbdComponents;
      break;
    case 'hex':
      components = this.hexComponents;
      break;
    }
    
    var component,controlId,value;
    for (var i = 0; i< components.length; i++) {
      component = components[i];
      controlId = swatchName + typeConnect + component;
      value = this[component];
			valueDisplay = value;
      if (component == 's' || component == 'l') {
        valueDisplay = Math.round(valueDisplay);
        if (valueDisplay != 100) {
          valueDisplay = "" + valueDisplay + "%";
        }
      }
      else if ( component == 'h') {
        valueDisplay = Math.round(valueDisplay);
      }
      $(controlId)
				.text(valueDisplay)
				.attr('title', value);
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
  var width = sliderInfo.swatchLeftSpacing 
  + (sliderInfo.displayWidth +  sliderInfo.sliderSpacing) * swatches.length;
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
  
  // Later on we will format these lines;
  var controlLineIds = ['control-line-top','control-line-middle','control-line-bottom'];
  var controlLineGroup =   svg
      .append('g')
      .attr('transform','translate(0,' +  parseInt(sliderInfo.displayWidth 
      + appInfo.appTop) + ")");
  for (var i = 0; i<swatches[0].rgbhComponents.length;i++)  {
    var controlLineId = controlLineIds[i];
    controlLineGroup
      .append('line')
      .attr('id',controlLineId)
      .attr('class', 'control-line')
      .attr('x1',0)
      .attr('y1',parseFloat(sliderInfo.sliderStartY
              + sliderInfo.sliderSpacing * i + sliderInfo.sliderHeight/4 ))
      .attr('x2',width)
      .attr('y2',parseFloat(sliderInfo.sliderStartY
              + sliderInfo.sliderSpacing * i + sliderInfo.sliderHeight/4 ));
  }
    
  for (var i = 0; i<swatches.length; i++) {
    var swatchGroupSliders = [];
    var swatch = swatches[i];
    var swatchIndex = swatch.swatchIndex;
    var swatchGroup = svg
        .append("g")
        .attr({
            id: "color-" + swatchIndex,
            transform: "translate(" 
            + parseFloat(sliderInfo.swatchLeftSpacing + ( sliderInfo.displayWidth + sliderInfo.swatchSpacing) * swatchIndex) 
            + "," 
            + parseFloat(sliderInfo.displayWidth + appInfo.appTop) +")"
            
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
				.attr("class",'pointer')
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

      hslSliderGroup
        .append("use")
        .attr(sliderHandleAttrs)
        .attr("y", sliderInfo.y(componentIndex))
        .attr("id", getSliderId(slider.name))
				.attr("class","pointer")
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


function writeSwatchControls(swatchGroup, swatch) {
  var swatchId = getSwatchId(swatch.name);
  var controlGroup = swatchGroup
    .append("g")
    .attr("id", swatchId + "-controls")
      .attr("transform", "translate(0,100)");
  var rgbControls = controlGroup
      .append("g")
      .attr("id", swatchId + "-rgb-controls")
      .attr("transform", "translate(0,25)");
  var x = 0;
  var y = 13;
  var i = 0
  rgbControls
      .append("text")
      .attr("id", swatchId + "-rgbd-label")
      .attr("x", x)
      .attr("y", y)
      .attr("class","label pointer")
			.on("click", function (d,i) {
					var swatchId = d3.select(this).attr('id');
					var swatchList = swatchId.split('-');
					var from = swatchList[2];
					if (from == 'rgbd') {
						from = 'rgb';
					}
					var swatchIndex = parseInt(swatchList[1]);
					swatch = swatches[swatchIndex];
					Log.Notice('toggleHslRgb from=' + from + ' swatchIndex=' + swatchIndex);
					if (swatch.mode == from ) {
						return;
					}
					swatch.toggleHslRgb();
					switch (from) {
					case 'hsl':
						swatch.updateGradients();
						swatch.hslUpdateGradients();
						break;
					case 'rgb':
						swatch.hslUpdateGradients();
						swatch.updateGradients();
						break;
					}
				})
      .text("RGB");
      
  var rgbValues = rgbControls
      .append("g")
      .attr("id", swatchId + "-rgbd-value")
      .attr("transform", "translate(30,0)");
  x = 10;
  var component = ['rd','gd','bd']
  for (comp in component) {

    rgbValues
      .append("use")
      .attr("xlink:href", "#rect-field-3")
      .attr("x", x + i * 38)
      .attr("y", 0);
    rgbValues  
      .append("text")
      .attr("id", swatchId +  "-rgbd-" + component[comp])
      .attr("class","text")
      .attr("x", x + 3 + i * 38)
      .attr("y", y)
      .text(swatch[component[comp]]);
    i++;
  }
  
  x = 0;
  i = 0
  var hslControls = controlGroup
      .append("g")
      .attr("id", swatchId + "-hsl-controls")
      .attr("transform", "translate(0,50)");
  
  hslControls
      .append("text")
      .attr("id", swatchId + "-hsl-label")
      .attr("x", x)
      .attr("y", y)
      .attr("class","label pointer")
			.on("click", function (d,i) {
					var swatchId = d3.select(this).attr('id');
					var swatchList = swatchId.split('-');
					var from = swatchList[2];
					if (from == 'rgbd') {
						from = 'rgb';
					}
					var swatchIndex = parseInt(swatchList[1]);
					swatch = swatches[swatchIndex];
					Log.Notice('toggleHslRgb from=' + from + ' swatchIndex=' + swatchIndex);
					if (swatch.mode == from ) {
						return;
					}
					switch (from) {
					case 'hsl':
						swatch.updateGradients();
						swatch.hslUpdateGradients();
						break;
					case 'rgb':
						swatch.hslUpdateGradients();
						swatch.updateGradients();
						break;
					}
					swatch.toggleHslRgb();	
				})
			 .text("HSL");
     
      
  x = 10;
  var hslValues = hslControls
      .append("g")
      .attr("id", swatchId + "-hsl-value")
      .attr("transform", "translate(30,0)");

  var component = ['h','s','l'];
  var text;
  for (comp in component) {
      text = swatch[component[comp]];
      if (text != "100") {
        if (component[comp] == 's' || component[comp] == 'l') {
          text = text + "%";
        } 
      }
      hslValues
        .append("use")
        .attr("xlink:href", "#rect-field-3")
        .attr("x", x + i * 38)
        .attr("y", 0);
      hslValues  
        .append("text")
        .attr("id", swatchId +  "-hsl-" + component[comp])
        .attr("class","text")
        .attr("x", x + 3 + i * 38)
        .attr("y", y)
        .text(text);
      i++;
  }
  
  x = 0;
  i = 0
  var hexControls = controlGroup
      .append("g")
      .attr("id", swatchId + "-hex-controls")
      .attr("transform", "translate(0,75)");
  
  hexControls
      .append("text")
      .attr("class","label-2")
      .attr("id", swatchId + "-hex-label")
      .attr("x", x)
      .attr("y", y)
      .text("HEX");
      
  x = 10;
  var hexValues = hexControls
      .append("g")
      .attr("id", swatchId + "-hex-value")
      .attr("transform", "translate(30,0)");

  var component = ['hexValue'];
  var text;
  for (comp in component) {
      text = swatch[component[comp]];

      hexValues
        .append("use")
        .attr("xlink:href", "#rect-field-4")
        .attr("x", x + i * 38)
        .attr("y", 0);
      hexValues  
        .append("text")
        .attr("id", swatchId +  "-hex-" + component[comp])
        .attr("class","text")
        .attr("x", x + 3 + i * 38)
        .attr("y", y)
        .text(text);
      i++;
  }
}



//***************** ***********************//
function generateTC( ) {
	Log.Notice(".....generate TC");
	var baseColor = $('#hsl-swatch-current').attr('fill');
	var theory = $('#theory option::selected').val();
	var angle = $('#angle').val();
	generateTheoryColors(baseColor, theory, angle);
	
	$('#angle-display').html(angle + "&deg;");
	
}

function generateTheoryColors(baseColor, theory, angle) {
	var rgb = d3.rgb(baseColor);
	var rd = rgb.r;
	var gd = rgb.g;
	var bd = rgb.b;
	var r = toHex(rd);
  var g = toHex(gd);
  var b = toHex(bd);
	var hexValue = '#' + r + g + b;
	
	var hsl;
	if (r == g && g == b) { 
    hsl = d3.hsl(rd/255*360, 0, rd/255);
  } else {
    hsl = rgb.hsl();
  }
	var h = hsl.h;
	var s = hsl.s * 100;
	var l = hsl.l * 100;
	
	var TheoryColors = new Array();
	var toHsl = function (h, s, l) {
		var val = "hsl(" + h + "," + s + "%," + l + "%)"
		return val;
	}
	
	var brighter = function(l, k) {
		 k = Math.pow(.7, arguments.length > 1 ? k : 1); 
		 Log.Notice('brighter l=' + l + ' k=' + k);
		 return l/k;
	}
	var darker = function(l, k) {
		 k = Math.pow(.7, arguments.length > 1 ? k : 1);
		 Log.Notice('darker l=' + l + ' k=' + k);
		 return l*k;
  }

	TheoryColors[0] =  toHsl(h,s,l);
	var splitAngle = 0;
	var splitPairs = 1;
	if (angle == undefined) {
		var angle = 60;
	}
	
	var monochromAngle = angle/360;
	var monoType = 'sat';
	var newS = s;
	var newL = l;
	switch (theory) {
	case 'compliment':
		var hueCompliment;
		if (h >= 180) {
			hueCompliment = h - 180;
		}
		else if (h < 180) {
			hueCompliment = 180 + h;
		}
		TheoryColors[TheoryColors.length] = toHsl(hueCompliment,s,l);

		break;
	case 'split-compliment-2':
	  splitPairs = 2;
	case 'split-compliment':
	  splitAngle = 180;
		for (var i = 0; i < splitPairs; i++) {
			TheoryColors[TheoryColors.length] =  toHsl(Math.abs((h + 360 + splitAngle + angle*(i+1)))%360,s,l);
  		TheoryColors[TheoryColors.length] =  toHsl(Math.abs((h + 360 + splitAngle - angle*(i+1)))%360,s,l);
		}
		break;
	case 'analogous-2':
		splitPairs = 2;
	case 'analogous':
		for (var i = 0; i < splitPairs; i++) {
			TheoryColors[TheoryColors.length] =  toHsl(Math.abs((h + 360 + splitAngle + angle*(i+1)))%360,s,l);
  		TheoryColors[TheoryColors.length] =  toHsl(Math.abs((h + 360 + splitAngle - angle*(i+1)))%360,s,l);
		}
		break;
	case 'monochrom-1': // by value
	  monoType = 'val';
	case 'monochrom-2': // by saturation 
	  for (var i = 4; i>= 0; i--) {
			switch (monoType) {
			case 'val':
				newS = s;
				newL = Math.round(l * monochromAngle * i);
			  break;
			case 'sat':
				newS = Math.round(s * monochromAngle * i);
				newL = l;
				break;
			}
			TheoryColors[TheoryColors.length] = toHsl(h,newS,newL);
		}
		break;
	case 'monochrom-3': // by darker
		newS = s/100;
		newL = l/100;
		for (var i = 6; i> 1; i--) {
			newL = darker(newL, 1/i);
			TheoryColors[TheoryColors.length] = toHsl(h,Math.round(newS * 100),Math.round(newL * 100));
		}
		break;
	case 'monochrom-4': // by brighter

		newS = s/100;
		newL = l/100;
		for (var i = 6; i> 1; i--) {
			newL = brighter(newL, 1/i);
			TheoryColors[TheoryColors.length] = toHsl(h,Math.round(newS * 100),Math.round(newL * 100));
		}
		break;
	}

	
	var swatchSlots = Theory[theory].slots;
	var clearSlots = Theory[theory].clear;
	
	for (var i = 0; i < swatchSlots.length; i++) {
		swatchIndex = swatchSlots[i];
		swatches[swatchIndex].newColor(TheoryColors[i]);
	}
	
	for (var i = 0; i < clearSlots.length; i++) {
		swatchIndex = clearSlots[i];
		swatches[swatchIndex].newColor('#808080');
	}
	
	return TheoryColors;
}

function toggleHslRgb(from, swatchIndex) {
	
	//swatch = swatches[swatchIndex];
	//if (swatch.mode != from ) {
	//	return;
	//}
	//Log.Notice('toggleHslRgb from=' + from + ' swatchIndex=' + swatchIndex);
	//swatch.toggleHslRgb();	
	
}


//***************** *********************//

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