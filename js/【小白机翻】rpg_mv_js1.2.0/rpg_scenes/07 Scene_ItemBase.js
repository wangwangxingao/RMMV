
//-----------------------------------------------------------------------------
// Scene_ItemBase
// 物品基础场景
// The superclass of Scene_Item and Scene_Skill.
// 物品场景 和 技能场景 的 超级类

function Scene_ItemBase() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Scene_ItemBase.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_ItemBase.prototype.constructor = Scene_ItemBase;
//初始化
Scene_ItemBase.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//创建
Scene_ItemBase.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
};
//创建角色窗口
Scene_ItemBase.prototype.createActorWindow = function() {
    this._actorWindow = new Window_MenuActor();
    this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
    this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};
//物品
Scene_ItemBase.prototype.item = function() {
    return this._itemWindow.item();
};
//使用者
Scene_ItemBase.prototype.user = function() {
    return null;
};
//是光标左
Scene_ItemBase.prototype.isCursorLeft = function() {
    return this._itemWindow.index() % 2 === 0;
};
//显示替代窗口
Scene_ItemBase.prototype.showSubWindow = function(window) {
    window.x = this.isCursorLeft() ? Graphics.boxWidth - window.width : 0;
    window.show();
    window.activate();
};
//隐藏替代窗口
Scene_ItemBase.prototype.hideSubWindow = function(window) {
    window.hide();
    window.deactivate();
    this.activateItemWindow();
};
//当角色确定
Scene_ItemBase.prototype.onActorOk = function() {
    if (this.canUse()) {
        this.useItem();
    } else {
        SoundManager.playBuzzer();
    }
};
//当角色取消
Scene_ItemBase.prototype.onActorCancel = function() {
    this.hideSubWindow(this._actorWindow);
};
//当决定物品
Scene_ItemBase.prototype.determineItem = function() {
    var action = new Game_Action(this.user());
    var item = this.item();
    action.setItemObject(item);
    if (action.isForFriend()) {
        this.showSubWindow(this._actorWindow);
        this._actorWindow.selectForItem(this.item());
    } else {
        this.useItem();
        this.activateItemWindow();
    }
};
//使用物品
Scene_ItemBase.prototype.useItem = function() {
    this.playSeForItem();
    this.user().useItem(this.item());
    this.applyItem();
    this.checkCommonEvent();
    this.checkGameover();
    this._actorWindow.refresh();
};
//活动物品窗口
Scene_ItemBase.prototype.activateItemWindow = function() {
    this._itemWindow.refresh();
    this._itemWindow.activate();
};
//物品目标角色
Scene_ItemBase.prototype.itemTargetActors = function() {
    var action = new Game_Action(this.user());
    action.setItemObject(this.item());
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.members();
    } else {
        return [$gameParty.members()[this._actorWindow.index()]];
    }
};
//能使用
Scene_ItemBase.prototype.canUse = function() {
    return this.user().canUse(this.item()) && this.isItemEffectsValid();
};
//是物品效果有效
Scene_ItemBase.prototype.isItemEffectsValid = function() {
    var action = new Game_Action(this.user());
    action.setItemObject(this.item());
    return this.itemTargetActors().some(function(target) {
        return action.testApply(target);
    }, this);
};
//应用物品
Scene_ItemBase.prototype.applyItem = function() {
    var action = new Game_Action(this.user());
    action.setItemObject(this.item());
    this.itemTargetActors().forEach(function(target) {
        for (var i = 0; i < action.numRepeats(); i++) {
            action.apply(target);
        }
    }, this);
    action.applyGlobal();
};
//检查公共事件
Scene_ItemBase.prototype.checkCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        SceneManager.goto(Scene_Map);
    }
};
