



/**
 * 世界到局部xy
 * @param {number} y y
 * @return {number}  
 */
Sprite.prototype.worldToLocalXY = function (x, y, sprite) {
    var node = sprite || this;
    return node.worldTransform.applyInverse({ x: x, y: y }, { visible: node.worldVisible });
};


/**
* 是触摸输入自己 
* @param {boolean|number} b 是否不检查位图(每层-1)
* @param {boolean|number} c 是否检查子图(每层-1 ) 
* @param {boolean} up 是否是从上往下判断 
* 
*/
Sprite.prototype.isTouchInputThis = function (b, c, up) {
    var x = TouchInput.x
    var y = TouchInput.y
    var b = b === true ? -1 : b
    var c = c === true ? -1 : c
    this.isTouchThis(x, y, b, c, up)
}


/**
* 是触摸自己
* @param {number} x x坐标
* @param {number} y y坐标
* @param {boolean|number} b 是否不检查位图(每层-1)
* @param {boolean|number} c 是否检查子图(每层-1 ) 
* @param {boolean} up 是否是从上往下判断 
* 
*/
Sprite.prototype.isTouchThis = function (x, y, b, c, up) {
    if (this.visible) {
        var loc = this.worldToLocalXY(x, y)
        var lx = loc.x
        var ly = loc.y
        var lv = loc.visible
        if (lv) {
            if (c) {
                var b2 = b ? b - 1 : 0
                var c2 = c - 1
                var l = this.children.length
                if (up) {
                    for (var i = l - 1; i >= 0; i--) {
                        var s = this.children[i]
                        if (s && s.isTouchThis && s.isTouchThis(x, y, b2, c2, up)) {
                            return true
                        }
                    }
                    if (this.isTouchIn && this.isTouchIn(lx, ly, b)) {
                        return true
                    }
                } else {
                    if (this.isTouchIn && this.isTouchIn(lx, ly, b)) {
                        return true
                    }
                    for (var i = 0; i < l; i++) {
                        var s = this.children[i]
                        if (s && s.isTouchThis && s.isTouchThis(x, y, b2, c2, up)) {
                            return true
                        }
                    }
                }
            }
        }
    }
    return false
}


/**
 * 是在之中 
 * @param {number} x x坐标
 * @param {number} y y坐标
 * @param {boolean} type 不检查图片
 * 
 */
Sprite.prototype.isTouchIn = function (x, y, b) {
    if (this.anchor) {
        var x = x + this.anchor.x * this.width
        var y = y + this.anchor.y * this.height
    }
    return this.isTouchInFrame(x, y, b) && (b || this.isTouchInBitamp(x, y))
}


/**
 * 是在区域中
 * @param {number} x  x
 * @param {number} y  y
 * 
 * 
 */
Sprite.prototype.isTouchInFrame = function (x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};


/**
 * 是在位图上不透明点
 * @param {number} x  x
 * @param {number} y  y
 * 
 */
Sprite.prototype.isTouchInBitamp = function (x, y) {
    if (this._realFrame) {
        var x = x + this._realFrame.x
        var y = y + this._realFrame.y
    }
    if (this.bitmap && this.bitmap.getAlphaPixel(x, y)) {
        return true
        //console.log("bitmap")
    }
    return false
}






function Sprite_UIBase() {
    this.initialize.apply(this, arguments);
}
Sprite_UIBase.prototype = Object.create(Sprite.prototype);
Sprite_UIBase.prototype.constructor = Sprite_UIBase;



Sprite_UIBase.prototype.initialize = function (set) {
    Sprite.prototype.initialize.call(this)
    if (set) {
        this.bitmap = new Bitmap(set[0], set[1])
    }
};







/**文字精灵 */
function Sprite_UIString() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIString.prototype = Object.create(Sprite_UIBase.prototype);
/**设置创造者 */
Sprite_UIString.prototype.constructor = Sprite_UIString;
/**初始化 */
Sprite_UIString.prototype.initialize = function (w, h, text, color) {
    Sprite_UIBase.prototype.initialize.call(this);
    this.bitmap = new Bitmap(w, h)
    this.text = text || ""
    this._blackColor = color || ""
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



Sprite_UIString.prototype._drawColor = function () {
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

Sprite_UIString.prototype._drawText = function () {
    this.bitmap.clear()

    this._drawColor()
    var w = this.bitmap.window()
    var test = w.drawTextEx(this.text, 0, 0, this.bitmap.width, this.bitmap.height)
}


Sprite_UIString.addEmpty = function (n, l, t) {
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


Sprite_UIString2.prototype.initialize = function (w, h, text, text2, color) {
    Sprite_UIString.prototype.initialize.call(this);
    this.bitmap = new Bitmap(w, h)
    this.text = text || ""
    this.text2 = text2 || ""
    this.blackColor = color
};


Object.defineProperty(Sprite_UIString2.prototype, 'text2', {
    //获得 
    get: function () {
        return this._text2;
    },
    set: function (value) {
        if (this._text2 !== value) {
            this._text2 = value
            this._drawText()
        }
    },
    configurable: true
});


Sprite_UIString2.prototype._drawText = function () {
    this.bitmap.clear()
    this._drawColor()
    var w = this.bitmap.window()
    w.drawTextEx(this.text, 0, 0, this.bitmap.width, this.bitmap.height)
    w.drawTextEx(this.text2, 0, 0, this.bitmap.width, this.bitmap.height)
};



/**
 * 
 * 矩形 用于进度条
 * 
 * 
 */

function Sprite_UIRect() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIRect.prototype = Object.create(Sprite_UIBase.prototype);
/**设置创造者 */
Sprite_UIRect.prototype.constructor = Sprite_UIRect;
/**初始化 */
Sprite_UIRect.prototype.initialize = function (w, h, color) {
    Sprite_UIBase.prototype.initialize.call(this);
    this.bitmap = new Bitmap(w, h)
    this.long = 1
    this.color = color
};


/**设置长度 */
Object.defineProperty(Sprite_UIRect.prototype, 'long', {
    //获得 
    get: function () {
        return this._long;
    },
    set: function (value) {
        var value = value.clamp(0, 1)
        if (this._long !== value) {
            this._long = value
            this.width = this._long * this.bitmap.width
        }
    },
    configurable: true
});

/**设置颜色 */
Object.defineProperty(Sprite_UIRect.prototype, 'color', {
    //获得 
    get: function () {
        return this._color;
    },
    set: function (value) {
        if (this._color !== value) {
            this._color = value
            this.bitmap.fillAll(value)
        }
    },
    configurable: true
});



/**
 * 
 * 矩形2 用于图片做进度条
 * 
 * 
 */


function Sprite_UIRect2() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIRect2.prototype = Object.create(Sprite_UIBase.prototype);
/**设置创造者 */
Sprite_UIRect2.prototype.constructor = Sprite_UIRect2;
/**初始化 */
Sprite_UIRect2.prototype.initialize = function (bitmap) {
    Sprite_UIBase.prototype.initialize.call(this);
    this.bitmap = bitmap
    this.long = 1
};


/**设置长度 */
Object.defineProperty(Sprite_UIRect2.prototype, 'long', {
    //获得 
    get: function () {
        return this._long;
    },
    set: function (value) {
        var value = value.clamp(0, 1)
        if (this._long !== value) {
            this._long = value
            if (this._bitmap) {
                this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
            }
        }
    },
    configurable: true
});

/**设置颜色 */
Object.defineProperty(Sprite_UIRect2.prototype, 'bitmap', {
    //获得 
    get: function () {
        return this._bitmap;
    },
    set: function (value) {
        if (this._bitmap !== value) {
            this._bitmap = value
            if (value) {
                this._refreshFrame = true;
                value.addLoadListener(this._onBitmapLoad.bind(this));
            } else {
                this._refreshFrame = false;
                this.texture.frame = Rectangle.emptyRectangle;
            }
        }
    },
    configurable: true
});


Sprite_UIRect2.prototype._onBitmapLoad = function (b) {
    Sprite.prototype._onBitmapLoad.call(this, b)
    if (this.bitmap) {
        this.width = this.bitmap.width * this.long
    }
};