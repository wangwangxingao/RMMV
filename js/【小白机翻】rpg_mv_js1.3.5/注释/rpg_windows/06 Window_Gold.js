
//-----------------------------------------------------------------------------
// Window_Gold
// 窗口金钱
// The window for displaying the party's gold.
// 显示队伍金钱的窗口

function Window_Gold() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_Gold.prototype = Object.create(Window_Base.prototype);
//设置创造者
Window_Gold.prototype.constructor = Window_Gold;
//初始化
Window_Gold.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};
//窗口宽
Window_Gold.prototype.windowWidth = function() {
    return 240;
};
//窗口高
Window_Gold.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};
//刷新
Window_Gold.prototype.refresh = function() {
    var x = this.textPadding();
    var width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();
    this.drawCurrencyValue(this.value(), this.currencyUnit(), x, 0, width);
};
//数目
Window_Gold.prototype.value = function() {
    return $gameParty.gold();
};
//货币单位
Window_Gold.prototype.currencyUnit = function() {
    return TextManager.currencyUnit;
};
//打开
Window_Gold.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};
