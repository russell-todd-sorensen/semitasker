// JavaScript Document

if (false) {
var tiles = 10;
var row = 0;
var col = 0;
var start = 0;
}

var tartansContainer;
var tartanDiv;
var tartanVert;

var Tartan = {
	threadX: 0,
	threadY: 0,
	currentPixelX: 0,
	currentPixelY: 0,
	side: 4,
	end: 2,
	threadCount: 0,
	threadsToWeave: 0,
	
	currentClass: null,

	weave: function (colorArray) {
	 d3.select("div#tartans-container").html("");
	 
   tartansContainer = d3.select("div#tartans-container");
			
	 tartanDiv = tartansContainer
  	.append("div")
		.attr('id','tartans');
		
		Log.Notice("colorArray.length=" + colorArray.length);
		while (this.threadY < this.threadsToWeave) {
			//Log.Notice("threadY=" + this.threadY);
			tartanDiv
				.append("div")
				.attr("class", "hor " + colorArray[this.threadY%this.threadCount] );
				
		  this.threadY++;
			
		}
		
	 tartanVert = tartansContainer
		.append("div")
		.attr("id", "tartan-vert");
		

		
		while (this.threadX < this.threadsToWeave) {
			
			// reset threadY
			this.threadY = 0;
			
			var vThread = tartanVert
					.append("div")
					.attr("class", "vert");
			this.currentColor = colorArray[this.threadX%this.threadCount]
			
			switch (this.threadX%4) {
			case 0: 
				// skip 2
				vThread
					.append("div")
					.attr("class", "vskip-plus-" + 2 * this.end);
					this.threadY = this.threadY + 2;
				 break;
			case 1:
				//this.skip(1); 
				vThread
					.append("div")
					.attr("class", "vskip-plus-" + 1 * this.end);
					this.threadY = this.threadY + 1;
				break;
			case 2:
				break;
			case 3:
			  //this.skip(-1); 
				vThread
					.append("div")
					.attr("class", "vskip-minus-" + 1 * this.end + " " + this.currentColor);
				vThread
					.append("div")
					.attr("class", "vskip-plus-" + 2 * this.end);
				this.threadY = this.threadY + 3;
				break;
			}
			
			
			while (this.threadY < this.threadsToWeave) {
				vThread
					.append("div")
						.attr("class", "ht-" + this.side + " " + this.currentColor);
				this.threadY = this.threadY + 2;
				
				if (this.threadY >= this.threadsToWeave) {break;}
				
				vThread
					.append("div")
						.attr("class", "ht-" + this.side);
				this.threadY = this.threadY + 2;
			}
			
			this.threadX++;
			
		}
		// de-initialize tartan
		this.threadX=0;
		this.threadY=0;
		this.currentPixelX = 0;
		this.currentPixelY = 0;
		this.threadCount = 0;
		this.threadsToWeave = 0;
	},
	writeStyle: function (styleArray) {
		//styleArray = [];
		var weaveHeight = this.threadsToWeave * this.end;
		var weaveWidth = weaveHeight;
		var style = "";
		style = style + "#tartans div.hor \{\nheight: " + this.end + "px;\nwidth: " + weaveWidth + "px;\}\n\n";
		style = style + "#tartan-vert \{\nheight: " + weaveHeight + "px;\nwidth: " + weaveWidth + "px;\}\n\n";
		for (var i = 0; i<styleArray.length; i++) {
			var color = styleArray[i][1];

			style += "\n\n." + styleArray[i][0] + "\{\n    background-color: " + color + ";\n\}\n";
		}
		
		var body = d3.select(document.body);
		body.select('style').remove();
		body
			.append("style")
			.text(style);
	},
	init: function (inputArray, outputArray, styleArray, threadsToWeave) {
		expandColorArray(inputArray, outputArray, styleArray);
		Log.Notice("outputArray=" + outputArray);
		this.threadCount = outputArray.length;
		if (arguments.length == 4) { 
			this.threadsToWeave = threadsToWeave;
		} else {
			this.threadsToWeave = this.threadCount;
		}
		
		this.writeStyle(styleArray);
		
		this.weave(outputArray);
		Log.Notice("Finished with tartan");
	}
	
};
	
function expandColorArray(inArray, outArray, styleArray) {
	var index = 0;

	for (var i = 0; i<inArray.length; i++) {
		var color = inArray[i][0];
		var repeat = inArray[i][1];
		var found = false;
		var styleId;
		for (var k = 0; k < styleArray.length; k++) {
			if (styleArray[k][1] == color) {
				found = true;
				styleId = styleArray[k][0];
				break;
			}
		}
		if (!found) {
			styleId = "c" + styleArray.length;
			styleArray[styleArray.length] = [styleId, color];
		}
		for (var j = 0; j < repeat; j++) {
			outArray[index] = styleId;
			index++;
		}
	}
	
	// add reversed array
	for (var i = outArray.length -1; i >= 0; i--) {
		outArray[index] = outArray[i];
		index++;
	}
	Log.Notice("finished expandColorArray");
}

