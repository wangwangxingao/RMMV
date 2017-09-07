
//-----------------------------------------------------------------------------
// BattleManager
// 战斗管理器
// The static class that manages battle progress.
// 这个静态的类 管理 战斗进行

function BattleManager() {
    throw new Error('This is a static class');
}

//安装
BattleManager.setup = function(troopId, canEscape, canLose) {
	//初始化成员
    this.initMembers();
    //能逃跑 = canEscape//能逃跑
    this._canEscape = canEscape;
    //能失败 = canLose//能失败
    this._canLose = canLose;
    //游戏敌群 安装(敌群id)
    $gameTroop.setup(troopId);
    //游戏画面 当战斗开始()
    $gameScreen.onBattleStart();
    //制作逃跑概率()
    this.makeEscapeRatio();
};

//初始化成员
BattleManager.initMembers = function() {
	//阶段 = "init" 初始化
    this._phase = 'init';
    //能逃跑 = false 
    this._canEscape = false;
    //能失败 = false
    this._canLose = false;
    //战斗测试 = false
    this._battleTest = false;
    //事件呼叫返回 = null
    this._eventCallback = null;
    //优先权 = false
    this._preemptive = false;
    //突然袭击 = false
    this._surprise = false;
    //角色id = -1
    this._actorIndex = -1;
    //动作强制战斗者 = null
    this._actionForcedBattler = null;
    //地图音乐 = null
    this._mapBgm = null;
    //地图bgs = null
    this._mapBgs = null;
    //动作战斗者组 = []
    this._actionBattlers = [];
    //主体 = null
    this._subject = null;
    //动作 = null
    this._action = null;
    //目标组 = []
    this._targets = [];
    //日志窗口 = null
    this._logWindow = null;
    //状态窗口 = null
    this._statusWindow = null;
    //精灵组 = null
    this._spriteset = null;
    //逃跑概率 = 0
    this._escapeRatio = 0;
    //逃跑的 = false
    this._escaped = false;
    //奖励 = {}
    this._rewards = {};
};
//是战斗测试
BattleManager.isBattleTest = function() {
	//返回 战斗测试
    return this._battleTest;
};
//设置战斗测试
BattleManager.setBattleTest = function(battleTest) {
	//战斗测试 = battleTest
    this._battleTest = battleTest;
};
//设置事件呼叫返回
BattleManager.setEventCallback = function(callback) {
	//事件呼叫返回 = callback
    this._eventCallback = callback;
};
//设置日志窗口
BattleManager.setLogWindow = function(logWindow) {
	//日志窗口 = logWindow
    this._logWindow = logWindow;
};
//设置状态窗口
BattleManager.setStatusWindow = function(statusWindow) {
	//状态窗口 = statusWindow
    this._statusWindow = statusWindow;
};
//设置精灵组
BattleManager.setSpriteset = function(spriteset) {
	//精灵组 = spriteset
    this._spriteset = spriteset;
};
//在遭遇
BattleManager.onEncounter = function() {
	//先发制人 = 数学 随机数() < 先发制人比例() 
    this._preemptive = (Math.random() < this.ratePreemptive());
    //突然袭击 = 数学 随机数() < 突然袭击比例() 并且 不是 先发制人
    this._surprise = (Math.random() < this.rateSurprise() && !this._preemptive);
};
//先发制人比例
BattleManager.ratePreemptive = function() {
	//返回 游戏队伍 先发制人比例( 游戏敌群 敏捷() )
    return $gameParty.ratePreemptive($gameTroop.agility());
};
//突然袭击比例
BattleManager.rateSurprise = function() {
	//返回 游戏队伍 突然袭击比例( 游戏敌群 敏捷() )
    return $gameParty.rateSurprise($gameTroop.agility());
};
//保存bgm和bgs
BattleManager.saveBgmAndBgs = function() {
	//mapBgm = 音频管理器 保存bgm()
    this._mapBgm = AudioManager.saveBgm();
	//mapBgs = 音频管理器 保存bgs()
    this._mapBgs = AudioManager.saveBgs();
};
//播放战斗bgm
BattleManager.playBattleBgm = function() {
	//音频管理器 播放me (游戏系统 战斗me() )
    AudioManager.playBgm($gameSystem.battleBgm());
	//音频管理器 停止bgs()
    AudioManager.stopBgs();
};
//播放胜利me
BattleManager.playVictoryMe = function() {
	//音频管理器 播放me (游戏系统 胜利me() )
    AudioManager.playMe($gameSystem.victoryMe());
};
//播放失败me
BattleManager.playDefeatMe = function() {
	//音频管理器 播放me (游戏系统 失败me() )
    AudioManager.playMe($gameSystem.defeatMe());
};
//重播bgm和bgs
BattleManager.replayBgmAndBgs = function() {
	//如果( 地图bgm )
    if (this._mapBgm) {
	    //音频管理器 重播bgm(地图bgm)
        AudioManager.replayBgm(this._mapBgm);
    //否则
    } else {
	    //音频管理器 停止bgm()
        AudioManager.stopBgm();
    }
    //如果( 地图bgs)
    if (this._mapBgs) {
	    //音频管理器 重播bgs(地图bgs)
        AudioManager.replayBgs(this._mapBgs);
    }
};
//制作逃跑概率
BattleManager.makeEscapeRatio = function() {
	//逃跑概率 = 0.5 * 游戏队伍 敏捷() / 游戏敌群 敏捷()
    this._escapeRatio = 0.5 * $gameParty.agility() / $gameTroop.agility();
};
//更新
BattleManager.update = function() {
	//当 (不是 是忙碌()  ) 并且 (不是 更新事件() )
    if (!this.isBusy() && !this.updateEvent()) {
	    //检查 阶段
        switch (this._phase) {
	    //是 开始 
        case 'start':
            //开始输入()
            this.startInput();
            //中断
            break;
        //是 回合
        case 'turn':
            //更新回合()
            this.updateTurn();
            //中断
            break;
        //是 动作
        case 'action':
            //更新动作
            this.updateAction();
            //中断
            break;
        //是 回合结束
        case 'turnEnd':
        	//更新回合结束()
            this.updateTurnEnd();
            //中断
            break;
        //是 战斗结束
        case 'battleEnd':
        	//更新战斗结束()
            this.updateBattleEnd();
            //中断
            break;
        }
    }
};
//更新事件
BattleManager.updateEvent = function() {
	//检查 (阶段)
    switch (this._phase) {
        //是 开始
        case 'start':
        //是 回合
        case 'turn':
        //是 回合结束
        case 'turnEnd':
            //如果  是强制动作()
            if (this.isActionForced()) {
                //进行强制动作()
                this.processForcedAction();
                //返回 true 
                return true;
            } else {
                //返回 更新事件主要()
                return this.updateEventMain();
            }
    }
    //返回 检查中止()
    return this.checkAbort2();
};
//更新事件主要
BattleManager.updateEventMain = function() {
	//游戏敌群 更新事件命令解释器
    $gameTroop.updateInterpreter();
    //请求动作刷新
    $gameParty.requestMotionRefresh();
    //如果 (游戏敌群 是事件运转) 或者 (检查战斗结束)
    if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
	    //返回 true
        return true;
    }
    //游戏敌群 安装战斗事件
    $gameTroop.setupBattleEvent();
    //(游戏敌群 是事件运转) 或者 (场景管理器 是场景改变)
    if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
	    //返回 true 
        return true;
    }
    //返回 falae
    return false;
};
//是忙碌
BattleManager.isBusy = function() {
	//返回 (游戏消息 是忙碌()  或者 精灵组 是忙碌() 或者 日志窗口 是忙碌() )
    return ($gameMessage.isBusy() || this._spriteset.isBusy() ||
            this._logWindow.isBusy());
};
//是输入中
BattleManager.isInputting = function() {
	//返回 阶段 == "input"
    return this._phase === 'input';
};
//是在回合
BattleManager.isInTurn = function() {
	//返回 阶段 == "turn"
    return this._phase === 'turn';
};
//是回合结束
BattleManager.isTurnEnd = function() {
	//返回 阶段 == "turnEnd"
    return this._phase === 'turnEnd';
};
//是中止
BattleManager.isAborting = function() {
	//返回 阶段 == "aborting"
    return this._phase === 'aborting';
};
//是战斗结束
BattleManager.isBattleEnd = function() {
	//返回 阶段 == "battleEnd"
    return this._phase === 'battleEnd';
};

//能逃跑
BattleManager.canEscape = function() {
	//返回 能逃跑
    return this._canEscape;
};
//能失败
BattleManager.canLose = function() {
	//返回 能失败
    return this._canLose;
};
//是逃跑
BattleManager.isEscaped = function() {
	//返回 逃跑的
    return this._escaped;
};
//角色
BattleManager.actor = function() {
	//返回 如果 角色索引  >= 0  返回 游戏队伍 成员组 角色索引 否则 返回 null
    return this._actorIndex >= 0 ? $gameParty.members()[this._actorIndex] : null;
};
//清除角色
BattleManager.clearActor = function() {
	//改变角色 (-1,"")
    this.changeActor(-1, '');
};
//改变角色(新角色索引,上一个角色动作状态)
BattleManager.changeActor = function(newActorIndex, lastActorActionState) {
	//上一个角色
    var lastActor = this.actor();
    //角色索引 设置为 新角色索引
    this._actorIndex = newActorIndex;
    //新角色 
    var newActor = this.actor();
    //如果( 上一个角色  )
    if (lastActor) {
	    //上一个角色 设置动作状态(上一个角色动作状态)
        lastActor.setActionState(lastActorActionState);
    }
    //如果( 新角色 )
    if (newActor) {
	    //新角色 设置动作状态('inputting') //输入中
        newActor.setActionState('inputting');
    }
};
//开始战斗
BattleManager.startBattle = function() {
	//阶段 = "start" //开始
    this._phase = 'start';
    //游戏系统 当战斗开始()
    $gameSystem.onBattleStart();
    //游戏队伍 当战斗开始()
    $gameParty.onBattleStart();
    //游戏敌群 当战斗开始()
    $gameTroop.onBattleStart();
    //显示开始战斗()
    this.displayStartMessages();
};
//显示开始战斗
BattleManager.displayStartMessages = function() {
	//游戏敌群 敌人名称组()  对每一个( 名称 )
    $gameTroop.enemyNames().forEach(function(name) {
	    //游戏消息添加 (文本管理器 出现 替代 (名称) ) 
        $gameMessage.add(TextManager.emerge.format(name));
    });
    //先发制人
    if (this._preemptive) {
	    //游戏消息添加 (文本管理器 先发制人 替代 (名称) ) 
        $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
    //突然袭击
    } else if (this._surprise) {
	    //游戏消息添加 (文本管理器 突然袭击 替代 (名称) ) 
        $gameMessage.add(TextManager.surprise.format($gameParty.name()));
    }
};
//开始输入
BattleManager.startInput = function() {
	//阶段 设置为 "input" //输入
    this._phase = 'input';
    //游戏队伍 制作动作
    $gameParty.makeActions();
    //游戏敌群 制作动作
    $gameTroop.makeActions();
    //清除角色
    this.clearActor();
    //如果 (突然袭击) 或者 (不是 游戏队伍 能输入)
    if (this._surprise || !$gameParty.canInput()) {
	    //开始回合
        this.startTurn();
    }
};
//输入角色
BattleManager.inputtingAction = function() {
	//返回 如果 角色(存在) 角色 输入动作 否则 null
    return this.actor() ? this.actor().inputtingAction() : null;
};
//选择下一个命令
BattleManager.selectNextCommand = function() {
	//进行 
    do {
	    //如果 ( 不是 角色() 或者 不是 角色() 选择下一个命令() )
        if (!this.actor() || !this.actor().selectNextCommand()) {
	        //改变角色(角色索引+1 , "waiting" //等待 ) 
            this.changeActor(this._actorIndex + 1, 'waiting');
            //如果 (角色索引 大于等于 游戏队伍 大小() )
            if (this._actorIndex >= $gameParty.size()) {
	            //开始回合
                this.startTurn();
                //中断
                break;
            }
        }
    //当 (不是 角色() 能输入() )
    } while (!this.actor().canInput());
};
//选择之前的命令
BattleManager.selectPreviousCommand = function() {
	//进行
    do {
	    //如果 (不是 角色() 或者 不是 角色()选择下一个命令()  )
        if (!this.actor() || !this.actor().selectPreviousCommand()) {
	        //改变角色(角色索引+1 , "undecided" //未定的) 
            this.changeActor(this._actorIndex - 1, 'undecided');
            //如果(角色索引 < 0 )
            if (this._actorIndex < 0) {
	            //返回
                return;
            }
        }
    //当 (不是 角色 能输入)
    } while (!this.actor().canInput());
};
//刷新状态
BattleManager.refreshStatus = function() {
	//状态窗口 刷新()
    this._statusWindow.refresh();
};
//开始回合
BattleManager.startTurn = function() {
	//阶段 设置为 "turn"  //回合
    this._phase = 'turn';
    //清除角色()
    this.clearActor();
    //游戏敌群 增加回合()
    $gameTroop.increaseTurn();
	//制作动作次序()
    this.makeActionOrders();
    //游戏队伍 请求动作刷新()
    $gameParty.requestMotionRefresh();
    //日志窗口 开始回合()
    this._logWindow.startTurn();
};
//更新回合
BattleManager.updateTurn = function() {
    //游戏队伍 请求动作刷新()
    $gameParty.requestMotionRefresh();
    //如果 (不是 主体)
    if (!this._subject) {
	    //主体 = 获得下一个主体()
        this._subject = this.getNextSubject();
    }
    //如果 ( 主体 )
    if (this._subject) {
		//进行回合()
        this.processTurn();
    //否则
    } else {
	    //结束回合()
        this.endTurn();
    }
};
//进行回合
BattleManager.processTurn = function() {
	//主体 = 主体
    var subject = this._subject;
    //动作 = 当前的 动作
    var action = subject.currentAction();
    //如果 动作(动作 存在)
    if (action) {
	    //动作 准备
        action.prepare();
        //如果 动作 是有效的
        if (action.isValid()) {
	        //开始 动作
            this.startAction();
        }
        //主体 移出当前的动作
        subject.removeCurrentAction();
    //否则
    } else {
	    //主体 在所有动作结束
        subject.onAllActionsEnd();
        //刷新状态
        this.refreshStatus();
        //日志窗口 显示自动影响状态(主体)
        this._logWindow.displayAutoAffectedStatus(subject);
		//日志窗口 显示当前状态(主体)
        this._logWindow.displayCurrentState(subject);
		//日志窗口 显示恢复(主体)
        this._logWindow.displayRegeneration(subject);
        //主体 设置为 获得下一个主体
        this._subject = this.getNextSubject();
    }
};
//结束回合
BattleManager.endTurn = function() {
	//阶段 设置为 "turnEnd" //回合结束
    this._phase = 'turnEnd';
    //先发制人 = false
    this._preemptive = false;
    //突然袭击 = false
    this._surprise = false;
    //所有战斗成员组 对每一个 战斗者 
    this.allBattleMembers().forEach(function(battler) {
	    //战斗者 在回合结束
        battler.onTurnEnd();
        //刷新状态
        this.refreshStatus();
        //日志窗口 显示自动影响状态(主体)
        this._logWindow.displayAutoAffectedStatus(battler);
		//日志窗口 显示恢复(主体)
        this._logWindow.displayRegeneration(battler);
    }, this);
};
//更新回合结束
BattleManager.updateTurnEnd = function() {
	//开始输入
    this.startInput();
};
//获得下一个主体
BattleManager.getNextSubject = function() {
	//循环
    for (;;) {
	    //战斗者 = 动作战斗者组 返回第一个并删除
        var battler = this._actionBattlers.shift();
        //如果 不是 战斗者(战斗者 不存在) 
        if (!battler) {
            return null;
        }
        //如果 战斗者 是战斗成员 并且 战斗者 是活的
        if (battler.isBattleMember() && battler.isAlive()) {
	        //返回 战斗者
            return battler;
        }
    }
};
//所有战斗成员组
BattleManager.allBattleMembers = function() {
	//返回 游戏队伍 成员组 连接 游戏敌群 成员组
    return $gameParty.members().concat($gameTroop.members());
};
//制作动作次序
BattleManager.makeActionOrders = function() {
	//战斗者组
    var battlers = [];
    //如果 不是 主体(主体 不存在)
    if (!this._surprise) {
	    //战斗者组 = 战斗者组 连接 (游戏队伍 成员组)
        battlers = battlers.concat($gameParty.members());
    }
    //如果 不是 先发制人
    if (!this._preemptive) {
	    //战斗者组 = 战斗者组 连接 (游戏敌群 成员组)
        battlers = battlers.concat($gameTroop.members());
    }
    //战斗者组 对每一个 战斗者 
    battlers.forEach(function(battler) {
	    //战斗者 制作速度
        battler.makeSpeed();
    });
    //战斗者组 排序 (a,b)
    battlers.sort(function(a, b) {
	    //返回 b 速度 - a 速度
        return b.speed() - a.speed();
    });
    //动作战斗者组 设置为 战斗者组
    this._actionBattlers = battlers;
};
//开始动作
BattleManager.startAction = function() {
	//主体 = 主体
    var subject = this._subject;
    //动作 = 主体 当前动作
    var action = subject.currentAction();
    //目标 = 动作 制作目标
    var targets = action.makeTargets();
	//阶段 设置为 "action" //动作
    this._phase = 'action';
    //动作
    this._action = action;
    //目标组
    this._targets = targets;
    //主体 用项目(动作 项目) 
    subject.useItem(action.item());
    //动作 应用通用的
    this._action.applyGlobal();
    //刷新状态
    this.refreshStatus();
    //日志窗口 开始动作(主体,动作,目标组)
    this._logWindow.startAction(subject, action, targets);
};
//更新动作
BattleManager.updateAction = function() {
	//目标 = 目标组 返回头一个并删除
    var target = this._targets.shift();
    //如果 目标(目标存在)
    if (target) {
 		//调用动作
        this.invokeAction(this._subject, target);
    //否则
    } else {
	    //结束动作
        this.endAction();
    }
};
//结束动作
BattleManager.endAction = function() {
	//日志窗口 结束动作 (主体)
    this._logWindow.endAction(this._subject);
	//阶段 设置为 "turn"  //回合
    this._phase = 'turn';
};
///调用动作
BattleManager.invokeAction = function(subject, target) {
	//日志窗口 添加 (添加基础行)
    this._logWindow.push('pushBaseLine');
    //如果 数学 随机数 < 动作 项目反击比例(目标)
    if (Math.random() < this._action.itemCnt(target)) {
	    //调用反击(主体,目标)
        this.invokeCounterAttack(subject, target);
    //如果 数学 随机数 < 动作 项目魔法反击比例(目标)
    } else if (Math.random() < this._action.itemMrf(target)) {
		//调用魔法反射(主体,目标)
        this.invokeMagicReflection(subject, target);
    } else {
		//调用正常动作(主体,目标)
        this.invokeNormalAction(subject, target);
    }
    //主体 设置最后的目标(目标)
    subject.setLastTarget(target);
    //日志窗口 添加 删除基础行()
    this._logWindow.push('popBaseLine');
    //刷新状态()
    this.refreshStatus();
};
//调用正常动作
BattleManager.invokeNormalAction = function(subject, target) {
	//真正的目标  =   应用替代(目标)
    var realTarget = this.applySubstitute(target);
    //动作 应用(真正的目标)
    this._action.apply(realTarget);
    //日志窗口 显示动作结果 (主体 ,真正的目标 )
    this._logWindow.displayActionResults(subject, realTarget);
};
//调用反击
BattleManager.invokeCounterAttack = function(subject, target) {
	//动作 = 新 游戏动作(目标)
    var action = new Game_Action(target);
    //动作 设置攻击()
    action.setAttack();
    //动作 应用(主体)
    action.apply(subject);
    //日志窗口 显示反击(目标)
    this._logWindow.displayCounter(target);
    //日志窗口 显示动作结果(目标,主体)
    this._logWindow.displayActionResults(target, subject);
};
//调用魔法反射
BattleManager.invokeMagicReflection = function(subject, target) {
    //动作 反射目标 = 目标
    this._action._reflectionTarget = target;
	//日志窗口 显示魔法反射(目标)
    this._logWindow.displayReflection(target);
    //动作 应用(主体)
    this._action.apply(subject);
    //日志窗口 显示动作结果(主体,主体)
    this._logWindow.displayActionResults(target, subject);
};
//应用替代
BattleManager.applySubstitute = function(target) {
	//检查替代(目标)
    if (this.checkSubstitute(target)) {
	    //替代者 = 目标 朋友小组() 替代战斗()
        var substitute = target.friendsUnit().substituteBattler();
        //如果 ( 替代者(替代者存在)  并且  目标 不等于 替代者 )
        if (substitute && target !== substitute) {
	        //日志窗口 显示替代(替代者,目标)
            this._logWindow.displaySubstitute(substitute, target);
            //返回替代者
            return substitute;
        }
    }
    //返回 目标
    return target;
};
//检查替代
BattleManager.checkSubstitute = function(target) {
	//返回 是濒死的() 并且  不是 动作 是必中()  
    return target.isDying() && !this._action.isCertainHit();
};
//是强制动作
BattleManager.isActionForced = function() {
	//返回 !!动作强制战斗者 (动作强制战斗者 转化为 true 或者 false )
    return !!this._actionForcedBattler;
};
//强制动作
BattleManager.forceAction = function(battler) {
	//动作强制战斗者 = 战斗者
    this._actionForcedBattler = battler;
    //索引 = 动作战斗者组 包含 (战斗者)
    var index = this._actionBattlers.indexOf(battler);
    //如果(索引 >=0)
    if (index >= 0) {
	    //动作战斗者组 剪接 (索引,1)
        this._actionBattlers.splice(index, 1);
    }
};
//进行强制动作
BattleManager.processForcedAction = function() {
	//如果 动作强制战斗者 (动作强制战斗者 存在)
    if (this._actionForcedBattler) {
	    //主体 = 动作强制战斗者
        this._subject = this._actionForcedBattler;
        //动作强制战斗者 = null
        this._actionForcedBattler = null;
        //开始动作()
        this.startAction();
        //主体 移除当前动作()
        this._subject.removeCurrentAction();
    }
};
//中止
BattleManager.abort = function() {
	//阶段 设置为 "aborting"  //中止
    this._phase = 'aborting';
};
//检查战斗结束
BattleManager.checkBattleEnd = function() {
	//如果( 阶段 )
    if (this._phase) {
	    //如果 检查中止()
        if (this.checkAbort()) {
	        //返回 true
            return true;
        //否则 如果( 游戏队伍 是全部死了() )
        } else if ($gameParty.isAllDead()) {
	        //进行失败()
            this.processDefeat();
            //返回 true 
            return true;
        //否则 如果( 游戏敌群 是全部死了() )
        } else if ($gameTroop.isAllDead()) {
	        //进行胜利()
            this.processVictory();
            //返回 true
            return true;
        }
    }
    //返回 false
    return false;
};
//检查中止
BattleManager.checkAbort = function() {
	//如果 (游戏队伍 是空的() 或者 是中止() ) 
    if ($gameParty.isEmpty() || this.isAborting()) {
	    //进行中止()
        this.processAbort();
        //返回 true
        return true;
    }
    //返回 false 
    return false;
};

//检查中止2
BattleManager.checkAbort2 = function() { 
	//如果 (游戏队伍 是空的() 或者 是中止() ) 
    if ($gameParty.isEmpty() || this.isAborting()) {
        //声音管理器 播放逃跑
        SoundManager.playEscape();
        //逃跑的 = true 
        this._escaped = true;
        //检查中止
        this.processAbort();
    } 
    //返回 false 
    return false;
};

//进行胜利
BattleManager.processVictory = function() {
	//游戏队伍 移除战斗状态()
    $gameParty.removeBattleStates();
    //游戏队伍 表现胜利()
    $gameParty.performVictory();
    //播放胜利me()
    this.playVictoryMe();
    //播放bgm和bgs()
    this.replayBgmAndBgs();
    //制作奖励()
    this.makeRewards();
    //显示胜利消息()
    this.displayVictoryMessage();
    //显示奖励()
    this.displayRewards();
    //获得奖励()
    this.gainRewards();
    //结束战斗(0)
    this.endBattle(0);
};
//进行逃跑
BattleManager.processEscape = function() {
    //游戏队伍 表现逃跑()
    $gameParty.performEscape();
    //声音管理器 播放逃跑()
    SoundManager.playEscape();
    //成功 = 如果 先发制人 返回 true 否则 返回 ( 数学 随机数() < 逃跑概率 )
    var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
    //如果( 成功 )
    if (success) {
	    //显示逃跑成功消息()
        this.displayEscapeSuccessMessage();
        //逃跑的 = true 
        this._escaped = true;
        //进行中止()
        this.processAbort();
    //否则
    } else {
	    //显示逃跑失败消息()
        this.displayEscapeFailureMessage();
        //逃跑概率 += 0.1
        this._escapeRatio += 0.1;
        //游戏队伍 清除动作()
        $gameParty.clearActions();
        //开始回合()
        this.startTurn();
    }
    //返回 成功
    return success;
};
//进行中止
BattleManager.processAbort = function() {
	//游戏队伍 移除战斗状态
    $gameParty.removeBattleStates();
	//重播 bgm 和 bgs
    this.replayBgmAndBgs();
    //结束战斗(1)
    this.endBattle(1);
};
//进行失败
BattleManager.processDefeat = function() {
    //显示失败消息
    this.displayDefeatMessage();
    //播放失败me()
    this.playDefeatMe();
    //如果(能失败)
    if (this._canLose) {
        //重播bgm和bgs()
        this.replayBgmAndBgs();
    //否则
    } else {
        //音频管理器 停止bgm()
        AudioManager.stopBgm();
    }
    //结束战斗(2)
    this.endBattle(2);
};
//结束战斗
BattleManager.endBattle = function(result) {
	//阶段 设置为 "battleEnd" //战斗结束
    this._phase = 'battleEnd';
    //如果 事件呼叫返回(事件呼叫返回 存在)
    if (this._eventCallback) {
	    //事件呼叫返回( result//结果 )
        this._eventCallback(result);
    }
    //如果 ( result//结果 == 0)
    if (result === 0) {
	    //游戏系统 当战斗胜利()
        $gameSystem.onBattleWin();
    //否则 如果( 逃跑的 )
    } else if (this._escaped) {
	    //游戏系统 当战斗逃跑()
        $gameSystem.onBattleEscape();
    }
};
//更新战斗结束
BattleManager.updateBattleEnd = function() {
	//如果( 是战斗测试() )
    if (this.isBattleTest()) {
	    //音频管理器 停止bgm()
        AudioManager.stopBgm();
        //场景管理器 退出()
        SceneManager.exit();
    //否则 如果( 不是 逃跑的 并且 游戏队伍 是全部死了() )
    } else if (!this._escaped && $gameParty.isAllDead()) {
	    //如果( 能失败 )
        if (this._canLose) {
	        //游戏队伍 复活战斗成员组()
            $gameParty.reviveBattleMembers();
            //场景管理器 末尾()
            SceneManager.pop();
        //否则
        } else {
	        //场景管理器 转到 (场景游戏结束)
            SceneManager.goto(Scene_Gameover);
        }
    //否则
    } else {
	    //场景管理器 末尾()
        SceneManager.pop();
    }
    //阶段 设为 null 
    this._phase = null;
};
//制作奖励
BattleManager.makeRewards = function() {
	//奖励 = {}
    this._rewards = {};
    //奖励 金钱 = 游戏敌群 金钱总数()
    this._rewards.gold = $gameTroop.goldTotal();
    //奖励 经验 = 游戏敌群 经验值总数()
    this._rewards.exp = $gameTroop.expTotal();
    //奖励 物品组 = 游戏敌群 制作掉落物品组()
    this._rewards.items = $gameTroop.makeDropItems();
};
//显示胜利消息
BattleManager.displayVictoryMessage = function() {
	//游戏消息 添加(文本管理器 胜利 替换(游戏队伍 名称) )
    $gameMessage.add(TextManager.victory.format($gameParty.name()));
};
//显示失败消息
BattleManager.displayDefeatMessage = function() {
	//游戏消息 添加(文本管理器 失败 替换(游戏队伍 名称) )
    $gameMessage.add(TextManager.defeat.format($gameParty.name()));
};
///显示逃跑成功消息
BattleManager.displayEscapeSuccessMessage = function() {
	//游戏消息 添加(文本管理器 逃跑开始 替换(游戏队伍 名称) )
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
};
//显示逃跑失败消息
BattleManager.displayEscapeFailureMessage = function() {
	//游戏消息 添加(文本管理器 逃跑开始 替换(游戏队伍 名称)  )
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
	//游戏消息 添加( 显示文字时等待四分之一秒 + 文本管理器 逃跑失败 替换(游戏队伍 名称)  )
    $gameMessage.add('\\.' + TextManager.escapeFailure);
};
//显示奖励
BattleManager.displayRewards = function() {
	//显示经验值()
    this.displayExp();
	//显示金钱()
    this.displayGold();
	//显示掉落物品组()
    this.displayDropItems();
};
//显示经验值
BattleManager.displayExp = function() {
	//经验值 = 奖励 经验值
    var exp = this._rewards.exp;
    //如果 (经验值 >0)
    if (exp > 0) {
	    //文本 = 文本管理器 获得经验值 替换(经验值 , 文本管理器 经验值)
        var text = TextManager.obtainExp.format(exp, TextManager.exp);
		//游戏消息 添加( 显示文字时等待四分之一秒 + 文本   )
        $gameMessage.add('\\.' + text);
    }
};
//显示金钱
BattleManager.displayGold = function() {
	//金钱 = 奖励 金钱
    var gold = this._rewards.gold;
    //如果 金钱 > 0
    if (gold > 0) {
		//游戏消息 添加( 显示文字时等待四分之一秒 + 文本管理器 获得金钱 替换(金钱)  )
        $gameMessage.add('\\.' + TextManager.obtainGold.format(gold));
    }
};
//显示掉落物品组
BattleManager.displayDropItems = function() {
	//物品组 = 奖励 物品组
    var items = this._rewards.items;
    //如果 物品组 长度 > 0
    if (items.length > 0) {
	    //游戏消息 新页
        $gameMessage.newPage();
        //物品组 对每一个 (物品)
        items.forEach(function(item) {
			//游戏消息 添加(  文本管理器 获得物品 替换 物品 名称)   )
            $gameMessage.add(TextManager.obtainItem.format(item.name));
        });
    }
};
//获得奖励
BattleManager.gainRewards = function() {
	//获得经验值()
    this.gainExp();
	//获得金钱()
    this.gainGold();
	//获得掉落物品组()
    this.gainDropItems();
};
//获得经验值
BattleManager.gainExp = function() {
	//经验值 = 奖励 经验值
    var exp = this._rewards.exp;
    //游戏队伍 所有成员组 对每一个 (角色 )
    $gameParty.allMembers().forEach(function(actor) {
	    //角色 获得经验值(经验值)
        actor.gainExp(exp);
    });
};
//获得金钱
BattleManager.gainGold = function() {
	//游戏队伍 获得金钱(奖励 金钱)
    $gameParty.gainGold(this._rewards.gold);
};
//获得掉落物品组
BattleManager.gainDropItems = function() {
	//物品组 = 奖励 物品组
    var items = this._rewards.items;
    //物品组 对每一个 (物品)
    items.forEach(function(item) {
	    //游戏队伍 获得物品 (物品,1)
        $gameParty.gainItem(item, 1);
    });
};
