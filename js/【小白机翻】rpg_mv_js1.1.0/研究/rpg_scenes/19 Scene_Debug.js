
//-----------------------------------------------------------------------------
// Scene_Debug
// 调试场景
// The scene class of the debug screen.
// 处理 调试画面 的场景

function Scene_Debug() {
    this.initialize.apply(this, arguments);
}
//设置原形 
Scene_Debug.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_Debug.prototype.constructor = Scene_Debug;
//初始化
Scene_Debug.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//创造
Scene_Debug.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createRangeWindow();
    this.createEditWindow();
    this.createDebugHelpWindow();
};
//创建范围窗口
Scene_Debug.prototype.createRangeWindow = function() {
    this._rangeWindow = new Window_DebugRange(0, 0);
    this._rangeWindow.setHandler('ok',     this.onRangeOk.bind(this));
    this._rangeWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._rangeWindow);
};
//创建编辑窗口
Scene_Debug.prototype.createEditWindow = function() {
    var wx = this._rangeWindow.width;
    var ww = Graphics.boxWidth - wx;
    this._editWindow = new Window_DebugEdit(wx, 0, ww);
    this._editWindow.setHandler('cancel', this.onEditCancel.bind(this));
    this._rangeWindow.setEditWindow(this._editWindow);
    this.addWindow(this._editWindow);
};
//创建调试帮助窗口
Scene_Debug.prototype.createDebugHelpWindow = function() {
    var wx = this._editWindow.x;
    var wy = this._editWindow.height;
    var ww = this._editWindow.width;
    var wh = Graphics.boxHeight - wy;
    this._debugHelpWindow = new Window_Base(wx, wy, ww, wh);
    this.addWindow(this._debugHelpWindow);
};
//当范围确定
Scene_Debug.prototype.onRangeOk = function() {
    this._editWindow.activate();
    this._editWindow.select(0);
    this.refreshHelpWindow();
};
//当编辑取消
Scene_Debug.prototype.onEditCancel = function() {
    this._rangeWindow.activate();
    this._editWindow.deselect();
    this.refreshHelpWindow();
};
//刷新帮助窗口
Scene_Debug.prototype.refreshHelpWindow = function() {
    this._debugHelpWindow.contents.clear();
    if (this._editWindow.active) {
        this._debugHelpWindow.drawTextEx(this.helpText(), 4, 0);
    }
};
//帮助文本
Scene_Debug.prototype.helpText = function() {
    if (this._rangeWindow.mode() === 'switch') {
        return 'Enter : ON / OFF';
    } else {
        return ('Left     :  -1\n' +
                'Right    :  +1\n' +
                'Pageup   : -10\n' +
                'Pagedown : +10');
    }
};
