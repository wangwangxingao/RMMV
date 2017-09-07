
//-----------------------------------------------------------------------------
// Window_TitleCommand
// 窗口标题命令
// The window for selecting New Game/Continue on the title screen.
// 标题画面选择新游戏或继续的窗口

function Window_TitleCommand() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_TitleCommand.prototype = Object.create(Window_Command.prototype);
Window_TitleCommand.prototype.constructor = Window_TitleCommand;
//初始化
Window_TitleCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.openness = 0;
    this.selectLast();
};

Window_TitleCommand._lastCommandSymbol = null;
//初始化命令位置
Window_TitleCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};
//窗口宽
Window_TitleCommand.prototype.windowWidth = function() {
    return 240;
};
//更新位置
Window_TitleCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 96;
};
//制作命令列表
Window_TitleCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.newGame,   'newGame');
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
    this.addCommand(TextManager.options,   'options');
};
//是继续允许
Window_TitleCommand.prototype.isContinueEnabled = function() {
    return DataManager.isAnySavefileExists();
};
//处理确定
Window_TitleCommand.prototype.processOk = function() {
    Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};
//选择列表
Window_TitleCommand.prototype.selectLast = function() {
    if (Window_TitleCommand._lastCommandSymbol) {
        this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
    } else if (this.isContinueEnabled()) {
        this.selectSymbol('continue');
    }
};
