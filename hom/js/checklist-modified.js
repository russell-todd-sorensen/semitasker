
var QuestionList = new Array();

var Questions = function (id,name,descr,notes_p,notes_length,type,data,default_value) {
    this.id = id;
    this.name = name;
    this.descr = descr;
    this.notes_p = notes_p;
    this.notes_length = notes_length;
    this.type = type;
    this.data = data;
    this.default_value = default_value;
    return this;
}

var newQuestion = function (id,name,descr,notes_p,notes_length,type,data,default_value) {
    if (arguments.length < 8 ) {
        var default_value = "";
    }
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
    QuestionList[QuestionList.length] = new Questions(id,name,descr,notes_p,notes_length,type,data,default_value);
}

var initForm = function (selector) {
    var handle = $(selector);
    var today = new Date();
    var id,inputType,question,dataList,
        optionHtml,checked,selected,valueAttribute;
 
    for (var i = 0; i<QuestionList.length;i++) {
        question = QuestionList[i];
        inputType = question.type;
        //id = 'f-' + i;
        id = question.id;
        switch (inputType) {          
        case 'hidden':
            Log.Notice('hidden ' + question.name);
            handle.append("<!- hide -->     <input type='hidden'"
                + " name='"
                + id
                + "' id='"
                + id
                + "' maxlength='"
                + question.notes_length
                + "' size='"
                + parseInt(question.notes_length/2)
                + "' value='"
                + escapeQuotes(question.default_value)
                + "'>\n");
            Data.restoreInput(id);
            break;  
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
                + "' value='"
                + escapeQuotes(question.default_value)
                + "' onKeyUp='Data.saveInput(\""
                + id 
                + "\",\"LogInput\");"
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
                + "<textarea data-min-rows='3'"
                + " name='"
                + id
                + "' id='"
                + id
                + "' onKeyUp='Data.saveInput(\""
                + id 
                + "\",\"LogInput\");"
                + "' rows='"
                + dataList[0]
                + "' cols='"
                + dataList[1]
                + "'>"
                + question.default_value
                + "</textarea></li>\n");
            Data.restoreInput(id);
            break;
        case 'radio':           
            Log.Notice('radio ' + question.name);
            dataList = question.data.split(',');
            optionHtml = "";

            for (var j = 0; j<dataList.length;j++) {
                if (dataList[j].trim() == question.default_value) {
                    checked = " checked='checked' ";
                } else {
                    checked = "";
                }
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
                    + "\",\"LogChbox\");"
                    + "' value='"
                    + dataList[j].trim()
                    + "'" 
                    + checked 
                    + "> ");
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
               if (dataList[j].trim() == question.default_value) {
                    checked = " checked='checked' ";
                } else {
                    checked = "";
                }
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
                    + "\",\"LogChbox\");"
                    + "' value='"
                    + dataList[j].trim()
                    + "'"
                    + checked
                    + "> ");
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
                if (dataList[j].trim() == question.default_value) {
                    selected = " selected='selected' ";
                } else {
                    selected = "";
                }
                optionHtml += ("  <option value='"
                    + dataList[j].trim()
                    + "'"
                    + selected
                    + ">"
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
            //Data.restoreInput(id);
            Data.restoreSelect(id);
            break;
        case 'integer':
            Log.Notice('integer ' + question.name);
            dataList = question.data.split(',');
            if (isNaN(parseInt(question.default_value))) {
                valueAttribute = ""
            } else {
                valueAttribute = " value='" 
                + parseInt(question.default_value) 
                + "' "
            }
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
                + "\",\"LogInput\");"
                + "' maxlength='"
                + question.notes_length
                + "' size='"
                + parseInt(question.notes_length)
                + "'"
                + " min='"
                + dataList[0]
                + "' max='"
                + dataList[1]
                + "' step='1'"
                + valueAttribute
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
                + "\",\"LogInput\");"
                + "' value='"
                + question.default_value
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
                Data.saveInput(id,'LogInput');
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
                + "\",\"LogInput\");"
                + "' value='"
                + question.default_value
                + "'></li>\n");
            Data.restoreInput(id);
            if ($('#' + id).val() == '') {
                time = today.toTimeString().substring(0,8);
                $('#' + id).val(time);
                Data.saveInput(id,'LogInput');
            }
            break;
        default:
            break;
    
        }
        
        // Data Save
    }
}


var showAddress = function (id) {
    var selector = '#' + id + " option:selected";
    var house = $(selector).val();
    Log.Notice('house =' + house);
    var address = formattedAddresses[house];
    Log.Notice('address=' + address);
    $('#' + id + "-address").html(address);
    
}

var submitForm = function (id) {
    var selector = '#' + id
    $(selector).attr('action','interview-add.tcl');
    $(selector).submit();
    $(selector).attr('action','return false;');
}

var printConfirmationEmail = function (id) {
    var selector = '#' + id
    $(selector).attr('action','print-confirmation-email.tcl');
    $(selector).submit();
    $(selector).attr('action','return false;');
}

var updateSOTPRequirement = function (id,sotp_id) {
 
    Data.saveSelect(id,"Log.Notice");
    var selector = '#' + id + ' option:selected';
    var level = $(selector).val();
    if (level == "N/A") {
        Data.setCheckbox(sotp_id,"N/A","Log.Notice");
    } else {
        
        var sotp = Data.getCheckboxValues(sotp_id)[0];
        if (sotp == "N/A") { // Clear SOTP 
            Data.setCheckbox(sotp_id,"","Log.Notice");
        }
    }
    Log.Notice('level="' + level + '" sotp_id="' + sotp_id + '"' );
    return false;
}

var updateEstimatedReleaseDate = function (releaseId) {
    
    var est_release_date = $('#est_release_date').val();
    var notifier = Data.getCheckboxValues('notifier')[0];
    var isrb_releasable = Data.getCheckboxValues('isrb_releasable')[0];
    var date_of_interview = $('#date_of_interview').val();
    
    var oneDay = 24*60*60*1000; // milliseconds per day
    var currentDate = new Date(date_of_interview);
    var currentMilliseconds = currentDate.valueOf();
    var daysToAdd = 0;
    
    
    if (isrb_releasable == "Yes") { // ISRB
        daysToAdd = 35+30+15;
    } else if (notifier == "Yes") { // 35 Day Notifier
        daysToAdd = 35+30;
    } else {
        daysToAdd = 30;
    }
    
    var new_release_date_ms = currentMilliseconds + ( daysToAdd * oneDay );
    var new_release_date = new Date(new_release_date_ms);
    
    var year = new_release_date.getUTCFullYear();
    var day = new_release_date.getUTCDate();
    var month = parseInt(new_release_date.getUTCMonth()) + 1;
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    
    var dateString = '' + year + '-' + month + '-' + day;

    $('#est_release_date').val(dateString);
    
    Data.saveCheckbox('notifier','LogChbox');
    Data.saveCheckbox('isrb_releasable','LogChbox');
    Data.saveInput('est_release_date','LogInput');
    Data.saveInput('date_of_interview','LogInput');
};

var convertBirthdateToAge = function (inputId,hiddenTextId) {
    
    var inputSelector = '#' + inputId;
    var age = $(inputSelector).val();
    
    if (age.length != 8) {
        return false;
    }
        
    var month = age.substring(0,2);
    var day = age.substring(2,4);
    var year = age.substring(4,8);
    var dateString = '' + year + '-' + month + '-' + day;
    
    var today = new Date();
    var todayYear  = today.getUTCFullYear();
    var todayDay   = today.getUTCDate();
    var todayMonth = parseInt(today.getUTCMonth()) + 1;
    var baseAge    = parseInt(todayYear) - parseInt(year);
    
    while (1) {
        if (parseInt(todayMonth) > parseInt(month) ) {
            break;
        }
        if (parseInt(todayMonth) < parseInt(month) ) {
            baseAge--;
            break;
        }
        // todayMonth == month
        if ( parseInt(todayDay) >= parseInt(day) ) {
            break;
        }
        baseAge--;
        break;
    }
    
    // baseAge is now correct age
    $(inputSelector).val(baseAge);
    $(inputSelector).attr('placeholder',dateString);
    $(inputSelector).attr('title',dateString);
    
   
    Data.saveInput(inputId,'Log.Notice');
    
    if (arguments.length < 2) {
        var hiddenTextId = null;
    }
    
    if (hiddenTextId) {
        $('#' + hiddenTextId).val(dateString);
        Data.saveInput(hiddenTextId,'LogInput');
    }
    
    return false;
};


var convertBirthdateToAge = function (ageId,birthdateId) {
    
    var birthdaySelector = '#' + birthdateId;
    var ageSelector = '#' + ageId;
    
    var dateString = $(birthdaySelector).val() + ' GMT-0700' ;
    var birthdate = new Date(dateString);
    
    var year = birthdate.getUTCFullYear();
    var day = birthdate.getUTCDate();
    var month = parseInt(birthdate.getUTCMonth()) + 1;
    
    var today = new Date();
    var todayYear  = today.getUTCFullYear();
    var todayDay   = today.getUTCDate();
    var todayMonth = parseInt(today.getUTCMonth()) + 1;
    var baseAge    = parseInt(todayYear) - parseInt(year);
    
    while (1) {
        if (parseInt(todayMonth) > parseInt(month) ) {
            break;
        }
        if (parseInt(todayMonth) < parseInt(month) ) {
            baseAge--;
            break;
        }
        // todayMonth == month
        if ( parseInt(todayDay) >= parseInt(day) ) {
            break;
        }
        baseAge--;
        break;
    }
    
    // baseAge is now correct age
    $(ageSelector).val(baseAge);
    
    Data.saveInput(ageId,'Log.Notice');
    Data.saveInput(birthdateId,'LogInput');
    
    return false;
};


var convertPlaceholderTextToAge = function (inputId,hiddenTextId) {
    var inputSelector = '#' + inputId;
    Log.Notice('convertPlaceholderTextToAge');
    var placeholder = $(inputSelector).attr('placeholder');
    
    if (placeholder && placeholder.length == 10) {
        var year  = placeholder.substring(0,4);
        var month = placeholder.substring(5,7);
        var day   = placeholder.substring(8,10);
        $(inputSelector).val('' + month + day + year);
        
        if (arguments.length <2) {
            var hiddenTextId = null;
        }
        
        convertBirthdateToAge(inputId,hiddenTextId);
    }
    
    return false;
};

