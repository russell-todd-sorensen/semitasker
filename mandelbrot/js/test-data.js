var myEvents = new Array();

class myEvent {
    data = {};
    constructor (attrs) {
        this.data = attrs;
    }
}

myEvents.push(
    new myEvent({
        boxId: "box",
        minX: 250,
        minY: 20,
        maxX: 275,
        maxY: 50,
        offsetLeft: 219,
        offsetTop: 2,
    })
);

myEvents.push(
    new myEvent({
        boxId: "box",
        minX: 250,
        minY: 20,
        maxX: 280,
        maxY: 40,
        offsetLeft: 219,
        offsetTop: 2,
    })
)

myEvents.push(
    new myEvent({
        boxId: "box",
        minX: 250,
        minY: 20,
        maxX: 280,
        maxY: 40,
        offsetLeft: 250,
        offsetTop: 20,
    })
)

myEvents.push(
    new myEvent({
        boxId: "box",
        minX: 250,
        minY: 20,
        maxX: 275,
        maxY: 50,
        offsetLeft: 219,
        offsetTop: 2,
    })
);

myEvents.push(
    new myEvent({
        boxId: "box",
        minX: 219,
        minY: 2,
        maxX: 275,
        maxY: 50,
        offsetLeft: 219,
        offsetTop: 2,
    })
);

myEvents.push(
    new myEvent({
        boxId: "box",
        minX: 220,
        minY: 3,
        maxX: 220,
        maxY: 3,
        offsetLeft: 220,
        offsetTop: 3,
    })
);