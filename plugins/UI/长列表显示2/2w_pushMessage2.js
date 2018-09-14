//=============================================================================
// 2w_pushMessage2.js
//=============================================================================

/*:
 * @plugindesc 弹出信息
 * @author wangwang
 *   
 * @param 2w_pushMessage2
 * @desc 插件 弹出信息
 * @default 汪汪
 *   
 * @param  pos
 * @desc  默认位置
 * @default  1
 * 
 * @param  get
 * @desc  获取信息的显示内容
 * @default  ["","","",""]
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
 * @default  ["",148,25,3,"\\}[8]"]
 * 
 * 
 * @param  n
 * @desc  默认数量,总共4条
 * @default  4
 * 
 * 
 * @param  xybac
 * @desc  弹出的xy的基础位置及xy变化,淡入淡出增加量
 * @default  [-40,0,2,0,13]
 *  
 * @param  uwt
 * @desc  弹出时间, 等待时间
 * @default  [20,25]
 * 
 * 
 * @param  use
 * @desc  是否使用显示
 * @default  true
 * 
 * @param  inputnext
 * @desc  0 等待结束进行下一个, 1 等待结束或输入进行下一个, 2 必须输入才进行下一个 , 3 等待结束并且输入才进行下一个
 * @default  2
 * 
 * 
 * @param  inputfast
 * @desc  输入加快,值为按下ok键时增加的倍数
 * @default  0
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




var ww = ww || {}


ww.pushMessage2 = {}
ww.pushMessage2 = ww.PluginManager.get('2w_pushMessage2');/*
ww.pushMessage2.pos = JSON.parse(ww.pushMessage2.parameters['pos'] || '[3,0]');
ww.pushMessage2.xybac = JSON.parse(ww.pushMessage2.parameters['xybac'] || '[0,0,0,1,5]'); 
ww.pushMessage2.uwt = JSON.parse(ww.pushMessage2.parameters['uwt'] || '[60,60]'); 
ww.pushMessage2.n = JSON.parse(ww.pushMessage2.parameters['n'] || '4');
ww.pushMessage2.base = JSON.parse(ww.pushMessage2.parameters['base'] || '["Base_OR",148,25,444,"\}[8]"]');
 */





function Sprite_LongList2() {
    this.initialize.apply(this, arguments);
}




/**设置原形  */
Sprite_LongList2.prototype = Object.create(Sprite_LongList.prototype);
/**设置创造者 */
Sprite_LongList2.prototype.constructor = Sprite_LongList2;
/**初始化 */
Sprite_LongList2.prototype.initialize = function () {
    Sprite_UIBase.prototype.initialize.call(this);
    this._set = []
    this._show = []
    this._noshow = []

    this._duration = 0

    this._postype = ww.pushMessage2.pos
    var xybac = ww.pushMessage2.xybac
    this._baseX = xybac[0]
    this._baseY = xybac[1]
    this._addX = xybac[2]
    this._addY = xybac[3]
    this._changeO = xybac[4]
    var uwt = ww.pushMessage2.uwt
    this._upTime = uwt[0] || 10
    this._waitTime = uwt[1] || 10

    this._mustinput = ww.pushMessage2.input

    this.make()

};

/**制作 */
Sprite_LongList2.prototype.make = function () {
    var i = ww.pushMessage2.n || 4
    while (i--) {
        var s = new Sprite_LongString2()
        this._noshow.push(s)
    }
}


/**更新 */
Sprite_LongList2.prototype.update = function () {
    Sprite_UIBase.prototype.update.call(this);
    this.updateType()
    var inputfast = ww.pushMessage2.inputfast
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



Sprite_LongList2.prototype.addPush = function () {
    var l = ww.pushMessage2.list
    ww.pushMessage2.list = []
    if (Array.isArray(l)) {
        this.addSet.apply(this, l)
    } else {
        l && this.addSet.call(this, l)
    }
};

/**开始等待 */
Sprite_LongList2.prototype.addSet = function () {
    var s = arguments
    for (var i = 0; i < arguments.length; i++) {
        var n = arguments[i]
        if (n && Array.isArray(n) && n[0] != 0) {
            this._set.push(arguments[i])
        }
    } 
    if (!this._type) { 
        this.push()
        this.up()
    }
};





/**更新等待 */
Sprite_LongList2.prototype.updateWait = function () {

    var inputre = false
    var inputnext = ww.pushMessage2.inputnext
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



Sprite_LongList2.prototype.noType = function () {
    this._type = ""
    this._duration = 0
};





function Sprite_LongString2() {
    this.initialize.apply(this, arguments);
}
Sprite_LongString2.prototype = Object.create(Sprite_LongString.prototype);
Sprite_LongString2.prototype.constructor = Sprite_LongString2;




Sprite_LongString2.prototype.createSprites = function () {

    this._picture = new Sprite()

    var x = ww.pushMessage2.tbxy[0]
    var y = ww.pushMessage2.tbxy[1]
    this._picture.x = x
    this._picture.y = y
    var x = ww.pushMessage2.tboxy[0]
    var y = ww.pushMessage2.tboxy[1]

    this._picture.anchor.x = x
    this._picture.anchor.y = y
    this.addChild(this._picture)



    this._base = new Sprite()

    var name = ww.pushMessage2.base[0]
    this._base.bitmap = ImageManager.loadSystem(name)

    var x = ww.pushMessage2.tbxy[4]
    var y = ww.pushMessage2.tbxy[5]

    this._base.x = x
    this._base.y = y
    var x = ww.pushMessage2.tboxy[4]
    var y = ww.pushMessage2.tboxy[5]

    this._base.anchor.x = x
    this._base.anchor.y = y

    //this.addChild(this._base)


    this._string = new Sprite()

    this._w = ww.pushMessage2.base[1]
    this._h = ww.pushMessage2.base[2]
    this._l = ww.pushMessage2.base[3]
    this._t = ww.pushMessage2.base[4]

    this._string.bitmap = new Bitmap(this._w * this._l, this._h)



    var x = ww.pushMessage2.tbxy[2]
    var y = ww.pushMessage2.tbxy[3]

    this._string.x = x
    this._string.y = y

    var x = ww.pushMessage2.tboxy[2]
    var y = ww.pushMessage2.tboxy[3]

    this._string.anchor.x = x
    this._string.anchor.y = y

    //this.addChild(this._string)

}

Sprite_LongString2.prototype.setText = function (t) {


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
                } else if (type == 4) {
                    this._picture.bitmap = ImageManager.loadSystem(filename)
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
ww.pushMessage2.createDisplayObjects = Scene_Map.prototype.createDisplayObjects



Scene_Map.prototype.createDisplayObjects = function () {
    ww.pushMessage2.createDisplayObjects.call(this)
    this._pushMessage2 = new Sprite_LongList2()
    this.addChild(this._pushMessage2)
};



Game_Message.prototype.getPushMessage2 = function () {
    if (SceneManager._scene && SceneManager._scene._pushMessage2) {
        return SceneManager._scene._pushMessage2
    } else {
        return null
    }
};

ww.pushMessage2.addPush = function () {
    var p = $gameMessage.getPushMessage2()
    p && p.addPush() 
}



ww.pushMessage2.isPushBusy = Game_Message.prototype.isPushBusy
Game_Message.prototype.isPushBusy = function () {

    var re = ww.pushMessage2.isPushBusy.call(this)
    if (re) { return re } else {
        var re2 = false
        if (ww.pushMessage2.busy) {
            var p = this.getPushMessage2()
            var re2 = p && p.haveShow()
        }
        return re2
    }
};






