
//-----------------------------------------------------------------------------
// Scene_GameEnd
// 游戏末场景
// The scene class of the game end screen.
// 处理 游戏末画面 的 场景类

function Scene_GameEnd() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Scene_GameEnd.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_GameEnd.prototype.constructor = Scene_GameEnd;
//初始化
Scene_GameEnd.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//创建
Scene_GameEnd.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
};
//停止
Scene_GameEnd.prototype.stop = function() {
    Scene_MenuBase.prototype.stop.call(this);
    this._commandWindow.close();
};
//创建背景
Scene_GameEnd.prototype.createBackground = function() {
    Scene_MenuBase.prototype.createBackground.call(this);
    this.setBackgroundOpacity(128);
};
//创建命令窗口
Scene_GameEnd.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_GameEnd();
    this._commandWindow.setHandler('toTitle',  this.commandToTitle.bind(this));
    this._commandWindow.setHandler('cancel',   this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};
//命令到
Scene_GameEnd.prototype.commandToTitle = function() {
    this.fadeOutAll();
    SceneManager.goto(Scene_Title);
};
