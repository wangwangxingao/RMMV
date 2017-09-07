
//-----------------------------------------------------------------------------
// Window_EquipSlot
// 窗口装备槽
// The window for selecting an equipment slot on the equipment screen.
// 装备画面选择一个装备槽的窗口

function Window_EquipSlot() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_EquipSlot.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_EquipSlot.prototype.constructor = Window_EquipSlot;
//初始化
Window_EquipSlot.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this.refresh();
};
//设置角色
Window_EquipSlot.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};
//更新
Window_EquipSlot.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setSlotId(this.index());
    }
};
//最大项目
Window_EquipSlot.prototype.maxItems = function() {
    return this._actor ? this._actor.equipSlots().length : 0;
};
//项目
Window_EquipSlot.prototype.item = function() {
    return this._actor ? this._actor.equips()[this.index()] : null;
};
//绘制项目
Window_EquipSlot.prototype.drawItem = function(index) {
    if (this._actor) {
        var rect = this.itemRectForText(index);
        this.changeTextColor(this.systemColor());
        this.changePaintOpacity(this.isEnabled(index));
        this.drawText(this.slotName(index), rect.x, rect.y, 138, this.lineHeight());
        this.drawItemName(this._actor.equips()[index], rect.x + 138, rect.y);
        this.changePaintOpacity(true);
    }
};
//槽名称
Window_EquipSlot.prototype.slotName = function(index) {
    var slots = this._actor.equipSlots();
    return this._actor ? $dataSystem.equipTypes[slots[index]] : '';
};
//是允许
Window_EquipSlot.prototype.isEnabled = function(index) {
    return this._actor ? this._actor.isEquipChangeOk(index) : false;
};
//是当前项目允许
Window_EquipSlot.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.index());
};
//设置状态窗口
Window_EquipSlot.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};
//设置项目窗口
Window_EquipSlot.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
    this.update();
};
//更新帮助
Window_EquipSlot.prototype.updateHelp = function() {
    Window_Selectable.prototype.updateHelp.call(this);
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setTempActor(null);
    }
};
