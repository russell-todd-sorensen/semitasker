/* Example use

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

*/

var panelHidden = new Array();

function togglePanel(key) {
	var panelArray,panelObject,id,extraObject,extraId;
	if (panelHidden[key]) {
	  panelArray = panelHidden[key];
	}
	else {
	  return;
	}
	for (var i = 0;i<panelArray.length;i++) {
		panelObject = panelArray[i];
		id = '#' + panelObject.id;
		if (panelObject.visible) {
			$(id).hide();
		} else {
			$(id).show();
		}
    panelObject.visible = !panelObject.visible;
    if (panelObject.css[panelObject.visible]) {
      $(id).css(panelObject.css[panelObject.visible]);
    }
    if (panelObject.extra) {
      for(var j = 0;j<panelObject.extra.length;j++) {
        extraObject = panelObject.extra[j];
        extraId = '#' + extraObject.id;
        if (extraObject.css[panelObject.visible]) {
          $(extraId).css(extraObject.css[panelObject.visible]);
        }
      }
    }
          
	}
}