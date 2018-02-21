
/**----------------------------------------------------------------------------- */
/** Scene_Menu */
/** 场景菜单 */
/** The scene class of the menu screen. */
/** 处理 菜单画面 的 场景类  */

function Scene_Menu() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Scene_Menu.prototype = Object.create(Scene_MenuBase.prototype);
/**设置创造者 */
Scene_Menu.prototype.constructor = Scene_Menu;
/**初始化 */
Scene_Menu.prototype.initialize = function() {
    //场景菜单基础 初始化 呼叫(this)
    Scene_MenuBase.prototype.initialize.call(this);
};
/**创建 */
Scene_Menu.prototype.create = function() {
    //场景菜单基础 创建 呼叫(this)
    Scene_MenuBase.prototype.create.call(this);
    //创建命令窗口()
    this.createCommandWindow();
    //创建金钱窗口()
    this.createGoldWindow();
    //创建状态窗口()
    this.createStatusWindow();
};
/**开始 */
Scene_Menu.prototype.start = function() {
    //场景菜单基础 开始 呼叫(this)
    Scene_MenuBase.prototype.start.call(this);
    //状态窗口 刷新()
    this._statusWindow.refresh();
};
/**创建命令窗口 */
Scene_Menu.prototype.createCommandWindow = function() {
    //命令窗口 = 新 命令窗口(0,0)
    this._commandWindow = new Window_MenuCommand(0, 0);
    //命令窗口 设置处理("item"//物品 , 命令物品 绑定(this))
    this._commandWindow.setHandler('item',      this.commandItem.bind(this));
    //命令窗口 设置处理("skill"//技能 , 命令个人 绑定(this))
    this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
    //命令窗口 设置处理("equip"//装备 , 命令个人 绑定(this))
    this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
    //命令窗口 设置处理("status"//状态 , 命令个人 绑定(this))
    this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
    //命令窗口 设置处理("formation"//编队 , 命令编队 绑定(this))
    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    //命令窗口 设置处理("options"//选项 , 命令选项 绑定(this))
    this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
    //命令窗口 设置处理("save"//保存 , 命令保存 绑定(this))
    this._commandWindow.setHandler('save',      this.commandSave.bind(this));
    //命令窗口 设置处理("gameEnd"//游戏结束 , 命令结束游戏 绑定(this))
    this._commandWindow.setHandler('gameEnd',   this.commandGameEnd.bind(this));
    //命令窗口 设置处理("cancel"//取消 , 删除场景 绑定(this))
    this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    //添加窗口(命令窗口)
    this.addWindow(this._commandWindow);
};
/**创建金钱窗口 */
Scene_Menu.prototype.createGoldWindow = function() {
    //金钱窗口 = 新 窗口金钱(0,0)
    this._goldWindow = new Window_Gold(0, 0);
    //金钱窗口 y = 图形 盒高 - 金钱窗口 高
    this._goldWindow.y = Graphics.boxHeight - this._goldWindow.height;
    //添加窗口(金钱窗口)
    this.addWindow(this._goldWindow);
};
/**创建状态窗口 */
Scene_Menu.prototype.createStatusWindow = function() {
    //状态窗口 = 新 窗口菜单状态(命令窗口 宽 , 0 )
    this._statusWindow = new Window_MenuStatus(this._commandWindow.width, 0);
    this._statusWindow.reserveFaceImages();
    //添加窗口(状态窗口)
    this.addWindow(this._statusWindow);
};
/**命令物品 */
Scene_Menu.prototype.commandItem = function() {
    SceneManager.push(Scene_Item);
};
/**命令个人 */
Scene_Menu.prototype.commandPersonal = function() {
    this._statusWindow.setFormationMode(false);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok',     this.onPersonalOk.bind(this));
    this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
};
/**命令编队 */
Scene_Menu.prototype.commandFormation = function() {
    this._statusWindow.setFormationMode(true);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok',     this.onFormationOk.bind(this));
    this._statusWindow.setHandler('cancel', this.onFormationCancel.bind(this));
};
/**命令选项 */
Scene_Menu.prototype.commandOptions = function() {
    SceneManager.push(Scene_Options);
};
/**命令保存 */
Scene_Menu.prototype.commandSave = function() {
    SceneManager.push(Scene_Save);
};
/**命令结束游戏 */
Scene_Menu.prototype.commandGameEnd = function() {
    SceneManager.push(Scene_GameEnd);
};
/**当个人确定 */
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
/**当个人取消 */
Scene_Menu.prototype.onPersonalCancel = function() {
    //状态窗口 取消选择()
    this._statusWindow.deselect();
    //命令窗口 活动()
    this._commandWindow.activate();
};
/**当编队确定 */
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
/**当编队取消 */
Scene_Menu.prototype.onFormationCancel = function() {
    //如果(状态窗口 未决定索引() >= 0 )
    if (this._statusWindow.pendingIndex() >= 0) {
        //状态窗口 设置未决定索引(-1)
        this._statusWindow.setPendingIndex(-1);
        //状态窗口 活动()
        this._statusWindow.activate();
    //否则
    } else {
        //状态窗口 取消选择()
        this._statusWindow.deselect();
        //命令窗口 活动()
        this._commandWindow.activate();
    }
};
