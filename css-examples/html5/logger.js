// JavaScript Document

Logger = "logger";
LogHistory = new Array(1);
LogIndex = 0;
// Number of log messages to display
DisplayLog = 200;

function Log(level, msg) {
	var now = new Date();
	var month = now.getMonth();
	var day = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	var milliseconds = now.getMilliseconds();
	
	if ( month.toString().length < 2) {
		month = "0" + month;
	}
	if (day.toString().length < 2) {
		day = "0" + day;
	}
	if (hour.toString().length < 2) {
		hour = "0" + hour;
	}
	if (minute.toString().length < 2) {
		minute = "0" + minute;
	}
	if (second.toString().length < 2) {
		second = "0" + second;
	}
	while (milliseconds.toString().length < 3) {
		milliseconds = "0" + milliseconds;
	}
	
	var dateString = "[" + now.getFullYear() + "-" + month + "-" + day + "T" +  hour + ":" + minute + ":"  + second + "." + milliseconds + "] ";
	
	LogHistory[LogIndex] = [dateString, level, msg];
	LogIndex++;
	var logText = "";
	
	for (var i = (((LogIndex-DisplayLog) < 0) ? 0 : (LogIndex - DisplayLog)); i < LogIndex; i++) {
		logText += "\n" + LogHistory[i][0] + LogHistory[i][1] + ' "' + LogHistory[i][2] + '"';
	}
	document.getElementById(Logger).innerHTML = logText;
}

//Log("STARTING","Starting Logging History");