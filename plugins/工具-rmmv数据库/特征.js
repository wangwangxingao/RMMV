//=============================================================================
// DataMessage.js
//=============================================================================

/*:
 * @plugindesc DataMessage
 * @author wangwang 
 * 
 * @param DataMessage
 * @desc 数据信息
 * @default  汪汪
 *    
 * @help 
 * 
 * 额,不知道会有什么问题,需要测试...
 *  
 */



var DataMessage = {}


DataMessage.isObj = function (item) {
    if (item) {

        var list = [
            "$dataSkills", "skill",
            "$dataItems", "item",
            "$dataWeapons", "weapon",
            "$dataArmors", "armor",
            "$dataActors", "actor",
        ]
        for (var i = 0; i < list.length; i += 2) {
            var name = list[i]
            console.log(name)
            if (window[name] && window[name].contains(item)) {
                return list[i + 1]
            }
        }

    };
    return ""

}



DataMessage.elements = function () {

    //元素种类
    return $dataSystem.elements
}


DataMessage.weaponTypes = function () {

    //武器种类
    return $dataSystem.weaponTypes
}

/**技能种类 */
DataMessage.skillTypes = function () {
    //技能种类
    return $dataSystem.skillTypes
}


/**技能
DataMessage.skills  = function () {
    //技能种类
    return $dataSkills
}
 */

/**状态 
DataMessage.states = function () {
    //技能种类
    return $dataStates
}
*/

DataMessage.equipTypes = function () {
    //装备种类
    return $dataSystem.equipTypes
}
DataMessage.armorTypes = function () {
    //防具种类
    return $dataSystem.armorTypes
}
DataMessage.params = function () {
    //参数种类
    return $dataSystem.terms.params
}
DataMessage._xparams = ["命中率", "闪避率", "会心率", "会心闪避率", "魔法闪避率", "魔法反射率", "反击率", "HP恢复率", "MP恢复率", "TP恢复率"]
DataMessage.xparams = function () {
    //参数种类
    return DataMessage._xparams
}


DataMessage._sparams = ["被攻击率", "防御效果率", "恢复效果率", "药物知识", "MP消耗率", "TP充能率", "物理伤害率", "魔法伤害率", "地形伤害率", "经验获得率"]
DataMessage.sparams = function () {
    //参数种类
    return DataMessage._sparams
}

DataMessage.basic = function () {
    //参数种类
    return $dataSystem.terms.basic
    //0: "等级"1: "Lv"2: "HP"3: "HP"4: "MP"5: "MP"6: "TP"7: "TP"8: "经验值"9: "EXP"

}

DataMessage._skillScope = [
    "无",
    "敌人单体",
    "敌人全体",
    "敌人1人随机",
    "敌人2人随机",
    "敌人2人随机",
    "敌人2人随机",
    "我方单体",
    "我方全体",
    "我方单体(战斗不能)",
    "我方全体(战斗不能)",
    "使用者"
]

/**技能范围 */
DataMessage.skillScope = function () {

    return DataMessage._skillScope

}



DataMessage._skillOccasion = [
    "总是",
    "战斗画面",
    "菜单画面",
    "不能使用",
]

/**技能使用场景 */

DataMessage.skillOccasion = function () {

    return DataMessage._skillOccasion
}


DataMessage._skillHitType = [
    "必中",
    "物理攻击",
    "魔法攻击",
]

/**命中种类 */
DataMessage.skillHitType = function () {
    return DataMessage._skillHitType
}


DataMessage._itemType = [
    "普通道具",
    "关键道具",
    "隐藏物品a",
    "隐藏物品b",
]

/**命中种类 */
DataMessage.itemType = function () {
    return DataMessage._itemType
}



DataMessage.skillSet = {

    "id": "%1",
    "name": "名称:%1",
    "iconIndex": "\\I[%1]",
    "note": "%1",//文本  
    "meta": "%2",
    "description": "%1",//说明 
    "tpCost": "TP消耗:%1",
    "mpCost": "MP消耗:%1",
    "repeats": "连续次数:%1",
    "hitType": "命中种类:%2",
    "occasion": "应用场景:%2",
    "scope": "范围:%2",
    "stypeId": "技能种类:%2",
    "requiredWtypeId1": "必要武器1:%2",
    "requiredWtypeId2": "必要武器2:%2",
    "speed": "速度修正:%1",
    "successRate": "成功率:%1",
}

DataMessage.itemSet = {

    "id": "%1",
    "name": "名称:%1",
    "iconIndex": "\\I[%1]",
    "note": "%1",//文本  
    "meta": "%2",
    "description": "%1",//说明 
    "consumable": "是消耗品:%2",
    "itypeId": '物品种类:%2',
    "tpGain": "TP获得:%1",
    "repeats": "连续次数:%1",
    "hitType": "命中种类:%2",
    "occasion": "应用场景:%2",
    "scope": "范围:%2", 
    "speed": "速度修正:%1",
    "successRate": "成功率:%1",

    "traits": "%1",
    "effects": "%1",

    "price": "价格:%1",

}

DataMessage.armorSet = {
    "id": "id:%1",
    "name": "名称:%1",
    "iconIndex": "\\I[%1]",  //图标 
    "note": "",//文本  
    "meta": "%1%2", //注释内容 
    "description": "说明:%1", //说明 
    "etypeId": "装备种类:%2",
    "atypeId": "防具种类:%2",
    "price": "价格:%1", //价格
    "traits": "%1",
    "params": "%1",
    "param": "%1:%2",
}
DataMessage.weaponSet = {
    "id": "id:%1",
    "name": "名称:%1",
    "iconIndex": "\\I[%1]",  //图标 
    "note": "",//文本  
    "meta": "%1%2", //注释内容 
    "description": "说明:%1", //说明 
    "etypeId": "装备种类:%2",
    "wtypeId": "武器种类:%2",
    "price": "价格:%1", //价格
    "traits": "%1",
    "params": "%1",
    "param": "%1:%2",
}
DataMessage.actorParamSet = {
    "param": "%1:%2"
}

DataMessage.actorTraitSet = {
    //特征元素比例
    11: "元素:%2 %4",
    //特征负面效果比例  
    12: "状态 %2 %5",
    //特征状态比例
    13: "状态 %2 %5",
    //特征状态无效化
    14: "无效状态 %2",
    //特征参数
    21: "参数:%2 %4",
    //特征x参数
    22: "参数:%2 %4",
    //特征s参数
    23: "参数:%2 %4",
    //特征攻击元素
    31: "攻击元素:%2",
    //特征攻击状态
    32: "攻击状态:%2 %5",
    //特征攻击速度
    33: "攻击速度增加:%1",
    //特征攻击次数
    34: "攻击次数:%1",
    //特征类型增加
    41: "添加技能类型:%2",
    //特征类型封印
    42: "封印技能种类:%2",
    //特征技能增加
    43: "添加技能:%2",
    //特征技能封印
    44: "封印技能:%2",
    //特征装备武器
    51: "装备种类:%2",
    //特征装备防具
    52: "防具种类:%2",
    //特征装备固定
    53: "防具固定:%2",
    //特征装备封印
    54: "装备封印:%2",
    //特征孔种类
    55: "%1",
    //特征行动添加
    61: "追加行动:%2",
    //特征特殊标记
    62: "%2",
    //特征死亡种类
    63: "",
    //特征队伍能力
    64: "能力:%2",
}


DataMessage.itemTraitSet = {

    //效果 恢复 hp , 11
    11: "恢复Hp:%1 + %2",

    //效果 恢复 mp, 12
    12: "恢复Mp:%1 + %2",

    //效果 获得 tp, 13
    13: "恢复tp:%1",

    //效果 添加 状态, 21
    21: "添加状态:%3 %5",

    //效果 移除 状态
    22: "状态移除:%3 %5",
    //效果 添加 正面效果
    31: "添加效果:%2 %3回合",

    //效果 添加 负面效果
    32: "添加效果:%2 %3回合",
    //效果 移除 正面效果
    33: "添加效果:%2 %3回合",
    //效果 移除 负面效果
    34: "移除效果:%2",
    //额外  逃跑
    41: "%1",

    //效果 生长 
    42: "%2 %3",
    //效果 学习技能
    43: "学习技能%2",

    //效果 公共事件
    44: "",

}


/**获取技能内容 */
DataMessage.getSkill = function (item, type, must, set) {


    var re = ""
    var v1 = ""
    var v2 = ""

    var set = set || DataMessage.skillSet
    if (item && set) {
        var re = set[type]
        switch (type) {
            case "id":
                var v1 = item[type]
                break
            case "name":
                var v1 = item[type]
                break
            case "iconIndex":
                var v1 = item[type]
                break
            case "note":
                var v1 = item[type]
                break
            case "meta":
                var v1 = item[type]
                var v2 = v1[must]
            case "description":
                var v1 = item[type]
                break
            case "tpCost":
                var v1 = item[type]
                break
            case "mpCost":
                var v1 = item[type]
                break
            case "repeats":
                var v1 = item[type]
                break
            case "hitType":
                var v1 = item[type]
                var v2 = this.skillHitType()[v1]
                break
            case "occasion":
                var v1 = item[type]
                var v2 = this.skillOccasion()[v1]
                break
            case "scope":
                var v1 = item[type]
                var v2 = this.skillScope()[v1]

                break
            case "stypeId":
                var v1 = item[type]
                var v2 = this.skillTypes()[v1]
                break

            case "requiredWtypeId1":
                re = "必要武器1:"
                var v1 = item[type]
                var v2 = this.weaponTypes()[v1]
                break
            case "requiredWtypeId2":
                re = "必要武器2:"
                var v1 = item[type]
                var v2 = this.weaponTypes()[v1]
                break
            case "speed": 0
                re = "速度修正"
                var v1 = item[type]
                break
            case "successRate":
                re = "成功率"
                var v1 = item[type]
                break

            case "traits":
                re = ""
                var v1 = this.getItemTraits(item[type])
                break
            default:
                break;
        }

        if (re) {

            return re.format(v1, v2);
        }
    }
    return ""


}


/**获取项目 */
DataMessage.getItem = function (item, type, must, set) {

    var re = ""
    var v1 = ""
    var v2 = ""

    var set = set || DataMessage.itemSet
    if (item && set) {
        var re = set[type]
        switch (type) {
            case "id":
                var v1 = item[type]

                break
            case "name":
                var v1 = item[type]

                break
            case "iconIndex":
                var v1 = item[type]

                break
            case "note":
                var v1 = item[type]
                break
            case "meta":
                var v1 = item[type]
                var v2 = v1[must]
            case "description":
                var v1 = item[type]

                break

            case "consumable":
                var v1 = item[type]
                var v2 = v1 ? "是" : "否"

                break
            case "itypeId":
                var list = this.itemType()
                var v1 = item[type]
                var v2 = list[v1]
                break
            case "tpGain":
                var v1 = item[type]
                break
            case "repeats":
                var v1 = item[type]
                break

            case "hitType": 1
                var v1 = item[type]
                var v2 = this.skillHitType()[v1]
                break
            case "occasion":
                var v1 = item[type]
                var v2 = this.skillOccasion()[v1]
                break
            case "scope":
                var v1 = item[type]
                var v2 = this.skillScope()[v1]
                break 
            case "speed": 0
                var v1 = item[type]
                break
            case "successRate":
                var v1 = item[type]
                break
            case "traits", "effects":
                var type = "effects"
                var v1 = this.getItemTraits(item[type])
                break
            case "price":
                var v1 = item[type]
                break
            default:
                break;
        }

        if (re) {

            return re.format(v1, v2);
        }
    }
    return ""

}




/**获取防具 */
DataMessage.getArmor = function (item, type, must, set) {

    var re = ""
    var v1 = ""
    var v2 = ""


    var set = set || DataMessage.armorSet
    if (item && set) {
        var re = set[type]
        switch (type) {

            case "id":
                var v1 = item[type]
                break
            case "name":
                var v1 = item[type]
                break
            case "iconIndex":
                var v1 = item[type]
                break
            case "note":
                var v1 = item[type]
                break
            case "meta":
                var v1 = item[type]
                var v2 = v1[must]
            case "description":
                var v1 = item[type]
                break
            case "etypeId":
                var list = this.equipTypes()
                var v1 = item[type]
                var v2 = list[v1]

                break
            case "atypeId":
                var list = this.armorTypes()
                var v1 = item[type]
                var v2 = list[v1]

                break
            case "price":
                var v1 = item[type]

                break

            case "traits":
                var v1 = this.getActorTraits(item.traits)
                break

            case "params":
                var v1 = this.getActorParams(item.params, must)
                break
            case "param":
                var v1 = this.getActorParam(item.params, must)

                break
            default:
                break;
        }
        if (re) {//v1 || v2 || v3 || v4 || v5) {
            return re.format(v1, v2, v3, v4, v5);
        }
    }
    return ""
}




/**获取防具 */
DataMessage.getWeapon = function (item, type, must, set) {


    var re = ""
    var v1 = ""
    var v2 = ""

    var set = set || DataMessage.weaponSet
    if (item && set) {
        var re = set[type]
        switch (type) {
            case "id":
                var v1 = item[type]
                break
            case "name":
                var v1 = item[type]
                break
            case "iconIndex":
                var v1 = item[type]
                break
            case "note": //文本 
                var v1 = item[type]
                break
            case "meta":
                var v1 = item[type]
                var v2 = v1[must]
            case "description":
                //说明
                var v1 = item[type]
                break
            case "etypeId":
                var list = this.equipTypes()
                var v1 = item[type]
                var v2 = list[v1]

                break
            case "wtypeId":
                var list = this.weaponTypes()
                var v1 = item[type]
                var v2 = list[v1]

                break
            case "price":
                var v1 = item[type]
                break
            /**特征组 */
            /* case "traits":
                 var v1 = this.getItemTraits(item[type])
                 break */
            /**参数组 */
            /*case "params":
                var v1 = this.getActorParams(item.params, must)
                break*/
            /**参数 */
            /* case "param":
                 var v1 = this.getActorParam(item.params, must)
                 break*/
            default:
                break;
        }
        if (re) { //v1 || v2 || v3 || v4 || v5) {
            return re.format(v1, v2, v3, v4, v5);
        }
    }
    return ""
}



/**获取角色参数 */
DataMessage.getActorParam = function (params, id, must, set) {
    var re = ""
    var set = set || DataMessage.actorParamSet

    if (params && (!must || id == must - 1) && set) {
        var re = set["param"]
        var list = this.params()
        var v1 = list[id]
        var v2 = params[id]
        if (v1 || v2 !== undefined) {
            return re.format(v1, v2)
        }
    }
    return ""
}




DataMessage.getActorTrait = function (traits, i, must, set) {

    var re = ""

    var v1 = ""
    var v2 = ""
    var v3 = ""
    var v4 = ""
    var v5 = ""

    var set = set || DataMessage.actorTraitSet

    var trait = traits && traits[i]
    if (trait && (!must || trait.code == must) && set) {
        var re = set[trait.code]
        switch (trait.code) {
            //特征元素比例
            case Game_BattlerBase.TRAIT_ELEMENT_RATE, 11:
                re = "元素比例"
                //元素种类
                trait.dataId
                //元素比例
                trait.value

                var list = DataMessage.elements()
                var v1 = trait.dataId
                var v2 = list[v1]
                //元素比例
                var v3 = trait.value
                var v4 = v3 * 100

                break
            //特征负面效果比例
            case Game_BattlerBase.TRAIT_DEBUFF_RATE, 12:


                //状态种类
                trait.dataId
                //状态有效度
                trait.value

                var v1 = trait.dataId
                var v2 = ""
                var v3 = ""
                var state = $dataStates[v1]
                if (state) {
                    var v2 = state.icon
                    var v3 = state.name
                }

                //状态有效度
                trait.value
                var v4 = trait.value
                var v5 = v4 * 100

                break
            //特征状态比例
            case Game_BattlerBase.TRAIT_STATE_RATE, 13:
                //状态种类
                trait.dataId
                //状态有效度
                trait.value

                var v1 = trait.dataId
                var v2 = ""
                var v3 = ""
                var state = $dataStates[v1]
                if (state) {
                    var v2 = state.icon
                    var v3 = state.name
                }

                //状态有效度
                trait.value
                var v4 = trait.value
                var v5 = v4 * 100

                break
            //特征状态无效化
            case Game_BattlerBase.TRAIT_STATE_RESIST, 14:
                //状态种类
                trait.dataId

                var v1 = trait.dataId
                var v2 = ""
                var v3 = ""
                var state = $dataStates[v1]
                if (state) {
                    var v2 = state.icon
                    var v3 = state.name
                }

                break
            //特征参数
            case Game_BattlerBase.TRAIT_PARAM, 21:
                //普通参数种类
                trait.dataId
                //普通参数比例
                trait.value

                var list = DataMessage.params()

                var v1 = trait.dataId

                var v2 = list[v1]

                var v3 = trait.value

                var v4 = v3 * 100
                break

            //特征x参数
            case Game_BattlerBase.TRAIT_XPARAM, 22:

                trait.dataId
                //普通增加比率
                trait.value

                var list = DataMessage.xparams()

                var v1 = trait.dataId
                var v2 = list[v1]


                var v3 = trait.value
                var v4 = v3 * 100
                break

            //特征s参数
            case Game_BattlerBase.TRAIT_SPARAM, 23:
                trait.dataId
                //普通增加比率
                trait.value

                var list = DataMessage.sparams()

                var v1 = trait.dataId
                var v2 = list[v1]

                var v3 = trait.value
                var v4 = v3 * 100

                break

            //特征攻击元素
            case Game_BattlerBase.TRAIT_ATTACK_ELEMENT, 31:
                //元素种类 
                trait.dataId


                var list = DataMessage.elements()
                var v1 = trait.dataId
                var v2 = list[v1]

                break
            //特征攻击状态
            case Game_BattlerBase.TRAIT_ATTACK_STATE, 32:
                //状态种类
                trait.dataId
                var v1 = trait.dataId
                var v2 = ""
                var v3 = ""
                var state = $dataStates[v1]
                if (state) {
                    var v2 = state.icon
                    var v3 = state.name
                }

                //状态有效度
                trait.value
                var v4 = trait.value
                var v5 = v4 * 100
                break

            //特征攻击速度
            case Game_BattlerBase.TRAIT_ATTACK_SPEED, 33:

                //攻击速度增加
                trait.value

                var v1 = trait.value

                break

            //特征攻击次数
            case Game_BattlerBase.TRAIT_ATTACK_TIMES, 34:


                //攻击次数增加
                trait.value

                var v1 = trait.value

                break

            //特征类型增加
            case Game_BattlerBase.TRAIT_STYPE_ADD, 41:

                //增加技能类型
                trait.dataId

                var list = this.skillTypes()
                var v1 = trait.dataId
                var v2 = list[v1]

                break

            //特征类型封印
            case Game_BattlerBase.TRAIT_STYPE_SEAL, 42:

                //封印技能类型
                trait.dataId

                var list = this.skillTypes()
                var v1 = trait.dataId
                var v2 = list[v1]

                break

            //特征技能增加
            case Game_BattlerBase.TRAIT_SKILL_ADD, 43:
                //添加技能
                trait.dataId
                var v1 = trait.dataId
                var v2 = ""
                var v3 = ""
                var skill = $dataSkills[v1]
                if (skill) {
                    v2 = skill.name
                    v3 = skill.icon
                }

                break

            //特征技能封印
            case Game_BattlerBase.TRAIT_SKILL_SEAL, 44:
                //封印技能
                trait.dataId

                var v1 = trait.dataId
                var v2 = ""
                var v3 = ""
                var skill = $dataSkills[v1]
                if (skill) {
                    v2 = skill.name
                    v3 = skill.icon

                }

                break

            //特征装备武器
            case Game_BattlerBase.TRAIT_EQUIP_WTYPE, 51:
                //武器种类
                trait.dataId

                var list = this.weaponTypes()
                var v1 = trait.dataId
                var v2 = list[v1]

                break

            //特征装备防具
            case Game_BattlerBase.TRAIT_EQUIP_ATYPE, 52:
                //防具种类
                trait.dataId

                var list = this.armorTypes()
                var v1 = trait.dataId
                var v2 = list[v1]

                break

            //特征装备固定
            case Game_BattlerBase.TRAIT_EQUIP_LOCK, 53:
                //装备种类
                trait.dataId

                var list = this.equipTypes()
                var v1 = trait.dataId
                var v2 = list[v1]

                break

            //特征装备封印
            case Game_BattlerBase.TRAIT_EQUIP_SEAL, 54:
                //装备种类
                trait.dataId

                var list = this.equipTypes()
                var v1 = trait.dataId
                var v2 = list[v1]

                break
            //特征孔种类
            case Game_BattlerBase.TRAIT_SLOT_TYPE, 55:
                //二刀流种类
                trait.dataId
                if (trait.dataId) {
                    var v1 = "二刀流"
                }
                break

            //特征行动添加
            case Game_BattlerBase.TRAIT_ACTION_PLUS, 61:
                //行动追加比例
                var v1 = trait.value

                var v2 = v1 * 100

                break

            //特征特殊标记
            case Game_BattlerBase.TRAIT_SPECIAL_FLAG, 62:

                var v1 = trait.dataId
                switch (trait.dataId) {
                    //标记id自动战斗
                    case Game_BattlerBase.FLAG_ID_AUTO_BATTLE, 0:
                        var v2 = "自动战斗"
                        break
                    //标记id防御
                    case Game_BattlerBase.FLAG_ID_GUARD, 1:
                        var v2 = "防御"
                        break
                    //标记id替代
                    case Game_BattlerBase.FLAG_ID_SUBSTITUTE, 2:
                        var v2 = "替代"
                        break
                    //标记id保留tp
                    case Game_BattlerBase.FLAG_ID_PRESERVE_TP, 3:
                        var v2 = "保留tp"
                        break
                    default:
                        break;
                }
                break
            //特征死亡种类
            case Game_BattlerBase.TRAIT_COLLAPSE_TYPE, 63:

                break
            //特征队伍能力
            case Game_BattlerBase.TRAIT_PARTY_ABILITY, 64:
                var v1 = trait.dataId
                var v2 = ""

                switch (trait.dataId) {
                    //游戏队伍 能力遭遇减半
                    case Game_Party.ABILITY_ENCOUNTER_HALF, 0:
                        var v2 = "遭遇减半"
                        break
                    //游戏队伍 能力遭遇无效
                    case Game_Party.ABILITY_ENCOUNTER_NONE, 1:
                        var v2 = "遭遇无效"
                        break
                    //游戏队伍 能力突然袭击 
                    case Game_Party.ABILITY_CANCEL_SURPRISE, 2:
                        var v2 = "突然袭击"
                        break
                    //游戏队伍 能力先发制人
                    case Game_Party.ABILITY_RAISE_PREEMPTIVE, 3:
                        var v2 = "先发制人"
                        break
                    //游戏队伍 能力金钱双倍
                    case Game_Party.ABILITY_GOLD_DOUBLE, 4:
                        var v2 = "金钱双倍"
                        break
                    //游戏队伍 能力物品掉落双倍
                    case Game_Party.ABILITY_DROP_ITEM_DOUBLE, 5:
                        var v2 = "物品掉落双倍"
                        break
                    default:
                        break;
                }
                break
            default:
                break;
        }
        if (v1 || v2 || v3 || v4 || v5) {
            return re.format(v1, v2, v3, v4, v5);
        }
    }
    return ""
}



DataMessage.getItemTrait = function (traits, i, must, set) {
    var re = ""
    var v1 = ""
    var v2 = ""
    var v3 = ""
    var v4 = ""
    var v5 = ""
    var set = set || DataMessage.itemTraitSet

    var trait = traits && traits[i]
    if (trait && (!must || trait.code == must) && set) {
        var re = set[trait.code]
        switch (trait.code) {
            //效果 恢复 hp
            case Game_Action.EFFECT_RECOVER_HP, 11:

                var v1 = ""
                var v2 = ""
                //百分比 
                if (trait.value1) {
                    v1 = trait.value1 * 100 + "%"
                }
                //固定值 
                if (trait.value2) {
                    v2 = trait.value2
                }

                break
            //效果 恢复 mp
            case Game_Action.EFFECT_RECOVER_MP, 12:

                //百分比 
                var v1 = ""
                var v2 = ""
                //百分比 
                if (trait.value1) {
                    v1 = trait.value1 * 100 + "%"
                }
                //固定值 
                if (trait.value2) {
                    v2 = trait.value2
                }

                break
            //效果 获得 tp
            case Game_Action.EFFECT_GAIN_TP, 13:
                //固定值  
                var v1 = trait.value1
                
                break
            //效果 添加 状态
            case Game_Action.EFFECT_ADD_STATE, 21:
                if (trait.dataId == 0) {
                   var  v1 = trait.dataId 
                   var  v2 = 0
                   var  v3 = "普通攻击" //添加普通攻击状态
                
                } else {
                    var list = $dataStates
                    var v1 = trait.dataId //添加状态
                    var state = list[v1]
                    if (state) {
                        var v2 = state.icon
                        var v3 = state.name
                    }
                }
                //移除状态比例
                if (trait.value1) {
                    var v4 = trait.value1
                    var v5 = v4 * 100 + "%"
                }
                break
            //效果 移除 状态
            case Game_Action.EFFECT_REMOVE_STATE, 22:
                if (trait.dataId) {
                    var list = $dataStates
                    var v1 = trait.dataId //添加状态
                    var state = list[v1]
                    if (state) {
                        var v2 = state.icon
                        var v3 = state.name
                    }
                }
                //移除状态比例
                if (trait.value1) {
                    var v4 = trait.value1
                    var v5 = v4 * 100+ "%"
                }
                break
            //效果 添加 正面效果
            case Game_Action.EFFECT_ADD_BUFF, 31:

                var list = this.params()
                //种类
                trait.dataId
                var v1 = trait.dataId
                var v2 = list[v1]
                //回合数
                trait.value1
                var v3 = trait.value1

                break
            //效果 添加 负面效果
            case Game_Action.EFFECT_ADD_DEBUFF, 32:

                var list = this.params()
                //种类   
                trait.dataId
                var v1 = trait.dataId
                var v2 = list[v1]
                //回合数
                trait.value1
                var v3 = trait.value1

                break
            //效果 移除 正面效果
            case Game_Action.EFFECT_REMOVE_BUFF, 33:

                var list = this.params()
                //种类
                trait.dataId
                var v1 = trait.dataId
                var v2 = list[v1]

                break
            //效果 移除 负面效果
            case Game_Action.EFFECT_REMOVE_DEBUFF, 34:
                var list = this.params()
                //种类
                trait.dataId
                var v1 = trait.dataId
                var v2 = list[v1]

                break
            //效果 额外的
            case Game_Action.EFFECT_SPECIAL, 41:
                //特殊 效果 逃跑 
                if (trait.dataId == Game_Action.SPECIAL_EFFECT_ESCAPE) {
                    var v1 = "逃跑"
                }
                break
            //效果 生长
            case Game_Action.EFFECT_GROW, 42:

                var list = this.params()
                //种类

                trait.dataId
                var v1 = trait.dataId
                var v2 = list[v1]

                //增加数
                trait.value1
                var v3 = trait.value1
                
                break
            //效果 学习技能
            case Game_Action.EFFECT_LEARN_SKILL, 43:
                //技能id
                trait.dataId

                var v1 = trait.dataId
                var v2 = ""
                var v3 = ""
                var skill = $dataSkills[v1]
                if (skill) {
                    v2 = skill.name
                    v3 = skill.icon
                } 
                break
            //效果 公共事件
            case Game_Action.EFFECT_COMMON_EVENT, 44:
                break
            default:
                break;
        }

        if (v1 || v2 || v3 || v4 || v5) { 
            return re.format(v1, v2, v3, v4, v5);
        }
    }
    return ""


}



/***获取参数组 */
DataMessage.pushActorParams = function (params, must, set, list) {
    var list = list || []
    for (var i = 0; i < params.length; i++) {
        var r = this.getActorParam(params, i, must, set)
        if (r) {
            list.push(r)
        }
    }
    return list
}



DataMessage.pushActorTraits = function (traits, must, set, list) {
    var list = list || []
    for (var i = 0; i < traits.length; i++) {
        var r = this.getActorTrait(traits, i, must, set)
        if (r) {
            list.push(r)
        }
    }
    return re

}


DataMessage.pushItemTraits = function (traits, must, set, list) {
    var list = list || []
    for (var i = 0; i < traits.length; i++) {
        var r = this.getItemTrait(traits, i, must, set)
        if (r) {
            list.push(r)
        }
    }
    return list

}



DataMessage.pushIs = function (is, item, type, must, set, list) {
    var list = list || []
    if (item) {
        if (type == "params") {
            DataMessage.pushActorParams(item.params, must, set, list)
        } else if (type == "traits" || type == "effects") {
            if (is == "actor" || is == "weapon" || is == "armor") {
                DataMessage.pushActorTraits(item.traits, must, set, list)
            } else {
                DataMessage.pushItemTraits(item.effects, must, set, list)
            }
        } else {
            DataMessage.pushIsOther(is, item, type, must, set, list)
        }
    }
    return list
}

DataMessage.pushIsOther = function (is, item, type, must, set, list) {
    var list = list || []
    var r = ""
    if (item) {
        switch (is) {
            case "actor":
                r = this.getActor(item, type, must, set)
                break;
            case "weapon":
                r = this.getWeapon(item, type, must, set)
                break;
            case "item":
                r = this.getItem(item, type, must, set)
                break;
            case "armor":
                r = this.getArmor(item, type, must, set)
                break;
            case "skill":
                r = this.getSkill(item, type, must, set)
                break;
            default:
                break;
        }
        if (r) {
            list.push(r)
        }
    }
    return list
}




DataMessage.pushSet = {
    actor: ["name", ""],
    item: ["name", "iconIndex", "description", "consumable", "itypeId", "tpGain", "repeats", "hitType", "occasion", "scope",  "speed", "successRate", "effects", "price"]

}



DataMessage.pushList =- function (item, set, list) {

    var type = this.isObj(item)
    console.log(type)
    var set = set || DataMessage.pushSet[type]
    var list = list || []
    if (type && set) {
        for (var i = 0; i < set.length; i++) {
            var t = set[i]
            console.log(DataMessage.pushIs(type, item, t, 0, 0, list))
        }

    }
    return list
}



DataMessage.list2Text = function (list) {

    var list = list || []
    var re = ""
    if(list[0]){
        re = list[0]||""
    }
    for (var i = 1; i < list.length; i++) {
        re+= "\n" + list[i] 
    }
    return re
}