
function generateTheoryColors(baseColor, theory, angle) {
    let rgb = d3.rgb(baseColor),
        hsl = rgb2hsl(rgb.r,rgb.g,rgb.b),
        rd = rgb.r,
        gd = rgb.g,
        bd = rgb.b,
        r = toHex(rd),
        g = toHex(gd),
        b = toHex(bd),
        hexValue = hsl.hex,
        h = hsl.h,
        s = Math.round(hsl.s * 1000)/10,
        l = Math.round(hsl.l * 1000)/10,
        sat = Math.round(hsl.sat * 1000)/10,
        brt = Math.round(hsl.brt * 1000)/10,
        TheoryColors = new Array();

    let toHsl = function (h, s, l) {
        return "hsl(" + h + "," + s + "%," + l + "%)"
    }

    let brighter = function(l, k) {
        k = Math.pow(.7, k?k:1); 
        return l/k;
    }

    let darker = function(l, k) {
        k = Math.pow(.7, k?k:1);
        return l*k;
    }

    TheoryColors[0] =  toHsl(h,s,l);

    let splitAngle = 0,
        splitPairs = 1,
        hueCompliment,
        dualHue,
        dualCompliment;

    angle = parseFloat(angle?angle:60);
    
    let monochromAngle = angle/360,
        monoType = "sat",
        newS = s,
        newL = l,
        newRgb;

    switch (theory) {
    case "compliment":
        if (h >= 180) {
            hueCompliment = h - 180;
        }
        else 
        if (h < 180) {
            hueCompliment = 180 + h;
        }
        TheoryColors[TheoryColors.length] = toHsl(hueCompliment,s,l);
        break;
    case "dual-compliment":
        if (h >= 180) {
            hueCompliment = h - 180;
        }
        else 
        if (h < 180) {
            hueCompliment = 180 + h;
        }
        TheoryColors[TheoryColors.length] = toHsl(hueCompliment,s,l);
        dualHue = (360 + h + angle)%360;
        dualCompliment = (180 + dualHue)%360;
        TheoryColors[TheoryColors.length] = toHsl(dualHue,s,l);
        TheoryColors[TheoryColors.length] = toHsl(dualCompliment,s,l);
        break;
    case "split-compliment-2":
        splitPairs = 2; // fall through
    case "split-compliment":
        splitAngle = 180;
        for (let i = 0; i < splitPairs; i++) {
            TheoryColors[TheoryColors.length] =  toHsl(Math.abs((h + 360 + splitAngle + angle*(i+1)))%360,s,l);
            TheoryColors[TheoryColors.length] =  toHsl(Math.abs((h + 360 + splitAngle - angle*(i+1)))%360,s,l);
        }
        break;
    case "analogous-2":
        splitPairs = 2; // fall through
    case "analogous":
        for (let i = 0; i < splitPairs; i++) {
            TheoryColors[TheoryColors.length] =  toHsl(Math.abs((h + 360 + splitAngle + angle*(i+1)))%360,s,l);
            TheoryColors[TheoryColors.length] =  toHsl(Math.abs((h + 360 + splitAngle - angle*(i+1)))%360,s,l);
        }
        break;
    case "monochrom-1": 
    case "monochrom-5":
    case "monochrom-6":
        switch (theory) {
        case "monochrom-1":
            monoType = "val";
            break;
        case "monochrom-5":
            monoType = "sat-2";
            break;
        case "monochrom-6":
            monoType = "brt";
            break;
        } 
        // NOTE: monochrom-1,5,6 fall through to monochrom-2
    case "monochrom-2": // by saturation 
        for (let i = 4; i>= 0; i--) {
            switch (monoType) {
            case "val":
                newS = s;
                newL = Math.round(l * monochromAngle * i);
                break;
            case "sat":
                newS = Math.round(s * monochromAngle * i);
                newL = l;
                break;
            case "sat-2":
                newSat = sat * monochromAngle * i;
                newBrt = brt;
                newRgb = hsb2rgb(h,newSat/100,newBrt/100);
                newHsl = rgb2hsl(newRgb.r,newRgb.g,newRgb.b);
                newS =  Math.round(newHsl.s*1000)/10;
                newL =  Math.round(newHsl.l*1000)/10;
                break;
            case "brt":
                newSat = sat;
                newBrt = brt * monochromAngle * i;
                newRgb = hsb2rgb(h,newSat/100,newBrt/100);
                newHsl = rgb2hsl(newRgb.r,newRgb.g,newRgb.b);
                newS = Math.round(newHsl.s*1000)/10;
                newL = Math.round(newHsl.l*1000)/10;
                break;
            }

            Log.Notice(`monoType='${monoType}', newS ='${newS}', newL='${newL}'`);
            TheoryColors[TheoryColors.length] = toHsl(h,newS,newL);
        }
        break;
    case "monochrom-3": // by darker
        newS = s/100;
        newL = l/100;
        for (let i = 6; i> 1; i--) {
            newL = darker(newL, i*monochromAngle); // 1/i
            TheoryColors[TheoryColors.length] = toHsl(h,Math.round(newS * 100),Math.round(newL * 100));
        }
        break;
    case "monochrom-4": // by brighter
        newS = s/100;
        newL = l/100;
        for (let i = 6; i> 1; i--) {
            newL = brighter(newL, i*monochromAngle);
            TheoryColors[TheoryColors.length] = toHsl(h,Math.round(newS * 100),Math.round(newL * 100));
        }
        break;
    }

    let swatchSlots = Theory[theory].slots,
        clearSlots = Theory[theory].clear;
    
    for (let i = 0; i < swatchSlots.length; i++) {
        swatchIndex = swatchSlots[i];
        swatches[swatchIndex].newColor(TheoryColors[i]);
    }
    
    for (let i = 0; i < clearSlots.length; i++) {
        swatchIndex = clearSlots[i];
        swatches[swatchIndex].newColor("#808080");
    }
    
    return TheoryColors;
}

var rgb2hsl = function (r, g, b) {
    let hBuckets = 10,
        buckets = 1000,
        r1 = r,
        g1 = g,
        b1 = b,
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
    let sat, brt, hex;

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

    hue %= 360;

    let buckets = 2,
        rgbHue = hueToRgbComponents(hue),
        red = (rgbHue.red * sat + 255 * (1-sat)) * brt,
        green = (rgbHue.green * sat + 255 * (1-sat)) * brt,
        blue = (rgbHue.blue * sat + 255 * (1-sat)) * brt;
    
    red = Math.round(Math.round(red*buckets)/buckets);     // ???
    green = Math.round(Math.round(green*buckets)/buckets); // ???
    blue = Math.round(Math.round(blue*buckets)/buckets);   // ???

    return {r:red,g:green,b:blue,
        hue:hue,sat:sat,brt:brt,
        baseR:rgbHue.red,
        baseG:rgbHue.green,
        baseB:rgbHue.blue,
    };
}

function hueToRgbComponents(hue) {
    let norm = 255/60, /// 4.25
        red, green, blue;
     
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
