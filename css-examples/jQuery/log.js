// Logging Object

var Log = {
	Logger: "log2",
	logText: "",
	LogIndex: 0,
	DisplayLog: 20,
	LogHistory: [],
	
	logMsg: function () {
		document.getElementById(this.Logger).innerHTML = this.logText;
	},
	
	msg: function msg(level, msg) {
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
	
		this.LogHistory[this.LogIndex] = [dateString, level, msg];
		this.LogIndex++;
		//var logText = "";
		this.logText = "";
		for (var i = (((this.LogIndex-this.DisplayLog) < 0) ? 0 : (this.LogIndex - this.DisplayLog)); i < this.LogIndex; i++) {
			this.logText += "\n" + this.LogHistory[i][0] + this.LogHistory[i][1] + ': "' + this.LogHistory[i][2] + '"';
		}
		//document.getElementById(Logger).innerHTML = logText;
		setInterval('Log.logMsg()',10);
	},
	Error: function ( message ) {
		this.msg('Error', message);
	},
	Notice: function ( message ) {
		this.msg('Notice', message);
	},
    Warning: function ( message ) {
		this.msg('Warning', message);
	}
};

Log.Logger = 'log2';
  
$(document).ready(function() {
  $('body').append("<pre id='" + Log.Logger + "'>Log\n</pre>");
  log = $('#' + Log.Logger);
  log.css({'position':'absolute','bottom':0,'left':0,'background-color':'silver','border':'1px solid black'})

	  
	  
  Log.Notice('Logging Started, Document Ready!');
});
