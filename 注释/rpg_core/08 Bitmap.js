
/**-----------------------------------------------------------------------------*/
/**描绘图像的基本对象
 * The basic object that represents an image.
 * 位图 
 * @class Bitmap 
 * @constructor
 * @param {number} width The width of the bitmap
 * @param {number} height The height of the bitmap
 */
 
/**位图*/
function Bitmap() {
	//初始化
    this.initialize.apply(this, arguments);
}


//for iOS. img consumes memory. so reuse it.
Bitmap._reuseImages = [];


/**
 * Bitmap states(Bitmap._loadingState):
 *
 * none: 
 * Empty Bitmap
 * 空图片
 *
 * pending:
 * Url requested, but pending to load until startRequest called
 * 请求了Url，但挂起，直到调用startRequest
 *
 * purged:
 * Url request completed and purged.
 * 网址请求已完成并已清除。
 *
 * requesting:
 * Requesting supplied URI now.
 * 现在请求提供的URI。
 *
 * requestCompleted:
 * Request completed
 * 请求已完成
 *
 * decrypting:
 * requesting encrypted data from supplied URI or decrypting it.
 * 从提供的URI请求加密数据或解密它。
 *
 * decryptCompleted:
 * Decrypt completed   
 * 解密完成
 *
 * loaded:
 * loaded. isReady() === true, so It's usable. 
 * 是读取后的 
 *
 * error:
 * error occurred  
 * 是错误的
 *
 */

/**
 * 创建画布
 * @param {number} width 宽
 * @param {number} height 高
 * 
 */
Bitmap.prototype._createCanvas = function(width, height){
    this.__canvas = this.__canvas || document.createElement('canvas');
    this.__context = this.__canvas.getContext('2d');

    this.__canvas.width = Math.max(width || 0, 1);
    this.__canvas.height = Math.max(height || 0, 1);

    //如果 图像
    if(this._image){

        var w = Math.max(this._image.width || 0, 1);
        var h = Math.max(this._image.height || 0, 1);
        //修改画布宽
        this.__canvas.width = w;
        //修改画布高
        this.__canvas.height = h;
        //创建基础纹理(画布)
        this._createBaseTexture(this._canvas);
        //
        this.__context.drawImage(this._image, 0, 0);
    }

    this._setDirty();
};

/**
 * 创建基础纹理
 * @param {Image} source 图片
 * 
 */
Bitmap.prototype._createBaseTexture = function(source){
    this.__baseTexture = new PIXI.BaseTexture(source);
    this.__baseTexture.mipmap = false;
    this.__baseTexture.width = source.width;
    this.__baseTexture.height = source.height;

    if (this._smooth) {
        this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    } else {
        this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }
};

/**清除图像实例 */
Bitmap.prototype._clearImgInstance = function(){
    this._image.src = "";
    this._image.onload = null;
    this._image.onerror = null;
    this._errorListener = null;
    this._loadListener = null;

    Bitmap._reuseImages.push(this._image);
    this._image = null;
};

//
//We don't want to waste memory, so creating canvas is deferred.
//
Object.defineProperties(Bitmap.prototype, {
    /**画布 */
    _canvas: {
        get: function(){
            if(!this.__canvas)this._createCanvas();
            return this.__canvas;
        }
    },
    /**环境 */
    _context: {
        get: function(){
            if(!this.__context)this._createCanvas();
            return this.__context;
        }
    },

    /**基础纹理 */
    _baseTexture: {
        get: function(){
            if(!this.__baseTexture) this._createBaseTexture(this._image || this.__canvas);
            return this.__baseTexture;
        }
    }
});

/**
 * 更换新画布 
 * 
*/
Bitmap.prototype._renewCanvas = function(){
    //新图像 = 图像
    var newImage = this._image;
    if(newImage && this.__canvas && (this.__canvas.width < newImage.width || this.__canvas.height < newImage.height)){
        this._createCanvas();
    }
};

/**初始化
 * @param {number} width The width of the bitmap
 * @param {number} height The height of the bitmap
*/
Bitmap.prototype.initialize = function(width, height) {
    if(!this._defer){
        this._createCanvas(width, height);
    }

    this._image = null;
    this._url = '';
    this._paintOpacity = 255;
    this._smooth = false;
    this._loadListeners = [];
    this._loadingState = 'none';
    this._decodeAfterRequest = false;

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
 * @param {string} url The image url of the texture 纹理的图像网址
 * @return Bitmap
 */
Bitmap.load = function(url) {
    //位图 = 创建位图
    var bitmap = Object.create(Bitmap.prototype);
    //延缓 = true 
    bitmap._defer = true;
    //初始化
    bitmap.initialize();

    //请求后解码 = true 
    bitmap._decodeAfterRequest = true;
    //请求图片(url)
    bitmap._requestImage(url);

    return bitmap;
};

/**拍摄
 * 
 * 取游戏画面的快照，并返回一个新的位图对象。
 * Takes a snapshot of the game screen and returns a new bitmap object.
 *
 * @static
 * @method snap
 * @param {Stage} stage The stage object 舞台对象
 * @return Bitmap
 */ 
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

/**是准备好
 * 
 * 检查位图是否是已经做好准备
 * Checks whether the bitmap is ready to render.
 *
 * @method isReady
 * @return {boolean} True if the bitmap is ready to render
 */ 
Bitmap.prototype.isReady = function() {
    //返回 读取中状态 === 'loaded' //读取后 || 读取中状态 ===  'none' //无
    return this._loadingState === 'loaded' || this._loadingState === 'none';
};

/**是错误
 * 检查是否发生了错误装载。
 * Checks whether a loading error has occurred.
 *
 * @method isError
 * @return {boolean} True if a loading error has occurred
 */ 
Bitmap.prototype.isError = function() {
    //返回 读取中状态 === 'error' //错误的 
    return this._loadingState === 'error';
};

/**触摸
 * 触摸资源
 * touch the resource
 * @method touch
 */ 
Bitmap.prototype.touch = function() {
    //如果(缓存条目)
    if (this.cacheEntry) {
        //缓存条目 触摸()
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
    get: function() {
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
    get: function() {
        //返回 基础纹理
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
    get: function() {
        //返回 画布
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
    get: function() {
        //返回 环境
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
    get: function() {
        if(this.isReady()){
            return this._image? this._image.width: this._canvas.width;
        }

        return 0;
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
    get: function() {
        if(this.isReady()){
            return this._image? this._image.height: this._canvas.height;
        }

        return 0;
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
    get: function() {
        return new Rectangle(0, 0, this.width, this.height);
    },
    configurable: true
});

/**平滑
 * 是否应用平滑缩放
 * Whether the smooth scaling is  .
 *
 * @property smooth
 * @type Boolean
 */ 
Object.defineProperty(Bitmap.prototype, 'smooth', {
    //获得 
    get: function() {
        return this._smooth;
    },
    set: function(value) {
        if (this._smooth !== value) {
            this._smooth = value;
            if(this.__baseTexture){
                if (this._smooth) {
                    this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
                } else {
                    this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                }
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

/**重设大小
 * 调整位图大小
 * Resizes the bitmap.
 *
 * @method resize
 * @param {number} width 位图的新宽度  The new width of the bitmap
 * @param {number} height 位图的新高度  The new height of the bitmap
 */ 
Bitmap.prototype.resize = function(width, height) {
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
 * @param {Bitmap} source 要绘制的位图  The bitmap to draw
 * @param {number} sx 源中的x坐标  The x coordinate in the source
 * @param {number} sy 源中的y坐标  The y coordinate in the source
 * @param {number} sw 源图像的宽度  The width of the source image
 * @param {number} sh 源图像的高度  The height of the source image
 * @param {number} dx 目标中的y坐标  The x coordinate in the destination
 * @param {number} dy 目标中的y坐标  The y coordinate in the destination
 * @param {number} [dw=sw] 在目标中绘制图像的宽度  The width to draw the image in the destination
 * @param {number} [dh=sh] 在目标中绘制图像的高度  The height to draw the image in the destination
 */ 
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

/**块传输图像
 * 执行块传输，采用假设原始图像没有被修改（无色相）
 * Performs a block transfer, using assumption that original image was not modified (no hue)
 *
 * @method blt
 * @param {Bitmap} source 要绘制的位图  The bitmap to draw
 * @param {number} sx 源中的x坐标  The x coordinate in the source
 * @param {number} sy 源中的y坐标  The y coordinate in the source
 * @param {number} sw 源图像的宽度  The width of the source image
 * @param {number} sh 源图像的高度  The height of the source image
 * @param {number} dx 目标中的y坐标  The x coordinate in the destination
 * @param {number} dy 目标中的y坐标  The y coordinate in the destination
 * @param {number} [dw=sw] 在目标中绘制图像的宽度  The width to draw the image in the destination
 * @param {number} [dh=sh] 在目标中绘制图像的高度  The height to draw the image in the destination
 */
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

/**获得像素
 * 返回指定点像素的颜色。
 * Returns pixel color at the specified point.
 *
 * @method getPixel
 * @param {number} x 位图中像素的x坐标  The x coordinate of the pixel in the bitmap
 * @param {number} y 位图中像素的y坐标  The y coordinate of the pixel in the bitmap
 * @return {string}  像素颜色（十六进制格式） The pixel color (hex format)
 */ 
Bitmap.prototype.getPixel = function(x, y) {
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
 * @param {number} x 位图中像素的x坐标 The x coordinate of the pixel in the bitmap
 * @param {number} y 位图中像素的y坐标 The y coordinate of the pixel in the bitmap
 * @return {string} 透明像素值  The alpha value
 */ 
Bitmap.prototype.getAlphaPixel = function(x, y) {
    var data = this._context.getImageData(x, y, 1, 1).data;
    return data[3];
};

/**清除矩形
 * 清除指定的矩形
 * Clears the specified rectangle.
 *
 * @method clearRect
 * @param {number} x The x coordinate for the upper-left corner
 * @param {number} y The y coordinate for the upper-left corner
 * @param {number} width The width of the rectangle to clear
 * @param {number} height The height of the rectangle to clear
 */ 
Bitmap.prototype.clearRect = function(x, y, width, height) {
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
Bitmap.prototype.clear = function() {
    //清除矩形(0,0,宽,高)
    this.clearRect(0, 0, this.width, this.height);
};

/**填充矩形
 * 填充指定的矩形
 * Fills the specified rectangle.
 *
 * @method fillRect
 * @param {number} x 左上角的x坐标  The x coordinate for the upper-left corner
 * @param {number} y 左上角的y坐标  The y coordinate for the upper-left corner
 * @param {number} width 要填充的矩形的宽度  The width of the rectangle to fill
 * @param {number} height 要填充的矩形的高度  The height of the rectangle to fill
 * @param {string} color CSS格式的矩形颜色  The color of the rectangle in CSS format
 */ 
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

/**填充所有
 * 填充整个位图
 * Fills the entire bitmap.
 *
 * @method fillAll
 * @param {string} color The color of the rectangle in CSS format
 */ 
Bitmap.prototype.fillAll = function(color) {
    //填充矩形(0,0,宽,高)
    this.fillRect(0, 0, this.width, this.height, color);
};

/**层次填充矩形
 * 绘制具有层次的矩形
 * Draws the rectangle with a gradation.
 *
 * @method gradientFillRect
 * @param {number} x The x coordinate for the upper-left corner
 * @param {number} y The y coordinate for the upper-left corner
 * @param {number} width The width of the rectangle to fill
 * @param {number} height The height of the rectangle to fill
 * @param {string} color1 The gradient starting color
 * @param {string} color2 The gradient ending color
 * @param {boolean} vertical Wether the gradient should be draw as vertical or not
 */ 
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

/**绘制圆
 * 绘制实心圆
 * Draw a bitmap in the shape of a circle
 *
 * @method drawCircle
 * @param {number} x The x coordinate based on the circle center
 * @param {number} y The y coordinate based on the circle center
 * @param {number} radius The radius of the circle
 * @param {string} color The color of the circle in CSS format
 */ 
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

/**绘制文本
 * 绘制轮廓文本的位图
 * Draws the outline text to the bitmap.
 *
 * @method drawText
 * @param {string} text  将要绘制的文本  The text that will be drawn
 * @param {number} x  文本左侧的x坐标 The x coordinate for the left of the text
 * @param {number} y  文本顶部的y坐标 The y coordinate for the top of the text
 * @param {number} maxWidth 文本的最大允许宽度 The maximum allowed width of the text 
 * @param {number} lineHeight 文本行的高度 The height of the text line
 * @param {string} align 文本的对齐方式 The alignment of the text  
 *  left 	把文本排列到左边。默认值：由浏览器决定。  
 *  right 	把文本排列到右边。  
 *  center 	把文本排列到中间。  
 */ 
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

/**测量文本宽
 * 返回指定文本的宽度
 * Returns the width of the specified text.
 *
 * @method measureTextWidth
 * @param {string} text The text to be measured
 * @return {number} The width of the text in pixels
 */ 
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

/**调整色调
 * 改变整个位图的色调
 * Changes the color tone of the entire bitmap.
 *
 * @method adjustTone
 * @param {number} r The red strength in the range (-255, 255)
 * @param {number} g The green strength in the range (-255, 255)
 * @param {number} b The blue strength in the range (-255, 255)
 */ 
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

/**旋转色相
 * 旋转的整个位图的色相
 * Rotates the hue of the entire bitmap.
 *
 * @method rotateHue
 * @param {number} offset The hue offset in 360 degrees
 */ 
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

/**模糊
 * 位图模糊效果
 * Applies a blur effect to the bitmap.
 *
 * @method blur
 */ 
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

/**添加加载监听
 * 添加时对位图被加载时将调用的回调函数
 * Add a callback function that will be called when the bitmap is loaded.
 *
 * @method addLoadListener
 * @param {Function} listner The callback function
 */ 
Bitmap.prototype.addLoadListener = function(listner) {
    if (!this.isReady()) {
        this._loadListeners.push(listner);
    } else {
        listner(this);
    }
};

/**制作字体名称文本
 * @method _makeFontNameText
 * @private
 */ 
Bitmap.prototype._makeFontNameText = function() {
    return (this.fontBold ? "bold ": '') + 
           (this.fontItalic ? 'Italic ' : '') +
            this.fontSize + 'px ' + this.fontFace;
};

/**绘制文本边缘
 * @method _drawTextOutline
 * @param {string} text
 * @param {number} tx
 * @param {number} ty
 * @param {number} maxWidth
 * @private
 */ 
Bitmap.prototype._drawTextOutline = function(text, tx, ty, maxWidth) {
    if (!this.outlineWidth) { return } /**修改,如果为0跳过 */
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
 * @param {string} text
 * @param {number} tx
 * @param {number} ty
 * @param {number} maxWidth
 * @private
 */ 
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
Bitmap.prototype._onLoad = function() {
    this._image.removeEventListener('load', this._loadListener);
    this._image.removeEventListener('error', this._errorListener);

    this._renewCanvas();
    //检查(读取状态)
    switch(this._loadingState){
        //当 "requesting 请求"
        case 'requesting':
            //读取状态 = "requestCompleted 请求完成"
            this._loadingState = 'requestCompleted';
            //如果(请求后解码)
            if(this._decodeAfterRequest){
                //解码()
                this.decode();
            //否则 
            }else{
                //读取状态 = "purged 清除"
                this._loadingState = 'purged';
                //清除图像实例()
                this._clearImgInstance();
            }
            break;
        //当 "decrypting 解密"
        case 'decrypting':
            //撤销ObjectURL(图像 src)
            window.URL.revokeObjectURL(this._image.src);
            //读取状态 = "decryptCompleted 解密完成"
            this._loadingState = 'decryptCompleted';
            //如果(请求后解码)
            if(this._decodeAfterRequest){
                //解码()
                this.decode();
            //否则 
            }else{
                //读取状态 = "purged 清除"
                this._loadingState = 'purged';
                //清除图像实例()
                this._clearImgInstance();
            }
            break;
    }
};
/**解码 */
Bitmap.prototype.decode = function(){
    //检查((读取状态))
    switch(this._loadingState){
        //当 "请求已完成" : 当 "解密已完成" :
        case 'requestCompleted': case 'decryptCompleted':
            //读取状态 = "读取后"
            this._loadingState = 'loaded';
            //如果(! 画布) 创建基础纹理()
            if(!this.__canvas) this._createBaseTexture(this._image);
            //设置发生更改()
            this._setDirty();
            //呼叫读取监听()
            this._callLoadListeners();
            break;

        //当 请求中  当 解密中
        case 'requesting': case 'decrypting':
            //解码后请求 = true 
            this._decodeAfterRequest = true;
            if (!this._loader) {
                this._loader = ResourceHandler.createLoader(this._url, this._requestImage.bind(this, this._url), this._onError.bind(this));
                this._image.removeEventListener('error', this._errorListener);
                this._image.addEventListener('error', this._errorListener = this._loader);
            }
            break;

        //当 
        case 'pending': case 'purged': case 'error':
            //解码后请求 = true 
            this._decodeAfterRequest = true;
            this._requestImage(this._url);
            break;
    }
};

/**呼叫读取监听
 * @method _callLoadListeners
 * @private
 */ 
Bitmap.prototype._callLoadListeners = function() {
    while (this._loadListeners.length > 0) {
        var listener = this._loadListeners.shift();
        listener(this);
    }
};

/**当错误
 * @method _onError
 * @private
 */ 
Bitmap.prototype._onError = function() {
    this._image.removeEventListener('load', this._loadListener);
    this._image.removeEventListener('error', this._errorListener);
    this._loadingState = 'error';
};

/**设置发生更改
 * @method _setDirty
 * @private
 */ 
Bitmap.prototype._setDirty = function() {
    this._dirty = true;
};

/**检查发生更改
 * 更新纹理位图是发生更改
 * updates texture is bitmap was dirty
 * @method checkDirty
 */ 
Bitmap.prototype.checkDirty = function() {
    if (this._dirty) {
        this._baseTexture.update();
        this._dirty = false;
    }
};

/**请求
 * 
 */
Bitmap.request = function(url){
    var bitmap = Object.create(Bitmap.prototype);
    bitmap._defer = true;
    bitmap.initialize();

    bitmap._url = url;
    bitmap._loadingState = 'pending';

    return bitmap;
};
/**请求图像
 * 
 */
Bitmap.prototype._requestImage = function(url){
    //如果(位图 请求图像组 长度 !== 0)
    if(Bitmap._reuseImages.length !== 0){
        //图像 = 位图 请求图像组 末尾()
        this._image = Bitmap._reuseImages.pop();
    }else{
        //图像 = 新 图像()
        this._image = new Image();
    }

    //如果 (请求后解码 并且 不是 装载机 )
    if (this._decodeAfterRequest && !this._loader) {
        
        this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this, url), this._onError.bind(this));
    }

    this._image = new Image();
    this._url = url;
    this._loadingState = 'requesting';

    if(!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
        this._loadingState = 'decrypting';
        Decrypter.decryptImg(url, this);
    } else {
        this._image.src = url;

        this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
        this._image.addEventListener('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
    }
};
/**是请求唯一 */
Bitmap.prototype.isRequestOnly = function(){
    //返回 !(请求后解码 或者 是准备好() )
    return !(this._decodeAfterRequest || this.isReady());
};
/**是请求准备好 */
Bitmap.prototype.isRequestReady = function(){
    return this._loadingState !== 'pending' &&
        this._loadingState !== 'requesting' &&
        this._loadingState !== 'decrypting';
};
/**开始请求 */
Bitmap.prototype.startRequest = function(){
    if(this._loadingState === 'pending'){
        this._decodeAfterRequest = false;
        this._requestImage(this._url);
    }
};