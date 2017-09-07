
//-----------------------------------------------------------------------------
// Scene_Options
// 选项场景
// The scene class of the options screen.
// 处理 选项画面 的类

function Scene_Options() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Scene_Options.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_Options.prototype.constructor = Scene_Options;
//初始化
Scene_Options.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//创建
Scene_Options.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
};
//终止
Scene_Options.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
};
//创建选项窗口
Scene_Options.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_Options();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
};
