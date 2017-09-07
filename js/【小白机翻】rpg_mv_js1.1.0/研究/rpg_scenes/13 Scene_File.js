
//-----------------------------------------------------------------------------
// Scene_File
// 文件场景
// The superclass of Scene_Save and Scene_Load.
// 保存 和 读取 场景 的 超级类

function Scene_File() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Scene_File.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_File.prototype.constructor = Scene_File;
//初始化
Scene_File.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//创建
Scene_File.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    DataManager.loadAllSavefileImages();
    this.createHelpWindow();
    this.createListWindow();
};
//开始
Scene_File.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._listWindow.refresh();
};
//保存文件id
Scene_File.prototype.savefileId = function() {
    return this._listWindow.index() + 1;
};
//创建帮助窗口
Scene_File.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(1);
    this._helpWindow.setText(this.helpWindowText());
    this.addWindow(this._helpWindow);
};
//创建列表窗口
Scene_File.prototype.createListWindow = function() {
    var x = 0;
    var y = this._helpWindow.height;
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight - y;
    this._listWindow = new Window_SavefileList(x, y, width, height);
    this._listWindow.setHandler('ok',     this.onSavefileOk.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this._listWindow.select(this.firstSavefileIndex());
    this._listWindow.setTopRow(this.firstSavefileIndex() - 2);
    this._listWindow.setMode(this.mode());
    this._listWindow.refresh();
    this.addWindow(this._listWindow);
};
//模式
Scene_File.prototype.mode = function() {
    return null;
};
//活动列表窗口
Scene_File.prototype.activateListWindow = function() {
    this._listWindow.activate();
};
//帮助窗口文本
Scene_File.prototype.helpWindowText = function() {
    return '';
};
//第一个保存文件索引
Scene_File.prototype.firstSavefileIndex = function() {
    return 0;
};
//当保存文件确定
Scene_File.prototype.onSavefileOk = function() {
};
