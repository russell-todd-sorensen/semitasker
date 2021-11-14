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
    let value,
        ele;
    conf = conf?conf:initialConf;
    for (let [key,obj] of Object.entries(conf)) {
        ele = document.getElementById(obj.id);
        if (typeof obj.value == "object") {
            let type = obj.value.type;
            switch (type) {
            case "number":
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
            case "checkbox":
                ele.checked = val;
                ele.value   = obj.value.value;
                break;
            case "text":
            case "hidden":
                ele.value = val;
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
