function Sprite_UIBase() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_UIBase.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_UIBase.prototype.constructor = Sprite_Base;
/**初始化 */
Sprite_UIBase.prototype.initialize = function () {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);
};



/**更新 */
Sprite_UIBase.prototype.update = function () {
    //精灵 更新 呼叫(this)
    Sprite.prototype.update.call(this);
};


/**隐藏 */
Sprite_UIBase.prototype.hide = function () {
    this.updateVisibility();
};


/**显示 */
Sprite_UIBase.prototype.show = function () {
    this.updateVisibility();
};


/**更新可见度 */
Sprite_UIBase.prototype.updateVisibility = function () {
    //可见度 = 不是 隐藏中
    this.visible = !this._hiding;
};


Sprite_UIBase.prototype.setMask = function (mask) {

    if (this.mask) {
        this.removeChild(this.mask)
    }
    this.mask = mask
};



Sprite_UIBase.prototype.makeMask = function (x, y, w, h) {
    var thing = new PIXI.Graphics();
    if (w !== undefined) {
        if (h !== undefined) {
            thing.clear();
            thing.beginFill(0xffffff, 0.1);
            thing.drawRect(x, y, w, h);
            thing.lineStyle(0);
        } else {
            thing.clear();
            thing.beginFill(0xffffff, 0.1);
            thing.Circle(x, y, w);
            thing.lineStyle(0);
        }
    }
    this.mask = thing
};


