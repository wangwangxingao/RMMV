
/**-----------------------------------------------------------------------------   
 * Window_Command   
 * 窗口命令   
 * The superclass of windows for selecting a command.   
 * 窗口选择命令的超级类 */

function Window_Command() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Window_Command.prototype = Object.create(Window_Selectable.prototype);
/**设置创造者 */
Window_Command.prototype.constructor = Window_Command;
/**初始化
 * 
 * @param {number} x x
 * @param {number} y y 
 */
Window_Command.prototype.initialize = function(x, y) {
    //清除命令列表()
    this.clearCommandList();
    //制作命令列表() 
    this.makeCommandList();
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.select(0);
    this.activate();
};
/**窗口宽 */
Window_Command.prototype.windowWidth = function() {
    return 240;
};
/**窗口高 */
Window_Command.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};
/**可见行数 */
Window_Command.prototype.numVisibleRows = function() {
    return Math.ceil(this.maxItems() / this.maxCols());
};
/**最大项目数 */
Window_Command.prototype.maxItems = function() {
    return this._list.length;
};
/**清除命令列表 */
Window_Command.prototype.clearCommandList = function() {
    this._list = [];
};
/**制作命令列表 */
Window_Command.prototype.makeCommandList = function() {
};
/**添加命令 */
Window_Command.prototype.addCommand = function(name, symbol, enabled, ext) {
    if (enabled === undefined) {
        enabled = true;
    }
    if (ext === undefined) {
        ext = null;
    }
    this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext});
};
/**命令名 */
Window_Command.prototype.commandName = function(index) {
    return this._list[index].name;
};
/**命令标记 */
Window_Command.prototype.commandSymbol = function(index) {
    return this._list[index].symbol;
};
/**是命令允许 */
Window_Command.prototype.isCommandEnabled = function(index) {
    return this._list[index].enabled;
};
/**当前数据 */
Window_Command.prototype.currentData = function() {
    return this.index() >= 0 ? this._list[this.index()] : null;
};
/**是当前项目允许 */
Window_Command.prototype.isCurrentItemEnabled = function() {
    return this.currentData() ? this.currentData().enabled : false;
};
/**当前标记 */
Window_Command.prototype.currentSymbol = function() {
    return this.currentData() ? this.currentData().symbol : null;
};
/**当前提取 */
Window_Command.prototype.currentExt = function() {
    return this.currentData() ? this.currentData().ext : null;
};
/**寻找标记 */
Window_Command.prototype.findSymbol = function(symbol) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].symbol === symbol) {
            return i;
        }
    }
    return -1;
};
/**选择标记 */
Window_Command.prototype.selectSymbol = function(symbol) {
    var index = this.findSymbol(symbol);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};
/**寻找提取 */
Window_Command.prototype.findExt = function(ext) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].ext === ext) {
            return i;
        }
    }
    return -1;
};
/**选择提取 */
Window_Command.prototype.selectExt = function(ext) {
    var index = this.findExt(ext);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};
/**绘制项目 */
Window_Command.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};
/**项目文本排列 */
Window_Command.prototype.itemTextAlign = function() {
    return 'left';
};
/**是确定允许 */
Window_Command.prototype.isOkEnabled = function() {
    return true;
};
/**呼叫 确定处理 */
Window_Command.prototype.callOkHandler = function() {
    var symbol = this.currentSymbol();
    if (this.isHandled(symbol)) {
        this.callHandler(symbol);
    } else if (this.isHandled('ok')) {
        Window_Selectable.prototype.callOkHandler.call(this);
    } else {
        this.activate();
    }
};
/**刷新 */
Window_Command.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.createContents();
    Window_Selectable.prototype.refresh.call(this);
};
