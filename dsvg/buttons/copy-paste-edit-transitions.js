var textCopied = ""
var copyBuffer = [];
var copyBufferIndex = 0;
var buttonState = {
    sourceId: 'source',
    selectId: 'selection',
    completeState: 0,
    bufferAvailable: false,
    bufferTextLength: 0,
    textIsSelected: false,
    someTextInSource: false,
    buttonStateValues: {
        'copy':false,
        'cut':false,
        'paste':false,
        'replace':false,
        'swap':false,
    }
}


// to avoid having state determined all over the place,
// run this function whenever any part changes.
// this will ultimately control the button state


var updateState = function () {
    let newState = 0;

    buttonState.bufferAvailable =
        (copyBuffer.length > 0) ? true : false;
    buttonState.bufferTextLength =
        (buttonState.bufferAvailable) ? copyBuffer[copyBufferIndex].length : 0

    let sel = getSelection(buttonState.sourceId,true);

    buttonState.someTextInSource = (sel.length > 0) ? true : false;

    if (buttonState.someTextInSource) {
        let sel2 = getSelection(buttonState.sourceId,false);
        buttonState.textIsSelected = (sel2.length > 0) ? true : false;
    }

    let copy    = false;
    let cut     = false;
    let paste   = false;
    let replace = false;
    let swap    = false;

    if (buttonState.bufferTextLength > 0) {
        paste   = true;
    }

    if (buttonState.textIsSelected) {
        copy = true;
        cut  = true;
        if (paste) { 
            replace = true;
            swap    = true;
            paste   = false;
        }
    }

    buttonState.buttonStateValues = {
        'copy':copy,
        'cut':cut,
        'paste':paste,
        'replace':replace,
        'swap':swap,
    }

    return manageButtonState(buttonState.buttonStateValues)
}

var manageButtonState = function (bsv) {
    let buttons = ['copy','cut','paste','replace','swap'];
    for (let i=0;i<buttons.length;i++) {
        let button = document.getElementById(buttons[i])
        if (bsv[buttons[i]]) {
            button.className = 'enabled';
        } else {
            button.className = 'disabled';
        }
    }
    return bsv
}

var getSelection = function(formElementId,returnAll) {
    let txt = document.getElementById(formElementId);
    if (returnAll) {
        return txt.textContent;
    } else {
        let start = txt.selectionStart;
        let end = txt.selectionEnd;
        return txt.textContent.substr(start,end-start);
    }
}

var copySelection = function() {
    let id = buttonState.sourceId;
    let selectionId = buttonState.selectId;
    textCopied = getSelection(id,false);
    document.getElementById(selectionId).textContent = textCopied;
    copyBuffer.unshift(textCopied);
    renderBuffers();
    updateContent(selectionId);
    return textCopied;
}

var copyCutSelection = function() {
    let id = buttonState.sourceId;
    let selectionId = buttonState.selectId;
    textCopied = getSelection(id,false);
    document.getElementById(selectionId).textContent = textCopied;
    copyBuffer.unshift(textCopied);
    renderBuffers();
    cutSelection();
    updateContent(selectionId);
    return textCopied;
}

var cutSelection = function() {
    let id = buttonState.sourceId;
    let selectionId = buttonState.selectId;
    let txt = document.getElementById(id);
    var start = txt.selectionStart;
    let end = txt.selectionEnd;

    textCopied = txt.textContent.substr(start,end-start);
    document.getElementById(selectionId).textContent = textCopied;
    txt.setRangeText("");
    txt.textContent = txt.value;
    console.log('text=' + txt.textContent);
    updateContent(selectionId);
}

var copySelection2 = function(evt) {

    let selectionObject = document.getSelection();
    let selectionId = buttonState.selectId;
    let sel = document.getElementById(selectionId)
    sel.textContent = selectionObject;

    updateContent(selectionId);
    return sel.textContent;
}

var renderBuffers = function(newCopyBufferIndex) {
    let buffContainer = document.getElementById("copy-buffers");
    buffContainer.innerHTML = "";
    let currentBufferHTML = "";
    let newHtml = "";
    let addClass = "";
    if (newCopyBufferIndex == undefined) {

    } else if (newCopyBufferIndex == null || newCopyBufferIndex < 0) {
        copyBufferIndex = 0;
    } else {
        copyBufferIndex = newCopyBufferIndex
    }
    if (copyBufferIndex > copyBuffer.length-1) {
        copyBufferIndex = 0;
    }
    let buffHTML = "";
    let re = /[\n\s\t]/g;
    for (let i = 0;i<copyBuffer.length;i++) {
        if (i == copyBufferIndex) {
            addClass = " current-buffer"
        } else {
            addClass = ""
        }
        buffHTML = "<div class='copy-buffer" 
        + addClass 
        + "' id='b-" 
        + i + "' onClick='renderBuffers(" 
        + i + ")' >" 
        + copyBuffer[i].replace(re,"_") + " <span onClick='removeBuffer(" 
        + i + ")'>&#xFBE;</span></div>\n";
        newHtml += buffHTML;
        if (i == copyBufferIndex) {
            // empty?
        }
    }
    buffContainer.innerHTML = newHtml;

    updateClipboard();
    updateState();
}

var removeBuffer = function(index) {
    if (copyBufferIndex >= index ) {
        copyBufferIndex-- ; // this might go to -1, which will be fixed in renderBuffers
    }
    tmpBuff = new Array();
    for (let i = 0;i<copyBuffer.length;i++) {
        if (i != index) {
            tmpBuff.push(copyBuffer[i])
        }
    }
    copyBuffer = tmpBuff;
    renderBuffers(copyBufferIndex);
}

var pasteBuffer = function() {
    if (copyBufferIndex == null || copyBufferIndex > copyBuffer.length-1) {
        copyBufferIndex = 0;
    }
    if (copyBufferIndex >= copyBuffer.length) {
        return
    }
    let id = buttonState.sourceId;
    let selectionId = buttonState.selectId;
    let txt = document.getElementById(id);
    var start = txt.selectionStart;

    txt.selectionEnd = start;
    txt.setRangeText(copyBuffer[copyBufferIndex]);
    txt.textContent = txt.value;
    updateContent(selectionId);
}

var replaceSelectionWithBuffer = function() {
    if (copyBufferIndex == null || copyBufferIndex > copyBuffer.length-1) {
        copyBufferIndex = 0;
    }

    let id = buttonState.sourceId;
    let selectionId = buttonState.selectId;
    let txt = document.getElementById(id);
    var start = txt.selectionStart;
    var end   = txt.selectionEnd;

    txt.setRangeText(copyBuffer[copyBufferIndex]);
    txt.SelectionEnd += copyBuffer[copyBufferIndex].length;
    updateContent(selectionId);
}

var swapSelectionWithBuffer = function() {
    if (copyBufferIndex > copyBuffer.length-1) {
        copyBufferIndex = 0;
    }

    let id = buttonState.sourceId;
    let selectionId = buttonState.selectId;
    let txt = document.getElementById(id);
    var start = txt.selectionStart;
    var end   = txt.selectionEnd;
    var tmpText = txt.textContent.substr(start,end-start)

    txt.setRangeText(copyBuffer[copyBufferIndex]);
    txt.SelectionEnd += copyBuffer[copyBufferIndex].length;
    copyBuffer[copyBufferIndex] = tmpText;
    renderBuffers();
    updateContent(selectionId);
}

var changeSelection = function(evt) {
    var start = source.selectionStart;
    var end   = source.selectionEnd;
    console.log("start=" + start + " end=" + end);
}

var updateContent = function(id) {
    let txt,val;
    id = id ? id : event.target.id
    txt = document.getElementById(id);

    if (id == buttonState.selectId) {
        val = getSelection(buttonState.sourceId,false)
    } else {
        val = txt.value
    }
    txt.textContent = val;
    updateState();
}

var previewCut = function(srcId,destId) {

}

// writes currently selected buffer to clipboard
var updateClipboard = function () {
    navigator.clipboard.writeText(copyBuffer[copyBufferIndex]).then(function() {
        if (copyBuffer.length > 0) {
            bufferHTML = document.querySelector("#copy-buffers #b-" + copyBufferIndex).outerHTML;
        } else {
            bufferHTML = ""
        }
        document.getElementById('scroll-buffer').innerHTML = bufferHTML;
        console.log("System Clipboard updated")
      }, function() {
        console.error("Unable to update System Clipboard")
      });
}

// reads current clipboard into new buffer
var readFromClipboard = function (focusId) {
    navigator.clipboard.readText().then(
        clipText => {
            document.getElementById(focusId).focus();
            if (clipText == "") {
                return
            }
            for (let i = 0;i<copyBuffer.length;i++) {
                if (clipText == copyBuffer[i]) {
                    return
                }
            }
            copyBuffer.unshift(clipText);
            scrollRef1 = document.getElementById(scrollValues[0].wheelId);
            scrollRef1.onmousewheel = handleScrollBuffers;
            renderBuffers(0);
        });
}

// returns promise
var notifyClipboardStatus = function () {

}

document.onselectionchange = copySelection2;
