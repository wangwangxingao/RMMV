
/**----------------------------------------------------------------------------- */
/** Sprite_Actor */
/** 精灵角色 */
/** The sprite for displaying an actor. */
/** 显示一个角色的精灵 */

function Sprite_Actor() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_Actor.prototype = Object.create(Sprite_Battler.prototype);
/**设置创造者 */
Sprite_Actor.prototype.constructor = Sprite_Actor;
/**动作 */
Sprite_Actor.MOTIONS = {
    walk:     { index: 0,  loop: true  },
    wait:     { index: 1,  loop: true  },
    chant:    { index: 2,  loop: true  },
    guard:    { index: 3,  loop: true  },
    damage:   { index: 4,  loop: false },
    evade:    { index: 5,  loop: false },
    thrust:   { index: 6,  loop: false },
    swing:    { index: 7,  loop: false },
    missile:  { index: 8,  loop: false },
    skill:    { index: 9,  loop: false },
    spell:    { index: 10, loop: false },
    item:     { index: 11, loop: false },
    escape:   { index: 12, loop: true  },
    victory:  { index: 13, loop: true  },
    dying:    { index: 14, loop: true  },
    abnormal: { index: 15, loop: true  },
    sleep:    { index: 16, loop: true  },
    dead:     { index: 17, loop: true  }
};
/**初始化 */
Sprite_Actor.prototype.initialize = function(battler) {
    //精灵战斗者 初始化 呼叫(this , 战斗者)
    Sprite_Battler.prototype.initialize.call(this, battler);
    //移动到开始位置()
    this.moveToStartPosition();
};
/**初始化成员 */
Sprite_Actor.prototype.initMembers = function() {
    //精灵战斗者 初始化成员 呼叫(this)
    Sprite_Battler.prototype.initMembers.call(this);
    this._battlerName = '';
    //动作 = null
    this._motion = null;
    //动作计数 = 0
    this._motionCount = 0;
    //图案 = 0 
    this._pattern = 0;
    //创建阴影精灵()
    this.createShadowSprite();
    //创建武器精灵()
    this.createWeaponSprite();
    //创建主要精灵()
    this.createMainSprite();
    //创建状态精灵()
    this.createStateSprite();
};
/**创建主要精灵 */
Sprite_Actor.prototype.createMainSprite = function() {
    //主要精灵 = 新 精灵基础()
    this._mainSprite = new Sprite_Base();
    //主要精灵 锚点 x = 0.5
    this._mainSprite.anchor.x = 0.5;
    //主要精灵 锚点 y = 1
    this._mainSprite.anchor.y = 1;
    //添加子项(主要精灵)
    this.addChild(this._mainSprite);
    //效果目标 = 主要精灵
    this._effectTarget = this._mainSprite;
};
/**创建阴影精灵 */
Sprite_Actor.prototype.createShadowSprite = function() {
    //阴影精灵 = 新 精灵()
    this._shadowSprite = new Sprite();
    //阴影精灵 位图 = 图像管理器 读取系统('Shadow2')
    this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow2');
    //阴影精灵 锚点 x = 0.5
    this._shadowSprite.anchor.x = 0.5;
    //阴影精灵 锚点 y = 0.5
    this._shadowSprite.anchor.y = 0.5;
    //阴影精灵 y = -2
    this._shadowSprite.y = -2;
    //添加子项(阴影精灵)
    this.addChild(this._shadowSprite);
};
/**创建武器精灵 */
Sprite_Actor.prototype.createWeaponSprite = function() {
    //武器精灵 = 新 精灵武器()
    this._weaponSprite = new Sprite_Weapon();
    //添加子项(武器精灵)
    this.addChild(this._weaponSprite);
};
/**创建状态精灵 */
Sprite_Actor.prototype.createStateSprite = function() {
    //状态精灵 = 新 精灵状态覆盖()
    this._stateSprite = new Sprite_StateOverlay();
    //添加子项(状态精灵)
    this.addChild(this._stateSprite);
};
/**设置战斗者 */
Sprite_Actor.prototype.setBattler = function(battler) {
    //精灵战斗者 设置战斗者 呼叫(this , 战斗者)
    Sprite_Battler.prototype.setBattler.call(this, battler);
    //改变的 = (战斗者 !== 角色)
    var changed = (battler !== this._actor);
    //如果(改变的)
    if (changed) {
        //角色 = 战斗者
        this._actor = battler;
        //如果(战斗者)
        if (battler) {
            //设置角色本位(战斗者 索引())
            this.setActorHome(battler.index());
        }
        //开始记录动作()
        this.startEntryMotion();
        //状态精灵 安装(战斗者)
        this._stateSprite.setup(battler);
    }
};
/**移动到开始位置 */
Sprite_Actor.prototype.moveToStartPosition = function() {
    //开始移动(300,0,0)
    this.startMove(300, 0, 0);
};
/**设置角色本位 */
Sprite_Actor.prototype.setActorHome = function(index) {
    //设置始位(600 + 索引 * 32 , 280 + 索引 * 48 )
    this.setHome(600 + index * 32, 280 + index * 48);
};
/**更新 */
Sprite_Actor.prototype.update = function() {
    //精灵战斗者 更新 呼叫(this)
    Sprite_Battler.prototype.update.call(this);
    //更新阴影()
    this.updateShadow();
    //如果(角色)
    if (this._actor) {
        //更新动作
        this.updateMotion();
    }
};
/**更新阴影 */
Sprite_Actor.prototype.updateShadow = function() {
    //阴影精灵 显示 = !!角色
    this._shadowSprite.visible = !!this._actor;
};
/**更新主要 */
Sprite_Actor.prototype.updateMain = function() {
    //精灵战斗者 更新主要 呼叫(this)
    Sprite_Battler.prototype.updateMain.call(this);
    //如果(角色 是精灵显示() 并且 不是 是移动中() )
    if (this._actor.isSpriteVisible() && !this.isMoving()) {
        //更新目标位置
        this.updateTargetPosition();
    }
};
/**安装动作 */
Sprite_Actor.prototype.setupMotion = function() {
    //如果(角色 是动作请求的())
    if (this._actor.isMotionRequested()) {
        //开始动作(角色 动作种类())
        this.startMotion(this._actor.motionType());
        //角色 清除动作()
        this._actor.clearMotion();
    }
};
/**安装武器动画 */
Sprite_Actor.prototype.setupWeaponAnimation = function() {
    //如果(角色 是武器动画请求())
    if (this._actor.isWeaponAnimationRequested()) {
        //武器精灵 安装(角色 武器图像id() )
        this._weaponSprite.setup(this._actor.weaponImageId());
        //角色 清除武器动画()
        this._actor.clearWeaponAnimation();
    }
};
/**开始动作 */
Sprite_Actor.prototype.startMotion = function(motionType) {
    //新动作 = 精灵角色 动作组[动作种类]
    var newMotion = Sprite_Actor.MOTIONS[motionType];
    //如果(动作 !== 新动作)
    if (this._motion !== newMotion) {
        //动作 = 新动作
        this._motion = newMotion;
        //动作计数 = 0
        this._motionCount = 0;
        //图案 = 0
        this._pattern = 0;
    }
};
/**更新目标位置 */
Sprite_Actor.prototype.updateTargetPosition = function() {
    //如果(角色 是输入中() 或者 角色 是演出() )
    if (this._actor.isInputting() || this._actor.isActing()) {
        //步骤推进()
        this.stepForward();
    //否则 如果(角色 能移动() 并且 战斗管理器 是逃跑())
    } else if (this._actor.canMove() && BattleManager.isEscaped()) {
        //撤退()
        this.retreat();
    //否则 如果(不是 在初始位置())
    } else if (!this.inHomePosition()) {
        //步骤返回
        this.stepBack();
    }
};
/**更新位图 */
Sprite_Actor.prototype.updateBitmap = function() {
    //精灵战斗者 更新位图 呼叫(this)
    Sprite_Battler.prototype.updateBitmap.call(this);
    //名称 = 角色 战斗者名称()
    var name = this._actor.battlerName();
    //如果(战斗者名称 !== 名称 )
    if (this._battlerName !== name) {
        //战斗者名称 = 名称
        this._battlerName = name;
        //主要精灵 位图 = 图像管理器 读取sv角色(名称)
        this._mainSprite.bitmap = ImageManager.loadSvActor(name);
    }
};
/**更新帧 */
Sprite_Actor.prototype.updateFrame = function() {
    //精灵战斗者 更新帧 呼叫(this)
    Sprite_Battler.prototype.updateFrame.call(this);
    //位图 = 主要精灵 位图
    var bitmap = this._mainSprite.bitmap;
    //如果(位图)
    if (bitmap) {
        //动作索引 = 动作 ? 动作 索引 : 0
        var motionIndex = this._motion ? this._motion.index : 0;
        //图案 = 图案 < 3 ? 图案 : 1
        var pattern = this._pattern < 3 ? this._pattern : 1;
        //cw = 位图 宽 / 9 
        var cw = bitmap.width / 9;
        //ch = 位图 高 / 6 
        var ch = bitmap.height / 6;
        //cx = 数学 向下取整(动作索引 / 6) * 3  + 图案 
        var cx = Math.floor(motionIndex / 6) * 3 + pattern;
        //cy = 动作索引 % 6 
        var cy = motionIndex % 6;
        //主要精灵 设置框(cx * cw, cy * ch, cw, ch)
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
    }
};
/**更新移动 */
Sprite_Actor.prototype.updateMove = function() {
    //位图 = 主要精灵 位图
    var bitmap = this._mainSprite.bitmap;
    //如果(不是 位图 或者 位图 是准备好())
    if (!bitmap || bitmap.isReady()) {
        //精灵战斗者 更新移动 呼叫(this)
        Sprite_Battler.prototype.updateMove.call(this);
    }
};
/**更新动作 */
Sprite_Actor.prototype.updateMotion = function() {
    //安装动作()
    this.setupMotion();
    //安装武器动画()
    this.setupWeaponAnimation();
    //如果(角色 是动作刷新请求())
    if (this._actor.isMotionRefreshRequested()) {
        //刷新动作()
        this.refreshMotion();
        //角色 清除动作()
        this._actor.clearMotion();
    }
    //更新动作计数()
    this.updateMotionCount();
};
/**更新动作计数 */
Sprite_Actor.prototype.updateMotionCount = function() {
    //如果(动作 并且 ++动作技术 >= 动作速度() )
    if (this._motion && ++this._motionCount >= this.motionSpeed()) {
        //如果(动作 循环)
        if (this._motion.loop) {
            //图案 = (图案 + 1) % 4
            this._pattern = (this._pattern + 1) % 4;
        //否则 如果(图案 < 2)
        } else if (this._pattern < 2) {
            //图案 ++
            this._pattern++;
        //否则
        } else {
            //刷新动作()
            this.refreshMotion();
        }
        //动作计数 = 0
        this._motionCount = 0;
    }
};
/**动作速度 */
Sprite_Actor.prototype.motionSpeed = function() {
    //返回 12
    return 12;
};
/**刷新动作 */
Sprite_Actor.prototype.refreshMotion = function() {
    //角色 = 角色
    var actor = this._actor;
    //动作防御 = 精灵角色 动作组["防御"]
    var motionGuard = Sprite_Actor.MOTIONS['guard'];
    //如果(角色)
    if (actor) {
        //如果(动作 === 动作防御 && 不是 战斗管理器 是输入中() )
	    if (this._motion === motionGuard && !BattleManager.isInputting()) {
            //返回
            return;
        }
        //状态动作 = 角色 状态动作索引()
        var stateMotion = actor.stateMotionIndex();
        //如果(角色 是输入中() 或者 角色 是演出() )
        if (actor.isInputting() || actor.isActing()) {
            //开始动作("walk")
            this.startMotion('walk');
        //否则 如果(状态动作 === 3 )
        } else if (stateMotion === 3) {
            //开始动作("dead")
            this.startMotion('dead');
        //否则 如果(状态动作 === 2 )
        } else if (stateMotion === 2) {
            //开始动作("sleep")
            this.startMotion('sleep');
        //否则 如果(角色 是吟唱() )
        } else if (actor.isChanting()) {
            //开始动作("chant")
            this.startMotion('chant');
        //否则 如果(角色 是防御() 或者 角色 是防御等待() )
        } else if (actor.isGuard() || actor.isGuardWaiting()) {
            //开始动作("guard")
            this.startMotion('guard');
        //否则 如果(状态动作 === 1 )
        } else if (stateMotion === 1) {
            //开始动作("abnormal")
            this.startMotion('abnormal');
        //否则 如果(角色 是濒死的() )
        } else if (actor.isDying()) {
            //开始动作("dying")
            this.startMotion('dying');
            //否则 如果(角色 是未定的())
        } else if (actor.isUndecided()) {
            //开始动作("walk")
            this.startMotion('walk');
        } else {
            //开始动作("wait")
            this.startMotion('wait');
        }
    }
};
/**开始记录动作 */
Sprite_Actor.prototype.startEntryMotion = function() {
    //如果(角色 并且 角色 能移动())
    if (this._actor && this._actor.canMove()) { 
        //开始动作("walk")
        this.startMotion('walk');
        //开始移动(0,0,30)
        this.startMove(0, 0, 30);
        //否则 如果(不是 是移动中())
    } else if (!this.isMoving()) {
        //刷新动作()
        this.refreshMotion();
        //开始移动(0,0,0)
        this.startMove(0, 0, 0);
    }
};
/**步骤推进 */
Sprite_Actor.prototype.stepForward = function() {
    //开始移动(-48,0,12)
    this.startMove(-48, 0, 12);
};
/**步骤返回 */
Sprite_Actor.prototype.stepBack = function() {
    //开始移动(0,0,12)
    this.startMove(0, 0, 12);
};
/**撤退 */
Sprite_Actor.prototype.retreat = function() {
    //开始移动(300,0,30)
    this.startMove(300, 0, 30);
};
/**当移动结束 */
Sprite_Actor.prototype.onMoveEnd = function() {
    //精灵战斗者 当移动结束 呼叫(this)
    Sprite_Battler.prototype.onMoveEnd.call(this);
    //如果(不是 战斗管理器 是战斗结束())
    if (!BattleManager.isBattleEnd()) {
        //刷新动作()
        this.refreshMotion();
    }
};
/**伤害偏移x */
Sprite_Actor.prototype.damageOffsetX = function() {
    //返回 -32
    return -32;
};
/**伤害偏移y */
Sprite_Actor.prototype.damageOffsetY = function() {
    //返回 0
    return 0;
};
