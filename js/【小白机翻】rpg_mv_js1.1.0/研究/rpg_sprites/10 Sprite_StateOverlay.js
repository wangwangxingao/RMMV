
//-----------------------------------------------------------------------------
// Sprite_StateOverlay
// 状态覆盖精灵
// The sprite for displaying an overlay image for a state.
// 显示状态覆盖图像的精灵

function Sprite_StateOverlay() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_StateOverlay.prototype = Object.create(Sprite_Base.prototype);
//设置创造者
Sprite_StateOverlay.prototype.constructor = Sprite_StateOverlay;
///初始化
Sprite_StateOverlay.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};
//初始化成员
Sprite_StateOverlay.prototype.initMembers = function() {
    this._battler = null;
    this._overlayIndex = 0;
    this._animationCount = 0;
    this._pattern = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
};
//读取位图
Sprite_StateOverlay.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem('States');
    this.setFrame(0, 0, 0, 0);
};
//安装
Sprite_StateOverlay.prototype.setup = function(battler) {
    this._battler = battler;
};
//更新
Sprite_StateOverlay.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
};
//动画等待
Sprite_StateOverlay.prototype.animationWait = function() {
    return 8;
};
//更新图案
Sprite_StateOverlay.prototype.updatePattern = function() {
    this._pattern++;
    this._pattern %= 8;
    if (this._battler) {
        this._overlayIndex = this._battler.stateOverlayIndex();
    }
};
//更新帧
Sprite_StateOverlay.prototype.updateFrame = function() {
    if (this._overlayIndex > 0) {
        var w = 96;
        var h = 96;
        var sx = this._pattern * w;
        var sy = (this._overlayIndex - 1) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};
