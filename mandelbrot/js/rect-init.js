// Initial Rect plus testing rects
var rectInit = new Array();

//// Initial Rectangle is different for different fractal types ////
rectInit[0] = {
    start: {
        x: new Decimal(-2.3),
        y: new Decimal(-1.5)
    },
    end: {
        x: new Decimal(1.7),
        y: new Decimal(1.5)
    }
};

rectInit[1] = {
    start: {
        x: new Decimal(-2.3),
        y: new Decimal(-2.0)
    },
    end: {
        x: new Decimal(1.7),
        y: new Decimal(1.5)
    }
};

// This is a small rect for testing
rectInit[2] = {
    start: {
        x: new Decimal(-2.025),
        y: new Decimal(-0.025)
    },
    end: {
        x: new Decimal(-1.925),
        y: new Decimal(0.025)
    }
};

// This is the real line for testing
rectInit[3] = {
    start: {
        x: new Decimal(-2.000),
        y: new Decimal(0.0)
    },
    end: {
        x: new Decimal(.25),
        y: new Decimal(0.0)
    }
};

// mimimum 100x100 fractal starting point
rectInit[5] = {
    start: {
        x: new Decimal(-2.100),
        y: new Decimal(-0.1)
    },
    end: {
        x: new Decimal(-1.900),
        y: new Decimal(0.1)
    }
};

rectInit[4] = { // same as 4 with different starting points
    start: {
        x: new Decimal(.2790),
        y: new Decimal(0.007)
    },
    end: {
        x: new Decimal(.2810),
        y: new Decimal(0.009)
    }
};

// this example spans real and imaginary axis
rectInit[6] = {
    start: {
        x: new Decimal(-1.025),
        y: new Decimal(-1.025)
    },
    end: {
        x: new Decimal(1.025),
        y: new Decimal(1.025)
    }
};
rectInit[7] = {
    start: {
        x: new Decimal(-2.025),
        y: new Decimal(-2.025)
    },
    end: {
        x: new Decimal(2.025),
        y: new Decimal(2.025)
    }
};

rectInit[8] = rectInit[7];
