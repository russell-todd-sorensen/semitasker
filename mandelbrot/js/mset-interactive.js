
var myCounters = [1,2,3,4,5,6,1,4,6,7,2,5,1,4,9];

var exampleRect = {
  start: {
    x: new Decimal(0.4529654240128),
    y: new Decimal(0.3506321791478193)
  },
  end: {
    x: new Decimal(0.4529653461376),
    y: new Decimal(0.3506321445512928)
  }
};

panelHidden["controls"] = [{
  id:'panel1',
  visible:true,
  css:{
    true:{
      position:'relative'
    },
    false:{
      position:'absolute'
    }
  },
  extra: [
    {
      id:'controls',
      css:{
        true: {
          position:'relative',
          zIndex:0,
          "background-color":'transparent'
        },
        false: {
          position:'absolute',
          zIndex:100,
          "background-color":'#444444'
        }
      }
   },
 ]}
];

var writeColorPicker = function(pickerContainerId, styleId) {

    let formData = processForm(),
        data = formData.data,
        objId = data.objId,
        fractal = myFractalImages[objId],
        myColors = fractal.colors,
        container = d3.select('#pickContainer');
    
    container.html("");

    container
        .selectAll('.cp')
        .data(myColors)
        .enter()
        .append('div')
        .attr('class',function(d,i) {return 'cp n-' + i})
        .attr('id',function(d,i) {
            if (d.hex) {
                let hex = d.hex;
                hex = hex.substr(1);
                return 'cp-' + hex;
            } else {
                return 'num-' + i;
            }
        })
        .style("background-color", function(d,i) {
            if (d.hex) {
                return  d.hex;
            } else {
                return '#123';
            }
        });

    container
        .selectAll('.cp')
        .on('click', LogStuff);

}

var LogStuff = function(d,i,e) {
    Log.Notice('LogStuff color=' + d.hex)
}

var bindMouseBox = function () {

    $(myFractalImages[myFractalImageId].mouseBox).bind('mousedown',
                   myFractalImages[myFractalImageId],startMove);

}

var bindClick = function () {
    $(myFractalImages[myFractalImageId].mouseBox).unbind('mousedown').bind('click',
                   myFractalImages[myFractalImageId],captureClick);
}

var unbindClick = function () {
    $(myFractalImages[myFractalImageId].mouseBox).unbind('click');
}

function captureClick(evt) {
    let myEvent = evt,
        fractal = CurrentData,
        offsetX = myEvent.offsetX,
        offsetY = myEvent.offsetY,
        pixelWidth  = fractal.objectInfo.width,
        pixelHeight = fractal.objectInfo.height,
        actualWidth  = fractal.objectInfo.endX - fractal.objectInfo.startX, // needs decimal
        actualHeight = fractal.objectInfo.endY - fractal.objectInfo.startY; // needs decimal;

    Log.Notice('click captured offsetX=' + offsetX + ' offsetY=' + offsetY);
    // Pixels Offsets are measured:
    //                    from left to right for X
    //                    from top to bottom for Y
    // However we need to access the pixel array which is one dimensional
    // So Pixel 0 is at:
    // offsetX = 0 and offsetY = 0

    unbindClick()
    bindMouseBox()
}

function doScale(horizontalId,verticalId) {
    let hValue = $('#' + horizontalId).attr('checked') ? -1 : 1,
        vValue = $('#' + verticalId).attr('checked') ? -1 : 1,
        scale = 'transform: scale(' + hValue + ',' + vValue + ')';

    $('#myCanvas').attr('style',scale);
}