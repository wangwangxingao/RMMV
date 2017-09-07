
//-----------------------------------------------------------------------------
// Window_ShopNumber
// 窗口商店数目
// The window for inputting quantity of items to buy or sell on the shop
// screen.
// 商店画面输入物品买卖数量的窗口

function Window_ShopNumber() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_ShopNumber.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_ShopNumber.prototype.constructor = Window_ShopNumber;
//初始化
Window_ShopNumber.prototype.initialize = function(x, y, height) {
    var width = this.windowWidth();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._item = null;
    this._max = 1;
    this._price = 0;
    this._number = 1;
    this._currencyUnit = TextManager.currencyUnit;
    this.createButtons();
};
//窗口宽
Window_ShopNumber.prototype.windowWidth = function() {
    return 456;
};
//数目
Window_ShopNumber.prototype.number = function() {
    return this._number;
};
//安装
Window_ShopNumber.prototype.setup = function(item, max, price) {
    this._item = item;
    this._max = Math.floor(max);
    this._price = price;
    this._number = 1;
    this.placeButtons();
    this.updateButtonsVisiblity();
    this.refresh();
};
//设置货币单位
Window_ShopNumber.prototype.setCurrencyUnit = function(currencyUnit) {
    this._currencyUnit = currencyUnit;
    this.refresh();
};
//创建按键
Window_ShopNumber.prototype.createButtons = function() {
    var bitmap = ImageManager.loadSystem('ButtonSet');
    var buttonWidth = 48;
    var buttonHeight = 48;
    this._buttons = [];
    for (var i = 0; i < 5; i++) {
        var button = new Sprite_Button();
        var x = buttonWidth * i;
        var w = buttonWidth * (i === 4 ? 2 : 1);
        button.bitmap = bitmap;
        button.setColdFrame(x, 0, w, buttonHeight);
        button.setHotFrame(x, buttonHeight, w, buttonHeight);
        button.visible = false;
        this._buttons.push(button);
        this.addChild(button);
    }
    this._buttons[0].setClickHandler(this.onButtonDown2.bind(this));
    this._buttons[1].setClickHandler(this.onButtonDown.bind(this));
    this._buttons[2].setClickHandler(this.onButtonUp.bind(this));
    this._buttons[3].setClickHandler(this.onButtonUp2.bind(this));
    this._buttons[4].setClickHandler(this.onButtonOk.bind(this));
};
//位置按键
Window_ShopNumber.prototype.placeButtons = function() {
    var numButtons = this._buttons.length;
    var spacing = 16;
    var totalWidth = -spacing;
    for (var i = 0; i < numButtons; i++) {
        totalWidth += this._buttons[i].width + spacing;
    }
    var x = (this.width - totalWidth) / 2;
    for (var j = 0; j < numButtons; j++) {
        var button = this._buttons[j];
        button.x = x;
        button.y = this.buttonY();
        x += button.width + spacing;
    }
};
//更新按钮可见
Window_ShopNumber.prototype.updateButtonsVisiblity = function() {
    if (TouchInput.date > Input.date) {
        this.showButtons();
    } else {
        this.hideButtons();
    }
};
//显示按键
Window_ShopNumber.prototype.showButtons = function() {
    for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = true;
    }
};
//隐藏按键
Window_ShopNumber.prototype.hideButtons = function() {
    for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = false;
    }
};
//刷新
Window_ShopNumber.prototype.refresh = function() {
    this.contents.clear();
    this.drawItemName(this._item, 0, this.itemY());
    this.drawMultiplicationSign();
    this.drawNumber();
    this.drawTotalPrice();
};
//绘制增加标记
Window_ShopNumber.prototype.drawMultiplicationSign = function() {
    var sign = '\u00d7';
    var width = this.textWidth(sign);
    var x = this.cursorX() - width * 2;
    var y = this.itemY();
    this.resetTextColor();
    this.drawText(sign, x, y, width);
};
//绘制数字
Window_ShopNumber.prototype.drawNumber = function() {
    var x = this.cursorX();
    var y = this.itemY();
    var width = this.cursorWidth() - this.textPadding();
    this.resetTextColor();
    this.drawText(this._number, x, y, width, 'right');
};
//绘制合计价格
Window_ShopNumber.prototype.drawTotalPrice = function() {
    var total = this._price * this._number;
    var width = this.contentsWidth() - this.textPadding();
    this.drawCurrencyValue(total, this._currencyUnit, 0, this.priceY(), width);
};
//项目y
Window_ShopNumber.prototype.itemY = function() {
    return Math.round(this.contentsHeight() / 2 - this.lineHeight() * 1.5);
};
//价格y
Window_ShopNumber.prototype.priceY = function() {
    return Math.round(this.contentsHeight() / 2 + this.lineHeight() / 2);
};
//按键y
Window_ShopNumber.prototype.buttonY = function() {
    return Math.round(this.priceY() + this.lineHeight() * 2.5);
};
//光标宽
Window_ShopNumber.prototype.cursorWidth = function() {
    var digitWidth = this.textWidth('0');
    return this.maxDigits() * digitWidth + this.textPadding() * 2;
};
//光标x
Window_ShopNumber.prototype.cursorX = function() {
    return this.contentsWidth() - this.cursorWidth() - this.textPadding();
};
//最大数字
Window_ShopNumber.prototype.maxDigits = function() {
    return 2;
};
//更新
Window_ShopNumber.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.processNumberChange();
};
//是确定触发
Window_ShopNumber.prototype.isOkTriggered = function() {
    return Input.isTriggered('ok');
};
//播放确定声音
Window_ShopNumber.prototype.playOkSound = function() {
};
//处理数字改变
Window_ShopNumber.prototype.processNumberChange = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated('right')) {
            this.changeNumber(1);
        }
        if (Input.isRepeated('left')) {
            this.changeNumber(-1);
        }
        if (Input.isRepeated('up')) {
            this.changeNumber(10);
        }
        if (Input.isRepeated('down')) {
            this.changeNumber(-10);
        }
    }
};
//改变数字
Window_ShopNumber.prototype.changeNumber = function(amount) {
    var lastNumber = this._number;
    this._number = (this._number + amount).clamp(1, this._max);
    if (this._number !== lastNumber) {
        SoundManager.playCursor();
        this.refresh();
    }
};
//更新光标
Window_ShopNumber.prototype.updateCursor = function() {
    this.setCursorRect(this.cursorX(), this.itemY(),
                       this.cursorWidth(), this.lineHeight());
};
//当按键上
Window_ShopNumber.prototype.onButtonUp = function() {
    this.changeNumber(1);
};
//当按键上2
Window_ShopNumber.prototype.onButtonUp2 = function() {
    this.changeNumber(10);
};
//当按键下
Window_ShopNumber.prototype.onButtonDown = function() {
    this.changeNumber(-1);
};
//当按键下2
Window_ShopNumber.prototype.onButtonDown2 = function() {
    this.changeNumber(-10);
};
//按键确定
Window_ShopNumber.prototype.onButtonOk = function() {
    this.processOk();
};
