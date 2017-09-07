
//-----------------------------------------------------------------------------
// Game_Picture
// 游戏图片
// The game object class for a picture.
// 图片的游戏对象类

function Game_Picture() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Picture.prototype.initialize = function() {
	//初始化基本
    this.initBasic();
    //初始化目标
    this.initTarget();
    //初始化色调
    this.initTone();
    //初始化旋转
    this.initRotation();
};
//名称
Game_Picture.prototype.name = function() {
	//返回 名称
    return this._name;
};
//原点
Game_Picture.prototype.origin = function() {
	//返回 原点
    return this._origin;
};
//x
Game_Picture.prototype.x = function() {
	//返回 x
    return this._x;
};
//y
Game_Picture.prototype.y = function() {
	//返回 y
    return this._y;
};
//比例x
Game_Picture.prototype.scaleX = function() {
	//返回 比例x
    return this._scaleX;
};
//比例y
Game_Picture.prototype.scaleY = function() {
	//返回 比例y
    return this._scaleY;
};
//不透明度
Game_Picture.prototype.opacity = function() {
	//返回 不透明度
    return this._opacity;
};
//混合方式
Game_Picture.prototype.blendMode = function() {
	//返回 混合方式
    return this._blendMode;
};
//色调
Game_Picture.prototype.tone = function() {
	//返回 色调
    return this._tone;
};
//角
Game_Picture.prototype.angle = function() {
	//返回 角
    return this._angle;
};
//初始化基本
Game_Picture.prototype.initBasic = function() {
	//名称 = ''
    this._name = '';
	//原点 = 0
    this._origin = 0;
	//x = 0 
    this._x = 0;
	//y = 0 
    this._y = 0;
	//比例x = 100
    this._scaleX = 100;
	//比例y = 100
    this._scaleY = 100;
	//不透明度 = 255
    this._opacity = 255;
	//混合方式 = 0
    this._blendMode = 0;
};
//初始化目标
Game_Picture.prototype.initTarget = function() {
	//目标x = x 
    this._targetX = this._x;
    //目标y = y
    this._targetY = this._y;
    //目标比例x = 比例x
    this._targetScaleX = this._scaleX;
    //目标比例y = 比例y
    this._targetScaleY = this._scaleY;
    //目标不透明度 = 不透明度
    this._targetOpacity = this._opacity;
    //持续时间 = 0
    this._duration = 0;
};
//初始化色调
Game_Picture.prototype.initTone = function() {
	//色调 = null
    this._tone = null;
    //色调目标 = null
    this._toneTarget = null;
    //色调持续时间 = 
    this._toneDuration = 0;
};
//初始化旋转
Game_Picture.prototype.initRotation = function() {
	//角度 = 0 
    this._angle = 0;
    //旋转速度 = 0
    this._rotationSpeed = 0;
};
//显示
Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                       scaleY, opacity, blendMode) {
	//名称 = 名称
    this._name = name;
    //原点 = 原点
    this._origin = origin;
    //x = x 
    this._x = x;
    //y = y 
    this._y = y;
    //比例x = 比例x 
    this._scaleX = scaleX;
    //比例y = 比例y
    this._scaleY = scaleY;
    //不透明度 = 不透明度
    this._opacity = opacity;
    //混合模式 = 混合模式
    this._blendMode = blendMode;
    //初始化目标
    this.initTarget();
    //初始化色调
    this.initTone();
    //初始化旋转
    this.initRotation();
};
//移动
Game_Picture.prototype.move = function(origin, x, y, scaleX, scaleY,
                                       opacity, blendMode, duration) {
    //原点 = 原点
    this._origin = origin;
    //目标x = x 
    this._targetX = x;
    //目标y = y 
    this._targetY = y;
    //目标比例x = 比例x 
    this._targetScaleX = scaleX;
    //目标比例y = 比例y
    this._targetScaleY = scaleY;
    //目标不透明度 = 不透明度
    this._targetOpacity = opacity;
    //混合模式 = 混合模式
    this._blendMode = blendMode;
    //持续时间 = 持续时间
    this._duration = duration;
};
//旋转
Game_Picture.prototype.rotate = function(speed) {
	//旋转速度 = 速度
    this._rotationSpeed = speed;
};
//着色
Game_Picture.prototype.tint = function(tone, duration) {
	//如果 不是 色调
    if (!this._tone) {
	    //色调 = [0,0,0,0]
        this._tone = [0, 0, 0, 0];
    }
    //色调目标 = 色调 克隆
    this._toneTarget = tone.clone();
    //色调持续时间 = 持续时间
    this._toneDuration = duration;
    //如果 色调持续时间 == 0 
    if (this._toneDuration === 0) {
	    //色调 = 色调目标 克隆
        this._tone = this._toneTarget.clone();
    }
};
//抹去
Game_Picture.prototype.erase = function() {
	//名称 = ''
    this._name = '';
    //原点 = 0
    this._origin = 0;
    //初始化目标
    this.initTarget();
    //初始化色调
    this.initTone();
    //初始化旋转
    this.initRotation();
};
//更新
Game_Picture.prototype.update = function() {
	//更新移动
    this.updateMove();
	//更新色调
    this.updateTone();
	//更新旋转
    this.updateRotation();
};
//更新移动
Game_Picture.prototype.updateMove = function() {
	//如果 持续时间 > 0 
    if (this._duration > 0) {
	    //d =持续时间
        var d = this._duration;
        //x = (x * (d-1) + 目标x ) / d 
        this._x = (this._x * (d - 1) + this._targetX) / d;
        //y = (y * (d-1) + 目标y ) / d 
        this._y = (this._y * (d - 1) + this._targetY) / d;
        //比例x = (比例x  * (d-1) + 目标比例x ) / d 
        this._scaleX  = (this._scaleX  * (d - 1) + this._targetScaleX)  / d;
        //比例y = (比例y * (d-1) + 目标比例y ) / d 
        this._scaleY  = (this._scaleY  * (d - 1) + this._targetScaleY)  / d;
        //不透明度 = (不透明度 * (d-1) + 目标不透明度 ) / d 
        this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
        //持续时间--
        this._duration--;
    }
};
//更新色调
Game_Picture.prototype.updateTone = function() {
	//如果 色调持续时间 > 0 
    if (this._toneDuration > 0) {
	    //d = 色调持续时间
        var d = this._toneDuration;
        //循环 开始时 i = 0 ;当 i < 4 时;每一次 i++
        for (var i = 0; i < 4; i++) {
	        //色调[i] = (  色调[i] * (d - 1) + 色调目标[i]) / d  
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
	    //色调持续时间--
        this._toneDuration--;
    }
};
//更新旋转
Game_Picture.prototype.updateRotation = function() {
	//如果 旋转速度 !== 0
    if (this._rotationSpeed !== 0) {
	    //角度 +=  旋转速度 / 2 
        this._angle += this._rotationSpeed / 2;
    }
};
