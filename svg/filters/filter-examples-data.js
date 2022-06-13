class Link {
    static #idCounter = 0;
    static #links = [];
    id;
    name;
    descr;
    url;

    constructor (name,descr,url) {
        this.name = name;
        this.descr = descr;
        this.url=url;
        this.id = Link.#idCounter++;
        Link.#links.push(this);
    }
    static addLinks(list) {
        for (let i=0;i<list.length;i++) {
            let lnk = new Link(`link-auto-${i}`,`AutoAdd Link`,list[i]);
            console.log(`link='${lnk.url}'`);
        }
    }
    static getLen() {
        return Link.#links.length;
    }
    static getLink(index) {
        index = parseInt(index);
        if (index < Link.getLen()) {
            return Link.#links[index]
        } else {
            return null;
        }
    }
}

var linkList = [
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FOleksii%2520Makeiev%2520Twitter%2520Page.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=0%2C1%2C1%2C1%2Cend%2Cend%2Cend%2C3%2C3%2C3%2C3",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FOleksii%2520Makeiev%2520Twitter%2520Page.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=3%2C1%2C1%2C1%2C1%2Cend%2Cend%2Cend%2C3%2C1%2C1%2C3",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FOleksii%2520Makeiev%2520Twitter%2520Page.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=3%2C1%2C1%2C1%2C3%2C3%2C3%2C3%2C3%2C1%2C1%2C1",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FOleksii%2520Makeiev%2520Twitter%2520Page.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=3%2C1%2C1%2C1%2C3%2C3%2C3%2C3%2C3%2C3%2C1%2Cend",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FOleksii%2520Makeiev%2520Twitter%2520Page.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=3%2C1%2C1%2C1%2C1%2C3%2C3%2C3%2C3%2C3%2C3%2Cend",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B100.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=1%2C3%2C1%2C1%2C1%2C1%2C3%2C3%2C3%2C3%2C3%2C3%2Cend&b=0%3A1.0px%3A30.0s%3A3",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B100.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=1%2C3%2C1%2C1%2C1%2C1%2C3%2C3%2C3%2C1%2C3%2C3%2Cend&b=0%3A1.0px%3A30.0s%3A3",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B100.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=1%2C3%2C1%2C1%2C1%2C1%2C3%2C3%2C3%2C1%2C3%2C3%2Cend&b=0%3A1.0px%3A10.0s%3A3",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B100.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=1%2C3%2C1%2C1%2C1%2C1%2C3%2C3%2C3%2C1%2C3%2C3%2Cend&b=0%3A3%3A10.0s%3A3&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B100.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=1%2C3%2C1%2C1%2C1%2C1%2C3%2C3%2C3%2C1%2C3%2C3%2Cend&b=0%3A0%3A10.0s%3A3&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B0.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=1%2C3%2C1%2C1%2C1%2C1%2C3%2C3%2C3%2C1%2C3%2C3%2Cend&b=0%3A3%3A10.0s%3A3&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B0.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7%2C4%3AFFD70000&s=4%2C3%2C1%2C1%2C3%2C1%2C3%2C3%2C3%2C1%2C3%2C1%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B0.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7%2C4%3AFFD70000&s=4%2C3%2C3%2C3%2C3%2C3%2C3%2C1%2C1%2C3%2C3%2C3%2C1%2C3%2C3%2C3%2C1%2C3%2C3%2C3%2C1%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B0.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7%2C4%3AFFD70000&s=4%2C3%2C1%2C1%2C3%2C1%2C1%2C3%2C3%2C3%2C3%2C1%2C1%2C3%2C3%2C3%2C1%2C3%2C3%2C1%2C3%2C1%2C3%2C1%2C3%2C3%2C1%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B0.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7%2C4%3AFFD70000&s=4%2C3%2C3%2C1%2C1%2C3%2C3%2C3%2C1%2C3%2C3%2C3%2C1%2C1%2C3%2C3%2C3%2C1%2C3%2C3%2C1%2C3%2C1%2C3%2C1%2C3%2C3%2C1%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2Fmset-opt%2FD%2B0.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7%2C4%3AFFD70000&s=4%2C3%2C3%2C1%2C1%2C3%2C1%2C3%2C1%2C3%2C3%2C1%2C3%2C3%2C2%2C4%2C4%2C2%2C4%2C4%2C2%2C4%2C4%2C4%2C4%2C4%2C4%2C2%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500" ,
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2Foleksii-makeiev-2.png&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=3%2C1%2C1%2C1%2C3%2C3%2C3%2C3%2C3%2C3%2C1%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fi.imgur.com%2FbG8t8iJ.mp4&h=1%3AFFD700%2C2%3AFF0028%2C3%3A0057B7&s=0%2C1%2C3%2C2%2C1%2C1%2C1%2C1%2C3%2C3%2Cend&b=0%3A1%3A10%3A3&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=0%2C3%2C3%2Cend%2C4%2C4%2C4%2C5%2C5%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=0%2C3%2C3%2C3%2C4%2C4%2C4%2C5%2C5%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=3%2C4%2C4%2C4%2C5%2C5%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=3%2C3%2C3%2C3%2C4%2C4%2C4%2C5%2C5%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=0%2C3%2C3%2C3%2C3%2C4%2C4%2C4%2C5%2C5%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=0%2C3%2C3%2C3%2C3%2C4%2C4%2C5%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=0%2C3%2C3%2C3%2C4%2C4%2C5%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=0%2C3%2C3%2C3%2C4%2C4%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=0%2C3%2C3%2C4%2C4%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=0%2C3%2C3%2C4%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=0%2C3%2C4%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https://home.highfivediet.com/images/HSL2RGB/Ukraine-Colors-Anim/bG8t8iJ.mp4&h=1:555555FF%2c2:AAAAAAFF&s=0%2c1%2c2%2cend&b=0:0:0:0&v=0:0:2000:1500",
    "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https://home.highfivediet.com/images/mset-opt/mset-6131.png&h=1:555555FF%2c2:AAAAAAFF&s=0%2c1%2c2%2cend&b=1.0px:5.0px:20.0s:2&v=0:0:2000:1500",
];

var twoMoreLinks = function () {

    new Link("Charlie Chaplin 1","Skit 1",
        "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https%3A%2F%2Fhome.highfivediet.com%2Fimages%2FHSL2RGB%2FUkraine-Colors-Anim%2FbG8t8iJ.mp4&h=1%3A555555FF%2C2%3AAAAAAAFF%2C3%3A444444FF%2C4%3A888888FF%2C5%3ACCCCCCFF&s=0%2C3%2C3%2Cend%2C4%2C4%2C4%2C5%2C5%2C5%2Cend&b=0%3A0%3A0%3A0&v=0%3A0%3A2000%3A1500");

    new Link("Oleksii Makeiev","Ukraine Colors applied to Oleksii Makeiev's Twitter masthead.",
        "https://home.highfivediet.com/svg/filters/dynamic-filter-2.tcl?t=0&p=https://home.highfivediet.com/images/mset-opt/Oleksii%2520Makeiev%2520Twitter%2520Page.png&h=1:FFD700%2c2:FF0028%2c3:0057B7&s=3%2c1%2c1%2c1%2c1%2c3%2c3%2c3%2c3%2c3%2c3%2cend&b=0:0:0:0&v=0:0:2000:1500");
}

//function addLinks(list) {
//    for (let i=0;i<list.length;i++) {
//        let lnk = new Link(`link-auto-${i}`,`AutoAdd Link`,list[i]);
//        console.log(`link='${lnk.url}'`);
//    }
//}