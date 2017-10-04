// JavaScript Document
var addToPixels = [];

addToPixels[0] = null;

addToPixels[1] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var modulus;
	var hue,brt,sat;
	var rgbFixed = {r:0,g:0,b:0,a:255,hex:'#FFFFFF'};
	var rgb = {r:0,g:0,b:0,a:255,hex:'#FFFFFF'};
	var pixelJump = data.pixelJump;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
	  colors[i] = {r:0,g:0,b:0,a:255};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		modulus = (p+1)%4;
		counter = fractal.counters[p];

		if (modulus == 0) {
			rgb = rgbFixed;
		}

		hue = (255 + fractal.pixels[p] + amount*modulus)%255;
		fractal.pixels[p] = hue;
		rgb = hsb2rgb(hue,100,100);

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].a = 255;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
	}

	fractal.colors = colors;
	drawColors(data);
	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[2] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];

	var hue,sat,brt,rgb,counter;
	var pixelJump = data.pixelJump;

	var colors = new Array(fractal.counterMax);
	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];
		hue = ((counter*10+fractal.animationIndex)%360)/10;
		sat = (counter+fractal.animationIndex)%100/100;
		brt = 1.0 - (counter%100)/100;
		rgb = hsb2rgb(hue, sat, brt);
		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].a = 255;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[3] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var hue,sat,brt,rgb,counter;
	var pixelJump = data.pixelJump;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];
		hue = ((counter+fractal.animationIndex)%3600)/10;
		sat = 1.0;
		brt = (counter+fractal.counterMax+fractal.animationIndex)%100/100;
		rgb = hsb2rgb(hue, sat, brt);
		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[4] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 360/fractal.counterMax;
	var pixelJump = data.pixelJump;

	var colors = new Array(fractal.counterMax);
	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum) {
		  rgb = {r:0,g:0,b:0}; // black;
		} else {
		  hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
		  sat = (counter%8)*.125 + .125;
		  brt = 1.0;
		  rgb = hsb2rgb(hue, sat, brt);
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[5] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 2*360/fractal.counterMax;
	var pixelJump = data.pixelJump;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum)
		{
			rgb = {r:0,g:0,b:0,a:255,hex:'#000000'}; // black;
		}
		else {
			hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
			sat = (counter%8)*.125 + .125;
			brt = 1.0;
			rgb = hsb2rgb(hue, sat, brt);
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[6] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 2*360/fractal.counterMax;
	var pixelJump = data.pixelJump;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum)
		{
			rgb = {r:0,g:0,b:0}; // black;
		}
		else {
			hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
			sat = 1.0;
			brt = (counter%8)*.125 + .125;
			rgb = hsb2rgb(hue, sat, brt);
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[7] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 360/fractal.counterMax;
	var pixelJump = data.pixelJump;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
	  colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{

		counter = fractal.counters[p];5

		if (counter == fractal.profile.maximum) {
			rgb = {r:0,g:0,b:0,a:255,hex:'#000000'}; // black;
		}
		else {
			hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
			sat = 1.0;
			brt = ((counter+fractal.animationIndex)%20)*.05 + .125;
			rgb = hsb2rgb(hue, sat, brt);
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[8] = function (data) {
  var objId = data.objId;
  var amount = data.amount;
  var fractal = myFractalImages[objId];
  var counter;
  var hue,sat,brt,rgb;
  var hueFactor = 2*360/fractal.counterMax;
  var pixelJump = data.pixelJump;

  var colors = new Array(fractal.counterMax);

  for (var i = 0; i<=fractal.counterMax;i++)
  {
  	  colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
  }

  for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
  {
		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum)
		{
			rgb = {r:0,g:0,b:0,a:255,hex:'#000000'}; // black;
		}
		else {
			hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
			sat = 1.0;
			brt = ((counter+fractal.animationIndex)%20)*.05 + .125;
			rgb = hsb2rgb(hue, sat, brt);
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
  }

  fractal.colors = colors;
  drawColors(data);

  fractal.context.putImageData(fractal.imageData,0,0);
  fractal.animationIndex += amount;
  return fractal.continueAnimation;
};

addToPixels[9] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 360/fractal.counterMax;
	var pixelJump = data.pixelJump;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{

		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum) {
			rgb = {r:0,g:0,b:0}; // black;
		} else {
			hue = (Math.round(counter*hueFactor*10+fractal.animationIndex)/10)%360;
			sat = 1.0;
			brt = (counter%8)*.125 + .125;
			rgb = hsb2rgb(hue, sat, brt);
		}
		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};


addToPixels[10] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 360/fractal.counterMax;
	var pixelJump = data.pixelJump;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum)
		{
			rgb = {r:0,g:0,b:0};
		}
		else {
			hue = (Math.round(counter*hueFactor*5+fractal.animationIndex)/10)%360;
			sat = 1.0;
			brt = (counter%8)*.125 + .125;
			rgb = hsb2rgb(hue, sat, brt);
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[11] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 2*360/fractal.counterMax;
	var pixelJump = data.pixelJump;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum)
		{
			rgb = {r:0,g:0,b:0,a:255,hex:'#000000'}; // black;
		}
		else {
			rgb = {r:255,g:255,b:255,a:255,hex:'#FFFFFF'}; // white;
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[12] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 2*360/fractal.counterMax;
	var pixelJump = data.pixelJump;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++) {
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		if (counter == fractal.animationIndex%256)
		{
		  //rgb = {r:0,g:0,b:0}; // black;
		  hue = (Math.round(counter*hueFactor*5+fractal.animationIndex)/10)%360;
		  sat = 1.0;
		  brt = (counter%8)*.125 + .125;
		  rgb = hsb2rgb(hue, sat, brt);
		}
		else if (Math.abs(fractal.animationIndex%256 - counter) < 5)  {
		  var diff = fractal.animationIndex%256 - counter;
		  hue = (Math.round(counter*hueFactor*5+fractal.animationIndex+diff)/10)%360;
		  sat = 0.5 + (diff/10);
		  brt = 0.75 - (diff/20);
		  rgb = hsb2rgb(hue,sat,brt);
		}
		else {
		  rgb = {r:255,g:255,b:255,a:255,hex:'#FFFFFF'}; // white;
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[13] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 2*360/fractal.counterMax;
	var pixelJump = data.pixelJump;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
	  colors[i] = {r:0,g:0,b:0,a:255};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum)
		{
			rgb = {r:0,g:0,b:0,a:255,hex:'#000000'}; // black;
		}
		else {
			hue = (Math.round(counter*hueFactor+fractal.animationIndex)/10)%360;
			sat = 1.0;
			brt = ((counter+fractal.animationIndex)%30)*.015 + .5;
			rgb = hsb2rgb(hue, sat, brt);
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[14] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 2*360/fractal.counterMax;
	var pixelJump = data.pixelJump;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
	  colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum)
		{
			rgb = {r:0,g:0,b:0,a:255,hex:'#000000'}; // black;
		}
		else {
			hue = ((Math.round(counter*hueFactor+fractal.animationIndex))%360);
			sat = (counter%8)*.125 + .125;
			brt = 1.200 - ((counter+fractal.animationIndex)%20)*.05 ;
			rgb = hsl2rgb(hue, (sat>.7?.7:sat), (brt>1?1:brt));
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[15] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb;
	var hueFactor = 2*3600/fractal.counterMax;
	var pixelJump = data.pixelJump;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
	  colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{

		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum+1)
		{
		  rgb = {r:0,g:0,b:0,a:255,hex:'#000000'}; // black;
		}
		else {
			hue = ((Math.round(counter*hueFactor+fractal.animationIndex))%3600)/10;
			sat = (counter%8)*.125 + .125;
			brt = 1.200 - ((counter+fractal.animationIndex)%200)*.005 ;
			rgb = hsl2rgb(hue, (sat>1?1:sat), (brt>1?1:brt));
		}
		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);
	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[16] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb,lev;
	var hueFactor = 2*3600/fractal.counterMax;
	var pixelJump = data.pixelJump;

	var colors = [];

	for (var i = 0; i<fractal.counterMax+1; i++)
	{
	  if (i == fractal.profile.maximum+1) {
		  rgb = {r:0,g:0,b:0,a:255,hex:'#000000'}; // black;
	  }
	  else {
		  hue = ((Math.round(i*hueFactor+fractal.animationIndex))%3600)/10;
		  sat = 1.000 - ((i+100+fractal.animationIndex)%200)*.005 ;;
		  lev = 1.000 - ((i+fractal.animationIndex)%200)*.005 ;

		  if (lev < .05) {
			  lev = .05;
		  }
		  else if (lev > .95) {
			  lev = .95;
		  }

		  rgb = hsl2rgb(hue, (sat>1?1:sat), lev);
	  }

	  colors[i] = rgb;
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		fractal.pixels[p+0] = colors[counter].r;
		fractal.pixels[p+1] = colors[counter].g;
		fractal.pixels[p+2] = colors[counter].b;
		fractal.pixels[p+3] = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[17] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var hue,sat,brt,rgb,lev;
	var hueFactor = 2*3600/fractal.counterMax;
	var pixelJump = data.pixelJump;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
	  colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum+1) {
			rgb = {r:0,g:0,b:0,a:255,hex:'#000000'}; // black;
		}
		else {
			hue = ((Math.round(counter*hueFactor+fractal.animationIndex))%3600)/10;
			sat = 1.000 - ((counter+100+fractal.animationIndex)%200)*.005;
			lev = 1.000 - ((counter+fractal.animationIndex)%200)*.005;
			if (lev < .05) {
				lev = .05;
			}
			else if (lev > .95) {
				lev = .95;
			}

			rgb = hsl2rgb(hue, (sat>1?1:sat), lev);
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].a = 255;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[18] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	pixelColors[data.pixelColorsId](data);

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];
		fractal.pixels[p+0] = fractal.colors[counter].r;
		fractal.pixels[p+1] = fractal.colors[counter].g;
		fractal.pixels[p+2] = fractal.colors[counter].b;
		fractal.pixels[p+3] = 255;
	}

	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += animationSteps;
	return fractal.continueAnimation;
};

addToPixels[19] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var height = fractal.height;
	var width = fractal.width;
	var counter;
	var hue,sat,brt,rgb,lev;
	var hueFactorFactor = data.hueFactor;
	var minLevel = data.minLevel ? data.minLevel : .05;
	var maxLevel = data.maxLevel ? data.maxLevel : .95;
	var minSat = data.minSat ? data.minSat : 0.0;
	var maxSat = data.maxSat ? data.maxSat : 1.0;
	var minBrt = data.minBrt ? data.minBrt : 0.0;
	var maxBrt = data.maxBrt ? data.maxBrt : 1.0;
	var hslOrHsb = data.hslOrHsb ? data.hslOrHsb : "hsl";
	var hueFactor = 3600*hueFactorFactor/fractal.counterMax;
	var pixelJump = data.pixelJump;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];

		if (counter == fractal.profile.maximum+1)
		{
			rgb = {r:0,g:0,b:0,a:255,hex:'#000000'}; // black;
		}
		else {
			hue = ((Math.round(counter*hueFactor+fractal.animationIndex))%3600)/10;
			sat = 1.000 - ((counter+100+fractal.animationIndex)%200)*.005;
			brt = 1.000 - ((counter+fractal.animationIndex)%200)*.005;
			lev = 1.000 - ((counter+fractal.animationIndex)%200)*.005 ;

			if (lev < minLevel)
			{
				lev = minLevel;
			}
			else if (lev > maxLevel)
			{
				lev = maxLevel;
			}

			if (sat < minSat)
			{
				sat = minSat;
			}
			else if (sat > maxSat)
			{
				sat = maxSat;
			}

			if (brt < minBrt)
			{
				brt = minBrt;
			}
			else if (brt > maxBrt)
			{
				brt = maxBrt;
			}

			switch (hslOrHsb)
			{
			case 'hsb':
				rgb = hsb2rgb(hue,sat,brt);
				break;
			case 'hsl':
			default:
				rgb = hsl2rgb(hue, sat, lev);
				break;
			}
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[20] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var hue,sat,brt,rgb,counter;
	var pixelJump = data.pixelJump;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];
		hue = ((fractal.counters[p]*10+fractal.animationIndex)%360)/10;
		sat = (fractal.counters[p]+fractal.animationIndex)%100/100;
		brt = 1.0 - (fractal.counters[p]%100)/100;
		rgb = hsb2rgb(hue, sat, brt);

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].hex = '#' + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[21] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	pixelColors[3](data);

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];
		if (fractal.colors[counter])
		{
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;
		}
		else if (colors[counter]) {
			console.log('color[' + counter + '] used instead of fractal.colors');
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;
		}
		else {
			// use filler
			console.log('color[' + counter + '] does not exist for p=['  + p + ']');
			fractal.pixels[p+0] = 255;
			fractal.pixels[p+1] = 255;
			fractal.pixels[p+2] = 255;
			fractal.pixels[p+3] = 255;
		}
	}
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += animationSteps;
	return fractal.continueAnimation;
};


addToPixels[22] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	pixelColors[data.pixelColorsId](data);

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];
		fractal.pixels[p+0] = fractal.colors[counter].r;
		fractal.pixels[p+1] = fractal.colors[counter].g;
		fractal.pixels[p+2] = fractal.colors[counter].b;
		fractal.pixels[p+3] = 255-counter;
	}

	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += animationSteps;
	return fractal.continueAnimation;
};


addToPixels[23] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var maxLines = 1000000;
	var lineCount = 0;
	var x,y,pixelIndex,offset,alpha;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	pixelColors[data.pixelColorsId](data);
	fractal.context.putImageData(fractal.imageData,0,0);
	context.lineWidth = 1;
	context.save();

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);
		counter = fractal.counters[p];

		if (counter < 100)
		{
		  alpha = parseInt(Math.floor(255 - 255/counter));
		}
		else {
		  alpha = 255;
		}

		fractal.pixels[p+0] = fractal.colors[counter].r;
		fractal.pixels[p+1] = fractal.colors[counter].g;
		fractal.pixels[p+2] = fractal.colors[counter].b;
		fractal.pixels[p+3] = alpha;

		if (counter == 255)
		{
			offset = 0;
			continue;
		}
		else if (counter > 20)
		{
			offset = 40 + Math.log2(counter);
		}
		else if ( counter < 10)
		{
			continue;
		}
		else {
			offset = 2 * counter;
		}

		context.strokeStyle = '#'
			+ toHex(fractal.colors[counter].r)
			+ toHex(fractal.colors[counter].g)
			+ toHex(fractal.colors[counter].b);

		context.beginPath()
		context.moveTo(x,y);
		context.lineTo(x,y+offset);
		context.closePath();
		context.stroke();

		if (lineCount++ > maxLines) {
			break;
		}
	}

	drawColors(data);

	context.restore();
	fractal.animationIndex += animationSteps;
	return fractal.continueAnimation;
};

addToPixels[24] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var maxLines = 100000;
	var lineCount = 0;
	var x,y,pixelIndex,offset;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	pixelColors[data.pixelColorsId](data);
	fractal.context.putImageData(fractal.imageData,0,0);
	context.lineWidth = 1;
	//context.save();

	var rotation,other;
	rotation = .745;
	other = fractal.animationIndex%fractal.counterMax/255;
	//context.setTransform(1,rotation,0,other,0,0,0);//(1,.477,0,1,150,-250)

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{

		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);

		counter = fractal.counters[p];

		fractal.pixels[p+0] = fractal.colors[counter].r;
		fractal.pixels[p+1] = fractal.colors[counter].g;
		fractal.pixels[p+2] = fractal.colors[counter].b;
		fractal.pixels[p+3] = 255/counter;

		if (counter > 250 || counter < 10)
		{

			fractal.pixels[p+0] = 255;
			fractal.pixels[p+1] = 255;
			fractal.pixels[p+2] = 255;
			fractal.pixels[p+3] = 255;
			continue;
		}
		else {
			offset = counter/10 + Math.log2(counter);
		}

			context.strokeStyle = '#'
			  + toHex(fractal.colors[counter].r)
			  + toHex(fractal.colors[counter].g)
			  + toHex(fractal.colors[counter].b);

			context.beginPath()
			context.moveTo(x,y);
			context.lineTo(x,y-offset);
			context.closePath();
			context.stroke();

		//if (lineCount++ > maxLines)
		//{
			//break;
		//}
	}

	drawColors(data);

	context.restore();
	fractal.animationIndex += animationSteps;
	return fractal.continueAnimation;
};

addToPixels[25] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	//[2017-04-10T20:32:38.370] Notice: "addToPixels[25] rotation = "0.745", other = "0.47058823529411764""
	//[2017-04-10T20:32:46.158] Notice: "addToPixels[25] rotation = "0.745", other = "0.5098039215686274""
	//[2017-04-10T20:32:53.883] Notice: "addToPixels[25] rotation = "0.745", other = "0.5490196078431373""
	//rotation = fractal.animationIndex%fractal.counterMax/255;

	pixelColors[data.pixelColorsId](data);
	context.save();

	var rotation,other;
	rotation = .745;
	other = fractal.animationIndex%fractal.counterMax/255;
	context.setTransform(1,rotation,0,other,0,0,0);//(1,.477,0,1,150,-250)
	Log.Notice('addToPixels[25] rotation = "' + rotation + '", other = "' + other + '"');
	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
		 p+=pixelJump)
	{
		fractal.pixels[p+0] = 255;
		fractal.pixels[p+1] = 255;
		fractal.pixels[p+2] = 255;
		fractal.pixels[p+3] = 255;
	}

	fractal.context.putImageData(fractal.imageData,0,0);

	context.lineWidth = 1;
	var maxLines = 1000000;
	var lineCount = 0;
	var x,y,pixelIndex,offset;

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);
		counter = fractal.counters[p];

		if (counter > 40 ) {
			offset = 80;
		} else if (counter < 5) {
			continue;
		} else {
			offset = counter*2;
		}

		context.strokeStyle = fractal.colors[counter].hex ;
		context.beginPath()
		context.moveTo(x,y);
		context.lineTo(x,y-offset);
		context.closePath();
		context.stroke();

		fractal.pixels[p+0] = fractal.colors[counter].r;
		fractal.pixels[p+1] = fractal.colors[counter].g;
		fractal.pixels[p+2] = fractal.colors[counter].b;
		fractal.pixels[p+3] = 255;

		if (lineCount++ > maxLines) {
			break;
		}
	}

	drawColors(data);

	context.restore();
	fractal.animationIndex += animationSteps;
	return fractal.continueAnimation;
};


addToPixels[26] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
	var Rows = fractal.rowPolygons;
	var row,point;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	context.lineWidth = 1;
	context.globalAlpha = 1;
	pixelColors[data.pixelColorsId](data);

	if (fractal.animationRow%fractal.height == 0)
	{ // clear the decks
		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump)
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255 ;
		}

		drawColors(data);
		fractal.context.putImageData(fractal.imageData,0,0);
	}

	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++)
	{
		row = Rows[rowIndex];
		point = 0;

		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			counter2 = row[point+1][1];
			height1 = scaleCounter[data.scaleCounterId](counter1);
			height2 = scaleCounter[data.scaleCounterId](counter2);

			context.beginPath();
			context.moveTo(x1,rowIndex-height1);

			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.closePath();
				context.fillStyle = fractal.colors[counter1].hex ;
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.strokeStyle = fractal.colors[counter1].hex;
				context.stroke();
			}

			//point++;
			if ((point < row.length-2) && ((point + parseInt(pixelJump/4)) >= row.length-1))
			{
				point = row.length-2;
			}
			else {
				point += parseInt(pixelJump/4);
			}
		}
	}

	fractal.animationIndex += animationSteps;
	fractal.animationRow++;
	return fractal.continueAnimation;
};

addToPixels[27] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var lineCount = 0;
	var x1,x2,height1,pixelIndex,offset,counter1,counter2;
	var Rows = fractal.rowPolygons;
	var row,point;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	pixelColors[data.pixelColorsId](data);

	if (fractal.animationRow%fractal.height == 0)
	{ // clear the decks

		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump)
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;
		}

		drawColors(data);
		fractal.context.putImageData(fractal.imageData,0,0);
	}

	context.lineWidth = 1;
	context.save();

	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++)
	{
		row = Rows[rowIndex];
		point = 0;

		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			height1 = scaleCounter[data.scaleCounterId](counter1);
			context.beginPath();
			context.moveTo(x1,rowIndex-height1);

			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.closePath();
				context.fillStyle = fractal.colors[counter1].hex;
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.strokeStyle = fractal.colors[counter1].hex;
				context.stroke();
			}

			//point++;
			if ((point < row.length-2) && ((point + parseInt(pixelJump/4)) >= row.length-1))
			{
				point = row.length-2;
			}
			else {
				point += parseInt(pixelJump/4);
			}
		}

		break;
	}

	context.restore();
	fractal.animationIndex += animationSteps;
	fractal.animationRow++;
	return fractal.continueAnimation;
};

addToPixels[28] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
	var Rows = fractal.rowPolygons;
	var row,point;
	var context = fractal.context;

	pixelColors[data.pixelColorsId](data);

	if (fractal.animationRow%fractal.height == 0)
	{ // clear the decks
		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump)
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;
		}

		drawColors(data);

		context.putImageData(fractal.imageData,0,0);
	}

	context.lineWidth = 1;
	context.save();
	context.setTransform(1,.477,0,1,150,-250);

	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++)
	{
		row = Rows[rowIndex];
		point = 0;

		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			height1 = scaleCounter[data.scaleCounterId](counter1);
			context.beginPath();
			context.moveTo(x1,rowIndex-height1);

			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.closePath();

				context.fillStyle = fractal.colors[counter1].hex;
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.strokeStyle = fractal.colors[counter1].hex;
				context.stroke();
			}

			point++;
		}

		break;
	}

	context.restore();
	fractal.animationIndex += animationSteps;
	fractal.animationRow++;
	return fractal.continueAnimation;
};

addToPixels[29] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
	var Rows = fractal.rowPolygons;
	var row,point;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	pixelColors[data.pixelColorsId](data);

	if (fractal.animationRow%fractal.height == 0)
	{ // clear the decks
		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump)
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;

		}

		drawColors(data);

		context.putImageData(fractal.imageData,0,0);
	}

	context.lineWidth = 1;
	context.save();

	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++)
	{
		row = Rows[rowIndex];
		point = 0;

		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			height1 = scaleCounter[data.scaleCounterId](counter1);
			context.beginPath();
			context.moveTo(x1,rowIndex-height1);

			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.closePath();
				context.fillStyle = fractal.colors[counter1].hex;
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.strokeStyle = fractal.colors[counter1].hex;
				context.stroke();
			}

			point++;
		}
		break;
	}

	context.restore();
	fractal.animationIndex += animationSteps;
	fractal.animationRow++;
	return fractal.continueAnimation;
};

addToPixels[30] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
	var Rows = fractal.rowPolygons;
	var row,point;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	pixelColors[data.pixelColorsId](data);

	if (fractal.animationRow%fractal.height == 0)
	{ // clear the decks

		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump)
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;

		}

		drawColors(data);

		fractal.context.putImageData(fractal.imageData,0,0);
	}

	context.lineWidth = 1;
	context.save();

	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++)
	{
		row = Rows[rowIndex];
		point = 0;
		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			height1 = scaleCounter[data.scaleCounterId](counter1);

			if (height1 == 1) {
				point++;
				continue;
			}

			context.beginPath();
			context.moveTo(x1,rowIndex-height1);

			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.closePath();
				context.fillStyle = fractal.colors[255].hex;
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.strokeStyle = fractal.colors[255].hex;
				context.stroke();
			}

			point++;
		}

		break;
	}

	context.restore();
	fractal.animationIndex += animationSteps;
	fractal.animationRow++;
	return fractal.continueAnimation;
};

addToPixels[31] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
	var Rows = fractal.rowPolygons;
	var row,point;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	pixelColors[data.pixelColorsId](data);

	if (fractal.animationRow%fractal.height == 0)
	{ // clear the decks
		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump)
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;

		}

		drawColors(data);

		fractal.context.putImageData(fractal.imageData,0,0);
	}

	context.lineWidth = 1;
	context.save();

	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++)
	{
		row = Rows[rowIndex];
		point = 0;
		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			height1 = scaleCounter[data.scaleCounterId](counter1);

			if (height1 == 1) {
				point++;
				continue;
			}

			context.beginPath();
			context.moveTo(x1,rowIndex-height1);

			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.closePath();
				context.fillStyle = fractal.colors[counter1].hex;
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.strokeStyle = fractal.colors[counter1].hex;
				context.stroke();
			}

			point++;
		}

		break;
	}

	context.restore();
	fractal.animationIndex += animationSteps;
	fractal.animationRow++;
	return fractal.continueAnimation;
};


addToPixels[32] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
	var Rows = fractal.rowPolygons;
	var row,point;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	pixelColors[data.pixelColorsId](data);

	if (fractal.animationRow%fractal.height == 0)
	{ // clear the decks
		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump)
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;
		}

		drawColors(data);

		fractal.context.putImageData(fractal.imageData,0,0);
	}

	context.save();
	context.lineWidth = 1;

	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++)
	{
		row = Rows[rowIndex];
		point = 0;

		while (point < row.length-1)
		{
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			height1 = scaleCounter[data.scaleCounterId](counter1);

			if (height1 == 1 || height1 == 256) {
				point++;
				continue;
			}

			context.beginPath();
			context.moveTo(x1,rowIndex-height1);

			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.closePath();
				context.fillStyle = fractal.colors[counter1].hex;
				context.fill();
			} else {
				context.lineTo(x1,rowIndex);
				context.strokeStyle = fractal.colors[counter1].hex;
				context.stroke();
			}

			point++;
		}

		break;
	}

	context.restore();
	fractal.animationIndex += animationSteps;
	fractal.animationRow++;
	return fractal.continueAnimation;
};

addToPixels[33] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var x,y,pixelIndex,offset;

	pixelColors[data.pixelColorsId](data);

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);
		counter = fractal.counters[p];

		if (counter > 250 || counter < 10)
		{

			fractal.pixels[p+0] = 255;
			fractal.pixels[p+1] = 255;
			fractal.pixels[p+2] = 255;
			fractal.pixels[p+3] = 255;
			continue;
		}
		else {
		  fractal.pixels[p+0] = fractal.colors[counter].r;
		  fractal.pixels[p+1] = fractal.colors[counter].g;
		  fractal.pixels[p+2] = fractal.colors[counter].b;
		  fractal.pixels[p+3] = 255;
		}
	}

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += animationSteps;
	return fractal.continueAnimation;
};

addToPixels[34] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	context.save();

	pixelColors[data.pixelColorsId](data);

	if (fractal.animationRow%fractal.height == 0)
	{ // clear the decks

		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump)
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;
		}

		fractal.context.putImageData(fractal.imageData,0,0);
	}

	context.lineWidth = 1;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
	var Rows = fractal.rowPolygons;
	var row,point;

	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++)
	{
		row = Rows[rowIndex];
		point = 0;
		while (point < row.length-1)
		{
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			height1 = scaleCounter[data.scaleCounterId](counter1);

			if (height1 == 1 || height1 == 256) {
				point++;
				continue;
			}

			context.beginPath();
			context.moveTo(x1,rowIndex-height1);

			if ((x2-x1) > 1)
			{
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.closePath();
				context.fillStyle = fractal.colors[counter1].hex;
				context.fill();
			}
			else {
				context.lineTo(x1,rowIndex);
				context.strokeStyle = fractal.colors[counter1].hex;
				context.stroke();
			}

			point++;
		}

		break;
	}

	context.restore();
	fractal.animationIndex += animationSteps;
	fractal.animationRow++;
	return fractal.continueAnimation;
};


addToPixels[35] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter,pixelCount,diff,compareDiff,brtDivisor,satDivisor;
	var hue,sat,brt,rgb;
	var hueFactor = 2*360/fractal.counterMax;
	var pixelJump = data.pixelJump;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
	  colors[i] = {r:0,g:0,b:0,a:255};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{

		counter = fractal.counters[p];
		pixelCount = fractal.profile.counts[counter];

		if (pixelCount < 100 && pixelCount > 50) {
			compareDiff = 25;
			satDivisor = 25;
			brtDivisor = 50;
		} else if (pixelCount < 51) {
			compareDiff = 50;
			satDivisor = 50;
			brtDivisor = 100;
		} else {
			compareDiff = 5;
			satDivisor = 10;
			brtDivisor = 20;
		}

		if (counter == fractal.animationIndex%256)
		{
			hue = (Math.round(counter*hueFactor*5+fractal.animationIndex)/10)%360;
		  	sat = 1.0;
		  	brt = (counter%8)*.125 + .125;
		  	rgb = hsb2rgb(hue, sat, brt);
		}
		else if (Math.abs(fractal.animationIndex%256 - counter) < compareDiff)
		{
			diff = fractal.animationIndex%256 - counter;
			hue = (Math.round(counter*hueFactor*5+fractal.animationIndex+diff)/10)%360;
			sat = 0.5 + (diff/satDivisor);
			brt = 0.75 - (diff/brtDivisor);
			rgb = hsb2rgb(hue,sat,brt);
		}
		else {
		  rgb = {r:255,g:255,b:255};
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[36] = function (data) {
	var objId = data.objId;
	var amount = data.amount;
	var fractal = myFractalImages[objId];
	var counter,pixelCount,diff,compareDiff,brtDivisor,satDivisor;
	var hue,sat,brt,rgb;
	var hueFactor = 2*360/fractal.counterMax;
	var pixelJump = data.pixelJump;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];
		pixelCount = fractal.profile.counts[counter];

		if (pixelCount < 200 && pixelCount > 100) {
			compareDiff = 25;
			satDivisor = 25;
			brtDivisor = 50;
		} else if (pixelCount < 101) {
			compareDiff = 50;
			satDivisor = 50;
			brtDivisor = 100;
		} else {
			compareDiff = 5;
			satDivisor = 10;
			brtDivisor = 20;
		}

		if (counter == fractal.animationIndex%256)
		{
			hue = (Math.round(counter*hueFactor*5+fractal.animationIndex)/10)%360;
			sat = 1.0;
			brt = (counter%8)*.125 + .125;
			rgb = hsb2rgb(hue, sat, brt);
		}
		else if (Math.abs(fractal.animationIndex%256 - counter) < compareDiff)  {
			diff = fractal.animationIndex%256 - counter;
			hue = (Math.round(counter*hueFactor*5+fractal.animationIndex+diff)/10)%360;
			sat = 0.5 + (diff/satDivisor);
			brt = 0.75 - (diff/brtDivisor);
			rgb = hsb2rgb(hue,sat,brt);
		}
		else {
			rgb = {r:255,g:255,b:255,a:255,hex:'#FFFFFF'};
		}

		fractal.pixels[p] = rgb.r;
		fractal.pixels[p+1] = rgb.g;
		fractal.pixels[p+2] = rgb.b;
		fractal.pixels[p+3] = 255;

		colors[counter].r = rgb.r;
		colors[counter].g = rgb.g;
		colors[counter].b = rgb.b;
		colors[counter].a = 255;
	}

	fractal.colors = colors;
	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += amount;
	return fractal.continueAnimation;
};

addToPixels[37] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	pixelColors[1](data);

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{
		counter = fractal.counters[p];
		fractal.pixels[p+0] = fractal.colors[counter].r;
		fractal.pixels[p+1] = fractal.colors[counter].g;
		fractal.pixels[p+2] = fractal.colors[counter].b;
		fractal.pixels[p+3] = 255;
	}

	drawColors(data);

	fractal.context.putImageData(fractal.imageData,0,0);
	fractal.animationIndex += animationSteps;
	return fractal.continueAnimation;
};


addToPixels[38] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var maxLines = 100000;
	var lineCount = 0;
	var x,y,pixelIndex,offset;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	pixelColors[data.pixelColorsId](data);
	fractal.context.putImageData(fractal.imageData,0,0);
	context.lineWidth = 1;
	context.save();

	var rotation,other;
	rotation = 0.0;//.745
	other = (fractal.rotationIndex%fractal.counterMax)/fractal.counterMax;
	context.setTransform(1,rotation,0,other,0,0,0);//(1,.477,0,1,150,-250)

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{

		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);

		counter = fractal.counters[p];

		fractal.pixels[p+0] = fractal.colors[counter].r;
		fractal.pixels[p+1] = fractal.colors[counter].g;
		fractal.pixels[p+2] = fractal.colors[counter].b;
		fractal.pixels[p+3] = 255/counter;

		offset = scaleCounter[data.scaleCounterId](counter);

		context.strokeStyle = '#'
			  + toHex(fractal.colors[counter].r)
			  + toHex(fractal.colors[counter].g)
			  + toHex(fractal.colors[counter].b);

		context.beginPath()
		context.moveTo(x,y);
		context.lineTo(x,y-offset);
		context.closePath();
		context.stroke();
	}

	drawColors(data);

	context.restore();
	fractal.animationIndex += animationSteps;
	fractal.rotationIndex += 10;
	fractal.continueAnimation = false;
	return fractal.continueAnimation;
};


addToPixels[39] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var maxLines = 100000;
	var lineCount = 0;
	var x,y,pixelIndex,offset;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:255,g:255,b:255,a:255,hex:'#FFFFFF'};
	}

	pixelColors[data.pixelColorsId](data);
	fractal.context.putImageData(fractal.imageData,0,0);
	context.lineWidth = 1;
	context.save();

	var rotation,other;
	rotation = 0.0;//.745
	other = (fractal.rotationIndex%fractal.counterMax)/fractal.counterMax;
	context.setTransform(1,rotation,0,other,0,0,0);//(1,.477,0,1,150,-250)

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{

		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);

		counter = fractal.counters[p];

		fractal.pixels[p+0] = fractal.colors[counter].r;
		fractal.pixels[p+1] = fractal.colors[counter].g;
		fractal.pixels[p+2] = fractal.colors[counter].b;
		fractal.pixels[p+3] = 255; //255/counter;

		offset = scaleCounter[data.scaleCounterId](counter);

		context.strokeStyle = '#FFFFFF';
		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(x,y-offset);
		context.closePath();
		context.stroke();

		context.strokeStyle = '#'
			  + toHex(fractal.colors[counter].r)
			  + toHex(fractal.colors[counter].g)
			  + toHex(fractal.colors[counter].b);

		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(x,y-offset+1);
		context.closePath();
		context.stroke();
	}

	drawColors(data);

	context.restore();
	fractal.animationIndex += animationSteps;
	fractal.rotationIndex += 10;
	fractal.continueAnimation = false;
	return fractal.continueAnimation;
};


addToPixels[40] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var maxLines = 100000;
	var lineCount = 0;
	var x,y,pixelIndex,offset;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:255,g:255,b:255,a:255,hex:'#FFFFFF'};
	}

	pixelColors[data.pixelColorsId](data);
	//fractal.context.putImageData(fractal.imageData,0,0);
	context.save();
	context.lineWidth = 1;

	var rotation,other,color;
	var fcolors = fractal.colors;
	rotation = 0.0;//.745
	other = (fractal.rotationIndex%fractal.counterMax)/fractal.counterMax;
	context.setTransform(1,rotation,0,other,0,0,0);//(1,.477,0,1,150,-250)

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{

		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);

		counter = fractal.counters[p];
		color = fcolors[counter];
		offset = scaleCounter[data.scaleCounterId](counter);

		/*
		fractal.pixels[p+0] = color.r;
		fractal.pixels[p+1] = color.g;
		fractal.pixels[p+2] = color.b;
		fractal.pixels[p+3] = 255; //255/counter;

		context.strokeStyle = 'rgba(255,255,255,1.0)'
		 */
		context.fillStyle = '#FFFFFF';
		context.strokeStyle = '#FFFFFF';
		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(x,y-offset);
		context.closePath();
		context.stroke();

		/*
		context.strokeStyle = '#'
			  + toHex(fractal.colors[counter].r)
			  + toHex(fractal.colors[counter].g)
			  + toHex(fractal.colors[counter].b);

	    context.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',1.0)';
	     */
	    context.fillStyle = color.hex;
	    context.strokeStyle = color.hex;
		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(x,y-offset+1);
		context.closePath();
		context.stroke();
	}

	context.restore();

	drawColors(data);
	addText(data);

	fractal.animationIndex += animationSteps;
	fractal.rotationIndex += 10;
	fractal.continueAnimation = false;
	return fractal.continueAnimation;
};

addToPixels[41] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var maxLines = 100000;
	var lineCount = 0;
	var x,y,pixelIndex,offset;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:255,g:255,b:255,a:255,hex:'#FFFFFF'};
	}

	pixelColors[data.pixelColorsId](data);
	//fractal.context.putImageData(fractal.imageData,0,0);

	context.save();
	context.globalAlpha = 1;
	context.lineWidth = 1;

	var rotation,other,color;
	var fcolors = fractal.colors;
	rotation = 0.0;//.745
	other = (fractal.rotationIndex%fractal.counterMax)/fractal.counterMax;
	context.setTransform(1,rotation,0,other,0,0,0);//(1,.477,0,1,150,-250)

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{

		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);

		counter = fractal.counters[p];
		color = fcolors[counter];

		fractal.pixels[p+0] = color.r;
		fractal.pixels[p+1] = color.g;
		fractal.pixels[p+2] = color.b;
		fractal.pixels[p+3] = 255; //255/counter;
		offset = scaleCounter[data.scaleCounterId](counter);

	   /*
		context.strokeStyle = 'rgba(255,255,255,1.0)'
		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(x,y-offset);
		context.closePath();
		context.stroke();

		context.strokeStyle = '#'
			  + toHex(fractal.colors[counter].r)
			  + toHex(fractal.colors[counter].g)
			  + toHex(fractal.colors[counter].b);
	    */

	    context.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(x,y-offset);
		context.closePath();
		context.stroke();
	}

	context.restore();

	drawColors(data);
	addText(data);

	fractal.animationIndex += animationSteps;
	fractal.rotationIndex += 10;
	fractal.continueAnimation = false;
	return fractal.continueAnimation;
};


addToPixels[42] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var maxLines = 100000;
	var lineCount = 0;
	var x,y,pixelIndex,offset;

	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:255,g:255,b:255,a:255,hex:'#FFFFFF'};
	}

	pixelColors[data.pixelColorsId](data);
	//fractal.context.putImageData(fractal.imageData,0,0);
	context.save();
	context.lineWidth = 1;

	var rotation,other,color;
	var fcolors = fractal.colors;
	rotation = 0.0;//.745
	other = (fractal.rotationIndex%fractal.counterMax)/fractal.counterMax;
	context.setTransform(1,rotation,0,other,0,0,0);//(1,.477,0,1,150,-250)

	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length; p+=pixelJump)
	{

		pixelIndex = p/4;
		x = pixelIndex % fractal.width;
		y = Math.floor(pixelIndex/fractal.width);

		counter = fractal.counters[p];
		color = fcolors[counter];
		offset = scaleCounter[data.scaleCounterId](counter);

	    context.strokeStyle = color.hex;
		context.beginPath();
		context.moveTo(x,y);
		context.lineTo(x,y-offset+1);
		context.closePath();
		context.stroke();

		context.strokeStyle = '#FFFFFF';
		context.beginPath();
		context.moveTo(x,y-offset);
		context.lineTo(x,y-offset);
		context.closePath();
		context.stroke();

	}

	context.restore();

	fractal.imageData = fractal.context.getImageData(0,0,fractal.width,fractal.height);
	for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.imageData.data.length; p+=pixelJump)
	{
		fractal.imageData.data[p+3] = 255;
	}
	fractal.context.putImageData(fractal.imageData,0,0);

	drawColors(data);
	addText(data);

	fractal.animationIndex += animationSteps;
	fractal.rotationIndex += 10;
	fractal.continueAnimation = false;
	return fractal.continueAnimation;
};


addToPixels[43] = function (data) {
	var objId = data.objId;
	var animationSteps = data.amount;
	var fractal = myFractalImages[objId];
	var counter;
	var pixelJump = data.pixelJump;
	var context = fractal.context;
	var lineCount = 0;
	var x1,x2,height1,height2,pixelIndex,offset,counter1,counter2;
	var Rows = fractal.rowPolygons;
	var row,point;
	var colors = new Array(fractal.counterMax);

	for (var i = 0; i<=fractal.counterMax;i++)
	{
		colors[i] = {r:0,g:0,b:0,a:255,hex:'#000000'};
	}

	pixelColors[data.pixelColorsId](data);

	if (fractal.animationRow%fractal.height == 0)
	{ // clear the decks
		for (var p = (fractal.animationIndex%pixelJump)*4;p<fractal.pixels.length;
				 p+=pixelJump)
		{
			counter = fractal.counters[p];
			fractal.pixels[p+0] = fractal.colors[counter].r;
			fractal.pixels[p+1] = fractal.colors[counter].g;
			fractal.pixels[p+2] = fractal.colors[counter].b;
			fractal.pixels[p+3] = 255;

		}

		drawColors(data);

		context.putImageData(fractal.imageData,0,0);
	}

	context.save();
	context.lineWidth = 1;
	context.globalAlpha = 0.95;
	//context.globalCompositeOperation = 'destination-in';

	for (var rowIndex = fractal.animationRow%fractal.height; rowIndex < Rows.length; rowIndex++)
	{
		row = Rows[rowIndex];
		point = 0;

		while (point < row.length-1) {
			x1 = row[point][0];
			x2 = row[point+1][0];
			counter1 = row[point][1];
			height1 = scaleCounter[data.scaleCounterId](counter1);
			context.beginPath();
			context.moveTo(x1,rowIndex-height1);

			if ((x2-x1) > 1) {
				context.lineTo(x1,rowIndex);
				context.lineTo(x2,rowIndex);
				context.lineTo(x2,rowIndex-height1);
				context.strokeStyle = fractal.colors[counter1].hex;
				context.closePath();
				context.fillStyle = 'rgba(255,255,255,.75)';
				context.fill();
				context.stroke();
			} else {
				context.lineTo(x1,rowIndex);
				context.strokeStyle = fractal.colors[counter1].hex;
				context.stroke();
			}

			point++;
		}
		break;
	}

	context.restore();
	fractal.animationIndex += animationSteps;
	fractal.animationRow++;
	return fractal.continueAnimation;
};
