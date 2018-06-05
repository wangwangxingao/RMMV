/**----------------------------------------------------------------------------- */
/** Sprite_Picture */
/** 精灵图片 */
/** The sprite for displaying a picture. */
/** 显示图片的精灵 */

function Sprite_Picture() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_Picture.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Picture.prototype.constructor = Sprite_Picture;

/**初始化 
 * @param {number} pictureId
*/
Sprite_Picture.prototype.initialize = function(pictureId) {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);
    //图片id = 图片id
    this._pictureId = pictureId;
    //图片名称 = ""
    this._pictureName = '';
    //是图片 = true   //影响效率
    this._isPicture = true;
    //更新()
    this.update();
};
/**图片 */
Sprite_Picture.prototype.picture = function() {
    //返回 游戏画面 图片(图片id)
    return $gameScreen.picture(this._pictureId);
};
/**更新 */
Sprite_Picture.prototype.update = function() {
    //精灵 更新 呼叫(this)
    Sprite.prototype.update.call(this);
    //更新位图()
    this.updateBitmap();
    //如果( 可见度)
    if (this.visible) {
        //更新原点()
        this.updateOrigin();
        //更新位置()
        this.updatePosition();
        //更新比例()
        this.updateScale();
        //更新色调()
        this.updateTone();
        //更新其他()
        this.updateOther();
    }
};
/**更新位图 */
Sprite_Picture.prototype.updateBitmap = function() {
    //图片 = 图片()
    var picture = this.picture();
    //如果(图片)
    if (picture) {
        //图片名称 = 图片 名称()
        var pictureName = picture.name();
        //如果(图片名称 != 图片名称)
        if (this._pictureName !== pictureName) {
            //图片名称 = 图片名称
            this._pictureName = pictureName;
            //读取位图()
            this.loadBitmap();
        }
        //可见度 = true 
        this.visible = true;
    //否则
    } else {
        //图片名称 = ""
        this._pictureName = '';
        //位图 = null
        this.bitmap = null;
        //可见度 = false
        this.visible = false;
    }
};
/**更新原点 */
Sprite_Picture.prototype.updateOrigin = function() {
    //图片 = 图片()
    var picture = this.picture();
    //如果(图片 原点 === 0 )
    if (picture.origin() === 0) {
        //锚点 x  = 0
        this.anchor.x = 0;
        //锚点 y  = 0
        this.anchor.y = 0;
    //否则
    } else {
        //锚点 x  = 0.5
        this.anchor.x = 0.5;
        //锚点 y  = 0.5
        this.anchor.y = 0.5;
    }
};
/**更新位置 */
Sprite_Picture.prototype.updatePosition = function() {
    //图片 = 图片()
    var picture = this.picture();
    //x = 向下取整( 图片 x() )
    this.x = Math.floor(picture.x());
    //y =  向下取整( 图片 y() )
    this.y = Math.floor(picture.y());
};
/**更新比例 */
Sprite_Picture.prototype.updateScale = function() {
    //图片 = 图片()
    var picture = this.picture();
    //比例 x = 图片 比例x() / 100
    this.scale.x = picture.scaleX() / 100;
    //比例 y = 图片 比例y() / 100
    this.scale.y = picture.scaleY() / 100;
};
/**更新色调 */
Sprite_Picture.prototype.updateTone = function() {
    //图片 = 图片()
    var picture = this.picture();
    //如果(图片 色调())
    if (picture.tone()) {
        //设置颜色色调( 图片 色调())
        this.setColorTone(picture.tone());
    //否则
    } else {
        //设置颜色色调([0,0,0,0])
        this.setColorTone([0, 0, 0, 0]);
    }
};
/**更新其他 */
Sprite_Picture.prototype.updateOther = function() {
    //图片 = 图片()
    var picture = this.picture();
    //不透明度 = 图片 不透明度()
    this.opacity = picture.opacity();
    //合成模式 = 图片 合成模式()
    this.blendMode = picture.blendMode();
    //旋转 = 图片 角度 * pi /100
    this.rotation = picture.angle() * Math.PI / 180;
};
/**读取位图 */
Sprite_Picture.prototype.loadBitmap = function() {
    //位图 = 图像管理器 读取图片(图片名称)
    this.bitmap = ImageManager.loadPicture(this._pictureName);
};