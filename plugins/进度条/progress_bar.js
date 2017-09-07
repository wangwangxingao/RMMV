
function Sprite_progress() {
    this.initialize.apply(this, arguments);
}

Sprite_progress.prototype = Object.create(Sprite.prototype);
Sprite_progress.prototype.constructor = Sprite_progress;

Sprite_progress.prototype.initialize = function (digits) {
    Sprite.prototype.initialize.call(this);
    this._run = true
    this._digits = digits || 0
    this._progress = 0
}

Sprite_progress.prototype.createBitmap = function (width, height) {
    this.bitmap = new Bitmap(width, height)
    this.refresh()
}

Sprite_progress.prototype.run = function () {
    return this._run
}
Sprite_progress.prototype.stop = function () {
    this._run = false
}
Sprite_progress.prototype.play = function () {
    this._run = true
}

/**计算位数 */
Sprite_progress.prototype.digitsEval = function (number) {
    var digits = Math.pow(10, this.digits())
    var max = 100 * digits
    var number = number * digits
    return Math.max(0, Math.min(Math.floor(number), max))
}

/**计算进度 */
Sprite_progress.prototype.evalProgress = function (a, b) {
    var number = 0
    if (b) {
        number = (a / b)
    } else {
        number = a / 1
    }
    return number
}
/**位数 */
Sprite_progress.prototype.digits = function () {
    return this._digits
}
/**设置位数 */
Sprite_progress.prototype.setDigits = function (number) {
    if (number !== undefined) {
        this._digits = number
    }
    return this._digits
}


/**进度 */
Sprite_progress.prototype.progress = function () {
    return this._progress
}
/**设置进度 */
Sprite_progress.prototype.setProgress = function (number) {
    if (number !== undefined) {
        this._progress = number
        if (this.run()) {
            this.refresh()
        }
    }
    return this._progress
}

/**隐藏 */
Sprite_progress.prototype.hide = function () {
    this._hiding = true;
    this.updateVisibility();
};
/**显示 */
Sprite_progress.prototype.show = function () {
    this._hiding = false;
    this.updateVisibility();
};
/**更新可见度 */
Sprite_progress.prototype.updateVisibility = function () {
    this.visible = !this._hiding;
};

Sprite_progress.prototype.update = function () {
    Sprite.prototype.update.call(this);
};



Sprite_progress.prototype.refresh = function () {
}

Sprite_progress.prototype.drawGauge = function (x, y, width, height, rate, color1, color2, color3) {
    if (!this.bitmap) { return }
    var fillW = Math.floor(width * rate);
    if (color3) {
        this.bitmap.fillRect(x, y, width, height, color3);
    }
    if (color1) {
        if (color2) {
            this.bitmap.gradientFillRect(x, y, fillW, height, color1, color2);
        } else {
            this.bitmap.fillRect(x, y, fillW, height, color1);
        }
    }
}




function Sprite_progressBar() {
    this.initialize.apply(this, arguments);
}

Sprite_progressBar.prototype = Object.create(Sprite_progress.prototype);
Sprite_progressBar.prototype.constructor = Sprite_progressBar;

Sprite_progressBar.prototype.initialize = function (object) {
    this._window = new Window_Base()
    var digits = object.digits || 0
    Sprite_progress.prototype.initialize.call(this, digits);
    this.createBitmap(object.width, object.height)
    this.anchor.x = 0.5;
    this.anchor.y = 1; 
}

Sprite_progressBar.prototype.refresh = function () {
    this.bitmap.clear();
    var w = this._window
    var color1 = w.hpGaugeColor1();
    var color2 = w.hpGaugeColor2();
    var color3 = w.gaugeBackColor()
    this.drawGauge(0, 0, 48, 6, this.progress() / 100, color1, color2, color3);
}



Game_CharacterBase.prototype.xt = function(i) {
    this._xtchange = true
    this._xtshow = true 
    this._xt = i;
};
 
 
Sprite_Character.prototype.createGaugeSprite = function () {
    this._gaugeSprite = new Sprite_progressBar({ width: 48, height: 6 });
    this._gaugeSprite.y = 10
    this.addChild(this._gaugeSprite);
    this._gaugeSprite.setProgress(this._character._xt) 
};

var Sprite_Character_prototype_update = Sprite_Character.prototype.update
Sprite_Character.prototype.update = function () {
    this.updateGaugeSprite()
    Sprite_Character_prototype_update.call(this)
};
Sprite_Character.prototype.updateGaugeSprite = function () {
    if (!this._gaugeSprite && this._character._xtshow == true ) {
        this.createGaugeSprite();  
    }else if(this._gaugeSprite && this._character._xtchange){
        this._character._xtchange = false
        this._gaugeSprite.setProgress(this._character._xt)
    }
};
