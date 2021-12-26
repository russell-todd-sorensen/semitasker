
var svgDraw = function (config,svgId,templateId,parentId) {
    config = Object.assign({
        svgId:"svgOne",
        templateId:"svg-template",
        parentId:"exampleOne",
        height:100,
        width:500,
        x:0,
        y:0,
    },(config?config:null));

    svgId=svgId?svgId:
        config.svgId?config.svgId:
        "svgOne";
    templateId=templateId?templateId:
        config.templateId?config.templateId:
        "svg-template",
    parentId=parentId?parentId:
        config.parentId?config.parentId:
        "exampleOne";

    let x      = config.x,
        y      = config.y,
        height = config.height,
        width  = config.width;
    
    if (document.querySelector(`#${svgId}`)) {
        document.querySelector(`#${svgId}`).remove();
    }
    let svgTemplate = d3.select(`#${templateId}`).html();

    d3.select("#examples").append("div").attr("id",parentId);
    d3.select(`#${parentId}`).html(svgTemplate);
    d3.select(`#${parentId} svg`).attr("id",svgId);

    let svg = d3.select(`#${svgId}`);

    svg
        .attr("x",x)
        .attr("y",y)
        .attr("width",width)
        .attr("height",height)
        .attr("viewBox",[x,y,width,height].join(" "));

    return svg;
}