
//-----------------------------------------------------------------------------
// Window_ShopBuy
// 窗口商店买
// The window for selecting an item to buy on the shop screen.
// 商店画面选择买物品的窗口

function Window_ShopBuy() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_ShopBuy.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_ShopBuy.prototype.constructor = Window_ShopBuy;
//初始化
Window_ShopBuy.prototype.initialize = function(x, y, height, shopGoods) {
    var width = this.windowWidth();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._shopGoods = shopGoods;
    this._money = 0;
    this.refresh();
    this.select(0);
};
//窗口宽
Window_ShopBuy.prototype.windowWidth = function() {
    return 456;
};
//最大项目
Window_ShopBuy.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};
//项目
Window_ShopBuy.prototype.item = function() {
    return this._data[this.index()];
};
//设置金钱
Window_ShopBuy.prototype.setMoney = function(money) {
    this._money = money;
    this.refresh();
};
//是当前项目允许
Window_ShopBuy.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._data[this.index()]);
};
//价格
Window_ShopBuy.prototype.price = function(item) {
    return this._price[this._data.indexOf(item)] || 0;
};
//是允许
Window_ShopBuy.prototype.isEnabled = function(item) {
    return (item && this.price(item) <= this._money &&
            !$gameParty.hasMaxItems(item));
};
//刷新
Window_ShopBuy.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};
//制作项目列表
Window_ShopBuy.prototype.makeItemList = function() {
    this._data = [];
    this._price = [];
    this._shopGoods.forEach(function(goods) {
        var item = null;
        switch (goods[0]) {
        case 0:
            item = $dataItems[goods[1]];
            break;
        case 1:
            item = $dataWeapons[goods[1]];
            break;
        case 2:
            item = $dataArmors[goods[1]];
            break;
        }
        if (item) {
            this._data.push(item);
            this._price.push(goods[2] === 0 ? item.price : goods[3]);
        }
    }, this);
};
//绘制项目
Window_ShopBuy.prototype.drawItem = function(index) {
    var item = this._data[index];
    var rect = this.itemRect(index);
    var priceWidth = 96;
    rect.width -= this.textPadding();
    this.changePaintOpacity(this.isEnabled(item));
    this.drawItemName(item, rect.x, rect.y, rect.width - priceWidth);
    this.drawText(this.price(item), rect.x + rect.width - priceWidth,
                  rect.y, priceWidth, 'right');
    this.changePaintOpacity(true);
};
//设置状态窗口
Window_ShopBuy.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};
//更新帮助
Window_ShopBuy.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setItem(this.item());
    }
};
