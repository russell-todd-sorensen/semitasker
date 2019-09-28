var scrollValues = new Array();
var scrollRef;
scrollValues[0] = {
    value:25,
    id:'scroll-font-size',
    wheelId:'scroller-1'
};
scrollValues[1] = {
    value:13,
    id:'scroll-font-family',
    wheelId:'scroller-2',
};


var handleScroll = function (evt) {
    evt.cancelBubble = true;
    evt.preventDefault = true;
    let wheelDelta = evt.wheelDelta;
    let delta = 10;
    let valueRef = document.getElementById('font-size-value')
    let binaryValueRef = document.getElementById('font-size-value-binary')
    let value = parseFloat(valueRef.innerHTML)*10;
    if (evt.ctrlKey) {
        delta = 1
    }
    if (wheelDelta < 0) {
        value -= delta
    } else {
        value += delta
    }
    valueRef.innerHTML = value/10;
    let binaryFloatValue = floatToBinaryA(value/10)
    binaryValueRef.innerHTML = floatToBinaryA(parseInt(value/10))
    let tid;
    for (let i = 0;i<textId.length;i++) {
        tid = textId[i]
        replaceStyleProperty(SVGDoc,tid,'font-size',value/10 + "px");
    }
    return false;
}

var handleFontScroll = function (evt) {
    evt.cancelBubble = true;
    evt.preventDefault = true;
    let wheelDelta = evt.wheelDelta;
    let indexRef = document.getElementById("font-index")
    let binaryIndexRef = document.getElementById("font-index-binary");
    let index = parseInt(indexRef.innerHTML);
    let len = intToFontArray.length
    while (index < 0) {
        index += len
    }
    let fontRef = document.getElementById("font-family-value");
    if (wheelDelta < 0) {
        index = (index - 1) % len
    } else {
        index = (index + 1) % len
    }
    while (index < 0) {
        index += len; 
    }
    let fontText = intToFontArray[index]
    let trimmed  = fontText.slice(1,fontText.length-1)
    let binaryIndexValue = floatToBinaryA(index);
    if (binaryIndexValue.length == 0) {
        binaryIndexValue = "a" // This is zero!
    }
    indexRef.innerHTML = index;
    binaryIndexRef.innerHTML = binaryIndexValue;
    fontRef.innerHTML  = trimmed;
    fontRef.style = "font-family: " + fontText + ";"
    fontRef.title = trimmed;
    let tid;
    for (let i = 0;i<textId.length;i++) {
        tid = textId[i]
        replaceStyleProperty(SVGDoc,tid,"font-family", fontText);
    }
    return false;
}

var SVGDoc,textId;

var init = function() {
    scrollRef1 = document.getElementById(scrollValues[0]["wheelId"]);
    scrollRef1.onmousewheel = handleScroll;
    scrollRef2 = document.getElementById(scrollValues[0]["id"]);
    scrollRef2.onmousewheel = handleScroll;
    scrollRef3 = document.getElementById(scrollValues[1]["wheelId"])
    scrollRef3.onmousewheel = handleFontScroll
    scrollRef4 = document.getElementById(scrollValues[1]["id"]);
    scrollRef4.onmousewheel = handleFontScroll


    SVGDoc = document.getElementById(config.svgId);
    textId = ["t2","t3"]
}