// JavaScript Document
var addToPixels = [];

addToPixels[0] = null;

addToPixels[1] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var modulus;
  
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    modulus = (p+1)%4;
    if (modulus == 0) continue;
    fractal.pixels[p] = (255 + fractal.pixels[p] + amount*modulus)%255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[2] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];

  var hue,sat,brt,rgb;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    //hue = (fractal.counters[p]+fractal.counterMax+fractal.animationIndex)%360;
    hue = ((fractal.counters[p]*10+fractal.animationIndex)%360)/10;
    sat = (fractal.counters[p]+fractal.animationIndex)%100/100;
    brt = 1.0 - (fractal.counters[p]%100)/100;
    rgb = hsb2rgb(hue, sat, brt);
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[3] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];

  var hue,sat,brt,rgb;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    //hue = (fractal.counters[p]+fractal.counterMax+fractal.animationIndex)%360;
    hue = ((fractal.counters[p]+fractal.animationIndex)%3600)/10;
    sat = 1.0;
    brt = (fractal.counters[p]+fractal.counterMax+fractal.animationIndex)%100/100;
    rgb = hsb2rgb(hue, sat, brt);
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[4] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
      sat = (counter%8)*.125 + .125;
      brt = 1.0;
      rgb = hsb2rgb(hue, sat, brt);
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[5] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 2*360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
      sat = (counter%8)*.125 + .125;
      brt = 1.0;
      rgb = hsb2rgb(hue, sat, brt);
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[6] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 2*360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
      sat = 1.0;
      brt = (counter%8)*.125 + .125;
      rgb = hsb2rgb(hue, sat, brt);
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[7] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
      sat = 1.0;
      brt = ((counter+fractal.animationIndex)%20)*.05 + .125;
      rgb = hsb2rgb(hue, sat, brt);
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[8] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 2*360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
      sat = 1.0;
      brt = ((counter+fractal.animationIndex)%20)*.05 + .125;
      rgb = hsb2rgb(hue, sat, brt);
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[9] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
      sat = 1.0;
      brt = (counter%8)*.125 + .125;
      rgb = hsb2rgb(hue, sat, brt);
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};


addToPixels[10] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = (Math.round(counter*hueFactor*5+fractal.animationIndex)/10)%360;
      sat = 1.0;
      brt = (counter%8)*.125 + .125;
      rgb = hsb2rgb(hue, sat, brt);
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[11] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 2*360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      rgb = {r:255,g:255,b:255}; // white;
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[12] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 2*360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.animationIndex) {
      //rgb = {r:0,g:0,b:0}; // black;
      hue = (Math.round(counter*hueFactor*5+fractal.animationIndex)/10)%360;
      sat = 1.0;
      brt = (counter%8)*.125 + .125;
      rgb = hsb2rgb(hue, sat, brt);
    } else {
      rgb = {r:255,g:255,b:255}; // white;
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};


addToPixels[13] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 2*360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = (Math.round(counter*hueFactor+fractal.animationIndex)/10)%360;
      sat = 1.0;
      brt = ((counter+fractal.animationIndex)%30)*.015 + .5;
      rgb = hsb2rgb(hue, sat, brt);
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[14] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 2*360/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = ((Math.round(counter*hueFactor+fractal.animationIndex))%360);
      sat = (counter%8)*.125 + .125;
      brt = 1.200 - ((counter+fractal.animationIndex)%20)*.05 ;
      rgb = hsl2rgb(hue, (sat>.7?.7:sat), (brt>1?1:brt));
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[15] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 2*3600/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum+1) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = ((Math.round(counter*hueFactor+fractal.animationIndex))%3600)/10;
      sat = (counter%8)*.125 + .125;
      brt = 1.200 - ((counter+fractal.animationIndex)%200)*.005 ;
      rgb = hsl2rgb(hue, (sat>1?1:sat), (brt>1?1:brt));
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[16] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb,lev;
  var hueFactor = 2*3600/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
	
	var colors = [];
	for (var i = 0; i<fractal.counterMax+1; i++) {
	  if (i == fractal.profile.maximum+1) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = ((Math.round(i*hueFactor+fractal.animationIndex))%3600)/10;
      sat = 1.000 - ((i+100+fractal.animationIndex)%200)*.005 ;;
      lev = 1.000 - ((i+fractal.animationIndex)%200)*.005 ;
      if (lev < .05) {
        lev = .05;
      } 
      else if (lev > .95) {
        lev = .95;
      }
      rgb = hsl2rgb(hue, (sat>1?1:sat), lev);
    }
	  colors[i] = rgb;
	}
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];

    fractal.pixels[p+0] = colors[counter].r;
    fractal.pixels[p+1] = colors[counter].g;
    fractal.pixels[p+2] = colors[counter].b;
    fractal.pixels[p+3] = 255;
  }
  
  data.colors = colors;
	drawColors(data);
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[17] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb,lev;
  var hueFactor = 2*3600/fractal.counterMax;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum+1) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = ((Math.round(counter*hueFactor+fractal.animationIndex))%3600)/10;
      sat = 1.000 - ((counter+100+fractal.animationIndex)%200)*.005;
      lev = 1.000 - ((counter+fractal.animationIndex)%200)*.005;
      if (lev < .05) {
        lev = .05;
      } 
      else if (lev > .95) {
        lev = .95;
      }
      rgb = hsl2rgb(hue, (sat>1?1:sat), lev);
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[18] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];
  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	
	// pixelColors creates fractal.colors array and distribution graphic
	pixelColors[2](data);
	
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    
    counter = fractal.counters[p];
    fractal.pixels[p+0] = fractal.colors[counter].r;
    fractal.pixels[p+1] = fractal.colors[counter].g;
    fractal.pixels[p+2] = fractal.colors[counter].b;
    fractal.pixels[p+3] = 255;
  }

  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += animationSteps;
  return fractal.continueAnimation;
};

addToPixels[20] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];
  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	
	// pixelColors creates fractal.colors array and distribution graphic
	pixelColors[1](data);
	
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    
    counter = fractal.counters[p];
    fractal.pixels[p+0] = fractal.colors[counter].r;
    fractal.pixels[p+1] = fractal.colors[counter].g;
    fractal.pixels[p+2] = fractal.colors[counter].b;
    fractal.pixels[p+3] = 255;
  }

  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += animationSteps;
  return fractal.continueAnimation;
};
addToPixels[21] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];
  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	
	// pixelColors creates fractal.colors array and distribution graphic
	pixelColors[3](data);
	
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    
    counter = fractal.counters[p];
    fractal.pixels[p+0] = fractal.colors[counter].r;
    fractal.pixels[p+1] = fractal.colors[counter].g;
    fractal.pixels[p+2] = fractal.colors[counter].b;
    fractal.pixels[p+3] = 255;
  }

  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += animationSteps;
  return fractal.continueAnimation;
};


var pixelColors = new Array();
pixelColors[0] = function (data) {
	
  var objId = data.objId;
  var fractal = myFractalImages[objId];
  var hue,sat,brt,rgb,lev;
	fractal.colors = new Array();
	
	var minLevel = data.minLevel ? data.minLevel : .05;
	var maxLevel = data.maxLevel ? data.maxLevel : .95;
	minLevel = minLevel > maxLevel ? maxLevel : minLevel;
	maxLevel = maxLevel < minLevel ? minLevel : maxLevel;
	
	var minSat = data.minSat ? data.minSat : 0.0;
	var maxSat = data.maxSat ? data.maxSat : 1.0;
	minSat = minSat > maxSat ? maxSat : minSat;
	maxSat = maxSat < minSat ? minSat : maxSat;
	
	var minBrt = data.minBrt ? data.minBrt : 0.0;
	var maxBrt = data.maxBrt ? data.maxBrt : 1.0;
	minBrt = minBrt > maxBrt ? maxBrt : minBrt;
	maxBrt = maxBrt < minBrt ? minBrt : maxBrt;
	
	var hslOrHsb = data.hslOrHsb ? data.hslOrHsb : "hsl";
	
	
	var rampFactor = data.rampFactor;
	var hueFactorFactor = data.hueFactor;
  var hueFactor = 3600*hueFactorFactor/fractal.counterMax;
	
	var satFactor = Math.round(rampFactor*(maxSat-minSat));
	var brtFactor = Math.round(rampFactor*(maxBrt-minBrt));
	var levFactor = Math.round(rampFactor*(maxLevel-minLevel));
	
	satFactor = satFactor == 0 ? 1 : satFactor;
	brtFactor = brtFactor == 0 ? 1 : brtFactor;
	levFactor = levFactor == 0 ? 1 : levFactor;
	
	for (var i = 0; i<fractal.counterMax+1; i++) {
		if (i == fractal.profile.maximum+1) {
			rgb = {r:0,g:0,b:0}; // black;
		} else {
			hue = ((Math.round(i*hueFactor+fractal.animationIndex))%3600)/10;
			sat = 1.000 - ((i+100+fractal.animationIndex)%200)*.005;
			brt = 1.000 - ((i+fractal.animationIndex)%200)*.005;
			lev = 1.000 - ((i+fractal.animationIndex)%200)*.005 ;
			if (lev < minLevel) {
				lev = minLevel;
			} 
			else if (lev > maxLevel) {
				lev = maxLevel;
			}
			if (sat < minSat) {
				sat = minSat;
			} 
			else if (sat > maxSat) {
				sat = maxSat;
			}
			if (brt < minBrt) {
				brt = minBrt;
			} 
			else if (brt > maxBrt) {
				brt = maxBrt;
			}
			
			switch (hslOrHsb) {
			case 'hsb':
				rgb = hsb2rgb(hue,sat,brt);
				break;
			case 'hsl':
			default:
				rgb = hsl2rgb(hue, sat, lev);
				break;
			}
		}
		fractal.colors[i] = rgb;
  }
	drawColors(data);
	return;
}


pixelColors[1] = function (data) {

  var objId = data.objId;
  var fractal = myFractalImages[objId];
  var hue,sat,brt,rgb,lev;	
	fractal.colors = new Array();
	
	data.referenceColors = [
		{offset:0.0,hue:60.0,brt:1.0,sat:0.05},
		{offset:0.25,hue:180.0,brt:0.5,sat:0.75},
		{offset:0.35,hue:30.0,brt:0.95,sat:0.85},
		{offset:0.5,hue:300,brt:0.45,sat:.95},
		{offset:0.65,hue:205.0,brt:0.75,sat:0.45},
		{offset:0.85,hue:90.0,brt:0.35,sat:0.75},
	];

	var rampFactor = data.rampFactor;
	var hueFactorFactor = data.hueFactor;
  var hueFactor = 3600*hueFactorFactor/fractal.counterMax;
	
	var colorStart,colorNext,colorEnd,offsetDiff;
	var length = data.referenceColors.length;
	var rgbInterval = {r:0,g:0,b:0};
	colorEnd = data.referenceColors[0];
	
	for (var i = 0; i<length; i++) {
		colorStart = data.referenceColors[i]
		if (i+1 < length) {
			colorNext = data.referenceColors[i+1];
		} else {
			colorNext = colorEnd;
			colorNext.offset = 1.0;
		}
		offsetDiff = colorNext.offset - colorStart.offset;
		rgbStart = hsb2rgb(colorStart.hue,colorStart.sat,colorStart.brt);
		rgbNext = hsb2rgb(colorNext.hue,colorNext.sat,colorNext.brt);
		var startJ,endJ,jCount;
		startJ =  Math.floor(fractal.counterMax*colorStart.offset);
		endJ = Math.ceil(fractal.counterMax*colorNext.offset) + 1;
		jCount = endJ - 1 - startJ;
		jFraction = 1/jCount;
		for (var j=startJ,c=0; j< endJ; j++,c++) {
			 rgbInterval = new Array();
       rgbInterval.r = Math.round(rgbStart.r*( jFraction * c) + rgbNext.r*(1-jFraction * c));
       rgbInterval.g = Math.round(rgbStart.g*( jFraction * c) + rgbNext.g*(1-jFraction * c));
       rgbInterval.b = Math.round(rgbStart.b*( jFraction * c) + rgbNext.b*(1-jFraction * c));
		   fractal.colors[j] = rgbInterval;
		}
	}

	drawColors(data);
	return;
};

pixelColors[2] = function (data) {

  var objId = data.objId;
  var fractal = myFractalImages[objId];
  var hue,sat,brt,rgb,lev;	
	fractal.colors = new Array();
	
	var minLevel = data.minLevel ? data.minLevel : .05;
	var maxLevel = data.maxLevel ? data.maxLevel : .95;
	minLevel = minLevel > maxLevel ? maxLevel : minLevel;
	maxLevel = maxLevel < minLevel ? minLevel : maxLevel;
	
	var minSat = data.minSat ? data.minSat : 0.0;
	var maxSat = data.maxSat ? data.maxSat : 1.0;
	minSat = minSat > maxSat ? maxSat : minSat;
	maxSat = maxSat < minSat ? minSat : maxSat;
	
	var minBrt = data.minBrt ? data.minBrt : 0.0;
	var maxBrt = data.maxBrt ? data.maxBrt : 1.0;
	minBrt = minBrt > maxBrt ? maxBrt : minBrt;
	maxBrt = maxBrt < minBrt ? minBrt : maxBrt;
	
	var hslOrHsb = data.hslOrHsb ? data.hslOrHsb : "hsl";
	
	var rampFactor = data.rampFactor;
	var hueFactorFactor = data.hueFactor;
  var hueFactor = 3600*hueFactorFactor/fractal.counterMax;
	
	var satFactor = Math.round(rampFactor*(maxSat-minSat));
	var brtFactor = Math.round(rampFactor*(maxBrt-minBrt));
	var levFactor = Math.round(rampFactor*(maxLevel-minLevel));
	
	satFactor = satFactor == 0 ? 1 : satFactor;
	brtFactor = brtFactor == 0 ? 1 : brtFactor;
	levFactor = levFactor == 0 ? 1 : levFactor;
	
	for (var i = 0; i<fractal.counterMax+1; i++) {
		if (i == fractal.profile.maximum+1) {
			rgb = {r:0,g:0,b:0}; // black;
		} else {
			
			hue = ((Math.round(i*hueFactor+fractal.animationIndex))%360);
			sat = 1.000 - ((i+100+fractal.animationIndex)%(2*satFactor))/(2*satFactor);
			brt = 1.000 - ((i+fractal.animationIndex)%brtFactor)/brtFactor;
			lev = 1.000 - ((i+fractal.animationIndex)%levFactor)/levFactor;
			
			if (lev < minLevel) {
				lev = minLevel;
			} 
			else if (lev > maxLevel) {
				lev = maxLevel;
			}
			if (sat < minSat) {
				sat = minSat;
			} 
			else if (sat > maxSat) {
				sat = maxSat;
			}
			if (brt < minBrt) {
				brt = minBrt;
			} 
			else if (brt > maxBrt) {
				brt = maxBrt;
			}
			
			switch (hslOrHsb) {
			case 'hsb':
				rgb = hsb2rgb(hue,sat,brt);
				break;
			case 'hsl':
			default:
				rgb = hsl2rgb(hue, sat, lev);
				break;
			}
		}
		fractal.colors[i] = rgb;
  }
	drawColors(data);
	return;
}


pixelColors[3] = function (data) {

  var objId = data.objId;
  var fractal = myFractalImages[objId];
  var hue,sat,brt,rgb,lev;	
	fractal.colors = new Array();
	
	var minLevel = data.minLevel ? data.minLevel : .05;
	var maxLevel = data.maxLevel ? data.maxLevel : .95;
	minLevel = minLevel > maxLevel ? maxLevel : minLevel;
	maxLevel = maxLevel < minLevel ? minLevel : maxLevel;
	
	var minSat = data.minSat ? data.minSat : 0.0;
	var maxSat = data.maxSat ? data.maxSat : 1.0;
	minSat = minSat > maxSat ? maxSat : minSat;
	maxSat = maxSat < minSat ? minSat : maxSat;
	
	var minBrt = data.minBrt ? data.minBrt : 0.0;
	var maxBrt = data.maxBrt ? data.maxBrt : 1.0;
	minBrt = minBrt > maxBrt ? maxBrt : minBrt;
	maxBrt = maxBrt < minBrt ? minBrt : maxBrt;
	
	var hslOrHsb = data.hslOrHsb ? data.hslOrHsb : "hsl";
	

	var rampFactor = data.rampFactor;
	var hueFactorFactor = data.hueFactor;
  var hueFactor = 3600*hueFactorFactor/fractal.counterMax;
	
	var satFactor = Math.round(rampFactor*(maxSat-minSat));
	var brtFactor = Math.round(rampFactor*(maxBrt-minBrt));
	var levFactor = Math.round(rampFactor*(maxLevel-minLevel));
	
	satFactor = satFactor == 0 ? 1 : satFactor;
	brtFactor = brtFactor == 0 ? 1 : brtFactor;
	levFactor = levFactor == 0 ? 1 : levFactor;
	
	for (var i = 0; i<fractal.counterMax+1; i++) {
		if (i == fractal.profile.maximum+1) {
			rgb = {r:0,g:0,b:0}; // black;
		} else {
			hue = ((Math.round(i*hueFactor+fractal.animationIndex))%3600)/10;
			sat = maxSat - ((i+satFactor+fractal.animationIndex)%satFactor)/satFactor;
			brt = maxBrt - ((i+fractal.animationIndex)%brtFactor)/brtFactor;
			lev = maxLevel - ((i+fractal.animationIndex)%levFactor)/levFactor;
			if (lev < minLevel) {
				lev = minLevel;
			} 
			else if (lev > maxLevel) {
				lev = maxLevel;
			}
			if (sat < minSat) {
				sat = minSat;
			} 
			else if (sat > maxSat) {
				sat = maxSat;
			}
			if (brt < minBrt) {
				brt = minBrt;
			} 
			else if (brt > maxBrt) {
				brt = maxBrt;
			}
			
			switch (hslOrHsb) {
			case 'hsb':
				rgb = hsb2rgb(hue,sat,brt);
				break;
			case 'hsl':
			default:
				rgb = hsl2rgb(hue, sat, lev);
				break;
			}
		}
		fractal.colors[i] = rgb;
  }
	drawColors(data);
	return;
};

pixelColors[4] = function (data) {

  var objId = data.objId;
  var fractal = myFractalImages[objId];
  var hue,sat,brt,rgb,lev;	
	fractal.colors = new Array();
	
	data.referenceColors = [
		{offset:0.0,hue:60.0,brt:1.0,sat:0.05},
		{offset:0.25,hue:180.0,brt:0.5,sat:0.75},
		{offset:0.35,hue:30.0,brt:0.95,sat:0.85},
		{offset:0.5,hue:300,brt:0.45,sat:.95},
		{offset:0.65,hue:205.0,brt:0.75,sat:0.45},
		{offset:0.85,hue:90.0,brt:0.35,sat:0.75},
	];

	var rampFactor = data.rampFactor;
	var hueFactorFactor = data.hueFactor;
  var hueFactor = 3600*hueFactorFactor/fractal.counterMax;
	
	var colorStart,colorNext,colorEnd,offsetDiff;
	var length = data.referenceColors.length;
	var rgbInterval = {r:0,g:0,b:0};
	colorEnd = data.referenceColors[0];
	
	for (var i = 0; i<length; i++) {
		colorStart = data.referenceColors[i]
		if (i+1 < length) {
			colorNext = data.referenceColors[i+1];
		} else {
			colorNext = colorEnd;
			colorNext.offset = 1.0;
		}
		offsetDiff = colorNext.offset - colorStart.offset;
		rgbStart = hsb2rgb(colorStart.hue,colorStart.sat,colorStart.brt);
		rgbNext = hsb2rgb(colorNext.hue,colorNext.sat,colorNext.brt);
		var startJ,endJ,jCount;
		startJ =  Math.floor(fractal.counterMax*colorStart.offset);
		endJ = Math.ceil(fractal.counterMax*colorNext.offset) + 1;
		jCount = endJ - 1 - startJ;
		jFraction = 1/jCount;
		for (var j=startJ,c=0; j< endJ; j++,c++) {
			 rgbInterval = new Array();
       rgbInterval.r = Math.round(rgbStart.r*( jFraction * c) + rgbNext.r*(1-jFraction * c));
       rgbInterval.g = Math.round(rgbStart.g*( jFraction * c) + rgbNext.g*(1-jFraction * c));
       rgbInterval.b = Math.round(rgbStart.b*( jFraction * c) + rgbNext.b*(1-jFraction * c));
		   fractal.colors[j] = rgbInterval;
		}
	}

	drawColors(data);
	return;
};

var drawColors = function (data) {
	
  var objId = data.objId;
  var fractal = myFractalImages[objId];
  var height = fractal.pixelImageHeight;
  var width = fractal.pixelImageWidth;
	var profile = fractal.profile;
	
	var pixelsPerColor = Math.round(height*width/(fractal.counterMax+1));
	var pixelRowsPerColor =  Math.round(height/(fractal.counterMax+1));

	var colorCanvasPixels = fractal.colorCanvasPixels;
	
	for (var i = 0; i<fractal.counterMax+1;i++) {
		var color = fractal.colors[i];
		for (var r = 0; r<pixelRowsPerColor;r++) {
			var start = i*width*pixelRowsPerColor*4 + r*width*4;
			var end = start + 50*4 + profile.percents[i]*4;
			var end2 = start + width*4;
			for (var p = start; p < end; p+=4) {
			 	fractal.colorCanvasPixels[p+0] = color.r;
       	fractal.colorCanvasPixels[p+1] = color.g;
       	fractal.colorCanvasPixels[p+2] = color.b;
       	fractal.colorCanvasPixels[p+3] = 255;
			}
			for (var p = end; p < end2 ; p+=4) {
			 	fractal.colorCanvasPixels[p+0] = 0;
       	fractal.colorCanvasPixels[p+1] = 0;
       	fractal.colorCanvasPixels[p+2] = 0;
       	fractal.colorCanvasPixels[p+3] = 255;
			}
		}
	}
	fractal.colorCanvasContext.putImageData(fractal.colorCanvasImageData, 0, 0);
}

addToPixels[19] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var height = fractal.height;
  var width = fractal.width;
  var counter;
  var hue,sat,brt,rgb,lev;
	var hueFactorFactor = data.hueFactor;
	var minLevel = data.minLevel ? data.minLevel : .05;
	var maxLevel = data.maxLevel ? data.maxLevel : .95;
	var minSat = data.minSat ? data.minSat : 0.0;
	var maxSat = data.maxSat ? data.maxSat : 1.0;
	var minBrt = data.minBrt ? data.minBrt : 0.0;
	var maxBrt = data.maxBrt ? data.maxBrt : 1.0;
	var hslOrHsb = data.hslOrHsb ? data.hslOrHsb : "hsl";
  var hueFactor = 3600*hueFactorFactor/fractal.counterMax;
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    
    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum+1) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = ((Math.round(counter*hueFactor+fractal.animationIndex))%3600)/10;
      sat = 1.000 - ((counter+100+fractal.animationIndex)%200)*.005;
			brt = 1.000 - ((counter+fractal.animationIndex)%200)*.005;
      lev = 1.000 - ((counter+fractal.animationIndex)%200)*.005 ;
      if (lev < minLevel) {
        lev = minLevel;
      } 
      else if (lev > maxLevel) {
        lev = maxLevel;
      }
      if (sat < minSat) {
        sat = minSat;
      } 
      else if (sat > maxSat) {
        sat = maxSat;
      }
      if (brt < minBrt) {
        brt = minBrt;
      } 
      else if (brt > maxBrt) {
        brt = maxBrt;
      }
			
			switch (hslOrHsb) {
		  case 'hsb':
			  rgb = hsb2rgb(hue,sat,brt);
				break;
			case 'hsl':
			default:
        rgb = hsl2rgb(hue, sat, lev);
				break;
			}
    }
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[20] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];

  var hue,sat,brt,rgb;
	
  var pixelJump = data.pixelJump;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    //hue = (fractal.counters[p]+fractal.counterMax+fractal.animationIndex)%360;
    hue = ((fractal.counters[p]*10+fractal.animationIndex)%360)/10;
    sat = (fractal.counters[p]+fractal.animationIndex)%100/100;
    brt = 1.0 - (fractal.counters[p]%100)/100;
    rgb = hsb2rgb(hue, sat, brt);
    fractal.pixels[p] = rgb.r;
    fractal.pixels[p+1] = rgb.g;
    fractal.pixels[p+2] = rgb.b;
    fractal.pixels[p+3] = 255;
  }
  
  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[22] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];
  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	
	// pixelColors creates fractal.colors array and distribution graphic
	pixelColors[data.pixelColorsId](data);
	
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    
    counter = fractal.counters[p];
    fractal.pixels[p+0] = fractal.colors[counter].r;
    fractal.pixels[p+1] = fractal.colors[counter].g;
    fractal.pixels[p+2] = fractal.colors[counter].b;
    fractal.pixels[p+3] = 255-counter;
  }

  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += animationSteps;
  return fractal.continueAnimation;
};


addToPixels[23] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];

  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	
	// pixelColors creates fractal.colors array and distribution graphic
	pixelColors[data.pixelColorsId](data);
	
	
	var context = fractal.context;
	context.save();
	context.lineWidth = 1;
  var maxLines = 1000000;
	var lineCount = 0;
	var x,y,pixelIndex,offset;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    //currentIndex = 4*(this.width*row + col);
		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);
    counter = fractal.counters[p];
		if (counter > 20) {
			offset = 40;
		} else if ( counter < 10) {
			continue;
		} else {
			offset = 2 * counter;
		}
		context.setStrokeColor( '#' 
		+ toHex(fractal.colors[counter].r) 
		+ toHex(fractal.colors[counter].g)
		+ toHex(fractal.colors[counter].b)) ;//fractal.colors[counter].rgb;
		//context.setAlpha(counter/255);
		context.beginPath()
		context.moveTo(x,y);
		context.lineTo(x,y+offset);
		context.closePath();
		context.stroke();
    fractal.pixels[p+0] = fractal.colors[counter].r;
    fractal.pixels[p+1] = fractal.colors[counter].g;
    fractal.pixels[p+2] = fractal.colors[counter].b;
    fractal.pixels[p+3] = 255;
		
		if (lineCount++ > maxLines) {
			break;
		}
  }

  //fractal.context.putImageData(fractal.imageData,0,0);
	context.restore();
  fractal.animationIndex += animationSteps;
  return fractal.continueAnimation;
	//return false;
};

addToPixels[24] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];

  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	
	// pixelColors creates fractal.colors array and distribution graphic
	pixelColors[data.pixelColorsId](data);
	
	
	var context = fractal.context;
	//context.save();
	context.lineWidth = 1;
  var maxLines = 100000;
	var lineCount = 0;
	var x,y,pixelIndex,offset;
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    //currentIndex = 4*(this.width*row + col);
		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);
    counter = fractal.counters[p];
		if (counter > 250 || counter < 10) {
			continue;
			offset = 1;
		} else {
			offset = counter;
		}
		context.setStrokeColor( '#' 
		+ toHex(fractal.colors[counter].r) 
		+ toHex(fractal.colors[counter].g)
		+ toHex(fractal.colors[counter].b)) ;//fractal.colors[counter].rgb;
		context.setAlpha(counter/255);
		context.beginPath()
		context.moveTo(x,y);
		context.lineTo(x,y+offset);
		context.closePath();
		context.stroke();
    fractal.pixels[p+0] = fractal.colors[counter].r;
    fractal.pixels[p+1] = fractal.colors[counter].g;
    fractal.pixels[p+2] = fractal.colors[counter].b;
    fractal.pixels[p+3] = 255;
		
		if (lineCount++ > maxLines) {
			break;
		}
  }

  //fractal.context.putImageData(fractal.imageData,0,0);
	//context.restore();
  fractal.animationIndex += animationSteps;
  return fractal.continueAnimation;
	//return false;
};

addToPixels[25] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];

  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	var context = fractal.context;
	context.save();
	// pixelColors creates fractal.colors array and distribution graphic
	pixelColors[data.pixelColorsId](data);
	//context.setTransform(1,Math.PI/8,Math.PI/6,1,-300,-300);
	// first update all the pixels ?
	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
	     p+=pixelJump) 
	{
		//counter = fractal.counters[p];
	  //fractal.pixels[p+0] = fractal.colors[counter].r;
    //fractal.pixels[p+1] = fractal.colors[counter].g;
    //fractal.pixels[p+2] = fractal.colors[counter].b;
		fractal.pixels[p+0] = 255;
		fractal.pixels[p+1] = 255;
		fractal.pixels[p+2] = 255;
    fractal.pixels[p+3] = 255;
	}
	
	fractal.context.putImageData(fractal.imageData,0,0);
	
	

	context.lineWidth = 1;
  var maxLines = 1000000;
	var lineCount = 0;
	var x,y,pixelIndex,offset;

  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {
    //currentIndex = 4*(this.width*row + col);
		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);
    counter = fractal.counters[p];
		if (counter > 40 ) {
			offset = 80;
		} else if (counter < 5) {
			continue;
		} else {
			offset = counter*2;
		}
		context.setStrokeColor(fractal.colors[counter].hex) ;//fractal.colors[counter].rgb;
		//context.setAlpha(counter/255);
		context.beginPath()
		context.moveTo(x,y);
		context.lineTo(x,y+offset);
		context.closePath();
		context.stroke();
    fractal.pixels[p+0] = fractal.colors[counter].r;
    fractal.pixels[p+1] = fractal.colors[counter].g;
    fractal.pixels[p+2] = fractal.colors[counter].b;
    fractal.pixels[p+3] = 255;
		
		if (lineCount++ > maxLines) {
			break;
		}
  }
	context.restore();
  fractal.animationIndex += animationSteps;
  return fractal.continueAnimation;
	//return false;
};


addToPixels[26] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];

  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	var context = fractal.context;
	context.save();
	// pixelColors creates fractal.colors array and distribution graphic

	//context.setTransform(1,Math.PI/8,Math.PI/6,1,-300,-300);
	// first update all the pixels ?
	pixelColors[data.pixelColorsId](data);
	
	if (fractal.animationRow%fractal.height == 0) { // clear the decks	

		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump) 
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			//fractal.pixels[p+0] = 255;
			//fractal.pixels[p+1] = 255;
			//fractal.pixels[p+2] = 255;
			fractal.pixels[p+3] = 255;
		}
		
		fractal.context.putImageData(fractal.imageData,0,0);
		
	}

	context.lineWidth = 1;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
  var Rows = fractal.rowPolygons;
	var row,point;
	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++) { 
		row = Rows[rowIndex];
		point = 0;
		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			counter2 = row[point+1][1];
			height1 = scaleCounter[data.scaleCounterId](counter1);
			height2 = scaleCounter[data.scaleCounterId](counter2);
			
			context.beginPath();
		  context.moveTo(x1,rowIndex-height1);
			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height2);
				context.closePath();

				context.setFillColor(fractal.colors[counter1].hex);
		//context.setAlpha(counter/255);
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.setStrokeColor(fractal.colors[counter1].hex);
				context.stroke();
			}
			point++;
		}
		

  }
	context.restore();
  fractal.animationIndex += animationSteps;
	fractal.animationRow++;
  return fractal.continueAnimation;
	//return false;
};

addToPixels[27] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];

  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	var context = fractal.context;
	context.save();
	// pixelColors creates fractal.colors array and distribution graphic

	//context.setTransform(1,Math.PI/8,Math.PI/6,1,-300,-300);
	// first update all the pixels ?
	pixelColors[data.pixelColorsId](data);
	
	if (fractal.animationRow%fractal.height == 0) { // clear the decks	

		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump) 
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			//fractal.pixels[p+0] = 255;
			//fractal.pixels[p+1] = 255;
			//fractal.pixels[p+2] = 255;
			fractal.pixels[p+3] = 255;
		}
		
		fractal.context.putImageData(fractal.imageData,0,0);
		
	}

	context.lineWidth = 1;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
  var Rows = fractal.rowPolygons;
	var row,point;
	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++) { 
		row = Rows[rowIndex];
		point = 0;
		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			counter2 = row[point+1][1];
			//height1 = fractal.scaleCounter(counter1);
			//height2 = fractal.scaleCounter(counter2);
			height1 = scaleCounter[data.scaleCounterId](counter1);
			height2 = scaleCounter[data.scaleCounterId](counter2);
			context.beginPath();
		  context.moveTo(x1,rowIndex-height1);
			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height2);
				context.closePath();

				context.setFillColor(fractal.colors[counter1].hex);
				//context.setFillColor(fractal.colors[height1].hex);
				//context.setAlpha(counter/255);
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.setStrokeColor(fractal.colors[counter1].hex);
				//context.setStrokeColor(fractal.colors[height1].hex);
				context.stroke();
			}
			point++;
		}
		break;
  }
	context.restore();
  fractal.animationIndex += animationSteps;
	fractal.animationRow++;
  return fractal.continueAnimation;
	//return false;
};

addToPixels[28] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];

  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	var context = fractal.context;
	context.save();
	// pixelColors creates fractal.colors array and distribution graphic

	context.setTransform(1,.477,0,1,150,-250);
	// first update all the pixels ?
	pixelColors[data.pixelColorsId](data);
	
	if (fractal.animationRow%fractal.height == 0) { // clear the decks	

		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump) 
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;
		}
		
		fractal.context.putImageData(fractal.imageData,0,0);
		
	}

	context.lineWidth = 1;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
  var Rows = fractal.rowPolygons;
	var row,point;
	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++) { 
		row = Rows[rowIndex];
		point = 0;
		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			counter2 = row[point+1][1];
			//height1 = fractal.scaleCounter(counter1);
			//height2 = fractal.scaleCounter(counter2);
			height1 = scaleCounter[data.scaleCounterId](counter1);
			height2 = scaleCounter[data.scaleCounterId](counter2);
			context.beginPath();
		  context.moveTo(x1,rowIndex-height1);
			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height2);
				context.closePath();

				context.setFillColor(fractal.colors[counter1].hex);
				//context.setFillColor(fractal.colors[height1].hex);
				//context.setAlpha(counter/255);
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.setStrokeColor(fractal.colors[counter1].hex);
				//context.setStrokeColor(fractal.colors[height1].hex);
				context.stroke();
			}
			point++;
		}
		break;
  }
	context.restore();
  fractal.animationIndex += animationSteps;
	fractal.animationRow++;
  return fractal.continueAnimation;
	//return false;
};

addToPixels[29] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];

  //var height = fractal.height;
  //var width = fractal.width;
  var counter;
  var pixelJump = data.pixelJump;
	var context = fractal.context;
	context.save();
	// pixelColors creates fractal.colors array and distribution graphic

	//context.setTransform(1,.477,0,1,150,-250);
	// first update all the pixels ?
	pixelColors[data.pixelColorsId](data);
	
	if (fractal.animationRow%fractal.height == 0) { // clear the decks	

		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump) 
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;
		}
		
		fractal.context.putImageData(fractal.imageData,0,0);
		
	}

	context.lineWidth = 1;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
  var Rows = fractal.rowPolygons;
	var row,point;
	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++) { 
		row = Rows[rowIndex];
		point = 0;
		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			counter2 = row[point+1][1];
			//height1 = fractal.scaleCounter(counter1);
			//height2 = fractal.scaleCounter(counter2);
			height1 = scaleCounter[data.scaleCounterId](counter1);
			height2 = scaleCounter[data.scaleCounterId](counter2);
			context.beginPath();
		  context.moveTo(x1,rowIndex-height1);
			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height2);
				context.closePath();

				context.setFillColor(fractal.colors[counter1].hex);
				//context.setFillColor(fractal.colors[height1].hex);
				//context.setAlpha(counter/255);
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.setStrokeColor(fractal.colors[counter1].hex);
				//context.setStrokeColor(fractal.colors[height1].hex);
				context.stroke();
			}
			point++;
		}
		break;
  }
	context.restore();
  fractal.animationIndex += animationSteps;
	fractal.animationRow++;
  return fractal.continueAnimation;
	//return false;
};

addToPixels[30] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];

 
  var counter;
  var pixelJump = data.pixelJump;
	var context = fractal.context;
	context.save();

	//context.setTransform(1,.477,0,1,150,-250);
	// first update all the pixels ?
	pixelColors[data.pixelColorsId](data);
	
	if (fractal.animationRow%fractal.height == 0) { // clear the decks	

		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump) 
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;
		}
		
		fractal.context.putImageData(fractal.imageData,0,0);
		
	}

	context.lineWidth = 1;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
  var Rows = fractal.rowPolygons;
	var row,point;
	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++) { 
		row = Rows[rowIndex];
		point = 0;
		while (point < row.length-1) {
			x1 = row[point][0];
			
			x2 = row[point+1][0];
			counter1 = row[point][1];
			counter2 = row[point+1][1];

			height1 = scaleCounter[data.scaleCounterId](counter1);
			if (height1 == 1) {
				point++;
				continue;
			}
			height2 = scaleCounter[data.scaleCounterId](counter2);
			context.beginPath();
		  context.moveTo(x1,rowIndex-height1);
			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.closePath();
				// was counter1
				context.setFillColor(fractal.colors[255].hex);
				//context.setFillColor(fractal.colors[height1].hex);
				//context.setAlpha(counter/255);
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				// was counter1
				context.setStrokeColor(fractal.colors[255].hex);
				//context.setStrokeColor(fractal.colors[height1].hex);
				context.stroke();
			}
			point++;
		}
		break;
  }
	context.restore();
  fractal.animationIndex += animationSteps;
	fractal.animationRow++;
  return fractal.continueAnimation;
	//return false;
};

addToPixels[31] = function (data) {
  var objId = data.objId;
  var animationSteps = data.amount;
  var fractal = myFractalImages[objId];

 
  var counter;
  var pixelJump = data.pixelJump;
	var context = fractal.context;
	context.save();

	//context.setTransform(1,.477,0,1,150,-250);
	// first update all the pixels ?
	pixelColors[data.pixelColorsId](data);
	
	if (fractal.animationRow%fractal.height == 0) { // clear the decks	

		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump) 
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;
		}
		
		fractal.context.putImageData(fractal.imageData,0,0);
		
	}

	context.lineWidth = 1;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
  var Rows = fractal.rowPolygons;
	var row,point;
	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++) { 
		row = Rows[rowIndex];
		point = 0;
		while (point < row.length-1) {
			x1 = row[point][0];
			
			x2 = row[point+1][0];
			counter1 = row[point][1];
			counter2 = row[point+1][1];

			height1 = scaleCounter[data.scaleCounterId](counter1);
			if (height1 == 1) {
				point++;
				continue;
			}
			height2 = scaleCounter[data.scaleCounterId](counter2);
			context.beginPath();
		  context.moveTo(x1,rowIndex-height1);
			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.closePath();
				// was counter1
				context.setFillColor(fractal.colors[counter1].hex);
				//context.setFillColor(fractal.colors[height1].hex);
				//context.setAlpha(counter/255);
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				// was counter1
				context.setStrokeColor(fractal.colors[counter1].hex);
				//context.setStrokeColor(fractal.colors[height1].hex);
				context.stroke();
			}
			point++;
		}
		break;
  }
	context.restore();
  fractal.animationIndex += animationSteps;
	fractal.animationRow++;
  return fractal.continueAnimation;
	//return false;
};

var scaleCounter = new Array();
scaleCounter[0] = function (value) {
		if (value < 10) {
			return value * 5;
		} else if (value < 50) {
			return 50 + value;
		} else {
			return 100;
		}
};

scaleCounter[1] = function (value) {
		if (value < 11) {
			return value * 2;
		} else if (value < 50) {
			return 20 + 4*value;
		} else {
			return 200;
		}
};

scaleCounter[2] = function (value) {
		if (value < 19) {
			return value * 2;
		} else {
			return 80;
		}
};

scaleCounter[3] = function (value) {
		if (value < 19) {
			return value * 4;
		} else {
			return 120;
		}
};
scaleCounter[4] = function (value) {
		if (value < 26) {
			return value * 5;
		} else {
			return 130;
		}
};

scaleCounter[5] = function (value) {
		if (value < 20) {
			return value * 1;
		} else if (value < 50) {
			return 20 + value * 4;
		} else {
			return 140;
		}
};

scaleCounter[6] = function (value) {
		if (value < 200) {
			return 1;
		} else {
			return 50;
		}
};

scaleCounter[7] = function (value) {
		if (value > 100) {
			return 50;
		} else {
			return 1;
		}
};

scaleCounter[8] = function (value) {
		if (value > 75) {
			return 50;
		} else {
			return 1;
		}
};
scaleCounter[9] = function (value) {
		if (value > 65) {
			return 50;
		} else {
			return 1;
		}
};

scaleCounter[10] = function (value) {
		if (value > 50) {
			return 50;
		} else {
			return 1;
		}
};

scaleCounter[11] = function (value) {
		if (value > 35) {
			return 50;
		} else {
			return 1;
		}
};

scaleCounter[12] = function (value) {
		if (value > 25) {
			return 50;
		} else {
			return 1;
		}
};
