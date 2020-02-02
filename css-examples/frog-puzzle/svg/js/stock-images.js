// This is used as a replacement for //js/data.js
var Data = {};
Data.url = document.url;
Data.Restored = {};
Data.Images = [
    {url:'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ', alt:'Dog 1'},
    {url:'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ', alt:'Dog 2'},
    {url:'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ', alt:'Dog 3'},
    {url:'https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ', alt:'Dog 4'},
    {url:'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ', alt:'Dog 5'},
    {url:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ', alt:'Dog 6'},
    {url:'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ', alt:'Dog 7'},
    {url:'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ', alt:'Dog 8'},
    {url:'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ', alt:'Dog 9'},
    {url:'https://images.unsplash.com/photo-1504595403659-9088ce801e29?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ', alt:'Dog 10'},
];

Data.Filters = [

    {url: "grayscale(0%)", alt: "No Filter"},
    {url: "grayscale(100%)", alt: "Grayscale(100%)"},
    {url: "sepia(1)", alt: "Sepia(100%)"},
    {url: "sepia(0.5)", alt: "Sepia(50%)"},
    {url: "invert(.8)", alt: "Invert(.8)"},
    {url: "url(#color-red)", alt: "Color-Red"},
    {url: "brightness(3)", alt: "Brightness(3)"},
    {url: "contrast(4)", alt: "Contrast(4)"},
    //{url: "", alt: ""},
    //{url: "", alt: ""},
    {url: "blur(3px) grayscale(20%)", alt: "Blur(3px) Grayscale(20%)"},
    {url: "url(#ZZ)", alt: "ZZ"},
    {url: "url(#X)", alt: "X"},
    {url: "url(#X2)", alt: "X2"},
    {url: "url(#X2-Animate)", alt: "X2-Animate"},
    {url: "url(#X3-Animate)", alt: "X3-Animate"},
    {url: "url(#Y)", alt: "Y"},
    {url: "url(#X)", alt: "Z"},
    {url: "url(#XX)", alt: "XX"},
    {url: "url(#XX2)", alt: "XX2 Vertical"},
    {url: "url(#XX3)", alt: "XX3 Horizontal"},
    {url: "url(#XX4)", alt: "XX4 Convolve Radial"},
    {url: "url(#XX5)", alt: "XX5 Blur"},
    {url: "url(#XX6)", alt: "XX6 Blur Posterize"},
    {url: "url(#XX7)", alt: "XX7 Blur?"},
    {url: "url(#XX8)", alt: "XX8 Blur? Animate"},
    {url: "url(#desaturate-1)", alt: "Desaturate 1"},
    {url: "url(#desaturate-2)", alt: "Desaturate 2"},
    {url: "url(#desaturate-3)", alt: "Desaturate 3 Animated"},
    {url: "url(#hueRotate-1)", alt: "Hue Rotate 45&deg;"},
    {url: "url(#hueRotate-2)", alt: "Hue Rotate 20&deg;"},
    {url: "url(#hueRotate-3)", alt: "Hue Rotate Animation"},
    {url: "url(#luminanceToAlpha-1)", alt: "Luminance To Alpha 1"},
    {url: "url(#posterize-0)", alt: "Posterize 0"},
    {url: "url(#posterize-00)", alt: "Posterize 00"},
    {url: "url(#posterize-000)", alt: "Posterize 000"},
    {url: "url(#posterize-000-1)", alt: "Posterize 000-1"},
    {url: "url(#posterize-000-2)", alt: "Posterize 000-2"},
    {url: "url(#posterize-000-3)", alt: "Posterize 000-3"},
    {url: "url(#posterize-000-4)", alt: "Posterize 000-4 (T-Mobile)"},
    {url: "url(#posterize-0000)", alt: "Posterize 0000"},
    {url: "url(#posterize-1)", alt: "Posterize 1"},
    {url: "url(#posterize-2)", alt: "Posterize 2"},
    {url: "url(#posterize-3)", alt: "Posterize 3"},
    {url: "url(#posterize-4)", alt: "Posterize 4"},
    {url: "url(#posterize-5)", alt: "Posterize 5"},
    {url: "url(#posterize-6)", alt: "Posterize 6"},
    {url: "url(#posterize-7)", alt: "Posterize 7"},
    {url: "url(#posterize-7-table)", alt: "Posterize 7 table"},
    {url: "url(#posterize-8)", alt: "Posterize 8"},
    {url: "url(#posterize-9)", alt: "Posterize 9"},
    {url: "url(#posterize-10)", alt: "Posterize 10"},
    {url: "url(#posterize-11)", alt: "Posterize 11"},
    {url: "url(#posterize-12)", alt: "Posterize 12"},
    {url: "url(#posterize-12-table)", alt: "Posterize 12 table"},
    {url: "url(#duotone-peachypink)", alt: "Duotone PeachyPink"},
    {url: "url(#direct-map-1)", alt: "Direct Map 1"},
    {url: "url(#sharpen-1)", alt: "Sharpen 1"},
    {url: "url(#sharpen-2)", alt: "Sharpen 2"},
    {url: "url(#sharpen-3)", alt: "Sharpen 3"},
    {url: "url(#sharpen-3-1)", alt: "Sharpen 3-1"},
    {url: "url(#sharpen-3-2)", alt: "Sharpen 3-2"},
    {url: "url(#sharpen-3-3)", alt: "Sharpen 3-3"},
    {url: "url(#sharpen-4)", alt: "Sharpen 4"},
    {url: "url(#sharpen-5)", alt: "Sharpen 5"},
    {url: "url(#super-saturate)", alt: "SuperSaturate"},
    {url: "url(#saturate-red)", alt: "Saturate Red"},
    {url: "url(#saturate-green)", alt: "Saturate Green"},
    {url: "url(#saturate-blue)", alt: "Saturate Blue"},
    {url: "url(#photo-negative)", alt: "Photo Negative"},
    {url: "url(#MorphErode-1)", alt: "Morph Erode 1 Animated"},
    {url: "url(#MorphDilate-1)", alt: "Morph Dilate 1 Animated"},
    {url: "url(#DD)", alt: "Mother of Pearl"},
    {url: "url(#table-1)", alt: "Table 1"},
    {url: "url(#table-2)", alt: "Gamma 1: Purple"},
    {url: "url(#table-3)", alt: "Table 3"},
    {url: "url(#table-4)", alt: "Table 4"},
    {url: "url(#table-5)", alt: "Table 5"},
    {url: "url(#table-6)", alt: "Table 6"},
    {url: "url(#table-7)", alt: "Table 7"},
    {url: "url(#table-8)", alt: "Table 8"},
    {url: "url(#table-9)", alt: "Table 9"},
    {url: "url(#table-10)", alt: "Table 10"},
    {url: "url(#table-10-2)", alt: "Table 10-2"},
    {url: "url(#table-10-3)", alt: "Table 10-3"},
    {url: "url(#table-10-4)", alt: "Table 10-4"},
    {url: "url(#table-10-5)", alt: "Table 10-5"},
    {url: "url(#table-10-6)", alt: "Table 10-6"},
    {url: "url(#table-10-7)", alt: "Table 10-7"},
    {url: "url(#table-10-7-2)", alt: "Table 10-7-2"},
    {url: "url(#table-10-8)", alt: "Table 10-8"},
    {url: "url(#table-10-9)", alt: "Table 10-9"},
    {url: "url(#table-11)", alt: "Table 11 Animated 9-10"},
    {url: "url(#table-12)", alt: "Table 12 Animated"},
    {url: "url(#table-14)", alt: "Table 14 Animated Pos to Neg"},
    {url: "url(#table-15)", alt: "Table 15 Animated"},
    {url: "url(#table-16)", alt: "Table 16 Animated"},
    {url: "url(#table-17)", alt: "Table 17 Animated"},
    {url: "url(#table-18)", alt: "Table 18 Animated"},
    {url: "url(#table-19)", alt: "Table 19 Animated"},
  ];

var filterIndex = 0;
var filterText = "";
var scrollValues = new Array();
var scrollRef;

scrollValues[0] = {
    value:0,
    id:'filter-text',
    wheelId:'filter-bg'
};


var handleFilterScroll = function (evt) {
    evt.cancelBubble = true;
    evt.preventDefault = true;
    let wheelDelta = evt.wheelDelta;
    console.log('In handleFilterScroll timestamp: '
        + evt.timeStamp
        + ', wheelDelta='
        + wheelDelta);
    let filterRef = d3.select("#puzzle-container");
    let index = filterIndex;
    let len = Data.Filters.length
    while (index < 0) {
        index += len
    }
    if (wheelDelta > 0) {
        index = (index - 1) % len
    } else {
        index = (index + 1) % len
    }
    while (index < 0) {
        index += len; 
    }
    filterIndex = index;
    let filterText = Data.Filters[index].url
    let filterDescr = Data.Filters[index].alt
    let re = /url\(/g;
    //filterText = filterText.replace(re,"url(https://home.semitasker.com/svg/filters.svg");
    filterRef
        .style("filter",filterText)
    scrollRef2.innerHTML = filterDescr;
    return false;
}

var SVGDoc,textId,scrollRef1,scrollRef2;

var init = function() {
    scrollRef1 = document.getElementById(scrollValues[0]["wheelId"]);
    scrollRef1.onmousewheel = handleFilterScroll;
    scrollRef2 = document.getElementById(scrollValues[0]["id"]);
    scrollRef2.onmousewheel = handleFilterScroll;

    SVGDoc = document.getElementById("filter-bg");
    textId = "filter-text";
}