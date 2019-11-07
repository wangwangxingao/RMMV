/*:
 * @plugindesc 战斗图像增强
 * @author BattleMotion
 *  
 * @help 
 * 在数据库中选择一个基本文件, 比如图片 Actor
 * 然后有文件夹中放入 Actor_0 Actor_1 .... 的图片
 * 这些图片会以 Actor 为基础切割 , 以Actor 的 5 x 2 倍大小的图片为例
 * 0,1,2,3,4
 * 5,6,7,8,9
 * 
 * 在脚本下面的
 * Sprite_Actor.MOTIONSLIST
 * 添加一个 
 * Actor:{},
 * 不要忘记括号 
 * 然后对各个动作设置
 * 如 
 * walk :{ index : 1 ,  loop:true ,}
 * index 是选择的文件 , 后面的值 为1 , 则所用的图片为 Actor_1 , 
 * loop 为true 则循环播放
 * abnormal: { index: 2, loop: true , loopcont: 3 , next:"missile", speed: 52 },
 * index为2 则为 Actor_2,
 * loop 为true 
 * loopcont 为3 则为循环3次
 * 则循环播放时为 (第1次)0,1,2,3,4,(第2次)0,1,2,3,4,(第3次)0,1,2,3,4, 这样循环
 * next 为 "missile" 则为 循环3次后 , 转到 "missile" 动作 
 * speed 为 52 ,则速度为52 速度越大变化越慢
 * victory:  { index: 10, loop: true  , reloop : true ,  loopcont: 3 , speed: 52},
 * index为10 则为 Actor_10, 
 * loop 为true 则循环播放 
 * loopcont 为3 则为循环3次 
 * reloop 为 true 则循环播放时 (第1次)0,1,2,3,4,3,2,1,(第2次)0,1,2,3,4,3,2,1,(第3次)0,1,2,3,4,3,2,1 这样循环
 * speed 为 52 ,则速度为52 速度越大变化越慢
 * 没有next ,播放完后会自动恢复到应该的状态
 * 
 * 
 * 当不设置图片 Actor 时 ,会自动用 Sprite_Actor.MOTIONS 代替 
 * 所以需要注意的是,必须有  Sprite_Actor.MOTIONS  里的这18个动作,以避免问题 
 * next 对应的可以不是 这18个动作之一 , 但必须是这个图片被设置过的动作的名字
 * 如可以添加一个
 * test:{index:1 , loop:true }
 * next:"test"
 * 这样也是可以的
 * 
 * 
 */


Sprite_Battler.prototype.initMotions = function () {
    this._battlerName = '';
    this._motion = null;
    this._motions = this.getMotions()
    this._bitmaps = null
    this._bitmapbase = null
    this._bitmapset = null
    this._motionCount = 0;
    this._loopCont = 0
    this._pattern = 0;
}






Sprite_Battler.prototype.refreshMotionBitmap = function (name, hub) {
    var name = name
    this._battlerName = name;
    this._battlerHue = hub

    this._motions = this.getMotions(name)
    this._bitmapbase = null
    this._bitmaps = {}
    this._bitmapset = {}

    //读取基础
    var n2 = name
    this._bitmapbase = this.loadMotionBitmap(n2)
    for (var n in this._motions) {
        var motion = this._motions[n]
        var i = motion.index
        if (motion.bset) {
            this._bitmapset[n] = motion.bset
        } else {
            if (i < this.getMotionBaseN()) {
                this._bitmapset[n] = {
                    all: 3
                }
            }
        }
        if (i >= this.getMotionBaseN() && !this._bitmaps[i]) {
            var n2 = motion.b || (name + "_" + i)
            this._bitmaps[i] = this.loadMotionBitmap(n2)
        }
    }
    this.updateMotionBitmap()
};

/**
 * 更新动作位图
 */
Sprite_Battler.prototype.updateMotionBitmap = function () {
    if (this._bitmaps && this._bitmapbase) {
        var motionIndex = this._motion ? this._motion.index : 0;
        if (motionIndex < this.getMotionBaseN()) {
            this._mainSprite.bitmap = this._bitmapbase
        } else {
            this._mainSprite.bitmap = this._bitmaps[motionIndex]
        }
        this.updateFrame()
    }
};

Sprite_Battler.prototype.loadSv = function () {
    if (this._bitmapbase && this._bitmaps) {
        if (this._bitmapbase.isReady()) {
            for (var n in this._bitmaps) {
                if (this._bitmaps[n].isReady()) {
                    this.updateBitmapSet(n)
                }
            }
        }
    }
}


Sprite_Actor.prototype.updateBitmapSet = function (name) {
    if (this._bitmapset) {
        if (!this._bitmapset[name]) {
            var bitmap = this._bitmaps[name]
            var b = this._bitmapbase
            var w = Math.floor(b.width / this.getMotionBaseXn())
            var h = Math.floor(b.height / this.getMotionBaseYn())
            var x = Math.ceil(bitmap.width / w)
            var y = Math.ceil(bitmap.height / h)
            this._bitmapset[name] = {
                w: w,
                h: h,
                xn: x,
                yn: y,
                all: x * y
            }
        }
    }
};


/**更新帧 */
Sprite_Battler.prototype.updateFrame = function () {
    var bitmap = this._mainSprite.bitmap;
    if (bitmap) {
        var motionIndex = this._motion ? this._motion.index : 0;
        if (motionIndex < this.getMotionBaseN()) {
            this.updateBaseFrame(motionIndex)
        } else {
            this.updateMoreFrame(motionIndex)
        }
    }
};


Sprite_Battler.prototype.updateBaseFrame = function (motionIndex) {
    //位图 = 主要精灵 位图
    var bitmap = this._mainSprite.bitmap;
    //如果(位图)
    if (bitmap) {
        var all = this.getMotionBaseNn()
        if (this._pattern < all) {
            var pattern = this._pattern
        } else {
            var np = all + all - this._pattern - 2
            if (np > 0) {
                var pattern = np
            } else {
                var pattern = 0
            }
        }
        //cw = 位图 宽 / 9 
        var cw = bitmap.width / this.getMotionBaseXn();
        //ch = 位图 高 / 6 
        var ch = bitmap.height / this.getMotionBaseYn();
        //cx = 数学 向下取整(动作索引 / 6) * 3  + 图案 
        var cx = Math.floor(motionIndex / this.getMotionBaseYn()) * this.getMotionBaseNn() + pattern;
        //cy = 动作索引 % 6 
        var cy = motionIndex % this.getMotionBaseYn();
        //主要精灵 设置框(cx * cw, cy * ch, cw, ch)
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
    }
}

Sprite_Battler.prototype.updateMoreFrame = function (motionIndex) {
    if (this._bitmapset) {
        var set = this._bitmapset[motionIndex]
        if (set) {
            var p = this._pattern
            if (this._motion.frame) {
                var p = this._motion.frame[p]
            }
            var all = set.all
            var xn = set.xn
            var yn = set.yn
            var w = set.w
            var h = set.h

            if (p < all) {
                var p = p
            } else {
                var np = all + all - p - 2
                if (np > 0) {
                    var p = np
                } else {
                    var p = 0
                }
            }
            var cx = p % xn
            var cy = (p - cx) / xn
            var cw = w;
            var ch = h;
            this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
        }
    }
}


/**更新动作计数 */
Sprite_Battler.prototype.updateMotionCount = function () {
    //如果(动作 并且 ++动作技术 >= 动作速度() )
    if (this._motion && this._bitmapset && this._bitmapset[this._motion.index] && ++this._motionCount >= this.motionSpeed()) {
        if (this._motion.index < this.getMotionBaseN()) {
            var all = this.getMotionBaseNn()
        } else {
            var set = this._bitmapset[this._motion.index]
            if (this._motion.frame) {
                var all = this._motion.frame.length
            } else {
                var all = this._motion.all || set.all
            }
        }
        //如果(动作 循环)
        if (this._motion.loop) {
            this._pattern++
            //返回
            var all = this._motion.reloop ? all + all - 2 : all
            if (this._pattern >= all) {
                this._pattern = 0
                if ("loopcont" in this._motion) {
                    if (++this._loopCont >= this._motion.loopcont) {
                        this.nextMotion()
                    }
                }
            }
        } else if (this._pattern < all) {
            this._pattern++;
            //否则
        } else {
            this.nextMotion()
        }
        //动作计数 = 0
        this._motionCount = 0;
    }
};




/**动作速度 */
Sprite_Battler.prototype.motionSpeed = function () {
    if (this._motion && this._motion.speed) {
        return this._motion.speed
    }
    return 12;
};

Sprite_Battler.prototype.nextMotion = function () {
    if (this._motion) {
        if (this._motion.next) {
            this.startMotion(this._motion.next)
            return
        }
    }
    this.refreshMotion();
};









Sprite_Actor.MOTIONS = {
    walk: {
        index: 0,
        loop: true
    },
    wait: {
        index: 1,
        loop: true
    },
    chant: {
        index: 2,
        loop: true
    },
    guard: {
        index: 3,
        loop: true
    },
    damage: {
        index: 4,
        loop: false
    },
    evade: {
        index: 5,
        loop: false
    },
    thrust: {
        index: 6,
        loop: false
    },
    swing: {
        index: 7,
        loop: false
    },
    missile: {
        index: 8,
        loop: false
    },
    skill: {
        index: 9,
        loop: false
    },
    spell: {
        index: 10,
        loop: false
    },
    item: {
        index: 11,
        loop: false
    },
    escape: {
        index: 12,
        loop: true
    },
    victory: {
        index: 13,
        loop: true
    },
    dying: {
        index: 14,
        loop: true
    },
    abnormal: {
        index: 15,
        loop: true
    },
    sleep: {
        index: 16,
        loop: true
    },
    dead: {
        index: 17,
        loop: true
    }
};
//具体设置 举例:
Sprite_Actor.MOTIONSLIST = {
    Actor: {
        dying: {
            index: 1,
            loop: false,
            reloop: true,
            next: "item",
            speed: 52
        },
    },
};

Sprite_Actor.motionbaseN = 18
Sprite_Actor.motionbaseNn = 3
Sprite_Actor.motionbaseXn = 9
Sprite_Actor.motionbaseYn = 6





/**初始化成员 */
Sprite_Actor.prototype.initMembers = function () {
    Sprite_Battler.prototype.initMembers.call(this);
    this.initMotions()
    this.createShadowSprite();
    this.createWeaponSprite();
    this.createMainSprite();
    this.createStateSprite();
};

/**开始动作 */
Sprite_Actor.prototype.startMotion = function (motionType) {
    //新动作 = 精灵角色 动作组[动作种类]
    var newMotion = this._motions[motionType];
    //如果(动作 !== 新动作)
    if (this._motion !== newMotion) {
        //动作 = 新动作
        this._motion = newMotion;
        //动作计数 = 0
        this._motionCount = 0;
        //图案 = 0
        this._pattern = 0;

        this._loopCont = 0

        this.updateMotionBitmap()

    }
};


/**更新位图 */
Sprite_Actor.prototype.updateBitmap = function () {
    //精灵战斗者 更新位图 呼叫(this)
    Sprite_Battler.prototype.updateBitmap.call(this);
    //名称 = 角色 战斗者名称()
    var name = this._actor.battlerName();
    //如果(战斗者名称 !== 名称 )
    if (this._battlerName !== name) {
        this.refreshMotionBitmap(name)
    }
};
/**
 * 获取动作设置
 * @param {*} name 
 */
Sprite_Actor.prototype.getMotions = function (name) {
    if (Sprite_Actor.MOTIONSLIST[name]) {
        return Sprite_Actor.MOTIONSLIST[name]
    } else {
        return Sprite_Actor.MOTIONS
    }
}

/**基础图像默认动作个数 */
Sprite_Actor.prototype.getMotionBaseN = function () {
    return 18
}
Sprite_Actor.prototype.getMotionBaseXn = function () {
    return 9
}
Sprite_Actor.prototype.getMotionBaseYn = function () {
    return 6
}
/**基础图像默认动作个数 */
Sprite_Actor.prototype.getMotionBaseNn = function () {
    return 3
}

Sprite_Battler.prototype.loadMotionBitmap = function (name) {

}

Sprite_Actor.prototype.loadMotionBitmap = function (name, hub) {
    var b = ImageManager.loadSvActor(name, hub)
    var that = this
    b.addLoadListener(
        function () {
            that.loadSv()
        }
    )
    return b
}

Sprite_Actor.prototype.updateBaseFrame = function (motionIndex) {
    //位图 = 主要精灵 位图
    var bitmap = this._mainSprite.bitmap;
    //如果(位图)
    if (bitmap) {
        var pattern = this._pattern < 3 ? this._pattern : 1;
        var cw = bitmap.width / 9;
        var ch = bitmap.height / 6;
        var cx = Math.floor(motionIndex / 6) * 3 + pattern;
        var cy = motionIndex % 6;
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
        /*var all = this.getMotionBaseNn()
        if (this._pattern < all) {
            var pattern = this._pattern
        } else {
            var np = all + all - this._pattern - 2
            if (np > 0) {
                var pattern = np
            } else {
                var pattern = 0
            }
        }
        //cw = 位图 宽 / 9 
        var cw = bitmap.width / this.getMotionBaseXn();
        //ch = 位图 高 / 6 
        var ch = bitmap.height / this.getMotionBaseYn();
        //cx = 数学 向下取整(动作索引 / 6) * 3  + 图案 
        var cx = Math.floor(motionIndex / this.getMotionBaseYn()) * this.getMotionBaseNn() + pattern;
        //cy = 动作索引 % 6 
        var cy = motionIndex % this.getMotionBaseYn();
        //主要精灵 设置框(cx * cw, cy * ch, cw, ch)
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);*/
    }
}

Sprite_Enemy.MOTIONS = {}
Sprite_Enemy.MOTIONSLIST = {}


/**
 * 获取动作设置
 * @param {*} name 
 */
Sprite_Enemy.prototype.getMotions = function (name) {
    if (Sprite_Enemy.MOTIONSLIST[name]) {
        return Sprite_Enemy.MOTIONSLIST[name]
    } else {
        return Sprite_Enemy.MOTIONS
    }
}

Sprite_Enemy.prototype.initMembers = function () {
    //精灵战斗者 初始化成员 呼叫(this)
    Sprite_Battler.prototype.initMembers.call(this);
    this._enemy = null;
    this._appeared = false;
    this._battlerName = '';
    this._battlerHue = 0;
    this._effectType = null;
    this._effectDuration = 0;
    this._shake = 0;
    this.loadBitmap()
    this.createStateIconSprite();
};



/**更新 */
Sprite_Enemy.prototype.update = function () {
    //精灵战斗者 更新 呼叫(this)
    Sprite_Battler.prototype.update.call(this);
    if (this._enemy) {
        this.updateEffect();
        this.updateStateSprite();
        this.updateMotion()
    }
};


Sprite_Enemy.prototype.updateBitmap = function () {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._enemy.battlerName();
    var hue = this._enemy.battlerHue();
    if (this._battlerName !== name || this._battlerHue !== hue) {
        this._battlerName = name;
        this._battlerHue = hue;
        this.refreshMotionBitmap(name, hue);
        this.initVisibility();
    }
};

Sprite_Enemy.prototype.loadBitmap = function (name, hue) {

};



Sprite_Enemy.prototype.loadMotionBitmap = function (name, hub) {
    if ($gameSystem.isSideView()) {
        var b = ImageManager.loadSvEnemy(name, hue);
    } else {
        var b = ImageManager.loadEnemy(name, hue);
    }
    var that = this
    b.addLoadListener(
        function () {
            that.loadSv()
        }
    )
    return b
}





Sprite_Enemy.prototype.updateMotion = function () {
    //安装动作()
    this.setupMotion();
    //更新动作计数()
    this.updateMotionCount();
};


/**安装动作 */
Sprite_Enemy.prototype.setupMotion = function () {
    //如果(角色 是动作请求的())
    if (this._battler.isMotionRequested()) {
        //开始动作(角色 动作种类())
        this.startMotion(this._battler.motionType());
        //角色 清除动作()
        this._battler.clearMotion();
    }
};


Sprite_Enemy.prototype.refreshMotion = function () {
    var battler = this._battler;
    if (battler) {
        this.startMotion('wait');
    }
};
 

Sprite_Enemy.prototype.updateFrame = function () {
    Sprite_Battler.prototype.updateFrame.call(this);
};
 

Sprite_Enemy.prototype.updateBaseFrame = function () {
    var frameHeight = this.bitmap.height;
    if (this._effectType === 'bossCollapse') {
        frameHeight = this._effectDuration;
    }
    this.setFrame(0, 0, this.bitmap.width, frameHeight);
}; 