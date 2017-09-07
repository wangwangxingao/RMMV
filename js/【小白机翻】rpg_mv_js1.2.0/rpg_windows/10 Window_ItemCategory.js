
//-----------------------------------------------------------------------------
// Window_ItemCategory
// 窗口物品种类
// The window for selecting a category of items on the item and shop screens.
// 物品和商店画面选择一个种类物品的窗口

function Window_ItemCategory() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_ItemCategory.prototype = Object.create(Window_HorzCommand.prototype);
//设置创造者
Window_ItemCategory.prototype.constructor = Window_ItemCategory;
//初始化
Window_ItemCategory.prototype.initialize = function() {
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
};
//窗口宽
Window_ItemCategory.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};
//最大列
Window_ItemCategory.prototype.maxCols = function() {
    return 4;
};
//更新
Window_ItemCategory.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setCategory(this.currentSymbol());
    }
};
//制作命令列表
Window_ItemCategory.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item,    'item');
    this.addCommand(TextManager.weapon,  'weapon');
    this.addCommand(TextManager.armor,   'armor');
    this.addCommand(TextManager.keyItem, 'keyItem');
};
//设置项目窗口
Window_ItemCategory.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
    this.update();
};
