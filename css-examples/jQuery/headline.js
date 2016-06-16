// JavaScript Document
function moveSpotlight (evt) {
	 log.append('moveSpotlight mouseAt=' + evt.pageX + ' ' + evt.pageY + '\n');
     log.append('moveSpotlite: left=' + $('#spotlight').css('left')+ '\n');
	 $('#spotlight')
	 	.css('left', -160);
	 $('#spotlight')
		.animate({left:800},8000);
	 log.append('moveSpotlite finished registering animation\n');
}
 
function wrapTitle ( selector, preText ) {
	var titleNode = $(selector);
	var titleText = titleNode.text();
	titleNode.wrap('<div class="content2 titleWrap1" id="tw1">')
	titleNode.remove();
	$('#tw1')
	   .html('<span class="title" id="title">' + titleText + '</span><div id="spotlight"></div>')
	   .wrap('<div class="content-bgr" id="tw2">');
	$('#tw2')
	   .wrap('<div class="bg-row" id="tw3">');
	$('#tw3')
	   .wrap('<div id="tw4">');
	
	titleNode = $('span#title');
	
	$('#tw3')
	   .prepend('<div class="vertical-band-rel" id="tp1"><div class="vb-image" id="vbi1"></div></div>')
	   .prepend('<div class="content-bgr" id="tp2"><div class="content2 pretext1" id="pt1"><span>' + preText + '</span><div class="side-bar" id="sb3"></div><div class="side-bar" id="sb4"></div></div></div>');
	$('#tw3').append('<div class="vertical-band-rel" id="ta1"><div class="vb-image" id="vbi2"></div></div>');
 
	$('#tw1').bind('click','',moveSpotlight);
}
 
$(document).ready(function() { 
	$('#container4').bind('click','',moveSpotlight);
	wrapTitle('h1#title', 'jQuery:');
});