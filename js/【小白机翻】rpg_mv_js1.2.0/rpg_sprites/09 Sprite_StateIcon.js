
//-----------------------------------------------------------------------------
// Sprite_StateIcon
// 状态图标精灵
// The sprite for displaying state icons.
// 显示状态图标的精灵

function Sprite_StateIcon() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_StateIcon.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_StateIcon.prototype.constructor = Sprite_StateIcon;
//初始化
Sprite_StateIcon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};

Sprite_StateIcon._iconWidth  = 32;
Sprite_StateIcon._iconHeight = 32;
//初始化成员
Sprite_StateIcon.prototype.initMembers = function() {
    this._battler = null;
    this._iconIndex = 0;
    this._animationCount = 0;
    this._animationIndex = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};
//读取
Sprite_StateIcon.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem('IconSet');
    this.setFrame(0, 0, 0, 0);
};
//安装
Sprite_StateIcon.prototype.setup = function(battler) {
    this._battler = battler;
};
//更新
Sprite_StateIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updateIcon();
        this.updateFrame();
        this._animationCount = 0;
    }
};
//动画等待
Sprite_StateIcon.prototype.animationWait = function() {
    return 40;
};
//更新图标
Sprite_StateIcon.prototype.updateIcon = function() {
    var icons = [];
    if (this._battler && this._battler.isAlive()) {
        icons = this._battler.allIcons();
    }
    if (icons.length > 0) {
        this._animationIndex++;
        if (this._animationIndex >= icons.length) {
            this._animationIndex = 0;
        }
        this._iconIndex = icons[this._animationIndex];
    } else {
        this._animationIndex = 0;
        this._iconIndex = 0;
    }
};
//更新帧
Sprite_StateIcon.prototype.updateFrame = function() {
    var pw = Sprite_StateIcon._iconWidth;
    var ph = Sprite_StateIcon._iconHeight;
    var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};
