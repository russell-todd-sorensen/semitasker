
class Visualization {
    static #idCounter = 0;
    name;
    state;
    constructor(conf={
        tmpl:"vis",
        state:null,
    }) {
        this.setName(conf.tmpl);
        this.state = conf.state;
    }
    setName(tmpl="vis") {
        this.name = `${tmpl}-${Visualization.#idCounter++}`;
        return this.name;
    }
}
