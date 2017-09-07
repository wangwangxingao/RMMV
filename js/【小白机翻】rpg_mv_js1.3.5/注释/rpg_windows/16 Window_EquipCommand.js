
//-----------------------------------------------------------------------------
// Window_EquipCommand
// 窗口装备命令
// The window for selecting a command on the equipment screen.
// 装备画面选择命令的窗口

function Window_EquipCommand() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_EquipCommand.prototype = Object.create(Window_HorzCommand.prototype);
//设置创造者
Window_EquipCommand.prototype.constructor = Window_EquipCommand;
//初始化
Window_EquipCommand.prototype.initialize = function(x, y, width) {
    this._windowWidth = width;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};
//窗口宽
Window_EquipCommand.prototype.windowWidth = function() {
    return this._windowWidth;
};
//最大列
Window_EquipCommand.prototype.maxCols = function() {
    return 3;
};
//制作命令列表
Window_EquipCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.equip2,   'equip');
    this.addCommand(TextManager.optimize, 'optimize');
    this.addCommand(TextManager.clear,    'clear');
};
