
var swatches = new Array();

class Swatch {
    name;
    swatchIndex;
    mode;
 
    rgbhComponents = ["r", "g", "b"];
    rgbdComponents = ["rd", "gd", "bd"];
    hslComponents  = ["h", "s", "l"];
    hsbComponents  = ["hue","sat","brt"];
    hexComponents  = ["hexValue"];

    components = {
        rgbh:this.rgbhComponents,
        rgbd:this.rgbdComponents,
        hsl:this.hslComponents,
        hsb:this.hsbComponents,
        hex:this.hexComponents,
    };

    rgbSelector = null;
    hslSelector = null;
    hsbSelector = null;
    r = "80";
    g = "80";
    b = "80";
    hexValue = "#808080";
    rd = 128;
    gd = 128;
    bd = 128;
    a = 1.0;
    h = 180;
    s = 0;
    l = 50;
    hue = 240;
    sat = 0;
    brt = 50;
    hsl = {};
    rgb = {};
    hsb = {};
    allColorComponents = {};

    sliders = [0,1,2];
    hslSliders = [3,4,5];

    constructor (name, swatchIndex, mode) {
        this.name = name;
        this.swatchSelectors = [name];
        this.swatchIndex = swatchIndex;
        this.mode = mode?mode:"rgb"; //or hsl or hsb
    }

    newColor (colorValue) {
        this.rgb = d3.rgb(colorValue);
        this.rd = this.rgb.r;
        this.gd = this.rgb.g;
        this.bd = this.rgb.b;
        this.allColorComponents = rgb2hsl(this.rd,this.gd,this.bd);
        this.r = toHex(this.rd);
        this.g = toHex(this.gd);
        this.b = toHex(this.bd);
        this.hsl = this.rgb.hsl();

        this.hsl = {
            h:this.allColorComponents.h,
            s:this.allColorComponents.s,
            l:this.allColorComponents.l,
        };

        this.h = this.hsl.h;
        this.s = Math.round(this.hsl.s * 1000)/10;
        this.l = Math.round(this.hsl.l * 1000)/10;

        this.hsb = {
            hue:this.allColorComponents.h,
            sat:this.allColorComponents.sat,
            brt:this.allColorComponents.brt,
        };
        
        this.hue = this.hsb.hue;
        this.sat = Math.round(this.hsb.sat * 1000)/10;
        this.brt = Math.round(this.hsb.brt * 1000)/10;
        
        this.hexValue = this.allColorComponents.hex;
        
        this.updateGradients();
        this.hslUpdateGradients();
        this.hsbUpdateGradients(); // NEEDS IMPLIMENTATION STILL

        // NOTE: sliders[] is a global var
        // this.sliders are sliders added to this swatch
        for (let i = 0; i < this.sliders.length; i++) {
            let slider = sliders[this.sliders[i]];
            slider.hexValue = this[slider.component];
            slider.positionRgbSlider();
        }
        for (let i = 0; i < this.hslSliders.length; i++) {
            let slider = sliders[this.hslSliders[i]];
            slider.value = this[slider.component];
            slider.positionHslSlider();
        }
        for (let i = 0; i < this.hsbSliders.length; i++) {
            let slider = sliders[this.hsbSliders[i]];
            slider.value = this[slider.component];
            slider.positionHsbSlider();
        }
        
        this.updateAllControls();

        let swatchColor;

        switch (this.mode) {
        case "hsb":
            swatchColor = this.hsbColor();
            break;
        case "hsl":
            swatchColor = this.hslColor();
            break;
        case "rgb":
        case "rgbd":
            swatchColor = this.color();
            break;
        }

        for (let i = 0; i< this.swatchSelectors.length; i++) {
            $(this.swatchSelectors[i]).attr("fill",swatchColor);
        }
    };


    hsl2rgb () {
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
        this.hexValue = "#" + this.r + this.g + this.b;
        return this.rgb;
    };


    rgb2hsl () {
        this.rd = toDecimal(this.r);
        this.gd = toDecimal(this.g);
        this.bd = toDecimal(this.b);
        this.rgb = d3.rgb(this.rd, this.gd, this.bd);

        this.allColorComponents = rgb2hsl(this.rd,this.gd,this.bd);

        this.hsl = this.rgb.hsl(); //?????

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
        this.hexValue = "#" + this.r + this.g + this.b;

        return this.hsl;
    };


    hsb2rgb () {
        this.hsb = hsb2rgb(this.hue, this.sat/100, this.brt/100);
        this.rd = this.hsb.r;
        this.gd = this.hsb.g;
        this.bd = this.hsb.b;
        this.r = toHex(this.hsb.r);
        this.g = toHex(this.hsb.g);
        this.b = toHex(this.hsb.b);

        this.rgb = d3.rgb(this.rd, this.gd, this.bd);

        this.allColorComponents = rgb2hsl(this.rd,this.gd,this.bd);
        
        this.hsl = this.rgb.hsl(); // ????

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

    color () {
        this.rgb2hsl();
        return "#" + this.r + this.g + this.b;
    };

    decimalColor () {
        this.rgb2hsl();
        return "rgba(" + this.rd + "," + this.gd + "," + this.bd + "," + this.a + ")";
    };

    hslColor () {
        this.hsl2rgb();
        return "hsl(" + this.h + "," + this.s + "%," + this.l + "%)";
    };

    hsbColor () {
        this.hsb2rgb();
        return "hsl(" + this.h + "," + this.s + "%," + this.l + "%)";
    };

    hsbHue () {
        let rgb = hueToRgbComponents(this.hue);
        return "rgba(" 
            + Math.round(rgb.red) 
            + "," 
            + Math.round(rgb.green) + "," 
            + Math.round(rgb.blue) + ",1.0)";
    };

    hsbSat () {
        let satInverse = Math.round(10*(100 - this.sat))/1000;
        return "rgba(255,255,255," + satInverse + ")";
    };

    hsbBrt = function () {
        let brtInverse = Math.round(10*(100 - this.brt))/1000;
        return "rgba(0,0,0," + brtInverse + ")";
    };

    stopColor (stopPercent, component) {

        let newVal = toHex(Math.round(stopPercent * 2.55)),
            r = this.r,
            g = this.g,
            b = this.b;
        
        switch (component) {
        case "r":
            r = newVal;
            break;
        case "g":
            g = newVal;
            break;
        case "b":
            b = newVal;
            break;
        }

        return "#" + r + g + b;
    };

    decimalStopColor (stopPercent, component) {

        let newVal = Math.round(stopPercent * 2.55),
            rd = this.rd,
            gd = this.gd,
            bd = this.bd;
        
        switch (component) {
        case "r":
            rd = newVal;
            break;
        case "g":
            gd = newVal;
            break;
        case "b":
            bd = newVal;
            break;
        }

        // the alpha component is not changed

        return "rgba(" + this.rd + "," + this.gd + "," + this.bd + "," + this.a + ")";
    };
    
    hslStopColor (stopPercent, component) {

        let h = this.h,
            s = this.s,
            l = this.l;
        
        switch (component) {
        case "h":
            h = Math.round(stopPercent * 3.6);
            break;
        case "s":
            s = stopPercent;
            break;
        case "l":
            l = stopPercent;
            break;
        }

        return "hsl(" + h + "," + s + "%," + l + "%)";
    };  

    hsbStopColor (stopPercent, component) {

        let hue = this.hue,
            sat = this.sat
            brt = this.brt,
            newrgb;
            
        switch (component) {
        case "hue":
            hue = (stopPercent * 3.6);
            break;
        case "sat":
            sat = stopPercent;
            break;
        case "brt":
            brt = stopPercent;
            break;
        }

        newrgb = hsb2rgb(hue, sat, brt);
        return "rgb(" + newrgb.r + "," + newrgb.g + "," + newrgb.b + ")";
    };

    updateGradients () {
        let currentSlider,
            sliderStop,
            gradientStopSelector;

        for (let i = 0; i < this.sliders.length; i++) {
            currentSlider = sliders[this.sliders[i]];
            $(currentSlider.name)
                .attr("fill", this.color());

            for (let j = 0; j< currentSlider.stops.length; j++) {
                sliderStop = currentSlider.stops[j];
                gradientStopSelector = getFullStopSelector(sliderStop);
                $(gradientStopSelector)
                    .attr("stop-color", this.stopColor(sliderStop.offset,currentSlider.component));
            }
        }
    };

    hslUpdateGradients () {
        let currentSlider,
            sliderStop,
            gradientStopSelector;

        for (let i = 0; i < this.hslSliders.length; i++) {
            currentSlider = sliders[this.hslSliders[i]];
            $(currentSlider.name)
                .attr("fill", this.hslColor());
            for (let j = 0; j< currentSlider.stops.length; j++) {
                sliderStop = currentSlider.stops[j];
                gradientStopSelector = getFullStopSelector(sliderStop);
                $(gradientStopSelector)
                    .attr("stop-color", this.hslStopColor(sliderStop.offset,currentSlider.component));
            }
        }
    };
    
    /////////// HSB UPDATE GRADIENTS /////////////////////////
    hsbUpdateGradients () {
        if (this.name == "#SWATCH-MAIN") {
            d3.select("#hsb-hue").attr("fill",this.hsbHue());
            d3.select("#hsb-sat").attr("fill",this.hsbSat());
            d3.select("#hsb-brt").attr("fill",this.hsbBrt());
        }

        let currentSlider,
            sliderStop,
            gradientStopSelector,
            gradStack,
            fill;

        for (let i = 0; i < this.hsbSliders.length; i++) {
            currentSlider = sliders[this.hsbSliders[i]];
            $(currentSlider.name)
                .attr("fill", this.hsbColor()); // note hsbColor uses hslColor

            for (let k = 0; k<currentSlider.gradientStack.length;k++) {
                gradStack = currentSlider.gradientStack[k];
                switch (gradStack.type) {
                case "filled-rect":
                    fill = this[gradStack.colorFn]();
                    $("#" + gradStack.id).attr("fill", fill);
                    break;
                case "fixed-gradient":
                    break;
                default:
                    Log.Error(`hsbUpdateGradients: unknown fill type='${gradStack.type}'`); // ???
                    for (let j = 0; j< currentSlider.stops.length; j++) {
                        sliderStop = currentSlider.stops[j];
                        gradientStopSelector = getFullStopSelector(sliderStop);
                        $(gradientStopSelector)
                            .attr("stop-color", this.hsbStopColor(sliderStop.offset,currentSlider.component))
                    }
                    break;
                }
            }
        }
    };
    
    toggleHslRgb (mode) {
            
        let slider;
        
        switch (mode) {
        case "hsl": // switch to hsl
            for (let i = 0; i<this.hslSliders.length; i++) {
                slider = sliders[this.hslSliders[i]];
                slider.value = this[slider.component];
                slider.positionHslSlider();
            }

            d3.select(this.rgbSelector).style("display", "none");
            d3.select(this.hsbSelector).style("display", "none");
            d3.select(this.hslSelector).style("display", "block");
            this.updateControls("hsl");
            break;
        case "hsb": // swtich to hsb
            for (let i = 0; i<this.hsbSliders.length; i++) {
                slider = sliders[this.hsbSliders[i]];
                slider.value = this[slider.component];
                slider.positionHsbSlider();
            }

            d3.select(this.rgbSelector).style("display", "none");
            d3.select(this.hslSelector).style("display", "none");
            d3.select(this.hsbSelector).style("display", "block");
            this.updateControls("hsb");
            break;
        case "rgb":
        case "rgbd": // switch to rgb
            for (var i = 0; i<this.sliders.length; i++) {
                slider = sliders[this.sliders[i]];
                slider.rgbValue = this[slider.component + "d"];
                slider.hexValue = this[slider.component];
                slider.positionRgbSlider();
            }
                    
            d3.select(this.hslSelector).style("display", "none");
            d3.select(this.hsbSelector).style("display", "none");
            d3.select(this.rgbSelector).style("display", "block");
            this.updateControls("rgbd");
            break;
        }

        this.updateControls("hex");
        this.mode = mode;
    };

    updateAllControls () {
        this.updateControls("rgbd");
        this.updateControls("hsl");
        this.updateControls("hsb");
        this.updateControls("hex");
    };

    updateControls (controlType) {
        
        let swatchName = this.name,
            typeConnect = "-" + controlType + "-",
            valueDisplay,
            components,
            component,
            controlId,
            value,
            decString;

        switch (controlType) {
        case "hsl":
            components = this.hslComponents;
            break;
        case "hsb":
            components = this.hsbComponents;
            break;
        case "rgb":
            components = this.rgbhComponents;
            break;
        case "rgbd":
            components = this.rgbdComponents;
            break;
        case "hex":
            components = this.hexComponents;
            break;
        }
        
        for (let i = 0; i< components.length; i++) {
            component = components[i];
            controlId = swatchName + typeConnect + component;
            value = this[component];
            decString = "" + value;
            if (decString.length > 8) {
                //console.log(`component=${component} value=${value} controlType=${controlType}`);
                this[component] = Math.round(value*10)/10;
                value = this[component];
            }
            valueDisplay = value;

            if (   component == "s" 
                || component == "l" 
                || component == "sat" 
                || component == "brt"
            ) {
                valueDisplay = "" + valueDisplay + "%";
            }

            $(controlId)
                .text(valueDisplay)
                .attr("title", value);
        }
    };
}

//  Helper functions

function getFullStopSelector (gradientStop) {
    return "#lg-" + gradientStop.id + "-" + gradientStop.offset;
}

function generateSwatchName(swatchIndex) {
    if (arguments.length == 0) {
        swatchIndex = appCounters.swatchIndex++;
    } 
    else 
    if (appCounters.swatchIndex <= swatchIndex) {
        appCounters.swatchIndex = swatchIndex + 1;
    } 
    return "#swatch-" + swatchIndex;
}

function getSwatchName(swatchIndex) {
    return "#swatch-" + swatchIndex;
};
