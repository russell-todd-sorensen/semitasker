
var addTab = function(id) {

    var txt = document.getElementById(id);
    var end = txt.selectionEnd + 1;
    txt.setRangeText('\t');
    txt.focus();
    txt.selectionStart = end;
}
