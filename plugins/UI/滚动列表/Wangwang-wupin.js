//=============================================================================
// Sprite_WuPin.js
//=============================================================================

/*:
 * @plugindesc 显示物品窗口
 * @author 汪汪
 * @version 1.0
 *
 * 
 * @param ww_xinxiwupin 
 * @desc   显示物品窗口
 * @default 0.1
 * 
 * 
 * @param wupinid 
 * @desc  默认的物品窗口的id,可以是数组如[3,5,6],当获得失去物品时进行刷新该窗口
 * @default 2
 * 
 * @help 
 * 
 * type 种类  "wupin" 物品栏的窗口 
 * category  物品种类 
 *    "item", 普通物品 
 *    'weapon' 武器
 *    'armor'  防具
 *    'keyItem'  关键物品
 *    'itemall' 全部物品
 *    'all'    物品+武器+防具
 *    数组 []  其中的值对应的种类
 *    对象 {}  item:[id]  id的物品
 *             weapon:[id]  id的武器
 *             armor:[id]  id的防具
 *     
 * 
 * w : 200  显示内容宽
 * h : 300  显示内容高
 * numw:20    数值的宽度  为0时不显示 
 *  
 * 
 * cclick 清除键调用的公共事件  为0则为默认设置
 * lclick 左键点击调用的公共事件 为0则为默认设置
 * rclick 右键点击用的公共事件  为0则为默认设置 
 * tid  赋值的变量id 如果为0则不设置 ,左键右键都会赋值,赋值的为物品的种类, 0 ,物品, 1 武器,2 防具 
 * vid  赋值的变量id 如果为0则不设置 ,左键右键都会赋值,赋值的为物品的id
 * 
 * 
 * 
 * 
 * bjb 背景图片名
 * bjx 背景x坐标
 * bjy 背景y坐标
 * 
 * cblb 侧边栏图片名
 * cblx 侧边栏x坐标  相对窗口的页面右侧
 * cbly 侧边栏y坐标   点击侧边栏时可以移动滑块到该位置
 * 
 * cbhkb 侧边滑块名 
 * cbhkx 侧边滑块x坐标  相对窗口的页面右侧
 * cbhkw 侧边滑块的宽
 * cbhkh 侧边滑块的最小高
 * cbhkl 侧边滑块黑框的宽度
 * 
 * cbb 清除按钮图片名 
 * cbx 清除按钮x坐标  
 * cby 清除按钮y坐标  按下时隐藏窗口
 * 
 * 
 * helpx 帮助窗口 x
 * helpy 帮助窗口 y
 * helpw 帮助窗口 宽
 * helph 帮助窗口 高
 * helpbw 帮助窗口背景的w偏离值(背景比帮助窗口宽大的值)
 * helpbh 帮助窗口背景的b偏离值(背景比帮助窗口高大的值)
 * helpbl  帮助窗口背景的框的宽度
 * 
 * 
 * 
i=100
while(i--){
$gameParty.gainItem($dataItems[i],i*i*10) 
}

 * 
//设置
  ww.xinxi.set(2, {
    type: "wupin", category: "item",w:200,h:300,  numw: 40,
    bjb: "bag-0", bjx: -28, bjy: -90,
    cbhkw:30,cbhkh:30,cbhkl:4,
    cblb: "bag-1",
    cbb: "bag-2",
    helpx: -300, helpy: 0, helpw: 250, helph: 300,helpbw:20,helpbh:20 ,helpbl:5
})
//用图片显示2号窗口
 $gameScreen.showPicture(1,"x/2", 0,125, 130,100, 100, 255, 0);


*/


var ww = ww || {}
ww.xinxiwupin = {}
ww.xinxiwupin.wupinid = 2
ww.plugin.get("ww_xinxiwupin", ww.xinxiwupin);

/**物品窗口刷新 */
ww.xinxiwupin.refresh = function () {
    var sid = ww.xinxiwupin.wupinid
    if (sid) {
        if (Array.isArray(sid)) {
            for (var i = 0; i < sid.length; i++) {
                var id = sid[i]
                ww.xinxi.refresh(id)
            }
        } else {
            ww.xinxi.refresh(sid)
        }
    }
}

ww.xinxiwupin.Game_Party_prototype_gainItem = Game_Party.prototype.gainItem
Game_Party.prototype.gainItem = function (item, amount, includeEquip) {
    ww.xinxiwupin.Game_Party_prototype_gainItem.call(this, item, amount, includeEquip)
    ww.xinxiwupin.refresh()
};




function Sprite_WuPin() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_WuPin.prototype = Object.create(Sprite_XinXi.prototype);
//设置创造者
Sprite_WuPin.prototype.constructor = Sprite_WuPin;
//初始化
Sprite_WuPin.prototype.initialize = function (w, h, get) {
    Sprite_XinXi.prototype.initialize.call(this, w, h, get);
    this.setCategory(this.get("category"))
};


/**创建页面 */
Sprite_WuPin.prototype.createSprites = function () {
    this._numw = this.get("numw") || 0
    this._sprites = []
    for (var i = 0; i < 20; i++) {
        var s = new Sprite_WuPinShow(this._pageW - this._numw)
        /*0,
        this._iconw,
        this._pageW - this._numw
    )*/
        this._sprites.push(s)
        this._showSprite.addChild(s)
    }

}



Sprite_WuPin.prototype.createHelp = function () {
    this._help = null
    this._helpSprite = new Sprite()
    this._helpBeijingSprite = new Sprite()
    this.addChild(this._helpBeijingSprite)
    this.addChild(this._helpSprite)

    this._helpx = this.get("helpx") || 0
    this._helpy = this.get("helpy") || 0
    this._helpw = this.get("helpw") || 0
    this._helph = this.get("helph") || 0

    this._helpbl = this.get("helpbl") || 0
    this._helpbw = this.get("helpbw") || 0
    this._helpbh = this.get("helpbh") || 0
    this._helpSprite.x = this._helpx
    this._helpSprite.y = this._helpy
    this._helpBeijingSprite.x = this._helpx - this._helpbw
    this._helpBeijingSprite.y = this._helpy - this._helpbh
}


Sprite_WuPin.prototype.setHelp = function (item, nomust) {
    if (this._help != item) {
        this._help = item
        var b = this.drawHelp(item)
        if (b) {
            var b2 = this.drawHelpBeijing(b)
        } else {
            var b = ImageManager.loadEmptyBitmap()
            var b2 = ImageManager.loadEmptyBitmap()
        }
        this._helpSprite.bitmap = b
        this._helpBeijingSprite.bitmap = b2
    }
    if (!nomust) {
        if (item) {
            this._helpBeijingSprite.visible = true
            this._helpSprite.visible = true
        } else {
            this._helpBeijingSprite.visible = false
            this._helpSprite.visible = false
        }
    }
}





/**设置种类 */
Sprite_WuPin.prototype.setCategory = function (category) {
    if (this._category !== category) {
        this._category = category;
        this._showY = 0
        this.refresh();
    }
};



/**包含 */
Sprite_WuPin.prototype.includes = function (item) {
    return this.includes2(item, this._category)
};


/**包含2 */
Sprite_WuPin.prototype.includes2 = function (item, category) {
    if (!item) { return false }
    var category = category || ""
    if (Array.isArray(category)) {
        for (var i = 0; i < category.length; i++) {
            var c = category[i]
            if (this.includes2(item, c)) {
                return true
            }
        }
        return false
    }
    var type = typeof (category)
    if (type == "object") {
        if (category.weapon) {
            if (DataManager.isWeapon(item) && category.weapon.indexOf(item.id) >= 0) {
                return true
            }
        }
        if (category.item) {
            if (DataManager.isItem(item) && category.item.indexOf(item.id) >= 0) {
                return true
            }
        }
        if (category.armor) {
            if (DataManager.isArmor(item) && category.armor.indexOf(item.id) >= 0) {
                return true
            }
        }
        return false
    } else if (type == "string") {
        switch (category) {
            case 'item':
                return DataManager.isItem(item) && item.itypeId === 1;
            case 'weapon':
                return DataManager.isWeapon(item);
            case 'armor':
                return DataManager.isArmor(item);
            case 'keyItem':
                return DataManager.isItem(item) && item.itypeId === 2;
            //隐藏物品a
            case 'hideItemA':
                return DataManager.isItem(item) && item.itypeId === 3;
            //隐藏物品b
            case 'hideItemB':
                return DataManager.isItem(item) && item.itypeId === 4;
            //所有物品
            case 'itemall':
                return DataManager.isItem(item);
            case 'all':
                return DataManager.isItem(item) || DataManager.isArmor(item) || DataManager.isWeapon(item);
            default:
                if (category.indexOf("item") == 0) {
                    var itypeId = category.slice(4) * 1
                    return DataManager.isItem(item) && item.itypeId == itypeId;
                } else if (category.indexOf("weapon") == 0) {
                    var itypeId = category.slice(6) * 1
                    return DataManager.isWeapon(item) && item.wtypeId == itypeId;
                } else if (category.indexOf("armor") == 0) {
                    var itypeId = category.slice(5) * 1
                    return DataManager.isArmor(item) && item.atypeId == itypeId;
                } else if (category.indexOf("etype") == 0) {
                    var itypeId = category.slice(5) * 1
                    return (DataManager.isArmor(item) || DataManager.isWeapon(item)) && item.etypeId == itypeId;
                }
                return false;
        }
    }

};


/**制作物品列表 */
Sprite_WuPin.prototype.makeItemList = function () {
    this._data = []
    var list = $gameParty.allItems() || []
    for (var i = 0, l = list.length; i < l; i++) {
        var object = list[i]
        if (this.includes(object)) {
            this._data.push(object)
        }
    }
};




Sprite_WuPin.prototype.allmessage = function () {
    return this._data
}

Sprite_WuPin.prototype.getmessage = function (index) {
    return this.allmessage()[index] || ""
}


Sprite_WuPin.prototype.pageW = function () {
    return this._pageW
}

Sprite_WuPin.prototype.pageH = function () {
    return this._pageH
}

Sprite_WuPin.prototype.drawHelp = function (item) {
    if (item) {

        var name = item.name
        var icon = item.iconIndex || 0
        if (DataManager.isItem(item)) {
            var can = this.canUse(item) ? "(可使用)" : "(不可使用)"
        } else if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            var can = this.canEquip(item) ? "(可装备)" : "(不可装备)"
        }
        //var can = this.isItemEffectsValid(item) ? "(当前使用没有效果)" : "(不可使用)"
        var desc = item.description

        var t = ""
        //图标
        t += "\\i[" + icon + "]"
        //名称
        t += name
        //可否使用
        t += " " + can

        //换行
        t += "\n"
        //说明
        t += desc

        var text = "h+" + t
        if (this._hash[text]) { return this._hash[text] }
        var w = this._helpw
        var h = this._helph
        var s = new Sprite_Art(w, h, t, 0, 2)
        this._hash[text] = s.bitmap
        return this._hash[text]
    } else {
        return 0
    }
};


Sprite_WuPin.prototype.drawHelpBeijing = function (b) {
    if (b) {
        var w = b.width
        var h = b.height
        var bw = w + this._helpbw + this._helpbw
        var bh = h + this._helpbh + this._helpbh
        var bl = this._helpbl

        var x = bl
        var y = bl
        var w = bw - bl - bl
        var h = bh - bl - bl

        var b = new Bitmap(bw, bh)
        b.fillAll("#000")
        b.fillRect(x, y, w, h, "#fff")
        return b
    } else {
        return ImageManager.loadEmptyBitmap()
    }
};

/**获取项目高 */
Sprite_WuPin.prototype.testItem = function (index) {
    var item = this.getmessage(index)
    if (!item) { return 0 }
    return this.drawText(item)
}


Sprite_WuPin.prototype.drawSprite = function (index) {
    var item = this.getmessage(index)
    var s = this.getSprite(index)
    this.drawText(item, s)
    s._item = item
    s._index = index
    s.y = this._allHlist[index]
}


/**绘制项目 */
Sprite_WuPin.prototype.drawText = function (item, s) {
    if (item) {
        var icon = item.iconIndex
        var name = item.name
        var value = $gameParty.numItems(item)
        //var bi = this.drawIcon(icon)
        var name = "\\i[" + icon + "]" + name
        var bn = this.drawName(name)
        var bv = this.drawValue(value)
        var h = Math.max(bn.height, bv.height)// , bi.height, )
        var w = this.pageH()
        if (s) {
            /*if (s.setIcon(icon)) {
                s._iconSprite.bitmap = bi
            }*/
            if (s.setName(name)) {
                s._nameSprite.bitmap = bn
            }
            if (s.setValue(value)) {
                s._valueSprite.bitmap = bv
            }
            s.width = w
            s.height = h
        }
        return h
    } else {
        return 0
    }
}
/*
Sprite_WuPin.prototype.iconWidth = function () {
    return 0 //this._iconw
};
*/
Sprite_WuPin.prototype.numberWidth = function () {
    return this._numw
};


/**绘制名称*/
Sprite_WuPin.prototype.drawName = function (name) {
    if (name) {
        var text = "n+" + name
        if (this._hash[text]) { return this._hash[text] }
        var w = this.pageW()
        var h = this.pageH()
        var nw = this.numberWidth()
        //var iw = this.iconWidth()
        var t = new Sprite_Art(w - nw, h, name, 0, 1)
        this._hash[text] = t.bitmap
        return this._hash[text]
    } else {
        return ImageManager.loadEmptyBitmap()
    }
};


/**绘制数值*/
Sprite_WuPin.prototype.drawValue = function (name) {
    if (name && this.numberWidth()) {
        var text = "v+" + name
        if (this._hash[text]) { return this._hash[text] }
        var nw = this.numberWidth()
        var t = new Sprite_Art(nw, ArtWord._iconHeight, "\\wt[2]\\ht[1]" + name, 0, 0)
        this._hash[text] = t.bitmap
        return this._hash[text]
    } else {
        return ImageManager.loadEmptyBitmap()
    }
};

/**绘制图标
Sprite_WuPin.prototype.drawIcon = function (name) {
    if (name && this.iconWidth()) {
        var text = "i+" + name
        if (this._hash[text]) { return this._hash[text] }
        var bitmap = ImageManager.loadSystem('IconSet');
        var pw = ArtWord._iconWidth;
        var ph = ArtWord._iconHeight;
        var sx = name % 16 * pw;
        var sy = Math.floor(name / 16) * ph;
        var b = new Bitmap(pw, ph)
        b.blt(bitmap, sx, sy, pw, ph, 0, 0);
        this._hash[text] = b
        return this._hash[text]
    } else {
        return ImageManager.loadEmptyBitmap()
    }
};
*/

/**刷新 */
Sprite_WuPin.prototype.refresh = function () {
    this.makeItemList()
    this.clear()
    this.refreshShowY()
}



Sprite_WuPin.prototype.onCClick = function () {

    var cclick = this.get("cclick") || 0
    if (cclick) {
        this.startEvent(cclick)
    } else {
        this._get.hide()
    }

}


Sprite_WuPin.prototype.onLClick = function () {
    var s = this.onClickSprites()
    if (s) {
        var item = s._item
        this.setHelp(item) 
        this.setItem(item)

        var lclick = this.get("lclick") || 0
        if (lclick) {
            this.startEvent(lclick)
        }
    }
}

/**右键按下 */
Sprite_WuPin.prototype.onRClick = function () {
    var s = this.onClickSprites()
    if (s) {
        var item = s._item
        this.setHelp(item, 1)
        this.setItem(item)


        var rclick = this.get("rclick") || 0
        if (rclick) {
            this.startEvent(rclick)
        } else {
            if (DataManager.isItem(item)) {
                this.useItem(item)
            } else if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
                this.useEquip(item)
            } else {
                return
            }
            this.refresh()
        }
    }
}


Sprite_WuPin.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this.showing()) {
        this.updateParallel()

        this.visible = true
        /*this.updateBeiJing()
        this.updateCbl()
        this.updateCbhk()
        this.updateClearButton()*/
        if (this.mustRefresh()) {
            this.refresh()
        }
        this.updateTouch()

    } else {
        this._interpreter = null
        this.visible = false
        if (this.mustRefresh()) {
            this.refresh()
        }
    }
};

/**使用者 */
Sprite_WuPin.prototype.user = function () {
    return $gameParty.leader()
};

/**设置物品 */
Sprite_WuPin.prototype.setItem = function (item) {
    this._item = item

    var vid = this.get("vid") || 0
    if (vid) {
        var v = item ? item.id : -1
        $gameVariables.setValue(vid, v)
    }

    var tid = this.get("tid") || 0
    if (tid) {
        if (!item) {
            var v = -1
        } else if (DataManager.isItem(item)) {
            var v = 0
        } else if (DataManager.isWeapon(item)) {
            var v = 1

        } else if (DataManager.isArmor(item)) {
            var v = 2
        } else {
            var v = -1
        }
        $gameVariables.setValue(tid, v)
    }

}
/**物品 */
Sprite_WuPin.prototype.item = function () {
    return this._item
};



/**是能使用 */
Sprite_WuPin.prototype.canUse = function (item) {
    if (this.user() && item) {
        return this.user().canUse(item);
    }
};

/**使用物品 */
Sprite_WuPin.prototype.useItem = function (item) {
    if (this.canUse(item) && this.isItemEffectsValid(item)) {
        SoundManager.playUseItem();
        this.user().useItem(item);
        this.applyItem(item);
        this.checkGameover();
    } else {
        SoundManager.playBuzzer();
    }
};



Sprite_WuPin.prototype.itemTargetActors = function () {
    var action = new Game_Action(this.user());
    action.setItemObject(this.item());
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.members();
    } else {
        return [$gameParty.members()[0]];
    }
};

/**是物品效果有效 */
Sprite_WuPin.prototype.isItemEffectsValid = function (item) {
    var action = new Game_Action(this.user());
    action.setItemObject(item);
    var hasItemAnyCommonEvent = action.item().effects.some(function (effect) {
        return effect.code == Game_Action.EFFECT_COMMON_EVENT;
    });
    return hasItemAnyCommonEvent || this.itemTargetActors().some(function (target) {
        return action.testApply(target);
    }, this);
};


/**应用物品 */
Sprite_WuPin.prototype.applyItem = function (item) {
    var action = new Game_Action(this.user());
    action.setItemObject(item);
    this.itemTargetActors().forEach(function (target) {
        for (var i = 0; i < action.numRepeats(); i++) {
            action.apply(target);
        }
    }, this);
    action.applyGlobal();
};

Sprite_WuPin.prototype.checkGameover = function () {
    if ($gameParty.isAllDead()) {
        //场景管理器 转到 (游戏结束场景)
        SceneManager.goto(Scene_Gameover);
    }
}

/**能装备 */
Sprite_WuPin.prototype.canEquip = function (item) {
    if (this.user() && item) {
        var canEquip = this.user().canEquip(item)
        if (canEquip) {
            var etypeId = item.etypeId
            var soltId = etypeId - 1
            var cansolt = this.user().isEquipChangeOk(soltId)
            return cansolt;
        }
    }
}
/**使用装备 */
Sprite_WuPin.prototype.useEquip = function (item) {
    if (this.canEquip(item)) {
        SoundManager.playEquip();
        var etypeId = item.etypeId
        var soltId = etypeId - 1
        this.user().changeEquip(soltId, item);
    } else {
        SoundManager.playBuzzer();
    }
}





function Sprite_WuPinShow() {
    this.initialize.apply(this, arguments);
}

Sprite_WuPinShow.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_WuPinShow.prototype.constructor = Sprite_WuPinShow;
//初始化
Sprite_WuPinShow.prototype.initialize = function (x3) {
    Sprite.prototype.initialize.call(this);
    this._icon = -1
    this._name = ""
    this._value = ""
    //this.createIcon(x1, 0)
    this.createName(0, 0)
    this.createValue(x3, 0)
};

/*
Sprite_WuPinShow.prototype.createIcon = function (x, y) {
    var s = new Sprite()
    s.x = x || 0
    s.y = y || 0
    this.addChild(s)
    this._iconSprite = s
};
*/


Sprite_WuPinShow.prototype.createName = function (x, y) {
    var s = new Sprite()
    s.x = x || 0
    s.y = y || 0
    this.addChild(s)
    this._nameSprite = s
};


Sprite_WuPinShow.prototype.createValue = function (x, y) {
    var s = new Sprite()
    s.x = x || 0
    s.y = y || 0
    this.addChild(s)
    this._valueSprite = s
};


Sprite_WuPinShow.prototype.setIcon = function (icon) {
    if (this._icon == icon) { return false }
    this._icon = icon
    return true
};



Sprite_WuPinShow.prototype.setName = function (name) {
    if (this._name == name) { return false }
    this._name = name
    return true
};


Sprite_WuPinShow.prototype.setValue = function (v) {
    if (this._value == v) { return false }
    this._value = v
    return true

};


