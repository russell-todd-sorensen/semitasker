
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

function switchAttribute(evt) {
  
	var selectId = $(this).attr('id');
	var valueMap = getValueMap(selectId);
	
	updateSliders(valueMap);
	

}

function updateSliders(valueMap) {
	//var data = evt.data;
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
function updateColor() {
	// target is global variable
	var targetId = '#' + target;
  var red = $("#red").val();
  var green = $("#green").val();
  var blue = $("#blue").val();
  var alpha = $('#alpha').val();
  
  //attributes[attribute] 
  targetAttributes[target][attribute] = 'rgba(' + red + ',' + green + ',' + blue + ',' + alpha + ')';
  $(targetId)
    .css(targetAttributes[target])
    .html('#' + toHex(red) + toHex(green) + toHex(blue) + ' <br>alpha: ' + alpha);
}

function changeTarget(evt) {
	newTarget = evt.data;
	targetId = '#' + newTarget;
	target = newTarget;
	data = $(targetId).data();
	var currentTargetSetting = targetAttributes[target][attribute];
	var valueMap = getColorMap(currentTargetSetting);
	updateSliders(valueMap);
}

var sliders = [];
sliders[0] = sliders['red'] = {label: 'Red:', id: 'slider1', formField: 'red', max: 255, min: 0, value: 255, step: 1, fieldType: 'int', property: 'red'};
sliders[1] = sliders['green'] = {label: 'Green:', id: 'slider2', formField: 'green', max: 255, min: 0, value: 255, step: 1, fieldType: 'int', property: 'green'};
sliders[2] = sliders['blue'] = {label: 'Blue:', id: 'slider3', formField: 'blue', max: 255, min: 0, value: 255, step: 1, fieldType: 'int', property: 'blue'};
sliders[3] = sliders['alpha'] = {label: 'Alpha:', id: 'slider4', formField: 'alpha', max: 1.0, min: 0.0, value: 1.0, step: 0.005, fieldType: 'float', property: 'alpha'};


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
