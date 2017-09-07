
//-----------------------------------------------------------------------------
// Window_HorzCommand
// 窗口水平命令
// The command window for the horizontal selection format.
// 为了横向选择的命令窗口

function Window_HorzCommand() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_HorzCommand.prototype = Object.create(Window_Command.prototype);
//设置创造者
Window_HorzCommand.prototype.constructor = Window_HorzCommand;
//初始化
Window_HorzCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
};
//显示可见行
Window_HorzCommand.prototype.numVisibleRows = function() {
    return 1;
};
//最大列
Window_HorzCommand.prototype.maxCols = function() {
    return 4;
};
//项目文本排列
Window_HorzCommand.prototype.itemTextAlign = function() {
    return 'center';
};
