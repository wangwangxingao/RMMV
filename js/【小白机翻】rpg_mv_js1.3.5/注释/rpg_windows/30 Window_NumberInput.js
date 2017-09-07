
//-----------------------------------------------------------------------------
// Window_NumberInput
// 窗口数字输入
// The window used for the event command [Input Number].
// 用于事件命令的窗口(输入数字)

function Window_NumberInput() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_NumberInput.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_NumberInput.prototype.constructor = Window_NumberInput;
//初始化
Window_NumberInput.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    Window_Selectable.prototype.initialize.call(this, 0, 0, 0, 0);
    this._number = 0;
    this._maxDigits = 1;
    this.openness = 0;
    this.createButtons();
    this.deactivate();
};
//开始
Window_NumberInput.prototype.start = function() {
    this._maxDigits = $gameMessage.numInputMaxDigits();
    this._number = $gameVariables.value($gameMessage.numInputVariableId());
    this._number = this._number.clamp(0, Math.pow(10, this._maxDigits) - 1);
    this.updatePlacement();
    this.placeButtons();
    this.updateButtonsVisiblity();
    this.createContents();
    this.refresh();
    this.open();
    this.activate();
    this.select(0);
};
//更新位置
Window_NumberInput.prototype.updatePlacement = function() {
    var messageY = this._messageWindow.y;
    var spacing = 8;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    this.x = (Graphics.boxWidth - this.width) / 2;
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height - spacing;
    } else {
        this.y = messageY + this._messageWindow.height + spacing;
    }
};
//窗口宽
Window_NumberInput.prototype.windowWidth = function() {
    return this.maxCols() * this.itemWidth() + this.padding * 2;
};
//窗口高
Window_NumberInput.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};
//最大列
Window_NumberInput.prototype.maxCols = function() {
    return this._maxDigits;
};
//最大项目
Window_NumberInput.prototype.maxItems = function() {
    return this._maxDigits;
};
//行距
Window_NumberInput.prototype.spacing = function() {
    return 0;
};
//项目宽
Window_NumberInput.prototype.itemWidth = function() {
    return 32;
};
//创建按键
Window_NumberInput.prototype.createButtons = function() {
    var bitmap = ImageManager.loadSystem('ButtonSet');
    var buttonWidth = 48;
    var buttonHeight = 48;
    this._buttons = [];
    for (var i = 0; i < 3; i++) {
        var button = new Sprite_Button();
        var x = buttonWidth * [1, 2, 4][i];
        var w = buttonWidth * (i === 2 ? 2 : 1);
        button.bitmap = bitmap;
        button.setColdFrame(x, 0, w, buttonHeight);
        button.setHotFrame(x, buttonHeight, w, buttonHeight);
        button.visible = false;
        this._buttons.push(button);
        this.addChild(button);
    }
    this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
    this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
    this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
};
//位置按键
Window_NumberInput.prototype.placeButtons = function() {
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
//更新按键显示
Window_NumberInput.prototype.updateButtonsVisiblity = function() {
    if (TouchInput.date > Input.date) {
        this.showButtons();
    } else {
        this.hideButtons();
    }
};
//显示按键
Window_NumberInput.prototype.showButtons = function() {
    for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = true;
    }
};
//隐藏按键
Window_NumberInput.prototype.hideButtons = function() {
    for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].visible = false;
    }
};
//按键y
Window_NumberInput.prototype.buttonY = function() {
    var spacing = 8;
    if (this._messageWindow.y >= Graphics.boxHeight / 2) {
        return 0 - this._buttons[0].height - spacing;
    } else {
        return this.height + spacing;
    }
};
//更新
Window_NumberInput.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.processDigitChange();
};
//处理数字改变
Window_NumberInput.prototype.processDigitChange = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated('up')) {
            this.changeDigit(true);
        } else if (Input.isRepeated('down')) {
            this.changeDigit(false);
        }
    }
};
//改变数字
Window_NumberInput.prototype.changeDigit = function(up) {
    var index = this.index();
    var place = Math.pow(10, this._maxDigits - 1 - index);
    var n = Math.floor(this._number / place) % 10;
    this._number -= n * place;
    if (up) {
        n = (n + 1) % 10;
    } else {
        n = (n + 9) % 10;
    }
    this._number += n * place;
    this.refresh();
    SoundManager.playCursor();
};
//是触摸确定允许
Window_NumberInput.prototype.isTouchOkEnabled = function() {
    return false;
};
//是确定允许
Window_NumberInput.prototype.isOkEnabled = function() {
    return true;
};
//是取消允许
Window_NumberInput.prototype.isCancelEnabled = function() {
    return false;
};
//是确定触发
Window_NumberInput.prototype.isOkTriggered = function() {
    return Input.isTriggered('ok');
};
//处理确定
Window_NumberInput.prototype.processOk = function() {
    SoundManager.playOk();
    $gameVariables.setValue($gameMessage.numInputVariableId(), this._number);
    this._messageWindow.terminateMessage();
    this.updateInputData();
    this.deactivate();
    this.close();
};
//绘制项目
Window_NumberInput.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    var align = 'center';
    var s = this._number.padZero(this._maxDigits);
    var c = s.slice(index, index + 1);
    this.resetTextColor();
    this.drawText(c, rect.x, rect.y, rect.width, align);
};
//当按键上
Window_NumberInput.prototype.onButtonUp = function() {
    this.changeDigit(true);
};
//当按键下
Window_NumberInput.prototype.onButtonDown = function() {
    this.changeDigit(false);
};
//当按键确定
Window_NumberInput.prototype.onButtonOk = function() {
    this.processOk();
    this.hideButtons();
};
