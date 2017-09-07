
//-----------------------------------------------------------------------------
// Sprite_Battler
// 战斗者精灵
// The superclass of Sprite_Actor and Sprite_Enemy.

function Sprite_Battler() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_Battler.prototype = Object.create(Sprite_Base.prototype);
//设置创造者
Sprite_Battler.prototype.constructor = Sprite_Battler;
//初始化
Sprite_Battler.prototype.initialize = function(battler) {
	//基础精灵 初始化 呼叫(this)
    Sprite_Base.prototype.initialize.call(this);
	//初始化成员
    this.initMembers();
	//设置战斗者
    this.setBattler(battler);
};
//初始化成员
Sprite_Battler.prototype.initMembers = function() {
	//锚 x = 0.5
    this.anchor.x = 0.5;
    //锚 y = 1
    this.anchor.y = 1;
    //战斗者 = null
    this._battler = null;
    //伤害组
    this._damages = [];
    //始位x = 0
    this._homeX = 0;
    //始位y = 0
    this._homeY = 0;
    //偏移量x = 0
    this._offsetX = 0;
    //偏移量y = 0
    this._offsetY = 0;
    //目标偏移x = nan
    this._targetOffsetX = NaN;
    //目标偏移y = nan
    this._targetOffsetY = NaN;
    //运动持续时间
    this._movementDuration = 0;
    //选择效果计数
    this._selectionEffectCount = 0;
};
//设置战斗者
Sprite_Battler.prototype.setBattler = function(battler) {
	//战斗者 = battler
    this._battler = battler;
};
//设置始位
Sprite_Battler.prototype.setHome = function(x, y) {
	//始位x = x
    this._homeX = x;
    //始位y = y
    this._homeY = y;
    //更新位置
    this.updatePosition();
};
//更新
Sprite_Battler.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    if (this._battler) {
        this.updateMain();
        this.updateAnimation();
        this.updateDamagePopup();
        this.updateSelectionEffect();
    } else {
        this.bitmap = null;
    }
};
//更新可见度
Sprite_Battler.prototype.updateVisibility = function() {
    Sprite_Base.prototype.updateVisibility.call(this);
    if (!this._battler || !this._battler.isSpriteVisible()) {
        this.visible = false;
    }
};
//更新主要
Sprite_Battler.prototype.updateMain = function() {
    if (this._battler.isSpriteVisible()) {
        this.updateBitmap();
        this.updateFrame();
    }
    this.updateMove();
    this.updatePosition();
};
//更新位图
Sprite_Battler.prototype.updateBitmap = function() {
};
//更新帧
Sprite_Battler.prototype.updateFrame = function() {
};
//更新移动
Sprite_Battler.prototype.updateMove = function() {
    if (this._movementDuration > 0) {
        var d = this._movementDuration;
        this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
        this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
        this._movementDuration--;
        if (this._movementDuration === 0) {
            this.onMoveEnd();
        }
    }
};
//更新位置
Sprite_Battler.prototype.updatePosition = function() {
    this.x = this._homeX + this._offsetX;
    this.y = this._homeY + this._offsetY;
};
//更新动画
Sprite_Battler.prototype.updateAnimation = function() {
    this.setupAnimation();
};
//更新伤害跃上
Sprite_Battler.prototype.updateDamagePopup = function() {
    this.setupDamagePopup();
    if (this._damages.length > 0) {
        for (var i = 0; i < this._damages.length; i++) {
            this._damages[i].update();
        }
        if (!this._damages[0].isPlaying()) {
            this.parent.removeChild(this._damages[0]);
            this._damages.shift();
        }
    }
};
//更新选择结果
Sprite_Battler.prototype.updateSelectionEffect = function() {
    var target = this._effectTarget;
    if (this._battler.isSelected()) {
        this._selectionEffectCount++;
        if (this._selectionEffectCount % 30 < 15) {
            target.setBlendColor([255, 255, 255, 64]);
        } else {
            target.setBlendColor([0, 0, 0, 0]);
        }
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target.setBlendColor([0, 0, 0, 0]);
    }
};
//安装动画
Sprite_Battler.prototype.setupAnimation = function() {
    while (this._battler.isAnimationRequested()) {
        var data = this._battler.shiftAnimation();
        var animation = $dataAnimations[data.animationId];
        var mirror = data.mirror;
        var delay = animation.position === 3 ? 0 : data.delay;
        this.startAnimation(animation, mirror, delay);
        for (var i = 0; i < this._animationSprites.length; i++) {
            var sprite = this._animationSprites[i];
            sprite.visible = this._battler.isSpriteVisible();
        }
    }
};
//安装伤害跃上
Sprite_Battler.prototype.setupDamagePopup = function() {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            var sprite = new Sprite_Damage();
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
            sprite.setup(this._battler);
            this._damages.push(sprite);
            this.parent.addChild(sprite);
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
};
//伤害偏移x
Sprite_Battler.prototype.damageOffsetX = function() {
    return 0;
};
//伤害偏移y
Sprite_Battler.prototype.damageOffsetY = function() {
    return 0;
};
//开始移动
Sprite_Battler.prototype.startMove = function(x, y, duration) {
    if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
        this._targetOffsetX = x;
        this._targetOffsetY = y;
        this._movementDuration = duration;
        if (duration === 0) {
            this._offsetX = x;
            this._offsetY = y;
        }
    }
};
//当移动结束
Sprite_Battler.prototype.onMoveEnd = function() {
};
//是效果中
Sprite_Battler.prototype.isEffecting = function() {
    return false;
};
//是移动中
Sprite_Battler.prototype.isMoving = function() {
    return this._movementDuration > 0;
};
//在初始位置
Sprite_Battler.prototype.inHomePosition = function() {
    return this._offsetX === 0 && this._offsetY === 0;
};
