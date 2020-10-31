// color-conversion.js

var hsl2rgb = function (h, s, l) {

    let m1,
        m2,
        rgb = new Object();

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

    rgb.r = vv(h + 120);
    rgb.g = vv(h);
    rgb.b = vv(h - 120);
    rgb.a = 255;
    rgb.rgb = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
    rgb.hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
    rgb.h     = h;
    rgb.sat   = Math.round(s*1000)/1000;
    rgb.lev   = Math.round(l*1000)/1000;

    return rgb;
};

var hsb2rgb = function (hue, sat, brt) {
    while (hue < 0) {
        hue += 360;
    }

    hue %= 360;

    let buckets = 2,
        red = 0, 
        green = 0, 
        blue = 0,
        rgbHue = hueToRgbComponents(hue);

    red = (rgbHue.red * sat + 255 * (1-sat)) * brt;
    green = (rgbHue.green * sat + 255 * (1-sat)) * brt;
    blue = (rgbHue.blue * sat + 255 * (1-sat)) * brt;

    red = Math.round(Math.round(red*buckets)/buckets);
    green = Math.round(Math.round(green*buckets)/buckets);
    blue = Math.round(Math.round(blue*buckets)/buckets);

    return {r:red,g:green,b:blue,a:255,h:hue,sat:sat,brt:brt,
        rgb:'rgb(' + red + ',' + green + ',' + blue + ')',
        hex:'#' + toHex(red) + toHex(green) + toHex(blue)
    };
};

var hueToRgbComponents = function(hue) {
    let norm = 255/60, /// 4.25
        red,
        green,
        blue;

    if (hue >= 0 && hue < 60) {
        red = 255; blue = 0; green = Math.round(hue * norm);
    }
    else if (hue >= 60 && hue < 120) {
        green = 255; blue = 0; red = Math.round((120 - hue) * norm);
    }
    else if (hue >= 120 && hue < 180) {
        green = 255; red = 0; blue = Math.round((hue - 120) * norm);
    }
    else if (hue >= 180 && hue < 240) {
        blue = 255; red = 0; green = Math.round((240 - hue) * norm);
    }
    else if (hue >= 240 && hue < 300) {
        blue = 255; green = 0; red = Math.round((hue - 240) * norm);
    }
    else if (hue >= 300 && hue <= 360) {
        red = 255; green = 0; blue = Math.round((360 - hue) * norm);
    }
    else {
        red = NaN; green = NaN; blue = NaN;
    }

    return {red:red,green:green,blue:blue};
};


var rgb2hsl = function (r, g, b) {
    let hBuckets = 10,
        buckets = 1000,
        r1  = r,
        g1  = g,
        b1  = b,
        min = Math.min(r /= 255, g /= 255, b /= 255),
        max = Math.max(r, g, b),
        d   = max - min, 
        h, 
        s, 
        l = (max + min) / 2;

    if (d) {
        s = l < .5 ? d / (max + min) : d / (2 - max - min);
        if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
        h = Math.round(h*60*hBuckets)/hBuckets;
    } else {
        h = Math.round(r1/255*360*hBuckets)/hBuckets;
        s = l > 0 && l < 1 ? 0 : max;
    }

    // now round s and l to correct value
    s = Math.round(s * buckets)/buckets;
    l = Math.round(l * buckets)/buckets;
    if (max == 0) {
        sat = 0;
    } else {
        sat = Math.round(((max-min)/max) * buckets)/buckets;
    }
    brt = Math.round((d + min) * buckets)/buckets;
    hex = "#" + toHex(r1) + toHex(g1) + toHex(b1);

    return {h:h,s:s,l:l,d:d,max:max,min:min,r:r1,g:g1,b:b1,a:255,x:0,y:0,brt:brt,sat:sat,hex:hex};
};

// see https://en.wikipedia.org/wiki/HSL_and_HSV
var rgb2allColorModels = function (r, g, b) {
    let r1 = r,
        g1 = g,
        b1 = b,
        hBuckets = 10,
        buckets = 1000,
        model = new Object(),
        min = Math.min(r /= 255, g /= 255, b /= 255),
        max = Math.max(r, g, b),
        d = max - min, 
        h, s, 
        l = (max + min) / 2;

    if (d) {
        if (l == 1) {
            s = 0;
        } else {
            s = d/(1 - Math.abs(2*l-1));
        }
        if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
        h = Math.round(h*60*hBuckets)/hBuckets;
    } else {
        h = 0;
        s = 0;
    }

    model.hsl = new Object();
    model.hsb = new Object();
    model.hsi = new Object();
    model.hsl.h = model.hsb.h = model.hsi.h = 1*h; // puts value in.

    // now round s and l to correct value
    s = Math.round(s * buckets)/buckets;
    l = Math.round(l * buckets)/buckets;

    model.hsl.s = 1*s;
    model.hsl.l = 1*l;

    // hsb calculations
    let sat = (max == 0) ? 0 : Math.round(((max-min)/max) * buckets)/buckets,
        brt = Math.round((d + min) * buckets)/buckets;

    model.hsb.sat = 1*sat;
    model.hsb.brt = 1*brt;

    // hex model
    model.hexText =  "#" + toHex(r1) + toHex(g1) + toHex(b1);

    model.r = 1*r1;
    model.g = 1*g1;
    model.b = 1*b1;
    model.a = 255;
    model.chroma = new Object();
    model.chroma.rgb = hueToRgbComponents(h);

    model.rgbText = 'rgb(' + model.r + ',' + model.g + ',' + model.b + ')';
    model.hslText = 'hsl(' + model.hsl.h + ',' + (model.hsl.s*100) + '%,' + (model.hsl.l*100) + '%)';

    // hsi model
    let intensityPreRounding = (r+g+b)/3.000;

    model.hsi.int = Math.round(intensityPreRounding*buckets)/buckets;

    if ((max-min) != 0) {
        model.hsi.sat = Math.round((1 - min/intensityPreRounding)*buckets)/buckets
    } else {
        model.hsi.sat = 0;
    }

    return model;
};

var hsi2rgb = function (H, s, i) { // Note, H (hue) is unchanged in the function

    let r, g, b, x, y, z,
        h = H*Math.PI/180,
        buckets = 10000;

    if (h < 2*Math.PI/3) // 0 <= h < 120
    {
        x = i * (1 - s);
        y = i * (1 + s*(Math.cos(h)/Math.cos(Math.PI/3-h)));
        z = 3*i - (x + y);
        b = x;
        r = y;
        g = z;
    }
    else if ((2*Math.PI/3 <= h) && h < 4*Math.PI/3) // 120 < h < 240
    {
        h = h - 2*Math.PI/3;
        x = i * (1 - s);
        y = i * (1 + s*(Math.cos(h)/Math.cos(Math.PI/3-h)));
        z = 3*i - (x + y);
        r = x;
        g = y;
        b = z;
    }
    else // 240 <= h < 360
    {
        h = h - 4*Math.PI/3;
        x = i * (1 - s);
        y = i * (1 + s*(Math.cos(h)/Math.cos(Math.PI/3-h)));
        z = 3*i - (x + y);
        g = x;
        b = y;
        r = z;
    }

    r *= 255.0;
    g *= 255.0;
    b *= 255.0;

    while (r<0) r += 256;
    while (g<0) g += 256;
    while (b<0) b += 256;

    r = parseInt(Math.round(r*buckets)/buckets);
    g = parseInt(Math.round(g*buckets)/buckets);
    b = parseInt(Math.round(b*buckets)/buckets);

    return {h:H,s:s,i:i,r:r,g:g,b:b,a:255};
};
