var setComponentTransfer = function (selector, index, value) {
    var tableValues = "";
    for (var i = 0; i < 2 ; i++) {
        if (i == index) {
            tableValues = tableValues + value + " ";
        } else {
            tableValues += "0.0 ";
        }
    }
    $(selector).attr('tableValues',tableValues.trim())
    //document.getElementById(selector.substr(1)).setAttributeNS('http://www.w3.org/2000/svg','tableValues', tableValues);
};

setComponentTransfer("#dm1FuncR", 1, 0.5);
setComponentTransfer("#dm1FuncG", 1, 0.9);
setComponentTransfer("#dm1FuncB", 1, 0.2);
//setComponentTransfer("#dm1FuncA", 2, 1.0);