
class Transform {
    constructor(translate, scale, rotate, skew, order) {
        this.translate = (translate?translate:{x:0,y:0});
        this.scale = (scale?scale:{x:1,y:1});
        this.rotate = (rotate?rotate:{deg:0});
        this.skew = (skew?skew:{x:0,y:0});
        this.order = (order?order:['translate','scale','rotate','skew']);
    }
    toString() {
        let transform = [];
        let idx = 0;
        for (let i = 0; i< this.order.length;i++) {
            switch (this.order[i]) {
            case 'translate':
                if (this.translate.x == 0 && this.translate.y == 0) {
                    break;
                }
                transform[idx] = 'translate(' + this.translate.x + ', ' + this.translate.y + ')'
                idx++;
                break;
            case 'scale':
                if (this.scale.x == 1 && (!this.scale.y || this.scale.y == 1)) {
                    break;
                }
                transform[idx] = 'scale(' + this.scale.x + (this.scale.y ? (', ' + this.scale.y + ')') : ')');
                idx++;
                break;
            case 'rotate':
                if (this.rotate.deg == 0) {
                    break;
                }
                transform[idx] = 'rotate(' + this.rotate.deg;
                if (this.rotate.x) {
                    transform[idx] += (', ' + this.rotate.x + ', ' + this.rotate.y )
                }
                transform[idx] += ')';
                idx++;
                break;
            case 'skew':
                if (this.skew.x) {
                    transform[idx] = 'skewX(' + this.skew.x + ')';
                    idx++;
                }
                if (this.skew.y) {
                    transform[idx] = 'skewY(' + this.skew.y + ')';
                    idx++;
                }
                break;
            default: 
                break;
            }
        }
        return transform.join(' ')
    }
}

class Path {
    constructor(id,d,transform) {
        this.id = id;
        this.d  = d;
        this.transform = transform;
    }
}
