/**-----------------------------------------------------------------------------   
 * Sprite_Base   
 * 精灵基础   
 * The sprite class with a feature which displays animations.   
 * 显示一个动画特征的精灵类 */

function Sprite_Base() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_Base.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Base.prototype.constructor = Sprite_Base;
/**初始化 */
Sprite_Base.prototype.initialize = function() {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);
    //动画精灵组 = []
    this._animationSprites = [];
    //效果目标 = this
    this._effectTarget = this;
    //隐藏中 = false
    this._hiding = false;
};
/**更新 */
Sprite_Base.prototype.update = function() {
    //精灵 更新 呼叫(this)
    Sprite.prototype.update.call(this);
    //更新可见度()
    this.updateVisibility();
    //更新动画精灵组()
    this.updateAnimationSprites();
};
/**隐藏 */
Sprite_Base.prototype.hide = function() {
    //隐藏中 = true
    this._hiding = true;
    //更新动画精灵组()
    this.updateVisibility();
};
/**显示 */
Sprite_Base.prototype.show = function() {
    //隐藏中 = false
    this._hiding = false;
    //更新动画精灵组()
    this.updateVisibility();
};
/**更新可见度 */
Sprite_Base.prototype.updateVisibility = function() {
    //可见度 = 不是 隐藏中
    this.visible = !this._hiding;
};
/**更新动画精灵组 */
Sprite_Base.prototype.updateAnimationSprites = function() {
    //如果(动画精灵组 长度>0)
    if (this._animationSprites.length > 0) {
        //精灵组 = 动画精灵组 克隆()
        var sprites = this._animationSprites.clone();
        //动画精灵组 = []
        this._animationSprites = [];
        //循环 (i =0 ; i 小于 精灵组 长度; 每一次 i++)
        for (var i = 0; i < sprites.length; i++) {
            //精灵 = 精灵组[i]
            var sprite = sprites[i];
            //如果(精灵 是播放中())
            if (sprite.isPlaying()) {
                //动画精灵组 添加(精灵)
                this._animationSprites.push(sprite);
                //否则
            } else {
                //精灵 移除()
                sprite.remove();
            }
        }
    }
};
/**开始动画
 * @param {animation} animation 动画
 * @param {boolean} mirror 镜像
 * @param {number} delay  延迟时间
 * 
 */
Sprite_Base.prototype.startAnimation = function(animation, mirror, delay) {
    //精灵 = 新 精灵动画()
    var sprite = new Sprite_Animation();
    //精灵 安装(效果 ,动画, 镜像, 延迟)
    sprite.setup(this._effectTarget, animation, mirror, delay);
    //父类 添加子项(精灵) 
    this.parent.addChild(sprite);
    //动画精灵组 添加(精灵)
    this._animationSprites.push(sprite);
};
/**是动画播放中
 * @return {boolean}
 */
Sprite_Base.prototype.isAnimationPlaying = function() {
    //返回 动画精灵组 长度>0
    return this._animationSprites.length > 0;
};