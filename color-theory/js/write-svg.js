
function writeSvg(appSelector) {
  var appId = appCounters.appIndex++;
  var app = d3.select(appSelector);
  var x = 0;
  var y = 0
  var width = sliderDefaults.swatchLeftSpacing 
  + (sliderDefaults.displayWidth +  sliderDefaults.sliderSpacing) * (swatches.length - 1);
  var height = appInfo.appTop + sliderDefaults.displayWidth + sliderDefaults.sliderSpacing * 3 + 30 + 200;
  var svg = app
        .select("svg");
      svg
        .attr("id", "swatch-app-" + appId)
        .attr({
          x: 0,
          y: 0,
          width: width,
          height: height,
          viewBox: "" + x + " " + y + " " + width + " " + height,
        });

  var defs = svg
        .select("defs");
  defs
        .attr("id", "defs-" + appId);
  // make swatch area
  defs
        .append("path")
        .attr({id: "triangle-2",d:"M 5 0 L 10 10 L 0 10 Z"});

  defs
        .append("rect")
        .attr("id","rect-field-3")
        .attr("stroke", "hsl(180,0%,60%)")
        .attr("fill","none")
        .attr("stroke-width", 1)
        .attr("height", 15)
        .attr("width", rectField3Width);
  defs
        .append("rect")
        .attr("id","rect-field-4")
        .attr("stroke", "hsl(180,0%,60%)")
        .attr("fill","none")
        .attr("stroke-width", 1)
        .attr("height", 15)
        .attr("width", rectField4Width);
  defs
        .append("rect")
        .attr("id","rect-field-5")
        //.attr("stroke", "hsl(180,0%,60%)")
        .attr("stroke-width", 1)
        .attr("height", 15)
        .attr("width", rectField4Width);
                        
  
  // Later on we will format these lines;
  var controlLineIds = ['control-line-top','control-line-middle','control-line-bottom'];
  var controlLineGroup =   svg
      .append('g')
      .attr('transform','translate(0,' +  parseInt(sliderDefaults.displayWidth 
      + appInfo.appTop) + ")");
  for (var i = 0; i<swatches[0].rgbhComponents.length;i++)  {
    var controlLineId = controlLineIds[i];
    controlLineGroup
      .append('line')
      .attr('id',controlLineId)
      .attr('class', 'control-line')
      .attr('x1',0)
      .attr('y1',parseFloat(sliderDefaults.sliderStartY
              + sliderDefaults.sliderSpacing * i + sliderDefaults.sliderHeight/4 ))
      .attr('x2',width)
      .attr('y2',parseFloat(sliderDefaults.sliderStartY
              + sliderDefaults.sliderSpacing * i + sliderDefaults.sliderHeight/4 ));
  }
    
  for (var i = 0; i<swatches.length; i++) {
    var swatchGroupSliders = [];
    var swatch = swatches[i];
    var swatchIndex = swatch.swatchIndex;
        var swatchLocation = swatchIndex-1;
    var swatchGroup = svg
        .append("g")
        .attr({
            id: "color-" + swatchIndex,
            transform: "translate(" 
            + parseFloat(sliderDefaults.swatchLeftSpacing 
                        + ( sliderDefaults.displayWidth + sliderDefaults.swatchSpacing) * swatchLocation) 
            + "," 
            + parseFloat(sliderDefaults.displayWidth + appInfo.appTop) +")"
            
        });
    swatchGroup
        .append("rect")
        .attr("id", swatch.name.substring(1))
        .attr(swatchRectAttrs)

    // create rgb slider group
    swatch.rgbSelector =  swatch.name + "-rgb-sliders";
    var rgbSliderGroup = swatchGroup
        .append("g")
        .attr("id",  swatch.rgbSelector.substring(1))
        .style("display","block");
        
    /// RGB SLIDER CODE 
    var sliderArray = [];
    var componentIndex = 0;
    for (var component in swatch.rgbhComponents) {
      var sliderIndex = appCounters.sliderIndex++;
      sliderArray[sliderArray.length] = sliderIndex;
      sliders[sliderIndex] = new Slider(sliderIndex, swatch, swatch.rgbhComponents[component]);
      var slider = sliders[sliderIndex];
      var gradientName = generateGradientName();
      var gradientId = getGradientId(gradientName);
      var gradient = defs
        .append("linearGradient")
        .attr({id: gradientId})
        .attr(linearGradientAttrs);
        
      for (var j = 0; j < slider.stops.length; j++) {
        var stop = slider.stops[j];
        var stopName = generateStopName(stop);
        gradient
          .append("stop")
          .attr("offset", stop.offset)
          .attr("stop-opacity", "1.0")
          .attr("id", getStopId(stopName))
          .attr("stop-color",swatch.stopColor(stop.offset,swatch.rgbhComponents[component]));
        
      }
      rgbSliderGroup
        .append("rect")
        .attr(sliderRectAttrs)
        .attr({
            "id": "r-" + sliderIndex,
            "width": slider.displayWidth,
            "height": 5,  // hard coded value !!!!!!
            "y": parseInt(sliderDefaults.sliderStartY
              + sliderDefaults.sliderSpacing * componentIndex),
            "fill": "url(" + gradientName + ")"
        });
      var index = componentIndex;
      rgbSliderGroup
        .append("use")
        .attr(sliderHandleAttrs)
        .attr("y", sliderDefaults.y(index))
        .attr("id", getSliderId(slider.name))
                .attr("class",'pointer')
        ;

      $(slider.name)
        .bind('mousedown', sliders[sliderIndex], startMove);

      componentIndex++;
    }
    
    swatch.sliders = sliderArray;
    /// END RGB SLIDER CODE
    
    /// HSL SLIDER CODE 
    swatch.hslSelector = swatch.name + "-hsl-sliders";
    var hslSliderGroup = swatchGroup
        .append("g")
        .attr("id",  swatch.hslSelector.substring(1))
        .style("display","none");
        
    var sliderArray = [];
    var componentIndex = 0;
    for (var component in swatch.hslComponents) {
      var sliderIndex = appCounters.sliderIndex++;
      sliderArray[sliderArray.length] = sliderIndex;
      sliders[sliderIndex] = new hslSlider(sliderIndex, swatch, swatch.hslComponents[component]);
      var slider = sliders[sliderIndex];
      
      switch (swatch.hslComponents[component]) {
      case 'h':
        slider.stops = [
          {id: sliderIndex, offset: 0, "stop-color": "hsl(0,100%,50%)"},
          {id: sliderIndex, offset: 17, "stop-color": "hsl(60,100%,50%)"},
          {id: sliderIndex, offset: 33, "stop-color": "hsl(120,100%,50%)"},
          {id: sliderIndex, offset: 50, "stop-color": "hsl(180,100%,50%)"},
          {id: sliderIndex, offset: 67, "stop-color": "hsl(240,100%,50%)"},
          {id: sliderIndex, offset: 83, "stop-color": "hsl(300,100%,50%)"},
          {id: sliderIndex, offset: 100, "stop-color": "hsl(360,100%,50%)"}
          ];
        slider.fullScaleValue = 360;
        slider.minX = 0;
        slider.maxX = 360;
        slider.value = slider.getValue(180);
        break;
      case 's':
        slider.stops = [
          {id: sliderIndex, offset: 0, "stop-color": "hsl(0,0%,50%)"},
          {id: sliderIndex, offset: 100, "stop-color": "hsl(0,100%,50%)"}
        ];
        slider.fullScaleValue = 100;
        slider.minX = 0;
        slider.maxX = 100;
        slider.value = slider.getValue(360);
        break;
      case 'l':
        slider.stops = [
          {id: sliderIndex, offset: 0, "stop-color": "hsl(0,100%,0%)"},
          {id: sliderIndex, offset: 50, "stop-color": "hsl(0,100%,50%)"},
          {id: sliderIndex, offset: 100, "stop-color": "hsl(0,100%,100%)"}
        ];
        slider.fullScaleValue = 100;
        slider.minX = 0;
        slider.maxX = 100;
        slider.value = slider.getValue(180);
        break;
      }
      
      var gradientName = generateGradientName();
      var gradientId = getGradientId(gradientName);
      var gradient = defs
        .append("linearGradient")
        .attr({id: gradientId})
        .attr(linearGradientAttrs);
        
      for (var j = 0; j < slider.stops.length; j++) {
        var stop = slider.stops[j];
        var stopName = generateStopName(stop);
        gradient
          .append("stop")
          .attr("offset", stop.offset + "%")
          .attr("stop-opacity", "1.0")
          .attr("id", getStopId(stopName))
          .attr("stop-color",swatch.hslStopColor(stop.offset,swatch.hslComponents[component]));
      }
      hslSliderGroup
        .append("rect")
        .attr(sliderRectAttrs)
        .attr({
            height: 5,
            width: slider.displayWidth,
            "id": "r-" + sliderIndex,
            "y": parseInt(sliderDefaults.sliderStartY
              + sliderDefaults.sliderSpacing * componentIndex),
            "fill": "url(" + gradientName + ")"
        });

      hslSliderGroup
        .append("use")
        .attr(sliderHandleAttrs)
        .attr("y", sliderDefaults.y(componentIndex))
        .attr("id", getSliderId(slider.name))
                .attr("class","pointer")
        ;

      $(slider.name)
        .bind('mousedown', sliders[sliderIndex], startMove);

      componentIndex++;
    }
    
    swatch.hslSliders = sliderArray;
    // END HSL SLIDER CODE
        
        
    ///////////////////////// HSB SLIDER CODE ////////////////////////////////
    swatch.hsbSelector = swatch.name + "-hsb-sliders";
    var hsbSliderGroup = swatchGroup
        .append("g")
        .attr("id",  swatch.hsbSelector.substring(1))
        .style("display","none");
        
    var sliderArray = [];
    var componentIndex = 0; 
            
    for (var component in swatch.hsbComponents) {
      var sliderIndex = appCounters.sliderIndex++;
      sliderArray[sliderArray.length] = sliderIndex;
      sliders[sliderIndex] = new hsbSlider(sliderIndex, swatch, swatch.hsbComponents[component]);
      var slider = sliders[sliderIndex];
            
            
      var gradientName = generateGradientName();
      var gradientId = getGradientId(gradientName);
      var gradient = defs
        .append("linearGradient")
        .attr({id: gradientId})
        .attr(linearGradientAttrs);
        
      switch (swatch.hsbComponents[component]) {
      case 'hue':
        slider.stops = [
          {id: sliderIndex, offset: 0, "stop-color": "hsl(0,100%,50%)"},
          {id: sliderIndex, offset: 17, "stop-color": "hsl(60,100%,50%)"},
          {id: sliderIndex, offset: 33, "stop-color": "hsl(120,100%,50%)"},
          {id: sliderIndex, offset: 50, "stop-color": "hsl(180,100%,50%)"},
          {id: sliderIndex, offset: 67, "stop-color": "hsl(240,100%,50%)"},
          {id: sliderIndex, offset: 83, "stop-color": "hsl(300,100%,50%)"},
          {id: sliderIndex, offset: 100, "stop-color": "hsl(360,100%,50%)"}
          ];
        slider.fullScaleValue = 360;
        slider.minX = 0;
        slider.maxX = 360;
        slider.value = slider.getValue(180);
                slider.gradientStack[0] = {id: "r-" + sliderIndex, type: 'fixed-gradient',
                                           colorFn: null, fill: "url(" + gradientName + ")" };
                slider.gradientStack[1] = {id: "r-" + sliderIndex + "-sat", type: 'filled-rect',
                                           colorFn: 'hsbSat',fill:'none'};
                slider.gradientStack[2] = {id: "r-" + sliderIndex + "-brt", type: 'filled-rect', 
                                           colorFn: 'hsbBrt',fill:'none'};
        break;
      case 'sat':
        slider.stops = [
          {id: sliderIndex, offset: 0, "stop-color": "white", "stop-opacity": "1.0"},
          {id: sliderIndex, offset: 100, "stop-color": "white", "stop-opacity": "0.0"}
        ];
        slider.fullScaleValue = 100;
        slider.minX = 0;
        slider.maxX = 100;
        slider.value = slider.getValue(100);
                
                slider.gradientStack[0] = {id: "r-" + sliderIndex + "-hue", type: 'filled-rect', 
                                           colorFn: 'hsbHue',fill:'none'};
                slider.gradientStack[1] = {id: "r-" + sliderIndex, type: 'fixed-gradient', colorFn: null, 
                                           fill: "url(" + gradientName + ")" };
                slider.gradientStack[2] = {id: "r-" + sliderIndex + "-brt", type: 'filled-rect',
                                            colorFn: 'hsbBrt',fill:'none'};
        break;
      case 'brt':
        slider.stops = [
          {id: sliderIndex, offset: 0, "stop-color": "black", "stop-opacity": "1.0"},
          {id: sliderIndex, offset: 100, "stop-color": "black", "stop-opacity": "0.0"}
        ];
        slider.fullScaleValue = 100;
        slider.minX = 0;
        slider.maxX = 100;
        slider.value = slider.getValue(100);
                                
                slider.gradientStack[0] = {id: "r-" + sliderIndex + "-hue", type: 'filled-rect', 
                                           colorFn: 'hsbHue',fill:'none'};
                slider.gradientStack[1] = {id: "r-" + sliderIndex + "-sat", type: 'filled-rect', 
                                           colorFn: 'hsbSat',fill:'none'};
                slider.gradientStack[2] = {id: "r-" + sliderIndex, type: 'fixed-gradient', 
                                           colorFn: null, 
                                           fill: "url(" + gradientName + ")" };
        break;
      }

//////////// Finish up Gradient Stops ////////////////////////
      for (var j = 0; j < slider.stops.length; j++) {
        var stop = slider.stops[j];
        var stopName = generateStopName(stop);
                stop.id = getStopId(stopName)
                stop.offset += "%";
        gradient
          .append("stop")
          .attr(stop);
      }
//////////////////// Gradient Stops Finished /////////////////

      for (var j = 0; j<slider.gradientStack.length;j++) {
                var gs = slider.gradientStack[j];
                hsbSliderGroup
                    .append("rect")
                    .attr(sliderRectAttrs)
                    .attr({
                            height: 5,
                            width: slider.displayWidth,
                            "id": gs.id,
                            "y": parseInt(sliderDefaults.sliderStartY
                                + sliderDefaults.sliderSpacing * componentIndex),
                            "fill": gs.fill
                    });
            }
            
            
      hsbSliderGroup
        .append("use")
        .attr(sliderHandleAttrs)
        .attr("y", sliderDefaults.y(componentIndex))
        .attr("id", getSliderId(slider.name))
                .attr("class","pointer")
        ;

      $(slider.name)
        .bind('mousedown', sliders[sliderIndex], startMove);

      componentIndex++;
    }
    
    swatch.hsbSliders = sliderArray;
        
    //////////////////////// END HSB SLIDER CODE//////////////////////////
        
        
    writeSwatchControls(swatchGroup,swatch);
  } // end iteration over swatches array
  
}


function writeSwatchControls(swatchGroup, swatch) {
  var swatchId = getSwatchId(swatch.name);
  var controlGroup = swatchGroup
    .append("g")
    .attr("id", swatchId + "-controls")
      .attr("transform", "translate(0,100)");
  var rgbControls = controlGroup
      .append("g")
      .attr("id", swatchId + "-rgb-controls")
      .attr("transform", "translate(0,25)");
  var x = 0;
  var y = 13;
  var i = 0
  rgbControls
      .append("text")
      .attr("id", swatchId + "-rgbd-label")
      .attr("x", x)
      .attr("y", y)
      .attr("class","label pointer")
            .on("click", function (d,i) {
                    var swatchId = d3.select(this).attr('id');
                    var swatchList = swatchId.split('-');
                    var newMode = swatchList[2];
                    if (newMode == 'rgbd') {
                        newMode = 'rgb';
                    }
                    var swatchIndex = parseInt(swatchList[1]);
                                        
                    if (swatchList[1] == 'MAIN') {
                        swatchIndex = 0;
                    }
        
                    swatch = swatches[swatchIndex];
                    Log.Notice('toggleHslRgb newMode=' + newMode + ' swatchIndex=' + swatchIndex);
                    if (swatch.mode == newMode ) {
                        return;
                    }
                    switch (newMode) {
                    case 'hsl':
                        swatch.updateGradients();
                        swatch.hslUpdateGradients();
                        break;
                    case 'rgb':
                        swatch.hslUpdateGradients();
                        swatch.updateGradients();
                        break;
                    }
                    swatch.toggleHslRgb(newMode); 
                })
      .text("RGB");
      
  var rgbValues = rgbControls
      .append("g")
      .attr("id", swatchId + "-rgbd-value")
      .attr("transform", "translate(30,0)");
  x = 10;
  var component = ['rd','gd','bd']
  for (comp in component) {

    rgbValues
      .append("use")
      .attr("xlink:href", "#rect-field-3")
      .attr("x", x + i * (rectField3Width+6))
      .attr("y", 0);
    rgbValues  
      .append("text")
      .attr("id", swatchId +  "-rgbd-" + component[comp])
      .attr("class","text")
      .attr("x", x + 3 + i * (rectField3Width+6))
      .attr("y", y)
      .text(swatch[component[comp]]);
    i++;
  }
    
  ////////////////////   HSL CONTROLS /////////////////////////
  x = 0;
  i = 0
  var hslControls = controlGroup
      .append("g")
      .attr("id", swatchId + "-hsl-controls")
      .attr("transform", "translate(0,50)");
  
  hslControls
      .append("text")
      .attr("id", swatchId + "-hsl-label")
      .attr("x", x)
      .attr("y", y)
      .attr("class","label pointer")
            .on("click", function (d,i) {
                    var swatchId = d3.select(this).attr('id');
                    var swatchList = swatchId.split('-');
                    var newMode = swatchList[2];
                    if (newMode == 'rgbd') {
                        newMode = 'rgb';
                    }
                    var swatchIndex = parseInt(swatchList[1]);
                                        
                    if (swatchList[1] == 'MAIN') {
                        swatchIndex = 0;
                    }
        
                    swatch = swatches[swatchIndex];
                    Log.Notice('toggleHslRgb newMode=' + newMode + ' swatchIndex=' + swatchIndex);
                    if (swatch.mode == newMode ) {
                        return;
                    }
                    switch (newMode) {
                    case 'hsl':
                        swatch.updateGradients();
                        swatch.hslUpdateGradients();
                        break;
                    case 'rgb':
                        swatch.hslUpdateGradients();
                        swatch.updateGradients();
                        break;
                    }
                    swatch.toggleHslRgb(newMode);    
                })
             .text("HSL");
     
      
  x = 10;
  var hslValues = hslControls
      .append("g")
      .attr("id", swatchId + "-hsl-value")
      .attr("transform", "translate(30,0)");

  var component = ['h','s','l'];
  var text;
  for (comp in component) {
      text = swatch[component[comp]];

      if (component[comp] == 's' || component[comp] == 'l') {
        text += "%";
      } else {
                text += "&deg;";
            }

      hslValues
        .append("use")
        .attr("xlink:href", "#rect-field-3")
        .attr("x", x + i * (rectField3Width+6) )
        .attr("y", 0);
      hslValues  
        .append("text")
        .attr("id", swatchId +  "-hsl-" + component[comp])
        .attr("class","text")
        .attr("x", x + 3 + i * (rectField3Width+6))
        .attr("y", y)
        .text(text);
      i++;
  }
  
    ///////////////////////// HSB CONTROLS ////////////////////////
    
    x = 0;
  i = 0
  var hsbControls = controlGroup
      .append("g")
      .attr("id", swatchId + "-hsb-controls")
      .attr("transform", "translate(0,75)");
  
  hsbControls
      .append("text")
      .attr("id", swatchId + "-hsb-label")
      .attr("x", x)
      .attr("y", y)
      .attr("class","label pointer")
            .text("HSB")
            .on("click", function (d,i) {
                
                    var swatchId = d3.select(this).attr('id');
                    var swatchList = swatchId.split('-');
                    var newMode = swatchList[2];
                    
                    if (newMode == 'rgbd') {
                        newMode = 'rgb';
                    }
                    
                    var swatchIndex = parseInt(swatchList[1]);
                    
                    if (swatchList[1] == 'MAIN') {
                        swatchIndex = 0;
                    }
                    swatch = swatches[swatchIndex];
                    Log.Notice('toggleHslRgb newMode=' + newMode + ' swatchIndex=' + swatchIndex);
                    
                    if (swatch.mode == newMode ) {
                        return;
                    }
                    
                    switch (swatch.mode) {
                    case 'hsl':
                      swatch.hsl2rgb();
                      break;
                    case 'rgb':
                      swatch.rgb2hsl();
                      break;
                    case 'hsb':
                      swatch.hsb2rgb();
                      break;
                    }
                    
                    switch (newMode) {
                    case 'hsl':
                        swatch.updateGradients();
                        swatch.hsbUpdateGradients();
                        swatch.hslUpdateGradients();
                        break;
                    case 'rgb':
                        swatch.hslUpdateGradients();
                        swatch.hsbUpdateGradients();
                        swatch.updateGradients();
                        break;
                    case 'hsb':
                        swatch.updateGradients();
                        swatch.hslUpdateGradients();
                        swatch.hsbUpdateGradients();
                      break;
                    }
                    swatch.toggleHslRgb(newMode);    
                });
     
      
  x = 10;
  var hsbValues = hsbControls
      .append("g")
      .attr("id", swatchId + "-hsb-value")
      .attr("transform", "translate(30,0)");

  var component = ['hue','sat','brt'];
  var text;
  for (comp in component) {
        text = swatch[component[comp]];

        if (component[comp] == 'sat' || component[comp] == 'brt') {
            text += "%";
        } else {
            text += "&deg;";
        }

        hsbValues
            .append("use")
            .attr("xlink:href", "#rect-field-3")
            .attr("x", x + i * (rectField3Width+6) )
            .attr("y", 0);
        hsbValues  
            .append("text")
            .attr("id", swatchId +  "-hsb-" + component[comp])
            .attr("class","text")
            .attr("x", x + 3 + i * (rectField3Width+6))
            .attr("y", y)
            .text(text);
        i++;
  }
  
    
    ////////////////////// HEX CONTROLS //////////////////////////////
    
  x = 0;
  i = 0
  var hexControls = controlGroup
      .append("g")
      .attr("id", swatchId + "-hex-controls")
      .attr("transform", "translate(0,100)");
  
  hexControls
      .append("text")
      .attr("class","label-2")
      .attr("id", swatchId + "-hex-label")
      .attr("x", x)
      .attr("y", y)
      .text("HEX");
      
  x = 10;
  var hexValues = hexControls
      .append("g")
      .attr("id", swatchId + "-hex-value")
      .attr("transform", "translate(30,0)");

  var component = ['hexValue'];
  var text;
  for (comp in component) {
      text = swatch[component[comp]];

      hexValues
        .append("use")
        .attr("xlink:href", "#rect-field-4")
        .attr("x", x + i * 38)
        .attr("y", 0);
      hexValues  
        .append("text")
        .attr("id", swatchId +  "-hex-" + component[comp])
        .attr("class","text")
        .attr("x", x + 3 + i * 38)
        .attr("y", y)
        .text(text);
      i++;
  }
}













function getSwatchId(swatchName) {
    return swatchName.substring(1);
}

function generateGradientName() {
    return "#gradient-" + appCounters.gradientIndex++;
}

function getGradientName(gradientIndex) {
    return "#gradient-" + gradientIndex;
}

function getGradientId(gradientName) {
    return gradientName.substring(1);
}

function generateStopName(stop) {
    return "#lg-" + stop.id + "-" + stop.offset;
}

function getStopId(stopName) {
    return stopName.substring(1);
}