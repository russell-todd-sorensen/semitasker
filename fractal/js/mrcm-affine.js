
// JavaScript Document
class fractalImage {
    constructor(canvasId, height, width, points, startUpData) {
        this.id = canvasId;
        this.name = canvasId;
        this.height = height;
        this.width = width;
        this.factor = 1.0;
        this.rect = {
            start: {
                x: -2.3,
                y: -1.5
            },
            end: {
                x: 1.7,
                y: 1.5
            }
        };
        this.rectTmp = {
            start: {
                x: -1.0,
                y: -1.0
            },
            end: {
                x: 1.0,
                y: 1.0
            }
        };
        this.dx = 2.0;
        this.dy = 2.0;
        this.heightToWidthRatio = 1.0;
        this.canvas = null;
        this.context = null;
        this.imageData = null;
        this.pixels = null;
        this.points = points;
        this.pixelImageHeight = 600;
        this.pixelImageWidth = 600;
        this.setTransform = function (a, b, c, d, e, f) {
            this.context.setTransform(a, b, c, d, e, f);
        };
        this.drawRect = function (x, y, width, height, data) {
            //this.context.save();
            this.context.fillStyle = "hotpink";
            this.context.strokeStyle = "royalblue";
            this.context.lineWidth = 1;
            if (arguments.length == 5) {
                for (var prop in data) {
                    this.context[prop] = data[prop];
                }
            }
            this.context.fillRect(x, y, width, height);
            this.context.strokeRect(x, y, width, height);
            //this.context.restore();
        };
        this.drawText = function (text, x, y, data) {
            //this.context.save();
            this.context.fillStyle = "hotpink";
            this.context.strokeStyle = "royalblue";
            this.context.lineWidth = 1;
            this.context.font = "60pt Comic Sans MS bold";
            this.context.textAlign = "left";
            this.context.textBaseline = "top";
            if (arguments.length == 4) {
                for (var prop in data) {
                    this.context[prop] = data[prop];
                }
            }
            this.context.fillText(text, x, y);
            //this.context.restore();
        };
        this.drawMatrix = function (id) {
            var m = M[id];
            var colors = ['red', 'blue', 'green', 'yellow', 'orange', 'tan'];
            for (var i = 0; i < m.length; i++) {
                this.context.save();
                this.context.globalAlpha = .5;
                this.setTransform(m[i].ap, m[i].bp, m[i].cp, m[i].dp, m[i].e, m[i].f);
                Log.Notice("M[" + id + "][" + i + "]=" + m[i].toString());
                this.drawRect(0, 0, this.width, this.height, { fillStyle: colors[(i + 1) % colors.length] });
                this.drawText('' + i + ' hi there', 0, 0, { fillStyle: colors[i] });
                this.context.restore();
            }
        };
        // this does nothing right now
        this.drawBox = function (id) {
            var m = M[id];
            var colors = ['red', 'blue', 'green', 'yellow', 'orange', 'tan'];
            for (var i = 0; i < m.length; i++) {
                this.context.save();
                this.context.globalAlpha = .5;
            }
        };
        this.drawImage = function () {
            this.canvas = document.getElementById(this.id);
            this.canvas.setAttribute('height', this.height);
            this.canvas.setAttribute('width', this.width);
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
            for (var i = 0, n = this.pixels.length; i < n; i++) {
                this.pixels[i] = 0;
                //this.counters[i] = this.counterMax;
            }
            var value;
            var index = 0;
            var point;
            var currentIndex;
            //var numbers = d3.select('#numbers');
            var row, col, type;
            for (var i = 0; i < points.length; i++) {
                point = this.points[i];
                col = Math.round(point.x);
                row = Math.round(point.y);
                type = point.r;
                currentIndex = 4 * (this.width * row + col);
                this.pixels[currentIndex++] = Math.abs((255 - 40 * ((type + 1 % 3))) % 255);
                this.pixels[currentIndex++] = Math.abs((255 - 40 * (type % 3)) % 255);
                this.pixels[currentIndex++] = Math.abs((255 - 40 * ((type + 2) % 3)) % 255);
                this.pixels[currentIndex] = 255;
            }
            // Finish profile
            this.context.putImageData(this.imageData, 0, 0);
        };
        this.continueAnimation = false;
        this.animationIndex = 0;
        if (arguments.length == 5) {
            // start somewhere besides beginning
            for (var prop in startUpData) {
                this[prop] = startUpData[prop];
            }
        }
        return this;
    }
}
