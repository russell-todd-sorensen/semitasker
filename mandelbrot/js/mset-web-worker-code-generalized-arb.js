// we need the following script
importScripts('precision.js');

// web worker mandelbrot calculation

self.addEventListener('message',  function(evt) {
    let data = evt.data,
        objectInfo = data.objectInfo,
        counter,
        finite,
        currentIndex,
        tmpXSquared,tmpYSquared,tmpYbyTmpX,newX,newY,tmpX,tmpY,cY,cX,lastImaginaryPolarity,
        profile = {
            counts: [],
            maximum: 0,
            minimum: objectInfo.counterMax,
            infinite: 0
        },
        skew = 0,
        counters = [],
        polarity = [],
        coord    = [],
        fractalTypeId = data.fractalTypeId,
        dx = Math.abs((objectInfo.endX-objectInfo.startX)/objectInfo.width),
        dy = Math.abs((objectInfo.endY-objectInfo.startY)/objectInfo.height);

        // temp hack to get point grid tool up and running.
    data.dx = dx;
    data.dy = dy;

    let mpArray = maxPrecision([
        objectInfo.endX,objectInfo.startX,
        objectInfo.endY,objectInfo.startY,
        objectInfo.width,
        objectInfo.height],
        0
    );

    for (var x = objectInfo.startX, col = 0;
        col<objectInfo.width && x < objectInfo.endX;
        x+=dx, col++)
    {
        x = parseFloat((x).toPrecision(8))
        for (var y = objectInfo.startY, row=objectInfo.height-1;
            row >= 0 && y < objectInfo.endY;
            y+=dy, row-- )
        {
            y = parseFloat((y).toPrecision(8));
            counter = 0;
            finite = true;
            newX = x;
            newY = y;
            tmpX = x;
            tmpY = y;
            cY = y;
            cX = x;
            tmpXSquared = tmpX * tmpX;
            tmpYSquared = tmpY * tmpY;

            switch (fractalTypeId) {
            case 1:
                tmpYbyTmpX = Math.abs(tmpX * tmpY);
                break;
            case 0:
            default:
                tmpYbyTmpX = tmpY * tmpX;
                break;
            }

            while (counter <= objectInfo.counterMax && finite)
            {

                newY = cY + 2 * tmpYbyTmpX
                newX = cX - tmpYSquared + tmpXSquared;
                tmpX = newX;
                tmpY = newY;
                tmpXSquared = tmpX * tmpX;
                tmpYSquared = tmpY * tmpY;

                switch (fractalTypeId) {
                case 1:
                    tmpYbyTmpX = Math.abs(tmpY * tmpX);
                    break;
                default:
                    tmpYbyTmpX = tmpY * tmpX;
                    break;
                }

                switch (objectInfo.finiteMeasureFunction) {
                case 1:
                    if ((tmpXSquared + tmpYSquared) > objectInfo.finiteMeasure)
                    {
                        finite = false;
                    }
                    break;
                case 2:
                    if (Math.sqrt( tmpXSquared + tmpYSquared) > objectInfo.finiteMeasure)
                    {
                        finite = false;
                    }
                    break;
                case 3:
                    if (Math.abs(tmpYbyTmpX) > objectInfo.finiteMeasure)
                    {
                        finite = false;
                    }
                    break;
                case 4:
                    if ((Math.abs(tmpY)+Math.abs(tmpX)) > objectInfo.finiteMeasure)
                    {
                        finite = false;
                    }
                    break;
                case 5:
                    if ((Math.abs(tmpY + tmpX)) > objectInfo.finiteMeasure)
                    {
                        finite = false;
                    }
                    break;
                case 6:
                    if (Math.pow( Math.abs(tmpYbyTmpX),.6) > objectInfo.finiteMeasure)
                    {
                        finite = false;
                    }
                    break;
                case 7:
                    if (
                        (tmpX < -2.00000)  ||
                        (tmpX > .47118534) ||
                        (Math.abs(tmpY) > 1.227571))
                    {
                        finite = false;
                    }
                    break;
                case 8:
                    if (
                        ((tmpX < -2.00000)  || (tmpX > .47118534))
                        &&
                        (Math.abs(tmpY) > 1.227571)
                    )
                    {
                        finite = false;
                    }
                    break;
                case 9:
                    if (
                        (Math.abs(tmpX) > 2.0)
                        &&
                        (Math.abs(tmpY) > 1.227571)
                    )
                    {
                        finite = false;
                    }
                    break;
                }

                counter++;
            }

            counter--;

            // record if last imaginary part is positive or negative.
            lastImaginaryPolarity = (newY > 0) ? true : false;

            if (profile.counts[counter])
            {
                profile.counts[counter]++;
            }
            else {
                profile.counts[counter] = 1;
                if (counter > profile.maximum)
                {
                    profile.maximum = counter;
                }
                if (counter < profile.minimum) {
                    profile.minimum = counter;
                }
            }

            //currentIndex = 4*((objectInfo.width-1)*row + col);
            
            // skew causes image to shift and skew
            // 1 => 45deg skew, 50% shift
            // 0 => normal 
            currentIndex = 4*((objectInfo.width-skew)*row + col);

            counters[currentIndex] = counter;
            polarity[currentIndex] = lastImaginaryPolarity;
            //coord[currentIndex/4] = [x,y,col,row];
            coord[currentIndex/4] = {x:x,y:y,col:col,row:row};
        }
    }

  data.profile = profile;
  data.counters = counters;
  data.polarity = polarity;
  data.coord    = coord;

  self.postMessage(data);
});
