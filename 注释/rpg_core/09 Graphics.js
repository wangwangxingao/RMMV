
/**-----------------------------------------------------------------------------*/
/**图形处理的静态类
 * The static class that carries out graphics processing.
 * 图形
 * @class Graphics
 */
function Graphics() {
    throw new Error('This is a static class');
}



Graphics._cssFontLoading =  document.fonts && document.fonts.ready && document.fonts.ready.then;
Graphics._fontLoaded = null;
Graphics._videoVolume = 1;

/**初始化图形系统。
 * Initializes the graphics system.
 *
 * @static
 * @method initialize
 * @param {number} width The width of the game screen
 * @param {number} height The height of the game screen
 * @param {string} type The type of the renderer.
 *                 'canvas', 'webgl', or 'auto'.
 */
Graphics.initialize = function(width, height, type) {
	//宽 = width//宽 || 800 
    this._width = width || 800;
	//高 =  height//高 || 600
    this._height = height || 600;
    //渲染器种类 = type//种类 || 'auto'//自动 
    this._rendererType = type || 'auto';
    //盒宽 = 宽 
    this._boxWidth = this._width;
    //盒高 = 高 
    this._boxHeight = this._height;

    this._scale = 1;
    this._realScale = 1;
    this._errorShowed = false;
    this._errorPrinter = null;
    this._canvas = null;
    this._video = null;
    this._videoUnlocked = !Utils.isMobileDevice();
    this._videoLoading = false;
    this._upperCanvas = null;
    this._renderer = null;
    this._fpsMeter = null;
    this._modeBox = null;
    this._skipCount = 0;
    this._maxSkip = 3;
    this._rendered = false;
    this._loadingImage = null;
    this._loadingCount = 0;
    this._fpsMeterToggled = false;
    this._stretchEnabled = this._defaultStretchMode();

    this._canUseDifferenceBlend = false;
    this._canUseSaturationBlend = false;
    this._hiddenCanvas = null;

    this._testCanvasBlendModes();
    this._modifyExistingElements();
    this._updateRealScale();
    this._createAllElements();
    this._disableTextSelection();
    this._disableContextMenu();
    this._setupEventHandlers();
    this._setupCssFontLoading();
};


Graphics._setupCssFontLoading = function(){
    if(Graphics._cssFontLoading){
        document.fonts.ready.then(function(fonts){
            Graphics._fontLoaded = fonts;
        }).catch(function(error){
            SceneManager.onError(error);
        });
    }
};

Graphics.canUseCssFontLoading = function(){
    return !!this._cssFontLoading;
};

/**游戏画面的总帧数
 * The total frame count of the game screen.
 *
 * @static
 * @property frameCount
 * @type Number
 */
  //帧计数 = 0 
Graphics.frameCount     = 0;

/**混合 正常
 * The alias of PIXI.blendModes.NORMAL.
 *
 * @static
 * @property BLEND_NORMAL
 * @type Number
 * @final
 */
Graphics.BLEND_NORMAL   = 0;

/**混合 加
 * The alias of PIXI.blendModes.ADD.
 *
 * @static
 * @property BLEND_ADD
 * @type Number
 * @final
 */
Graphics.BLEND_ADD      = 1;

/**混合 乘
 * The alias of PIXI.blendModes.MULTIPLY.
 *
 * @static
 * @property BLEND_MULTIPLY
 * @type Number
 * @final
 */
Graphics.BLEND_MULTIPLY = 2;

/**混合 画面
 * The alias of PIXI.blendModes.SCREEN.
 *
 * @static
 * @property BLEND_SCREEN
 * @type Number
 * @final
 */
Graphics.BLEND_SCREEN   = 3;

/**标记每帧FPSMeter的开始
 * Marks the beginning of each frame for FPSMeter.
 *
 * @static
 * @method tickStart
 */
Graphics.tickStart = function() {
    if (this._fpsMeter) {
        this._fpsMeter.tickStart();
    }
};

/**标记每帧FPSMeter的末端
 * Marks the end of each frame for FPSMeter.
 *
 * @static
 * @method tickEnd
 */
Graphics.tickEnd = function() {
    if (this._fpsMeter && this._rendered) {
        this._fpsMeter.tick();
    }
};

/**渲染
 * 呈现在舞台上的游戏画面
 * Renders the stage to the game screen.
 *
 * @static
 * @method render
 * @param {Stage} stage The stage object to be rendered
 */ 
Graphics.render = function(stage) {
	//如果( )
    if (this._skipCount === 0) {
        var startTime = Date.now();
        if (stage) {
	        //渲染器 渲染(舞台)
            this._renderer.render(stage);
            if (this._renderer.gl && this._renderer.gl.flush) {
                this._renderer.gl.flush();
            }
        }
        var endTime = Date.now();
        var elapsed = endTime - startTime;
        this._skipCount = Math.min(Math.floor(elapsed / 15), this._maxSkip);
        this._rendered = true;
    } else {
        this._skipCount--;
        this._rendered = false;
    }
    //帧计数 ++ 
    this.frameCount++;
};

/**是WebGL
 * 检查是否渲染器类型是WebGL的
 * Checks whether the renderer type is WebGL.
 *
 * @static
 * @method isWebGL
 * @return {boolean} True if the renderer type is WebGL
 */ 
Graphics.isWebGL = function() {
    return this._renderer && this._renderer.type === PIXI.RENDERER_TYPE.WEBGL;
};

/**支持WebGL
 * 检查当前浏览器是否支持WebGL的
 * Checks whether the current browser supports WebGL.
 *
 * @static
 * @method hasWebGL
 * @return {boolean} True if the current browser supports WebGL.
 */ 
Graphics.hasWebGL = function() {
    try {
        var canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
        return false;
    }
};

/**检查画布上混合模式“差异”是否支持
 * Checks whether the canvas blend mode 'difference' is supported.
 *
 * @static
 * @method canUseDifferenceBlend
 * @return {boolean} True if the canvas blend mode 'difference' is supported
 */
Graphics.canUseDifferenceBlend = function() {
    return this._canUseDifferenceBlend;
};

/**检查画布上混合模式“饱和”是否支持
 * Checks whether the canvas blend mode 'saturation' is supported.
 *
 * @static
 * @method canUseSaturationBlend
 * @return {boolean} True if the canvas blend mode 'saturation' is supported
 */
Graphics.canUseSaturationBlend = function() {
    return this._canUseSaturationBlend;
};

/**设置“NOW LOADING”形象的来源
 * Sets the source of the "Now Loading" image.
 *
 * @static
 * @method setLoadingImage
 */
Graphics.setLoadingImage = function(src) {
    this._loadingImage = new Image();
    this._loadingImage.src = src;
};

/**初始化显示“NOW LOADING”的形象 计数器
 * Initializes the counter for displaying the "Now Loading" image.
 *
 * @static
 * @method startLoading
 */
Graphics.startLoading = function() {
    this._loadingCount = 0;
};

/**递增加载计数器并在必要时显示“NOW LOADING”的形象。
 * Increments the loading counter and displays the "Now Loading" image if necessary.
 *
 * @static
 * @method updateLoading
 */
Graphics.updateLoading = function() {
    this._loadingCount++;
    this._paintUpperCanvas();
    this._upperCanvas.style.opacity = 1;
};

/**擦除“NOW LOADING”的形象
 * Erases the "Now Loading" image.
 *
 * @static
 * @method endLoading
 */
Graphics.endLoading = function() {
    this._clearUpperCanvas();
    this._upperCanvas.style.opacity = 0;
};
/**
 * Displays the loading error text to the screen.
 *
 * @static
 * @method printLoadingError
 * @param {String} url The url of the resource failed to load
 */
Graphics.printLoadingError = function(url) {
    if (this._errorPrinter && !this._errorShowed) {
        this._errorPrinter.innerHTML = this._makeErrorHtml('Loading Error', 'Failed to load: ' + url);
        var button = document.createElement('button');
        button.innerHTML = 'Retry';
        button.style.fontSize = '24px';
        button.style.color = '#ffffff';
        button.style.backgroundColor = '#000000';
        button.onmousedown = button.ontouchstart = function(event) {
            ResourceHandler.retry();
            event.stopPropagation();
        };
        this._errorPrinter.appendChild(button);
        this._loadingCount = -Infinity;
    }
};

/**
 * Erases the loading error text.
 *
 * @static
 * @method eraseLoadingError
 */
Graphics.eraseLoadingError = function() {
    if (this._errorPrinter && !this._errorShowed) {
        this._errorPrinter.innerHTML = '';
        this.startLoading();
    }
};
 

/**显示错误文本到画面上
 * Displays the error text to the screen.
 *
 * @static
 * @method printError
 * @param {string} name The name of the error
 * @param {string} message The message of the error
 */
Graphics.printError = function(name, message) {
    this._errorShowed = true;
    if (this._errorPrinter) {
        this._errorPrinter.innerHTML = this._makeErrorHtml(name, message);
    }
    this._applyCanvasFilter();
    this._clearUpperCanvas();
};

/**显示fps
 * 显示FPSMeter元素
 * Shows the FPSMeter element.
 *
 * @static
 * @method showFps
 */ 
Graphics.showFps = function() {
    if (this._fpsMeter) {
        this._fpsMeter.show();
        this._modeBox.style.opacity = 1;
    }
};

/**隐藏fps
 * 隐藏FPSMeter元素
 * Hides the FPSMeter element.
 *
 * @static
 * @method hideFps
 */ 
Graphics.hideFps = function() {
    if (this._fpsMeter) {
        this._fpsMeter.hide();
        this._modeBox.style.opacity = 0;
    }
};

/**加载字体
 * 加载一个字体文件
 * Loads a font file.
 *
 * @static
 * @method loadFont
 * @param {string} name The face name of the font
 * @param {string} url The url of the font file
 */ 
Graphics.loadFont = function(name, url) {
    var style = document.createElement('style');
    var head = document.getElementsByTagName('head');
    var rule = '@font-face { font-family: "' + name + '"; src: url("' + url + '"); }';
    style.type = 'text/css';
    head.item(0).appendChild(style);
    style.sheet.insertRule(rule, 0);
    //创建字体加载
    this._createFontLoader(name);
};

/**是字体加载后
 * 检查是否加载字体文件
 * Checks whether the font file is loaded.
 *
 * @static
 * @method isFontLoaded
 * @param {string} name The face name of the font
 * @return {boolean} True if the font file is loaded
 */ 
Graphics.isFontLoaded = function(name) {
    if (Graphics._cssFontLoading) {
        if(Graphics._fontLoaded){
            return Graphics._fontLoaded.check('10px "'+name+'"');
        }

        return false;
    } else {
        if (!this._hiddenCanvas) {
            this._hiddenCanvas = document.createElement('canvas');
        }
        var context = this._hiddenCanvas.getContext('2d');
        var text = 'abcdefghijklmnopqrstuvwxyz';
        var width1, width2;
        context.font = '40px ' + name + ', sans-serif';
        width1 = context.measureText(text).width;
        context.font = '40px sans-serif';
        width2 = context.measureText(text).width;
        return width1 !== width2;
    }
};

/**播放视频
 * 开始播放一段视频
 * Starts playback of a video.
 *
 * @static
 * @method playVideo
 * @param {string} src
 */ 
Graphics.playVideo = function(src) {
    this._videoLoader = ResourceHandler.createLoader(null, this._playVideo.bind(this, src), this._onVideoError.bind(this));
    this._playVideo(src);
};

/**
 * @static
 * @method _playVideo
 * @param {String} src
 * @private
 */
Graphics._playVideo = function(src) {
    this._video.src = src;
    this._video.onloadeddata = this._onVideoLoad.bind(this);
    this._video.onerror = this._videoLoader;
    this._video.onended = this._onVideoEnd.bind(this);
    this._video.load();
    this._videoLoading = true;
};

/**是视频播放
 * 检查视频是否正在播放
 * Checks whether the video is playing.
 *
 * @static
 * @method isVideoPlaying
 * @return {boolean} True if the video is playing
 */ 
Graphics.isVideoPlaying = function() {
     return this._videoLoading || this._isVideoVisible();

};

/**能播放视频种类
 * 检查浏览器是否可以播放指定的视频类型
 * Checks whether the browser can play the specified video type.
 *
 * @static
 * @method canPlayVideoType
 * @param {string} type The video type to test support for
 * @return {boolean} True if the browser can play the specified video type
 */ 
Graphics.canPlayVideoType = function(type) {
    return this._video && this._video.canPlayType(type);
};

/**
 * Sets volume of a video.
 *
 * @static
 * @method setVideoVolume
 * @param {Number} value
 */
Graphics.setVideoVolume = function(value) {
    this._videoVolume = value;
    if (this._video) {
        this._video.volume = this._videoVolume;
    }
};
/**页到画布x
 * 转换页面上的x坐标为相应的X在画布区域的坐标。
 * Converts an x coordinate on the page to the corresponding
 * x coordinate on the canvas area.
 *
 * @static
 * @method pageToCanvasX
 * @param {number} x The x coordinate on the page to be converted
 * @return {number} The x coordinate on the canvas area
 */ 
Graphics.pageToCanvasX = function(x) {
    if (this._canvas) {
        var left = this._canvas.offsetLeft;
        return Math.round((x - left) / this._realScale);
    } else {
        return 0;
    }
};

/**页到画布y
 * 转换页面上的y坐标为相应的y在画布区域的坐标
 * Converts a y coordinate on the page to the corresponding
 * y coordinate on the canvas area.
 *
 * @static
 * @method pageToCanvasY
 * @param {number} y The y coordinate on the page to be converted
 * @return {number} The y coordinate on the canvas area
 */ 
Graphics.pageToCanvasY = function(y) {
    if (this._canvas) {
        var top = this._canvas.offsetTop;
        return Math.round((y - top) / this._realScale);
    } else {
        return 0;
    }
};

/**是在画布内
 * 检查指定的点是否在游戏画布区域内
 * Checks whether the specified point is inside the game canvas area.
 *
 * @static
 * @method isInsideCanvas
 * @param {number} x The x coordinate on the canvas area
 * @param {number} y The y coordinate on the canvas area
 * @return {boolean} True if the specified point is inside the game canvas area
 */ 
Graphics.isInsideCanvas = function(x, y) {
    return (x >= 0 && x < this._width && y >= 0 && y < this._height);
};

/**呼叫GC(垃圾收集器)
 * 呼叫pixi.js垃圾收集器
 * Calls pixi.js garbage collector
 */ 
Graphics.callGC = function() {
    if (Graphics.isWebGL()) {
        Graphics._renderer.textureGC.run();
    }
}


/**宽
 * 游戏画面的宽度。
 * The width of the game screen.
 *
 * @static
 * @property width
 * @type Number
 */ 
Object.defineProperty(Graphics, 'width', {
    //获得 
    get: function() {
        return this._width;
    },
    //设置
    set: function(value) {
        if (this._width !== value) {
            this._width = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**高
 * 游戏画面的高度
 * The height of the game screen.
 *
 * @static
 * @property height
 * @type Number
 */
Object.defineProperty(Graphics, 'height', {
    //获得 
    get: function() {
        return this._height;
    },
    //设置
    set: function(value) {
        if (this._height !== value) {
            this._height = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**盒宽
 * 窗口显示区域的宽度
 * The width of the window display area.
 *
 * @static
 * @property boxWidth
 * @type Number
 */
Object.defineProperty(Graphics, 'boxWidth', {
    //获得 
    get: function() {
        return this._boxWidth;
    },
    set: function(value) {
        this._boxWidth = value;
    },
    configurable: true
});

/**盒高
 * 窗口显示区域的高度
 * The height of the window display area.
 *
 * @static
 * @property boxHeight
 * @type Number
 */
Object.defineProperty(Graphics, 'boxHeight', {
    //获得 
    get: function() {
        return this._boxHeight;
    },
    set: function(value) {
        this._boxHeight = value;
    },
    configurable: true
});

/**比例
 * 游戏画面的缩放比例
 * The zoom scale of the game screen.
 *
 * @static
 * @property scale
 * @type Number
 */
Object.defineProperty(Graphics, 'scale', {
    //获得 
    get: function() {
        return this._scale;
    },
    set: function(value) {
        if (this._scale !== value) {
            this._scale = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**创造所有成员
 * @static
 * @method _createAllElements
 * @private
 */
Graphics._createAllElements = function() {
    this._createErrorPrinter();
    this._createCanvas();
    this._createVideo();
    this._createUpperCanvas();
    this._createRenderer();
    this._createFPSMeter();
    this._createModeBox();
    this._createGameFontLoader();
};

/**更新所有成分
 * @static
 * @method _updateAllElements
 * @private
 */
Graphics._updateAllElements = function() {
    this._updateRealScale();
    this._updateErrorPrinter();
    this._updateCanvas();
    this._updateVideo();
    this._updateUpperCanvas();
    this._updateRenderer();
    this._paintUpperCanvas();
};

/**更新真比例
 * @static
 * @method _updateRealScale
 * @private
 */
Graphics._updateRealScale = function() {
    if (this._stretchEnabled) {
        var h = window.innerWidth / this._width;
        var v = window.innerHeight / this._height;
        if (h >= 1 && h - 0.01 <= 1) h = 1;
        if (v >= 1 && v - 0.01 <= 1) v = 1;
        this._realScale = Math.min(h, v);
    } else {
        this._realScale = this._scale;
    }
};

/**制作错误Html
 * @static
 * @method _makeErrorHtml
 * @param {string} name
 * @param {string} message
 * @return {string}
 * @private
 */
Graphics._makeErrorHtml = function(name, message) {
    return ('<font color="yellow"><b>' + name + '</b></font><br>' +
            '<font color="white">' + message + '</font><br>');
};

/**缺省伸展模式
 * @static
 * @method _defaultStretchMode
 * @private
 */
Graphics._defaultStretchMode = function() {
    return Utils.isNwjs() || Utils.isMobileDevice();
};

/**测试画布融合模式
 * @static
 * @method _testCanvasBlendModes
 * @private
 */
Graphics._testCanvasBlendModes = function() {
    var canvas, context, imageData1, imageData2;
    canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    context = canvas.getContext('2d');
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = 'white';
    context.fillRect(0, 0, 1, 1);
    context.globalCompositeOperation = 'difference';
    context.fillStyle = 'white';
    context.fillRect(0, 0, 1, 1);
    imageData1 = context.getImageData(0, 0, 1, 1);
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = 'black';
    context.fillRect(0, 0, 1, 1);
    context.globalCompositeOperation = 'saturation';
    context.fillStyle = 'white';
    context.fillRect(0, 0, 1, 1);
    imageData2 = context.getImageData(0, 0, 1, 1);
    this._canUseDifferenceBlend = imageData1.data[0] === 0;
    this._canUseSaturationBlend = imageData2.data[0] === 0;
};

/**更改现存成员
 * @static
 * @method _modifyExistingElements
 * @private
 */
Graphics._modifyExistingElements = function() {
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].style.zIndex > 0) {
            elements[i].style.zIndex = 0;
        }
    }
};

/**创建错误打印
 * @static
 * @method _createErrorPrinter
 * @private
 */
Graphics._createErrorPrinter = function() {
    this._errorPrinter = document.createElement('p');
    this._errorPrinter.id = 'ErrorPrinter';
    this._updateErrorPrinter();
    document.body.appendChild(this._errorPrinter);
};

/**更新错误打印
 * @static
 * @method _updateErrorPrinter
 * @private
 */
Graphics._updateErrorPrinter = function() {
    this._errorPrinter.width = this._width * 0.9;
    this._errorPrinter.height = 40;
    this._errorPrinter.style.textAlign = 'center';
    this._errorPrinter.style.textShadow = '1px 1px 3px #000';
    this._errorPrinter.style.fontSize = '20px';
    this._errorPrinter.style.zIndex = 99;
    this._centerElement(this._errorPrinter);
};

/**创建画布
 * @static
 * @method _createCanvas
 * @private
 */
Graphics._createCanvas = function() {
    this._canvas = document.createElement('canvas');
    this._canvas.id = 'GameCanvas';
    this._updateCanvas();
    document.body.appendChild(this._canvas);
};

/**更新画布
 * @static
 * @method _updateCanvas
 * @private
 */
Graphics._updateCanvas = function() {
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this._canvas.style.zIndex = 1;
    this._centerElement(this._canvas);
};

/**创建视频
 * @static
 * @method _createVideo
 * @private
 */
Graphics._createVideo = function() {
    this._video = document.createElement('video');
    this._video.id = 'GameVideo';
    this._video.style.opacity = 0;
    this._video.setAttribute('playsinline', '');
    this._video.volume = this._videoVolume;
    this._updateVideo();
    makeVideoPlayableInline(this._video);
    document.body.appendChild(this._video);
};

/**更新视频
 * @static
 * @method _updateVideo
 * @private
 */
Graphics._updateVideo = function() {
    this._video.width = this._width;
    this._video.height = this._height;
    this._video.style.zIndex = 2;
    this._centerElement(this._video);
};

/**创建上层画布
 * @static
 * @method _createUpperCanvas
 * @private
 */
Graphics._createUpperCanvas = function() {
    this._upperCanvas = document.createElement('canvas');
    this._upperCanvas.id = 'UpperCanvas';
    this._updateUpperCanvas();
    document.body.appendChild(this._upperCanvas);
};

/**更新上层画布
 * @static
 * @method _updateUpperCanvas
 * @private
 */
Graphics._updateUpperCanvas = function() {
    this._upperCanvas.width = this._width;
    this._upperCanvas.height = this._height;
    this._upperCanvas.style.zIndex = 3;
    this._centerElement(this._upperCanvas);
};

/**清除上层画布
 * @static
 * @method _clearUpperCanvas
 * @private
 */
Graphics._clearUpperCanvas = function() {
    var context = this._upperCanvas.getContext('2d');
    context.clearRect(0, 0, this._width, this._height);
};

/**画上层画布
 * @static
 * @method _paintUpperCanvas
 * @private
 */
Graphics._paintUpperCanvas = function() {
    this._clearUpperCanvas();
    if (this._loadingImage && this._loadingCount >= 20) {
        var context = this._upperCanvas.getContext('2d');
        var dx = (this._width - this._loadingImage.width) / 2;
        var dy = (this._height - this._loadingImage.height) / 2;
        var alpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
        context.save();
        context.globalAlpha = alpha;
        context.drawImage(this._loadingImage, dx, dy);
        context.restore();
    }
};

/**创建表演
 * @static
 * @method _createRenderer
 * @private
 */
Graphics._createRenderer = function() {
    PIXI.dontSayHello = true;
    var width = this._width;
    var height = this._height;
    var options = { view: this._canvas };
    try {
        switch (this._rendererType) {
        case 'canvas':
            this._renderer = new PIXI.CanvasRenderer(width, height, options);
            break;
        case 'webgl':
            this._renderer = new PIXI.WebGLRenderer(width, height, options);
            break;
        default:
            this._renderer = PIXI.autoDetectRenderer(width, height, options);
            break;
        }
        
        if(this._renderer && this._renderer.textureGC){
            this._renderer.textureGC.maxIdle = 1;
        }
    } catch (e) {
        this._renderer = null;
    }
};

/**更新表演
 * @static
 * @method _updateRenderer
 * @private
 */
Graphics._updateRenderer = function() {
    if (this._renderer) {
        this._renderer.resize(this._width, this._height);
    }
};

/**创建FPSMeter
 * @static
 * @method _createFPSMeter
 * @private
 */
Graphics._createFPSMeter = function() {
    var options = { graph: 1, decimals: 0, theme: 'transparent', toggleOn: null };
    this._fpsMeter = new FPSMeter(options);
    this._fpsMeter.hide();
};

/**创建模式盒
 * @static
 * @method _createModeBox
 * @private
 */
Graphics._createModeBox = function() {
    var box = document.createElement('div');
    box.id = 'modeTextBack';
    box.style.position = 'absolute';
    box.style.left = '5px';
    box.style.top = '5px';
    box.style.width = '119px';
    box.style.height = '58px';
    box.style.background = 'rgba(0,0,0,0.2)';
    box.style.zIndex = 9;
    box.style.opacity = 0;

    var text = document.createElement('div');
    text.id = 'modeText';
    text.style.position = 'absolute';
    text.style.left = '0px';
    text.style.top = '41px';
    text.style.width = '119px';
    text.style.fontSize = '12px';
    text.style.fontFamily = 'monospace';
    text.style.color = 'white';
    text.style.textAlign = 'center';
    text.style.textShadow = '1px 1px 0 rgba(0,0,0,0.5)';
    text.innerHTML = this.isWebGL() ? 'WebGL mode' : 'Canvas mode';

    document.body.appendChild(box);
    box.appendChild(text);

    this._modeBox = box;
};

/**创建游戏字体加载
 * @static
 * @method _createGameFontLoader
 * @private
 */
Graphics._createGameFontLoader = function() {
    this._createFontLoader('GameFont');
};

/**创建字体加载
 * @static
 * @method _createFontLoader
 * @param {string} name
 * @private
 */
Graphics._createFontLoader = function(name) {
    var div = document.createElement('div');
    var text = document.createTextNode('.');
    div.style.fontFamily = name;
    div.style.fontSize = '0px';
    div.style.color = 'transparent';
    div.style.position = 'absolute';
    div.style.margin = 'auto';
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.width = '1px';
    div.style.height = '1px';
    div.appendChild(text);
    document.body.appendChild(div);
};

/**创建成员
 * @static
 * @method _centerElement
 * @param {HTMLElement} element
 * @private
 */
Graphics._centerElement = function(element) {
    var width = element.width * this._realScale;
    var height = element.height * this._realScale;
    element.style.position = 'absolute';
    element.style.margin = 'auto';
    element.style.top = 0;
    element.style.left = 0;
    element.style.right = 0;
    element.style.bottom = 0;
    element.style.width = width + 'px';
    element.style.height = height + 'px';
};

/**无效文本选择
 * @static
 * @method _disableTextSelection
 * @private
 */
Graphics._disableTextSelection = function() {
    var body = document.body;
    body.style.userSelect = 'none';
    body.style.webkitUserSelect = 'none';
    body.style.msUserSelect = 'none';
    body.style.mozUserSelect = 'none';
};

/**无效上下文菜单
 * @static
 * @method _disableContextMenu
 * @private
 */
Graphics._disableContextMenu = function() {
    var elements = document.body.getElementsByTagName('*');
    var oncontextmenu = function() { return false; };
    for (var i = 0; i < elements.length; i++) {
        elements[i].oncontextmenu = oncontextmenu;
    }
};

/**应用画布过滤
 * @static
 * @method _applyCanvasFilter
 * @private
 */
Graphics._applyCanvasFilter = function() {
    if (this._canvas) {
        this._canvas.style.opacity = 0.5;
        this._canvas.style.filter = 'blur(8px)';
        this._canvas.style.webkitFilter = 'blur(8px)';
    }
};

/**当视频读取
 * @static
 * @method _onVideoLoad
 * @private
 */
Graphics._onVideoLoad = function() {
    this._video.play();
    this._updateVisibility(true);
    this._videoLoading = false;
};

/**当视频错误
 * @static
 * @method _onVideoError
 * @private
 */
Graphics._onVideoError = function() {
    this._updateVisibility(false);
    this._videoLoading = false;
};

/**当视频结束
 * @static
 * @method _onVideoEnd
 * @private
 */
Graphics._onVideoEnd = function() {
    this._updateVisibility(false);
};

/**更新视频可见性
 * @static
 * @method _updateVisibility
 * @param {boolean} videoVisible
 * @private
 */
Graphics._updateVisibility = function(videoVisible) {
    this._video.style.opacity = videoVisible ? 1 : 0;
    this._canvas.style.opacity = videoVisible ? 0 : 1;
};

/**是视频可见性
 * @static
 * @method _isVideoVisible
 * @return {boolean}
 * @private
 */
Graphics._isVideoVisible = function() {
    return this._video.style.opacity > 0;
};

/**安装事件操作者
 * @static
 * @method _setupEventHandlers
 * @private
 */
Graphics._setupEventHandlers = function() {
    window.addEventListener('resize', this._onWindowResize.bind(this));
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    document.addEventListener('touchend', this._onTouchEnd.bind(this));
};

/**当窗口调整大小
 * @static
 * @method _onWindowResize
 * @private
 */
Graphics._onWindowResize = function() {
    this._updateAllElements();
};

/**当键按下
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */
Graphics._onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
        case 113:   // F2
            event.preventDefault();
            this._switchFPSMeter();
            break;
        case 114:   // F3
            event.preventDefault();
            this._switchStretchMode();
            break;
        case 115:   // F4
            event.preventDefault();
            this._switchFullScreen();
            break;
        }
    }
};

/**
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event
 * @private
 */
Graphics._onTouchEnd = function(event) {
    if (!this._videoUnlocked) {
        this._video.play();
        this._videoUnlocked = true;
    }
    if (this._isVideoVisible() && this._video.paused) {
        this._video.play();
    }
};

/**开关FPSMeter
 * @static
 * @method _switchFPSMeter
 * @private
 */
Graphics._switchFPSMeter = function() {
    if (this._fpsMeter.isPaused) {
        this.showFps();
        this._fpsMeter.showFps();
        this._fpsMeterToggled = false;
    } else if (!this._fpsMeterToggled) {
        this._fpsMeter.showDuration();
        this._fpsMeterToggled = true;
    } else {
        this.hideFps();
    }
};

/**开关伸展模式
 * @static
 * @method _switchStretchMode
 * @return {boolean}
 * @private
 */
Graphics._switchStretchMode = function() {
    this._stretchEnabled = !this._stretchEnabled;
    this._updateAllElements();
};

/**开关充满屏幕
 * @static
 * @method _switchFullScreen
 * @private
 */
Graphics._switchFullScreen = function() {
    if (this._isFullScreen()) {
        this._requestFullScreen();
    } else {
        this._cancelFullScreen();
    }
};

/**是充满屏幕
 * @static
 * @method _isFullScreen
 * @return {boolean}
 * @private
 */
Graphics._isFullScreen = function() {
    return ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitFullscreenElement &&
             !document.msFullscreenElement));
};

/**请求充满屏幕
 * @static
 * @method _requestFullScreen
 * @private
 */
Graphics._requestFullScreen = function() {
    var element = document.body;
    if (element.requestFullScreen) {
        element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};

/**取消充满屏幕
 * @static
 * @method _cancelFullScreen
 * @private
 */
Graphics._cancelFullScreen = function() {
    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
};