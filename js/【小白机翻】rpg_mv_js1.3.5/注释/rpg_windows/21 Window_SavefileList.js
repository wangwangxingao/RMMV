
//-----------------------------------------------------------------------------
// Window_SavefileList
// 窗口保存文件列表
// The window for selecting a save file on the save and load screens.
// 存储读取画面选择存档文件的窗口

function Window_SavefileList() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_SavefileList.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_SavefileList.prototype.constructor = Window_SavefileList;
//初始化
Window_SavefileList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.activate();
    this._mode = null;
};
//设置模式
Window_SavefileList.prototype.setMode = function(mode) {
    this._mode = mode;
};
//最大项目
Window_SavefileList.prototype.maxItems = function() {
    return DataManager.maxSavefiles();
};
//最大显示项目
Window_SavefileList.prototype.maxVisibleItems = function() {
    return 5;
};
//项目高
Window_SavefileList.prototype.itemHeight = function() {
    var innerHeight = this.height - this.padding * 2;
    return Math.floor(innerHeight / this.maxVisibleItems());
};
//绘制项目
Window_SavefileList.prototype.drawItem = function(index) {
    var id = index + 1;
    var valid = DataManager.isThisGameFile(id);
    var info = DataManager.loadSavefileInfo(id);
    var rect = this.itemRectForText(index);
    this.resetTextColor();
    if (this._mode === 'load') {
        this.changePaintOpacity(valid);
    }
    this.drawFileId(id, rect.x, rect.y);
    if (info) {
        this.changePaintOpacity(valid);
        this.drawContents(info, rect, valid);
        this.changePaintOpacity(true);
    }
};
//绘制文件id
Window_SavefileList.prototype.drawFileId = function(id, x, y) {
    this.drawText(TextManager.file + ' ' + id, x, y, 180);
};
//绘制内容
Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
    var bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
        if (valid) {
            this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
        }
    }
    var lineHeight = this.lineHeight();
    var y2 = bottom - lineHeight;
    if (y2 >= lineHeight) {
        this.drawPlaytime(info, rect.x, y2, rect.width);
    }
};
//绘制游戏标题
Window_SavefileList.prototype.drawGameTitle = function(info, x, y, width) {
    if (info.title) {
        this.drawText(info.title, x, y, width);
    }
};
//绘制队伍人物
Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
    if (info.characters) {
        for (var i = 0; i < info.characters.length; i++) {
            var data = info.characters[i];
            this.drawCharacter(data[0], data[1], x + i * 48, y);
        }
    }
};
//绘制游戏时间
Window_SavefileList.prototype.drawPlaytime = function(info, x, y, width) {
    if (info.playtime) {
        this.drawText(info.playtime, x, y, width, 'right');
    }
};
//播放使用
Window_SavefileList.prototype.playOkSound = function() {
};
