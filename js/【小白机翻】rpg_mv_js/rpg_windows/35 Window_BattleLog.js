
//-----------------------------------------------------------------------------
// Window_BattleLog
// 窗口战斗记录
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.
// 显示战斗进程的窗口.没有显示框但运用一个窗口比较方便

function Window_BattleLog() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_BattleLog.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_BattleLog.prototype.constructor = Window_BattleLog;
//初始化
Window_BattleLog.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this.opacity = 0;
    //行组 = []
    this._lines = [];
    //方法组 = []
    this._methods = [];
    //等待计数 = 0
    this._waitCount = 0;
    //等待模式 = ''
    this._waitMode = '';
    //基础行堆 = []
    this._baseLineStack = [];
    //精灵组 = null
    this._spriteset = null;
    //创建背景图片 
    this.createBackBitmap();
    //创建背景精灵
    this.createBackSprite();
    //刷新
    this.refresh();
};
//设置精灵组
Window_BattleLog.prototype.setSpriteset = function(spriteset) {
	//精灵组 = spriteset
    this._spriteset = spriteset;
};
//窗口宽
Window_BattleLog.prototype.windowWidth = function() {
	//返回 图形 盒子宽
    return Graphics.boxWidth;
};
//窗口高
Window_BattleLog.prototype.windowHeight = function() {
	//返回 适宜高(最大行)
    return this.fittingHeight(this.maxLines());
};
//最大行
Window_BattleLog.prototype.maxLines = function() {
	//返回 10
    return 10;
};
//创建背景位图
Window_BattleLog.prototype.createBackBitmap = function() {
	//背景图片 = 新 图片 (宽,高)
    this._backBitmap = new Bitmap(this.width, this.height);
};
//创建背景精灵
Window_BattleLog.prototype.createBackSprite = function() {
	//背景精灵 = 新 精灵
    this._backSprite = new Sprite();
    //背景精灵 图片 = 背景图片
    this._backSprite.bitmap = this._backBitmap;
    //背景精灵 y = y
    this._backSprite.y = this.y;
    //添加子项到背景
    this.addChildToBack(this._backSprite);
};
//行数
Window_BattleLog.prototype.numLines = function() {
	//行组 长度
    return this._lines.length;
};
//信息速度
Window_BattleLog.prototype.messageSpeed = function() {
	//返回 16
    return 16;
};
//是忙
Window_BattleLog.prototype.isBusy = function() {
	//返回 (等待计数 > 0 )或者 (等待模式) 或者 (方法组 长度 > 0)
    return this._waitCount > 0 || this._waitMode || this._methods.length > 0;
};
//更新
Window_BattleLog.prototype.update = function() {
	//如果 不是 更新等待
    if (!this.updateWait()) {
	    //呼叫下一个方法
        this.callNextMethod();
    }
};
//更新等待
Window_BattleLog.prototype.updateWait = function() {
	//返回 更新等待计数 或者 更新等待模式
    return this.updateWaitCount() || this.updateWaitMode();
};
//更新等待计数
Window_BattleLog.prototype.updateWaitCount = function() {
	//如果 等待计数 > 0
    if (this._waitCount > 0) {
	    //等待计数 -= 是快发送? 返回 3 否则 返回 1
        this._waitCount -= this.isFastForward() ? 3 : 1;
        //如果 等待计数 < 0
        if (this._waitCount < 0) {
	        //等待计数 = 0
            this._waitCount = 0;
        }
        //返回 true
        return true;
    }
    //返回 false
    return false;
};
//更新模式
Window_BattleLog.prototype.updateWaitMode = function() {
	//等待中 = false
    var waiting = false;
    //检查 等待模式  
    switch (this._waitMode) {
	//当 "effec"  // 效果
    case 'effect':
    	//等待中 = 精灵组 是效果中
        waiting = this._spriteset.isEffecting();
        //打破
        break;
    //当 'movement'  // 运动
    case 'movement':
        //等待中 = 精灵组 是任何一个移动中
        waiting = this._spriteset.isAnyoneMoving();
        //打破
        break;
    }
    //如果 不是 等待中
    if (!waiting) {
	    //等待模式 = ""
        this._waitMode = '';
    }
    //返回 等待中
    return waiting;
};
//设置等待模式
Window_BattleLog.prototype.setWaitMode = function(waitMode) {
	//等待模式 = waitMode
    this._waitMode = waitMode;
};
//呼叫下一个方法
Window_BattleLog.prototype.callNextMethod = function() {
	//如果 方法组 长度 > 0
    if (this._methods.length > 0) {
	    //方法 = 方法组 第一个(并删除)
        var method = this._methods.shift();
        //如果 方法 名称 并且 方法 名称 存在 
        if (method.name && this[method.name]) {
	        // 方法 名称 应用 方法 参数
            this[method.name].apply(this, method.params);
        } else {
	        //抛出 新 错误 (方法 没有找到 方法名)
            throw new Error('Method not found: ' + method.name);
        }
    }
};
//是快发送
Window_BattleLog.prototype.isFastForward = function() {
	//返回 输入 是长按下(ok)  或者 输入 是按下(shift) 或者 触摸输入 是长按下
    return (Input.isLongPressed('ok') || Input.isPressed('shift') ||
            TouchInput.isLongPressed());
};
//添加
Window_BattleLog.prototype.push = function(methodName) {
	//方法参数 = 数组 切割 呼叫 (参数,1)
    var methodArgs = Array.prototype.slice.call(arguments, 1);
    //方法组 添加 ( {名称:方法名称 ,参数:方法参数} )
    this._methods.push({ name: methodName, params: methodArgs });
};
//清除
Window_BattleLog.prototype.clear = function() {
	//行组 = []
    this._lines = [];
    //基础行堆 = []
    this._baseLineStack = [];
    //刷新
    this.refresh();
};
//等待
Window_BattleLog.prototype.wait = function() {
	//等待计数 =  信息速度
    this._waitCount = this.messageSpeed();
};
//等待为效果
Window_BattleLog.prototype.waitForEffect = function() {
	//设置等待模式('effect')
    this.setWaitMode('effect');
};
//等待为运动
Window_BattleLog.prototype.waitForMovement = function() {
	//设置等待模式('movement')
    this.setWaitMode('movement');
};
//增加文本
Window_BattleLog.prototype.addText = function(text) {
	//行组 添加 text
    this._lines.push(text);
    //刷新 
    this.refresh();
    //等待
    this.wait();
};
//添加基础行
Window_BattleLog.prototype.pushBaseLine = function() {
	//基础行堆 添加 (行组 长度)
    this._baseLineStack.push(this._lines.length);
};
//最后基础行
Window_BattleLog.prototype.popBaseLine = function() {
	//基础行 = 基础行堆 最后一个(并删除)
    var baseLine = this._baseLineStack.pop();
    while (this._lines.length > baseLine) {
        this._lines.pop();
    }
};
//等待为新行
Window_BattleLog.prototype.waitForNewLine = function() {
    var baseLine = 0;
    if (this._baseLineStack.length > 0) {
        baseLine = this._baseLineStack[this._baseLineStack.length - 1];
    }
    if (this._lines.length > baseLine) {
        this.wait();
    }
};
//跃出伤害
Window_BattleLog.prototype.popupDamage = function(target) {
    target.startDamagePopup();
};
//表现动作开始
Window_BattleLog.prototype.performActionStart = function(subject, action) {
    subject.performActionStart(action);
};
//表现动作
Window_BattleLog.prototype.performAction = function(subject, action) {
    subject.performAction(action);
};
//表现动作结束
Window_BattleLog.prototype.performActionEnd = function(subject) {
    subject.performActionEnd();
};
//表现伤害
Window_BattleLog.prototype.performDamage = function(target) {
    target.performDamage();
};
//表现未命中
Window_BattleLog.prototype.performMiss = function(target) {
    target.performMiss();
};
//表现恢复
Window_BattleLog.prototype.performRecovery = function(target) {
    target.performRecovery();
};
//表现回避
Window_BattleLog.prototype.performEvasion = function(target) {
    target.performEvasion();
};
//表现魔法回避
Window_BattleLog.prototype.performMagicEvasion = function(target) {
    target.performMagicEvasion();
};
//表现反击
Window_BattleLog.prototype.performCounter = function(target) {
    target.performCounter();
};
//表现反射
Window_BattleLog.prototype.performReflection = function(target) {
    target.performReflection();
};
//表现替代
Window_BattleLog.prototype.performSubstitute = function(substitute, target) {
    substitute.performSubstitute(target);
};
//表现死亡
Window_BattleLog.prototype.performCollapse = function(target) {
    target.performCollapse();
};
//显示动画
Window_BattleLog.prototype.showAnimation = function(subject, targets, animationId) {
    if (animationId < 0) {
        this.showAttackAnimation(subject, targets);
    } else {
        this.showNormalAnimation(targets, animationId);
    }
};
//显示攻击动画
Window_BattleLog.prototype.showAttackAnimation = function(subject, targets) {
    if (subject.isActor()) {
        this.showActorAttackAnimation(subject, targets);
    } else {
        this.showEnemyAttackAnimation(subject, targets);
    }
};
//显示角色攻击动画
Window_BattleLog.prototype.showActorAttackAnimation = function(subject, targets) {
    this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
    this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
};
//显示敌人攻击动画
Window_BattleLog.prototype.showEnemyAttackAnimation = function(subject, targets) {
    SoundManager.playEnemyAttack();
};
//显示正常动画
Window_BattleLog.prototype.showNormalAnimation = function(targets, animationId, mirror) {
    var animation = $dataAnimations[animationId];
    if (animation) {
        var delay = this.animationBaseDelay();
        var nextDelay = this.animationNextDelay();
        targets.forEach(function(target) {
            target.startAnimation(animationId, mirror, delay);
            delay += nextDelay;
        });
    }
};
//动画基础延迟
Window_BattleLog.prototype.animationBaseDelay = function() {
    return 8;
};
//动画下一个延迟
Window_BattleLog.prototype.animationNextDelay = function() {
    return 12;
};
//刷新
Window_BattleLog.prototype.refresh = function() {
    this.drawBackground();
    this.contents.clear();
    for (var i = 0; i < this._lines.length; i++) {
        this.drawLineText(i);
    }
};
//绘制背景
Window_BattleLog.prototype.drawBackground = function() {
    var rect = this.backRect();
    var color = this.backColor();
    this._backBitmap.clear();
    this._backBitmap.paintOpacity = this.backPaintOpacity();
    this._backBitmap.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this._backBitmap.paintOpacity = 255;
};
//背景矩形
Window_BattleLog.prototype.backRect = function() {
    return {
        x: 0,
        y: this.padding,
        width: this.width,
        height: this.numLines() * this.lineHeight()
    };
};
//背景颜色
Window_BattleLog.prototype.backColor = function() {
    return '#000000';
};
//背景不透明度
Window_BattleLog.prototype.backPaintOpacity = function() {
    return 64;
};
//绘制行文本
Window_BattleLog.prototype.drawLineText = function(index) {
    var rect = this.itemRectForText(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
};
//开始回合
Window_BattleLog.prototype.startTurn = function() {
    this.push('wait');
};
//开始动作
Window_BattleLog.prototype.startAction = function(subject, action, targets) {
    var item = action.item();
    this.push('performActionStart', subject, action);
    this.push('waitForMovement');
    this.push('performAction', subject, action);
    this.push('showAnimation', subject, targets.clone(), item.animationId);
    this.displayAction(subject, item);
};
//结束回合
Window_BattleLog.prototype.endAction = function(subject) {
    this.push('waitForNewLine');
    this.push('clear');
    this.push('performActionEnd', subject);
};
//显示当前状态
Window_BattleLog.prototype.displayCurrentState = function(subject) {
    var stateText = subject.mostImportantStateText();
    if (stateText) {
        this.push('addText', subject.name() + stateText);
        this.push('wait');
        this.push('clear');
    }
};
//显示恢复
Window_BattleLog.prototype.displayRegeneration = function(subject) {
    this.push('popupDamage', subject);
};
//显示动作
Window_BattleLog.prototype.displayAction = function(subject, item) {
    var numMethods = this._methods.length;
    if (DataManager.isSkill(item)) {
        if (item.message1) {
            this.push('addText', subject.name() + item.message1.format(item.name));
        }
        if (item.message2) {
            this.push('addText', item.message2.format(item.name));
        }
    } else {
        this.push('addText', TextManager.useItem.format(subject.name(), item.name));
    }
    if (this._methods.length === numMethods) {
        this.push('wait');
    }
};
//显示反击
Window_BattleLog.prototype.displayCounter = function(target) {
    this.push('performCounter', target);
    this.push('addText', TextManager.counterAttack.format(target.name()));
};
//显示反射
Window_BattleLog.prototype.displayReflection = function(target) {
    this.push('performReflection', target);
    this.push('addText', TextManager.magicReflection.format(target.name()));
};
//显示替代
Window_BattleLog.prototype.displaySubstitute = function(substitute, target) {
    var substName = substitute.name();
    this.push('performSubstitute', substitute, target);
    this.push('addText', TextManager.substitute.format(substName, target.name()));
};
//显示动作结果
Window_BattleLog.prototype.displayActionResults = function(subject, target) {
    if (target.result().used) {
        this.push('pushBaseLine');
        this.displayCritical(target);
        this.push('popupDamage', target);
        this.push('popupDamage', subject);
        this.displayDamage(target);
        this.displayAffectedStatus(target);
        this.displayFailure(target);
        this.push('waitForNewLine');
        this.push('popBaseLine');
    }
};
//显示失败
Window_BattleLog.prototype.displayFailure = function(target) {
    if (target.result().isHit() && !target.result().success) {
        this.push('addText', TextManager.actionFailure.format(target.name()));
    }
};
//显示危险的
Window_BattleLog.prototype.displayCritical = function(target) {
    if (target.result().critical) {
        if (target.isActor()) {
            this.push('addText', TextManager.criticalToActor);
        } else {
            this.push('addText', TextManager.criticalToEnemy);
        }
    }
};
//显示伤害
Window_BattleLog.prototype.displayDamage = function(target) {
    if (target.result().missed) {
        this.displayMiss(target);
    } else if (target.result().evaded) {
        this.displayEvasion(target);
    } else {
        this.displayHpDamage(target);
        this.displayMpDamage(target);
        this.displayTpDamage(target);
    }
};
//显示未命中
Window_BattleLog.prototype.displayMiss = function(target) {
    var fmt;
    if (target.result().physical) {
        fmt = target.isActor() ? TextManager.actorNoHit : TextManager.enemyNoHit;
        this.push('performMiss', target);
    } else {
        fmt = TextManager.actionFailure;
    }
    this.push('addText', fmt.format(target.name()));
};
//显示回避
Window_BattleLog.prototype.displayEvasion = function(target) {
    var fmt;
    if (target.result().physical) {
        fmt = TextManager.evasion;
        this.push('performEvasion', target);
    } else {
        fmt = TextManager.magicEvasion;
        this.push('performMagicEvasion', target);
    }
    this.push('addText', fmt.format(target.name()));
};
//显示hp伤害
Window_BattleLog.prototype.displayHpDamage = function(target) {
    if (target.result().hpAffected) {
        if (target.result().hpDamage > 0 && !target.result().drain) {
            this.push('performDamage', target);
        }
        if (target.result().hpDamage < 0) {
            this.push('performRecovery', target);
        }
        this.push('addText', this.makeHpDamageText(target));
    }
};
//显示mp伤害
Window_BattleLog.prototype.displayMpDamage = function(target) {
    if (target.isAlive() && target.result().mpDamage !== 0) {
        if (target.result().mpDamage < 0) {
            this.push('performRecovery', target);
        }
        this.push('addText', this.makeMpDamageText(target));
    }
};
//显示tp伤害
Window_BattleLog.prototype.displayTpDamage = function(target) {
    if (target.isAlive() && target.result().tpDamage !== 0) {
        if (target.result().tpDamage < 0) {
            this.push('performRecovery', target);
        }
        this.push('addText', this.makeTpDamageText(target));
    }
};
//显示影响状态
Window_BattleLog.prototype.displayAffectedStatus = function(target) {
    if (target.result().isStatusAffected()) {
        this.push('pushBaseLine');
        this.displayChangedStates(target);
        this.displayChangedBuffs(target);
        this.push('waitForNewLine');
        this.push('popBaseLine');
    }
};
//显示自动影响状态
Window_BattleLog.prototype.displayAutoAffectedStatus = function(target) {
    if (target.result().isStatusAffected()) {
        this.displayAffectedStatus(target, null);
        this.push('clear');
    }
};
//显示状态改变
Window_BattleLog.prototype.displayChangedStates = function(target) {
    this.displayAddedStates(target);
    this.displayRemovedStates(target);
};
//显示添加状态
Window_BattleLog.prototype.displayAddedStates = function(target) {
    target.result().addedStateObjects().forEach(function(state) {
        var stateMsg = target.isActor() ? state.message1 : state.message2;
        if (state.id === target.deathStateId()) {
            this.push('performCollapse', target);
        }
        if (stateMsg) {
            this.push('popBaseLine');
            this.push('pushBaseLine');
            this.push('addText', target.name() + stateMsg);
            this.push('waitForEffect');
        }
    }, this);
};
//显示移除状态
Window_BattleLog.prototype.displayRemovedStates = function(target) {
    target.result().removedStateObjects().forEach(function(state) {
        if (state.message4) {
            this.push('popBaseLine');
            this.push('pushBaseLine');
            this.push('addText', target.name() + state.message4);
        }
    }, this);
};
//显示效果改变
Window_BattleLog.prototype.displayChangedBuffs = function(target) {
    var result = target.result();
    this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
    this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
    this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
};
//显示效果
Window_BattleLog.prototype.displayBuffs = function(target, buffs, fmt) {
    buffs.forEach(function(paramId) {
        this.push('popBaseLine');
        this.push('pushBaseLine');
        this.push('addText', fmt.format(target.name(), TextManager.param(paramId)));
    }, this);
};
//制作hp伤害文本
Window_BattleLog.prototype.makeHpDamageText = function(target) {
    var result = target.result();
    var damage = result.hpDamage;
    var isActor = target.isActor();
    var fmt;
    if (damage > 0 && result.drain) {
        fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
        return fmt.format(target.name(), TextManager.hp, damage);
    } else if (damage > 0) {
        fmt = isActor ? TextManager.actorDamage : TextManager.enemyDamage;
        return fmt.format(target.name(), damage);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
        return fmt.format(target.name(), TextManager.hp, -damage);
    } else {
        fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
        return fmt.format(target.name());
    }
};
//制作mp伤害文本
Window_BattleLog.prototype.makeMpDamageText = function(target) {
    var result = target.result();
    var damage = result.mpDamage;
    var isActor = target.isActor();
    var fmt;
    if (damage > 0 && result.drain) {
        fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
        return fmt.format(target.name(), TextManager.mp, damage);
    } else if (damage > 0) {
        fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
        return fmt.format(target.name(), TextManager.mp, damage);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
        return fmt.format(target.name(), TextManager.mp, -damage);
    } else {
        return '';
    }
};
//制作tp伤害文本
Window_BattleLog.prototype.makeTpDamageText = function(target) {
    var result = target.result();
    var damage = result.tpDamage;
    var isActor = target.isActor();
    var fmt;
    if (damage > 0) {
        fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
        return fmt.format(target.name(), TextManager.tp, damage);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
        return fmt.format(target.name(), TextManager.tp, -damage);
    } else {
        return '';
    }
};
