
/**-----------------------------------------------------------------------------*/
/**描绘图像的基本对象
 * The basic object that represents an image.
 * 位图 
 * @class Bitmap 
 * @constructor
 * @param {Number} width The width of the bitmap
 * @param {Number} height The height of the bitmap
 */

/**位图*/
function Bitmap() {
    //初始化
    this.initialize.apply(this, arguments);
}

/**初始化
 * @param {Number} width The width of the bitmap
 * @param {Number} height The height of the bitmap
*/
Bitmap.prototype.initialize = function (width, height) {
    this._canvas = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
    this._canvas.width = Math.max(width || 0, 1);
    this._canvas.height = Math.max(height || 0, 1);
    this._baseTexture = new PIXI.BaseTexture(this._canvas);
    this._baseTexture.mipmap = false;
    this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    this._image = null;
    this._url = '';
    this._paintOpacity = 255;
    this._smooth = false;
    this._loadListeners = [];
    this._isLoading = false;
    this._hasError = false;

    /**缓存条目，为图像。在所有情况下_url 是相同的 缓存条目 键
     * Cache entry, for images. In all cases _url is the same as cacheEntry.key
     * @type CacheEntry
     */
    this.cacheEntry = null;

    /**字体
     * The face name of the font.
     *
     * @property fontFace
     * @type String
     */
    //字体 = 'GameFont'
    this.fontFace = 'GameFont';

    /**字体大小
     * The size of the font in pixels.
     *
     * @property fontSize
     * @type Number
     */
    //字体大小 = 28 
    this.fontSize = 28;

    /**黑体
     * Whether the font is bold.
     *
     * @property fontBold
     * @type Boolean
     */
    this.fontBold = false;

    /**斜体
     * Whether the font is italic.
     *
     * @property fontItalic
     * @type Boolean
     */
    //斜体 = false
    this.fontItalic = false;

    /**在CSS格式的文本的颜色。
     * The color of the text in CSS format.
     *
     * @property textColor
     * @type String
     */
    //文本颜色 = '#ffffff'
    this.textColor = '#ffffff';

    /**在CSS格式的文本轮廓的颜色。
     * The color of the outline of the text in CSS format.
     *
     * @property outlineColor
     * @type String
     */
    //轮廓颜色 = 'rgba(0, 0, 0, 0.5)'
    this.outlineColor = 'rgba(0, 0, 0, 0.5)';

    /**文字轮廓的宽度。
     * The width of the outline of the text.
     *
     * @property outlineWidth
     * @type Number
     */
    //轮廓宽度 = 4 
    this.outlineWidth = 4;
};

/**加载
 * 加载一个图像文件，并返回一个新的位图对象。
 * Loads a image file and returns a new bitmap object.
 *
 * @static
 * @method load
 * @param {String} url The image url of the texture
 * @return Bitmap
 */
Bitmap.load = function (url) {
    var bitmap = new Bitmap();
    bitmap._image = new Image();

    bitmap._url = url;
    bitmap._isLoading = true;

    if (!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
        Decrypter.decryptImg(url, bitmap);
    } else {
        bitmap._image.src = url;
        bitmap._image.onload = Bitmap.prototype._onLoad.bind(bitmap);
        bitmap._image.onerror = Bitmap.prototype._onError.bind(bitmap);
    }

    return bitmap;
};

/**拍摄
 * 
 * 取游戏画面的快照，并返回一个新的位图对象。
 * Takes a snapshot of the game screen and returns a new bitmap object.
 *
 * @static
 * @method snap
 * @param {Stage} stage The stage object
 * @return Bitmap
 */
Bitmap.snap = function (stage) {
    var width = Graphics.width;
    var height = Graphics.height;
    var bitmap = new Bitmap(width, height);
    var context = bitmap._context;
    var renderTexture = PIXI.RenderTexture.create(width, height);
    if (stage) {
        Graphics._renderer.render(stage, renderTexture);
        stage.worldTransform.identity();
        var canvas = null;
        if (Graphics.isWebGL()) {
            canvas = Graphics._renderer.extract.canvas(renderTexture);
        } else {
            canvas = renderTexture.baseTexture._canvasRenderTarget.canvas;
        }
        context.drawImage(canvas, 0, 0);
    } else {
        //TODO: Ivan: what if stage is not present?
        //TODO: 伊万：如果现阶段不存在呢？
    }
    renderTexture.destroy({ destroyBase: true });
    //位图 设置发生更改()
    bitmap._setDirty();
    return bitmap;
};

/**是准备好
 * 
 * 检查位图是否是已经做好准备
 * Checks whether the bitmap is ready to render.
 *
 * @method isReady
 * @return {Boolean} True if the bitmap is ready to render
 */
Bitmap.prototype.isReady = function () {
    return !this._isLoading;
};

/**是错误
 * 检查是否发生了错误装载。
 * Checks whether a loading error has occurred.
 *
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */
Bitmap.prototype.isError = function () {
    return this._hasError;
};

/**触摸
 * 触摸资源
 * touch the resource
 * @method touch
 */
Bitmap.prototype.touch = function () {
    if (this.cacheEntry) {
        this.cacheEntry.touch();
    }
};


/**URL
 * 
 * [只读]图像文件的URL。
 * [read-only] The url of the image file.
 *
 * @property url
 * @type String
 */
Object.defineProperty(Bitmap.prototype, 'url', {
    //获得 
    get: function () {
        return this._url;
    },
    configurable: true
});

/**基础纹理
 * [只读]基础纹理保存图像。
 * [read-only] The base texture that holds the image.
 *
 * @property baseTexture
 * @type PIXI.BaseTexture
 */
Object.defineProperty(Bitmap.prototype, 'baseTexture', {
    //获得 
    get: function () {
        return this._baseTexture;
    },
    configurable: true
});

/**画布
 * [只读]位图的画布。
 * [read-only] The bitmap canvas.
 *
 * @property canvas
 * @type HTMLCanvasElement
 */
Object.defineProperty(Bitmap.prototype, 'canvas', {
    //获得 
    get: function () {
        return this._canvas;
    },
    configurable: true
});

/**环境
 * [只读]位图的画布的2D环境。
 * [read-only] The 2d context of the bitmap canvas.
 *
 * @property context
 * @type CanvasRenderingContext2D
 */
Object.defineProperty(Bitmap.prototype, 'context', {
    //获得 
    get: function () {
        return this._context;
    },
    configurable: true
});

/**宽
 * [只读]位图的宽度。
 * [read-only] The width of the bitmap.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Bitmap.prototype, 'width', {
    //获得 
    get: function () {
        return this._isLoading ? 0 : this._canvas.width;
    },
    configurable: true
});

/**高
 * [只读]位图的高度。
 * [read-only] The height of the bitmap.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Bitmap.prototype, 'height', {
    //获得 
    get: function () {
        return this._isLoading ? 0 : this._canvas.height;
    },
    configurable: true
});

/**矩形
 * [只读]位图的矩形
 * [read-only] The rectangle of the bitmap.
 *
 * @property rect
 * @type Rectangle
 */
Object.defineProperty(Bitmap.prototype, 'rect', {
    //获得 
    get: function () {
        return new Rectangle(0, 0, this.width, this.height);
    },
    configurable: true
});

/**平滑
 * 是否应用平滑缩放
 * Whether the smooth scaling is applied.
 *
 * @property smooth
 * @type Boolean
 */
Object.defineProperty(Bitmap.prototype, 'smooth', {
    //获得 
    get: function () {
        return this._smooth;
    },
    set: function (value) {
        if (this._smooth !== value) {
            this._smooth = value;
            if (this._smooth) {
                this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
            } else {
                this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            }
        }
    },
    configurable: true
});

/**不透明度
 * 在范围（0，255）的绘图对象的不透明度。
 * The opacity of the drawing object in the range (0, 255).
 *
 * @property paintOpacity
 * @type Number
 */
Object.defineProperty(Bitmap.prototype, 'paintOpacity', {
    //获得 
    get: function () {
        return this._paintOpacity;
    },
    set: function (value) {
        if (this._paintOpacity !== value) {
            this._paintOpacity = value;
            this._context.globalAlpha = this._paintOpacity / 255;
        }
    },
    configurable: true
});

/**重设大小
 * 调整位图大小
 * Resizes the bitmap.
 *
 * @method resize
 * @param {Number} width The new width of the bitmap
 * @param {Number} height The new height of the bitmap
 */
Bitmap.prototype.resize = function (width, height) {
    width = Math.max(width || 0, 1);
    height = Math.max(height || 0, 1);
    this._canvas.width = width;
    this._canvas.height = height;
    this._baseTexture.width = width;
    this._baseTexture.height = height;
};

/**块传输
 * 执行一个块传输
 * Performs a block transfer.
 *
 * @method blt
 * @param {Bitmap} source The bitmap to draw
 * @param {Number} sx The x coordinate in the source
 * @param {Number} sy The y coordinate in the source
 * @param {Number} sw The width of the source image
 * @param {Number} sh The height of the source image
 * @param {Number} dx The x coordinate in the destination
 * @param {Number} dy The y coordinate in the destination
 * @param {Number} [dw=sw] The width to draw the image in the destination
 * @param {Number} [dh=sh] The height to draw the image in the destination
 */
Bitmap.prototype.blt = function (source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
        sx + sw <= source.width && sy + sh <= source.height) {
        this._context.globalCompositeOperation = 'source-over';
        this._context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
        //设置发生更改()
        this._setDirty();
    }
};

/**块传输图像
 * 执行块传输，采用假设原始图像没有被修改（无色调）
 * Performs a block transfer, using assumption that original image was not modified (no hue)
 *
 * @method blt
 * @param {Bitmap} source The bitmap to draw
 * @param {Number} sx The x coordinate in the source
 * @param {Number} sy The y coordinate in the source
 * @param {Number} sw The width of the source image
 * @param {Number} sh The height of the source image
 * @param {Number} dx The x coordinate in the destination
 * @param {Number} dy The y coordinate in the destination
 * @param {Number} [dw=sw] The width to draw the image in the destination
 * @param {Number} [dh=sh] The height to draw the image in the destination
 */
Bitmap.prototype.bltImage = function (source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
        sx + sw <= source.width && sy + sh <= source.height) {
        this._context.globalCompositeOperation = 'source-over';
        this._context.drawImage(source._image, sx, sy, sw, sh, dx, dy, dw, dh);
        this._setDirty();
    }
};

/**获得像素
 * 返回指定点像素的颜色。
 * Returns pixel color at the specified point.
 *
 * @method getPixel
 * @param {Number} x The x coordinate of the pixel in the bitmap
 * @param {Number} y The y coordinate of the pixel in the bitmap
 * @return {String} The pixel color (hex format)
 */
Bitmap.prototype.getPixel = function (x, y) {
    var data = this._context.getImageData(x, y, 1, 1).data;
    var result = '#';
    for (var i = 0; i < 3; i++) {
        result += data[i].toString(16).padZero(2);
    }
    return result;
};

/**获得透明像素
 * 返回指定点透明像素值。
 * Returns alpha pixel value at the specified point.
 *
 * @method getAlphaPixel
 * @param {Number} x The x coordinate of the pixel in the bitmap
 * @param {Number} y The y coordinate of the pixel in the bitmap
 * @return {String} The alpha value
 */
Bitmap.prototype.getAlphaPixel = function (x, y) {
    var data = this._context.getImageData(x, y, 1, 1).data;
    return data[3];
};

/**清除矩形
 * 清除指定的矩形
 * Clears the specified rectangle.
 *
 * @method clearRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to clear
 * @param {Number} height The height of the rectangle to clear
 */
Bitmap.prototype.clearRect = function (x, y, width, height) {
    //环境 清除矩形(x,y,宽,高)
    this._context.clearRect(x, y, width, height);
    //设置发生更改()
    this._setDirty();
};

/**清除
 * 清除整个位图。
 * Clears the entire bitmap.
 *
 * @method clear
 */
Bitmap.prototype.clear = function () {
    //清除矩形(0,0,宽,高)
    this.clearRect(0, 0, this.width, this.height);
};

/**填充矩形
 * 填充指定的矩形
 * Fills the specified rectangle.
 *
 * @method fillRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to clear
 * @param {Number} height The height of the rectangle to clear
 * @param {String} color The color of the rectangle in CSS format
 */
Bitmap.prototype.fillRect = function (x, y, width, height, color) {
    //环境 = 环境 
    var context = this._context;
    //环境 保存()
    context.save();
    //环境 填充状态 = 颜色
    context.fillStyle = color;
    //环境 填充矩形(x,y,宽,高)
    context.fillRect(x, y, width, height);
    //环境 恢复()
    context.restore();
    //设置发生更改()
    this._setDirty();
};

/**填充所有
 * 填充整个位图
 * Fills the entire bitmap.
 *
 * @method fillAll
 * @param {String} color The color of the rectangle in CSS format
 */
Bitmap.prototype.fillAll = function (color) {
    //填充矩形(0,0,宽,高)
    this.fillRect(0, 0, this.width, this.height, color);
};

/**层次填充矩形
 * 绘制具有层次的矩形
 * Draws the rectangle with a gradation.
 *
 * @method gradientFillRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to clear
 * @param {Number} height The height of the rectangle to clear
 * @param {String} color1 The start color of the gradation
 * @param {String} color2 The end color of the gradation
 * @param {Boolean} vertical Whether it draws a vertical gradient
 */
Bitmap.prototype.gradientFillRect = function (x, y, width, height, color1,
    color2, vertical) {
    //环境 = 环境 
    var context = this._context;
    var grad;
    if (vertical) {
        grad = context.createLinearGradient(x, y, x, y + height);
    } else {
        grad = context.createLinearGradient(x, y, x + width, y);
    }
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    context.save();
    context.fillStyle = grad;
    context.fillRect(x, y, width, height);
    context.restore();
    this._setDirty();
};

/**绘制圆
 * 绘制实心圆
 * Draw the filled circle.
 *
 * @method drawCircle
 * @param {Number} x The x coordinate of the center of the circle
 * @param {Number} y The y coordinate of the center of the circle
 * @param {Number} radius The radius of the circle
 * @param {String} color The color of the circle in CSS format
 */
Bitmap.prototype.drawCircle = function (x, y, radius, color) {
    //环境 = 环境
    var context = this._context;
    //环境 保存()
    context.save();
    //环境 填充状态 = 颜色
    context.fillStyle = color;
    //环境 开始路径()
    context.beginPath();
    //环境 弧形(x,y,半径,0,数学 PI * 2 ,false )
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    //环境 填充()
    context.fill();
    //环境 恢复()
    context.restore();
    //设置发生更改()
    this._setDirty();
};

/**绘制文本
 * 绘制轮廓文本的位图
 * Draws the outline text to the bitmap.
 *
 * @method drawText
 * @param {String} text The text that will be drawn
 * @param {Number} x The x coordinate for the left of the text
 * @param {Number} y The y coordinate for the top of the text
 * @param {Number} maxWidth The maximum allowed width of the text
 * @param {Number} lineHeight The height of the text line
 * @param {String} align The alignment of the text
 */
Bitmap.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
    // Note: Firefox has a bug with textBaseline: Bug 737852
    //       So we use 'alphabetic' here.
    //如果 (文本 !== 未定义 )
    if (text !== undefined) {
        //tx = x 
        var tx = x;
        //ty = y + 行高 - (行高 - 字体大小 * 0.7 ) / 2 
        var ty = y + lineHeight - (lineHeight - this.fontSize * 0.7) / 2;
        //环境 = 环境
        var context = this._context;
        //透明度 = 环境 透明度
        var alpha = context.globalAlpha;
        //最大宽 = 最大宽 或者  0xffffffff
        maxWidth = maxWidth || 0xffffffff;
        //如果(对齐 === "center"//中心 )
        if (align === 'center') {
            //tx += 最大宽 / 2
            tx += maxWidth / 2;
        }
        //如果(对齐 === "right"//右 )
        if (align === 'right') {
            //tx += 最大宽 
            tx += maxWidth;
        }
        //环境 保存()
        context.save();
        //环境 字体 = 制作字体名称文本()
        context.font = this._makeFontNameText();
        //环境 文本对齐 = 对齐
        context.textAlign = align;
        //环境 文本基线 = 字母基线
        context.textBaseline = 'alphabetic';
        //环境 透明度 = 1
        context.globalAlpha = 1;
        //绘制文本边缘(文本 , tx, ty , 最大宽 )
        this._drawTextOutline(text, tx, ty, maxWidth);
        //环境 透明度 = 透明度
        context.globalAlpha = alpha;
        //绘制文本主体(文本 , tx, ty , 最大宽 )
        this._drawTextBody(text, tx, ty, maxWidth);
        //环境 恢复()
        context.restore();
        //设置发生更改()
        this._setDirty();
    }
};

/**测量文本宽
 * 返回指定文本的宽度
 * Returns the width of the specified text.
 *
 * @method measureTextWidth
 * @param {String} text The text to be measured
 * @return {Number} The width of the text in pixels
 */
Bitmap.prototype.measureTextWidth = function (text) {
    //环境 = 环境 
    var context = this._context;
    //环境 保存()
    context.save();
    //环境 字体 = 制作字体名称文本()
    context.font = this._makeFontNameText();
    //宽 = 环境 测量文本(文本) 宽
    var width = context.measureText(text).width;
    //环境 恢复()
    context.restore();
    //返回 宽
    return width;
};

/**调整色调
 * 改变整个位图的色调
 * Changes the color tone of the entire bitmap.
 *
 * @method adjustTone
 * @param {Number} r The red strength in the range (-255, 255)
 * @param {Number} g The green strength in the range (-255, 255)
 * @param {Number} b The blue strength in the range (-255, 255)
 */
Bitmap.prototype.adjustTone = function (r, g, b) {
    if ((r || g || b) && this.width > 0 && this.height > 0) {
        //环境 = 环境 
        var context = this._context;
        var imageData = context.getImageData(0, 0, this.width, this.height);
        var pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            pixels[i + 0] += r;
            pixels[i + 1] += g;
            pixels[i + 2] += b;
        }
        context.putImageData(imageData, 0, 0);
        //设置发生更改()
        this._setDirty();
    }
};

/**旋转色相
 * 旋转的整个位图的色相
 * Rotates the hue of the entire bitmap.
 *
 * @method rotateHue
 * @param {Number} offset The hue offset in 360 degrees
 */
Bitmap.prototype.rotateHue = function (offset) {
    function rgbToHsl(r, g, b) {
        var cmin = Math.min(r, g, b);
        var cmax = Math.max(r, g, b);
        var h = 0;
        var s = 0;
        var l = (cmin + cmax) / 2;
        var delta = cmax - cmin;

        if (delta > 0) {
            if (r === cmax) {
                h = 60 * (((g - b) / delta + 6) % 6);
            } else if (g === cmax) {
                h = 60 * ((b - r) / delta + 2);
            } else {
                h = 60 * ((r - g) / delta + 4);
            }
            s = delta / (255 - Math.abs(2 * l - 255));
        }
        return [h, s, l];
    }

    function hslToRgb(h, s, l) {
        var c = (255 - Math.abs(2 * l - 255)) * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = l - c / 2;
        var cm = c + m;
        var xm = x + m;

        if (h < 60) {
            return [cm, xm, m];
        } else if (h < 120) {
            return [xm, cm, m];
        } else if (h < 180) {
            return [m, cm, xm];
        } else if (h < 240) {
            return [m, xm, cm];
        } else if (h < 300) {
            return [xm, m, cm];
        } else {
            return [cm, m, xm];
        }
    }

    if (offset && this.width > 0 && this.height > 0) {
        offset = ((offset % 360) + 360) % 360;
        var context = this._context;
        var imageData = context.getImageData(0, 0, this.width, this.height);
        var pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            var hsl = rgbToHsl(pixels[i + 0], pixels[i + 1], pixels[i + 2]);
            var h = (hsl[0] + offset) % 360;
            var s = hsl[1];
            var l = hsl[2];
            var rgb = hslToRgb(h, s, l);
            pixels[i + 0] = rgb[0];
            pixels[i + 1] = rgb[1];
            pixels[i + 2] = rgb[2];
        }
        context.putImageData(imageData, 0, 0);
        //设置发生更改()
        this._setDirty();
    }
};

/**模糊
 * 位图模糊效果
 * Applies a blur effect to the bitmap.
 *
 * @method blur
 */
Bitmap.prototype.blur = function () {
    for (var i = 0; i < 2; i++) {
        var w = this.width;
        var h = this.height;
        var canvas = this._canvas;
        //环境 = 环境 
        var context = this._context;
        var tempCanvas = document.createElement('canvas');
        var tempContext = tempCanvas.getContext('2d');
        tempCanvas.width = w + 2;
        tempCanvas.height = h + 2;
        tempContext.drawImage(canvas, 0, 0, w, h, 1, 1, w, h);
        tempContext.drawImage(canvas, 0, 0, w, 1, 1, 0, w, 1);
        tempContext.drawImage(canvas, 0, 0, 1, h, 0, 1, 1, h);
        tempContext.drawImage(canvas, 0, h - 1, w, 1, 1, h + 1, w, 1);
        tempContext.drawImage(canvas, w - 1, 0, 1, h, w + 1, 1, 1, h);
        context.save();
        context.fillStyle = 'black';
        context.fillRect(0, 0, w, h);
        context.globalCompositeOperation = 'lighter';
        context.globalAlpha = 1 / 9;
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                context.drawImage(tempCanvas, x, y, w, h, 0, 0, w, h);
            }
        }
        context.restore();
    }
    //设置发生更改()
    this._setDirty();
};

/**添加加载监听
 * 添加时对位图被加载时将调用的回调函数
 * Add a callback function that will be called when the bitmap is loaded.
 *
 * @method addLoadListener
 * @param {Function} listner The callback function
 */
Bitmap.prototype.addLoadListener = function (listner) {
    if (this._isLoading) {
        this._loadListeners.push(listner);
    } else {
        listner();
    }
};

/**制作字体名称文本
 * @method _makeFontNameText
 * @private
 */
Bitmap.prototype._makeFontNameText = function () {
    return (this.fontBold ? "bold " : '') +
        (this.fontItalic ? 'Italic ' : '') +
        this.fontSize + 'px ' + this.fontFace;
};

/**绘制文本边缘
 * @method _drawTextOutline
 * @param {String} text
 * @param {Number} tx
 * @param {Number} ty
 * @param {Number} maxWidth
 * @private
 */
Bitmap.prototype._drawTextOutline = function (text, tx, ty, maxWidth) {
    //环境 = 环境
    var context = this._context;
    //环境 笔触模式 = 
    context.strokeStyle = this.outlineColor;
    //环境 
    context.lineWidth = this.outlineWidth;
    context.lineJoin = 'round';
    context.strokeText(text, tx, ty, maxWidth);
};

/**绘制文本主体
 * @method _drawTextBody
 * @param {String} text
 * @param {Number} tx
 * @param {Number} ty
 * @param {Number} maxWidth
 * @private
 */
Bitmap.prototype._drawTextBody = function (text, tx, ty, maxWidth) {
    //环境 = 环境 
    var context = this._context;
    context.fillStyle = this.textColor;
    context.fillText(text, tx, ty, maxWidth);
};

/**当读取
 * @method _onLoad
 * @private
 */
Bitmap.prototype._onLoad = function () {
    if (Decrypter.hasEncryptedImages) {
        window.URL.revokeObjectURL(this._image.src);
    }
    this._isLoading = false;
    this.resize(this._image.width, this._image.height);
    this._context.drawImage(this._image, 0, 0);
    //设置发生更改()
    this._setDirty();
    this._callLoadListeners();
};

/**呼叫读取监听
 * @method _callLoadListeners
 * @private
 */
Bitmap.prototype._callLoadListeners = function () {
    while (this._loadListeners.length > 0) {
        var listener = this._loadListeners.shift();
        listener();
    }
};

/**当错误
 * @method _onError
 * @private
 */
Bitmap.prototype._onError = function () {
    this._hasError = true;
};

/**设置发生更改
 * @method _setDirty
 * @private
 */
Bitmap.prototype._setDirty = function () {
    this._dirty = true;
};

/**检查发生更改
 * 更新纹理位图是发生更改
 * updates texture is bitmap was dirty
 * @method checkDirty
 */
Bitmap.prototype.checkDirty = function () {
    if (this._dirty) {
        this._baseTexture.update();
        this._dirty = false;
    }
};


Bitmap.drawset = [["fillStyle", "strokeStyle", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "lineCap", "lineJoin", "lineWidth", "miterLimit", "font", "textAlign", "textBaseline", "globalAlpha", "globalCompositeOperation"], ["createLinearGradient", "createPattern", "createRadialGradient", "addColorStop", "rect", "fillRect", "strokeRect", "clearRect", "fill", "stroke", "beginPath", "moveTo", "closePath", "lineTo", "clip", "quadraticCurveTo", "bezierCurveTo", "arc", "arcTo", "isPointInPath", "scale", "rotate", "translate", "transform", "setTransform", "fillText", "strokeText", "measureText", "drawImage", "createImageData", "getImageData", "putImageData", "save", "restore", "createEvent", "getContext", "toDataURL"]]
/**绘制 
 * @param {[[String,Number]]} list
*/
Bitmap.prototype.draw = function (list) {
    //环境 = 环境 
    var context = this._context;
    //环境 保存()
    context.save();
    var type = function (typename) {
        if (Bitmap.drawset[0].indexOf(typename) >= 0) {
            return 2
        } else if (Bitmap.drawset[1].indexOf(typename) >= 0) {
            return 1
        } else {
            return 0
        }
    }
    for (var i = 0; i < list.length; i++) {
            var draw = list[i]
        try {
            var typename = draw[0]
            var t = type(typename)
            if (t == 1) {
                context[typename].apply(context, draw.slice(1))
            } else if (t == 2) {
                context[typename] = draw[1]
            }
        } catch (e) {
            console.log(draw)
        }
    }
    context.restore();
    //设置发生更改()
    this._setDirty();
};





 

/**fillStyle 属性设置或返回用于填充绘画的颜色、渐变或模式。 
    默认值： #000000 
    JavaScript 语法： context.fillStyle=color|gradient|pattern; 
    
    color 指示绘图填充色的 CSS 颜色值。默认值是 #000000。 
    gradient 用于填充绘图的渐变对象（线性或放射性） 
    pattern 用于填充绘图的 pattern 对象  
*/

 
/**strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式。 
    默认值： #000000 
    JavaScript 语法： context.strokeStyle=color|gradient|pattern; 

    属性值
    值 描述 
    color 指示绘图笔触颜色的 CSS 颜色值。默认值是 #000000。 
    gradient 用于填充绘图的渐变对象（线性或放射性） 
    pattern 用于创建 pattern 笔触的 pattern 对象  
*/



/**shadowColor 属性设置或返回用于阴影的颜色。 
    注释：请将 shadowColor 属性与 shadowBlur 属性一起使用，来创建阴影。

    提示：请通过使用 shadowOffsetX 和 shadowOffsetY 属性来调节阴影效果。

    默认值： #000000 
    JavaScript 语法： context.shadowColor=color; 

    属性值
    值 描述 
    color 用于阴影的 CSS 颜色值。默认值是 #000000。 

*/



/**shadowBlur 属性设置或返回阴影的模糊级数。

    默认值： #000000 
    JavaScript 语法： context.shadowBlur=number; 

    属性值
    值 描述 
    number 阴影的模糊级数 

*/



/**
 * 
 * shadowOffsetX 属性设置或返回形状与阴影的水平距离。

    shadowOffsetX=0 指示阴影位于形状的正下方。

    shadowOffsetX=20 指示阴影位于形状 left 位置右侧的 20 像素处。

    shadowOffsetX=-20 指示阴影位于形状 left 位置左侧的 20 像素处。

    提示：如需调整距离形状的垂直位置，请使用 shadowOffsetY 属性。

    默认值： 0 
    JavaScript 语法： context.shadowOffsetX=number; 

    属性值
    值 描述 
    number 正值或负值，定义阴影与形状的水平距离。 

*/
 

/**
     * shadowOffsetY 属性设置或返回形状与阴影的垂直距离。

    shadowOffsetY=0 指示阴影位于形状的正下方。

    shadowOffsetY=20 指示阴影位于形状 top 位置下方的 20 像素处。

    shadowOffsetY=-20 指示阴影位于形状 top 位置上方的 20 像素处。

    提示：如需调整距离形状的水平位置，请使用 shadowOffsetX 属性。

    默认值： 0 
    JavaScript 语法： context.shadowOffsetY=number; 

    属性值
    值 描述 
    number 正值或负值，定义阴影与形状的垂直距离。 

*/



/**
     * createLinearGradient() 方法创建线性的渐变对象。

    渐变可用于填充矩形、圆形、线条、文本等等。

    提示：请使用该对象作为 strokeStyle 或 fillStyle 属性的值。

    提示：请使用 addColorStop() 方法规定不同的颜色，以及在 gradient 对象中的何处定位颜色。

    JavaScript 语法：
    context.createLinearGradient(x0,y0,x1,y1);参数值
    参数 描述 
    x0 渐变开始点的 x 坐标 
    y0 渐变开始点的 y 坐标 
    x1 渐变结束点的 x 坐标 
    y1 渐变结束点的 y 坐标  
*/



/**
 * 
 * createPattern() 方法在指定的方向内重复指定的元素。

元素可以是图片、视频，或者其他 <canvas> 元素。

被重复的元素可用于绘制/填充矩形、圆形或线条等等。

JavaScript 语法：
context.createPattern(image,"repeat|repeat-x|repeat-y|no-repeat");参数值
参数 描述 
image 规定要使用的图片、画布或视频元素。 
repeat 默认。该模式在水平和垂直方向重复。 
repeat-x 该模式只在水平方向重复。 
repeat-y 该模式只在垂直方向重复。 
no-repeat 该模式只显示一次（不重复）。


*/



/**
 * createLinearGradient() 方法创建放射状/圆形渐变对象。

渐变可用于填充矩形、圆形、线条、文本等等。

提示：请使用该对象作为 strokeStyle 或 fillStyle 属性的值。

提示：请使用 addColorStop() 方法规定不同的颜色，以及在 gradient 对象中的何处定位颜色。

JavaScript 语法：
context.createRadialGradient(x0,y0,r0,x1,y1,r1);参数值
参数 描述 
x0 渐变的开始圆的 x 坐标 
y0 渐变的开始圆的 y 坐标 
r0 开始圆的半径 
x1 渐变的结束圆的 x 坐标 
y1 渐变的结束圆的 y 坐标 
r1 结束圆的半径 


*/



/**
     * addColorStop() 方法规定 gradient 对象中的颜色和位置。

    addColorStop() 方法与 createLinearGradient() 或 createRadialGradient() 一起使用。 

    注释：您可以多次调用 addColorStop() 方法来改变渐变。如果您不对 gradient 对象使用该方法，那么渐变将不可见。为了获得可见的渐变，您需要创建至少一个色标。

    JavaScript 语法：
    gradient.addColorStop(stop,color);参数值
    参数 描述 
    stop 介于 0.0 与 1.0 之间的值，表示渐变中开始与结束之间的位置。 
    color 在结束位置显示的 CSS 颜色值 

*/



/**lineCap 属性设置或返回线条末端线帽的样式。

注释："round" 和 "square" 会使线条略微变长。

默认值： butt 
JavaScript 语法： context.lineCap="butt|round|square"; 

属性值
值 描述 
butt 默认。向线条的每个末端添加平直的边缘。 
round 向线条的每个末端添加圆形线帽。 
square 向线条的每个末端添加正方形线帽。 




*/



/**lineJoin 属性设置或返回所创建边角的类型，当两条线交汇时。

注释：值 "miter" 受 miterLimit 属性的影响。

默认值： miter 
JavaScript 语法： context.lineJoin="bevel|round|miter"; 

属性值
值 描述 
bevel 创建斜角。 
round 创建圆角。 
miter 默认。创建尖角。 


*/



/**lineWidth 属性设置或返回当前线条的宽度，以像素计。

默认值： 1 
JavaScript 语法： context.lineWidth=number; 

属性值
值 描述 
number 当前线条的宽度，以像素计。 





*/



/**miterLimit 属性设置或返回最大斜接长度。

斜接长度指的是在两条线交汇处内角和外角之间的距离。

 
提示：只有当 lineJoin 属性为 "miter" 时，miterLimit 才有效。

边角的角度越小，斜接长度就会越大。

为了避免斜接长度过长，我们可以使用 miterLimit 属性。

如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示（图解 3）：

 默认值： 10 
JavaScript 语法： context.miterLimit=number; 

属性值
值 描述 
number 正数。规定最大斜接长度。

如果斜接长度超过 miterLimit 的值，边角会以 lineJoin 的 "bevel" 类型来显示。
 


*/



/**rect() 方法创建矩形。

提示：请使用 stroke() 或 fill() 方法在画布上实际地绘制矩形。

JavaScript 语法：
context.rect(x,y,width,height);参数值
参数 描述 
x 矩形左上角的 x 坐标 
y 矩形左上角的 y 坐标 
width 矩形的宽度，以像素计 
height 矩形的高度，以像素计  

*/



/**fillRect() 方法绘制“已填色”的矩形。默认的填充颜色是黑色。

提示：请使用 fillStyle 属性来设置用于填充绘图的颜色、渐变或模式。

JavaScript 语法：
context.fillRect(x,y,width,height);参数值
参数 描述 
x 矩形左上角的 x 坐标 
y 矩形左上角的 y 坐标 
width 矩形的宽度，以像素计 
height 矩形的高度，以像素计 



*/



/**strokeRect() 方法绘制矩形（不填色）。笔触的默认颜色是黑色。

提示：请使用 strokeStyle 属性来设置笔触的颜色、渐变或模式。

JavaScript 语法：
context.strokeRect(x,y,width,height);参数值
参数 描述 
x 矩形左上角的 x 坐标 
y 矩形左上角的 y 坐标 
width 矩形的宽度，以像素计 
height 矩形的高度，以像素计 



*/



/**clearRect() 方法清空给定矩形内的指定像素。
JavaScript 语法：
context.clearRect(x,y,width,height);
参数值
参数	描述
x	要清除的矩形左上角的 x 坐标
y	要清除的矩形左上角的 y 坐标
width	要清除的矩形的宽度，以像素计
height	要清除的矩形的高度，以像素计



*/



/**fill() 方法填充当前的图像（路径）。默认颜色是黑色。
提示：请使用 fillStyle 属性来填充另一种颜色/渐变。
注释：如果路径未关闭，那么 fill() 方法会从路径结束点到开始点之间添加一条线，以关闭该路径，然后填充该路径。
JavaScript 语法：
context.fill();




*/



/**stroke() 方法会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色。
提示：请使用 strokeStyle 属性来绘制另一种颜色/渐变。
JavaScript 语法：
context.stroke();



*/



/**
 * beginPath() 方法开始一条路径，或重置当前的路径。
提示：请使用这些方法来创建路径：moveTo()、lineTo()、quadricCurveTo()、bezierCurveTo()、arcTo() 以及 arc()。
提示：请使用 stroke() 方法在画布上绘制确切的路径。
JavaScript 语法：
context.fillRect(x,y,width,height);

 */



/**
moveTo() 移动到 。 
JavaScript 语法：
context.moveTo(x,y);
参数值
参数	描述
x	路径的目标位置的 x 坐标
y	路径的目标位置的 y 坐标  



 */



/**
closePath() 方法创建从当前点到开始点的路径。
提示：请使用 stroke() 方法在画布上绘制确切的路径。
提示：请使用 fill() 方法来填充图像（默认是黑色）。请使用 fillStyle 属性来填充另一个颜色/渐变。
JavaScript 语法：
context.closePath();


*/



/**
lineTo() 方法添加一个新点，然后创建从该点到画布中最后指定点的线条（该方法并不会创建线条）。
提示：请使用 stroke() 方法在画布上绘制确切的路径。
JavaScript 语法：
context.lineTo(x,y);
参数值
参数	描述
x	路径的目标位置的 x 坐标
y	路径的目标位置的 y 坐标


*/



/**
clip() 方法从原始画布中剪切任意形状和尺寸。
提示：一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。您也可以在使用 clip() 方法前通过使用 save() 方法对当前画布区域进行保存，并在以后的任意时间对其进行恢复（通过 restore() 方法）。
JavaScript 语法：
context.clip();


*/



/**
quadraticCurveTo() 方法通过使用表示二次贝塞尔曲线的指定控制点，向当前路径添加一个点。
提示：二次贝塞尔曲线需要两个点。第一个点是用于二次贝塞尔计算中的控制点，第二个点是曲线的结束点。曲线的开始点是当前路径中最后一个点。如果路径不存在，那么请使用 beginPath() 和 moveTo() 方法来定义开始点。
二次贝塞尔曲线
开始点：moveTo(20,20)
控制点：quadraticCurveTo(20,100,200,20)
结束点：quadraticCurveTo(20,100,200,20)
提示：请查看 bezierCurveTo() 方法。它有两个控制点，而不是一个。
JavaScript 语法：
context.quadraticCurveTo(cpx,cpy,x,y);
参数值
参数	描述
cpx	贝塞尔控制点的 x 坐标
cpy	贝塞尔控制点的 y 坐标
x	结束点的 x 坐标
y	结束点的 y 坐标


*/



/**
bezierCurveTo() 方法通过使用表示三次贝塞尔曲线的指定控制点，向当前路径添加一个点。
提示：三次贝塞尔曲线需要三个点。前两个点是用于三次贝塞尔计算中的控制点，第三个点是曲线的结束点。曲线的开始点是当前路径中最后一个点。如果路径不存在，那么请使用 beginPath() 和 moveTo() 方法来定义开始点。
三次贝塞尔曲线
开始点：moveTo(20,20)
控制点 1：bezierCurveTo(20,100,200,100,200,20)
控制点 2：bezierCurveTo(20,100,200,100,200,20)
结束点：bezierCurveTo(20,100,200,100,200,20)
提示：请查看 quadraticCurveTo() 方法。它有一个控制点，而不是两个。
JavaScript 语法：
context.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);
参数值
参数	描述
cp1x	第一个贝塞尔控制点的 x 坐标
cp1y	第一个贝塞尔控制点的 y 坐标
cp2x	第二个贝塞尔控制点的 x 坐标
cp2y	第二个贝塞尔控制点的 y 坐标
x	结束点的 x 坐标
y	结束点的 y 坐标




*/



/**
arc() 方法创建弧/曲线（用于创建圆或部分圆）。
提示：如需通过 arc() 来创建圆，请把起始角设置为 0，结束角设置为 2*Math.PI。
提示：请使用 stroke() 或 fill() 方法在画布上绘制实际的弧。
弧/曲线
中心：arc(100,75,50,0*Math.PI,1.5*Math.PI)
起始角：arc(100,75,50,0,1.5*Math.PI)
结束角：arc(100,75,50,0*Math.PI,1.5*Math.PI)
JavaScript 语法：
context.arc(x,y,r,sAngle,eAngle,counterclockwise);
参数值
参数	描述
x	圆的中心的 x 坐标。
y	圆的中心的 y 坐标。
r	圆的半径。
sAngle	起始角，以弧度计。（弧的圆形的三点钟位置是 0 度）。
eAngle	结束角，以弧度计。
counterclockwise	可选。规定应该逆时针还是顺时针绘图。False = 顺时针，true = 逆时针。


*/



/**
arcTo() 方法在画布上创建介于两个切线之间的弧/曲线。
提示：请使用 stroke() 方法在画布上绘制确切的弧。
JavaScript 语法：
context.fillRect(x1,y1,x2,y2,r);
参数值
参数	描述
x1	弧的起点的 x 坐标
y1	弧的起点的 y 坐标
x2	弧的终点的 x 坐标
y2	弧的终点的 y 坐标
r	弧的半径

*/



/**
isPointInPath() 方法返回 true，如果指定的点位于当前路径中；否则返回 false。
JavaScript 语法：
context.isPointInPath(x,y);
参数值
参数	描述
x	测试的 x 坐标
y	测试的 y 坐标

*/



/**
scale() 方法缩放当前绘图，更大或更小。
注释：如果您对绘图进行缩放，所有之后的绘图也会被缩放。定位也会被缩放。如果您 scale(2,2)，那么绘图将定位于距离画布左上角两倍远的位置。
JavaScript 语法：
context.scale(scalewidth,scaleheight);
参数值
参数	描述
scalewidth	缩放当前绘图的宽度 (1=100%, 0.5=50%, 2=200%, 依次类推)
scaleheight	缩放当前绘图的高度 (1=100%, 0.5=50%, 2=200%, etc.)








*/



/**
rotate() 方法旋转当前的绘图。
JavaScript 语法：
context.rotate(angle);
参数值
参数	描述
angle	
旋转角度，以弧度计。
如需将角度转换为弧度，请使用 degrees*Math.PI/180 公式进行计算。
举例：如需旋转 5 度，可规定下面的公式：5*Math.PI/180。


*/



/**
translate() 方法重新映射画布上的 (0,0) 位置。
注释：当您在 translate() 之后调用诸如 fillRect() 之类的方法时，值会添加到 x 和 y 坐标值上。
translate() 方法的图示
JavaScript 语法：
context.translate(x,y);
参数值
参数	描述
x	添加到水平坐标（x）上的值
y	添加到垂直坐标（y）上的值


*/



/**
画布上的每个对象都拥有一个当前的变换矩阵。
transform() 方法替换当前的变换矩阵。它以下面描述的矩阵来操作当前的变换矩阵：
a  c  e
b  d  f
0  0  1
换句话说，transform() 允许您缩放、旋转、移动并倾斜当前的环境。
注释：该变换只会影响 transform() 方法调用之后的绘图。
注释：transform() 方法的行为相对于由 rotate(), scale(), translate(), or transform() 完成的其他变换。例如：如果您已经将绘图设置为放到两倍，则 transform() 方法会把绘图放大两倍，您的绘图最终将放大四倍。
提示：请查看 setTransform() 方法，它不会相对于其他变换来发生行为。
JavaScript 语法：
context.transform(a,b,c,d,e,f);
参数值
参数	描述
a	水平缩放绘图
b	水平倾斜绘图
c	垂直倾斜绘图
d	垂直缩放绘图
e	水平移动绘图
f	垂直移动绘图



*/



/**
画布上的每个对象都拥有一个当前的变换矩阵。
setTransform() 方法把当前的变换矩阵重置为单位矩阵，然后以相同的参数运行 transform()。
换句话说，setTransform() 允许您缩放、旋转、移动并倾斜当前的环境。
注释：该变换只会影响 setTransform() 方法调用之后的绘图。
JavaScript 语法：
context.setTransform(a,b,c,d,e,f);
参数值
参数	描述
a	水平旋转绘图
b	水平倾斜绘图
c	垂直倾斜绘图
d	垂直缩放绘图
e	水平移动绘图
f	垂直移动绘图



*/



/**
font 属性设置或返回画布上文本内容的当前字体属性。
font 属性使用的语法与 CSS font 属性相同。
默认值：	10px sans-serif
JavaScript 语法：	context.font="italic small-caps bold 12px arial";
属性值
值	描述

font-style	规定字体样式。可能的值：
normal
italic
oblique

font-variant规定字体变体。可能的值：
normal
small-caps

font-weight	规定字体的粗细。可能的值：
normal
bold
bolder
lighter
100
200
300
400
500
600
700
800
900

font-size / line-height	规定字号和行高，以像素计。
font-family	规定字体系列。
caption	使用标题控件的字体（比如按钮、下拉列表等）。
icon	使用用于标记图标的字体。
menu	使用用于菜单中的字体（下拉列表和菜单列表）。
message-box	使用用于对话框中的字体。
small-caption	使用用于标记小型控件的字体。
status-bar	使用用于窗口状态栏中的字体。


*/



/**
textAlign 属性根据锚点，设置或返回文本内容的当前对齐方式。
通常，文本会从指定位置开始，不过，如果您设置为 textAlign="right" 并将文本放置到位置 150，那么会在位置 150 结束。
提示：使用 fillText() 或 strokeText() 方法在实际地在画布上绘制并定位文本。
默认值：	start
JavaScript 语法：	context.textAlign="center|end|left|right|start";
属性值
值	描述
start	默认。文本在指定的位置开始。
end	文本在指定的位置结束。
center	文本的中心被放置在指定的位置。
left	文本左对齐。
right	文本右对齐。


*/



/**
textBaseline 属性设置或返回在绘制文本时的当前文本基线。

下面的图示演示了 textBaseline 属性支持的各种基线：

文本基线图示 
注释：fillText() 或 strokeText() 方法在画布上定位文本时，将使用指定的 textBaseline 值。

默认值： alphabetic 
JavaScript 语法： context.textBaseline="alphabetic|top|hanging|middle|ideographic|bottom"; 

属性值
值 描述 
alphabetic 默认。文本基线是普通的字母基线。 
top 文本基线是 em 方框的顶端。。 
hanging 文本基线是悬挂基线。 
middle 文本基线是 em 方框的正中。 
ideographic 文本基线是表意基线。 
bottom 文本基线是 em 方框的底端。 




*/



/**
fillText() 方法在画布上绘制填色的文本。文本的默认颜色是黑色。

提示：请使用 font 属性来定义字体和字号，并使用 fillStyle 属性以另一种颜色/渐变来渲染文本。

JavaScript 语法：
context.fillText(text,x,y,maxWidth);参数值
参数 描述 
text 规定在画布上输出的文本。 
x 开始绘制文本的 x 坐标位置（相对于画布）。 
y 开始绘制文本的 y 坐标位置（相对于画布）。 
maxWidth 可选。允许的最大文本宽度，以像素计。 



*/



/**
strokeText() 方法在画布上绘制文本（没有填色）。文本的默认颜色是黑色。

提示：请使用 font 属性来定义字体和字号，并使用 strokeStyle 属性以另一种颜色/渐变来渲染文本。

JavaScript 语法：
context.strokeText(text,x,y,maxWidth);参数值
参数 描述 
text 规定在画布上输出的文本。 
x 开始绘制文本的 x 坐标位置（相对于画布）。 
y 开始绘制文本的 y 坐标位置（相对于画布）。 
maxWidth 可选。允许的最大文本宽度，以像素计。 


*/



/**返回包含一个包含以像素计的指定字体宽度的对象
 * measureText()  ， 
 * 参数 描述 
 * @param {String} text 要测量的文本。 
 * @return {{width:Number}}
*/
/*
Bitmap.prototype.measureText = function(text){


}
*/


/**绘制图像
 * drawImage()  
 * @param {Object} img 规定要使用的图像、画布或视频。
 * @param {Number} sx 可选。开始剪切的 x 坐标位置。 
 * @param {Number} sy 可选。开始剪切的 y 坐标位置。 
 * @param {Number} swidth 可选。被剪切图像的宽度。 
 * @param {Number} sheight 可选。被剪切图像的高度。 
 * @param {Number} x 在画布上放置图像的 x 坐标位置。
 * @param {Number} y 在画布上放置图像的 y 坐标位置。 
 * @param {Number} width 可选。要使用的图像的宽度。（伸展或缩小图像）
 * @param {Number} height 可选。要使用的图像的高度。（伸展或缩小图像）  
*/
/*
Bitmap.prototype.drawImage = function(img,sx,sy,swidth,sheight,x,y,width,height){


}
*/
/**创建新的空白 ImageData 对象
 * createImageData() 方法。
 * @param {Number} width ImageData 对象的宽度，以像素计。 || imageData 另一个 ImageData 对象。
 * @param {Number} height ImageData 对象的高度，以像素计。  
 * @return {ImageData:{width:Number ,height:Number,data:[Number] } } 
*/
/*
Bitmap.prototype.createImageData = function(width , height ){


}
*/
/**拷贝画布指定矩形的像素数据
 * getImageData()  
 * @param {Number} x 开始复制的左上角位置的 x 坐标。 
 * @param {Number} y 开始复制的左上角位置的 y 坐标。 
 * @param {Number} width 将要复制的矩形区域的宽度。 
 * @param {Number} height 将要复制的矩形区域的高度。 
 * 
 * @return {ImageData:{width:Number ,height:Number,data:[Number] } } 
*/
/*
Bitmap.prototype.getImageData = function(x,y,width,height){

}
*/
/** 方法将图像数据（从指定的 ImageData 对象）放回画布上
 * putImageData()。 
 * @param {{width:Number ,height:Number,data:[Number] } }  imgData 规定要放回画布的 ImageData 对象。 
 * @param {Number}  x ImageData 对象左上角的 x 坐标，以像素计。 
 * @param {Number}  y ImageData 对象左上角的 y 坐标，以像素计。 
 * @param {Number}  dirtyX 可选。水平值（x），以像素计，在画布上放置图像的位置。 
 * @param {Number}  dirtyY 可选。水平值（y），以像素计，在画布上放置图像的位置。 
 * @param {Number}  dirtyWidth 可选。在画布上绘制图像所使用的宽度。 
 * @param {Number}  dirtyHeight 可选。在画布上绘制图像所使用的高度。 
*//*
Bitmap.prototype.putImageData =function(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight){

}
*/
/** 透明度
globalAlpha 属性设置或返回绘图的当前透明值（alpha 或 transparency）。 
globalAlpha 属性值必须是介于 0.0（完全透明） 与 1.0（不透明） 之间的数字。 
默认值： 1.0 
JavaScript 语法： context.globalAlpha=number;  
属性值
值 描述 
number 透明值。必须介于 0.0（完全透明） 与 1.0（不透明） 之间。 

*/

/*
globalCompositeOperation 属性设置或返回如何将一个源（新的）图像绘制到目标（已有）的图像上。

源图像 = 您打算放置到画布上的绘图。

目标图像 = 您已经放置在画布上的绘图。

默认值： source-over 
JavaScript 语法： context.globalCompositeOperation="source-in"; 
 
source-over 默认。在目标图像上显示源图像。 
source-atop 在目标图像顶部显示源图像。源图像位于目标图像之外的部分是不可见的。 
source-in 在目标图像中显示源图像。只有目标图像内的源图像部分会显示，目标图像是透明的。 
source-out 在目标图像之外显示源图像。只会显示目标图像之外源图像部分，目标图像是透明的。 
destination-over 在源图像上方显示目标图像。 
destination-atop 在源图像顶部显示目标图像。源图像之外的目标图像部分不会被显示。 
destination-in 在源图像中显示目标图像。只有源图像内的目标图像部分会被显示，源图像是透明的。 
destination-out 在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的。 
lighter 显示源图像 + 目标图像。 
copy 显示源图像。忽略目标图像。 
source-over 使用异或操作对源图像与目标图像进行组合。 


*/



