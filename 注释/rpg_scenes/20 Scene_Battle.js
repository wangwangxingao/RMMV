
/**----------------------------------------------------------------------------- */
/** Scene_Battle */
/** 场景战斗 */
/** The scene class of the battle screen. */
/** 处理 战斗画面的 场景类 */

function Scene_Battle() {
	//调用 初始化
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Scene_Battle.prototype = Object.create(Scene_Base.prototype);
/**设置创造者 */
Scene_Battle.prototype.constructor = Scene_Battle;
/**初始化 */
Scene_Battle.prototype.initialize = function() {
	//场景基础 初始化 呼叫(this)
    Scene_Base.prototype.initialize.call(this);
};
/**创建  */
Scene_Battle.prototype.create = function() {
	//场景基础 创建 呼叫(this)
    Scene_Base.prototype.create.call(this);
    //创建显示对象()
    this.createDisplayObjects();
};
/**开始 */
Scene_Battle.prototype.start = function() {
	//场景基础 开始 呼叫(this)
    Scene_Base.prototype.start.call(this);
    //开始淡入(淡入速率,false)
    this.startFadeIn(this.fadeSpeed(), false);
    //战斗管理器 播放战斗bgm()
    BattleManager.playBattleBgm();
    //战斗管理器 开始战斗()
    BattleManager.startBattle();
};
/**更新 */
Scene_Battle.prototype.update = function() {
    //活动 = 是活动()
    var active = this.isActive();
    //游戏时间 更新(活动)
    $gameTimer.update(active);
    //游戏画面 更新()
    $gameScreen.update();
    //更新状态窗口()
    this.updateStatusWindow();
    //更新窗口位置()
    this.updateWindowPositions();
    //如果( 活动 并且 不是 是忙碌())
    if (active && !this.isBusy()) {
	    //更新战斗进行()
        this.updateBattleProcess();
    }
    //场景基础 更新 呼叫(this)
    Scene_Base.prototype.update.call(this);
};
/**更新战斗进行 */
Scene_Battle.prototype.updateBattleProcess = function() {
	//如果 (不是 是任何输入窗口活动() 或者  战斗管理器 是中止() 或 战斗管理器 是战斗结束() )
    if (!this.isAnyInputWindowActive() || BattleManager.isAborting() ||
            BattleManager.isBattleEnd()) {
	    //战斗管理器 更新()
        BattleManager.update();
        //改变输入窗口()
        this.changeInputWindow();
    }
};
/**是任何输入窗口活动  */
Scene_Battle.prototype.isAnyInputWindowActive = function() {
	//返回 (队伍命令窗口 活动 或者  
    return (this._partyCommandWindow.active ||
            //角色命令窗口 活动 或者
            this._actorCommandWindow.active ||
            //技能窗口 活动 或者
            this._skillWindow.active ||
            //物品窗口活动 或者
            this._itemWindow.active ||
            //角色窗口活动 或者
            this._actorWindow.active ||
            //敌人窗口活动 )
            this._enemyWindow.active);
};
/**改变输入窗口 */
Scene_Battle.prototype.changeInputWindow = function() {
	//如果( 战斗管理器 是输入中())
    if (BattleManager.isInputting()) {
	    //如果 (战斗管理器 角色() )
        if (BattleManager.actor()) {
	        //开始角色命令选择()
            this.startActorCommandSelection();
        //否则
        } else {
	        //开始队伍命令选择()
            this.startPartyCommandSelection();
        }
    //否则
    } else {
	    //结束命令选择()
        this.endCommandSelection();
    }
};
/**停止 */
Scene_Battle.prototype.stop = function() {
	//场景基础 停止 呼叫(this)
    Scene_Base.prototype.stop.call(this);
    //如果( 需要缓慢淡出())
    if (this.needsSlowFadeOut()) {
	    //开始淡出(缓慢淡出速率,false)
        this.startFadeOut(this.slowFadeSpeed(), false);
    //否则
    } else {
	    //开始淡出(淡出速率,false)
        this.startFadeOut(this.fadeSpeed(), false);
    }
    //状态窗口 关闭()
    this._statusWindow.close();
    //队伍命令窗口 关闭()
    this._partyCommandWindow.close();
    //角色命令窗口 关闭()
    this._actorCommandWindow.close();
};
/**结束 */
Scene_Battle.prototype.terminate = function() {
	//场景基础 结束 呼叫(this)
    Scene_Base.prototype.terminate.call(this);
    //游戏队伍 在战斗结束()
    $gameParty.onBattleEnd();
    //游戏敌群 在战斗结束()
    $gameTroop.onBattleEnd();
    //音频管理器 停止me()
    AudioManager.stopMe();
    //
    ImageManager.clearRequest();
};
/**需要缓慢淡出 */
Scene_Battle.prototype.needsSlowFadeOut = function() {
	//场景管理器 是下一个场景(Scene_Title场景标题) 或者
    return (SceneManager.isNextScene(Scene_Title) ||
            //场景管理器 是下一个场景( Scene_Gameover//场景游戏结束)
            SceneManager.isNextScene(Scene_Gameover));
};
/**更新状态窗口 */
Scene_Battle.prototype.updateStatusWindow = function() {
	//如果( 游戏管理器 是繁忙的())
    if ($gameMessage.isBusy()) {
	    //状态窗口 关闭()
        this._statusWindow.close();
        //队伍命令窗口 关闭()
        this._partyCommandWindow.close();
        //角色命令窗口 关闭()
        this._actorCommandWindow.close();
    //否则 如果 (是活动() 并且 不是 消息窗口是关闭())
    } else if (this.isActive() && !this._messageWindow.isClosing()) {
	    //状态窗口 打开()
        this._statusWindow.open();
    }
};
/**更新窗口位置 */
Scene_Battle.prototype.updateWindowPositions = function() {
    //状态x = 0 
    var statusX = 0;
    //如果( 战斗管理器 是输入中())
    if (BattleManager.isInputting()) {
	    //状态x = 队伍命令窗口 宽
        statusX = this._partyCommandWindow.width;
    } else {
	    //状态x =  队伍命令窗口 宽/2
        statusX = this._partyCommandWindow.width / 2;
    }
    //如果( 状态窗口 x <  状态x )
    if (this._statusWindow.x < statusX) {
	    //状态窗口 x += 16
        this._statusWindow.x += 16;
        //如果 状态窗口 x > 状态x 
        if (this._statusWindow.x > statusX) {
	        //状态窗口 x = 状态x
            this._statusWindow.x = statusX;
        }
    }
    //如果 (状态窗口  x >  状态x)
    if (this._statusWindow.x > statusX) {
	    //状态窗口 x - 16
        this._statusWindow.x -= 16;
        //如果( 状态窗口 x < 状态x )
        if (this._statusWindow.x < statusX) {
	        //状态窗口 x = 状态x
            this._statusWindow.x = statusX;
        }
    }
};
/**创建显示对象 */
Scene_Battle.prototype.createDisplayObjects = function() {
	//创建精灵组()
    this.createSpriteset();
    //创建窗口层()
    this.createWindowLayer();
    //创建所有窗口()
    this.createAllWindows();
    //战斗管理器 设置记录窗口(记录窗口)
    BattleManager.setLogWindow(this._logWindow);
    //战斗管理器 设置状态窗口(状态窗口)
    BattleManager.setStatusWindow(this._statusWindow);
    //战斗管理器 设置精灵组(精灵组)
    BattleManager.setSpriteset(this._spriteset);
    //记录窗口 设置精灵组(精灵组)
    this._logWindow.setSpriteset(this._spriteset);
};
/**创建精灵组 */
Scene_Battle.prototype.createSpriteset = function() {
	//精灵组 = 新 精灵组战斗()
    this._spriteset = new Spriteset_Battle();
    //添加子代(精灵组)
    this.addChild(this._spriteset);
};
/**创建所有窗口  */
Scene_Battle.prototype.createAllWindows = function() {
	//创建记录窗口
    this.createLogWindow();
    //创建状态窗口
    this.createStatusWindow();
    //创建队伍命令窗口
    this.createPartyCommandWindow();
    //创建角色命令窗口
    this.createActorCommandWindow();
    //创建帮助窗口
    this.createHelpWindow();
    //创建技能窗口
    this.createSkillWindow();
    //创建物品窗口
    this.createItemWindow();
    //创建角色窗口
    this.createActorWindow();
    //创建敌人窗口
    this.createEnemyWindow();
    //创建消息窗口
    this.createMessageWindow();
    //创建滚动文字窗口
    this.createScrollTextWindow();
};
/**创建记录窗口 */
Scene_Battle.prototype.createLogWindow = function() {
	//记录窗口 = 新 窗口战斗记录()
    this._logWindow = new Window_BattleLog();
    //添加窗口(记录窗口) 
    this.addWindow(this._logWindow);
};
/**创建状态窗口 */
Scene_Battle.prototype.createStatusWindow = function() {
	//状态窗口 = 新 窗口状态()
    this._statusWindow = new Window_BattleStatus();
    //添加窗口(状态窗口) 
    this.addWindow(this._statusWindow);
};
/**创建队伍命令窗口 */
Scene_Battle.prototype.createPartyCommandWindow = function() {
	//队伍命令窗口 = 新 窗口队伍命令()
    this._partyCommandWindow = new Window_PartyCommand();
    //队伍命令窗口 设置处理 ('fight' ,  命令战斗 )
    this._partyCommandWindow.setHandler('fight',  this.commandFight.bind(this));
    //队伍命令窗口 设置处理 ('escape' ,  命令逃跑 )
    this._partyCommandWindow.setHandler('escape', this.commandEscape.bind(this));
    //队伍命令窗口 取消选择()
    this._partyCommandWindow.deselect();
    //添加窗口(队伍命令窗口) 
    this.addWindow(this._partyCommandWindow);
};
/**创建角色命令窗口 */
Scene_Battle.prototype.createActorCommandWindow = function() {
	//角色命令窗口 = 新 窗口角色命令
    this._actorCommandWindow = new Window_ActorCommand();
    //角色命令窗口 设置处理 (  'attack',命令攻击  ) 
    this._actorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
    //角色命令窗口 设置处理 (  'skill',命令技能  ) 
    this._actorCommandWindow.setHandler('skill',  this.commandSkill.bind(this));
    //角色命令窗口 设置处理 (  'guard',命令防御  ) 
    this._actorCommandWindow.setHandler('guard',  this.commandGuard.bind(this));
    //角色命令窗口 设置处理 (  'item',命令物品  ) 
    this._actorCommandWindow.setHandler('item',   this.commandItem.bind(this));
    //角色命令窗口 设置处理 (  'cancel',选择之前命令  ) 
    this._actorCommandWindow.setHandler('cancel', this.selectPreviousCommand.bind(this));
    //添加窗口(角色命令窗口) 
    this.addWindow(this._actorCommandWindow);
};
/**创建帮助窗口 */
Scene_Battle.prototype.createHelpWindow = function() {
	//帮助窗口 = 新 窗口帮助
    this._helpWindow = new Window_Help();
    //帮助窗口 可见度 = false
    this._helpWindow.visible = false;
    //添加窗口(帮助窗口) 
    this.addWindow(this._helpWindow);
};
/**创建技能窗口 */
Scene_Battle.prototype.createSkillWindow = function() {
	//wy = 帮助窗口 y + 帮助窗口  高 
    var wy = this._helpWindow.y + this._helpWindow.height;
    //wh = 状态窗口 y - wy
    var wh = this._statusWindow.y - wy;
    //技能窗口 =  窗口战斗技能(0 , wy , 图形 盒子宽 ,wh )
    this._skillWindow = new Window_BattleSkill(0, wy, Graphics.boxWidth, wh);
    //技能窗口 设置帮助窗口( 帮助窗口 )
    this._skillWindow.setHelpWindow(this._helpWindow);
    //技能窗口 设置处理 ('ok', 在技能确定 ) 
    this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
    //技能窗口 设置处理 ('cancel', 在技能取消 )
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    //添加窗口( 技能窗口 ) 
    this.addWindow(this._skillWindow);
};
/**创建物品窗口 */
Scene_Battle.prototype.createItemWindow = function() {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._itemWindow = new Window_BattleItem(0, wy, Graphics.boxWidth, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    //添加窗口(物品窗口) 
    this.addWindow(this._itemWindow);
};
/**创建角色窗口 */
Scene_Battle.prototype.createActorWindow = function() {
	//角色窗口 = 新  窗口战斗角色(0 , 状态窗口 y )
    this._actorWindow = new Window_BattleActor(0, this._statusWindow.y);
    //角色窗口 设置处理 ( 'ok', 在角色确定 )
    this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
    //角色窗口 设置处理 ( 'cancel', 在角色取消 )
    this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
    //添加窗口(角色窗口) 
    this.addWindow(this._actorWindow);
};
/**创建敌人窗口 */
Scene_Battle.prototype.createEnemyWindow = function() {
	//敌人窗口 = 新 窗口战斗敌人(0, 状态窗口 y )
    this._enemyWindow = new Window_BattleEnemy(0, this._statusWindow.y);
    //敌人窗口 x = 图形 盒宽 - 敌人窗口 宽
    this._enemyWindow.x = Graphics.boxWidth - this._enemyWindow.width;
    //敌人窗口 设置处理 ( 'ok', 在敌人确定 )
    this._enemyWindow.setHandler('ok',     this.onEnemyOk.bind(this));
    //敌人窗口 设置处理 ( 'cancel', 在敌人取消 )
    this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
    //添加窗口( 敌人窗口 ) 
    this.addWindow(this._enemyWindow);
};
/**创建消息窗口 */
Scene_Battle.prototype.createMessageWindow = function() {
	//消息窗口 = 新 窗口消息
    this._messageWindow = new Window_Message();
    //添加窗口( 消息窗口 ) 
    this.addWindow(this._messageWindow);
    //消息窗口 辅助窗口 对每一个 窗口 
    this._messageWindow.subWindows().forEach(function(window) {
	    //添加窗口(窗口)
        this.addWindow(window);
    }, this);
};
/**创建 滚动文字窗口 */
Scene_Battle.prototype.createScrollTextWindow = function() {
	//设置滚动文字窗口
    this._scrollTextWindow = new Window_ScrollText();
    //添加窗口(滚动文字窗口)
    this.addWindow(this._scrollTextWindow);
};
/**刷新状态 */
Scene_Battle.prototype.refreshStatus = function() {
	//状态窗口 刷新
    this._statusWindow.refresh();
};
/**开始队伍命令选择 */
Scene_Battle.prototype.startPartyCommandSelection = function() {
	//刷新状态()
    this.refreshStatus();
    //状态窗口 取消选择()
    this._statusWindow.deselect();
    //状态窗口 打开()
    this._statusWindow.open();
    //角色命令窗口 关闭()
    this._actorCommandWindow.close();
    //队伍命令窗口 设置()
    this._partyCommandWindow.setup();
};
/**命令 战斗 */
Scene_Battle.prototype.commandFight = function() {
	//选择下一个命令()
    this.selectNextCommand();
};
/**命令逃跑 */
Scene_Battle.prototype.commandEscape = function() {
	//战斗管理器 进行逃跑()
    BattleManager.processEscape();
    //改变输入窗口()
    this.changeInputWindow();
};
/**开始角色命令选择 */
Scene_Battle.prototype.startActorCommandSelection = function() {
	//状态窗口 选择 ( 战斗管理器 角色 索引 )
    this._statusWindow.select(BattleManager.actor().index());
    //队伍命令窗口 关闭
    this._partyCommandWindow.close();
    //角色命令窗口 设置 ( 战斗管理器 角色 )
    this._actorCommandWindow.setup(BattleManager.actor());
};
/**命令攻击 */
Scene_Battle.prototype.commandAttack = function() {
	//战斗管理器 输入角色() 设置攻击()
    BattleManager.inputtingAction().setAttack();
    //选择敌人选择()
    this.selectEnemySelection();
};
/**命令技能 */
Scene_Battle.prototype.commandSkill = function() {
	//技能窗口 设置角色 (战斗管理器 角色)
    this._skillWindow.setActor(BattleManager.actor());
    //技能窗口 设置技能种类id (角色选择窗口 当前提取)
    this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
    //技能窗口 刷新()
    this._skillWindow.refresh();
    //技能窗口 显示()
    this._skillWindow.show();
    //技能窗口 活动()
    this._skillWindow.activate();
};
/**命令防御 */
Scene_Battle.prototype.commandGuard = function() {
	//战斗管理器 输入角色 设置防御
    BattleManager.inputtingAction().setGuard();
    //选择下一个命令
    this.selectNextCommand();
};
/**命令物品 */
Scene_Battle.prototype.commandItem = function() {
	//物品窗口 刷新
    this._itemWindow.refresh();
    //物品窗口 显示
    this._itemWindow.show();
    //物品窗口 活动
    this._itemWindow.activate();
};
/**选择下一个命令 */
Scene_Battle.prototype.selectNextCommand = function() {
	//战斗管理器 选择下一个命令
    BattleManager.selectNextCommand();
    //改变输入窗口()
    this.changeInputWindow();
};
/**选择之前命令 */
Scene_Battle.prototype.selectPreviousCommand = function() {
	//战斗管理器 选择之前命令()
    BattleManager.selectPreviousCommand();
    //改变输入窗口()
    this.changeInputWindow();
};
/**选择角色选择 */
Scene_Battle.prototype.selectActorSelection = function() {
	//角色窗口 刷新()
    this._actorWindow.refresh();
    //角色窗口 显示()
    this._actorWindow.show();
    //角色窗口 活动()
    this._actorWindow.activate();
};
/**在角色确定 */
Scene_Battle.prototype.onActorOk = function() {
	//动作 = 战斗管理器 输入动作()
    var action = BattleManager.inputtingAction();
    //动作 设置目标 (角色窗口索引)
    action.setTarget(this._actorWindow.index());
    //角色窗口 隐藏()
    this._actorWindow.hide();
    //技能窗口 隐藏()
    this._skillWindow.hide();
    //物品窗口 隐藏()
    this._itemWindow.hide();
    //选择下一个命令()
    this.selectNextCommand();
};
/**在角色取消 */
Scene_Battle.prototype.onActorCancel = function() {
	//角色窗口 隐藏()
    this._actorWindow.hide();
    //检查( 角色命令窗口 当前标记() )
    switch (this._actorCommandWindow.currentSymbol()) {
	//当 技能
    case 'skill':
        //技能窗口 显示()
        this._skillWindow.show();
        //技能窗口 活动()
        this._skillWindow.activate();
        //中断
        break;
    //当 物品
    case 'item':
        //物品窗口 显示()
        this._itemWindow.show();
        //物品窗口 活动()
        this._itemWindow.activate();
        //中断
        break;
    }
};
/**选择敌人选择 */
Scene_Battle.prototype.selectEnemySelection = function() {
	//敌人窗口 刷新()
    this._enemyWindow.refresh();
    //敌人窗口 显示()
    this._enemyWindow.show();
    //敌人窗口 选择(0)
    this._enemyWindow.select(0);
    //敌人窗口 活动()
    this._enemyWindow.activate();
};
/**在敌人确定 */
Scene_Battle.prototype.onEnemyOk = function() {
	//动作 = 战斗管理器 输入动作()
    var action = BattleManager.inputtingAction();
    //动作 设置目标 (敌人窗口 的 敌人索引)
    action.setTarget(this._enemyWindow.enemyIndex());
    //敌人窗口 隐藏()
    this._enemyWindow.hide();
    //技能窗口 隐藏()
    this._skillWindow.hide();
    //物品窗口 隐藏()
    this._itemWindow.hide();
    //选择下一个命令()
    this.selectNextCommand();
};
/**在敌人取消 */
Scene_Battle.prototype.onEnemyCancel = function() {
	//敌人窗口 隐藏()
    this._enemyWindow.hide();
    //检查( 角色命令窗口 当前标记())
    switch (this._actorCommandWindow.currentSymbol()) {
	// 攻击
    case 'attack':
        //角色命令窗口 活动()
        this._actorCommandWindow.activate();
        break;
    //技能
    case 'skill':
        //技能窗口 显示()
        this._skillWindow.show();
        //技能窗口 活动()
        this._skillWindow.activate();
        break;
    //物品
    case 'item':
        //物品窗口 显示()
        this._itemWindow.show();
        //物品窗口 活动()
        this._itemWindow.activate();
        break;
    }
};
/**在技能确定 */
Scene_Battle.prototype.onSkillOk = function() {
	//技能 = 技能窗口 项目()
    var skill = this._skillWindow.item();
    //动作 = 战斗管理器 输入动作()
    var action = BattleManager.inputtingAction();
    //动作 设置技能 (技能 id)
    action.setSkill(skill.id);
    //战斗管理器 角色() 设置最后战斗技能(技能)
    BattleManager.actor().setLastBattleSkill(skill);
    //在选择动作()
    this.onSelectAction();
};
/**在技能取消 */
Scene_Battle.prototype.onSkillCancel = function() {
	//技能窗口 隐藏()
    this._skillWindow.hide();
    //角色命令窗口 活动()
    this._actorCommandWindow.activate();
};
/**在物品确定 */
Scene_Battle.prototype.onItemOk = function() {
	// 物品 = 物品窗口 项目()
    var item = this._itemWindow.item();
    // 动作 = 战斗管理器 输入动作()
    var action = BattleManager.inputtingAction();
    // 动作 设置物品(物品 id)
    action.setItem(item.id);
    //游戏队伍 设置最后物品(物品)
    $gameParty.setLastItem(item);
    //在选择动作()
    this.onSelectAction();
};
/**在物品取消 */
Scene_Battle.prototype.onItemCancel = function() {
	//物品窗口 隐藏()
    this._itemWindow.hide();
    //角色命令窗口 活动()
    this._actorCommandWindow.activate();
};
/**在选择动作 */
Scene_Battle.prototype.onSelectAction = function() {
	// 动作 = 战斗管理器 输入动作()
    var action = BattleManager.inputtingAction();
    //技能窗口 隐藏()
    this._skillWindow.hide();
    //物品窗口 隐藏()
    this._itemWindow.hide();
    //如果( 不是 动作 需要选择())
    if (!action.needsSelection()) {
	    //选择下一个命令()
        this.selectNextCommand();
    //否则 如果( 动作 是对于敌人())
    } else if (action.isForOpponent()) {
	    //选择敌人选择()
        this.selectEnemySelection();
    //否则
    } else {
	    //选择角色选择()
        this.selectActorSelection();
    }
};
/**结束命令选择 */
Scene_Battle.prototype.endCommandSelection = function() {
	//队伍命令窗口 关闭()
    this._partyCommandWindow.close();
    //角色命令窗口 关闭()
    this._actorCommandWindow.close();
    //状态命令窗口 取消选择()
    this._statusWindow.deselect();
};
