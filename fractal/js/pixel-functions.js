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
  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump) {

    counter = fractal.counters[p];
    if (counter == fractal.profile.maximum+1) {
      rgb = {r:0,g:0,b:0}; // black;
    } else {
      hue = ((Math.round(counter*hueFactor+fractal.animationIndex))%3600)/10;
      sat = 1.000 - ((counter+100+fractal.animationIndex)%200)*.005 ;;
      lev = 1.000 - ((counter+fractal.animationIndex)%200)*.005 ;
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