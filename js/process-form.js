/* Example config object 
var initialConf = {
    numHorses:{id:"numHorsesIn",value:0},
    maxHeat:{id:"maxHeatIn",value:0},
    numPlaces:{id:"numPlacesIn",value:0},
    stats:{id:"statsIn",value:{type:"checkbox",value:1,checked:true}},
}
 */
//  The config oubject is used to map form input ids to javascript object
//  attributes.

var processForm = function(conf) {
    let ele;

    conf = conf?conf:initialConf;
    for (let [key,obj] of Object.entries(conf)) {
        ele = document.getElementById(obj.id);
        if (typeof obj.value == "object") {
            let type = obj.value.type;
            switch (type) {
            case "number":
                obj.value.value = ele.value;
                break;
            case "range": 
                obj.value.value = ele.value;
                break;
            case "checkbox":
                obj.value.checked = ele.checked;
                obj.value.value = ele.value;
                break;
            case "radio":
                break;
            case "text":
            case "hidden":
                obj.value.value = ele.value;
                break;
            case "select":
                if (ele.multiple) {
                    let selectedOptions = ele.selectedOptions;
                    obj.value.value = {};
                    obj.value.multiple = true; 
                    for (let i=0,option;i<selectedOptions.length;i++) {
                        option = selectedOptions[i];
                        obj.value.value[option.value] = option.index;
                    }
                    console.log(`obj.value.value=${JSON.stringify(obj.value.value)}`);
                } else {
                    obj.value.value = ele.value;
                }
                break;
            default:
                break;
            }
            conf[key]=obj
        }
        else {
            obj.value = ele.value;
            conf[key] = obj;
        }
    }
    return conf
}

// updateForm runs after meet is finished,
// and syncs form with actual values used in meet
var updateForm = function(conf,m) {
    let ele,
        val;
    for (let [key,obj] of Object.entries(conf)) {

        ele = document.getElementById(obj.id);

        if (typeof obj.value == "object") {
            val =(m[key] || m[key]==0)?m[key]:obj.value.value;
            switch (obj.value.type) {
            case "number":
                ele.value = val;
                break;
            case "range":
                ele.value = val;
                break;
            case "checkbox":
                ele.checked = val;
                ele.value   = obj.value.value;
                break;
            case "text":
            case "hidden":
                ele.value = val;
                break;
            case "select":
                if (obj.value.multiple) {
                    for (let [_, oIndex] of Object.entries(obj.value.value)) {
                        ele.options[oIndex].selected = true;
                    }
                } else {
                    ele.value = val;
                }
                break;
            case "radio":
                break;
            default:
                break;
            }
        } else {
            ele.value = (m[key] || m[key]==0)?m[key]:obj.value;
        }
    }
    return conf;
}


//################# TEMP #####################


function writeSelect (selectId,options,appendOptions) {
    let sel = $(`#${selectId}`),
        len = options.length;

    if (!appendOptions) {
        sel.html("");
    }
    for (let i=0,opt;i<len;i++) {
        opt = options[i];
        sel.append(`<option value="${opt.value}">${(opt.text?opt.text:opt.value)}</option>\n`);
    }
}

