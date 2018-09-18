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
 *   
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
 * 战斗测试
 * @param {number} troopId  敌群id 
 * @param {boolean} starthf 开始前恢复全体
 * @param {boolean} endtrue 把这个结果作为真实结果,会死亡 
 * @param {boolean} get 获得战利品
 * @param {boolean} dis 获得战利品显示
 * @param {boolean} re 直接设置结果 
 * @returns {[number,number]} 返回结果为数组,第一个值为2时为胜利,第二个值为回合
 *  
 */

BattleManager.battleTest = function (troopId, starthf, endtrue, get, dis, re) {
    if (!endtrue) {
        //保存数据
        var json = JsonEx.stringify(DataManager.makeSaveContents());
    }
    var re = re || this.battleTest(troopId, starthf)
    if (endtrue) {
        if (re[0] == 2) {
            BattleManager.getBattleRewards(get, dis)
        }
    } else {
        //恢复数据
        DataManager.extractSaveContents(JsonEx.parse(json));
    }
    return re
}



/**
 * 战斗测试
 * @param {number} troopId  敌群id 
 * @param {boolean} starthf 开始前恢复全体
 * @param {boolean} endtrue 把这个结果作为真实结果,会死亡 
 * @param {boolean} get 获得战利品
 * @param {boolean} dis 获得战利品显示
 * @param {boolean} re 直接设置结果 
 * @returns {boolean} 返回胜利或者失败
 *  
 */

BattleManager.battleTestRe = function (troopId, starthf, endtrue, get, dis, re) {
    var re =  BattleManager.battleTest(troopId, starthf, endtrue, get, dis, re)
    return re[0] == 2 
}


/**
 * 获取10次战斗中获胜的次数
 * @param {number} troopId  敌群id
 * @param {boolean} starthf 开始前恢复全体
 * 
 */

BattleManager.getBattleTestPer = function (troopId, starthf) {
    var n = 0
    var i = 10
    while (i--) {
        var re = this.battleTest(troopId, starthf)
        if (re[0] == 2) {
            n++
        }
    }
    return n
}




BattleManager.battleTestEnd = function () {
    this._testBattle = false
    this._phase = null;
}

/**
 * 
 * @param {number} troopId  敌群id
 * @param {boolean} starthf 开始前恢复全体
 * 
 */

BattleManager.doBattleTest = function (troopId, starthf) {
    BattleManager._testBattle = true
    this.initMembers();
    $gameTroop.setup(troopId);
    //$gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
    starthf && $gameParty.members().forEach(function (actor) { actor.recoverAll(); });

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
 * 获得战利品
 * 
 */
BattleManager.getBattleRewards = function (get, dis) {
    if (get) {
        BattleManager.makeRewards()
        BattleManager.gainRewards()
        dis && BattleManager.displayRewards()
    }
    return true
}




