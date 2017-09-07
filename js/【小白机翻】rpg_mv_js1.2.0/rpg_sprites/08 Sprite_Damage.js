
//-----------------------------------------------------------------------------
// Sprite_Damage
// 伤害精灵
// The sprite for displaying a popup damage.
// 显示跃出伤害的精灵

function Sprite_Damage() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_Damage.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_Damage.prototype.constructor = Sprite_Damage;
//初始化
Sprite_Damage.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._duration = 90;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._damageBitmap = ImageManager.loadSystem('Damage');
};
//安装
Sprite_Damage.prototype.setup = function(target) {
    var result = target.result();
    if (result.missed || result.evaded) {
        this.createMiss();
    } else if (result.hpAffected) {
        this.createDigits(0, result.hpDamage);
    } else if (target.isAlive() && result.mpDamage !== 0) {
        this.createDigits(2, result.mpDamage);
    }
    if (result.critical) {
        this.setupCriticalEffect();
    }
};
//安装危害结果
Sprite_Damage.prototype.setupCriticalEffect = function() {
    this._flashColor = [255, 0, 0, 160];
    this._flashDuration = 60;
};
//数字宽
Sprite_Damage.prototype.digitWidth = function() {
    return this._damageBitmap ? this._damageBitmap.width / 10 : 0;
};
//数字高
Sprite_Damage.prototype.digitHeight = function() {
    return this._damageBitmap ? this._damageBitmap.height / 5 : 0;
};
//创建未命中
Sprite_Damage.prototype.createMiss = function() {
    var w = this.digitWidth();
    var h = this.digitHeight();
    var sprite = this.createChildSprite();
    sprite.setFrame(0, 4 * h, 4 * w, h);
    sprite.dy = 0;
};
//创建数字
Sprite_Damage.prototype.createDigits = function(baseRow, value) {
    var string = Math.abs(value).toString();
    var row = baseRow + (value < 0 ? 1 : 0);
    var w = this.digitWidth();
    var h = this.digitHeight();
    for (var i = 0; i < string.length; i++) {
        var sprite = this.createChildSprite();
        var n = Number(string[i]);
        sprite.setFrame(n * w, row * h, w, h);
        sprite.x = (i - (string.length - 1) / 2) * w;
        sprite.dy = -i;
    }
};
//创建子精灵
Sprite_Damage.prototype.createChildSprite = function() {
    var sprite = new Sprite();
    sprite.bitmap = this._damageBitmap;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.y = -40;
    sprite.ry = sprite.y;
    this.addChild(sprite);
    return sprite;
};
//更新
Sprite_Damage.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._duration > 0) {
        this._duration--;
        for (var i = 0; i < this.children.length; i++) {
            this.updateChild(this.children[i]);
        }
    }
    this.updateFlash();
    this.updateOpacity();
};
//更新子代
Sprite_Damage.prototype.updateChild = function(sprite) {
    sprite.dy += 0.5;
    sprite.ry += sprite.dy;
    if (sprite.ry >= 0) {
        sprite.ry = 0;
        sprite.dy *= -0.6;
    }
    sprite.y = Math.round(sprite.ry);
    sprite.setBlendColor(this._flashColor);
};
//更新闪烁
Sprite_Damage.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        var d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
    }
};
//更新不透明度
Sprite_Damage.prototype.updateOpacity = function() {
    if (this._duration < 10) {
        this.opacity = 255 * this._duration / 10;
    }
};
//是播放中
Sprite_Damage.prototype.isPlaying = function() {
    return this._duration > 0;
};
