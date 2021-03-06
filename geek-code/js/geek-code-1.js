// JavaScript Document

var examples = new Array();
var savedExamples = new Array();
var exampleIndex = 0;
var currentExample = exampleIndex;
var MyStorage = new Object();
var subWindow; // used to create saveable document or lesson

// Used to save then restore minimized widgets
var WidgetDimensions = {};

var newXHR3; 
// headers used in creating a new document 
var headers = [
'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" >',
'<link rel="stylesheet" type="text/css" href="/css/log.css" media="all">',
'<link rel="stylesheet" type="text/css" href="/js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.all.css">',
'<script src="/js/jquery-1.7.1.js"></script>',
'<script src="/js/jQuery.UI.Combined.1.8.20.1/Content/Scripts/jquery-ui-1.8.20.js"></script>',
'<script src="/js/d3.v3.js"></script>',
'<script src="/js/log-2.js"></script>',
'<script src="/js/example-library.js"></script>'
];

MyStorage = {
  template: "Example-",
  addExample: function () {
     var length = parseInt(localStorage.getItem('MyStorage'));
     var html =    $('#builder-html').html();
     var css =     $('#builder-css').html();
     var js =      $('#builder-js').html();
     var svg =     $('#builder-svg').html();
     var display = $('#display').html();
    
    localStorage.setItem(this.template + length + ".html", html);
    localStorage.setItem(this.template + length + ".css", css);
    localStorage.setItem(this.template + length + ".js", js);
    localStorage.setItem(this.template + length + ".svg", svg);
    localStorage.setItem(this.template + length + ".display", display);

    Log.Notice('length = ' + length);
    localStorage.setItem('MyStorage', parseInt(length) + 1);
    addSavedCopies();
    return length;
  },
  getExample: function (i) {
    $('#builder-html').html(localStorage.getItem(this.template + i + ".html"));
    $('#builder-css').html(localStorage.getItem(this.template + i + ".css"));
    $('#builder-js').html(localStorage.getItem(this.template + i + ".js"));
    $('#builder-svg').html(localStorage.getItem(this.template + i + ".svg"));
    
    $('#display').html(localStorage.getItem(this.template + i + ".display"));
  },
  saveCurrent: function () {
    var html =    $('#builder-html').html();
    var css =     $('#builder-css').html();
    var js =      $('#builder-js').html();
    var svg =      $('#builder-svg').html();
    var display = $('#display').html();
    
    localStorage.setItem(this.template  + "current.html", html);
    localStorage.setItem(this.template  + "current.css", css);
    localStorage.setItem(this.template  + "current.js", js);
    localStorage.setItem(this.template  + "current.svg", svg);
    localStorage.setItem(this.template  + "current.display", display);

  },
  deleteExample: function (i) {
    if (i === "current") { return i; } // don't delete current
    localStorage.removeItem( this.template + i + ".html");
    localStorage.removeItem( this.template + i + ".css");
    localStorage.removeItem( this.template + i + ".js");
    localStorage.removeItem( this.template + i + ".svg");
    localStorage.removeItem( this.template + i + ".display");
    return i;
  }
}

function writeDocument () {
  subWindow = window.open(
   "",  // url to open
   "example", // window name
   "height=500,width=700,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,chrome=true,titlebar=true", // options
   "true" // replace (removes current document)
   );

  
  var html = "<!DOCTYPE HTML>\n";
  html += "<html>\n<head>\n <title>";
  html += document.title;
  html += "</title>\n";
  
  for (var i = 0; i< headers.length; i++) {
    html += headers[i];
    html += "\n";
  }
  
  html =  html 
    + "<style>\n" 
    + unescapeHTML(removePNodes( $('#builder-css').html())) + "\n</style>\n"; 
  
  var inputJavascript = $('#builder-js').html();
  if (inputJavascript == null) {
    inputJavascript = "";
  }
  
  var inputSVG = $('#builder-svg').html();
  if (inputSVG == null) {
    inputSVG = "";
  } else {
    inputSVG = "<svg\n" 
     + "    xmlns:svg=\"http://www.w3.org/2000/svg\"\n"
    + "    xmlns=\"http://www.w3.org/2000/svg\"\n"
    + "    xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n"
    + "    version=\"1.0\"\n"
    + "    x=\"0\"\n"
    + "    y=\"0\"\n"
    + "    width=\"1000\"\n"
    + "    height=\"1200\"\n"
    + "    viewBox=\"0 0 1000 1200\">\n"
    + unescapeHTML(removePNodes( inputSVG ))
    + "\n</svg>";
  }
  
  html = html 
    + "\n</head>\n<body>\n"
    + unescapeHTML(removePNodes( $('#builder-html').html()))
    + "\n"
    + inputSVG
    + "\n<!-- here comes the script    -->\n<"   // note script tag must be broke up
    + "script" + ">\n"                            // because javascript parser is weak
    + unescapeHTML(removePNodes(inputJavascript)) 
     + "\n\n<" 
    + "/" 
    + "script" 
    + ">\n";
    + "\n</body>\n</html>";
  
  Log.Notice("html is written");
  subWindow.document.write(html);
}

function writeLesson () {
  subWindow = window.open(
   "",  // url to open
   "example", // window name
   "height=500,width=700,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,chrome=true,titlebar=true", // options
   "true" // replace (removes current document)
   );
  
  var html = "<!DOCTYPE HTML>\n";
  html += "<html>\n<head>\n <title>";
  // get lesson title
  html += document.title;
  html += "</title>\n";

  html += "</head>\n<body>\n";

  html += "<examples>\n"

  rebuildSavedExamples();
  var tags, css, name, exampleCss, exampleHtml;
  
  for (var i = 0; i< savedExamples.length; i++) {
  
    name = savedExamples[i].name;
    exampleCss = localStorage.getItem("Example-" + name + ".css");
    exampleHtml = localStorage.getItem("Example-" + name + ".html");
    exampleJs = localStorage.getItem("Example-" + name + ".js");
    exampleSVG = localStorage.getItem("Example-" + name + ".svg");
    
    html = html + "<example id='Example-" + name + "'>\n";
    html += " <tags>\n";
    html += removePNodes(exampleHtml);
    html += "\n </tags>\n <css>\n";
    html += removePNodes(exampleCss);
    html += "\n </css>\n <js>\n";
    html += removePNodes(exampleJs);
    html += "\n </js>\n";
    html += " <graphics>\n";
    html += removePNodes(exampleSVG);
    
    html += "\n </graphics>\n <comment></comment>\n</example>\n";
  }
  
  html += "\n</examples>\n</body>\n</html>";
  
  subWindow.document.write(html);
  Log.Notice("html is written");
}


// open and closeWidget call minimizeWidget 
function closeWidget(evt) {
  var wid = evt.data.id;
  var height = evt.data.height;
  var width = evt.data.width;
  minimizeWidget(wid,height,width);
  $(this)
    .html("Open<span class='wingding'>1</span>")
    .unbind("click")
    .bind("click", {id: wid}, openWidget);
}

function openWidget(evt) {
  var wid = evt.data.id;
  restoreWidget(wid);
  $(this)
    .html("<span class='wingding'>0</span>Close")
    .unbind("click")
    .bind("click", {id: wid}, closeWidget);
}



function getXML(evt) {
  
  if (newXHR3.readyState < 4) {
    return;
  }

  var me, cssNode, tagsNode, scriptNode, svgNode, commentNode;
  var id = "", css = "", tags = "", script = "", svg = "", comment = "";
  var svgAttributes = {}; // store all attributes of passed in graphics node
  
  $('#examples-from-external').html(newXHR3.responseText);
  
  // fix-up responseText 
  examplesHTML = $('#examples-from-external examples').html();
  
  $('#examples-from-external').html(examplesHTML);
  
  exampleNodes = d3.selectAll('#examples-from-external example')
   .each(function(d,i) {
    me = d3.select(this);
    id = me.attr("id");
    id = id.trim();
    
    cssNode = me.select('css'); 
    
    if (cssNode[0][0] != null) {
      css = cssNode.html(); // was html()
      css = css.trim();
    } else {
      css = "";
    }
    
    tagsNode = me.select('tags'); 

    if (tagsNode[0][0] != null) {
      tags = tagsNode.html();
      Log.Notice('tags=<xmp>' + tags + '</xmp>');
      tags = tags.trim();
    } else {
      tags = "";
    }
    
    scriptNode = me.select('js');
    
    if (scriptNode[0][0] != null) {
      script = scriptNode.html();
      script = script.trim();
    } else {
      script = "";
    }
    
    svgNode = me.select('graphics');
    
    if (svgNode[0][0] != null) {
      svg = svgNode.html();
      svg = svg.trim();
      var attributes = svgNode[0][0].attributes;
      for (var i=0; i< attributes.length; i++) {        
        svgAttributes[attributes[i].name] = attributes[i].value;
      }
    } else {
      svg = "";
    }
    
    commentNode = me.select('comment');
  
    if (commentNode[0][0] != null) {
      comment = commentNode.html();
      comment = comment.trim();
    } else {
      comment = "";
    }
    
    
    examples[examples.length] = {
      id: id,
      css: css, 
      html: tags,
      script: script,
      svg: svg,
      svgAttributes: svgAttributes,
      comment: comment
    };
    
  });

  Log.Notice('examples.length=' + examples.length);
  
   
   
  var exampleBar = d3.select('#example-bar');
  
  exampleBar.selectAll("div")
    .data(examples)
    .enter()
    .append("div")
    .attr("id", function(d,i) { return "eg-" + (parseInt(i) + 1);})
    .attr("class", "example-button")
    .text(function(d,i) { return (parseInt(i) + 1) + "";});
    
  exampleBar.selectAll("div")
    .data(examples)
    .on("click", function(d,i) {
      loadExample(i);
    });

  finalizeHtml();    
  loadExample(0);
}

function escapeHTML (html) {
  regUnLT = /</g;
  regUnGT = />/g;
  regUnAmp = /&/g;
  
  if (html == undefined || html == null) {
    html = "";
    return html;
  }
  
  return html
    .replace(regUnAmp, "&amp;")
    .replace(regUnGT, "&gt;")
    .replace(regUnLT, "&lt;")
}

function unescapeHTML(html) {
  
  var regLT = /&lt;/gi;
  var regGT = /&gt;/gi;
  var regNBSP = /&nbsp;/gi;
  var regAmp = /&amp;/gi;
  
  if (html == undefined || html == null) {
    html = "";
    return html;
  }
  
  return html
    .replace(regLT, "<")
    .replace(regGT, ">")
    .replace(regNBSP, " ");
}

function removePNodes(html) {
  var regPNodes = /(<(?:p|\/p|div|\/div|br|span|\/span)(?:\/>|>))+/gi;
  
  return html
    .replace(regPNodes, "\n");
}

function hiliteComments(html) {
  var regexEscapedCommentStart = /(?:&lt;!-)(?:-)+/gi;
  var regexpEscapedCommentEnd = /-(?:-)+&gt;/gi;
  html = html
    .replace(regexEscapedCommentStart, "<span>&lt!--");
  return html
    .replace(regexpEscapedCommentEnd, "--&gt;</span>");
}

function hiliteCssComments(css) {
  var regexEscapedCommentStart = /\/\*/gi;
  var regexpEscapedCommentEnd = /\*\//gi;
  css = css
    .replace(regexEscapedCommentStart, "<span>/*");
  return css
    .replace(regexpEscapedCommentEnd, "*/</span>");
}

function hiliteJavaScriptComments(js) {
  var regexComment = /(\/\/[^\r\n]*)/gi;
  return js
    .replace(regexComment, "<span>$1</span>");
}

function insertHTML(node, html, escapedP) {
  if (!escapedP) {
    html = escapeHTML(html);
  }
  html = hiliteComments(html);
  $(node).html(html);
}

function insertCSS(node, css, escapedP) {
  if (!escapedP) {
      css = escapeHTML(css);
  }
  css = hiliteCssComments(css);
  $(node).html(css);
}

function insertJS(node, js, escapedP) {
  if (!escapedP) {
      js = escapeHTML(js);
  }
  js = hiliteJavaScriptComments(js);
  $(node).html(js);
}

function insertSVG(node, svg, escapedP) {
  if (!escapedP) {
      svg = escapeHTML(svg);
  }
  svg = hiliteComments(svg);
  $(node).html(svg);
}


function loadExamples(inputId, escapedP) {
  
  examples = [];
  var exampleBar = d3.select('#example-bar');
  exampleBar.html("");
  var urlBase = "/geek-code/"
  //var urlBase = "./";
  var exampleFilename = $(inputId).val();
  var url = urlBase + exampleFilename + ".html";
  newXHR3 = new XMLHttpRequest();
  newXHR3.open("GET", url, true);
  newXHR3.onreadystatechange = getXML;
  newXHR3.ondataavailable = null;
  newXHR3.send(null);
}

function loadExample(whichExample) {
  
  if ( whichExample < examples.length && whichExample >= 0 ) {
    exampleIndex = whichExample;
    var example = examples[exampleIndex];
    insertHTML('#input-html', example.html,true);
    insertCSS('#input-css', example.css,true);
    insertJS('#input-js', example.script,true);
    insertSVG('#input-svg', example.svg,true);
    //Log.Notice('input-js=' + example.script);
    $('.example-button').removeClass('selected');
    $('#eg-' + (parseInt(whichExample) + 1)).addClass('selected');
    $('#builder-html').focus();
    currentExample = whichExample;
  }
}

function enablePaste() {
  d3.selectAll("#builder-html, #builder-css, #builder-js, #builder-svg")
   .on("paste", function (d,i) {
     Log.Notice("Pasting Enabled! Welcome Admin!");
  });
}

function disablePaste() {
  d3.selectAll("#builder-html, #builder-css, #builder-js, #builder-svg")
   .on("paste", function (d,i) {
     var evt = d3.event;
     evt.preventDefault();
     Log.Notice("Prevented pasting! Try typing.");
  });
  
}

function disableFeature(id) {
  $('#' + id).hide();
}

function disableStorage() {
  return disableFeature('copy-data');
}

function finalizeHtml() {
  
  $('#builder-html')
    .attr("contentEditable", true)
    .html('');
  $("#builder-css")
    .attr("contentEditable", true)
    .html('');
  $('#builder-js')
    .attr("contentEditable", true)
    .html('');
  $('#builder-svg')
    .attr("contentEditable", true)
    .html('');

  $('#display').html('');
  
  // jQuery doesn't have a preventDefault function, so use D3
  disablePaste();
}

function enableResizableElements() {
    
  $('#input-html-container').resizable({
    alsoResize: '#input-html',
    animate: false,
    animateDuration: "slow",
    animateEasing: "swing",
    aspectRatio: false,
    autoHide: false,
    containment: false,
    ghost: false,
    grid: false,
    handles: "e,s,se",
    helper: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 10,
    minWidth: 40,
    zIndex: 1000
  });
  $('#input-css-container').resizable({
    alsoResize: '#input-css',
    animate: false,
    animateDuration: "slow",
    animateEasing: "swing",
    aspectRatio: false,
    autoHide: false,
    containment: false,
    ghost: false,
    grid: false,
    handles: "e,s,se",
    helper: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 10,
    minWidth: 40,
    zIndex: 1000
  });
  $('#input-js-container').resizable({
    alsoResize: '#input-js',
    animate: false,
    animateDuration: "slow",
    animateEasing: "swing",
    aspectRatio: false,
    autoHide: false,
    containment: false,
    ghost: false,
    grid: false,
    handles: "e,s,se",
    helper: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 10,
    minWidth: 40,
    zIndex: 1000
  });
  
  $('#input-svg-container').resizable({
    alsoResize: '#input-svg',
    animate: false,
    animateDuration: "slow",
    animateEasing: "swing",
    aspectRatio: false,
    autoHide: false,
    containment: false,
    ghost: false,
    grid: false,
    handles: "e,s,se",
    helper: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 10,
    minWidth: 40,
    zIndex: 1000
  });

  $('#builder-html-container').resizable({
    alsoResize: '#builder-html',
    animate: false,
    animateDuration: "slow",
    animateEasing: "swing",
    aspectRatio: false,
    autoHide: false,
    containment: false,
    ghost: false,
    grid: false,
    handles: "e,s,se",
    helper: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 10,
    minWidth: 80,
    zIndex: 1000
  });
  
  $('#builder-css-container').resizable({
    alsoResize: '#builder-css',
    animate: false,
    animateDuration: "slow",
    animateEasing: "swing",
    aspectRatio: false,
    autoHide: false,
    containment: false,
    ghost: false,
    grid: false,
    handles: "e,s,se",
    helper: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 10,
    minWidth: 80,
    zIndex: 1000
  });

  $('#builder-js-container').resizable({
    alsoResize: '#builder-js',
    animate: false,
    animateDuration: "slow",
    animateEasing: "swing",
    aspectRatio: false,
    autoHide: false,
    containment: false,
    ghost: false,
    grid: false,
    handles: "e,s,se",
    helper: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 10,
    minWidth: 40,
    zIndex: 1000
  });

  $('#builder-svg-container').resizable({
    alsoResize: '#builder-svg',
    animate: false,
    animateDuration: "slow",
    animateEasing: "swing",
    aspectRatio: false,
    autoHide: false,
    containment: false,
    ghost: false,
    grid: false,
    handles: "e,s,se",
    helper: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 10,
    minWidth: 40,
    zIndex: 1000
  });

}

var copiesBarInitialized = false;
var copybar;

function rebuildSavedExamples() {
  
  savedExamples = new Array();
  
  for (p in localStorage) {
    var match;
    if ( match = p.match(/^Example-([0-9]+)/i) ) {
      Log.Notice('p matched ' + p + ' match=' + match[1] );
      var found = false;
      for (var i = 0; i< savedExamples.length; i++) {
        if (savedExamples[i] && savedExamples[i].name == match[1]) {
          found = true;
        }
      }
      if (!found) {
        savedExamples[savedExamples.length] = {
          name: match[1]
        };
      }
    } else {
      Log.Notice ('p did not match ' + p);
    }
  }
  
  savedExamples[savedExamples.length] = {
    name: "current"
  };

}

function addSavedCopies() {
  
  d3.selectAll('.saved-copy').remove();
  
  rebuildSavedExamples();

  copybar.selectAll('.saved-copy')
   .data(savedExamples)
   .enter()
   .append('div')
       .attr("id", function (d,i) {
        return "se-" + d.name;
      })
      .attr("class", "saved-copy")
      .attr("title","Double-Click to Delete")
      .text(function(d,i) {
        return d.name;
      });
  
  copybar.selectAll('.saved-copy')
    .data(savedExamples)
    .on('click', function(d,i) {
      MyStorage.getExample(d.name);
      $('.saved-copy').removeClass('selected');
      var id = "#se-" + d.name;
      $(id).addClass('selected')
    })
    .on("dblclick", function(d,i) {
      MyStorage.deleteExample(d.name);
      d3.select(this)
       .remove();
    });
  
}

function buildSavedCopiesBar () {
  
  Log.Notice("starting buildSavedCopiesBar");
  var doc = d3.select(document.body);
  var wholeCopyBar = doc.select('#copy-bar');
  copybar = wholeCopyBar
    .append('div')
      .attr('id','saved-copies');

  addSavedCopies();
  
  if (!copiesBarInitialized) {
    wholeCopyBar.append('div')
      .attr("id","create-document")
      .text("Create Document")
      .on("click", function() {
        writeDocument();
      });
    wholeCopyBar.append("div")
      .attr("id","create-lesson")
      .text("Create Lesson")
      .on("click", function() {
        writeLesson();
      });
  }
  copiesBarInitialized = true;
  Log.Notice("Finished buildSavedCopiesBar");
}

function minimizeWidget(id,minHeight,minWidth) {
  var widget = $("#" + id);
  var parent = widget.parent();
  WidgetDimensions[id] = {
    height: widget.height(),
    width: widget.width(),
    parent: {
      height: parent.height(),
      width: parent.width()
    }
  };
  widget.height(minHeight).width(minWidth);
  parent.height(minHeight).width(minWidth);
}

function restoreWidget(id) {
  var widget = $("#" + id);
  var parent = widget.parent();
  
  widget
    .height(WidgetDimensions[id].height)
    .width(WidgetDimensions[id].width);
  parent
    .height(WidgetDimensions[id].parent.height)
    .width(WidgetDimensions[id].parent.width);
}


function enableOptionById(id, newState) {

  for (var i = 0; i<appOptions.length; i++) {
    var option = appOptions[i];
    if (option.id === id) {
      enableOption(option, newState);
    }
  }
}

function enableOptionGroup(optionGroup, newState) {
  
  for (var i = 0; i< appOptions.length; i++) {
    var option = appOptions[i];
    if (option.group == optionGroup) {
      enableOption(option, newState);
    }
  }
}

function enableOption(option, newState) {  
  if (newState === option.currentState) {return;}
  
  if (newState === "on" || newState === "off") {
    // continue execution
  } else {
    Log.Error('Unknown state ' + newState + " for option '" + option.id + "'" );
    return;
  }
  
  if (typeof option.fn === "function") {
    option.fn(option.data, newState);
  } else {
    if (newState == "on") {
      $(option.id).show();
    } else if (newState == "off") {
      $(option.id).hide();
    } 
  }
  option.currentState = newState;
}

var appOptions = [
  {
    id: '#input-html-container',
    label: 'View HTML',
    group: 'html',
    fn: null,
    data: null,
    defaultState: 'on',
    currentState: 'on'
  },
  {
    id: '#builder-html-container',
    label: 'Edit HTML',
    group: 'html',
    fn: null,
    data: null,
    defaultState: 'on',
    currentState: 'on'
  },
  {
    id: 'html',
    label: 'HTML',
    group: 'main',
    fn: enableOptionGroup,
    data: 'html',
    defaultState: 'on',
    currentState: 'on'
  },
  {
    id: '#input-css-container',
    label: 'View CSS',
    group: 'css',
    fn: null,
    data: null,
    defaultState: 'on',
    currentState: 'on'
  },
  {
    id: '#builder-css-container',
    label: 'Edit CSS',
    group: 'css',
    fn: null,
    data: null,
    defaultState: 'on',
    currentState: 'on'
  },
  {
    id: 'css',
    label: 'CSS',
    group: 'main',
    fn: enableOptionGroup,
    data: 'css',
    defaultState: 'on',
    currentState: 'on'
  },

  {
    id: '#input-js-container',
    label: "View Javascript",
    group: "javascript",
    fn: null,
    data: null,
    defaultState: 'off',
    currentState: 'on'
  },
  {
    id: '#builder-js-container',
    label: "Edit Javascript",
    group: "javascript",
    fn: null,
    data: null,
    defaultState: 'off',
    currentState: 'on'
  },
  {
    id: 'javascript',
    label: "Javascript",
    group: "main",
    fn: enableOptionGroup,
    data: 'javascript',
    defaultState: 'off',
    currentState: 'on'
  },

  {
    id: '#input-svg-container',
    label: "View SVG",
    group: "SVG",
    fn: null,
    data: null,
    defaultState: 'off',
    currentState: 'on'
  },
  {
    id: '#builder-svg-container',
    label: "Edit SVG",
    group: "SVG",
    fn: null,
    data: null,
    defaultState: 'off',
    currentState: 'on'
  },
  {
    id: 'SVG',
    label: "SVG",
    group: "main",
    fn: enableOptionGroup,
    data: 'SVG',
    defaultState: 'off',
    currentState: 'on'
  },
	{
		id: 'TOP',
    label: "Top",
    group: "main",
    fn: enableOptionGroup,
    data: 'TOP',
    defaultState: 'off',
    currentState: 'on'
	},
	{
		id: '#input-container',
		label: 'Hide Top',
		group: 'TOP',
		fn: null,
		data: 'input-container',
		defaultState: 'on',
		currentState: 'on'
	},
	{
	  id: 'BOTTOM',
		label: 'Bottom',
		group: 'main',
		fn: enableOptionGroup,
		data: 'BOTTOM',
		defaultState: 'on',
		currentState: 'on'
	},
	{
		id: '#builder-container',
		label: 'Hide Bottom',
		group: 'BOTTOM',
		fn: null,
		data: 'builder-container',
		defaultState: 'on',
		currentState: 'on'
	}
];

function createOptionCheckboxes () {

  var d3body = d3.select(document.body);
  var formTag = d3body.select('#select-options');
  
  for (var i = 0; i< appOptions.length; i++) {
    var option = appOptions[i];
    if (option.group === 'main') {
      formTag.append('input')
        .attr('type', 'checkbox')
        .attr('name', option.id)
        .attr('id', option.id)
        .attr('value', option.currentState)
        .attr('checked', option.currentState === 'on' ? 'checked' : 'not-checked')
        .attr('onChange', 'toggleOption(' + i + ')');
      formTag.append('label')
        .attr('for', option.id)
        .text(option.label);
    }
  }
  
}

function toggleOption ( optionIndex ) {
  
    
  var option = appOptions[parseInt(optionIndex)];
  var currentState = option.currentState;
  
  var newState;
  if (currentState === 'on') { // toggle off
    newState = 'off';

  } else {
    newState = 'on';
  }    
  Log.Notice('option index=' + optionIndex 
    + ' currentState=' + currentState 
    + ' checked=' 
    + $(this).attr('checked') 
    + ' newState=' + newState);
// CHANGES ///
  //option.fn(option.data, newState);
  //option.currentState = newState;
	if (typeof option.fn === "function") {
		option.fn(option.data, newState);
  	option.currentState = newState;
	} else {
		enableOption(option,newState);
	}
  Log.Notice("after option.fn currentState=" 
    + option.currentState);
}

function toggleOptionGroup(optionGroup) {
  $('#select-options #' + optionGroup).click();
}

// change this to do statistics
function updateDisplay(what) {
  
  var data = "&lt;style&gt;\n"     
    + d3.select('#builder-css').html()      
    + "\n&lt;/style&gt;\n"     
    + d3.select('#builder-html').html()        
    + "&lt;svg\n" 
     + "    xmlns:svg=\"http://www.w3.org/2000/svg\"\n"
    + "    xmlns=\"http://www.w3.org/2000/svg\"\n"
    + "    xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n"
    + "    version=\"1.0\"\n"
    + "    x=\"0\"\n"
    + "    y=\"0\"\n"
    + "    width=\"1000\"\n"
    + "    height=\"1200\"\n"
    + "    viewBox=\"0 0 1000 1200\">\n"
    + d3.select('#builder-svg').html()
    + "&lt;/svg&gt;"
    + "\n&lt;" + "script" + "&gt;\n"  
    + d3.select('#builder-js').html()        
    + "\n&lt;/" + "script" + "&gt;\n";
  
  d3.select('#display')
    .html(unescapeHTML(removePNodes(data)));
    
  MyStorage.saveCurrent();
}

function previewExample() {
  var example = examples[currentExample];
  var data = "&lt;style&gt;\n"     
    + example.css 
    + "\n&lt;/style&gt;\n"     
    + example.html
    + "&lt;svg\n" 
     + "    xmlns:svg=\"http://www.w3.org/2000/svg\"\n"
    + "    xmlns=\"http://www.w3.org/2000/svg\"\n"
    + "    xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n"
    + "    version=\"1.0\"\n"
    + "    x=\"0\"\n"
    + "    y=\"0\"\n"
    + "    width=\"1000\"\n"
    + "    height=\"1200\"\n"
    + "    viewBox=\"0 0 1000 1200\">\n"
    + example.svg
    + "&lt;/svg&gt;" 
    + "\n&lt;" + "script" + "&gt;\n" 
    + example.script
    + "\n&lt;/" + "script" + "&gt;\n";
  
  $('#display').html(unescapeHTML(data));

}


$(document).ready(function() {

  Log.Notice('About to check on localStorage');
  if (localStorage && localStorage.getItem('MyStorage') === null) {
    Log.Notice('localStorage.MyStorage Initializing!');
    localStorage.setItem('MyStorage' , 0);
  } else if (localStorage) {
    Log.Notice('localStorage.MyStorage exists, reusing! MyStorage=' + localStorage.getItem('MyStorage'));
  } else {
    Log.Notice("localStorage isn't available! Expect errors!");
    disableStorage();
  }
  Log.Notice("Ready from learn-html-11.js");
});
