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



DataMessage.loadOBJ = function () {

    //如果是技能
    if (DataManager.isSkill(item)) {

        DataMessage.loadSkill(item)

        //否则 如果 数据管理器 是物品(item)
    } else if (DataManager.isItem(item)) {



        //否则 如果 数据管理器 是武器(item)
    } else if (DataManager.isWeapon(item)) {


        //否则 如果 数据管理器 是防具(item)
    } else if (DataManager.isArmor(item)) {


        //否则 
    } else {
    }
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


DataMessage.getSkill = function (item, type, must) {

    var re = ""
    var v1 = ""
    var v2 = ""
    switch (type) {
        case "name": "攻击"
            re = "名称:"
            var v1 = item[type]
            break
        case "iconIndex":
            //图标
            re = "\\I[%1]"
            var v1 = item[type]
            break
        case "note":
            re = ""//文本 
            break
        case "description":
            re = "" //说明
            break
        case "tpCost":
            re = "TP消耗"
            var v1 = item[type]
            break
        case "mpCost":
            re = "MP消耗"
            var v1 = item[type]
            break
        case "repeats":
            re = "连续次数"
            var v1 = item[type]
            break
        case "hitType": 1
            re = "命中种类:"
            var v1 = item[type]
            var v2 = this.skillHitType()[v1]
            break
        case "occasion":

            re = "应用场景"
            var v1 = item[type]
            var v2 = this.skillOccasion()[v1]
            break
        case "scope":
            re = "范围:"
            var v1 = item[type]
            var v2 = this.skillScope()[v1]

            break
        case "stypeId": 0
            re = "技能种类"
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

        default:
            break;
    }


}






DataMessage.loadSkill = function (item) {





}


get = function (trait) {
    var re = ""
    var v1 = ""
    var v2 = ""
    if (trait) {
        switch (trait.code) {
            //效果 恢复 hp
            case Game_Action.EFFECT_RECOVER_HP, 11:

                re = "恢复hp"
                //百分比 
                if (trait.value1) {
                    v1 = trait.value1 * 100 + "%"
                }
                //固定值 
                if (trait.value2) {
                    v1 = (v1 ? v1 + " + " : "") + trait.value2
                }


                break
            //效果 恢复 mp
            case Game_Action.EFFECT_RECOVER_MP, 12:
                //百分比 
                if (trait.value1) {
                    v1 = trait.value1 * 100 + "%"
                }
                //固定值 
                if (trait.value2) {
                    v1 = (v1 ? v1 + " + " : "") + trait.value2
                }
                break
            //效果 获得 tp
            case Game_Action.EFFECT_GAIN_TP, 13:
                //固定值 
                if (trait.value1) {
                    v1 = trait.value1
                }
                break
            //效果 添加 状态
            case Game_Action.EFFECT_ADD_STATE, 21:
                if (trait.dataId == 0) {
                    v1 = "" //添加普通攻击状态
                } else {
                    v1 = trait.dataId //添加状态
                }
                //添加状态比例
                if (trait.value1) {
                    v2 = trait.value1 * 100
                }
                break
            //效果 移除 状态
            case Game_Action.EFFECT_REMOVE_STATE, 22:
                if (trait.dataId) {
                    v1 = trait.dataId //移除状态
                }
                //移除状态比例
                if (trait.value1) {
                    v2 = trait.value1 * 100
                }
                break
            //效果 添加 正面效果
            case Game_Action.EFFECT_ADD_BUFF, 31:


                var list = ["最大HP", "最大MP", "攻击力", "防御力", "魔法力", "魔法防御", "敏捷性", "幸运"]
                //种类
                var type = list[trait.dataId]
                //回合数
                if (trait.value1) {
                    re = trait.value1
                }
                break
            //效果 添加 负面效果
            case Game_Action.EFFECT_ADD_DEBUFF, 32:

                var list = ["最大HP", "最大MP", "攻击力", "防御力", "魔法力", "魔法防御", "敏捷性", "幸运"]
                //种类
                var type = list[trait.dataId]
                //回合数
                if (trait.value1) {
                    re = trait.value1
                }
                break
            //效果 移除 正面效果
            case Game_Action.EFFECT_REMOVE_BUFF, 33:

                var list = ["最大HP", "最大MP", "攻击力", "防御力", "魔法力", "魔法防御", "敏捷性", "幸运"]
                //种类
                var type = list[trait.dataId]

                break
            //效果 移除 负面效果
            case Game_Action.EFFECT_REMOVE_DEBUFF, 34:
                var list = ["最大HP", "最大MP", "攻击力", "防御力", "魔法力", "魔法防御", "敏捷性", "幸运"]
                //种类
                var type = list[trait.dataId]
                break
            //效果 额外的
            case Game_Action.EFFECT_SPECIAL, 41:
                //特殊 效果 逃跑 
                if (trait.dataId == Game_Action.SPECIAL_EFFECT_ESCAPE) {
                    re = "逃跑"
                }
                break
            //效果 生长
            case Game_Action.EFFECT_GROW, 42:
                var list = ["最大HP", "最大MP", "攻击力", "防御力", "魔法力", "魔法防御", "敏捷性", "幸运"]
                //种类
                var type = list[trait.dataId]
                //增加数
                if (trait.value1) {
                    re = trait.value1
                }
                break
            //效果 学习技能
            case Game_Action.EFFECT_LEARN_SKILL, 43:
                //技能id
                effect.dataId
                break
            //效果 公共事件
            case Game_Action.EFFECT_COMMON_EVENT, 44:
                break
            default:
                break;
        }
    }


}








get2 = function () {
    switch (trait.code) {
        //特征元素比例
        case Game_BattlerBase.TRAIT_ELEMENT_RATE, 11:

            //元素种类
            trait.dataId
            //元素比例
            trait.value * 100
            break
        //特征负面效果比例
        case Game_BattlerBase.TRAIT_DEBUFF_RATE, 12:
            //状态种类
            trait.dataId
            //状态有效度
            trait.value * 100
            break
        //特征状态比例
        case Game_BattlerBase.TRAIT_STATE_RATE, 13:
            //状态种类
            trait.dataId
            //状态有效度
            trait.value * 100
            break
        //特征状态无效化
        case Game_BattlerBase.TRAIT_STATE_RESIST, 14:
            //状态种类
            trait.dataId
            break
        //特征参数
        case Game_BattlerBase.TRAIT_PARAM, 21:
            //普通参数种类
            trait.dataId
            //普通参数比例
            trait.value * 100


            break

        //特征x参数
        case Game_BattlerBase.TRAIT_XPARAM, 22:


            ["命中率", "闪避率", "会心率", "会心闪避率", "魔法闪避率", "魔法反射率", "反击率", "HP恢复率", "MP恢复率", "TP恢复率"]
            trait.dataId


            //普通增加比率
            trait.value * 100
            break

        //特征s参数
        case Game_BattlerBase.TRAIT_SPARAM, 23:

            ["被攻击率", "防御效果率", "恢复效果率", "药物知识", "MP消耗率", "TP充能率", "物理伤害率", "魔法伤害率", "地形伤害率", "经验获得率"]
            trait.dataId
            //普通增加比率
            trait.value * 100
            break

        //特征攻击元素
        case Game_BattlerBase.TRAIT_ATTACK_ELEMENT, 31:
            //元素种类 
            trait.dataId
            break
        //特征攻击状态
        case Game_BattlerBase.TRAIT_ATTACK_STATE, 32:
            //状态种类
            trait.dataId
            //状态有效度
            trait.value * 100
            break

        //特征攻击速度
        case Game_BattlerBase.TRAIT_ATTACK_SPEED, 33:

            //攻击速度增加
            trait.value
            break

        //特征攻击次数
        case Game_BattlerBase.TRAIT_ATTACK_TIMES, 34:


            //攻击次数增加
            trait.value
            break

        //特征类型增加
        case Game_BattlerBase.TRAIT_STYPE_ADD, 41:

            //增加技能类型
            trait.dataId

            break

        //特征类型封印
        case Game_BattlerBase.TRAIT_STYPE_SEAL, 42:

            //封印技能类型
            trait.dataId
            break

        //特征技能增加
        case Game_BattlerBase.TRAIT_SKILL_ADD, 43:
            //添加技能
            trait.dataId
            break

        //特征技能封印
        case Game_BattlerBase.TRAIT_SKILL_SEAL, 44:
            //封印技能
            trait.dataId
            break

        //特征装备武器
        case Game_BattlerBase.TRAIT_EQUIP_WTYPE, 51:
            //武器种类
            trait.dataId

            break

        //特征装备防具
        case Game_BattlerBase.TRAIT_EQUIP_ATYPE, 52:
            //防具种类
            trait.dataId
            break

        //特征装备固定
        case Game_BattlerBase.TRAIT_EQUIP_LOCK, 53:
            //装备种类
            trait.dataId
            break

        //特征装备封印
        case Game_BattlerBase.TRAIT_EQUIP_SEAL, 54:
            //装备种类
            trait.dataId
            break
        //特征孔种类
        case Game_BattlerBase.TRAIT_SLOT_TYPE, 55:
            //二刀流种类
            trait.dataId
            break

        //特征行动添加
        case Game_BattlerBase.TRAIT_ACTION_PLUS, 61:
            //行动追加比例
            trait.value * 100
            break

        //特征特殊标记
        case Game_BattlerBase.TRAIT_SPECIAL_FLAG, 62:

            switch (trait.dataId) {
                //标记id自动战斗
                case Game_BattlerBase.FLAG_ID_AUTO_BATTLE, 0:
                    break
                //标记id防御
                case Game_BattlerBase.FLAG_ID_GUARD, 1:
                    break

                //标记id替代
                case Game_BattlerBase.FLAG_ID_SUBSTITUTE, 2:
                    break
                //标记id保留tp
                case Game_BattlerBase.FLAG_ID_PRESERVE_TP, 3:
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
            switch (trait.dataId) {
                //游戏队伍 能力遭遇减半
                case Game_Party.ABILITY_ENCOUNTER_HALF, 0:
                    break
                //游戏队伍 能力遭遇无效
                case Game_Party.ABILITY_ENCOUNTER_NONE, 1:
                    break
                //游戏队伍 能力突然袭击 
                case Game_Party.ABILITY_CANCEL_SURPRISE, 2:
                    break
                //游戏队伍 能力先发制人
                case Game_Party.ABILITY_RAISE_PREEMPTIVE, 3:
                    break
                //游戏队伍 能力金钱双倍
                case Game_Party.ABILITY_GOLD_DOUBLE, 4:
                    break
                //游戏队伍 能力物品掉落双倍
                case Game_Party.ABILITY_DROP_ITEM_DOUBLE, 5:
                    break
                default:
                    break;
            }
            break
        default:
            break;
    }




}
