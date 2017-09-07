
//-----------------------------------------------------------------------------
// Window_PartyCommand
// 窗口队伍命令
// The window for selecting whether to fight or escape on the battle screen.
// 战斗画面选择打架或逃跑的窗口

function Window_PartyCommand() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_PartyCommand.prototype = Object.create(Window_Command.prototype);
//设置创造者
Window_PartyCommand.prototype.constructor = Window_PartyCommand;
//初始化
Window_PartyCommand.prototype.initialize = function() {
    var y = Graphics.boxHeight - this.windowHeight();
    Window_Command.prototype.initialize.call(this, 0, y);
    this.openness = 0;
    this.deactivate();
};
//窗口宽
Window_PartyCommand.prototype.windowWidth = function() {
    return 192;
};
//可见行数目
Window_PartyCommand.prototype.numVisibleRows = function() {
    return 4;
};
//制作命令列表
Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.fight,  'fight');
    this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
};
//安装
Window_PartyCommand.prototype.setup = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.refresh();
    this.select(0);
    this.activate();
    this.open();
};
