
//-----------------------------------------------------------------------------
/**描绘图像的基本对象
 * The basic object that represents an image.
 * 位图 
 * @class Bitmap 
 * @constructor
 * @param {Number} width The width of the bitmap
 * @param {Number} height The height of the bitmap
 */
 
//位图
function Bitmap() {
	//初始化
    this.initialize.apply(this, arguments);
}
//初始化
Bitmap.prototype.initialize = function(width, height) {
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

/**加载一个图像文件，并返回一个新的位图对象。
 * Loads a image file and returns a new bitmap object.
 *
 * @static
 * @method load
 * @param {String} url The image url of the texture
 * @return Bitmap
 */
Bitmap.load = function(url) {
    var bitmap = new Bitmap();
    bitmap._image = new Image(); 

    bitmap._url = url;
    bitmap._isLoading = true;

    if(!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
        Decrypter.decryptImg(url, bitmap);
    } else {
        bitmap._image.src = url;
        bitmap._image.onload = Bitmap.prototype._onLoad.bind(bitmap);
        bitmap._image.onerror = Bitmap.prototype._onError.bind(bitmap);
    }

    return bitmap;
};

/**取游戏画面的快照，并返回一个新的位图对象。
 * Takes a snapshot of the game screen and returns a new bitmap object.
 *
 * @static
 * @method snap
 * @param {Stage} stage The stage object
 * @return Bitmap
 */
//拍摄
Bitmap.snap = function(stage) {
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

/**检查位图是否是已经做好准备
 * Checks whether the bitmap is ready to render.
 *
 * @method isReady
 * @return {Boolean} True if the bitmap is ready to render
 */
//是准备好
Bitmap.prototype.isReady = function() {
    return !this._isLoading;
};

/**检查是否发生了错误装载。
 * Checks whether a loading error has occurred.
 *
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */
//是错误 
Bitmap.prototype.isError = function() {
    return this._hasError;
};

/**触摸资源
 * touch the resource
 * @method touch
 */
//触摸
Bitmap.prototype.touch = function() {
    if (this.cacheEntry) {
        this.cacheEntry.touch();
    }
};


/**[只读]图像文件的URL。
 * [read-only] The url of the image file.
 *
 * @property url
 * @type String
 */
//定义属性 URL
Object.defineProperty(Bitmap.prototype, 'url', {
    //获得 
    get: function() {
        return this._url;
    },
    configurable: true
});

/**[只读]基础纹理保存图像。
 * [read-only] The base texture that holds the image.
 *
 * @property baseTexture
 * @type PIXI.BaseTexture
 */
//定义属性 基础纹理
Object.defineProperty(Bitmap.prototype, 'baseTexture', {
    //获得 
    get: function() {
        return this._baseTexture;
    },
    configurable: true
});

/**[只读]位图的画布。
 * [read-only] The bitmap canvas.
 *
 * @property canvas
 * @type HTMLCanvasElement
 */
//定义属性 画布
Object.defineProperty(Bitmap.prototype, 'canvas', {
    //获得 
    get: function() {
        return this._canvas;
    },
    configurable: true
});

/**[只读]位图的画布的2D环境。
 * [read-only] The 2d context of the bitmap canvas.
 *
 * @property context
 * @type CanvasRenderingContext2D
 */
//定义属性 环境
Object.defineProperty(Bitmap.prototype, 'context', {
    //获得 
    get: function() {
        return this._context;
    },
    configurable: true
});

/**[只读]位图的宽度。
 * [read-only] The width of the bitmap.
 *
 * @property width
 * @type Number
 */
//定义属性 宽
Object.defineProperty(Bitmap.prototype, 'width', {
    //获得 
    get: function() {
        return this._isLoading ? 0 : this._canvas.width;
    },
    configurable: true
});

/**[只读]位图的高度。
 * [read-only] The height of the bitmap.
 *
 * @property height
 * @type Number
 */
//定义属性 高
Object.defineProperty(Bitmap.prototype, 'height', {
    //获得 
    get: function() {
        return this._isLoading ? 0 : this._canvas.height;
    },
    configurable: true
});

/** [只读]位图的矩形
 * [read-only] The rectangle of the bitmap.
 *
 * @property rect
 * @type Rectangle
 */
//定义属性 矩形
Object.defineProperty(Bitmap.prototype, 'rect', {
    //获得 
    get: function() {
        return new Rectangle(0, 0, this.width, this.height);
    },
    configurable: true
});

/**是否应用平滑缩放
 * Whether the smooth scaling is applied.
 *
 * @property smooth
 * @type Boolean
 */
//定义属性 平滑
Object.defineProperty(Bitmap.prototype, 'smooth', {
    //获得 
    get: function() {
        return this._smooth;
    },
    set: function(value) {
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

/**在范围（0，255）的绘图对象的不透明度。
 * The opacity of the drawing object in the range (0, 255).
 *
 * @property paintOpacity
 * @type Number
 */
//定义属性 不透明度
Object.defineProperty(Bitmap.prototype, 'paintOpacity', {
    //获得 
    get: function() {
        return this._paintOpacity;
    },
    set: function(value) {
      if (this._paintOpacity !== value) {
          this._paintOpacity = value;
          this._context.globalAlpha = this._paintOpacity / 255;
      }
    },
    configurable: true
});

/**调整位图大小
 * Resizes the bitmap.
 *
 * @method resize
 * @param {Number} width The new width of the bitmap
 * @param {Number} height The new height of the bitmap
 */
//重设大小
Bitmap.prototype.resize = function(width, height) {
    width = Math.max(width || 0, 1);
    height = Math.max(height || 0, 1);
    this._canvas.width = width;
    this._canvas.height = height;
    this._baseTexture.width = width;
    this._baseTexture.height = height;
};

/**执行一个块传输
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
//块传输
Bitmap.prototype.blt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
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

/**执行块传输，采用假设原始图像没有被修改（无色调）
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
//块传输图像
Bitmap.prototype.bltImage = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    if (sx >= 0 && sy >= 0 && sw > 0 && sh > 0 && dw > 0 && dh > 0 &&
        sx + sw <= source.width && sy + sh <= source.height) {
        this._context.globalCompositeOperation = 'source-over';
        this._context.drawImage(source._image, sx, sy, sw, sh, dx, dy, dw, dh);
        this._setDirty();
    }
};

/**返回指定点像素的颜色。
 * Returns pixel color at the specified point.
 *
 * @method getPixel
 * @param {Number} x The x coordinate of the pixel in the bitmap
 * @param {Number} y The y coordinate of the pixel in the bitmap
 * @return {String} The pixel color (hex format)
 */
//获得像素
Bitmap.prototype.getPixel = function(x, y) {
    var data = this._context.getImageData(x, y, 1, 1).data;
    var result = '#';
    for (var i = 0; i < 3; i++) {
        result += data[i].toString(16).padZero(2);
    }
    return result;
};

/**返回指定点透明像素值。
 * Returns alpha pixel value at the specified point.
 *
 * @method getAlphaPixel
 * @param {Number} x The x coordinate of the pixel in the bitmap
 * @param {Number} y The y coordinate of the pixel in the bitmap
 * @return {String} The alpha value
 */
//获得透明像素
Bitmap.prototype.getAlphaPixel = function(x, y) {
    var data = this._context.getImageData(x, y, 1, 1).data;
    return data[3];
};

/**清除指定的矩形
 * Clears the specified rectangle.
 *
 * @method clearRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to clear
 * @param {Number} height The height of the rectangle to clear
 */
//清除矩形
Bitmap.prototype.clearRect = function(x, y, width, height) {
    //环境 清除矩形(x,y,宽,高)
    this._context.clearRect(x, y, width, height);
    //设置发生更改()
    this._setDirty();
};

/**清除整个位图。
 * Clears the entire bitmap.
 *
 * @method clear
 */
//清除
Bitmap.prototype.clear = function() {
    //清除矩形(0,0,宽,高)
    this.clearRect(0, 0, this.width, this.height);
};

/**填充指定的矩形
 * Fills the specified rectangle.
 *
 * @method fillRect
 * @param {Number} x The x coordinate for the upper-left corner
 * @param {Number} y The y coordinate for the upper-left corner
 * @param {Number} width The width of the rectangle to clear
 * @param {Number} height The height of the rectangle to clear
 * @param {String} color The color of the rectangle in CSS format
 */
//填充矩形
Bitmap.prototype.fillRect = function(x, y, width, height, color) {
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

/**填充整个位图
 * Fills the entire bitmap.
 *
 * @method fillAll
 * @param {String} color The color of the rectangle in CSS format
 */
//填充所有
Bitmap.prototype.fillAll = function(color) {
    //填充矩形(0,0,宽,高)
    this.fillRect(0, 0, this.width, this.height, color);
};

/**绘制具有层次的矩形
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
//层次填充矩形
Bitmap.prototype.gradientFillRect = function(x, y, width, height, color1,
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

/**绘制实心圆
 * Draw the filled circle.
 *
 * @method drawCircle
 * @param {Number} x The x coordinate of the center of the circle
 * @param {Number} y The y coordinate of the center of the circle
 * @param {Number} radius The radius of the circle
 * @param {String} color The color of the circle in CSS format
 */
//绘制圆
Bitmap.prototype.drawCircle = function(x, y, radius, color) {
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

/**绘制轮廓文本的位图
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
//绘制文本
Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
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

/**返回指定文本的宽度
 * Returns the width of the specified text.
 *
 * @method measureTextWidth
 * @param {String} text The text to be measured
 * @return {Number} The width of the text in pixels
 */
//测量文本宽
Bitmap.prototype.measureTextWidth = function(text) {
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

/**改变整个位图的色调
 * Changes the color tone of the entire bitmap.
 *
 * @method adjustTone
 * @param {Number} r The red strength in the range (-255, 255)
 * @param {Number} g The green strength in the range (-255, 255)
 * @param {Number} b The blue strength in the range (-255, 255)
 */
//调整色调
Bitmap.prototype.adjustTone = function(r, g, b) {
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

/**旋转的整个位图的色相
 * Rotates the hue of the entire bitmap.
 *
 * @method rotateHue
 * @param {Number} offset The hue offset in 360 degrees
 */
//旋转色相
Bitmap.prototype.rotateHue = function(offset) {
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

/**位图模糊效果
 * Applies a blur effect to the bitmap.
 *
 * @method blur
 */
//模糊
Bitmap.prototype.blur = function() {
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

/**添加时对位图被加载时将调用的回调函数
 * Add a callback function that will be called when the bitmap is loaded.
 *
 * @method addLoadListener
 * @param {Function} listner The callback function
 */
//添加加载监听
Bitmap.prototype.addLoadListener = function(listner) {
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
//制作字体名称文本
Bitmap.prototype._makeFontNameText = function() {
    return (this.fontBold ? "bold ": '') + 
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
//绘制文本边缘
Bitmap.prototype._drawTextOutline = function(text, tx, ty, maxWidth) {
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
//绘制文本主体
Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth) {
    //环境 = 环境 
    var context = this._context;
    context.fillStyle = this.textColor;
    context.fillText(text, tx, ty, maxWidth);
};

/**当读取
 * @method _onLoad
 * @private
 */
//当读取
Bitmap.prototype._onLoad = function() {
    if(Decrypter.hasEncryptedImages) {
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
//呼叫读取监听
Bitmap.prototype._callLoadListeners = function() {
    while (this._loadListeners.length > 0) {
        var listener = this._loadListeners.shift();
        listener();
    }
};

/**当错误
 * @method _onError
 * @private
 */
//当错误
Bitmap.prototype._onError = function() {
    this._hasError = true;
};

/**设置发生更改
 * @method _setDirty
 * @private
 */
//设置发生更改
Bitmap.prototype._setDirty = function() {
    this._dirty = true;
};

/**更新纹理位图是发生更改
 * updates texture is bitmap was dirty
 * @method checkDirty
 */
//检查发生更改
Bitmap.prototype.checkDirty = function() {
    if (this._dirty) {
        this._baseTexture.update();
        this._dirty = false;
    }
};