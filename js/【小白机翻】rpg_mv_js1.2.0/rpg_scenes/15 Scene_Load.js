
//-----------------------------------------------------------------------------
// Scene_Load
// 读取场景
// The scene class of the load screen.
// 处理 读取画面 的 场景类

function Scene_Load() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Scene_Load.prototype = Object.create(Scene_File.prototype);
//设置创造者
Scene_Load.prototype.constructor = Scene_Load;
//初始化
Scene_Load.prototype.initialize = function() {
    Scene_File.prototype.initialize.call(this);
    this._loadSuccess = false;
};
//终止
Scene_Load.prototype.terminate = function() {
    Scene_File.prototype.terminate.call(this);
    if (this._loadSuccess) {
        $gameSystem.onAfterLoad();
    }
};
//模式
Scene_Load.prototype.mode = function() {
    return 'load';
};
//帮助窗口文本
Scene_Load.prototype.helpWindowText = function() {
    return TextManager.loadMessage;
};
//第一个保存文件索引
Scene_Load.prototype.firstSavefileIndex = function() {
    return DataManager.latestSavefileId() - 1;
};
//当保存文件确定
Scene_Load.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
    if (DataManager.loadGame(this.savefileId())) {
        this.onLoadSuccess();
    } else {
        this.onLoadFailure();
    }
};
//当读取成功
Scene_Load.prototype.onLoadSuccess = function() {
    SoundManager.playLoad();
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
}
//当读取失败
Scene_Load.prototype.onLoadFailure = function() {
    SoundManager.playBuzzer();
    this.activateListWindow();
};
//重新读取地图如果更新
Scene_Load.prototype.reloadMapIfUpdated = function() {
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
        $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
        $gamePlayer.requestMapReload();
    }
};
