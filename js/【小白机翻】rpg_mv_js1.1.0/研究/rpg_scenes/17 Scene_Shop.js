
//-----------------------------------------------------------------------------
// Scene_Shop
// 商店场景
// The scene class of the shop screen.
// 处理 商店画面 的 场景类

function Scene_Shop() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Scene_Shop.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_Shop.prototype.constructor = Scene_Shop;
//初始化
Scene_Shop.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//准备
Scene_Shop.prototype.prepare = function(goods, purchaseOnly) {
    this._goods = goods;
    this._purchaseOnly = purchaseOnly;
    this._item = null;
};
//创建
Scene_Shop.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createGoldWindow();
    this.createCommandWindow();
    this.createDummyWindow();
    this.createNumberWindow();
    this.createStatusWindow();
    this.createBuyWindow();
    this.createCategoryWindow();
    this.createSellWindow();
};
//创建金钱窗口
Scene_Shop.prototype.createGoldWindow = function() {
    this._goldWindow = new Window_Gold(0, this._helpWindow.height);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this.addWindow(this._goldWindow);
};
//创建命令窗口
Scene_Shop.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_ShopCommand(this._goldWindow.x, this._purchaseOnly);
    this._commandWindow.y = this._helpWindow.height;
    this._commandWindow.setHandler('buy',    this.commandBuy.bind(this));
    this._commandWindow.setHandler('sell',   this.commandSell.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};
//创建假人窗口
Scene_Shop.prototype.createDummyWindow = function() {
    var wy = this._commandWindow.y + this._commandWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._dummyWindow = new Window_Base(0, wy, Graphics.boxWidth, wh);
    this.addWindow(this._dummyWindow);
};
//创建数值窗口
Scene_Shop.prototype.createNumberWindow = function() {
    var wy = this._dummyWindow.y;
    var wh = this._dummyWindow.height;
    this._numberWindow = new Window_ShopNumber(0, wy, wh);
    this._numberWindow.hide();
    this._numberWindow.setHandler('ok',     this.onNumberOk.bind(this));
    this._numberWindow.setHandler('cancel', this.onNumberCancel.bind(this));
    this.addWindow(this._numberWindow);
};
//创建状态窗口
Scene_Shop.prototype.createStatusWindow = function() {
    var wx = this._numberWindow.width;
    var wy = this._dummyWindow.y;
    var ww = Graphics.boxWidth - wx;
    var wh = this._dummyWindow.height;
    this._statusWindow = new Window_ShopStatus(wx, wy, ww, wh);
    this._statusWindow.hide();
    this.addWindow(this._statusWindow);
};
//创建购买窗口
Scene_Shop.prototype.createBuyWindow = function() {
    var wy = this._dummyWindow.y;
    var wh = this._dummyWindow.height;
    this._buyWindow = new Window_ShopBuy(0, wy, wh, this._goods);
    this._buyWindow.setHelpWindow(this._helpWindow);
    this._buyWindow.setStatusWindow(this._statusWindow);
    this._buyWindow.hide();
    this._buyWindow.setHandler('ok',     this.onBuyOk.bind(this));
    this._buyWindow.setHandler('cancel', this.onBuyCancel.bind(this));
    this.addWindow(this._buyWindow);
};
//创建种类窗口
Scene_Shop.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_ItemCategory();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = this._dummyWindow.y;
    this._categoryWindow.hide();
    this._categoryWindow.deactivate();
    this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
    this.addWindow(this._categoryWindow);
};
//创建卖出窗口
Scene_Shop.prototype.createSellWindow = function() {
    var wy = this._categoryWindow.y + this._categoryWindow.height;
    var wh = Graphics.boxHeight - wy;
    this._sellWindow = new Window_ShopSell(0, wy, Graphics.boxWidth, wh);
    this._sellWindow.setHelpWindow(this._helpWindow);
    this._sellWindow.hide();
    this._sellWindow.setHandler('ok',     this.onSellOk.bind(this));
    this._sellWindow.setHandler('cancel', this.onSellCancel.bind(this));
    this._categoryWindow.setItemWindow(this._sellWindow);
    this.addWindow(this._sellWindow);
};
//活动购买窗口
Scene_Shop.prototype.activateBuyWindow = function() {
    this._buyWindow.setMoney(this.money());
    this._buyWindow.show();
    this._buyWindow.activate();
    this._statusWindow.show();
};
//活动卖出窗口
Scene_Shop.prototype.activateSellWindow = function() {
    this._categoryWindow.show();
    this._sellWindow.refresh();
    this._sellWindow.show();
    this._sellWindow.activate();
    this._statusWindow.hide();
};
//命令购买
Scene_Shop.prototype.commandBuy = function() {
    this._dummyWindow.hide();
    this.activateBuyWindow();
};
//命令卖出
Scene_Shop.prototype.commandSell = function() {
    this._dummyWindow.hide();
    this._categoryWindow.show();
    this._categoryWindow.activate();
    this._sellWindow.show();
    this._sellWindow.deselect();
    this._sellWindow.refresh();
};
//当购买确定
Scene_Shop.prototype.onBuyOk = function() {
    this._item = this._buyWindow.item();
    this._buyWindow.hide();
    this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());
    this._numberWindow.show();
    this._numberWindow.activate();
};
//当购买取消
Scene_Shop.prototype.onBuyCancel = function() {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._buyWindow.hide();
    this._statusWindow.hide();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
};
//当种类确定
Scene_Shop.prototype.onCategoryOk = function() {
    this.activateSellWindow();
    this._sellWindow.select(0);
};
//当种类取消
Scene_Shop.prototype.onCategoryCancel = function() {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._categoryWindow.hide();
    this._sellWindow.hide();
};
//当卖出确定
Scene_Shop.prototype.onSellOk = function() {
    this._item = this._sellWindow.item();
    this._categoryWindow.hide();
    this._sellWindow.hide();
    this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());
    this._numberWindow.show();
    this._numberWindow.activate();
    this._statusWindow.setItem(this._item);
    this._statusWindow.show();
};
//当卖出取消
Scene_Shop.prototype.onSellCancel = function() {
    this._sellWindow.deselect();
    this._categoryWindow.activate();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
};
//当数字确定
Scene_Shop.prototype.onNumberOk = function() {
    SoundManager.playShop();
    switch (this._commandWindow.currentSymbol()) {
    case 'buy':
        this.doBuy(this._numberWindow.number());
        break;
    case 'sell':
        this.doSell(this._numberWindow.number());
        break;
    }
    this.endNumberInput();
    this._goldWindow.refresh();
    this._statusWindow.refresh();
};
//当数字取消
Scene_Shop.prototype.onNumberCancel = function() {
    SoundManager.playCancel();
    this.endNumberInput();
};
//进行购买
Scene_Shop.prototype.doBuy = function(number) {
    $gameParty.loseGold(number * this.buyingPrice());
    $gameParty.gainItem(this._item, number);
};
//进行卖出
Scene_Shop.prototype.doSell = function(number) {
    $gameParty.gainGold(number * this.sellingPrice());
    $gameParty.loseItem(this._item, number);
};
//结束数字输入
Scene_Shop.prototype.endNumberInput = function() {
    this._numberWindow.hide();
    switch (this._commandWindow.currentSymbol()) {
    case 'buy':
        this.activateBuyWindow();
        break;
    case 'sell':
        this.activateSellWindow();
        break;
    }
};
//最多购买
Scene_Shop.prototype.maxBuy = function() {
    var max = $gameParty.maxItems(this._item) - $gameParty.numItems(this._item);
    var price = this.buyingPrice();
    if (price > 0) {
        return Math.min(max, Math.floor(this.money() / price));
    } else {
        return max;
    }
};
//最大卖出
Scene_Shop.prototype.maxSell = function() {
    return $gameParty.numItems(this._item);
};
//金钱
Scene_Shop.prototype.money = function() {
    return this._goldWindow.value();
};
//通用单位
Scene_Shop.prototype.currencyUnit = function() {
    return this._goldWindow.currencyUnit();
};
//购买价格
Scene_Shop.prototype.buyingPrice = function() {
    return this._buyWindow.price(this._item);
};
//出售价格
Scene_Shop.prototype.sellingPrice = function() {
    return Math.floor(this._item.price / 2);
};
