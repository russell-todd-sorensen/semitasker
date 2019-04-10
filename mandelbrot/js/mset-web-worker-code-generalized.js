// web worker mandelbrot calculation
self.addEventListener('message',  function(evt) {
  var data = evt.data;
  var objectInfo = data.objectInfo;
  var col = 0;
  var row = objectInfo.height-1;
  var print = 0;
  var index = 0;
  var counter;
  var finite;
  var value;
  var currentIndex;
  var tmpXSquared,tmpYSquared,tmpYbyTmpX,newX,newY,tmpX,tmpY,cY,cX,lastImaginaryPolarity;
  var profile = {
    counts: [],
    maximum: 0,
    minimum: objectInfo.counterMax,
    infinite: 0
  };
  var counters = [];
  var polarity = [];
  var coord    = [];

  var fractalTypeId = data.fractalTypeId;
  console.log('fractalTypeId=' + fractalTypeId);

  for (var x = objectInfo.startX, col = 0;
    col<objectInfo.width && x < objectInfo.endX;
    x+=Math.abs((objectInfo.endX-objectInfo.startX)/objectInfo.width), col++)
  {
    for (var y = objectInfo.startY, row=objectInfo.height-1;
      row >= 0 && y < objectInfo.endY;
      y+=Math.abs((objectInfo.endY-objectInfo.startY)/objectInfo.height), row-- )
    {
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
      // quick hack ()

      //if (lastImaginaryPolarity) counter++;
      // profile counters
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

      currentIndex = 4*(objectInfo.width*row + col);

      counters[currentIndex] = counter;
      polarity[currentIndex] = lastImaginaryPolarity;
      coord[currentIndex] = [x,y,col,row];
      index++;
    }
  }

  data.profile = profile;
  data.counters = counters;
  data.polarity = polarity;
  data.coord    = coord;

  self.postMessage(data);
});
