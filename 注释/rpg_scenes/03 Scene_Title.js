
/**----------------------------------------------------------------------------- */
/** Scene_Title */
/** 场景标题  */
/** The scene class of the title screen. */
/** 处理 标题画面 的 场景类 */

function Scene_Title() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Scene_Title.prototype = Object.create(Scene_Base.prototype);
/**设置创造者 */
Scene_Title.prototype.constructor = Scene_Title;
/**初始化 */
Scene_Title.prototype.initialize = function() {
    //场景标题 初始化
    Scene_Base.prototype.initialize.call(this);
};
/**创建 */
Scene_Title.prototype.create = function() {
    //场景基础 创建 呼叫(this)
    Scene_Base.prototype.create.call(this);
    //创建背景()
    this.createBackground();
    //创建前景()
    this.createForeground();
    //创建窗口层()
    this.createWindowLayer();
    //创建命令窗口()
    this.createCommandWindow();
};
/**开始 */    
Scene_Title.prototype.start = function() {
    //场景基础 开始 呼叫(this)
    Scene_Base.prototype.start.call(this);
    //场景管理器 清除堆()
    SceneManager.clearStack();
    //中心精灵(背景精灵1)
    this.centerSprite(this._backSprite1);
    //中心精灵(背景精灵2)
    this.centerSprite(this._backSprite2);
    //播放标题音乐()
    this.playTitleMusic();
    //开始淡入(淡入速度(), false)
    this.startFadeIn(this.fadeSpeed(), false);
};
/**更新 */
Scene_Title.prototype.update = function() {
    //如果(不是 是忙碌())
    if (!this.isBusy()) {
        //命令窗口 打开()
        this._commandWindow.open();
    }
    //场景基础 更新 呼叫(this)
    Scene_Base.prototype.update.call(this);
};
/**是忙碌 
 * @return {boolean}
 */
Scene_Title.prototype.isBusy = function() {
    //返回 命令窗口 是关闭中() 或者 场景基础 是忙碌 呼叫 (this)
    return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
};
/**终止 */
Scene_Title.prototype.terminate = function() {
    //场景基础 终止 呼叫 (this)
    Scene_Base.prototype.terminate.call(this);
    //场景管理器 拍摄为了背景()
    SceneManager.snapForBackground();
};
/**创建背景 */
Scene_Title.prototype.createBackground = function() {
	//背景精灵1 = 新 精灵
    this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
    //背景精灵2 = 新 精灵
    this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
    //添加子项(  背景精灵1 )
    this.addChild(this._backSprite1);
    //添加子项(  背景精灵2 )
    this.addChild(this._backSprite2);
};
/**创建前景 */
Scene_Title.prototype.createForeground = function() {
	//游戏标题精灵 = 新  精灵( 新 图片(图形 宽 , 图形 高) )
    this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    //添加子项(游戏标题精灵)
    this.addChild(this._gameTitleSprite);
    //如果(数据系统 绘制标题)
    if ($dataSystem.optDrawTitle) {
        //绘制游戏标题()
        this.drawGameTitle();
    }
};
/**绘制游戏标题 */
Scene_Title.prototype.drawGameTitle = function() {
    //x = 20
    var x = 20;
    //y = 图形 高 / 4
    var y = Graphics.height / 4;
    //最大宽 = 图形 宽 - x * 2
    var maxWidth = Graphics.width - x * 2;
    //文本 = 数据系统 游戏标题
    var text = $dataSystem.gameTitle;
    //游戏标题精灵 位图 外线颜色 = "black"
    this._gameTitleSprite.bitmap.outlineColor = 'black';
    //游戏标题精灵 位图 外线宽 = 8
    this._gameTitleSprite.bitmap.outlineWidth = 8;
    //游戏标题精灵 位图 字体大小 = 72
    this._gameTitleSprite.bitmap.fontSize = 72;
    this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
};
/**中央精灵 */
Scene_Title.prototype.centerSprite = function(sprite) {
    //精灵 x = 图形 宽 / 2 
    sprite.x = Graphics.width / 2;
    //精灵 y = 图形 高 / 2 
    sprite.y = Graphics.height / 2;
    //精灵 锚点 x = 0.5 
    sprite.anchor.x = 0.5;
    //精灵 锚点 y = 0.5 
    sprite.anchor.y = 0.5;
};
/**创造命令窗口 */
Scene_Title.prototype.createCommandWindow = function() {
	//命令窗口 = 新 窗口标题命令()
    this._commandWindow = new Window_TitleCommand();
    //命令窗口 设置处理("newGame"//新游戏 , 命令新游戏 绑定(this))
    this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
    //命令窗口 设置处理("continue"//继续 , 命令继续 绑定(this))
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    //命令窗口 设置处理("options"//选项 , 命令选项 绑定(this))
    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
    //添加窗口(命令窗口)
    this.addWindow(this._commandWindow);
};
/**命令新游戏 */
Scene_Title.prototype.commandNewGame = function() {
    //数据管理器 安装新游戏()
    DataManager.setupNewGame();
    //命令窗口 关闭()
    this._commandWindow.close();
    //淡出所有()
    this.fadeOutAll();
    //场景管理器 转到(Scene_Map//场景地图)
    SceneManager.goto(Scene_Map);
};
/**命令继续 */
Scene_Title.prototype.commandContinue = function() {
    //命令窗口 关闭()
    this._commandWindow.close();
    //场景管理器 转到(Scene_Map//场景读取)
    SceneManager.push(Scene_Load);
};
/**命令选项 */
Scene_Title.prototype.commandOptions = function() {
    //命令窗口 关闭()
    this._commandWindow.close();
    //场景管理器 添加(Scene_Options //场景选项 )
    SceneManager.push(Scene_Options);
};
/**播放标题音乐 */
Scene_Title.prototype.playTitleMusic = function() {
    //音频管理器 播放bgm(数据系统 标题bgm)
    AudioManager.playBgm($dataSystem.titleBgm);
    //音效管理器 停止bgs()
    AudioManager.stopBgs();
    //音效管理器 停止me()
    AudioManager.stopMe();
};
