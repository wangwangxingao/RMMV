//=============================================================================
//  pictureAnim.js
//=============================================================================

/*:
 * @plugindesc  
 * pictureAnim , 显示有动画图片
 * @author wangwang
 *   
 * @param  pictureAnim
 * @desc 插件 显示有动画图片 
 * @default
 * 
 * 
 * 
 * @help
 * 
 * 图片名 为 
 * a/name,aid,times,xd,yd,wd,hd,rates
 * 
 * name为图片名,
 * aid 为动画id
 * times为运行次数,默认为0(永远播放),  
 * xd x的偏移值
 * yd y的偏移值 
 * wd 相对于图片宽的偏移值(如果为0.5则为图片中间)
 * hd 相对于图片高的偏移值(如果为0.5则为图片中间)
 * rates 为速度,默认为4(4帧播放动画一帧)
 * 
 * 以上为 动画的位置为中心时的情况
 * 头部时自动上偏半个图片高
 * 底部时自动下偏半个图片高
 * 
 * 
 * 举例 
 * 
 * $gameScreen.showPicture(1,"a/Actor1_3,5,0,0,0,0.5,0.5",0,100,0,100,100,255,0)
 * 
 */




var ww = ww || {}
ww.pictureAnim = ww.pictureAnim || {}


ww.pictureAnim._Sprite_Picture_prototype_loadBitmap = Sprite_Picture.prototype.loadBitmap


Sprite_Picture.prototype.removeAddAnim = function () {
    if (this._window) {
        if (this._window.constructor == Sprite_PictureAnimation) {
            this._window.remove()
            delete this._window
        }
    }
}
Sprite_Picture.prototype.removeAddWindow = function () {
    if (this._window) {
        this.removeChild(this._window)
        delete this._window
    }
}


Sprite_Picture.prototype.loadBitmap = function () {
    this.removeAddAnim()
    this.removeAddWindow()
    if (this._pictureName && this._pictureName.indexOf("a/") == 0) {
        var value = this._pictureName.slice(2)
        var arr = value.split(",")
        this.bitmap = ImageManager.loadPicture(arr[0])
        arr[1] = (arr[1] || 0) * 1
        arr[2] = (arr[2] || 0) * 1
        arr[3] = (arr[3] || 0) * 1
        arr[4] = (arr[4] || 0) * 1
        arr[5] = (arr[5] || 0) * 1
        arr[6] = (arr[6] || 0) * 1
        arr[7] = (arr[7] || 0) * 1
        var s = new Sprite_PictureAnimation()
        s.setup(this, arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7])
        if (s) {
            this._window = s
            this.addChild(this._window)
        }
    } else {
        ww.pictureAnim._Sprite_Picture_prototype_loadBitmap.call(this)
    }
}
 


 

function Sprite_PictureAnimation() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_PictureAnimation.prototype = Object.create(Sprite_Animation.prototype);
/**设置创造者 */
Sprite_PictureAnimation.prototype.constructor = Sprite_PictureAnimation;

Sprite_PictureAnimation.prototype.setup = function (target, animation, times, xd, yd, wd, hd, rate) {
    this._target = target;
    this._animation = $dataAnimations[animation];
    this._mirror = false;
    this._delay = 0;
    this._times = times || 0

    this._xd = xd || 0
    this._yd = yd || 0

    this._wd = wd || 0
    this._hd = hd || 0

    if (this._animation) {
        this.remove();
        this.setRate(rate)
        this.setupDuration();
        this.loadBitmaps();
        this.createSprites();
    }
};

Sprite_PictureAnimation.prototype.remove = function () {
    //如果( 父类 并且 父类 移除子(this) )
    if (this.parent && this.parent.removeChild(this)) {
        //目标 设置混合色([0,0,0,0])
        this._target.setBlendColor([0, 0, 0, 0]);
        //目标 显示()
        //this._target.show();
    }
};

Sprite_PictureAnimation.prototype.updateHiding = function () {
    //如果(隐藏持续时间 > 0)
    if (this._hidingDuration > 0) {
        //隐藏持续时间--
        this._hidingDuration--;
        //如果(隐藏持续时间 === 0 )
        if (this._hidingDuration === 0) {
            //目标 显示()
            //this._target.show();
        }
    }
};

Sprite_PictureAnimation.prototype.startHiding = function (duration) {
    //隐藏持续时间 = 持续时间
    this._hidingDuration = duration;
    //目标 隐藏()
    //this._target.hide();
};

Sprite_PictureAnimation.prototype.setRate = function (d) {
    this._rate = d || 4;
};

Sprite_PictureAnimation.prototype.setTimes = function (d) {
    this._times = d || 0;
};
Sprite_PictureAnimation.prototype.updateMain = function () {
    //如果(是播放中() 并且 是准备好() )
    if (this.isPlaying() && this.isReady()) {
        //如果(延迟 > 0)
        if (this._delay > 0) {
            //延迟--
            this._delay--;
            //否则 
        } else {
            //持续时间--
            this._duration--;
            //更新位置()
            this.updatePosition();
            //如果(持续时间 % 速度 === 0 )
            if (this._duration % this._rate === 0) {
                //更新帧()
                this.updateFrame();
            }
        }
        if (!this.isPlaying() && (--this._times)) {
            this.setupDuration()
        } 
    }
};


Sprite_PictureAnimation.prototype.updatePosition = function () {
    /** 画面 */
    //如果( 动画 位置 == 3//画面 ) 
    if (this._animation.position === 3) {
        this.x = 0
        this.y = 0
        //this.x = this.parent.width / 2;
        //this.y = this.parent.height / 2;
    } else {
        var w = this._target.width
        var h = this._target.height
        this.x = this._xd + w * this._wd;
        this.y = this._yd + h * this._hd;
        /** 头部 */
        //如果 动画( 位置 == 0 //头部 ) 
        if (this._animation.position === 0) {
            //y -= 目标 高
            this.y -= h * 0.5;
            /** 中央 */
            //否则 如果( 动画位置 == 1//中央 )
        } else if (this._animation.position === 1) {
            //y -= 目标 高 / 2
            //this.y += h * 0.5;
        } else {
            this.y += h * 0.5;
            //this.y += h;

        }
    }
};