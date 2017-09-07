
//-----------------------------------------------------------------------------
// Window_BattleItem
// 窗口战斗物品
// The window for selecting an item to use on the battle screen.
// 战斗画面选择一个物品使用的窗口

function Window_BattleItem() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_BattleItem.prototype = Object.create(Window_ItemList.prototype);
//设置创造者
Window_BattleItem.prototype.constructor = Window_BattleItem;
//初始化
Window_BattleItem.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
    this.hide();
};
//包含
Window_BattleItem.prototype.includes = function(item) {
    return $gameParty.canUse(item);
};
//显示
Window_BattleItem.prototype.show = function() {
    this.selectLast();
    this.showHelpWindow();
    Window_ItemList.prototype.show.call(this);
};
//隐藏
Window_BattleItem.prototype.hide = function() {
    this.hideHelpWindow();
    Window_ItemList.prototype.hide.call(this);
};
