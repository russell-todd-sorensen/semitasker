

// pixelColors creates fractal.colors array and distribution graphic
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
            rgb=rgb2hsl(0,0,0); // black;
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

    data.referenceColors = referenceColors[data.refColorId];
    var rampFactor = data.rampFactor;
    var hueFactorFactor = data.hueFactor;
    var hueFactor = 3600*hueFactorFactor/fractal.counterMax;

    var offsetDiff,rgbStart,rgbNext;
    var length = data.referenceColors.length;
    var rgbInterval = {r:0,g:0,b:0};

    var colorStart = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};
    var colorNext  = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};
    var colorEnd   = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};

    tempRef = data.referenceColors[0];
    colorEnd.offset = 1.0;
    colorEnd.hue = parseFloat(tempRef.hue);
    colorEnd.sat = parseFloat(tempRef.sat);
    colorEnd.brt = parseFloat(tempRef.brt);

    for (var i = 0; i<length; i++) {
        colorStart = data.referenceColors[i]
        if (i+1 < length) {
            colorNext = data.referenceColors[i+1];
        } else {
            colorNext = colorEnd;
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
             rgbInterval.hex = '#' + toHex(rgbInterval.r) + toHex(rgbInterval.g) + toHex(rgbInterval.b);
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

    var minInt = data.minInt ? data.minInt : 0.0;
    var maxInt = data.maxInt ? data.maxInt : 1.0;
    minInt = minInt > maxInt ? maxInt : minInt;
    maxInt = maxInt < minInt ? minInt : maxInt;

    var hslOrHsb = data.hslOrHsb ? data.hslOrHsb : "hsl";

    var rampFactor = data.rampFactor;
    var hueFactorFactor = data.hueFactor;
    var hueFactor = 3600*hueFactorFactor/fractal.counterMax;

    var satFactor = Math.round(rampFactor*(maxSat-minSat));
    var brtFactor = Math.round(rampFactor*(maxBrt-minBrt));
    var levFactor = Math.round(rampFactor*(maxLevel-minLevel));
    var intFactor = Math.round(rampFactor*(maxInt-minInt));

    satFactor = satFactor == 0 ? 1 : satFactor;
    brtFactor = brtFactor == 0 ? 1 : brtFactor;
    levFactor = levFactor == 0 ? 1 : levFactor;
    intFactor = intFactor == 0 ? 1 : intFactor;

    for (var i = 0; i<fractal.counterMax+1; i++) {
        if (i == fractal.profile.maximum+1) {
            rgb=rgb2hsl(0,0,0); // black;
        } else {

            hue = ((Math.round(i*hueFactor+fractal.animationIndex))%360);
            sat = maxSat - ((i*satFactor+100+fractal.animationIndex)%(200*satFactor))/(200);
            brt = maxBrt - ((i*brtFactor+fractal.animationIndex)%(200*brtFactor))/(200);
            lev = maxLevel - ((i*levFactor+fractal.animationIndex)%(200*levFactor))/(200);
            int = maxInt - ((i*intFactor+fractal.animationIndex)%(200*intFactor))/(200);

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
            if (int < minInt) {
                int = minInt;
            }
            else if (int > maxInt) {
                int = maxInt;
            }

            switch (hslOrHsb) {
            case 'hsb':
                rgb = hsb2rgb(hue,sat,brt);
                break;
            case 'hsi':
                rgb = hsi2rgb(hue,sat,int);
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
            rgb=rgb2hsl(0,0,0); // black;
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

    var offsetDiff,tempRef;
    var length = data.referenceColors.length;
    var rgbInterval = {r:0,g:0,b:0};

    var colorStart = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};
    var colorNext  = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};
    var colorEnd   = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};

    tempRef = data.referenceColors[0];
    colorEnd.offset = 1.0;
    colorEnd.hue = parseFloat(tempRef.hue);
    colorEnd.sat = parseFloat(tempRef.sat);
    colorEnd.brt = parseFloat(tempRef.brt);

    for (var i = 0; i<length; i++) {
        colorStart = data.referenceColors[i]
        if (i+1 < length) {
            colorNext = data.referenceColors[i+1];
        } else {
            colorNext = colorEnd;
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
             rgbInterval = new Object();
             rgbInterval.r = Math.round(rgbStart.r*(1 - jFraction * c) + rgbNext.r*(jFraction * c));
             rgbInterval.g = Math.round(rgbStart.g*(1 - jFraction * c) + rgbNext.g*(jFraction * c));
             rgbInterval.b = Math.round(rgbStart.b*(1 - jFraction * c) + rgbNext.b*(jFraction * c));
             rgbInterval.hex = '#' + toHex(rgbInterval.r) + toHex(rgbInterval.g) + toHex(rgbInterval.b);
             fractal.colors[j] = rgbInterval;
        }
    }

    drawColors(data);
    return;
};

pixelColors[5] = function (data) {

    var objId = data.objId;
    var fractal = myFractalImages[objId];
    var hue,sat,brt,rgb,lev;
    fractal.colors = new Array();

    data.referenceColors = referenceColors[data.refColorId];
    var rampFactor = data.rampFactor;
    var hueFactor = 3600*data.hueFactor/fractal.counterMax;

    var offsetDiff,rgbStart,rgbNext;
    var length = data.referenceColors.length;
    var rgbInterval = {r:0,g:0,b:0,hex:'#000000'};


    var colorStart = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};
    var colorNext  = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};
    var colorEnd   = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};

    tempRef = data.referenceColors[0];
    colorEnd.offset = 1.0;
    colorEnd.hue = parseFloat(tempRef.hue);
    colorEnd.sat = parseFloat(tempRef.sat);
    colorEnd.brt = parseFloat(tempRef.brt);

    var startJ,endJ,jCount,jFraction;

    for (var i = 0; i<=fractal.counterMax;i++) {
        fractal.colors[i] = rgbInterval;
    }

    for (var i = 0; i<length; i++) {

        colorStart = data.referenceColors[i];

        if (i+1 < length) {
            colorNext = data.referenceColors[i+1];
        } else {
            colorNext = colorEnd;
        }

        offsetDiff = colorNext.offset - colorStart.offset;
        rgbStart = hsb2rgb(colorStart.hue,colorStart.sat,colorStart.brt);
        rgbNext = hsb2rgb(colorNext.hue,colorNext.sat,colorNext.brt);

        startJ =  Math.floor(fractal.counterMax*colorStart.offset);
        endJ = Math.ceil(fractal.counterMax*colorNext.offset) + 1;
        jCount = endJ - 1 - startJ;
        jFraction = 1/jCount;

        for (var j=startJ,c=0; j < endJ; j++,c++) {
             rgbInterval = new Object();
             rgbInterval.r = Math.round(rgbStart.r*(1 - jFraction * c) + rgbNext.r*(jFraction * c));
             rgbInterval.g = Math.round(rgbStart.g*(1 - jFraction * c) + rgbNext.g*(jFraction * c));
             rgbInterval.b = Math.round(rgbStart.b*(1 - jFraction * c) + rgbNext.b*(jFraction * c));
             rgbInterval.hex = '#' + toHex(rgbInterval.r) + toHex(rgbInterval.g) + toHex(rgbInterval.b);
             fractal.colors[(j+fractal.animationIndex)%(fractal.counterMax+1)] = rgbInterval;
        }
    }

    drawColors(data);
    return;
};

    
pixelColors[6] = function (data) {

    var objId = data.objId;
    var fractal = myFractalImages[objId];
    var hue,sat,brt,rgb,lev;
    fractal.colors = new Array();

    data.referenceColors = referenceColors[data.refColorId];
    var rampFactor = data.rampFactor;
    var hueFactor = 3600*data.hueFactor/fractal.counterMax;

    var offsetDiff,rgbStart,rgbNext;
    var length = data.referenceColors.length;
    var rgbInterval = {r:0,g:0,b:0,hex:'#000000'};


    var colorStart = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};
    var colorNext  = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};
    var colorEnd   = {offset:0.0,hue:0.0,brt:0.0,sat:0.0};

    tempRef = data.referenceColors[0];
    colorEnd.offset = 1.0;
    colorEnd.hue = parseFloat(tempRef.hue);
    colorEnd.sat = parseFloat(tempRef.sat);
    colorEnd.brt = parseFloat(tempRef.brt);

    var startJ,endJ,jCount,jFraction;

    for (var i = 0; i<=fractal.counterMax;i++) {
        fractal.colors[i] = rgbInterval;
    }

    for (var i = 0; i<length; i++) {

        colorStart = data.referenceColors[i];

        if (i+1 < length) {
            colorNext = data.referenceColors[i+1];
        } else {
            colorNext = colorEnd;
        }

        offsetDiff = colorNext.offset - colorStart.offset;
        rgbStart = hsb2rgb(colorStart.hue,colorStart.sat,colorStart.brt);
        rgbNext = hsb2rgb(colorNext.hue,colorNext.sat,colorNext.brt);

        startJ =  Math.floor(fractal.counterMax*colorStart.offset);
        endJ = Math.ceil(fractal.counterMax*colorNext.offset) + 1;
        jCount = endJ - 1 - startJ;
        jFraction = 1/jCount;

        for (var j=startJ,c=0; j < endJ; j++,c++) {
             if (j%2 == 0) {
                  rgbInterval = {r:0,g:0,b:0,a:0,hex:'#000000'}
             } else {
                 rgbInterval = new Object();
                 rgbInterval.r = Math.round(rgbStart.r*(1 - jFraction * c) + rgbNext.r*(jFraction * c));
                 rgbInterval.g = Math.round(rgbStart.g*(1 - jFraction * c) + rgbNext.g*(jFraction * c));
                 rgbInterval.b = Math.round(rgbStart.b*(1 - jFraction * c) + rgbNext.b*(jFraction * c));
                 rgbInterval.hex = '#' + toHex(rgbInterval.r) + toHex(rgbInterval.g) + toHex(rgbInterval.b);
             }

             fractal.colors[(j+fractal.animationIndex)%(fractal.counterMax+1)] = rgbInterval;
        }
    }

    drawColors(data);
    return;
};


pixelColors[7] = function (data) {

    var objId = data.objId;
    var fractal = myFractalImages[objId];
    var hue,sat,brt,rgb,lev,int;
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

    var minInt = data.minInt ? data.minInt : 0.0;
    var maxInt = data.maxInt ? data.maxInt : 1.0;
    minInt = minInt > maxInt ? maxInt : minInt;
    maxInt = maxInt < minInt ? minInt : maxInt;

    var hslOrHsb = data.hslOrHsb ? data.hslOrHsb : "hsl";

    var rampFactor = data.rampFactor;
    var hueFactorFactor = data.hueFactor;
    var hueFactor = 3600*hueFactorFactor/fractal.counterMax;

    var satFactor = Math.round(rampFactor*(maxSat-minSat));
    var brtFactor = Math.round(rampFactor*(maxBrt-minBrt));
    var levFactor = Math.round(rampFactor*(maxLevel-minLevel));
    var intFactor = Math.round(rampFactor*(maxInt-minInt));

    satFactor = satFactor == 0 ? 1 : satFactor;
    brtFactor = brtFactor == 0 ? 1 : brtFactor;
    levFactor = levFactor == 0 ? 1 : levFactor;
    intFactor = intFactor == 0 ? 1 : intFactor;

    for (var i = 0; i<fractal.counterMax+1; i++) {
    //for (var i = fractal.counterMax; i>-1; i--) { no worke
        if (i == fractal.profile.maximum+1) {
            rgb=rgb2hsl(0,0,0); // black;
        } else {
            hue = ((Math.round(i*hueFactor+fractal.animationIndex))%3600)/10;
            sat = maxSat   - ((i*satFactor+fractal.animationIndex)%200)*.005;
            brt = maxBrt   - ((i*brtFactor+fractal.animationIndex)%200)*.005;
            lev = maxLevel - ((i*levFactor+fractal.animationIndex)%200)*.005;
            int = maxInt   - ((i*intFactor+fractal.animationIndex)%200)*.005;

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
            if (int < minInt) {
                int = minInt;
            }
            else if (int > maxInt) {
                int = maxInt;
            }

            switch (hslOrHsb) {
            case 'hsb':
                rgb = hsb2rgb(hue,sat,brt);
                break;
          case 'hsi':
              rgb = hsi2rgb(hue,sat,int);
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
