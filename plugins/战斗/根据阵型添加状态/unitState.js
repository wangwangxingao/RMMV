
var ww = ww || {} 
ww.unitState = {}


/**
 * 种类
 * 1 添加阵型状态
 * 0 不刷新
 * -1 清除阵型状态
 * 
 * start:开始时刷新一遍
 * turn : 每回合刷新一遍
 * end:结束时刷新一遍
 * 
 */
ww.unitState.type = {
    start: 1,
    turn: 1,
    end: -1
}

/**
 * 添加的阵型状态列表, 
 * 用来删除所有可能添加的阵型状态,防止不符合状态存留
 */
ww.unitState.unitStateSetUse = [101, 102, 103, 104]

/**
 * 检查的状态列表
 * 从前往后,只取一个
 * 
 */
ww.unitState.unitStateList = [11, 12, 13, 14, 15, 16]

/**
 * 添加的阵型状态设置 
 * 根据阵型,给每一个人添加后面的状态
 * 
 * 阵型编码会自动排序
 * 如第一个为12 ,第二个为11 ,则最后结果为 "11,12" 对应的值
 * 如果第一个为11 第二个为11 则最后为 "11,11" 对应的设置
 * 
 */
ww.unitState.unitStateSet = {
    "11,11,11,11": [101],
    "11,12,13,14": [104],
}

 

ww.unitState.unitState = function (members) {
    if (members) {
        var list = []
        for (var i = 0; i < members.length; i++) {
            var member = members[i]
            var id = ww.unitState.isStateAffected(member,
                ww.unitState.unitStateList)
            if (id) {
                list.push(id)
            }
        }
        list.sort()
        return list.join("")
    }
    return "";
};




ww.unitState.isStateAffected = function (member, list) {
    if (member) {
        for (var i = 0; i < list.length; i++) {
            var id = list[i]
            if (member.isStateAffected(id)) {
                return id
            }
        }
    }
    return 0;
};


ww.unitState.eraseState = function (member, list) {
    if (member && list) {
        for (var i = 0; i < list.length; i++) {
            var id = list[i]
            if (id) {
                member.eraseState(id)
            }
        }
    }
    return 0;
};


ww.unitState.addState = function (member, list) {
    if (member && list) {
        console.log(member, list)
        for (var i = 0; i < list.length; i++) {
            var id = list[i]
            if (id) {
                member.addState(id)
            }
        }
    }
    return 0;
};

ww.unitState.refeshStateAdd = function (members) {
    if (members) {

        var unitState = ww.unitState.unitState(members)
        var list = ww.unitState.unitStateSet[unitState]
        if (list) {
            for (var i = 0; i < members.length; i++) {
                var member = members[i]
                if (member) {
                    if (Array.isArray(list)) {
                        ww.unitState.addState(member, list)
                    } else if (typeof list == "object") {
                        var id = ww.unitState.isStateAffected(member,
                            ww.unitState.unitStateList)
                        var l = list[id]
                        if (l) {
                            if (typeof l == "number") {
                                ww.unitState.addState(member, [l])
                            } else if (typeof list == "object") {
                                ww.unitState.addState(member, l)
                            }
                        }
                    } else if (typeof list == "number") {
                        ww.unitState.addState(member, [list])
                    }
                }
            }
        }
    }
}



ww.unitState.refeshStateErase = function (members) {
    if (members) {
        /**删除所有可能添加的状态,防止不符合状态存留 */
        var list = ww.unitState.unitStateSetUse
        if (list) {
            for (var i = 0; i < members.length; i++) {
                var member = members[i]
                if (member) {
                    ww.unitState.eraseState(member, list)
                }
            }
        }
    }
}

/**
 * 刷新状态
 * 
 * @param {0|1|-1} type 0时无改变,1时添加,-1时删除
 * 
 */
ww.unitState.refeshState = function (members, type) {
    if (members) {
        if (type) {
            /**删除所有可能添加的状态,防止不符合状态存留 */
            ww.unitState.refeshStateErase(members)
            if (type > 0) {
                /**添加阵型状态 */
                ww.unitState.refeshStateAdd(members)
            }
        }
    }
}




/**每回合都更新 */
ww.unitState.increaseTurn = Game_Troop.prototype.increaseTurn
Game_Troop.prototype.increaseTurn = function () {
    ww.unitState.increaseTurn.call(this)


    ww.unitState.refeshState(
        $gameParty.aliveMembers(),
        ww.unitState.type["turn"]
    )
};






/**战斗开始时更新 */

Game_Party.prototype.onBattleStart = function () {
    Game_Unit.prototype.onBattleStart.call(this)

    ww.unitState.refeshState(
        $gameParty.aliveMembers(), 
        ww.unitState.type["start"]
        )
};


/**当战斗结束时更新 */
Game_Party.prototype.onBattleEnd = function () {
    Game_Unit.prototype.onBattleEnd.call(this)

    ww.unitState.refeshState(
        $gameParty.aliveMembers(),
        ww.unitState.type["end"]
    )

};