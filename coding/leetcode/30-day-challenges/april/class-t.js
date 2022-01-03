
class T {
    static #index = 0;
    id;
    static templates = new Map(); 
    ele;
    cx;
    cy;
    r;
    fill;
    stroke;
    constructor(tName,data) {

    }
    static addTemplate(name,def,template) {
        T.templates.set(name,[def,template]);
    }
    nextId() {
        T.#index++;
        return `T-${T.#index}`;
    }
}

class Config {
    
}

//class Tag {
//    static {
//        #index = 0;
//        #tags = new Map();
//    }
//}