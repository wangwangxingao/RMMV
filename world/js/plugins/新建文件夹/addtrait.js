//=============================================================================
// addtrait.js
//=============================================================================

/*:
 * @plugindesc 添加特征
 * @author wangwang
 *   
 * @param addtrait
 * @desc 插件 添加特征 ,作者 汪汪
 * @default 汪汪
 * 
 * 
 * @help  
 * 
 * 战斗者.wwsettrait(code,param,value,sz)
 * code  , 特征编码 
 * param , 参数 param
 * value ,值 value
 * sz  1:加值 , 2 乘值  3 赋值
 * 
 *  
 *结合数据库
 * code = 11 
 * 元素率11,减益率12,状态率14,状态拒绝15
 * 参数 21,额外参数22,特殊参数23
 * 攻击元素31 ,状态32,速度33,次数34
 * 添加技能类型41,封存技能类型42,添加技能43,封存技能44
 * 装备武器类型51,装备防具类型52,锁定装备53,封存装备54,装备槽类型55
 * 动作次数61,特殊标记62,崩塌效益63,队伍能力64 
 * dataId = 0
 * 以下为开始值 
 * 元素率1,减益率0,状态率1,状态拒绝1
 * 参数 0 额外参数0,特殊参数0
 * 攻击元素1 ,状态1,速度0,次数0
 * 添加技能类型1,封存技能类型1,添加技能1,封存技能1
 * 动作次数0,特殊标记0,崩塌效益0,队伍能力0
 * 数值
 * value = 1 // 比例 ,数值 ,或 默认1
 * 
 * 
 * 特征编码 参考值 
 * 特征元素比例
 *Game_BattlerBase.TRAIT_ELEMENT_RATE   = 11;
 *特征负面效果比例
 *Game_BattlerBase.TRAIT_DEBUFF_RATE    = 12;
 *特征状态比例
 *Game_BattlerBase.TRAIT_STATE_RATE     = 13;
 *特征状态无效化
 *Game_BattlerBase.TRAIT_STATE_RESIST   = 14;
 *特征参数
 *Game_BattlerBase.TRAIT_PARAM          = 21;
 *特征x参数
 *Game_BattlerBase.TRAIT_XPARAM         = 22;
 *特征s参数
 *Game_BattlerBase.TRAIT_SPARAM         = 23;
 *特征攻击元素
 *Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;
 *特征攻击状态
 *Game_BattlerBase.TRAIT_ATTACK_STATE   = 32;
 *特征攻击速度
 *Game_BattlerBase.TRAIT_ATTACK_SPEED   = 33;
 *特征攻击次数
 *Game_BattlerBase.TRAIT_ATTACK_TIMES   = 34;
 *特征类型增加
 *Game_BattlerBase.TRAIT_STYPE_ADD      = 41;
 *特征类型封印
 *Game_BattlerBase.TRAIT_STYPE_SEAL     = 42;
 *特征技能增加
 *Game_BattlerBase.TRAIT_SKILL_ADD      = 43;
 *特征技能封印
 *Game_BattlerBase.TRAIT_SKILL_SEAL     = 44;
 *特征装备武器
 *Game_BattlerBase.TRAIT_EQUIP_WTYPE    = 51;
 *特征装备防具
 *Game_BattlerBase.TRAIT_EQUIP_ATYPE    = 52;
 *特征装备固定
 *Game_BattlerBase.TRAIT_EQUIP_LOCK     = 53;
 *特征装备封印
 *Game_BattlerBase.TRAIT_EQUIP_SEAL     = 54;
 *特征孔种类
 *Game_BattlerBase.TRAIT_SLOT_TYPE      = 55;
 *特征行动添加
 *Game_BattlerBase.TRAIT_ACTION_PLUS    = 61;
 *特征特殊标记
 *Game_BattlerBase.TRAIT_SPECIAL_FLAG   = 62;
 *特征死亡种类
 *Game_BattlerBase.TRAIT_COLLAPSE_TYPE  = 63;
 *特征队伍能力
 *Game_BattlerBase.TRAIT_PARTY_ABILITY  = 64;
 * 
 *param 参考值
 * 
 * 标记id自动战斗
 *Game_BattlerBase.FLAG_ID_AUTO_BATTLE  = 0;
 *标记id防御
 *Game_BattlerBase.FLAG_ID_GUARD        = 1;
 *标记id替代
 *Game_BattlerBase.FLAG_ID_SUBSTITUTE   = 2;
 *标记id保留tp
 *Game_BattlerBase.FLAG_ID_PRESERVE_TP  = 3; 
 * 
 * 
 * 
 *Maximum Hit Points   最大hp生命值 
 *mhp: { get: function() { return this.param(0); }, configurable: true },
 *Maximum Magic Points  最大mp魔法值 
 *mmp: { get: function() { return this.param(1); }, configurable: true },
 *ATtacK power  攻击力 
 *atk: { get: function() { return this.param(2); }, configurable: true },
 *DEFense power  防御力 
 *def: { get: function() { return this.param(3); }, configurable: true },
 *Magic ATtack power  魔法攻击力 
 *mat: { get: function() { return this.param(4); }, configurable: true },
 *Magic DeFense power  魔法防御力 
 *mdf: { get: function() { return this.param(5); }, configurable: true },
 *AGIlity  敏捷 
 *agi: { get: function() { return this.param(6); }, configurable: true },
 *LUcK  运气 
 *luk: { get: function() { return this.param(7); }, configurable: true },
 *HIT rate 命中比例 
 *hit: { get: function() { return this.xparam(0); }, configurable: true },
 *EVAsion rate 闪避比例 
 *eva: { get: function() { return this.xparam(1); }, configurable: true },
 *CRItical rate 会心比例 
 *cri: { get: function() { return this.xparam(2); }, configurable: true },
 *Critical EVasion rate 会心回避比例 
 *cev: { get: function() { return this.xparam(3); }, configurable: true },
 *Magic EVasion rate  魔法躲避比例 
 *mev: { get: function() { return this.xparam(4); }, configurable: true },
 *Magic ReFlection rate 魔法反射比例 
 *mrf: { get: function() { return this.xparam(5); }, configurable: true },
 *CouNTer attack rate 反击比例 
 *cnt: { get: function() { return this.xparam(6); }, configurable: true },
 *Hp ReGeneration rate hp恢复比例 
 *hrg: { get: function() { return this.xparam(7); }, configurable: true },
 *Mp ReGeneration rate  mp恢复比例 
 *mrg: { get: function() { return this.xparam(8); }, configurable: true },
 *Tp ReGeneration rate  tp恢复比例 
 *trg: { get: function() { return this.xparam(9); }, configurable: true },
 *TarGet Rate  目标比例 
 *tgr: { get: function() { return this.sparam(0); }, configurable: true },
 *GuaRD effect rate 防守效果比例 
 *grd: { get: function() { return this.sparam(1); }, configurable: true },
 *RECovery effect rate  恢复效果比例 
 *rec: { get: function() { return this.sparam(2); }, configurable: true },
 *PHArmacology  药物知识 
 *pha: { get: function() { return this.sparam(3); }, configurable: true },
 *Mp Cost Rate   mp消耗比例 
 *mcr: { get: function() { return this.sparam(4); }, configurable: true },
 *Tp Charge Rate tp充能比例 
 *tcr: { get: function() { return this.sparam(5); }, configurable: true },
 *Physical Damage Rate  物理伤害比例 
 *pdr: { get: function() { return this.sparam(6); }, configurable: true },
 *Magical Damage Rate  魔法伤害比例 
 *mdr: { get: function() { return this.sparam(7); }, configurable: true },
 *Floor Damage Rate    地面伤害比例 
 *fdr: { get: function() { return this.sparam(8); }, configurable: true },
 *EXperience Rate  经验值比例 
 *exr: { get: function() { return this.sparam(9); }, configurable: true }  
 * 
 *  
 * 
 * 
 * 
 * 
 * 
 */
Game_BattlerBase.prototype.wwtraits = function () {
    if (!this._wwtraits) {
        this._wwtraits = { traits: [] }
    }
    return this._wwtraits
};

Game_BattlerBase.prototype.traitObjects = function () {
    var objects = this.states();
    //对象组 = 对象组 连接 ( [角色(), 当前职业()] )
    objects = objects.concat([this.wwtraits()]);
    return;
};

/**制作特征 */
Game_BattlerBase.prototype.wwmaketrait = function (code, id, i) {
    var trait = { code: code, dataId: id, value: i }
    return trait;
};

/**添加特征 */
Game_BattlerBase.prototype.wwaddtrait = function (trait) {
    var list = this.wwtraits().traits
    if (trait) {
        list.push(trait)
    }
    return trait;
};

/**获得特征 */
Game_BattlerBase.prototype.wwgettrait = function (code, id) {
    var list = this.wwtraits().traits
    for (var i = 0; i < list.length; i++) {
        var t = list[i]
        if (t.code === code && t.dataId === id) {
            return t
        }
    }
    return 0
};
/**设置特征 */
Game_BattlerBase.prototype.wwsettrait = function (code, id, i, cz) {
    var t = this.wwgettrait(code, id)
    var i = i || 0
    if (t) {
        if (cz == 2) {
            t.value *= (i || 0)
        } if (cz == 1) {
            t.value += (i || 0)
        } else {
            t.value = (i || 0)
        }
    } else {
        t = this.wwmaketrait(code, id, i)
        this.wwaddtrait
    }
};
