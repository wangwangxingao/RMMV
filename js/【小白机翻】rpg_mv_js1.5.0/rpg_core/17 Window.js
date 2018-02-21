//-----------------------------------------------------------------------------
/**游戏中的窗口
 * The window in the game.
 * 窗口
 * @class Window
 * @constructor
 */
function Window() {
    this.initialize.apply(this, arguments);
}

Window.prototype = Object.create(PIXI.Container.prototype);
Window.prototype.constructor = Window;
//初始化
Window.prototype.initialize = function() {
    PIXI.Container.call(this);

    //是窗口 = true 
    this._isWindow = true;
    //窗口皮肤 = null
    this._windowskin = null;
    //宽 = 0
    this._width = 0;
    //高 = 0 
    this._height = 0;
    //光标矩形 = 新 矩形
    this._cursorRect = new Rectangle();
    //开放性 = 255
    this._openness = 255;
    //动画计数 = 0
    this._animationCount = 0;

    //填充 = 18 
    this._padding = 18;
    //边缘 = 4
    this._margin = 4;
    //颜色色调 = [0,0,0]
    this._colorTone = [0, 0, 0];



    //窗口精灵容器 = null
    this._windowSpriteContainer = null;
    //窗口背景精灵 = null
    this._windowBackSprite = null;
    //窗口光标精灵 = null
    this._windowCursorSprite = null;
    //窗口框精灵 = null
    this._windowFrameSprite = null;
    //窗口内容精灵 = null
    this._windowContentsSprite = null;
    //窗口箭头精灵组 = []
    this._windowArrowSprites = [];
    //窗口等待标志精灵 = null
    this._windowPauseSignSprite = null;

    //创建所有部分
    this._createAllParts();

    /**滚动窗口的原点
     * The origin point of the window for scrolling.
     *
     * @property origin
     * @type Point
     */
    this.origin = new Point();

    /**窗口的激活状态
     * The active state for the window.
     *
     * @property active
     * @type Boolean
     */
    this.active = true;

    /**向下滚动箭头的可视性
     * The visibility of the down scroll arrow.
     *
     * @property downArrowVisible
     * @type Boolean
     */
    this.downArrowVisible = false;

    /**向上滚动箭头的可视性
     * The visibility of the up scroll arrow.
     *
     * @property upArrowVisible
     * @type Boolean
     */
    this.upArrowVisible = false;

    /**暂停标志的可视性
     * The visibility of the pause sign.
     *
     * @property pause
     * @type Boolean
     */
    this.pause = false;
};

/**用作窗口皮肤的图像
 * The image used as a window skin.
 *
 * @property windowskin
 * @type Bitmap
 */
//定义属性 
Object.defineProperty(Window.prototype, 'windowskin', {
    get: function() {
        return this._windowskin;
    },
    set: function(value) {
        if (this._windowskin !== value) {
            this._windowskin = value;
            this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
        }
    },
    configurable: true
});

/**用于窗口内容的位图
 * The bitmap used for the window contents.
 *
 * @property contents
 * @type Bitmap
 */
//定义属性 
Object.defineProperty(Window.prototype, 'contents', {
    get: function() {
        return this._windowContentsSprite.bitmap;
    },
    set: function(value) {
        this._windowContentsSprite.bitmap = value;
    },
    configurable: true
});

/**窗口的宽度
 * The width of the window in pixels.
 *
 * @property width
 * @type Number
 */
//定义属性 
Object.defineProperty(Window.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        this._width = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**窗口的高度
 * The height of the window in pixels.
 *
 * @property height
 * @type Number
 */
//定义属性 
Object.defineProperty(Window.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        this._height = value;
        this._refreshAllParts();
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
Object.defineProperty(Window.prototype, 'padding', {
    get: function() {
        return this._padding;
    },
    set: function(value) {
        this._padding = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**窗口背景的边缘大小
 * The size of the margin for the window background.
 *
 * @property margin
 * @type Number
 */
//定义属性 
Object.defineProperty(Window.prototype, 'margin', {
    get: function() {
        return this._margin;
    },
    set: function(value) {
        this._margin = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**窗口的不透明度（0到255）
 * The opacity of the window without contents (0 to 255).
 *
 * @property opacity
 * @type Number
 */
//定义属性 
Object.defineProperty(Window.prototype, 'opacity', {
    get: function() {
        return this._windowSpriteContainer.alpha * 255;
    },
    set: function(value) {
        this._windowSpriteContainer.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**窗口背景的不透明度（0到255）
 * The opacity of the window background (0 to 255).
 *
 * @property backOpacity
 * @type Number
 */
//定义属性 
Object.defineProperty(Window.prototype, 'backOpacity', {
    get: function() {
        return this._windowBackSprite.alpha * 255;
    },
    set: function(value) {
        this._windowBackSprite.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**窗口内容的不透明度（0到255）
 * The opacity of the window contents (0 to 255).
 *
 * @property contentsOpacity
 * @type Number
 */
//定义属性 
Object.defineProperty(Window.prototype, 'contentsOpacity', {
    get: function() {
        return this._windowContentsSprite.alpha * 255;
    },
    set: function(value) {
        this._windowContentsSprite.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**窗口的的开放性（0到255）
 * The openness of the window (0 to 255).
 *
 * @property openness
 * @type Number
 */
//定义属性 
Object.defineProperty(Window.prototype, 'openness', {
    get: function() {
        return this._openness;
    },
    set: function(value) {
        if (this._openness !== value) {
            this._openness = value.clamp(0, 255);
            this._windowSpriteContainer.scale.y = this._openness / 255;
            this._windowSpriteContainer.y = this.height / 2 * (1 - this._openness / 255);
        }
    },
    configurable: true
});

/**更新每一帧的窗口
 * Updates the window for each frame.
 *
 * @method update
 */
Window.prototype.update = function() {
    if (this.active) {
        this._animationCount++;
    }
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**设置X，Y，宽度和高度
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {number} x The x coordinate of the window
 * @param {number} y The y coordinate of the window
 * @param {number} width The width of the window
 * @param {number} height The height of the window
 */
//移动 
Window.prototype.move = function(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    if (this._width !== width || this._height !== height) {
        this._width = width || 0;
        this._height = height || 0;
        this._refreshAllParts();
    }
};

/**如果窗口是完全开放的，则返回true（开放性== 255）
 * Returns true if the window is completely open (openness == 255).
 *
 * @method isOpen
 */
Window.prototype.isOpen = function() {
    return this._openness >= 255;
};

/**如果窗口完全关闭，则返回true（开放性== 0）
 * Returns true if the window is completely closed (openness == 0).
 *
 * @method isClosed
 */
Window.prototype.isClosed = function() {
    return this._openness <= 0;
};

/**设置命令光标的位置
 * Sets the position of the command cursor.
 *
 * @method setCursorRect
 * @param {number} x The x coordinate of the cursor
 * @param {number} y The y coordinate of the cursor
 * @param {number} width The width of the cursor
 * @param {number} height The height of the cursor
 */
Window.prototype.setCursorRect = function(x, y, width, height) {
    var cx = Math.floor(x || 0);
    var cy = Math.floor(y || 0);
    var cw = Math.floor(width || 0);
    var ch = Math.floor(height || 0);
    var rect = this._cursorRect;
    if (rect.x !== cx || rect.y !== cy || rect.width !== cw || rect.height !== ch) {
        this._cursorRect.x = cx;
        this._cursorRect.y = cy;
        this._cursorRect.width = cw;
        this._cursorRect.height = ch;
        this._refreshCursor();
    }
};

/**改变背景颜色
 * Changes the color of the background.
 *
 * @method setTone
 * @param {number} r The red value in the range (-255, 255)
 * @param {number} g The green value in the range (-255, 255)
 * @param {number} b The blue value in the range (-255, 255)
 */
Window.prototype.setTone = function(r, g, b) {
    var tone = this._colorTone;
    if (r !== tone[0] || g !== tone[1] || b !== tone[2]) {
        this._colorTone = [r, g, b];
        this._refreshBack();
    }
};

/**添加的背景和内容之间的子项
 * Adds a child between the background and contents.
 *
 * @method addChildToBack
 * @param {{}} child The child to add
 * @return {{}} The child that was added
 */
Window.prototype.addChildToBack = function(child) {
    var containerIndex = this.children.indexOf(this._windowSpriteContainer);
    return this.addChildAt(child, containerIndex + 1);
};

/**更新转换
 * @method updateTransform
 * @private
 */
Window.prototype.updateTransform = function() {
    this._updateCursor();
    this._updateArrows();
    this._updatePauseSign();
    this._updateContents();
    PIXI.Container.prototype.updateTransform.call(this);
};

/**创建所有部分
 * @method _createAllParts
 * @private
 */
Window.prototype._createAllParts = function() {
    //窗口精灵容器 = 新 pixi 显示对象容器
    this._windowSpriteContainer = new PIXI.Container();
    //窗口背景精灵
    this._windowBackSprite = new Sprite();
    //窗口光标精灵
    this._windowCursorSprite = new Sprite();
    //窗口框精灵
    this._windowFrameSprite = new Sprite();
    //窗口内容精灵
    this._windowContentsSprite = new Sprite();
    //下箭头精灵 = 
    this._downArrowSprite = new Sprite();
    //上箭头精灵
    this._upArrowSprite = new Sprite();
    //窗口等待标志精灵
    this._windowPauseSignSprite = new Sprite();
    //窗口背景精灵 位图 = 新 位图 (1,1)
    this._windowBackSprite.bitmap = new Bitmap(1, 1);
    //窗口背景精灵 不透明度 = 192/255
    this._windowBackSprite.alpha = 192 / 255;
    //添加子项( 窗口精灵容器  )
    this.addChild(this._windowSpriteContainer);
    //窗口精灵容器 添加子项( 窗口背景精灵  )
    this._windowSpriteContainer.addChild(this._windowBackSprite);
    //窗口精灵容器 添加子项( 窗口框精灵  )
    this._windowSpriteContainer.addChild(this._windowFrameSprite);
    //添加子项( 窗口光标精灵  )
    this.addChild(this._windowCursorSprite);
    //添加子项( 窗口内容精灵  )
    this.addChild(this._windowContentsSprite);
    //添加子项( 下箭头精灵  )
    this.addChild(this._downArrowSprite);
    //添加子项( 上箭头精灵  )
    this.addChild(this._upArrowSprite);
    //添加子项( 窗口等待标志精灵  )
    this.addChild(this._windowPauseSignSprite);
};

/**当窗口皮肤读取
 * @method _onWindowskinLoad
 * @private
 */
Window.prototype._onWindowskinLoad = function() {
    this._refreshAllParts();
};

/**刷新所有部分
 * @method _refreshAllParts
 * @private
 */
Window.prototype._refreshAllParts = function() {
    this._refreshBack();
    this._refreshFrame();
    this._refreshCursor();
    this._refreshContents();
    this._refreshArrows();
    this._refreshPauseSign();
};

/**刷新背景
 * @method _refreshBack
 * @private
 */
Window.prototype._refreshBack = function() {
    var m = this._margin;
    var w = this._width - m * 2;
    var h = this._height - m * 2;
    var bitmap = new Bitmap(w, h);

    this._windowBackSprite.bitmap = bitmap;
    this._windowBackSprite.setFrame(0, 0, w, h);
    this._windowBackSprite.move(m, m);

    if (w > 0 && h > 0 && this._windowskin) {
        var p = 96;
        bitmap.blt(this._windowskin, 0, 0, p, p, 0, 0, w, h);
        for (var y = 0; y < h; y += p) {
            for (var x = 0; x < w; x += p) {
                bitmap.blt(this._windowskin, 0, p, p, p, x, y, p, p);
            }
        }
        var tone = this._colorTone;
        bitmap.adjustTone(tone[0], tone[1], tone[2]);
    }
};

/**刷新框
 * @method _refreshFrame
 * @private
 */
Window.prototype._refreshFrame = function() {
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

/**刷新光标
 * @method _refreshCursor
 * @private
 */
Window.prototype._refreshCursor = function() {
    var pad = this._padding;
    var x = this._cursorRect.x + pad - this.origin.x;
    var y = this._cursorRect.y + pad - this.origin.y;
    var w = this._cursorRect.width;
    var h = this._cursorRect.height;
    var m = 4;
    var x2 = Math.max(x, pad);
    var y2 = Math.max(y, pad);
    var ox = x - x2;
    var oy = y - y2;
    var w2 = Math.min(w, this._width - pad - x2);
    var h2 = Math.min(h, this._height - pad - y2);
    var bitmap = new Bitmap(w2, h2);

    this._windowCursorSprite.bitmap = bitmap;
    this._windowCursorSprite.setFrame(0, 0, w2, h2);
    this._windowCursorSprite.move(x2, y2);

    if (w > 0 && h > 0 && this._windowskin) {
        var skin = this._windowskin;
        var p = 96;
        var q = 48;
        bitmap.blt(skin, p + m, p + m, q - m * 2, q - m * 2, ox + m, oy + m, w - m * 2, h - m * 2);
        bitmap.blt(skin, p + m, p + 0, q - m * 2, m, ox + m, oy + 0, w - m * 2, m);
        bitmap.blt(skin, p + m, p + q - m, q - m * 2, m, ox + m, oy + h - m, w - m * 2, m);
        bitmap.blt(skin, p + 0, p + m, m, q - m * 2, ox + 0, oy + m, m, h - m * 2);
        bitmap.blt(skin, p + q - m, p + m, m, q - m * 2, ox + w - m, oy + m, m, h - m * 2);
        bitmap.blt(skin, p + 0, p + 0, m, m, ox + 0, oy + 0, m, m);
        bitmap.blt(skin, p + q - m, p + 0, m, m, ox + w - m, oy + 0, m, m);
        bitmap.blt(skin, p + 0, p + q - m, m, m, ox + 0, oy + h - m, m, m);
        bitmap.blt(skin, p + q - m, p + q - m, m, m, ox + w - m, oy + h - m, m, m);
    }
};

/**刷新内容
 * @method _refreshContents
 * @private
 */
Window.prototype._refreshContents = function() {
    this._windowContentsSprite.move(this.padding, this.padding);
};

/**刷新箭头
 * @method _refreshArrows
 * @private
 */
Window.prototype._refreshArrows = function() {
    var w = this._width;
    var h = this._height;
    var p = 24;
    var q = p / 2;
    var sx = 96 + p;
    var sy = 0 + p;
    this._downArrowSprite.bitmap = this._windowskin;
    this._downArrowSprite.anchor.x = 0.5;
    this._downArrowSprite.anchor.y = 0.5;
    this._downArrowSprite.setFrame(sx + q, sy + q + p, p, q);
    this._downArrowSprite.move(w / 2, h - q);
    this._upArrowSprite.bitmap = this._windowskin;
    this._upArrowSprite.anchor.x = 0.5;
    this._upArrowSprite.anchor.y = 0.5;
    this._upArrowSprite.setFrame(sx + q, sy, p, q);
    this._upArrowSprite.move(w / 2, q);
};

/**刷新等待标志
 * @method _refreshPauseSign
 * @private
 */
Window.prototype._refreshPauseSign = function() {
    var sx = 144;
    var sy = 96;
    var p = 24;
    this._windowPauseSignSprite.bitmap = this._windowskin;
    this._windowPauseSignSprite.anchor.x = 0.5;
    this._windowPauseSignSprite.anchor.y = 1;
    this._windowPauseSignSprite.move(this._width / 2, this._height);
    this._windowPauseSignSprite.setFrame(sx, sy, p, p);
    this._windowPauseSignSprite.alpha = 0;
};

/**更新光标
 * @method _updateCursor
 * @private
 */
Window.prototype._updateCursor = function() {
    var blinkCount = this._animationCount % 40;
    var cursorOpacity = this.contentsOpacity;
    if (this.active) {
        if (blinkCount < 20) {
            cursorOpacity -= blinkCount * 8;
        } else {
            cursorOpacity -= (40 - blinkCount) * 8;
        }
    }
    this._windowCursorSprite.alpha = cursorOpacity / 255;
    this._windowCursorSprite.visible = this.isOpen();
};

/**更新内容
 * @method _updateContents
 * @private
 */
Window.prototype._updateContents = function() {
    var w = this._width - this._padding * 2;
    var h = this._height - this._padding * 2;
    if (w > 0 && h > 0) {
        this._windowContentsSprite.setFrame(this.origin.x, this.origin.y, w, h);
        this._windowContentsSprite.visible = this.isOpen();
    } else {
        this._windowContentsSprite.visible = false;
    }
};

/**更新箭头
 * @method _updateArrows
 * @private
 */
Window.prototype._updateArrows = function() {
    this._downArrowSprite.visible = this.isOpen() && this.downArrowVisible;
    this._upArrowSprite.visible = this.isOpen() && this.upArrowVisible;
};

/**更新等待标志
 * @method _updatePauseSign
 * @private
 */
Window.prototype._updatePauseSign = function() {
    var sprite = this._windowPauseSignSprite;
    var x = Math.floor(this._animationCount / 16) % 2;
    var y = Math.floor(this._animationCount / 16 / 2) % 2;
    var sx = 144;
    var sy = 96;
    var p = 24;
    if (!this.pause) {
        sprite.alpha = 0;
    } else if (sprite.alpha < 1) {
        sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
    }
    sprite.setFrame(sx + x * p, sy + y * p, p, p);
    sprite.visible = this.isOpen();
};

// The important members from Pixi.js
//Pixi.js的重要成员

/**窗口的可见性
 * The visibility of the window.
 *
 * @property visible
 * @type Boolean
 */

/**窗口的x坐标
 * The x coordinate of the window.
 *
 * @property x
 * @type Number
 */

/**窗口的y坐标
 * The y coordinate of the window.
 *
 * @property y
 * @type Number
 */

/**[只读]窗口子项的数组
 * [read-only] The array of children of the window.
 *
 * @property children
 * @type Array
 */

/**[只读]包含窗口的对象
 * [read-only] The object that contains the window.
 *
 * @property parent
 * @type Object
 */

/**容器增加子项
 * Adds a child to the container.
 *
 * @method addChild
 * @param {{}} child The child to add
 * @return {{}} The child that was added
 */

/**添加一个子项到容器中指定索引处
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {{}} child The child to add
 * @param {number} index The index to place the child in
 * @return {{}} The child that was added
 */

/**从容器中删除一个子项
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {{}} child The child to remove
 * @return {{}} The child that was removed
 */

/**从指定索引位置的删除一个子项
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {number} index The index to get the child from
 * @return {{}} The child that was removed
 */