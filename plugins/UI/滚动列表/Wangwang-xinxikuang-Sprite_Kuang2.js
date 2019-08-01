//-----------------------------------------------------------------------------
/*:
 * @plugindesc 信息框体拖拽框
*/
/**游戏中的窗口
 * The Sprite_kuang in the game.
 * 窗口
 * @class Sprite_kuang
 * @constructor
 */


/**创建滑块 */
Sprite_XinXi.prototype.createCbhk = function () {
    this._cbhk = new Sprite_kuang()
    this.addChild(this._cbhk)
    this._cbhk.x = this._pageW +( this.get("cbhkx") || 0)
    this._cbhk.width = this.get("cbhkw") || 0
    this._cbhkh = this.get("cbhkh") || 0
    this._cbhkb = this.get("cbhkb") || ""
    this._cbhk.windowskin = ImageManager.loadPicture(this._cbhkb)
    //this._cbhk.windowskin = ImageManager.loadSystem('Window')(this._cbhkb)
}




/**更新滑块 */
Sprite_XinXi.prototype.updateCbhk = function () {
    var b = this.get("cbhkb") || ""
    if (this._cbhkb != b) {
        this._cbhkb = b
        this._cbhkb = this.get("cbhkb") || ""
        this._cbhk.windowskin = ImageManager.loadPicture(this._cbhkb)
    }
    if (this._cbhkb) {
        this._cbhk.x = this._pageW +( this.get("cbhkx") || 0)
    }
}



/**设置滑块比例 */
Sprite_XinXi.prototype.setScrollBarScale = function () {
    if (this._allH && this._allH > this._pageH) {
        var scale = this._pageH / this._allH
        if (this._cbhkb) {
            if (this._cblb) {
                var scale = this._cbl.bitmap.height * scale
            } else {
                var scale = (this._pageH) * scale
            }
        } else {
            var scale = scale
        }
        this._cbhk.height = Math.max(this._cbhkh, scale)
        this._cbhk.visible = true
        this._cbl.visible = true
    } else {
        this._cbhk.heigth = 0
        this._cbhk.visible = false
        this._cbl.visible = false
    }
}





function Sprite_kuang() {
    this.initialize.apply(this, arguments);
}

Sprite_kuang.prototype = Object.create(Sprite.prototype);
Sprite_kuang.prototype.constructor = Sprite_kuang;
//初始化
Sprite_kuang.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    //窗口皮肤 = null
    this._windowskin = null;
    //宽 = 0
    this._width = 0;
    //高 = 0 
    this._height = 0;
    //填充 = 18 
    this._padding = 18;
    /**边缘  = 4 */
    this._margin = 4;
    //颜色色调 = [0,0,0]
    this._colorTone = [0, 0, 0];


    //窗口背景精灵 = null
    this._windowBackSprite = null;
    //窗口框精灵 = null
    this._windowFrameSprite = null;
    this._createAllParts();

    this.bitmap = new Bitmap(this._width, this._height)
    //创建所有部分 
    /**滚动窗口的原点
     * The origin point of the Sprite_kuang for scrolling.
     *
     * @property origin
     * @type Point
     */
    this.origin = new Point();

};

/**用作窗口皮肤的图像
 * The image used as a Sprite_kuang skin.
 *
 * @property windowskin
 * @type Bitmap
 */
//定义属性 
Object.defineProperty(Sprite_kuang.prototype, 'windowskin', {
    get: function () {
        return this._windowskin;
    },
    set: function (value) {
        if (this._windowskin !== value) {
            this._windowskin = value;
            this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
        }
    },
    configurable: true
});


/**窗口的宽度
 * The width of the Sprite_kuang in pixels.
 *
 * @property width
 * @type Number
 */
//定义属性 
Object.defineProperty(Sprite_kuang.prototype, 'width', {
    get: function () {
        return this._width;
    },
    set: function (value) {
        if (this._width == value) { return }
        this._width = value;
        this.refreshBitmap()
        this.refreshAllParts();
    },
    configurable: true
});

/**窗口的高度
 * The height of the Sprite_kuang in pixels.
 *
 * @property height
 * @type Number
 */
//定义属性 
Object.defineProperty(Sprite_kuang.prototype, 'height', {
    get: function () {
        return this._height;
    },
    set: function (value) {
        if (this._height == value) { return }
        this._height = value;
        this.refreshBitmap()
        this.refreshAllParts();
    },
    configurable: true
});

/**框架和内容之间填充的大小
 * The size of the padding between the frame and contents.
 *
 * @property padding
 * @type Number
 */
//定义属性 
Object.defineProperty(Sprite_kuang.prototype, 'padding', {
    get: function () {
        return this._padding;
    },
    set: function (value) {
        if (this._padding == value) { return }
        this._padding = value;
        this.refreshAllParts();
    },
    configurable: true
});

/**窗口背景的边缘大小
 * The size of the margin for the Sprite_kuang background.
 *
 * @property margin
 * @type Number
 */
//定义属性 
Object.defineProperty(Sprite_kuang.prototype, 'margin', {
    get: function () {
        return this._margin;
    },
    set: function (value) {
        if (this._margin == value) { return }
        this._margin = value;
        this.refreshAllParts();
    },
    configurable: true
});

/**窗口背景的不透明度（0到255）
 * The opacity of the Sprite_kuang background (0 to 255).
 *
 * @property backOpacity
 * @type Number
 */
//定义属性 
Object.defineProperty(Sprite_kuang.prototype, 'backOpacity', {
    get: function () {
        return this._windowBackSprite.alpha * 255;
    },
    set: function (value) {
        this._windowBackSprite.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});


/**设置X，Y，宽度和高度
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {number} x The x coordinate of the Sprite_kuang
 * @param {number} y The y coordinate of the Sprite_kuang
 * @param {number} width The width of the Sprite_kuang
 * @param {number} height The height of the Sprite_kuang
 */
//移动 
Sprite_kuang.prototype.move = function (x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    if (this._width !== width || this._height !== height) {
        this._width = width || 0;
        this._height = height || 0;
        this.refreshBitmap()
        this.refreshAllParts();
    }
};

Sprite_kuang.prototype.refreshBitmap = function () {
    this.bitmap = new Bitmap(this._width, this._height)
}
/**创建所有部分
 * @method _createAllParts
 * @private
 */
Sprite_kuang.prototype._createAllParts = function () {
    //窗口背景精灵
    this._windowBackSprite = new Sprite();
    //窗口框精灵
    this._windowFrameSprite = new Sprite();

    //窗口背景精灵 位图 = 新 位图 (1,1)
    this._windowBackSprite.bitmap = new Bitmap(1, 1);
    //窗口背景精灵 不透明度 = 192/255
    //this._windowBackSprite.alpha = 192 / 255;
    //添加子项( 窗口精灵容器  )
    this.addChild(this._windowBackSprite);
    this.addChild(this._windowFrameSprite);
};

/**当窗口皮肤读取
 * @method _onWindowskinLoad
 * @private
 */
Sprite_kuang.prototype._onWindowskinLoad = function () {
    this.refreshAllParts();
};

/**刷新所有部分
 * @method refreshAllParts
 * @private
 */
Sprite_kuang.prototype.refreshAllParts = function () {
    this.refreshBack();
    console.log(this)
    this.refreshFrame();
};

/**刷新背景
 * @method refreshBack
 * @private
 */
Sprite_kuang.prototype.refreshBack = function () {
    //m = 边缘
    var m = this._margin;
    var w = this._width - m * 2;
    var h = this._height - m * 2;
    var bitmap = new Bitmap(w, h);

    this._windowBackSprite.bitmap = bitmap;
    this._windowBackSprite.setFrame(0, 0, w, h);
    this._windowBackSprite.move(m, m);

    //如果( w > 0 并且 h > 0 并且 窗口皮肤)
    if (w > 0 && h > 0 && this._windowskin) {
        //p = 96
        var p = 96;
        //图片 绘制(窗口皮肤,0,0,96,96,0,0,宽,高 )
        bitmap.blt(this._windowskin, 0, 0, p, p, 0, 0, w, h);
        //循环(y = 0 ;如果 y < 高 ;每一次 y += p )
        for (var y = 0; y < h; y += p) {
            //循环(x = 0 ;如果 x < 宽 ;每一次 x += p )
            for (var x = 0; x < w; x += p) {
                //图片 绘制(窗口,0,p,p,p,)
                bitmap.blt(this._windowskin, 0, p, p, p, x, y, p, p);
            }
        }
        var tone = this._colorTone;
        bitmap.adjustTone(tone[0], tone[1], tone[2]);
    }
};

/**刷新框
 * @method refreshFrame
 * @private
 */
Sprite_kuang.prototype.refreshFrame = function () {
    var w = this._width;
    var h = this._height;
    var m = 24;
    var bitmap = new Bitmap(w, h);

    this._windowFrameSprite.bitmap = bitmap;
    this._windowFrameSprite.setFrame(0, 0, w, h);

    if (w > 0 && h > 0 && this._windowskin) {
        var skin = this._windowskin;
        var p = 96;
        var q = 96;
        bitmap.blt(skin, p + m, 0 + 0, p - m * 2, m, m, 0, w - m * 2, m);
        bitmap.blt(skin, p + m, 0 + q - m, p - m * 2, m, m, h - m, w - m * 2, m);
        bitmap.blt(skin, p + 0, 0 + m, m, p - m * 2, 0, m, m, h - m * 2);
        bitmap.blt(skin, p + q - m, 0 + m, m, p - m * 2, w - m, m, m, h - m * 2);
        bitmap.blt(skin, p + 0, 0 + 0, m, m, 0, 0, m, m);
        bitmap.blt(skin, p + q - m, 0 + 0, m, m, w - m, 0, m, m);
        bitmap.blt(skin, p + 0, 0 + q - m, m, m, 0, h - m, m, m);
        bitmap.blt(skin, p + q - m, 0 + q - m, m, m, w - m, h - m, m, m);
    }
};



