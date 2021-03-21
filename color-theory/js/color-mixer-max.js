// Color-Mixer App

var appCounters = {
    appIndex: 0,
    swatchIndex: 0,
    gradientIndex: 0,
    sliderIndex: 0,
    componentGroupIndex: 0,
};

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

        for (let i = 0; i < this.availableSlots.length; i++) {
            if (this.slots.indexOf(this.availableSlots[i]) == -1) {
                this.clear[this.clear.length] = this.availableSlots[i];
            }
        }
    }
}

Theory["compliment"] = new TheoryGroup("compliment", [3,4]);
Theory["dual-compliment"] = new TheoryGroup("dual-compliment",[3,1,2,4]);
Theory["split-compliment"] = new TheoryGroup("split-compliment", [3,2,4]);
Theory["split-compliment-2"] = new TheoryGroup("split-compliment-2", [3,2,4,1,5]);
Theory["analogous"] =   new TheoryGroup("analogous", [3,2,4]);
Theory["analogous-2"] = new TheoryGroup("analogous-2", [3,2,4,1,5]);
Theory["monochrom-1"] = new TheoryGroup("monochrom-1", [1,2,3,4,5]);
Theory["monochrom-2"] = new TheoryGroup("monochrom-2", [1,2,3,4,5]);
Theory["monochrom-3"] = new TheoryGroup("monochrom-3", [1,2,3,4,5]);
Theory["monochrom-4"] = new TheoryGroup("monochrom-4", [1,2,3,4,5]);
Theory["monochrom-5"] = new TheoryGroup("monochrom-5", [1,2,3,4,5]);
Theory["monochrom-6"] = new TheoryGroup("monochrom-6", [1,2,3,4,5]);

var linearGradientAttrs = {
    "gradientUnits": "objectBoundingBox",
    "color-interpolation": "sRGB"
}

var appInfo = {
    appTop: 350,
};

///// sliderDefaults can be replaced on an individual basis ///////////

var sliderDefaults = {
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
        return Math.ceil(sliderDefaults.sliderStartY + sliderDefaults.sliderHeight/2 + sliderDefaults.sliderSpacing * index);
    },
    sliderStartY: 20,
    swatchSpacing: 30,
    swatchLeftSpacing: 15,
};

var swatchRectAttrs = {
    x:0,
    y: -1 * sliderDefaults.displayWidth,
    height: sliderDefaults.displayWidth,
    width: sliderDefaults.displayWidth,
    fill:"#808080",
    stroke:"none",
    strokeWidth: 0,
};

var sliderRectAttrs = {
    x: 0,
    height: sliderDefaults.sliderHeight,
    width: sliderDefaults.displayWidth,
    fill: "url(#gradient-0)",
    stroke: "none",
};

var sliderHandleAttrs = {
    "x": sliderDefaults.x(0),
    "y": sliderDefaults.y(0),
    "minX": sliderDefaults.minX,
    "maxX": sliderDefaults.maxX,
    "xlink:href": sliderDefaults.href,
    "fill": sliderDefaults.fill,
    "stroke": sliderDefaults.stroke,
    "stroke-width": sliderDefaults.strokeWidth,
};

//////////////// Code to manage user/mouse generated slider position ////////////

var xyStart = new Object();

function startMove (evt) {

    let mouseX = evt.pageX,
        mouseY = evt.pageY,
        slider = evt.data.name,
        mouseBox = evt.data.mouseBox;
    
    xyStart["x"] = mouseX;
    xyStart["y"] = mouseY;
    xyStart[slider] = [parseFloat($(slider).attr("x")), parseFloat($(slider).attr("y"))];

    $(mouseBox)
        .bind("mousemove",evt.data,moveSlider)
        .bind("mouseup",evt.data,endMoveSlider);
}

function moveSlider (evt) {
    let mouseX = evt.pageX,
        mouseY = evt.pageY,
        dx = mouseX - xyStart["x"],
        dy = mouseY - xyStart["y"],
        slider = evt.data.name,
        skewX = evt.data.skewX,
        skewY = evt.data.skewY,
        currentX = xyStart[slider][0] + dx,
        currentY = xyStart[slider][1] + dy;
    
    if (currentX > evt.data.displayWidth-skewX) {
        currentX = evt.data.displayWidth-skewX;
    }
    else 
    if (currentX < evt.data.minX-skewX) {
        currentX = evt.data.minX-skewX;
    }
    
    if (currentY < evt.data.minY-skewY) {
        currentY = evt.data.minY-skewY;
    }
    else 
    if (currentY > evt.data.maxY-skewY) {
        currentY = evt.data.maxY-skewY;
    }
    
    evt.data.currentX = currentX;
    evt.data.currentY = currentY;

    switch (evt.data.orientation) {
    case "vertical":
        $(slider).attr("y", currentY);
        break;
    case "horizontal":
    default:
        $(slider).attr("x", currentX);
        break;
    }

    // callback functions
    for (let i = 0; i< evt.data.call.length; i++) {
        evt.data.call[i](evt);
    }
}

function endMoveSlider (evt) {
    moveSlider(evt);
    $(evt.data.mouseBox)
        .unbind("mousemove")
        .unbind("mouseup");
}

////////////////// End user/mouse slider event handling //////////////


var toHex = function (decimalNumber) {

    if (decimalNumber > 255) {
        return "??";
    }
 
    let hexChars = "0123456789ABCDEF",
        i = decimalNumber %16,
        j = (decimalNumber - i)/16;

    return hexChars.charAt(j) + hexChars.charAt(i);
}

function toDecimal(hexNumber) {
    let hexChars = "0123456789ABCDEF",
        decimalNumber = 0,
        hexCharValue,
        exponent = 0;

    for (let i = hexNumber.length-1; i>= 0; i--) {
        hexCharValue = hexChars.indexOf(hexNumber[i]);
        decimalNumber = decimalNumber + hexCharValue * Math.pow(16, exponent++);
    }

    return decimalNumber;
}

function colorChange(evt) {
    
    // calculate new color
    let hexValue;

    switch (evt.data.orientation) {
    case "vertical":
        alert("colorChange: vertical not implemented!");
        return;
    case "horizontal":
    default:
        let baseValue = evt.data.currentX + evt.data.skewX,
            normValue = baseValue/(evt.data.maxX - evt.data.minX),
            rgbValue = Math.round(255 * normValue);

        hexValue = toHex(rgbValue);
        break;
    }
    
    evt.data.hexValue = hexValue;
    evt.data.rgbValue = toDecimal(hexValue);

    for (let i = 0; i< evt.data.callParent.length; i++) {
        evt.data.callParent[i](evt);
    }
}

function hslColorChange(evt) {
    
    // calculate new color
    let baseValue,
        normValue,
        value;

    switch (evt.data.orientation) {
    case "vertical":
        baseValue = evt.data.currentY+evt.data.skewY,
        normValue = baseValue/evt.data.displayWidth;

        value = (evt.data.maxY - evt.data.minY) * normValue; // changed
        value = (value + Math.abs(evt.data.minY))*100/evt.data.displayWidth;
        break;
    case "horizontal":
    default:
        baseValue = evt.data.currentX+evt.data.skewX,
        normValue = baseValue/evt.data.displayWidth;

        value = Math.round((evt.data.maxX - evt.data.minX) * normValue);
        value = (evt.data.maxX - evt.data.minX) * normValue; // changed
        break;
    }

    evt.data.value = value;

    for (let i = 0; i< evt.data.callParent.length; i++) {
        evt.data.callParent[i](evt);
    }
}

function hsbColorChange(evt) {
    
    // calculate new color
    let baseValue,
        normValue,
        value;

    switch (evt.data.orientation) {
    case "vertical":
        baseValue = evt.data.currentY+evt.data.skewY;
        normValue = baseValue/evt.data.displayWidth;
        value = (evt.data.maxY - evt.data.minY) * normValue; // changed
        value = (value + Math.abs(evt.data.minY))*100/evt.data.displayWidth;
        break;
    case "horizontal":
    default:
        baseValue = evt.data.currentX+evt.data.skewX
        normValue = baseValue/evt.data.displayWidth;
        value = Math.round((evt.data.maxX - evt.data.minX) * normValue);
        value = (evt.data.maxX - evt.data.minX) * normValue; // changed
        break;
    }
    
    Log.Notice("hsbColorChange: baseValue=" + baseValue 
        + " normValue=" + normValue + " fullScaleValue="
        + evt.data.fullScaleValue + " value=" + value);

    evt.data.value = value;

    for (let i = 0; i< evt.data.callParent.length; i++) {
        evt.data.callParent[i](evt);
    }
}

 var swatchUpdate = function(evt) {
    let swatch = evt.data.swatch;

    swatch[evt.data.component] = evt.data.hexValue;

    for (var i = 0; i< swatch.swatchSelectors.length; i++) {
        $(swatch.swatchSelectors[i]).attr("fill",swatch.color());
    }

    swatch.updateAllControls();
    swatch.updateGradients();
}

function hslSwatchUpdate(evt) {
    let swatch = evt.data.swatch;

    swatch[evt.data.component] = evt.data.value;

    for (let i = 0; i< swatch.swatchSelectors.length; i++) {
        $(swatch.swatchSelectors[i]).attr("fill",swatch.hslColor());
    }

    swatch.updateAllControls();
    swatch.hslUpdateGradients();
}


 var hslMainSwatchUpdate = function(evt) {
    let swatch = evt.data.swatch;
    swatch[evt.data.component] = evt.data.value;
    let swatchColor = swatch.hslColor();

    for (var i = 0; i< swatch.swatchSelectors.length; i++) {
        $(swatch.swatchSelectors[i]).attr("fill",swatchColor);
    }

    var stops = [
        {id: "#stop-1", offset: 0,   opacity: 1.0, color: "#808080"},
        {id: "#stop-2", offset: 0,   opacity: 1.0, color: "#808080"},
        {id: "#stop-3", offset: 100, opacity: 0.0, color: "#808080"}
    ];
    
    let l = swatch.l,
        stop2Offset = Math.abs(100 - 2*l),
        stopHex = toHex(Math.round(2.55 * l)),
        stopColor = "#" + stopHex + stopHex + stopHex;
    
    for (let i = 0; i<stops.length; i++) {
        $(stops[i].id)
            .attr("stop-color", stopColor);

        if (stops[i].id == "#stop-2") {
            $(stops[i].id)
                .attr("offset", Math.floor(stop2Offset*1000)/1000 + "%")

        } else 
        if (stops[i].id == "#stop-3") {
            $(stops[i].id)
                .attr("stop-opacity", Math.floor(stop2Offset*10)/1000);
        }
    }

    swatch.hslUpdateGradients();
        
    let theory = $("#theory option:selected").val(),
        angle = $("#angle").val();

    $("#baseColor").val(swatchColor);
    Data.saveInput("baseColor");

    generateTheoryColors(swatchColor,theory,angle);
}

//////////////// HSB SWATCH UPDATES //////////////////////////////

function hsbSwatchUpdate(evt) {
    let swatch = evt.data.swatch,
        value = evt.data.value,
        swatchColor = swatch.hsbColor();

    swatch[evt.data.component] = value;

    Log.Notice("hsbSwatchUpdate value for " + evt.data.name 
        + " = " + value + " fullcolor =" + swatchColor);

    for (let i = 0; i< swatch.swatchSelectors.length; i++) {
        $(swatch.swatchSelectors[i]).attr("fill",swatchColor);
    }

    swatch.updateAllControls();
    swatch.hsbUpdateGradients();
}


function hsbMainSwatchUpdate(evt) {
    let swatch = evt.data.swatch,
        value = evt.data.value,
        component = evt.data.component;

    swatch[component] = value;
    let swatchColor = swatch.hsbColor();

    Log.Notice("hsbMainSwatchUpdate value for " + evt.data.name 
        + " = " + value + " fullcolor =" + swatchColor);

    for (let i = 0; i< swatch.swatchSelectors.length; i++) {
        $(swatch.swatchSelectors[i]).attr("fill",swatchColor);
    }

    let gradientStack = [],
        sliderIndex,
        gradientName;

    switch (component) {
    case "hue":
        sliderIndex = 6;
        gradientName = "#gradient-" + sliderIndex;
        gradientStack[0] = {id: "r-" + sliderIndex, type: "fixed-gradient",
            colorFn: null, fill: "url(" + gradientName + ")" };
        gradientStack[1] = {id: "r-" + sliderIndex + "-sat", type: "filled-rect",
            colorFn: "hsbSat",fill:"none"};
        gradientStack[2] = {id: "r-" + sliderIndex + "-brt", type: "filled-rect",
            colorFn: "hsbBrt",fill:"none"};
        break;
    case "sat":
        sliderIndex = 7;
            gradientName = "#gradient-" + sliderIndex;
        gradientStack[0] = {id: "r-" + sliderIndex + "-hue", type: "filled-rect", 
            colorFn: "hsbHue",fill:"none"};
        gradientStack[1] = {id: "r-" + sliderIndex, type: "fixed-gradient",
            colorFn: null, fill: "url(" + gradientName + ")" };
        gradientStack[2] = {id: "r-" + sliderIndex + "-brt", type: "filled-rect",
            colorFn: "hsbBrt",fill:"none"};
        break;
    case "brt":
        sliderIndex = 8;
        gradientName = "#gradient-" + sliderIndex;
        gradientStack[0] = {id: "r-" + sliderIndex + "-hue", type: "filled-rect", 
            colorFn: "hsbHue",fill:"none"};
        gradientStack[1] = {id: "r-" + sliderIndex + "-sat", type: "filled-rect", 
            colorFn: "hsbSat",fill:"none"};
        gradientStack[2] = {id: "r-" + sliderIndex, type: "fixed-gradient", 
            colorFn: null, fill: "url(" + gradientName + ")" };
        break;
    }
        
    swatch.hsbUpdateGradients();
    
    let theory = $("#theory option:selected").val(),
        angle = $("#angle").val();

    $("#baseColor").val(swatchColor);

    Data.saveInput("baseColor", "Data.restoreInput");
    generateTheoryColors(swatchColor,theory,angle);
}

class ComponentGroup {
    name;
    description;
    type;
    components = [];
    constructor(name, description, type, definition) {
        this.name = name;
        this.description = description;
        this.type = type;

        for (let i = 0; i < definition.length; i++) {
            let component = definition[i],
                cname = component.name,
                ctype = component.type;

            this.components[i] = cname;

            if (!ctype) { // if type == undefined
                ctype = "external";
            }

            this[cname] = {name: cname, "default": component.default, "type": ctype };
        }

        return this;
    }
}

var Components = [];

Components[appCounters.componentGroupIndex++] = new ComponentGroup (
    "rgbh", 
    "RGB Components in Hexidecimal", 
    "internal",
    [
        {name: "r",default: "80"},
        {name: "g",default: "80"},
        {name: "b", default: "80"},
        {name: "a", type: "internal", default: 1.0}
    ],
);

Components[appCounters.componentGroupIndex++] = new ComponentGroup (
    "hex", 
    "HexaDecimal Value", 
    "external",
    [{name: "hexValue", default: "#808080", type: "external"}],
);

Components[appCounters.componentGroupIndex++] = new ComponentGroup (
    "rgbd", 
    "RGB Components in Decimal", 
    "external",
    [
        {name: "rd", default: 128},
        {name: "gd", default: 128},
        {name: "bd", default: 128},
        {name: "ad", type: "internal", default: 1.0}
    ],
);

Components[appCounters.componentGroupIndex++] = new ComponentGroup (
    "rgba", 
    "RGBA Components in Decimal", 
    "internal",
    [
        {name: "rad",default: 128},
        {name: "gad", default: 128},
        {name: "bad", default: 128},
        {name: "aad", default: 1.0}
    ]
);

Components[appCounters.componentGroupIndex++] = new ComponentGroup (
    "hsl", 
    "HSL Components in Degrees and Percent", 
    "external",
    [
        {name: "h", default: 180},
        {name: "s", default: 0},
        {name: "l", default: 50}
    ]
);

Components[appCounters.componentGroupIndex++] = new ComponentGroup (
    "hsb", 
    "Hue,Saturation and Brightness in Degrees and Percent", 
    "external",
    [
        {name: "h", default: 180},
        {name: "sat", default: 0},
        {name: "brt", default: 50}
    ]
);

var rectField3Width = 48; // 32
var rectField4Width = 72; // 72

//***************** ***********************//
function generateTC( ) {
    // Log.Notice(".....generate TC");
    var baseColor = $("#baseColor").val();
    var theory = $("#theory option:selected").val();
    var angle = $("#angle").val();

    swatches[0].newColor(baseColor);
    generateTheoryColors(baseColor, theory, angle);
    return false;
}

//////////////// CHANGE COLOR THEORY /////////////////////

function changeColorTheory(inputId) {
    
    let localName = document.getElementById(inputId).localName,
        propertyValue,
        saveFunction,
        call;
    
    switch (localName) {
    case "input":
        saveFunction = "Data.saveInput";
        propertyValue = document.getElementById(inputId).value;
        break;
    case "select":
        saveFunction = "Data.saveSelect";
        propertyValue = $(`#${inputId} option:selected`).attr("value");
        break;
    default: 
        Log.Error(`changeColorTheory: Unknown localName='${localName}' for inputId='${inputId}'`);
        break;
    }

    call = `${saveFunction}("${inputId}","changeColorTheory"`;

    for (let i = 1; i< arguments.length; i++) {
        call = `${call}","${arguments[i]}"`;
    }
    
    call += ");";
    setTimeout(call, 10);

    return false;
}


/////////////////////////////////////////////////////////////////////////////////

function toggleMainSwatchMode(inputId, mode) {
    //Log.Notice("toggleMainSwatchMode mode=" + mode);
    document.getElementById(inputId).value = mode;
    changeMainSwatchMode(inputId);
}

function changeMainSwatchMode(inputId) {

    let mode = document.getElementById(inputId).value,
        call;

    switch (mode) {
    case "hsb":
        d3.select("#hsb-from-rgb").style({display:"block"});
        d3.select("#hsl-from-rgb").style({display:"none"});
        d3.select("#mode-toggle-hsb").style({fill:"#AAA",stroke:"#FF0"});
        d3.select("#mode-toggle-hsl").style({fill:"#AAA",stroke:"#AAA"});
        swatches[0].mode = "hsb";
        break;
    case "hsl":
    default:
        d3.select("#hsb-from-rgb").style({display:"none"});
        d3.select("#hsl-from-rgb").style({display:"block"});
        d3.select("#mode-toggle-hsb").style({fill:"#AAA",stroke:"#AAA"});
        d3.select("#mode-toggle-hsl").style({fill:"#AAA",stroke:"#FF0"});
        swatches[0].mode = "hsl";
        break;
    }

    call = `Data.saveInput("${inputId}","changeMainSwatchMode"`;

    for (let i = 1; i< arguments.length; i++) {
        call = `${call},"${arguments[i]}"`;
    }
    
    call += ");";
    setTimeout(call, 10);

    return false;
}


function finalFixup () {
    generateTC();
    $("#mode-hsl-text").click();
}