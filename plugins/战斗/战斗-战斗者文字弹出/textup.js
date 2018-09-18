/*




var s = this.subject() ;console.log(s);s.pushTextPopup([{"text":"大招", "d":[0,-100],"ds":200 },{"text":"大招", "d":[-100,-100],"ds":200 } ]);s.startTextPopup();
var ss=  this.makeTargets();for(var i =0;i<ss.length;i++ ){var s = ss[i];s.pushTextPopup([{"text":"被攻击", "d":[0,-100],"ds":200 	 },{"text":"被攻击", "d":[100,-100],"ds":200	 } ]);s.pushTextPopup([{"text":"\\{被攻击\\i[1]", "d":[0,0],"ds":500 , },{"text":"\\{被攻击\\i[1]", "d":[100,0],"ds":300  } ]); s.startTextPopup();}
*/
var ww = ww || {}
ww.textup = ww.textup || {}

ww.textup.Sprite_Battler_prototype_update = Sprite_Battler.prototype.update
Sprite_Battler.prototype.update = function() {
    ww.textup.Sprite_Battler_prototype_update.call(this)
    if (this._battler) {
        this.updateTextPopup()
    }
};

Sprite_Battler.prototype.updateTextPopup = function() {
    this.setupTextPopup();

    if (this._texts && this._texts.length > 0) {
        for (var i = 0; i < this._texts.length; i++) {
            this._texts[i].update();
            if (!this._texts[i].isPlaying()) {
                this.parent.removeChild(this._texts[i]);
                this._texts.splice(i, 1);
            }
        }
    }
};


Sprite_Battler.prototype.setupTextPopup = function() {
    if (this._battler.isTextPopupRequested()) {
        if (this._battler.isSpriteVisible() && this._battler._texts) {
            this._text = this._text || []
            var texts = this._battler._texts
            for (var i = 0; i < texts.length; i++) {
                if (texts[i]) {
                    var sprite = new Sprite_Text();
                    sprite.x = this.x
                    sprite.y = this.y
                    sprite.setup(texts[i]);
                    this._texts.push(sprite);
                    this.parent.addChild(sprite);
                }
            }
        }
        this._battler.clearTextPopup()
    }
};


//有文本跃上
Game_Battler.prototype.isTextPopupRequested = function() {
    return this._textPopup;
};

//清除文本跃上
Game_Battler.prototype.clearTextPopup = function() {
    this._textPopup = false;
    this._texts = []
};
//添加文本跃上
Game_Battler.prototype.pushTextPopup = function(obj) {
    this._texts.push(obj)
};

//开始文本跃上
Game_Battler.prototype.startTextPopup = function() {
    this._textPopup = true;
};




function Sprite_Text() {
    this.initialize.apply(this, arguments);
}

Sprite_Text.prototype = Object.create(Sprite.prototype);
Sprite_Text.prototype.constructor = Sprite_Text;
Sprite_Text.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);

    this._guiji = null
    this._text = ""
    this._duration = 0
    this._wzd = [0, 0]

    var sprite = new Sprite();
    sprite.bitmap = null;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    this.addChild(sprite);
    this._cs = sprite
};



/*
	    {   "text":"大招", 
	    	"d":[0,100],
	    	"ds":20 
	    }     
*/

//安装
Sprite_Text.prototype.setup = function(obj) {

    this._guiji = obj || []

    this.rGuiji()
};

Sprite_Text.prototype.rGuiji = function() {
    var gj = this._guiji.shift()
    if (!gj) {
        this._duration = -1
    } else {
        if (gj.text && this._text != gj.text) {
            this._text = gj.text
            this.re()
        }
        this._duration = gj.ds || 0

        this._wzd = gj.d || [0, 0]


    }
};

Sprite_Text.prototype.re = function() {
    var w = new Window_Base(0, 0, 200, 300)
    w.drawTextEx = function(text, x, y) {
        if (text) {
            var textState = { index: 0, x: x, y: y, left: x };
            textState.text = this.convertEscapeCharacters(text);
            textState.height = this.calcTextHeight(textState, false);
            this.resetFontSettings();
            while (textState.index < textState.text.length) {
                this.processCharacter(textState);
            }
            return [textState.x - x + 10, textState.height];
        } else {
            return [0, 0];
        }
    };
    var wh = w.drawTextEx(this._text, 0, 0)
    var b = new Bitmap(wh[0], wh[1])
    b.blt(w._windowContentsSprite.bitmap, 0, 0, wh[0], wh[1], 0, 0)
    this._cs.bitmap = b

};

//更新
Sprite_Text.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._duration > 0) {
        this.updateChild()
        this._duration--;
    } else if (this.isPlaying()) {
        this.rGuiji()
    }
};

Sprite_Text.prototype.updateChild = function() {
    var sprite = this._cs
    var d = this._duration
    sprite.x = (sprite.x * (d - 1) + this._wzd[0]) / d
    sprite.y = (sprite.y * (d - 1) + this._wzd[1]) / d
};


//是播放中
Sprite_Text.prototype.isPlaying = function() {
    return this._duration >= 0;
};