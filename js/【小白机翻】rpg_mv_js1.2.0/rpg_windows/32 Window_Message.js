
//-----------------------------------------------------------------------------
// Window_Message
// 窗口消息
// The window for displaying text messages.
// 显示文本消息的窗口

function Window_Message() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_Message.prototype = Object.create(Window_Base.prototype);
//设置创造者
Window_Message.prototype.constructor = Window_Message;
//初始化
Window_Message.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    Window_Base.prototype.initialize.call(this, x, 0, width, height);
    this.openness = 0;
    this.initMembers();
    this.createSubWindows();
    this.updatePlacement();
};
//初始化成员
Window_Message.prototype.initMembers = function() {
    this._background = 0;
    this._positionType = 2;
    this._waitCount = 0;
    this._faceBitmap = null;
    this._textState = null;
    this.clearFlags();
};
//辅助窗口
Window_Message.prototype.subWindows = function() {
    return [this._goldWindow, this._choiceWindow,
            this._numberWindow, this._itemWindow];
};
//创建辅助窗口
Window_Message.prototype.createSubWindows = function() {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new Window_ChoiceList(this);
    this._numberWindow = new Window_NumberInput(this);
    this._itemWindow = new Window_EventItem(this);
};
//窗口宽
Window_Message.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};
//窗口高
Window_Message.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};
//清除标志
Window_Message.prototype.clearFlags = function() {
    this._showFast = false;
    this._lineShowFast = false;
    this._pauseSkip = false;
};
//可见行数目
Window_Message.prototype.numVisibleRows = function() {
    return 4;
};
//更新
Window_Message.prototype.update = function() {
    this.checkToNotClose();
    Window_Base.prototype.update.call(this);
    while (!this.isOpening() && !this.isClosing()) {
        if (this.updateWait()) {
            return;
        } else if (this.updateLoading()) {
            return;
        } else if (this.updateInput()) {
            return;
        } else if (this.updateMessage()) {
            return;
        } else if (this.canStart()) {
            this.startMessage();
        } else {
            this.startInput();
            return;
        }
    }
};
//检查到没有关闭
Window_Message.prototype.checkToNotClose = function() {
    if (this.isClosing() && this.isOpen()) {
        if (this.doesContinue()) {
            this.open();
        }
    }
};
//能开始
Window_Message.prototype.canStart = function() {
    return $gameMessage.hasText() && !$gameMessage.scrollMode();
};
//开始消息
Window_Message.prototype.startMessage = function() {
    this._textState = {};
    this._textState.index = 0;
    this._textState.text = this.convertEscapeCharacters($gameMessage.allText());
    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
    this.open();
};
//更新位置
Window_Message.prototype.updatePlacement = function() {
    this._positionType = $gameMessage.positionType();
    this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
};
//更新背景
Window_Message.prototype.updateBackground = function() {
    this._background = $gameMessage.background();
    this.setBackgroundType(this._background);
};
//终止消息
Window_Message.prototype.terminateMessage = function() {
    this.close();
    this._goldWindow.close();
    $gameMessage.clear();
};
//更新等待
Window_Message.prototype.updateWait = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    } else {
        return false;
    }
};
//更新读取
Window_Message.prototype.updateLoading = function() {
    if (this._faceBitmap) {
        if (ImageManager.isReady()) {
            this.drawMessageFace();
            this._faceBitmap = null;
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};
//更新输入
Window_Message.prototype.updateInput = function() {
    if (this.isAnySubWindowActive()) {
        return true;
    }
    if (this.pause) {
        if (this.isTriggered()) {
            Input.update();
            this.pause = false;
            if (!this._textState) {
                this.terminateMessage();
            }
        }
        return true;
    }
    return false;
};
//是任何辅助窗口活动
Window_Message.prototype.isAnySubWindowActive = function() {
    return (this._choiceWindow.active ||
            this._numberWindow.active ||
            this._itemWindow.active);
};
//更新消息
Window_Message.prototype.updateMessage = function() {
    if (this._textState) {
        while (!this.isEndOfText(this._textState)) {
            if (this.needsNewPage(this._textState)) {
                this.newPage(this._textState);
            }
            this.updateShowFast();
            this.processCharacter(this._textState);
            if (!this._showFast && !this._lineShowFast) {
                break;
            }
            if (this.pause || this._waitCount > 0) {
                break;
            }
        }
        if (this.isEndOfText(this._textState)) {
            this.onEndOfText();
        }
        return true;
    } else {
        return false;
    }
};
//当文本结束
Window_Message.prototype.onEndOfText = function() {
    if (!this.startInput()) {
        if (!this._pauseSkip) {
            this.startPause();
        } else {
            this.terminateMessage();
        }
    }
    this._textState = null;
};
//开始输入
Window_Message.prototype.startInput = function() {
    if ($gameMessage.isChoice()) {
        this._choiceWindow.start();
        return true;
    } else if ($gameMessage.isNumberInput()) {
        this._numberWindow.start();
        return true;
    } else if ($gameMessage.isItemChoice()) {
        this._itemWindow.start();
        return true;
    } else {
        return false;
    }
};
//是触发
Window_Message.prototype.isTriggered = function() {
    return (Input.isRepeated('ok') || Input.isRepeated('cancel') ||
            TouchInput.isRepeated());
};
//做继续
Window_Message.prototype.doesContinue = function() {
    return ($gameMessage.hasText() && !$gameMessage.scrollMode() &&
            !this.areSettingsChanged());
};
//是设置改变
Window_Message.prototype.areSettingsChanged = function() {
    return (this._background !== $gameMessage.background() ||
            this._positionType !== $gameMessage.positionType());
};
//更新快速显示
Window_Message.prototype.updateShowFast = function() {
    if (this.isTriggered()) {
        this._showFast = true;
    }
};
//新页
Window_Message.prototype.newPage = function(textState) {
    this.contents.clear();
    this.resetFontSettings();
    this.clearFlags();
    this.loadMessageFace();
    textState.x = this.newLineX();
    textState.y = 0;
    textState.left = this.newLineX();
    textState.height = this.calcTextHeight(textState, false);
};
//读取消息脸
Window_Message.prototype.loadMessageFace = function() {
    this._faceBitmap = ImageManager.loadFace($gameMessage.faceName());
};
//绘制消息脸
Window_Message.prototype.drawMessageFace = function() {
    this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, 0);
};
//新行x
Window_Message.prototype.newLineX = function() {
    return $gameMessage.faceName() === '' ? 0 : 168;
};
//处理新行
Window_Message.prototype.processNewLine = function(textState) {
    this._lineShowFast = false;
    Window_Base.prototype.processNewLine.call(this, textState);
    if (this.needsNewPage(textState)) {
        this.startPause();
    }
};
//处理新页
Window_Message.prototype.processNewPage = function(textState) {
    Window_Base.prototype.processNewPage.call(this, textState);
    if (textState.text[textState.index] === '\n') {
        textState.index++;
    }
    textState.y = this.contents.height;
    this.startPause();
};
//是文本结束
Window_Message.prototype.isEndOfText = function(textState) {
    return textState.index >= textState.text.length;
};
//需要新页
Window_Message.prototype.needsNewPage = function(textState) {
    return (!this.isEndOfText(textState) &&
            textState.y + textState.height > this.contents.height);
};
//处理 替换符号
Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case '$':
        this._goldWindow.open();
        break;
    case '.':
        this.startWait(15);
        break;
    case '|':
        this.startWait(60);
        break;
    case '!':
        this.startPause();
        break;
    case '>':
        this._lineShowFast = true;
        break;
    case '<':
        this._lineShowFast = false;
        break;
    case '^':
        this._pauseSkip = true;
        break;
    default:
        Window_Base.prototype.processEscapeCharacter.call(this, code, textState);
        break;
    }
};
//开始等待
Window_Message.prototype.startWait = function(count) {
    this._waitCount = count;
};
//开始暂停
Window_Message.prototype.startPause = function() {
    this.startWait(10);
    this.pause = true;
};
