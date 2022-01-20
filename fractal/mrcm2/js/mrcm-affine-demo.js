// JavaScript Document
class fractalImage {
    id;
    name;
    width;
    height;
    canvas;
    context;
    imageData;
    pixels;
    points;
    continueAnimation = false;
    animationIndex = 0;
    edgeArray = []; // used to look at vertical slice of imagedata
    slice = new Map(); // pass in using startUpData to use...
    typeColors = new Map();
    constructor(canvasId, height, width, points, startUpData) {
        this.id = canvasId;
        this.name = canvasId;
        this.width = width;
        this.height = height;
        this.canvas = null;
        this.context = null;
        this.imageData = null;
        this.pixels = null;
        this.points = points;

        if (startUpData) {
            // start somewhere besides beginning
            for (let prop in startUpData) {
                this[prop] = startUpData[prop];
            }
        }
        if (this.typeColors.size == 0) {
            
        }
    }
    setTransform(a, b, c, d, e, f) {
        this.context.setTransform(a, b, c, d, e, f);
    }
    setTypeColors(type,rgbValue) {

    }
    drawRect(x, y, width, height, data) {
        this.context.fillStyle = "hotpink";
        this.context.strokeStyle = "royalblue";
        this.context.lineWidth = 1;
        if (data) {
            for (let prop in data) {
                this.context[prop] = data[prop];
            }
        }
        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);
    }
    drawMatrix(id) {
        let m = M[id];
        let colors = ['red', 'blue', 'green', 'yellow', 'orange', 'tan'];
        for (let i = 0; i < m.length; i++) {
            this.context.save();
            this.context.globalAlpha = .5;
            this.setTransform(m[i].ap, m[i].bp, m[i].cp, m[i].dp, m[i].e, m[i].f);
            this.drawRect(0, 0, this.width, this.height, { fillStyle: colors[(i + 1) % colors.length] });
            this.context.restore();
        }
    }
    drawImage() {
        this.canvas = document.getElementById(this.id);
        this.canvas.setAttribute('height', this.height);
        this.canvas.setAttribute('width', this.width);
        if (!this.canvas || !this.canvas.getContext) {
            return;
        }
        this.context = this.canvas.getContext('2d');
        if (!this.context || !this.context.putImageData) {
            return;
        }
        if (!this.context.createImageData) {
            this.imageData = this.context.createImageData(this.height, this.width);
        }
        else if (this.context.getImageData) {
            this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        }
        else {
            this.imageData = {
                'width': this.width,
                'height': this.height,
                'data': new Array(this.width * this.height * 4)
            };
        }

        this.pixels = this.imageData.data;
        this.edgeArray = new Array(4*this.height).fill(-1);
        for (let i = 0, n = this.pixels.length; i < n; i++) {
            this.pixels[i] = 255;
            //this.counters[i] = this.counterMax;
        }
        let point,
            currentIndex,
            row, col, type,
            subSize = this.points[0].s;

        for (let i = 0; i < this.points.length; i++) {
            point = this.points[i];
            col = Math.floor(point.x);
            row = Math.floor(point.y);
            type = point.r;
            this.points[i].key = `${col}-${row}`;
            this.points[i].sx = Math.floor((point.x-col)*subSize);
            this.points[i].sy = Math.floor((point.y-row)*subSize);
            currentIndex = 4 * (this.width * row + col);
            this.pixels[currentIndex++] = Math.abs((255 - 60 * ((type + 1 % 3))) % 255);
            this.pixels[currentIndex++] = Math.abs((255 - 60 * (type % 3)) % 255);
            this.pixels[currentIndex++] = Math.abs((255 - 60 * ((type + 2) % 3)) % 255);
            this.pixels[currentIndex] = 255;
            if (this.slice.has(col)) {
                let idx = 4*(row*this.slice.size+this.slice.get(col));
                this.edgeArray[idx++] = col;
                this.edgeArray[idx++] = row;
                this.edgeArray[idx++] = point.r+1;
                this.edgeArray[idx]   = 254-point.r;
            }
        }
        // Finish profile
        this.context.putImageData(this.imageData, 0, 0);
    }
}
