/**
 * 创建遮罩
 */


Sprite.prototype.setMask = function (s) {
    if (this.mask) {
        this.removeChild(this.mask)
    }
    this.mask = s
    if (this.mask) {
        this.addChild(this.mask)
    }
}


Sprite.prototype.makeMask = function (x, y, w, h) { 
    var b = new Bitmap(w,h)
    b.fillAll("#ffffff") 
    var s = new Sprite(b)
    s.x = x 
    s.y = y
    this.setMask(s) 
};


