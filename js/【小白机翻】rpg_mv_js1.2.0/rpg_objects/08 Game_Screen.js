
//-----------------------------------------------------------------------------
// Game_Screen
// 游戏画面   $gameScreen
// The game object class for screen effect data, such as changes in color tone
// and flashes.
// 像色彩和闪烁 等改变的画面效果数据的游戏对象类

function Game_Screen() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Screen.prototype.initialize = function() {
	//清除
    this.clear();
};
//清除
Game_Screen.prototype.clear = function() {
	//清除淡入淡出
    this.clearFade();
	//清除色调
    this.clearTone();
	//清除闪烁
    this.clearFlash();
	//清除震动
    this.clearShake();
	//清除缩放
    this.clearZoom();
	//清除天气
    this.clearWeather();
	//清除图片
    this.clearPictures();
};
//当战斗开始
Game_Screen.prototype.onBattleStart = function() {
	//清除淡入淡出
    this.clearFade();
	//清除闪烁
    this.clearFlash();
	//清除震动
    this.clearShake();
	//清除缩放
    this.clearZoom();
	//抹去战斗图片
    this.eraseBattlePictures();
};
//明亮
Game_Screen.prototype.brightness = function() {
	//返回 明亮
    return this._brightness;
};
//色调
Game_Screen.prototype.tone = function() {
	//返回 色调
    return this._tone;
};
//闪烁颜色
Game_Screen.prototype.flashColor = function() {
	//返回 闪烁颜色
    return this._flashColor;
};
//震动
Game_Screen.prototype.shake = function() {
	//返回 震动
    return this._shake;
};
//缩放x
Game_Screen.prototype.zoomX = function() {
	//返回 缩放x
    return this._zoomX;
};
//缩放y
Game_Screen.prototype.zoomY = function() {
	//返回 缩放y
    return this._zoomY;
};
//缩放比例
Game_Screen.prototype.zoomScale = function() {
	//返回 缩放比例
    return this._zoomScale;
};
//天气种类
Game_Screen.prototype.weatherType = function() {
	//返回 天气种类
    return this._weatherType;
};
//天气强度
Game_Screen.prototype.weatherPower = function() {
	//返回 天气强度
    return this._weatherPower;
};
//图片
Game_Screen.prototype.picture = function(pictureId) {
    //真实图片id = 真实图片id(pictureId图片id)
    var realPictureId = this.realPictureId(pictureId);
    //返回 图片组[真实图片id]
    return this._pictures[realPictureId];
};
//真实图片id
Game_Screen.prototype.realPictureId = function(pictureId) {
	//如果 游戏队伍 在战斗
    if ($gameParty.inBattle()) {
	    //返回 图片id + 最大图片数
        return pictureId + this.maxPictures();
    //否则 
    } else {
	    //返回 图片id 
        return pictureId;
    }
};
//清除淡入淡出
Game_Screen.prototype.clearFade = function() {
	//明亮 = 255
    this._brightness = 255;
    //淡出持续时间 = 0
    this._fadeOutDuration = 0;
    //淡入持续时间 = 0
    this._fadeInDuration = 0;
};
//清除色调
Game_Screen.prototype.clearTone = function() {
	//色调 = [0,0,0,0]
    this._tone = [0, 0, 0, 0];
    //色调目标 = [0,0,0,0]
    this._toneTarget = [0, 0, 0, 0];
    //色调持续时间 = 0
    this._toneDuration = 0;
};
//清除闪烁
Game_Screen.prototype.clearFlash = function() {
	//闪烁颜色 = [0,0,0,0]
    this._flashColor = [0, 0, 0, 0];
    //闪烁持续时间 = 0
    this._flashDuration = 0;
};
//清除震动
Game_Screen.prototype.clearShake = function() {
	//震动强度 = 0
    this._shakePower = 0;
    //震动速度 = 0
    this._shakeSpeed = 0;
    //震动持续时间 = 0
    this._shakeDuration = 0;
    //震动方向 = 1
    this._shakeDirection = 1;
    //震动 = 0
    this._shake = 0;
};
//清除缩放
Game_Screen.prototype.clearZoom = function() {
	//缩放x = 0
    this._zoomX = 0;
	//缩放y = 0
    this._zoomY = 0;
	//缩放比例 = 1
    this._zoomScale = 1;
	//缩放比例目标 = 1
    this._zoomScaleTarget = 1;
	//缩放持续时间 = 0
    this._zoomDuration = 0;
};
//清除天气
Game_Screen.prototype.clearWeather = function() {
	//天气种类 = "none"
    this._weatherType = 'none';
    //天气强度 = 0
    this._weatherPower = 0;
    //天气强度目标 = 0
    this._weatherPowerTarget = 0;
    //天气持续时间 = 0
    this._weatherDuration = 0;
};
//清除图片组
Game_Screen.prototype.clearPictures = function() {
	//图片组 = []
    this._pictures = [];
};
//抹去战斗图片
Game_Screen.prototype.eraseBattlePictures = function() {
	//图片组 = 图片组 切割 (0,最大图片数 + 1)
    this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
};
//最大图片数
Game_Screen.prototype.maxPictures = function() {
	//返回 100
    return 100;
};
//开始淡出
Game_Screen.prototype.startFadeOut = function(duration) {
	//淡出持续时间 = 持续时间
    this._fadeOutDuration = duration;
    //淡入持续时间 = 0
    this._fadeInDuration = 0;
};
//开始淡入
Game_Screen.prototype.startFadeIn = function(duration) {
    //淡入持续时间 = 持续时间
    this._fadeInDuration = duration;
	//淡出持续时间 = 0
    this._fadeOutDuration = 0;
};
//开始着色
Game_Screen.prototype.startTint = function(tone, duration) {
	//色调目标 = 色调 克隆
    this._toneTarget = tone.clone();
    //色调持续时间 = 持续时间
    this._toneDuration = duration;
    //如果 色调持续时间 === 0 
    if (this._toneDuration === 0) {
	    //色调 = 色调目标 克隆
        this._tone = this._toneTarget.clone();
    }
};
//开始闪烁
Game_Screen.prototype.startFlash = function(color, duration) {
	//闪烁颜色 = 颜色 克隆
    this._flashColor = color.clone();
    //闪烁持续时间 = 持续时间
    this._flashDuration = duration;
};
//开始震动
Game_Screen.prototype.startShake = function(power, speed, duration) {
	//震动强度 = 强度
    this._shakePower = power;
    //震动速度 = 速度
    this._shakeSpeed = speed;
    //震动持续时间 = 持续时间
    this._shakeDuration = duration;
};
//开始缩放
Game_Screen.prototype.startZoom = function(x, y, scale, duration) {
	//缩放x = x
    this._zoomX = x;
    //缩放y = y
    this._zoomY = y;
    //缩放比例目标 = 比例
    this._zoomScaleTarget = scale;
    //缩放持续时间 = 持续时间
    this._zoomDuration = duration;
};
//设置缩放
Game_Screen.prototype.setZoom = function(x, y, scale) {
	//缩放x = x
    this._zoomX = x;
    //缩放y = y
    this._zoomY = y;
    //缩放比例 = 比例
    this._zoomScale = scale;
};
//改变天气
Game_Screen.prototype.changeWeather = function(type, power, duration) {
	//如果 (种类 !== 'none' 或者 持续时间 === 0 )
    if (type !== 'none' || duration === 0) {
	    //天气种类 = 种类
        this._weatherType = type;
    }
    //天气强度目标 =  如果 种类 === 'none' 返回 0 否则 返回 强度
    this._weatherPowerTarget = type === 'none' ? 0 : power;
    //天气持续时间 = 持续时间
    this._weatherDuration = duration;
    //如果 持续时间 === 0 
    if (duration === 0) {
	    //天气强度 = 天气强度目标
        this._weatherPower = this._weatherPowerTarget;
    }
};
//更新
Game_Screen.prototype.update = function() {
    //更新淡出
    this.updateFadeOut();
    //更新淡入
    this.updateFadeIn();
    //更新色调
    this.updateTone();
    //更新闪烁
    this.updateFlash();
    //更新震动
    this.updateShake();
    //更新缩放
    this.updateZoom();
    //更新天气
    this.updateWeather();
    //更新图片
    this.updatePictures();
};
//更新淡出
Game_Screen.prototype.updateFadeOut = function() {
	//如果 淡出持续时间 > 0
    if (this._fadeOutDuration > 0) {
	    //d = 淡出持续时间
        var d = this._fadeOutDuration;
        //明亮 = 明亮  * (d-1) / d    
        this._brightness = (this._brightness * (d - 1)) / d;
        //淡出持续时间--
        this._fadeOutDuration--;
    }
};
//更新淡入
Game_Screen.prototype.updateFadeIn = function() {
	//如果 淡出持续时间 > 0
    if (this._fadeInDuration > 0) {
	    //d = 淡出持续时间
        var d = this._fadeInDuration;
        //明亮 =( 明亮  * (d-1) + 255) / d  
        this._brightness = (this._brightness * (d - 1) + 255) / d;
        //淡出持续时间--
        this._fadeInDuration--;
    }
};
//更新色调
Game_Screen.prototype.updateTone = function() {
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
//更新闪烁
Game_Screen.prototype.updateFlash = function() {
	//如果 闪烁持续时间 > 0 
    if (this._flashDuration > 0) {
	    //d = 闪烁持续时间
        var d = this._flashDuration;
        //闪烁颜色[3] *= (d-1) / d 
        this._flashColor[3] *= (d - 1) / d;
        //闪烁持续时间--
        this._flashDuration--;
    }
};
//更新震动
Game_Screen.prototype.updateShake = function() {
	//如果 震动持续时间 > 0 或者 震动!== 0
    if (this._shakeDuration > 0 || this._shake !== 0) {
	    //delta = (震动强度 * 震动速度 * 震动持续时间 ) / 10
        var delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
        //如果 震动持续时间 <= 1 并且 震动 * (震动 + delta) < 0 
        if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
	        //震动 = 0
            this._shake = 0;
        //否则
        } else {
	        //震动 += delta
            this._shake += delta;
        }
        //如果 震动 > 震动强度 * 2 
        if (this._shake > this._shakePower * 2) {
	        //震动方向 = - 1 
            this._shakeDirection = -1;
        }
        //如果 震动 < - 震动强度 * 2 
        if (this._shake < - this._shakePower * 2) {
	        //震动方向 =  1 
            this._shakeDirection = 1;
        }
        //震动持续时间--
        this._shakeDuration--;
    }
};
//更新缩放
Game_Screen.prototype.updateZoom = function() {
	//缩放持续时间 > 0 
    if (this._zoomDuration > 0) {
	    //d = 缩放持续时间
        var d = this._zoomDuration;
        //t = 缩放比例目标
        var t = this._zoomScaleTarget;
        //缩放比例 = (缩放比例 * (d-1) + t ) / d
        this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
        //缩放持续时间--
        this._zoomDuration--;
    }
};
//更新天气
Game_Screen.prototype.updateWeather = function() {
	//如果 天气持续时间 > 0
    if (this._weatherDuration > 0) {
	    //d = 天气持续时间 
        var d = this._weatherDuration;
        //t = 天气强度目标
        var t = this._weatherPowerTarget;
        //天气强度 = (天气强度 * (d-1) + t ) / d
        this._weatherPower = (this._weatherPower * (d - 1) + t) / d;
        //天气持续时间--
        this._weatherDuration--;
        //如果 天气持续时间 ==0 并且 天气强度目标 ==0 
        if (this._weatherDuration === 0 && this._weatherPowerTarget === 0) {
	        //天气种类 = 'none'
            this._weatherType = 'none';
        }
    }
};
//更新图片
Game_Screen.prototype.updatePictures = function() {
	//图片组 对每一个 (方法 图片)
    this._pictures.forEach(function(picture) {
	    //如果 图片 
        if (picture) {
	        //图片 更新
            picture.update();
        }
    });
};
//开始闪烁为了伤害
Game_Screen.prototype.startFlashForDamage = function() {
	//开始闪烁([255,0,0,128],8)
    this.startFlash([255, 0, 0, 128], 8);
};
//显示图片
Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y,
                                             scaleX, scaleY, opacity, blendMode) {
	//真实图片id = 真实图片id(图片id)
    var realPictureId = this.realPictureId(pictureId);
    //图片 = 新 游戏图片
    var picture = new Game_Picture();
    //图片 显示(名称,原点,x,y,比例x,比例y,不透明度,混合方式)
    picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    //图片组[真实图片id] = 图片
    this._pictures[realPictureId] = picture;
};
//移动图片
Game_Screen.prototype.movePicture = function(pictureId, origin, x, y, scaleX,
                                             scaleY, opacity, blendMode, duration) {
	//图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
	    //图片 移动  (原点,x,y,比例x,比例y,不透明度,混合方式,持续时间)
        picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
    }
};
//旋转图片
Game_Screen.prototype.rotatePicture = function(pictureId, speed) {
	//图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
	    //图片 旋转(速度)
        picture.rotate(speed);
    }
};
//着色图片
Game_Screen.prototype.tintPicture = function(pictureId, tone, duration) {
	//图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
	    //图片 着色 (色调 ,持续时间)
        picture.tint(tone, duration);
    }
};
//抹去图片
Game_Screen.prototype.erasePicture = function(pictureId) {
	//真实图片id = 真实图片id(图片id)
    var realPictureId = this.realPictureId(pictureId);
    //图片组[真实图片id] = null
    this._pictures[realPictureId] = null;
};
