// Logging Object

var Log = {
	Logger: "log2",
	logText: "",
	LogIndex: 0,
	DisplayLog: 1000,
	LogHistory: [],

	logMsg: function () {
		document.getElementById(this.Logger).innerHTML = this.logText;
	},

	msg: function msg(level, msg) {
		var now = new Date();
		var month = now.getMonth()+1;
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

		setTimeout('Log.logMsg()',10);
	},

	Error: function ( message ) {
		this.msg('Error', message);
	},

	Notice: function ( message ) {
		this.msg('Notice', message);
	},

  Warning: function ( message ) {
		this.msg('Warning', message);
	},

	Debug: function ( message ) {
		this.msg('Debug', message);
	},

	Hide: function () {
		Log.Notice("Log.Hide() ... hiding logger.");
		$('#' + Log.Logger).css("display", "none");
	},
	Show: function () {
		$('#' + Log.Logger).css("display", "block");
		Log.Notice("Log.Show() ... showing logger.");
	}

};

Log.Logger = 'log2';

function repositionLog (logTag) {
	  logTag.css({'position':'absolute','bottom':5,'left':10,'background-color':'silver','border':'1px solid black','height':'150px','overflow-y':'scroll','width':'1000px','overflow-x':'visible', 'overflow-style':'marquee-block'});

}

$(document).ready(function() {

try {
  document.createElement("div").style.setProperty("opacity", 0, "");
} catch (error) {
   Log.Notice("USE IE9.0 MODE!!!!" + "\n" + "Push the F12 key, then Alt+9" );
	 alert("USE IE9.0 MODE!!!!" + "\n" + "Push the F12 key, then Alt+9");
}

  $('body').append("<pre id='" + Log.Logger + "'>Log\n<div id='logger-close-button'><span>X</span></div>\n</pre>");
  log = $('#' + Log.Logger);
	$('#logger-close-button')
		.click(function (evt) {
			 Log.Hide();
	});
  repositionLog(log);
  Log.Notice('Logging Started, Document Ready!');
});
