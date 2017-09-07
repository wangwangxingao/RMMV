
/**-----------------------------------------------------------------------------  
 * 游戏中所有场景的 超级类  
 * The Superclass of all scene within the game. 
 * 场景基础  
 * @class Scene_Base  
 * @constructor   
 * @extends Stage 
 *  
 * */
 
function Scene_Base() {
	//调用 初始化
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Scene_Base.prototype = Object.create(Stage.prototype);
/**设置创造者 */
Scene_Base.prototype.constructor = Scene_Base;

/**
 * 初始化
 * Create a instance of Scene_Base.
 * 创建一个场景基础
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.initialize = function() {
	//舞台 初始化 呼叫(this)
    Stage.prototype.initialize.call(this);
    //活动标志 = false 
    this._active = false;
    //淡入记号 = 0 
    this._fadeSign = 0;
    //淡入持续时间 = 0 
    this._fadeDuration = 0;
    //淡入精灵 = null
    this._fadeSprite = null;
    this._imageReservationId = Utils.generateRuntimeId();
};

/**
 * 附加预订
 * Attach a reservation to the reserve queue.
 * 附加一个预订 到 预订 队列
 * @method attachReservation
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.attachReservation = function() {
    ImageManager.setDefaultReservationId(this._imageReservationId);
};

/**
 * 移除预订
 * Remove the reservation from the Reserve queue.
 * 附加一个预订 从 预订 队列
 * @method detachReservation
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.detachReservation = function() {
    ImageManager.releaseReservation(this._imageReservationId);
};

/**创建
 * Create the components and add them to the rendering process.
 * 
 * @method create
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.create = function() {
};
/**是活动
 * Returns whether the scene is active or not.
 * 
 * @method isActive
 * @instance 
 * @memberof Scene_Base
 * @return {boolean} return true if the scene is active
 */
Scene_Base.prototype.isActive = function() {
	//返回 活动标志
    return this._active;
};
/**是准备好  
 * Return whether the scene is ready to start or not.
 * 
 * @method isReady
 * @instance 
 * @memberof Scene_Base
 * @return {boolean} Return true if the scene is ready to start
 */
Scene_Base.prototype.isReady = function() {
	//返回 图像管理器 是准备好()
    return ImageManager.isReady();
};
/**开始 
 * Start the scene processing.
 * 
 * @method start
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.start = function() {
	//活动标志 = true
    this._active = true;
};
/**更新 
 * Update the scene processing each new frame.
 * 
 * @method update
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.update = function() {
	//更新淡化()
    this.updateFade();
    //更新子代()
    this.updateChildren();
    //声音管理器 检查错误()
    AudioManager.checkErrors();
};
/**停止 
 * Stop the scene processing.
 * 
 * @method stop
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.stop = function() {
	//活动标志 = false
    this._active = false;
};
/**是忙碌的 
 * Return whether the scene is busy or not.
 * 
 * @method isBusy
 * @instance
 * @memberof Scene_Base
 * @return {boolean} Return true if the scene is currently busy
 */
Scene_Base.prototype.isBusy = function() {
	//返回 淡化持续时间 > 0
    return this._fadeDuration > 0;
};
/**结束 
 * Terminate the scene before switching to a another scene.
 * 
 * @method terminate
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.terminate = function() {
};
/**创建窗口层 
 * Create the layer for the windows children
 * and add it to the rendering process.
 * 
 * @method createWindowLayer
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.createWindowLayer = function() {
	//宽 = 图形 盒子宽
    var width = Graphics.boxWidth;
	//高 = 图形 盒子高
    var height = Graphics.boxHeight;
    //x = (图形 宽  - 宽 ) / 2 
    var x = (Graphics.width - width) / 2;
    //y = (图形 高  - 高 ) / 2 
    var y = (Graphics.height - height) / 2;
    //设置 窗口层
    this._windowLayer = new WindowLayer();
    //窗口层 移动(x,y,宽,高)
    this._windowLayer.move(x, y, width, height);
    //添加子代(窗口层)
    this.addChild(this._windowLayer);
};
/**添加窗口(window) 
 * Add the children window to the windowLayer processing.
 * 
 * @method addWindow
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.addWindow = function(window) {
	//窗口层 添加子项(窗口)
    this._windowLayer.addChild(window);
};
/**开始淡入(持续时间,白色) 
 * Request a fadeIn screen process.
 * 
 * @method startFadeIn
 * @param {number} [duration=30] The time the process will take for fadeIn the screen
 * @param {boolean} [white=false] If true the fadein will be process with a white color else it's will be black
 * 
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.startFadeIn = function(duration, white) {
	//创建淡化精灵(白色)
    this.createFadeSprite(white);
    //淡化标志 = 1
    this._fadeSign = 1;
    //淡化持续时间 = 持续时间 或 30
    this._fadeDuration = duration || 30;
    //淡化精灵 不透明度 = 255
    this._fadeSprite.opacity = 255;
};
/**开始淡出(持续时间,白色)
 * Request a fadeOut screen process.
 * 
 * @method startFadeOut
 * @param {number} [duration=30] The time the process will take for fadeOut the screen
 * @param {boolean} [white=false] If true the fadeOut will be process with a white color else it's will be black
 * 
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.startFadeOut = function(duration, white) {
	//创建淡化精灵(白色)
    this.createFadeSprite(white);
    //淡化标志 = -1
    this._fadeSign = -1;
    //淡化持续时间 = 持续时间 或 30
    this._fadeDuration = duration || 30;
    //淡化精灵 不透明度 = 0
    this._fadeSprite.opacity = 0;
};
/**创建淡化精灵(白色) 
 * Create a Screen sprite for the fadein and fadeOut purpose and
 * add it to the rendering process.
 * 
 * @method createFadeSprite
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.createFadeSprite = function(white) {
	//如果( 不是 淡化精灵 )
    if (!this._fadeSprite) {
	    //淡化精灵 = 新 画面精灵() 
        this._fadeSprite = new ScreenSprite();
        //添加子代( 淡化精灵 )
        this.addChild(this._fadeSprite);
    }
    //如果 白色 存在
    if (white) {
	    //淡化精灵 设置白色()
        this._fadeSprite.setWhite();
    } else {
	    //淡化精灵 设置黑色()
        this._fadeSprite.setBlack();
    }
};
/**更新淡化
 * Update the screen fade processing.
 * 
 * @method updateFade
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.updateFade = function() {
	//如果 淡化持续时间 > 0
    if (this._fadeDuration > 0) {
        //d = 淡化持续时间
        var d = this._fadeDuration;
        //如果 (淡化标志 > 0)
        if (this._fadeSign > 0) {
	        //淡化精灵 不透明度 -=  淡化精灵 不透明度 / 持续时间
            this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
        } else {
	        //淡化精灵 不透明度 +=  (255 - 淡化精灵 不透明度) / 持续时间
            this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
        }
        //淡化持续时间 --
        this._fadeDuration--;
    }
};
/**更新子代
 * Update the children of the scene EACH frame.
 * 
 * @method updateChildren
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.updateChildren = function() {
    //子代 对每一个(子)
    this.children.forEach(function(child) {
	    //如果 子 更新 
        if (child.update) {
	        //子 更新()
            child.update();
        }
    });
};
/**删除场景 
 * Pop the scene from the stack array and switch to the
 * previous scene.
 * 
 * @method popScene
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.popScene = function() {
	//场景管理器 删除()   //返回末尾
    SceneManager.pop();
};
/**检查游戏结束 
 * Check whether the game should be triggering a gameover.
 * 
 * @method checkGameover
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.checkGameover = function() {
	//如果 (游戏队伍 是全部死了() )
    if ($gameParty.isAllDead()) {
	    //场景管理器 转到 (游戏结束场景)
        SceneManager.goto(Scene_Gameover);
    }
};
/**淡出所有 
 * Slowly fade out all the visual and audio of the scene.
 * 
 * @method fadeOutAll
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.fadeOutAll = function() {
	//时间 = 缓慢淡化速率 / 60
    var time = this.slowFadeSpeed() / 60;
    //音频管理器 淡出 bgm 
    AudioManager.fadeOutBgm(time);
    //音频管理器 淡出 bgs 
    AudioManager.fadeOutBgs(time);
    //音频管理器 淡出 me
    AudioManager.fadeOutMe(time);
    //开始淡出 (缓慢淡化速率)
    this.startFadeOut(this.slowFadeSpeed());
};
/**淡化速率 
 * Return the screen fade speed value.
 * 
 * @method fadeSpeed
 * @instance 
 * @memberof Scene_Base
 * @return {number} Return the fade speed
 */
Scene_Base.prototype.fadeSpeed = function() {
    return 24;
};
/**缓慢淡化速率 
 * Return a slow screen fade speed value.
 * 
 * @method slowFadeSpeed
 * @instance 
 * @memberof Scene_Base
 * @return {number} Return the fade speed
 */
Scene_Base.prototype.slowFadeSpeed = function() {
	//返回 淡化速率 * 2
    return this.fadeSpeed() * 2;
};
