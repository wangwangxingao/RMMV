

var ww = ww||{}

ww.actorPlusEnemyAction = {}


ww.actorPlusEnemyAction.setup = Game_Actor.prototype.setup 


Game_Actor.prototype.setup = function(actorId) { 

    ww.actorPlusEnemyAction.setup.call(this,actorId)

    var actor = $dataActors[actorId];
    if(actor && actor.meta["enemyid"]  ){
        var enemyId = actor.meta["enemyid"]  * 1
        this.plusSetEnemyId(enemyId)
    } 
};




Game_Actor.prototype.plusSetEnemyId = function(enemyId){
    this._enemyId = enemyId
}

Game_Actor.prototype.enemy = function(){
    return $dataEnemies[this._enemyId]; 
}



 




/**满足条件*/
Game_Actor.prototype.meetsCondition = function(action) {
    //参数1 = 动作 条件参数1
    var param1 = action.conditionParam1;
    //参数2 = 动作 条件参数2
    var param2 = action.conditionParam2;
    //检查 (动作 条件种类)
    switch (action.conditionType) {
    //当 1
    case 1:
        //返回 满足回合条件(参数1,参数2)
        return this.meetsTurnCondition(param1, param2);
    //当 2
    case 2:
        //返回 满足hp条件(参数1,参数2)
        return this.meetsHpCondition(param1, param2);
    //当 3
    case 3:
        //返回 满足mp条件(参数1,参数2)
        return this.meetsMpCondition(param1, param2);
    //当 4
    case 4:
        //返回 满足状态条件(参数1)
        return this.meetsStateCondition(param1);
    //当 5
    case 5:
        //返回 满足队伍等级条件(参数1)
        return this.meetsPartyLevelCondition(param1);
    //当 6
    case 6:
        //返回 满足开关条件(参数1)
        return this.meetsSwitchCondition(param1);
    //缺省
    default:
        //返回 true
        return true;
    }
};
/**满足回合条件*/
Game_Actor.prototype.meetsTurnCondition = function(param1, param2) {
     var n = $gameTroop.turnCount();
     if (param2 === 0) {
         return n === param1;
     } else {
         return n > 0 && n >= param1 && n % param2 === param1 % param2;
    }
};
/**满足hp条件*/
Game_Actor.prototype.meetsHpCondition = function(param1, param2) {
     return this.hpRate() >= param1 && this.hpRate() <= param2;
};
/**满足mp条件*/
Game_Actor.prototype.meetsMpCondition = function(param1, param2) {
    //返回 mp比例() >= 参数1 并且 mp比例() <= 参数2
    return this.mpRate() >= param1 && this.mpRate() <= param2;
};
/**满足状态条件*/
Game_Actor.prototype.meetsStateCondition = function(param) {
    //返回 是状态影响(参数)
    return this.isStateAffected(param);
};
/**满足队伍等级条件*/
Game_Actor.prototype.meetsPartyLevelCondition = function(param) {
    //返回 游戏队伍 最高等级() >= 参数
    return $gameParty.highestLevel() >= param;
};
/**满足开关条件*/
Game_Actor.prototype.meetsSwitchCondition = function(param) {
    //返回 游戏开关组 值(参数)
    return $gameSwitches.value(param);
};
/**是有效动作*/
Game_Actor.prototype.isActionValid = function(action) {
    //返回 满足条件(动作) 并且 能用( 数据技能组[动作 技能id] )
    return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
};
/**选择动作*/
Game_Actor.prototype.selectAction = function(actionList, ratingZero) {
    //和 = 动作列表 缩减 方法(r,a//动作)
    var sum = actionList.reduce(function(r, a) {
        //返回 r + 动作 评分 - ratingZero//评分零
        return r + a.rating - ratingZero;
    // 0 )
    }, 0);
    //如果(和 > 0)
    if (sum > 0) {
        //值 = 数学 随机整数(和)
        var value = Math.randomInt(sum);
        //循环(开始时 i= 0 ;当 i < 动作列表 长度 ; 每一次 i++)
        for (var i = 0; i < actionList.length; i++) {
            //动作 = 动作列表[i]
            var action = actionList[i];
            //值 -= 动作 评分 - ratingZero//评分零
            value -= action.rating - ratingZero;
            //如果(值 < 0)
            if (value < 0) {
                //返回 动作
                return action;
            }
        }
    //否则 
    } else {
        //返回 null
        return null;
    }
};
/**选择所有动作组*/
Game_Actor.prototype.selectAllActions = function(actionList) {
    //评分最大 = 数学 最大值 应用(null,动作列表 映射 方法( a//动作 ))
    var ratingMax = Math.max.apply(null, actionList.map(function(a) {
        //返回 a 评分
        return a.rating;
    }));
    //评分零 = 评分最大 - 3
    var ratingZero = ratingMax - 3;
    //动作列表 =  动作列表 过滤 方法(a//动作)
    actionList = actionList.filter(function(a) {
        //返回 动作 评分 > 评分零
        return a.rating > ratingZero;
    });
    //循环(开始时 i= 0 ;当 i < 动作组总个数() ; 每一次 i++)
    for (var i = 0; i < this.numActions(); i++) {
        //动作(i) 设置敌人动作( 选择动作( 动作列表 ,评分零 ) )
        this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
    }
};



Game_Actor.prototype.makeAutoBattleActions = function() {
    if(this.enemy()){
        this.makeAutoBattleEnemyActions()
    }else{
        this.makeAutoBattleActorActions()
    }
}
/**制作动作组*/
Game_Actor.prototype.makeAutoBattleEnemyActions = function() { 
    //如果 (动作组总个数() > 0 )
    if (this.numActions() > 0) {
        //动作列表 = 敌人 动作组 过滤 方法(a//动作)
        var actionList = this.enemy().actions.filter(function(a) {
            //返回 是有效动作(动作)
            return this.isActionValid(a);
        //this )
        }, this);
        //如果 (动作列表 长度 > 0)
        if (actionList.length > 0) {
            //选择所有动作组(动作列表)
            this.selectAllActions(actionList);
        }
    }
    //设置动作状态( "waiting"//等待 )
    this.setActionState('waiting');
};



Game_Actor.prototype.makeAutoBattleActorActions = function() {
    //循环(开始时 i = 0 ;当 i < 动作组总个数 ; 每一次 i++)
    for (var i = 0; i < this.numActions(); i++) {
        //列表 = 制作动作表()
        var list = this.makeActionList();
        //最大值 = 数字 最小值
        var maxValue = Number.MIN_VALUE;
        //循环(开始时 j = 0 ; j< 列表 长度 ;每一次 j++ )
        for (var j = 0; j < list.length; j++) {
            //值 = 列表[j] 评估()
            var value = list[j].evaluate();
            //如果(值 > 最大值 )
            if (value > maxValue) {
                //最大值 = 值
                maxValue = value;
                //设置动作(i , 列表[j] )
                this.setAction(i, list[j]);
            }
        }
    }
    //设置动作状态( "waiting"//等待 ) 
    this.setActionState('waiting');
};