// Fractal Image Library

var myFractalImages = new Array();
var myFractalImageId = myFractalImages.length;
var colorCanvas;
var minimumPixelImageHeight = 768;


//////////////////// THIS IS THE FRACTAL IMAGE OBJECT  /////////////
class fractalImage {
    id;
    boxId;
    name;
    mouseBox;
    height;
    width;
    factor = new Decimal(1.25);
    rect = {
        start: {
            x: new Decimal(-2.3),
            y: new Decimal(-1.5)
        },
        end: {
            x: new Decimal(1.7),
            y: new Decimal(1.5)
        }
    };
    rectTmp = {
        start: {
            x: new Decimal(-1.0),
            y: new Decimal(-1.0)
        },
        end: {
            x: new Decimal(1.0),
            y: new Decimal(1.0)
        }
    };
    dragStart = {
        x: 0,
        y: 0,
    };
    dragCurrent = {
        x: 0,
        y: 0,
    };
    dragEnd = {
        x: 0,
        y: 0,
    };

    fractalWidth = new Decimal(2.0);
    fractalHeight = new Decimal(2.0);
    heightToWidthRatio = new Decimal(1.0);

    canvas = null;
    context = null;
    imageData = null;
    pixels = null;
    colors = new Array();
    polarity = new Array();
    counterMax = 255;
    finiteMeasure = 256.0;
    finiteMeasureFunction = 2;
    counters = [];
    profile = {};
    scale = 5;
    pixelImageHeight = 768;
    pixelImageWidth = 150;
    animationRow = 0;
    rotationIndex = 0;
    rowPolygons = null;
    continueAnimation = false;
    animationModulus = 360 * 100;
    animationIndex = 0;
    callStartMove = [logStartMove, captureMouseUp, setupRect];
    callDragMove = [drawBox, logDragMove];
    callEndMove = [logEndMove, unbindMouseUp, calculateRect];

    // Web Worker to calculate counters
    worker = new Worker('js/mset-web-worker-code-generalized-arb.js');

    constructor(canvasId, boxId, height, width, startUpData) {
        this.id = canvasId;
        this.boxId = boxId;
        this.name = canvasId;
        this.mouseBox = '#' + canvasId;
        this.height = height;
        this.width = width;

        this.worker.addEventListener('message', drawImageFromWorker);

        if (startUpData) {
            for (let prop in startUpData) {
                this[prop] = startUpData[prop];
            }
        }

        return this;
    };

    setDragCurrent(width,height) {
        this.dragCurrent = {
            x: width,
            y: height,
        };
    }
    setDragEnd(width,height) {
        this.dragEnd = {
            x: width,
            y: height,
        };
    }

    calculateHeightAndWidth (newFactor) {
        if (newFactor <= 2 || newFactor >= 0.2) {
            this.factor = newFactor;
        }

        this.fractalWidth = this.rect.end.x.minus(this.rect.start.x);
        this.fractalHeight = this.rect.end.y.minus(this.rect.start.y);
        this.heightToWidthRatio = this.fractalHeight.div(this.fractalWidth).toNumber();

        Log.Debug('heightToWidthRatio=' + this.heightToWidthRatio);

        if (this.heightToWidthRatio >= 1) {
            this.width = 500 * this.factor;
        } else {
            this.width = 1000 * this.factor;
        }

        this.height = Math.round(this.width * this.heightToWidthRatio);
        this.width = Math.round(this.width);

        Log.Debug('width=' + this.width + ' height=' + this.height);
    };

    clearProfile () {
        this.profile = {
            counts: [],
            minimum: this.counterMax,
            maximum: 0,
            infinite: 0
        };
    };
    scaleCounter (value) {
        if (value < 10) {
            return value * 5;
        } else if (value < 50) {
            return 50 + value;
        } else {
            return 100;
        }
    };
    calculatePolygonRows () {
        let rowArray,
            counterIndexStart,
            counterLast = null,
            counter;

        this.rowPolygons = new Array();

        for (let row = 0; row < this.height; row++) {
            rowArray = new Array();
            counterIndexStart = 4 * row * this.width;

            for (let col = 0; col < this.width; col++) {
                counter = this.counters[counterIndexStart + 4 * col];
                if (col == 0 || col == this.width - 1) {
                    rowArray[rowArray.length] = [col, counter];
                } else if (counter != counterLast) {
                    rowArray[rowArray.length] = [col, counter];
                }
                counterLast = counter;
            }

            this.rowPolygons[row] = rowArray;
        }
    };

    initColorArray () {
        this.colorCanvas = document.getElementById(this.colorCanvasId);
        this.colorCanvas.setAttribute('height', this.pixelImageHeight);
        this.colorCanvas.setAttribute('width', this.pixelImageWidth);

        if (!this.colorCanvas || !this.colorCanvas.getContext) {
            Log.Debug('initColorArray: canvas or canvas.getContext not found');
            return;
        }

        this.colorCanvasContext = this.colorCanvas.getContext('2d');

        if (!this.colorCanvasContext || !this.colorCanvasContext.putImageData) {
            Log.Debug('initColorArray: context or context.putImageData not found');
            return;
        }

        if (!this.colorCanvasContext.createImageData) {
            Log.Debug('initColorArray: context.createImage exists');
            this.colorCanvasImageData = this.colorCanvasContext.createImageData(
                this.pixelImageHeight, this.pixelImageWidth);
        }
        else if (this.colorCanvasContext.getImageData) {
            this.colorCanvasImageData = this.colorCanvasContext.getImageData(
                0, 0, this.pixelImageWidth, this.pixelImageHeight);
            Log.Notice('initColorArray: context.getImageData exists length='
                + this.colorCanvasImageData.data.length);
        }
        else {
            Log.Debug('initColorArray: using default image creation method');
            this.colorCanvasImageData = {
                'width': this.pixelImageWidth,
                'height': this.pixelImageHeight,
                'data': new Array(this.pixelImageWidth * this.pixelImageHeight * 4)
            };
        }

        this.colorCanvasPixels = this.colorCanvasImageData.data;

        for (var i = 0, n = this.colorCanvasPixels.length; i < n; i++) {
            this.colorCanvasPixels[i] = 255;
        }

    };

    calculateCounters (data, initialRect) {
        let objectInfo = {},
            fractalTypeId = data.fractalTypeId;

        if (initialRect) {
            this.rect.start.x = rectInit[fractalTypeId].start.x;
            this.rect.start.y = rectInit[fractalTypeId].start.y;
            this.rect.end.x = rectInit[fractalTypeId].end.x;
            this.rect.end.y = rectInit[fractalTypeId].end.y;

            /////////// FOR TESTING /////////////////
            switch (fractalTypeId) {
            case 2: // for testing
                this.height = 10;
                this.width = 10;
                break;
            case 3:
                this.height = 1;
                this.width = 100;
                break;
            case 4: // for testing
                this.height = 100;
                this.width = 100;
                break;
            default:
                break;
            }
            //////// FINISH FOR TESTING /////////////
        }

        objectInfo.startX = this.rect.start.x;
        objectInfo.startY = this.rect.start.y;
        objectInfo.endX = this.rect.end.x;
        objectInfo.endY = this.rect.end.y;
        objectInfo.height = this.height;
        objectInfo.width = this.width;

        this.finiteMeasure = objectInfo.finiteMeasure = data.finiteMeasure;
        this.finiteMeasureFunction = objectInfo.finiteMeasureFunction = data.finiteMeasureFunction;
        this.counterMax = objectInfo.counterMax = data.counterMax;

        // Javascript can't serialize Decimal, so we do it ourselves
        objectInfo.startX = (objectInfo.startX).toJSON();
        objectInfo.startY = (objectInfo.startY).toJSON();
        objectInfo.endX = (objectInfo.endX).toJSON();
        objectInfo.endY = (objectInfo.endY).toJSON();
        data.objectInfo = objectInfo;

        // we will reverse when we get message from worker
        this.worker.postMessage(data);
    };

    drawImage (data) {

        this.canvas = document.getElementById(this.id);
        this.canvas.setAttribute('height', this.height);
        this.canvas.setAttribute('width', this.width);

        // set container dimensions to match canvas
        $(`#${this.id}`)
            .parent().css({
                "height": `${this.height}px`,
                "width": `${this.width}px`
            });

        if (!this.canvas || !this.canvas.getContext) {
            Log.Debug('doImageStuff: canvas or canvas.getContext not found');
            return;
        }

        this.context = this.canvas.getContext('2d');

        if (!this.context || !this.context.putImageData) {
            Log.Debug('doImageStuff: context or context.putImageData not found');
            return;
        }

        if (!this.context.createImageData) {
            Log.Debug('doImageStuff: context.createImage exists');
            this.imageData = this.context.createImageData(this.height, this.width);
        }
        else if (this.context.getImageData) {
            this.imageData = this.context.getImageData(0, 0, this.width, this.height);
            Log.Notice('doImageStuff: context.getImageData exists length='
                + this.imageData.data.length);
        }
        else {
            Log.Debug('doImageStuff: using default image creation method');
            this.imageData = {
                'width': this.width,
                'height': this.height,
                'data': new Array(this.width * this.height * 4)
            };
        }

        this.pixels = this.imageData.data;
        // This is where the new data should be used
        for (var i = 0, n = this.pixels.length; i < n; i++) {
            this.pixels[i] = 255;
        }

        this.profile = data.profile;
        this.counters = data.counters;

        // Finish profile
        this.profile.total = 0;
        this.profile.percents = new Array();

        for (let i = 0; i < this.counterMax; i++) {
            if (this.profile.counts[i]) {
                this.profile.total = this.profile.total + this.profile.counts[i];
            }
            else {
                this.profile.counts[i] = 0;
            }
        }

        // calculate percentages
        let value;

        for (let i = 0; i < this.profile.counts.length; i++) {
            value = Math.round(100 * this.scale * this.profile.counts[i] / this.profile.total);
            this.profile.percents[i] = (value < 100 ? value : 100);
        }

        this.calculatePolygonRows();
        addToPixels[data.animationFunctionId](data);
        this.context.putImageData(this.imageData, 0, 0);
    };

    
}
