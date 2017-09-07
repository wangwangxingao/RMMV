
//-----------------------------------------------------------------------------
// Window_ShopCommand
// 窗口商店命令
// The window for selecting buy/sell on the shop screen.
// 商店画面为了选择买卖的窗口

function Window_ShopCommand() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_ShopCommand.prototype = Object.create(Window_HorzCommand.prototype);
//设置创造者
Window_ShopCommand.prototype.constructor = Window_ShopCommand;
//初始化
Window_ShopCommand.prototype.initialize = function(width, purchaseOnly) {
    this._windowWidth = width;
    this._purchaseOnly = purchaseOnly;
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
};
//窗口宽
Window_ShopCommand.prototype.windowWidth = function() {
    return this._windowWidth;
};
//最大列
Window_ShopCommand.prototype.maxCols = function() {
    return 3;
};
//制作命令列表
Window_ShopCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.buy,    'buy');
    this.addCommand(TextManager.sell,   'sell',   !this._purchaseOnly);
    this.addCommand(TextManager.cancel, 'cancel');
};
