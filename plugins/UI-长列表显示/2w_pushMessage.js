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
 * @desc  弹出及等待时间
 * @default  ["获得物品%1 x %2","失去物品%1 x %2","获得金钱%1G","失去金钱%1G"]
 * 
 * @param  tbxy
 * @desc  文字和图片的xy
 * @default  [0,0,-10,-10]
 * 
 * @param  n
 * @desc  默认数量,总共4条
 * @default  4
 * 
 * @param  base
 * @desc  背景,长宽,最大长倍数,文字头
 * @default  ["Base_OR",148,25,3,"\\}[8]"]
 * 
 * @param  xybac
 * @desc  弹出的xy的基础位置及变化,淡入淡出增加量
 * @default  [0,0,0,-1,10]
 *  
 * @param  uwt
 * @desc  弹出及等待时间
 * @default  [25,25]
 * 
 *   
 * @param  use
 * @desc  是否使用自动显示
 * @default  true
 * 
 * @param  inputnext
 * @desc  输入才进行下一个
 * @default  true
 * 
 * 
 * @param  inputfast
 * @desc  输入加快
 * @default  1
 * 
 * 
 * @param  busy
 * @desc  信息繁忙
 * @default  true
 * 
 * 
 * @help 
 *  
 * 
 * */

 


 
var   ww = ww || {}
 

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



Bitmap._window = null
Bitmap.prototype.window = function () {
    if (!Bitmap._window) {
        Bitmap._window = new Window_Base()
    }
    Bitmap._window.contents = this
    return Bitmap._window
}





/**画布到局部x 
* @param {number} x x
* @return {number}  
*/
Sprite.prototype.spriteToLocalX = function (x, sprite) {
    var node = sprite || this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};
/**画布到局部y
* @param {number} y y
* @return {number}  
*/
Sprite.prototype.priteToLocalY = function (y, sprite) {
    var node = sprite || this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};




Sprite.prototype.worldToLocalXY = function (x, y, sprite) {
    var node = sprite || this;
    return node.worldTransform.applyInverse({ x: x, y: y }, { visible: node.worldVisible });
};



/**
* 是触摸自己
* @param {number} x x坐标
* @param {number} y y坐标
* @param {boolean} type 是否不检查位图(true 为不检查 )
* @param {bolean}c 是否检查子图(true 为 检查 )
* 
* 
*/
Sprite.prototype.isTouchThis = function (x, y, type, c) {
    if (this.visible) {
        var loc = this.worldToLocalXY(x,y)
        var lx = loc.x 
        var ly = loc.y
        var lv = loc.visible 
      
        if(lv){
            if (c) {
                for (var i = 0; i < this.children.length; i++) {
                    var s = this.children[i]
                    if (s && s.isTouchThis && s.isTouchThis(x, y, type,c)) {
                        return true
                    }
                }
            } 
 
            if (this.isTouchIn && this.isTouchIn(lx, ly, type)) {
                return true
            }
        } 
    }
    return false
}


/**是在之中 
* @param {boolean} type 不检查图片
* 
*/
Sprite.prototype.isTouchIn = function (x, y, type) {
    if (this.anchor) {
        var x = x + this.anchor.x * this.width
        var y = y + this.anchor.y * this.height
    }
    if (this.isTouchInFrame(x, y, type)) {
        return type || this.isTouchInBitamp(x, y)
    } else {
        return false
    }
}


/**是在区域中 */
Sprite.prototype.isTouchInFrame = function (x, y, type) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};


/**是在位图上不透明点 */
Sprite.prototype.isTouchInBitamp = function (x, y) {
    if (this._realFrame) {
        var x = x + this._realFrame.x
        var y = y + this._realFrame.y
    }
    if (this.bitmap && this.bitmap.getAlphaPixel(x, y)) {
        return true
        //console.log("bitmap")
    }
    return false
}






function Sprite_UIBase() {
    this.initialize.apply(this, arguments);
}
Sprite_UIBase.prototype = Object.create(Sprite.prototype);
Sprite_UIBase.prototype.constructor = Sprite_UIBase;



Sprite_UIBase.prototype.initialize = function (set) {
    Sprite.prototype.initialize.call(this)
    if (set) {
        this.bitmap = new Bitmap(set[0], set[1])
    }
};


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



/**开始等待 */
Sprite_LongList.prototype.addSet = function () {
    var s = arguments
    for (var i = 0; i < arguments.length; i++) {
        this._set.push(arguments[i])
    }
    if (!this._type) {
        this.up()
    }
};


/**没有种类 */
Sprite_LongList.prototype.noType = function () {
    this._type = ""
    this._duration = 0
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

    var inputnext = ww.pushMessage.inputnext
    //向上移动
    if (inputnext) {
        if (Input.isPressed("ok") || TouchInput.isPressed("ok")) {
            this.up()
        }
    } else {
        this.up()
    }
};


/**向上移动结束 */
Sprite_LongList.prototype.upend = function () {

    //删除消失中精灵
    this.shift()

    //取消精灵是正在显示
    this.end()

    //添加新精灵
    this.push()

    //如果 没有显示的 
    if (!this.haveShow()) {
        this.noType()
        //否则
    } else {
        //等待
        this.wait()
    }
};


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
    //取消精灵是正在显示
    for (var i = 0; i < this._show.length; i++) {
        var s = this._show[i]
        s.listtype = ""
    }
}



/**更新等待 */
Sprite_LongList.prototype.updateWait = function () {
    if (this._duration <= 0) {
        this._duration = 0
        //等待结束
        this.waitend()
    } else {

        this._duration--
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

    this._base = new Sprite()

    var name = ww.pushMessage.base[0]
    this._base.bitmap = ImageManager.loadSystem(name)
    this._base.anchor.x = 0.5

    var x = ww.pushMessage.tbxy[2]
    var y = ww.pushMessage.tbxy[3]

    this._base.x = x
    this._base.y = y


    this.addChild(this._base)
    this._string = new Sprite()


    this._w = ww.pushMessage.base[1]
    this._h = ww.pushMessage.base[2]
    this._l = ww.pushMessage.base[3]
    this._t = ww.pushMessage.base[4]


    this._string.bitmap = new Bitmap(this._w * this._l, this._h)
    this._string.anchor.x = 0.5

    var x = ww.pushMessage.tbxy[0]
    var y = ww.pushMessage.tbxy[1]

    this._string.x = x
    this._string.y = y



    this.addChild(this._string)


}

Sprite_LongString.prototype.setText = function (t) {
    var t = t === undefined ? "" : this._t + t
    if (this._text != t) {
        this._text = t
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


Game_Message.prototype.pushMessage = function () {
    var p = this.getPushMessage()
    p && p.addSet.apply(p, arguments)
};



 


Game_Message.prototype.isPushBusy = function () { 
    var re2 = false 
    if (ww.pushMessage.busy  ){ 
        var p = this.getPushMessage()
        var re2 = p && p.haveShow()
    } 
    return   re2 ;
};


ww.pushMessage.Game_Message_prototype_isBusy = Game_Message.prototype.isBusy

Game_Message.prototype.isBusy = function () {

    var re = ww.pushMessage.Game_Message_prototype_isBusy.call(this)
    
    //返回 有文本 或者 是选择 或者 是数字输入 或者 是物品选择
    return re || this.isPushBusy() ;
};





Game_Message.prototype.pushGold = function (value) {


    if (ww.pushMessage.use && value) {
        var get = ww.pushMessage.get || []

        if (value > 0) {
            get = get[2] || ""
        } else {
            get = get[3] || ""
        }
        var it = get.format(value)
        $gameMessage.pushMessage(it)
    }


};




Game_Message.prototype.pushItem = function (item, value) {
    if (ww.pushMessage.use && item && value) {
        var get = ww.pushMessage.get || []
        if (value > 0) {
            get = get[0] || ""
        } else {
            get = get[1] || ""
        }
        var it = get.format(item.name, value)
        this.pushMessage(it)
    }
};

















/** Change Gold 改变金钱*/
Game_Interpreter.prototype.command125 = function () {
    //值 = 操作数值(参数组[0] ,参数组[1],参数组[2] )
    var value = this.operateValue(this._params[0], this._params[1], this._params[2]);
    //游戏队伍 获得金钱(值)
    $gameParty.gainGold(value);



    $gameMessage.pushGold(value)



    //返回 true
    return true;
};

/** Change Items 改变物品*/
Game_Interpreter.prototype.command126 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //游戏队伍 获得物品(数据物品组[参数组[0]],值 )
    $gameParty.gainItem($dataItems[this._params[0]], value);

    $gameMessage.pushItem($dataItems[this._params[0]], value)


    //返回 true
    return true;
};

/** Change Weapons 改变武器*/
Game_Interpreter.prototype.command127 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //游戏队伍 获得物品(数据武器组[参数组[0]],值 ,参数组[4]  )
    $gameParty.gainItem($dataWeapons[this._params[0]], value, this._params[4]);



    $gameMessage.pushItem($dataWeapons[this._params[0]], value)



    //返回 true
    return true;
};



Game_Interpreter.prototype.command128 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //游戏队伍 获得物品(数据防具组[ 参数组[0] ] ,值, 参数组[4] )
    $gameParty.gainItem($dataArmors[this._params[0]], value, this._params[4]);



    $gameMessage.pushItem($dataArmors[this._params[0]], value)

    //返回 true
    return true;
};