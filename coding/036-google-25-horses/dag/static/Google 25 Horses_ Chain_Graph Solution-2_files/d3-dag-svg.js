
var graphData = function(data,svgSelector) {
    let dag = d3.dagStratify()(data),
        nodeRadius = 20,
        layout = d3
            .sugiyama() // base layout
            //.decross(d3.decrossOpt()) // minimize number of crossings
            .nodeSize((node) => [(node ? 3.6 : 0.25) * nodeRadius, 3 * nodeRadius]); // set node size instead of constraining to fit
    let { width, height } = layout(dag);

    // --------------------------------
    // This code only handles rendering
    // --------------------------------
    let svgSelection = d3.select(svgSelector);
    svgSelection.html("");
    width = parseInt(width); 
    height = parseInt(height);

    svgSelection
        .attr("width",width)
        .attr("height",height)
        .attr("viewBox", [0, 0, width, height].join(" "));

    let defs = svgSelection.append("defs"), // For gradients
        steps = dag.size(),
        interp = d3.interpolateRainbow,
        colorMap = new Map();

    for (const [i, node] of dag.idescendants().entries()) {
        colorMap.set(node.data.id, interp(i / steps));
    }

    // How to draw edges
    let line = d3
            .line()
            .curve(d3.curveCatmullRom)
            .x((d) => d.x)
            .y((d) => d.y);

    // Plot edges
    svgSelection
        .append("g")
        .selectAll("path")
        .data(dag.links())
        .enter()
        .append("path")
        .attr("d", ({ points }) => line(points))
        .attr("fill", "none")
        .attr("stroke-width", 3)
        .attr("stroke", ({ source, target }) => {
            // encodeURIComponents for spaces, hope id doesn't have a `--` in it
            let gradId = encodeURIComponent(`${source.data.id}--${target.data.id}`),
                grad = defs
                    .append("linearGradient")
                    .attr("id", gradId)
                    .attr("gradientUnits", "userSpaceOnUse")
                    .attr("x1", source.x)
                    .attr("x2", target.x)
                    .attr("y1", source.y)
                    .attr("y2", target.y);

            grad
                .append("stop")
                .attr("offset", "0%")
                .attr("stop-color", colorMap.get(source.data.id));
            grad
                .append("stop")
                .attr("offset", "100%")
                .attr("stop-color", colorMap.get(target.data.id));

            return `url(#${gradId})`;
        });

    // Select nodes
    let nodes = svgSelection
            .append("g")
            .selectAll("g")
            .data(dag.descendants())
            .enter()
            .append("g")
            .attr("transform", ({ x, y }) => `translate(${x}, ${y})`);

    // Plot node circles
    nodes
        .append("circle")
        .attr("r", nodeRadius)
        .attr("fill", (n) => colorMap.get(n.data.id));

    // Add text to nodes
    nodes
        .append("text")
        .text((d) => (d.data.id).split("-")[1])
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white");
}
