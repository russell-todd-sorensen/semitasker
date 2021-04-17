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

var handleFontScroll = function (evt) {
    evt.cancelBubble = true;
    evt.preventDefault = true;
    let wheelDelta = evt.wheelDelta,
        indexRef = document.getElementById('font-index'),
        index = parseInt(indexRef.innerHTML),
        len = intToFontArray.length,
        fontRef = document.getElementById('font-value');

    while (index < 0) {
        index += len
    }
    if (wheelDelta < 0) {
        index = (index - 1) % len
    } else {
        index = (index + 1) % len
    }
    while (index < 0) {
        index += len; 
    }

    let fontText = intToFontArray[index],
        trimmed  = fontText.slice(1,fontText.length-1);

    indexRef.innerHTML = index;
    fontRef.innerHTML  = trimmed;
    fontRef.style = "font-family: " + fontText + ";"
    fontRef.title = trimmed;
    replaceStyleProperty(SVGDoc,textId,"font-family", fontText);

    return false;
}

var SVGDoc,
    textId;

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
    textId = config.textId;
    replaceStyleProperty(SVGDoc,textId,"font-family",config.fontFamily);
}

var schedFunc = function(funcRef,timeout,rescheduleOnSuccessP,passArgsP,args) {
    let time = (timeout?parseInt(timeout):10),
        rosp = rescheduleOnSuccessP?true:false,
        pargs = passArgsP?true:false,
        funcArgs = pargs?args:{},
        result = funcRef(funcArgs),
        continueAnimation = result==true?true:result.continueAnimation==true?true:false;

    time = result.timeout?parseInt(result.timeout):time;

    if (rosp && continueAnimation) {
        setTimeout(
            schedFunc,
            time,
            funcRef, 
            time, 
            rosp,
            pargs, 
            funcArgs);
    }
}

class Animation {
    steps = [];
    index = 0;
    timeout = 0; // in milliseconds, zero = immediately
    timeoutID = null;
    fn = null;
    continueAnimation = true;
    rescheduleOnSuccessP = true;
    passArgsP = true;
    data = null;

    constructor (fn,steps,timeout,data) {
        this.fn = fn?fn:this.iterateSteps;
        this.steps = steps?steps:[];
        this.timeout = timeout?timeout:10;//milliseconds
        this.data = data?data:this;
    }
    doStep(anim) {
        let len = anim.steps.length,
            result = {continueAnimation:false},
            step = null;
        tests:
        {
            if (anim.index >= len || anim.index < 0) {
                break tests;
            }

            step = anim.steps[anim.index]
            result = step[0](...step.slice(1),anim);

            if (result.continueAnimation==false
                || anim.continueAnimation==false)
            {
                break tests;
            }
            anim.index++;

            if (anim.index >= len) {
                break tests;
            }
            result = {continueAnimation:true};
        }
        return result;
    }
    stopAnimation(anim) {
        anim.continueAnimation = false;
        return anim;
    }
    schedFunc(funcRef,anim) {
        let result = funcRef(anim),
            continueAnimation = (result==true?true:result.continueAnimation==true?true:false),
            time = result.timeout?parseInt(result.timeout):anim.timeout;

        if (continueAnimation) {
            setTimeout(
                anim.schedFunc,
                time,
                funcRef,
                anim
            );
        }
    }
    setAnimationIndex(anim,index) {
        anim.index = index;
    }
    startAnimation(anim) {
        anim.schedFunc(anim.doStep,anim);
    }
}


var doTikTokAnimation = function (idData,data) {
    let currentColor = document.getElementById(idData.bwValueId).value,
        len = idData.animationIds.length,
        delay = idData.delay?idData.delay:"0",
        animationHandles = [];

    for (let i=0;i<len;i++) {
        animationHandles.push(
            document.getElementById(currentColor + idData.animationIds[i])
        );
    }
    for (let j=0;j<len;j++) {
        animationHandles[j].beginElement(delay);
        console.log("Animating " + animationHandles[j].id)
    }
    return true;
}

var clickElement = function (elementId,data) {
    document.getElementById(elementId).click();
    return true;
}

var alterFormInput = function (inputId,updateSpec,data) {
    let inp  = document.getElementById(inputId),
        len  = updateSpec.length,
        val  = "",
        lenv = 0,
        spec = {},
        start = 0,
        end  = 0,
        dir = "forward",
        type = "append";

    for (let i=0,nval="";i<len;i++) {
        val  = inp.value;
        lenv = val.length;
        spec = updateSpec[i];
        start = !(isNaN(spec.end))?parseInt(spec.end):
                (spec.start == "start")?0:
                (spec.start == "end")?lenv:
                parseInt(spec.start);
        end  = !(isNaN(spec.end))?parseInt(spec.end):
                (spec.end == "end")?lenv:
                (spec.end == "start")?0:
                parseInt(spec.end);
        dir  = spec.dir?spec.dir:(start<=end)?"forward":"backward";
        type = spec.type?spec.type:"append";
        nval = spec.val;

        switch (type) {
        case "replaceRange":
            inp.setSelectionRange(start,end,dir);
            inp.setRangeText(nval);
            break;
        case "deleteRange":
            inp.setSelectionRange("",start,end,dir);
            break;
        case "delete":
            inp.setSelectionRange("",0,lenv);
            break;
        case "prepend":
            inp.setSelectionRange(start,start,dir);
            inp.setRangeText(nval);
            break;
        case "append":
        default:
            inp.setSelectionRange(end,end,dir);
            inp.setRangeText(nval);
            break;
        }
        inp.click();
    }
    return true;
}

var updateSpecArray = [
    {type:"replaceRange",start:2,end:4,val:"YOU"}
]

// these are defined at global scope merely as a convenience;
var animationSteps = [
    [alterFormInput,"text-input",updateSpecArray],
    [triggerScroll,handleFontScroll,1,false],
    [triggerScroll,handleFontScroll,1,false],
    [triggerScroll,handleScroll,1,false],
    [triggerScroll,handleScroll,1,false],
    [triggerScroll,handleScroll,1,false],
    [doTikTokAnimation,{
        bwValueId:"white-to-black",
        delay:"1s",
        animationIds:[
            "-filter-red-offset-dx",
            "-filter-red-offset-dy",
            "-filter-anti-red-offset-dx",
            "-filter-anti-red-offset-dy",
        ],
    }],
    [triggerScroll,handleFontScroll,1,false],
    [triggerScroll,handleFontScroll,1,false],
    [triggerScroll,handleScroll,1,false],
    [triggerScroll,handleScroll,1,false],
    [triggerScroll,handleScroll,1,false],
    [triggerScroll,handleScroll,1,true],
    [triggerScroll,handleScroll,1,true],
    [triggerScroll,handleScroll,1,true],
    [clickElement,"white-to-black"],
    [triggerScroll,handleFontScroll,-1,false],
    [triggerScroll,handleFontScroll,-1,false],
    [triggerScroll,handleScroll,-1,false],
    [triggerScroll,handleScroll,-1,false],
    [triggerScroll,handleScroll,-1,false],
    [doTikTokAnimation,{
        bwValueId:"white-to-black",
        delay:"1s",
        animationIds:[
            "-filter-red-offset-dx",
            "-filter-red-offset-dy",
            "-filter-anti-red-offset-dx",
            "-filter-anti-red-offset-dy",
        ],
    }],
    [triggerScroll,handleFontScroll,-1,false],
    [triggerScroll,handleFontScroll,-1,false],
    [triggerScroll,handleScroll,-1,true],
    [triggerScroll,handleScroll,-1,true],
    [triggerScroll,handleScroll,-1,true],
    [triggerScroll,handleScroll,-1,false],
    [triggerScroll,handleScroll,-1,false],
    [triggerScroll,handleScroll,-1,false],
    [clickElement,"white-to-black"],
]

var myAnimation = new Animation(null,animationSteps, 500);

