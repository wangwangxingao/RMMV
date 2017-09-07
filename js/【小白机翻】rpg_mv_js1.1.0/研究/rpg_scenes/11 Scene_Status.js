
//-----------------------------------------------------------------------------
// Scene_Status
// 状态场景
// The scene class of the status screen.
// 处理 状态画面 的 场景类

function Scene_Status() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Scene_Status.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_Status.prototype.constructor = Scene_Status;
//初始化
Scene_Status.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//创建
Scene_Status.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._statusWindow = new Window_Status();
    this._statusWindow.setHandler('cancel',   this.popScene.bind(this));
    this._statusWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._statusWindow.setHandler('pageup',   this.previousActor.bind(this));
    this.addWindow(this._statusWindow);
    this.refreshActor();
};
//刷新角色
Scene_Status.prototype.refreshActor = function() {
    var actor = this.actor();
    this._statusWindow.setActor(actor);
};
//当角色改变
Scene_Status.prototype.onActorChange = function() {
    this.refreshActor();
    this._statusWindow.activate();
};
