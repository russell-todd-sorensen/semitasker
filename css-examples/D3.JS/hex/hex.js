// Game of Hex using javascript / d3.js graphics in SVG

var move = 0;

function playHex() {
	
	var backingHexFill = "rgba(150,200,25,.85)";
	var largeHexFill = "rgba(150,200,25,.40)";
	var hexSide = 75;
	var steps = 1;
	var startingCentroid = [325,350];	
	
	// Default hexagon attributes
	var hexAttrs = {
				"fill": "#faa",
			  "class": "hexagon",
				"stroke": "#231F20",
				"stroke-miterlimit": 10
	};

	// d3 references
	var svg = d3.select("svg");
  var body = d3.select("body");
	var rules = body.select("#rules");
	var player1 = rules.select(".player1");
	var player2 = rules.select(".player2");
	var centroid, innerCentroid, hex;

	var largeMatrix = new Array();
	var largeMatrixIndex = 0;
	
	var directions =        ["s", "se", "ne", "n", "nw", "sw", "w", "e"];
	var directionsRight =   ["center", "ne", "se", "s", "e"];
	var specialDirections = ["center", "w", "e", "nnw", "nne", "sse", "ssw"]; 
	var allDirections =     ["n", "ne",  "se", "nw", "s", "sw", "w", "e", "nnw", "nne", "sse", "ssw"];

	var innerHexagon, innerInnerHexagon;

  // *********************************************************************** //
	// functions used here

	var tileHex = function (svg, points, direction) {
		
		var poly = d3.geom.polygon(points);

		centroid = poly.centroid();

		var svgPoints = tileStep(points, [0,10]);
		
		Log.Notice("svgPoints=" + svgPoints);
		
		svg.append("polygon")
		   .attr("fill", "#fff")
			 .attr("stroke", "#231F20")
			 .attr("stroke-miterlimit", 10)
			 .attr("points", svgPoints);
	};
	
	var arrayToPoints =  function(array) {
		var i = -1;
		var sides = array.length;

		var svgPoints = "";
		
		while (++i<sides) {
			svgPoints += array[i][0] + "," + array[i][1] + " ";
		}
	
		return svgPoints;
	};

  var createHexPointsArray = function (side, centroid) {
		xyDim = Math.cos(Math.PI/6)*side;
		//Log.Notice("side=" +side + " xyDim=" + xyDim); 
		var hexagon = new Array(6);
		// create point1 (uppermost,leftmost)
	  hexagon[0] = [centroid[0] - side/2, centroid[1] - xyDim];
		hexagon[1] = [centroid[0] + side/2, centroid[1] - xyDim];
		hexagon[2] = [centroid[0] + side, centroid[1]];
		hexagon[3] = [centroid[0] + side/2, centroid[1] + xyDim ];
		hexagon[4] = [centroid[0] - side/2, centroid[1] + xyDim];
		hexagon[5] = [centroid[0] - side, centroid[1]];
	
		
	  return hexagon;
	};
	
	
  var createSvgHexagon = function(svg, hexagon, hexAttrs) {

	  if(arguments.length < 3) {
			var hexAttrs = {
				"fill": "#fff",
			  "class": "hexagon",
				"stroke": "#231F20",
				"stroke-miterlimit": 10
			};
		}
		
		svg.append("polygon")
		   .attr(hexAttrs)
			 .attr("points",arrayToPoints(hexagon));
		
		return hexagon;
  };
	
	var getPolyCentroid = function(polygon) {
	  return d3.geom.polygon(polygon).centroid();
	};

  
  var getAdjacentCentroid = function (side, centroid, direction, scale) {
	
	  if (arguments.length < 4) {
			scale = 1;
		}
		// generate centroid x=scale
		side *= scale;
		
	  var xyDim = Math.cos(Math.PI/6)*side;
		var newCentroid = new Array(2);
		switch (direction) {
			// primary directions:
			case "s": 
				newCentroid = [centroid[0], centroid[1] + 2*xyDim];
				break;		
			case "n":
			  newCentroid = [centroid[0], centroid[1] - 2*xyDim];
				break;
			case "nw": 
			  newCentroid = [centroid[0]-3/2*side, centroid[1]-xyDim];
				break;
			case "ne":
			  newCentroid = [centroid[0]+3/2*side, centroid[1]-xyDim];
				break;
			case "se":
			  newCentroid = [centroid[0]+3/2*side, centroid[1]+xyDim];
				break;
		  case "sw":
			  newCentroid = [centroid[0]-3/2*side, centroid[1]+xyDim];
				break;
			// secondary directions (not really adjacent):
			case "w":
			  newCentroid = [centroid[0]-3*side, centroid[1]];
				break;
			case "e":
			  newCentroid = [centroid[0]+3*side, centroid[1]];
				break;
			case "nne": 
			  newCentroid = [centroid[0] + 3/2*side, centroid[1] - 3*xyDim];
				break;
			case "nnw": 
			  newCentroid = [centroid[0] - 3/2*side, centroid[1] - 3*xyDim];
				break;
			case "ssw": 
				newCentroid = [centroid[0] - 3/2*side, centroid[1] + 3*xyDim];
				break;
			case "sse": 
			  newCentroid = [centroid[0] + 3/2*side, centroid[1] + 3*xyDim];
				break;
		  case "self":
			case "center":
			  newCentroid = [centroid[0], centroid[1]];
				break;
			default: 
			  Log.Error("unknown direction: '" + direction + "'");
				break;
		}
		
		return newCentroid;
		
	};
	
	
	function generateCentroids (matrix, centroid, side, directions, scale) {
		if (arguments.length < 5) {
			scale = 1;
		}
		for (var j in directions) {
			matrix[matrix.length] = getAdjacentCentroid(side, centroid, directions[j], scale);
		}
	}

  function getDirectionMap ( direction ) {
		
		//var map = new Array();
		switch (direction) {
			case "nne":
			  map = ["nnw", "w", "ssw", "sse", "e"];
				break;
			case "e":
			  map = ["nnw", "w", "ssw", "sse", "nne"];
				break;
			case "sse":
			  map = ["nnw", "w", "ssw", "e", "nne"];
				break;
			case "ssw":
			  map = ["nnw", "w", "sse", "e", "nne"];
				break;
			case "w":
			  map = ["nnw", "ssw", "sse", "e", "nne"];
				break;
			case "nnw":
			  map = ["w", "ssw", "sse", "e", "nne"];
				break;
		  case "center":
			case "self":
			  map = ["nnw", "w", "ssw", "sse", "e", "nne"] 
				break;
		}
		
		return map;
	}

  generateCentroids(largeMatrix, startingCentroid, hexSide, specialDirections )
	
	// Copy of matrix used to fill in blanks
	var specialMatrix = new Array();
	for (var i = 0; i<largeMatrix.length; i++) {
		specialMatrix[i] = largeMatrix[i];
	}
	
	generateCentroids(largeMatrix, startingCentroid, hexSide, ["n", "ne",  "se", "nw", "s", "sw"]);
	
  // add in extra centroids at 2x 
	generateCentroids(largeMatrix, startingCentroid, hexSide, ["n", "s", "ne", "se", "sw", "nw"], 2);
	
	
	// Create large backing hexagon.
	var backingHexAttrs = new Object(hexAttrs);
	backingHexAttrs.class="backing-hexagon";
	backingHexAttrs.fill= backingHexFill;//"#19a";
	backingHexAttrs.transform="rotate(" + 30 + ", " + startingCentroid[0] + ", " + startingCentroid[1] + ")";
	
	hex = createHexPointsArray(9.3*hexSide*Math.cos(Math.PI/3), startingCentroid)
	createSvgHexagon(svg, hex, backingHexAttrs);
	
	// create secondary large backing hexagons
	var largeHexAttrs = new Object(hexAttrs);
	largeHexAttrs.class="large-hexagon";
	largeHexAttrs.fill= largeHexFill;//"#963";
	largeHexAttrs.transform="";
	
	for (var i = 0; i<largeMatrix.length; i++) {
		hex = createHexPointsArray(hexSide, largeMatrix[i]);
		createSvgHexagon(svg, hex, largeHexAttrs);
		Log.Notice("hex i=" + i + " at=" + largeMatrix[i]);
	}
	
	var miniMatrix = new Array();
  for (var i = 0; i<largeMatrix.length;i++) {
		generateCentroids(miniMatrix, largeMatrix[i], hexSide/3, ["center", "n", "ne", "se", "s", "sw", "nw"]);
	}
		
  // add in special stuff
	for (var i = 0; i< specialMatrix.length; i++) {
		generateCentroids(miniMatrix, specialMatrix[i], hexSide/3, getDirectionMap(specialDirections[i]));
	}
	
	var miniData = new Array();
	
  for (var i = 0; i< miniMatrix.length; i++) {
		hex = createHexPointsArray(hexSide/3, miniMatrix[i]);
		miniData[i] = {
			"side": hexSide/3,
			"centroid": miniMatrix[i],
			"hex": hex,
			"filled": false,
			"fill": "#fff"
		}
		createSvgHexagon(svg, hex);
	}

	
	svg.selectAll("polygon.hexagon")
		 .data(miniData)
		 .transition("bounce-out-in")
		 .delay(function (d, i) { return i * 10;})
		 .duration(2000)
		 .attr("fill", "#999")
		 .attr("opacity", function (d,i) { 
		 		//return 1.1 - 1/( Math.ceil((i+1)/6));
				return .75;
		 });
		 
	svg.selectAll("polygon.hexagon")
		 .on("click", function(d,i) {
			 d3.select(this)
				//.transition()
				//.ease("bounce-in-out")
				//.duration(2000)
				.attr("fill", function(d,i) {
		      if (!d.filled) {
						d.fill = move++%2 ? "#f3a" : "#a3f";
						d.filled = true;
			      if (move%2 == 0) {
							Log.Notice("move=" + move + ", now player= player1" );
							var attrs = {"fill": "#a3f", "stroke": "#000"};
							player2
							   .attr("style", "border-color='#900'");
							player1
							   .attr("style", "border-color='silver'");
						} else {
							Log.Notice("move=" + move + ", now player= player2" );
							var attrs = {"fill":  "#f3a", "stroke": "#000"};
							player2
							   .style("border-color","#900");
							player1
							   .style("border-color","silver");
						}
						svg.insert("circle")
						 .attr("cx", d.centroid[0])
						 .attr("cy", d.centroid[1])
						 .attr("r", d.side * Math.cos(Math.PI/6))
						 .attr(attrs);
					}				
					return d.fill; // "#999"; //d.fill;
				});
		 });
};
