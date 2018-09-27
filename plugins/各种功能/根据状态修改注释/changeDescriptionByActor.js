//=============================================================================
// changeDescriptionByActor.js
//=============================================================================
/*:
 * @plugindesc 根据状态修改注释
 * @author wangwang
 *
 * @param changeDescriptionByActor
 * @desc 自动保存游戏数据
 * @default 汪汪
 * 
 * @help
 * 
 * changeDescriptionByActor
 * 根据状态修改注释
 * 
 * 
 * 在物品说明中,修改物品注释,
 * 如果物品注释中有以下格式,
 * #[数字,数字,(数字,)任意字符]#
 * 注意格式,开头必须 #[ 
 * 
 * 最后一个参数一般可以用任何字符,直到第一个 ]#
 * 
 * 
 * 则会转化为需要的内容 
 * 转化规则为
 * 
 * 第一个为 种类 type   第二个为参数 id ,第三个... id  ,最后为 替换内容
 * 对于不同type 
 * 0 状态 有 id 的状态
 * 1 职业 是 id 的职业(数据库中第一个为1) 
 * 2 技能 有 id 的技能
 * 3 武器 有 id 的物品
 * 4 防具 有 id 的防具
 * 5 队伍 有 id 的物品
 * 6 队伍 有 id 的角色
 * 7 金钱 有 id 以上
 * 8 步数 有 id 以上
 * 9 人数 有 id 以上
 * 当id 为 0 时, 则下一个判断变成  不符合条件 的判断
 * 
 *  
 * 如果符合对应条件,则转化为 替换内容 ,否则为 ""
 * 
 * 对于多个参数,只要有一个成立就使用替换内容
 * 
 * type 也可以用   1x , 2x , 3x
 *  
 * 为 1x 时, 只要有一个成立,则不显示替换内容
 * 为 2x 时, 全部成立时 , 显示替换内容 
 * 为 3x 时, 全部成立时 , 不显示替换内容
 * 
 * 
 *  
 * 
 * 写法示例:
 * 注释中这样写
 * 剑的测试#[0,1,\c[1]]##[10,1,\c[2]]#状态1
 *
 * 当存在状态1(死亡状态时)
 * 注释为 剑的测试\c[1]状态1
 * 
 * 当不存在状态1(死亡状态时)
 * 注释为 剑的测试\c[2]状态1
 * 
 * 
 * 
 * 注释中这样写
 * 剑的测试#[0,1,\c[1]]#状态1
 *
 * 当存在状态1(死亡状态时)
 * 注释为 剑的测试\c[1]状态1
 * 
 * 当不存在状态1(死亡状态时)
 * 注释为 剑的测试状态1
 * 
 * 
 * 多参数的例子:
 * #[0,1,2,3,\c[1]1|2|3]##[10,1,2,3,\c[2]!(1|2|3)]##[20,1,2,3,\c[3]1&2&3]##[30,1,2,3,\c[4]!(1&2&3)]##[0,1,0,2,3,\c[5]1|!2|3]#
 * 
 * 
 *   
 * 
 * 额,目前只测试了状态的判断,没有测试其他的,不过应该没问题
 * 
 * 目前修改了 物品列表 ,技能列表 , 装备孔 ,商店购买 这些窗口的物品注释,
 * 如果有bug或有其他窗口需要修改请联系
 * 
 *  
 * 
 * */






var ww = ww || {}


ww.changeDescriptionByActor = {}

ww.changeDescriptionByActor.rex = /\#\[((\s*\d+\s*,){2,})(.*?)\]\#/g 
ww.changeDescriptionByActor.changeDescription = function () {

  
    var actor = this._actor

    var cs = arguments[1]
    var show = arguments[3]

    var csl = JSON.parse("[" + cs + "0]") 
    var type = csl.shift()
    csl.pop()
   
    var xf = Math.floor(type * 0.1)
    type = type - xf * 10

    var last = -1
 
    var zh = 0
    for (var i = 0; i < csl.length; i++) {
        var n = csl[i]
        if (zh != 1 && !n) {
            zh = 1
            continue
        }
        var change = 0
        if (actor) {
            if (type == 0) {
                change = actor.isStateAffected(n)
            } else if (type == 1) {
                change = actor.isClass($dataClasses[n]);
            } else if (type == 2) {
                change = actor.hasSkill(n);
            } else if (type == 3) {
                change = actor.hasWeapon($dataWeapons[n]);
            } else if (type == 4) {
                change = actor.hasArmor($dataArmors[n]);
            }
        }
        if (type == 5) {
            change = $gameParty.hasItem($dataItems[n])
        } else if (type == 6) {
            change = $gameParty.members().contains($gameActors.actor(n))
        } else if (type == 7) {
            change = $gameParty.gold() >= n
        } else if (type == 8) {
            change = $gameParty.steps() >= n
        } else if (type == 9) {
            change = $gameParty.size() >= n
        }
 
        if (zh == 1) {
            change = !change
            zh = 0
        }
 
        if (last == -1) {
            last = change
        } else {
            if (!xf) {
                last = last || change
            } else if (xf == 1) {
                last = last || change
            } else if (xf == 2) {
                last = last && change
            } else if (xf == 3) {
                last = last && change
            }
        }
    } 
    if(last == -1){
        last = 0
    } 

    if (xf == 1 || xf == 3) {
        last = !last
    }
 
    if (last) {
        return show
    } else {
        return ""
    }
}



Window_EquipSlot.prototype.setHelpWindowItem = function (item) {
    //如果(帮助窗口)
    if (this._helpWindow) {
        var description = item && item.description || ''

        var rex = ww.changeDescriptionByActor.rex

        var description = description.replace(rex, ww.changeDescriptionByActor.changeDescription.bind(this))
        var description = description.replace(/\\n/,"\n" )

        this._helpWindow.setItem({ description: description });
    }
};



Window_ItemList.prototype.setHelpWindowItem = function (item) {
    if (this._helpWindow) {
        var description = item && item.description || ''
        var rex = ww.changeDescriptionByActor.rex

        var description = description.replace(rex, ww.changeDescriptionByActor.changeDescription.bind(this))
        var description = description.replace(/\\n/,"\n" )

        this._helpWindow.setItem({ description: description });
    }
};



Window_SkillList.prototype.setHelpWindowItem = function (item) {
    if (this._helpWindow) {
        var description = (item && item.description) || ''
        var rex = ww.changeDescriptionByActor.rex

        var description = description.replace(rex, ww.changeDescriptionByActor.changeDescription.bind(this))
        var description = description.replace(/\\n/,"\n" )

        this._helpWindow.setItem({ description: description });
    }
};




Window_ShopBuy.prototype.setHelpWindowItem = function (item) {
    if (this._helpWindow) {
        var description = (item && item.description) || ''
        var rex = ww.changeDescriptionByActor.rex

        var description = description.replace(rex, ww.changeDescriptionByActor.changeDescription.bind(this))
        var description = description.replace(/\\n/,"\n" )
        
        this._helpWindow.setItem({ description: description });
    }
};
