var scrollValues = new Array();
var scrollRef;

scrollValues[0] = {
    value:25,
    id:'scroll-text',
    wheelId:'scroller-1'
};
scrollValues[1] = {
    value:13,
    id:'scroll-font',
    wheelId:'scroller-2',
};

// NOTE: this is used to trigger one scroll tic per invocation:
var triggerScroll = function(fn,direction,ctrlKey,data) {
    let myEvent = {
        cancelBubble: true,
        preventDefault: true,
        wheelDelta: (direction>0?1:-1),
        ctrlKey: ctrlKey?true:false
    }
    fn(myEvent);
    if (data && data.continueAnimation) {
        return {continueAnimation:true}
    } else {
        return false;
    }
}

var handleScroll = function (evt) {
    evt.cancelBubble = true;
    evt.preventDefault = true;
    let wheelDelta = evt.wheelDelta,
        delta = 10,
        valueRef = document.getElementById('scroll-value'),
        value = (parseFloat(valueRef.innerHTML)*10);

    if (evt.ctrlKey) {
        delta = 1
    }
    if (wheelDelta < 0) {
        value -= delta
    } else {
        value += delta
    }
    valueRef.innerHTML = value/10;
    replaceStyleProperty(SVGDoc,textId,'font-size',value/10 + "px");
    return false;
}
