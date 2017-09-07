
//-----------------------------------------------------------------------------
// Sprite_Enemy
// 敌人精灵
// The sprite for displaying an enemy.
// 显示一个敌人的精灵

function Sprite_Enemy() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_Enemy.prototype = Object.create(Sprite_Battler.prototype);
//设置创造者
Sprite_Enemy.prototype.constructor = Sprite_Enemy;
//初始化
Sprite_Enemy.prototype.initialize = function(battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
};
//初始化成员
Sprite_Enemy.prototype.initMembers = function() {
    Sprite_Battler.prototype.initMembers.call(this);
    this._enemy = null;
    this._appeared = false;
    this._battlerName = '';
    this._battlerHue = 0;
    this._effectType = null;
    this._effectDuration = 0;
    this._shake = 0;
    this.createStateIconSprite();
};
//创建状态图标精灵
Sprite_Enemy.prototype.createStateIconSprite = function() {
    this._stateIconSprite = new Sprite_StateIcon();
    this.addChild(this._stateIconSprite);
};
//设置战斗者
Sprite_Enemy.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    this._enemy = battler;
    this.setHome(battler.screenX(), battler.screenY());
    this._stateIconSprite.setup(battler);
};
//更新
Sprite_Enemy.prototype.update = function() {
    Sprite_Battler.prototype.update.call(this);
    if (this._enemy) {
        this.updateEffect();
        this.updateStateSprite();
    }
};
//更新位图
Sprite_Enemy.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._enemy.battlerName();
    var hue = this._enemy.battlerHue();
    if (this._battlerName !== name || this._battlerHue !== hue) {
        this._battlerName = name;
        this._battlerHue = hue;
        this.loadBitmap(name, hue);
        this.initVisibility();
    }
};
//读取位图
Sprite_Enemy.prototype.loadBitmap = function(name, hue) {
    if ($gameSystem.isSideView()) {
        this.bitmap = ImageManager.loadSvEnemy(name, hue);
    } else {
        this.bitmap = ImageManager.loadEnemy(name, hue);
    }
};
//更新帧
Sprite_Enemy.prototype.updateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    var frameHeight = this.bitmap.height;
    if (this._effectType === 'bossCollapse') {
        frameHeight = this._effectDuration;
    }
    this.setFrame(0, 0, this.bitmap.width, frameHeight);
};
//更新位置
Sprite_Enemy.prototype.updatePosition = function() {
    Sprite_Battler.prototype.updatePosition.call(this);
    this.x += this._shake;
};
//更新状态精灵
Sprite_Enemy.prototype.updateStateSprite = function() {
    this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
    if (this._stateIconSprite.y < 20 - this.y) {
        this._stateIconSprite.y = 20 - this.y;
    }
};
//初始化可见度
Sprite_Enemy.prototype.initVisibility = function() {
    this._appeared = this._enemy.isAlive();
    if (!this._appeared) {
        this.opacity = 0;
    }
};
//设置效果
Sprite_Enemy.prototype.setupEffect = function() {
    if (this._appeared && this._enemy.isEffectRequested()) {
        this.startEffect(this._enemy.effectType());
        this._enemy.clearEffect();
    }
    if (!this._appeared && this._enemy.isAlive()) {
        this.startEffect('appear');
    } else if (this._appeared && this._enemy.isHidden()) {
        this.startEffect('disappear');
    }
};
//开始效果
Sprite_Enemy.prototype.startEffect = function(effectType) {
    this._effectType = effectType;
    switch (this._effectType) {
    case 'appear':
        this.startAppear();
        break;
    case 'disappear':
        this.startDisappear();
        break;
    case 'whiten':
        this.startWhiten();
        break;
    case 'blink':
        this.startBlink();
        break;
    case 'collapse':
        this.startCollapse();
        break;
    case 'bossCollapse':
        this.startBossCollapse();
        break;
    case 'instantCollapse':
        this.startInstantCollapse();
        break;
    }
    this.revertToNormal();
};
//开始出现
Sprite_Enemy.prototype.startAppear = function() {
    this._effectDuration = 16;
    this._appeared = true;
};
//开始消失
Sprite_Enemy.prototype.startDisappear = function() {
    this._effectDuration = 32;
    this._appeared = false;
};
//开始变白
Sprite_Enemy.prototype.startWhiten = function() {
    this._effectDuration = 16;
};
//开始闪烁
Sprite_Enemy.prototype.startBlink = function() {
    this._effectDuration = 20;
};
//开始死亡
Sprite_Enemy.prototype.startCollapse = function() {
    this._effectDuration = 32;
    this._appeared = false;
};
//开始boss死亡
Sprite_Enemy.prototype.startBossCollapse = function() {
    this._effectDuration = this.bitmap.height;
    this._appeared = false;
};
//开始立即死亡
Sprite_Enemy.prototype.startInstantCollapse = function() {
    this._effectDuration = 16;
    this._appeared = false;
};
//更新效果
Sprite_Enemy.prototype.updateEffect = function() {
    this.setupEffect();
    if (this._effectDuration > 0) {
        this._effectDuration--;
        switch (this._effectType) {
        case 'whiten':
            this.updateWhiten();
            break;
        case 'blink':
            this.updateBlink();
            break;
        case 'appear':
            this.updateAppear();
            break;
        case 'disappear':
            this.updateDisappear();
            break;
        case 'collapse':
            this.updateCollapse();
            break;
        case 'bossCollapse':
            this.updateBossCollapse();
            break;
        case 'instantCollapse':
            this.updateInstantCollapse();
            break;
        }
        if (this._effectDuration === 0) {
            this._effectType = null;
        }
    }
};
//是效果中
Sprite_Enemy.prototype.isEffecting = function() {
    return this._effectType !== null;
};
//恢复到正常
Sprite_Enemy.prototype.revertToNormal = function() {
    this._shake = 0;
    this.blendMode = 0;
    this.opacity = 255;
    this.setBlendColor([0, 0, 0, 0]);
};
//更新变白
Sprite_Enemy.prototype.updateWhiten = function() {
    var alpha = 128 - (16 - this._effectDuration) * 10;
    this.setBlendColor([255, 255, 255, alpha]);
};
//更新闪烁
Sprite_Enemy.prototype.updateBlink = function() {
    this.opacity = (this._effectDuration % 10 < 5) ? 255 : 0;
};
//更新出现
Sprite_Enemy.prototype.updateAppear = function() {
    this.opacity = (16 - this._effectDuration) * 16;
};
//更新消失
Sprite_Enemy.prototype.updateDisappear = function() {
    this.opacity = 256 - (32 - this._effectDuration) * 10;
};
//更新死亡
Sprite_Enemy.prototype.updateCollapse = function() {
    this.blendMode = Graphics.BLEND_ADD;
    this.setBlendColor([255, 128, 128, 128]);
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
};
//更新boss死亡
Sprite_Enemy.prototype.updateBossCollapse = function() {
    this._shake = this._effectDuration % 2 * 4 - 2;
    this.blendMode = Graphics.BLEND_ADD;
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
    this.setBlendColor([255, 255, 255, 255 - this.opacity]);
    if (this._effectDuration % 20 === 19) {
        SoundManager.playBossCollapse2();
    }
};
//更新迅速死亡
Sprite_Enemy.prototype.updateInstantCollapse = function() {
    this.opacity = 0;
};
//伤害偏移x
Sprite_Enemy.prototype.damageOffsetX = function() {
    return 0;
};
//伤害偏移y
Sprite_Enemy.prototype.damageOffsetY = function() {
    return -8;
};
