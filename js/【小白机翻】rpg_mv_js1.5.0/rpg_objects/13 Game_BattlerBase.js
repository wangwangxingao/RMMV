/**-----------------------------------------------------------------------------*/
/**Game_BattlerBase*/
/**游戏战斗基础*/
/**The superclass of Game_Battler. It mainly contains parameters calculation.*/
/**游戏战斗者的超级类,它主要包含战斗参数*/

function Game_BattlerBase() {
    this.initialize.apply(this, arguments);
}

/**特征元素比例*/
Game_BattlerBase.TRAIT_ELEMENT_RATE = 11;
/**特征负面效果比例*/
Game_BattlerBase.TRAIT_DEBUFF_RATE = 12;
/**特征状态比例*/
Game_BattlerBase.TRAIT_STATE_RATE = 13;
/**特征状态无效化*/
Game_BattlerBase.TRAIT_STATE_RESIST = 14;
/**特征参数*/
Game_BattlerBase.TRAIT_PARAM = 21;
/**特征x参数*/
Game_BattlerBase.TRAIT_XPARAM = 22;
/**特征s参数*/
Game_BattlerBase.TRAIT_SPARAM = 23;
/**特征攻击元素*/
Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;
/**特征攻击状态*/
Game_BattlerBase.TRAIT_ATTACK_STATE = 32;
/**特征攻击速度*/
Game_BattlerBase.TRAIT_ATTACK_SPEED = 33;
/**特征攻击次数*/
Game_BattlerBase.TRAIT_ATTACK_TIMES = 34;
/**特征类型增加*/
Game_BattlerBase.TRAIT_STYPE_ADD = 41;
/**特征类型封印*/
Game_BattlerBase.TRAIT_STYPE_SEAL = 42;
/**特征技能增加*/
Game_BattlerBase.TRAIT_SKILL_ADD = 43;
/**特征技能封印*/
Game_BattlerBase.TRAIT_SKILL_SEAL = 44;
/**特征装备武器*/
Game_BattlerBase.TRAIT_EQUIP_WTYPE = 51;
/**特征装备防具*/
Game_BattlerBase.TRAIT_EQUIP_ATYPE = 52;
/**特征装备固定*/
Game_BattlerBase.TRAIT_EQUIP_LOCK = 53;
/**特征装备封印*/
Game_BattlerBase.TRAIT_EQUIP_SEAL = 54;
/**特征孔种类*/
Game_BattlerBase.TRAIT_SLOT_TYPE = 55;
/**特征行动添加*/
Game_BattlerBase.TRAIT_ACTION_PLUS = 61;
/**特征特殊标记*/
Game_BattlerBase.TRAIT_SPECIAL_FLAG = 62;
/**特征死亡种类*/
Game_BattlerBase.TRAIT_COLLAPSE_TYPE = 63;
/**特征队伍能力*/
Game_BattlerBase.TRAIT_PARTY_ABILITY = 64;
/**标记id自动战斗*/
Game_BattlerBase.FLAG_ID_AUTO_BATTLE = 0;
/**标记id防御*/
Game_BattlerBase.FLAG_ID_GUARD = 1;
/**标记id替代*/
Game_BattlerBase.FLAG_ID_SUBSTITUTE = 2;
/**标记id保留tp*/
Game_BattlerBase.FLAG_ID_PRESERVE_TP = 3;
/**项目正面效果开始*/
Game_BattlerBase.ICON_BUFF_START = 32;
/**项目负面效果开始*/
Game_BattlerBase.ICON_DEBUFF_START = 48;

Object.defineProperties(Game_BattlerBase.prototype, {
    /** Hit Points hp生命值 */
    hp: { get: function() { return this._hp; }, configurable: true },
    /** Magic Points mp魔法值 */
    mp: { get: function() { return this._mp; }, configurable: true },
    /** Tactical Points tp战术值 */
    tp: { get: function() { return this._tp; }, configurable: true },
    /** Maximum Hit Points   最大hp生命值 */
    mhp: { get: function() { return this.param(0); }, configurable: true },
    /** Maximum Magic Points  最大mp魔法值 */
    mmp: { get: function() { return this.param(1); }, configurable: true },
    /** ATtacK power  攻击力 */
    atk: { get: function() { return this.param(2); }, configurable: true },
    /** DEFense power  防御力 */
    def: { get: function() { return this.param(3); }, configurable: true },
    /** Magic ATtack power  魔法攻击力 */
    mat: { get: function() { return this.param(4); }, configurable: true },
    /** Magic DeFense power  魔法防御力 */
    mdf: { get: function() { return this.param(5); }, configurable: true },
    /** AGIlity  敏捷 */
    agi: { get: function() { return this.param(6); }, configurable: true },
    /** LUcK  运气 */
    luk: { get: function() { return this.param(7); }, configurable: true },
    /** HIT rate 命中比例 */
    hit: { get: function() { return this.xparam(0); }, configurable: true },
    /** EVAsion rate 闪避比例 */
    eva: { get: function() { return this.xparam(1); }, configurable: true },
    /** CRItical rate 会心比例 */
    cri: { get: function() { return this.xparam(2); }, configurable: true },
    /** Critical EVasion rate 会心回避比例 */
    cev: { get: function() { return this.xparam(3); }, configurable: true },
    /** Magic EVasion rate  魔法躲避比例 */
    mev: { get: function() { return this.xparam(4); }, configurable: true },
    /** Magic ReFlection rate 魔法反射比例 */
    mrf: { get: function() { return this.xparam(5); }, configurable: true },
    /** CouNTer attack rate 反击比例 */
    cnt: { get: function() { return this.xparam(6); }, configurable: true },
    /** Hp ReGeneration rate hp恢复比例 */
    hrg: { get: function() { return this.xparam(7); }, configurable: true },
    /** Mp ReGeneration rate  mp恢复比例 */
    mrg: { get: function() { return this.xparam(8); }, configurable: true },
    /** Tp ReGeneration rate  tp恢复比例 */
    trg: { get: function() { return this.xparam(9); }, configurable: true },
    /** TarGet Rate  目标比例 */
    tgr: { get: function() { return this.sparam(0); }, configurable: true },
    /** GuaRD effect rate 防守效果比例 */
    grd: { get: function() { return this.sparam(1); }, configurable: true },
    /** RECovery effect rate  恢复效果比例 */
    rec: { get: function() { return this.sparam(2); }, configurable: true },
    /** PHArmacology  药物知识 */
    pha: { get: function() { return this.sparam(3); }, configurable: true },
    /** Mp Cost Rate   mp消耗比例 */
    mcr: { get: function() { return this.sparam(4); }, configurable: true },
    /** Tp Charge Rate tp充能比例 */
    tcr: { get: function() { return this.sparam(5); }, configurable: true },
    /** Physical Damage Rate  物理伤害比例 */
    pdr: { get: function() { return this.sparam(6); }, configurable: true },
    /** Magical Damage Rate  魔法伤害比例 */
    mdr: { get: function() { return this.sparam(7); }, configurable: true },
    /** Floor Damage Rate    地面伤害比例 */
    fdr: { get: function() { return this.sparam(8); }, configurable: true },
    /** EXperience Rate  经验值比例 */
    exr: { get: function() { return this.sparam(9); }, configurable: true }
});
/**初始化 */
Game_BattlerBase.prototype.initialize = function() {
    //初始化成员
    this.initMembers();
};
/**初始化成员 */
Game_BattlerBase.prototype.initMembers = function() {
    //hp = 1
    this._hp = 1;
    //mp = 0
    this._mp = 0;
    //tp = 0
    this._tp = 0;
    //隐藏 = false 
    this._hidden = false;
    //清除参数增加
    this.clearParamPlus();
    //清除状态
    this.clearStates();
    //清除效果
    this.clearBuffs();
};
/**清除参数增加 */
Game_BattlerBase.prototype.clearParamPlus = function() {
    //参数增加组 = [0,0,0,0,0,0,0,0]
    this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
};
/**清除状态组 */
Game_BattlerBase.prototype.clearStates = function() {
    //状态组 = [] 
    this._states = [];
    //状态回合组 = {}
    this._stateTurns = {};
};
/**抹去状态
 * @param {number} stateId 状态id 
 * 
 */
Game_BattlerBase.prototype.eraseState = function(stateId) {
    //索引 = 状态组 索引于 (状态id) 
    var index = this._states.indexOf(stateId);
    //如果( 索引 大于 0  )
    if (index >= 0) {
        //状态组 剪接(索引 , 1 )
        this._states.splice(index, 1);
    }
    //删除 状态回合组 [状态id]
    delete this._stateTurns[stateId];
};
/**是状态影响 
 * @param {number} stateId 状态id 
 */
Game_BattlerBase.prototype.isStateAffected = function(stateId) {
    //返回 状态组 包含 ( 状态id )
    return this._states.contains(stateId);
};
/**是死亡状态影响 
 * @return {boolean}
 */
Game_BattlerBase.prototype.isDeathStateAffected = function() {
    //返回 是状态影响( 死亡状态id )
    return this.isStateAffected(this.deathStateId());
};
/**死亡状态id 
 * @return {number} 
 */
Game_BattlerBase.prototype.deathStateId = function() {
    //返回 1
    return 1;
};
/**重置状态计数 
 * @param {number} stateId 状态id 
 * */
Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    //状态 = 数据状态 [状态id] 
    var state = $dataStates[stateId];
    //偏差 = 1 + 数学 最大值( 状态 最大回合数 - 状态 最小回合数 , 0 )
    var variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
    //状态回合组 [状态id] = 状态 最小回合数  +  数学 随机整数(偏差)
    this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
};
/**是状态期满 
 * @param {number} stateId 状态id 
 */
Game_BattlerBase.prototype.isStateExpired = function(stateId) {
    //返回 状态回合组 [状态id] === 0 
    return this._stateTurns[stateId] === 0;
};
/**更新状态回合 */
Game_BattlerBase.prototype.updateStateTurns = function() {
    //状态组 对每一个 状态id
    this._states.forEach(function(stateId) {
        //如果( 状态回合组 [状态id]  >0 )
        if (this._stateTurns[stateId] > 0) {
            //状态回合组 [状态id]--
            this._stateTurns[stateId]--;
        }
        //this
    }, this);
};
/**清除效果组 */
Game_BattlerBase.prototype.clearBuffs = function() {
    //效果组 = [0,0,0,0,0,0,0,0];
    this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
    //效果回合组 = [0,0,0,0,0,0,0,0];
    this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
};
/**抹去效果 
 * @param {number} paramId 参数id 
 * 
 */
Game_BattlerBase.prototype.eraseBuff = function(paramId) {
    //效果组 [ 参数id ] = 0
    this._buffs[paramId] = 0;
    //效果回合组 [ 参数id ] = 0
    this._buffTurns[paramId] = 0;
};
/**效果长度
 * @return {number}
 */
Game_BattlerBase.prototype.buffLength = function() {
    //返回 效果 长度
    return this._buffs.length;
};
/**效果 
 * @param {number} paramId 参数id 
 * @return {number}
 * 
 */
Game_BattlerBase.prototype.buff = function(paramId) {
    //返回 效果组[ 参数id ]
    return this._buffs[paramId];
};
/**是正面效果影响 
 * @param {number} paramId 参数id 
 * @return {boolean} 
 */
Game_BattlerBase.prototype.isBuffAffected = function(paramId) {
    //返回 效果组[ 参数id ] > 0 
    return this._buffs[paramId] > 0;
};
/**是负面效果影响  
 * @param {number} paramId 参数id 
 * @return {boolean}
 * 
 */
Game_BattlerBase.prototype.isDebuffAffected = function(paramId) {
    //返回 效果组[ 参数id ] < 0
    return this._buffs[paramId] < 0;
};
/**是正面效果或者负面效果影响 
 * @param {number} paramId 参数id 
 * @return {boolean} 
 */
Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId) {
    //返回 效果组[ 参数id ] !== 0
    return this._buffs[paramId] !== 0;
};
/**是最大正面效果影响 
 * @param {number} paramId 参数id 
 * @return {boolean} 
 */
Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
    //返回 效果组[ 参数id ] === 2
    return this._buffs[paramId] === 2;
};
/**是最大负面效果影响 
 * @param {number} paramId 参数id 
 * @return {boolean}
 * 
 */
Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
    //返回 效果组[ 参数id ] === -2
    return this._buffs[paramId] === -2;
};
/**增加效果 
 * @param {number} paramId 参数id 
 * 
 */
Game_BattlerBase.prototype.increaseBuff = function(paramId) {
    //如果( 不是 是最大正面效果影响( 参数id ) )
    if (!this.isMaxBuffAffected(paramId)) {
        //效果组[ 参数id ]++
        this._buffs[paramId]++;
    }
};
/**减少效果 
 * @param {number} paramId 参数id 
 * 
 */
Game_BattlerBase.prototype.decreaseBuff = function(paramId) {
    //如果( 不是 是最大负面效果影响( 参数id ) )
    if (!this.isMaxDebuffAffected(paramId)) {
        //效果组[ 参数id ] -- 
        this._buffs[paramId]--;
    }
};
/**结束写效果回合 
 * @param {number} paramId 参数id 
 * @param {number} turns 回合数 
 * 
 */
Game_BattlerBase.prototype.overwriteBuffTurns = function(paramId, turns) {
    //如果 效果回合组[参数id] < 回合
    if (this._buffTurns[paramId] < turns) {
        //效果回合组[参数id] =  回合
        this._buffTurns[paramId] = turns;
    }
};
/**是效果期满 
 * @param {number} paramId 参数id 
 * @return {boolean} 
 */
Game_BattlerBase.prototype.isBuffExpired = function(paramId) {
    //返回 效果回合[参数id] === 0 
    return this._buffTurns[paramId] === 0;
};
/**更新效果回合 */
Game_BattlerBase.prototype.updateBuffTurns = function() {
    //循环 ( 开始时 i= 0 ; 当 i < 效果回合组 长度 时 ; 每一次 i++)
    for (var i = 0; i < this._buffTurns.length; i++) {
        //如果 (  效果回合组 [i] > 0 )
        if (this._buffTurns[i] > 0) {
            //效果回合组[i] --
            this._buffTurns[i]--;
        }
    }
};
/**死亡 */
Game_BattlerBase.prototype.die = function() {
    //hp = 0
    this._hp = 0;
    //清除状态组
    this.clearStates();
    //清除效果组
    this.clearBuffs();
};
/**复苏 */
Game_BattlerBase.prototype.revive = function() {
    //如果 ( hp === 0 )
    if (this._hp === 0) {
        //hp = 1
        this._hp = 1;
    }
};
/**状态组 
 * @return {[object]} 数据库中的状态 
 */
Game_BattlerBase.prototype.states = function() {
    //返回 状态组() 映射 方法(id )
    return this._states.map(function(id) {
        //返回 数据状态id
        return $dataStates[id];
    });
};
/**状态图标组
 * @return {[number]} 
 * 
 */
Game_BattlerBase.prototype.stateIcons = function() {
    //返回 状态组() 映射 方法(状态)
    return this.states().map(function(state) {
        //返回 状态 图标索引
        return state.iconIndex;
        //过滤 方法(图标索引)
    }).filter(function(iconIndex) {
        //返回 图标索引 > 0
        return iconIndex > 0;
    });
};
/**效果图标组
 * @return {[number]} 
 */
Game_BattlerBase.prototype.buffIcons = function() {
    //图标组 = []
    var icons = [];
    //循环 ( 开始时 i= 0 ; 当 i < 效果组 长度 时 ; 每一次 i++)
    for (var i = 0; i < this._buffs.length; i++) {
        //如果( 效果组[i] !==0 )
        if (this._buffs[i] !== 0) {
            //图标组 添加 ( 状态图标索引 (效果组[i],i)  )
            icons.push(this.buffIconIndex(this._buffs[i], i));
        }
    }
    //返回 图标组
    return icons;
};
/**状态图标索引
 * @param {number} buffLevel 增益等级
 * @param {number} paramId 参数id
 * @param {number} 
 */
Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
    //如果 (状态等级 > 0)
    if (buffLevel > 0) {
        //返回 项目正面效果开始 + ( 状态等级 - 1 ) * 8 + 参数id
        return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
        //否则 如果 (状态等级 < 0)
    } else if (buffLevel < 0) {
        //返回 项目负面效果开始 + ( -状态等级 - 1 ) * 8 + 参数id
        return Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId;
        //否则 
    } else {
        //返回 0
        return 0;
    }
};
/**所有图标组
 * @return {[number]} 
 * 
 */
Game_BattlerBase.prototype.allIcons = function() {
    //返回 状态图标组 连接 效果图标组
    return this.stateIcons().concat(this.buffIcons());
};
/**特征对象组 
 * @return {[object]}  
 */
Game_BattlerBase.prototype.traitObjects = function() {
    // Returns an array of the all objects having traits. States only here.
    //返回 状态组
    return this.states();
};
/**所有特征 
 * @return {[object]}  
 */
Game_BattlerBase.prototype.allTraits = function() {
    //返回 特征对象组 缩减  方法( r ,对象 )
    return this.traitObjects().reduce(function(r, obj) {
        //返回 r 连接 对象 特征
        return r.concat(obj.traits);
        //[]
    }, []);
};
/**特征组 
 * @param {number} code 编码
 * @return {[object]}  
 */
Game_BattlerBase.prototype.traits = function(code) {
    //返回 所有特征 过滤 方法(特征)
    return this.allTraits().filter(function(trait) {
        //返回 特征 编码 === 编码
        return trait.code === code;
    });
};
/**特征组通过id  
 * @param {number} code 编码
 * @param {number} id id
 * @return {[object]}  
 */
Game_BattlerBase.prototype.traitsWithId = function(code, id) {
    //返回 所有特征 过滤 方法(特征)
    return this.allTraits().filter(function(trait) {
        //返回 特征 编码 === 编码 并且 特征 数据id === id
        return trait.code === code && trait.dataId === id;
    });
};
/**特征总比例  
 * @param {number} code 编码
 * @param {number} id id
 * @return {number}  
 */
Game_BattlerBase.prototype.traitsPi = function(code, id) {
    //返回 特征和id (编码, id) 缩减 方法( r , 特征 ) 
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        //返回 r * 特征 值
        return r * trait.value;
        // 1
    }, 1);
};
/**特征总数
 * @param {number} code 编码
 * @param {number} id id
 * @return {number}  
 */
Game_BattlerBase.prototype.traitsSum = function(code, id) {
    //返回 特征和id (编码, id) 缩减 方法( r , 特征 ) 
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        //返回 r + 特征 值
        return r + trait.value;
        // 0
    }, 0);
};
/**特征总数所有
 * @param {number} code 编码 
 * @return {number}  
 */
Game_BattlerBase.prototype.traitsSumAll = function(code) {
    //特征 (编码) 缩减 方法( r , 特征 ) 
    return this.traits(code).reduce(function(r, trait) {
        //返回 r + 特征 值
        return r + trait.value;
        // 0
    }, 0);
};
/**特征集合
 * @param {number} code 编码
 * @return {[number]}  
 */
Game_BattlerBase.prototype.traitsSet = function(code) {
    //特征 (编码) 缩减 方法( r , 特征 ) 
    return this.traits(code).reduce(function(r, trait) {
        //返回 r 连接 (特征 数据id)
        return r.concat(trait.dataId);
        // []
    }, []);
};
/**参数基础 
 * @param {number} paramId 参数id
 * @return {number}  
 * 
 */
Game_BattlerBase.prototype.paramBase = function(paramId) {
    //返回 0
    return 0;
};
/**参数增加 
 * @param {number} paramId 参数id
 * @return {number}  
 * 
 */
Game_BattlerBase.prototype.paramPlus = function(paramId) {
    //返回 参数添加[参数id]
    return this._paramPlus[paramId];
};
/**参数最小 
 * 
 * 8项基本参数在游戏中的最小设置值
 * 
 * @param {number} paramId 参数id
 * @return {number}   
 */
Game_BattlerBase.prototype.paramMin = function(paramId) {
    //如果 (参数id === 1)
    if (paramId === 1) {
        //返回 0 
        return 0; // MMP
        //否则 
    } else {
        //返回 1
        return 1;
    }
};
/**参数最大
 * 
 * 8项基本参数在游戏中的最大设置值
 * 
 * @param {number} paramId 参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.paramMax = function(paramId) {
    //如果 (参数id === 0)
    if (paramId === 0) {
        //返回 999999 //生命值最大999999
        return 999999; // MHP
        //否则 如果 (参数id === 1)
    } else if (paramId === 1) {
        //返回 9999 //魔法值最大9999
        return 9999; // MMP
        //否则 
    } else {
        //返回 999 //其他属性最大999
        return 999;
    }
};
/**参数比例 
 * @param {number} paramId 参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.paramRate = function(paramId) {
    //返回 特征总比例 ( 特征参数//21  , 参数id)
    return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
};
/**参数效果比例 
 * @param {number} paramId 参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    //返回 效果组 [参数id] * 0.25 + 1.0 
    return this._buffs[paramId] * 0.25 + 1.0;
};
/**参数 
 * @param {number} paramId 参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.param = function(paramId) {
    //值 =  参数基础  (参数id)  + 参数增加 (参数id)   
    var value = this.paramBase(paramId) + this.paramPlus(paramId);
    //值 *= 参数比例 (参数id ) * 参数效果比例 (参数id)
    value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
    //最大值 = 参数最大(参数id)
    var maxValue = this.paramMax(paramId);
    //最小值 = 参数最小(参数id)
    var minValue = this.paramMin(paramId);
    //返回 数学 四舍五入 (值 在之间(最小值 ,最大值 )  )
    return Math.round(value.clamp(minValue, maxValue));
};
/**x参数 
 * @param {number} xparamId x参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.xparam = function(xparamId) {
    //返回 特征总数 (  特征x参数//22 , x参数id )
    return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
};
/**s参数 
 * @param {number} sparamId s参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.sparam = function(sparamId) {
    //返回 特征总比例  (  特征s参数//23 , s参数id )
    return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
};
/**元素比例 
 * @param {number} elementId 元素id
 * @return {number}    
 */
Game_BattlerBase.prototype.elementRate = function(elementId) {
    //返回 特征总比例  (  特征元素比例//11 ,  元素id )
    return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
};
/**负面效果比例
 * @param {number} paramId 参数id 
 * @return {number}   
 * 
 * */
Game_BattlerBase.prototype.debuffRate = function(paramId) {
    //返回 特征总比例  (  特征负面效果比例//12 ,  参数id )
    return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
};
/**状态比例 
 * @param {number} stateId 状态id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.stateRate = function(stateId) {
    //返回 特征总比例  (  特征状态比例//13 ,  状态id )
    return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
};
/**状态抵抗集合 
 * @return {[number]}   
 * 
 */
Game_BattlerBase.prototype.stateResistSet = function() {
    //返回 特征集合 (  特征状态无效化//14 )
    return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
};
/**是状态抵抗 
 * @param {number} stateId 状态id 
 * @return {boolean}   
 * 
 */
Game_BattlerBase.prototype.isStateResist = function(stateId) {
    //返回 状态抵抗集合 包含 (特征id)
    return this.stateResistSet().contains(stateId);
};
/**攻击元素组 
 * @return {[number]} 
 */
Game_BattlerBase.prototype.attackElements = function() {
    //返回 特征集合 (  特征攻击元素//31 )
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
};
/**攻击状态 
 * @return {[number]} 
 * 
 */
Game_BattlerBase.prototype.attackStates = function() {
    //返回 特征集合 (  特征攻击状态//32 )
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
};
/**攻击状态比例 
 * @return {number}     
 */
Game_BattlerBase.prototype.attackStatesRate = function(stateId) {
    //返回 特征总和 (  特征攻击状态//32 ,  特征id )
    return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
};
/**攻击速度 
 * @return {number}    
 */
Game_BattlerBase.prototype.attackSpeed = function() {
    //返回 特征总数所有 ( 特征攻击速度 //33 )
    return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
};
/**攻击次数增加 
 * @return {number}     
 */
Game_BattlerBase.prototype.attackTimesAdd = function() {
    //返回 数学 最大值 (  特征总数所有( 特征攻击次数 //34 )  , 0  )
    return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
};
/**附加技能种类 
 * @return {[number]}  
 */
Game_BattlerBase.prototype.addedSkillTypes = function() {
    //返回 特征集合 (  特征类型增加//41  )
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
};
/**是技能种类封印 
 * @return {[number]}     
 */
Game_BattlerBase.prototype.isSkillTypeSealed = function(stypeId) {
    //返回 特征集合 (  特征类型封印//42  )  包含 ( 技能种类id )
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);
};
/**添加技能组 
 * @return {[number]}     
 * 
 */
Game_BattlerBase.prototype.addedSkills = function() {
    //返回 特征集合 (  特征技能增加//43  )  
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
};
/**是技能封印 
 * @param {number} skillId 技能id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isSkillSealed = function(skillId) {
    //返回 特征集合 (  特征技能封印//44  )  包含 ( 技能id ) 
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);
};
/**是装备武器种类允许  
 * @param {number} wtypeId 装备种类id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isEquipWtypeOk = function(wtypeId) {
    //返回 特征集合 (  特征装备武器//51  )  包含 ( 武器种类id ) 
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);
};
/**是装备防具种类允许  
 * @param {number} atypeId 防具种类id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isEquipAtypeOk = function(atypeId) {
    //返回 特征集合 (  特征装备防具//52  )  包含 ( 防具种类id ) 
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);
};
/**是装备种类锁定  
 * @param {number} etypeId 装备种类id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isEquipTypeLocked = function(etypeId) {
    //返回 特征集合 (  特征装备固定//53  )  包含 ( 装备种类id ) 
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);
};
/**是装备种类封印 
 * @param {number} etypeId 装备种类id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId) {
    //返回 特征集合 (  特征装备封印//54  )  包含 ( 装备种类id ) 
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);
};
/**孔种类  
 * @return {number}  
 */
Game_BattlerBase.prototype.slotType = function() {
    //集合 = 特征集合 (  特征孔种类//55  )   
    var set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
    //返回 集合 长度 > 0  ? 数学 最大值 应用 (null,集合)  : 0
    return set.length > 0 ? Math.max.apply(null, set) : 0;
};
/**是双刀流  
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isDualWield = function() {
    //返回 孔种类 === 1
    return this.slotType() === 1;
};
/**行动添加集合 
 * @return {[number]}  
 */
Game_BattlerBase.prototype.actionPlusSet = function() {
    //返回 特征( 特征行动添加 //61 ) 映射 (特征 )
    return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(function(trait) {
        //返回 特征值
        return trait.value;
    });
};
/**特别标志  
 * @param {number} flagId 标志id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.specialFlag = function(flagId) {
    //返回 特征 ( 特征特殊标记//62  )  一些 方法(特征)
    return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(function(trait) {
        //返回 特征 数据id === 标志id
        return trait.dataId === flagId;
    });
};
/**死亡种类  
 * @return {number}  
 */
Game_BattlerBase.prototype.collapseType = function() {
    //集合 = 特征集合 (  特征死亡种类//63  )   
    var set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
    //返回  集合 长度 > 0  ? 数学 最大值 应用 (null,集合)  : 0
    return set.length > 0 ? Math.max.apply(null, set) : 0;
};
/**队伍能力  
 * @param {number} abilityId 能力id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.partyAbility = function(abilityId) {
    //返回 特征( 特征队伍能力//64 ) 一些 方法(特征)
    return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(function(trait) {
        //返回 特征id === 能力id 
        return trait.dataId === abilityId;
    });
};
/**是自动战斗 
 * @return {boolean}   
 */
Game_BattlerBase.prototype.isAutoBattle = function() {
    //返回 特别标志( 标记id自动战斗 //0 )
    return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
};
/**是防御 
 * @return {boolean}  
 * 
 */
Game_BattlerBase.prototype.isGuard = function() {
    //返回 特别标志( 标记id防御 //2 ) 并且 能移动
    return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
};
/**是替代 
 * @return {boolean}  
 * 
 */
Game_BattlerBase.prototype.isSubstitute = function() {
    //返回 特别标志( 标记id替代 //3 ) 并且 能移动
    return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
};
/**是保留tp 
 * @return {boolean}  
 * 
 */
Game_BattlerBase.prototype.isPreserveTp = function() {
    //返回 特别标志( 标记id保留tp //4 )
    return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
};
/**增加参数 
 * @param {number} paramId 参数id
 * @param {number} value 值
 */
Game_BattlerBase.prototype.addParam = function(paramId, value) {
    //参数增加组[参数id] += value
    this._paramPlus[paramId] += value;
    //刷新()
    this.refresh();
};
/**设置hp 
 * @param {number} hp  
 */
Game_BattlerBase.prototype.setHp = function(hp) {
    //hp = hp
    this._hp = hp;
    //刷新()
    this.refresh();
};
/**设置mp 
 * @param {number} mp  
 * 
 */
Game_BattlerBase.prototype.setMp = function(mp) {
    //mp = mp
    this._mp = mp;
    //刷新()
    this.refresh();
};
/**设置tp 
 * @param {number} tp  
 * 
 */
Game_BattlerBase.prototype.setTp = function(tp) {
    //tp = tp
    this._tp = tp;
    //刷新()
    this.refresh();
};
/**最大tp 
 * @return {number} 
 */
Game_BattlerBase.prototype.maxTp = function() {
    //返回 100
    return 100;
};
/**刷新 */
Game_BattlerBase.prototype.refresh = function() {
    //状态抵抗集合 对每一个 方法(状态id)
    this.stateResistSet().forEach(function(stateId) {
        //抹去状态(状态id)
        this.eraseState(stateId);
        //this
    }, this);
    //hp = hp 在之间(0 ,mhp)
    this._hp = this._hp.clamp(0, this.mhp);
    //mp = mp 在之间(0 ,mmp)
    this._mp = this._mp.clamp(0, this.mmp);
    //tp = tp 在之间(0 ,最大tp)
    this._tp = this._tp.clamp(0, this.maxTp());
};
/**完全恢复 */
Game_BattlerBase.prototype.recoverAll = function() {
    //清除状态组()
    this.clearStates();
    //hp = mhp
    this._hp = this.mhp;
    //mp = mmp
    this._mp = this.mmp;
};
/**hp比例 
 * @return {number}  
 */
Game_BattlerBase.prototype.hpRate = function() {
    //返回 hp / mhp
    return this.hp / this.mhp;
};
/**mp比例 
 * @return {number} 
 * 
 */
Game_BattlerBase.prototype.mpRate = function() {
    //返回  mmp > 0  ? mp / mmp : 0
    return this.mmp > 0 ? this.mp / this.mmp : 0;
};
/**tp比例 
 * @return {number} 
 * 
 */
Game_BattlerBase.prototype.tpRate = function() {
    //返回  tp / 最大Tp 
    return this.tp / this.maxTp();;
};
/**隐藏 */
Game_BattlerBase.prototype.hide = function() {
    //隐藏 = true
    this._hidden = true;
};
/**出现 */
Game_BattlerBase.prototype.appear = function() {
    //隐藏 = false
    this._hidden = false;
};
/**是隐藏的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isHidden = function() {
    //返回 隐藏
    return this._hidden;
};
/**是出现的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isAppeared = function() {
    //返回 不是 是隐藏的() 
    return !this.isHidden();
};
/**是死的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isDead = function() {
    //返回 是出现的() 并且 是死亡状态影响() 
    return this.isAppeared() && this.isDeathStateAffected();
};
/**是活的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isAlive = function() {
    //返回 是出现的() 并且 不是 是死亡状态影响() 
    return this.isAppeared() && !this.isDeathStateAffected();
};
/**是濒死的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isDying = function() {
    //返回 是活的() 并且 hp < mhp / 4 
    return this.isAlive() && this._hp < this.mhp / 4;
};
/**是受限制的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isRestricted = function() {
    //返回 是出现的() 并且 限制() > 0 
    return this.isAppeared() && this.restriction() > 0;
};
/**能输入 
 * 
 * 是否可以在战斗中发出指令
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canInput = function() {
    //返回 是出现的() 并且 不是 是受限制的()  并且 不是 是自动战斗()
    return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();
};
/**能移动 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canMove = function() {
    //返回 是出现的() 并且 限制() < 4    
    return this.isAppeared() && this.restriction() < 4;
};
/**是混乱的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isConfused = function() {
    //返回 是出现的() 并且 限制() >= 1  并且  限制() <= 3    
    return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
};
/**混乱等级 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.confusionLevel = function() {
    //返回  是混乱的() ? 限制() : 0 
    return this.isConfused() ? this.restriction() : 0;
};
/**是角色 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isActor = function() {
    //返回 false
    return false;
};
/**是敌人 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isEnemy = function() {
    //返回 false
    return false;
};
/**排序状态组 */
Game_BattlerBase.prototype.sortStates = function() {
    //状态组 排序 方法(a,b)
    this._states.sort(function(a, b) {
        //p1 = 数据状态[a].优先权
        var p1 = $dataStates[a].priority;
        //p2 = 数据状态[b].优先权
        var p2 = $dataStates[b].priority;
        //如果 ( p1 !== p2 )
        if (p1 !== p2) {
            //返回 p2 - p1
            return p2 - p1;
        }
        //返回 a - b
        return a - b;
    });
};
/**限制 
 * @return {number}  
 */
Game_BattlerBase.prototype.restriction = function() {
    //返回 数学 最大值 (null ,状态组() 映射 方法(状态 ) ) 
    return Math.max.apply(null, this.states().map(function(state) {
        //返回 状态 限制
        return state.restriction;
        //连接 0
    }).concat(0));
};
/**添加新的状态 
 * @param {number} stateId
 * 
 */
Game_BattlerBase.prototype.addNewState = function(stateId) {
    //如果 状态id = 死亡状态id
    if (stateId === this.deathStateId()) {
        //死亡
        this.die();
    }
    //受限制的 =  是受限制的
    var restricted = this.isRestricted();
    //状态组 添加 状态id 
    this._states.push(stateId);
    //排序状态组
    this.sortStates();
    //如果 (不是 受限制的) 并且 (是受限制的)
    if (!restricted && this.isRestricted()) {
        //当限制
        this.onRestrict();
    }
};
/**当限制 */
Game_BattlerBase.prototype.onRestrict = function() {};
/**最大重要状态文本 
 * @return {string} 
 * 
 */
Game_BattlerBase.prototype.mostImportantStateText = function() {
    //状态组 = 状态组
    var states = this.states();
    //循环 ( 开始时 i = 0 ; 当 i < 状态组 长度;每次 i++)
    for (var i = 0; i < states.length; i++) {
        //如果 状态组[i] 消息3
        if (states[i].message3) {
            //返回 状态组[i] 消息3
            return states[i].message3;
        }
    }
    //返回 ""
    return '';
};
/**状态动作索引 
 * @return {number}  
 */
Game_BattlerBase.prototype.stateMotionIndex = function() {
    //状态组 = 状态组
    var states = this.states();
    //如果 状态组 长度 >0 
    if (states.length > 0) {
        //返回 状态组[0] 动作
        return states[0].motion;
        //否则 
    } else {
        //返回 0
        return 0;
    }
};
/**状态叠加索引 
 * @return {number} 
 * 
 */
Game_BattlerBase.prototype.stateOverlayIndex = function() {
    //状态组 = 状态组
    var states = this.states();
    //如果 状态组 长度 >0 
    if (states.length > 0) {
        //返回 状态组[0] 叠加
        return states[0].overlay;
        //否则 
    } else {
        //返回 0
        return 0;
    }
};
/**是技能武器确定 
 * @param {{}} skill
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isSkillWtypeOk = function(skill) {
    //返回 true
    return true;
};
/**技能mp消耗 
 * @param {{}} skill
 * @return {number}
 * 
 */
Game_BattlerBase.prototype.skillMpCost = function(skill) {
    //返回 数学 向下取整 (技能 tp消耗  * mp消耗比例  )
    return Math.floor(skill.mpCost * this.mcr);
};
/**技能tp消耗 
 * @param {{}} skill
 * @return {number}
 * 
 */
Game_BattlerBase.prototype.skillTpCost = function(skill) {
    //返回 技能 tp消耗
    return skill.tpCost;
};
/**能够支付技能消耗 
 * @param {{}} skill
 * @return {boolean}
 * 
 */
Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    //返回 ( tp >= 技能tp消耗(技能) ) 并且 ( mp >=   技能mp消耗(技能))
    return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
};
/**支付技能消耗
 * @param {{}} skill
 */
Game_BattlerBase.prototype.paySkillCost = function(skill) {
    //mp  -= 技能mp消耗(技能)
    this._mp -= this.skillMpCost(skill);
    //tp  -= 技能tp消耗(技能)
    this._tp -= this.skillTpCost(skill);
};
/**是时机允许 
 * @param {{}} item
 * @return {boolean} 
 */
Game_BattlerBase.prototype.isOccasionOk = function(item) {
    //如果 游戏队伍 在战斗
    if ($gameParty.inBattle()) {
        //返回 项目 时机 === 0 或者 项目 时机 === 1 
        return item.occasion === 0 || item.occasion === 1;
        //否则
    } else {
        //返回 项目 时机 === 0 或者 项目 时机 === 2 
        return item.occasion === 0 || item.occasion === 2;
    }
};
/**满足可用物品条件 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
    //返回 能移动 并且 是时机允许
    return this.canMove() && this.isOccasionOk(item);
};
/**满足技能条件 
 * @param {{}} skill
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    //返回   满足可用物品条件(技能) 并且
    return (this.meetsUsableItemConditions(skill) &&
        // 是技能武器确定 并且 能够支付技能消耗(技能 ) 并且
        this.isSkillWtypeOk(skill) && this.canPaySkillCost(skill) &&
        //不是 是技能封印(技能id) 并且 不是 是技能种类封印 (技能 技能种类id)
        !this.isSkillSealed(skill.id) && !this.isSkillTypeSealed(skill.stypeId));
};
/**满足物品条件 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.meetsItemConditions = function(item) {
    //返回 满足可用物品条件(物品 ) 并且 游戏队伍 有物品(项目)
    return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
};
/**能用 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canUse = function(item) {
    //如果 不是 项目
    if (!item) {
        //返回 false
        return false;
        //否则 如果 数据管理器 是技能(项目)
    } else if (DataManager.isSkill(item)) {
        //返回 满足技能条件(项目)
        return this.meetsSkillConditions(item);
        //否则 如果 数据管理器 是物品(项目)
    } else if (DataManager.isItem(item)) {
        //返回 满足物品条件(项目)
        return this.meetsItemConditions(item);
        //否则
    } else {
        //返回 false
        return false;
    }
};
/**能装备 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canEquip = function(item) {
    //如果 (不是 项目)
    if (!item) {
        //返回 false
        return false;
        //否则 如果 数据管理器 是武器(项目)
    } else if (DataManager.isWeapon(item)) {
        //返回 能装备武器(项目)
        return this.canEquipWeapon(item);
        //否则 如果 数据管理器 是防具(项目)
    } else if (DataManager.isArmor(item)) {
        //返回 能装备防具(项目)
        return this.canEquipArmor(item);
        //否则
    } else {
        //返回 false
        return false;
    }
};
/**能装备武器 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    //返回 (是装备武器种类允许( 项目 武器种类id ) )并且 (不是 是装备种类封印(项目 装备种类id))
    return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
};
/**能装备防具 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canEquipArmor = function(item) {
    //返回 (是装备防具种类允许( 项目 防具种类id ) )并且 (不是 是装备种类封印(项目 装备种类id))
    return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
};
/**攻击技能id 
 * @return {number} 
 * 
 */
Game_BattlerBase.prototype.attackSkillId = function() {
    //返回 1
    return 1;
};
/**防御技能id  
 * @return {number} 
 * 
 */
Game_BattlerBase.prototype.guardSkillId = function() {
    //返回 2
    return 2;
};
/**能攻击 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canAttack = function() {
    //返回 能用 ( 数据技能组[攻击技能id()]   )
    return this.canUse($dataSkills[this.attackSkillId()]);
};
/**能防御 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canGuard = function() {
    //返回 能用( 数据技能组[防御技能id()]  )
    return this.canUse($dataSkills[this.guardSkillId()]);
};