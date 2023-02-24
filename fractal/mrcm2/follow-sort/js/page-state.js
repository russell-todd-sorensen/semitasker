
class PageState {
    config;
    params;
    url;
    forms;
    formIdMap = new Map();
    constructor(state={}) {
        if (state.url) {
            this.url = state.url;
        } else {
            this.url = new URL(window.location.href);
        }
        if (state.params) {
            this.params = state.params;
        } else {
            this.params = new URLSearchParams(this.url.search);
        }
        if (state.forms) {
            this.forms = state.forms;
        } else {
            this.forms = document.forms;
        }
        this.mapIds(this.formIdMap,this.forms);
        if (state.config) {
            this.config = state.config;
            this.sync(this.config,"url2form")
        }
        if (state.events) {
            for (let i=0,data;i<state.events.length;i++) {
                data = state.events[i];
                const evt = new Event(...data.desc);
                document.getElementById(data.target).dispatchEvent(evt);
            }
        }
    }
    get search() {
        return this.url.search;
    }
    get options() {
        return this.options;
    }
    mapIds(map,iterable) {
        for (let i=0;i<iterable.length;i++) {
            map.set(iterable[i].id,i);
        }
    }
    param(which) {
        let value;
        if (this.params.has(which)) {
            value = this.params.get(which);
        } 
        return value;
    }
    setParam(which,value) {
        if (!this.params.has(which)) {
            console.log(`setParam adding ${which} with value ${value}`);
        }
        this.params.set(which,value);
        return value;
    }
    formCount() {
        return this.forms.length;
    }
    getForm(index) {
        if (this.forms.length > index) {
            return this.forms[index]
        } 
    }
    sync(config,mode="url2form") {
        let map = config.map,
            len = map.length;
        mode = mode?mode:config.mode;

        switch (mode) {
        case "form2url":
            for (let i=0;i<len;i++) {
                let mapping = map[i],
                    form = this.forms[this.formIdMap.get(mapping.form)];
                this.setParam(mapping.urlvar,form.elements[mapping.formvar].value);
            }
            break;
        case "url2form":
        default:
            for (let i=0;i<len;i++) {
                let mapping = map[i],
                    form = this.forms[this.formIdMap.get(mapping.form)],
                    val = this.param(mapping.urlvar);
                form.elements[mapping.formvar].value = val?val:mapping.default;
            }
            break;
        }
    }
}
