
function convertToBinHex(asciiField, binaryField, hexField) {
	var binary = "";
	var hex = "";
	var decimal = "";
	var ascii = $('#' + asciiField).val();
	ascii = ascii.trim();
	var char;
	var decCode;
	for (var i = 0; i<ascii.length; i++) {
		char = ascii[i];
		code = char.charCodeAt();

		Log.Notice("char='" + char + "', code='" + code + "'");
		if (code == 32) {
			decCode = " ";
			hexCode = " ";
			binCode = "< >";
		} else {
			decCode = code;
			hexCode = toHex(code) ;
			binCode = "<" + toBinary(hexCode.charAt(0)) + toBinary(hexCode.charAt(1)) + ">";
		}
		decimal = decimal + "<" + decCode + ">";
		hex = hex + "<" +  hexCode + ">";
		binary += binCode;
	}
	
	$('#' + binaryField).val(binary.trim());
	$('#' + hexField).val(hex.trim());
	
}

function toHex(decimalNumber) {
	hexChars = "0123456789ABCDEF";
	if (decimalNumber > 255)
		return "??";
		
	var i = decimalNumber %16;
	var j = (decimalNumber - i)/16;
  return hexChars.charAt(j) + hexChars.charAt(i);
}
function toDecimal(hexNumber) {
	hexChars = "0123456789ABCDEF";
	if (decimalNumber > 255)
		return "??";
		
	var i = decimalNumber %16;
	var j = (decimalNumber - i)/16;
  return hexChars.charAt(j) + hexChars.charAt(i);
}
function toBinary(hexNumber) {
	switch (hexNumber) {
	case '?': 
	  return " ";
	case '0': 
		return '0000';
	case '1': 
	  return '0001';
	case '2':
	  return '0010';
	case '3':
	  return '0011';
	case '4':
	  return '0100';
	case '5':
	  return '0101';
	case '6':
	  return '0110';
	case '7':
	  return '0111';
	case '8':
	  return '1000';
	case '9':
	  return '1001';
	case 'A':
	  return '1010';
	case 'B':
	  return '1011';
	case 'C':
	  return '1100';
	case 'D':
	  return '1101';
	case 'E':
	  return '1110';
	case 'F':
	  return '1111';
	}
}