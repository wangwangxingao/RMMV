
//-----------------------------------------------------------------------------
// Scene_Name
// 名称场景
// The scene class of the name input screen.
// 处理 名称输入画面 的 场景类

function Scene_Name() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Scene_Name.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_Name.prototype.constructor = Scene_Name;
//初始化
Scene_Name.prototype.initialize = function() {
	//菜单基础场景 初始化 呼叫(this)
    Scene_MenuBase.prototype.initialize.call(this);
};
//准备
Scene_Name.prototype.prepare = function(actorId, maxLength) {
	//角色id  = actorId
    this._actorId = actorId;
    //最大长度 = maxLength
    this._maxLength = maxLength;
};
//创建
Scene_Name.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createInputWindow();
};
//开始
Scene_Name.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
};
//创建编辑窗口
Scene_Name.prototype.createEditWindow = function() {
    this._editWindow = new Window_NameEdit(this._actor, this._maxLength);
    this.addWindow(this._editWindow);
};
//创建输入窗口
Scene_Name.prototype.createInputWindow = function() {
    this._inputWindow = new Window_NameInput(this._editWindow);
    this._inputWindow.setHandler('ok', this.onInputOk.bind(this));
    this.addWindow(this._inputWindow);
};
//当输入确定
Scene_Name.prototype.onInputOk = function() {
    this._actor.setName(this._editWindow.name());
    this.popScene();
};
