// skewX and skewY are for adjusting alignment on page due to printer fuzz
var skewX = 2.0;
var skewY = 0;


// Data for the 8366 Label and alignment of text fields
var labelData = {
    label: {
        x: 51,
        dx: 384,
        y: 48,
        dy: 64
    },
    house: {
        x: 208,
        dx: 400,
        y: 61,
        dy: 64
    },
    pname: {
        x: 55,
        dx: 385,
        y: 90,
        dy: 64
    },
    docid: {
        x: 375,
        dx: 383,
        y: 90,
        dy: 64
    },
    role: {
        x: 208,
        dx: 400,
        y: 108,
        dy: 64
    }
};


// zero indexed row and column helpers:
var getRow = function(index) {
    return Math.floor(index/2);
}
var getCol = function(index) {
    return index % 2;
}

// generic base+step*index+skew calculation
var getItemX = function(item, index) {
    return labelData[item].x + getCol(index) * labelData[item].dx + skewX;
}

var getItemY = function(item, index) {
    return labelData[item].y + getRow(index) * labelData[item].dy + skewY;
}

var deleteLabel = function(index,svgId) {
    var svg = d3.select('#' + svgId);
    var template = '#label-' + index;
    svg.select(template).remove();
    svg.select(template + "-house").remove();
    svg.select(template + "-pname").remove();
    svg.select(template + "-docid").remove();
    svg.select(template + "-role").remove();

    // remove style tag with label css
    var head = d3.select('head');
    head.select(template + "-css").remove();
}

// Generate One Label
var generateLabel = function(index,svgId,data) {

    var svg = d3.select('#' + svgId);
    var rect = svg.append('rect');
    var head = d3.select('head');
    var labelId = 'label-' + index;

    // note Not sure onclick handler is necessary
    rect
        .attr('id',labelId)
        .attr('class','label8366')
        .attr('x',getItemX('label',index))
        .attr('y',getItemY('label',index))
        .on('click', function (d,i) {
            var data = this.id;
            var re = /(label-)([0-9]*)/;
            var match =  data.match(re);
            var labelId = match[0];
            var index = match[2];

            $('#' + formIds.editIndex).val(index);

            setLabelData(index, labelId, formIds.docid);
            setLabelData(index, labelId, formIds.pname);
            setLabelSelectData(index, labelId, formIds.house);
            setLabelSelectData(index, labelId, formIds.role);
            setLabelSelectData(index, labelId, formIds.extra);
    });

    bindLabelClick(index, '#' + labelId);

    if (data.house == null &&
        data.pname == null &&
        data.docid == null &&
        data.role == null &&
        data.extra == null )
    {
        rect.classed('null', true);
        return null;
    } else {
        rect.classed('null', false);
    }

    svg
        .append('text')
        .attr('id','label-' + index + '-house')
        .attr('class','house')
        .attr('x',getItemX('house',index))
        .attr('y',getItemY('house',index))
        .text(data.house);

    svg
        .append('text')
        .attr('id','label-' + index + '-pname')
        .attr('class','pname')
        .attr('x',getItemX('pname',index))
        .attr('y',getItemY('pname',index))
        .text(data.pname);

    svg
        .append('text')
        .attr('id','label-' + index + '-docid')
        .attr('class','docid')
        .attr('x',getItemX('docid',index))
        .attr('y',getItemY('docid',index))
        .text(data.docid);

    svg
        .append('text')
        .attr('id','label-' + index + '-role')
        .attr('class','role')
        .attr('x',getItemX('role',index))
        .attr('y',getItemY('role',index))
        .text(data.role);

    if (data.extra == null) {
        return;
    }

    var styleId = labelId + '-css';

    head
        .append('style')
        .attr('id', styleId)
        .text('\n#' + labelId + ' \{\n' + data.extra + '\n\}\n');
}

// Generate all labels from given starting point
var createLabels = function(startIndex, svgId, labelDataArray) {

    var count = labelDataArray.length;
    for (var i = startIndex, j = 0; i < count+startIndex; i++, j++) {
        generateLabel(i,'svg',labelDataArray[j]);
    }
}

var destroyLabels = function(startIndex,svgId,labelDataArray) {
    var count = labelDataArray.length;
    for (var i = startIndex, j = 0; i < count+startIndex; i++, j++) {
        deleteLabel(i,'svg');
    }
}

var getLabelData = function(labelId, field) {
    var val = $('#' + labelId + "-" + formIds[field]).text();
    $('#' + formIds[field]).val(val);
    Log.Notice(field + '="' + val + '"');
    return val
}

var setLabelData = function(labelIndex, labelId, field) {
    var val = Labels.participants[labelIndex][field]
    $('#' + formIds[field]).val(val);
    Log.Notice(field + '="' + val + '"');
    return val
}

var getLabelSelectData = function(labelId, field) {
    var val = $('#' + labelId + "-" + formIds[field]).text();
    Log.Notice(field + '="' + val + '"');

    var selectedOption = "#" + formIds[field] + " " + "option:selected";
    $(selectedOption).removeAttr('selected');
    var valueOption = "#" + formIds[field] + " " + "option[value='" + val + "']";
    $(valueOption).attr('selected', 'selected');
    return val
}

var setLabelSelectData = function(labelIndex, labelId, field) {
    var val = Labels.participants[labelIndex][field]
    Log.Notice(field + '="' + val + '"');

    var selectedOption = "#" + formIds[field] + " " + "option:selected";
    $(selectedOption).removeAttr('selected');
    var valueOption = "#" + formIds[field] + " " + "option[value='" + val + "']";
    $(valueOption).attr('selected', 'selected');
    return val
}

var setEditLabelIndex = function( evt ) {

    var data = this.id;
    var re = /(label-)([0-9]*)/;
    var match =  data.match(re);
    var labelId = match[0];
    var index = evt.data;

    $('#' + formIds.editIndex).val(match[2]);

    setLabelData(index, labelId, formIds.docid);
    setLabelData(index, labelId, formIds.pname);
    setLabelSelectData(index, labelId, formIds.house);
    setLabelSelectData(index, labelId, formIds.role);
    setLabelSelectData(index, labelId, formIds.extra);
}

var restoreAll = function(inputId) {
    var val = $('#' + inputId).val();
    Labels.participants = JSON.parse(val);
    Log.Notice("restoreAll('" + inputId + "')");
}

var updateLabel = function() {

    var id = parseInt($('#' + formIds.editIndex).val());
    var pname = $('#' + formIds.pname).val();
    var docid = $('#' + formIds.docid).val();
    var house = $('#' + formIds.house + " option:selected").val();
    var role = $('#' + formIds.role + " option:selected").val();
    var extra = $('#' + formIds.extra + " option:selected").val();

    Labels.participants[id] = {
        pname:pname,
        docid:docid,
        house:house,
        role:role,
        extra:extra
    };

    reloadLabels();
}

var reloadLabels = function() {

    saveAll();
    destroyLabels(0,'svg',Labels.participants);
    createLabels(0,'svg',Labels.participants);
};

var clearLabel = function () {
    var id = parseInt($('#' + formIds.editIndex).val());
    Labels.participants[id] = {
        pname:null,
        docid:null,
        house:null,
        role:null,
        extra:null
    };
    reloadLabels();
};

var saveAll = function() {
    var id = formIds.data
    var val = JSON.stringify(Labels.participants);
    $('#' + id).val(val);
    Data.saveInput(id,'restoreAll');
    Log.Notice('saved all');
};

var bindLabelClicks = function (selector) {

    var labels = $(selector);
    var node;
    for (i=0; i< labels.length;i++) {
        node = labels[i].id
        $('#' + node).bind('click',i,setEditLabelIndex);
    }
};

var bindLabelClick = function (index,selector) {
    $(selector).bind('click',index,setEditLabelIndex);
};
