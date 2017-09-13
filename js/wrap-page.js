// Create Heading
$(document).ready(function () {

	Log.Notice("Creating wrapper for page content");
  var main = $("#main");
	
	main.wrap("<div class='page'>");
	var pageDiv = $("div.page");
	
	var title = $("title").text();
	pageDiv
		.prepend("<div><ul id='links'></ul></div>")
		.prepend("<h1>" + title + "</h1>");
	
	var pageLinks = $('#links');
	
  var anchorIndex = 1;
	
	function addAnchor() {
		var linkText = $(this).text();
		$(this).prepend("<a name='eg" + anchorIndex + "'></a>");
		pageLinks.append("<li><a href='#eg" + anchorIndex + "'>" + linkText + "</a></li>");
		anchorIndex++;
	}
	
	$('h3').each(addAnchor);
	
});