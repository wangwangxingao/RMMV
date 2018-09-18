//=============================================================================
//  Knapsack.js
//=============================================================================

/*:
 * @plugindesc  
 * Knapsack,背包 , 
 * @author wangwang
 *   
 * @param  Knapsack
 * @desc 插件 背包 ,作者:汪汪
 * @default 汪汪,TouchEx,TouchButton,EventTouch
 * 
 * 
 * @param variable 
 * @desc 背包变量,在地图时默认使用这个变量承接使用物品
 * @default 10 
 * 
 * @param xy
 * @desc  背包的xy位置,[0,0]
 * @default [0,0]
 * 
 * @param hideshowadd
 * @desc  隐藏显示透明度改变
 * @default [10,10] 
 * 
 * @param base
 * @desc 背包基础的图案,放在 img 的 pictures 文件夹内  
 * @default base
 * 
 * @param choose
 * @desc 背包的选择图案,放在 img 的 pictures 文件夹内
 * @default choose
 * 
 * @param updown
 * @desc 翻页上下键的图片及位置,图片放在 img 的 pictures 文件夹内 
 * @default [["up",10,300],["down",200,300]]
 *  
 * @param lxy
 * @desc 背包物品的行列, 如每行5个,共1行 , 
 * @default [5,1]
 *  
 * @param oxy
 * @desc 背包物品开始计算的xy, 
 * @default [10,10]
 * 
 * @param ixy
 * @desc 背包物品每个计算的xy, 物品位置为 oxy + i * ixy , i为对应的行列
 * @default [100,100]
 * 
 * 
 * @param number 
 * @desc 背包物品显示数字的位置 
 * @default [0,50,100,100,"right"]
 * 
 * 
 * @param name 
 * @desc 背包物品显示说明的名称显示 
 * @default [20,200,100,120,"center"]
 * 
 * @param help 
 * @desc 背包物品显示说明的名称显示 
 * @default [0,400,300,400]
 * 
 * 
 * @help
 * 
 * 添加方法
 * Sprite_Knapsack.setVariable()
 * 
 * 调用默认的背包变量
 * 
 * Sprite_Knapsack.start(id ,mustnear)
 * 使用后 会启用事件的 "item_" + id 的标签 (需要 EventTouch)
 * mustnear 设置为 true 时只有附近的才触发
 * 
 * 
 * 调用方法
 * 
 * 物品命名为 "item_" + id ,即 1号物品 物品名称为 item_1 
 * 放在 img 的 pictures 文件夹内
 *  
 *  
 * 以下参数中,括号内的 文字内容 需要加 "" ,数字内容不用 , 注意下面说明 
 * updown 参数
 * 参数为 [[up,[x,y],[x,y,w,h],[x,y,w,h]],[down,[x,y],[x,y,w,h],[x,y,w,h]] ]
 * up,down为 图片名称,如 "up" ,"down"
 * [x,y] 为那个图片的位置
 * [x,y,w,h] 为图片的
 * 点击上下翻页(不能翻页隐藏显示)
 * 
 * 对于 number 参数
 * 参数为 [x,y,w,h, type,fontsize, textcolor, outlinecolor]
 * 其中前面4个为必填 
 * x,y 为 绘制数字的起始点(相对于物品图片)
 * w,h 为 默认物品的宽高,
 * 
 * 以下如果有后面要设置,但中间有值不想设置,使用默认的,设置值为0 
 * type 为绘制的类型 ,可以使用的值为 'left' ,'center'  'right'
 * fontsize 为字号 , 19 , 26 之类的
 * textcolor 为字体颜色, 值类似于 "#ffffff" , "#000000"
 * outlinecolor 为轮廓线颜色,值类似于 'rgba(0, 0, 0, 0.5)' 
 * 额,textcolor 可能也可以使用类似 'rgba(0, 0, 0, 0.5)' 的值
 * 
 * 
 * 对于 name 参数 
 * 参数为 [x,y,w,h, type,fontsize, textcolor, outlinecolor]
 * 其中前面4个为必填 
 * x,y 为 物品名称的xy坐标 
 * w,h 为 物品名称的宽高,
 *  
 * 
 *  对于 help 参数 
 * 参数为 [x,y,w,h] 
 * x,y 为 物品说明的xy坐标 
 * w,h 为 物品说明的宽高,
 *  
 * 
 * */





/**背包系统 */
function Sprite_Knapsack() {
    this.initialize.apply(this, arguments);
}

Sprite_Knapsack.prototype = Object.create(Sprite.prototype);
Sprite_Knapsack.prototype.constructor = Sprite_Knapsack;

/**初始化 */
Sprite_Knapsack.prototype.initialize = function(messageWindow) {
    Sprite.prototype.initialize.call(this);
    this.getInit()
    this.createAll()
    this.refreshNew()
    this.hide(256)
    this._messageWindow = messageWindow
};



//---------------
// 获取值
//---------------

Sprite_Knapsack.getInit = function() {
    if (!this.p) {
        var p = PluginManager.find("Knapsack")
        this._baseName = PluginManager.get(p, "base")
        this._chooseName = PluginManager.get(p, "choose")
        this._variable = PluginManager.getValue(p, "variable") || 0
        this._updownSet = PluginManager.getValue(p, "updown")
        var xy = PluginManager.getValue(p, "xy")
        this.x = xy[0]
        this.y = xy[1]
        var xy = PluginManager.getValue(p, "lxy")
        this._itemLx = xy[0]
        this._itemLy = xy[1]
        var xy = PluginManager.getValue(p, "oxy")
        this._itemOx = xy[0]
        this._itemOy = xy[1]
        var xy = PluginManager.getValue(p, "ixy")
        this._itemIx = xy[0]
        this._itemIy = xy[1]
        this._nameXywh = PluginManager.getValue(p, "name")
        this._helpXywh = PluginManager.getValue(p, "help")
        this._numberXywh = PluginManager.getValue(p, "number")
        this._hideshowAddSet = PluginManager.getValue(p, "hideshowadd")
        this.p = p


    }
};




Sprite_Knapsack.setVariable = function() {
    this.getInit()
    if (Sprite_Knapsack._variable) {
        $gameVariables.setValue(Sprite_Knapsack._variable, 0)
        $gameMessage.setItemChoice(Sprite_Knapsack._variable, "none")
    }
};

/**触发  */
Sprite_Knapsack.start = function(id, mustnear) {
    if ($gameMap && id) {
        var e = $gameMap.events()
        for (var i = 0; i < e.length; i++) {
            if (!near || e._isnear) {
                e.start(id)
            }
        }
    }
};



/**获取初始化值 */
Sprite_Knapsack.prototype.getInit = function() {
    Sprite_Knapsack.getInit()
    this._baseName = Sprite_Knapsack._baseName
    this._chooseName = Sprite_Knapsack._chooseName
        //this._switch = Sprite_Knapsack._variable
    this._updownSet = Sprite_Knapsack._updownSet

    this._hideshowAddSet = Sprite_Knapsack._hideshowAddSet

    this.x = Sprite_Knapsack.x
    this.y = Sprite_Knapsack.y
    this._itemLx = Sprite_Knapsack._itemLx
    this._itemLy = Sprite_Knapsack._itemLy

    this._itemOx = Sprite_Knapsack._itemOx
    this._itemOy = Sprite_Knapsack._itemOy

    this._itemIx = Sprite_Knapsack._itemIx
    this._itemIy = Sprite_Knapsack._itemIy
    this._nameXywh = Sprite_Knapsack._nameXywh
    this._helpXywh = Sprite_Knapsack._helpXywh
    this._numberXywh = Sprite_Knapsack._numberXywh

    this._saveBitmaps = {}
};



/**当确定 */
Sprite_Knapsack.prototype.onItemOk = function(index) {
    var item = this.item(index);
    var itemId = item ? item.id : 0;
    $gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
    this._messageWindow.terminateMessage();
    this.close();
};


/**当取消 */
Sprite_Knapsack.prototype.onItemCancel = function() {
    $gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);
    this._messageWindow.terminateMessage();
    this.close();
};


/**是否包含 */
Sprite_Knapsack.prototype.includes = function(item) {
    switch ($gameMessage.itemChoiceItypeId()) {
        case "none":
            return DataManager.isItem(item)
        case 'item':
            return DataManager.isItem(item) && item.itypeId === 1;
        case 'weapon':
            return DataManager.isWeapon(item);
        case 'armor':
            return DataManager.isArmor(item);
        case 'keyItem':
            return DataManager.isItem(item) && item.itypeId === 2;
        default:
            return false;
    }
};


/**设置 所有物品 */
Sprite_Knapsack.prototype.makeItemList = function() {
    this._items = $gameParty.allItems().filter(function(item) {
        return this.includes(item);
    }, this);
    if (this.includes(null)) {
        this._items.push(null);
    }
};


/**物品个数 */
Sprite_Knapsack.prototype.numItems = function(item) {
    return $gameParty.numItems(item)
}

/**能使用 */
Sprite_Knapsack.prototype.canUse = function(item) {
    return $gameParty.canUse(item)
}

/**项目 */
Sprite_Knapsack.prototype.item = function(index) {
    var index = this._itemStIndex + index
    return this._items ? this._items[index] : null
};


/**有物品组改变 */
Sprite_Knapsack.prototype.hasItemsChange = function() {
    for (var i = 0; i < this._itemSprites.length; i++) {
        if (this.hasItemChange(i)) {
            return true
        }
    }
    return false
};

/**有物品数目改变 */
Sprite_Knapsack.prototype.hasItemChange = function(i) {
    var item = this.item(i)
    if (item && !this.numItems(item)) {
        return true
    }
    return false
};


/**有上下页 */
Sprite_Knapsack.prototype.hasUpDown = function(i) {
    return i ? this._itemStIndex + this._itemSprites.length < this._items.length : this._itemStIndex > 0
};

/**有页面 */
Sprite_Knapsack.prototype.hasPage = function() {
    return this._itemStIndex < this._items.length
};


//---------------
//创建
//---------------

/**创建所有 */
Sprite_Knapsack.prototype.createAll = function() {
    /**基础图片 */
    this._baseSprite = new Sprite(ImageManager.loadPicture(this._baseName))
    this.addChild(this._baseSprite)

    /**创建所有物品 */
    this.createItems()

    /**创建上下键 */
    this.createUpDown()

    /**选择精灵 */
    this._chooseSprite = new Sprite(ImageManager.loadPicture(this._chooseName))
    this.addChild(this._chooseSprite)

    /**名称精灵 */
    this._nameSprite = new Sprite()
    this._nameSprite.x = this._nameXywh[0]
    this._nameSprite.y = this._nameXywh[1]
    this.addChild(this._nameSprite)

    /**说明精灵 */
    this._helpSprite = new Sprite()
    this._helpSprite.x = this._helpXywh[0]
    this._helpSprite.y = this._helpXywh[1]
    this.addChild(this._helpSprite)

};

/**创建物品 */
Sprite_Knapsack.prototype.createItems = function() {
    this._itemSprites = []
    this._itemNumberSprites = []
    for (var yi = 0; yi < this._itemLy; yi++) {
        for (var xi = 0; xi < this._itemLx; xi++) {
            var i = yi * this._itemLx + xi
            var x = this._itemOx + xi * this._itemIx
            var y = this._itemOy + yi * this._itemIy
            var s = new Sprite_TouchButton2()
            s.x = x
            s.y = y
            s.setTouchHandler(0, this.touchOutIndex.bind(this, i))
            s.setTouchHandler(1, this.touchIndex.bind(this, i))
            s.setClickHandler(this.onOk.bind(this, i))
            this.addChild(s)
            this._itemSprites[i] = s
            var s = new Sprite()
            s.x = x
            s.y = y
            this.addChild(s)
            this._itemNumberSprites[i] = s
        }
    }
};


/**创建上下键 */
Sprite_Knapsack.prototype.createUpDown = function() {
    /**上下键精灵 */
    this._updownSprites = []
    for (var i = 0; i < 2; i++) {
        var s = new Sprite_TouchButton2()
        var name = this._updownSet[i][0]
        s.x = this._updownSet[i][1]
        s.y = this._updownSet[i][2]
        s.bitmap = ImageManager.loadPicture(name)
        s.setTouchHandler(0, this.touchUpDown.bind(this, 0))
        s.setTouchHandler(1, this.touchUpDown.bind(this, 1))
        s.setClickHandler(this.onUpDown.bind(this, i))
        this.addChild(s)
        this._updownSprites[i] = s
    }
};


//---------------
//更新
//---------------



/**更新 */
Sprite_Knapsack.prototype.update = function() {
    Sprite.prototype.update.call(this);

    this.updateInput()
        //this.updateSwitch()
    this.updateShow()

};

Sprite_Knapsack.prototype.start = function() {
    this.open()
};



/**隐藏 */
Sprite_Knapsack.prototype.open = function() {
    this.show()
};


Sprite_Knapsack.prototype.close = function() {
    this.hide()
};

/**显示 */
Sprite_Knapsack.prototype.show = function(i) {
    if (this._hideshow != "show" && this._hideshow != "showed") {
        this._hideshow = "show"
        this._hideshowAdd = i || this._hideshowAddSet[1]
        this.refreshNew()
        this.visible = true
    }
};


/**隐藏 */
Sprite_Knapsack.prototype.hide = function(i) {
    if (this._hideshow != "hide" && this._hideshow != "hideed") {
        this._hideshow = "hide"
        this._hideshowAdd = i || this._hideshowAddSet[0]
        this.active = false
    }
};



/**显示 */
Sprite_Knapsack.prototype.showed = function() {
    this._hideshow = "showed"
    this.opacity = 255
    this.active = true
};


/**隐藏 */
Sprite_Knapsack.prototype.hideed = function() {
    this._hideshow = "hideed"
    this.opacity = 0
    this.visible = false
};



Sprite_Knapsack.prototype.updateShow = function() {

    if (this._hideshow == "show") {
        var next = this.opacity + this._hideshowAdd
        if (next >= 255) {
            this.showed()
        } else {
            this.opacity = next
        }
    }
    if (this._hideshow == "hide") {
        var next = this.opacity - this._hideshowAdd
        if (next <= 0) {
            this.hideed()
        } else {
            this.opacity = next
        }
    }
};


/**更新输入 */
Sprite_Knapsack.prototype.updateInput = function() {
    if (!this.active) { return }

    if (Input.isRepeated('down')) {
        this.inputDown()
    }
    if (Input.isRepeated('up')) {
        this.inputUp()
    }
    if (Input.isRepeated('right')) {
        this.inputRight()
    }
    if (Input.isRepeated('left')) {
        this.inputLeft()
    }
    if (Input.isTriggered('ok')) {
        this.onOk(this._index);
    }
    if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
        this.onCancel()
    }
};



//---------------
//刷新
//--------------- 

/**刷新新的背包 */
Sprite_Knapsack.prototype.refreshNew = function() {
    this._index = -1
    this._itemStIndex = 0
    this.makeItemList()
    this.refreshPage()
    this.refreshIndex(0)
};

/**刷新页 */
Sprite_Knapsack.prototype.refreshPage = function() {
    this.refreshItems()
        /**本页存在 */
    if (this.hasPage()) {
        this.refreshPageItems()
    } else {
        //有上一页
        if (this.hasUpDown(0)) {
            //上一页
            this.onUpDown(0)
            return
        } else {
            this.refreshPageItems()
        }
    }
    if (this.hasUpDown(1)) {
        this.refreshUpDown(1, 1)
    } else {
        this.refreshUpDown(1, 0)
    }
    //有上一页
    if (this.hasUpDown(0)) {
        this.refreshUpDown(0, 1)
    } else {
        this.refreshUpDown(0, 0)
    }
    this.refreshIndex(this._index)
};

/**刷新上下页 */
Sprite_Knapsack.prototype.refreshUpDown = function(i, show) {
    var s = this._updownSprites[i]
    if (s.visible && !show) {
        s.visible = 0
    } else if (!s.visible && show) {
        s.visible = 1
        s.opacity = 180
        s._touching = false
    }
};

/**刷新所有项目 */
Sprite_Knapsack.prototype.refreshItems = function() {
    if (this.hasItemsChange()) {
        this.makeItemList()
    }
};

/**刷新所有物品 */
Sprite_Knapsack.prototype.refreshPageItems = function() {
    for (var i = 0; i < this._itemSprites.length; i++) {
        this.refreshItem(i)
        this.refreshItemNumber(i)
    }
};


/**刷新索引 */
Sprite_Knapsack.prototype.refreshIndex = function(i) {
    var l = this._itemSprites.length
    var i = ((i || 0) % l + l) % l
    if (this._index !== i) {
        this._index = i
        var xi = i % this._itemLx
        var yi = (i - xi) / this._itemLx
        var x = this._itemOx + xi * this._itemIx
        var y = this._itemOy + yi * this._itemIy
        this._chooseSprite.x = x
        this._chooseSprite.y = y
    }
    this.refreshHelp(this._index)
};


/**刷新物品  */
Sprite_Knapsack.prototype.refreshItem = function(i) {
    var s = this._itemSprites[i]
    var item = this.item(i)
    s.bitmap = this.getItemBitmap(item)
    if (item && this.canUse(item)) {
        s.opacity = 255
    } else {
        s.opacity = 180
    }
}

/**刷新物品数目 */
Sprite_Knapsack.prototype.refreshItemNumber = function(i) {
    var s = this._itemNumberSprites[i]
    var item = this.item(i)
    s.bitmap = this.getNumberBitmap(item)

    if (item && this.canUse(item)) {
        s.opacity = 255
    } else {
        s.opacity = 180
    }
};


/**刷新帮助 */
Sprite_Knapsack.prototype.refreshHelp = function(i) {
    var item = this.item(i)
    this._helpSprite.bitmap = this.getHelpBitmap(item)
    this._nameSprite.bitmap = this.getNameBitmap(item)
};






//---------------
//输入
//---------------


/**输入下 */
Sprite_Knapsack.prototype.inputDown = function() {
    if (this._index + this._itemLx >= this._itemSprites.length) {
        this.onUpDown(1)
        this.refreshIndex(this._index + this._itemLx)
    } else {
        this.refreshIndex(this._index + this._itemLx)
    }
    this.playCursor()
}

/**输入上 */
Sprite_Knapsack.prototype.inputUp = function() {
    if (this._index - this._itemLx < 0) {
        this.onUpDown(0)
        this.refreshIndex(this._index - this._itemLx)
    } else {
        this.refreshIndex(this._index - this._itemLx)
    }
    this.playCursor()
}

/**输入右 */
Sprite_Knapsack.prototype.inputRight = function() {
    if ((this._index % this._itemLx) + 1 >= this._itemLx) {
        this.onUpDown(1)
        this.refreshIndex(this._index - this._itemLx + 1)
    } else {
        this.refreshIndex(this._index + 1)
    }
    this.playCursor()
}

/**输入左 */
Sprite_Knapsack.prototype.inputLeft = function() {
    if ((this._index % this._itemLx) == 0) {
        this.onUpDown(0)
        this.refreshIndex(this._index + this._itemLx - 1)
    } else {
        this.refreshIndex(this._index - 1)
    }
    this.playCursor()
}



/**触摸索引 */
Sprite_Knapsack.prototype.touchIndex = function(i, sprite) {
    if (!this.active) { return }
    sprite._touching = true
    this.refreshIndex(i)
    this.playCursor()
};

Sprite_Knapsack.prototype.touchOutIndex = function(i, sprite) {
    if (!this.active) { return }
    sprite._touching = false
};


/**触摸上下页 */
Sprite_Knapsack.prototype.touchUpDown = function(i, sprite) {
    if (!this.active) { return }
    sprite.opacity = i ? 255 : 180;
    sprite._touching = i ? true : false
    i ? this.playCursor() : 0
};


/**当确定 */
Sprite_Knapsack.prototype.onOk = function(index) {
    if (!this.active) { return }
    //console.log("ok", index)
    //this.refreshIndex(index)
    //this.useItem(index);
    this.onItemOk(index)
    this.playOk();
}

/**当取消 */
Sprite_Knapsack.prototype.onCancel = function() {
    if (!this.active) { return }
    //console.log("onCancel") 
    this.onItemCancel()
        // if (this._hideshow == "show" || this._hideshow == "showed") { this.hide() } else {this.show()}
    this.playCancel();
}

/**上下页 */
Sprite_Knapsack.prototype.onUpDown = function(i) {
    if (!this.active) { return }
    if (i) {
        //下一页
        if (this._itemStIndex + this._itemSprites.length < this._items.length) {
            this._itemStIndex += this._itemSprites.length
            this.refreshPage()
        }
    } else {
        //上一页
        if (this._itemStIndex > 0) {
            this._itemStIndex -= this._itemSprites.length
            this.refreshPage()
        }
    }
};


/**使用物品 */
Sprite_Knapsack.prototype.useItem = function(index) {
    var user = $gameParty.leader()
    var item = this.item(index)
    if (user && item && this.numItems(item) && this.canUse(item)) {
        var action = new Game_Action(user);
        action.setItemObject(item);
        action.apply(user);
        user.useItem(item)
        if (this.hasItemChange(index)) {
            this.refreshPage()
        } else {
            this.refreshItemNumber(index)
        }
        this.playOk();
    } else {
        this.playBuzzer();
    }
}


//---------------
//图片管理部分 
//---------------


/**保存图片 */
Sprite_Knapsack.prototype.saveBitmaps = function(name, z) {
    if (z === undefined) {
        return this._saveBitmaps[name]
    } else {
        return this._saveBitmaps[name] = z
    }
};

/**物品图片 */
Sprite_Knapsack.prototype.getItemBitmap = function(item) {
    var id = 0
    if (item) {
        var id = item.id
    }
    if (id) {
        var name = "item_" + id || 0
        var b = ImageManager.loadPicture(name);
    } else {
        var b = this.getNumberBitmap()
    }
    return b;
};

/**数字图片 */
Sprite_Knapsack.prototype.getNumberBitmap = function(item) {
    if (item) {
        var id = this.numItems(item)
    } else {
        var id = 0
    }
    var name = "number_" + id
    var b = this.saveBitmaps(name)
    if (!b) {
        var w = this._numberXywh[2]
        var h = this._numberXywh[3]
        var b = new Bitmap(w, h)
        if (id) {
            var x = this._numberXywh[0]
            var y = this._numberXywh[1]
            var type = "right"
            if (this._nameXywh[4]) {
                type = this._nameXywh[4]
            }
            if (this._nameXywh[5]) {
                b.fontSize = this._numberXywh[5]
            }
            if (this._nameXywh[6]) {
                b.textColor = this._numberXywh[6]
            }
            if (this._nameXywh[7]) {
                b.outlineColor = this._numberXywh[7]
            }
            b.drawText(id, x, y, w - x, h - y, type)
        }
        this.saveBitmaps(name, b)
    }
    return this.saveBitmaps(name);
};

/**名称图片 */
Sprite_Knapsack.prototype.getNameBitmap = function(item) {
    if (item) {
        var id = item.name
    } else {
        var id = ""
    }
    var name = "name_" + id
    var b = this.saveBitmaps(name)
    if (!b) {
        var w = this._nameXywh[2]
        var h = this._nameXywh[3]
        b = new Bitmap(w, h)
        if (item) {
            var type = "center"
            if (this._nameXywh[4]) {
                type = this._nameXywh[4]
            }
            if (this._nameXywh[5]) {
                b.fontSize = this._numberXywh[5]
            }
            if (this._nameXywh[6]) {
                b.textColor = this._numberXywh[6]
            }
            if (this._nameXywh[7]) {
                b.outlineColor = this._numberXywh[7]
            }
            b.drawText(id, 0, 0, w, h, type)
        }
        this.saveBitmaps(name, b)
    }
    return this.saveBitmaps(name);
};

/**帮助图片 */
Sprite_Knapsack.prototype.getHelpBitmap = function(item) {
    if (item) {
        var id = item.id
        if (!item.description) {
            id = 0
            var item = null
        }
    } else {
        var id = 0
    }
    var name = "help_" + id
    var b = this.saveBitmaps(name)
    if (!b) {
        var w = this._helpXywh[2]
        var h = this._helpXywh[3]
        if (item) {
            var wb = new Window_Base(0, 0, 1, 1)
            wb.contents = new Bitmap(w, h)

            wb.drawTextEx(item.description, 0, 0)
            var b = wb.contents
            wb.contents = new Bitmap(0, 0)
            wb = null
        } else {
            var b = new Bitmap(w, h)
        }
        this.saveBitmaps(name, b)
    }
    return this.saveBitmaps(name);
};




//---------------
//声音管理部分
//---------------

/**播放确定*/
Sprite_Knapsack.prototype.playOk = function() {
    SoundManager.playOk();
}

/**播放蜂鸣 */
Sprite_Knapsack.prototype.playBuzzer = function() {
    SoundManager.playBuzzer();
}

/**播放取消 */
Sprite_Knapsack.prototype.playCancel = function() {
    SoundManager.playCancel();
}

/**播放光标 */
Sprite_Knapsack.prototype.playCursor = function() {
    SoundManager.playCursor();
}



//---------------
//添加到地图场景
//---------------

/**创建 */
/*Sprite_Knapsack.Scene_Map_prototype_createAllWindows = Scene_Map.prototype.createAllWindows
Scene_Map.prototype.createAllWindows = function() {
    Sprite_Knapsack.Scene_Map_prototype_createAllWindows.call(this)
    this._knapsack = new Sprite_Knapsack()
    this.addChild(this._knapsack)
};*/

/**更新 */
/*
Sprite_Knapsack.Scene_Map_prototype_update = Scene_Map.prototype.update
Scene_Map.prototype.update = function() {
    if (this._knapsack && this._knapsack.visible) {
        this.updateKnapsack()
    } else {
        Sprite_Knapsack.Scene_Map_prototype_update.call(this)
    }
};*/

/**刷新 */
/*
Scene_Map.prototype.refreshKnapsack = function() {
    if (this._knapsack) {
        this.removeChild(this._knapsack)
    }
    this.addChild(this._knapsack)
};

*/


/**修改菜单 */
Scene_Map.prototype.callMenu = function() {
    //声音管理器 播放ok()
    SoundManager.playOk();


    Sprite_Knapsack.setVariable()
        /* 
        //场景管理器 添加 (菜单场景)
         SceneManager.push(Scene_Menu);
         //菜单命令窗口 初始化命令位置()
         Window_MenuCommand.initCommandPosition();
         */
        //游戏临时 清除目的地()
    $gameTemp.clearDestination();
    //地图名称窗口 隐藏()
    this._mapNameWindow.hide();
    //等待计数 = 2
    this._waitCount = 2;
    this.menuCalling = false;
};


Window_Message.prototype.createSubWindows = function() {
    //金钱窗口 = 新 窗口金钱(0,0)
    this._goldWindow = new Window_Gold(0, 0);
    //金钱窗口 x = 图形 盒宽 - 金钱窗口 宽
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    //金钱窗口 开放性 = 0
    this._goldWindow.openness = 0;
    //选择窗口 = 新 窗口选择(this)
    this._choiceWindow = new Window_ChoiceList(this);
    //数字窗口 = 新 窗口数字输入(this)
    this._numberWindow = new Window_NumberInput(this);
    //物品窗口 = 新 窗口事件物品(this)
    this._itemWindow = new Sprite_Knapsack(this);
};