
//-----------------------------------------------------------------------------
// Game_Battler
// 游戏战斗者
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.
// 游戏角色和游戏敌人的超级类.包含精灵和动作的方法

function Game_Battler() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Game_Battler.prototype = Object.create(Game_BattlerBase.prototype);
//设置创造者
Game_Battler.prototype.constructor = Game_Battler;
//初始化
Game_Battler.prototype.initialize = function() {
    Game_BattlerBase.prototype.initialize.call(this);
};
//初始化成员
Game_Battler.prototype.initMembers = function() {
	//继承 游戏战斗基础 初始化成员
    Game_BattlerBase.prototype.initMembers.call(this);
    //动作组 = []
    this._actions = [];
    //速度 = 0
    this._speed = 0;
    //结果 = 新 游戏动作结果 
    this._result = new Game_ActionResult();
    //动作状态 = ""
    this._actionState = '';
    //最后目标索引
    this._lastTargetIndex = 0;
    //动画组 = []
    this._animations = [];
    //伤害跃上
    this._damagePopup = false;
    //效果种类 = null
    this._effectType = null;
    //动作种类 = null
    this._motionType = null;
    //武器图像id = 0
    this._weaponImageId = 0;
    //动作刷新 = false
    this._motionRefresh = false;
    //选择的 = false
    this._selected = false;
};
//清除动画组
Game_Battler.prototype.clearAnimations = function() {
	//动画组 = []
    this._animations = [];
};
//清除伤害跃上
Game_Battler.prototype.clearDamagePopup = function() {
    //伤害跃上
    this._damagePopup = false;
};
//清除武器动画
Game_Battler.prototype.clearWeaponAnimation = function() {
    //武器图像id = 0
    this._weaponImageId = 0;
};
//清除效果
Game_Battler.prototype.clearEffect = function() {
    //效果种类 = null
    this._effectType = null;
};
//清除动作
Game_Battler.prototype.clearMotion = function() {
    //动作种类 = null
    this._motionType = null;
    //动作刷新 = false
    this._motionRefresh = false;
};
//请求效果
Game_Battler.prototype.requestEffect = function(effectType) {
    //效果种类 = effectType
    this._effectType = effectType;
};
//请求动作
Game_Battler.prototype.requestMotion = function(motionType) {
    //动作种类 = motionType
    this._motionType = motionType;
};
//请求动作刷新
Game_Battler.prototype.requestMotionRefresh = function() {
    //动作刷新 = true
    this._motionRefresh = true;
};
//选择
Game_Battler.prototype.select = function() {
    //选择的 = true
    this._selected = true;
};
//取消
Game_Battler.prototype.deselect = function() {
    //选择的 = false
    this._selected = false;
};
//是动画请求
Game_Battler.prototype.isAnimationRequested = function() {
    //返回 动画组 长度>0
    return this._animations.length > 0;
};
//是伤害跃上请求
Game_Battler.prototype.isDamagePopupRequested = function() {
    //返回 伤害跃上
    return this._damagePopup;
};
//是效果请求
Game_Battler.prototype.isEffectRequested = function() {
    //返回 !!效果种类 (效果种类 ture 或者 false)
    return !!this._effectType;
};
//是动作请求
Game_Battler.prototype.isMotionRequested = function() {
    //返回 !!动作种类 (动作种类 ture 或者 false)
    return !!this._motionType;
};
//是武器动画请求
Game_Battler.prototype.isWeaponAnimationRequested = function() {
    //返回 武器图像id > 0
    return this._weaponImageId > 0;
};
//是动作刷新请求
Game_Battler.prototype.isMotionRefreshRequested = function() {
    //返回 动作刷新 
    return this._motionRefresh;
};
//是选择
Game_Battler.prototype.isSelected = function() {
    //返回 选择的 
    return this._selected;
};
//效果种类
Game_Battler.prototype.effectType = function() {
    //返回 效果种类 
    return this._effectType;
};
//动作种类
Game_Battler.prototype.motionType = function() {
    //返回 动作种类 
    return this._motionType;
};
//武器图片id
Game_Battler.prototype.weaponImageId = function() {
    //返回 武器图像id 
    return this._weaponImageId;
};
//第一个动画
Game_Battler.prototype.shiftAnimation = function() {
	//返回 动画组 第一个(并删除)
    return this._animations.shift();
};
//开始动画
Game_Battler.prototype.startAnimation = function(animationId, mirror, delay) {
	/*数据 = {
		动画id = animationId
		镜反 = mirror
		延迟 = delay
	}*/
    var data = { animationId: animationId, mirror: mirror, delay: delay };
    //动画组 添加 (数据)
    this._animations.push(data);
};
//开始伤害跃上
Game_Battler.prototype.startDamagePopup = function() {
	//伤害跃上 = true
    this._damagePopup = true;
};
//开始武器动画
Game_Battler.prototype.startWeaponAnimation = function(weaponImageId) {
	//武器图像id = weaponImageId
    this._weaponImageId = weaponImageId;
};
//动作
Game_Battler.prototype.action = function(index) {
	//返回 动作组[index索引]
    return this._actions[index];
};
//设置动作
Game_Battler.prototype.setAction = function(index, action) {
	//动作组 [index索引] = action
    this._actions[index] = action;
};
//动作组总个数
Game_Battler.prototype.numActions = function() {
	//返回 动作组 长度
    return this._actions.length;
};
//清除动作组
Game_Battler.prototype.clearActions = function() {
	//动作组 = []
    this._actions = [];
};
//结果
Game_Battler.prototype.result = function() {
	//返回 结果
    return this._result;
};
//清除结果
Game_Battler.prototype.clearResult = function() {
	//结果 清除
    this._result.clear();
};
//刷新
Game_Battler.prototype.refresh = function() {
	//继承 游戏战斗基础 刷新
    Game_BattlerBase.prototype.refresh.call(this);
    //如果 hp == 0
    if (this.hp === 0) {
	    //添加状态(死亡状态id)
        this.addState(this.deathStateId());
    } else {
	    //移除状态(死亡状态id)
        this.removeState(this.deathStateId());
    }
};
//添加状态
Game_Battler.prototype.addState = function(stateId) {
	//如果 是状态可添加(stateId状态id)
    if (this.isStateAddable(stateId)) {
	    //如果 不是 是状态影响(状态id)
        if (!this.isStateAffected(stateId)) {
	        //添加新状态(状态id)
            this.addNewState(stateId);
            //刷新
            this.refresh();
        }
        //重置状态计数(状态id)
        this.resetStateCounts(stateId);
        //结果 增加添加状态
        this._result.pushAddedState(stateId);
    }
};
//是状态可添加
Game_Battler.prototype.isStateAddable = function(stateId) {
	//返回 是活的 并且( 数据状态[状态id] (数据状态[状态id] 存在)) 并且   
    return (this.isAlive() && $dataStates[stateId] &&
            //(不是 是状态抵抗(状态id)) 并且
            !this.isStateResist(stateId) &&
            //(不是 结果 是状态移除(状态id)) 并且
            !this._result.isStateRemoved(stateId) &&
            //(不是 是状态限制(状态id))
            !this.isStateRestrict(stateId));
};
//是状态限制
Game_Battler.prototype.isStateRestrict = function(stateId) {
	//返回 数据状态[状态id] 移除通过限制 并且 是受限制的
    return $dataStates[stateId].removeByRestriction && this.isRestricted();
};
//在限制
Game_Battler.prototype.onRestrict = function() {
	//继承 游戏战斗者基础 在限制
    Game_BattlerBase.prototype.onRestrict.call(this);
    //清除动作组
    this.clearActions();
    //状态组 对每一个 状态
    this.states().forEach(function(state) {
	    //如果 状态 移除通过限制 (状态 移除通过限制 存在)
        if (state.removeByRestriction) {
	        //移除状态(状态id)
            this.removeState(state.id);
        }
    }, this);
};
//移除状态
Game_Battler.prototype.removeState = function(stateId) {
	//如果 是状态影响(状态id)
    if (this.isStateAffected(stateId)) {
	    //如果 状态id == 死亡状态id
        if (stateId === this.deathStateId()) {
	        //复苏
            this.revive();
        }
        //抹去状态(状态id)
        this.eraseState(stateId);
        //刷新
        this.refresh();
        //结果 添加移除状态(状态id)
        this._result.pushRemovedState(stateId);
    }
};
//逃跑
Game_Battler.prototype.escape = function() {
	//如果 游戏队伍 在战斗 
    if ($gameParty.inBattle()) {
	    //隐藏
        this.hide();
    }
    //清除动作组
    this.clearActions();
    //清除动作组
    this.clearStates();
    //声音管理器 播放逃跑
    SoundManager.playEscape();
};
//添加正面效果
Game_Battler.prototype.addBuff = function(paramId, turns) {
	//如果 是活的
    if (this.isAlive()) {
	    //增加效果(paramId)
        this.increaseBuff(paramId);
        //如果 是正面效果影响(paramId)
        if (this.isBuffAffected(paramId)) {
	        //结束写效果回合(paramId,turns)
            this.overwriteBuffTurns(paramId, turns);
        }
        //结果 增加添加正面效果(paramId)
        this._result.pushAddedBuff(paramId);
        //刷新
        this.refresh();
    }
};
//添加减益效果
Game_Battler.prototype.addDebuff = function(paramId, turns) {
	//如果 是活的
    if (this.isAlive()) {
	    //减少效果(paramId)
        this.decreaseBuff(paramId);
        //如果 是负面效果影响(paramId)
        if (this.isDebuffAffected(paramId)) {
	        //结束写效果回合(paramId,turns)
            this.overwriteBuffTurns(paramId, turns);
        }
        //结果 增加添加减益效果(paramId)
        this._result.pushAddedDebuff(paramId);
        //刷新
        this.refresh();
    }
};
//移除效果
Game_Battler.prototype.removeBuff = function(paramId) {
	//如果 是活的 并且 是正面效果或者负面效果影响(paramId)
    if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
	    //抹去效果(paramId)
        this.eraseBuff(paramId);
        //结果 添加移除效果(paramId)
        this._result.pushRemovedBuff(paramId);
        //刷新
        this.refresh();
    }
};
//移除战斗状态
Game_Battler.prototype.removeBattleStates = function() {
	//状态组 对每一个 状态
    this.states().forEach(function(state) {
	    //状态 移除在战斗结束
        if (state.removeAtBattleEnd) {
	        //移除状态(状态id)
            this.removeState(state.id);
        }
    }, this);
};
//移除所有效果
Game_Battler.prototype.removeAllBuffs = function() {
	//循环 i=0 ; i <效果长度 ; i++
    for (var i = 0; i < this.buffLength(); i++) {
	    //移除效果(i)
        this.removeBuff(i);
    }
};
//自动移除状态
Game_Battler.prototype.removeStatesAuto = function(timing) {
	//状态组 对每一个 状态
    this.states().forEach(function(state) {
	    //如果 是状态期满(状态id) 并且 状态 自动移除定时 == 定时  
        if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing) {
	        //移除状态(状态id)
            this.removeState(state.id);
        }
    }, this);
};
//自动移除正面效果
Game_Battler.prototype.removeBuffsAuto = function() {
	//循环 i=0 ; i <效果长度 ; i++
    for (var i = 0; i < this.buffLength(); i++) {
	    //如果 是效果期满(i)
        if (this.isBuffExpired(i)) {
	        //移除效果(i)
            this.removeBuff(i);
        }
    }
};
//移除效果 被伤害
Game_Battler.prototype.removeStatesByDamage = function() {
    this.states().forEach(function(state) {
        if (state.removeByDamage && Math.randomInt(100) < state.chanceByDamage) {
            this.removeState(state.id);
        }
    }, this);
};
//制作动作时间
Game_Battler.prototype.makeActionTimes = function() {
    return this.actionPlusSet().reduce(function(r, p) {
        return Math.random() < p ? r + 1 : r;
    }, 1);
};
//制作动作
Game_Battler.prototype.makeActions = function() {
    this.clearActions();
    if (this.canMove()) {
        var actionTimes = this.makeActionTimes();
        this._actions = [];
        for (var i = 0; i < actionTimes; i++) {
            this._actions.push(new Game_Action(this));
        }
    }
};
//速度
Game_Battler.prototype.speed = function() {
    return this._speed;
};
//制作速度
Game_Battler.prototype.makeSpeed = function() {
    this._speed = Math.min.apply(null, this._actions.map(function(action) {
        return action.speed();
    })) || 0;
};
//当前的动作
Game_Battler.prototype.currentAction = function() {
    return this._actions[0];
};
//移出当前的动作
Game_Battler.prototype.removeCurrentAction = function() {
    this._actions.shift();
};
//设置最后的目标
Game_Battler.prototype.setLastTarget = function(target) {
    if (target) {
        this._lastTargetIndex = target.index();
    } else {
        this._lastTargetIndex = 0;
    }
};
//强制动作
Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
    this.clearActions();
    var action = new Game_Action(this, true);
    action.setSkill(skillId);
    if (targetIndex === -2) {
        action.setTarget(this._lastTargetIndex);
    } else if (targetIndex === -1) {
        action.decideRandomTarget();
    } else {
        action.setTarget(targetIndex);
    }
    this._actions.push(action);
};
//用项目(技能,物品)
Game_Battler.prototype.useItem = function(item) {
    if (DataManager.isSkill(item)) {
        this.paySkillCost(item);
    } else if (DataManager.isItem(item)) {
        this.consumeItem(item);
    }
};
//消耗物品
Game_Battler.prototype.consumeItem = function(item) {
    $gameParty.consumeItem(item);
};
//获得hp
Game_Battler.prototype.gainHp = function(value) {
    this._result.hpDamage = -value;
    this._result.hpAffected = true;
    this.setHp(this.hp + value);
};
//获得mp
Game_Battler.prototype.gainMp = function(value) {
    this._result.mpDamage = -value;
    this.setMp(this.mp + value);
};
//获得tp
Game_Battler.prototype.gainTp = function(value) {
    this._result.tpDamage = -value;
    this.setTp(this.tp + value);
};
//获得无声tp
Game_Battler.prototype.gainSilentTp = function(value) {
    this.setTp(this.tp + value);
};
//初始化tp
Game_Battler.prototype.initTp = function() {
    this.setTp(Math.randomInt(25));
};
//清除tp
Game_Battler.prototype.clearTp = function() {
    this.setTp(0);
};
//改变tp 被伤害
Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
    var value = Math.floor(50 * damageRate * this.tcr);
    this.gainSilentTp(value);
};
//再生hp
Game_Battler.prototype.regenerateHp = function() {
    var value = Math.floor(this.mhp * this.hrg);
    value = Math.max(value, -this.maxSlipDamage());
    if (value !== 0) {
        this.gainHp(value);
    }
};
//最大不测伤害
Game_Battler.prototype.maxSlipDamage = function() {
    return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
};
//再生mp
Game_Battler.prototype.regenerateMp = function() {
    var value = Math.floor(this.mmp * this.mrg);
    if (value !== 0) {
        this.gainMp(value);
    }
};
//再生tp
Game_Battler.prototype.regenerateTp = function() {
    var value = Math.floor(100 * this.trg);
    this.gainSilentTp(value);
};
//再生所有
Game_Battler.prototype.regenerateAll = function() {
    if (this.isAlive()) {
        this.regenerateHp();
        this.regenerateMp();
        this.regenerateTp();
    }
};
//在战斗开始
Game_Battler.prototype.onBattleStart = function() {
    this.setActionState('undecided');
    this.clearMotion();
    if (!this.isPreserveTp()) {
        this.initTp();
    }
};
//在所有动作结束
Game_Battler.prototype.onAllActionsEnd = function() {
    this.clearResult();
    this.removeStatesAuto(1);
    this.removeBuffsAuto();
};
//在回合结束
Game_Battler.prototype.onTurnEnd = function() {
    this.clearResult();
    this.regenerateAll();
    this.updateStateTurns();
    this.updateBuffTurns();
    this.removeStatesAuto(2);
};
//在战斗结束
Game_Battler.prototype.onBattleEnd = function() {
    this.clearResult();
    this.removeBattleStates();
    this.removeAllBuffs();
    this.clearActions();
    if (!this.isPreserveTp()) {
        this.clearTp();
    }
    this.appear();
};
//当伤害
Game_Battler.prototype.onDamage = function(value) {
    this.removeStatesByDamage();
    this.chargeTpByDamage(value / this.mhp);
};
//设置动作状态
Game_Battler.prototype.setActionState = function(actionState) {
    this._actionState = actionState;
    this.requestMotionRefresh();
};
//是未定的
Game_Battler.prototype.isUndecided = function() {
    return this._actionState === 'undecided';
};
//是输入
Game_Battler.prototype.isInputting = function() {
    return this._actionState === 'inputting';
};
//是等待
Game_Battler.prototype.isWaiting = function() {
    return this._actionState === 'waiting';
};
//是演出
Game_Battler.prototype.isActing = function() {
    return this._actionState === 'acting';
};
//是吟唱
Game_Battler.prototype.isChanting = function() {
	//如果 是等待
    if (this.isWaiting()) {
	    //返回 动作组(对一些 动作)
        return this._actions.some(function(action) {
	        //返回 动作 是魔法技能
            return action.isMagicSkill();
        });
    }
    //返回 false
    return false;
};
//是防御等待
Game_Battler.prototype.isGuardWaiting = function() {
	//如果 是等待
    if (this.isWaiting()) {
	    //返回 动作组(对一些 动作)
        return this._actions.some(function(action) {
	        //返回 动作 是防御
            return action.isGuard();
        });
    }
    //返回 false
    return false;
};
//进行动作开始
Game_Battler.prototype.performActionStart = function(action) {
	//如果 不是 动作 是防御
    if (!action.isGuard()) {
	    //设置动作状态
        this.setActionState('acting');
    }
};
//进行动作
Game_Battler.prototype.performAction = function(action) {
};
//进行动作结束
Game_Battler.prototype.performActionEnd = function() {
    this.setActionState('done');
};
//进行伤害
Game_Battler.prototype.performDamage = function() {
};
//进行未命中
Game_Battler.prototype.performMiss = function() {
    SoundManager.playMiss();
};
//进行恢复
Game_Battler.prototype.performRecovery = function() {
    SoundManager.playRecovery();
};
//进行回避
Game_Battler.prototype.performEvasion = function() {
    SoundManager.playEvasion();
};
//进行魔法回避
Game_Battler.prototype.performMagicEvasion = function() {
    SoundManager.playMagicEvasion();
};
//进行反击
Game_Battler.prototype.performCounter = function() {
    SoundManager.playEvasion();
};
//进行反射
Game_Battler.prototype.performReflection = function() {
    SoundManager.playReflection();
};
//进行替代
Game_Battler.prototype.performSubstitute = function(target) {
};
//进行死亡
Game_Battler.prototype.performCollapse = function() {
};
