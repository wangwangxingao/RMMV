//=============================================================================
// 2w_battleTest.js
//=============================================================================

/*:
 * @plugindesc 自动战斗结果
 * @author wangwang
 *   
 * @param 2w_battleTest
 * @desc 插件 自动战斗结果
 * @default 汪汪
 *  
 * 
 * @help 
 * 自动战斗模拟并返回结果 6 为失败,1-5为成功且分级
 * BattleManager.autoBattle(敌群id,是否先回复) 
 * 
 * */
Game_Battler.prototype.escape = function () {
    if ($gameParty.inBattle()) {
        this.hide();
    }
    this.clearActions();
    this.clearStates();
    !BattleManager._testBattle && SoundManager.playEscape();
};



/**
 * 恢复的战斗测试
 *
 * @param {number} troopId  敌群id
 * @param {boolean} hf 恢复本
 * 
 */


BattleManager.saveBattleTest = function (troopId, hf) {

    var json = JsonEx.stringify(DataManager.makeSaveContents());

    var re = this.battleTest(troopId, hf)
    //this.makeRewards()
    DataManager.extractSaveContents(JsonEx.parse(json));
    return re
}
/**
 * 
 * @param {number} troopId  敌群id
 * @param {boolean} hf 恢复
 * 
 */

BattleManager.getTestPer = function (troopId, hf) {
    var n = 0
    var i = 10
    while (i--) {
        var re = this.saveBattleTest(troopId, hf)
        if (re[0] == 2) {
            n++
        }
    }
    return "" + n * 10 + "%"
}




BattleManager.battleTestEnd = function () {
    this._testBattle = false
    this._phase = null;
}

/**
 * 
 * @param {number} troopId  敌群id
 * @param {boolean} hf 恢复
 * 
 * 
 */


BattleManager.battleTest = function (troopId, hf) {
    BattleManager._testBattle = true
    this.initMembers();
    $gameTroop.setup(troopId);
    //$gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
    if (hf) {
        $gameParty.members().forEach(function (actor) {
            actor.recoverAll();
        });
    }
    var i = 1000
    var t = 1
    while (true) {
        if (i-- < 0) { break }
        $gameParty.members().forEach(function (member) {
            member.clearActions();
            //如果( 能移动() )
            if (member.canMove()) {
                //动作次数 = 制作动作次数()
                var actionTimes = member.makeActionTimes();
                member._actions = [];
                for (var i = 0; i < actionTimes; i++) {
                    member._actions.push(new Game_Action(member));
                }
            }
            if (member.isConfused()) {
                member.makeConfusionActions();
            } else {
                member.makeAutoBattleActions();
            }
        });
        $gameTroop.makeActions();
        this.makeActionOrders();
        t++
        var subject = this.getNextSubject();
        while (subject) {
            if (i-- < 0) { break }
            var action = subject.currentAction();
            while (action) {
                if (i-- < 0) { break }
                action.prepare();
                if (action.isValid()) {
                    var targets = action.makeTargets();
                    subject.useItem(action.item());
                    action.applyGlobal()
                    var target = targets.shift();
                    if (target) {
                        //如果 数学 随机数 < 动作 项目反击比例(目标)
                        if (Math.random() < action.itemCnt(target)) {
                            var action = new Game_Action(target);
                            //动作 设置攻击()
                            action.setAttack();
                            //动作 应用(主体)
                            action.apply(subject);
                            //如果 数学 随机数 < 动作 项目魔法反击比例(目标)
                        } else if (Math.random() < action.itemMrf(target)) {
                            action._reflectionTarget = target;
                            action.apply(subject);
                        } else {
                            //检查替代(目标)
                            if (target.isDying() && !action.isCertainHit()) {
                                //替代者 = 目标 朋友小组() 替代战斗()
                                var substitute = target.friendsUnit().substituteBattler();
                                //如果 ( 替代者  并且  目标 不等于 替代者 )
                                if (substitute && target !== substitute) {
                                    target = substitute;
                                }
                            }
                            action.apply(target);
                        }
                    }
                    if ($gameParty.isEmpty()) {
                        this.battleTestEnd()

                        return [3, t]
                    } else if ($gameParty.isAllDead()) {
                        this.battleTestEnd()

                        return [1, t]
                    } else if ($gameTroop.isAllDead()) {
                        this.battleTestEnd()

                        return [2, t]
                    }
                }
                subject.removeCurrentAction();
                var action = subject.currentAction();
            }
            subject.onAllActionsEnd();
            subject = this.getNextSubject();
        }
        this.allBattleMembers().forEach(function (battler) {
            //战斗者 在回合结束
            battler.onTurnEnd();
        }, this);
        if (this.isForcedTurn()) {
            this._turnForced = false;
        }

        if ($gameParty.isEmpty()) {
            this.battleTestEnd()

            return [3, t]
        } else if ($gameParty.isAllDead()) {
            this.battleTestEnd()

            return [1, t]
        } else if ($gameTroop.isAllDead()) {
            this.battleTestEnd()

            return [2, t]
        }
    }
    this.battleTestEnd()
    return [0, t]
}







/**
 * 
 * @param {number} troopId  敌群id
 * @param {boolean} hf 恢复
 * 
 */

BattleManager.autoBattle = function (troopId, hf) {
    //var json = JsonEx.stringify(DataManager.makeSaveContents());

    var re = this.battleTest(troopId, hf)
    var v = 6
    if (re[0] == 2) {
        var t = re[1]
        if (t < 2) {
            v = 1
        } else if (t < 4) {
            v = 2
        } else if (t < 6) {
            v = 3
        } else if (t < 9) {
            v = 4
        } else {
            v = 5
        }

        BattleManager.makeRewards()
        BattleManager.gainRewards()
        if (this._rewards && this._rewards.itemHash) {
            var l = []
            for (var i in this._rewards.itemHash) {
                var list = this._rewards.itemHash[i]
                var name = list[0].name
                var num = list[1]
                var it = name + "x" + num
                
                l.push(it)
            }
            ww.pushMessage.list = l
        }
    } else {
        $gameParty.reviveBattleMembers()
    }
    $gameParty.onBattleEnd()
    ww.pushMessage.re = v



    $gameMessage.pushMessage2() 
 

    return v
}






Game_Party.prototype.gainRandomItem = function (type, id, min, max, includeEquip) {

    var num = max - min
    var amount = min + Math.randomInt(num)

    /** */

    if (type) {
        var item = null
        if (type == 1) {
            var item = $dataItems[id];
        } else if (type == 2) {
            var item = $dataWeapons[id];
        } else if (type == 3) {
            var item = $dataArmors[id];
        }
        if (item && amount) {
            var it = item.name + "x" + amount
            ww.pushMessage.list = ww.pushMessage.list || []
            ww.pushMessage.list.push(it)
            this.gainItem(item, amount, includeEquip)
        }
    } else {
        if (amount) {

            var it = TextManager.obtainGold.format(amount)
            ww.pushMessage.list = ww.pushMessage.list || []
            ww.pushMessage.list.push(it)
            this.gainGold(amount)


        }


    }


    $gameMessage.pushMessage2() 
     

};
