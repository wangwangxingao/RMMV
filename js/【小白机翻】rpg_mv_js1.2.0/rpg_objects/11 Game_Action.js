
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
//效果 添加 正面效果
Game_Action.EFFECT_ADD_BUFF         = 31;
//效果 添加 负面效果
Game_Action.EFFECT_ADD_DEBUFF       = 32;
//效果 移除 正面效果
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
	//如果 (动作)
    if (action) {
	    //设置 技能 (动作 技能id)
        this.setSkill(action.skillId);
    //否则
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
	//重复 = 项目() 重复数
    var repeats = this.item().repeats;
    //如果 (是攻击() )
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
	//检查项目范围([1, 2, 3, 4, 5, 6])
    return this.checkItemScope([1, 2, 3, 4, 5, 6]);
};
//是为了朋友
Game_Action.prototype.isForFriend = function() {
	//检查项目范围([7, 8, 9, 10, 11])
    return this.checkItemScope([7, 8, 9, 10, 11]);
};
//是为了死亡朋友
Game_Action.prototype.isForDeadFriend = function() {
	//检查项目范围([9, 10])
    return this.checkItemScope([9, 10]);
};
//是为了使用者
Game_Action.prototype.isForUser = function() {
	//检查项目范围([11])
    return this.checkItemScope([11]);
};
//是为了一个
Game_Action.prototype.isForOne = function() {
	//检查项目范围([1, 3, 7, 9, 11])
    return this.checkItemScope([1, 3, 7, 9, 11]);
};
//是为了随机
Game_Action.prototype.isForRandom = function() {
	//检查项目范围([3, 4, 5, 6])
    return this.checkItemScope([3, 4, 5, 6]);
};
//是为了所有
Game_Action.prototype.isForAll = function() {
	//检查项目范围([2, 8, 10])
    return this.checkItemScope([2, 8, 10]);
};
//需要选择
Game_Action.prototype.needsSelection = function() {
	//检查项目范围([1, 7, 9])
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
//是吸收
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
	//如果 (是技能) 
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
    //如果 (是为了死亡朋友)
    if (this.isForDeadFriend()) {
	    //目标 = 朋友小组 随机死亡目标
        target = this.friendsUnit().randomDeadTarget();
    //否则 如果 (是为了朋友)
    } else if (this.isForFriend()) {
	    //目标 = 朋友小组 随机目标
        target = this.friendsUnit().randomTarget();
    //否则 
    } else {
	    //目标 = 对手小组 随机目标
        target = this.opponentsUnit().randomTarget();
    }
    //如果 (目标) 
    if (target) {
	    //目标索引 = 目标 索引
        this._targetIndex = target.index();
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
	//如果 (主体 是混乱的 并且 不是 强制的)
    if (this.subject().isConfused() && !this._forcing) {
	    //设置混乱
        this.setConfusion();
    }
};
//是有效的
Game_Action.prototype.isValid = function() {
	//返回( 强制的 并且 项目  或者  主体 能用(项目)  )
    return (this._forcing && this.item()) || this.subject().canUse(this.item());
};
//速度
Game_Action.prototype.speed = function() {
	//敏捷 = 主体 敏捷
    var agi = this.subject().agi;
    //速度 = 敏捷 + 数学 随机整数 (向下取整  (5 + 敏捷 / 4  )  )
    var speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
    //如果 (项目)
    if (this.item()) {
	    //速度 += 项目速度
        speed += this.item().speed;
    }
    //如果 (是攻击)
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
    //如果 (不是 强制中 并且 主体 是混乱的)
    if (!this._forcing && this.subject().isConfused()) {
	    //目标组 = [混乱目标]
        targets = [this.confusionTarget()];
    //否则 如果 (是为了敌人)
    } else if (this.isForOpponent()) {
	    //目标组 =  目标为了敌人
        targets = this.targetsForOpponents();
    //否则 如果 (是为了朋友)
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
    //循环 (开始时 i= 0 ;当 i < 目标组 长度 时;每一次 i++)
    for (var i = 0; i < targets.length; i++) {
	    //目标 = 目标组[i]
        var target = targets[i];
        //如果 (目标)
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
	//检查 (主体 混乱等级)
    switch (this.subject().confusionLevel()) {
	//当 1 
    case 1:
    //返回 对手小组 随机目标
        return this.opponentsUnit().randomTarget();
    //当 2
    case 2:
        //如果 (数学 随机整数(2) == 0 )
        if (Math.randomInt(2) === 0) {
	        //返回 对手小组 随机目标
            return this.opponentsUnit().randomTarget();
        }
        //返回 朋友小组 随机目标
        return this.friendsUnit().randomTarget();
    //缺省
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
    //如果( 是为了随机)
    if (this.isForRandom()) {
        //循环( 开始时 i= 0 ;当 i < 目标个数 时;每一次 i++)
        for (var i = 0; i < this.numTargets(); i++) {
	        //目标组 添加 ( 小组 随机目标)
            targets.push(unit.randomTarget());
        }
    //否则 如果 (是为了一个)
    } else if (this.isForOne()) {
	    //如果 (目标索引 < 0 )
        if (this._targetIndex < 0) {
	        //目标组 添加 (小组 随机目标)
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
    //如果 (是为了使用者)
    if (this.isForUser()) {
	    //返回 [主体]
        return [this.subject()];
    //否则 如果 (是为了死亡朋友)
    } else if (this.isForDeadFriend()) {
	    //如果 是为了一个
        if (this.isForOne()) {
	        //目标组 添加(小组 流畅死亡目标)
            targets.push(unit.smoothDeadTarget(this._targetIndex));
        //否则
        } else {
	        //目标组 = (小组 死的成员组)
            targets = unit.deadMembers();
        }
    //否则 如果( 是为了一个 )
    } else if (this.isForOne()) {
	    //如果 (目标索引 < 0)
        if (this._targetIndex < 0) {
	        //目标组 添加(小组 随机目标)
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
    //项目目标候选人 对每一个 目标
    this.itemTargetCandidates().forEach(function(target) {
	    //目标值 = 目标评价(目标)
        var targetValue = this.evaluateWithTarget(target);
        //如果  是为了所有
        if (this.isForAll()) {
	        //值 += 目标值
            value += targetValue;
        //否则 如果 目标值 > 值
        } else if (targetValue > value) {
	        //值 = 目标值
            value = targetValue;
            //目标索引 = 目标 索引
            this._targetIndex = target.index();
        }
    }, this);
    //值 *= 重复数
    value *= this.numRepeats();
    //如果 值 > 0
    if (value > 0) {
	    //值 += 随机数
        value += Math.random();
    }
    //返回 值
    return value;
};
//项目目标候选人
Game_Action.prototype.itemTargetCandidates = function() {
	//如果 (不是 是有效的 )
    if (!this.isValid()) {
	    //返回 []
        return [];
    //否则 如果 (是为了敌人)
    } else if (this.isForOpponent()) {
	    //返回 对手小组 活的成员组
        return this.opponentsUnit().aliveMembers();
    //否则 如果 (是为了使用者)
    } else if (this.isForUser()) {
		//返回 [主体]
        return [this.subject()];
    //否则 如果 (是为了死亡朋友)
    } else if (this.isForDeadFriend()) {
	    //返回 朋友小组 死的成员组
        return this.friendsUnit().deadMembers();
    //否则
    } else {
	    //返回 朋友小组 活的成员组
        return this.friendsUnit().aliveMembers();
    }
};
//目标评价
Game_Action.prototype.evaluateWithTarget = function(target) {
	//如果 ( 是hp效果 )
    if (this.isHpEffect()) {
	    //值 = 制作伤害数据
        var value = this.makeDamageValue(target, false);
        //如果 ( 是为了敌人)
        if (this.isForOpponent()) {
	        //返回 值 / 较大值(目标 hp生命值,1 )
            return value / Math.max(target.hp, 1);
        //否则
        } else {
	        //恢复 = 较小值(-值,目标 mhp全部生命值 - 目标 hp生命值 )
            var recovery = Math.min(-value, target.mhp - target.hp);
            //返回 恢复 / 目标 mhp全部生命值
            return recovery / target.mhp;
        }
    }
};
//测试应用
Game_Action.prototype.testApply = function(target) {
	//返回  
	// (是为了死亡朋友 == 目标 是死的 并且  
	//    (游戏队伍 在战斗 或者 是为了敌人 或者   
	//         (是hp效果 并且 目标hp < 目标 mhp) 或者 
	//         (是mp效果 并且 目标 mp < 目标 mmp) 或者 
	//         (有项目任何确实效果(目标))
	//    )        
	// )
    return (this.isForDeadFriend() === target.isDead() &&
            ($gameParty.inBattle() || this.isForOpponent() ||
            (this.isHpRecover() && target.hp < target.mhp) ||
            (this.isMpRecover() && target.mp < target.mmp) ||
            (this.hasItemAnyValidEffects(target))));
};
//有项目任何确实效果
Game_Action.prototype.hasItemAnyValidEffects = function(target) {
	//返回 项目 效果组 一些 效果
    return this.item().effects.some(function(effect) {
	    //返回 实验项目效果(目标 ,效果)
        return this.testItemEffect(target, effect);
    //this 
    }, this);
};
//实验项目效果
Game_Action.prototype.testItemEffect = function(target, effect) {
	//检查 (效果 编码)
    switch (effect.code) {
	//当 游戏动作 效果恢复hp
    case Game_Action.EFFECT_RECOVER_HP:
    	//返回 目标 hp <  目标 mhp || 效果 值1 < 0 || 效果 值2 < 0;
        return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
	//当 游戏动作 效果恢复mp
    case Game_Action.EFFECT_RECOVER_MP:
    	//返回 目标 mp <  目标 mmp || 效果 值1 < 0 || 效果 值2 < 0;
        return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
	//当 游戏动作 效果添加状态
    case Game_Action.EFFECT_ADD_STATE:
    	//返回 不是 目标 是状态影响 (效果 数据id)
        return !target.isStateAffected(effect.dataId);
	//当 游戏动作 效果移除状态
    case Game_Action.EFFECT_REMOVE_STATE:
    	//返回 目标 是状态影响 (效果 数据id)
        return target.isStateAffected(effect.dataId);
	//当 游戏动作 效果添加正面效果
    case Game_Action.EFFECT_ADD_BUFF:
    	//返回 不是 目标 是最大正面效果影响 (效果 数据id)
        return !target.isMaxBuffAffected(effect.dataId);
	//当 游戏动作 效果添加负面效果
    case Game_Action.EFFECT_ADD_DEBUFF:
    	//返回 不是 目标 是最大负面效果影响 (效果 数据id)
        return !target.isMaxDebuffAffected(effect.dataId);
	//当 游戏动作 效果移除正面效果
    case Game_Action.EFFECT_REMOVE_BUFF:
    	//返回 目标 是正面效果影响 (效果 数据id)
        return target.isBuffAffected(effect.dataId);
	//当 游戏动作 效果移除负面效果
    case Game_Action.EFFECT_REMOVE_DEBUFF:
    	//返回 目标 是负面效果影响 (效果 数据id)
        return target.isDebuffAffected(effect.dataId);
	//当 游戏动作 效果学习技能
    case Game_Action.EFFECT_LEARN_SKILL:
    	//返回 目标 是角色 并且 不是 目标 是学习了的技能 (效果 数据id)
        return target.isActor() && !target.isLearnedSkill(effect.dataId);
    //缺省
    default:
    	//返回 true 
        return true;
    }
};
//项目反击比例
Game_Action.prototype.itemCnt = function(target) {
	//如果 (是物理 并且 目标 能移动)
    if (this.isPhysical() && target.canMove()) {
	    //返回 目标 反击比例
        return target.cnt;
    //否则
    } else {
	    //返回 0
        return 0;
    }
};
//项目魔法反射比例
Game_Action.prototype.itemMrf = function(target) {
	//如果 (是魔法)
    if (this.isMagical()) {
	    //返回 目标 魔法反射比例
        return target.mrf;
    //否则
    } else {
	    //返回 0
        return 0;
    }
};
//项目击中
Game_Action.prototype.itemHit = function(target) {
	//如果 (是物理)
    if (this.isPhysical()) {
	    //返回 项目 成功比例 * 0.01 * 主体 命中比例
        return this.item().successRate * 0.01 * this.subject().hit;
    //否则
    } else { 
	    //返回 项目 成功比例 * 0.01  
        return this.item().successRate * 0.01;
    }
};
//项目闪避
Game_Action.prototype.itemEva = function(target) {
	//如果 (是物理)
    if (this.isPhysical()) {
	    //返回 目标 闪避比例
        return target.eva;
    //否则 如果 (是魔法)
    } else if (this.isMagical()) {
	    //返回 目标 魔法躲避比例
        return target.mev;
    //否则
    } else {
	    //返回 0
        return 0;
    }
};
//项目会心比例
Game_Action.prototype.itemCri = function(target) {
	//返回 如果 项目 伤害 会心 返回 主体 会心比例 * ( 1 - 会心回避比例) 否则 返回 0 
    return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
};
//应用
Game_Action.prototype.apply = function(target) {
	//结果 = 目标 结果 
    var result = target.result();
    //主体 清除结果
    this.subject().clearResult();
    //结果 清除
    result.clear();
    //结果 使用的 = 测试应用(目标)
    result.used = this.testApply(target);
    //结果 未击中的 = (结果 使用的 并且  数学 随机数 >= 项目击中(目标)  )
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    //结果 闪避的 = (不是 结果 未击中的  并且 数学 随机数 < 项目闪避(目标)
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    //结果 物理 = 是物理
    result.physical = this.isPhysical();
    //结果 吸收 = 是吸收
    result.drain = this.isDrain();
    //结果 (是击中)
    if (result.isHit()) {
	    //如果 (项目 伤害 种类 > 0 )
        if (this.item().damage.type > 0) {
	        //结果 会心 = ( 数学 随机数 < 项目会心比例(目标) )
            result.critical = (Math.random() < this.itemCri(target));
            //值 = 制作伤害数据 (目标 , 结果 会心)
            var value = this.makeDamageValue(target, result.critical);
            //执行伤害 (目标 ,值)
            this.executeDamage(target, value);
        }
        //项目 效果组 对每一个 (效果)
        this.item().effects.forEach(function(effect) {
	        //应用项目效果(目标 效果)
            this.applyItemEffect(target, effect);
        //this
        }, this);
        //应用项目使用者效果(目标)
        this.applyItemUserEffect(target);
    }
};
//制作伤害数据
Game_Action.prototype.makeDamageValue = function(target, critical) {
	//项目 = 项目
    var item = this.item();
    //基础值 = 执行伤害公式(目标)
    var baseValue = this.evalDamageFormula(target);
    //值 = 基础值 * 计算元素比例
    var value = baseValue * this.calcElementRate(target);
    //如果 (是物理)
    if (this.isPhysical()) {
	    //值 *= 目标 物理伤害比例
        value *= target.pdr;
    }
    //如果 (是魔法 )
    if (this.isMagical()) {
	    //值 *= 目标 魔法伤害比例
        value *= target.mdr;
    }
    //如果 (基础值 <0)
    if (baseValue < 0) {
	    //值 *= 恢复效果比例
        value *= target.rec;
    }
    //如果 (会心)
    if (critical) {
	    //值 = 应用会心(值)
        value = this.applyCritical(value);
    }
    //值 =  应用分散(值, 项目 伤害 分散)
    value = this.applyVariance(value, item.damage.variance);
    //值 = 应用防御 (值 ,目标)
    value = this.applyGuard(value, target);
    //值 = 数学 向上取最近整数(值)
    value = Math.round(value);
    //返回 值
    return value;
};
//执行伤害公式
Game_Action.prototype.evalDamageFormula = function(target) {
	//测试
    try {
	    //项目 = 项目
        var item = this.item();
        //a = 主体
        var a = this.subject();
        //b = 目标
        var b = target;
        //v = 游戏变量 _数据
        var v = $gameVariables._data;
        //符号 = 如果 (  [3,4] 包含(项目 伤害 种类) ) 返回 -1 否则 返回 1
        var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
        //值 = 数学 最大 (  执行(项目 伤害 公式), 0 ) * 符号
        var value = Math.max(eval(item.damage.formula), 0) * sign;
        //如果 (  是非法的数字(值) ) 值 = 0
        if (isNaN(value)) value = 0;
        //返回 值
        return value;
    //如果错误(e)
    } catch (e) {
	    //返回 0 
        return 0;
    }
};
//计算元素比例
Game_Action.prototype.calcElementRate = function(target) {
	//如果 项目 伤害 元素id < 0 
    if (this.item().damage.elementId < 0) {
	    //返回 元素最大比例(目标 , 主体 攻击元素)
        return this.elementsMaxRate(target, this.subject().attackElements());
    //否则 
    } else {
	    //返回 目标 元素比例 (项目 伤害 元素id)
        return target.elementRate(this.item().damage.elementId);
    }
};
//元素最大比例
Game_Action.prototype.elementsMaxRate = function(target, elements) {
	//如果 ( 元素 长度 > 0 )
    if (elements.length > 0) {
	    //返回 数学 最大 应用 (null , 元素 映射 ( 元素id)
        return Math.max.apply(null, elements.map(function(elementId) {
	        //返回 目标 元素比例(元素id)
            return target.elementRate(elementId);
        //this
        }, this));
    //否则
    } else {
	    //返回 1 
        return 1;
    }
};
//应用会心
Game_Action.prototype.applyCritical = function(damage) {
	//返回 伤害 * 3 
    return damage * 3;
};
//应用分散
Game_Action.prototype.applyVariance = function(damage, variance) {
	//amp = 数学 向下取整 ( 数学 最大值  ( 数学 绝对值( 伤害 )* 偏差 /100  , 0 ) )
    var amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
    //v =  数学 随机整数 (amp + 1 ) + 数学 随机整数 (amp + 1 ) - amp
    var v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
    //返回  如果 伤害 >=0 返回 伤害 + v 否则 返回 伤害 - v 
    return damage >= 0 ? damage + v : damage - v;
};
//应用防御
Game_Action.prototype.applyGuard = function(damage, target) {
	//返回 伤害 / ( 如果 伤害 >0 并且 目标 是防御  返回 2 * 目标 防守效果比例 否则 返回 1 )
    return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
};
//执行伤害
Game_Action.prototype.executeDamage = function(target, value) {
	//结果 = 目标 结果
    var result = target.result();
    //如果 ( 值 === 0 )
    if (value === 0) {
	    //结果 会心 = false
        result.critical = false;
    }
    //如果  ( 是hp效果)
    if (this.isHpEffect()) {
	    //执行hp伤害( 目标 , 值 )
        this.executeHpDamage(target, value);
    }
    //如果 ( 是mp效果 )
    if (this.isMpEffect()) {
	    //执行mp伤害( 目标 , 值 )
        this.executeMpDamage(target, value);
    }
};
//执行hp伤害
Game_Action.prototype.executeHpDamage = function(target, value) {
	//如果 (是吸收)
    if (this.isDrain()) {
	    //值 = 数学 较小值( 目标 hp , 值 ) 
        value = Math.min(target.hp, value);
    }
    //制作成功(目标)
    this.makeSuccess(target);
    //目标 获得hp( -值 )
    target.gainHp(-value);
    //如果 值 > 0
    if (value > 0) {
	    //目标 当伤害( 值 )
        target.onDamage(value);
    }
    //获得吸收hp( 值 )
    this.gainDrainedHp(value);
};
//执行mp伤害
Game_Action.prototype.executeMpDamage = function(target, value) {
	//如果 (不是 是mp恢复)
    if (!this.isMpRecover()) {
	    //值 = 数学 较小值( 目标 mp , 值 ) 
        value = Math.min(target.mp, value);
    }
    //如果 ( 值 !== 0 )
    if (value !== 0) {
    	//制作成功(目标)
        this.makeSuccess(target);
    }
    //目标 获得mp( -值 ) 
    target.gainMp(-value);
    //获得吸收mp( 值 )
    this.gainDrainedMp(value);
};
//获得吸收hp
Game_Action.prototype.gainDrainedHp = function(value) {
	//如果 (是吸收)
    if (this.isDrain()) {
	    //主体 获得hp( 值 ) 
        this.subject().gainHp(value);
    }
};
//获取吸收mp
Game_Action.prototype.gainDrainedMp = function(value) {
	//如果 (是吸收)
    if (this.isDrain()) {
	    //主体 获得mp( 值 ) 
        this.subject().gainMp(value);
    }
};
//应用项目效果
Game_Action.prototype.applyItemEffect = function(target, effect) {
	//检查 (效果 编码) 
    switch (effect.code) {
	//当 游戏动作 效果恢复hp
    case Game_Action.EFFECT_RECOVER_HP:
		//项目效果恢复hp( 目标 效果 )
        this.itemEffectRecoverHp(target, effect);
        //跳出
        break;
	//当 游戏动作 效果恢复mp
    case Game_Action.EFFECT_RECOVER_MP:
		//项目效果恢复mp( 目标 效果 )
        this.itemEffectRecoverMp(target, effect);
        //跳出
        break;
	//当 游戏动作 效果获得tp
    case Game_Action.EFFECT_GAIN_TP:
		//项目效果获得tp ( 目标 效果 )
        this.itemEffectGainTp(target, effect);
        //跳出
        break;
	//当 游戏动作 效果添加状态
    case Game_Action.EFFECT_ADD_STATE:
		//项目效果添加状态( 目标 效果 )
        this.itemEffectAddState(target, effect);
        //跳出
        break;
	//当 游戏动作 效果移除状态
    case Game_Action.EFFECT_REMOVE_STATE:
		//项目效果移除状态( 目标 效果 )
        this.itemEffectRemoveState(target, effect);
        //跳出
        break;
	//当 游戏动作 效果添加正面效果
    case Game_Action.EFFECT_ADD_BUFF:
		//项目效果添加正面效果( 目标 效果 )
        this.itemEffectAddBuff(target, effect);
        //跳出
        break;
	//当 游戏动作 效果添加负面效果
    case Game_Action.EFFECT_ADD_DEBUFF:
		//项目效果添加负面效果( 目标 效果 )
        this.itemEffectAddDebuff(target, effect);
        //跳出
        break;
	//当 游戏动作 效果移除正面效果
    case Game_Action.EFFECT_REMOVE_BUFF:  
		//项目效果移除正面效果( 目标 效果 )
        this.itemEffectRemoveBuff(target, effect);
        //跳出
        break;
	//当 游戏动作 效果移除负面效果
    case Game_Action.EFFECT_REMOVE_DEBUFF:
		//项目效果移除负面效果( 目标 效果 )
        this.itemEffectRemoveDebuff(target, effect);
        break;
	//当 游戏动作 效果额外的
    case Game_Action.EFFECT_SPECIAL:
		//项目效果额外的( 目标 效果 )
        this.itemEffectSpecial(target, effect);
        //跳出
        break;
	//当 游戏动作 效果生长
    case Game_Action.EFFECT_GROW:
		//项目效果生长( 目标 效果 )
        this.itemEffectGrow(target, effect);
        //跳出
        break;
	//当 游戏动作 效果学习技能
    case Game_Action.EFFECT_LEARN_SKILL:
		//项目效果学习技能( 目标 效果 )
        this.itemEffectLearnSkill(target, effect);
        //跳出
        break;
	//当 游戏动作 效果公共事件
    case Game_Action.EFFECT_COMMON_EVENT:
		//项目效果公共事件( 目标 效果 )	
        this.itemEffectCommonEvent(target, effect); 
        //跳出
        break;
    }
};
//项目效果恢复hp
Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
	//值 = (目标 mhp * 效果 值1 + 效果 值2 ) * 目标 恢复效果比例
    var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    //如果 是物品
    if (this.isItem()) {
	    //值 *= 主体 药物知识
        value *= this.subject().pha;
    }
    //值 =  数学 向下取整 ( 值 )
    value = Math.floor(value);
    //如果 (值 !== 0)
    if (value !== 0) {
	    //目标 获得hp( 值 ) 
        target.gainHp(value);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
//项目效果恢复mp
Game_Action.prototype.itemEffectRecoverMp = function(target, effect) {
	//值 = (目标 mmp * 效果 值1 + 效果 值2 ) * 目标 恢复效果比例 
    var value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    //如果 是物品
    if (this.isItem()) {
	    //值 *= 主体 药物知识
        value *= this.subject().pha;
    }
    //值 =  数学 向下取整 ( 值 )
    value = Math.floor(value);
    //如果 (值 !== 0)
    if (value !== 0) {
	    //目标 获得mp( 值 ) 
        target.gainMp(value);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
//项目效果获得tp
Game_Action.prototype.itemEffectGainTp = function(target, effect) {
	//值 = 数学 向下取整( 效果 值1  ) 
    var value = Math.floor(effect.value1);
    //如果( 值 !== 0 )
    if (value !== 0) {
	    //目标 获得tp( 值 ) 
        target.gainTp(value);
        //制作成功 目标(目标)
        this.makeSuccess(target);
    }
};
//项目效果添加状态
Game_Action.prototype.itemEffectAddState = function(target, effect) {
	//如果( 效果 数据id === 0 )
    if (effect.dataId === 0) {
	    //项目效果添加攻击状态 ( 目标, 效果 )
        this.itemEffectAddAttackState(target, effect);
    //否则 
    } else {
	    //项目效果添加普通状态  ( 目标, 效果 )
        this.itemEffectAddNormalState(target, effect);
    }
};
//项目效果添加攻击状态
Game_Action.prototype.itemEffectAddAttackState = function(target, effect) {
	//主体 攻击状态 对每一个 状态id
    this.subject().attackStates().forEach(function(stateId) {
	    //概率 =  效果 值1
        var chance = effect.value1;
        //概率 *= 目标 状态比例(状态id)
        chance *= target.stateRate(stateId);
        //概率 *= 主体 攻击状态比例(状态id) 
        chance *= this.subject().attackStatesRate(stateId);
        //概率 *= 运气效果比例(目标)
        chance *= this.lukEffectRate(target);
        //如果 数学 随机数 < 概率
        if (Math.random() < chance) {
	        //目标 添加状态(状态id)
            target.addState(stateId);
        	//制作成功 (目标)
            this.makeSuccess(target);
        }
    //绑定 this ,目标 
    }.bind(this), target);
};
//项目效果添加普通状态
Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
	//概率 = 效果 值1
    var chance = effect.value1;
    //如果(不是 是必中)
    if (!this.isCertainHit()) {
	    //概率 *= 目标 状态比例(效果 数据id)
        chance *= target.stateRate(effect.dataId);
        //概率 *= 运气效果比例(目标)
        chance *= this.lukEffectRate(target);
    }
    //如果 (数学 随机数 < 概率)
    if (Math.random() < chance) {
	    //目标 添加状态(效果 数据id)
        target.addState(effect.dataId);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
//项目效果移除状态
Game_Action.prototype.itemEffectRemoveState = function(target, effect) {
	//概率 = 效果 值1
    var chance = effect.value1;
    //如果 (数学 随机数 < 概率)
    if (Math.random() < chance) {
	    //目标 移除状态(效果 数据id) 
        target.removeState(effect.dataId);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
//项目效果添加正面效果
Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
	//目标 添加正面效果(效果 数据id,效果 值1)
    target.addBuff(effect.dataId, effect.value1);
    //制作成功 (目标)
    this.makeSuccess(target);
};
//项目效果添加负面效果
Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
	//概率 = 目标 负面效果比例 ( 效果 数据id )  * 运气效果比例(目标)
    var chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    //如果 (数学 随机数 < 概率) 
    if (Math.random() < chance) {
	    //目标 添加负面效果(效果 数据id , 效果 值1) 
        target.addDebuff(effect.dataId, effect.value1);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
//项目效果移除正面效果
Game_Action.prototype.itemEffectRemoveBuff = function(target, effect) {
	//如果 ( 目标 是正面效果影响(效果 数据id) )
    if (target.isBuffAffected(effect.dataId)) {
	    //目标 移除正面效果(效果 数据id)
        target.removeBuff(effect.dataId);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
//项目效果移除负面效果
Game_Action.prototype.itemEffectRemoveDebuff = function(target, effect) {
	//如果 ( 目标 是负面效果影响(效果 数据id) ) 
    if (target.isDebuffAffected(effect.dataId)) {
	    //目标 移除负面效果(效果 数据id)
        target.removeBuff(effect.dataId);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
//项目效果额外的
Game_Action.prototype.itemEffectSpecial = function(target, effect) {
    //如果 ( 效果 数据id = 游戏动作 特殊效果逃跑 )
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
	    //目标 逃跑
        target.escape();
        //制作成功(目标)
        this.makeSuccess(target);
    }
};
//项目效果生长
Game_Action.prototype.itemEffectGrow = function(target, effect) {
	//目标 增加参数( 效果 数据id , 数学 向下取整( 效果 值1)   )
    target.addParam(effect.dataId, Math.floor(effect.value1));
    //制作成功 (目标)
    this.makeSuccess(target);
};
//项目效果学习技能
Game_Action.prototype.itemEffectLearnSkill = function(target, effect) {
	//如果 ( 目标 是角色 )
    if (target.isActor()) {
	    //目标 学习技能( 效果 数据id )
        target.learnSkill(effect.dataId);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
//项目效果公共事件
Game_Action.prototype.itemEffectCommonEvent = function(target, effect) {
};
//制作成功
Game_Action.prototype.makeSuccess = function(target) {
	//目标 结果 成功 = true
    target.result().success = true;
};
//应用项目使用者效果
Game_Action.prototype.applyItemUserEffect = function(target) {
	//值 = 数学 向下取整( 项目 tp获得 * 主体 充能比例 ) 
    var value = Math.floor(this.item().tpGain * this.subject().tcr);
    //主体 获得无声tp(值)
    this.subject().gainSilentTp(value);
};
//运气效果比例
Game_Action.prototype.lukEffectRate = function(target) {
	//返回 数学 较大值 ( 1.0 + (主体 运气 - 目标运气 ) * 0.001 , 0.0 )
    return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
};
//应用通用的
Game_Action.prototype.applyGlobal = function() {
	//项目 效果组 对每一个 效果
    this.item().effects.forEach(function(effect) {
        //如果 效果 编码 === 游戏 项目效果公共事件
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
	        //游戏临时 储存公共事件(效果 数据id)
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
    //this
    }, this);
};
