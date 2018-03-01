//=============================================================================
// Scene_Menu.js
//=============================================================================

/*:
 * @plugindesc  
 * TouchTitle,触摸菜单,  
 * @author wangwang
 *   
 * @param  menucommand
 * @desc 插件 触摸菜单 ,作者:汪汪
 * @default 汪汪,PluginGet,TouchEx,TouchButton
 * 
 *  
 * @param base
 * @desc 背景使用的图片名称,位置x,y,持续时间,图片名称,位置,持续时间
 * @default ["menu_base",0,0,100,"menu_base2",0,0,100]
 * 
 * @param name
 * @desc  使用的图片名称,放在 img 的 pictures 文件夹内(游戏中建议在不用的事件内引用一次)
 * @default ["menu_options","menu_save","menu_end"]
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

Scene_Menu.prototype.initialize = function () {
    //场景菜单基础 初始化 呼叫(this)
    Scene_MenuBase.prototype.initialize.call(this);
};
/**创建 */
Scene_Menu.prototype.create = function () {
    //场景菜单基础 创建 呼叫(this)

    Scene_MenuBase.prototype.create.call(this);
    this.getInit()


    //创建基础精灵
    this.createBaseSprite()
    //创建命令窗口()
    this.createCommandWindow();
};
/**开始 */
Scene_Menu.prototype.start = function () {
    //场景菜单基础 开始 呼叫(this)
    Scene_MenuBase.prototype.start.call(this);
};


Scene_Menu.prototype.getInit = function () {
    var p = PluginManager.find("menucommand")
    this._name = PluginManager.getValue(p, "name")
    this._cold = PluginManager.getValue(p, "cold")
    this._hot = PluginManager.getValue(p, "hot")
    this._pos = PluginManager.getValue(p, "pos")
    this._base = PluginManager.getValue(p, "base")
}

/**创建基础精灵 */
Scene_Menu.prototype.createBaseSprite = function () {
    for (var i = 0; i < this._base.length; i += 4) {
        ImageManager.loadPicture(this._base[i])
   }
   this._baseSprite = new Sprite() 
   this._baseSprite.bitmap = ImageManager.loadPicture(this._base[0])
   this._baseSprite.x = this._base[1] || 0
   this._baseSprite.y = this._base[2] || 0
   this._baseCont = this._base[3] || 0
   this._baseIndex = 0

   this.addChild(this._baseSprite)
}

Scene_Menu.prototype.createCommandWindow = function () {

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

    this._command[0].setClickHandler(this.commandOptions.bind(this))
    this._command[1].setClickHandler(this.commandSave.bind(this))
    this._command[2].setClickHandler(this.commandGameEnd.bind(this))

    if (!this.hasSave()) {
        this._command[1].opacity = 180
    } else {
        this._command[1].opacity = 255
    }

    this.setIndex(0)


    this._command[0].processTouch(1)
    this._command[1].processTouch(1)
    this._command[2].processTouch(1)
};



Scene_Menu.prototype.hasSave = function () {
    return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
};
/**获取索引 */
Scene_Menu.prototype.getIndex = function () {
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
Scene_Menu.prototype.setIndex = function (index) {
    for (var i = 0; i < this._command.length; i++) {
        if (i == index) {
            this._command[i]._touching = true
        } else {
            this._command[i]._touching = false
        }
    }
    SoundManager.playCursor();
};


Scene_Menu.prototype.update = function () {
    Scene_Base.prototype.update.call(this);
    this.updateBaseSprite()
    
    this.updateInput()
};

Scene_Menu.prototype.updateBaseSprite = function () {
    if(this._base.length>4){
        if (this._baseCont >= 0) {
            this._baseCont--
        } else {
            this.updateBaseSpriteNext()
        } 
    } 
}


Scene_Menu.prototype.updateBaseSpriteNext = function () { 
    this._baseIndex += 4
    if (this._baseIndex >= this._base.length) {
        this._baseIndex = 0
    }
    var i = this._baseIndex
    this._baseSprite.bitmap = ImageManager.loadPicture(this._base[i])
    this._baseSprite.x = this._base[i + 1] || 0
    this._baseSprite.y = this._base[i + 2] || 0
    this._baseCont = this._base[i + 3] || 0
}



Scene_Menu.prototype.updateInput = function () {
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

    if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
        this.popScene()
    }



};

/**输入下 */
Scene_Menu.prototype.inputDown = function () {
    var index = this.getIndex()
    index = (index + 1) % 3
    if (index == 1 && !this.hasSave()) {
        index = 2
    }
    this.setIndex(index)
};

/**输入上 */
Scene_Menu.prototype.inputUp = function () {
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
Scene_Menu.prototype.inputOk = function () {
    var index = this.getIndex()
    if (index == -1) {
        this.setIndex(0)
    } else {
        this._command[index].callClickHandler()
    }
};

/**当触摸索引 */
Scene_Menu.prototype.onTouchIndex = function (index) {
    if (index == 1 && !this.hasSave()) { } else {
        this.setIndex(index)
    }
};

/**命令选项 */
Scene_Menu.prototype.commandOptions = function () {
    SceneManager.push(Scene_Options);
};
/**命令保存 */
Scene_Menu.prototype.commandSave = function () {
    SceneManager.push(Scene_Save);
};
/**命令结束游戏 */
Scene_Menu.prototype.commandGameEnd = function () {
    SceneManager.push(Scene_GameEnd);
};