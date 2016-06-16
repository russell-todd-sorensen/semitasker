// JavaScript Document


var points = [];
var pointIndex = 0;
var lineIndex = 1;
var animateIndex = 0;
var animateClassIndex = 0;
var lineTimeoutId ;
var pointTimeoutId;
var mismatch = 0;
var circleLabelsEnabled = false;
var backgroundColor = "rgb(255, 255, 255)";
var classArray = [];

var allClassArray = new Array();

var tmpClassArray = [];
var circleList = [];


var startAttrs = {
	r:2.5,
	'stroke-width':0
};

var endAttrs = {
	r:'10',
	stroke: '#333',
	'stroke-width': '1'

};

var startStyles = {
	opacity: 0.0
};

var endStyles = {
	opacity: 1.0
	
}

var hClass = '.h-240'

var hiliteConfig = {
	duration: 1000,
	startAttrs: startAttrs,
	endAttrs: endAttrs,
	startStyles: startStyles,
	endStyles: endStyles,
	easing: 'linear'
}

var sortByHAsc  = function (a,b) {return (b.h < a.h ? 1 : b.h == a.h ? 0 : -1);}
var sortByHDesc = function (a,b) {return (a.h < b.h ? 1 : a.h == b.h ? 0 : -1);}
var sortByFloatAsc = function (a,b) {return (parseFloat(b) < parseFloat(a) ? 1 : parseFloat(b) == parseFloat(a) ? 0 : -1);}


function scheduleFunction(funcRef, timeout, rescheduleOnSuccessP, passEventP) {

  var evt = null;
	
	if (arguments.length > 1) {
		if (timeout <= 0 ) {
			timeout = 10; //milliseconds
		}
	}
	else {
		var timeout = 10; //ms
	}
	
	if (arguments.length < 3) {
		var rescheduleOnSuccessP = false;
	}
	
  if (arguments.length > 3) {
		if (passEventP) {
			var evt = event;
		} 
	} 
	else {
    var passEventP = false;
	}
  
	var result = funcRef(evt);
	
	if (rescheduleOnSuccessP && result) {
		setTimeout(scheduleFunction, timeout, 
		           funcRef, timeout, 
							 rescheduleOnSuccessP, 
							 passEventP);
	}
}

function PointGraph () {
    this.animateIndex = 0;
		this.animateClassIndex = 0;
    this.drawLine = function () {
	    var pMinusOne = lineIndex-1;
	    if (lineIndex >= points.length) {
		    //Log.Notice('points.length=' + points.length + ' lineIndex = ' + lineIndex);
		    return false;
	    }
      var p1 = points[pMinusOne];
	    var p2 = points[lineIndex];
	    d3.select('#lines')
	      .append('line')
	      .attr({
		    'x1':p1.x,
	      'y1':p1.y,
		    'x2':p2.x,
		    'y2':p2.y,
		    'stroke':'rgb(' + p1.r + ',' + p1.g +',' + p1.b +')'
				}
				);
	      lineIndex++;
	      //lineTimeoutId = setTimeout(myGraph.drawLine,10);
				return true;
		};
    this.drawPoint = function () {
	    if (pointIndex >= points.length) {
		    //Log.Notice('points.length=' + points.length + ' pointIndex = ' + pointIndex);
		    return false;
	    }
			
      var classAdd = "";
	    var p1 = points[this.pointIndex];
			var class1 = "" + p1.h;
			class1 = class1.replace('.','_');
			var hsl2 = d3.hsl(p1.h,p1.s,p1.l);
			var rgb2 = hsl2.rgb();
			if (rgb2.r != p1.r || rgb2.g != p1.g || rgb2.b != p1.b) {
				mismatch++;
				classAdd = " mismatch";
				Log.Notice("r: " + p1.r + " " + rgb2.r + ", g: " + p1.g + " " + rgb2.g + ", b: " + p1.b + " " + rgb2.b );
				p1.r2 = rgb2.r;
				p1.g2 = rgb2.g;
				p1.b2 = rgb2.b;
				p1.hsl = "hsl(" 
				+ hsl2.h 
				+ "," 
				+ (Math.round(parseFloat(hsl2.s) * 1000)/10)
				+ "%," 
				+ (Math.round( parseFloat(hsl2.l) * 1000)/10) + "%)";
			} else {
				classAdd = "";
			}
	    d3.select('#points')
	      .append('circle')
	      .attr({
					'class':'h-' + class1 + classAdd,
		      'cx':p1.x,
	        'cy':p1.y,
		      'r':5,
		      'fill':'rgb(' + p1.r + ',' + p1.g +',' + p1.b +')'})
		     .transition()
		     .ease('linear')
		     .duration(1000)
		     .attr('r',2.5);
	    pointIndex++;
	    //pointTimeoutId = setTimeout(myGraph.drawPoint,10);
			return true;
    };
	  this.animateColors = function() {
    	if (this.animateIndex > 360) {
				return false;
			}

			var hClass = ".h-" +  this.animateIndex;
			var selection = d3.selectAll('#points ' + hClass);
			
			while (selection[0].length == 0 && this.animateIndex <= 360) {
				this.animateIndex = this.animateIndex+1;
				hClass = ".h-" + this.animateIndex;
				selection = d3.selectAll('#points ' + hClass);
			}
			
			if (selection[0].length) {
				
				//Log.Notice('animateColors animateIndex=' + this.animateIndex + 'selection.length=' + selection[0].length);
				selection
					.transition()
					.duration(hiliteConfig.duration)
					.ease('linear')
					.delay(function(i) {return i*10})
					.attr(hiliteConfig.endAttrs)
					.style(hiliteConfig.endStyles)
					.each('end', function(d,i) {
						//Log.Notice('in end for i=' + i);
						d3.select(this)
							.transition()
							.duration(hiliteConfig.duration)
							.ease('linear')
							.delay(function(i) {return i*10})
							.style(hiliteConfig.startStyles)
							.attr(hiliteConfig.startAttrs);
					 });
				
			} else {
				//Log.Notice('No selection at animateIndex=' + this.animateIndex);
				return false;
			}
			
			this.animateIndex = this.animateIndex+1;

			return true;
		};
		
		// ANIMATE COLORS BY CLASS 2
		this.animateColorsByClass2 = function(type) {
			if (arguments.length < 1) {
				var type = "h";
			}
    	if (this.animateClassIndex >= classArray.length) {
				return false;
			}

			var hClass = ".h-" + classArray[this.animateClassIndex];
			var selection = d3.selectAll('#points ' + hClass);
			
			while (selection[0].length == 0 && this.animateClassIndex <= classArray.length) {
				this.animateClassIndex = this.animateClassIndex+1;
				hClass = ".h-" + classArray[this.animateClassIndex];
				selection = d3.selectAll('#points ' + hClass);
			}
			
			if (selection[0].length) {
				
				//Log.Notice('animateColorsByClass2 animateClassIndex=' + this.animateClassIndex + ' selection.length=' + selection[0].length);
				selection
					.transition()
					.duration(hiliteConfig.duration)
					.ease('linear')
					.delay(function(i) {return i*10})
					.attr(hiliteConfig.endAttrs)
					.style(hiliteConfig.endStyles)
					.each('end', function(d,i) {
						//Log.Notice('in end for i=' + i);
						d3.select(this)
							.transition()
							.duration(hiliteConfig.duration)
							.ease('linear')
							.delay(function(i) {return i*10})
							.style(hiliteConfig.startStyles)
							.attr(hiliteConfig.startAttrs);
					 });
				
			} else {
				//Log.Notice('No selection at animateClassIndex=' + this.animateClassIndex);
				return false;
			}
			
			this.animateClassIndex = this.animateClassIndex + 1;

			return true;
		};
}

var myGraph = new PointGraph();

var rgb2hsl = function (r, g, b) {
	var hBuckets = 10;
	var buckets = 1000;
	var r1 = r;
	var g1 = g;
	var b1 = b;
	var min = Math.min(r /= 255, g /= 255, b /= 255),
	    max = Math.max(r, g, b),
		  d = max - min, h, s, l = (max + min) / 2;
	if (d) {
		s = l < .5 ? d / (max + min) : d / (2 - max - min);
		if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
		h = Math.round(h*60*hBuckets)/hBuckets;
	} else {
		h = Math.round(r1/255*360*hBuckets)/hBuckets;
		s = l > 0 && l < 1 ? 0 : max;
	}
	// now round s and l to correct value
	s = Math.round(s * buckets)/buckets;
	l = Math.round(l * buckets)/buckets;
	
  return {h:h,s:s,l:l,d:d,max:max,min:min,r:r1,g:g1,b:b1,x:0,y:0};
}


function generatePoints(r1,g1,b1) {
  //points[points.length] = {x:Config.xOffset,y:Config.yOffset,r:r1,g:g1,b:b1};
	points[points.length] = {};
	for (var r=Config.rStart;r<=Config.rEnd;r=r+Config.rStep) {
		for (var g=Config.gStart;g<=Config.gEnd;g=g+Config.gStep) {
			for (var b=Config.bStart; b<=Config.bEnd;b=b+Config.bStep) {
				var data = rgb2hsl(r,g,b);
				data.y = Math.round(Config.yOffset - (data.d * Config.yExpand));
				data.x = Config.xOffset + (r + g + b);
				points[points.length] = data;
			}
		}
	}
  // put sort function here
	// points.sort(sortByHAsc);
	createClassList(points);
	createClassList2(points,allClassArray,"h");
	createClassList2(points,allClassArray,"s");
	createClassList2(points,allClassArray,"l");
	
}


function createClassList(pointsArray) {
	var obj, h;
	for (var i = 0; i<pointsArray.length;i++) {
		obj = pointsArray[i];
		h = "" + obj.h;
		if (h != undefined && tmpClassArray[h] == undefined) {
			tmpClassArray[h] = 1;
			classArray[classArray.length] = parseFloat(h);
		}
	}
	
	classArray.sort(sortByFloatAsc);
	var tmp;
	for (var i = 0; i<classArray.length;i++) {
		tmp = "" + classArray[i];
		classArray[i] = tmp.replace('.','_');
	}
}

function createClassList2(pointsArray, classArrayRef, classType) {
	var obj,value;
	tmpClassArray = [];
	classArrayRef[classType] = new Array();
	var localArray = classArrayRef[classType];
	for (var i = 0; i<pointsArray.length;i++) {
		obj = pointsArray[i];
		value = "" + obj[classType];
		if (value != undefined && tmpClassArray[value] == undefined) {
			tmpClassArray[value] = 1;
			localArray[localArray.length] = parseFloat(value);
		}
	}
	
	localArray.sort(sortByFloatAsc);
	var tmp;
	for (var i = 0; i<localArray.length;i++) {
		tmp = "" + localArray[i];
		localArray[i] = tmp.replace('.','_');
	}
}

function generatePoints2(r1,g1,b1) {
  points[points.length] = {x:Config.xOffset,y:Config.yOffset,r:r1,g:g1,b:b1};
	var maxPoints = Config.maxPoints;

	for (var i = 255; i> 5; i--) {
		if (255%i == 0) {
			var step = i;
			for (var r=Config.rStart;r<=Config.rEnd;r=r+step) {
				for (var g=Config.gStart;g<=Config.gEnd;g=g+step) {
					for (var b=Config.bStart; b<=Config.bEnd;b=b+step) {
						var data = rgb2hsl(r,g,b);
						data.y = Math.round(Config.yOffset - (data.d * Config.yExpand));
						data.x = Config.xOffset + (r + g + b);
						points[points.length] = data;
					}
				}
			}
		}
		if (points.length >= maxPoints) {
			break;
		}
	}
}

function adjustViewBox(id) {
	form = document.forms[Config.formId];
	var x =  parseInt(form["x"].value);
	var y = parseInt(form["y"].value);
	var h = parseInt(form["h"].value);
	var w = parseInt(form["w"].value);
	var viewBox = "" + x + " " + y + " " + w + " " + h;
	
	document.getElementById(id).setAttributeNS(null,'viewBox', viewBox);
}

function toggleVisibility(selector) {
	
	var obj = event.target;
	
	if (obj.checked) {
	  d3.selectAll(selector).style('display','block');
	} else {
		d3.selectAll(selector).style('display','none');
	}
}


function enableCircleLabels() {
  if (!circleLabelsEnabled) {
	d3.selectAll('#points circle')
	  .data(points)
		.on("mouseover", function(d,i) {
			 var localColorHsl, localColorRgb,localPointInfo;
			 var offset = 5;
			 var p = points[i];
			 var x = p.x;
			 var y = p.y;
			 var pointInfo = "pt[" + i + "]= (" + x + "," + y + ")";
			 var rgbColor = "rgb(" + p.r + "," + p.g + "," + p.b + ")";
			 var hslColor = "hsl(" + p.h + "," + p.s + "," + p.l + ")";
			 var info = pointInfo + " " + rgbColor + " " + hslColor ;
			 var localColors = [], lp, grp;
			 for (var j = 0; j<points.length; j++) {
				 lp = points[j];
				 if (lp.x == x && lp.y == y) {
					 points[j].rgbColor = "rgb(" + lp.r + "," + lp.g + "," + lp.b + ")";
					 points[j].hslColor = "hsl(" + lp.h + "," + lp.s + "," + lp.l + ")";
					 localPointInfo = "pt[" + i + "]= (" + x + "," + y + ")"
					 localColors[localColors.length] = points[j];
					 
					 Log.Notice(localPointInfo + " : " + points[j].rgbColor + " " + points[j].hslColor);
				 }
			 }
			 var n = localColors.length;
			 evt = d3.event;
			 //Log.Notice("localColors.length=" + n);
			 d3.select('#svg')
			 .append("text")
			 	.attr("id", "text-" + i)
				.attr("x", 725)
				.attr("y", 25)
				.attr('text-anchor','middle')
				.attr("fill", rgbColor)
				.text(info);
			grp = d3.select('#svg')
			  .append('g')
				.attr({
					id: 'group_' + i,
					x: 0, //evt.x + 10,
				  y: 0, //evt.y + 10,
					transform: 'translate(' + (parseInt(evt.x) + offset) + ',' + (parseInt(evt.y) + offset) + ')',
				}).on("click", function (d,i) {
					var evt = d3.event;
					var alt = evt.altKey;
					var ctrl = evt.ctrlKey;
					if (alt) {
						d3.select(this)
							.transition()
							.delay(0)
							.duration(1000)
							.attr ({
								transform: function (d, i) {
									circleList[circleList.length] = i;
									return 'scale(3) translate(' + Math.round(10) + ',' + Math.round(100+25*circleList.length) + ')';
							   }
						  })
					} else if (ctrl) {
						Log.Notice("ctrlKey pressed");
					} else {
					  d3.select(this).remove();
					}
				}); 
			grp
	      .transition()
				.delay(2000)
				.duration(1000)
				.attr({
					transform: 'scale(3) translate(' + Math.round((parseInt(evt.x) - offset)/3) + ',' + Math.round((parseInt(evt.y)- offset)/3) + ')'
				})
				;
			grp 
				.append('rect')
				.attr({
					id: 'rect-' + i,
					x: offset, //evt.x + 10,
				  y: offset, //evt.y + 10,
					height: 22,
			    width: 22 * n,
					fill: 'url(#lg-1)'
				});
				
      for (var k = 0; k< n; k++) {
				grp
				.append('circle')
				.attr({
					cx: offset + 11 + (22 * k), // evt.x + 21 + (22 * k),
					cy: offset + 11, //evt.y + 21,
					r: 10,
					fill:
						"rgb(" + localColors[k].r + "," + localColors[k].g + "," + localColors[k].b + ")"
				});
			}
		})
		.on("mouseout",function(d,i) {
			  d3.select("#text-" + i)
					.remove();
				//d3.select("#group-" + i)
				//  .remove();
		});
		circleLabelsEnabled = true;
	}
}



function changeRgbGap(inputId, configProperty) {

	var gap = parseInt(document.getElementById(inputId).value);
  Config[configProperty] = gap;
	
	var call = "Data.saveInput('" + inputId + "','changeRgbGap'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
}
