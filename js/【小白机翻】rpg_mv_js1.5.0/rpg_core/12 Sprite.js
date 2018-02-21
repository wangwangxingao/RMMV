/**-----------------------------------------------------------------------------*/
/**呈现游戏画面的基本对象。
 * The basic object that is rendered to the game screen.
 * 精灵
 * @class Sprite
 * @constructor
 * @param {Bitmap} bitmap The image for the sprite
 */
function Sprite() {
    this.initialize.apply(this, arguments);
}

Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.voidFilter = new PIXI.filters.VoidFilter();
/**初始化*/
Sprite.prototype.initialize = function(bitmap) {
    var texture = new PIXI.Texture(new PIXI.BaseTexture());

    PIXI.Sprite.call(this, texture);

    this._bitmap = null;
    this._frame = new Rectangle();
    this._realFrame = new Rectangle();

    this._blendColor = [0, 0, 0, 0];
    this._colorTone = [0, 0, 0, 0];
    this._canvas = null;
    this._context = null;
    this._tintTexture = null;

    /**使用笨重渲染，这将减少边界失真和运用先进混合模式
     * use heavy renderer that will reduce border artifacts and apply advanced blendModes
     * @type {boolean}
     * @private
     */
    this._isPicture = false;

    this.spriteId = Sprite._counter++;
    this.opaque = false;

    this.bitmap = bitmap;
};
/**创建的对象的数量*/
/** Number of the created objects.*/
Sprite._counter = 0;

/**图像
 * 精灵的图像
 * The image for the sprite.
 *
 * @property bitmap
 * @type Bitmap
 */
Object.defineProperty(Sprite.prototype, 'bitmap', {
    get: function() {
        return this._bitmap;
    },
    set: function(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
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

/**宽
 * 无刻度精灵的宽度
 * The width of the sprite without the scale.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Sprite.prototype, 'width', {
    get: function() {
        return this._frame.width;
    },
    set: function(value) {
        this._frame.width = value;
        this._refresh();
    },
    configurable: true
});

/**高
 * 无刻度精灵的高度
 * The height of the sprite without the scale.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Sprite.prototype, 'height', {
    get: function() {
        return this._frame.height;
    },
    set: function(value) {
        this._frame.height = value;
        this._refresh();
    },
    configurable: true
});

/**不透明度
 * 精灵（0〜255）的不透明度
 * The opacity of the sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */
Object.defineProperty(Sprite.prototype, 'opacity', {
    get: function() {
        return this.alpha * 255;
    },
    set: function(value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**更新
 * 更新了精灵的每一帧
 * Updates the sprite for each frame.
 *
 * @method update
 */
Sprite.prototype.update = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**移动
 * 设置x和y
 * Sets the x and y at once.
 *
 * @method move
 * @param {number} x The x coordinate of the sprite
 * @param {number} y The y coordinate of the sprite
 */
Sprite.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

/**设置框
 * 
 * 重设设置位图精灵显示
 * Sets the rectagle of the bitmap that the sprite displays.
 * @method setFrame
 * @param {number} x The x coordinate of the frame
 * @param {number} y The y coordinate of the frame
 * @param {number} width The width of the frame
 * @param {number} height The height of the frame
 */
Sprite.prototype.setFrame = function(x, y, width, height) {
    this._refreshFrame = false;
    var frame = this._frame;
    if (x !== frame.x || y !== frame.y ||
        width !== frame.width || height !== frame.height) {
        frame.x = x;
        frame.y = y;
        frame.width = width;
        frame.height = height;
        this._refresh();
    }
};

/**获取混合色
 * 获取精灵的混合色
 * Gets the blend color for the sprite.
 *
 * @method getBlendColor
 * @return {[number,number,number,number]} The blend color [r, g, b, a]
 */
Sprite.prototype.getBlendColor = function() {
    return this._blendColor.clone();
};

/**设置混合色
 * 设置精灵混合色 
 * Sets the blend color for the sprite.
 * 
 * @method setBlendColor 
 * @param {[number,number,number,number]} color The blend color [r, g, b, a] 
 */
Sprite.prototype.setBlendColor = function(color) {
    if (!(color instanceof Array)) {
        throw new Error('Argument must be an array');
    }
    if (!this._blendColor.equals(color)) {
        this._blendColor = color.clone();
        this._refresh();
    }
};

/**获取色调
 * 获取精灵的色调
 * Gets the color tone for the sprite.
 * 
 * @method getColorTone
 * @return {[number,number,number,number]} The color tone [r, g, b, gray]
 */
Sprite.prototype.getColorTone = function() {
    return this._colorTone.clone();
};

/**设置色调
 * 设置精灵色调
 * Sets the color tone for the sprite.
 *
 * @method setColorTone
 * @param {[number,number,number,number]} tone The color tone [r, g, b, gray]
 */
Sprite.prototype.setColorTone = function(tone) {
    if (!(tone instanceof Array)) {
        throw new Error('Argument must be an array');
    }
    if (!this._colorTone.equals(tone)) {
        this._colorTone = tone.clone();
        this._refresh();
    }
};

/**当位图读取
 * @method _onBitmapLoad
 * @private
 */
Sprite.prototype._onBitmapLoad = function(bitmapLoaded) {
    if (bitmapLoaded === this._bitmap) {
        if (this._refreshFrame && this._bitmap) {
            this._refreshFrame = false;
            this._frame.width = this._bitmap.width;
            this._frame.height = this._bitmap.height;
        }
    }
    this._refresh();
};

/**刷新
 * @method _refresh
 * @private
 */
Sprite.prototype._refresh = function() {
    //框x
    var frameX = Math.floor(this._frame.x);
    var frameY = Math.floor(this._frame.y);
    var frameW = Math.floor(this._frame.width);
    var frameH = Math.floor(this._frame.height);
    //位图宽
    var bitmapW = this._bitmap ? this._bitmap.width : 0;
    var bitmapH = this._bitmap ? this._bitmap.height : 0;
    //真x = 框x 在之间(0,位图宽)
    var realX = frameX.clamp(0, bitmapW);
    //真y = 框y 在之间(0,位图高)
    var realY = frameY.clamp(0, bitmapH);
    //真宽 = (框宽 - 真x + 框x) 在之间(0 , 位图宽 - 真x)
    var realW = (frameW - realX + frameX).clamp(0, bitmapW - realX);
    var realH = (frameH - realY + frameY).clamp(0, bitmapH - realY);

    this._realFrame.x = realX;
    this._realFrame.y = realY;
    this._realFrame.width = realW;
    this._realFrame.height = realH;
    //中心点 x = 框x -  真x 
    this.pivot.x = frameX - realX;
    this.pivot.y = frameY - realY;

    if (realW > 0 && realH > 0) {
        if (this._needsTint()) {
            this._createTinter(realW, realH);
            this._executeTint(realX, realY, realW, realH);
            this._tintTexture.update();
            this.texture.baseTexture = this._tintTexture;
            this.texture.frame = new Rectangle(0, 0, realW, realH);
        } else {
            if (this._bitmap) {
                this.texture.baseTexture = this._bitmap.baseTexture;
            }
            this.texture.frame = this._realFrame;
        }
    } else if (this._bitmap) {
        this.texture.frame = Rectangle.emptyRectangle;
    } else {
        //TODO: remove this
        //TODO: 移除它
        this.texture.baseTexture.width = Math.max(this.texture.baseTexture.width, this._frame.x + this._frame.width);
        this.texture.baseTexture.height = Math.max(this.texture.baseTexture.height, this._frame.y + this._frame.height);
        this.texture.frame = this._frame;
    }
    this.texture._updateID++;
};

/**是在位图矩形
 * @method _isInBitmapRect
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @return {boolean}
 * @private
 */
Sprite.prototype._isInBitmapRect = function(x, y, w, h) {
    return (this._bitmap && x + w > 0 && y + h > 0 &&
        x < this._bitmap.width && y < this._bitmap.height);
};

/**需要着色
 * @method _needsTint
 * @return {boolean}
 * @private
 */
Sprite.prototype._needsTint = function() {
    var tone = this._colorTone;
    return tone[0] || tone[1] || tone[2] || tone[3] || this._blendColor[3] > 0;
};

/**清除着色
 * @method _createTinter
 * @param {number} w
 * @param {number} h
 * @private
 */
Sprite.prototype._createTinter = function(w, h) {
    if (!this._canvas) {
        this._canvas = document.createElement('canvas');
        this._context = this._canvas.getContext('2d');
    }

    this._canvas.width = w;
    this._canvas.height = h;

    if (!this._tintTexture) {
        this._tintTexture = new PIXI.BaseTexture(this._canvas);
    }

    this._tintTexture.width = w;
    this._tintTexture.height = h;
    this._tintTexture.scaleMode = this._bitmap.baseTexture.scaleMode;
};

/**执行着色
 * @method _executeTint
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @private
 */
Sprite.prototype._executeTint = function(x, y, w, h) {
    var context = this._context;
    var tone = this._colorTone;
    var color = this._blendColor;

    context.globalCompositeOperation = 'copy';
    context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);

    if (Graphics.canUseSaturationBlend()) {
        var gray = Math.max(0, tone[3]);
        context.globalCompositeOperation = 'saturation';
        context.fillStyle = 'rgba(255,255,255,' + gray / 255 + ')';
        context.fillRect(0, 0, w, h);
    }

    var r1 = Math.max(0, tone[0]);
    var g1 = Math.max(0, tone[1]);
    var b1 = Math.max(0, tone[2]);
    context.globalCompositeOperation = 'lighter';
    context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
    context.fillRect(0, 0, w, h);

    if (Graphics.canUseDifferenceBlend()) {
        context.globalCompositeOperation = 'difference';
        context.fillStyle = 'white';
        context.fillRect(0, 0, w, h);

        var r2 = Math.max(0, -tone[0]);
        var g2 = Math.max(0, -tone[1]);
        var b2 = Math.max(0, -tone[2]);
        context.globalCompositeOperation = 'lighter';
        context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
        context.fillRect(0, 0, w, h);

        context.globalCompositeOperation = 'difference';
        context.fillStyle = 'white';
        context.fillRect(0, 0, w, h);
    }

    var r3 = Math.max(0, color[0]);
    var g3 = Math.max(0, color[1]);
    var b3 = Math.max(0, color[2]);
    var a3 = Math.max(0, color[3]);
    context.globalCompositeOperation = 'source-atop';
    context.fillStyle = Utils.rgbToCssColor(r3, g3, b3);
    context.globalAlpha = a3 / 255;
    context.fillRect(0, 0, w, h);

    context.globalCompositeOperation = 'destination-in';
    context.globalAlpha = 1;
    context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
};



Sprite.prototype._renderCanvas_PIXI = PIXI.Sprite.prototype._renderCanvas;
Sprite.prototype._renderWebGL_PIXI = PIXI.Sprite.prototype._renderWebGL;

/**提供画布
 * @method _renderCanvas
 * @param {{}} renderer
 * @private
 */
Sprite.prototype._renderCanvas = function(renderer) {
    if (this.bitmap) {
        this.bitmap.touch();
    }
    if (this.bitmap && !this.bitmap.isReady()) {
        return;
    }

    if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
        this._renderCanvas_PIXI(renderer);
    }
};

/**加速自定义混合模式
 * 检查是否需要我们加速自定义的混合模式
 * checks if we need to speed up custom blendmodes
 * @param renderer
 * @private
 */
Sprite.prototype._speedUpCustomBlendModes = function(renderer) {
    var picture = renderer.plugins.picture;
    var blend = this.blendMode;
    if (renderer.renderingToScreen && renderer._activeRenderTarget.root) {
        if (picture.drawModes[blend]) {
            var stage = renderer._lastObjectRendered;
            var f = stage._filters;
            if (!f || !f[0]) {
                setTimeout(function() {
                    var f = stage._filters;
                    if (!f || !f[0]) {
                        stage.filters = [Sprite.voidFilter];
                        stage.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
                    }
                }, 0);
            }
        }
    }
};

/**提供webgl
 * @method _renderWebGL
 * @param {{}} renderer
 * @private
 */
Sprite.prototype._renderWebGL = function(renderer) {
    if (this.bitmap) {
        this.bitmap.touch();
    }
    if (this.bitmap && !this.bitmap.isReady()) {
        return;
    }
    if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
        if (this._bitmap) {
            this._bitmap.checkDirty();
        }

        //copy of pixi-v4 internal code
        //拷贝pixi-v4的内部代码
        this.calculateVertices();

        if (this._isPicture) {
            // use heavy renderer, which reduces artifacts and applies corrent blendMode,
            //使用笨重渲染器，从而降低了失真和运用先进混合模式
            // but does not use multitexture optimization
            //但不使用多种纹理优化
            this._speedUpCustomBlendModes(renderer);
            renderer.setObjectRenderer(renderer.plugins.picture);
            renderer.plugins.picture.render(this);
        } else {
            // use pixi super-speed renderer
            //使用Pixi的超高速渲染
            renderer.setObjectRenderer(renderer.plugins.sprite);
            renderer.plugins.sprite.render(this);
        }
    }
};


/** The important members from Pixi.js*/
/** Pixi.js的重要成员*/

/**精灵的可见度
 * The visibility of the sprite.
 *
 * @property visible
 * @type Boolean
 */

/**精灵的X坐标。
 * The x coordinate of the sprite.
 *
 * @property x
 * @type Number
 */

/**精灵的y坐标
 * The y coordinate of the sprite.
 *
 * @property y
 * @type Number
 */

/**精灵的原点
 * The origin point of the sprite. (0,0) to (1,1).
 *
 * @property anchor
 * @type Point
 */

/**精灵的比例因子
 * The scale factor of the sprite.
 *
 * @property scale
 * @type Point
 */

/**精灵的旋转弧度
 * The rotation of the sprite in radians.
 *
 * @property rotation
 * @type Number
 */

/**应用到子画面的混合模式
 * The blend mode to be applied to the sprite.
 *
 * @property blendMode
 * @type Number
 */

/**设置精灵的过滤器
 * Sets the filters for the sprite.
 *
 * @property filters
 * @type Array
 */

/**[只读]精灵子项的数组
 * [read-only] The array of children of the sprite.
 *
 * @property children
 * @type Array
 */

/**[只读]包含精灵的对象
 * [read-only] The object that contains the sprite.
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