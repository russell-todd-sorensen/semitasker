// JavaScript Document

//////############### SCHEDULE FUNCTION ###############///////////////

//////################# EXAMPLE USAGE  ###############////////////////
//
// USE global continueAnimation to control rescheduling of function:
//var continueAnimation = true;
//
//
// START animation using scheduleFunction, passing any args necessary
//function startAnimation(timeout, amount) {
//  continueAnimation = true;
//  if (timeout < 10) timeout = 10;
//  scheduleFunction(doAddToPixels, timeout, true, true, amount);
//}
//
// STOP animation by setting global variable to false
//function stopAnimation() { 
//  continueAnimation = false;
//}
//
// FUNCTION TO SCHEDULE/RESCHEDULE, MUST RETURN global variable value:
//function doAddToPixels(amount) {
//  addToPixels(amount);
//  return continueAnimation;
//}

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
  
	var result = funcRef(funcArgs);
	
	if (rescheduleOnSuccessP && result) {

		setTimeout(scheduleFunction, timeout, 
		           funcRef, timeout, 
							 rescheduleOnSuccessP, 
							 passArgsP, funcArgs);
	}
}