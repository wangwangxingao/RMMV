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
    this._cbhk.x = this._pageW + (this.get("cbhkx") || 0)
    this._cbhk.width = this.get("cbhkw") || 0
    this._cbhkh = this.get("cbhkh") || 0
    this._cbhk.margin = this.get("cbhkl") || 0
}




/**更新滑块 */
Sprite_XinXi.prototype.updateCbhk = function () {
    this._cbhk.width = this.get("cbhkw") || 0
    this._cbhkh = this.get("cbhkh") || 0
    this._cbhk.margin = this.get("cbhkl") || 0
    this._cbhk.x = this._pageW + (this.get("cbhkx") || 0)
    this.refresh()
}




/**滑块移动到 */
Sprite_XinXi.prototype.onHKTo = function (x, y) {
    if (this._cblb) {
        if (this._cbhk.height < this._cbl.bitmap.height) {
            var y = y / (this._cbl.bitmap.height - this._cbhk.height) * Math.max(1, this._allH - this._pageH)
        } else {
            var y = y / this._cbl.bitmap.height * this._allH
        }
    } else {
        var y = y / this._pageH * this._allH
    }
    this.showToY(y)
}

/**
 * 滑块移动
 * 
 */
Sprite_XinXi.prototype.onHKMove = function (x, y) {
    if (this._cblb) {
        if (this._cbhk.height < this._cbl.bitmap.height) {
            var y = y / (this._cbl.bitmap.height - this._cbhk.height) * Math.max(1, this._allH - this._pageH)
        } else {
            var y = y / this._cbl.bitmap.height * this._allH
        }
    } else {
        var y = y / this._pageH * this._allH
    }
    this.showMoveY(y)
}




/**设置滑块比例 */
Sprite_XinXi.prototype.setScrollBarScale = function () {
    if (this._allH && this._allH > this._pageH) {
        var scale = this._pageH / this._allH
        if (this._cblb) {
            var scale = this._cbl.bitmap.height * scale
        } else {
            var scale = (this._pageH) * scale
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



/**移动滚动条位置到目前位置 */
Sprite_XinXi.prototype.moveScrollBarToShow = function () {
    if (this._allH && this._cbhk.height) {
        if (this._cblb) {
            if (this._cbhk.height < this._cbl.bitmap.height) {
                var y = (this._cbl.bitmap.height - this._cbhk.height) / Math.max(1, this._allH - this._pageH) * this._showY
            } else {
                var y = (this._cbl.bitmap.height / this._allH) * this._showY
            }
        } else {
            var y = (this._pageH / this._allH) * this._showY
        }
        this._cbhk.y = this._cbl.y + y
        this._cbhk.visible = true
        this._cbl.visible = true
    } else {
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

    //宽 = 0
    this._width = 0;
    //高 = 0 
    this._height = 0;
    /**边缘  = 4 */
    this._margin = 4;


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


/**刷新所有部分
 * @method refreshAllParts
 * @private
 */
Sprite_kuang.prototype.refreshAllParts = function () {
    this.refreshBack();
    this.refreshFrame();
};

/**刷新背景
 * @method refreshBack
 * @private
 */
Sprite_kuang.prototype.refreshBack = function () {

    this.bitmap.fillAll("#000")
};

/**刷新框
 * @method refreshFrame
 * @private
 */
Sprite_kuang.prototype.refreshFrame = function () {
    var w = this._width;
    var h = this._height;
    var m = this._margin;
    var x = m
    var y = m
    var w = w - m - m
    var h = h - m - m
    this.bitmap.fillRect(x, y, w, h, "#fff")
};



