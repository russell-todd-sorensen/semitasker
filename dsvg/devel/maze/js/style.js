var config = {
    textId: 't2',
    pointsId: 'mPoints2',
    svgId: 'svg2',
    formFontSizeId: 'fontSize',
    formFontFamilyId: 'fontFamily',
    textHref: '#t2',                //the hash is part of the href :(
    defaultFontIndex: 4,            // Arial
    fontSize: 48,
    updateFontSize: false,
    fontFamily: 'Arial',
    updateFontFamily: false,
}

var changeFontSize = function(formId,textId) {
    const property = "font-size"
    const fontSize = parseFloat(document.getElementById(formId).value)
    const newValue = fontSize + "px"

    replaceStyleProperty(SVGDoc,textId,property,newValue);
};

var changeFontFamily = function(selectId,textId) {
    const property = "font-family"
    const sh = document.getElementById(selectId);
    const newValue = sh.options[sh.selectedIndex].value
 
    replaceStyleProperty(SVGDoc,textId,property,newValue);
};

var replaceStyleProperty = function(doc,refId,property,newValue) {
    let ele = doc.getElementById(refId),
        styleCode = ele.getAttributeNS(null,"style"),
        styleStringArray = [],
        styleString = "",
        styleNVArray,
        styleProperty;

    if (styleCode) {

        let styleList = styleCode.split(";")
        for (var i=0;i<styleList.length;i++) {
            styleNVArray = styleList[i].split(":")
            styleProperty = styleNVArray[0].trim().toLowerCase()
            if (styleProperty == property || styleProperty == "") {
                continue
            } else {
                styleStringArray[styleStringArray.length] = 
                    styleProperty + ": " + styleNVArray[1];
            }
        }
    }

    styleStringArray[styleStringArray.length] = property + ":" + newValue;
    styleString = styleStringArray.join(";")
    ele.setAttributeNS(null,"style",styleString);
}
