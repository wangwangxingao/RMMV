
//-----------------------------------------------------------------------------
// Sprite_Actor
// 角色精灵
// The sprite for displaying an actor.
// 显示一个角色的精灵

function Sprite_Actor() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_Actor.prototype = Object.create(Sprite_Battler.prototype);
//设置创造者
Sprite_Actor.prototype.constructor = Sprite_Actor;
//动作
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
//初始化
Sprite_Actor.prototype.initialize = function(battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
    this.moveToStartPosition();
};
//初始化成员
Sprite_Actor.prototype.initMembers = function() {
    Sprite_Battler.prototype.initMembers.call(this);
    this._battlerName = '';
    this._motion = null;
    this._motionCount = 0;
    this._pattern = 0;
    this.createShadowSprite();
    this.createWeaponSprite();
    this.createMainSprite();
    this.createStateSprite();
};
//创建主要精灵
Sprite_Actor.prototype.createMainSprite = function() {
    this._mainSprite = new Sprite_Base();
    this._mainSprite.anchor.x = 0.5;
    this._mainSprite.anchor.y = 1;
    this.addChild(this._mainSprite);
    this._effectTarget = this._mainSprite;
};
//创建阴影精灵
Sprite_Actor.prototype.createShadowSprite = function() {
    this._shadowSprite = new Sprite();
    this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow2');
    this._shadowSprite.anchor.x = 0.5;
    this._shadowSprite.anchor.y = 0.5;
    this._shadowSprite.y = -2;
    this.addChild(this._shadowSprite);
};
//创建武器精灵
Sprite_Actor.prototype.createWeaponSprite = function() {
    this._weaponSprite = new Sprite_Weapon();
    this.addChild(this._weaponSprite);
};
//创建状态精灵
Sprite_Actor.prototype.createStateSprite = function() {
    this._stateSprite = new Sprite_StateOverlay();
    this.addChild(this._stateSprite);
};
//设置战斗者
Sprite_Actor.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    var changed = (battler !== this._actor);
    if (changed) {
        this._actor = battler;
        if (battler) {
            this.setActorHome(battler.index());
        }
        this.startEntryMotion();
        this._stateSprite.setup(battler);
    }
};
//移动到开始位置
Sprite_Actor.prototype.moveToStartPosition = function() {
    this.startMove(300, 0, 0);
};
//设置角色本位
Sprite_Actor.prototype.setActorHome = function(index) {
    this.setHome(600 + index * 32, 280 + index * 48);
};
//更新
Sprite_Actor.prototype.update = function() {
    Sprite_Battler.prototype.update.call(this);
    this.updateShadow();
    if (this._actor) {
        this.updateMotion();
    }
};
//更新阴影
Sprite_Actor.prototype.updateShadow = function() {
    this._shadowSprite.visible = !!this._actor;
};
//更新主要
Sprite_Actor.prototype.updateMain = function() {
    Sprite_Battler.prototype.updateMain.call(this);
    if (this._actor.isSpriteVisible() && !this.isMoving()) {
        this.updateTargetPosition();
    }
};
//安装动作
Sprite_Actor.prototype.setupMotion = function() {
    if (this._actor.isMotionRequested()) {
        this.startMotion(this._actor.motionType());
        this._actor.clearMotion();
    }
};
//安装武器动画
Sprite_Actor.prototype.setupWeaponAnimation = function() {
    if (this._actor.isWeaponAnimationRequested()) {
        this._weaponSprite.setup(this._actor.weaponImageId());
        this._actor.clearWeaponAnimation();
    }
};
//开始动作
Sprite_Actor.prototype.startMotion = function(motionType) {
    var newMotion = Sprite_Actor.MOTIONS[motionType];
    if (this._motion !== newMotion) {
        this._motion = newMotion;
        this._motionCount = 0;
        this._pattern = 0;
    }
};
//更新目标位置
Sprite_Actor.prototype.updateTargetPosition = function() {
    if (this._actor.isInputting() || this._actor.isActing()) {
        this.stepForward();
    } else if (this._actor.canMove() && BattleManager.isEscaped()) {
        this.retreat();
    } else if (!this.inHomePosition()) {
        this.stepBack();
    }
};
//更新位图
Sprite_Actor.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    var name = this._actor.battlerName();
    if (this._battlerName !== name) {
        this._battlerName = name;
        this._mainSprite.bitmap = ImageManager.loadSvActor(name);
    }
};
//更新帧
Sprite_Actor.prototype.updateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    var bitmap = this._mainSprite.bitmap;
    if (bitmap) {
        var motionIndex = this._motion ? this._motion.index : 0;
        var pattern = this._pattern < 3 ? this._pattern : 1;
        var cw = bitmap.width / 9;
        var ch = bitmap.height / 6;
        var cx = Math.floor(motionIndex / 6) * 3 + pattern;
        var cy = motionIndex % 6;
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
    }
};
//更新移动
Sprite_Actor.prototype.updateMove = function() {
    var bitmap = this._mainSprite.bitmap;
    if (!bitmap || bitmap.isReady()) {
        Sprite_Battler.prototype.updateMove.call(this);
    }
};
//更新动作
Sprite_Actor.prototype.updateMotion = function() {
    this.setupMotion();
    this.setupWeaponAnimation();
    if (this._actor.isMotionRefreshRequested()) {
        this.refreshMotion();
        this._actor.clearMotion();
    }
    this.updateMotionCount();
};
//更新动作计数
Sprite_Actor.prototype.updateMotionCount = function() {
    if (this._motion && ++this._motionCount >= this.motionSpeed()) {
        if (this._motion.loop) {
            this._pattern = (this._pattern + 1) % 4;
        } else if (this._pattern < 2) {
            this._pattern++;
        } else {
            this.refreshMotion();
        }
        this._motionCount = 0;
    }
};
//动作速度
Sprite_Actor.prototype.motionSpeed = function() {
    return 12;
};
//刷新动作
Sprite_Actor.prototype.refreshMotion = function() {
    var actor = this._actor;
    var motionGuard = Sprite_Actor.MOTIONS['guard'];
    if (actor) {
	    if (this._motion === motionGuard && !BattleManager.isInputting()) {
            return;
        }
        var stateMotion = actor.stateMotionIndex();
        if (actor.isInputting() || actor.isActing()) {
            this.startMotion('walk');
        } else if (stateMotion === 3) {
            this.startMotion('dead');
        } else if (stateMotion === 2) {
            this.startMotion('sleep');
        } else if (actor.isChanting()) {
            this.startMotion('chant');
        } else if (actor.isGuard() || actor.isGuardWaiting()) {
            this.startMotion('guard');
        } else if (stateMotion === 1) {
            this.startMotion('abnormal');
        } else if (actor.isDying()) {
            this.startMotion('dying');
        } else if (actor.isUndecided()) {
            this.startMotion('walk');
        } else {
            this.startMotion('wait');
        }
    }
};
//开始记录动作
Sprite_Actor.prototype.startEntryMotion = function() {
    if (this._actor && this._actor.canMove()) {
        this.startMotion('walk');
        this.startMove(0, 0, 30);
    } else if (!this.isMoving()) {
        this.refreshMotion();
        this.startMove(0, 0, 0);
    }
};
//步骤推进
Sprite_Actor.prototype.stepForward = function() {
    this.startMove(-48, 0, 12);
};
//步骤返回
Sprite_Actor.prototype.stepBack = function() {
    this.startMove(0, 0, 12);
};
//撤退
Sprite_Actor.prototype.retreat = function() {
    this.startMove(300, 0, 30);
};
//当移动结束
Sprite_Actor.prototype.onMoveEnd = function() {
    Sprite_Battler.prototype.onMoveEnd.call(this);
    if (!BattleManager.isBattleEnd()) {
        this.refreshMotion();
    }
};
//伤害偏移x
Sprite_Actor.prototype.damageOffsetX = function() {
    return -32;
};
//伤害偏移y
Sprite_Actor.prototype.damageOffsetY = function() {
    return 0;
};
