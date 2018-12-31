// JavaScript Document

//////############### SCHEDULE FUNCTION ###############///////////////

/*    ################# EXAMPLE USAGE  ###############
  // 1. Use a control variable, for example, continueAnimation to control
  // rescheduling of function:

  var continueAnimation = true;

  // 2. Start animation using a wrapper which calls scheduleFunction, passing
  // a single argument as a value, or multiple args as an object.

  function startAnimation(timeout, amount) {
    continueAnimation = true;
    if (timeout < 10) timeout = 10;
    scheduleFunction(doAddToPixels, timeout, true, true, amount);
  }

  // 3. Stop animation by setting variable to false

  function stopAnimation() {
    continueAnimation = false;
  }

  // 4. Function to schedule/reschedule must return the value of the control
  // variable:

  function doAddToPixels(amount) {
    addToPixels(amount);
    return continueAnimation;
  }

  // Complete example using object as data containing the control variable:

	var startAnimation = function (animationFunctionId, timeout, data) {
	  var objId = data.objId;
	  var animationFunction = addToPixels[animationFunctionId];
	  var fractal = myFractalImages[objId];
	  fractal.continueAnimation = true;
	  if (timeout < 10) timeout = 10;
	  scheduleFunction(animationFunction, timeout, true, true, data);
	};

	var stopAnimation = function() {
	  var formData = processForm();
	  var data = formData.data;
	  var objId = data.objId;
	  var fractal = myFractalImages[objId];
	  fractal.continueAnimation = false;
	};

	var reDrawImage = function () {
	  var formData = processForm();
	  var data = formData.data
	  var objId = data.objId;
	  var fractal = myFractalImages[objId];
	  var newFactor = 1.0;
	  fractal.rect.start.x = fractal.rectTmp.start.x;
	  fractal.rect.start.y = fractal.rectTmp.start.y;
	  fractal.rect.end.x = fractal.rectTmp.end.x;
	  fractal.rect.end.y = fractal.rectTmp.end.y;
	  fractal.calculateHeightAndWidth(newFactor);
	  fractal.drawImage(data);
	  return fractal.continueAnimation;
	};

*/

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
        }
        else {
            var funcArgs = {};
        }
    }
    else {
        var passArgsP = false;
        var funcArgs = {};
    }

    var result = funcRef(funcArgs);

    if (rescheduleOnSuccessP && result) {

        setTimeout(scheduleFunction, timeout,
               funcRef, timeout,
               rescheduleOnSuccessP,
               passArgsP, funcArgs);
    }
}
