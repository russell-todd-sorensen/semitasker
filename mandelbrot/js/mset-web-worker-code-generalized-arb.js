// we need the following script
importScripts("/js/decimal.js");
importScripts('precision.js');

// web worker mandelbrot calculation

self.addEventListener('message',  function(evt) {
    let data = evt.data,
        objectInfo = data.objectInfo;

    // Decimal does not make it though the transporter, reconstruct here
    objectInfo.startX = new Decimal(objectInfo.startX);
    objectInfo.startY = new Decimal(objectInfo.startY);
    objectInfo.endX   = new Decimal(objectInfo.endX);
    objectInfo.endY   = new Decimal(objectInfo.endY);

    let counter,
        finite,
        magv,
        currentIndex,
        tmpXSquared,tmpYSquared,tmpYbyTmpX,newX,newY,tmpX,tmpY,cY,cX,lastImaginaryPolarity,
        profile = {
            counts: new Array(objectInfo.counterMax+1).fill(0),
            maximum: 1,
            minimum: objectInfo.counterMax,
            infinite: 0
        },
        crossReal = !(objectInfo.startY.s == objectInfo.endY.s),
        crossImag = !(objectInfo.startX.s == objectInfo.endX.s),
        dx,dy,row0,col0;

    if (crossReal) {
        if (objectInfo.height%2 == 0) {
            objectInfo.height++;
        }
        // figure out which row will be at cr = 0
        if (objectInfo.height == 1) {
            dy = Decimal(0);
            row0 = 0;
        } else {
            dy = Decimal.abs((objectInfo.endY.minus(objectInfo.startY)).div(objectInfo.height-1));
            row0 = Decimal.abs(objectInfo.endY.divToInt(dy)).toNumber();
        }
    } else {
        if (objectInfo.height == 1) {
            dy = Decimal(0);
            row0 = 0;
        } else {
            dy = Decimal.abs((objectInfo.endY.minus(objectInfo.startY)).div(objectInfo.height-1));
            row0 = objectInfo.height;
        }
    }
    let iCoords = new Array(objectInfo.height).fill(0);
    iCoords[row0] = new Decimal(0.0);
    for (let i=0; i<objectInfo.height;i++) {
        if (iCoords[i]) {
            continue;
        }
        if (i < row0) {
            iCoords[i] = objectInfo.endY.minus(dy.times(i))
        } else {
            iCoords[i] = Decimal(0).minus(dy.times(i - row0))
        }
    }

    if (crossImag) {
        if (objectInfo.width%2 == 0) {
            objectInfo.width++;
        }
        // figure out which col will be at ci = 0
        if (objectInfo.width == 1) {
            dx = Decimal(0);
            col0 = 0;
        } else {
            dx = Decimal.abs((objectInfo.endX.minus(objectInfo.startX)).div(objectInfo.width-1));
            col0 = Decimal.abs(objectInfo.startX.divToInt(dx)).toNumber();
        }
    } else {
        if (objectInfo.height == 1) {
            dx = Decimal(0)
            col0 = 0
        } else {
            dx = Decimal.abs((objectInfo.endX.minus(objectInfo.startX)).div(objectInfo.width-1));
            col0 = objectInfo.width;
        }
    }
    let rCoords = new Array(objectInfo.width).fill(0);
    rCoords[col0] = new Decimal(0); // in some cases col0 is outside used real coords
    for (let j=0;j<objectInfo.width;j++) {
        if (rCoords[j]) { // note that if this is the zero row, it returns true
            continue; 
        }
        if (j < col0) {
            rCoords[j] = objectInfo.startX.plus(dx.times(j));
        } else {
            rCoords[j] = dx.times(j-col0);
        }
    }

    let totalPixels = objectInfo.width*objectInfo.height,
        skew = 0,
        counters = new Array(totalPixels).fill(objectInfo.counterMax),
        polarity = new Array(totalPixels).fill(true),
        coord    = new Array(totalPixels).fill({x:0,y:0,col:0,row:0}), //intentional shared object
        fractalTypeId = data.fractalTypeId;

        // temp hack to get point grid tool up and running.
    data.dx = dx;
    data.dy = dy;

    for (let row=0, y; row<objectInfo.height;row++)
    {
        y = iCoords[row];

        for (let col=0, x;col<objectInfo.width; col++)
        {
            x = rCoords[col],
            magv = new Decimal(0),
            counter = 0,
            finite = true,
            cX = x.times(1),
            cY = y.times(1),
            newX = new Decimal(0), //x;
            newY = new Decimal(0), //y;
            tmpX = new Decimal(0), //x;
            tmpY = new Decimal(0), //y;
            tmpXSquared = tmpX.times(tmpX),
            tmpYSquared = tmpY.times(tmpY),
            tmpYbyTmpX  = tmpY.times(tmpX);

            while (counter <= objectInfo.counterMax && finite)
            {

                switch (objectInfo.finiteMeasureFunction) {
                case 1:
                    magv = tmpXSquared.plus(tmpYSquared);
                    break;
                case 2:
                    magv = Decimal.sqrt(tmpXSquared.plus(tmpYSquared));
                    break;
                case 3:
                    magv = Decimal.abs(tmpYbyTmpX);
                    break;
                case 4:
                    magv = Decimal.abs(tmpY).plus(Decimal.abs(tmpX));
                    break;
                case 5:
                    magv = Decimal.abs(tmpY.plus(tmpX));
                    break;
                case 6:
                    magv = Decimal.abs(tmpYbyTmpX).toPower(.6);
                    break;
                case 7:
                    if (
                        (tmpX.lt(-2.00000))  ||
                        (tmpX.gt(.47118534)) ||
                        (Decimal.abs(tmpY).gt(1.227571))
                       )
                    {
                        magv = new Decimal("+Infinity");
                    }
                    break;
                case 8:
                    if (
                        ( (tmpX.lt(-2.00000) )  || (tmpX.gt(.47118534)))
                        &&
                        (Decimal.abs(tmpY).gt(1.227571))
                    )
                    {
                        magv = new Decimal("+Infinity");
                    }
                    break;
                case 9:
                    if (
                        (Decimal.abs(tmpX).gt(2.0))
                        &&
                        (Decimal.abs(tmpY).gt(1.227571))
                    )
                    {
                        magv = new Decimal("+Infinity");
                    }
                    break;
                }
                if (magv.gt(objectInfo.finiteMeasure)) {
                    finite = false;
                }

                newY = cY.plus(tmpYbyTmpX.times(2));
                newX = cX.minus(tmpYSquared).plus(tmpXSquared);
                tmpX = newX.times(1);
                tmpY = newY.times(1);
                tmpXSquared = tmpX.times(tmpX);
                tmpYSquared = tmpY.times(tmpY);
                tmpYbyTmpX  = tmpY.times(tmpX);

                switch (fractalTypeId) {
                case 1:
                    tmpYbyTmpX = Decimal.abs(tmpYbyTmpX);
                    break;
                default:
                    break;
                }

                counter++;
            }

            counter--;

            // record if last imaginary part is positive or negative.
            lastImaginaryPolarity = (newY.gt(0)) ? true : false;

            profile.counts[counter]++;

            if (counter > profile.maximum)
            {
                profile.maximum = counter;
            }
            if (counter < profile.minimum) {
                profile.minimum = counter;
            }


            //currentIndex = 4*((objectInfo.width-1)*row + col);
            
            // skew causes image to shift and skew
            // 1 => 45deg skew, 50% shift
            // 0 => normal 
            currentIndex = 4*((objectInfo.width-skew)*row + col);

            counters[currentIndex/4] = counter;
            polarity[currentIndex/4] = lastImaginaryPolarity;
            //coord[currentIndex/4] = [x,y,col,row];
            coord[currentIndex/4] = {x:x.toJSON(),y:y.toJSON(),col:col,row:row};
        }
    }

  data.profile  = profile;
  data.counters = counters;
  data.polarity = polarity;
  data.coord    = coord;
  data.dx       = data.dx.toJSON();
  data.dy       = data.dy.toJSON();

  objectInfo.startX = objectInfo.startX.toJSON();
  objectInfo.startY = objectInfo.startY.toJSON();
  objectInfo.endX   = objectInfo.endX.toJSON();
  objectInfo.endY   = objectInfo.endY.toJSON();

  self.postMessage(data);
});
