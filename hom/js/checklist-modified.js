
var QuestionList = new Array();

var Questions = function (id,name,descr,notes_p,notes_length,type,data) {
    this.id = id;
    this.name = name;
    this.descr = descr;
    this.notes_p = notes_p;
    this.notes_length = notes_length;
    this.type = type;
    this.data = data;
    return this;
}

var newQuestion = function (id,name,descr,notes_p,notes_length,type,data) {
    if (arguments.length < 7 ) {
        var data = null;
    }
    if (arguments.length < 6 ) {
        var type = 'text';
    }
    if (arguments.length < 5 ) {
        var notes_length = 0;
    }
    if (arguments.length < 4 ) {
        var notes_p = false;
    }
    QuestionList[QuestionList.length] = new Questions(id,name,descr,notes_p,notes_length,type,data);
}

var initForm = function (selector) {
    var handle = $(selector);
    var today = new Date();
    var id,inputType,question,dataList,optionHtml;
 
    for (var i = 0; i<QuestionList.length;i++) {
        question = QuestionList[i];
        inputType = question.type;
        //id = 'f-' + i;
        id = question.id;
        switch (inputType) {
        case 'text':
            Log.Notice('text ' + question.name);
            handle.append("<li><label for='" 
                + id
                + "' title='"
                + question.descr
                + "'>"
                + question.name
                + "</label><input type='text'"
                + " name='"
                + id
                + "' id='"
                + id
                + "' maxlength='"
                + question.notes_length
                + "' size='"
                + parseInt(question.notes_length/2)
                + "' onKeyUp='Data.saveInput(\""
                + id 
                + "\",\"Log.Notice\");"
                + "'></li>\n");
            Data.restoreInput(id);
            break;
        case 'button':
            Log.Notice('button ' + question.name);
            dataList = question.data.split(',');
            handle.append("<li><label for='" 
                + id
                + "' title='"
                + question.descr
                + "'>"
                + question.name
                + "</label><input type='button'"
                + " name='"
                + id
                + "' id='"
                + id
                + "' onClick='"
                + dataList[0]
                + "' value='"
                + question.name
                + "' size='"
                + parseInt(question.notes_length)
                + "'></li>\n");
            break;
        case 'textarea':
            Log.Notice('textarea ' + question.name);
            dataList = question.data.split(',');
            handle.append("<li><label for='" 
                + id
                + "' title='"
                + question.descr
                + "'>"
                + question.name
                + "</label>"
                + "<textarea "
                + " name='"
                + id
                + "' id='"
                + id
                + "' onKeyUp='Data.saveInput(\""
                + id 
                + "\",\"Log.Notice\");"
                + "' rows='"
                + dataList[0]
                + "' cols='"
                + dataList[1]
                + "'></textarea></li>\n");
            Data.restoreInput(id);
            break;
        case 'radio':           
            Log.Notice('radio ' + question.name);
            dataList = question.data.split(',');
            optionHtml = "";
            for (var j = 0; j<dataList.length;j++) {
                optionHtml += ("<span class='radio-option'>"
                    + dataList[j].trim()
                    + "</span>"
                    + " <input type='radio'"
                    + " name='"
                    + id
                    + "' id='"
                    + id
                    + "' onChange='Data.saveCheckbox(\""
                    + id 
                    + "\",\"Log.Notice\");"
                    + "' value='"
                    + dataList[j].trim()
                    + "'> ");
            }
 
            handle.append("<li><label for='" 
                + id
                + "' title='"
                + question.descr
                + "'>"
                + question.name
                + "</label>"
                + "<span class='radio-container'>"
                + optionHtml
                + "</span>"
                +"</li>\n");
            Data.restoreCheckbox(id);
            break;
        case 'checkbox':           
            Log.Notice('checkbox ' + question.name);
            dataList = question.data.split(',');
            optionHtml = "";
            for (var j = 0; j<dataList.length;j++) {
                optionHtml += ("<span class='radio-option'>"
                    + dataList[j].trim()
                    + "</span>"
                    + " <input type='checkbox'"
                    + " name='"
                    + id
                    + "' id='"
                    + id
                    + "' onChange='Data.saveCheckbox(\""
                    + id 
                    + "\",\"Log.Notice\");"
                    + "' value='"
                    + dataList[j].trim()
                    + "'> ");
            }
 
            handle.append("<li><label for='" 
                + id
                + "' title='"
                + question.descr
                + "'>"
                + question.name
                + "</label>"
                + "<span class='radio-container'>"
                + optionHtml
                + "</span>"
                +"</li>\n");
            Data.restoreCheckbox(id);
            break;
        case 'select':           
            Log.Notice('radio ' + question.name);
            dataList = question.data.split(',');
            optionHtml = "<select"
                    + " name='"
                    + id
                    + "' id='"
                    + id
                    + "' onChange='Data.saveSelect(\""
                    + id 
                    + "\",\"Log.Notice\");"
                    + "'>\n"
            for (var j = 0; j<dataList.length;j++) {
                optionHtml += ("  <option value='"
                    + dataList[j].trim()
                    + "'>"
                    + dataList[j].trim()
                    + "</option>\n");
            }
 
            handle.append("<li><label for='" 
                + id
                + "' title='"
                + question.descr
                + "'>"
                + question.name
                + "</label>"
                + optionHtml
                +"</li>\n");
            Data.restoreInput(id);
            break;
        case 'integer':
            Log.Notice('integer ' + question.name);
            dataList = question.data.split(',');
            handle.append("<li><label for='" 
                + id
                + "' title='"
                + question.descr
                + "'>"
                + question.name
                + "</label>"
                + "<input type='number'"
                + " name='"
                + id
                + "' id='"
                + id
                + "' onChange='Data.saveInput(\""
                + id 
                + "\",\"Log.Notice\");"
                + "' maxlength='"
                + question.notes_length
                + "' size='"
                + parseInt(question.notes_length)
                + "'"
                + "' min='"
                + dataList[0]
                + "' max='"
                + dataList[1]
                + "' step='1'"
                + "></li>\n");
            Data.restoreInput(id);
            break;
        case 'date':
            Log.Notice('text ' + question.name);
            handle.append("<li><label for='" 
                + id
                + "' title='"
                + question.descr
                + "'>"
                + question.name
                + "</label><input type='date'"
                + " name='"
                + id
                + "' id='"
                + id
                + "' maxlength='"
                + question.notes_length
                + "' size='"
                + parseInt(question.notes_length/2)
                + "' onChange='Data.saveInput(\""
                + id 
                + "\",\"Log.Notice\");"
                + "'></li>\n");
            Data.restoreInput(id);
            if ($('#' + id).val() == '') {
                var year = today.getUTCFullYear();
                var day = today.getUTCDate();
                var month = parseInt(today.getUTCMonth()) + 1;
                if (month < 10) {
                    month = '0' + month;
                }
                var dateString = '' + year + '-' + month + '-' + day;
                
                $('#' + id).val(dateString);
                Data.saveInput(id,'Log.Notice');
            }
            break;
        case 'time':
            Log.Notice('text ' + question.name);
            handle.append("<li><label for='" 
                + id
                + "' title='"
                + question.descr
                + "'>"
                + question.name
                + "</label><input type='time'"
                + " name='"
                + id
                + "' id='"
                + id
                + "' maxlength='"
                + question.notes_length
                + "' size='"
                + parseInt(question.notes_length/2)
                + "' onChange='Data.saveInput(\""
                + id 
                + "\",\"Log.Notice\");"
                + "'></li>\n");
            Data.restoreInput(id);
            if ($('#' + id).val() == '') {
                time = today.toTimeString().substring(0,8);
                $('#' + id).val(time);
                Data.saveInput(id,'Log.Notice');
            }
            break;
        default:
            break;
    
        }
        
        // Data Save
    }
}
