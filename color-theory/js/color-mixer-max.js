// Color-Mixer App
  
var xyStart = new Object();
var swatches = new Array();
var sliders = new Array();

var appCounters = new Object();
appCounters.appIndex = 0;
appCounters.swatchIndex = 0;
appCounters.gradientIndex = 0;
appCounters.sliderIndex = 0;
appCounters.componentGroupIndex = 0;

var swatchSlots = [
    {name: "slot-base", index: 3},
    {name: "slot-sc-1", index: 2},
    {name: "slot-sc-2", index: 4},
    {name: "slot-sc-3", index: 1},
    {name: "slot-sc-4", index: 5},
    {name: "slot-complement", index: 2},
    {name: "slot-analogous-1", index: 2},
    {name: "slot-analogous-2", index: 4},
    {name: "slot-analogous-3", index: 1},
    {name: "slot-analogous-4", index: 5},
    {name: "slot-monochrom-1", index: 2},
    {name: "slot-monochrom-2", index: 4},
    {name: "slot-monochrom-3", index: 1},
    {name: "slot-monochrom-4", index: 5},
];


var Theory = new Array(); // container for TheoryGroup Objects:

class TheoryGroup {
    name;
    slots;
    clear = [];
    availableSlots;
    constructor(name, slots, available) {
        this.name = name;
        this.slots = slots;
        this.availableSlots = available?available:[1,2,3,4,5];

        for (var i = 0; i < this.availableSlots.length; i++) {
            if (this.slots.indexOf(this.availableSlots[i]) == -1) {
                this.clear[this.clear.length] = this.availableSlots[i];
            }
        }
    }
}

Theory['compliment'] = new TheoryGroup('compliment', [3,4]);
Theory['split-compliment'] = new TheoryGroup('split-compliment', [3,2,4]);
Theory['split-compliment-2'] = new TheoryGroup('split-compliment-2', [3,2,4,1,5]);
Theory['analogous'] =   new TheoryGroup('analogous', [3,2,4]);
Theory['analogous-2'] = new TheoryGroup('analogous-2', [3,2,4,1,5]);
Theory['monochrom-1'] = new TheoryGroup('monochrom-1', [1,2,3,4,5]);
Theory['monochrom-2'] = new TheoryGroup('monochrom-2', [1,2,3,4,5]);
Theory['monochrom-3'] = new TheoryGroup('monochrom-3', [1,2,3,4,5]);
Theory['monochrom-4'] = new TheoryGroup('monochrom-4', [1,2,3,4,5]);
Theory['monochrom-5'] = new TheoryGroup('monochrom-5', [1,2,3,4,5]);
Theory['monochrom-6'] = new TheoryGroup('monochrom-6', [1,2,3,4,5]);

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
    swatchLeftSpacing: 15,
};

var swatchRectAttrs = {
  x:0,
  y: -1 * sliderInfo.displayWidth,
  height: sliderInfo.displayWidth,
  width: sliderInfo.displayWidth,
  fill:'#808080',
  stroke:"none",
  strokeWidth: 0,
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
  evt.data.rgbValue = toDecimal(hexValue);
  
  // Log.Notice('dec=' + rgbValue + ' hex=' 
  //  + hexValue + ' backToDec =' + toDecimal(hexValue));

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
  
  //Log.Notice("hslColorChange: baseValue=" + baseValue 
  //  + " normValue=" + normValue + " fullScaleValue="
   // + evt.data.fullScaleValue + " value=" + value);

  evt.data.value = value;
  
  //Log.Notice("hsl value ="+ value);
  
  for (var i = 0; i< evt.data.callParent.length; i++) {
     evt.data.callParent[i](evt);
  }
}

function hsbColorChange(evt) {
  
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
  
  Log.Notice("hsbColorChange: baseValue=" + baseValue 
    + " normValue=" + normValue + " fullScaleValue="
    + evt.data.fullScaleValue + " value=" + value);

  evt.data.value = value;
  
  Log.Notice("hsb value ="+ value);
  
  for (var i = 0; i< evt.data.callParent.length; i++) {
     evt.data.callParent[i](evt);
  }
}

function swatchUpdate(evt) {
  var swatch = evt.data.swatch;
  var rgbValue = evt.data.rgbValue;
  var hexValue = evt.data.hexValue;
  //Log.Notice('swatchUpdate for ' + evt.data.name 
  //  + ' rgbValue  = ' + rgbValue 
  //  + ' hexValue  = ' + hexValue
  //  + ' fullcolor =' + swatch.color());
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
  //Log.Notice('hslSwatchUpdate value for ' + evt.data.name 
  //  + ' = ' + value + ' fullcolor =' + swatchColor);
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

  //Log.Notice('hslMainSwatchUpdate value for ' + evt.data.name 
  // + ' = ' + value + ' fullcolor =' + swatchColor);

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
        .attr('offset', Math.floor(stop2Offset*1000)/1000 + '%')
        //
    } else if (stops[i].id == '#stop-3') {
      $(stops[i].id)
       // .attr('stop-opacity', stop2Offset + '%');
       .attr('stop-opacity', Math.floor(stop2Offset*10)/1000);
    }
  }

  swatch.hslUpdateGradients();
    
    var theory = $('#theory option::selected').val();
    var angle = $('#angle').val();
    $('#baseColor').val(swatchColor);
    Data.saveInput('baseColor');
    generateTheoryColors(swatchColor,theory,angle);
}

//////////////// HSB SWATCH UPDATES //////////////////////////////

function hsbSwatchUpdate(evt) {
  var swatch = evt.data.swatch;
  var value = evt.data.value;
  swatch[evt.data.component] = value;
  var swatchColor = swatch.hsbColor();
  Log.Notice('hsbSwatchUpdate value for ' + evt.data.name 
    + ' = ' + value + ' fullcolor =' + swatchColor);
  for (var i = 0; i< swatch.swatchSelectors.length; i++) {
    $(swatch.swatchSelectors[i]).attr('fill',swatchColor);
  }
  swatch.updateAllControls();
  swatch.hsbUpdateGradients();
}


function hsbMainSwatchUpdate(evt) {
  var swatch = evt.data.swatch;
  var value = evt.data.value;
    var component = evt.data.component;
  swatch[component] = value;
  var swatchColor = swatch.hsbColor();

  Log.Notice('hsbMainSwatchUpdate value for ' + evt.data.name 
    + ' = ' + value + ' fullcolor =' + swatchColor);

  for (var i = 0; i< swatch.swatchSelectors.length; i++) {
    $(swatch.swatchSelectors[i]).attr('fill',swatchColor);
  }
    var gradientStack = [];
    var sliderIndex,gradientName;
  switch (component) {
  case 'hue':
      sliderIndex = 6;
        gradientName = '#gradient-' + sliderIndex;
        gradientStack[0] = {id: "r-" + sliderIndex, type: 'fixed-gradient',
                                colorFn: null, fill: "url(" + gradientName + ")" };
        gradientStack[1] = {id: "r-" + sliderIndex + "-sat", type: 'filled-rect',
                                colorFn: 'hsbSat',fill:'none'};
        gradientStack[2] = {id: "r-" + sliderIndex + "-brt", type: 'filled-rect',
                                colorFn: 'hsbBrt',fill:'none'};
      break;
    case 'sat':
      sliderIndex = 7;
        gradientName = '#gradient-' + sliderIndex;
      gradientStack[0] = {id: "r-" + sliderIndex + "-hue", type: 'filled-rect', 
                                colorFn: 'hsbHue',fill:'none'};
        gradientStack[1] = {id: "r-" + sliderIndex, type: 'fixed-gradient',
                            colorFn: null, fill: "url(" + gradientName + ")" };
        gradientStack[2] = {id: "r-" + sliderIndex + "-brt", type: 'filled-rect',
                                colorFn: 'hsbBrt',fill:'none'};
      break;
    case 'brt':
      sliderIndex = 8;
        gradientName = '#gradient-' + sliderIndex;
      gradientStack[0] = {id: "r-" + sliderIndex + "-hue", type: 'filled-rect', 
                                colorFn: 'hsbHue',fill:'none'};
        gradientStack[1] = {id: "r-" + sliderIndex + "-sat", type: 'filled-rect', 
                                colorFn: 'hsbSat',fill:'none'};
        gradientStack[2] = {id: "r-" + sliderIndex, type: 'fixed-gradient', 
                                colorFn: null, fill: "url(" + gradientName + ")" };
      break;
    }
    
  swatch.hsbUpdateGradients();
    
    var theory = $('#theory option::selected').val();
    var angle = $('#angle').val();
    $('#baseColor').val(swatchColor);
    Data.saveInput('baseColor', 'Data.restoreInput');
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
[{name: 'h', default: 180},
 {name: 's', default: 0},
 {name: 'l', default: 50}]);

Components[appCounters.componentGroupIndex++] = new ComponentGroup ('hsb', 'Hue,Saturation and Brightness in Degrees and Percent', 'external',
[{name: 'h', default: 180},
 {name: 'sat', default: 0},
 {name: 'brt', default: 50}]);


var Swatch = function (name, swatchIndex) {
  this.name = name;
  this.swatchSelectors = [name];
  this.swatchIndex = swatchIndex;
  this.rgbhComponents = ['r', 'g', 'b'];
  this.rgbdComponents = ['rd', 'gd', 'bd'];
  this.hslComponents = ['h', 's', 'l'];
    this.hsbComponents = ['hue','sat','brt'];
  this.hexComponents = ['hexValue'];
  this.components = {};
  this.components['rgbh'] = this.rgbhComponents;
  this.components['rgbd'] = this.rgbdComponents;
  this.components['hsl'] = this.hslComponents;
    this.components['hsb'] = this.hsbComponents;
  this.components['hex'] = this.hexComponents;
  this.rgbSelector = null;
  this.hslSelector = null;
    this.hsbSelector = null;
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
    this.hue = 240;
    this.sat = 0;
    this.brt = 50;
  this.hsl = {};
  this.rgb = {};
    this.hsb = {};
    this.allColorComponents = {};
    this.newColor = function (colorValue) {
        this.rgb = d3.rgb(colorValue);
        this.rd = this.rgb.r;
        this.gd = this.rgb.g;
        this.bd = this.rgb.b;
        this.allColorComponents = rgb2hsl(this.rd,this.gd,this.bd);
        this.r = toHex(this.rd);
    this.g = toHex(this.gd);
    this.b = toHex(this.bd);
        ////if (this.r == this.g && this.g == this.b) { 
     // this.hsl = d3.hsl(this.rd/255*360, 0, this.rd/255);
    //} else {
    this.hsl = this.rgb.hsl();
    //}
        this.hsl = {
            h:this.allColorComponents.h,
            s:this.allColorComponents.s,
            l:this.allColorComponents.l
        };
        this.h = this.hsl.h;
        this.s = Math.round(this.hsl.s * 1000)/10;
        this.l = Math.round(this.hsl.l * 1000)/10;
        this.hsb = {
            hue:this.allColorComponents.h,
            sat:this.allColorComponents.sat,
            brt:this.allColorComponents.brt
        };
        
        this.hue = this.hsb.hue;
        this.sat = Math.round(this.hsb.sat * 1000)/10;
        this.brt = Math.round(this.hsb.brt * 1000)/10;
        
        this.hexValue = this.allColorComponents.hex;
        
        this.updateGradients();
        this.hslUpdateGradients();
        this.hsbUpdateGradients(); // NEEDS IMPLIMENTATION STILL

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
        for (var i = 0; i < this.hsbSliders.length; i++) {
            var slider = sliders[this.hsbSliders[i]];
            slider.value = this[slider.component];
            slider.positionHsbSlider();
        }
        
        this.updateAllControls();
        var swatchColor;
        switch (this.mode) {
        case 'hsb':
          swatchColor = this.hsbColor();
            break;
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
        this.allColorComponents = rgb2hsl(this.rd,this.gd,this.bd);
        this.hsl = {
            h:this.allColorComponents.h,
            s:this.allColorComponents.s,
            l:this.allColorComponents.l
        };
        this.h = this.hsl.h;  // this is already properly rounded
        this.s = Math.round(this.hsl.s * 1000)/10;
        this.l = Math.round(this.hsl.l * 1000)/10;
        
        this.hsb = {
            hue:this.allColorComponents.h,
            sat:this.allColorComponents.sat,
            brt:this.allColorComponents.brt
        };
        this.hue = this.hsb.hue;  // this is already properly rounded
        this.sat = Math.round(this.hsb.sat * 1000)/10;
        this.brt = Math.round(this.hsb.brt * 1000)/10;
        
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
        this.allColorComponents = rgb2hsl(this.rd,this.gd,this.bd);

    this.hsl = this.rgb.hsl(); 
        this.hsl = {
            h:this.allColorComponents.h,
            s:this.allColorComponents.s,
            l:this.allColorComponents.l
        };        
        
        this.hsb = {
            hue:this.allColorComponents.h,
            sat:this.allColorComponents.sat,
            brt:this.allColorComponents.brt
        };
        this.hue = this.hsb.hue;  // this is already properly rounded
        this.sat = Math.round(this.hsb.sat * 1000)/10;
        this.brt = Math.round(this.hsb.brt * 1000)/10;
        
        this.h = this.hsl.h; // this is already properly rounded
        this.s = Math.round(this.hsl.s * 1000)/10;
        this.l = Math.round(this.hsl.l * 1000)/10;
    this.hexValue = '#' + this.r + this.g + this.b;
    return this.hsl;
  };
    this.hsb2rgb = function () {
        this.hsb = hsb2rgb(this.hue, this.sat/100, this.brt/100);
        this.rd = this.hsb.r;
        this.gd = this.hsb.g;
        this.bd = this.hsb.b;
        this.r = toHex(this.hsb.r);
        this.g = toHex(this.hsb.g);
        this.b = toHex(this.hsb.b);
        this.rgb = d3.rgb(this.rd, this.gd, this.bd);
        this.allColorComponents = rgb2hsl(this.rd,this.gd,this.bd);
        
        this.hsl = this.rgb.hsl(); 
        this.hsl = {
            h:this.allColorComponents.h,
            s:this.allColorComponents.s,
            l:this.allColorComponents.l
        };
    this.h = this.hsl.h;
    this.s = Math.round(this.hsl.s * 1000)/10;
    this.l = Math.round(this.hsl.l * 1000)/10;
        
        this.hsb = {
            hue:this.allColorComponents.h,
            sat:this.allColorComponents.sat,
            brt:this.allColorComponents.brt
        };
        this.hue = this.hsb.hue;
        this.sat = Math.round(this.hsb.sat * 1000)/10;
        this.brt =  Math.round(this.hsb.brt * 1000)/10;

    this.hexValue = this.allColorComponents.hex;
        
    return this.hsb;
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
    this.hsbColor = function () {
    this.hsb2rgb();
    return "hsl(" + this.h + "," + this.s + "%," + this.l + "%)";
  };
  this.hsbHue = function () {
        var rgb = hueToRgbComponents(this.hue);
        Log.Notice('hue = ' + this.hue  + ',rgb.red=' + rgb.red);
        return "rgba(" 
           + Math.round(rgb.red) 
           + "," 
           + Math.round(rgb.green) + "," 
             + Math.round(rgb.blue) + ",1.0)";
    };
  this.hsbSat = function () {
        var satInverse = Math.round(10*(100 - this.sat))/1000;
        return "rgba(255,255,255," + satInverse + ")";
    };
  this.hsbBrt = function () {
        var brtInverse = Math.round(10*(100 - this.brt))/1000;
        return "rgba(0,0,0," + brtInverse + ")";
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
    this.hsbStopColor = function (stopPercent, component) {

    var hue = this.hue;
    var sat = this.sat;
    var brt = this.brt;
    var rgbHue = hueToRgbComponents(hue);
        var rgb;
        
    switch (component) {
    case 'hue':
          hue = (stopPercent * 3.6);
      break;
    case 'sat':
      sat = stopPercent;
      break;
    case 'brt':
      brt = stopPercent;
      break;
    }  
        rgb = hsb2rgb(hue, sat, brt);
    return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
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
    
    /////////// HSB UPDATE GRADIENTS /////////////////////////
  this.hsbUpdateGradients = function () {
        if (this.name == '#SWATCH-MAIN') {
            d3.select('#hsb-hue').attr('fill',this.hsbHue());
          d3.select('#hsb-sat').attr('fill',this.hsbSat());
          d3.select('#hsb-brt').attr('fill',this.hsbBrt());
        }
    var currentSlider, sliderStop, gradientStopSelector,gradStack;
    for (var i = 0; i < this.hsbSliders.length; i++) {
      currentSlider = sliders[this.hsbSliders[i]];
            $(currentSlider.name).attr('fill', this.hsbColor()); // note hsbColor uses hslColor
            for (var k = 0; k< currentSlider.gradientStack.length;k++) {
                gradStack = currentSlider.gradientStack[k];
                switch (gradStack.type) {
                case 'filled-rect':
                  var fill = this[gradStack.colorFn]();
                  $('#' + gradStack.id).attr('fill', fill );
                  break;
                case 'fixed-gradient':
                  break;
                default:
                  Log.Error("hsbUpdateGradients: unknown fill type='" + gradStack.type + "'");
                    for (var j = 0; j< currentSlider.stops.length; j++) {
                        sliderStop = currentSlider.stops[j];
                        gradientStopSelector = getFullStopSelector(sliderStop);
                     $(gradientStopSelector).attr('stop-color', 
                                this.hsbStopColor(sliderStop.offset,currentSlider.component))
                    }
                    break;
                }
            }
    }
  };
    
  this.mode = 'rgb'; //or hsl or hsb
  this.toggleHslRgb = function (mode) {
        
    var slider;
    
    switch (mode) {
    case 'hsl': // switch to hsl
      for (var i = 0; i<this.hslSliders.length; i++) {
        slider = sliders[this.hslSliders[i]];
        slider.value = this[slider.component];
        slider.positionHslSlider();
      }

      d3.select(this.rgbSelector).style('display', 'none');
      d3.select(this.hsbSelector).style('display', 'none');
      d3.select(this.hslSelector).style('display', 'block');
            this.updateControls('hsl');
      break;
    case 'hsb': // swtich to hsb
      for (var i = 0; i<this.hsbSliders.length; i++) {
        slider = sliders[this.hsbSliders[i]];
        slider.value = this[slider.component];
        slider.positionHsbSlider();
      }

      d3.select(this.rgbSelector).style('display', 'none');
      d3.select(this.hslSelector).style('display', 'none');
      d3.select(this.hsbSelector).style('display', 'block');
            
            this.updateControls('hsb');
      break;
    case 'rgb':
        case 'rgbd': // switch to rgb
      for (var i = 0; i<this.sliders.length; i++) {
        slider = sliders[this.sliders[i]];
        slider.rgbValue = this[slider.component + "d"];
        slider.hexValue = this[slider.component];
        slider.positionRgbSlider();
      }
            
      d3.select(this.hslSelector).style('display', 'none');
      d3.select(this.hsbSelector).style('display', 'none');
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
        this.updateControls('hsb');
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
    case 'hsb':
      components = this.hsbComponents;
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
      if (component == 's' || component == 'l' || 
                component == 'sat' || component == 'brt') {
          valueDisplay = "" + valueDisplay + "%";
      }
      $(controlId)
                .text(valueDisplay)
                .attr('title', value);
    }
  };
  return this;
}

var Slider = function (sliderIndex, swatch, component) {

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
  this.call = [colorChange];
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
        switch(this.orientation) {
        case 'vertical':
                normValue = this.minY + value/this.fullScaleValue*this.displayWidth - this.skewY;
          break;
        case 'horizontal':
        default:
          var normValue = value * this.displayWidth / (this.maxX - this.minX)  - this.skewX;
          break;
        }

    return normValue;
  };
  this.sliderType = 'h'; // or s or l;
  
  this.positionHslSlider = function () {
    //this.swatch.rgb2hsl();
    this.value = this.swatch[this.component];
    var position = this.getPosition();
        //Log.Warning("positionHslSlider value=" + this.value + ",position=" + position);
        switch(this.orientation) {
        case 'vertical':
            d3.select(this.name).attr('y',position);
          break;
        case 'horizonal':
        default:
        d3.select(this.name).attr('x',position);
            break;
        }
  };
  
  this.call = [hslColorChange];
  this.callParent =  [hslSwatchUpdate];
  return this;
}


//////////////// HSB SLIDER //////////////////////////////////

var hsbSlider = function (sliderIndex, swatch, component) {
  //this.slider = generateSliderName(sliderIndex);
  this.name = generateSliderName(sliderIndex);
  this.swatch = swatch; // reference to swatch 
  this.stops = [{id:sliderIndex, offset: 0},
                {id:sliderIndex, offset: 100}];     
    this.gradientStack = []; // gradientStack will be series of rects for sat and brt and hue;
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
        switch(this.orientation) {
        case 'vertical':
                normValue = this.minY + value/this.fullScaleValue*this.displayWidth - this.skewY;
          break;
        case 'horizontal':
        default:
          var normValue = value * this.displayWidth / (this.maxX - this.minX)  - this.skewX;
          break;
        }
        return normValue;
  };
  this.sliderType = 'h'; // or s or l;
  
  this.positionHsbSlider = function () {
    //this.swatch.rgb2hsl();
    this.value = this.swatch[this.component];
    var position = this.getPosition();
        //Log.Warning("positionHsbSlider value=" + this.value + ",position=" + position);
        switch(this.orientation) {
        case 'vertical':
            d3.select(this.name).attr('y',position);
          break;
        case 'horizonal':
        default:
        d3.select(this.name).attr('x',position);
            break;
        }
  };
  
  this.call = [hsbColorChange];
  this.callParent =  [hsbSwatchUpdate];
  return this;
}

var rectField3Width = 48; // 32
var rectField4Width = 72; // 72

function writeSvg(appSelector) {
  var appId = appCounters.appIndex++;
  var app = d3.select(appSelector);
  var x = 0;
  var y = 0
  var width = sliderInfo.swatchLeftSpacing 
  + (sliderInfo.displayWidth +  sliderInfo.sliderSpacing) * (swatches.length - 1);
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

  var defs = svg
        .select("defs");
  defs
        .attr("id", "defs-" + appId);
  // make swatch area
  defs
        .append("path")
        .attr({id: "triangle-2",d:"M 5 0 L 10 10 L 0 10 Z"});

  defs
        .append("rect")
        .attr("id","rect-field-3")
        .attr("stroke", "hsl(180,0%,60%)")
        .attr("fill","none")
        .attr("stroke-width", 1)
        .attr("height", 15)
        .attr("width", rectField3Width);
  defs
        .append("rect")
        .attr("id","rect-field-4")
        .attr("stroke", "hsl(180,0%,60%)")
        .attr("fill","none")
        .attr("stroke-width", 1)
        .attr("height", 15)
        .attr("width", rectField4Width);
  defs
        .append("rect")
        .attr("id","rect-field-5")
        //.attr("stroke", "hsl(180,0%,60%)")
        .attr("stroke-width", 1)
        .attr("height", 15)
        .attr("width", rectField4Width);
                        
  
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
        var swatchLocation = swatchIndex-1;
    var swatchGroup = svg
        .append("g")
        .attr({
            id: "color-" + swatchIndex,
            transform: "translate(" 
            + parseFloat(sliderInfo.swatchLeftSpacing 
                        + ( sliderInfo.displayWidth + sliderInfo.swatchSpacing) * swatchLocation) 
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
        
        
    ///////////////////////// HSB SLIDER CODE ////////////////////////////////
    swatch.hsbSelector = swatch.name + "-hsb-sliders";
    var hsbSliderGroup = swatchGroup
        .append("g")
        .attr("id",  swatch.hsbSelector.substring(1))
        .style("display","none");
        
    var sliderArray = [];
    var componentIndex = 0; 
            
    for (var component in swatch.hsbComponents) {
      var sliderIndex = appCounters.sliderIndex++;
      sliderArray[sliderArray.length] = sliderIndex;
      sliders[sliderIndex] = new hsbSlider(sliderIndex, swatch, swatch.hsbComponents[component]);
      var slider = sliders[sliderIndex];
            
            
      var gradientName = generateGradientName();
      var gradientId = getGradientId(gradientName);
      var gradient = defs
        .append("linearGradient")
        .attr({id: gradientId})
        .attr(linearGradientAttrs);
        
      switch (swatch.hsbComponents[component]) {
      case 'hue':
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
                slider.gradientStack[0] = {id: "r-" + sliderIndex, type: 'fixed-gradient',
                                           colorFn: null, fill: "url(" + gradientName + ")" };
                slider.gradientStack[1] = {id: "r-" + sliderIndex + "-sat", type: 'filled-rect',
                                           colorFn: 'hsbSat',fill:'none'};
                slider.gradientStack[2] = {id: "r-" + sliderIndex + "-brt", type: 'filled-rect', 
                                           colorFn: 'hsbBrt',fill:'none'};
        break;
      case 'sat':
        slider.stops = [
          {id: sliderIndex, offset: 0, "stop-color": "white", "stop-opacity": "1.0"},
          {id: sliderIndex, offset: 100, "stop-color": "white", "stop-opacity": "0.0"}
        ];
        slider.fullScaleValue = 100;
        slider.minX = 0;
        slider.maxX = 100;
        slider.value = slider.getValue(100);
                
                slider.gradientStack[0] = {id: "r-" + sliderIndex + "-hue", type: 'filled-rect', 
                                           colorFn: 'hsbHue',fill:'none'};
                slider.gradientStack[1] = {id: "r-" + sliderIndex, type: 'fixed-gradient', colorFn: null, 
                                           fill: "url(" + gradientName + ")" };
                slider.gradientStack[2] = {id: "r-" + sliderIndex + "-brt", type: 'filled-rect',
                                            colorFn: 'hsbBrt',fill:'none'};
        break;
      case 'brt':
        slider.stops = [
          {id: sliderIndex, offset: 0, "stop-color": "black", "stop-opacity": "1.0"},
          {id: sliderIndex, offset: 100, "stop-color": "black", "stop-opacity": "0.0"}
        ];
        slider.fullScaleValue = 100;
        slider.minX = 0;
        slider.maxX = 100;
        slider.value = slider.getValue(100);
                                
                slider.gradientStack[0] = {id: "r-" + sliderIndex + "-hue", type: 'filled-rect', 
                                           colorFn: 'hsbHue',fill:'none'};
                slider.gradientStack[1] = {id: "r-" + sliderIndex + "-sat", type: 'filled-rect', 
                                           colorFn: 'hsbSat',fill:'none'};
                slider.gradientStack[2] = {id: "r-" + sliderIndex, type: 'fixed-gradient', 
                                           colorFn: null, 
                                           fill: "url(" + gradientName + ")" };
        break;
      }

//////////// Finish up Gradient Stops ////////////////////////
      for (var j = 0; j < slider.stops.length; j++) {
        var stop = slider.stops[j];
        var stopName = generateStopName(stop);
                stop.id = getStopId(stopName)
                stop.offset += "%";
        gradient
          .append("stop")
          .attr(stop);
      }
//////////////////// Gradient Stops Finished /////////////////

      for (var j = 0; j<slider.gradientStack.length;j++) {
                var gs = slider.gradientStack[j];
                hsbSliderGroup
                    .append("rect")
                    .attr(sliderRectAttrs)
                    .attr({
                            height: 5,
                            width: slider.displayWidth,
                            "id": gs.id,
                            "y": parseInt(sliderInfo.sliderStartY
                                + sliderInfo.sliderSpacing * componentIndex),
                            "fill": gs.fill
                    });
            }
            
            
      hsbSliderGroup
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
    
    swatch.hsbSliders = sliderArray;
        
    //////////////////////// END HSB SLIDER CODE//////////////////////////
        
        
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
                    var newMode = swatchList[2];
                    if (newMode == 'rgbd') {
                        newMode = 'rgb';
                    }
                    var swatchIndex = parseInt(swatchList[1]);
                                        
                    if (swatchList[1] == 'MAIN') {
                        swatchIndex = 0;
                    }
        
                    swatch = swatches[swatchIndex];
                    Log.Notice('toggleHslRgb newMode=' + newMode + ' swatchIndex=' + swatchIndex);
                    if (swatch.mode == newMode ) {
                        return;
                    }
                    switch (newMode) {
                    case 'hsl':
                        swatch.updateGradients();
                        swatch.hslUpdateGradients();
                        break;
                    case 'rgb':
                        swatch.hslUpdateGradients();
                        swatch.updateGradients();
                        break;
                    }
                    swatch.toggleHslRgb(newMode); 
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
      .attr("x", x + i * (rectField3Width+6))
      .attr("y", 0);
    rgbValues  
      .append("text")
      .attr("id", swatchId +  "-rgbd-" + component[comp])
      .attr("class","text")
      .attr("x", x + 3 + i * (rectField3Width+6))
      .attr("y", y)
      .text(swatch[component[comp]]);
    i++;
  }
    
  ////////////////////   HSL CONTROLS /////////////////////////
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
                    var newMode = swatchList[2];
                    if (newMode == 'rgbd') {
                        newMode = 'rgb';
                    }
                    var swatchIndex = parseInt(swatchList[1]);
                                        
                    if (swatchList[1] == 'MAIN') {
                        swatchIndex = 0;
                    }
        
                    swatch = swatches[swatchIndex];
                    Log.Notice('toggleHslRgb newMode=' + newMode + ' swatchIndex=' + swatchIndex);
                    if (swatch.mode == newMode ) {
                        return;
                    }
                    switch (newMode) {
                    case 'hsl':
                        swatch.updateGradients();
                        swatch.hslUpdateGradients();
                        break;
                    case 'rgb':
                        swatch.hslUpdateGradients();
                        swatch.updateGradients();
                        break;
                    }
                    swatch.toggleHslRgb(newMode);    
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

      if (component[comp] == 's' || component[comp] == 'l') {
        text += "%";
      } else {
                text += "&deg;";
            }

      hslValues
        .append("use")
        .attr("xlink:href", "#rect-field-3")
        .attr("x", x + i * (rectField3Width+6) )
        .attr("y", 0);
      hslValues  
        .append("text")
        .attr("id", swatchId +  "-hsl-" + component[comp])
        .attr("class","text")
        .attr("x", x + 3 + i * (rectField3Width+6))
        .attr("y", y)
        .text(text);
      i++;
  }
  
    ///////////////////////// HSB CONTROLS ////////////////////////
    
    x = 0;
  i = 0
  var hsbControls = controlGroup
      .append("g")
      .attr("id", swatchId + "-hsb-controls")
      .attr("transform", "translate(0,75)");
  
  hsbControls
      .append("text")
      .attr("id", swatchId + "-hsb-label")
      .attr("x", x)
      .attr("y", y)
      .attr("class","label pointer")
            .text("HSB")
            .on("click", function (d,i) {
                
                    var swatchId = d3.select(this).attr('id');
                    var swatchList = swatchId.split('-');
                    var newMode = swatchList[2];
                    
                    if (newMode == 'rgbd') {
                        newMode = 'rgb';
                    }
                    
                    var swatchIndex = parseInt(swatchList[1]);
                    
                    if (swatchList[1] == 'MAIN') {
                        swatchIndex = 0;
                    }
                    swatch = swatches[swatchIndex];
                    Log.Notice('toggleHslRgb newMode=' + newMode + ' swatchIndex=' + swatchIndex);
                    
                    if (swatch.mode == newMode ) {
                        return;
                    }
                    
                    switch (swatch.mode) {
                    case 'hsl':
                      swatch.hsl2rgb();
                      break;
                    case 'rgb':
                      swatch.rgb2hsl();
                      break;
                    case 'hsb':
                      swatch.hsb2rgb();
                      break;
                    }
                    
                    switch (newMode) {
                    case 'hsl':
                        swatch.updateGradients();
                        swatch.hsbUpdateGradients();
                        swatch.hslUpdateGradients();
                        break;
                    case 'rgb':
                        swatch.hslUpdateGradients();
                        swatch.hsbUpdateGradients();
                        swatch.updateGradients();
                        break;
                    case 'hsb':
                        swatch.updateGradients();
                        swatch.hslUpdateGradients();
                        swatch.hsbUpdateGradients();
                      break;
                    }
                    swatch.toggleHslRgb(newMode);    
                });
     
      
  x = 10;
  var hsbValues = hsbControls
      .append("g")
      .attr("id", swatchId + "-hsb-value")
      .attr("transform", "translate(30,0)");

  var component = ['hue','sat','brt'];
  var text;
  for (comp in component) {
        text = swatch[component[comp]];

        if (component[comp] == 'sat' || component[comp] == 'brt') {
            text += "%";
        } else {
            text += "&deg;";
        }

        hsbValues
            .append("use")
            .attr("xlink:href", "#rect-field-3")
            .attr("x", x + i * (rectField3Width+6) )
            .attr("y", 0);
        hsbValues  
            .append("text")
            .attr("id", swatchId +  "-hsb-" + component[comp])
            .attr("class","text")
            .attr("x", x + 3 + i * (rectField3Width+6))
            .attr("y", y)
            .text(text);
        i++;
  }
  
    
    ////////////////////// HEX CONTROLS //////////////////////////////
    
  x = 0;
  i = 0
  var hexControls = controlGroup
      .append("g")
      .attr("id", swatchId + "-hex-controls")
      .attr("transform", "translate(0,100)");
  
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
    // Log.Notice(".....generate TC");
    var baseColor = $('#baseColor').val();
    var theory = $('#theory option::selected').val();
    var angle = $('#angle').val();

  swatches[0].newColor(baseColor);
    generateTheoryColors(baseColor, theory, angle);
    return false;
}

function generateTheoryColors(baseColor, theory, angle) {
    var rgb = d3.rgb(baseColor);
    var hsl = rgb2hsl(rgb.r,rgb.g,rgb.b);
    var rd = rgb.r;
    var gd = rgb.g;
    var bd = rgb.b;
    var r = toHex(rd);
  var g = toHex(gd);
  var b = toHex(bd);
    var hexValue = hsl.hex;
    
//    var hsl;
//    if (r == g && g == b) { 
//    hsl = d3.hsl(rd/255*360, 0, rd/255);
//  } else {
//    hsl = rgb.hsl();
//  }
    var h = hsl.h;
    var s = Math.round(hsl.s * 1000)/10;
    var l = Math.round(hsl.l * 1000)/10;
    var sat = Math.round(hsl.sat * 1000)/10;
    var brt = Math.round(hsl.brt * 1000)/10;
    
    var TheoryColors = new Array();
    var toHsl = function (h, s, l) {
        var val = "hsl(" + h + "," + s + "%," + l + "%)"
        return val;
    }
    
    var brighter = function(l, k) {
         k = Math.pow(.7, arguments.length > 1 ? k : 1); 
         // Log.Notice('brighter l=' + l + ' k=' + k);
         return l/k;
    }
    var darker = function(l, k) {
         k = Math.pow(.7, arguments.length > 1 ? k : 1);
         // Log.Notice('darker l=' + l + ' k=' + k);
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
    var newRgb;
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
    case 'monochrom-1': 
    case 'monochrom-5':
    case 'monochrom-6':
      switch (theory) {
        case 'monochrom-1':
        monoType = 'val';
            break;
        case 'monochrom-5':
          monoType = 'sat-2';
            break;
        case 'monochrom-6':
          monoType = 'brt';
            break;
        }
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
            case 'sat-2':
              newSat = sat * monochromAngle * i;
                newBrt = brt;
                newRgb = hsb2rgb(h,newSat/100,newBrt/100);
                newHsl = rgb2hsl(newRgb.r,newRgb.g,newRgb.b);
                newS =  Math.round(newHsl.s*1000)/10;
                newL =  Math.round(newHsl.l*1000)/10;
                break;
            case 'brt':
              newSat = sat;
                newBrt = brt * monochromAngle * i;
                newRgb = hsb2rgb(h,newSat/100,newBrt/100);
                newHsl = rgb2hsl(newRgb.r,newRgb.g,newRgb.b);
                newS = Math.round(newHsl.s*1000)/10;
                newL = Math.round(newHsl.l*1000)/10;
                break;
            }
            Log.Notice('monoType=' + monoType + ', newS =' + newS + ', newL=' + newL);
            TheoryColors[TheoryColors.length] = toHsl(h,newS,newL);
        }
        break;
    case 'monochrom-3': // by darker
        newS = s/100;
        newL = l/100;
        for (var i = 6; i> 1; i--) {
            newL = darker(newL, i*monochromAngle); // 1/i
            TheoryColors[TheoryColors.length] = toHsl(h,Math.round(newS * 100),Math.round(newL * 100));
        }
        break;
    case 'monochrom-4': // by brighter

        newS = s/100;
        newL = l/100;
        for (var i = 6; i> 1; i--) {
            newL = brighter(newL, i*monochromAngle);
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

var rgb2hsl = function (r, g, b) {
    var hBuckets = 10;
    var buckets = 1000;
    var r1 = r;
    var g1 = g;
    var b1 = b;
    var min = Math.min(r /= 255, g /= 255, b /= 255),
        max = Math.max(r, g, b),
          d = max - min, h, s, l = (max + min) / 2;
    if (d) {
        s = l < .5 ? d / (max + min) : d / (2 - max - min);
        if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
        h = Math.round(h*60*hBuckets)/hBuckets;
    } else {
        h = Math.round(r1/255*360*hBuckets)/hBuckets;
        s = l > 0 && l < 1 ? 0 : max;
    }
    // now round s and l to correct value
    var sat,brt,hex;
    s = Math.round(s * buckets)/buckets;
    l = Math.round(l * buckets)/buckets;
    if (max == 0) {
        sat = 0;
    } else {
        sat = Math.round(((max-min)/max) * buckets)/buckets;
    }
    brt = Math.round((d + min) * buckets)/buckets;
    hex = "#" + toHex(r1) + toHex(g1) + toHex(b1);
  return {h:h,s:s,l:l,d:d,max:max,min:min,r:r1,g:g1,b:b1,x:0,y:0,brt:brt,sat:sat,hex:hex};
}

var cm_rgb = function (r, g, b) {
    this.hBuckets = 10;
    this.buckets = 1000;
    this.r1 = r;
    this.g1 = g;
    this.b1 = b;
    this.r = r;
    this.g = g;
    this.b = b;
    this.min = Math.min(this.r /= 255, g /= 255, this.b /= 255),
        this.max = Math.max(this.r, this.g, this.b),
          this.d = this.max - this.min, this.h, this.s, 
            this.l = (this.max + this.min) / 2;
    if (this.d) {
        this.s = this.l < .5 
               ? this.d / (this.max + this.min) 
               : this.d / (2 - this.max - this.min);
        if (this.r == this.max) {
            this.h = (this.g - this.b) / this.d + (this.g < this.b ? 6 : 0);
        } else 
        if (this.g == this.max) {
            this.h = (this.b - this.r) / this.d + 2;
        } else {
             this.h = (this.r - this.g) / this.d + 4;
           this.h = Math.round(this.h*60*this.hBuckets)/this.hBuckets;
        }
    } else {
        this.h = Math.round(this.r1/255*360*this.hBuckets)/this.hBuckets;
        this.s = this.l > 0 && this.l < 1 ? 0 : this.max;
    }

    // now round s and l to correct value
    this.s = Math.round(this.s * this.buckets)/this.buckets;
    this.l = Math.round(this.l * this.buckets)/this.buckets;
    this.brt = Math.round(((this.max-this.min)/this.max) * this.buckets)/this.buckets;
    this.sat = Math.round((this.d + this.min) * this.buckets)/this.buckets;
    this.hex = "#" + toHex(this.r1) + toHex(this.g1) + toHex(this.b1);

    return {h:this.h,s:this.s,l:this.l,d:this.d,max:this.max,min:this.min,r:this.r1,g:this.g1,b:this.b1,x:0,y:0,brt:this.brt,sat:this.sat,hex:this.hex};
};


var hsl2rgb = function (h, s, l) {
    var m1, m2;
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    l = l < 0 ? 0 : l > 1 ? 1 : l;
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
    m1 = 2 * l - m2;
    function v(h) {
        if (h > 360) h -= 360; else if (h < 0) h += 360;
        if (h < 60) return m1 + (m2 - m1) * h / 60;
        if (h < 180) return m2;
        if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
        return m1;
    }
    function vv(h) {
        return Math.round(v(h) * 255);
    }

    return d3.rgb(vv(h + 120), vv(h), vv(h - 120));
}

var cm_hsl = function (h, s, l) {

    this.h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    this.s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    this.l = l < 0 ? 0 : l > 1 ? 1 : l;
    this.m2 = this.l <= .5 ? this.l * (1 + this.s) : l + this.s - l * this.s;
    this.m1 = 2 * this.l - this.m2;
    this.v = function(h) {
        if (h > 360) h -= 360; else if (h < 0) h += 360;
        if (h < 60) return this.m1 + (this.m2 - this.m1) * h / 60;
        if (h < 180) return this.m2;
        if (h < 240) return this.m1 + (this.m2 - this.m1) * (240 - h) / 60;
        return this.m1;
    };
    this.vv = function(h) {
        return Math.round(this.v(h) * 255);
    };
  this.rgb = function () {
        return rgb2hsl(this.vv(this.h + 120), this.vv(this.h), this.vv(this.h - 120));
    };
    
    return this;
};


var hsb2rgb = function (hue, sat, brt) {
    while (hue < 0) {
        hue += 360;
    }
    var buckets = 2;
    var red = 0, green = 0, blue = 0;
    hue %= 360;
  var rgbHue = hueToRgbComponents(hue);
    
    red = (rgbHue.red * sat + 255 * (1-sat)) * brt;
    green = (rgbHue.green * sat + 255 * (1-sat)) * brt;
    blue = (rgbHue.blue * sat + 255 * (1-sat)) * brt;
    
    red = Math.round(Math.round(red*buckets)/buckets);
    green = Math.round(Math.round(green*buckets)/buckets);
    blue = Math.round(Math.round(blue*buckets)/buckets);
    return {r:red,g:green,b:blue,hue:hue,sat:sat,brt:brt,baseR:rgbHue.red,
       baseG:rgbHue.green,baseB:rgbHue.blue};
}

function hueToRgbComponents(hue) {
    var norm = 255/60; /// 4.25
    var red, green, blue;
     
    if (hue >= 0 && hue < 60) {
        red = 255; blue = 0; green = hue * norm;
    } else 
    if (hue >= 60 && hue < 120) {
        green = 255; blue = 0; red = (120 - hue) * norm;
    } else
    if (hue >= 120 && hue < 180) {
        green = 255; red = 0; blue = (hue - 120) * norm;
    } else
    if (hue >= 180 && hue < 240) {
        blue = 255; red = 0; green = (240 - hue) * norm;
    } else
    if (hue >= 240 && hue < 300) {
        blue = 255; green = 0; red = (hue - 240) * norm;
    } else
    if (hue >= 300 && hue <= 360) {
        red = 255; green = 0; blue = (360 - hue) * norm;
    } else {
        red = NaN; green = NaN; blue = NaN;
    }
    
    return {red:red,green:green,blue:blue};
    
}

//////////////// CHANGE COLOR THEORY /////////////////////

function changeColorTheory(inputId) {
    
    var propertyValue,localName,saveFunction;
    
    localName =  document.getElementById(inputId).localName;
    
    switch (localName) {
    case "input":
      saveFunction = "Data.saveInput";
      propertyValue = document.getElementById(inputId).value;
        break;
    case "select":
        saveFunction = "Data.saveSelect";
        propertyValue = $('#' + inputId + ' option::selected').attr('value');
        break;
    default: 
      Log.Error("changeColorTheory: Unknown localName='" + localName + "' for inputId=" + inputId);
        break;
    }

    var call = saveFunction + "('" + inputId + "','changeColorTheory'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
}

function toggleMainSwatchMode(inputId, mode) {
    //Log.Notice('toggleMainSwatchMode mode=' + mode);
    document.getElementById(inputId).value = mode;
    changeMainSwatchMode(inputId);
}

function changeMainSwatchMode(inputId) {

    mode = document.getElementById(inputId).value;
    switch (mode) {
    case 'hsb':
      d3.select('#hsb-from-rgb').style({display:'block'});
      d3.select('#hsl-from-rgb').style({display:'none'});
        d3.select('#mode-toggle-hsb').style({fill:'#AAA',stroke:'#FF0'});
        d3.select('#mode-toggle-hsl').style({fill:'#AAA',stroke:'#AAA'});
        swatches[0].mode = 'hsb';
        break;
    case 'hsl':
    default:
      d3.select('#hsb-from-rgb').style({display:'none'});
      d3.select('#hsl-from-rgb').style({display:'block'});
        d3.select('#mode-toggle-hsb').style({fill:'#AAA',stroke:'#AAA'});
        d3.select('#mode-toggle-hsl').style({fill:'#AAA',stroke:'#FF0'});
      swatches[0].mode = 'hsl';
        break;
    }

    var call = "Data.saveInput('" + inputId + "','changeMainSwatchMode'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
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