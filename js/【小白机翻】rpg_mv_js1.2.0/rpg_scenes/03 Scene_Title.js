
//-----------------------------------------------------------------------------
// Scene_Title
// 标题场景
// The scene class of the title screen.
// 处理 标题画面 的 场景类

function Scene_Title() {
    this.initialize.apply(this, arguments);
}
//设置原形 
Scene_Title.prototype = Object.create(Scene_Base.prototype);
//设置创造者
Scene_Title.prototype.constructor = Scene_Title;
//初始化
Scene_Title.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};
//创建
Scene_Title.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createForeground();
    this.createWindowLayer();
    this.createCommandWindow();
};
//开始
Scene_Title.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
    this.centerSprite(this._backSprite1);
    this.centerSprite(this._backSprite2);
    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
};
//更新
Scene_Title.prototype.update = function() {
    if (!this.isBusy()) {
        this._commandWindow.open();
    }
    Scene_Base.prototype.update.call(this);
};
//是忙碌
Scene_Title.prototype.isBusy = function() {
    return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
};
//终止
Scene_Title.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    SceneManager.snapForBackground();
};
//创建背景
Scene_Title.prototype.createBackground = function() {
	//背景精灵1 = 
    this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
    //背景精灵2 = 
    this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
    //添加子项(  背景精灵1 )
    this.addChild(this._backSprite1);
    //添加子项(  背景精灵2 )
    this.addChild(this._backSprite2);
};
//创建前景
Scene_Title.prototype.createForeground = function() {
	//游戏标题精灵
    this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
    this.addChild(this._gameTitleSprite);
    if ($dataSystem.optDrawTitle) {
        this.drawGameTitle();
    }
};
//绘制游戏标题
Scene_Title.prototype.drawGameTitle = function() {
    var x = 20;
    var y = Graphics.height / 4;
    var maxWidth = Graphics.width - x * 2;
    var text = $dataSystem.gameTitle;
    this._gameTitleSprite.bitmap.outlineColor = 'black';
    this._gameTitleSprite.bitmap.outlineWidth = 8;
    this._gameTitleSprite.bitmap.fontSize = 72;
    this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
};
//中央精灵
Scene_Title.prototype.centerSprite = function(sprite) {
    sprite.x = Graphics.width / 2;
    sprite.y = Graphics.height / 2;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
};
//创造命令窗口
Scene_Title.prototype.createCommandWindow = function() {
	//命令窗口 = 
    this._commandWindow = new Window_TitleCommand();
    this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
};
//命令新游戏
Scene_Title.prototype.commandNewGame = function() {
    DataManager.setupNewGame();
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};
//命令继续
Scene_Title.prototype.commandContinue = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Load);
};
//命令选项
Scene_Title.prototype.commandOptions = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Options);
};
//播放标题音乐
Scene_Title.prototype.playTitleMusic = function() {
    AudioManager.playBgm($dataSystem.titleBgm);
    AudioManager.stopBgs();
    AudioManager.stopMe();
};
