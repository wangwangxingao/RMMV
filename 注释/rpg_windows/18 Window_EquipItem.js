
/**----------------------------------------------------------------------------- */
/** Window_EquipItem */
/** 窗口装备物品 */
/** The window for selecting an equipment item on the equipment screen. */
/** 装备画面选择一个装备物品的窗口 */

function Window_EquipItem() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Window_EquipItem.prototype = Object.create(Window_ItemList.prototype);
/**设置创造者 */
Window_EquipItem.prototype.constructor = Window_EquipItem;
/**初始化
 * @param {number} x x
 * @param {number} y y
 * @param {number} width 宽
 * @param {number} height 高
 * 
 */
Window_EquipItem.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
    //角色 = null
    this._actor = null;
    //槽Id = 0
    this._slotId = 0;
};
/**设置角色
 * @param {Game_Actor} actor 角色
 */
Window_EquipItem.prototype.setActor = function(actor) {
    //如果(角色!= 角色)
    if (this._actor !== actor) {
        //角色 = 角色
        this._actor = actor;
        //刷新()
        this.refresh();
        //重新滚动()
        this.resetScroll();
    }
};
/**设置槽id 
 * @param {number} slotId 槽id
*/
Window_EquipItem.prototype.setSlotId = function(slotId) {
    //如果(槽id!=槽id)
    if (this._slotId !== slotId) {
        //槽id = 槽id
        this._slotId = slotId;
        //刷新()
        this.refresh();
        //重新滚动()
        this.resetScroll();
    }
};
/**包含 */
Window_EquipItem.prototype.includes = function(item) {
    if (item === null) {
        return true;
    }
    if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
        return false;
    }
    return this._actor.canEquip(item);
};
/**是允许 */
Window_EquipItem.prototype.isEnabled = function(item) {
    return true;
};
/**选择列表 */
Window_EquipItem.prototype.selectLast = function() {
};
/**设置状态窗口 */
Window_EquipItem.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};
/**更新帮助 */
Window_EquipItem.prototype.updateHelp = function() {
    Window_ItemList.prototype.updateHelp.call(this);
    if (this._actor && this._statusWindow) {
        var actor = JsonEx.makeDeepCopy(this._actor);
        actor.forceChangeEquip(this._slotId, this.item());
        this._statusWindow.setTempActor(actor);
    }
};
/**播放确定声音 */
Window_EquipItem.prototype.playOkSound = function() {
};
