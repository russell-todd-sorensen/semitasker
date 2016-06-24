
// sets the background of id using input image url 
function changeBackground(input, id) {
 
 var image = $(input).val();
 Log.Notice("image=" + image);
 re = /^(C:\\fakepath\\)(.*)$/;
 
 if (image.match(re)) {
	 var matched = image.match(re);
	 if (matched.length > 2) {
	 	var url = "images/" + matched[2];
	 } else {
		 return;
	 }
 } else {
 	var re = /\\(images\\[a-zA-Z0-9\\\s\._-]+)$/;
 	var re2 = /\\/g;
 	var matched = image.match(re);
 	Log.Notice("matched=" + matched[1]);
 	if (matched.length > 1) {
  	var url = matched[1].replace(re2, "/");
 	} else {
  	return;
 	}
 }
 Log.Notice("url=" + url);
 $(id)
    .css('background-image', 'url(' + url + ')');
}

function changeFontSize(input, id) {

	var fontSize = parseInt($(input).val());

	Log.Notice("Font Size=" + fontSize );
	
	$(id)
		.css('font-size', fontSize + "px");
	
}

function changeBackgroundColor(input, id) {
	 
 var color = $(input).val();
 Log.Notice("color=" + color);
 
 var reArray = [];
 reArray[0] = /^(#[0-9a-f]{3})$/;
 reArray[1] = /^(#[0-9a-f]{6})$/;
 reArray[2] = /^(rgba\((?:[ ]*[0-2]{0,1}[0-9]{1,2}[ ]*,){3}[ ]*(?:1|1\.0*|0?\.[0-9]{1,5}[ ]*)\))$/;
 reArray[3] = /^(rgb\((?:[ ]*[0-2]{0,1}[0-9]{1,2}[ ]*,){2}[ ]*[0-2]{0,1}[0-9]{1,2}[ ]*\))$/;
 reArray[4] = /^([a-zA-Z]{1,25})$/
 
 var backgroundColor = "#444";
 
 for (var i = 0; i < reArray.length; i++) {
	 var re = reArray[i];
 	 if (color.match(re)) {
	 	 var matched = color.match(re);
	 	 if (matched.length > 1) {
	 		 var backgroundColor =  matched[1];
	 	 } else {
		 	 return;
	 	 }
	 }
 }
 
 Log.Notice("backgroundColor=" + backgroundColor);
 $(id)
    .css('background-color', backgroundColor);
}
