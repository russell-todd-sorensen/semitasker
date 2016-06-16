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

var animationConfig = [];

animationConfig["default"] = {
	attrs: {
		start:{r:2.5,},
 		end: {r:10,},
	},
	styles: {
		start: {
			'opacity': 0.0,
			'stroke-width':0,
			'stroke':  '#666',
			'stroke-dasharray': 0,
			'stroke-linecap': 'butt',
		},
		end: {
			'opacity': 1.0,
			'stroke-width': 1,
			'stroke':  '#666',
			'stroke-dasharray': 0,
			'stroke-linecap': 'butt',
		}
	}
};

animationConfig["balloon"] = {
	attrs: {
  	start:{r:10,},
  	end: {r:20,}
	},
	styles: {
		start: {
			'opacity': 0.4,
			'stroke-width':5,
			'stroke':  'url(#rg-1)',
			'stroke-dasharray': 5,
			'stroke-linecap': 'round'
		},
		end: {
			'opacity': 1.0,
			'stroke-width': 5,
			'stroke':  'url(#rg-1)',
			'stroke-dasharray': 5,
			'stroke-linecap': 'round'
		}
	}

};

animationConfig["balloon2"] = {
	attrs: {
  start: {r:10,},
  end: {r:30,},
	},
	styles: {
		start: {
			'opacity': 0.7,
			'stroke-width':5,
			'stroke-dasharray': 10,
			'stroke-opacity': 1.0,
			'stroke-linecap': 'round'
		},
		end: {
			'opacity': .5,
			'stroke-width': 3,
			'stroke-dasharray': 10,
			'stroke-opacity': 0.8,
			'stroke-linecap': 'round'
		}
	}
};

animationConfig["balloon3"] = {
	attrs: {
  start: {r:6,},
  end: {r:35,},
	},
	styles: {
		start: {
			'opacity': 0.7,
			'stroke-width':12,
			'stroke-dasharray': 3,
			'stroke-opacity': 1.0,
			'stroke-linecap': 'butt'
		},
		end: {
			'opacity': .3,
			'stroke-width': 20,
			'stroke-dasharray': 3,
			'stroke-opacity': 0.8,
			'stroke-linecap': 'butt'
		}
	}
};

animationConfig["balloon4"] = {
	attrs: {
  start: {r:2,},
  end: {r:8,},
	},
	styles: {
		start: {
			'opacity': 0.7,
			'stroke-width':30,
			'stroke-dasharray': 3,
			'stroke-opacity': 0.5,
			'stroke-linecap': 'butt'
		},
		end: {
			'opacity': .3,
			'stroke-width': 20,
			'stroke-dasharray': 3,
			'stroke-opacity': 0.8,
			'stroke-linecap': 'butt'
		}
	}
};

animationConfig["balloon5"] = {
	attrs: {
  start: {r:6,},
  end: {r:6,},
	},
	styles: {
		start: {
			'stroke-width':40,
			'stroke-dasharray': 2,
			'stroke-opacity': 0.5,
			'stroke-linecap': 'butt'
		},
		end: {
			'stroke-width': 20,
			'stroke-dasharray': 3,
			'stroke-opacity': 0.8,
			'stroke-linecap': 'butt'
		}
	}
};

animationConfig["balloon6"] = {
	attrs: {
  start: {r:.5,},
  end: {r:9,},
	},
	styles: {
		start: {
			'opacity': 0.7,
			'stroke-width':35,
			'stroke-dasharray': 5,
			'stroke-opacity': 0.5,
			'stroke-linecap': 'butt'
		},
		end: {
			'opacity': .4,
			'stroke-width': 15,
			'stroke-dasharray': 3,
			'stroke-opacity': 0.8,
			'stroke-linecap': 'butt'
		}
	}
};


animationConfig["balloon7"] = {
	attrs: {
  start: {r:15,},
  end: {r:6,},
	},
	styles: {
		start: {
			'opacity': 0.4,
			'stroke-width':40,
			'stroke-dasharray': 1,
			'stroke-opacity': 0.3,
			'stroke-linecap': 'miter'
		},
		end: {
			'opacity': .6,
			'stroke-width': 15,
			'stroke-dasharray': 5,
			'stroke-opacity': 0.8,
			'stroke-linecap': 'miter'
		}
	}
};

animationConfig["balloon8"] = {
	attrs: {
  start: {r:4,},
  end: {r:15,},
	},
	styles: {
		start: {
			'opacity': 0.4,
			'stroke-width':4,
			'stroke-dasharray': .5,
			'stroke-opacity': 0.3,
			'stroke-linecap': 'butt'
		},
		end: {
			'opacity': .6,
			'stroke-width': 15,
			'stroke-dasharray': 10,
			'stroke-opacity': 0.8,
			'stroke-linecap': 'butt'
		}
	}
};

animationConfig["balloon9"] = {
	attrs: {
  start: {r:2,},
  end: {r:30,},
	},
	styles: {
		start: {
			'opacity': 0.8,
			'stroke-width':30,
			'stroke-dasharray': .52,
			'stroke-opacity': 0.3,
			'stroke-linecap': 'butt'
		},
		end: {
			'opacity': .8,
			'stroke-width': 10,
			'stroke-dasharray': 7,
			'stroke-opacity': 0.8,
			'stroke-linecap': 'butt'
		}
	}
};
animationConfig["rim"] = {
	attrs: {
  start: {r:7,},
  end: {r:12,},
	},
	styles: {
		start: {
			'opacity': 1.0,
			'fill-opacity': 0.0,
			'stroke-width':2,
			'stroke-dasharray': 7,
			'stroke-opacity': 1.0,
			'stroke-linecap': 'round'
		},
		end: {
			'opacity': 1.0,
			'fill-opacity': 0.8,
			'stroke-width': 3,
			'stroke-dasharray': 10,
			'stroke-opacity': 0.8,
			'stroke-linecap': 'round'
		}
		
	}
};


animationConfig["ratchet"] = {
	attrs: {
  start: {r:2.5,},
  end: {r:10,},
	},
	styles: {
		start: {
			'opacity': 0.1,
		'stroke-width':3,
		'stroke-dasharray': 3,
		'stroke-opacity': 1.0,
		'stroke-linecap': 'butt',
		},
		end: {
			'opacity': 1.0,
			'stroke-width': 10,
			'stroke-dasharray': 2,
			'stroke-opacity': 1.0,
			'stroke-linecap': 'butt',
		}
	}
};

animationConfig["ratchet2"] = {
	attrs: {
  start: {r:10,},
  end: {r:5,},
	},
	styles: {
		start: {
			'opacity': 0.1,
			'fill-opacity': 1.0,
			'stroke-width':2,
			'stroke-dasharray': 5,
			'stroke-opacity': 1.0,
			'stroke-linecap': 'butt',	
		},
		end: {
			'opacity': 1.0,
			'fill-opacity': 1.0,
			'stroke-width': 2,
			'stroke-dasharray': 5,
			'stroke-opacity': 1.0,
			'stroke-linecap': 'butt',	
		}
		
	}
};

animationConfig["spoke"] = {
	attrs: {
  start: {r:1,},
  end: {r:5,},
	},
	styles: {
		start: {
			'opacity': 0.5,
			'stroke-width':20,
			'stroke-dasharray': 2,
			'stroke-opacity': 1.0,
			'stroke-linecap': 'butt',
		},
		end: {
			'opacity': 1.0,
			'stroke-width': 3,
			'stroke-dasharray': 5,
			'stroke-opacity': 1.0,
			'stroke-linecap': 'butt',
		}
	}
};

animationConfig["spoke2"] = {
	attrs: {
  start: {r:4,},
  end: {r:10,},
	},
	styles: {
		start: {
			'opacity': 0.5,
			'stroke-width':10,
			'stroke-dasharray': 2,
			'stroke-opacity': 0.7,
			'stroke-linecap': 'butt',
		},
		end: {
			'opacity': 1.0,
			'stroke-width': 2,
			'stroke-dasharray': 2,
			'stroke-opacity': 1.0,
			'stroke-linecap': 'butt',
		}
		
	}
};


var hClass = '.h-240'

var hiliteConfig = {
	duration: 1000,
	easing: 'linear'
}

var sortByHAsc  = function (a,b) {return (b.h < a.h ? 1 : b.h == a.h ? 0 : -1);}
var sortByHDesc = function (a,b) {return (a.h < b.h ? 1 : a.h == b.h ? 0 : -1);}
var sortByFloatAsc = function (a,b) {return (parseFloat(b) < parseFloat(a) ? 1 : parseFloat(b) == parseFloat(a) ? 0 : -1);}


function scheduleFunction(funcRef, timeout, rescheduleOnSuccessP, passArgsP, args) {

	
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
		if (passArgsP) {
			var funcArgs = args;
		} else {
			var funcArgs = {};
		}
	} 
	else {
    var passArgsP = false;
		var funcArgs = {};
	}
  
	var result = funcRef(args);
	
	if (rescheduleOnSuccessP && result) {
		setTimeout(scheduleFunction, timeout, 
		           funcRef, timeout, 
							 rescheduleOnSuccessP, 
							 passArgsP, args);
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
				return true;
		};
    this.drawPoint = function () {
	    if (pointIndex >= points.length) {
		    //Log.Notice('points.length=' + points.length + ' pointIndex = ' + pointIndex);
		    return false;
	    }
			
      var classAdd = "";
	    var p1 = points[this.pointIndex];
			var class1 = "h-" + p1.h; class1 = class1.replace('.','_');
			var class2 = "s-" + p1.s; class2 = class2.replace('.','_');
			var class3 = "l-" + p1.l; class3 = class3.replace('.','_');
			var class4 = "brt-" + p1.brt; class4 = class4.replace('.','_');
			var class5 = "sat-" + p1.sat; class5 = class5.replace('.','_');
			var class6 = "index-" + p1.index; class6 = class6.replace('.','_');
			
			var allClasses = class1 
			      + " " + class2 
			      + " " + class3 
						+ " " + class4
						+ " " + class5
						+ " " + class6;

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
				+ p1.h
				+ "," 
				+ (Math.round(parseFloat(p1.s) * 1000)/10)
				+ "%," 
				+ (Math.round( parseFloat(p1.l) * 1000)/10) + "%)";
			} else {
				classAdd = "";
			}
	    d3.select('#points')
	      .append('circle')
	      .attr({
					'class':allClasses + classAdd,
		      'cx':p1.x,
	        'cy':p1.y,
		      'r':5,
		      'fill':'rgb(' + p1.r + ',' + p1.g +',' + p1.b +')'})
		     .transition()
		     .ease('linear')
		     .duration(1000)
		     .attr('r',2.5);
			Log.Notice("drawPoints x=" + p1.x + ",y=" + p1.y + ",hue=" + p1.h);
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
					.ease(hiliteConfig.easing)
					.delay(function(i) {return i*10})
					.attr(animationConfig[Config.style].attrs.end)
					.style(animationConfig[Config.style].styles.end)
					.each('end', function(d,i) {
						//Log.Notice('in end for i=' + i);
						d3.select(this)
							.transition()
							.duration(hiliteConfig.duration)
							.ease('linear')
							.delay(function(i) {return i*10})
							.style(animationConfig[Config.style].styles.start)
							.attr(animationConfig[Config.style].attrs.start);
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
				type = "h";
			} else {
				if (type == {} || type == undefined) {
					type = "h";
				}
			}
			
			var localClassArray = allClassArray[type]
    	if (animateClassIndex >= localClassArray.length) {
				return false;
			}

			var hslClass = "." + type + "-" + localClassArray[animateClassIndex];
			var selection = d3.selectAll('#points ' + hslClass);
			
			while (selection[0].length == 0 && animateClassIndex <= localClassArray.length) {
				animateClassIndex = animateClassIndex+1;
				hslClass = "." + type + "-" + localClassArray[animateClassIndex];
				selection = d3.selectAll('#points ' + hslClass);
			}
			
			if (selection[0].length) {
				
				//Log.Notice('animateColorsByClass2 animateClassIndex=' + this.animateClassIndex + ' selection.length=' + selection[0].length);
				selection
					.transition()
					.duration(hiliteConfig.duration)
					.ease('linear')
					.delay(function(i) {return i*10})
					.attr(animationConfig[Config.style].attrs.end)
					.style(animationConfig[Config.style].styles.end)
					.style({'stroke': function(d,i) {
						  if (Config.style != "default") {
							  return d3.select(this).style('fill');
					    } else {
							  return '#666';
						  }
					  }
					 })
					.each('end', function(d,i) {
						//Log.Notice('in end for i=' + i);
						d3.select(this)
							.transition()
							.duration(hiliteConfig.duration)
							.ease(hiliteConfig.easing)
							.delay(function(i) {return i*10})
							.style(animationConfig[Config.style].styles.start)
							.attr(animationConfig[Config.style].attrs.start);
					 });
				
			} else {
				//Log.Notice('No selection at animateClassIndex=' + this.animateClassIndex);
				return false;
			}
			
			animateClassIndex = animateClassIndex + 1;

			return true;
		};
}

var myGraph = new PointGraph();
if (false) {
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
		brt = Math.round(((max-min)/max) * buckets)/buckets;
		sat = Math.round((max) * buckets)/buckets;
		
		return {h:h,s:s,l:l,d:d,max:max,min:min,r:r1,g:g1,b:b1,x:0,y:0,brt:brt,sat:sat};
	}
}

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
	if (max == 0) {
		sat = 0;
	} else {
		sat = Math.round(((max-min)/max) * buckets)/buckets;
	}
	brt = Math.round((d + min) * buckets)/buckets;
	hex = "#" + toHex(r1) + toHex(g1) + toHex(b1);
  return {h:h,s:s,l:l,d:d,max:max,min:min,r:r1,g:g1,b:b1,x:0,y:0,brt:brt,sat:sat,hex:hex};
}
var hsb2rgb = function (hue, sat, brt) {
	while (hue < 0) {
		hue += 360;
	}
	var buckets = 2;
	var red = 0, green = 0, blue = 0;
	hue %= 360;
  var rgbHue = hueToRgbComponents(hue);
	
	red = (rgbHue.red * sat + 255 * (1-sat)) * brt;
	green = (rgbHue.green * sat + 255 * (1-sat)) * brt;
	blue = (rgbHue.blue * sat + 255 * (1-sat)) * brt;
	
	red = Math.round(Math.round(red*buckets)/buckets);
	green = Math.round(Math.round(green*buckets)/buckets);
	blue = Math.round(Math.round(blue*buckets)/buckets);
	return {r:red,g:green,b:blue,h:hue,sat:sat,brt:brt};
}

function hueToRgbComponents(hue) {
	var norm = 255/60; /// 4.25
	var red, green, blue;
 	
	if (hue >= 0 && hue < 60) {
		red = 255; blue = 0; green = hue * norm;
	} else 
	if (hue >= 60 && hue < 120) {
		green = 255; blue = 0; red = (120 - hue) * norm;
	} else
	if (hue >= 120 && hue < 180) {
		green = 255; red = 0; blue = (hue - 120) * norm;
	} else
	if (hue >= 180 && hue < 240) {
		blue = 255; red = 0; green = (240 - hue) * norm;
	} else
	if (hue >= 240 && hue < 300) {
		blue = 255; green = 0; red = (hue - 240) * norm;
	} else
	if (hue >= 300 && hue <= 360) {
		red = 255; green = 0; blue = (360 - hue) * norm;
	} else {
		red = NaN; green = NaN; blue = NaN;
	}
	
	return {red:red,green:green,blue:blue};
	
}

function generateXY(data) {
	var r = data.r;
	var g = data.g;
	var b = data.b;
	
	switch (Config.graphType) {
	case 'level-diff':
		data.x = (data.l * 255 * 2) + 200;
		data.y = Config.yOffset - (data.d * Config.yExpand);
		break;
	case 'max-hue': 
		data.x = (data["max"] * 2 * 255) + 200;
		data.y = Config.yOffset - data.h ;
		break;
	case 'sine-max-hue': 
		data.x = (data["max"] * 2 * 255) + 200;
		data.y = Config.yOffset - Math.sin(data.h*2*Math.PI/360)*150 - 200;
		break;
	case 'max-brt': 
		data.x = (data["max"] * 2 * 255) + 200;
		data.y = Config.yOffset - (data.brt * Config.yExpand);
		break;
	case 'max-sat': 
		data.x = (data["max"] * 2 * 255) + 200;
		data.y = Config.yOffset - (data.sat * Config.yExpand);
		break;
	case 'max-sat-hue': 
		data.x = (data["max"] * 2 * 255) + 200;
		data.y = Config.yOffset - (data.sat * data.h);
		break;
	case 'tan-max-sat-hue': 
		data.x = (data["max"] * 2 * 255) + 200;
		data.y = Config.yOffset - (data.sat * Math.tan(data.h)*10);
		break;
	case 'max-l-hue': 
		data.x = (data["max"] * 2 * 255) + 200;
		data.y = Config.yOffset - (data.l * data.h);
		break;
	case 'max-brt-hue': 
		data.x = (data["max"] * 2 * 255) + 200;
		data.y = Config.yOffset - (data.brt * data.h);
		break;
	case 'sine-max-brt-hue': 
		data.x = (data["max"] * 2 * 255) + 200;
		data.y = Config.yOffset - (Math.sin(data.h*2*Math.PI/360)*200) - 200;
		break;
	case 'cosine-max-brt-hue': 
		data.x = (data.d * 2 * 255) + 200;
		data.y = Config.yOffset - (Math.cos(data.h*2*Math.PI/360)*200) - 200;
		break;
	case 'diff-sat-hue': 
		data.x = (data.d * 2 * 255) + 200;
		data.y = Config.yOffset - (data.sat * data.h);
		break;
	case 'sine-diff-sat-hue': 
		data.x = (data.d * 2 * 255) + 200;
		data.y = Config.yOffset - (data.sat * Math.sin(data.h*2*Math.PI/360) * 150);
		break;
	case 'diff-s-hue': 
		data.x = (data.d * 2 * 255) + 200;
		data.y = Config.yOffset - (data.s * data.h);
		break;
	case 'diff-l-hue': 
		data.x = (data.d * 2 * 255) + 200;
		data.y = Config.yOffset - (data.l * data.h);
		break;
	case 'diff-brt': 
		data.x = (data.d * 2 * 255) + 230;
		data.y = Config.yOffset - (data.brt * Config.yExpand);
		break;
	case 'sat-sum':
		data.x = Config.xOffset + (r + g + b) + 150;
		data.y = Math.round(Config.yOffset - (data.sat * Config.yExpand));
		break;
	case 'brt-sum':
		data.x = Config.xOffset + (r + g + b) + 150;
		data.y = Math.round((data.brt * Config.yExpand) + Config.yOffset2);
		break;
	case 'hue-sum':
		data.x = Config.xOffset + (r + g + b) + 150;
		data.y = 100 + data.h;
		break;
	case 'sine-hue-sum':
		data.x = Config.xOffset + (r + g + b) + 150;
		data.y = 250 - Math.sin(data.h*2*Math.PI/360)*200;
		break;
	case 'hue-brt':
		data.x = 200 + (data.brt * Config.yExpand * 1.5);
		data.y = Config.yOffset - data.h;
		break;
	case 'hue-x-brt':
		data.x = 200 + (data.brt * data.h * 1.5);
		data.y = Config.yOffset - data.h;
		break;
	case 'hue-x-brt-2':
		data.x = Math.round(Config.xOffset + (r + g + b)*0.8 + 150);
		data.y = 50 + (data.brt * data.h );
		break;
	case 'hue-x-level':
		data.x = Math.round(Config.xOffset + (r + g + b)*0.8 + 150);
		data.y = 50 + (data.l * data.h );
		break;
	case 'hue-x-diff':
		data.x = Math.round(Config.xOffset + (r + g + b)*0.8 + 150);
		data.y = 50 + (data.d * data.h );
		break;
	case 'hue-x-sat-1':
		data.x = Math.round(Config.xOffset + (r + g + b)*0.8 + 150);
		data.y = 50 + (data.sat * data.h );
		break;
	case 'diff-sum':
		data.x = Config.xOffset + (r + g + b) + 150;
		data.y = Math.round(Config.yOffset - (data.d * Config.yExpand));
		break;
	case 'diff-sum-hue':
		data.x = Config.xOffset + (r + g + b);
		data.y = Math.round(Config.yOffset - (data.d * data.h));
		break;
	case 'diff-hue':
		data.x = Config.xOffset + 200 + (data.h * 1.5);
		data.y = Math.round(Config.yOffset - (data.d * Config.yExpand));
		break;
	case 'hue-s':
		data.x = Config.xOffset + 200 + (data.h * 1.5);
		data.y = Math.round(Config.yOffset - (data.s * Config.yExpand));
		break;
	case 'hue-sat':
		data.x = Config.xOffset + 200 + (data.h * 1.5);
		data.y = Math.round(Config.yOffset - (data.sat * Config.yExpand));
		break;
	case 'hue-sat-brt': 
		data.x = Config.xOffset + 200 + (data.h * 1.5);
		var sat,brt,s;
    sat = data.sat == 0 ? .01 : data.sat;
	  brt = data.brt == 0 ? .01 : data.brt;
	  s =   data.s == 0 ? .01 : data.s;
		data.y = Math.round(Config.yOffset - (s/sat * Config.yExpand/4) + 50);
		break;
	case 'hue-sat-brt2': 
		data.x = Config.xOffset + 200 + (data.h * 1.5);
		var sat,brt,s;
    sat = data.sat == 0 ? .01 : data.sat;
	  brt = data.brt == 0 ? .01 : data.brt;
	  s   = data.s == 0 ? .01 : data.s;
		l   = data.l == 0 ? .01 : data.l;
		data.y = Math.round(Config.yOffset - (l/brt * Config.yExpand * 2) + 400);
		break;
	case 'hue-sine-hue':
		data.x = Config.xOffset + 200 + (data.h * 1.5);
		data.y = Math.round(Config.yOffset - (Math.sin((data.h*2*Math.PI/360)) * 200) - 100);
		Log.Notice('Math.sin()=' + Math.sin(data.h*2*Math.PI/360));
		break;
	case 'func-1':
	  data.x = Config.xOffset + data.d * 700 + 150;
		data.y = (data.r * data.d + data.g*(data.d*data.d) + data.b * (1/data.d))*0.1 + 50;
	  break;
	case 'func-2':
	  data.x = Config.xOffset + data.d * 700 + 150;
		data.y = (data.h * data.d + data.h*(data.d*data.d) + data.h * (1/data.d))*0.1 + 50;
	  break;
	case 'func-3':
	  data.x = Config.xOffset + data.d * 700 + 150;
		data.y = (data.d + (data.d*data.d) + (1/data.d)) * data.sat * 50;
	  break;
	case 'func-4':
	  data.x = Config.xOffset + data.d * 700 + 150;
		data.y = (data.l + (data.l*data.l) + (1/data.l)) * data.d * 150;
	  break;
	case 'func-5':
	  data.x = Config.xOffset + (data.r + data.g + data.b) + 150;
		data.y = (data.sat + (data.sat*data.sat) + (1/data.sat)) * data.d * 150;
	  break;
	case 'func-6':
	  data.x =  data.h * 1.8 + 190;
		data.y = (data.sat + (data.sat*data.sat) + (1/data.sat)) * data.d * 150;
	  break;
	case 'func-7':
	  data.x = Config.xOffset + (data.index%Config.modulus) + 150;
		data.y = (data.sat + (data.sat*data.sat) + (1/data.sat)) * data.h/5  + 100;
	  break;
	case 'func-8':
	  data.x = Config.xOffset + (data.index%Config.modulus) + 150;
		var sum = (data.r + data.g + data.b);
		if (sum == 0) sum = 1;
		var d = data.d;
		if (d == 0) d = .001;
		data.y = (d + (d*d) - (1/d)) * sum/5  + 400;
		if (data.y < 20) data.y = 20;
	  break;
	case 'func-9':
	  data.x = Config.xOffset + (data.index%Config.modulus) + 150;
		var sum = (data.r + data.g + data.b);
		if (sum == 0) sum = 1;
		var l = data.l;
		if (l == 0) l = .001;
		data.y = (l + (l*l) - (1/l)) * sum/5  + 300;
		if (data.y < 20) data.y = 20;
	  break;
	default: 
		Log.Error("generatePoints: unknown graphType=" + Config.graphType);
		break;
	}
	return data;
}

function generatePointsRGB(r1,g1,b1) {
  //points[points.length] = {x:Config.xOffset,y:Config.yOffset,r:r1,g:g1,b:b1};
	points[points.length] = {};
	var index = 0;
	var loop = 0;
	for (var r=Config.rStart;r<=Config.rEnd;r=r+Config.rStep) {
		loop++;
		for (var g=Config.gStart;g<=Config.gEnd;g=g+Config.gStep) {
			for (var b=Config.bStart; b<=Config.bEnd;b=b+Config.bStep) {
				index++;
			}
		}
	}
	Config.modulus = Math.round(index/loop);
	index = 0;
	loop = 0;
	for (var r=Config.rStart;r<=Config.rEnd;r=r+Config.rStep) {
		loop++;
		for (var g=Config.gStart;g<=Config.gEnd;g=g+Config.gStep) {
			for (var b=Config.bStart; b<=Config.bEnd;b=b+Config.bStep) {
				var data = rgb2hsl(r,g,b);
				data.index = index++;
				data.loop = loop;
				points[points.length] =  generateXY(data);
			}
		}
	}
	createClassList2(points,allClassArray,"h");
	createClassList2(points,allClassArray,"s");
	createClassList2(points,allClassArray,"l");
	createClassList2(points,allClassArray,"brt");
	createClassList2(points,allClassArray,"sat");
	createClassList2(points,allClassArray,"index");
	
}

function generatePointsHSB() {
	points[points.length] = {};
	var index = 0;
	loop = 0;	
	for (var hue=Config.hueStart;hue<=Config.hueEnd;hue=hue+Config.hueStep) {
		loop++;
		for (var sat=Config.satStart;sat<=Config.satEnd;sat=sat+Config.satStep) {
			for (var brt=Config.brtStart; brt<=Config.brtEnd;brt=brt+Config.brtStep) {
				index++;
			}
		}
	}
	Config.modulus = Math.round(index/loop);
	index = 0;
	loop = 0;
	for (var hue=Config.hueStart;hue<=Config.hueEnd;hue=hue+Config.hueStep) {
		loop++;
		for (var sat=Config.satStart;sat<=Config.satEnd;sat=sat+Config.satStep) {
			for (var brt=Config.brtStart; brt<=Config.brtEnd;brt=brt+Config.brtStep) {
				var rgb = hsb2rgb(hue,sat/100,brt/100);
				var data = rgb2hsl(rgb.r, rgb.g, rgb.b);
				data.index = index++;
				data.loop = loop;
				points[points.length] =  generateXY(data);
			}
		}
	}

	createClassList2(points,allClassArray,"h");
	createClassList2(points,allClassArray,"s");
	createClassList2(points,allClassArray,"l");
	createClassList2(points,allClassArray,"brt");
	createClassList2(points,allClassArray,"sat");
	createClassList2(points,allClassArray,"index");
	
}

function generatePointsHSL() {
	points[points.length] = {};
	var index = 0;
	var loop = 0;
	for (var h=Config.hStart;h<=Config.hEnd;h=h+Config.hStep) {
		loop++;
		for (var s=Config.sStart;s<=Config.sEnd;s=s+Config.sStep) {
			for (var l=Config.lStart; l<=Config.lEnd;l=l+Config.lStep) {
				index++;
			}
		}
	}
	Config.modulus = Math.round(index/loop);
	index = 0;
	loop = 0;
	for (var h=Config.hStart;h<=Config.hEnd;h=h+Config.hStep) {
		loop++;
		for (var s=Config.sStart;s<=Config.sEnd;s=s+Config.sStep) {
			for (var l=Config.lStart; l<=Config.lEnd;l=l+Config.lStep) {
				var rgb = hsl2rgb(h,s/100,l/100);
				var data = rgb2hsl(rgb.r, rgb.g, rgb.b);
				data.index = index++;
				data.loop = loop;
				points[points.length] =  generateXY(data);
			}
		}
	}

	createClassList2(points,allClassArray,"h");
	createClassList2(points,allClassArray,"s");
	createClassList2(points,allClassArray,"l");
	createClassList2(points,allClassArray,"brt");
	createClassList2(points,allClassArray,"sat");
	createClassList2(points,allClassArray,"index");
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

function generatePointsX(r1,g1,b1) {
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
		.on("click", function(d,i) { // mouseover
		   Log.Notice("click d=" + d);
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

function changePointFunction(selectId, configProperty) {

	var ptFunction = null;
	var selectedOption = "#" + selectId + " " + "option:selected";
	var functionId = $(selectedOption).val();

	
	switch (functionId) {
	case 'hsb':
	  ptFunction = generatePointsHSB;
		d3.selectAll('#hsl-gaps, #rgb-gaps').style('display','none');
		d3.select('#hsb-gaps').style('display','block');
	  break;
	case 'hsl':
	  ptFunction = generatePointsHSL;
		d3.selectAll('#hsb-gaps, #rgb-gaps').style('display','none');
		d3.select('#hsl-gaps').style('display','block');
	  break;
	case 'rgb':
	default:
	  ptFunction = generatePointsRGB;
		d3.selectAll('#hsb-gaps, #hsl-gaps').style('display','none');
		d3.select('#rgb-gaps').style('display','block');
	  break;
	}
	
  Config[configProperty] = ptFunction;
	
	var call = "Data.saveSelect('" + selectId + "','changePointFunction'";
  for (var i = 1; i< arguments.length; i++) {
    call = call + ",'" + arguments[i] + "'";
  }
  
  call += ");";
  setTimeout(call, 10);
  return false;
}