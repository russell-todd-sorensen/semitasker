// JavaScript Document


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
		data.y = Config.yOffset - Math.sin(data.h)*150 - 200;
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
		data.y = Config.yOffset - (data.brt * Math.sin(data.h)*200) - 200;
		break;
	case 'cosine-max-brt-hue': 
		data.x = (data["max"] * 2 * 255) + 200;
		data.y = Config.yOffset - (data.brt * Math.cos(data.h)*200) - 200;
		break;
	case 'diff-sat-hue': 
		data.x = (data.d * 2 * 255) + 200;
		data.y = Config.yOffset - (data.sat * data.h);
		break;
	case 'sine-diff-sat-hue': 
		data.x = (data.d * 2 * 255) + 200;
		data.y = Config.yOffset - (data.sat * Math.sin(data.h) * 150);
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
		data.y = 250 - Math.sin(data.h)*200;
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
		data.y = Math.round(Config.yOffset - (Math.sin((data.h/360*2*Math.PI)) * 200) - 100);
		Log.Notice('Math.sin()=' + Math.sin(data.h/360*2*Math.PI));
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
	  data.x =  data.h * 2 + 150;
		data.y = (data.sat + (data.sat*data.sat) + (1/data.sat)) * data.d * 150;
	  break;
	case 'func-7':
	  data.x = Config.xOffset + (data.index%Config.modulus) + 150;
		data.y = (data.sat + (data.sat*data.sat) + (1/data.sat)) * data.h/5  + 100;
	  break;
	case 'func-8':
	  data.x = Config.xOffset + (data.index%Config.modulus) + 150;
		data.y = (data.d + (data.d*data.d) - (1/data.d)) * (data.r + data.g + data.b)/20  + 300;
	  break;
	case 'func-9':
	  data.x = Config.xOffset + (data.index%Config.modulus) + 150;
		data.y = (data.l + (data.l*data.l) - (1/data.l)) * (data.r + data.g + data.b)/20  + 300;
	  break;
	default: 
		Log.Error("generatePoints: unknown graphType=" + Config.graphType);
		break;
	}
	return data;
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