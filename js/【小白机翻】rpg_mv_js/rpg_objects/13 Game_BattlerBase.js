
//-----------------------------------------------------------------------------
// Game_BattlerBase
// 游戏战斗基础
// The superclass of Game_Battler. It mainly contains parameters calculation.
// 游戏战斗者的超级类,它主要包含战斗参数

function Game_BattlerBase() {
    this.initialize.apply(this, arguments);
}

Game_BattlerBase.TRAIT_ELEMENT_RATE   = 11;
Game_BattlerBase.TRAIT_DEBUFF_RATE    = 12;
Game_BattlerBase.TRAIT_STATE_RATE     = 13;
Game_BattlerBase.TRAIT_STATE_RESIST   = 14;
Game_BattlerBase.TRAIT_PARAM          = 21;
Game_BattlerBase.TRAIT_XPARAM         = 22;
Game_BattlerBase.TRAIT_SPARAM         = 23;
Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;
Game_BattlerBase.TRAIT_ATTACK_STATE   = 32;
Game_BattlerBase.TRAIT_ATTACK_SPEED   = 33;
Game_BattlerBase.TRAIT_ATTACK_TIMES   = 34;
Game_BattlerBase.TRAIT_STYPE_ADD      = 41;
Game_BattlerBase.TRAIT_STYPE_SEAL     = 42;
Game_BattlerBase.TRAIT_SKILL_ADD      = 43;
Game_BattlerBase.TRAIT_SKILL_SEAL     = 44;
Game_BattlerBase.TRAIT_EQUIP_WTYPE    = 51;
Game_BattlerBase.TRAIT_EQUIP_ATYPE    = 52;
Game_BattlerBase.TRAIT_EQUIP_LOCK     = 53;
Game_BattlerBase.TRAIT_EQUIP_SEAL     = 54;
Game_BattlerBase.TRAIT_SLOT_TYPE      = 55;
Game_BattlerBase.TRAIT_ACTION_PLUS    = 61;
Game_BattlerBase.TRAIT_SPECIAL_FLAG   = 62;
Game_BattlerBase.TRAIT_COLLAPSE_TYPE  = 63;
Game_BattlerBase.TRAIT_PARTY_ABILITY  = 64;
Game_BattlerBase.FLAG_ID_AUTO_BATTLE  = 0;
Game_BattlerBase.FLAG_ID_GUARD        = 1;
Game_BattlerBase.FLAG_ID_SUBSTITUTE   = 2;
Game_BattlerBase.FLAG_ID_PRESERVE_TP  = 3;
Game_BattlerBase.ICON_BUFF_START      = 32;
Game_BattlerBase.ICON_DEBUFF_START    = 48;

Object.defineProperties(Game_BattlerBase.prototype, {
    // Hit Points  hp
    hp: { get: function() { return this._hp; }, configurable: true },
    // Magic Points mp
    mp: { get: function() { return this._mp; }, configurable: true },
    // Tactical Points tp
    tp: { get: function() { return this._tp; }, configurable: true },
    // Maximum Hit Points   最大攻击值
    mhp: { get: function() { return this.param(0); }, configurable: true },
    // Maximum Magic Points  最大魔法值
    mmp: { get: function() { return this.param(1); }, configurable: true },
    // ATtacK power  攻击力
    atk: { get: function() { return this.param(2); }, configurable: true },
    // DEFense power  防御力
    def: { get: function() { return this.param(3); }, configurable: true },
    // Magic ATtack power  魔法攻击力
    mat: { get: function() { return this.param(4); }, configurable: true },
    // Magic DeFense power  魔法防御力
    mdf: { get: function() { return this.param(5); }, configurable: true },
    // AGIlity  敏捷
    agi: { get: function() { return this.param(6); }, configurable: true },
    // LUcK  运气
    luk: { get: function() { return this.param(7); }, configurable: true },
    // HIT rate 攻击比例
    hit: { get: function() { return this.xparam(0); }, configurable: true },
    // EVAsion rate 闪避比例
    eva: { get: function() { return this.xparam(1); }, configurable: true },
    // CRItical rate 暴击比例
    cri: { get: function() { return this.xparam(2); }, configurable: true },
    // Critical EVasion rate 暴击回避
    cev: { get: function() { return this.xparam(3); }, configurable: true },
    // Magic EVasion rate  魔法躲避比例
    mev: { get: function() { return this.xparam(4); }, configurable: true },
    // Magic ReFlection rate 魔法反射比例
    mrf: { get: function() { return this.xparam(5); }, configurable: true },
    // CouNTer attack rate 反击比例
    cnt: { get: function() { return this.xparam(6); }, configurable: true },
    // Hp ReGeneration rate hp恢复比例
    hrg: { get: function() { return this.xparam(7); }, configurable: true },
    // Mp ReGeneration rate  mp恢复比例
    mrg: { get: function() { return this.xparam(8); }, configurable: true },
    // Tp ReGeneration rate  tp恢复比例
    trg: { get: function() { return this.xparam(9); }, configurable: true },
    // TarGet Rate  目标比例
    tgr: { get: function() { return this.sparam(0); }, configurable: true },
    // GuaRD effect rate 防守效果比例
    grd: { get: function() { return this.sparam(1); }, configurable: true },
    // RECovery effect rate  恢复效果比例
    rec: { get: function() { return this.sparam(2); }, configurable: true },
    // PHArmacology  药理学
    pha: { get: function() { return this.sparam(3); }, configurable: true },
    // Mp Cost Rate   mp消耗比例
    mcr: { get: function() { return this.sparam(4); }, configurable: true },
    // Tp Charge Rate tp使用比例
    tcr: { get: function() { return this.sparam(5); }, configurable: true },
    // Physical Damage Rate  体力伤害比例
    pdr: { get: function() { return this.sparam(6); }, configurable: true },
    // Magical Damage Rate  魔法伤害比例
    mdr: { get: function() { return this.sparam(7); }, configurable: true },
    // Floor Damage Rate    基础伤害比例
    fdr: { get: function() { return this.sparam(8); }, configurable: true },
    // EXperience Rate  经验值比例
    exr: { get: function() { return this.sparam(9); }, configurable: true }
});
//初始化
Game_BattlerBase.prototype.initialize = function() {
    this.initMembers();
};
//初始化成员
Game_BattlerBase.prototype.initMembers = function() {
    this._hp = 1;
    this._mp = 0;
    this._tp = 0;
    this._hidden = false;
    this.clearParamPlus();
    this.clearStates();
    this.clearBuffs();
};
//清除标准增加
Game_BattlerBase.prototype.clearParamPlus = function() {
    this._paramPlus = [0,0,0,0,0,0,0,0];
};
//清除状态
Game_BattlerBase.prototype.clearStates = function() {
    this._states = [];
    this._stateTurns = {};
};
//抹去状态
Game_BattlerBase.prototype.eraseState = function(stateId) {
    var index = this._states.indexOf(stateId);
    if (index >= 0) {
        this._states.splice(index, 1);
    }
    delete this._stateTurns[stateId];
};
//是状态影响
Game_BattlerBase.prototype.isStateAffected = function(stateId) {
    return this._states.contains(stateId);
};
//是死亡状态影响
Game_BattlerBase.prototype.isDeathStateAffected = function() {
    return this.isStateAffected(this.deathStateId());
};
//死亡状态id
Game_BattlerBase.prototype.deathStateId = function() {
    return 1;
};
//重置状态计数
Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    var state = $dataStates[stateId];
    var variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
    this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
};
//是状态期满
Game_BattlerBase.prototype.isStateExpired = function(stateId) {
    return this._stateTurns[stateId] === 0;
};
//更新状态回合
Game_BattlerBase.prototype.updateStateTurns = function() {
    this._states.forEach(function(stateId) {
        if (this._stateTurns[stateId] > 0) {
            this._stateTurns[stateId]--;
        }
    }, this);
};
//清除效果
Game_BattlerBase.prototype.clearBuffs = function() {
    this._buffs = [0,0,0,0,0,0,0,0];
    this._buffTurns = [0,0,0,0,0,0,0,0];
};
//抹去效果
Game_BattlerBase.prototype.eraseBuff = function(paramId) {
    this._buffs[paramId] = 0;
    this._buffTurns[paramId] = 0;
};
//效果长度
Game_BattlerBase.prototype.buffLength = function() {
    return this._buffs.length;
};
//效果
Game_BattlerBase.prototype.buff = function(paramId) {
    return this._buffs[paramId];
};
//是增益效果影响
Game_BattlerBase.prototype.isBuffAffected = function(paramId) {
    return this._buffs[paramId] > 0;
};
//是负面效果影响
Game_BattlerBase.prototype.isDebuffAffected = function(paramId) {
    return this._buffs[paramId] < 0;
};
//是增益效果或者负面效果影响
Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId) {
    return this._buffs[paramId] !== 0;
};
//是最大增益效果影响
Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
    return this._buffs[paramId] === 2;
};
//是最大负面效果影响
Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
    return this._buffs[paramId] === -2;
};
//增加效果
Game_BattlerBase.prototype.increaseBuff = function(paramId) {
    if (!this.isMaxBuffAffected(paramId)) {
        this._buffs[paramId]++;
    }
};
//减少效果
Game_BattlerBase.prototype.decreaseBuff = function(paramId) {
    if (!this.isMaxDebuffAffected(paramId)) {
        this._buffs[paramId]--;
    }
};
//结束写效果回合
Game_BattlerBase.prototype.overwriteBuffTurns = function(paramId, turns) {
	//如果 效果回合[paramId] < turns 回合
    if (this._buffTurns[paramId] < turns) {
	    //效果回合[paramId] = turns 回合
        this._buffTurns[paramId] = turns;
    }
};
//是效果期满
Game_BattlerBase.prototype.isBuffExpired = function(paramId) {
    return this._buffTurns[paramId] === 0;
};
//更新效果回合
Game_BattlerBase.prototype.updateBuffTurns = function() {
    for (var i = 0; i < this._buffTurns.length; i++) {
        if (this._buffTurns[i] > 0) {
            this._buffTurns[i]--;
        }
    }
};
//死亡
Game_BattlerBase.prototype.die = function() {
    this._hp = 0;
    this.clearStates();
    this.clearBuffs();
};
//复苏
Game_BattlerBase.prototype.revive = function() {
    if (this._hp === 0) {
        this._hp = 1;
    }
};
//状态组
Game_BattlerBase.prototype.states = function() {
    return this._states.map(function(id) {
        return $dataStates[id];
    });
};
//状态图标
Game_BattlerBase.prototype.stateIcons = function() {
    return this.states().map(function(state) {
        return state.iconIndex;
    }).filter(function(iconIndex) {
        return iconIndex > 0;
    });
};
//效果图标
Game_BattlerBase.prototype.buffIcons = function() {
    var icons = [];
    for (var i = 0; i < this._buffs.length; i++) {
        if (this._buffs[i] !== 0) {
            icons.push(this.buffIconIndex(this._buffs[i], i));
        }
    }
    return icons;
};
//状态图标索引
Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
    if (buffLevel > 0) {
        return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
    } else if (buffLevel < 0) {
        return Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId;
    } else {
        return 0;
    }
};
//所有图标
Game_BattlerBase.prototype.allIcons = function() {
    return this.stateIcons().concat(this.buffIcons());
};
//特征对象
Game_BattlerBase.prototype.traitObjects = function() {
    // Returns an array of the all objects having traits. States only here.
    return this.states();
};
//所有特征
Game_BattlerBase.prototype.allTraits = function() {
    return this.traitObjects().reduce(function(r, obj) {
        return r.concat(obj.traits);
    }, []);
};
//特征
Game_BattlerBase.prototype.traits = function(code) {
    return this.allTraits().filter(function(trait) {
        return trait.code === code;
    });
};
//特征和id
Game_BattlerBase.prototype.traitsWithId = function(code, id) {
    return this.allTraits().filter(function(trait) {
        return trait.code === code && trait.dataId === id;
    });
};
//特征pi
Game_BattlerBase.prototype.traitsPi = function(code, id) {
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        return r * trait.value;
    }, 1);
};
//特征总数
Game_BattlerBase.prototype.traitsSum = function(code, id) {
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        return r + trait.value;
    }, 0);
};
//特征所有总数
Game_BattlerBase.prototype.traitsSumAll = function(code) {
    return this.traits(code).reduce(function(r, trait) {
        return r + trait.value;
    }, 0);
};
//特征设置
Game_BattlerBase.prototype.traitsSet = function(code) {
    return this.traits(code).reduce(function(r, trait) {
        return r.concat(trait.dataId);
    }, []);
};
//标准基础
Game_BattlerBase.prototype.paramBase = function(paramId) {
    return 0;
};
//标准增加
Game_BattlerBase.prototype.paramPlus = function(paramId) {
    return this._paramPlus[paramId];
};
//标准最小
Game_BattlerBase.prototype.paramMin = function(paramId) {
    if (paramId === 1) {
        return 0;   // MMP
    } else {
        return 1;
    }
};
//标准最大
Game_BattlerBase.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return 999999;  // MHP
    } else if (paramId === 1) {
        return 9999;    // MMP
    } else {
        return 999;
    }
};
//标准比例
Game_BattlerBase.prototype.paramRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
};
//标准状态比例
Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    return this._buffs[paramId] * 0.25 + 1.0;
};
//标准
Game_BattlerBase.prototype.param = function(paramId) {
    var value = this.paramBase(paramId) + this.paramPlus(paramId);
    value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};
//x标准
Game_BattlerBase.prototype.xparam = function(xparamId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
};
//s标准
Game_BattlerBase.prototype.sparam = function(sparamId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
};
//元素比例
Game_BattlerBase.prototype.elementRate = function(elementId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
};
//负面效果比例
Game_BattlerBase.prototype.debuffRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
};
//状态比例
Game_BattlerBase.prototype.stateRate = function(stateId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
};
//状态抵抗设置
Game_BattlerBase.prototype.stateResistSet = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
};
//是状态抵抗
Game_BattlerBase.prototype.isStateResist = function(stateId) {
    return this.stateResistSet().contains(stateId);
};
//攻击元素
Game_BattlerBase.prototype.attackElements = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
};
//攻击状态
Game_BattlerBase.prototype.attackStates = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
};
//攻击状态比例
Game_BattlerBase.prototype.attackStatesRate = function(stateId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
};
//攻击速度
Game_BattlerBase.prototype.attackSpeed = function() {
    return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
};
//攻击次数增加
Game_BattlerBase.prototype.attackTimesAdd = function() {
    return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
};
//附加技能种类
Game_BattlerBase.prototype.addedSkillTypes = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
};
//是技能种类标志
Game_BattlerBase.prototype.isSkillTypeSealed = function(stypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);
};
//添加技能
Game_BattlerBase.prototype.addedSkills = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
};
//是技能标志
Game_BattlerBase.prototype.isSkillSealed = function(skillId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);
};
//是武器w种类确定
Game_BattlerBase.prototype.isEquipWtypeOk = function(wtypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);
};
//是武器a种类确定
Game_BattlerBase.prototype.isEquipAtypeOk = function(atypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);
};
//是装备种类锁定
Game_BattlerBase.prototype.isEquipTypeLocked = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);
};
//是装备种类标志
Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);
};
//孔种类
Game_BattlerBase.prototype.slotType = function() {
    var set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
    return set.length > 0 ? Math.max.apply(null, set) : 0;
};
//是双刀流
Game_BattlerBase.prototype.isDualWield = function() {
    return this.slotType() === 1;
};
//行动添加设置
Game_BattlerBase.prototype.actionPlusSet = function() {
    return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(function(trait) {
        return trait.value;
    });
};
//特别标志
Game_BattlerBase.prototype.specialFlag = function(flagId) {
    return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(function(trait) {
        return trait.dataId === flagId;
    });
};
//死亡种类
Game_BattlerBase.prototype.collapseType = function() {
    var set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
    return set.length > 0 ? Math.max.apply(null, set) : 0;
};
//队伍能力
Game_BattlerBase.prototype.partyAbility = function(abilityId) {
    return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(function(trait) {
        return trait.dataId === abilityId;
    });
};
//是自动战斗
Game_BattlerBase.prototype.isAutoBattle = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
};
//是守卫
Game_BattlerBase.prototype.isGuard = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
};
//是替代
Game_BattlerBase.prototype.isSubstitute = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
};
//是保留tp
Game_BattlerBase.prototype.isPreserveTp = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
};
//添加参数
Game_BattlerBase.prototype.addParam = function(paramId, value) {
    this._paramPlus[paramId] += value;
    this.refresh();
};
//设置hp
Game_BattlerBase.prototype.setHp = function(hp) {
    this._hp = hp;
    this.refresh();
};
//设置mp
Game_BattlerBase.prototype.setMp = function(mp) {
    this._mp = mp;
    this.refresh();
};
//设置tp
Game_BattlerBase.prototype.setTp = function(tp) {
    this._tp = tp;
    this.refresh();
};
//最大tp
Game_BattlerBase.prototype.maxTp = function() {
    return 100;
};
//刷新
Game_BattlerBase.prototype.refresh = function() {
    this.stateResistSet().forEach(function(stateId) {
        this.eraseState(stateId);
    }, this);
    this._hp = this._hp.clamp(0, this.mhp);
    this._mp = this._mp.clamp(0, this.mmp);
    this._tp = this._tp.clamp(0, this.maxTp());
};
//完全恢复
Game_BattlerBase.prototype.recoverAll = function() {
    this.clearStates();
    this._hp = this.mhp;
    this._mp = this.mmp;
};
//hp比例
Game_BattlerBase.prototype.hpRate = function() {
    return this.hp / this.mhp;
};
//mp比例
Game_BattlerBase.prototype.mpRate = function() {
    return this.mmp > 0 ? this.mp / this.mmp : 0;
};
//tp比例
Game_BattlerBase.prototype.tpRate = function() {
    return this.tp / 100;
};
//隐藏
Game_BattlerBase.prototype.hide = function() {
    this._hidden = true;
};
//出现
Game_BattlerBase.prototype.appear = function() {
    this._hidden = false;
};
//是隐藏的
Game_BattlerBase.prototype.isHidden = function() {
    return this._hidden;
};
//是出现的
Game_BattlerBase.prototype.isAppeared = function() {
    return !this.isHidden();
};
//是死的
Game_BattlerBase.prototype.isDead = function() {
    return this.isAppeared() && this.isDeathStateAffected();
};
//是活的
Game_BattlerBase.prototype.isAlive = function() {
    return this.isAppeared() && !this.isDeathStateAffected();
};
//是濒死的
Game_BattlerBase.prototype.isDying = function() {
    return this.isAlive() && this._hp < this.mhp / 4;
};
//是受限制的
Game_BattlerBase.prototype.isRestricted = function() {
    return this.isAppeared() && this.restriction() > 0;
};
//能输入
Game_BattlerBase.prototype.canInput = function() {
    return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();
};
//能移动
Game_BattlerBase.prototype.canMove = function() {
    return this.isAppeared() && this.restriction() < 4;
};
//是混乱的
Game_BattlerBase.prototype.isConfused = function() {
    return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
};
//混乱等级
Game_BattlerBase.prototype.confusionLevel = function() {
    return this.isConfused() ? this.restriction() : 0;
};
//是角色
Game_BattlerBase.prototype.isActor = function() {
    return false;
};
//是敌人
Game_BattlerBase.prototype.isEnemy = function() {
    return false;
};
//状态排序
Game_BattlerBase.prototype.sortStates = function() {
    this._states.sort(function(a, b) {
        var p1 = $dataStates[a].priority;
        var p2 = $dataStates[b].priority;
        if (p1 !== p2) {
            return p2 - p1;
        }
        return a - b;
    });
};
//限制
Game_BattlerBase.prototype.restriction = function() {
    return Math.max.apply(null, this.states().map(function(state) {
        return state.restriction;
    }).concat(0));
};
//添加新的状态
Game_BattlerBase.prototype.addNewState = function(stateId) {
    if (stateId === this.deathStateId()) {
        this.die();
    }
    var restricted = this.isRestricted();
    this._states.push(stateId);
    this.sortStates();
    if (!restricted && this.isRestricted()) {
        this.onRestrict();
    }
};
//在限制
Game_BattlerBase.prototype.onRestrict = function() {
};
//最大重要状态文本
Game_BattlerBase.prototype.mostImportantStateText = function() {
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
        if (states[i].message3) {
            return states[i].message3;
        }
    }
    return '';
};
//状态动作索引
Game_BattlerBase.prototype.stateMotionIndex = function() {
    var states = this.states();
    if (states.length > 0) {
        return states[0].motion;
    } else {
        return 0;
    }
};
//状态覆盖索引
Game_BattlerBase.prototype.stateOverlayIndex = function() {
    var states = this.states();
    if (states.length > 0) {
        return states[0].overlay;
    } else {
        return 0;
    }
};
//是技能武器确定
Game_BattlerBase.prototype.isSkillWtypeOk = function(skill) {
    return true;
};
//技能mp消耗
Game_BattlerBase.prototype.skillMpCost = function(skill) {
    return Math.floor(skill.mpCost * this.mcr);
};
//技能tp消耗
Game_BattlerBase.prototype.skillTpCost = function(skill) {
    return skill.tpCost;
};
//能够支付技能消耗
Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
};
//支付技能消耗
Game_BattlerBase.prototype.paySkillCost = function(skill) {
    this._mp -= this.skillMpCost(skill);
    this._tp -= this.skillTpCost(skill);
};
//是时机确定
Game_BattlerBase.prototype.isOccasionOk = function(item) {
    if ($gameParty.inBattle()) {
        return item.occasion === 0 || item.occasion === 1;
    } else {
        return item.occasion === 0 || item.occasion === 2;
    }
};
//满足可用物品条件
Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
    return this.canMove() && this.isOccasionOk(item);
};
//满足技能条件
Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    return (this.meetsUsableItemConditions(skill) &&
            this.isSkillWtypeOk(skill) && this.canPaySkillCost(skill) &&
            !this.isSkillSealed(skill.id) && !this.isSkillTypeSealed(skill.stypeId));
};
//满足物品条件
Game_BattlerBase.prototype.meetsItemConditions = function(item) {
    return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
};
//能用
Game_BattlerBase.prototype.canUse = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isSkill(item)) {
        return this.meetsSkillConditions(item);
    } else if (DataManager.isItem(item)) {
        return this.meetsItemConditions(item);
    } else {
        return false;
    }
};
//能装备
Game_BattlerBase.prototype.canEquip = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isWeapon(item)) {
        return this.canEquipWeapon(item);
    } else if (DataManager.isArmor(item)) {
        return this.canEquipArmor(item);
    } else {
        return false;
    }
};
//能装备武器
Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
};
//能装备防具
Game_BattlerBase.prototype.canEquipArmor = function(item) {
    return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
};
//攻击技能id
Game_BattlerBase.prototype.attackSkillId = function() {
    return 1;
};
//防御技能id
Game_BattlerBase.prototype.guardSkillId = function() {
    return 2;
};
//能攻击
Game_BattlerBase.prototype.canAttack = function() {
    return this.canUse($dataSkills[this.attackSkillId()]);
};
//能防御
Game_BattlerBase.prototype.canGuard = function() {
    return this.canUse($dataSkills[this.guardSkillId()]);
};
