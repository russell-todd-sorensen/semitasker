class Graph {
    static #idSequence = 0;
    id;
    name;
    links = {};
    from = {};
    to = {};
    nodes = {
        "f":{},
        "t":{}
    };
    constructor(name,links) {
        this.getId();
        this.name = name?name:`${this.id}`;
        this.addLinks(links?links:[]);
    }
    addLinks (links) { // input is array
        let len = links.length;
        for (let i=0;i<len;i++) {
            this.addLink(links[i]);
        }
    }
    removeLink(link) {
        let linkId = link.getId();
        if (this.links[linkId]) {
            delete this.links[linkId]
        } else {
            console.log("link ${linkId} not found in graph ${this.getId}")
            return;
        }
        let f = link.fromNode.getId(),
            t = link.toNode.getId();

        if (this.from[f]) {
            if (this.from[f].length > 1) {
                this.from[f] = this.from[f].filter(item => item.id != linkId);
            } else {
                delete this.from[f];
            }
        }
        if (this.to[t]) {
            if (this.to[t].length > 1) {
                this.to[t] = this.to[t].filter(item => item.id != linkId);
            } else {
                delete this.to[t];
            }
        }
        if (f) {
            if (this.nodes["f"][f] > 1) {
                this.nodes["f"][f]--;
            } else {
                delete this.nodes["f"][f]
            }
        }
        if (t) {
            if (this.nodes["t"][t] > 1) {
                this.nodes["t"][t]--
            } else {
                delete this.nodes["t"][t]
            }
        }
    }
    addLink(link) { // input is link object 
        let linkId = link.getId();
        if (this.links[linkId]) {
            console.log(`link with id='${linkId}' already in graph`);
            return;
        }
        this.links[linkId] = link;
        let f = link.fromNode.getId(),
            t = link.toNode.getId();
        if (this.from[f]) {
            this.from[f].push(link);
        } else {
            this.from[f] = [link];
        }
        if (this.to[t]) {
            this.to[t].push(link);
        } else {
            this.to[t] = [link];
        }
        if (f) {
            if (this.nodes["f"][f]){
                this.nodes["f"][f]++
            } else {
                this.nodes["f"][f] = 1;
            }
        }
        if (t) {
            if (this.nodes["t"][t]) {
                this.nodes["t"][t]++
            } else {
                this.nodes["t"][t] = 1;
            }
        }
    }
    getId() {
        if (!this.id) {
            ++Graph.#idSequence;
            this.id = `graph-${Graph.#idSequence}`;
        }
        return this.id;
    }
    getName() {
        return this.name;
    }
    getLen() {
        return this.links.length;
    }
    push(link) {
        return this.links.push(link);
    }
    pop() {
        return this.links.pop();
    }
    shift() {
        return this.links.shift();
    }
    unshift(link) {
        return this.links.unshift(link);
    }
    getLinks() {
        return this.links;
    }
    getHeads() {
        let len = this.getLen(),
            heads = [];
    }
}

class Link {
    static #idSequence = 0;
    id;
    graph;
    fromNode;
    toNode;
    data;
    
    constructor(graph,fromNode,toNode,data) {
        this.graph = graph?graph:null;
        this.fromNode = fromNode?fromNode:null;
        this.toNode   = toNode?toNode:null;
        this.data     = data?data:{};

        this.getId();
    }
    getId() {
        if (!this.id) {
            ++Link.#idSequence;
            this.id = `link-${Link.#idSequence}`;
        }
        return this.id;
    }
}

if (false) {
    // example use
var myGraph = new Graph("graph")

var nodes = [];

class myNode {
    name;
    color;
    constructor(name,color) {
        this.name = name;
        this.color = color;
    }
    getId() {
        return this.name;
    }
}

nodes.push(new myNode("sam","blue"))
nodes.push(new myNode("jan","silver"))


var links = [];

links.push(new Link(myGraph,nodes[0],nodes[1],{id:1}))
}