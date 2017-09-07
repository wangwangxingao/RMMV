
//-----------------------------------------------------------------------------
// Window_Help
// 窗口帮助
// The window for displaying the description of the selected item.
// 显示选择项目说明的窗口

function Window_Help() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_Help.prototype = Object.create(Window_Base.prototype);
//设置创造者
Window_Help.prototype.constructor = Window_Help;
//初始化
Window_Help.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 2);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._text = '';
};
//设置文本
Window_Help.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};
//清除
Window_Help.prototype.clear = function() {
    this.setText('');
};
//设置项目
Window_Help.prototype.setItem = function(item) {
    this.setText(item ? item.description : '');
};
//刷新
Window_Help.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
};
