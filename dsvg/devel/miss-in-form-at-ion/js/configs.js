
var configs = [];
var configsFinal = [];

configs["phoneInputBase"] = {
    cname: "phoneInputBase",
    baseConfig:null,
    cols:23,
    rows:2,
    scale:30,
    startId:"C-0-0",
    exitId:"V-23-1",
    removeWalls:[],
    wallPerimeterP:true,
    solnCount:0,
    solutions:[],
    locale:"phone",
}

configs[0] = {
    cname: "acode1",
    baseConfig:null,
    cols:21,
    rows:2,
    scale:30,
    startId:"C-1-0",
    exitId:"V-23-1",
    addWalls:[
        "V-1-1", // Num 1
        "H-0-2","V-3-0","V-2-1","H-2-2", // Num 2
        "H-0-4","V-5-0","H-1-4","H-2-4", // Num 3
        "V-8-0","H-1-7","V-7-0", // Num 4
        "H-0-9","V-9-0","V-10-1","H-2-9", // Num 5
        "H-0-11","H-1-11","V-12-1","H-2-11","V-11-1", // Num 6
        "H-0-14","V-15-1", // Num 7
        "H-0-16","H-1-16","H-2-16", // Num 8
        "V-18-0","H-0-18","V-19-0","H-1-18","H-2-18", //Num 9
        "H-1-20","V-20-1","H-2-20","V-21-1", // Num 0
    ],
    addSpacings:[
        "H-1-1",
        "H-1-3",
        "H-1-5",
        "H-1-6",
        "H-1-8",
        "H-1-10",
        "H-1-12",
        "H-1-13",
        "H-1-15",
        "H-1-17",
        "H-1-19",
    ],
    removeWalls:[],
    wallPerimeterP:true,
    perimeterType:5,
    solnCount:0,
    solutions:[],
    locale:"phone",
}

configs["demo"] = {
    cname: "demo",
    baseConfig:"phoneInputBase",
    addWalls:[
        "V-2-1", // Num 1
        "H-0-3","V-4-0","V-3-1","H-2-3", // Num 2
        "H-0-5","V-6-0","H-1-5","H-2-5", // Num 3
        "V-9-0","H-1-8","V-8-0", // Num 4
        "H-0-10","V-10-0","V-11-1","H-2-10", // Num 5
        "H-0-12","H-1-12","V-13-1","H-2-12","V-12-1", // Num 6
        "H-0-15","V-16-1", // Num 7
        "H-0-17","H-1-17","H-2-17", // Num 8
        "V-19-0","H-0-19","V-20-0","H-1-19","H-2-19", //Num 9
        "H-1-21","V-21-1","H-2-21","V-22-1", // Num 0
    ],
    addSpacings:[
        "H-1-1",
        "H-1-3",
        "H-1-5",
        "H-1-6",
        "H-1-8",
        "H-1-10",
        "H-1-12",
        "H-1-13",
        "H-1-15",
        "H-1-17",
        "H-1-19",
    ],
}
