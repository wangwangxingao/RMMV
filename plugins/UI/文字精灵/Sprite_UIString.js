

/**文字精灵 */
function Sprite_UIString() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIString.prototype = Object.create(Sprite_UIBase.prototype);
/**设置创造者 */
Sprite_UIString.prototype.constructor = Sprite_UIString;
/**初始化 */
Sprite_UIString.prototype.initialize = function(w, h, text,color,hear) {
    Sprite_UIBase.prototype.initialize.call(this);
    this.bitmap = new Bitmap(w, h)
    this._text = text || ""
    this._hear = hear || ""
    this._blackColor = color ||""
    this._drawText()

};



/**设置长度 */
Object.defineProperty(Sprite_UIString.prototype, 'text', {
    //获得 
    get: function() {
        return this._text;
    },
    set: function(value) {
        if (this._text !== value) {
            this._text = value
            this._drawText()
        }
    },
    configurable: true
});




/**设置长度 */
Object.defineProperty(Sprite_UIString.prototype, 'blackColor', {
    //获得 
    get: function() {
        return this._blackColor;
    },
    set: function(value) {
        if (this._blackColor !== value) {
            this._blackColor = value
            this._drawText()
        }
    },
    configurable: true
});



Sprite_UIString.prototype._drawColor = function() {
    if (!this._blackColor) {
        /*var r = Math.randomInt(255)
        var g = Math.randomInt(255)
        var b = Math.randomInt(255)
        var a = 0.4
        this._blackColor = "rgba(" + r + "," + g + "," + b + "," + a + ")"*/
    }
    if (this._blackColor) {
        this.bitmap.fillAll(this._blackColor)
    }
}

Sprite_UIString.prototype._drawText = function() {
    this.bitmap.clear()
 
    this._drawColor() 
    var w = this.bitmap.window()
    var test = w.drawTextEx(this.text, 0, 0, this.bitmap.width, this.bitmap.height)
}


Sprite_UIString.addEmpty = function(n, l, t) {
    var v = "" + n
    while (v.length < l) {
        v = t ? v + " " : " " + v
    }
    return v
}



/**两侧文本精灵 */

function Sprite_UIString2() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIString2.prototype = Object.create(Sprite_UIString.prototype);
/**设置创造者 */
Sprite_UIString2.prototype.constructor = Sprite_UIString2;


Sprite_UIString2.prototype.initialize = function(w, h, text, text2,color,hear,hear2) {
    Sprite_UIBase.prototype.initialize.call(this); 
    this.bitmap = new Bitmap(w, h) 
    this._text = text || ""
    this._text2 = text2 || ""
    this._hear = hear || ""
    this._hear2 = hear2 || ""
    this._blackColor = color||"" 
    this._drawText()
};

 
Object.defineProperty(Sprite_UIString2.prototype, 'text2', {
    //获得 
    get: function() {
        return this._text2;
    },
    set: function(value) {
        if (this._text2 !== value) {
            this._text2 = value
            this._drawText()
        }
    },
    configurable: true
});
 
 
Sprite_UIString2.prototype._drawText = function() {
    this.bitmap.clear()
    this._drawColor() 
    var w = this.bitmap.window()
    w.drawTextEx(this.hear + this.text, 0, 0, this.bitmap.width, this.bitmap.height)
    w.drawTextEx(this.hear2 + this.text2, 0, 0, this.bitmap.width, this.bitmap.height)
};