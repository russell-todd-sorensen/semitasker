// JavaScript Document

function handleSliderMove(evt) {

    var y = $(this);
    var val = null;
    var data = y.data();
    var options = data.slider.options;
    var formInput = $('#' + options.formField);
    var currentValue = formInput.val();
    var value = options.value;
    if (currentValue == value) return;
    
    if (options.fieldType == 'float') {
      val = parseFloat(value);
    } else {
      val = parseInt(value);
    }
    
    formInput.val(val);
    Log.Notice("keyup value=" + val );
    updateColor();
}

function handleFieldChange(evt) {
    sliderId = evt.data;
    var data = $('#' + sliderId).data()
    var val = null;
    var options = data.slider.options;
    var formInput = $(options.formField);
    var currentValue = formInput.val();
    var value = options.value;
    
    if (currentValue == value) return;
    
    if (options.fieldType == 'float') {
      val = parseFloat(currentValue);
    } else {
      val = parseInt(currentValue);
    }
    
    options.value = currentValue;
    Log.Notice("keyup value=" + val );
    updateColor();
    updateSliderHandle(data.slider);
}

function updateSliderHandle(slider) {
  var percent = slider.options.valueToPercent();
  $('#' + slider.options.id + ' a').css('bottom', '' + percent + '%');
}

function getValueMap (selectId) {

  attribute = $('#' + selectId + ' option:selected').val();
  //var rgbColor = attributes[attribute];
  var rgbColor = targetAttributes[target][attribute];

  return getColorMap(rgbColor);
}

function getColorMap (rgbColor) {
  rgbColor = rgbColor.substring(5, rgbColor.length -1);
  Log.Notice('rgbColor=' + rgbColor);
  var rgbColorArray = rgbColor.split(',');
  var valueMap = [];
  valueMap['red'] = rgbColorArray[0];
  valueMap['green'] = rgbColorArray[1];
  valueMap['blue'] = rgbColorArray[2];
  valueMap['alpha'] = rgbColorArray[3];
  return valueMap;
}


// This is the main function ???
function changeAttribute(evt) {
  
  var selectId = $(this).attr('id');
  updateSliders(selectId);

}

function updateSliders(selectId) {
  //var data = evt.data;
  var valueMap = getValueMap(selectId);
  var Sliders;
  for (var i = 0; i<targetArray.length; i++) {
    if (targetArray[i].targetId == target) {
      Sliders = targetArray[i].sliders;
      break;
    }
  }
  //var Sliders = data.sliders;
  var sliderOptions = [];
  var i = 0;
  var sliderOption;
  for (sliderId in Sliders) {
    sliderOption = $('#' + Sliders[sliderId]).data().slider.options;
    var val = valueMap[sliderOption['property']];
    sliderOption.value = val;
    var pct = sliderOption.valueToPercent();
    $('#' + sliderOption['id'] + ' a').css('bottom', '' + sliderOption.valueToPercent() + '%')
    var formFieldSelector = '#' + sliderOption['formField'];
    $(formFieldSelector).val(val);
    sliderOptions[i] = sliderOption;
    i++;
  }
  updateColor();
  
}
if (false) {
SvgTransform.skewY = function(inputId) {

  var skewAngle = parseInt($('#' + inputId).val());
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).attr('transform','skewY(' + skewAngle + ')');
    //d3.select(selector).attr('transform', 'skewX(' + skewAngle + ')');
  }
  var call = "Data.saveInput('" + inputId + "','SvgTransform.skewY'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
}
}

function updateColor() {
  // target is global variable
  var targetId = '#' + target;
  var red = $("#red").val();
  var green = $("#green").val();
  var blue = $("#blue").val();
  var alpha = $('#alpha').val();
  
  //<input type="hidden" id="background-rect-fill-red" value="102" />
  
  //attributes[attribute]
  var rgbColor = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';
  $(targetId + "-" + attribute).val(rgbColor);
  
  targetAttributes[target][attribute] = rgbColor ;
  $(targetId)
    .css(targetAttributes[target]);
    
  var call = "Data.saveInput('" + target + "-"
      + attribute + "','restoreColor','"
      + target + "','" + attribute + "'";
      
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  
}

function restoreColor(formTarget, targetName, attributeName) {
  var rgbColor = $('#' + targetName + "-" + attributeName).val();
  targetAttributes[targetName][attributeName] = rgbColor;
  $('#' + targetName)
    .css(attributeName, rgbColor);
}

// this is basically static data fed into initSliders
var sliders = [];
sliders[0] = sliders['red'] = {label: 'Red:', id: 'red-slider', formField: 'red', max: 255, min: 0, value: 255, step: 1, fieldType: 'int', property: 'red'};
sliders[1] = sliders['green'] = {label: 'Green:', id: 'green-slider', formField: 'green', max: 255, min: 0, value: 255, step: 1, fieldType: 'int', property: 'green'};
sliders[2] = sliders['blue'] = {label: 'Blue:', id: 'blue-slider', formField: 'blue', max: 255, min: 0, value: 255, step: 1, fieldType: 'int', property: 'blue'};
sliders[3] = sliders['alpha'] = {label: 'Alpha:', id: 'alpha-slider', formField: 'alpha', max: 1.0, min: 0.0, value: 1.0, step: 0.005, fieldType: 'float', property: 'alpha'};


function initSliders (sliderArray) {
  
  var defaultData = {
    animate: false,
    distance: 0,
    max: 100,
    min: 0,
    orientation: "vertical",
    range: false,
    step: 1,
    value: 0,
    values: null,
    formField: '',
    property: this.formField,
    fieldType: 'int',
    factor: function () {
      return 100/(this.max - this.min);
    },
    valueToPercent: function (val) {
      val = (val == undefined ? parseFloat(this.value) : parseFloat(val));
      return val * this.factor() + this.min;
    }
  }
  for (var i = 0; i<sliderArray.length; i++) {
    var sliderData = sliderArray[i];
    var data = new Object();
    for (var field in defaultData) {
      data[field] = defaultData[field];
    }
    for (var field in sliderData) {
      data[field] = sliderData[field];
    }
    $('#' + data['id'])
      .slider(data)
      .bind('mouseup mousemove keyup', null, handleSliderMove);

    $('#' + data['formField'])
      .val(data['value'])
      .bind('change', data['formField'], handleFieldChange);
  }
}

var targetArray = [];
if (false) {
var attributes = {
  'background-color': 'rgba(255,255,255,1)',
  'fill': 'rgba(255,255,255,1)',
  'stroke': 'rgba(0,0,0,1)',
  'color': 'rgba(0,0,0,1)',
  'border-color': 'rgba(0,0,0,1)',
  'border-right-color': 'rgba(0,0,0,1)'
};
}
var targetAttributes = [];

var colorCategory = [];

colorCategory["html"] = {
  'background-color': 'rgba(255,255,255,1)',
  'color': 'rgba(0,0,0,1)',
  'border-color': 'rgba(0,0,0,1)'
};

colorCategory["svg"] = {
  'fill': 'rgba(255,255,255,1)',
  'stroke': 'rgba(0,0,0,1)',
};

colorCategory["svg-gradient"] = {
  'stop-color': 'rgba(255,255,255,1)'
};

colorCategory["svg-flood"] = {
  'flood-color': 'rgba(0,0,0,1)'
};


function getTargets (category) {
  var tArray = [];
  var className = category + '-color-edit';
  var elements = document.getElementsByClassName(className);
  for (var i = 0; i<elements.length; i++) {
    tArray[tArray.length] = elements[i].id;
  }
  return tArray;
}


var targets = new Array();
var targetAttributes = new Object();
var targetTypes = ['html','svg','svg-flood','svg-gradient'];
var attribute = 'fill';
var targetArray = new Array();
var target;
var hiddenFormId = "#hidden-color-values";
function setupTargets (colorTargetSelector) {
  for (index in targetTypes ) {
    var type = targetTypes[index]
    var typeTargets = getTargets(type);
    for (var i = 0; i< typeTargets.length; i++) {
      
      targetName = typeTargets[i]
      targetAttributes[targetName] = {};
      
      for (attr in colorCategory[type]) {
        targetAttributes[targetName][attr] = colorCategory[type][attr];
        $(hiddenFormId).append("<input type='hidden' id='" + targetName + "-" + attr + "' value='" + colorCategory[type][attr] + "' >");
        Data.restoreInput(targetName + "-" + attr);
      }
      
      targets[targets.length] = targetName;
      $(colorTargetSelector).append("<option value='" + targetName + "'>" + targetName + "</option>\n");
      targetArray[targetArray.length] = {
        targetId: targetName,
        sliders: {
          red: 'red-slider',
          green: 'green-slider',
          blue: 'blue-slider',
          alpha: 'alpha-slider'
        }
      };
    }
  }
}


function changeTarget(id) {
  var selector = '#' + id + ' option::selected';
  target = $(selector).val();
  
  var attributes = targetAttributes[target];
  var colorWhatSelector = '#bgOrFont';
  $(colorWhatSelector).html("<option>Select What to Color</option>");
	var selected = "selected='selected'";
  for (var attr in attributes) {
    $(colorWhatSelector).append("<option value='" + attr + "' " + selected + ">" + attr + "</option>\n");
		selected = "";
  }
  
  updateSliders('bgOrFont');
}

function escapeHTML (html) {
	regUnLT = /</g;
	regUnGT = />/g;
	regUnAmp = /&/g;
	regEndElement = /> /g;
	
	if (html == undefined || html == null) {
		html = "";
		return html;
	}
	
	return html
		.replace(regUnAmp, "&amp;")
		.replace(regUnGT, "&gt;")
		.replace(regUnLT, "&lt;")
}


function showSvgCode (fromId, toId) {
	$('#' + toId)
		.attr('contentEditable', true)
		.css('display','pre')
		.html(escapeHTML($('#' + fromId).html()));
}