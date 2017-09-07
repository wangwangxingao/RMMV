
//-----------------------------------------------------------------------------
// SceneManager
// 场景管理器
// The static class that manages scene transitions.
// 这个静态的类 管理 场景转换

function SceneManager() {
    throw new Error('This is a static class');
}

/* 获取当前时间 在 ms
 * Gets the current time in ms.
 * @private
 */
SceneManager._getTimeInMs = function() {
    return performance.now();
};

//场景 = null
SceneManager._scene             = null;
//下一个场景 = null
SceneManager._nextScene         = null;
//堆 = []
SceneManager._stack             = [];
//停止的
SceneManager._stopped           = false;
//场景开始的
SceneManager._sceneStarted      = false;
SceneManager._exiting           = false;
SceneManager._previousClass     = null;
SceneManager._backgroundBitmap  = null;
SceneManager._screenWidth       = 816;
SceneManager._screenHeight      = 624;
SceneManager._boxWidth          = 816;
SceneManager._boxHeight         = 624;
SceneManager._deltaTime = 1.0 / 60.0;
SceneManager._currentTime = SceneManager._getTimeInMs();
SceneManager._accumulator = 0.0;
//运行
SceneManager.run = function(sceneClass) {
    try {
        this.initialize();
        this.goto(sceneClass);
        this.requestUpdate();
    } catch (e) {
        this.catchException(e);
    }
};
//初始化
SceneManager.initialize = function() {
    this.initGraphics();
    this.checkFileAccess();
    this.initAudio();
    this.initInput();
    this.initNwjs();
    this.checkPluginErrors();
    this.setupErrorHandlers();
};
//初始化图形
SceneManager.initGraphics = function() {
    var type = this.preferableRendererType();
    Graphics.initialize(this._screenWidth, this._screenHeight, type);
    Graphics.boxWidth = this._boxWidth;
    Graphics.boxHeight = this._boxHeight;
    Graphics.setLoadingImage('img/system/Loading.png');
    if (Utils.isOptionValid('showfps')) {
        Graphics.showFps();
    }
    if (type === 'webgl') {
        this.checkWebGL();
    }
};
//可取渲染器类型
SceneManager.preferableRendererType = function() {
	//是选择启用有效
    if (Utils.isOptionValid('canvas')) {
        return 'canvas';
    } else if (Utils.isOptionValid('webgl')) {
        return 'webgl';
    } else if (this.shouldUseCanvasRenderer()) {
        return 'canvas';
    } else {
        return 'auto';
    }
};
//应该使用画布渲染器
SceneManager.shouldUseCanvasRenderer = function() {
	//是移动设备
    return Utils.isMobileDevice();
};
//检查的WebGL
SceneManager.checkWebGL = function() {
    if (!Graphics.hasWebGL()) {
        throw new Error('Your browser does not support WebGL.');
    }
};
//检查文件访问
SceneManager.checkFileAccess = function() {
    if (!Utils.canReadGameFiles()) {
        throw new Error('Your browser does not allow to read local files.');
    }
};
//初始化音频
SceneManager.initAudio = function() {
    var noAudio = Utils.isOptionValid('noaudio');
    if (!WebAudio.initialize(noAudio) && !noAudio) {
        throw new Error('Your browser does not support Web Audio API.');
    }
};
//初始化输入
SceneManager.initInput = function() {
    Input.initialize();
    TouchInput.initialize();
};
//初始化NW JS
SceneManager.initNwjs = function() {
    if (Utils.isNwjs()) {
        var gui = require('nw.gui');
        var win = gui.Window.get();
        if (process.platform === 'darwin' && !win.menu) {
            var menubar = new gui.Menu({ type: 'menubar' });
            var option = { hideEdit: true, hideWindow: true };
            menubar.createMacBuiltin('Game', option);
            win.menu = menubar;
        }
    }
};
//检查插件错误
SceneManager.checkPluginErrors = function() {
    PluginManager.checkErrors();
};
//设置错误处理程序
SceneManager.setupErrorHandlers = function() {
    window.addEventListener('error', this.onError.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
};
//要求更新
SceneManager.requestUpdate = function() {
	//如果 不是 停止的 
    if (!this._stopped) {
	    //请求动画帧 ( 更新 绑定(this))
        requestAnimationFrame(this.update.bind(this));
    }
};
//更新
SceneManager.update = function() {
    try {
	    //标记开始
        this.tickStart(); 
        if (Utils.isMobileSafari()) {
            this.updateInputData();
        }
        //更新主要
        this.updateMain();
        //标记结束
        this.tickEnd();
    } catch (e) {
	    //捕捉异常
        this.catchException(e);
    }
};
//终止
SceneManager.terminate = function() {
    window.close();
};
//出错时
SceneManager.onError = function(e) {
    console.error(e.message);
    console.error(e.filename, e.lineno);
    try {
        this.stop();
        Graphics.printError('Error', e.message);
        AudioManager.stopAll();
    } catch (e2) {
    }
};
//在键按下
SceneManager.onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
        case 116:   // F5
            if (Utils.isNwjs()) {
                location.reload();
            }
            break;
        case 119:   // F8
            if (Utils.isNwjs() && Utils.isOptionValid('test')) {
                require('nw.gui').Window.get().showDevTools();
            }
            break;
        }
    }
};
//捕捉异常
SceneManager.catchException = function(e) {
    if (e instanceof Error) {
        Graphics.printError(e.name, e.message);
        console.error(e.stack);
    } else {
        Graphics.printError('UnknownError', e);
    }
    AudioManager.stopAll();
    this.stop();
};
//标记开始
SceneManager.tickStart = function() {
    Graphics.tickStart();
};
//标记结束
SceneManager.tickEnd = function() {
    Graphics.tickEnd();
};
//更新输入数据
SceneManager.updateInputData = function() {
    Input.update();
    TouchInput.update();
};
//更新主要
SceneManager.updateMain = function() {
    if (Utils.isMobileSafari()) {
        this.changeScene();
        this.updateScene();
    } else {
        var newTime = this._getTimeInMs();
        var fTime = (newTime - this._currentTime) / 1000;
        if (fTime > 0.25) fTime = 0.25;
        this._currentTime = newTime;
        this._accumulator += fTime;
        while (this._accumulator >= this._deltaTime) {
            this.updateInputData();
            this.changeScene();
            this.updateScene();
            this._accumulator -= this._deltaTime;
        }
    }
    this.renderScene();
    this.requestUpdate();
};
//更新管理器
SceneManager.updateManagers = function(ticks, delta) {
    ImageManager.cache.update(ticks, delta);
};


//改变场景
SceneManager.changeScene = function() {
	//如果 是场景改变中 并且 不是 是当前场景繁忙
    if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
	    //如果 场景 (场景 存在)
        if (this._scene) {
	        //场景 结束
            this._scene.terminate();
            // 之前场景 = 场景 建造者
            this._previousClass = this._scene.constructor;
        }
        //场景 = 下一个场景
        this._scene = this._nextScene;
        if (this._scene) {
	        //场景 创建
            this._scene.create();
            //下一个场景 = null
            this._nextScene = null;
            //场景开始的 = false
            this._sceneStarted = false;
            //当场景创建
            this.onSceneCreate();
        }
        //如果 退出中
        if (this._exiting) {
	        //结束
            this.terminate();
        }
    }
};
//更新场景
SceneManager.updateScene = function() {
	//如果 场景 (场景 存在)
    if (this._scene) {
	    //如果 不是 场景开始的 并且 场景 是准备好
        if (!this._sceneStarted && this._scene.isReady()) {
	        //场景 开始
            this._scene.start();
            //场景开始的 = true
            this._sceneStarted = true;
            //当场景开始
            this.onSceneStart();
        }
        //如果 是当前的场景开始后
        if (this.isCurrentSceneStarted()) {
	        //场景 更新
            this._scene.update();
        }
    }
};
//转化场景
SceneManager.renderScene = function() {
    //如果 是当前的场景开始后
    if (this.isCurrentSceneStarted()) {
	    //图形 转化(场景)
        Graphics.render(this._scene);
    //否则 如果 场景 (场景存在)
    } else if (this._scene) {
	    //当场景读取中
        this.onSceneLoading();
    }
};
//当场景创建
SceneManager.onSceneCreate = function() {
	//图形 开始读取中
    Graphics.startLoading();
};
//当场景开始
SceneManager.onSceneStart = function() {
	//图形 结束读取中
    Graphics.endLoading();
};
//当场景读取中
SceneManager.onSceneLoading = function() {
	//图形 更新读取中
    Graphics.updateLoading();
};
//是场景改变中
SceneManager.isSceneChanging = function() {
	//返回 退出中 或者 !!下一个场景 (下一个场景 返回 true 或者 false)
    return this._exiting || !!this._nextScene;
};
//是当前场景忙碌
SceneManager.isCurrentSceneBusy = function() {
	//返回  场景 (场景 存在) 并且 场景 是繁忙
    return this._scene && this._scene.isBusy();
};
//是当前场景开始后
SceneManager.isCurrentSceneStarted = function() {
	//返回 场景 (场景存在) 并且 场景开始的 
    return this._scene && this._sceneStarted;
};
//是下一个场景
SceneManager.isNextScene = function(sceneClass) {
	//返回 下一个场景 (下一个场景 存在) 并且 下一个场景 创造者 === sceneClass
    return this._nextScene && this._nextScene.constructor === sceneClass;
};
//是之前场景
SceneManager.isPreviousScene = function(sceneClass) {
	//返回 之前场景 创造者 === sceneClass
    return this._previousClass === sceneClass;
};
//转到
SceneManager.goto = function(sceneClass) {
	//如果( 场景类 )  
    if (sceneClass) {
	    //下一个场景 = 新 场景类()
        this._nextScene = new sceneClass();
    }
    //如果 (场景)
    if (this._scene) {
	    //场景 停止()
        this._scene.stop();
    }
};
//添加
SceneManager.push = function(sceneClass) {
	//堆 添加 (场景 创造者)
    this._stack.push(this._scene.constructor);
    //转到 (场景类)
    this.goto(sceneClass);
};
//末尾
SceneManager.pop = function() {
	//如果 堆 长度 > 0 
    if (this._stack.length > 0) {
	    //转到 堆 最后一个(并删除)
        this.goto(this._stack.pop());
    } else {
	    //退出
        this.exit();
    }
};
//退出
SceneManager.exit = function() {
	//转到 null
    this.goto(null);
    //退出中 = true
    this._exiting = true;
};
//清除堆
SceneManager.clearStack = function() {
	//堆 = []
    this._stack = [];
};
//停止
SceneManager.stop = function() {
	//停止的 = true
    this._stopped = true;
};
//准备下一个场景
SceneManager.prepareNextScene = function() {
	//下一个场景 准备 应用(下一个 场景,参数 )
    this._nextScene.prepare.apply(this._nextScene, arguments);
};
//拍摄
SceneManager.snap = function() {
	//返回 图片 拍摄(场景)
    return Bitmap.snap(this._scene);
};
//拍摄为了背景
SceneManager.snapForBackground = function() {
	//背景图片 = 拍摄
    this._backgroundBitmap = this.snap();
    //背景图片 模糊
    this._backgroundBitmap.blur();
};
//背景图片
SceneManager.backgroundBitmap = function() {
	//返回 背景图片
    return this._backgroundBitmap;
};
