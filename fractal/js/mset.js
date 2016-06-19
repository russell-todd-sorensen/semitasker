// JavaScript Document

function logStartMove(evt) {
  Log.Notice('logStartMove was called evt.offsetX=' + evt.offsetX + ' evt.offsetY=' + evt.offsetY) 
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

function logDragMove(evt) {
  Log.Notice('logDragMove was called evt.offsetX=' + evt.offsetX + ' evt.offsetY=' + evt.offsetY) 
}

function logEndMove(evt) {
  Log.Notice('logEndMove was called evt.offsetX=' + evt.offsetX + ' evt.offsetY=' + evt.offsetY) 
}

//////////////////// THIS IS THE FRACTAL IMAGE OBJECT  /////////////////////////////////////////////

var colorCanvas;

var fractalImage = function(canvasId,boxId,height,width,startUpData) {
  this.id = canvasId;
  this.boxId = boxId;
  this.name = canvasId;
  this.mouseBox = '#' + canvasId;
  this.height = height;
  this.width = width;
  this.factor = 1.0;
  this.rect = {
    start: {
      x: -2.0,
      y: -1.5
    },
    end: {
      x: 2.0,
      y: 1.5
    }
  };
  this.rectTmp = {
    start: {
      x:-1.0,
      y:-1.0
    },
    end:{
      x:1.0,
      y:1.0
    }
  };
  this.dragStart = {
    x: 0.0,
    y: 0.0,
  };
  this.dragCurrent = {
    x: width,
    y: height,
  };
  this.dragEnd = {
    x: width,
    y: height,
  };
  this.dx = 2.0;
  this.dy = 2.0;
  this.heightToWidthRatio = 1.0;
  this.calculateHeightAndWidth = function (newFactor) {
    if (newFactor <= 2 || newFactor >= .2) {
      this.factor = newFactor;
    }
    this.dx = this.rect.end.x - this.rect.start.x;
    this.dy = this.rect.end.y - this.rect.start.y;
    this.heightToWidthRatio = this.dy/this.dx;
    
    Log.Debug('heightToWidthRatio=' + this.heightToWidthRatio);
    if (this.heightToWidthRatio >=1 ) {
      this.width = 500*this.factor;
    } else {
      this.width = 1000*this.factor;
    }
    this.height = this.width * this.heightToWidthRatio;
    
    this.height = Math.round(this.height);
    this.width = Math.round(this.width);
    
    Log.Debug('width=' + this.width + ' height=' + this.height);
  };
  this.canvas = null;
  this.context = null;
  this.imageData = null;
  this.pixels = null;
  this.counterMax = 255;
  this.finiteMeasure = 5.0;
  this.counters = [];
  this.profile = {};
    
  this.clearProfile = function () {
    this.profile = {
      counts: [],
      minimum: this.counterMax,
      maximum: 0,
      infinite: 0
    };
  };
  
  this.drawImage = function () {
   
    this.canvas = document.getElementById(this.id);
    this.canvas.setAttribute('height',this.height);
    this.canvas.setAttribute('width',this.width);
   
    if (!this.canvas || !this.canvas.getContext) {
      Log.Debug('doImageStuff: canvas or canvas.getContext not found');
      return;
    }
   
    this.context = this.canvas.getContext('2d');
   
    if (!this.context || !this.context.putImageData) {
      Log.Debug('doImageStuff: context or context.putImageData not found');
      return;
    }
   
    if (!this.context.createImageData) {
      Log.Debug('doImageStuff: context.createImage exists');
      this.imageData = this.context.createImageData (this.height, this.width);
    } else if (this.context.getImageData) {
      this.imageData = this.context.getImageData(0, 0, this.width, this.height);
      Log.Notice('doImageStuff: context.getImageData exists length=' 
          + this.imageData.data.length);
    } else {
      Log.Debug('doImageStuff: using default image creation method');
      this.imageData = {'width': this.width, 'height': this.height, 'data':new Array(this.width*this.height*4)};
    }
   
    this.pixels = this.imageData.data;

    for (var i=0, n=this.pixels.length; i<n; i++) {
      this.pixels[i] = 255;
      this.counters[i] = this.counterMax;
    }
    this.clearProfile();
    var counter;
    var finite;
    var value;
    var col = 0;
    var row = this.height-1;
    var print = 0;
    var index = 0;
    var currentIndex;
    //var numbers = d3.select('#numbers');

    for (var x = this.rect.start.x, col = 0; col<this.width 
           && x < this.rect.end.x ; x+=Math.abs((this.rect.end.x-this.rect.start.x)/this.width), col++) {
      for (var y = this.rect.start.y, row=this.height-1;row >= 0 
             && y < this.rect.end.y; y+=Math.abs((this.rect.end.y-this.rect.start.y)/this.height), row-- ) {
         counter = 0;
         finite = true;
         newX = x;
         newY = y;
         tmpX = x;
         tmpY = y;
         cY = y;
         cX = x;
         
         while (counter < this.counterMax && finite) {
        
           newY = cY +  2 * tmpX * tmpY;
           newX = cX + (-1 * tmpY * tmpY) + tmpX * tmpX;
           tmpX = newX;
           tmpY = newY;
           if (Math.abs(tmpX*tmpY) > this.finiteMeasure) {
             finite = false;
           }
           counter++;
         }
         counter--;
         // profile counters
         if (this.profile.counts[counter]) {
           this.profile.counts[counter]++;
         }
         else {
           this.profile.counts[counter] = 1;
           if (counter > this.profile.maximum) {
             this.profile.maximum = counter;
           }
           if (counter < this.profile.minimum) {
             this.profile.minimum = counter;
           }
         }
         
         value = Math.abs(255-8*counter)%255;
       
         currentIndex = 4*(this.width*row + col);
         this.counters[currentIndex] = counter;
         this.pixels[currentIndex++] = (128+value)%255; 
         this.pixels[currentIndex++] =(128+value)%255;
         this.pixels[currentIndex++] = Math.abs(value%8*counter);
         this.pixels[currentIndex] = 255
         index++;
       }
     }
     this.context.putImageData(this.imageData, 0, 0);
   };
  
  this.continueAnimation = false;

  this.animationModulus = 360*100;
  this.animationIndex = 0;
  
	if (arguments.length == 5) {
		// start somewhere besides beginning
		var prop;
		for (var propIndex in startUpData) {
			this[prop] = startUpData[prop];
		}
	}
  this.calculateHeightAndWidth(this.factor);
  this.callStartMove = [logStartMove,captureMouseUp,setupRect];
  this.callDragMove = [drawBox, logDragMove];
  this.callEndMove = [logEndMove,unbindMouseUp,calculateRect];
  return this;
};

var setupRect = function(evt) {
  var obj = evt.data;
  obj.target = evt.target;
  obj.height = evt.currentTarget.height;
  obj.width = evt.currentTarget.width;
  obj.offsetLeft = evt.pageX - evt.offsetX;
  obj.offsetTop = evt.pageY - evt.offsetY;

}

var drawBox = function(evt) {
  var obj = evt.data;
  
  if (obj.dragCurrent.y-obj.dragStart.y > 0) {
    obj.minY = obj.dragStart.y;
    obj.maxY = obj.dragCurrent.y;
  } else {
    obj.minY = obj.dragCurrent.y;
    obj.maxY = obj.dragStart.y;
  }
  
  if (obj.dragCurrent.x-obj.dragStart.x > 0) {
    obj.minX = obj.dragStart.x;
    obj.maxX = obj.dragCurrent.x;
  } else {
    obj.minX = obj.dragCurrent.x;
    obj.maxX = obj.dragStart.x;
  }
  var msg = 'drawBox top=' + (obj.minY-obj.offsetTop) + ' left = ' + (obj.minX-obj.offsetLeft) + ' height=' + (obj.maxY-obj.minY) + ' width=' + (obj.maxX-obj.minX);
  Log.Warning(msg);
  
  $('#' + obj.boxId).css({
    top:obj.minY-obj.offsetTop,
    left:obj.minX-obj.offsetLeft,
    height:obj.maxY-obj.minY,
    width:obj.maxX-obj.minX});
    
  Log.Debug('drawBox finished');
}

var calculateRect = function (evt)  {
  
  var obj = evt.data;
  var dxCurrent = obj.rect.end.x - obj.rect.start.x;
  var dyCurrent = obj.rect.end.y - obj.rect.start.y;
  var heightToWidthRatio = dyCurrent/dxCurrent;
  var height = obj.height*1.0;
  var width =  obj.width*1.0;
  
  var dxNew = (obj.maxX-obj.minX)/width*dxCurrent;
  var dyNew = (obj.maxY-obj.minY)/height*dyCurrent;
  
  var rectMinX = obj.rect.start.x + (obj.minX-obj.offsetLeft)*(obj.rect.end.x-obj.rect.start.x)/width;
  //var rectMinY = -(rect.start.y - ((obj.minY-obj.offsetTop)-height)*(rect.end.y-rect.start.y)/height) ;
  var rectMinY = (obj.rect.start.y + (height-(obj.maxY-obj.offsetTop))*(obj.rect.end.y-obj.rect.start.y)/height) ;
  var rectMaxX = obj.rect.end.x - (width-obj.maxX-obj.offsetLeft)*(obj.rect.end.x-obj.rect.start.x)/width;
  var rectMaxY = obj.rect.end.y - (obj.minY-obj.offsetTop)*(obj.rect.end.y-obj.rect.start.y)/height;
  Log.Debug('calculateRect \nwidth=' + width + '\nheight=' + height + '\nminX =' + obj.minX 
    + '\nminY=' + obj.minY + '\nmaxX=' + obj.maxX + '\nmaxY=' + obj.maxY 
    +  '\nrectMinX=' + rectMinX + '\nrectMinY=' + rectMinY + '\nrectMaxX=' + rectMaxX + '\nrectMaxY=' + rectMaxY);
  Log.Debug('calculateRect dxNew=' + dxNew + ' dyNew=' + dyNew);
  
  var rectTmp = obj.rectTmp;
  
  rectTmp.start.x = rectMinX;
  rectTmp.start.y = rectMinY;
  rectTmp.end.x = rectMaxX;
  rectTmp.end.y = rectMaxY;
}

var startAnimation = function (animationFunctionId,timeout, data) {
  var objId = data.objId;
  var animationFunction = addToPixels[animationFunctionId];
  var fractal = myFractalImages[objId];
  fractal.continueAnimation = true;
  if (timeout < 10) timeout = 10;
  scheduleFunction(animationFunction, timeout, true, true, data);
};

var stopAnimation = function() { 
  var formData = processForm();
  var data = formData.data;
  var objId = data.objId;
  var fractal = myFractalImages[objId];
  fractal.continueAnimation = false;
};

var reDrawImage = function () { 
  var formData = processForm();
  var data = formData.data
  var objId = data.objId;
  var fractal = myFractalImages[objId];
  var newFactor = 1.0;
  fractal.rect.start.x = fractal.rectTmp.start.x;
  fractal.rect.start.y = fractal.rectTmp.start.y;
  fractal.rect.end.x = fractal.rectTmp.end.x;
  fractal.rect.end.y = fractal.rectTmp.end.y;
  fractal.calculateHeightAndWidth(newFactor);
  fractal.drawImage();
  return fractal.continueAnimation;
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
  return {r:red,g:green,b:blue,h:hue,sat:sat,brt:brt};
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
