

var myData = {
    objId:0,
    amount:0,
    pixelJump:4,
    pixelColorsId:1,
    scaleCounterId:0,
    refColorId:5,
    hueFactor:1.0,
    rampFactor:1.0,
    minLevel:0.5,
    maxLevel:0.5,
    minSat:1.0,
    maxSat:1.0,
    minBrt:1.0,
    maxBrt:1.0,
    hslOrHsb:"hsb"
};



var reDrawImage = function (data,animIndex) { 

  var objId = data.objId;
  var fractal = myFractalImages[objId];
  fractal.pixelImageWidth = 150;
  fractal.pixelImageHeight = 768;
  if (animIndex) {
        fractal.animationIndex = animIndex;
  }
  fractal.factor = 1.9;
  var newFactor = fractal.factor;
  fractal.rect.start.x = fractal.rectTmp.start.x;
  fractal.rect.start.y = fractal.rectTmp.start.y;
  fractal.rect.end.x = fractal.rectTmp.end.x;
  fractal.rect.end.y = fractal.rectTmp.end.y;
  fractal.calculateHeightAndWidth(newFactor);
  fractal.drawImage(data);
  return true;
};

var addToPixels = new Array();

addToPixels[18] = function (data) {
    var objId = data.objId;
    var animationSteps = data.amount;
    var fractal = myFractalImages[objId];
    //var height = fractal.height;
    //var width = fractal.width;
    var counter;
    var pixelJump = data.pixelJump;
    
    // pixelColors creates fractal.colors array and distribution graphic
    //pixelColors[2](data);
    pixelColors[data.pixelColorsId](data);
    
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
    //for (var i = fractal.counterMax; i>-1; i--) { no worke
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
};

var referenceColors = new Array();

referenceColors[0] = [
    {offset:0.0,hue:60.0,brt:0.95,sat:0.05},
    {offset:0.25,hue:180.0,brt:0.5,sat:0.75},
    {offset:0.35,hue:30.0,brt:0.95,sat:0.85},
    {offset:0.5,hue:300,brt:0.45,sat:.95},
    {offset:0.65,hue:205.0,brt:0.75,sat:0.45},
    {offset:0.85,hue:90.0,brt:0.35,sat:0.75},
];

referenceColors[1] = [
    {offset:0.0,hue:30.0,brt:0.75,sat:0.45},
    {offset:0.25,hue:100.0,brt:0.3,sat:0.95},
    {offset:0.35,hue:300.0,brt:0.95,sat:0.85},
    {offset:0.5,hue:200.0,brt:0.45,sat:.65},
    {offset:0.65,hue:75.0,brt:0.95,sat:0.05},
    {offset:0.85,hue:0.0,brt:0.35,sat:0.75},
];

referenceColors[2] = [
    {offset:0.0,hue:0.0,brt:1.0,sat:0.05},
    {offset:0.25,hue:40.0,brt:0.5,sat:0.95},
    {offset:0.5,hue:200.0,brt:0.85,sat:.65},
    {offset:0.75,hue:0.0,brt:0.35,sat:0.75}
];

referenceColors[3] = [
    {offset:0.0,hue:180.0,brt:0.839,sat:0.411},
    {offset:0.20,hue:120.0,brt:0.584,sat:0.55},
    {offset:0.40,hue:240.0,brt:0.361,sat:0.228},
    {offset:0.60,hue:0,brt:0.584,sat:0.55},
    {offset:0.80,hue:300.0,brt:0.224,sat:0.456},
];

referenceColors[4] = [
    {offset:0.0,hue:207.1,brt:0.884,sat:0.55},
    {offset:0.20,hue:147.1,brt:0.884,sat:0.55},
    {offset:0.40,hue:267.1,brt:0.884,sat:0.55},
    {offset:0.60,hue:27.1,brt:0.884,sat:0.55},
    {offset:0.80,hue:327.1,brt:0.884,sat:0.55},
];

referenceColors[5] = [
    {offset:0.0,hue:165.6,brt:0.38,sat:0.773},
    {offset:0.20,hue:352.4,brt:0.992,sat:0.312},
    {offset:0.40,hue:300,brt:0.722,sat:0.842},
    {offset:0.60,hue:56.1,brt:0.722,sat:0.842},
    {offset:0.80,hue:351.9,brt:0.722,sat:0.842},
];

pixelColors[1] = function (data) {
    
    var objId = data.objId;
    var fractal = myFractalImages[objId];
    var hue,sat,brt,rgb,lev;
    fractal.colors = new Array();
    
    data.referenceColors = referenceColors[data.refColorId];
    
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
    
        for (var j=startJ,c=0; j < endJ; j++,c++) {
             rgbInterval = new Array();
             rgbInterval.r = Math.round(rgbStart.r*(1 - jFraction * c) + rgbNext.r*(jFraction * c));
             rgbInterval.g = Math.round(rgbStart.g*(1 - jFraction * c) + rgbNext.g*(jFraction * c));
             rgbInterval.b = Math.round(rgbStart.b*(1 - jFraction * c) + rgbNext.b*(jFraction * c));
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
    
    //fractal.colorCanvasContext.save();
    //fractal.colorCanvasContext.setTransform(1,Math.PI/2,Math.PI/2,.5,0,0);
    for (var i = 0; i<fractal.counterMax+1;i++) {
    //for (var i = fractal.counterMax; i>-1;i--) {
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
    //fractal.colorCanvasContext.restore();
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
