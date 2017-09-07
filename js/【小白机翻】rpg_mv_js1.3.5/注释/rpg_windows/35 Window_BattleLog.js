
//-----------------------------------------------------------------------------
// Window_BattleLog
// 窗口战斗记录
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.
// 显示战斗进行的窗口.没有显示框但运用一个窗口比较方便

function Window_BattleLog() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_BattleLog.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_BattleLog.prototype.constructor = Window_BattleLog;
//初始化
Window_BattleLog.prototype.initialize = function() {
	//宽 = 窗口宽
    var width = this.windowWidth();
    //高 = 窗口高
    var height = this.windowHeight();
    //调用 窗口选择 初始化 (this,0,0,宽,高)
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    //不透明度 = 0
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
//消息速度
Window_BattleLog.prototype.messageSpeed = function() {
	//返回 16
    return 16;
};
//是忙碌的
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
	//等待计数 =  消息速度
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
    //当 (行组 长度 > 基础行)
    while (this._lines.length > baseLine) {
	    //行组 最后一个(并删除)
        this._lines.pop();
    }
};
//等待为新行
Window_BattleLog.prototype.waitForNewLine = function() {
	//基础行 = 0
    var baseLine = 0;
    //如果 (基础行堆 长度 > 0)
    if (this._baseLineStack.length > 0) {
	    //基础行 = 基础行堆 [ 基础行堆 长度 -1 ]   //最后一个
        baseLine = this._baseLineStack[this._baseLineStack.length - 1];
    }
    //如果( 行长度 > 基础行)
    if (this._lines.length > baseLine) {
	    //等待
        this.wait();
    }
};
//跃出伤害
Window_BattleLog.prototype.popupDamage = function(target) {
	//目标 开始伤害跃上
    target.startDamagePopup();
};
//表现动作开始
Window_BattleLog.prototype.performActionStart = function(subject, action) {
	//主体 表现动作开始(动作)
    subject.performActionStart(action);
};
//表现动作
Window_BattleLog.prototype.performAction = function(subject, action) {
	//主体 表现动作(动作)
    subject.performAction(action);
};
//表现动作结束
Window_BattleLog.prototype.performActionEnd = function(subject) {
	//主体 表现动作结束
    subject.performActionEnd();
};
//表现伤害
Window_BattleLog.prototype.performDamage = function(target) {
	//目标 表现伤害
    target.performDamage();
};
//表现未命中
Window_BattleLog.prototype.performMiss = function(target) {
	//目标 表现未命中
    target.performMiss();
};
//表现恢复
Window_BattleLog.prototype.performRecovery = function(target) {
	//目标 表现恢复
    target.performRecovery();
};
//表现回避
Window_BattleLog.prototype.performEvasion = function(target) {
	//目标 表现回避
    target.performEvasion();
};
//表现魔法回避
Window_BattleLog.prototype.performMagicEvasion = function(target) {
	//目标 表现魔法回避
    target.performMagicEvasion();
};
//表现反击
Window_BattleLog.prototype.performCounter = function(target) {
	//目标 表现反击
    target.performCounter();
};
//表现反射
Window_BattleLog.prototype.performReflection = function(target) {
	//目标 表现反射
    target.performReflection();
};
//表现替代
Window_BattleLog.prototype.performSubstitute = function(substitute, target) {
	//替代者 表现替代(目标)
    substitute.performSubstitute(target);
};
//表现死亡
Window_BattleLog.prototype.performCollapse = function(target) {
	//目标 表现死亡
    target.performCollapse();
};
//显示动画
Window_BattleLog.prototype.showAnimation = function(subject, targets, animationId) {
	//如果 (动画id < 0 )
    if (animationId < 0) {
	    //显示攻击动画(主体 ,目标组)
        this.showAttackAnimation(subject, targets);
    //否则
    } else {
	    //显示正常动画
        this.showNormalAnimation(targets, animationId);
    }
};
//显示攻击动画
Window_BattleLog.prototype.showAttackAnimation = function(subject, targets) {
	//如果 ( 主体 是角色)
    if (subject.isActor()) {
	    //显示角色攻击动画(主体 ,目标组)
        this.showActorAttackAnimation(subject, targets);
    //否则
    } else {
	    //显示敌人攻击动画(主体 ,目标组)
        this.showEnemyAttackAnimation(subject, targets);
    }
};
//显示角色攻击动画
Window_BattleLog.prototype.showActorAttackAnimation = function(subject, targets) {
	//显示正常动画(目标组 ,主体 攻击动画id1 ,false )
    this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
	//显示正常动画(目标组 ,主体 攻击动画id2 ,true )
    this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
};
//显示敌人攻击动画
Window_BattleLog.prototype.showEnemyAttackAnimation = function(subject, targets) {
	//声音管理器 播放敌人攻击
    SoundManager.playEnemyAttack();
};
//显示正常动画
Window_BattleLog.prototype.showNormalAnimation = function(targets, animationId, mirror) {
	//动画 = 数据动画[动画id]
    var animation = $dataAnimations[animationId];
    //如果(动画)
    if (animation) {
	    //延迟 = 动画基础延迟
        var delay = this.animationBaseDelay();
        //下一个延迟 = 动画下一个延迟
        var nextDelay = this.animationNextDelay();
        //目标组 对每一个 目标
        targets.forEach(function(target) {
	        //目标 开始动画 (动画id ,镜反,延迟)
            target.startAnimation(animationId, mirror, delay);
            //延迟 += 下一个延迟
            delay += nextDelay;
        });
    }
};
//动画基础延迟
Window_BattleLog.prototype.animationBaseDelay = function() {
	//返回 8 
    return 8;
};
//动画下一个延迟
Window_BattleLog.prototype.animationNextDelay = function() {
	//返回 12
    return 12;
};
//刷新
Window_BattleLog.prototype.refresh = function() {
	//绘制背景 
    this.drawBackground();
    //内容清除
    this.contents.clear();
    //循环(开始时 i = 0 ;当i <行组 长度; 每一次i++)
    for (var i = 0; i < this._lines.length; i++) {
	    //绘制行文本(i)
        this.drawLineText(i);
    }
};
//绘制背景
Window_BattleLog.prototype.drawBackground = function() {
	//矩形 = 背景矩形
    var rect = this.backRect();
    //颜色 = 背景颜色
    var color = this.backColor();
    //背景图片 清除
    this._backBitmap.clear();
    //背景图片 绘画不透明度 =  背景绘画不透明度
    this._backBitmap.paintOpacity = this.backPaintOpacity();
    //背景图片 填充矩形(矩形x ,矩形y,矩形 宽 , 矩形 高 ,颜色  )
    this._backBitmap.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    //背景图片 绘画不透明度 = 255
    this._backBitmap.paintOpacity = 255;
};
//背景矩形
Window_BattleLog.prototype.backRect = function() {
	//返回 
    return {
	    //x : 0
        x: 0,
        //y : 填充
        y: this.padding,
        //宽 : 宽
        width: this.width,
        //高 : 行数 * 行高
        height: this.numLines() * this.lineHeight()
    };
};
//背景颜色
Window_BattleLog.prototype.backColor = function() {
    return '#000000';
};
//背景绘画不透明度
Window_BattleLog.prototype.backPaintOpacity = function() {
	//返回 64
    return 64;
};
//绘制行文本
Window_BattleLog.prototype.drawLineText = function(index) {
	//矩形 = 项目矩形为文本(索引)
    var rect = this.itemRectForText(index);
    //内容 清除矩形( 矩形x ,矩形y,矩形 宽,矩形 高)
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    //绘制文本增强 ( 行组[索引] , 矩形x ,矩形 y ,矩形 宽 )
    this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
};
//开始回合
Window_BattleLog.prototype.startTurn = function() {
	//添加("wait"//等待)
    this.push('wait');
};
//开始动作
Window_BattleLog.prototype.startAction = function(subject, action, targets) {
	//项目 = 动作 项目
    var item = action.item();
    //添加("performActionStart" //表现动作开始, 主体,动作)
    this.push('performActionStart', subject, action);
    //添加('waitForMovement' //等待为运动 )
    this.push('waitForMovement');
    //添加('performAction' //表现动作 ,主体 , 动作 )
    this.push('performAction', subject, action);
    //添加('showAnimation' //显示动画 , 目标组 克隆 ,项目 动画id  )
    this.push('showAnimation', subject, targets.clone(), item.animationId);
    //显示动作 (主体 ,项目 )
    this.displayAction(subject, item);
};
//结束回合
Window_BattleLog.prototype.endAction = function(subject) {
	//添加('waitForNewLine' //等待为新行  )
    this.push('waitForNewLine');
	//添加('clear' //清除  ) 
    this.push('clear'); 
	//添加('performActionEnd' //表现动作结束 , 主体  ) 
    this.push('performActionEnd', subject);
};
//显示当前状态
Window_BattleLog.prototype.displayCurrentState = function(subject) {
	//状态文本 = 主体 最大重要状态文本
    var stateText = subject.mostImportantStateText();
    //如果 (状态文本)
    if (stateText) {
		//添加('addText' //添加文本 , 主体 名称 + 状态文本   ) 
        this.push('addText', subject.name() + stateText);
		//添加('wait' //等待  ) 
        this.push('wait');
		//添加('clear' //清除  ) 
        this.push('clear');
    }
};
//显示恢复
Window_BattleLog.prototype.displayRegeneration = function(subject) {
	//添加('popupDamage' //跃出伤害 , 主体 ) 
    this.push('popupDamage', subject);
};
//显示动作
Window_BattleLog.prototype.displayAction = function(subject, item) {
	//数字方法组 = 方法组 长度
    var numMethods = this._methods.length;
    //如果 (数据管理器 是技能(项目))
    if (DataManager.isSkill(item)) {
	    //项目 消息1
        if (item.message1) { 
			//添加('addText' //添加文本 , 主体 名称 + 项目 消息1 替换 (项目名称) 
            this.push('addText', subject.name() + item.message1.format(item.name));
        }
	    //项目 消息2
        if (item.message2) {
			//添加('addText' //添加文本 , 项目 消息2 替换 (项目 名称) 
            this.push('addText', item.message2.format(item.name));
        }
    //否则
    } else {
	    //添加('addText' //添加文本 , 文本管理器 使用道具 替换 (主体 名称 , 项目 名称) 
        this.push('addText', TextManager.useItem.format(subject.name(), item.name));
    }
    //如果( 方法组 长度 == 数字方法组)
    if (this._methods.length === numMethods) {
	    //添加( 'wait' //等待)
        this.push('wait');
    }
};
//显示反击
Window_BattleLog.prototype.displayCounter = function(target) {
	//添加('performCounter' //表现反击 , 目标 ) 
    this.push('performCounter', target);
	//添加('addText' //添加文本 , 文本管理器 反击 替换 (目标 名称) 
    this.push('addText', TextManager.counterAttack.format(target.name()));
};
//显示反射
Window_BattleLog.prototype.displayReflection = function(target) {
    this.push('performReflection', target);
	//添加('addText' //添加文本 , 文本管理器 魔法反射 替换 (目标 名称) 
    this.push('addText', TextManager.magicReflection.format(target.name()));
};
//显示替代
Window_BattleLog.prototype.displaySubstitute = function(substitute, target) {
    var substName = substitute.name();
    this.push('performSubstitute', substitute, target);
	//添加('addText' //添加文本 , 文本管理器 替代 替换 (替代者名 , 目标 名称) 
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
		//添加('addText' //添加文本 , 文本管理器 动作失败 替换 (目标 名称) 
        this.push('addText', TextManager.actionFailure.format(target.name()));
    }
};
//显示危险的
Window_BattleLog.prototype.displayCritical = function(target) {
    if (target.result().critical) {
        if (target.isActor()) {
			//添加('addText' //添加文本 , 文本管理器 会心对角色 
            this.push('addText', TextManager.criticalToActor);
        } else {
			//添加('addText' //添加文本 , 文本管理器 会心对敌人 
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
	//格式文本
    var fmt;
    //如果 目标 结果 物理
    if (target.result().physical) {
	    //格式文本 =  如果 目标 是角色 返回 文本管理器 角色未命中 否则 返回 文本管理器 敌人未命中
        fmt = target.isActor() ? TextManager.actorNoHit : TextManager.enemyNoHit;
        //添加('performMiss' //表现未命中 , 目标 )
        this.push('performMiss', target);
    //否则
    } else {
	    //格式文本 =  文本管理器 动作失败
        fmt = TextManager.actionFailure;
    }
	//添加('addText' //添加文本 , 格式文本 替换 (目标 名称) 
    this.push('addText', fmt.format(target.name()));
};
//显示回避
Window_BattleLog.prototype.displayEvasion = function(target) {
	//格式文本
    var fmt;
    //如果 目标 结果 物理
    if (target.result().physical) {
	    //
        fmt = TextManager.evasion;
        this.push('performEvasion', target);
    } else {
        fmt = TextManager.magicEvasion;
        this.push('performMagicEvasion', target);
    }
	//添加('addText' //添加文本 , 文本管理器 反击 替换 (目标 名称) 
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
	//添加('addText' //添加文本 , 文本管理器 反击 替换 (目标 名称) 
        this.push('addText', this.makeHpDamageText(target));
    }
};
//显示mp伤害
Window_BattleLog.prototype.displayMpDamage = function(target) {
    if (target.isAlive() && target.result().mpDamage !== 0) {
        if (target.result().mpDamage < 0) {
            this.push('performRecovery', target);
        }
	//添加('addText' //添加文本 , 文本管理器 反击 替换 (目标 名称) 
        this.push('addText', this.makeMpDamageText(target));
    }
};
//显示tp伤害
Window_BattleLog.prototype.displayTpDamage = function(target) {
    if (target.isAlive() && target.result().tpDamage !== 0) {
        if (target.result().tpDamage < 0) {
            this.push('performRecovery', target);
        }
		//添加('addText' //添加文本 , 文本管理器 反击 替换 (目标 名称) 
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
			//添加('addText' //添加文本 , 文本管理器 反击 替换 (目标 名称) 
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
			//添加('addText' //添加文本 , 文本管理器 反击 替换 (目标 名称) 
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
			//添加('addText' //添加文本 , 文本管理器 反击 替换 (目标 名称) 
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
