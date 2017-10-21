
//=============================================================================
// 自动战斗加强.js
//=============================================================================

/*:
 * @plugindesc 自动战斗计算加强
 * @author 汪汪
 * 
 * @help  
 * Game_Battler.csList = {"0":function(list){return 0}}
 * 对列表的计算 ,传入参数 list ,list包含 一个个数组 ,对数组进行分析计算
 * Game_Battler.actionModeList = {
 * //模式
 * "0": {
 *      //角色id
 *       "0": function(r,s,a,b){ return  r.isForFriend ? r.base.gainHp : - r.base.gainHp}
 *      }
 * }
 * 
 * actor  / enemy .setActionMode(mode)
 * 设置攻击模式,然后会选择对应的id(敌方为负id) 的 方法进行计算 ,方法传入值 
 *  r,s,a,b
 * 
 * r 模拟计算 
 * s ,本动作 
 * a ,使用者
 * b ,目标
 * c ,对列表的计算
 * //是朋友
 * r.isForFriend 
 * //使用
 * r.used
 * //击空概率
 * r.missed
 * //躲避概率
 * r.evaded
 * //是物理
 * r.physical
 * //是吸收
 * r.drain
 * //击中概率
 * r.hit
 * //会心概率
 * r.critical
 * //基础数据
 * r.base
 * //基础散射最大
 * r.baseMax
 * //基础伤害散射最小
 * r.baseMin
 * //暴击基础伤害
 * r.critical 
 * //基础散射最大
 * r.criticalMax
 * //基础伤害散射最小
 * r.criticalMin 
 *    //伤害内容
 *    var re = r.base
 *    //目标 获得hp
 *    re.gainHp
 *    //目标 获得mp
 *    re.gainMp
 *    //使用者 吸收hp
 *    re.drainHp
 *    //使用者 吸收mp
 *    re.drainMp 
 *    //hp归0
 *    hp0 = re.hp0
 *    //mp归0
 *    mp0 = re.mp0
 *
 * //使用者获取tp
 * r.gainTp
 * //   (通过特性)
 * //目标恢复hp
 * r.recoverHp
 * //目标恢复mp 
 * r.recoverMp
 * //目标成长([  [id,值],[id,值]  ]) 
 * r.grow
 * //目标添加状态组(  [ [状态id,概率 ] ,[状态id,概率 ] ])
 * r.addState
 * //目标移除状态组(  [ [状态id,概率 ] , [状态id,概率 ] ])
 * r.removeState
 * //目标添加buff(  [ [id,值 ] , [id,值 ]])
 * r.addBuff
 * //目标添加负面buff(  [ [id,值,概率 ] , [id,值,概率 ]   ])
 * r.addDebuff
 * //目标添加buff(  [ [id ] ,  [id ]])
 * r.removeBuff  
 * //目标学习技能组( [ [技能id ]  ,[技能id ]  ] )
 * r.learnSkill
 * 
*/




Game_Battler.csList = {
    "0": function(list){ return 0 }
}


Game_Battler.actionModeList = {
    //模式
    "0": {
        //敌人1 的设定 当目标生命值小于1/4 ,伤害和恢复的优先度值提高4倍(优先治疗/攻击 低生命目标)
        "-1": function(r,s,a,b){ 
            var v = 0
            v = r.isForFriend ? r.base.gainHp : - r.base.gainHp
            if(b.hp < b.mhp/4){
                v *= 4 
            } 
            return v
        },        //角色id 
        "0": function(r,s,a,b){ return r.isForFriend ? r.base.gainHp : - r.base.gainHp}
    }
}


/**设置动作模式 */
Game_Battler.prototype.setActionMode = function (i) {
    this._actionmode = i
};
/**动作模式 */
Game_Battler.prototype.actionMode = function () {
    return "" + (this._actionmode || 0)
};


/**动作模式 */
Game_Battler.prototype.getActionEval = function () {
    var mode = this.actionMode()
    var all = Game_Battler.actionModeList[mode]

    if (!all) {
        all = Game_Battler.actionModeList["0"]
    }
    if (!all) {
        all = { "0": function(r,s,a,b){ return r.isForFriend ? r.base.gainHp : - r.base.gainHp} }
    }

    var id = 0
    if (this.isActor()) {
        id = this.actorId()
    } else {
        id = - this.enemyId()
    }
    var ac = all[id]
    if (!ac) {
        ac = all["0"]
    }
    if (!all) {
        ac = function(r,s,a,b){ return r.isForFriend ? r.base.gainHp : - r.base.gainHp}
    }
    return ac
};





Game_Battler.prototype.items = function () {
    var list = [];
    return list;
};


Game_Battler.prototype.usableItems = function () {
    //返回 技能组() 过滤 方法(技能)
    return this.items().filter(function (item) {
        //返回 能用(技能)
        return this.canUse(item);
        //,this
    }, this);
};

Game_Enemy.prototype.skills = function () {
    var list = []
    this.enemy().actions.filter(function (a) {
        //返回 是有效动作(动作)
        return this.isActionValid(a);
        //this )
    }, this).forEach(function (action) {
        var id = action.skillId
        //如果 (不是 列表 包含(数据技能组[id]) )
        if (!list.contains($dataSkills[id])) {
            //列表 添加(数据技能组[id])
            list.push($dataSkills[id]);
        }
    });
    return list
}

Game_Enemy.prototype.usableSkills = function () {
    return this.skills().filter(function (skill) {
        //返回 能用(技能)
        return this.canUse(skill);
        //,this
    }, this);
};




/**制作动作表*/
Game_Actor.prototype.makeActionList = function () {
    //列表 = []
    var list = [];
    //动作 = 新 游戏动作(this)
    var action = new Game_Action(this);
    //动作 设置攻击()
    action.setAttack();
    //列表 添加 (动作)
    list.push(action);
    //可用技能组() 对每一个 方法(技能)
    this.usableSkills().forEach(function (skill) {
        //动作 = 新 游戏动作(this)
        action = new Game_Action(this);
        //动作 设置技能(技能id)
        action.setSkill(skill.id);
        //列表 添加 (动作)
        list.push(action);
        //,this
    }, this);
    //可用技能组() 对每一个 方法(技能)
    this.usableItems().forEach(function (skill) {
        //动作 = 新 游戏动作(this)
        action = new Game_Action(this);
        //动作 设置技能(技能id)
        action.setItem(skill.id);
        //列表 添加 (动作)
        list.push(action);
        //,this
    }, this);
    //返回 列表
    return list;
};

/**制作动作表*/
Game_Enemy.prototype.makeActionList = function () {
    //列表 = []
    var list = []; 
    //可用技能组() 对每一个 方法(技能)
    this.usableSkills().forEach(function (skill) {
        //动作 = 新 游戏动作(this)
        action = new Game_Action(this);
        //动作 设置技能(技能id)
        action.setSkill(skill.id);
        //列表 添加 (动作)
        list.push(action);
        //,this
    }, this);
    //可用技能组() 对每一个 方法(技能)
    this.usableItems().forEach(function (skill) {
        //动作 = 新 游戏动作(this)
        action = new Game_Action(this);
        //动作 设置技能(技能id)
        action.setItem(skill.id);
        //列表 添加 (动作)
        list.push(action);
        //,this
    }, this);
    //返回 列表
    return list;
};
/**制作动作组*/
Game_Enemy.prototype.makeActions = function() {
    //游戏战斗者 制作动作组 呼叫()this
    Game_Battler.prototype.makeActions.call(this);
    this.makeAutoBattleActions()
};
 


Game_Enemy.prototype.makeAutoBattleActions = function() {
    //循环(开始时 i = 0 ;当 i < 动作组总个数 ; 每一次 i++)
    for (var i = 0; i < this.numActions(); i++) {
        //列表 = 制作动作表()
        var list = this.makeActionList();
        //最大值 = 数字 最小值
        var maxValue = Number.MIN_VALUE;
        //循环(开始时 j = 0 ; j< 列表 长度 ;每一次 j++ )
        for (var j = 0; j < list.length; j++) {
            //值 = 列表[j] 评估()
            var value = list[j].evaluate();
            //如果(值 > 最大值 )
            if (value > maxValue) {
                //最大值 = 值
                maxValue = value;
                //设置动作(i , 列表[j] )
                this.setAction(i, list[j]);
            }
        }
    }
    //设置动作状态( "waiting"//等待 ) 
    this.setActionState('waiting');
};


Game_Action.prototype.evaluate0 = Game_Action.prototype.evaluate
/**特性对象组*/
Game_Action.prototype.evaluate = function () {
    var subject = this.subject()
    var fun = subject.getActionEval()
    var value = 0
    this.itemTargetCandidates().forEach(function (target) {
        var r = this.evalApply(target);
        var s = this
        var a = this.subject()
        var b = target 
        try {
            var targetValue = fun(r, s, a, b) 
        } catch (error) {
            var targetValue = 0
        }
        //console.log( targetValue , fun,r,c,a,b ) 

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
    value *= this.numRepeats();
    if (value > 0) {
        value += Math.random();
    }
    return value;
}
Game_Action.prototype.evalApply = function (target, result) {
    var result = result || {}
    result.isForOpponent = this.isForOpponent()
    result.isForFriend = this.isForFriend()

    result.recoverHp = 0
    result.recoverMp = 0
    result.gainTp = 0
    result.grow = []
    result.addState = []
    result.removeState = []
    result.addBuff = []
    result.addDebuff = []
    result.removeBuff = []
    result.learnSkill = []


    result.used = this.testApply(target);
    result.missed = (1 - this.itemHit(target)) || 0;
    result.evaded = (this.itemEva(target)) || 0;
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    result.hit = (result.used && ((1 - result.missed) * (1 - result.evaded))) || 0;
    //如果 (项目 伤害 种类 > 0 )
    if (this.item().damage.type > 0) {
        //结果 会心 = ( 数学 随机数 < 项目会心比例(目标) )
        result.critical = this.itemCri(target);
        //值 = 制作伤害数据 (目标 , 结果 会心)
        this.evalMakeDamageValue(target, result);
    }
    //项目 效果组 对每一个 (效果)
    this.item().effects.forEach(function (effect) {
        //应用项目效果(目标 效果)
        this.evalApplyItemEffect(target, effect, result);
        //this
    }, this);
    //应用项目使用者效果(目标)
    this.evalApplyItemUserEffect(target, result);
    return result
}




/**计算制作伤害数据
 * @param {object} target 对象
 * @param {boolean} critical 会心
 * @return {number} 
 * */
Game_Action.prototype.evalMakeDamageValue = function (target, result) {
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
    result.base = this.evalApplyVariance(value, item.damage.variance, target, 0)
    result.baseMax = this.evalApplyVariance(value, item.damage.variance, target, 1)
    result.baseMin = this.evalApplyVariance(value, item.damage.variance, target, -1)
    value = this.applyCritical(value);
    result.critical = this.evalApplyVariance(value, item.damage.variance, target, 0)
    result.criticalMax = this.evalApplyVariance(value, item.damage.variance, target, 1)
    result.criticalMin = this.evalApplyVariance(value, item.damage.variance, target, -1)

    return result;
};


/**计算应用分散
 * @param {number} damage 伤害 
 * @param {number} variance 偏差
 * @return {number} 
 * */
Game_Action.prototype.evalApplyVariance = function (damage, variance, target, type) {
    var amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
    var v = 0
    if (!type) {
    } else if (type == 1) {
        v = amp;
    } else if (type == -1) {
        v = - amp;
    }
    var damage = damage >= 0 ? damage + v : damage - v
    damage = damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1)
    return this.evalExecuteDamage(target, { value: Math.round(damage) })
};


Game_Action.prototype.evalExecuteDamage = function (target, re) {
    var value = re.value
    re.gainHp = 0
    re.gainMp = 0
    re.drainHp = 0
    re.drainMp = 0
    re.hp0 = 0
    re.mp0 = 0
    if (this.isHpEffect()) { 
        value = Math.max(target.hp - target.mhp, value) 
        if (this.isDrain()) {
            value = Math.min(target.hp, value);
            re.drainHp = value
        } else {
            value = value
            re.drainHp = 0
        }
        re.gainHp = -value
        if (target.hp <= value) {
            re.hp0 = 1
        }
    }
    if (this.isMpEffect()) {
        value = Math.max(target.mp - target.mmp, value)
        if (!this.isMpRecover()) {
            value = Math.min(target.mp, re.value);
        }
        re.gainMp = -value
        re.drainMp = 0
        if (this.isDrain()) {
            re.drainMp = value
        }
        if (target.mp <= value) {
            re.mp0 = 1
        }
    }
    return re
};

/**应用项目效果
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalApplyItemEffect = function (target, effect, result) {
    //检查 (效果 编码) 
    switch (effect.code) {
        case Game_Action.EFFECT_RECOVER_HP:
            this.evalItemEffectRecoverHp(target, effect, result);
            //跳出
            break;
        //当 游戏动作 效果恢复mp
        case Game_Action.EFFECT_RECOVER_MP:
            //项目效果恢复mp( 目标 效果 )
            this.evalItemEffectRecoverMp(target, effect, result);
            //跳出
            break;
        case Game_Action.EFFECT_GAIN_TP:
            this.evalItemEffectGainTp(target, effect, result);
            break;
        case Game_Action.EFFECT_ADD_STATE:
            this.evalItemEffectAddState(target, effect, result);
            break;
        case Game_Action.EFFECT_REMOVE_STATE:
            this.evalItemEffectRemoveState(target, effect, result);
            break;
        case Game_Action.EFFECT_ADD_BUFF:
            this.evalItemEffectAddBuff(target, effect, result);
            break;
        case Game_Action.EFFECT_ADD_DEBUFF:
            this.evalItemEffectAddDebuff(target, effect, result);
            break;
        case Game_Action.EFFECT_REMOVE_BUFF:
            this.evalItemEffectRemoveBuff(target, effect, result);
            break;
        case Game_Action.EFFECT_REMOVE_DEBUFF:
            this.evalItemEffectRemoveDebuff(target, effect, result);
            break;
        case Game_Action.EFFECT_SPECIAL:
            //项目效果额外的( 目标 效果 )
            this.evalItemEffectSpecial(target, effect, result);
            //跳出
            break;
        //当 游戏动作 效果生长
        case Game_Action.EFFECT_GROW:
            //项目效果生长( 目标 效果 )
            this.evalItemEffectGrow(target, effect, result);
            //跳出
            break;
        //当 游戏动作 效果学习技能
        case Game_Action.EFFECT_LEARN_SKILL:
            //项目效果学习技能( 目标 效果 )
            this.evalItemEffectLearnSkill(target, effect, result);
            //跳出
            break;
        //当 游戏动作 效果公共事件
        case Game_Action.EFFECT_COMMON_EVENT:
            //项目效果公共事件( 目标 效果 )	
            this.evalItemEffectCommonEvent(target, effect, result);
            //跳出
            break;
    }
};
/**项目效果恢复hp
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectRecoverHp = function (target, effect, result) {
    //值 = (目标 mhp * 效果 值1 + 效果 值2 ) * 目标 恢复效果比例
    var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    //值 =  数学 向下取整 ( 值 )
    value = Math.floor(value);
    result.recoverHp += value

};
/**项目效果恢复mp
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectRecoverMp = function (target, effect, result) {
    //值 = (目标 mmp * 效果 值1 + 效果 值2 ) * 目标 恢复效果比例 
    var value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    //如果 是物品
    if (this.isItem()) {
        //值 *= 主体 药物知识
        value *= this.subject().pha;
    }
    //值 =  数学 向下取整 ( 值 )
    value = Math.floor(value);
    var value = Math.floor(effect.value1);
    result.recoverMp += value
};
/**项目效果获得tp
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectGainTp = function (target, effect, result) {
    var value = Math.floor(effect.value1);
    result.gainTp += value
};
/**项目效果添加状态
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectAddState = function (target, effect, result) {
    //如果( 效果 数据id === 0 )
    if (effect.dataId === 0) {
        //项目效果添加攻击状态 ( 目标, 效果 )
        this.evalItemEffectAddAttackState(target, effect, result);
        //否则 
    } else {
        //项目效果添加普通状态  ( 目标, 效果 )
        this.evalItemEffectAddNormalState(target, effect, result);
    }
};
/**项目效果添加攻击状态
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectAddAttackState = function (target, effect, result) {
    //主体 攻击状态 对每一个 状态id
    this.subject().attackStates().forEach(function (stateId) {
        var chance = effect.value1;
        chance *= target.stateRate(stateId);
        chance *= this.subject().attackStatesRate(stateId);
        chance *= this.lukEffectRate(target);
        result.addState.push([stateId, chance]);
    }.bind(this), target);
};
/**项目效果添加普通状态
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectAddNormalState = function (target, effect, result) {
    var chance = effect.value1;
    if (!this.isCertainHit()) {
        //概率 *= 目标 状态比例(效果 数据id)
        chance *= target.stateRate(effect.dataId);
        //概率 *= 运气效果比例(目标)
        chance *= this.lukEffectRate(target);
    }
    result.addState.push([effect.dataId, chance]);
};
/**项目效果移除状态
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectRemoveState = function (target, effect, result) {
    var chance = effect.value1;

    result.removeState.push([effect.dataId, chance]);
};
/**项目效果添加正面效果
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectAddBuff = function (target, effect, result) {
    result.addBuff.push([effect.dataId, effect.value1]);
};
/**项目效果添加负面效果
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectAddDebuff = function (target, effect, result) {
    var chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    result.addBuff.push([effect.dataId, effect.value1, chance]);
};
/**项目效果移除正面效果
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectRemoveBuff = function (target, effect, result) {
    //如果 ( 目标 是正面效果影响(效果 数据id) )
    if (target.isBuffAffected(effect.dataId)) { 
        result.removeBuff.push([effect.dataId]);
    }
};
/**项目效果移除负面效果
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectRemoveDebuff = function (target, effect, result) {
    if (target.isDebuffAffected(effect.dataId)) {
        result.removeBuff.push([effect.dataId]);
    }
};
/**项目效果额外的
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectSpecial = function (target, effect, result) {
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        result.escape = true
    }
};
/**项目效果生长
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectGrow = function (target, effect, result) {

    result.grow.push([effect.dataId, Math.floor(effect.value1)])
};
/**项目效果学习技能
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.evalItemEffectLearnSkill = function (target, effect, result) {
    if (target.isActor()) {
        result.learnSkill.push([effect.dataId])
    }
};
Game_Action.prototype.evalApplyItemUserEffect = function (target, result) {
    var value = Math.floor(this.item().tpGain * this.subject().tcr);
    result.gainTp += value
};

