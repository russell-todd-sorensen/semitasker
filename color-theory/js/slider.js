// Slider Classes

var sliders = new Array();

class Slider {

    name;
    swatch;
    component;
    stops;
    mouseBox ='body';
    minX = 0;
    minY = 0;
    maxX = sliderDefaults.maxX;
    maxY = sliderDefaults.maxX;
    skewX = sliderDefaults.sliderWidth/2;
    skewY = sliderDefaults.sliderHeight/2;
    displayWidth = sliderDefaults.displayWidth;
    orientation = 'horizontal';
    hexValue = '80';
    call = [colorChange];
    callParent =  [swatchUpdate];

    constructor (sliderIndex, swatch, component) {
        this.name = generateSliderName(sliderIndex);
        this.swatch = swatch; // reference to swatch 
        this.component =  component;
        this.stops = [{id: sliderIndex, offset: 0}, {id:sliderIndex, offset: 100}];
    }

    getValue (baseValue) {
        return (this.maxX - this.minX) * (toDecimal(baseValue)/this.displayWidth);
    };

    getPosition (hexValue) {
        hexValue = (hexValue || hexValue == 0)?hexValue:this.hexValue;
        return (toDecimal(hexValue) * this.displayWidth/(this.maxX - this.minX)) - this.skewX;
    };

    positionRgbSlider () {
      this.value = this.swatch[this.component];
      d3.select(this.name).attr('x',this.getPosition());
    };
}
  
class hslSlider {
    name;
    sliderIndex;
    swatch;
    components;
    stops;
    mouseBox ='body';
    minX = 0;
    maxX = sliderDefaults.maxX;
    minY = 0;
    maxY = sliderDefaults.maxX;
    skewX = sliderDefaults.sliderWidth/2;
    skewY = sliderDefaults.sliderHeight/2;
    displayWidth = sliderDefaults.displayWidth;
    orientation = 'horizontal';
    fullScaleValue = 360;
    value = 180; // or 100 or 50, etc.
    call = [hslColorChange];
    callParent =  [hslSwatchUpdate];

    constructor (sliderIndex, swatch, component) {
        this.name = generateSliderName(sliderIndex);
        this.swatch = swatch; // reference to swatch 
        this.component =  component;
        this.stops = [
            {id: sliderIndex, offset: 0},
            {id:sliderIndex, offset: 100}
        ];
    };

    getValue (baseValue) {
        let normValue = baseValue/this.displayWidth;
        return (this.maxX - this.minX) * normValue;
    };

    getPosition (value) {
        let normValue;

        if (!(value || value == 0)) {
            value = this.value;
        }

        switch(this.orientation) {
        case 'vertical':
            normValue = this.minY + value/this.fullScaleValue*this.displayWidth - this.skewY;
            break;
        case 'horizontal':
        default:
            normValue = value * this.displayWidth / (this.maxX - this.minX)  - this.skewX;
            break;
        }
    
        return normValue;
    };
    
    positionHslSlider () {
        this.value = this.swatch[this.component];
        let position = this.getPosition();
        switch(this.orientation) {
        case 'vertical':
            d3.select(this.name).attr('y',position);
            break;
        case 'horizonal':
        default:
            d3.select(this.name).attr('x',position);
            break;
        }
    };
  }
  
  
//////////////// HSB SLIDER //////////////////////////////////
  
class hsbSlider {
    name;
    sliderIndex;
    swatch;
    component;
    stops;

    constructor (sliderIndex, swatch, component) {
        this.sliderIndex = sliderIndex;
        this.name = generateSliderName(this.sliderIndex);
        this.swatch = swatch; // reference to swatch 
        this.component =  component;
        this.stops = [
            {id:sliderIndex, offset: 0},
            {id:sliderIndex, offset: 100}
        ];     
    };

    gradientStack = []; // gradientStack will be series of rects for sat and brt and hue;
    mouseBox ='body';
    minX = 0;
    maxX = sliderDefaults.maxX;
    displayWidth = sliderDefaults.displayWidth;
    skewX = sliderDefaults.sliderWidth/2;
    minY = 0;
    maxY = sliderDefaults.maxX;
    skewY = sliderDefaults.sliderHeight/2;
    orientation = 'horizontal';
    fullScaleValue = 360;
    value = 180; // or 100 or 50, etc. 
    call = [hsbColorChange];
    callParent =  [hsbSwatchUpdate];

    getValue (baseValue) {
      let normValue = baseValue/this.displayWidth;
      return (this.maxX - this.minX) * normValue;

    };

    getPosition ( value ) {
        let normValue;

        if (!(value || value == 0)) {
            value = this.value;
        }

        switch(this.orientation) {
        case 'vertical':
            normValue = this.minY + value/this.fullScaleValue*this.displayWidth - this.skewY;
            break;
        case 'horizontal':
        default:
            normValue = value * this.displayWidth / (this.maxX - this.minX)  - this.skewX;
            break;
        }

        return normValue;
    };
    
    positionHsbSlider = function () {
        this.value = this.swatch[this.component]; // ???
        let position = this.getPosition();

        switch(this.orientation) {
        case 'vertical':
            d3.select(this.name).attr('y',position);
            break;
        case 'horizonal':
        default:
            d3.select(this.name).attr('x',position);
            break;
        }
    };
    
  }



function generateSliderName(sliderIndex) {
    return '#slider-' + sliderIndex;
}


function getSliderId(sliderName) {
    return sliderName.substring(1);
}
