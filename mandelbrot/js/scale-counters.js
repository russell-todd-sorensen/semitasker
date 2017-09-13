
var scaleCounter = new Array();

scaleCounter[0] = function (value) {
	if (value < 10) {
		return value * 5;
	} 
	else if (value < 50) {
		return 50 + 2*value;
	} 
	else {
		return 100 + value;
	}
};

scaleCounter[1] = function (value) {
	if (value < 11) {
		return value * 2;
	} 
	else if (value < 50) {
		return 20 + 4*value;
	} 
	else {
		return 200;
	}
};

scaleCounter[2] = function (value) {
	if (value < 19) {
		return value * 2;
	} 
	else {
		return 80;
	}
};

scaleCounter[3] = function (value) {
	if (value < 19) {
		return value * 4;
	} 
	else {
		return 120;
	}
};

scaleCounter[4] = function (value) {
	if (value < 26) {
		return value * 5;
	} 
	else {
		return 130;
	}
};

scaleCounter[5] = function (value) {
	if (value < 20) {
		return value * 1;
	} 
	else if (value < 50) {
		return 20 + value * 4;
	} 
	else {
		return 140;
	}
};

scaleCounter[6] = function (value) {
	if (value < 200) {
		return 1;
	} 
	else {
		return 50;
	}
};

scaleCounter[7] = function (value) {
	if (value > 100) {
		return 50;
	} 
	else {
		return 1;
	}
};

scaleCounter[8] = function (value) {
	if (value > 75) {
		return 50;
	} 
	else {
		return 1;
	}
};

scaleCounter[9] = function (value) {
	if (value > 65) {
		return 50;
	} 
	else {
		return 1;
	}
};

scaleCounter[10] = function (value) {
	if (value > 50) {
		return 50;
	} 
	else {
		return 1;
	}
};

scaleCounter[11] = function (value) {
	if (value > 35) {
		return 50;
	} 
	else {
		return 1;
	}
};

scaleCounter[12] = function (value) {
	if (value > 25) {
		return 50;
	} 
	else {
		return 1;
	}
};

scaleCounter[13] = function (value) {
	if (value < 11) {
		return value * 2;
	}
	else if (value < 20) {
		return value * 3;
	}
	else {
		return Math.floor(Math.log2(value)*4);
	}
};

scaleCounter[14] = function (value) {
	if (value < 11) {
		return parseInt(value * 1.5);
	} 
	else if (value < 50) {
		return parseInt(16 + 1.25*value);
	} 
	else if (value < 254) {
		return parseInt(80 + .2* value);
	} 
	else {
	  return 1;
	}
};

scaleCounter[15] = function (value) {
	if (value < 11) {
		return parseInt(value * 1.1);
	} 
	else if (value < 50) {
		return parseInt(10 + .5*value);
	} 
	else if (value < 100) {
		return parseInt(35 + .1* value);
	} 
	else  if (value < 254) {
	  return parseInt(45 + .02*value); 
	}
	else {
	  return 1;
	}
};

scaleCounter[16] = function (value) {
	if (value < 20) {
		return parseInt(value * 1.1);
	} 
	else if (value < 50) {
		return parseInt(10 + .5*value);
	} 
	else if (value < 100) {
		return parseInt(35 + .1* value);
	} 
	else  if (value < 254) {
	  return parseInt(45 + .02*value); 
	}
	else {
	  return 1;
	}
};


scaleCounter[17] = function (value) {
	if (value < 10) {
		return value * 100;
	} 
	else if (value < 50) {
		return 1000 + 20*value;
	} 
	else {
		return 2000 + 2*value;
	}
};

scaleCounter[18] = function (value) {
	if (value < 10) {
		return value * 10;
	} 
	else if (value < 50) {
		return 100 + 2*value;
	} 
	else if (value < 256) {
		return 200 + 10 * Math.log2(value);
	} 
};

scaleCounter[19] = function (value) {
	if (value < 10) {
		return value * 50;
	} 
	else if (value < 50) {
		return 500 + 2*value;
	} 
	else if (value < 256) {
		return 600 + 10 * Math.log2(value);
	} 
};


scaleCounter[20] = function (value) {
	if (value < 10) {
		return value * 5;
	} 
	else if (value < 50) {
		return 50 + 2*value;
	} 
	else if (value < 256) {
		return 150 + Math.sqrt(value);
	} 
};

scaleCounter[21] = function (value) {
	if (value % 2 == 0) {
		return 5;
	}
	if (value < 20) {
		return parseInt(value * 1.1);
	} 
	else if (value < 50) {
		return parseInt(10 + .5*value);
	} 
	else if (value < 100) {
		return parseInt(35 + .1* value);
	} 
	else  if (value < 254) {
	  return parseInt(45 + .02*value); 
	}
	else {
	  return 1;
	}
};


scaleCounter[22] = function (value) {
	if (value % 2 == 0) {
		return 5;
	}
	value = 255-value;
	if (value < 20) {
		return parseInt(value * 1.1);
	} 
	else if (value < 50) {
		return parseInt(10 + .5*value);
	} 
	else if (value < 100) {
		return parseInt(35 + .1* value);
	} 
	else  if (value < 254) {
	  return parseInt(45 + .02*value); 
	}
	else {
	  return 1;
	}
};