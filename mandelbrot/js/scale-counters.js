
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


scaleCounter[23] = function (value) {
    if (value % 2 == 0) {
        return 5;
    }
    value = Math.abs(255-value);
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

scaleCounter[24] = function (value) {
    if (value % 3 == 0) {
        return 20;
    } else if (value % 2 == 0) {
        return 5;
    }
    var id = FormGlobal.data.objId;
    var counterMax = myFractalImages[id].counterMax;
    //var scaler = parseInt(Math.round(counterMax/255));
    //value = parseInt(Math.floor(value/scaler));

    value = counterMax-value;
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

scaleCounter[25] = function (value) {

    var remainder = value % 10;
    var mappedValue;
    switch (remainder) {
    case 0:
        mappedValue = 5;
        break;
    case 1:
        mappedValue = 20;
        break;
    case 2:
        mappedValue = 30;
        break;
    case 3:
        mappedValue = 10;
        break;
    case 4:
        mappedValue = 40;
        break;
    default:
        mappedValue = 0;
        break;
    }
    return mappedValue;

};

scaleCounter[26] = function (value) {

    var remainder = value % 5;
    var mappedValue;
    var scale = 1;
    var tmpValue = parseInt(value);

    while (tmpValue/2 > 1) {
        scale *= 2;
        tmpValue /= 2;
    }

    switch (remainder) {
    case 0:
        mappedValue = 5;
        break;
    case 1:
        mappedValue = 20;
        break;
    case 2:
        mappedValue = 30;
        break;
    case 3:
        mappedValue = 10;
        break;
    case 4:
        mappedValue = 40;
        break;
    default:
        mappedValue = 0;
        break;
    }

    return parseInt(5*mappedValue/scale);
};

scaleCounter[27] = function (value) {

    var remainder = value % 5;
    var mappedValue;
    var scale = 1;
    var finalValue;
    var tmpValue = parseInt(value);

    while (tmpValue/2 > 1) {
        scale += 2;
        tmpValue /= 2;
    }

    switch (remainder) {
    case 0:
        mappedValue = 5;
        break;
    case 1:
        mappedValue = 20;
        break;
    case 2:
        mappedValue = 30;
        break;
    case 3:
        mappedValue = 10;
        break;
    case 4:
        mappedValue = 40;
        break;
    default:
        mappedValue = 0;
        break;
    }

    if (value < 20) {
        finalValue = parseInt(mappedValue/scale);
    } else if (value < 50) {
          finalValue = parseInt(2*mappedValue/scale);
    } else {
        finalValue = parseInt(5*mappedValue/scale);
    }
    return finalValue;
};

scaleCounter[28] = function (value) {

    var mappedValue;
    var scale = 1;
    var finalValue;
    var tmpValue = parseInt(value);

    mappedValue = 20;

    while (tmpValue/2 > 1) {
        scale += 2;
        tmpValue /= 2;
    }

    mappedValue -= scale;

    finalValue = mappedValue;
    return finalValue;
};

scaleCounter[29] = function (value) {

    var mappedValue;
    var scale = 1;
    var finalValue;
    var tmpValue = parseInt(value);

    mappedValue = 100;

    if (value %2 == 0) {
        mappedValue /= 2;
    }

    while (tmpValue/2 > 1) {
        scale += 2;
        tmpValue /= 2;
    }

    mappedValue -= scale;

    finalValue = mappedValue;
    return finalValue;
};

scaleCounter[30] = function (value) {

    var mappedValue;
    var scale = 1;
    var finalValue;
    var tmpValue = parseInt(value);

    mappedValue = 70;

    if (value %2 == 0) {
        mappedValue /= 2;
    }

    while (tmpValue/2 > 1) {
        scale *= 2;
        tmpValue /= 2;
    }

    mappedValue -= scale;

    finalValue = mappedValue;

    return finalValue;
};

scaleCounter[31] = function (value) {

    var mappedValue;
    var scale = 1;
    var finalValue;
    var tmpValue = parseInt(value);

    mappedValue = 70;

    if (value %2 == 0) {
        mappedValue /= 2;
    }

    while (tmpValue/2 > 1) {
        scale *= 2;
        tmpValue /= 2;
    }

    mappedValue -= scale;

    finalValue = mappedValue;

    if (finalValue < 0) {
        if (value %2 == 0) {
            finalValue = 0
        } else {
            finalValue = 5;
        }
    }

    return finalValue;
};

scaleCounter[32] = function (value) {

    var mappedValue;
    var scale = 1;
    var finalValue;
    var tmpValue = parseInt(value);

    mappedValue = 70;

    if (value %2 == 0) {
        mappedValue /= 2;
    }

    while (tmpValue/2 > 1) {
        scale *= 2;
        tmpValue /= 2;
    }

    mappedValue -= scale;

    finalValue = mappedValue;

    if (finalValue < 0) {
        if (value %2 == 0) {
            finalValue = 0
        } else {
            finalValue = 5;
        }
    }

    return finalValue;
};
