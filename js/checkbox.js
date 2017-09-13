
var Checkbox = new Object();

Checkbox.getValues = function (checkboxName) {
    var value = [];
    var checkboxSelector = "input[name='" + checkboxName + "']";
    $(checkboxSelector).each(function(i,e) {
        if ($(this).attr('checked') == 'checked') {
            value[value.length] = $(this).val();
        }
    });
    return value;
};


Checkbox.setValues = function (checkboxName,values) {
    var checkboxSelector = "input[name='" + checkboxName + "']";
    var value,valueSelector;
    var valueList = values.split(',');
    
    $(checkboxSelector).each(function(i,e) {
        $(this).removeAttr('checked');
    });
     
    for (var i = 0;i<valueList.length;i++) {
        value = valueList[i];
        valueSelector = "input[name='" + checkboxName + "'][value='" + value + "']";
        $(valueSelector)
            .attr('checked','checked');
    }
};

Checkbox.disable = function (checkboxName,values) {
    var checkboxSelector = "input[name='" + checkboxName + "']";
    var value,valueSelector;
    var valueList = values.split(',');
  
    for (var i = 0;i<valueList.length;i++) {
        value = valueList[i];
        valueSelector = "input[name='" + checkboxName + "'][value='" + value + "']";
        $(valueSelector)
            .attr('disabled','disabled');
        $('#' + checkboxName)
            .attr('class','disabled');
    }
};

Checkbox.enable = function (checkboxName,values) {
    var checkboxSelector = "input[name='" + checkboxName + "']";
    var value,valueSelector;
    var valueList = values.split(',');
  
    for (var i = 0;i<valueList.length;i++) {
        value = valueList[i];
        valueSelector = "input[name='" + checkboxName + "'][value='" + value + "']";
        $(valueSelector)
            .removeAttr('disabled');
        $('#' + checkboxName)
            .removeAttr('class');
    }
};