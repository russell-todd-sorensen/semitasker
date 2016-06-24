// JavaScript Document
var doc, svg;
var dataset18,dataset19,dataset20,dataset21,dataset22;

function meltX(config) {
	
	  var feDisplacementMapId  = config.feDisplacementMapId;
		
		if (config.dataDisplacementMap) {
			var dataDisplacementMap  = config.dataDisplacementMap;
		} else {
			var dataDisplacementMap  = doc.selectAll(feDisplacementMapId);
		}


		var scaleTo    = config.scaleTo;
		
		if (config.scaleBack) {
			var scaleBack  = config.scaleBack;
		} else {
			var scaleBack  = "return";
		}
		
		var durationTo   = config.durationTo;
		
		if (config.durationBack) {
			var durationBack  = config.durationBack;
		} else {
			var durationBack  = durationTo/2;
		}

		if (config.delayTo) {
				var delayTo = parseInt(config.delayTo);
		} else {
			  var delayTo = 0;
		}
		
		if (config.delayBack) {
				var delayBack = parseInt(config.delayBack);
		} else {
			  var delayBack = 0;
		}
		
		
		if (config.easeTo) {
			 var easeTo     = config.easeTo;
		} else {
			 var easeTo = 'linear';
		}
		
		if (config.easeBack) {
			 var easeBack = config.easeBack;
		} else {
			 var easeBack = easeTo;
		}
		
		doc
	  .selectAll(feDisplacementMapId)
		.data(dataDisplacementMap)
		.transition()
		.duration(durationTo)
		.delay(delayTo)
		.ease(easeTo)
		.attr('scale', function (d,i) {
			 d.scale = d3.select(this).attr('scale');
			 return scaleTo;
		})
		.each('end', function(d,i) {
			d3.select(this)
				.transition()
				.duration(durationBack)
				.delay(delayBack)
				.ease(easeBack)
				.attr('scale', function (d,i) {
					 return scaleBack === "return" ? d.scale : parseFloat(scaleBack);
				})
		});
}

function tileizeX (config) {
	
		var feImageId  = config.feImageId;
		
		if (config.data) {
			var data = config.data;
		} else {
			var data = doc.selectAll(feImageId);
		}
		
		var heightTo    = config.heightTo;
		
		if (config.heightBack) {
			var heightBack  = config.heightBack;
		} else {
			var heightBack  = "return";
		}
		
		var widthTo    = config.widthTo;
		
		if (config.widthBack) {
			var widthBack  = config.widthBack;
		} else {
			var widthBack  = "return";
		}
				
		var feRectId   = config.feRectId;

		if (config.dataRect) {
			var dataRect   = config.dataRect;
		} else {
			var dataRect = doc.selectAll(feRectId);
		}
		
		rectHeightTo = config.rectHeightTo;
		
		if (config.rectHeightBack) {
			var rectHeightBack  = config.rectHeightBack;
		} else {
			var rectHeightBack  = "return";
		}
		
		var rectWidthTo    = config.rectWidthTo;
		
		if (config.rectWidthBack) {
			var rectWidthBack  = config.rectWidthBack;
		} else {
			var rectWidthBack  = "return";
		}
		

		var durationTo   = config.durationTo;
		
		if (config.durationBack) {
			var durationBack  = config.durationBack;
		} else {
			var durationBack  = durationTo/2;
		}

		if (config.delayTo) {
				var delayTo = parseInt(config.delayTo);
		} else {
			  var delayTo = 0;
		}
		
		if (config.delayBack) {
				var delayBack = parseInt(config.delayBack);
		} else {
			  var delayBack = 0;
		}
		
		
		if (config.easeTo) {
			 var easeTo     = config.easeTo;
		} else {
			 var easeTo = 'linear';
		}
		
		if (config.easeBack) {
			 var easeBack = config.easeBack;
		} else {
			 var easeBack = easeTo;
		}
				
	
	doc
		.selectAll(feImageId)
	  .data(data)
		.transition()
		.delay(delayTo)
		.duration(durationTo)
		.ease(easeTo)
		.attr('height', function (d1,i) {
			 d1.height = d3.select(this).attr('height');
			 return heightTo;
		} )
		.attr('width', function (d1,i) {
			 d1.width = d3.select(this).attr('width');
			 Log.Notice("--d1.width=" + d1.width);
			 return widthTo;
		})
		.each('end', function(d1,i) {
			d3.select(this)
				.transition()
				.delay(delayBack)
				.duration(durationBack)
				.ease(easeBack)
				.attr('height', function (d1,i) {
					return heightBack === "return" ? d1.height : parseFloat(heightBack);
				})
				.attr('width', function (d1,i) {
					Log.Notice("--widthBack=" + widthBack + " d1.width=" + d1.width);
					return widthBack === "return" ? d1.width : parseFloat(widthBack);
				})
		});
		
	doc
		.selectAll(feRectId)
		.data(dataRect)
		.transition()
		.delay(delayTo)
		.duration(durationTo)
		.ease(easeTo)
		.attr('height', function (d,i) {
			 d.height = d3.select(this).attr('height');
			 return rectHeightTo;
		} )
		.attr('width', function (d,i) {
			 d.width = d3.select(this).attr('width');
			 Log.Notice("--width=" + d.width);
			 return rectWidthTo;
		})
		.each('end', function(d,i) {
			d3.select(this)
				.transition()
				.delay(delayBack)
				.duration(durationBack)
				.ease(easeBack)
				.attr('height', function (d,i) {
					return rectHeightBack === "return" ? d.height : parseFloat(rectHeightBack);
				})
				.attr('width', function (d,i) {
					Log.Notice("rectWidthBack=" + rectWidthBack + " d.width=" + d.width);
					return rectWidthBack === "return" ? d.width : parseFloat(rectWidthBack);
				})
		});	
}


function wipeX(config) {

	  // diffuseLighting vars
		var feDiffuseLightingId = config.feDiffuseLightingId;
		
		if (config.dataDiffuseLighting) {
			var dataDiffuseLighting = config.dataDiffuseLighting;
		} else {
			var dataDiffuseLighting = doc.selectAll(feDiffuseLightingId);
		}
									 
	  var colorTo = config.colorTo;
		if (config.colorBack) {
			var colorBack  = config.colorBack;
		} else {
			var colorBack  = "return";
		}
		
		var surfaceScaleTo = config.surfaceScaleTo;
		if (config.surfaceScaleBack) {
			var surfaceScaleBack  = config.surfaceScaleBack;
		} else {
			var surfaceScaleBack  = "return";
		}
		
		var diffuseConstantTo = config.diffuseConstantTo;
		if (config.diffuseConstantBack) {
			var diffuseConstantBack  = config.diffuseConstantBack;
		} else {
			var diffuseConstantBack  = "return";
		}
		
		// pointLight vars
		var fePointLightId = config.fePointLightId;
		
		if (config.dataPointLight) {
			var dataPointLight = config.dataPointLight;
		} else {
			var dataPointLight = doc.selectAll(fePointLightId);
		}
	
		var xTo = config.xTo;
		if (config.xBack) {
			var xBack  = config.xBack;
		} else {
			var xBack  = "return";
		}
		
		var yTo = config.yTo;
		if (config.yBack) {
			var yBack  = config.yBack;
		} else {
			var yBack  = "return";
		}
		
		var zTo = config.zTo;
		if (config.zBack) {
			var zBack  = config.zBack;
		} else {
			var zBack  = "return";
		}
		
		var durationTo   = config.durationTo;
		
		if (config.durationBack) {
			var durationBack  = config.durationBack;
		} else {
			var durationBack  = durationTo/2;
		}

		if (config.delayTo) {
				var delayTo = parseInt(config.delayTo);
		} else {
			  var delayTo = 0;
		}
		
		if (config.delayBack) {
				var delayBack = parseInt(config.delayBack);
		} else {
			  var delayBack = 0;
		}
		
		
		if (config.easeTo) {
			 var easeTo     = config.easeTo;
		} else {
			 var easeTo = 'linear';
		}
		
		if (config.easeBack) {
			 var easeBack = config.easeBack;
		} else {
			 var easeBack = easeTo;
		}
	
	doc
	  .selectAll(feDiffuseLightingId)
		.data(dataDiffuseLighting)
		.transition()
		.delay(delayTo)
		.duration(durationTo)
		.ease(easeTo)
		.attr('lighting-color', function(d,i) {
			 d.lightingColor = d3.select(this).attr('lighting-color');
			 return colorTo;
		})
		.attr('surfaceScale', function (d,i) {
			 d.surfaceScale = d3.select(this).attr('surfaceScale');
			 return surfaceScaleTo;
		})
		.attr('diffuseConstant', function (d,i) {
			 d.diffuseConstant = d3.select(this).attr('diffuseConstant');
			 return diffuseConstantTo;
		})
		.each('end', function(d,i) {
			Log.Notice("running end on id=" + d3.select(this).attr('id')); 
			d3.select(this)
				.transition()
				.delay(delayBack)
				.duration(durationBack)
				.ease(easeBack)
				.attr('lighting-color', function (d,i) {
					return  colorBack === "return" ? d.lightingColor : colorBack;
				})
				.attr('surfaceScale', function (d,i) {
					return  surfaceScaleBack === "return" ? d.surfaceScale : surfaceScaleBack;
				})
				.attr('diffuseConstant', function (d,i) {
					return  diffuseConstantBack === "return" ? d.diffuseConstant : diffuseConstantBack;
				});
		});
		
	doc
	  .selectAll(fePointLightId)
	 	.data(dataPointLight)
		.transition()
		.delay(delayTo)
		.duration(durationTo)
		.ease(easeTo)
		.attr('x', function (d,i) {
			 d.x = d3.select(this).attr('x');
			 return xTo;
		})
		.attr('y', function (d,i) {
			 d.y = d3.select(this).attr('y');
			 return yTo;
		})
		.attr('z', function (d,i) {
			 d.z = d3.select(this).attr('z');
			 return zTo;
		})
		.each('end', function(d,i) {
			d3.select(this)
				.transition()
				.delay(delayBack)
				.duration(durationBack)
				.ease(easeBack)
				.attr('x', function (d,i) {
					return xBack === "return" ? d.x : xBack;
				})
				.attr('y', function (d,i) {
					return yBack === "return" ? d.y : yBack;
					})
				.attr('z', function (d,i) {
					return zBack === "return" ? d.z : zBack;
				});
		});

}


function doAnimation(type) {
	
	// document defaults
	var config = {};
	
	for (attr in mainConfig) {
		config[attr] = mainConfig[attr];
	}
	
	var colorTo =  $('#colorTo').val();
	var colorBack = $('#colorBack').val();
	
	var heightTo = $('#heightTo').val();
	var heightBack = $('#heightBack').val();
	
	var widthTo = $('#widthTo').val();
	var widthBack = $('#widthBack').val();
	
	var rectHeightTo = $('#rectHeightTo').val();
	var rectHeightBack = $('#rectHeightBack').val();
	
	var rectWidthTo = $('#rectWidthTo').val();
	var rectWidthBack = $('#rectWidthBack').val();
	
	
	var scaleTo = $('#scaleTo').val();
	var scaleBack = $('#scaleBack').val();
	
	var surfaceScaleTo = $('#surfaceScaleTo').val();
	var surfaceScaleBack = $('#surfaceScaleBack').val();
	
	var diffuseConstantTo = $('#diffuseConstantTo').val();
	var diffuseConstantBack = $('#diffuseConstantBack').val();
	
	var xTo = $('#xTo').val();
	var xBack = $('#xBack').val();
	
	var yTo = $('#yTo').val();
	var yBack = $('#yBack').val();
	
	var zTo = $('#zTo').val();
	var zBack = $('#zBack').val();
	
	var durationTo = $('#durationTo').val();
	var durationBack = $('#durationBack').val();
	//var duration = $('#duration').val();
	
	var delayTo = $('#delayTo').val();
	var delayBack = $('#delayBack').val();
	
	var easeTo = $('#easeTo').val();
	var easeBack = $('#easeBack').val();
	var feImageId = $('#feImageId').val();
	var feRectId = $('#feRectId').val();
	
	config.colorBack = colorBack;
	config.colorTo = colorTo;
	config.heightTo = heightTo;
	config.heightBack = heightBack;
	config.widthTo = widthTo;
	config.widthBack = widthBack;
	config.rectHeightTo = rectHeightTo;
	config.rectHeightBack = rectHeightBack;
	config.rectWidthTo = rectWidthTo;
	config.rectWidthBack = rectWidthBack;
	config.scaleTo = scaleTo;
	config.scaleBack = scaleBack;
	config.surfaceScaleTo = surfaceScaleTo;
	config.diffuseConstantTo = diffuseConstantTo;
	config.diffuseConstantBack = diffuseConstantBack;
	config.xTo = xTo;
	config.xBack = xBack;
	config.yTo = yTo;
	config.yBack = yBack;
	config.zTo = zTo;
	config.zBack = zBack;
	config.durationTo = durationTo;
	config.durationBack = durationBack;
	config.delayTo = delayTo;
	config.delayBack = delayBack;
	config.easeTo = easeTo;
	config.easeBack = easeBack;
	config.feImageId = feImageId;
	config.feRectId = feRectId;
	
	switch (type) {
	case 'wipe':
		Log.Notice("doing wipeX");
		wipeX(config);
		break;
	case 'tileize':
		Log.Notice("doing tileizeX");
	  tileizeX(config);
		break;
	case 'melt':
		Log.Notice("doing meltX");
		meltX(config);
		break;
	case 'all':
		Log.Notice("doing All");
	  wipeX(config);
		tileizeX(config);
		meltX(config);
		break;
	}
}

function adjustScale (selectId,scaleId) {

	var newScaleValue = $("#" + selectId + " option:selected").val();
	var scaleValue = "scale(" + newScaleValue + ")";
	$('#' + scaleId).attr('transform', scaleValue);
	saveSelect(selectId, 'adjustScale', scaleId );
}

function changeImage (selectId,imageId) {
  var selector = "#" + selectId + " option:selected";
	Log.Notice("changeImage selector=" + selector);
	var newImageValue = $(selector).val();
	var imageValue = "../../images/" + newImageValue ;
	$('#' + imageId).attr('xlink:href', imageValue);
	saveSelect(selectId, 'changeImage', imageId);
}

function changeRect (selectId,rectId) {

	var newRectValue = $("#" + selectId + " option:selected").val();
	newRectId = '#' + rectId;
	if (newRectValue == "#rect53") {
		var newHeight = 80;
		var newWidth = 80;
	} else {
		var newHeight = $(newRectValue).attr('height');
		var newWidth = $(newRectValue).attr('width');
	}
	Log.Notice('newRectValue=' + newRectValue + "newWidth=" + newWidth);
	$(newRectId)
		.attr('xlink:href', newRectValue)
		.attr('height', newHeight)
		.attr('width', newWidth);
		
	saveSelect(selectId, 'changeRect', rectId);
}

function saveSelect(selectId, restoreFunction, arg2, arg3) {
	var selectedOption = "#" + selectId + " " + "option:selected";
	var value = $(selectedOption).val();
	if (value) {
		var call = restoreFunction + "('" + selectId  + "'";
		for (var i = 2; i<arguments.length; i++) {
			call =  call + ",'" + arguments[i] + "'";
		}
		call += ");"
		localStorage.setItem(document.URL + '-ANIMATION-VALUE-' + selectId, value);
		localStorage.setItem(document.URL + '-ANIMATION-RESTORE-' + selectId, call);
	}
}

function restoreSelect(selectId) {
	var value = localStorage.getItem(document.URL + '-ANIMATION-VALUE-' + selectId);
	var call = localStorage.getItem(document.URL + '-ANIMATION-RESTORE-' + selectId);
	if (value) {
		var selectedOption = "#" + selectId + " " + "option:selected";
		$(selectedOption).removeAttr('selected');
		var valueOption = "#" + selectId + " " + "option[value='" + value + "']";
		$(valueOption)
			.attr('selected', 'selected');
			
		setTimeout(call, 10);
	}
	
}
