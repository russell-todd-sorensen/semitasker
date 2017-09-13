// JavaScript Document

var tiles = 10;
var row = 0;
var col = 0;
var start = 0;
var svg;
var dataset;
	
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
	h2: function (g) {
		g.append("rect")
		 .attr("class", this.currentClass)
		 .attr("height", this.end)
		 .attr("width", this.side)
		 .attr("x", this.currentPixelX)
		 .attr("y", this.currentPixelY);
		
		this.currentPixelX = this.currentPixelX + this.side;
		this.threadX = this.threadX + 2;
	},
	d2: function (g,colorArray) {
		g.append("rect")
		 .attr("class", colorArray[this.threadX%this.threadCount])
		 .attr("height", this.side)
		 .attr("width", this.end)
		 .attr("x", this.currentPixelX)
		 .attr("y", this.currentPixelY);
		 
		this.currentPixelX = this.currentPixelX + this.end;
		this.threadX = this.threadX + 1;
	},
	u2: function (g,colorArray) {
		g.append("rect")
		 .attr("class", colorArray[this.threadX%this.threadCount])
		 .attr("height", this.side)
		 .attr("width", this.end)
		 .attr("x", this.currentPixelX)
		 .attr("y", this.currentPixelY - this.side/2);
		 
		this.currentPixelX = this.currentPixelX + this.end;
		this.threadX = this.threadX + 1;
	},
	s1: function () {
	  this.currentPixelX = this.currentPixelX + this.end;
		this.threadX = this.threadX + 1;
	},
	h1: function (g, firstLoop) {
		g.append("rect")
		 .attr("class", this.currentClass)
		 .attr("height", this.end)
		 .attr("width", this.side)
		 .attr("x", this.currentPixelX - this.side/2)
		 .attr("y", this.currentPixelY);
		
		this.currentPixelX = this.currentPixelX + this.side/2;
		this.threadX = this.threadX + 1;
		firstLoop = false;
	},
	threadOne: function (svg, colorArray) {
		var g = svg.append("g")
			.attr("id", "row-" + this.threadY);
		while (this.threadX < this.threadsToWeave) {
			//Log.Notice("threadX=" + this.threadX);
			this.h2(g);
			if (this.threadX >= this.threadsToWeave) {break;}
			this.d2(g, colorArray);
			if (this.threadX >= this.threadsToWeave) {break;}
			this.u2(g, colorArray);
		}
	},
	threadTwo: function (svg, colorArray) {
		var g = svg.append("g")
			.attr("id", "row-" + this.threadY);
    var firstLoop = true;
		while (this.threadX < this.threadsToWeave) {
			/*if (firstLoop == true) { this.h1(g, firstLoop);} else {this.h2(g);} */
			this.h2(g);
			if (this.threadX >= this.threadsToWeave) {break;}
			this.d2(g, colorArray);
			if (this.threadX >= this.threadsToWeave) {break;}
			this.s1();
		}
	},
	threadThree: function (svg, colorArray) {
		var g = svg.append("g")
			.attr("id", "row-" + this.threadY);
		while (this.threadX < this.threadsToWeave) {
			this.d2(g, colorArray);
			if (this.threadX >= this.threadsToWeave) {break;}
			this.s1();
			if (this.threadX >= this.threadsToWeave) {break;}
			this.h2(g);
		}
	},
	threadFour: function (svg, colorArray) {
		var g = svg.append("g")
			.attr("id", "row-" + this.threadY);
		while (this.threadX < this.threadsToWeave) {
			this.s1();
			if (this.threadX >= this.threadsToWeave) {break;}
			this.h2(g);
			if (this.threadX >= this.threadsToWeave) {break;}
			this.d2(g, colorArray);
		}
	},
	weave: function (colorArray) {
	
	 svg = d3.select(document.body)
  	.append("svg")
		.attr('id','svg1')
		.attr('height', this.threadsToWeave * this.end)
		.attr('width', this.threadsToWeave * this.end);
		
		Log.Notice("colorArray.length=" + colorArray.length);
		while (this.threadY < this.threadsToWeave) {
			//Log.Notice("threadY=" + this.threadY);
			
			this.threadX = 0;
			this.currentPixelX = 0;
			this.currentClass = colorArray[this.threadY%this.threadCount];
			this.threadOne(svg,colorArray);
			this.threadY++;
			if (this.threadY >= this.threadsToWeave) {break;}
			this.currentPixelY = this.currentPixelY + this.end;
			
			this.threadX = -1;
			this.currentPixelX = 0 - this.side/2;
			this.currentClass = colorArray[this.threadY%this.threadCount];
			this.threadTwo(svg,colorArray);
			this.threadY++;
			if (this.threadY >= this.threadsToWeave) {break;}
			this.currentPixelY = this.currentPixelY + this.end;
			
			this.threadX = 0;
			this.currentPixelX = 0 ;
			this.currentClass = colorArray[this.threadY%this.threadCount];
			this.threadThree(svg,colorArray);
			this.threadY++;
			if (this.threadY >= this.threadsToWeave) {break;}
			this.currentPixelY = this.currentPixelY + this.end;
			 
			this.threadX = 0;
			this.currentPixelX = 0;
			this.currentClass = colorArray[this.threadY%this.threadCount];
			this.threadFour(svg,colorArray);
			this.threadY++; 
			this.currentPixelY = this.currentPixelY + this.end;
		}
	},
	writeStyle: function (styleArray) {
		var style = "";
		for (var i = 0; i<styleArray.length; i++) {
			var color = styleArray[i][1];

			style += "\n\n." + styleArray[i][0] + "\{\nfill: " + color + ";\n\}\n";
		}
		
		d3.select(document.body)
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
		Log.Notice("Finished with targan");
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
	


dataset = [["green", 2], ["grey", 2], ["red", 4], ["grey", 2], ["tan", 6]];		
datasetX = [["blue", 2], ["grey", 2], ["red", 4], ["grey", 8], ["green", 8]];


var orange = "orange";
var black = "black";
var green = "green";
var dkgreen = "darkgreen";
var white = "white";
var slateblue = "slateblue";
var slateblue = "#336699";
var red = "red";
var yellow = "yellow";
var blue = "blue";
var dkolivegr = "darkolivegreen";
var greygreen = "#667777"; 
var lightgrey = "lightgray";
var lightgray = "lighegray";
var dkorange = "#d2691e";
var brntorange = "#a85418";
var slategray = "slategray";
var forestgreen = "forestgreen";
var magenta = "magenta";
var lightpurple = "#b366b3";
var skyblue = "skyblue";
var darkblue = "darkblue";
var purpleblue = "#6666ff";

// DUNDAS 
dataset1 = [
	[black, 1], [green, 2], [orange, 1], [green, 24], [black, 12],
	[darkblue, 16], [black, 2]
	];
// DUNCAN
dataset2 = [
	[darkblue, 4], [dkgreen, 20], [white, 6], [dkgreen, 20], 
	[purpleblue, 20], [orange, 2]
];
// MACFARLANE
var dataset3 = [
	[orange, 48], [black, 8], [dkgreen, 16], [white, 4], [orange, 12],
	[black, 2], [orange, 12], [white, 4], [dkgreen, 6], [slateblue, 48],
	[black, 16], [orange, 16], [white, 12], [dkgreen, 2]
	];
// MACLEOD OF ARGENTINA
var dataset4 = [
	[red, 4], [yellow, 32], [blue, 24], [white, 6], [blue, 18]
];
// DUNDEE
var dataset7 = [
	[dkorange, 48], [black, 32], [dkorange, 4], [dkgreen, 48],
	[yellow, 8], [white, 4], [magenta, 4], [white, 4], [yellow, 8],
	[skyblue, 14], [white, 3], [lightpurple, 12], [white, 6]
];
// DUNLOP 
var dataset8 = [
	[black, 3], [dkorange, 2], [black, 64], [white, 2], [slateblue, 64],
	[orange, 2], [slateblue, 2], [white, 3]
];
// DUNBAR 
var dataset9 = [
	[white, 1], [slateblue, 4], [dkorange, 30], [white, 2], [dkgreen, 4],
	[white, 2], [dkgreen, 12], [white, 2], [dkgreen, 4], [white, 2], 
	[yellow, 12], [dkgreen, 6]
];
// DOUGLAS CLAN
var dataset5 = [
	[dkorange, 6], [black, 12], [greygreen, 2], [black, 12], [greygreen, 2],
	[black, 4], [greygreen, 8], [black, 2], [greygreen, 8], [dkorange, 6],
	[black, 3], [greygreen, 6], [black, 12], [lightgrey, 16], [black, 3],
	[lightgrey, 6], [greygreen, 3]
];
// ST. ANDREWS
var dataset6 = [
	[brntorange, 11], [slategray, 2], [brntorange, 22], [slateblue, 2],
	[white, 18], [dkolivegr, 22], [slateblue, 2], [dkolivegr, 11]
];
// MACFIE
var dataset10 = [
	[orange, 14], [dkgreen, 8], [yellow, 4], [white, 4], [orange, 12],
	[black, 2], [orange, 12], [white, 4], [dkgreen, 6], [slateblue, 48],
	[black, 16], [orange, 16], [white, 12], [dkgreen, 2]
];
var datasetExp = new Array();
var dsStyleArray = new Array();

	// expand datasets 