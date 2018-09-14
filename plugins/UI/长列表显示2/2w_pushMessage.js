//=============================================================================
// 2w_pushMessage.js
//=============================================================================

/*:
 * @plugindesc 弹出信息
 * @author wangwang
 *   
 * @param 2w_pushMessage
 * @desc 插件 弹出信息
 * @default 汪汪
 *   
 * @param  pos
 * @desc  默认位置
 * @default  [3,0]
 * 
 * @param  get
 * @desc  获取信息的显示内容
 * @default  ["%1 x %2","%1 - %2","获得金钱%1","失去金钱%1"]
 * 
 * @param  tbxy
 * @desc  图片xy ,文字xy 和文字背景图片的xy
 * @default  [0,0,0,0,0,0]
 *  
 * @param  tboxy
 * @desc  图片xy ,文字xy 和文字背景图片的锚xy
 * @default  [0.5,0.5,0.5,0.5,0.5,0.5]
 * 
 * 
 * @param  base
 * @desc  图片背景,长宽,最大长倍数,文字头
 * @default  ["Base_OR",148,25,3,"\\}[8]"]
 * 
 * 
 * @param  n
 * @desc  默认数量,总共4条
 * @default  4
 * 
 * 
 * @param  xybac
 * @desc  弹出的xy的基础位置及xy变化,淡入淡出增加量
 * @default  [0,0,0,-1.25,10]
 *  
 * @param  uwt
 * @desc  弹出时间, 等待时间
 * @default  [25,10]
 * 
 * 
 * @param  use
 * @desc  是否使用显示
 * @default  true
 * 
 * @param  inputnext
 * @desc  0 等待结束进行下一个, 1 等待结束或输入进行下一个, 2 必须输入才进行下一个 , 3 等待结束并且输入才进行下一个
 * @default  1
 * 
 * 
 * @param  inputfast
 * @desc  输入加快,值为按下ok键时增加的倍数
 * @default  1
 * 
 * 
 * @param  busy
 * @desc  信息繁忙,如果信息繁忙会阻断场景
 * @default  true
 * 
 * 
 * @help 
 * 
 * 
 * */



ImageManager.loadPictureItem = function (filename, hue) {
    var bitmap = this.loadBitmap('img/pictures/items/', filename, hue, true)
    ImageManager.loadBitmapOnError(bitmap, 'img/pictures/items/', "0")
    //返回 读取图片
    return bitmap;
};

ImageManager.loadPictureWeapon = function (filename, hue) {
    //返回 读取图片

    var bitmap = this.loadBitmap('img/pictures/weapons/', filename, hue, true)
    ImageManager.loadBitmapOnError(bitmap, 'img/pictures/weapons/', "0")
    return bitmap;
};

ImageManager.loadPictureArmor = function (filename, hue) {

    //返回 读取图片 
    var bitmap = this.loadBitmap('img/pictures/armors/', filename, hue, true)
    ImageManager.loadBitmapOnError(bitmap, 'img/pictures/armors/', "0")
    return bitmap;
};



var ww = ww || {}
ww.PluginManager = {}
ww.PluginManager.get = function (n) {
    var find = function (n) {
        var l = PluginManager._parameters;
        var p = l[(n || "").toLowerCase()];
        if (!p) { for (var m in l) { if (l[m] && (n in l[m])) { p = l[m]; } } }
        return p || {}
    }
    var parse = function (i) {
        try { return JSON.parse(i) } catch (e) { return i }
    }
    var m, o = {}, p = find(n)
    for (m in p) { o[m] = parse(p[m]) }
    return o
}


ww.pushMessage = {}
ww.pushMessage = ww.PluginManager.get('2w_pushMessage');/*
ww.pushMessage.pos = JSON.parse(ww.pushMessage.parameters['pos'] || '[3,0]');
ww.pushMessage.xybac = JSON.parse(ww.pushMessage.parameters['xybac'] || '[0,0,0,1,5]'); 
ww.pushMessage.uwt = JSON.parse(ww.pushMessage.parameters['uwt'] || '[60,60]'); 
ww.pushMessage.n = JSON.parse(ww.pushMessage.parameters['n'] || '4');
ww.pushMessage.base = JSON.parse(ww.pushMessage.parameters['base'] || '["Base_OR",148,25,444,"\}[8]"]');
 */

/**添加到信息显示2 */
ww.pushMessage.push2message2 = function (n) {
    if (ww.pushMessage2 && ww.pushMessage2.use) {
        ww.pushMessage2.list = ww.pushMessage2.list || []
        ww.pushMessage2.list.push(n)
    }
}

/**通知信息显示2开始显示 */
ww.pushMessage.push2 = function () {
    if (ww.pushMessage2) {
        ww.pushMessage2.addPush()
    }
}




function Sprite_LongList() {
    this.initialize.apply(this, arguments);
}




/**设置原形  */
Sprite_LongList.prototype = Object.create(Sprite_UIBase.prototype);
/**设置创造者 */
Sprite_LongList.prototype.constructor = Sprite_LongList;
/**初始化 */
Sprite_LongList.prototype.initialize = function () {
    Sprite_UIBase.prototype.initialize.call(this);
    this._set = []
    this._show = []
    this._noshow = []

    this._duration = 0

    this._postype = ww.pushMessage.pos
    var xybac = ww.pushMessage.xybac
    this._baseX = xybac[0]
    this._baseY = xybac[1]
    this._addX = xybac[2]
    this._addY = xybac[3]
    this._changeO = xybac[4]
    var uwt = ww.pushMessage.uwt
    this._upTime = uwt[0] || 10
    this._waitTime = uwt[1] || 10

    this._mustinput = ww.pushMessage.input

    this.make()


};

/**制作 */
Sprite_LongList.prototype.make = function () {
    var i = ww.pushMessage.n || 4
    while (i--) {
        var s = new Sprite_LongString()
        this._noshow.push(s)
    }
}



/**没有显示的设置
 * @return {number}
 * 
 */
Sprite_LongList.prototype.haveSet = function () {
    return this._set.length
}



/**没有使用的精灵
 * @return {number}
 * 
 */
Sprite_LongList.prototype.haveNoShow = function () {
    return this._noshow.length
}


/**已经使用的精灵 
 * @return {number}
 * 
*/
Sprite_LongList.prototype.haveShow = function () {
    return this._show.length
}



/**更新 */
Sprite_LongList.prototype.update = function () {
    Sprite_UIBase.prototype.update.call(this);


    this.updateType()
    var inputfast = ww.pushMessage.inputfast
    //向上移动
    if (inputfast) {
        if (Input.isPressed("ok") || TouchInput.isPressed("ok")) {
            for (var i = 0; i < inputfast; i++) {
                this.updateType()
            }
        }
    }

    this.updatePlacement()
};

Sprite_LongList.prototype.updateType = function () {
    //如果(种类)
    if (this._type) {
        if (this._type == "up") {
            //更新 上
            this.updateUp()
        } else if (this._type == "wait") {
            //更新 等待
            this.updateWait()
        }
    }
};


Sprite_LongList.prototype.addPush = function () {
    var l = ww.pushMessage.list
    ww.pushMessage.list = []
    if (Array.isArray(l)) {
        this.addSet.apply(this, l)
    } else {
        l && this.addSet.call(this, l)
    }
};

/**开始等待 */
Sprite_LongList.prototype.addSet = function () {
    var s = arguments
    for (var i = 0; i < arguments.length; i++) {
        var n = arguments[i]
        if (n) {
            this._set.push(arguments[i])
            ww.pushMessage.push2message2(arguments[i])
        }
    }
    if (!this._type) {
        this.push()
        this.up()
    }

    ww.pushMessage.busy ||  ww.pushMessage.push2()
};


/**没有种类 */
Sprite_LongList.prototype.noType = function () {
    this._type = ""
    this._duration = 0

    ww.pushMessage.busy &&  ww.pushMessage.push2()
};

/**开始等待 */
Sprite_LongList.prototype.wait = function () {
    this._type = "wait"
    this._duration = this._waitTime
};


/**向上移动 */
Sprite_LongList.prototype.up = function () {
    this._type = "up"
    //持续时间 = up时间
    this._duration = this._upTime
};

/**等待结束 */
Sprite_LongList.prototype.waitend = function () {
    //向上移动
    this.up()
};





Sprite_LongList.prototype.waitend = function () {
    this.up()
};


/**向上移动结束 */
Sprite_LongList.prototype.upend = function () {

    //删除消失中精灵
    this.shift()

    //取消精灵是正在显示
    var mustwait = this.end()

    //添加新精灵
    this.push()

    //如果 没有显示的 
    if (!this.haveShow()) {
        this.noType()
        //否则
    } else {
        //等待 
 
        if (mustwait) {
            this.wait()
        } else {
            this.waitend()
        }
    }
};



/**删除第一个 */
Sprite_LongList.prototype.shift = function () {
    var s = this._show[0]
    if (s && s.listtype == "shifting") {
        s.listtype = ""
        this.removeChild(s)
        this._show.shift()
        this._noshow.push(s)
    }
}


/**结束 */
Sprite_LongList.prototype.end = function () {
    var re = false
    //取消精灵是正在显示
    for (var i = 0; i < this._show.length; i++) {
        var s = this._show[i]
        if (s.listtype == "pushing") {
            re = true
        }
        s.listtype = ""
    }
    return re
}

/**添加新精灵 */
Sprite_LongList.prototype.push = function () {
    //添加新精灵
    //如果有下一项并且有未显示的对象
    var mustshift = false
    //如果 有 设置 并且 有 没有使用的精灵 
    if (this.haveSet() && this.haveNoShow()) {
        var n = this._set.shift()
        var s = this._noshow.shift()
        s.setText(n)
        //基础xy
        s.x = this._baseX
        s.y = this._baseY
        //设置状态为 添加中
        s.listtype = "pushing"
        //透明度设置为 基础透明度
        s.opacity = 0
        //添加到显示
        this._show.push(s)
        this.addChild(s)
        if (!this.haveNoShow()) {
            mustshift = true
        }
    } else {
        mustshift = true
    }
    //开始删除第一个
    if (mustshift && this.haveShow()) {
        var s = this._show[0]
        if (s.listtype != "pushing") {
            s.listtype = "shifting"
        }
    }
}



/**更新等待 */
Sprite_LongList.prototype.updateWait = function () {


    var inputre = false
    var inputnext = ww.pushMessage.inputnext
    //向上移动
    if (inputnext) {
        if (Input.isPressed("ok") || TouchInput.isPressed("ok")) {
            inputre = true
        }
    }

    var waitre = false
    if (this._duration <= 0) {
        this._duration = 0
        //等待结束
        waitre = true
    } else {
        this._duration--
    }

    if (inputnext == 1) {
        if (inputre || waitre) {
            this.waitend()
        }
    } else if (inputnext == 2) {
        if (inputre) {
            this.waitend()
        }
    } else if (inputre == 3) {
        if (inputre && waitre) {
            this.waitend()
        }
    } else {
        if (waitre) {
            this.waitend()
        }
    }
};

/**向上移动 */
Sprite_LongList.prototype.updateUp = function () {
    if (this._duration <= 0) {
        this._duration = 0
        //向上移动结束
        this.upend()
    } else {
        this.updateMove()
    }
};


/**更新移动 */
Sprite_LongList.prototype.updateMove = function () {
    //正在显示
    //正在消失
    for (var i = 0; i < this._show.length; i++) {
        var s = this._show[i]
        //添加中
        if (s.listtype == "pushing") {
            s.opacity += this._changeO
            //删除中
        } else if (s.listtype == "shifting") {
            s.opacity -= this._changeO
        }
        s.y += this._addY
        s.x += this._addX
    }
    //移动 
    this._duration--
}




/**位置设置 */
Sprite_LongList.prototype.updatePlacement2 = function () {
    this.x = Graphics._width * 0.5
    this.y = Graphics._height * 0.5
}


Sprite_LongList.prototype.updatePlacement = function () {

    var postype = this._postype
    var w = 0
    var h = 0

    if (typeof (postype) == "number") {
        var y = postype * (Graphics.boxHeight - h) / 2;
        var x = (Graphics.boxWidth - w) / 2;
    } else if (Array.isArray(postype)) {
        var types = postype
        var type = (types[0] || 0) * 1
        var id = (types[1] || 0) * 1
        var cex = types[2] === undefined ? 0.5 : types[2] * 1
        var cey = types[3] === undefined ? 0.5 : types[3] * 1
        var wex = types[4] === undefined ? 0.5 : types[4] * 1
        var wey = types[5] === undefined ? 0.5 : types[5] * 1
        var wdx = (types[6] || 0) * 1
        var wdy = (types[7] || 0) * 1

        var rx = 0
        var ry = 0
        var rw = 1
        var rh = 1
        if (type == 8) {
            if (id == 4) {
                var rx = 0
                var ry = 0
                var rw = Graphics._width
                var rh = Graphics._height
            }
            if (id == 1) {
                var rx = 0
                var ry = 0
                var rw = SceneManager._screenWidth
                var rh = SceneManager._screenHeight
            }
            if (id == 2) {
                var rw = SceneManager._boxWidth
                var rh = SceneManager._boxHeight
                var rx = (SceneManager._screenWidth - SceneManager._boxWidth) * 0.5
                var ry = (SceneManager._screenHeight - SceneManager._boxHeight) * 0.5
            }
            if (id == 0) {
                var rx = 0
                var ry = 0
                var rw = 1
                var rh = 1
            }
            if (id == 3) {
                var rx = 0
                var ry = 0
                var rw = SceneManager._screenWidth
                var rh = SceneManager._screenHeight
                if (mapvar && !mapvar.value("cblopen")) {
                    var rx = 0;
                } else {
                    var rx = 0
                    var rw = rw - rx
                }
            }
        } else {

            var actor
            var character
            if (type == 3) {
                if (id > 0) {
                    character = $gamePlayer.followers().follower(id - 1)
                    actor = $gameParty.members()[id]
                }
                if (!character) {
                    character = $gamePlayer
                }

                if (!actor) {
                    actor = $gameParty.members()[0]
                }
            }
            if (type == 4) {
                character = $gameMap.event(id);
                if (!character) {
                    character = $gameMap.event($gameMap._interpreter.eventId())
                }
                if (!character) {
                    character = $gamePlayer
                }
            }

            /**队伍 */
            if (type == 5) {
                actor = $gameParty.members()[id]
                if (!actor) {
                    $gameParty.members()[0]
                }
            }
            /**角色 */
            if (type == 6) {
                actor = $gameActors.actor(id)
                if (!actor) {
                    actor = $gameParty.members()[0]
                }
            }
            /**敌人 */
            if (type == 7) {
                actor = $gameTroop.members()[id]
                if (!actor) {
                    actor = $gameParty.members()[0]
                }
            }
            if (SceneManager._scene.constructor === Scene_Map) {
                if (type == 5 || type == 6 || type == 7) {
                    var pid = 0
                    var l = $gameParty.members()
                    for (var i = 0; i < l.length; i++) {
                        if (l[i] == actor) {
                            pid = i
                        }
                    }
                    if (pid == 0) {
                        character = $gamePlayer
                    } else {
                        character = $gamePlayer.followers().follower(pid - 1)
                    }
                    if (!character) {
                        character = $gamePlayer
                    }
                }
                var ns
                var ps
                var ss = SceneManager._scene._spriteset._characterSprites
                for (var i = 0; i < ss.length; i++) {
                    var s = ss[i]
                    if (s && s._character == character) {
                        ns = s
                    }
                    if (s && s._character == $gamePlayer) {
                        ps = s
                    }
                }
                if (!ns) {
                    ns = ps
                }
                if (!ns) {
                    this.updatePlacement2()
                    return
                }
                var px = ns.x
                var py = ns.y
                var pw = ns.patternWidth()
                var ph = ns.patternHeight()

                var rx = px - pw * 0.5
                var ry = py - ph * 1
                var rw = pw
                var rh = ph
            }
            if (SceneManager._scene.constructor === Scene_Battle) {
                if (!actor) {
                    this.updatePlacement2()
                    return
                }
                var ns
                var ps
                var ss = SceneManager._scene._spriteset.battlerSprites()
                for (var i = 0; i < ss.length; i++) {
                    var s = ss[i]
                    if (s && s._battler == actor) {
                        ns = s
                    }
                    if (s && s._battler == $gameParty.members()[0]) {
                        ps = s
                    }
                }
                if (!ns) {
                    ns = ps
                }
                if (!ns) {
                    this.updatePlacement2()
                    return
                }
                if (ns.constructor == Sprite_Enemy) {
                    var rx = ns.x
                    var ry = ns.y
                    var rw = ns.bitmap.width
                    var rh = ns.bitmap.height
                } else if (ns.constructor == Sprite_Actor) {
                    var px = ns.x
                    var py = ns.y
                    var pw = ns._mainSprite.bitmap.width
                    var ph = ns._mainSprite.bitmap.height

                    var rx = px - pw * 0.5
                    var ry = py - ph * 1
                    var rw = pw
                    var rh = ph

                } else {
                    var rx = ns.x
                    var ry = ns.y
                    var rw = 0
                    var rh = 0
                }

            }
        }

        var x = rx + cex * rw - w * wex + wdx
        var y = ry + cey * rh - h * wey + wdy
    }


    var u = 0
    var d = 0
    var l = 0
    var r = 0
    var sw = SceneManager._screenWidth
    var sh = SceneManager._screenHeight


    if (SceneManager._scene.constructor === Scene_Battle) {
        var u = 20
        var d = 20
    }

    var zx = u
    var zy = l
    var sx = sw - r
    var sy = sh - d
    var mx = sx - w
    var my = sy - h

    x = Math.min(x, mx)
    x = Math.max(x, zx)
    y = Math.min(y, my)
    y = Math.max(y, zy)

    this.x = x
    this.y = y

}



function Sprite_LongString() {
    this.initialize.apply(this, arguments);
}
Sprite_LongString.prototype = Object.create(Sprite.prototype);
Sprite_LongString.prototype.constructor = Sprite_LongString;


Sprite_LongString.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this)
    this.createSprites()
};

Sprite_LongString.prototype.createSprites = function () {

    this._picture = new Sprite()

    var x = ww.pushMessage.tbxy[0]
    var y = ww.pushMessage.tbxy[1]
    this._picture.x = x
    this._picture.y = y
    var x = ww.pushMessage.tboxy[0]
    var y = ww.pushMessage.tboxy[1]

    this._picture.anchor.x = x
    this._picture.anchor.y = y
    //this.addChild(this._picture)



    this._base = new Sprite()

    var name = ww.pushMessage.base[0]
    this._base.bitmap = ImageManager.loadSystem(name)

    var x = ww.pushMessage.tbxy[4]
    var y = ww.pushMessage.tbxy[5]

    this._base.x = x
    this._base.y = y
    var x = ww.pushMessage.tboxy[4]
    var y = ww.pushMessage.tboxy[5]

    this._base.anchor.x = x
    this._base.anchor.y = y

    this.addChild(this._base)



    this._string = new Sprite()

    this._w = ww.pushMessage.base[1]
    this._h = ww.pushMessage.base[2]
    this._l = ww.pushMessage.base[3]
    this._t = ww.pushMessage.base[4]

    this._string.bitmap = new Bitmap(this._w * this._l, this._h)



    var x = ww.pushMessage.tbxy[2]
    var y = ww.pushMessage.tbxy[3]

    this._string.x = x
    this._string.y = y

    var x = ww.pushMessage.tboxy[2]
    var y = ww.pushMessage.tboxy[3]

    this._string.anchor.x = x
    this._string.anchor.y = y


    this.addChild(this._string)


}

Sprite_LongString.prototype.setText = function (t) {


    if (this._text != t) {
        this._text = t

        if (t === undefined) {
            this._string.bitmap.clear()
            this._base.visible = false
            this._picture.bitmap = ImageManager.loadEmptyBitmap()
        } else {

            if (typeof t == "string") {
                var b = this._string.bitmap
                b.clear()
                var w = b.window()
                var l = w.drawTextEx(this._text, 0, 0, this._w * this._l, this._h, 1)

                if (l <= this._w) {
                    this._base.scale.x = 1
                } else if (l >= this._w * this._l) {
                    this._base.scale.x = this._l
                } else {
                    this._base.scale.x = Math.ceil(l * 100 / this._w) / 100
                }
                this._picture.bitmap = ImageManager.loadEmptyBitmap()

                this._base.visible = true
            } else if (Array.isArray(t)) {
                var type = t[0]
                var filename = t[1]
                var text = t[2]

                if (type == 0) {

                } else if (type == 1) {
                    this._picture.bitmap = ImageManager.loadPictureItem(filename)

                } else if (type == 2) {
                    this._picture.bitmap = ImageManager.loadPictureWeapon(filename)

                } else if (type == 3) {
                    this._picture.bitmap = ImageManager.loadPictureArmor(filename)
                }

                if (text) {
                    var b = this._string.bitmap
                    b.clear()
                    var w = b.window()
                    var l = w.drawTextEx(text, 0, 0, this._w * this._l, this._h, 1)

                    if (l <= this._w) {
                        this._base.scale.x = 1
                    } else if (l >= this._w * this._l) {
                        this._base.scale.x = this._l
                    } else {
                        this._base.scale.x = Math.ceil(l * 100 / this._w) / 100
                    }
                    this._base.visible = true
                } else {
                    this._string.bitmap.clear()
                    this._base.visible = false
                }

            }


        }


    }
}







/**创建显示对象 */
ww.pushMessage.createDisplayObjects = Scene_Map.prototype.createDisplayObjects



Scene_Map.prototype.createDisplayObjects = function () {
    ww.pushMessage.createDisplayObjects.call(this)
    this._pushMessage = new Sprite_LongList()
    this.addChild(this._pushMessage)
};







Game_Message.prototype.getPushMessage = function () {
    if (SceneManager._scene && SceneManager._scene._pushMessage) {
        return SceneManager._scene._pushMessage
    } else {
        return null
    }
};


Game_Message.prototype.pushMessage2 = function () {
    var p = $gameMessage.getPushMessage()
    p && p.addPush()
}

Game_Message.prototype.pushMessage = function () {
    var p = this.getPushMessage()
    p && p.addSet.apply(p, arguments)
};






Game_Message.prototype.isPushBusy = function () {
    var re2 = false
    if (ww.pushMessage.busy) {
        var p = this.getPushMessage()
        var re2 = p && p.haveShow()
    }
    return re2;
};



 


Game_Message.prototype.pushGold = function (value) {


    if (ww.pushMessage.use && value) {
        var get = ww.pushMessage.get || []
        if (value >= 0) {
            get = get[2] || ""
        } else {
            get = get[3] || ""
        }
        var it = get.format(value)
        $gameMessage.pushMessage([4, "money", it])
    }

};



DataManager.isIWAType = function (item) {

    if (!item) {
        return 0
    } else if (DataManager.isItem(item)) {
        return 1
    } else if (DataManager.isWeapon(item)) {
        return 2
    } else if (DataManager.isArmor(item)) {
        return 3
    }
    return 0;
};





Game_Message.prototype.pushItem = function (item, value) {

    if (ww.pushMessage.use && item && value) {
        var type = DataManager.isIWAType(item)
        var get = ww.pushMessage.get || []
        if (value >= 0) {
            get = get[0] || ""
        } else {
            get = get[1] || ""
        }
        var it = get.format(item.name, value)
        this.pushMessage([type, item.id, it])
    }

};






/** Change Gold 改变金钱*/
Game_Interpreter.prototype.command125 = function () {
    //值 = 操作数值(参数组[0] ,参数组[1],参数组[2] )
    var value = this.operateValue(this._params[0], this._params[1], this._params[2]);
    //游戏队伍 获得金钱(值)
    $gameParty.gainGold(value);


    // if (ww.pushMessage.use) { 
    $gameMessage.pushGold(value)
 


    if(this.nextEventCode() <125 || this.nextEventCode()>128 ){
        this.setWaitMode('message')
        this._index++
        return false
    }

    //返回 true
    return true;
};

/** Change Items 改变物品*/
Game_Interpreter.prototype.command126 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //游戏队伍 获得物品(数据物品组[参数组[0]],值 )
    $gameParty.gainItem($dataItems[this._params[0]], value);
    //if (ww.pushMessage.use) {

    $gameMessage.pushItem($dataItems[this._params[0]], value)

    


    if(this.nextEventCode() <125 || this.nextEventCode()>128 ){
        this.setWaitMode('message')
        this._index++
        return false
    }

    //返回 true
    return true;
};

/** Change Weapons 改变武器*/
Game_Interpreter.prototype.command127 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //游戏队伍 获得物品(数据武器组[参数组[0]],值 ,参数组[4]  )
    $gameParty.gainItem($dataWeapons[this._params[0]], value, this._params[4]);


    //if (ww.pushMessage.use) {

    $gameMessage.pushItem($dataWeapons[this._params[0]], value)

    
    if(this.nextEventCode() <125 || this.nextEventCode()>128 ){
        this.setWaitMode('message')
        this._index++
        return false
    }

    //返回 true
    return true;
};



Game_Interpreter.prototype.command128 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //游戏队伍 获得物品(数据防具组[ 参数组[0] ] ,值, 参数组[4] )
    $gameParty.gainItem($dataArmors[this._params[0]], value, this._params[4]);

    //if (ww.pushMessage.use) {
    $gameMessage.pushItem($dataArmors[this._params[0]], value)
    //this.setWaitMode('message');
    //    this._index++;

    //   return false
    // }

    if(this.nextEventCode() <125 || this.nextEventCode()>128 ){
        this.setWaitMode('message')
        this._index++
        return false
    }
    //this.setWaitMode('message');
    
    //this._index++; 
    //return false

    //返回 true
    return true;
};





Game_Party.prototype.gainRandomItem = function (type, id, min, max, includeEquip) {
    var num = max - min
    var amount = min + Math.randomInt(num)
    if (type) {
        var item = null
        if (type == 1) {
            var item = $dataItems[id];
        } else if (type == 2) {
            var item = $dataWeapons[id];
        } else if (type == 3) {
            var item = $dataArmors[id];
        }
        if (item && amount) {
            this.gainItem(item, amount, includeEquip)

            $gameMessage.gainItem(item, amount)
        }
    } else {
        if (amount) {
            this.gainGold(amount)

            $gameMessage.pushGold(amount)
        }
    }
    // $gameMessage.pushMessage2() 
};


 
 
 
 
ww.pushMessage.Game_Message_prototype_isBusy = Game_Message.prototype.isBusy 
Game_Message.prototype.isBusy = function () {

    var re = ww.pushMessage.Game_Message_prototype_isBusy.call(this) 
    //返回 有文本 或者 是选择 或者 是数字输入 或者 是物品选择
    return re || this.isPushBusy() ;
};
 