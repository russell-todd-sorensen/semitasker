// JavaScript Document

var svg;
var subWindow; // used in displaying svg in separate window

var Tartan = {
	threadX: 0,
	threadY: 0,
	currentPixelX: 0,
	currentPixelY: 0,
	side: 4,
	end: 2,
	threadCount: 0,
	threadsToWeave: 0,
	svgData: "",
	
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

		while (this.threadX < this.threadsToWeave) {
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
	weave: function (colorArray, styleArray) {
	 var svgBody = d3.select(document.body);
	 var svgContainer =  svgBody.select("#svg-container");
	 svgContainer.html("");
	 var width = this.threadsToWeave * this.end;
	 var height = width;
	 
	 svg = svgContainer
	 	.append("svg")
		.attr("version", "1.1")
		.attr("id", "Tartan-In-SVG")
		.attr("xmlns", "http://www.w3.org/2000/svg")
		.attr("x", 0)
		.attr("y", 0)
		.attr('height', height)
		.attr('width', width)
		.attr('viewbox', "0 0 " + width + " " + height)
		;
		
		this.writeStyle(svg, styleArray);
		
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
		// de-initialize tartan
		this.threadX=0;
		this.threadY=0;
		this.currentPixelX = 0;
		this.currentPixelY = 0;
		this.threadCount = 0;
		this.threadsToWeave = 0;
		
		this.svgData = svgContainer.html();
		
	},
	writeStyle: function (svg, styleArray) {
		
		var style = "";
		
		for (var i = 0; i<styleArray.length; i++) {
			var color = styleArray[i][1];

			style += "\n\n." + styleArray[i][0] + "\{\nfill: " + color + ";\n\}\n";
		}
		svg
			.append("style")
			.text(style);
	},
	getOptions: function () {
		// nothing here yet
	},
	init: function (inputArray, outputArray, styleArray, threadsToWeave) {
		
		this.getOptions();
		
		expandColorArray(inputArray, outputArray, styleArray);
		Log.Notice("outputArray=" + outputArray);
		this.threadCount = outputArray.length;
		if (arguments.length == 4) { 
			this.threadsToWeave = threadsToWeave;
		} else {
			this.threadsToWeave = this.threadCount;
		}
		
		//this.writeStyle(styleArray);
		
		this.weave(outputArray, styleArray);
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
 
	
function calculateTartanThreads(data) {
	var threadCount = 0;
	for (var i = 0; i< data.length; i++) {
		threadCount += data[i][1] * 2;
	}
	return threadCount;
}

function loadTartan(id, threads, forExport,reverseThreads) {
	if (parseInt(id) == 0) {
		return false;
	}
			
	var data = dataset[parseInt(id)][1];
	if (forExport === "yes") {
		threads = calculateTartanThreads(data);
	}	
	
	Log.Notice("forExport=" + forExport + " data=" + data);
	datasetExp = new Array();
	dsStyleArray = new Array();
	
  if (reverseThreads === "yes") {
		var reverseData = new Array();
		for(var i = data.length-1; i >= 0; i--) {
			reverseData[reverseData.length] = data[i];
		}
		Tartan.init(reverseData, datasetExp, dsStyleArray, parseInt(threads) );
	} else {
		Tartan.init(data, datasetExp, dsStyleArray, parseInt(threads) );
	}
	
}

function doTartan(evt) {
	var id = $('#tartan option:selected').attr("value");
	var forExport = $('#tartans input.forExport:checked').attr("value")
	var reverseThreads = $('#tartans input.reverse:checked').attr("value")
	var threads = $('#tartans input#threads').val();
	Log.Notice("threads=" + threads);
	if (reverseThreads == undefined) {
		reverseThreads = "no";
	}
	if (forExport == undefined) {
		forExport = "no";
	} 
 	if (threads && parseInt(threads) > 50  && parseInt(threads) < 1200 ) {
		// do nothing
	} else {
			threads = 50;
	}
	Log.Notice("id= " + id + " threads='" + threads + "'");
  loadTartan(id, threads, forExport, reverseThreads);
}



function writeSvgImage() {

	
	var svgHandle = $("#svg1");
	var styleHandle = $("body style");

	var width = svgHandle.attr("width");
	var height = svgHandle.attr("height");
	var viewbox = "0 0 " + width + " " + height;
	

	subWindow = window.open(
	 "#svg",  // url to open
	 "example", // window name
	 "height=" + height + ",width=" + width + ",toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,chrome=true,titlebar=true", // options
	 "true" // replace (removes current document)
	 );

	
  var svgDoc = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
	+ "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" "
	+ "\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n";
	
	svgDoc += Tartan.svgData;

	
	subWindow.document.write(svgDoc);
}

	