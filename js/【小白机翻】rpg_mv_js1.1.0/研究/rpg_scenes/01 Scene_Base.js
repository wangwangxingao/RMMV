
//-----------------------------------------------------------------------------
// Scene_Base
// 基础场景
// The superclass of all scenes within the game.
// 游戏中所有场景的 超级类
 
function Scene_Base() {
	//调用 初始化
    this.initialize.apply(this, arguments);
}
//设置原形 
Scene_Base.prototype = Object.create(Stage.prototype);
//设置创造者
Scene_Base.prototype.constructor = Scene_Base;
//初始化
Scene_Base.prototype.initialize = function() {
	//继承 舞台 初始化
    Stage.prototype.initialize.call(this);
    //活动标志 关闭
    this._active = false;
    //设置 淡入记号
    this._fadeSign = 0;
    //设置 淡入持续时间
    this._fadeDuration = 0;
    //设置 淡入精灵
    this._fadeSprite = null;
};
//创造
Scene_Base.prototype.create = function() {
};
//是活动
Scene_Base.prototype.isActive = function() {
	//返回 活动标志
    return this._active;
};
//是准备好
Scene_Base.prototype.isReady = function() {
	//返回 图像管理器 是准备好
    return ImageManager.isReady();
};
//开始
Scene_Base.prototype.start = function() {
	//活动标志 设为 true
    this._active = true;
};
//更新
Scene_Base.prototype.update = function() {
	//更新淡入淡出
    this.updateFade();
    //更新 子代们
    this.updateChildren();
    //声音管理器 检查错误
    AudioManager.checkErrors();
};
//停止
Scene_Base.prototype.stop = function() {
	//活动标志 设为 false
    this._active = false;
};
//是忙碌的
Scene_Base.prototype.isBusy = function() {
	//返回淡入淡出持续时间 大于 0
    return this._fadeDuration > 0;
};
//结束
Scene_Base.prototype.terminate = function() {
};
//创造窗口层
Scene_Base.prototype.createWindowLayer = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    //设置 窗口层
    this._windowLayer = new WindowLayer();
    //窗口层 移动到
    this._windowLayer.move(x, y, width, height);
    //窗口层 添加 到子代
    this.addChild(this._windowLayer);
};
//添加窗口(window)
Scene_Base.prototype.addWindow = function(window) {
	//窗口添加到 窗口层
    this._windowLayer.addChild(window);
};
//开始淡入(持续时间,白色)
Scene_Base.prototype.startFadeIn = function(duration, white) {
	//创造淡入精灵(白色)
    this.createFadeSprite(white);
    //淡入标志 = 1
    this._fadeSign = 1;
    //淡入持续时间 = 持续时间 或 30
    this._fadeDuration = duration || 30;
    //淡入精灵 不透明度 = 255
    this._fadeSprite.opacity = 255;
};
//开始淡出(持续时间,白色)
Scene_Base.prototype.startFadeOut = function(duration, white) {
	//创造淡入精灵(白色)
    this.createFadeSprite(white);
    //淡入标志 = -1
    this._fadeSign = -1;
    //淡入持续时间 = 持续时间 或 30
    this._fadeDuration = duration || 30;
    //淡入精灵 不透明度 = 0
    this._fadeSprite.opacity = 0;
};
//创造淡入精灵(白色)
Scene_Base.prototype.createFadeSprite = function(white) {
	//如果 不是 淡入精灵
    if (!this._fadeSprite) {
	    //设置 淡入精灵 为一个画面精灵 
        this._fadeSprite = new ScreenSprite();
        //淡入精灵 添加
        this.addChild(this._fadeSprite);
    }
    //如果 白色 存在
    if (white) {
	    //淡入精灵 设置白色
        this._fadeSprite.setWhite();
    } else {
	    //淡入精灵 设置黑色
        this._fadeSprite.setBlack();
    }
};
//更新淡入
Scene_Base.prototype.updateFade = function() {
	//如果 淡入持续时间 > 0
    if (this._fadeDuration > 0) {
        var d = this._fadeDuration;
        //如果 淡入标志 > 0
        if (this._fadeSign > 0) {
	        //淡入精灵 不透明度 - 不透明度 / 持续时间
            this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
        } else {
	        //淡入精灵 不透明度 + 透明度 / 持续时间
            this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
        }
        // 淡入持续时间 - 1 
        this._fadeDuration--;
    }
};
//更新 子代们
Scene_Base.prototype.updateChildren = function() {
    this.children.forEach(function(child) {
	    //如果 子代 更新 
        if (child.update) {
	        //子代 更新
            child.update();
        }
    });
};
//返回 (删除)末尾 场景
Scene_Base.prototype.popScene = function() {
	//场景管理器 返回(删除)末尾
    SceneManager.pop();
};
//检查游戏结束
Scene_Base.prototype.checkGameover = function() {
	//游戏队伍 是全死
    if ($gameParty.isAllDead()) {
	    //场景管理器 转到 游戏结束场景
        SceneManager.goto(Scene_Gameover);
    }
};
//淡出 所有
Scene_Base.prototype.fadeOutAll = function() {
	//时间 = 缓慢淡出速率 / 60
    var time = this.slowFadeSpeed() / 60;
    //音频管理器 淡出 bgm 
    AudioManager.fadeOutBgm(time);
    //音频管理器 淡出 bgs 
    AudioManager.fadeOutBgs(time);
    //音频管理器 淡出 me
    AudioManager.fadeOutMe(time);
    //开始淡出 (缓慢淡出速率)
    this.startFadeOut(this.slowFadeSpeed());
};
//淡出速率 
Scene_Base.prototype.fadeSpeed = function() {
    return 24;
};
//缓慢淡出速率
Scene_Base.prototype.slowFadeSpeed = function() {
	//返回 淡出速率 * 2
    return this.fadeSpeed() * 2;
};
