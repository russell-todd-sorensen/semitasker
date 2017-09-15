// Logging Object

var Log = {
	Logger: "log2",
	LogParent: "log-parent",
	LogCloseTag: "log-close-button",
	logText: "",
	LogIndex: 0,
	DisplayLog: 100,
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
		$('#' + this.LogParent)
			.css("left", "-1200px")
			.css("bottom", "5px");
		$('#' + this.LogCloseTag)
			.css("left", "1200px")
			.html("<span>^</span>")
			.unbind("click")
			.bind({
				"click": function (evt) {
			 		Log.Show();
	  		}
			});
	},
	Remove: function () {
		Log.Notice("Log.Remove() ... removing logger.");
		$('#' + this.LogParent)
			.css("left", "-1200px")
			.css("bottom", "5px");
		$('#' + this.LogCloseTag)
			.css("left", "-1200px") // note minus sign here
			.html("<span>^</span>")
			.unbind("click")
			.bind({
				"click": function (evt) {
			 		Log.Show();
	  		}
			});
	},
	Show: function () {
		$('#' + Log.LogParent)
			.css("bottom", "5px")
			.css("left", "10px");
		$('#' + this.LogCloseTag)
			.css("top", "2px")
			.css("left", "0")
			.html("<span>X</span>")
			.unbind("click")
			.bind({
				"click": function (evt) {
			  	Log.Hide();
	    	}
			});
		Log.Notice("Log.Show() ... showing logger.");
	}
		
};

// Note: this must be log2 to match css in log.css
Log.Logger = 'log2';

function repositionLog (logTag) {
	  logTag.parent().attr("id","log-parent");
}

$(document).ready(function() {
	// does this work here?
  try {
    document.createElement("div").style.setProperty("opacity", 0, "");
  } catch (error) {
     Log.Notice("USE IE9.0 MODE!!!!" + "\n" + "Push the F12 key, then Alt+9" );
	   alert("USE IE9.0 MODE!!!!" + "\n" + "Push the F12 key, then Alt+9");
  }

  var x = $('footer');
  var logDiv = 'footer';
  if (x[0] == undefined) {
  	  logDiv = 'body';
  } 
  $(logDiv)
	.append("<div><pre id='" 
			+ Log.Logger 
			+ "'>Log\n\n</pre><div id='log-close-button'><span>X</span></div></div>");

  log = $('#' + Log.Logger);

  Log.Show();
  repositionLog(log);
	
  Log.Notice('Logging Started, Document Ready!');

});
