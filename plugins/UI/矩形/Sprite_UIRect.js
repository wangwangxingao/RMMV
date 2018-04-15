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