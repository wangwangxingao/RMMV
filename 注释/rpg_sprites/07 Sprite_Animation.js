
/**----------------------------------------------------------------------------- */
/** Sprite_Animation */
/** 精灵动画 */
/** The sprite for displaying an animation. */
/** 一个显示动画的精灵 */

function Sprite_Animation() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_Animation.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Animation.prototype.constructor = Sprite_Animation;
/**检查1 = {} */
Sprite_Animation._checker1 = {};
/**检查2 = {} */
Sprite_Animation._checker2 = {};
/**初始化 */
Sprite_Animation.prototype.initialize = function() {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);
    //减少视觉失真 = true 
    this._reduceArtifacts = true;
    //初始化成员
    this.initMembers();
};
/**初始化成员 */
Sprite_Animation.prototype.initMembers = function() {
    //目标 = null 
    this._target = null;
    //动画 = null
    this._animation = null;
    //镜像 = false
    this._mirror = false;
    //延迟 = 0
    this._delay = 0;
    //速度 = 4 
    this._rate = 4;
    //持续时间 = 0
    this._duration = 0;
    //闪烁颜色 = [0,0,0,0]
    this._flashColor = [0, 0, 0, 0];
    //闪烁持续时间 = 0
    this._flashDuration = 0;
    //画面闪烁时间 = 0
    this._screenFlashDuration = 0;
    //隐藏持续时间 = 0 
    this._hidingDuration = 0;
    //位图1 = null
    this._bitmap1 = null;
    //位图2 = null
    this._bitmap2 = null;
    //单元精灵组 = []
    this._cellSprites = [];
    //画面闪烁精灵 = null 
    this._screenFlashSprite = null;
    //复制 = false
    this._duplicated = false;
    //z = 8
    this.z = 8;
};
/**设置 */
Sprite_Animation.prototype.setup = function(target, animation, mirror, delay) {
    //目标 = 目标 
    this._target = target;
    //动画 = 动画
    this._animation = animation;
    //镜像 = 镜像
    this._mirror = mirror;
    //延迟 = 延迟
    this._delay = delay;
    //如果(动画)
    if (this._animation) {
        //移除()
        this.remove();
        //安装速度()
        this.setupRate();
        //安装持续时间()
        this.setupDuration();
        //读取位图()
        this.loadBitmaps();
        //创建精灵组()
        this.createSprites();
    }
};
/**移除 */
Sprite_Animation.prototype.remove = function() {
    //如果( 父类 并且 父类 移除子(this) )
    if (this.parent && this.parent.removeChild(this)) {
        //目标 设置混合色([0,0,0,0])
        this._target.setBlendColor([0, 0, 0, 0]);
        //目标 显示()
        this._target.show();
    }
};
/**安装速度 */
Sprite_Animation.prototype.setupRate = function() {
    //速度 = 4
    this._rate = 4;
};
/**安装持续时间 */
Sprite_Animation.prototype.setupDuration = function() {
    //持续时间 = 动画 帧数 长度 * 速度 + 1
    this._duration = this._animation.frames.length * this._rate + 1;
};
/**更新 */
Sprite_Animation.prototype.update = function() {
    //精灵 更新 呼叫(this)
    Sprite.prototype.update.call(this);
    //更新主要()
    this.updateMain();
    //更新闪烁()
    this.updateFlash();
    //更新画面闪烁()
    this.updateScreenFlash();
    //更新隐藏()
    this.updateHiding();
    //检查1 = {}
    Sprite_Animation._checker1 = {};
    //检查2 = {}
    Sprite_Animation._checker2 = {};
};
/**更新闪烁 */
Sprite_Animation.prototype.updateFlash = function() {
    //如果(闪烁持续时间 > 0)
    if (this._flashDuration > 0) {
        //d = 闪烁持续时间 --
        var d = this._flashDuration--;
        //闪烁颜色[3] *= (d-1) / d 
        this._flashColor[3] *= (d - 1) / d;
        //目标 设置混合色(闪烁颜色)
        this._target.setBlendColor(this._flashColor);
    }
};
/**更新画面闪烁 */
Sprite_Animation.prototype.updateScreenFlash = function() {
    //如果(画面闪烁时间 > 0)
    if (this._screenFlashDuration > 0) {
        //d = 画面闪烁时间 --
        var d = this._screenFlashDuration--;
        //如果(画面闪烁精灵)
        if (this._screenFlashSprite) {
            //画面闪烁精灵 x = -绝对x()
            this._screenFlashSprite.x = -this.absoluteX(); 
            //画面闪烁精灵 y = -绝对y()
            this._screenFlashSprite.y = -this.absoluteY();
            //画面闪烁精灵 不透明度 *= (d-1) / d
            this._screenFlashSprite.opacity *= (d - 1) / d;
            //画面闪烁精灵 可见度 = (画面闪烁时间 > 0)
            this._screenFlashSprite.visible = (this._screenFlashDuration > 0);
        }
    }
};
/**绝对x */
Sprite_Animation.prototype.absoluteX = function() {
    //x = 0
    var x = 0;
    //对象 = this
    var object = this;
    //当(对象)
    while (object) {
        //x += 对象 x
        x += object.x;
        //对象 = 对象 父类
        object = object.parent;
    }
    //返回 x
    return x;
};
/**绝对y */
Sprite_Animation.prototype.absoluteY = function() {
    //y = 0
    var y = 0;
    //对象 = this
    var object = this;
    //当(对象)
    while (object) {
        //y += 对象 y
        y += object.y;
        //对象 = 对象 父类
        object = object.parent;
    }
    //返回 y
    return y;
};
/**更新隐藏 */
Sprite_Animation.prototype.updateHiding = function() {
    //如果(隐藏持续时间 > 0)
    if (this._hidingDuration > 0) {
        //隐藏持续时间--
        this._hidingDuration--;
        //如果(隐藏持续时间 === 0 )
        if (this._hidingDuration === 0) {
            //目标 显示()
            this._target.show();
        }
    }
};
/**是播放中 */
Sprite_Animation.prototype.isPlaying = function() {
    //返回 持续时间 > 0 
    return this._duration > 0;
};
/**读取位图 */
Sprite_Animation.prototype.loadBitmaps = function() {
    //名称1 = 动画 动画1名称
    var name1 = this._animation.animation1Name;
    //名称2 = 动画 动画2名称
    var name2 = this._animation.animation2Name;
    //色调1 = 动画 动画1色调
    var hue1 = this._animation.animation1Hue;
    //色调2 = 动画 动画2色调
    var hue2 = this._animation.animation2Hue;
    //图片1 = 图片管理器 读取动画(名称1 ,色调1)
    this._bitmap1 = ImageManager.loadAnimation(name1, hue1);
    //图片2 = 图片管理器 读取动画(名称2 ,色调2)
    this._bitmap2 = ImageManager.loadAnimation(name2, hue2);
};
/**是准备好 */
Sprite_Animation.prototype.isReady = function() {
    //返回 图片管理器 是准备好()
    return this._bitmap1 && this._bitmap1.isReady() && this._bitmap2 && this._bitmap2.isReady();
};
/**创建精灵组 */
Sprite_Animation.prototype.createSprites = function() {
    //如果(不是 检查2[动画] )
    if (!Sprite_Animation._checker2[this._animation]) {
        //创建单元精灵组()
        this.createCellSprites();
        //如果(动画 位置 === 3//画面)
        if (this._animation.position === 3) {
            //检查2[动画] = true 
            Sprite_Animation._checker2[this._animation] = true;
        }
        //创建画面闪烁精灵()
        this.createScreenFlashSprite();
    }
    //如果(检查[动画])
    if (Sprite_Animation._checker1[this._animation]) {
        //复制 = true 
        this._duplicated = true;
    //否则 
    } else {
        //复制 = false 
        this._duplicated = false;
        //如果(动画 位置 === 3//画面)
        if (this._animation.position === 3) {
            //检查1[动画] = true
            Sprite_Animation._checker1[this._animation] = true;
        }
    }
};
/**创建单元精灵组 */
Sprite_Animation.prototype.createCellSprites = function() {
    //单元精灵组 = []
    this._cellSprites = [];
    //循环 (i = 0; i < 16 ; i++)
    for (var i = 0; i < 16; i++) {
        //精灵 = 新 精灵()
        var sprite = new Sprite();
        //精灵 原点 x = 0.5
        sprite.anchor.x = 0.5;
        //精灵 原点 y = 0.5
        sprite.anchor.y = 0.5;
        //单元精灵组 添加(精灵)
        this._cellSprites.push(sprite);
        //添加子项(精灵)
        this.addChild(sprite);
    }
};
/**创建画面闪烁精灵 */
Sprite_Animation.prototype.createScreenFlashSprite = function() {
    //画面闪烁精灵 = 新 画面精灵()
    this._screenFlashSprite = new ScreenSprite();
    //添加子项(画面闪烁精灵)
    this.addChild(this._screenFlashSprite);
};
/**更新主要 */
Sprite_Animation.prototype.updateMain = function() {
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
    }
};
/**更新位置 */
Sprite_Animation.prototype.updatePosition = function() {
   
    /**2w:
     * 
     * position:
     * 0:头部
     * 1:中央
     * 2:底部
     * 3:画面
     * 
     */

    /** 画面 */ 

	//如果( 动画 位置 == 3//画面 ) 
    if (this._animation.position === 3) {
	    //x = 父类 宽 / 2 
        this.x = this.parent.width / 2;
        //y = 父类 高 / 2
        this.y = this.parent.height / 2;
    } else {

        /** 底部 */ 

	    //父类 = 目标的 父类
        var parent = this._target.parent;
        //祖父类 =  父类  ? 父类 的 父类 : null
        var grandparent = parent ? parent.parent : null;
        //x = 目标 x 
        this.x = this._target.x;
        //y = 目标 y
        this.y = this._target.y;
        //如果 this 父类 == 祖父类
        if (this.parent === grandparent) {
	        //x += 父类 x 
            this.x += parent.x;
            //y += 父类 y
            this.y += parent.y;
        }

        /** 头部 */

        //如果 动画( 位置 == 0 //头部 ) 
        if (this._animation.position === 0) {
	        //y -= 目标 高
            this.y -= this._target.height;

        /** 中央 */

        //否则 如果( 动画位置 == 1//中央 )
        } else if (this._animation.position === 1) {
	        //y -= 目标 高 / 2
            this.y -= this._target.height / 2;
        }
    }
};

/**更新帧 */
Sprite_Animation.prototype.updateFrame = function() {
    //如果(持续时间 > 0)
    if (this._duration > 0) {
        //帧索引 = 当前帧索引()
        var frameIndex = this.currentFrameIndex();
        //更新所有单元精灵组(动画 帧组[帧索引] )
        this.updateAllCellSprites(this._animation.frames[frameIndex]);
        //动画 定时 对每一个(定时)
        this._animation.timings.forEach(function(timing) {
            //如果(定时 帧 === 帧索引)
            if (timing.frame === frameIndex) {
                //进行定时数据(定时)
                this.processTimingData(timing);
            }
        }, this);
    }
};
/**当前帧索引 */
Sprite_Animation.prototype.currentFrameIndex = function() {
    //返回 (动画 帧数 长度 - 数学 向下取整( (持续时间 + 速度 - 1)/速度  ) )
    return (this._animation.frames.length -
            Math.floor((this._duration + this._rate - 1) / this._rate));
};
/**更新所有单元精灵组 */
Sprite_Animation.prototype.updateAllCellSprites = function(frame) {
    //循环(开始时 i = 0 ;当 i < 单元精灵组 长度 ;每一次 i++)
    for (var i = 0; i < this._cellSprites.length; i++) {
        //精灵 = 单元精灵组[i]
        var sprite = this._cellSprites[i];
        //如果(i < 帧 长度)
        if (i < frame.length) {
            //更新单元精灵(精灵 , 帧[i])
            this.updateCellSprite(sprite, frame[i]);
        //否则
        } else {
            //精灵 可见度 = false
            sprite.visible = false;
        }
    }
};
/**更新单元精灵 */
Sprite_Animation.prototype.updateCellSprite = function(sprite, cell) {

    /**2w:
     * 
     * call 
     * 0:图案 
     * 1:x 
     * 2:y 
     * 3:放大率
     * 4:旋转角度
     * 5:是否左右翻转
     * 6:不透明度
     * 7:混合模式
     * 
     */

    //图案 = 单元[0]
    var pattern = cell[0];
    //如果( 图案 >= 0)
    if (pattern >= 0) {
        //sx = 图案 % 5 * 192
        var sx = pattern % 5 * 192;
        //sy = 数学 向下取整 (图案 % 100 /5) * 192
        var sy = Math.floor(pattern % 100 / 5) * 192;
        //镜像 = 镜像
        var mirror = this._mirror;
        //精灵 位图 = 图案 < 100 ?  位图1 : 位图2
        sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
        //精灵 设置框(sx,sy,192,192)
        sprite.setFrame(sx, sy, 192, 192);
        //精灵 x = 单元[1]
        sprite.x = cell[1];
        //精灵 y = 单元[2]
        sprite.y = cell[2];

        //精灵 旋转 = 单元[4] * 数学 π / 100
        sprite.rotation = cell[4] * Math.PI / 180;
        //精灵 比例 x = 单元[3] / 100
        sprite.scale.x = cell[3] / 100;
        //如果( 单元[5] )
        if (cell[5] ) {
            //精灵 比例 x *= -1
            sprite.scale.x *= -1;
        }
        //如果(镜像)
        if (mirror) {
            //精灵 x *= -1 
            sprite.x *= -1;
            sprite.rotation *= -1;
            sprite.scale.x *= -1;
        }
        //精灵 比例 y = 单元[3] / 100
        sprite.scale.y = cell[3] / 100;
        //精灵 不透明度 = 单元[6]
        sprite.opacity = cell[6];
        //精灵 混合模式 = 单元[7]
        sprite.blendMode = cell[7];
        //精灵 可见度 = true
        sprite.visible = true;
    //否则
    } else {
        //精灵 可见度 = false
        sprite.visible = false;
    }
};
/**进行定时数据 */
Sprite_Animation.prototype.processTimingData = function(timing) {
    //持续时间 = 定时 闪烁持续时间 * 速度
    var duration = timing.flashDuration * this._rate;
    //检查(定时 闪烁范围 )
    switch (timing.flashScope) {
    //当 1 :
    case 1:
        //开始闪烁(定时 闪烁颜色 ,持续时间)
        this.startFlash(timing.flashColor, duration);
        break;
    case 2:
        //开始画面闪烁(定时 闪烁颜色 ,持续时间)
        this.startScreenFlash(timing.flashColor, duration);
        //中断
        break;
    case 3:
        //开始隐藏(持续时间)
        this.startHiding(duration);
        //中断
        break;
    }
    //如果(不是 复制 并且 定时 se)
    if (!this._duplicated && timing.se) {
        //音频管理器 播放se(定时 se)
        AudioManager.playSe(timing.se);
    }
};
/**开始闪烁 */
Sprite_Animation.prototype.startFlash = function(color, duration) {
    //闪烁颜色 = 颜色 克隆()
    this._flashColor = color.clone();
    //闪烁持续时间 = 持续时间
    this._flashDuration = duration;
};
/**开始画面闪烁 */
Sprite_Animation.prototype.startScreenFlash = function(color, duration) {
    //画面闪烁时间 = 持续时间
    this._screenFlashDuration = duration;
    //如果(画面闪烁精灵)
    if (this._screenFlashSprite) {
        //画面闪烁精灵 设置颜色(颜色[0],颜色[1],颜色[2])
        this._screenFlashSprite.setColor(color[0], color[1], color[2]);
        //画面闪烁精灵 不透明度 = 颜色[3]
        this._screenFlashSprite.opacity = color[3];
    }
};
/**开始隐藏 */
Sprite_Animation.prototype.startHiding = function(duration) {
    //隐藏持续时间 = 持续时间
    this._hidingDuration = duration;
    //目标 隐藏()
    this._target.hide();
};
