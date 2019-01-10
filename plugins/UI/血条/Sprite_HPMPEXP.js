
String.prototype.format2 = function (obj) {
    return this.replace(/%\[(.*?)\]/gi, function (s, n) {
        return obj[n] === void 0 ? "" : obj[n];
    });
};

function Sprite_HPMPEXP() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_HPMPEXP.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_HPMPEXP.prototype.constructor = Sprite_HPMPEXP;

Sprite_HPMPEXP.hp = {
    bitmap: ["HPMP_Base", "HPMP_Outer", "HP_Now", "HP_Add", "HP_Subtract"],
    base: [1, 8],
    hmexp: [1, 8],
    touch: [2, 168],
    hmexp2: true,
    out: [0, 7],
    hmexpText: [5, 6, 160, 36],
    text: "\\}[8]\\OW[0]%[n]%[p]",
    text2: "",
    color: ["\\c[#000000]", "\\c[#50bc00]", "\\c[#ff0000]"]
}




Sprite_HPMPEXP.prototype.initialize = function (set) {
    Sprite.prototype.initialize.call(this);
    this.create(set)
};

Sprite_HPMPEXP.prototype.create = function (set) {
    if (typeof (set) == "string") {
        var set = Sprite_HPMPEXP[set]
    }
    this._set = set

    this._bitmaps = set.bitmap

    var wh = set.base
    this._baseSprite = new Sprite(this.getBitmap(0))
    this._baseSprite.x = wh[0]
    this._baseSprite.y = wh[1]


    //下面的条
    var wh = set.hmexp
    this._hmexpSprite = new Sprite_UIRect2()
    this._hmexpSprite.x = wh[0]
    this._hmexpSprite.y = wh[1]


    //上面的条
    var wh = set.hmexp
    this._hmexpSprite2 = new Sprite_UIRect2()
    this._hmexpSprite2.x = wh[0]
    this._hmexpSprite2.y = wh[1]
    this._hmexpSprite2.visible = set.hmexp2


    var wh = set.out
    this._outerSprite = new Sprite(this.getBitmap(1))
    this._outerSprite.x = wh[0]
    this._outerSprite.y = wh[1]

    var wh = set.hmexpText
    this._hmexpText = new Sprite_UIString2(wh[2], wh[3])
    this._hmexpText.x = wh[0]
    this._hmexpText.y = wh[1]


    this.addChild(this._baseSprite)
    this.addChild(this._hmexpSprite)
    this.addChild(this._hmexpSprite2)
    this.addChild(this._outerSprite)
    this.addChild(this._hmexpText)

    this.setPMP(0, 1)
};


/**获取图片 */
Sprite_HPMPEXP.prototype.getBitmap = function (i) {
    return ImageManager.loadPicture(this._bitmaps[i])
};



Sprite_HPMPEXP.prototype.setXY = function (x) {
    var touch = this._set.touch || []
    var l = touch[0] || 0 // this._hmexpSprite.x 
    var w = touch[1] || 1
    if (x < l) {
        this.toP(0)
    } else if (x > l + w) {
        this.toP(this._mp)
    } else {
        var p =  x - l / w
        this.toP( p *  this._mp)
    }
};




/**
 * 设置p值maxp值  
 * 
 */
Sprite_HPMPEXP.prototype.setPMP = function (p, mp, lv) {
    if (mp) {
        this._p = p || 0
        this._mp = mp || 0
        this._targetP = p
        this._duration = 0
        this._lv = lv || 0
        this._pt = 0
        this.change()
        this.change2(p, mp)
        this.visible = true
    } else {
        this.visible = false
    }
};


Sprite_HPMPEXP.prototype.setMP = function (mp) {
    if (mp) {
        this._mp = mp || 0
        this.change()
        this.change2(this._p, this._mp)
        this.visible = true
    } else {
        this.visible = false
    }
};

Sprite_HPMPEXP.prototype.setP = function (p) {
    this.setPMP(p, this._mp, this._lv)
};

/**
 * 设置p值maxp值  
 * 
 */
Sprite_HPMPEXP.prototype.setRect2 = function (v) {
    this._hmexpSprite2.visible = !!v
};



/**
 * 到p值
 */
Sprite_HPMPEXP.prototype.toP = function (p, maps) {
    if (this._targetP != p) {
        this._duration = 60
        this._targetP = p
    }
    this._maps = maps
    if (p < this._p) {
        this._pt = 2
        this.change2(p, this._mp)
    } else if (p > this._p) {
        this._pt = 1
    } else {
        this._pt = 0
        this._duration = 0
    }
};

/**
 * 更新
 */
Sprite_HPMPEXP.prototype.update = function () {
    Sprite.prototype.update.call(this)
    if (this._duration > 0) {
        var d = this._duration
        this._p = Math.round((this._p * (d - 1) + this._targetP) / d)
        while (this._maps && this._maps.length) {
            if (this._pt == 1 && this._p > this._mp) {
                this.upMp()
            } else if (this._pt == 2 && this._p < 0) {
                this.downMp()
            } else {
                break
            }
        }
        this._duration--;
        this.change()
    } else {
        if (this._pt) {
            this._pt = 0
            this.change2(this._p, this._mp)
            this.change()
        }
    }
};

/**升级mp值 */
Sprite_HPMPEXP.prototype.upMp = function () {
    this._p = this._p - this._mp
    this._mp = this._maps.shift()
    this._targetP = this._targetP - this._mp
    this._lv += 1
    this.change2(0, this._mp)
}

/**下降mp值 */
Sprite_HPMPEXP.prototype.downMp = function () {
    this._mp = this._maps.shift()
    this._p = this._mp + this._p
    this._targetP = this._targetP + this._mp
    this._lv -= 1
    this.change2(this._targetP, this._mp)
}



/**
 * 改变上面的条
 * 
 */
Sprite_HPMPEXP.prototype.change2 = function (p, mp) {
    this._hmexpSprite2.bitmap = this.getBitmap(0 + 2)
    this._hmexpSprite2.long = mp ? p / mp : p / 100
}


/**
 * 改变下面的条
 * 
 */
Sprite_HPMPEXP.prototype.change = function (v) {
    var o = this.makeObj()
    this._hmexpSprite.bitmap = this.getBitmap(o.pt + 2)
    this._hmexpSprite.long = o.mp ? o.p / o.mp : o.p / 100
    this._hmexpText.text = this._set.text.format2(o)
    this._hmexpText.text2 = this._set.text2.format2(o)
}

/**
 * 生成设置对象
 * 
 */
Sprite_HPMPEXP.prototype.makeObj = function () {
    var set = this._set
    var o = {
        p: this._p,
        mp: this._mp,
        lv: this._lv,
        pt: this._pt,
        pc: set.color[this._pt],
        n: set.color[0],
        add: set.color[1],
        sub: set.color[2]
    }
    return o
};


