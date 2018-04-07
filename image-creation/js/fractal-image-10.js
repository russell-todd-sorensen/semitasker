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

var fractalImage = function(canvasId,boxId,height,width) {
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
	this.heightToWidthRation = 1.0;
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
	this.counterMax = 1024;
	this.finiteMeasure = 5.0;
	this.counters = [];
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
	this.addToPixels = function (amount) {

		var modulus;
		for (var p = 0;p<this.pixels.length; p++) {
			modulus = (p+1)%4;
			if (modulus == 0) continue;
			this.pixels[p] = (255 + this.pixels[p] + amount*modulus)%255;
		}
		
		this.context.putImageData(this.imageData,0,0);
		return this.continueAnimation;
	};
	this.animationModulus = 360*100;
	this.animationIndex = 0;
	this.addToPixels2 = function (amount) {
		var hue,sat,brt,rgb;
		for (var p = 0;p<this.pixels.length; p+=4) {
			hue = (this.counters[p]+this.counterMax+this.animationIndex)%360;
			sat = (this.counters[p]+this.counterMax+this.animationIndex)%100/100;
			brt = 1.0;
			rgb = hsb2rgb(hue, sat, brt);
			this.pixels[p] = rgb.r;
			this.pixels[p+1] = rgb.g;
			this.pixels[p+2] = rgb.b;
			this.pixels[p+3] = 255;
		}
		
		this.context.putImageData(this.imageData,0,0);
		this.animationIndex += amount;
		return this.continueAnimation;
	};
	this.startAnimation = function (animationFunction,timeout, amount) {
		this.continueAnimation = true;
		if (timeout < 10) timeout = 10;
		scheduleFunction(animationFunction, timeout, true, true, amount);
	};
  this.stopAnimation = function() { 
    this.continueAnimation = false;
  };
	
	this.reDrawImage = function () {
		var newFactor = 1.0;
		this.rect.start.x = this.rectTmp.start.x;
		this.rect.start.y = this.rectTmp.start.y;
		this.rect.end.x = this.rectTmp.end.x;
		this.rect.end.y = this.rectTmp.end.y;
		this.calculateHeightAndWidth(newFactor);
		this.drawImage();
		return this.continueAnimation;
	};
	
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
