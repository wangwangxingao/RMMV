//=============================================================================
// PictureRotateTo.js
//=============================================================================
/*:
 * @plugindesc 
 * PictureRotateTo,图片旋转加强,
 * $gameScreen.rotatePictureTo(图片id, 角度, 持续时间);
 * @author wangwang
 *
 *
 * @help
 * 
 * 设置旋转到
 * $gameScreen.rotatePictureTo(pictureId, rotation, duration);
 * pictureId: 图片id
 * rotation: 目标角度
 * duration: 持续时间, 为0时为立刻
 *
 * 
 * 设置图片原点(在显示或移动图片后使用)
 * $gameScreen.setPictureOrigin(pictureId, origin) 
 * pictureId: 图片id
 * origin: 目标原点 
 * 取值 :当数字时,  
 * 为数字对应的点  [[0, 0], [0.5, 0.5], [1, 1], [0, 0.5],[1, 0.5],[0.5, 0], [0.5, 1],[1, 0], [0, 1]]
 * 当为数组时, 为[number,number] 数组
 * 当为对象时,为 {x:number,y:number} 对象
 *  
 * 
 */







/**初始化旋转*/
Game_Picture.prototype.initRotation = function() {
    this._angle = 0;
    this._rotationSpeed = 0;
    this._rotationTarget = 0;
    this._rotationDuration = 0
};


/**
 * 更新旋转
 */
Game_Picture.prototype.updateRotation = function() {
    if (this._rotationSpeed !== 0) {
        this._angle += this._rotationSpeed / 2;
    }
    if (this._rotationDuration > 0) {
        var d = this._rotationDuration;
        this._angle = (this._angle * (d - 1) + this._rotationTarget) / d;
        this._rotationDuration--;
    }
};


/**
 * 旋转到
 * @param {number} rotation 角度 
 * @param {number} duration 持续时间 ,0时为立刻
 * 
 */
Game_Picture.prototype.rotateTo = function(rotation, duration) {
    this._rotationTarget = rotation || 0;
    this._rotationDuration = duration || 0;
    if (this._rotationDuration === 0) {
        this._angle = this._rotationTarget
    }
};

/**
 * 旋转图片到
 * 
 * @param {number} pictureId 图片id
 * @param {number} rotation 角度 
 * @param {number} duration 持续时间 ,0时为立刻
 * 
 */

Game_Screen.prototype.rotatePictureTo = function(pictureId, rotation, duration) {
    //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 旋转(速度)
        picture.rotateTo(rotation, duration);
    }
};


/**
 * 设置原点
 * @param {number|[number,number]|{x:number,y:number}}origin 原点
 * 
 */
Game_Picture.prototype.setOrigin = function(origin) {
    this._origin = origin || 0
};


/**
 * 设置图片
 * 
 * @param {number} pictureId 图片id
 * @param {number|[number,number]|{x:number,y:number}}origin 原点
 * 
 */
Game_Screen.prototype.setPictureOrigin = function(pictureId, origin) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setOrigin(origin);
    }
};

/**更新原点 */
Sprite_Picture.prototype.updateOrigin = function() {
    var picture = this.picture();
    var origin = picture.origin()
    var t = typeof(origin)
    if (t == "object") {} else if (t == "number") {
        var list = [
            [0, 0],
            [0.5, 0.5],
            [1, 1],
            [0, 0.5],
            [1, 0.5],
            [0.5, 0],
            [0.5, 1],
            [1, 0],
            [0, 1]
        ]
        var origin = list[origin] || [0, 0]
    } else {
        var origin = [0, 0]
    }
    this.anchor.x = origin.x || origin[0] || 0;
    this.anchor.y = origin.y || origin[1] || 0;
};