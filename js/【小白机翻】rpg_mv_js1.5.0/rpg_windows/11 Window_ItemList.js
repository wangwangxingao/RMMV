
/**----------------------------------------------------------------------------- */
/** Window_ItemList */
/** 窗口物品列表 */
/** The window for selecting an item on the item screen. */
/** 物品画面选择物品的窗口 */

function Window_ItemList() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Window_ItemList.prototype = Object.create(Window_Selectable.prototype);
/**设置创造者 */
Window_ItemList.prototype.constructor = Window_ItemList;
/**初始化 */
Window_ItemList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._category = 'none';
    this._data = [];
};
/**设置分类 */
Window_ItemList.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
        this.resetScroll();
    }
};
/**最大列 */
Window_ItemList.prototype.maxCols = function() {
    return 2;
};
/**行距 */
Window_ItemList.prototype.spacing = function() {
    return 48;
};
/**最大项目 */
Window_ItemList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};
/**项目 */
Window_ItemList.prototype.item = function() {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};
/**是当前项目允许 */
Window_ItemList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.item());
};
/**包含 */
Window_ItemList.prototype.includes = function(item) {
    switch (this._category) {
    case 'item':
        return DataManager.isItem(item) && item.itypeId === 1;
    case 'weapon':
        return DataManager.isWeapon(item);
    case 'armor':
        return DataManager.isArmor(item);
    case 'keyItem':
        return DataManager.isItem(item) && item.itypeId === 2;
    default:
        return false;
    }
};
/**需要数字 */
Window_ItemList.prototype.needsNumber = function() {
    return true;
};
/**是激活 */
Window_ItemList.prototype.isEnabled = function(item) {
    return $gameParty.canUse(item);
};
/**制作项目列表 */
Window_ItemList.prototype.makeItemList = function() {
    this._data = $gameParty.allItems().filter(function(item) {
        return this.includes(item);
    }, this);
    if (this.includes(null)) {
        this._data.push(null);
    }
};
/**选择列表 */
Window_ItemList.prototype.selectLast = function() {
    var index = this._data.indexOf($gameParty.lastItem());
    this.select(index >= 0 ? index : 0);
};
/**绘制项目 */
Window_ItemList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var numberWidth = this.numberWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};
/**数字宽 */
Window_ItemList.prototype.numberWidth = function() {
    return this.textWidth('000');
};
/**绘制项目数字 */
Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};
/**更新帮助 */
Window_ItemList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};
/**刷新 */
Window_ItemList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};
