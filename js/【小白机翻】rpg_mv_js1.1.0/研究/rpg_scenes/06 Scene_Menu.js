
//-----------------------------------------------------------------------------
// Scene_Menu
// 菜单场景
// The scene class of the menu screen.
// 处理 菜单画面 的 场景类 

function Scene_Menu() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Scene_Menu.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_Menu.prototype.constructor = Scene_Menu;
//初始化
Scene_Menu.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//创建
Scene_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createGoldWindow();
    this.createStatusWindow();
};
//开始
Scene_Menu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.refresh();
};
//创建命令窗口
Scene_Menu.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_MenuCommand(0, 0);
    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
    this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
    this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
    this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
    this._commandWindow.setHandler('save',      this.commandSave.bind(this));
    this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};
//创建金钱窗口
Scene_Menu.prototype.createGoldWindow = function() {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;
    this.addWindow(this._goldWindow);
};
//创建状态窗口
Scene_Menu.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_MenuStatus(this._commandWindow.width, 0);
    this.addWindow(this._statusWindow);
};
//命令物品
Scene_Menu.prototype.commandItem = function() {
    SceneManager.push(Scene_Item);
};
//命令个人
Scene_Menu.prototype.commandPersonal = function() {
    this._statusWindow.setFormationMode(false);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok',     this.onPersonalOk.bind(this));
    this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
};
//命令编队
Scene_Menu.prototype.commandFormation = function() {
    this._statusWindow.setFormationMode(true);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok',     this.onFormationOk.bind(this));
    this._statusWindow.setHandler('cancel', this.onFormationCancel.bind(this));
};
//命令选项
Scene_Menu.prototype.commandOptions = function() {
    SceneManager.push(Scene_Options);
};
//命令保存
Scene_Menu.prototype.commandSave = function() {
    SceneManager.push(Scene_Save);
};
//命令结束游戏
Scene_Menu.prototype.commandGameEnd = function() {
    SceneManager.push(Scene_GameEnd);
};
//当个人确定
Scene_Menu.prototype.onPersonalOk = function() {
    switch (this._commandWindow.currentSymbol()) {
    case 'skill':
        SceneManager.push(Scene_Skill);
        break;
    case 'equip':
        SceneManager.push(Scene_Equip);
        break;
    case 'status':
        SceneManager.push(Scene_Status);
        break;
    }
};
//当个人取消
Scene_Menu.prototype.onPersonalCancel = function() {
    this._statusWindow.deselect();
    this._commandWindow.activate();
};
//当编队确定
Scene_Menu.prototype.onFormationOk = function() {
    var index = this._statusWindow.index();
    var actor = $gameParty.members()[index];
    var pendingIndex = this._statusWindow.pendingIndex();
    if (pendingIndex >= 0) {
        $gameParty.swapOrder(index, pendingIndex);
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.redrawItem(index);
    } else {
        this._statusWindow.setPendingIndex(index);
    }
    this._statusWindow.activate();
};
//当编队取消
Scene_Menu.prototype.onFormationCancel = function() {
    if (this._statusWindow.pendingIndex() >= 0) {
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.activate();
    } else {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }
};
