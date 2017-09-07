
//-----------------------------------------------------------------------------
// Scene_Save
// 保存场景
// The scene class of the save screen.
// 处理 保存画面 的 场景类

function Scene_Save() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Scene_Save.prototype = Object.create(Scene_File.prototype);
//设置创造者
Scene_Save.prototype.constructor = Scene_Save;
//初始化
Scene_Save.prototype.initialize = function() {
    Scene_File.prototype.initialize.call(this);
};
//模式
Scene_Save.prototype.mode = function() {
    return 'save';
};
//帮助窗口文本
Scene_Save.prototype.helpWindowText = function() {
    return TextManager.saveMessage;
};
//第一个保存文件索引
Scene_Save.prototype.firstSavefileIndex = function() {
    return DataManager.lastAccessedSavefileId() - 1;
};
//当保存文件确定
Scene_Save.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
    $gameSystem.onBeforeSave();
    if (DataManager.saveGame(this.savefileId())) {
        this.onSaveSuccess();
    } else {
        this.onSaveFailure();
    }
};
//当保存成功
Scene_Save.prototype.onSaveSuccess = function() {
    SoundManager.playSave();
    StorageManager.cleanBackup(this.savefileId());
    this.popScene();
};
//当保存失败
Scene_Save.prototype.onSaveFailure = function() {
    SoundManager.playBuzzer();
    this.activateListWindow();
};
