// JavaScript Document



function writeFontFamilySelect ( selector ) {
	
	var selection = $(selector);
	selection.html("");
	
	for (var i = 0; i < Data.fontFamily.length; i++) {
		var font = Data.fontFamily[i];
		selection.append("\n <option value='" + font + "'>" + font + "</option>");
	}
}

function changeFont(selectId) {
	
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
	
	$('#current').val(font);
	var call = "saveSelect('" + selectId + "','changeFont'";
	for (var i = 1; i< arguments.length; i++) {
		call = call + ",'" + arguments[i] + "'";
	}
	
	call += ");";
  setTimeout(call, 10);
	$('#changeFontButton').click();
	return false;
}

// default is to switch the body fontFamily,
// otherwise treat remaining arguments as selectors
function changeFont2(inputId) {
	
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
	
	var call = "saveInput('" + inputId + "','changeFont2'";
	for (var i = 1; i< arguments.length; i++) {
		call = call + ",'" + arguments[i] + "'";
	}
	
	call += ");";
  setTimeout(call, 10);
	return false;
}
