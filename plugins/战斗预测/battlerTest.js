BattleManager.setupTest = function (troopId) {

    var json = JsonEx.stringify(DataManager.makeSaveContents());

    var re = this.battleTest(troopId)

    DataManager.extractSaveContents(JsonEx.parse(json));
    return re 
}


BattleManager.battleTest = function (troopId) {
    
    this.initMembers();  
    $gameTroop.setup(troopId);  
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
    var i = 1000 
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
            }else{
                member.makeAutoBattleActions();
            }
        }); 
        $gameTroop.makeActions();
        this.makeActionOrders(); 
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

                    if (this.checkAbort()) {
                        return 3
                    } else if ($gameParty.isAllDead()) {
                        return 1
                    } else if ($gameTroop.isAllDead()) {
                         return 2
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
 
        if (this.checkAbort()) {
            return 3
        } else if ($gameParty.isAllDead()) {
            return 1
        } else if ($gameTroop.isAllDead()) {
            return 2
        } 
    }
    return  0 
}
 

BattleManager.setupTest(1)