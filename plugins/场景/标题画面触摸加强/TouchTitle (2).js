//=============================================================================
//  TouchTitle.js
//=============================================================================

/*:
 * @plugindesc  
 * TouchTitle,触摸菜单,  
 * @author wangwang
 *   
 * @param  touchtitle
 * @desc 插件 触摸菜单 ,作者:汪汪
 * @default 汪汪,PluginGet,TouchEx,TouchButton
 * 
 * @param name
 * @desc  使用的图片名称,放在 img 的 pictures 文件夹内(游戏中建议在不用的事件内引用一次)
 * @default ["newgame","continue","options"]
 * 
 * @param cold
 * @desc 没有选择时显示的图片区域,例如0,0开始,200宽,100高的图片
 * @default [[0,0,200,100],[0,0,200,100],[0,0,200,100]]
 * 
 * @param hot
 * @desc 选择时显示的图片区域,例如 200,0开始,200宽,100高的图片
 * @default [[200,0,200,100],[200,0,200,100],[200,0,200,100]]
 * 
 * @param pos
 * @desc 显示的位置, 
 * @default [[100,100],[200,300],[300,500]]
 * 
 * @help
 * 
 * 参数都是数组的形式,请按格式修改
 * 
 * */



Scene_Title.prototype.isBusy = function() {
    return Scene_Base.prototype.isBusy.call(this);
};


Scene_Title.prototype.hasSave = function() {
    return DataManager.isAnySavefileExists()
};


Scene_Title.prototype.getInit = function() {
    var p = PluginManager.find("touchtitle")
    this._name = PluginManager.getValue(p, "name")
    this._cold = PluginManager.getValue(p, "cold")
    this._hot = PluginManager.getValue(p, "hot")
    this._pos = PluginManager.getValue(p, "pos")
}


Scene_Title.prototype.createCommandWindow = function() {
    this.getInit()

    this._command = []
    for (var i = 0; i < 3; i++) {
        s = new Sprite_TouchButton2()
        s.bitmap = ImageManager.loadPicture(this._name[i])
        var frame = this._cold[i]
        s.setColdFrame(frame[0], frame[1], frame[2], frame[3])
        var frame = this._hot[i]
        s.setHotFrame(frame[0], frame[1], frame[2], frame[3])
        s.x = this._pos[i][0]
        s.y = this._pos[i][1]

        s.setTouchHandler(1, this.onTouchIndex.bind(this, i))
        this._command[i] = s
        this.addChild(this._command[i])
    }

    this._command[0].setClickHandler(this.commandNewGame.bind(this))
    this._command[1].setClickHandler(this.commandContinue.bind(this))
    this._command[2].setClickHandler(this.commandOptions.bind(this))

    if (!this.hasSave()) {
        this._command[1].opacity = 180
    } else {
        this._command[1].opacity = 255
    }

    this.setIndex(0)
};


/**获取索引 */
Scene_Title.prototype.getIndex = function() {
    var index = -1
    for (var i = 0; i < this._command.length; i++) {
        if (this._command[i]._touching) {
            index = i
            break
        }
    }
    return index
};

/**设置索引 */
Scene_Title.prototype.setIndex = function(index) {
    for (var i = 0; i < this._command.length; i++) {
        if (i == index) {
            this._command[i]._touching = true
        } else {
            this._command[i]._touching = false
        }
    }
    SoundManager.playCursor();
};


Scene_Title.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    this.updateInput()
};


Scene_Title.prototype.updateInput = function() {
    if (Input.isRepeated('down')) {
        this.inputDown();
    }
    if (Input.isRepeated('up')) {
        this.inputUp();
    }
    if (Input.isRepeated('right')) {
        this.inputDown();
    }
    if (Input.isRepeated('left')) {
        this.inputUp();
    }
    if (Input.isTriggered('ok')) {
        this.inputOk();
    }
};

/**输入下 */
Scene_Title.prototype.inputDown = function() {
    var index = this.getIndex()
    index = (index + 1) % 3
    if (index == 1 && !this.hasSave()) {
        index = 2
    }
    this.setIndex(index)
};

/**输入上 */
Scene_Title.prototype.inputUp = function() {
    var index = this.getIndex()
    if (index == -1) {
        index = 0
    }
    index = (index + 3 - 1) % 3
    if (index == 1 && !this.hasSave()) {
        index = 0
    }
    this.setIndex(index)
};


/**输入确定 */
Scene_Title.prototype.inputOk = function() {
    var index = this.getIndex()
    if (index == -1) {
        this.setIndex(0)
    } else {
        this._command[index].callClickHandler()
    }
};

/**当触摸索引 */
Scene_Title.prototype.onTouchIndex = function(index) {
    if (index == 1 && !this.hasSave()) {} else {
        this.setIndex(index)
    }
};


Scene_Title.prototype.commandNewGame = function() {
    SoundManager.playOk();
    DataManager.setupNewGame();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};


Scene_Title.prototype.commandContinue = function() {
    if (this.hasSave()) {
        if (DataManager.loadGame(1)) {
            this.onLoadSuccess();
        } else {
            this.onLoadFailure();
        }
    }
};


        

/**当读取成功 */
Scene_Title.prototype.onLoadSuccess = function() {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
    }
    /**当读取失败 */
Scene_Title.prototype.onLoadFailure = function() {
    SoundManager.playBuzzer();
};
/**重新读取地图如果更新 */
Scene_Title.prototype.reloadMapIfUpdated = function() {
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
        $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
        $gamePlayer.requestMapReload();
    }
};



Scene_Title.prototype.commandOptions = function() {
    SoundManager.playOk();
    SceneManager.push(Scene_Options);
};

Scene_Title.prototype.playTitleMusic = function() {
    AudioManager.playBgm($dataSystem.titleBgm);
    AudioManager.stopBgs();
    AudioManager.stopMe();
};