
//-----------------------------------------------------------------------------
// Window_ShopSell
// 窗口商店卖
// The window for selecting an item to sell on the shop screen.
// 商店画面选择一个物品卖的窗口

function Window_ShopSell() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_ShopSell.prototype = Object.create(Window_ItemList.prototype);
//设置创造者
Window_ShopSell.prototype.constructor = Window_ShopSell;
//初始化
Window_ShopSell.prototype.initialize = function(x, y, width, height) {
    Window_ItemList.prototype.initialize.call(this, x, y, width, height);
};
//是允许
Window_ShopSell.prototype.isEnabled = function(item) {
    return item && item.price > 0;
};
