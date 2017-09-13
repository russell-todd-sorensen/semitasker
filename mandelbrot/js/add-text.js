var addText = function(data) {
	
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var height = fractal.height;
	var width = fractal.width;
	
	context.lineWidth = 20;
	context.save();
	context.strokeStyle = '#FFFFFF';
	context.moveTo(0, height-20);
	context.lineTo(300,height-20);
	context.closePath();
	context.stroke();
	
	context.restore();
};