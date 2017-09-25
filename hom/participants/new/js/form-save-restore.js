// JavaScript Document
// require data.js
// These functions add to the Data object:


Data.writeFontFamilySelect = function( selector ) {
  
  var selection = $(selector);
  selection.html("");
  
  for (var i = 0; i < this.fontFamily.length; i++) {
    var font = this.fontFamily[i];
    selection.append("\n <option value='" + font + "'>" + font + "</option>");
  }
};

Data.changeFont = function(selectId) {
  
  var font = $('#' + selectId + " option::selected").val();
  
  if (arguments.length == 1) {
    $('body').css('font-family',"'" + font + "'");
  } else {
    var selector;
    for (var i = 1; i < arguments.length; i++) {
      selector = arguments[i];
      $(selector).css('font-family',"'" + font + "'");
    }
  }
  
  
  var call = "Data.saveSelect('" + selectId + "','Data.changeFont'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  call += ");";
  setTimeout(call, 10);
  
  if (this.Restored[selectId]) { // this is a regular form change, not a restoration
    Log.Notice("Updating current font to " + font);
    $('#current').val(font);
    $('#changeFontButton').click();
  } else {
		this.Restored[selectId] = true;
    Log.Notice("Just restoring select font to " + font);
  }
  
  return false;
};

Data.changeFontSize = function (inputId) {
  
  var fontSize = parseInt($('#' + inputId).val());
  
  if (arguments.length == 1) {
    $('body').css('font-size','' + fontSize + 'px');
  } else {
    var selector;
    for (var i = 1; i < arguments.length; i++) {
      selector = arguments[i];
      $(selector).css('font-size','' + fontSize + 'px');
    }
  }
  
  var call = "Data.saveInput('" + inputId + "','Data.changeFontSize'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
}

Data.changeImage = function (selectId) {
  var imageSelector = '#' + selectId + " option::selected";
  var imageUrl = $(imageSelector).val();
  
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).attr("href",imageUrl);
  }
 
  
  var call = "Data.saveSelect('" + selectId + "','Data.changeImage'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
}


// this must change to support color editing
Data.changeStrokeWidth = function (inputId) {
  
  var strokeWidth = parseInt($('#' + inputId).val()) ;
  strokeWidth = strokeWidth < 1 ? 0 : strokeWidth;
  var strokeColor, fillColor;
  if (arguments.length == 1) {

    if (strokeWidth > 0) {
      strokeColor = $('body').css('fill');
      $('body')
        .css('stroke-width','' + strokeWidth + 'px')
      //  .css('stroke', '' + strokeColor )
      //  .css('fill','none');
    }
    else {
      fillColor = $('body').css('stroke');
      $('body')
        .css('stroke-width','' + strokeWidth + 'px')
      //  .css('stroke', 'none')
     //   .css('fill',fillColor);
    }
  } 
	else {
    var selector;
    for (var i = 1; i < arguments.length; i++) {
      selector = arguments[i];
      if (strokeWidth > 0) {
        strokeColor = $(selector).css('color');
        $(selector)
          .css('stroke-width','' + strokeWidth + 'px')
       //   .css('stroke', '' + strokeColor )
       //   .css('fill','none');
      }
      else {
        fillColor = $(selector).css('color');
        $(selector)
          .css('stroke-width','' + strokeWidth + 'px')
       //   .css('stroke', 'none')
       //   .css('fill',fillColor);
      }
    }
  }
  
  var call = "Data.saveInput('" + inputId + "','Data.changeStrokeWidth'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
}


// default is to switch the body fontFamily,
// otherwise treat remaining arguments as selectors
Data.changeFont2 = function (inputId) {
  
  var font = $('#' + inputId).val();
  
  if (arguments.length == 1) {
    $('body').css('font-family',"'" + font + "'");
  } else {
    var selector;
    for (var i = 1; i < arguments.length; i++) {
      selector = arguments[i];
      $(selector).css('font-family',"'" + font + "'");
    }
  }
  
  //saveInput(inputId, 'changeFont2', '#logo', 'body');
  
  var call = "Data.saveInput('" + inputId + "','Data.changeFont2'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
};

Data.changeFontMultiple = function(selectId) {
  
  var fontSelector = '#' + selectId + " option::selected";
  var fonts = [];
  $(fontSelector).each(function(i,e) {
    Log.Notice('font[' + fonts.length + '] =' + $(this).attr('value'));
    fonts[fonts.length] = $(this).attr('value');
  });
  
  $('#font-compare').html(""); // zero out font-compare
  
  for (var i = 0; i<fonts.length; i++) {
    
    $('#font-compare').append("<div class='font' style=\"font-family: '" + fonts[i] + "';\"><span>" + fonts[i] + "</span></div>"); 
    
  }
  
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).css('font-family',"'" + font + "'");
  }

  
  var call = "Data.saveSelectMultiple('" + selectId + "','Data.changeFontMultiple'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  call += ");";
  setTimeout(call, 10);
  setTimeout("Data.restoreInput('font-size')", 10);
	setTimeout("Data.restoreInput('font-weight')",10);
  
  return false;
};

Data.changeFontMultipleSVG = function(selectId) {
  
  var fontSelector = '#' + selectId + " option::selected";
  var fonts = [];
  $(fontSelector).each(function(i,e) {
    Log.Notice('font[' + fonts.length + '] =' + $(this).attr('value'));
    fonts[fonts.length] = $(this).attr('value');
  });
  
  $('#font-compare').html(""); // zero out font-compare
  
  var UpperCase = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z ! @ # $ % ^ * ( ) _ + = : ; \" \' | ~ \n";
  var LowerCase = "a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 0 - ?";
  var isoChars = "";
  
  for (var i = 127; i< 256; i++) {
    isoChars = isoChars + " &#" + i + ";";
  }
  isoChars = isoChars.trim();
  
  //var textTest = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
  //var textXHeightTest = "x";
  //var maxHeightText = "A B C D Q J R Y W T P G I a b c d e f g h i j k l p q t v y z";
  var fontSize = parseInt($('#font-size').val());

  for (var i = 0; i<fonts.length; i++) {
    var caseArray = [UpperCase, LowerCase, isoChars];
    caseArray[caseArray.length] = fonts[i];
    var height = [];
    var width = []
    for (var j = 0; j <caseArray.length; j++ ) {
      
      $('#font-test').html("");
      $('#font-test').append("<svg xmlns:xlink='http://www.w3.org/1999/xlink' width='1000' height='150' id='test-svg'>\n"
        + "<text style=\"font-family: '" 
        + fonts[i]
        + "'; font-size: " + fontSize + "px;\">"
        + "<tSpan x='30' dy='" + parseInt(fontSize * .8) + "' id='test-font-size'>" + caseArray[j] + "</tSpan>\n"
        + "</text>\n"
        + "</svg>"
        );
        height[j] = $('#test-font-size').outerHeight();
        width[j] = $('#test-font-size').outerWidth();
        Log.Notice('Font ' + fonts[i] + ' height = ' + height[j] );
    }
    
    var fontWidth = width[caseArray.length-1];
    var fontHeight = height[caseArray.length-1];
    var maxHeight = d3.max(height);
    var maxWidth = d3.max(width);
    Log.Notice('maxHeight for ' + fonts[i] + '='  + maxHeight);
    
    
    $('#font-compare').append("<svg xmlns:xlink='http://www.w3.org/1999/xlink' width='" + parseInt(maxWidth + 35) + "' height='" + parseInt(4.3 * maxHeight) + "' x='0' y='0'>"
      + "<rect class='bg' x='25' y='0' height='" + parseInt(4 * maxHeight + 9 ) + "' width='" + parseInt(maxWidth + 5) + "' />\n"
      + "<circle cx='30' cy='" + maxHeight + "' r='5' />\n"
      + "<rect x='27' y='" + parseFloat(maxHeight) + "' height='" + parseFloat(maxHeight) + "' width='" + parseInt(fontWidth + 25) + "' class='font-name' />"
      + "<text x='30' y='" + maxHeight + "'"
      + " id='text-id-" + i + "'"
      + " style=\"font-family: '"
      + fonts[i] 
      + "'; font-size: "
      + maxHeight + "px;"
      +"\"><tSpan class='norm' x='30' dy='-" + parseInt(maxHeight * .2 + 2) + "'>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z ! @ # $ % ^ * ( ) _ + = : ; \" \' | ~ \n</tSpan>"
      + "<tSpan class='reverse' x='30' dy='" + parseInt(maxHeight + 0) + "'>"
      + fonts[i]
      + "</tSpan>\n"
      + "<tSpan class='outline' dx='30' dy='0'>" + fonts[i] + "</tSpan>\n"
      + "<tSpan class='norm' x='30' dy='" + parseInt(maxHeight + 4) + "'>a b c d e f g h i j k l m n o p q r s t u v w x y z 1 2 3 4 5 6 7 8 9 0 - ?</tspan>"
      + "</tSpan>\n<tSpan class='norm' x='30' dy='" + parseInt(maxHeight) + "'>" + isoChars + "</tspan>"
      + "</text>\n</svg>\n");
    
  }
  var font = fonts[0];
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).css('font-family',"'" + font + "'");
  }

  
  var call = "Data.saveSelectMultiple('" + selectId + "','Data.changeFontMultipleSVG'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  call += ");";
  setTimeout(call, 10);
  setTimeout("Data.restoreInput('font-size')", 10);
	setTimeout("Data.restoreInput('stroke-width')",10);
  
  return false;
};

Data.saveSelect = function (selectId, restoreFunction) {
  var selectedOption = "#" + selectId + " option:selected";
  var value = $(selectedOption).val();
  if (value || value == 0) {
    Log.Notice('saveSelect id=' + selectId + ' value="' + value + '"');
    var call = restoreFunction + "('" + selectId  + "'";
    for (var i = 2; i<arguments.length; i++) {
      call =  call + ",'" + arguments[i] + "'";
    }
    call += ");"
    localStorage.setItem(document.URL + '-ANIMATION-VALUE-' + selectId, value);
    localStorage.setItem(document.URL + '-ANIMATION-RESTORE-' + selectId, call);
  }
};


Data.restoreSelect = function (selectId) {

  var value = localStorage.getItem(document.URL + '-ANIMATION-VALUE-' + selectId);
  var call = localStorage.getItem(document.URL + '-ANIMATION-RESTORE-' + selectId);
  if (value || value == 0) {
    var selectedOption = "#" + selectId + " " + "option:selected";
    $(selectedOption).removeAttr('selected');
    var valueOption = "#" + selectId + " " + "option[value='" + value + "']";
    $(valueOption)
      .attr('selected', 'selected');
      
    setTimeout(call, 10);
    //setTimeout("Data.Restored['" + selectId + "']= true;", 10);
  }
};

// Set the select to the passed in value. If the value doesn't exist,
// all options will be cleared, none selected.

Data.setSelect = function (selectId,value,restoreFunction) {
    var selectedOptions = '#' + selectId + " option:selected";
    $(selectedOptions).each(function(i,e) {
        //Log.Notice('for ' + selectedOptions + ' removing option ' + i );
        $(this).removeAttr('selected');
    });
    var valueOption = "#" + selectId + " option[value='" + value + "']";
    $(valueOption)
        .attr('selected','selected');
    
    if (restoreFunction) {
    } else {
        var restoreFunction = "Log.Notice";
    }
    
    Data.saveSelect(selectId,restoreFunction);
    return false;
}



Data.saveSelectMultiple = function (selectId, restoreFunction) {
  var selectedOptions = "#" + selectId + " " + "option:selected";
  var value = [];
  $(selectedOptions).each(function(i,e) {
    Log.Notice('saveSelectMultiple option = ' + $(this).val());
    value[value.length] = $(this).val();
  });
  valueString = value.join(",");
  if (value.length > 0) {
    var call = restoreFunction + "('" + selectId  + "'";
    for (var i = 2; i<arguments.length; i++) {
      call =  call + ",'" + arguments[i] + "'";
    }
    call += ");"
    localStorage.setItem(document.URL + '-SELECT-MULTIVALUE-' + selectId, valueString);
    localStorage.setItem(document.URL + '-SELECT-RESTORE-' + selectId, call);
  }
};

Data.restoreSelectMultiple = function (selectId) {

  var valueString = localStorage.getItem(document.URL + '-SELECT-MULTIVALUE-' + selectId);
  var call = localStorage.getItem(document.URL + '-SELECT-RESTORE-' + selectId);
  if (valueString) {
    var selectedOption = "#" + selectId + " " + "option:selected";
    $(selectedOption).each(function(i,e) {
      $(this).removeAttr('selected');
    });
    var values = valueString.split(",");
     var valueOption;
    for (var i = 0; i < values.length; i++) {
      valueOption  = "#" + selectId + " " + "option[value='" + values[i] + "']";
      $(valueOption)
        .attr('selected', 'selected');
    }
    setTimeout(call, 10);
  }
};

Data.getCheckboxValues = function (checkboxId) {
    var value = [];
    var checkedBoxes = '#' + checkboxId + ":checked";
    
    $(checkedBoxes).each(function(i,e) {
        //Log.Notice('getCheckboxValues val=' + $(this).val());
        value[value.length] = $(this).val();
    });
    return value;
};
// The following form deprecates previous function
Data.getNamedCheckboxValues = function (checkboxName) {
    var value = [];
    var checkboxSelector = "input[name='" + checkboxName + "']";
    $(checkboxSelector).each(function(i,e) {
        if ($(this).attr('checked') == 'checked') {
            value[value.length] = $(this).val();
        }
    });
    return value;
};


Data.saveCheckbox = function (checkboxId, restoreFunction) {
    
  //

  var value = Data.getCheckboxValues(checkboxId);
  valueString = value.join(",");
  Log.Notice('saveCheckbox id=' + checkboxId + ' value="' + valueString + '"' );
  var call = restoreFunction + "('" + checkboxId  + "'";
  for (var i = 2; i<arguments.length; i++) {
      call =  call + ",'" + arguments[i] + "'";
  }
  call += ");"
  localStorage.setItem(document.URL + '-CHECKBOX-' + checkboxId, valueString);
  localStorage.setItem(document.URL + '-CHECKBOX-RESTORE-' + checkboxId, call);
};

Data.restoreCheckbox = function (checkboxId) {

  var valueString = localStorage.getItem(document.URL + '-CHECKBOX-' + checkboxId);
  var call = localStorage.getItem(document.URL + '-CHECKBOX-RESTORE-' + checkboxId);
  if (valueString) {
    var checkboxSelector = "input[name='" + checkboxId + "']";
    //var checkboxSelector = '#' + checkboxId + ":checked";
    $(checkboxSelector).each(function(i,e) {
        $(this).removeAttr('checked');
    });
    var values = valueString.split(",");
    var valueOption;
    var handle;
    for (var i = 0; i < values.length; i++) {
      //Log.Notice('valueOption = ' + values[i]);
      valueOption  = "input[name='" + checkboxId + "']";
      //valueOption = '#' + checkboxId;
      $(valueOption).each(function(i,e) {
          var val = $(this).val();
          for (var j = 0;j<values.length;j++) {
              if ( val == values[j] ) {
                  $(this).attr('checked','checked');
                  break;
              }
          }
          //Log.Notice('what values=' + values[i]);
      });
    }
    setTimeout(call, 10);
  }
};

// set the checkbox group to the passed in value, if the value
// doesn't exist, no checkboxes will be checked after the operation
// new checkbox configuration is saved 

Data.setCheckbox = function (checkboxId,value,restoreFunction) {
    var checkedBoxes = '#' + checkboxId + ":checked";
    $(checkedBoxes).each(function(i,e) {
        //Log.Notice('for ' + checkedBoxes + ' removing check ' + i );
        $(this).removeAttr('checked');
    });
    
    var valueOption = "#" + checkboxId + "[value='" + value + "']";
    
    $(valueOption)
        .attr('checked','checked');
    
    if (restoreFunction) {
    } else {
        var restoreFunction = "Log.Notice";
    }
    
    Data.saveCheckbox(checkboxId,restoreFunction);
    return false;
};


Data.setCheckboxes = function (checkboxId,values,restoreFunction) {
    var value,valueSelector;
    var valueList = values.split(',');
    var checkedBoxes = '#' + checkboxId + ":checked";
    
    $(checkedBoxes).each(function(i,e) {
        //Log.Notice('for ' + checkedBoxes + ' removing check ' + i );
        $(this).removeAttr('checked');
    });
    
    for (var i = 0;i<valueList.length;i++) {
        value = valueList[i];
        valueSelector = "#" + checkboxId + "[value='" + value + "']";
        $(valueSelector)
            .attr('checked','checked');
    }
    
    Data.saveCheckbox(checkboxId,restoreFunction);
};


Data.saveInput = function (inputIdList, restoreFunction, arg2, arg3) {
	var inputIdArray = inputIdList.split(',');
	for (var j = 0; j < inputIdArray.length; j++ ) {
		inputId = inputIdArray[j];
		var inputSelector = "#" + inputId;
		var value = $(inputSelector).val();
		if (value || value == 0) {
		    Log.Notice('saveInput id=' + inputId + ' value="' + value + '"');
		    var call = restoreFunction + "('" + inputId  + "'";
		    for (var i = 2; i<arguments.length; i++) {
		        call =  call + ",'" + arguments[i] + "'";
		    }
		    call += ");"
		    localStorage.setItem(document.URL + '-ANIMATION-VALUE-' + inputId, value);
		    localStorage.setItem(document.URL + '-ANIMATION-RESTORE-' + inputId, call);
  	    }
	}
};

Data.restoreInput = function (inputId) {
  
  var value = localStorage.getItem(document.URL + '-ANIMATION-VALUE-' + inputId);
  var call = localStorage.getItem(document.URL + '-ANIMATION-RESTORE-' + inputId);
  if (value || value == 0) {
	$('#' + inputId).val(value);
     setTimeout(call, 10);
  }
};

Data.restoreHiddenInput = function (inputId) {
	
	
};

Data.loadSelectOptions = function (selectId,data) {
	var s = $('#' + selectId);
	for (var i=0; i< data.length; i++) {
		s.append("<option value='" + data[i].url + "'>" + data[i].alt + "</option>\n");
	}
}


Data.changeOpacity = function (inputId) {
  
  var opacity = document.getElementById(inputId).value;
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    d3.selectAll(selector).style('opacity',opacity);
  }
  
  
  //saveInput(inputId, 'Data.changeOpacity', '#points circle');
  
  var call = "Data.saveInput('" + inputId + "','Data.changeOpacity'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
};

Data.changeStyle = function (inputId, styleName) {
  
  var styleValue = document.getElementById(inputId).value;
  var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    d3.selectAll(selector).style(styleName,styleValue);
  }
  
  
  //saveInput(inputId, 'Data.changeOpacity', '#points circle');
  
  var call = "Data.saveInput('" + inputId + "','Data.changeStyle'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
};

Data.changeText = function(inputId) {

	var text = $('#' + inputId).val();
	var selector;
  for (var i = 1; i < arguments.length; i++) {
    selector = arguments[i];
    $(selector).text(text);
  }
	var call = "Data.saveInput('" + inputId + "','Data.changeText'";
	for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
}

Data.toggleFormInputType = function (evt) {
	var id = '#' + $(this).attr('for');
	Log.Notice("toggleFormInputType for id=" + id);
	var parent = $(this).parent();
	var input = d3.select(id);
	var type = $(id).attr('type');
	var numberStyle = "width: 75px;";
	var rangeStyle = "width: 150px;";
	if (evt.data) {
	  numberStyle = evt.data.numberStyle;
	  rangeStyle = evt.data.rangeStyle;
	}
	switch (type) {
	case 'number':
		var maximum = input.attr('max');
		var minimum = input.attr('min');
		
	  input
		  .attr('type','range');

		d3.select(id + '-min')
		     .html(minimum);
		 
		d3.select(id + '-max')
		     .html(maximum);
		 
		d3.select(id)
		 .transition()
		 .ease('linear')
		 .delay(0)
		 .duration(1000)
		 .attr('style',rangeStyle);
		 
		break;
	case 'range':
				
	  input
		  .attr('type',"number");
	
		d3.select(id + '-min')
			.html('');
			
		d3.select(id + '-max')
			.html('');

		d3.select(id)
		 .transition()
		 .ease('linear')
		 .delay(0)
		 .duration(1000)
		 .attr('style', numberStyle);
		 
		break;
	}
};


function LogInput(inputId) {
    Log.Notice('LogInput ' + inputId + '="' + $('#' + inputId).val() + '"');
}

function LogChbox(inputId) {
    Log.Notice('LogChbox ' + inputId + '="' + Data.getCheckboxValues(inputId) + '"');
}