class OldCode {
    buildGraph(graph) {
        let len =this.followers.length;
        for (let i=0,f;i<len;i++) {
            f = this.followers[i];
            graph.addLink(new Link(graph,this,f))
            f.buildGraph(graph);
        }
        return graph;
    }

    graphMeet (heats,restart) {
        if (restart) {
            this.graphs = [];
        }
        heats = heats?heats:this.heats;
        let graphs = [],
            len = heats.length,
            graph;

        for (let i=0,root;i<len;i++) {
            graph = new Graph();
            root = this.heats[i].winner;
            graph.addLink(new Link(graph,graph,root));
            root.buildGraph(graph)
            this.graphs.push(graph);
        }
        this.dagGraphs.push(this.graphToNodes(graph))
    }
    graphToNodes(graph) {
        let result = [],
            nodes = graph.to,
            id,
            parentIds,
            len;

        for (let [key,toLinks] of Object.entries(nodes)) {
            id = "" + key;
            parentIds = [];
            len = toLinks.length;
            for (let i=0,link,parentId;i<len;i++) {
                link = toLinks[i];
                if (link.fromNode.id.split("-")[0] == "graph") {
                    parentId = null;
                } else {
                    parentId = link.fromNode.id;
                }
                parentIds.push(parentId);
            }
            result.push({id:id,parentIds:parentIds})
        }
        return result;
    }
    blah () {
        let heatLen = this.heats.length
        this.graphMeet([this.heats[heatLen-1]]);
        dagGraphs = [];
    }
}