
/**-----------------------------------------------------------------------------*/
/** Game_Enemy*/
/** 游戏敌人*/
/** The game object class for an enemy.*/
/** 敌人的游戏对象类*/

function Game_Enemy() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
Game_Enemy.prototype = Object.create(Game_Battler.prototype);
/**设置创造者*/
Game_Enemy.prototype.constructor = Game_Enemy;
/**初始化*/
Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    //游戏战斗者 初始化 呼叫(this)
    Game_Battler.prototype.initialize.call(this);
    //安装(敌人id ,x,y)
    this.setup(enemyId, x, y);
};
/**初始化成员*/
Game_Enemy.prototype.initMembers = function() {
    //游戏战斗者 初始化成员 呼叫(this)
    Game_Battler.prototype.initMembers.call(this);
    //敌人id = 0
    this._enemyId = 0;
    //标记 = ""
    this._letter = '';
    //复数 = false
    this._plural = false;
    //画面x = 0
    this._screenX = 0;
    //画面y = 0
    this._screenY = 0;
};
/**安装*/
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    //敌人id = enemyId//敌人id
    this._enemyId = enemyId;
    //画面x = x
    this._screenX = x;
    //画面y = y
    this._screenY = y;
    //完全恢复()
    this.recoverAll();
};
/**是敌人*/
Game_Enemy.prototype.isEnemy = function() {
    //返回 true
    return true;
};
/**朋友小组*/
Game_Enemy.prototype.friendsUnit = function() {
    //返回 游戏敌群
    return $gameTroop;
};
/**对手小组*/
Game_Enemy.prototype.opponentsUnit = function() {
    //返回 游戏队伍
    return $gameParty;
};
/**索引*/
Game_Enemy.prototype.index = function() {
    //返回 游戏敌群 成员组() 索引于(this)
    return $gameTroop.members().indexOf(this);
};
/**是战斗成员*/
Game_Enemy.prototype.isBattleMember = function() {
    //返回 索引() >= 0
    return this.index() >= 0;
};
/**敌人id*/
Game_Enemy.prototype.enemyId = function() {
    //返回 敌人id
    return this._enemyId;
};
/**敌人*/
Game_Enemy.prototype.enemy = function() {
    //返回 数据敌人组[敌人id]
    return $dataEnemies[this._enemyId];
};
/**特征对象组*/
Game_Enemy.prototype.traitObjects = function() {
    //返回 游戏战斗者 特征对象组 呼叫(this) 连接 (敌人())
    return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
};
/**基础参数*/
Game_Enemy.prototype.paramBase = function(paramId) {
    //返回 敌人() 参数组[参数id]
    return this.enemy().params[paramId];
};
/**经验值*/
Game_Enemy.prototype.exp = function() {
    //返回 敌人() 经验值
    return this.enemy().exp;
};
/**金钱*/
Game_Enemy.prototype.gold = function() {
    //返回 敌人() 金钱
    return this.enemy().gold;
};
/**制作掉落物品组*/
Game_Enemy.prototype.makeDropItems = function() {
    //返回 敌人() 掉落物品组 缩减 方法(r ,di//掉落物品)
    return this.enemy().dropItems.reduce(function(r, di) {
        //如果(掉落物品 种类 >0 并且 数学 随机数() * 掉落物品 出现率 < 掉落物品比例() )
        if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
            //返回 r 连接( 物品对象(掉落物品 种类 , 掉落物品 数据id ) )
            return r.concat(this.itemObject(di.kind, di.dataId));
        //否则 
        } else {
            //返回 r
            return r;
        }
    //绑定(this),[] )
    }.bind(this), []);
};
/**掉落物品比例*/
Game_Enemy.prototype.dropItemRate = function() {
    //返回  游戏队伍 有掉落物品双倍() ? 2 : 1 
    return $gameParty.hasDropItemDouble() ? 2 : 1;
};
/**物品对象*/
Game_Enemy.prototype.itemObject = function(kind, dataId) {
    //如果 (种类 === 1)
    if (kind === 1) {
        //返回 数据物品组[数据id]
        return $dataItems[dataId];
    //否则 如果 (种类 === 1)
    } else if (kind === 2) {
        //返回 数据武器组[数据id]
        return $dataWeapons[dataId];
    //否则 如果 (种类 === 1)
    } else if (kind === 3) {
        //返回 数据防具组[数据id]
        return $dataArmors[dataId];
    //否则
    } else {
        //返回 null
        return null;
    }
};
/**是精灵显示*/
Game_Enemy.prototype.isSpriteVisible = function() {
    //返回 true
    return true;
};
/**画面x*/
Game_Enemy.prototype.screenX = function() {
    //返回 画面x
    return this._screenX;
};
/**画面y*/
Game_Enemy.prototype.screenY = function() {
    //返回 画面y
    return this._screenY;
};
/**战斗者名称*/
Game_Enemy.prototype.battlerName = function() {
    //返回 敌人() 战斗者名称
    return this.enemy().battlerName;
};
/**战斗者色调*/
Game_Enemy.prototype.battlerHue = function() {
    //返回 敌人() 战斗者色调
    return this.enemy().battlerHue;
};
/**原始名称*/
Game_Enemy.prototype.originalName = function() {
    //返回 敌人() 名称
    return this.enemy().name;
};
/**名称*/
Game_Enemy.prototype.name = function() {
    //返回 原始名称() + ( 复数 ? 标记 : "")
    return this.originalName() + (this._plural ? this._letter : '');
};
/**是标记空*/
Game_Enemy.prototype.isLetterEmpty = function() {
    //返回 标记 === ""
    return this._letter === '';
};
/**设置标记*/
Game_Enemy.prototype.setLetter = function(letter) {
    //标记 = letter//标记
    this._letter = letter;
};
/**设置复数*/
Game_Enemy.prototype.setPlural = function(plural) {
    //复数 = plural//复数
    this._plural = plural;
};
/**表现动作开始*/
Game_Enemy.prototype.performActionStart = function(action) {
    //游戏战斗者 表现动作开始 呼叫(this , 动作)
    Game_Battler.prototype.performActionStart.call(this, action);
    //请求效果("whiten"//变白 )
    this.requestEffect('whiten');
};
/**表现动作*/
Game_Enemy.prototype.performAction = function(action) {
    //游戏战斗者 表现动作 呼叫(this , 动作)
    Game_Battler.prototype.performAction.call(this, action);
};
/**表现动作结束*/
Game_Enemy.prototype.performActionEnd = function() {
    //游戏战斗者 表现动作结束 呼叫(this)
    Game_Battler.prototype.performActionEnd.call(this);
};
/**表现伤害*/
Game_Enemy.prototype.performDamage = function() {
    //游戏战斗者 表现伤害 呼叫(this)
    Game_Battler.prototype.performDamage.call(this);
    //声音管理器 播放敌人伤害()
    SoundManager.playEnemyDamage();
    //请求效果("blink"//闪烁 )
    this.requestEffect('blink');
};
/**表现死亡*/
Game_Enemy.prototype.performCollapse = function() {
    //游戏战斗者 表现死亡 呼叫(this)
    Game_Battler.prototype.performCollapse.call(this);
    //检查( 死亡种类() )
    switch (this.collapseType()) {
    //当 0
    case 0:
        //请求效果("collapse"//死亡 )
        this.requestEffect('collapse');
        //声音管理器 播放敌人死亡()
        SoundManager.playEnemyCollapse();
        //中断
        break;
    //当 1
    case 1:
        //请求效果("bossCollapse"//boss死亡 )
        this.requestEffect('bossCollapse');
        //声音管理器 播放boss死亡1()
        SoundManager.playBossCollapse1();
        //中断
        break;
    //当 2
    case 2:
        //请求效果("instantCollapse"//立即死亡 )
        this.requestEffect('instantCollapse');
        //中断
        break;
    }
};
/**转换*/
Game_Enemy.prototype.transform = function(enemyId) {
    //名称 = 原始名称()
    var name = this.originalName();
    //敌人id = enemyId//敌人id
    this._enemyId = enemyId;
    //如果( 原始名称()!== 名称 )
    if (this.originalName() !== name) {
        //标记 = ""
        this._letter = '';
        //复数 = false
        this._plural = false;
    }
    //刷新()
    this.refresh();
    //如果 (动作组总个数() > 0)
    if (this.numActions() > 0) {
        //制作动作组()
        this.makeActions();
    }
};
/**满足条件*/
Game_Enemy.prototype.meetsCondition = function(action) {
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
Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
    //n = 游戏敌群 回合计数()
    var n = $gameTroop.turnCount();
    //如果 (参数2 === 0 )
    if (param2 === 0) {
        //返回 n === 参数1
        return n === param1;
    //否则
    } else {
        //返回 n > 0 并且 n >= 参数1 并且 n % 参数2 === 参数1 % 参数2
        return n > 0 && n >= param1 && n % param2 === param1 % param2;
    }
};
/**满足hp条件*/
Game_Enemy.prototype.meetsHpCondition = function(param1, param2) {
    //返回 hp比例() >= 参数1 并且 hp比例() <= 参数2
    return this.hpRate() >= param1 && this.hpRate() <= param2;
};
/**满足mp条件*/
Game_Enemy.prototype.meetsMpCondition = function(param1, param2) {
    //返回 mp比例() >= 参数1 并且 mp比例() <= 参数2
    return this.mpRate() >= param1 && this.mpRate() <= param2;
};
/**满足状态条件*/
Game_Enemy.prototype.meetsStateCondition = function(param) {
    //返回 是状态影响(参数)
    return this.isStateAffected(param);
};
/**满足队伍等级条件*/
Game_Enemy.prototype.meetsPartyLevelCondition = function(param) {
    //返回 游戏队伍 最高等级() >= 参数
    return $gameParty.highestLevel() >= param;
};
/**满足开关条件*/
Game_Enemy.prototype.meetsSwitchCondition = function(param) {
    //返回 游戏开关组 值(参数)
    return $gameSwitches.value(param);
};
/**是有效动作*/
Game_Enemy.prototype.isActionValid = function(action) {
    //返回 满足条件(动作) 并且 能用( 数据技能组[动作 技能id] )
    return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
};
/**选择动作*/
Game_Enemy.prototype.selectAction = function(actionList, ratingZero) {
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
Game_Enemy.prototype.selectAllActions = function(actionList) {
    //评分最大 - 数学 最大值 应用(null,动作列表 映射 方法( a//动作 ))
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
/**制作动作组*/
Game_Enemy.prototype.makeActions = function() {
    //游戏战斗者 制作动作组 呼叫()this
    Game_Battler.prototype.makeActions.call(this);
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
