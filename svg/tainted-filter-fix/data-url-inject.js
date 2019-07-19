
var injectDataUrl = function (sourceId, targetId) {

    var xlink = "http://www.w3.org/1999/xlink"
    var data = "data:image/svg+xml;utf8,";
    var svg = document.getElementById(sourceId).innerHTML

    data += urlencodeSVG(svg);

    var feimage = document.getElementById(targetId);
    feimage.setAttributeNS(xlink,"href",data);
}
