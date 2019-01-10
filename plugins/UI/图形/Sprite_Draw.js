Bitmap.prototype.drawSetStyle = function (style) {
    if (style && typeof (style) == "object") {
        for (var i in style) {
            this._context[i] = style
        }
    }
}

Bitmap.prototype.drawFun = function (list) {

    //环境 = 环境
    var context = this._context;
    //环境 保存()
    context.save();

    for (var i = 0; i < list.length; i++) {
        var name = list[i]
        if (Array.isArray(name)) {
            var n = name[0]
            var p = name.slice(1)
            if (typeof (context[n]) == "function") {
                context[n].apply(context, p)
            } else {
                context[n] = p[0]
            }
        } else if (typeof (name) == "string") {
            if (typeof (context[name]) == "function") {
                console.log(context[name], "function")
                context[name]()
            }
        } else {
            this.drawSetStyle(name)
        }
    }

    //环境 恢复()
    context.restore();
    //设置发生更改()
    this._setDirty();
}



/**
 * 
 * 绘制  
 * 
 * 
 */

function Sprite_UIDraw() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIDraw.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_UIDraw.prototype.constructor = Sprite_UIDraw;
/**初始化 */
Sprite_UIDraw.prototype.initialize = function (w, h, ax, ay) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(w, h)
    this.anchor.x = ax || 0;
    this.anchor.y = ay || 0;
};


Sprite_UIDraw.prototype.draw = function (list) {
    this.bitmap.drawFun(list)
};



Sprite_UIDraw.prototype.drawCircleSEList = function (x, y, r, start, end, color, type) {
    var type = type ? "stroke" : "fill"
    var unit = Math.PI / 180;
    var start = start || 0
    var end = end === undefined ? 360 : (end || 0)
    var list = [
        [type + "Style", color],
        "beginPath",
        ["moveTo",x,y],
        ["arc", x, y, r, start * unit, end * unit],
        "closePath",
        type
    ]
    this.draw(list)
}
