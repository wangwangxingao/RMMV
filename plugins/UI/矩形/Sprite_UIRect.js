
function Sprite_UIBase() {
    this.initialize.apply(this, arguments);
}
Sprite_UIBase.prototype = Object.create(Sprite.prototype);
Sprite_UIBase.prototype.constructor = Sprite_UIBase;



Sprite_UIBase.prototype.initialize = function(set) {
    Sprite.prototype.initialize.call(this)
    if (set) {
        this.bitmap = new Bitmap(set[0], set[1])
    }
};;
///<jscompress sourcefile="Sprite_UIRect.js" />
function Sprite_UIRect() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIRect.prototype = Object.create(Sprite_UIBase.prototype);
/**设置创造者 */
Sprite_UIRect.prototype.constructor = Sprite_UIRect;
/**初始化 */
Sprite_UIRect.prototype.initialize = function(w, h, color) {
    Sprite_UIBase.prototype.initialize.call(this);
    this.bitmap = new Bitmap(w, h)
    this.long = 1
    this.color = color
};


/**设置长度 */
Object.defineProperty(Sprite_UIRect.prototype, 'long', {
    //获得 
    get: function() {
        return this._long;
    },
    set: function(value) {
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
    get: function() {
        return this._color;
    },
    set: function(value) {
        if (this._color !== value) {
            this._color = value
            this.bitmap.fillAll(value)
        }
    },
    configurable: true
});



function Sprite_UIRect2() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIRect2.prototype = Object.create(Sprite_UIBase.prototype);
/**设置创造者 */
Sprite_UIRect2.prototype.constructor = Sprite_UIRect2;
/**初始化 */
Sprite_UIRect2.prototype.initialize = function(bitmap) {
    Sprite_UIBase.prototype.initialize.call(this);
    this.bitmap = bitmap
    this.long = 1
};


/**设置长度 */
Object.defineProperty(Sprite_UIRect2.prototype, 'long', {
    //获得 
    get: function() {
        return this._long;
    },
    set: function(value) {
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
    get: function() {
        return this._bitmap;
    },
    set: function(value) {
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


Sprite_UIRect2.prototype._onBitmapLoad = function(b) {
    Sprite.prototype._onBitmapLoad.call(this, b)
    if (this.bitmap) {
        this.width = this.bitmap.width * this.long
    }
};
///<jscompress sourcefile="Sprite_UIString.js" />
function Sprite_UIString() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIString.prototype = Object.create(Sprite_UIBase.prototype);
/**设置创造者 */
Sprite_UIString.prototype.constructor = Sprite_UIString;
/**初始化 */
Sprite_UIString.prototype.initialize = function(w, h, text) {
    Sprite_UIBase.prototype.initialize.call(this);
    this.bitmap = new Bitmap(w, h)
    this.text = text || ""
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




function Sprite_UIString2() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIString2.prototype = Object.create(Sprite_UIString.prototype);
/**设置创造者 */
Sprite_UIString2.prototype.constructor = Sprite_UIString2;


Sprite_UIString2.prototype.initialize = function(w, h, text, text2) {
    Sprite_UIString.prototype.initialize.call(this);
    this.bitmap = new Bitmap(w, h)
    this.text = text || ""
    this.text2 = text2 || ""
};

/**设置长度 */
Object.defineProperty(Sprite_UIString2.prototype, 'text', {
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
    w.drawTextEx(this.text, 0, 0, this.bitmap.width, this.bitmap.height)
    w.drawTextEx(this.text2, 0, 0, this.bitmap.width, this.bitmap.height)
}; 









function Sprite_BlackString() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_BlackString.prototype = Object.create(Sprite_UIString.prototype);
/**设置创造者 */
Sprite_BlackString.prototype.constructor = Sprite_BlackString;
/**初始化 */
Sprite_BlackString.prototype.initialize = function(w, h, color) {
    this._blackColor = color
    Sprite_UIString.prototype.initialize.call(this, w, h);
};



Sprite_BlackString.prototype.setText = function(text) {
    var wt = "\\wt[1]"
    var f = "\\{}[16]"
    this.text = wt + f + text
};;










