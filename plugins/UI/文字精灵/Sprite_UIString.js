/**文字精灵 */
function Sprite_UIString() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIString.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_UIString.prototype.constructor = Sprite_UIString;
/**
 * 初始化
 * @param {number} w    宽  
 * @param {number} h    高  
 * @param {string|[string]} text 文本  
 * @param {string} color 颜色   
 * 
 * @param {number} aw  宽自动
 * 
 * 0 初始  
 * 1 初始内适合大小  
 * 2 适合大小
 * 
 * @param {number} ah  
 * 0 初始  
 * 1 初始内适合大小  
 * 2 适合大小
 */
Sprite_UIString.prototype.initialize = function (w, h, text, color, aw, ah) {
    Sprite.prototype.initialize.call(this);
    this._sw = w
    this._sh = h
    this._aw = aw
    this._ah = ah
    this.bitmap = new Bitmap(w, h)
    this._text = text || ""
    this._blackColor = color || ""
    this._drawText()
};



/**设置长度 */
Object.defineProperty(Sprite_UIString.prototype, 'text', {
    //获得 
    get: function () {
        return this._text;
    },
    set: function (value) {
        if (this._text !== value) {
            this._text = value
            this._drawText()
        }
    },
    configurable: true
});


Object.defineProperty(Sprite_UIString.prototype, 'sw', {
    //获得 
    get: function () {
        return this._sw;
    },
    set: function (value) {
        if (this._sw !== value) {
            this._sw = value
            this._drawText()
        }
    },
    configurable: true
});

Object.defineProperty(Sprite_UIString.prototype, 'sh', {
    //获得 
    get: function () {
        return this._sh;
    },
    set: function (value) {
        if (this._sh !== value) {
            this._sh = value
            this._drawText()
        }
    },
    configurable: true
});
Object.defineProperty(Sprite_UIString.prototype, 'aw', {
    //获得 
    get: function () {
        return this._aw;
    },
    set: function (value) {
        if (this._aw !== value) {
            this._aw = value
            this._drawText()
        }
    },
    configurable: true
});
Object.defineProperty(Sprite_UIString.prototype, 'ah', {
    //获得 
    get: function () {
        return this._ah;
    },
    set: function (value) {
        if (this._ah !== value) {
            this._ah = value
            this._drawText()
        }
    },
    configurable: true
});


/**设置长度 */
Object.defineProperty(Sprite_UIString.prototype, 'blackColor', {
    //获得 
    get: function () {
        return this._blackColor;
    },
    set: function (value) {
        if (this._blackColor !== value) {
            this._blackColor = value
            this._drawText()
        }
    },
    configurable: true
});

Object.defineProperty(Sprite_UIString.prototype, 'blackColorType', {
    //获得 
    get: function () {
        return this._blackColorType;
    },
    set: function (value) {
        if (this._blackColorType !== value) {
            this._blackColorType = value
            this._drawText()
        }
    },
    configurable: true
});


Sprite_UIString.prototype._drawColor = function () {
    if (!this._blackColor) {
        /*var r = Math.randomInt(255)
        var g = Math.randomInt(255)
        var b = Math.randomInt(255)
        var a = 0.4
        this._blackColor = "rgba(" + r + "," + g + "," + b + "," + a + ")"*/
    }
    if (this._blackColor) {
        if (!this._blackColorType) {
            this.bitmap.fillAll(this._blackColor)
        } else if (this._blackColorType == 1) {
            //this.bitmap.fillCircle(this._blackColor)
        } else if (this._blackColorType == 2) {
            //this.bitmap.fillRoundedRectangle(5, this._blackColor)
        }
    }
}

/**
 * 绘制文本
 */
Sprite_UIString.prototype._drawText = function () {

    var l = this._text

    if (this._aw || this._ah) {

        if (!this._aw || this._aw == 1) {
            var w = this._sw
        } else {
            var w = Infinity
        }

        if (!this._ah || this._ah == 1) {
            var h = this._sh
        } else {
            var h = Infinity
        }

        if (Array.isArray(l)) {
            var uw = 0
            var uh = 0
            for (var i = 0; i < l.length; i++) {
                var t = l[i] || ""
                var texts = this.bitmap.window().testTextEx( t, 0, 0, w, h)
                var tw = !this._aw ? this._sw : test.x + test.w
                var th = !this._ah ? this._sh : test.y + test.h
                uw = Math.max(uw, Math.ceil(tw))
                uh = Math.max(uh, Math.ceil(th))
            } 
            w = uw
            h = uh
        } else   {
            var texts = this.bitmap.window().testTextEx( l , 0, 0, w, h)
            var page = texts.list[0]
            var test = page.test
            var w = !this._aw ? this._sw : test.x + test.w
            var h = !this._ah ? this._sh : test.y + test.h
            w = Math.ceil(w)
            h = Math.ceil(h)
        }
        if (w != this.bitmap.width || h != this.bitmap.height) {
            this.bitmap = new Bitmap(w, h)
        }
    }
    this.bitmap.clear()

    this._drawColor()
    var win = this.bitmap.window()

    if (Array.isArray(l)) {
        for (var i = 0; i < l.length; i++) {
            var t = l[i] || ""
            win.drawTextEx(t, 0, 0, this.bitmap.width, this.bitmap.height)
        }
    } else   {
        win.drawTextEx(l, 0, 0, this.bitmap.width, this.bitmap.height)
    } 
}


Sprite_UIString.addEmpty = function (n, l, t) {
    var v = "" + n
    while (v.length < l) {
        v = t ? v + " " : " " + v
    }
    return v
}


 