
function Sprite_UIStringLong() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_UIStringLong.prototype = Object.create(Sprite_UIString.prototype);
/**设置创造者 */
Sprite_UIStringLong.prototype.constructor = Sprite_UIString;
 

Sprite_UIStringLong.prototype._drawText = function () {
    this.bitmap.clear()

    var w = this.bitmap.width
    var texts = this.bitmap.window().testTextEx(this.text, 0, 0,w )
    
    var page = texts.list[0]
    var test = page.test
    var h = test.h
    this.bitmap = new Bitmap(w, h) 

    this.bitmap.window().drawTextEx(this.text, 0, 0, w, h) 
    if(this.xywh){
        this.xywh = [this.xywh[0],this.xywh[1], w,h ]
    }else{
        this.xywh = [0,0,w,h]
    }
}
