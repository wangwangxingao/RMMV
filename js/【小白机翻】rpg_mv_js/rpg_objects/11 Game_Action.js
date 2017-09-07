
//-----------------------------------------------------------------------------
// Game_Action
// 游戏动作
// The game object class for a battle action.
// 战斗动作的游戏对象类

function Game_Action() {
    this.initialize.apply(this, arguments);
}
//效果 恢复 hp
Game_Action.EFFECT_RECOVER_HP       = 11;
//效果 恢复 mp
Game_Action.EFFECT_RECOVER_MP       = 12;
//效果 获得 tp
Game_Action.EFFECT_GAIN_TP          = 13;
//效果 添加 状态
Game_Action.EFFECT_ADD_STATE        = 21;
//效果 移除 状态
Game_Action.EFFECT_REMOVE_STATE     = 22;
//效果 添加 增益效果
Game_Action.EFFECT_ADD_BUFF         = 31;
//效果 添加 负面效果
Game_Action.EFFECT_ADD_DEBUFF       = 32;
//效果 移除 增益效果
Game_Action.EFFECT_REMOVE_BUFF      = 33;
//效果 移除 负面效果
Game_Action.EFFECT_REMOVE_DEBUFF    = 34;
//效果 额外的
Game_Action.EFFECT_SPECIAL          = 41;
//效果 生长
Game_Action.EFFECT_GROW             = 42;
//效果 学习技能
Game_Action.EFFECT_LEARN_SKILL      = 43;
//效果 公共事件
Game_Action.EFFECT_COMMON_EVENT     = 44;
//特殊 效果 逃跑
Game_Action.SPECIAL_EFFECT_ESCAPE   = 0;
//攻击种类 必中
Game_Action.HITTYPE_CERTAIN         = 0;
//攻击种类 物理
Game_Action.HITTYPE_PHYSICAL        = 1;
//攻击种类 魔法
Game_Action.HITTYPE_MAGICAL         = 2;
//初始化
Game_Action.prototype.initialize = function(subject, forcing) {
	//主体角色id
    this._subjectActorId = 0;
    //主体敌人索引
    this._subjectEnemyIndex = -1;
    //强制的 =  forcing || false;
    this._forcing = forcing || false;
    //设置主体(subject)
    this.setSubject(subject);
    //清除
    this.clear();
};
//清除
Game_Action.prototype.clear = function() {
	//项目 = 新 游戏项目
    this._item = new Game_Item();
    //目标索引 = - 1
    this._targetIndex = -1;
};
//设置主体
Game_Action.prototype.setSubject = function(subject) {
	//如果 主体 是角色
    if (subject.isActor()) {
	    //主体角色id = 主体 角色id
        this._subjectActorId = subject.actorId();
        //主体敌人索引 = -1
        this._subjectEnemyIndex = -1;
    } else {
        //主体敌人索引 = 主体 索引
        this._subjectEnemyIndex = subject.index();
	    //主体角色id = 0
        this._subjectActorId = 0;
    }
};
//主体
Game_Action.prototype.subject = function() {
	//如果 主体角色id > 0 
    if (this._subjectActorId > 0) {
	    //返回 游戏角色组 角色(主体角色id)
        return $gameActors.actor(this._subjectActorId);
    } else {
	    //返回 游戏敌群 成员组(主体敌人索引)
        return $gameTroop.members()[this._subjectEnemyIndex];
    }
};
//朋友小组
Game_Action.prototype.friendsUnit = function() {
	//返回 主体 朋友小组
    return this.subject().friendsUnit();
};
//对手小组
Game_Action.prototype.opponentsUnit = function() {
	//返回 主体 对手小组
    return this.subject().opponentsUnit();
};
//设置敌人动作
Game_Action.prototype.setEnemyAction = function(action) {
	//如果 动作
    if (action) {
	    //设置 技能 (动作 技能id)
        this.setSkill(action.skillId);
    } else {
	    //清除
        this.clear();
    }
};
//设置攻击
Game_Action.prototype.setAttack = function() {
	//设置技能 (主体 攻击技能id)
    this.setSkill(this.subject().attackSkillId());
};
//设置防御
Game_Action.prototype.setGuard = function() {
	//设置技能 (主体 防御技能id)
    this.setSkill(this.subject().guardSkillId());
};
//设置技能
Game_Action.prototype.setSkill = function(skillId) {
	//项目 设置对象 (数据技能 技能id)
    this._item.setObject($dataSkills[skillId]);
};
//设置物品
Game_Action.prototype.setItem = function(itemId) {
	//项目 设置对象 (数据物品 物品id)
    this._item.setObject($dataItems[itemId]);
};
//设置项目对象
Game_Action.prototype.setItemObject = function(object) {
	//项目 设置对象(object)
    this._item.setObject(object);
};
//设置目标
Game_Action.prototype.setTarget = function(targetIndex) {
	//目标索引 = targetIndex
    this._targetIndex = targetIndex;
};
//项目
Game_Action.prototype.item = function() {
	//返回 项目 对象
    return this._item.object();
};
//是技能
Game_Action.prototype.isSkill = function() {
	//返回 项目 是技能
    return this._item.isSkill();
};
//是物品
Game_Action.prototype.isItem = function() {
	//返回 项目 是物品
    return this._item.isItem();
};
//重复数
Game_Action.prototype.numRepeats = function() {
	//重复 = 项目 重复数
    var repeats = this.item().repeats;
    //如果 是攻击
    if (this.isAttack()) {
	    //重复数 += 主体 攻击次数增加
        repeats += this.subject().attackTimesAdd();
    }
    //返回 向下取整( 重复数)
    return Math.floor(repeats);
};
//检查项目范围
Game_Action.prototype.checkItemScope = function(list) {
	//表 包含 (项目 范围)
    return list.contains(this.item().scope);
};
//是为了敌人
Game_Action.prototype.isForOpponent = function() {
	//检查项目范围(1, 2, 3, 4, 5, 6)
    return this.checkItemScope([1, 2, 3, 4, 5, 6]);
};
//是为了朋友
Game_Action.prototype.isForFriend = function() {
	//检查项目范围(7, 8, 9, 10, 11)
    return this.checkItemScope([7, 8, 9, 10, 11]);
};
//是为了死亡朋友
Game_Action.prototype.isForDeadFriend = function() {
	//检查项目范围(9, 10)
    return this.checkItemScope([9, 10]);
};
//是为了使用者
Game_Action.prototype.isForUser = function() {
	//检查项目范围(11)
    return this.checkItemScope([11]);
};
//是为了一个
Game_Action.prototype.isForOne = function() {
	//检查项目范围(1, 3, 7, 9, 11)
    return this.checkItemScope([1, 3, 7, 9, 11]);
};
//是为了随机
Game_Action.prototype.isForRandom = function() {
	//检查项目范围(3, 4, 5, 6)
    return this.checkItemScope([3, 4, 5, 6]);
};
//是为了所有
Game_Action.prototype.isForAll = function() {
	//检查项目范围(2, 8, 10)
    return this.checkItemScope([2, 8, 10]);
};
//需要选择
Game_Action.prototype.needsSelection = function() {
	//检查项目范围(1, 7, 9)
    return this.checkItemScope([1, 7, 9]);
};
//目标个数
Game_Action.prototype.numTargets = function() {
	//返回 是为了随机  返回 项目 范围 - 2 否则 返回  0 
    return this.isForRandom() ? this.item().scope - 2 : 0;
};
//检查伤害种类
Game_Action.prototype.checkDamageType = function(list) {
	//表 包含 项目 伤害 种类
    return list.contains(this.item().damage.type);
};
//是hp效果
Game_Action.prototype.isHpEffect = function() {
	//检查伤害种类(1, 3, 5)
    return this.checkDamageType([1, 3, 5]);
};
//是mp效果
Game_Action.prototype.isMpEffect = function() {
	//检查伤害种类(2, 4, 6)
    return this.checkDamageType([2, 4, 6]);
};
//是伤害
Game_Action.prototype.isDamage = function() {
	//检查伤害种类(1, 2)
    return this.checkDamageType([1, 2]);
};
//是恢复
Game_Action.prototype.isRecover = function() {
	//检查伤害种类(3, 4)
    return this.checkDamageType([3, 4]);
};
//是消耗
Game_Action.prototype.isDrain = function() {
	//检查伤害种类(5, 6)
    return this.checkDamageType([5, 6]);
};
//是hp恢复
Game_Action.prototype.isHpRecover = function() {
	//检查伤害种类(3)
    return this.checkDamageType([3]);
};
//是mp恢复
Game_Action.prototype.isMpRecover = function() {
	//检查伤害种类(4)
    return this.checkDamageType([4]);
};
//是必中
Game_Action.prototype.isCertainHit = function() {
	//返回 项目 攻击种类 = 游戏动作 攻击种类 必中
    return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
};
//是物理
Game_Action.prototype.isPhysical = function() {
	//返回 项目 攻击种类 = 游戏动作 攻击种类 物理
    return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
};
//是魔法
Game_Action.prototype.isMagical = function() {
	//返回 项目 攻击种类 = 游戏动作 攻击种类 魔法
    return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
};
//是攻击
Game_Action.prototype.isAttack = function() {
	//返回 项目 === 数据技能(主体 攻击技能id)
    return this.item() === $dataSkills[this.subject().attackSkillId()];
};
//是防御
Game_Action.prototype.isGuard = function() {
	//返回 项目 === 数据技能(主体 防御技能id)
    return this.item() === $dataSkills[this.subject().guardSkillId()];
};
//是魔法技能
Game_Action.prototype.isMagicSkill = function() {
	//如果 是技能 
    if (this.isSkill()) {
	    //返回 数据系统 魔法技能组 包含 项目 s种类id
        return $dataSystem.magicSkills.contains(this.item().stypeId);
    //否则
    } else {
	    //返回 false
        return false;
    }
};
//决定随机目标
Game_Action.prototype.decideRandomTarget = function() {
	//目标 
    var target;
    //如果 是为了死亡朋友
    if (this.isForDeadFriend()) {
	    //目标 = 朋友小组 随机死亡目标
        target = this.friendsUnit().randomDeadTarget();
    //否则 如果 是为了朋友
    } else if (this.isForFriend()) {
	    //目标 = 朋友小组 随机目标
        target = this.friendsUnit().randomTarget();
    //否则 
    } else {
	    //目标 = 对手小组 随机目标
        target = this.opponentsUnit().randomTarget();
    }
    //如果 目标 
    if (target) {
	    //目标索引 = 目标 索引
        this._targetIndex = target.index;
    } else {
	    //清除
        this.clear();
    }
};
//设置混乱
Game_Action.prototype.setConfusion = function() {
	//设置攻击
    this.setAttack();
};
//准备
Game_Action.prototype.prepare = function() {
	//如果 主体 是混乱的 并且 不是 强制的
    if (this.subject().isConfused() && !this._forcing) {
	    //设置混乱
        this.setConfusion();
    }
};
//是有效的
Game_Action.prototype.isValid = function() {
	//返回 强制的 并且 项目  或者  主体 能用(项目)
    return (this._forcing && this.item()) || this.subject().canUse(this.item());
};
//速度
Game_Action.prototype.speed = function() {
	//敏捷 = 主体 敏捷
    var agi = this.subject().agi;
    //速度 = 敏捷 + 随机 (向下取整  (5 + 敏捷 / 4  )  )
    var speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
    //如果 项目
    if (this.item()) {
	    //速度 += 项目速度
        speed += this.item().speed;
    }
    //如果 是攻击
    if (this.isAttack()) {
	    //速度 += 主体 攻击速度
        speed += this.subject().attackSpeed();
    }
    //返回 速度
    return speed;
};
//制造目标
Game_Action.prototype.makeTargets = function() {
	//目标组 = []
    var targets = [];
    //如果 不是 强制中 并且 主体 是混乱的
    if (!this._forcing && this.subject().isConfused()) {
	    //目标组 = [混乱目标]
        targets = [this.confusionTarget()];
    //否则 如果 是为了敌人
    } else if (this.isForOpponent()) {
	    //目标组 =  目标为了敌人
        targets = this.targetsForOpponents();
    //否则 如果 是为了朋友
    } else if (this.isForFriend()) {
	    //目标组 =  目标为了朋友
        targets = this.targetsForFriends();
    }
    //返回 重复目标(目标组)
    return this.repeatTargets(targets);
};
//重复目标
Game_Action.prototype.repeatTargets = function(targets) {
	//重复目标组 = []
    var repeatedTargets = [];
    //重复  = 重复数
    var repeats = this.numRepeats();
    //循环 开始时 i= 0 ;当 i < 目标组 长度 时;每一次 i++
    for (var i = 0; i < targets.length; i++) {
	    //目标 = 目标组[i]
        var target = targets[i];
        //如果 目标
        if (target) {
	        //循环 开始时 j = 0 ;当 j< 重复数 时;每一次j++
            for (var j = 0; j < repeats; j++) {
	            //重复目标组 添加(目标)
                repeatedTargets.push(target);
            }
        }
    }
    //返回 重复目标组
    return repeatedTargets;
};
//混乱目标
Game_Action.prototype.confusionTarget = function() {
	//检查 主体 混乱等级
    switch (this.subject().confusionLevel()) {
	//当 1 
    case 1:
    //返回 对手小组 随机目标
        return this.opponentsUnit().randomTarget();
    //当 2
    case 2:
        //如果 随机数(2) == 0 
        if (Math.randomInt(2) === 0) {
	        //返回 对手小组 随机目标
            return this.opponentsUnit().randomTarget();
        }
        //返回 朋友小组 随机目标
        return this.friendsUnit().randomTarget();
    //否则
    default:
        //返回 朋友小组 随机目标
        return this.friendsUnit().randomTarget();
    }
};
//目标为了敌人
Game_Action.prototype.targetsForOpponents = function() {
	//目标组 = []
    var targets = [];
    //小组 = 对手小组 
    var unit = this.opponentsUnit();
    //如果 是为了随机
    if (this.isForRandom()) {
        //循环 开始时 i= 0 ;当 i < 目标个数 时;每一次 i++
        for (var i = 0; i < this.numTargets(); i++) {
	        //目标组 添加 小组(随机目标)
            targets.push(unit.randomTarget());
        }
    //否则 如果 是为了一个
    } else if (this.isForOne()) {
	    //如果 目标索引 < 0 
        if (this._targetIndex < 0) {
	        //目标组 添加 小组 随机目标
            targets.push(unit.randomTarget());
        //否则
        } else {
	        //目标组 添加 小组 流畅目标(目标索引)
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    //否则
    } else {
	    //目标组 = 小组 活的成员组
        targets = unit.aliveMembers();
    }
    //返回 目标组 
    return targets;
};
//目标为了朋友
Game_Action.prototype.targetsForFriends = function() {
	//目标组 = []
    var targets = [];
    //小组 = 朋友小组 
    var unit = this.friendsUnit();
    //如果 是为了使用者
    if (this.isForUser()) {
	    //返回 [主体]
        return [this.subject()];
    //否则 如果 是为了死亡朋友
    } else if (this.isForDeadFriend()) {
	    //如果 是为了一个
        if (this.isForOne()) {
	        //目标组 添加(小组 流畅死亡目标)
            targets.push(unit.smoothDeadTarget(this._targetIndex));
        //否则
        } else {
	        //目标组
            targets = unit.deadMembers();
        }
    //否则 如果 是为了一个 
    } else if (this.isForOne()) {
	    //如果 目标索引 < 0
        if (this._targetIndex < 0) {
	        //目标组 添加(小组 流畅死亡目标)
            targets.push(unit.randomTarget());
        //否则 
        } else {
	        //目标组 添加 小组 流畅目标(目标索引)
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    //否则 
    } else {
	    //目标组 = 小组 活的成员组
        targets = unit.aliveMembers();
    }
    //返回 成员组
    return targets;
};
//评估
Game_Action.prototype.evaluate = function() {
	//值 = 0 
    var value = 0;
    this.itemTargetCandidates().forEach(function(target) {
        var targetValue = this.evaluateWithTarget(target);
        if (this.isForAll()) {
            value += targetValue;
        } else if (targetValue > value) {
            value = targetValue;
            this._targetIndex = target.index;
        }
    }, this);
    value *= this.numRepeats();
    if (value > 0) {
        value += Math.random();
    }
    return value;
};
//项目目标候选人
Game_Action.prototype.itemTargetCandidates = function() {
    if (!this.isValid()) {
        return [];
    //否则 如果 是为了敌人
    } else if (this.isForOpponent()) {
        return this.opponentsUnit().aliveMembers();
    } else if (this.isForUser()) {
        return [this.subject()];
    //否则 如果 是为了死亡朋友
    } else if (this.isForDeadFriend()) {
        return this.friendsUnit().deadMembers();
    } else {
        return this.friendsUnit().aliveMembers();
    }
};
//估值用范围
Game_Action.prototype.evaluateWithTarget = function(target) {
    if (this.isHpEffect()) {
        var value = this.makeDamageValue(target, false);
        //如果 是为了敌人
        if (this.isForOpponent()) {
            return value / Math.max(target.hp, 1);
        } else {
            var recovery = Math.min(-value, target.mhp - target.hp);
            return recovery / target.mhp;
        }
    }
};
//实验应用
Game_Action.prototype.testApply = function(target) {
    return (this.isForDeadFriend() === target.isDead() &&
            ($gameParty.inBattle() || this.isForOpponent() ||
            (this.isHpRecover() && target.hp < target.mhp) ||
            (this.isMpRecover() && target.mp < target.mmp) ||
            (this.hasItemAnyValidEffects(target))));
};
//有项目任何确实效果
Game_Action.prototype.hasItemAnyValidEffects = function(target) {
    return this.item().effects.some(function(effect) {
        return this.testItemEffect(target, effect);
    }, this);
};
//实验项目效果
Game_Action.prototype.testItemEffect = function(target, effect) {
    switch (effect.code) {
    case Game_Action.EFFECT_RECOVER_HP:
        return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
    case Game_Action.EFFECT_RECOVER_MP:
        return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
    case Game_Action.EFFECT_ADD_STATE:
        return !target.isStateAffected(effect.dataId);
    case Game_Action.EFFECT_REMOVE_STATE:
        return target.isStateAffected(effect.dataId);
    case Game_Action.EFFECT_ADD_BUFF:
        return !target.isMaxBuffAffected(effect.dataId);
    case Game_Action.EFFECT_ADD_DEBUFF:
        return !target.isMaxDebuffAffected(effect.dataId);
    case Game_Action.EFFECT_REMOVE_BUFF:
        return target.isBuffAffected(effect.dataId);
    case Game_Action.EFFECT_REMOVE_DEBUFF:
        return target.isDebuffAffected(effect.dataId);
    case Game_Action.EFFECT_LEARN_SKILL:
        return target.isActor() && !target.isLearnedSkill(effect.dataId);
    default:
        return true;
    }
};
//项目反击比例
Game_Action.prototype.itemCnt = function(target) {
    if (this.isPhysical() && target.canMove()) {
        return target.cnt;
    } else {
        return 0;
    }
};
//项目魔法反射比例
Game_Action.prototype.itemMrf = function(target) {
    if (this.isMagical()) {
        return target.mrf;
    } else {
        return 0;
    }
};
//项目击中
Game_Action.prototype.itemHit = function(target) {
    if (this.isPhysical()) {
        return this.item().successRate * 0.01 * this.subject().hit;
    } else {
        return this.item().successRate * 0.01;
    }
};
//项目闪避
Game_Action.prototype.itemEva = function(target) {
    if (this.isPhysical()) {
        return target.eva;
    } else if (this.isMagical()) {
        return target.mev;
    } else {
        return 0;
    }
};
//项目 暴击比例
Game_Action.prototype.itemCri = function(target) {
    return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
};
//应用
Game_Action.prototype.apply = function(target) {
    var result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = (Math.random() < this.itemCri(target));
            var value = this.makeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        this.item().effects.forEach(function(effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyItemUserEffect(target);
    }
};
//制作伤害数据
Game_Action.prototype.makeDamageValue = function(target, critical) {
    var item = this.item();
    var baseValue = this.evalDamageFormula(target);
    var value = baseValue * this.calcElementRate(target);
    if (this.isPhysical()) {
        value *= target.pdr;
    }
    if (this.isMagical()) {
        value *= target.mdr;
    }
    if (baseValue < 0) {
        value *= target.rec;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    return value;
};
//估值伤害公式
Game_Action.prototype.evalDamageFormula = function(target) {
    try {
        var item = this.item();
        var a = this.subject();
        var b = target;
        var v = $gameVariables._data;
        var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
        return Math.max(eval(item.damage.formula), 0) * sign;
    } catch (e) {
        return 0;
    }
};
//计算元素比例
Game_Action.prototype.calcElementRate = function(target) {
    if (this.item().damage.elementId < 0) {
        return this.elementsMaxRate(target, this.subject().attackElements());
    } else {
        return target.elementRate(this.item().damage.elementId);
    }
};
//成分最大比例
Game_Action.prototype.elementsMaxRate = function(target, elements) {
    if (elements.length > 0) {
        return Math.max.apply(null, elements.map(function(elementId) {
            return target.elementRate(elementId);
        }, this));
    } else {
        return 1;
    }
};
//应用暴击
Game_Action.prototype.applyCritical = function(damage) {
    return damage * 3;
};
//应用变化
Game_Action.prototype.applyVariance = function(damage, variance) {
    var amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
    var v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
    return damage >= 0 ? damage + v : damage - v;
};
//应用防御
Game_Action.prototype.applyGuard = function(damage, target) {
    return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
};
//执行伤害
Game_Action.prototype.executeDamage = function(target, value) {
    var result = target.result();
    if (value === 0) {
        result.critical = false;
    }
    if (this.isHpEffect()) {
        this.executeHpDamage(target, value);
    }
    if (this.isMpEffect()) {
        this.executeMpDamage(target, value);
    }
};
//执行hp伤害
Game_Action.prototype.executeHpDamage = function(target, value) {
    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    this.makeSuccess(target);
    target.gainHp(-value);
    if (value > 0) {
        target.onDamage(value);
    }
    this.gainDrainedHp(value);
};
//执行mp伤害
Game_Action.prototype.executeMpDamage = function(target, value) {
    if (!this.isMpRecover()) {
        value = Math.min(target.mp, value);
    }
    if (value !== 0) {
        this.makeSuccess(target);
    }
    target.gainMp(-value);
    this.gainDrainedMp(value);
};
//获得消耗hp
Game_Action.prototype.gainDrainedHp = function(value) {
    if (this.isDrain()) {
        this.subject().gainHp(value);
    }
};
//获取消耗mp
Game_Action.prototype.gainDrainedMp = function(value) {
    if (this.isDrain()) {
        this.subject().gainMp(value);
    }
};
//应用项目效果
Game_Action.prototype.applyItemEffect = function(target, effect) {
    switch (effect.code) {
    case Game_Action.EFFECT_RECOVER_HP:
        this.itemEffectRecoverHp(target, effect);
        break;
    case Game_Action.EFFECT_RECOVER_MP:
        this.itemEffectRecoverMp(target, effect);
        break;
    case Game_Action.EFFECT_GAIN_TP:
        this.itemEffectGainTp(target, effect);
        break;
    case Game_Action.EFFECT_ADD_STATE:
        this.itemEffectAddState(target, effect);
        break;
    case Game_Action.EFFECT_REMOVE_STATE:
        this.itemEffectRemoveState(target, effect);
        break;
    case Game_Action.EFFECT_ADD_BUFF:
        this.itemEffectAddBuff(target, effect);
        break;
    case Game_Action.EFFECT_ADD_DEBUFF:
        this.itemEffectAddDebuff(target, effect);
        break;
    case Game_Action.EFFECT_REMOVE_BUFF:
        this.itemEffectRemoveBuff(target, effect);
        break;
    case Game_Action.EFFECT_REMOVE_DEBUFF:
        this.itemEffectRemoveDebuff(target, effect);
        break;
    case Game_Action.EFFECT_SPECIAL:
        this.itemEffectSpecial(target, effect);
        break;
    case Game_Action.EFFECT_GROW:
        this.itemEffectGrow(target, effect);
        break;
    case Game_Action.EFFECT_LEARN_SKILL:
        this.itemEffectLearnSkill(target, effect);
        break;
    case Game_Action.EFFECT_COMMON_EVENT:
        this.itemEffectCommonEvent(target, effect);
        break;
    }
};
//项目效果恢复hp
Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
    var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainHp(value);
        this.makeSuccess(target);
    }
};
//项目效果 恢复 mp
Game_Action.prototype.itemEffectRecoverMp = function(target, effect) {
    var value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainMp(value);
        this.makeSuccess(target);
    }
};
//效果 获得 tp
Game_Action.prototype.itemEffectGainTp = function(target, effect) {
    var value = Math.floor(effect.value1);
    if (value !== 0) {
        target.gainTp(value);
        this.makeSuccess(target);
    }
};
//效果 添加 状态
Game_Action.prototype.itemEffectAddState = function(target, effect) {
    if (effect.dataId === 0) {
        this.itemEffectAddAttackState(target, effect);
    } else {
        this.itemEffectAddNormalState(target, effect);
    }
};
//效果 添加 攻击状态
Game_Action.prototype.itemEffectAddAttackState = function(target, effect) {
    this.subject().attackStates().forEach(function(stateId) {
        var chance = effect.value1;
        chance *= target.stateRate(stateId);
        chance *= this.subject().attackStatesRate(stateId);
        chance *= this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addState(stateId);
            this.makeSuccess(target);
        }
    }.bind(this), target);
};
//效果 添加 普通状态
Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
    var chance = effect.value1;
    if (!this.isCertainHit()) {
        chance *= target.stateRate(effect.dataId);
        chance *= this.lukEffectRate(target);
    }
    if (Math.random() < chance) {
        target.addState(effect.dataId);
        this.makeSuccess(target);
    }
};
//效果 移除 状态
Game_Action.prototype.itemEffectRemoveState = function(target, effect) {
    var chance = effect.value1;
    if (Math.random() < chance) {
        target.removeState(effect.dataId);
        this.makeSuccess(target);
    }
};
//效果 添加 增益效果
Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
    target.addBuff(effect.dataId, effect.value1);
    this.makeSuccess(target);
};
//效果 添加 负面效果
Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
    var chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    if (Math.random() < chance) {
        target.addDebuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }
};
//效果 移除 增益效果
Game_Action.prototype.itemEffectRemoveBuff = function(target, effect) {
    if (target.isBuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};
//效果 移除 负面效果
Game_Action.prototype.itemEffectRemoveDebuff = function(target, effect) {
    if (target.isDebuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};
//效果 额外的
Game_Action.prototype.itemEffectSpecial = function(target, effect) {
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        target.escape();
        this.makeSuccess(target);
    }
};
//效果 生长
Game_Action.prototype.itemEffectGrow = function(target, effect) {
    target.addParam(effect.dataId, Math.floor(effect.value1));
    this.makeSuccess(target);
};
//效果 学习技能
Game_Action.prototype.itemEffectLearnSkill = function(target, effect) {
    if (target.isActor()) {
        target.learnSkill(effect.dataId);
        this.makeSuccess(target);
    }
};
//公共事件
Game_Action.prototype.itemEffectCommonEvent = function(target, effect) {
};
//制作成功
Game_Action.prototype.makeSuccess = function(target) {
    target.result().success = true;
};
//应用项目使用者效果
Game_Action.prototype.applyItemUserEffect = function(target) {
    var value = Math.floor(this.item().tpGain * this.subject().tcr);
    this.subject().gainSilentTp(value);
};
//运气效果比例
Game_Action.prototype.lukEffectRate = function(target) {
    return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
};
//应用通用的
Game_Action.prototype.applyGlobal = function() {
    this.item().effects.forEach(function(effect) {
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
    }, this);
};
