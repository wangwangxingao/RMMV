
/**-----------------------------------------------------------------------------*/
/** Game_Interpreter*/
/** 游戏事件解释器*/
/** The interpreter for running event commands.*/
/** 运转事件命令的解释器*/


/**初始化*/
Game_Interpreter.prototype.initialize = function (depth) {
    //深度 = depth//深度 || 0
    this._depth = depth || 0;
    //检查溢出()
    this.checkOverflow();
    //清除()
    this.clear();
    //分支 = {}
    this._branch = {};
    //参数组 = []
    this._params = [];
    //缩进 = 0
    this._indent = 0;
    //帧计数 = 0
    this._frameCount = 0;
    //冻结检查 = 0
    this._freezeChecker = 0;
};
/**检查溢出*/
Game_Interpreter.prototype.checkOverflow = function () {
    //如果 (深度 >= 100 )
    if (this._depth >= 100) {
        //抛出 新 错误 ("Common event calls exceeded the limit" //事件调用超出限制)
        throw new Error('Common event calls exceeded the limit');
    }
};
/**清除*/
Game_Interpreter.prototype.clear = function () {
    //地图id = 0
    this._mapId = 0;
    //事件id = 0
    this._eventId = 0;
    //列表 = null
    this._list = null;
    //索引 = 0
    this._index = 0;
    //等待计数 = 0
    this._waitCount = 0;
    //等待模式 = ''
    this._waitMode = '';
    //注释 = ''
    this._comments = '';
    //人物 = null
    this._character = null;
    //子事件解释器
    this._childInterpreter = null;
};
/**安装*/
Game_Interpreter.prototype.setup = function (list, eventId) {
    //清除()
    this.clear();
    //地图id = 游戏地图 地图id()
    this._mapId = $gameMap.mapId();
    //事件id = eventId//事件id || 0
    this._eventId = eventId || 0;
    //列表 = list//列表
    this._list = list;
    Game_Interpreter.requestImages(list);
};
/**事件id*/
Game_Interpreter.prototype.eventId = function () {
    //返回 事件id
    return this._eventId;
};
/**是在当前地图*/
Game_Interpreter.prototype.isOnCurrentMap = function () {
    //返回 地图id === 游戏地图 地图id()
    return this._mapId === $gameMap.mapId();
};
/**安装储存公共事件*/
Game_Interpreter.prototype.setupReservedCommonEvent = function () {
    //如果( 游戏临时 是公共事件储存() )
    if ($gameTemp.isCommonEventReserved()) {
        //安装( 游戏临时 储存公共事件() 列表)
        this.setup($gameTemp.reservedCommonEvent().list);
        //游戏临时 清除公共事件()
        $gameTemp.clearCommonEvent();
        //返回 true 
        return true;
        //否则
    } else {
        //返回 false
        return false;
    }
};
/**是运转*/
Game_Interpreter.prototype.isRunning = function () {
    //返回 !!列表
    return !!this._list;
};
/**更新*/
Game_Interpreter.prototype.update = function () {
    //当( 是运转() )
    while (this.isRunning()) {
        //如果( 更新子项() 或者 更新等待())
        if (this.updateChild() || this.updateWait()) {
            //中断
            break;
        }
        //如果 (场景管理器 是场景改变() )
        if (SceneManager.isSceneChanging()) {
            //中断
            break;
        }
        //如果( 不是 执行命令() )
        if (!this.executeCommand()) {
            //中断
            break;
        }
        //如果 (检查冻结() )
        if (this.checkFreeze()) {
            //中断
            break;
        }
    }
};
/**更新子项*/
Game_Interpreter.prototype.updateChild = function () {
    //如果( 子事件解释器 )
    if (this._childInterpreter) {
        //子事件解释器 更新()
        this._childInterpreter.update();
        //如果( 子事件解释器 是运转() )
        if (this._childInterpreter.isRunning()) {
            //返回 true
            return true;
            //否则
        } else {
            //子事件解释器 = null
            this._childInterpreter = null;
        }
    }
    //返回 false
    return false;
};
/**更新等待*/
Game_Interpreter.prototype.updateWait = function () {
    //返回 更新等待计数() 或者 更新等待模式() 
    return this.updateWaitCount() || this.updateWaitMode();
};
/**更新等待计数*/
Game_Interpreter.prototype.updateWaitCount = function () {
    //如果 等待计数 > 0
    if (this._waitCount > 0) {
        //等待计数 -- 
        this._waitCount--;
        //返回 true
        return true;
    }
    //返回 false
    return false;
};
/**更新等待模式*/
Game_Interpreter.prototype.updateWaitMode = function () {
    //等待中 = false
    var waiting = false;
    //检查( 等待模式)
    switch (this._waitMode) {
        //当 "message" //消息
        case 'message':
            //等待中 = 游戏消息 是忙碌的()
            waiting = $gameMessage.isBusy();
            //中断
            break;
        //当 "transfer" //传送
        case 'transfer':
            //等待中 = 游戏游戏者 是传送中()
            waiting = $gamePlayer.isTransferring();
            //中断
            break;
        //当 "scroll" //滚动
        case 'scroll':
            //等待中 = 游戏地图 是滚动中()
            waiting = $gameMap.isScrolling();
            //中断
            break;
        //当  "route" //路线
        case 'route':
            //等待中 = 人物 是强制移动路线()
            waiting = this._character.isMoveRouteForcing();
            //中断
            break;
        //当 "animation" //动画
        case 'animation':
            //等待中 = 人物 是动画播放中()
            waiting = this._character.isAnimationPlaying();
            //中断
            break;
        //当 "balloon" //气球
        case 'balloon':
            //等待中 = 人物 是气球播放中()
            waiting = this._character.isBalloonPlaying();
            //中断
            break;
        //当 "gather" //集合
        case 'gather':
            //等待中 = 游戏游戏者 是从者集合中()
            waiting = $gamePlayer.areFollowersGathering();
            //中断
            break;
        //当 "action" //动作
        case 'action':
            //等待中 = 战斗管理器 是强制动作()
            waiting = BattleManager.isActionForced();
            //中断
            break;
        //当 "video" //视频
        case 'video':
            //等待中 = 图形 是视频播放中()
            waiting = Graphics.isVideoPlaying();
            //中断
            break;
        //当 "image" //图像
        case 'image':
            //等待中 = 不是 图像管理器 是忙碌的()
            waiting = !ImageManager.isReady();
            //中断
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
/**设置等待模式*/
Game_Interpreter.prototype.setWaitMode = function (waitMode) {
    //等待模式 = 等待模式 
    this._waitMode = waitMode;
};
/**等待*/
Game_Interpreter.prototype.wait = function (duration) {
    //等待计数 = 持续时间
    this._waitCount = duration;
};
/**淡入速度*/
Game_Interpreter.prototype.fadeSpeed = function () {
    //返回 24
    return 24;
};
/**执行命令*/
Game_Interpreter.prototype.executeCommand = function () {
    //命令 =  当前命令()
    var command = this.currentCommand();
    //如果(命令)
    if (command) {
        //参数组 = 命令 参数组
        this._params = command.parameters;
        //缩进 = 命令 缩进
        this._indent = command.indent;
        //方法名称 = "command"//命令 + 命令 编码
        var methodName = 'command' + command.code;
        //如果 (类型 [方法名称] === "function"//方法 )
        if (typeof this[methodName] === 'function') {
            //如果(不是 [methodName]())
            if (!this[methodName]()) {
                //返回 false
                return false;
            }
        }
        //索引++ 
        this._index++;
        //否则 
    } else {
        //终止()
        this.terminate();
    }
    //返回 true
    return true;
};



Game_Interpreter.prototype.changeCommand = function () {
    //命令 =  当前命令()
    this._index = 1

    this._jscode = ""
    while (1) {
        var command = this.currentCommand();

        if (command) {
            this._params = command.parameters;
            this._indent = command.indent;
            var methodName = 'change' + command.code;

            if (typeof this[methodName] === 'function') {
                this[methodName]()
            }
            //索引++ 
            this._index++;
            //否则 
        } else {
            break
        }
    }
    return this._jscode;
}

/**检查冻结*/
Game_Interpreter.prototype.checkFreeze = function () {
    //如果( 帧计数  !== 图形 帧计数)
    if (this._frameCount !== Graphics.frameCount) {
        //帧计数  = 图形 帧计数
        this._frameCount = Graphics.frameCount;
        //冻结检查 = 0 
        this._freezeChecker = 0;
    }
    //如果 冻结检查++ >= 100000
    if (this._freezeChecker++ >= 100000) {
        //返回 true
        return true;
        //否则
    } else {
        //返回 false
        return false;
    }
};
/**终止*/
Game_Interpreter.prototype.terminate = function () {
    //列表 = null 
    this._list = null;
    //注释 = ""
    this._comments = '';
};
/**跳分支*/
Game_Interpreter.prototype.skipBranch = function () {
    //当 (列表[索引+1] 缩进 > 缩进 )
    while (this._list[this._index + 1].indent > this._indent) {
        //索引 ++ 
        this._index++;
    }
};
/**当前命令*/
Game_Interpreter.prototype.currentCommand = function () {
    //返回 列表[索引]
    return this._list[this._index];
};
/**下一个事件编码*/
Game_Interpreter.prototype.nextEventCode = function () {
    //命令 = 列表[索引 + 1]
    var command = this._list[this._index + 1];
    //如果(命令)
    if (command) {
        //返回 命令 编码
        return command.code;
        //否则 
    } else {
        //返回 0
        return 0;
    }
};
/**迭代角色id*/
Game_Interpreter.prototype.iterateActorId = function (param, callback) {
    //如果(参数 === 0)
    if (param === 0) {
        //游戏队伍 成员组 对每一个 ( 呼叫返回 )
        $gameParty.members().forEach(callback);
        //否则
    } else {
        //角色 = 游戏角色组 角色(参数)
        var actor = $gameActors.actor(param);
        //如果 (角色)
        if (actor) {
            //呼叫返回(角色)
            callback(actor);
        }
    }
};
/**迭代角色ex*/
Game_Interpreter.prototype.iterateActorEx = function (param1, param2, callback) {
    //如果 (参数1 === 0)
    if (param1 === 0) {
        //迭代角色id(参数2 ,呼叫返回)
        this.iterateActorId(param2, callback);
        //否则
    } else {
        //迭代角色id(游戏变量组 值(参数2) ,呼叫返回)
        this.iterateActorId($gameVariables.value(param2), callback);
    }
};
/**迭代角色索引*/
Game_Interpreter.prototype.iterateActorIndex = function (param, callback) {
    //如果(参数 < 0 )
    if (param < 0) {
        //游戏队伍 成员组 对每一个(呼叫返回)
        $gameParty.members().forEach(callback);
        //否则
    } else {
        //角色 = 游戏队伍 成员组[参数]
        var actor = $gameParty.members()[param];
        //如果 (角色)
        if (actor) {
            //呼叫返回(角色)
            callback(actor);
        }
    }
};
/**迭代敌人索引*/
Game_Interpreter.prototype.iterateEnemyIndex = function (param, callback) {
    //如果 (参数 < 0)
    if (param < 0) {
        //游戏敌群 成员组 对每一个(呼叫返回)
        $gameTroop.members().forEach(callback);
        //否则
    } else {
        //敌人 = 游戏敌群 成员组[参数]
        var enemy = $gameTroop.members()[param];
        //如果 (敌人)
        if (enemy) {
            //呼叫返回(敌人)
            callback(enemy);
        }
    }
};
/**迭代战斗者*/
Game_Interpreter.prototype.iterateBattler = function (param1, param2, callback) {
    //如果(游戏队伍 在战斗() )
    if ($gameParty.inBattle()) {
        //如果(参数1 === 0)
        if (param1 === 0) {
            //迭代敌人索引(参数2,呼叫返回)
            this.iterateEnemyIndex(param2, callback);
            //否则
        } else {
            //迭代角色id(参数2 ,呼叫返回)
            this.iterateActorId(param2, callback);
        }
    }
};
/**人物*/
Game_Interpreter.prototype.character = function (param) {
    //如果(游戏队伍 在战斗() )
    if ($gameParty.inBattle()) {
        //返回 null
        return null;
        //否则 如果 (参数 < 0)
    } else if (param < 0) {
        //返回 游戏游戏者
        return $gamePlayer;
        //否则 如果( 是在当前地图() )
    } else if (this.isOnCurrentMap()) {
        //返回 游戏地图 事件(  参数>0 ? 参数 : 事件id )
        return $gameMap.event(param > 0 ? param : this._eventId);
        //否则
    } else {
        //返回 null
        return null;
    }
};
/**操作数值*/
Game_Interpreter.prototype.operateValue = function (operation, operandType, operand) {
    //值  = 操作种类 === 0 ? 操作数 : 游戏变量组 值(操作数) 
    var value = operandType === 0 ? operand : $gameVariables.value(operand);
    //返回  运算 === 0 ? 值 : -值
    return operation === 0 ? value : -value;
};
/**改变hp*/
Game_Interpreter.prototype.changeHp = function (target, value, allowDeath) {
    //如果(目标 是活的() )
    if (target.isAlive()) {
        //如果 ( 不是 允许死亡 并且 目标 hp <= -值  )
        if (!allowDeath && target.hp <= -value) {
            //值 = 1 - 目标 hp
            value = 1 - target.hp;
        }
        //目标 获得hp(值)
        target.gainHp(value);
        //如果(目标 是死的() )
        if (target.isDead()) {
            //目标 表现死亡()
            target.performCollapse();
        }
    }
};

/** Show Text 显示文本*/
Game_Interpreter.prototype.command101 = function () {
    //如果(不是 游戏消息 是忙碌的() )
    if (!$gameMessage.isBusy()) {
        //游戏消息 设置脸图(参数组[0],参数组[1])
        $gameMessage.setFaceImage(this._params[0], this._params[1]);
        //游戏消息 设置背景(参数组[2])
        $gameMessage.setBackground(this._params[2]);
        //游戏消息 设置位置种类(参数组[3])
        $gameMessage.setPositionType(this._params[3]);
        //当(下一个事件编码() === 401 )
        while (this.nextEventCode() === 401) {  // Text data 文本数据
            //索引++
            this._index++;
            //游戏消息 添加(当前命令() 参数组[0])
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        //检查 (下一个事件编码() )
        switch (this.nextEventCode()) {
            //当 102
            case 102:  // Show Choices 显示选项
                //索引++
                this._index++;
                //安装选择组(当前命令() 参数组)
                this.setupChoices(this.currentCommand().parameters);
                //中断
                break;
            //当 103
            case 103:  // Input Number 输入数字
                //索引++
                this._index++;
                //安装数字输入(当前命令() 参数组)
                this.setupNumInput(this.currentCommand().parameters);
                //中断
                break;
            //当 104
            case 104:  // Select Item 选择物品
                //索引++
                this._index++;
                //安装物品选择(当前命令() 参数组)
                this.setupItemChoice(this.currentCommand().parameters);
                //中断
                break;
        }
        //索引++
        this._index++;
        //设置等待模式("message"//消息 )
        this.setWaitMode('message');
    }
    //返回 false
    return false;
};

/** Show Choices 显示选择*/
Game_Interpreter.prototype.command102 = function () {
    //如果(不是 游戏消息 是忙碌的() )
    if (!$gameMessage.isBusy()) {
        //安装选择组(参数组)
        this.setupChoices(this._params);
        //索引++
        this._index++;
        //设置等待模式("message"//消息 )
        this.setWaitMode('message');
    }
    //返回 false
    return false;
};
/**安装选择组*/
Game_Interpreter.prototype.setupChoices = function (params) {
    //选择组 = 参数组[0] 克隆()
    var choices = params[0].clone();
    //取消种类 = 参数组[1]
    var cancelType = params[1];
    //默认种类 = 参数组 长度 > 2  ? 参数组[2] : 0
    var defaultType = params.length > 2 ? params[2] : 0;
    //位置种类 =  参数组 长度 > 3  ? 参数组[3] : 2
    var positionType = params.length > 3 ? params[3] : 2;
    //背景 =  参数组 长度 > 4  ? 参数组[4] : 0
    var background = params.length > 4 ? params[4] : 0;
    //如果(取消种类 >= 选择组 长度 )
    if (cancelType >= choices.length) {
        //取消种类 = -2
        cancelType = -2;
    }
    //游戏消息 设置选择组 (选择组 ,默认种类 , 取消种类 )
    $gameMessage.setChoices(choices, defaultType, cancelType);
    //游戏消息 设置选择背景 (背景)
    $gameMessage.setChoiceBackground(background);
    //游戏消息 设置选择位置种类 (位置种类)
    $gameMessage.setChoicePositionType(positionType);
    //游戏消息 设置选择呼回  方法(n)
    $gameMessage.setChoiceCallback(function (n) {
        //分支[缩进] = n
        this._branch[this._indent] = n;
        //绑定(this) )
    }.bind(this));
};

/** When [**] 当*/
Game_Interpreter.prototype.command402 = function () {
    //如果 (分支[缩进] !== 参数组[0])
    if (this._branch[this._indent] !== this._params[0]) {
        //跳分支()
        this.skipBranch();
    }
    //返回 true
    return true;
};

/** When Cancel  当取消*/
Game_Interpreter.prototype.command403 = function () {
    //如果 (分支[缩进] >= 0 )
    if (this._branch[this._indent] >= 0) {
        //跳分支()
        this.skipBranch();
    }
    //返回 true
    return true;
};

/** Input Number 输入数字*/
Game_Interpreter.prototype.command103 = function () {
    //如果(不是 游戏消息 是忙碌的() )
    if (!$gameMessage.isBusy()) {
        //安装数字输入(参数组)
        this.setupNumInput(this._params);
        //索引++
        this._index++;
        //设置等待模式("message"//消息 )
        this.setWaitMode('message');
    }
    //返回 false
    return false;
};
/**安装数字输入*/
Game_Interpreter.prototype.setupNumInput = function (params) {
    //游戏消息 设置数字输入(参数组[0] ,参数组[1] )
    $gameMessage.setNumberInput(params[0], params[1]);
};

/** Select Item 选择物品*/
Game_Interpreter.prototype.command104 = function () {
    //如果(不是 游戏消息 是忙碌的() )
    if (!$gameMessage.isBusy()) {
        //安装物品选择(参数组)
        this.setupItemChoice(this._params);
        //索引++
        this._index++;
        //设置等待模式("message"//消息 )
        this.setWaitMode('message');
    }
    //返回 false 
    return false;
};
/**安装物品选择*/
Game_Interpreter.prototype.setupItemChoice = function (params) {
    //游戏消息 设置物品选择(参数组[0] ,参数组[1] 或者 2)
    $gameMessage.setItemChoice(params[0], params[1] || 2);
};

/** Show Scrolling Text 显示滚动文本*/
Game_Interpreter.prototype.command105 = function () {
    //如果(不是 游戏消息 是忙碌的() )
    if (!$gameMessage.isBusy()) {
        //游戏消息 设置滚动( 参数组[0],参数组[1] )
        $gameMessage.setScroll(this._params[0], this._params[1]);
        //当(下一个事件编码() === 405 )
        while (this.nextEventCode() === 405) {
            //索引++
            this._index++;
            //游戏消息 添加(当前命令() 参数组[0] )
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        //索引++
        this._index++;
        //设置等待模式("message"//消息 )
        this.setWaitMode('message');
    }
    //返回 false
    return false;
};

/** Comment 注释*/
Game_Interpreter.prototype.command108 = function () {
    //注释 = [参数组[0]]
    this._comments = [this._params[0]];
    //当 (下一个事件编码() == 408 )
    while (this.nextEventCode() === 408) {
        //索引++
        this._index++;
        //注释 添加 (当前命令() 参数组[0] )
        this._comments.push(this.currentCommand().parameters[0]);
    }
    //返回 true
    return true;
};

/** Conditional Branch  条件分歧*/
Game_Interpreter.prototype.change111 = function () {

    var jscode = "if ("


    //结果 = false
    var result = false;
    //检查(参数组[0] )
    switch (this._params[0]) {
        //当 0
        case 0:  // Switch 开关 

            jscode += "$gameSwitches.value(" + this._params[1] + ")" + "=== " + (this._params[2] === 0)


            break;
        //当 1
        case 1:  // Variable 变量

            //值1 = 游戏变量组 值(参数组[1]) 
            var jscode1 = "$gameVariables.value(" + this._params[1] + ")";

            if (this._params[2] === 0) {


                var jscode2 = this._params[3];
            } else {

                var jscode2 = "$gameVariables.value(" + this._params[3] + ")"


            }
            //检查 (参数组[4] )
            switch (this._params[4]) {
                //当 0
                case 0:  // Equal to 等于
                    //结果 = ( 值1 === 值2 )
                    result = (value1 === value2);


                    jscode = jscode1 + " === " + jscode2
                    //中断
                    break;
                //当 1
                case 1:  // Greater than or Equal to  大于等于
                    //结果 = ( 值1 >= 值2 )
                    result = (value1 >= value2);


                    jscode = jscode1 + " >= " + jscode2
                    //中断
                    break;
                //当 2
                case 2:  // Less than or Equal to  小于等于
                    //结果 = ( 值1 <= 值2 )
                    result = (value1 <= value2);


                    jscode = jscode1 + " <= " + jscode2
                    //中断
                    break;
                //当 3
                case 3:  // Greater than  大于
                    //结果 = ( 值1 > 值2 )
                    result = (value1 > value2);


                    jscode = jscode1 + " > " + jscode2
                    //中断
                    break;
                //当 4
                case 4:  // Less than  小于
                    //结果 = ( 值1 < 值2 )
                    result = (value1 < value2);


                    jscode = jscode1 + " < " + jscode2
                    //中断
                    break;
                //当 5
                case 5:  // Not Equal to  不等于
                    //结果 = ( 值1 !== 值2 )
                    result = (value1 !== value2);


                    jscode = jscode1 + " !== " + jscode2
                    //中断
                    break;
            }
            //中断
            break;
        //当 2
        case 2:  // Self Switch 独立开关
            //如果(事件id > 0)
            if (this._eventId > 0) {
                //键 = [地图id,事件id, 参数组[1] ]
                var key = [this._mapId, this._eventId, this._params[1]];

                jscode = "$gameSelfSwitches.value(" + "[this._mapId, this._eventId," + '"' + this._params[1] + '"' + "]) " + " === " + (this._params[2] === 0)

            }
            //中断
            break;
        //当 3
        case 3:  // Timer  计时器


            jscode += "$gameTimer.isWorking() &&  "




            //如果 (游戏计时 是工作中() )
            if ($gameTimer.isWorking()) {
                //如果(参数组[2] === 0 )
                if (this._params[2] === 0) {
                    //结果 = (游戏计时 秒() >= 参数组[1])
                    result = ($gameTimer.seconds() >= this._params[1]);

                    jscode += " ($gameTimer.seconds() >=" + this._params[1] + ")"
                    //否则
                } else {
                    //结果 = (游戏计时 秒() <= 参数组[1])
                    result = ($gameTimer.seconds() <= this._params[1]);

                    jscode += " ($gameTimer.seconds() <=" + this._params[1] + ")"
                }
            }
            //中断
            break;
        //当 4
        case 4:  // Actor 角色
            //角色 = 游戏角色组 角色( 参数组[1] )
            var actor = $gameActors.actor(this._params[1]);

            var jscode1 = "$gameActors.actor(" + this._params[1] + ")"

            jscode += jscode1 + "&&"
            //n = 参数组[3]
            var n = this._params[3];
            //检查 ( 参数组[2] )
            switch (this._params[2]) {
                //当 0
                case 0:  // In the Party  在队伍
                    //结果 = 游戏队伍 成员组 包含(角色)

                    jscode += " $gameParty.members().contains(" + jscode1 + ")"
                    //中断
                    break;
                //当 1
                case 1:  // Name 名称
                    //结果 = (角色 名称() === n )

                    jscode += jscode1 + ".name()" + " === " + n
                    //中断
                    break;
                //当 0
                case 2:  // Class 职业
                    //结果 = 角色 是职业(数据职业组[n])

                    jscode += jscode1 + ".isClass($dataClasses[" + n + "])"



                    //中断
                    break;
                //当 0
                case 3:  // Skill 技能
                    //结果 = 角色 有技能(n)

                    jscode += jscode1 + ".hasSkill( " + n + ")"
                    //中断
                    break;
                //当 0
                case 4:  // Weapon 武器
                    //结果 = 角色 有武器( 数据武器组[n] )
                    jscode += jscode1 + ".hasWeapon($dataWeapons[" + n + "])"
                    //中断
                    break;
                //当 0
                case 5:  // Armor 防具
                    //结果 = 角色 有防具( 数据防具组[n] )
                    jscode += jscode1 + ".hasArmor($dataArmors[" + n + "])"
                    //中断
                    break;
                //当 0
                case 6:  // State 状态
                    //结果 = 角色 是状态影响(n)
                    jscode += jscode1 + ".isStateAffected( " + n + ")"
                    //中断
                    break;
            }
            //中断
            break;
        //当 5
        case 5:  // Enemy 敌人
            //敌人 = 游戏敌群 成员组() [ 参数组[1] ]
            var enemy = $gameTroop.members()[this._params[1]];


            var jscode1 = "$gameTroop.members()[" + this._params[1] + "]"
            jscode += jscode1 + "&&"
            //如果 (敌人)
            //检查(参数组[2])
            switch (this._params[2]) {
                //当 0
                case 0:  // Appeared 出现

                    //结果 = 敌人 是活的()

                    jscode += jscode1 + ".isAlive()"

                    //中断
                    break;
                //当 1
                case 1:  // State 状态
                    //结果 = 敌人 是状态影响( 参数组[3] )
                    jscode += jscode1 + ".isStateAffected( " + this._params[3] + ")"
                    //中断
                    break;
            }
            //中断
            break;
        //当 6
        case 6:  // Character 人物
            //人物 = 人物( 参数组[1] )

            var jscode1 = "this.character(" + this._params[1] + ")"


            jscode += jscode1 + "&&"
            //结果 = (人物 方向() === 参数组[2] ) 
            jscode += jscode1 + ".direction()" + "===" + this._params[2]
            //中断
            break;
        //当 7
        case 7:  // Gold 金钱
            //检查 (参数组[2])
            switch (this._params[2]) {
                //当 0
                case 0:  // Greater than or equal to 大于等于
                    //结果 = (游戏队伍 金钱() >= 参数组[1] )


                    jscode += "$gameParty.gold() >= " + this._params[1]
                    //中断
                    break;
                //当 1
                case 1:  // Less than or equal to 小于等于
                    //结果 = (游戏队伍 金钱() <= 参数组[1] ) 
                    jscode += "$gameParty.gold() <= " + this._params[1]
                    //中断
                    break;
                //当 2
                case 2:  // Less than 小于
                    //结果 = (游戏队伍 金钱() < 参数组[1] ) 
                    jscode += "$gameParty.gold() < " + this._params[1]
                    //中断
                    break;
            }
            //中断
            break;
        //当 8
        case 8:  // Item 物品
            //结果 = 游戏队伍 有项目(数据物品组[ 参数组[1] ] ) 

            jscode += "$gameParty.hasItem($dataItems[" + this._params[1] + "])"
            //中断
            break;
        //当 9
        case 9:  // Weapon 武器
            //结果 = 游戏队伍 有项目(数据武器组[ 参数组[1] ] )
            jscode += "$gameParty.hasItem($dataWeapons[" + this._params[1] + "]," + this._params[2] + ")"
            //中断
            break;
        //当 10
        case 10:  // Armor 防具
            //结果 = 游戏队伍 有项目(数据防具组[ 参数组[1] ] )
            jscode += "$gameParty.hasItem($dataArmors[" + this._params[1] + "]," + this._params[2] + ")"
            //中断
            break;
        //当 11
        case 11:  // Button 按键
            //结果 = 输入 是按下( 参数组[1] )
            jscode += "Input.isPressed(" + this._params[1] + ")"
            //中断
            break;
        //当 12
        case 12:  // Script 脚本
            //结果 = !!运行(参数组[1] )
            jscode += "!!eval(" + '"' + this._params[1] + '"' + ")"
            //中断
            break;
        //当 13
        case 13:  // Vehicle 交通工具
            //结果 = (游戏游戏者 交通工具() === 游戏地图 交通工具(参数[1])  ) 
            jscode += "$gamePlayer.vehicle() === $gameMap.vehicle(" + this._params[1] + ")"
            //中断
            break;
    }

    jscode += ") {"
    //返回 true
    this.console(jscode)
    return true;
};

/** Else 其他的*/
Game_Interpreter.prototype.change411 = function () {


    var jscode = "} else { ";
    //返回 true
    this.console(jscode)
    return true;
};


/** Repeat Above 重复上述*/
Game_Interpreter.prototype.change412 = function () {
    var jscode = "} ";

    this.console(jscode)
    return true;
};

/** Loop 循环*/
Game_Interpreter.prototype.change112 = function () {


    var jscode = "while{";

    //返回 true
    this.console(jscode)
    return true;
};

/** Repeat Above 重复上述*/
Game_Interpreter.prototype.change413 = function () {
    var jscode = "} ";

    this.console(jscode)
    return true;
};

/** Break Loop 断开循环*/
Game_Interpreter.prototype.change113 = function () {

    var jscode = " break ";

    //返回 true 
    this.console(jscode)
    return true;
};

/** Exit Event Processing 退出事件处理*/
Game_Interpreter.prototype.change115 = function () {

    var jscode = " this._index = this._list.length ";


    //返回 true
    this.console(jscode)
    return true;
};

/** Common Event 公共事件*/
Game_Interpreter.prototype.command117 = function () {
    //公共事件 = 数据公共事件组[参数组[0]]
    var commonEvent = $dataCommonEvents[this._params[0]];

    if (commonEvent) {

        var eventId = this.isOnCurrentMap() ? this._eventId : 0;

        this.setupChild(commonEvent.list, eventId);
    }


    return true;
};
/**安装子项*/
Game_Interpreter.prototype.setupChild = function (list, eventId) {
    //子事件解释器 = 新 游戏事件解释器 (深度 + 1)
    this._childInterpreter = new Game_Interpreter(this._depth + 1);
    //子事件解释器 安装(列表, 事件id)
    this._childInterpreter.setup(list, eventId);
};

/** Label 标签*/
Game_Interpreter.prototype.command118 = function () {
    //返回 true 
    return true;
};

/** Jump to Label 跳到标签*/
Game_Interpreter.prototype.command119 = function () {
    //标签名 = 参数[0]
    var labelName = this._params[0];
    //循环 (开始时 i = 0; 当 i < 列表 长度 ;每一次 i++)
    for (var i = 0; i < this._list.length; i++) {
        //命令 = 列表[i]
        var command = this._list[i];
        //如果 (命令 编码 === 118 并且 命令 参数[0] == 标签名)
        if (command.code === 118 && command.parameters[0] === labelName) {
            //跳到(i)
            this.jumpTo(i);
            //返回
            return;
        }
    }
    //返回 true
    return true;
};
/**跳到*/
Game_Interpreter.prototype.jumpTo = function (index) {
    //最后索引 = 索引
    var lastIndex = this._index;
    //开始索引 = 数学 最小值( 索引 , 最后索引 )
    var startIndex = Math.min(index, lastIndex);
    //结束索引 = 数学 最大值( 索引 , 最后索引     )
    var endIndex = Math.max(index, lastIndex);
    //缩进 = 缩进
    var indent = this._indent;
    //循环 (开始时 i = 开始索引 ; 当 i <= 结束索引 时 ; i++)
    for (var i = startIndex; i <= endIndex; i++) {
        //新缩进 = 列表[i] 缩进
        var newIndent = this._list[i].indent;
        //如果( 新缩进 !== 缩进)
        if (newIndent !== indent) {
            //分支[缩进] = null 
            this._branch[indent] = null;
            //缩进 = 新缩进
            indent = newIndent;
        }
    }
    //索引 =  索引
    this._index = index;
};

/** Control Switches 操作开关*/
Game_Interpreter.prototype.change121 = function () {


    var jscode = " for (var i = " + this._params[0] + "; i <=" + this._params[1] + "; i++) {" + "$gameSwitches.setValue(i," + (this._params[2] === 0) + ")}";

    //返回 true
    this.console(jscode)
    return true;
};

/** Control Variables 操作变量*/
Game_Interpreter.prototype.change122 = function () {
    //值 = 0 
    var value = 0;
    var jscode = ""
    //检查 (参数组[3] )
    switch (this._params[3]) {  // Operand 操作数
        //当 0
        case 0:  // Constant 常数
            //值 = 参数组[4] 
            var jscode1 = this._params[4]
            //中断
            break;
        //当 1
        case 1:  // Variable 变量
            //值 = 游戏变量组 值( 参数组[4] ) 
            var jscode1 = "$gameVariables.value(" + this._params[4] + ")"
            //中断
            break;
        //当 2
        case 2:  // Random 随机数
            //值 = 参数组[4] + 数学 随机整数 (参数组[5] - 参数组[4] +1 )

            for (var i = this._params[0]; i <= this._params[1]; i++) {
                jscode += "this.operateVariable(" + i + ", " + this._params[2] + "," + this._params[4] + "+ Math.randomInt(" + this._params[5] - this._params[4] + 1 + "))";
            }
            return true;
            //中断
            break;
        //当 2
        case 3:  // Game Data 游戏数据 
            var jscode1 = "this.gameDataOperand(" + this._params[4] + "," + this._params[5] + "," + this._params[6] + ")";
            //中断
            break;
        //当 4
        case 4:  // Script 脚本 
            var jscode1 = "eval(" + this._params[4] + ")";
            //中断
            break;
    }
    //循环 (开始时 i = 参数组[0] ; 当 i <= 参数组[1] ; i++)
    for (var i = this._params[0]; i <= this._params[1]; i++) {
        jscode += "var value = " + jscode1 + ";this.operateVariable(" + i + "," + this._params[2] + ", value)";
    }
    //返回 true
    this.console(jscode)
    return true;
};
/**游戏数据*/
Game_Interpreter.prototype.gameDataOperand = function (type, param1, param2) {
    //检查 (种类)
    switch (type) {
        //当 0 
        case 0:  // Item 物品
            //返回 游戏队伍 物品数字(数据物品组[参数1])
            return $gameParty.numItems($dataItems[param1]);
        //当 1
        case 1:  // Weapon 武器
            //返回 游戏队伍 物品数字(数据武器组[参数1])
            return $gameParty.numItems($dataWeapons[param1]);
        //当 2
        case 2:  // Armor 防具
            //返回 游戏队伍 物品数字(数据防具组[参数1])
            return $gameParty.numItems($dataArmors[param1]);
        //当 3
        case 3:  // Actor 角色
            //角色 = 游戏角色组 角色(参数1)
            var actor = $gameActors.actor(param1);
            //如果 (角色)
            if (actor) {
                //检查 (参数2)
                switch (param2) {
                    //当 0 
                    case 0:  // Level 等级
                        //返回 角色 等级
                        return actor.level;
                    //当 1
                    case 1:  // EXP 经验值
                        //返回 角色 当前经验值()
                        return actor.currentExp();
                    //当 2
                    case 2:  // HP
                        //返回 角色 hp
                        return actor.hp;
                    //当 3
                    case 3:  // MP
                        //返回 角色 mp
                        return actor.mp;
                    //缺省
                    default:    // Parameter
                        //如果 (参数2 >=4 并且 参数2 <= 11)
                        if (param2 >= 4 && param2 <= 11) {
                            //返回 角色 参数(参数2 - 4)
                            return actor.param(param2 - 4);
                        }
                }
            }
            //中断
            break;
        //当 4
        case 4:  // Enemy 敌人
            //敌人 = 游戏敌群 成员组() [参数1]
            var enemy = $gameTroop.members()[param1];
            //如果(敌人)
            if (enemy) {
                //检查(参数2)
                switch (param2) {
                    //当 0
                    case 0:  // HP
                        //返回 敌人 hp
                        return enemy.hp;
                    //当 0
                    case 1:  // MP
                        //返回 敌人 mp
                        return enemy.mp;
                    default:    // Parameter 参数
                        //如果 (参数2 >=2 并且 参数2 <= 9)
                        if (param2 >= 2 && param2 <= 9) {
                            //返回 敌人 参数(参数2 - 4)
                            return enemy.param(param2 - 2);
                        }
                }
            }
            //中断
            break;
        //当 5
        case 5:  // Character  人物
            //人物 = 人物(参数1)
            var character = this.character(param1);
            //如果(人物)
            if (character) {
                //检查 (参数2)
                switch (param2) {
                    //当 0
                    case 0:  // Map X 地图x
                        //返回 人物 x
                        return character.x;
                    //当 1
                    case 1:  // Map Y 地图x
                        //返回 人物 y
                        return character.y;
                    //当 2
                    case 2:  // Direction 方向
                        //返回 人物 方向()
                        return character.direction();
                    //当 3
                    case 3:  // Screen X 画面x
                        //返回 人物 画面x()
                        return character.screenX();
                    //当 4
                    case 4:  // Screen Y 画面y
                        //返回 人物 画面y()
                        return character.screenY();
                }
            }
            //中断
            break;
        //当 6
        case 6:  // Party 队伍
            //角色 = 游戏队伍 成员组() [参数1]
            actor = $gameParty.members()[param1];
            //返回  角色 ? 角色id : 0
            return actor ? actor.actorId() : 0;
        //当 7
        case 7:  // Other 其他
            //检查(参数1)
            switch (param1) {
                //当 0
                case 0:  // Map ID 地图id
                    //返回 游戏地图 地图id()
                    return $gameMap.mapId();
                //当 1
                case 1:  // Party Members 队伍成员数
                    //返回 游戏队伍 大小()
                    return $gameParty.size();
                //当 2
                case 2:  // Gold  金钱
                    //返回 游戏队伍 金钱()
                    return $gameParty.gold();
                //当 3
                case 3:  // Steps 步数
                    //返回 游戏队伍 步数()
                    return $gameParty.steps();
                //当 4
                case 4:  // Play Time 游戏时间
                    //返回 游戏系统 游戏时间()
                    return $gameSystem.playtime();
                //当 5
                case 5:  // Timer 计时器
                    //返回 游戏计时 秒()
                    return $gameTimer.seconds();
                //当 6
                case 6:  // Save Count 保存计数
                    //返回 游戏系统 保存计数()
                    return $gameSystem.saveCount();
                //当 7
                case 7:  // Battle Count 战斗计数
                    //返回 游戏系统 战斗计数()
                    return $gameSystem.battleCount();
                //当 8
                case 8:  // Win Count 胜利计数
                    //返回 游戏系统 胜利计数()
                    return $gameSystem.winCount();
                //当 9
                case 9:  // Escape Count 逃跑次数
                    //返回 游戏系统 逃跑次数()
                    return $gameSystem.escapeCount();
            }
            //中断
            break;
    }
    //返回 0
    return 0;
};
/**操作变量*/
Game_Interpreter.prototype.operateVariable = function (variableId, operationType, value) {
    //测试
    try {
        //旧值 = 游戏变量组 值(变量id)
        var oldValue = $gameVariables.value(variableId);
        //检查 (操作种类)
        switch (operationType) {
            //当 0
            case 0:  // Set 设置
                //游戏变量组 设置值(变量id, 旧值 = 值 )
                $gameVariables.setValue(variableId, oldValue = value);
                //中断
                break;
            //当 1
            case 1:  // Add 加
                //游戏变量组 设置值(变量id, 旧值 + 值 )
                $gameVariables.setValue(variableId, oldValue + value);
                //中断
                break;
            //当 2
            case 2:  // Sub 减
                //游戏变量组 设置值(变量id, 旧值 - 值 )
                $gameVariables.setValue(variableId, oldValue - value);
                //中断
                break;
            //当 3
            case 3:  // Mul 乘
                //游戏变量组 设置值(变量id, 旧值 * 值 )
                $gameVariables.setValue(variableId, oldValue * value);
                //中断
                break;
            //当 4
            case 4:  // Div 除
                //游戏变量组 设置值(变量id, 旧值 / 值 )
                $gameVariables.setValue(variableId, oldValue / value);
                //中断
                break;
            //当 5
            case 5:  // Mod 求余
                //游戏变量组 设置值(变量id, 旧值 % 值 )
                $gameVariables.setValue(variableId, oldValue % value);
                //中断
                break;
        }
        //如果错误(e)
    } catch (e) {
        //游戏变量组 设置值(变量id, 0)
        $gameVariables.setValue(variableId, 0);
    }
};

/** Control Self Switch 操作独立开关*/
Game_Interpreter.prototype.change123 = function () {

    var jscode = "this._eventId > 0 && $gameSelfSwitches.value(" + "[this._mapId, this._eventId," + '"' + this._params[0] + '"' + "]) " + " === " + (this._params[1] === 0)
    //返回 true
    this.console(jscode)
    return true;
};

/** Control Timer 操作计时器*/
Game_Interpreter.prototype.change124 = function () {
    if (this._params[0] === 0) {
        var jscode = "$gameTimer.start(" + this._params[1] + " * 60)"

    } else {
        var jscode = "$gameTimer.stop() "

    }
    //返回 true
    this.console(jscode)
    return true;
};

/** Change Gold 改变金钱*/
Game_Interpreter.prototype.change125 = function () {
    //值 = 操作数值(参数组[0] ,参数组[1],参数组[2] )
    var jscode1 = " this.operateValue(" + this._params[0] + "," + this._params[1] + "," + this._params[2] + ")";
    //游戏队伍 获得金钱(值)

    var jscode = " $gameParty.gainGold(" + jscode1 + ")"

    //返回 true
    this.console(jscode)
    return true;
};

/** Change Items 改变物品*/
Game_Interpreter.prototype.change126 = function () {


    var jscode1 = " this.operateValue(" + this._params[1] + "," + this._params[2] + "," + this._params[3] + ")";

    var jscode = "$gameParty.gainItem($dataItems[" + this._params[0] + "] ," + jscode1 + ")"

    //返回 true
    this.console(jscode)
    return true;
};

/** Change Weapons 改变武器*/
Game_Interpreter.prototype.change127 = function () {

    var jscode1 = " this.operateValue(" + this._params[1] + "," + this._params[2] + "," + this._params[3] + ")";


    var jscode = "$gameParty.gainItem($dataWeapons[" + this._params[0] + "] ," + jscode1 + "," + this._params[4] + ")"
    //返回 true
    this.console(jscode)
    return true;
};

/** Change Armors 改变防具*/
Game_Interpreter.prototype.change128 = function () {
    var jscode1 = " this.operateValue(" + this._params[1] + "," + this._params[2] + "," + this._params[3] + ")";

    var jscode = "$gameParty.gainItem($dataArmors[" + this._params[0] + "] ," + jscode1 + "," + this._params[4] + ")"

    //返回 true
    this.console(jscode)
    return true;
};

/** Change Party Member 改变队伍成员*/
Game_Interpreter.prototype.change129 = function () {

    var jscode1 = " $gameActors.actor(" + this._params[0] + ")"

    var jscode = "if(" + jscode1 + "){"

    //如果 (参数组[1] === 0 )
    if (this._params[1] === 0) {  // Add 增加
        //如果 ( 参数组[2] )
        if (this._params[2]) {   // Initialize 初始化
            //游戏角色组 角色( 参数组[0] 安装(参数组[0]) )
            jscode += "$gameActors.actor(" + this._params[0] + ").setup(" + this._params[0] + ");";
        }
        //游戏队伍 增加角色( 参数组[0] )
        jscode += "$gameParty.addActor(" + this._params[0] + ") ";
    } else {  // Remove 移除
        //游戏队伍 移除角色( 参数组[0] )
        jscode += "$gameParty.removeActor(" + this._params[0] + ")";
    }

    jscode += "}"
    //返回 true
    this.console(jscode)
    return true;
};

/** Change Battle BGM 改变战斗bgm*/
Game_Interpreter.prototype.change132 = function () {
    //游戏系统 设置战斗bgm( 参数组[0] ) 
    var jscode = " $gameSystem.setBattleBgm(" + this._params[0] + ")"

    //返回 true
    this.console(jscode)
    return true;
};

/** Change Victory ME 改变胜利me*/
Game_Interpreter.prototype.change133 = function () {
    var jscode = " $gameSystem.setVictoryMe(" + this._params[0] + ")"
    //返回 true
    this.console(jscode)
    return true;
};

/** Change Save Access 改变存档设置*/
Game_Interpreter.prototype.change134 = function () {
    //如果(参数组[0] === 0 )
    if (this._params[0] === 0) {


        var jscode = "$gameSystem.disableSave()"

    } else {
        var jscode = "$gameSystem.enableSave()"

    }
    //返回 true
    this.console(jscode)
    return true;
};

/** Change Menu Access 改变菜单设置*/
Game_Interpreter.prototype.change135 = function () {
    //如果(参数组[0] === 0 )
    if (this._params[0] === 0) {
        var jscode = "$gameSystem.disableMenu()"
        //否则
    } else {
        var jscode = "$gameSystem.enableMenu()"
    }
    //返回 true
    this.console(jscode)
    return true;
};

/** Change Encounter Disable 改变遇敌设置*/
Game_Interpreter.prototype.change136 = function () {
    if (this._params[0] === 0) {
        var jscode = "$gameSystem.disableEncounter()"
    } else {
        var jscode = "$gameSystem.enableEncounter()"
    }
    jscode += ";$gamePlayer.makeEncounterCount()"
    //返回 true
    this.console(jscode)
    return true;
};

/** Change Formation Access 改变队伍设置*/
Game_Interpreter.prototype.change137 = function () {
    //如果(参数组[0] === 0 )
    if (this._params[0] === 0) {
        var jscode = "$gameSystem.disableFormation()"
    } else {
        var jscode = "$gameSystem.enableFormation()"
    }
    //返回 true
    this.console(jscode)
    return true;
};

/** Change Window Color 改变窗口颜色*/
Game_Interpreter.prototype.change138 = function () {
    var jscode = " $gameSystem.setWindowTone(" + this._params[0] + ")"

    this.console(jscode)
    return true;
};

/** Change Defeat ME 改变失败me*/
Game_Interpreter.prototype.change139 = function () {
    //游戏系统 设置失败me( 参数组[0] )
    var jscode = " $gameSystem.setDefeatMe(" + this._params[0] + ")"


    this.console(jscode)
    return true;
};

/** Change Vehicle BGM 改变交通工具bgm*/
Game_Interpreter.prototype.change140 = function () {


    var jscode1 = " $gameMap.vehicle(" + this._params[0] + ")"
    var jscode = jscode1 + " && " + jscode1 + ".setBgm(" + this._params[1] + ")"

    this.console(jscode)
    return true;
};

/** Transfer Player 传送游戏者*/
Game_Interpreter.prototype.command201 = function () {
    //如果( 不是 游戏队伍 在战斗() 并且 不是 游戏消息 是忙碌的() )
    if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
        //地图id  , x , y
        var mapId, x, y;
        //如果(参数组[0] === 0 )
        if (this._params[0] === 0) {  // Direct designation 直接指定
            //地图id = 参数组[1]
            mapId = this._params[1];
            //x = 参数组[2]
            x = this._params[2];
            //y = 参数组[3]
            y = this._params[3];
            //否则 
        } else {  // Designation with variables 变量指定
            //地图id = 游戏变量组 值( 参数组[1])
            mapId = $gameVariables.value(this._params[1]);
            //x = 游戏变量组 值( 参数组[2])
            x = $gameVariables.value(this._params[2]);
            //y = 游戏变量组 值( 参数组[3])
            y = $gameVariables.value(this._params[3]);
        }
        //游戏游戏者 预约传送(地图id , x , y ,参数组[4] ,参数组[5] )
        $gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
        //设置等待模式 ('transfer' //传送 )
        this.setWaitMode('transfer');
        //索引++
        this._index++;
    }
    //返回 false
    return false;
};

/** Set Vehicle Location 设置交通工具位置*/
Game_Interpreter.prototype.command202 = function () {
    //地图id  , x , y
    var mapId, x, y;
    //如果(参数组[1] === 0 )
    if (this._params[1] === 0) {  // Direct designation 直接指定
        //地图id = 参数组[2]
        mapId = this._params[2];
        //x = 参数组[3]
        x = this._params[3];
        //y = 参数组[4]
        y = this._params[4];
        //否则
    } else {  // Designation with variables 变量指定
        //地图id = 游戏变量组 值( 参数组[2])
        mapId = $gameVariables.value(this._params[2]);
        //x = 游戏变量组 值( 参数组[3])
        x = $gameVariables.value(this._params[3]);
        //y = 游戏变量组 值( 参数组[4])
        y = $gameVariables.value(this._params[4]);
    }
    //交通工具 = 游戏地图 交通工具(参数组[0])
    var vehicle = $gameMap.vehicle(this._params[0]);
    //如果(交通工具)
    if (vehicle) {
        //交通工具 设置位置(地图id ,x,y)
        vehicle.setLocation(mapId, x, y);
    }
    //返回 true
    return true;
};

/** Set Event Location 设置事件位置*/
Game_Interpreter.prototype.command203 = function () {
    //人物 = 人物(参数组[0])
    var character = this.character(this._params[0]);
    //如果(人物)
    if (character) {
        //如果(参数组[1] === 0 )
        if (this._params[1] === 0) {  // Direct designation 直接指定
            //人物 设于(参数组[2] ,参数组[3] )
            character.locate(this._params[2], this._params[3]);
            //否则 如果(参数组[1] === 1 )
        } else if (this._params[1] === 1) {  // Designation with variables 变量指定
            //x = 游戏变量组 值(参数组[2])
            var x = $gameVariables.value(this._params[2]);
            //y = 游戏变量组 值(参数组[3])
            var y = $gameVariables.value(this._params[3]);
            //人物 设于(x,y )
            character.locate(x, y);
            //否则 
        } else {  // Exchange with another event 和其他事件交换
            //人物2  = 人物( 参数组[2] )
            var character2 = this.character(this._params[2]);
            //如果 (人物2)
            if (character2) {
                //人物 交换(人物2)
                character.swap(character2);
            }
        }
        //如果(参数组[0] === 0 )
        if (this._params[4] > 0) {
            //人物 设置方向(参数组[4])
            character.setDirection(this._params[4]);
        }
    }
    //返回 true
    return true;
};

/** Scroll Map 滚动地图*/
Game_Interpreter.prototype.command204 = function () {
    //如果 (不是 游戏队伍 在战斗()  )
    if (!$gameParty.inBattle()) {
        //如果(游戏地图 是滚动中() )
        if ($gameMap.isScrolling()) {
            //设置等待模式 ( "scroll"//滚动  )
            this.setWaitMode('scroll');
            //返回 false
            return false;
        }
        //游戏地图 开始滚动(参数组[0],参数组[1],参数组[2])
        $gameMap.startScroll(this._params[0], this._params[1], this._params[2]);
    }
    //返回 true
    return true;
};

/** Set Movement Route 设置移动路线*/
Game_Interpreter.prototype.command205 = function () {
    //游戏地图 刷新如果需要()
    $gameMap.refreshIfNeeded();
    //人物 =  人物(参数组[0])
    this._character = this.character(this._params[0]);
    //如果(人物 )
    if (this._character) {
        //人物 强制移动路线(参数组[1])
        this._character.forceMoveRoute(this._params[1]);
        //如果(参数组[1] 等待)
        if (this._params[1].wait) {
            //设置等待模式 ("route"//路线 )
            this.setWaitMode('route');
        }
    }
    //返回 true
    return true;
};

/** Getting On and Off Vehicles 上下交通工具*/
Game_Interpreter.prototype.command206 = function () {
    //游戏游戏者 上下交通工具()
    $gamePlayer.getOnOffVehicle();
    //返回 true
    return true;
};

/** Change Transparency 改变透明度*/
Game_Interpreter.prototype.command211 = function () {
    //游戏游戏者 设置透明(参数组[0] === 0 )
    $gamePlayer.setTransparent(this._params[0] === 0);
    //返回 true
    return true;
};

/** Show Animation 显示动画*/
Game_Interpreter.prototype.command212 = function () {
    //人物 = 人物(参数组[0])
    this._character = this.character(this._params[0]);
    //如果(人物)
    if (this._character) {
        //人物 请求动画(参数组[1])
        this._character.requestAnimation(this._params[1]);
        //如果(参数组[2] )
        if (this._params[2]) {
            //设置等待模式 ("animation"//动画 )
            this.setWaitMode('animation');
        }
    }
    //返回 true
    return true;
};

/** Show Balloon Icon 显示气球图标*/
Game_Interpreter.prototype.command213 = function () {
    //人物 = 人物(参数组[0])
    this._character = this.character(this._params[0]);
    //如果(人物)
    if (this._character) {
        //人物 请求气球(参数组[1])
        this._character.requestBalloon(this._params[1]);
        //如果(参数组[2])
        if (this._params[2]) {
            //设置等待模式 ("balloon"//气球 )
            this.setWaitMode('balloon');
        }
    }
    //返回 true
    return true;
};

/** Erase Event 抹去事件*/
Game_Interpreter.prototype.command214 = function () {
    //如果( 是在当前地图() 并且 事件id > 0 )
    if (this.isOnCurrentMap() && this._eventId > 0) {
        //游戏地图 抹去事件(事件id)
        $gameMap.eraseEvent(this._eventId);
    }
    //返回 true
    return true;
};

/** Change Player Followers 改变游戏者从者*/
Game_Interpreter.prototype.command216 = function () {
    //如果(参数组[0] === 0 )
    if (this._params[0] === 0) {
        //游戏游戏者 显示从者()
        $gamePlayer.showFollowers();
        //否则
    } else {
        //游戏游戏者 隐藏从者()
        $gamePlayer.hideFollowers();
    }
    //游戏游戏者 刷新()
    $gamePlayer.refresh();
    //返回 true
    return true;
};

/** Gather Followers 集合从者*/
Game_Interpreter.prototype.command217 = function () {
    //如果( 不是 游戏队伍 在战斗() )
    if (!$gameParty.inBattle()) {
        //游戏游戏者 集合从者()
        $gamePlayer.gatherFollowers();
        //设置等待模式 ("gather"//集合 ) 
        this.setWaitMode('gather');
    }
    //返回 true
    return true;
};

/** Fadeout Screen 淡出屏幕*/
Game_Interpreter.prototype.command221 = function () {
    //如果 (不是　游戏消息　是忙碌的()　)　
    if (!$gameMessage.isBusy()) {
        //游戏画面 开始淡出(淡入速度)
        $gameScreen.startFadeOut(this.fadeSpeed());
        //等待(淡入速度)
        this.wait(this.fadeSpeed());
        //索引++
        this._index++;
    }
    //返回 false
    return false;
};

/** Fadein Screen 淡入屏幕*/
Game_Interpreter.prototype.command222 = function () {
    //如果 (不是　游戏消息　是忙碌的()　)　
    if (!$gameMessage.isBusy()) {
        //游戏画面 开始淡入(淡入速度)
        $gameScreen.startFadeIn(this.fadeSpeed());
        //等待(淡入速度)
        this.wait(this.fadeSpeed());
        //索引++
        this._index++;
    }
    //返回 false
    return false;
};

/** Tint Screen 屏幕色调*/
Game_Interpreter.prototype.command223 = function () {
    //游戏画面 开始着色(参数组[0],参数组[1] )
    $gameScreen.startTint(this._params[0], this._params[1]);
    //如果(参数组[2])
    if (this._params[2]) {
        //等待(参数组[1])
        this.wait(this._params[1]);
    }
    //返回 true
    return true;
};

/** Flash Screen 屏幕闪烁*/
Game_Interpreter.prototype.command224 = function () {
    //游戏画面 开始闪烁(参数组[0],参数组[1] )
    $gameScreen.startFlash(this._params[0], this._params[1]);
    //如果(参数组[2])
    if (this._params[2]) {
        //等待(参数组[1])
        this.wait(this._params[1]);
    }
    //返回 true
    return true;
};

/** Shake Screen 屏幕震动*/
Game_Interpreter.prototype.command225 = function () {
    //游戏画面 开始震动(参数组[0],参数组[1] ,参数组[2])
    $gameScreen.startShake(this._params[0], this._params[1], this._params[2]);
    //如果(参数组[3])
    if (this._params[3]) {
        //等待(参数组[2])
        this.wait(this._params[2]);
    }
    //返回 true
    return true;
};

/** Wait 等待*/
Game_Interpreter.prototype.command230 = function () {
    //等待(参数组[0])
    this.wait(this._params[0]);
    //返回 true
    return true;
};

/** Show Picture 显示图片*/
Game_Interpreter.prototype.command231 = function () {
    //x,y
    var x, y;
    //如果(参数组[3] === 0 )
    if (this._params[3] === 0) {  // Direct designation 直接指定 
        //x = 参数组[4]
        x = this._params[4];
        //y = 参数组[5]
        y = this._params[5];
        //否则
    } else {  // Designation with variables 变量指定
        //x = 游戏变量组 值(参数组[4])
        x = $gameVariables.value(this._params[4]);
        //y = 游戏变量组 值(参数组[5])
        y = $gameVariables.value(this._params[5]);
    }
    //游戏画面 显示图片(参数组[0],参数组[1],参数组[2],x,y,参数组[6],参数组[7],参数组[8],参数组[9])
    $gameScreen.showPicture(this._params[0], this._params[1], this._params[2],
        x, y, this._params[6], this._params[7], this._params[8], this._params[9]);
    //返回 true
    return true;
};

/** Move Picture 移动图片*/
Game_Interpreter.prototype.command232 = function () {
    //x,y
    var x, y;
    //如果(参数组[3] === 0 )
    if (this._params[3] === 0) {  // Direct designation 直接指定 
        //x = 参数组[4]
        x = this._params[4];
        //y = 参数组[5]
        y = this._params[5];
        //否则
    } else {  // Designation with variables
        //x = 游戏变量组 值(参数组[4])
        x = $gameVariables.value(this._params[4]);
        //y = 游戏变量组 值(参数组[5])
        y = $gameVariables.value(this._params[5]);
    }
    //游戏画面 移动图片(参数组[0],参数组[2],x,y,参数组[6],参数组[7],参数组[8],参数组[9],参数组[10])
    $gameScreen.movePicture(this._params[0], this._params[2], x, y, this._params[6],
        this._params[7], this._params[8], this._params[9], this._params[10]);
    //如果(参数组[11])
    if (this._params[11]) {
        //等待(参数组[10])
        this.wait(this._params[10]);
    }
    //返回 true
    return true;
};

/** Rotate Picture 旋转图片*/
Game_Interpreter.prototype.command233 = function () {
    //游戏画面 旋转图片(参数组[0],参数组[1])
    $gameScreen.rotatePicture(this._params[0], this._params[1]);
    //返回 true
    return true;
};

/** Tint Picture 图片色调*/
Game_Interpreter.prototype.command234 = function () {
    //游戏画面 着色图片(参数组[0],参数组[1],参数组[2])
    $gameScreen.tintPicture(this._params[0], this._params[1], this._params[2]);
    //如果(参数组[3])
    if (this._params[3]) {
        //等待(参数组[2])
        this.wait(this._params[2]);
    }
    //返回 true
    return true;
};

/** Erase Picture 抹去图片*/
Game_Interpreter.prototype.command235 = function () {
    //游戏画面 抹去图片(参数组[0])
    $gameScreen.erasePicture(this._params[0]);
    //返回 true
    return true;
};

/** Set Weather Effect 设置天气效果*/
Game_Interpreter.prototype.command236 = function () {
    //如果( 不是 游戏队伍 在战斗() )
    if (!$gameParty.inBattle()) {
        //游戏画面 改变天气(参数组[0],参数组[1],参数组[2])
        $gameScreen.changeWeather(this._params[0], this._params[1], this._params[2]);
        //如果(参数组[3])
        if (this._params[3]) {
            //等待(参数组[2])
            this.wait(this._params[2]);
        }
    }
    //返回 true
    return true;
};

/** Play BGM 播放bgm*/
Game_Interpreter.prototype.command241 = function () {
    //音频管理器 播放bgm(参数组[0])
    AudioManager.playBgm(this._params[0]);
    //返回 true
    return true;
};

/** Fadeout BGM 淡出bgm*/
Game_Interpreter.prototype.command242 = function () {
    //音频管理器 淡出bgm(参数组[0])
    AudioManager.fadeOutBgm(this._params[0]);
    //返回 true
    return true;
};

/** Save BGM 保存bgm*/
Game_Interpreter.prototype.command243 = function () {
    //音频管理器 保存bgm()
    $gameSystem.saveBgm();
    //返回 true
    return true;
};

/** Resume BGM 重播bgm*/
Game_Interpreter.prototype.command244 = function () {
    //音频管理器 重播bgm()
    $gameSystem.replayBgm();
    //返回 true
    return true;
};

/** Play BGS 播放bgs*/
Game_Interpreter.prototype.command245 = function () {
    //音频管理器 播放bgs(参数组[0])
    AudioManager.playBgs(this._params[0]);
    //返回 true
    return true;
};

/** Fadeout BGS 淡出bgs*/
Game_Interpreter.prototype.command246 = function () {
    //音频管理器 淡出bgs(参数组[0])
    AudioManager.fadeOutBgs(this._params[0]);
    //返回 true
    return true;
};

/** Play ME 播放me*/
Game_Interpreter.prototype.command249 = function () {
    //音频管理器 播放me(参数组[0])
    AudioManager.playMe(this._params[0]);
    //返回 true
    return true;
};

/** Play SE 播放se*/
Game_Interpreter.prototype.command250 = function () {
    //音频管理器 播放se(参数组[0])
    AudioManager.playSe(this._params[0]);
    //返回 true
    return true;
};

/** Stop SE 停止se*/
Game_Interpreter.prototype.command251 = function () {
    //音频管理器 停止se()
    AudioManager.stopSe();
    //返回 true
    return true;
};

/** Play Movie 播放影片*/
Game_Interpreter.prototype.command261 = function () {
    //如果(不是 游戏消息 是忙碌的() )
    if (!$gameMessage.isBusy()) {
        //名称 = 参数组[0]
        var name = this._params[0];
        //如果(名称 长度 > 0 )
        if (name.length > 0) {
            //提取 = 影片文件提取()
            var ext = this.videoFileExt();
            //图形 播放视频("movies" + 名称 + 提取)
            Graphics.playVideo('movies/' + name + ext);
            //设置等待模式 ("video"//视频 )
            this.setWaitMode('video');
        }
        //索引++
        this._index++;
    }
    //返回 false
    return false;
};
/**影片文件提取*/
Game_Interpreter.prototype.videoFileExt = function () {
    //如果(图形 能播放视频种类("video/webm") 并且 不是 公用程序 )
    if (Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice()) {
        //返回 ".webm"
        return '.webm';
        //否则
    } else {
        //返回 ".mp4"
        return '.mp4';
    }
};

/** Change Map Name Display 改变地图名称显示*/
Game_Interpreter.prototype.command281 = function () {
    //如果(参数组[0] === 0 )
    if (this._params[0] === 0) {
        //游戏地图 能够名称显示()
        $gameMap.enableNameDisplay();
        //否则
    } else {
        //游戏地图 禁止名称显示()
        $gameMap.disableNameDisplay();
    }
    //返回 true
    return true;
};

/** Change Tileset 改变图块设置*/
Game_Interpreter.prototype.command282 = function () {
    //图块设置 = 数据图块设置[参数组[0]]
    var tileset = $dataTilesets[this._params[0]];
    if (!this._imageReservationId) {
        this._imageReservationId = Utils.generateRuntimeId();
    }
    var allReady = tileset.tilesetNames.map(function (tilesetName) {
        return ImageManager.reserveTileset(tilesetName, 0, this._imageReservationId);
    }, this).every(function (bitmap) { return bitmap.isReady(); });

    if (allReady) {
        $gameMap.changeTileset(this._params[0]);
        ImageManager.releaseReservation(this._imageReservationId);
        this._imageReservationId = null;
        //返回 true
        return true;
        //否则
    } else {
        //返回 false
        return false;
    }
};

/** Change Battle Back 更改战斗背景*/
Game_Interpreter.prototype.command283 = function () {
    //游戏地图 改变战斗背景(参数组[0],参数组[1])
    $gameMap.changeBattleback(this._params[0], this._params[1]);
    //返回 true
    return true;
};

/** Change Parallax 更改远景图*/
Game_Interpreter.prototype.command284 = function () {
    //游戏地图 改变远景图(参数组[0], 参数组[1], 参数组[2], 参数组[3], 参数组[4])
    $gameMap.changeParallax(this._params[0], this._params[1],
        this._params[2], this._params[3], this._params[4]);
    //返回 true
    return true;
};

/** Get Location Info 获得位置消息*/
Game_Interpreter.prototype.change285 = function () {


    var jscode = ""
    var x, y, value; 
    if (this._params[2] === 0) {  // Direct designation 直接指定

        x  =   this._params[3]  
        y  =  this._params[4] 

    } else {  // Designation with variables 变量指定        
        //x = 游戏变量组 值( 参数组[3])

          x = "$gameVariables.value(" + this._params[3] +")"
          y = "$gameVariables.value(" + this._params[4] + ")" 

    }
    //检查(参数组[1])
    switch (this._params[1]) {
        //当 0 
        case 0:     // Terrain Tag 地区标签
            //值 = 游戏地图 地域标签(x,y) 
              value = "$gameMap.terrainTag( "+  x + "," +  y + ")"           
            break;
        //当 1
        case 1:     // Event ID 事件id
            //值 = 游戏地图 xy处事件id(x,y) 
              value = "$gameMap.eventIdXy( "+  x + "," +  y + ")" 
            //中断
            break;
        //当 2
        case 2:     // Tile ID (Layer 1) 图块id
        //当 3 
        case 3:     // Tile ID (Layer 2)
        //当 4 
        case 4:     // Tile ID (Layer 3)
        //当 5 
        case 5:     // Tile ID (Layer 4)
            //值 = 游戏地图 图块id(x,y,参数组[1] - 2 ) 
              value = "$gameMap.tileId( "+  x + "," +  y +","+ + this._params[1] - 2 + ")" 
           
            //中断
            break;
        //缺省
        default:    // Region ID 区域id   
              value = "$gameMap.regionId( "+  x + "," +  y + ")" 
              //中断
            break;
    }
    jscode += "$gameVariables.setValue( " + this._params[0] + "," + value + ")" 
    //返回 true

    this.console(jscode)
    return true;
};

/** Battle Processing 战斗处理*/
Game_Interpreter.prototype.command301 = function () {
    //如果( 不是 游戏队伍 在战斗() )
    if (!$gameParty.inBattle()) {
        //敌群id
        var troopId;
        //如果(参数组[0] === 0 )
        if (this._params[0] === 0) {  // Direct designation 直接指定
            //敌群id = 参数组[1]
            troopId = this._params[1];
            //否则 如果(参数组[0] === 1 )
        } else if (this._params[0] === 1) {  // Designation with a variable 变量指定
            //敌群id = 游戏变量组 值(参数组[1])
            troopId = $gameVariables.value(this._params[1]);
            //否则
        } else {  // Same as Random Encounter 随机遭遇
            //敌群id = 游戏游戏者 制作遭遇敌群id()
            troopId = $gamePlayer.makeEncounterTroopId();
        }
        //如果(数据敌群组[敌群id])
        if ($dataTroops[troopId]) {
            //战斗管理器 安装(敌群id ,参数组[2],参数组[3])
            BattleManager.setup(troopId, this._params[2], this._params[3]);
            //战斗管理器 设置事件呼叫返回 方法(n)
            BattleManager.setEventCallback(function (n) {
                //分支[缩进] = n
                this._branch[this._indent] = n;
                //绑定 (this)
            }.bind(this));
            //游戏游戏者 制作遭遇计数()
            $gamePlayer.makeEncounterCount();
            //场景管理器 添加(场景战斗)
            SceneManager.push(Scene_Battle);
        }
    }
    //返回 true
    return true;
};

/** If Win 如果胜利*/
Game_Interpreter.prototype.command601 = function () {
    //如果 ( 分支[缩进] !==  0 )
    if (this._branch[this._indent] !== 0) {
        //跳分支
        this.skipBranch();
    }
    //返回 true
    return true;
};

/** If Escape 如果逃跑*/
Game_Interpreter.prototype.command602 = function () {
    //如果 ( 分支[缩进] !==  1 )
    if (this._branch[this._indent] !== 1) {
        //跳分支
        this.skipBranch();
    }
    //返回 true
    return true;
};

/** If Lose 如果失败*/
Game_Interpreter.prototype.command603 = function () {
    //如果 ( 分支[缩进] !==  2 )
    if (this._branch[this._indent] !== 2) {
        //跳分支
        this.skipBranch();
    }
    //返回 true
    return true;
};

/** Shop Processing 商店处理*/
Game_Interpreter.prototype.command302 = function () {
    //如果( 不是 游戏队伍 在战斗() )
    if (!$gameParty.inBattle()) {
        //货物组 = [参数组]
        var goods = [this._params];
        //当 (下一个事件编码() === 605 )
        while (this.nextEventCode() === 605) {
            //索引++
            this._index++;
            //货物组 添加(当前命令() 参数组 )
            goods.push(this.currentCommand().parameters);
        }
        //场景管理器 添加(场景商店)
        SceneManager.push(Scene_Shop);
        //场景管理器 准备下一个场景(货物组 , 参数组[4])
        SceneManager.prepareNextScene(goods, this._params[4]);
    }
    //返回 true
    return true;
};

/** Name Input Processing 名称输入处理*/
Game_Interpreter.prototype.command303 = function () {
    //如果( 不是 游戏队伍 在战斗() )
    if (!$gameParty.inBattle()) {
        //如果( 数据角色组[参数组[0]] )
        if ($dataActors[this._params[0]]) {
            //场景管理器 添加 (场景名称)
            SceneManager.push(Scene_Name);
            //场景管理器 准备下一个场景(参数组[0] , 参数组[1])
            SceneManager.prepareNextScene(this._params[0], this._params[1]);
        }
    }
    //返回 true
    return true;
};

/** Change HP 改变hp*/
Game_Interpreter.prototype.command311 = function () {
    //值 = 操作数值(参数组[2] ,参数组[3],参数组[4] )
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //改变hp(角色 ,值, 参数组[5])
        this.changeHp(actor, value, this._params[5]);
    }.bind(this));
    //返回 true
    return true;
};

/** Change MP 改变mp*/
Game_Interpreter.prototype.command312 = function () {
    //值 = 操作数值(参数组[2] ,参数组[3],参数组[4] )
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 获得mp(值)
        actor.gainMp(value);
    }.bind(this));
    //返回 true
    return true;
};

/** Change TP 改变tp*/
Game_Interpreter.prototype.command326 = function () {
    //值 = 操作数值(参数组[2] ,参数组[3],参数组[4] )
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 获得tp(值)
        actor.gainTp(value);
    }.bind(this));
    //返回 true
    return true;
};

/** Change State 改变状态*/
Game_Interpreter.prototype.command313 = function () {
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //已经死的 = 角色 是死的()
        var alreadyDead = actor.isDead();
        //如果(参数组[2] === 0 )
        if (this._params[2] === 0) {
            //角色 添加状态(参数组[3])
            actor.addState(this._params[3]);
            //否则
        } else {
            //角色 移除状态(参数组[3])
            actor.removeState(this._params[3]);
        }
        //如果(角色 是死的() 并且 不是 已经死的)
        if (actor.isDead() && !alreadyDead) {
            //角色 表现死亡()
            actor.performCollapse();
        }
        //角色 清除结果()
        actor.clearResult();
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Recover All 移除所有*/
Game_Interpreter.prototype.command314 = function () {
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 完全恢复()
        actor.recoverAll();
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Change EXP 改变经验值*/
Game_Interpreter.prototype.command315 = function () {
    //值 = 操作数值(参数组[2] ,参数组[3],参数组[4] )
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 改变经验值(角色 当前经验值 () + 值 ,参数组[3])
        actor.changeExp(actor.currentExp() + value, this._params[5]);
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Change Level 改变等级*/
Game_Interpreter.prototype.command316 = function () {
    //值 = 操作数值(参数组[2] ,参数组[3],参数组[4] )
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 改变等级(角色 等级 + 值 , 参数组[5])
        actor.changeLevel(actor.level + value, this._params[5]);
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Change Parameter 改变参数*/
Game_Interpreter.prototype.command317 = function () {
    //值 = 操作数值(参数组[3] ,参数组[4],参数组[5] )
    var value = this.operateValue(this._params[3], this._params[4], this._params[5]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 增加参数(参数组[2],值)
        actor.addParam(this._params[2], value);
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Change Skill 改变技能*/
Game_Interpreter.prototype.command318 = function () {
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //如果(参数组[2] === 0 )
        if (this._params[2] === 0) {
            //角色 学习技能(参数组[3])
            actor.learnSkill(this._params[3]);
            //否则
        } else {
            //角色 忘记技能(参数组[3])
            actor.forgetSkill(this._params[3]);
        }
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Change Equipment 改变装备*/
Game_Interpreter.prototype.command319 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色)
    if (actor) {
        //角色 改变装备通过id(参数组[1] ,参数组[2] ) 
        actor.changeEquipById(this._params[1], this._params[2]);
    }
    //返回 true
    return true;
};

/** Change Name 改变名称*/
Game_Interpreter.prototype.command320 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色)
    if (actor) {
        //角色 设置名称(参数组[1])
        actor.setName(this._params[1]);
    }
    //返回 true
    return true;
};

/** Change Class 改变职业*/
Game_Interpreter.prototype.command321 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色 并且 数据职业组[参数组[1]]  )
    if (actor && $dataClasses[this._params[1]]) {
        //角色 改变职业(参数组[1],参数组[2])
        actor.changeClass(this._params[1], this._params[2]);
    }
    //返回 true
    return true;
};

/** Change Actor Images 改变角色图片*/
Game_Interpreter.prototype.command322 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色)
    if (actor) {
        //角色 设置行走图图像(参数组[1],参数组[2])
        actor.setCharacterImage(this._params[1], this._params[2]);
        //角色 设置脸图图像(参数组[3],参数组[4])
        actor.setFaceImage(this._params[3], this._params[4]);
        //角色 设置战斗图图像(参数组[5])
        actor.setBattlerImage(this._params[5]);
    }
    //游戏游戏者 刷新()
    $gamePlayer.refresh();
    //返回 true
    return true;
};

/** Change Vehicle Image 改变交通工具图片*/
Game_Interpreter.prototype.command323 = function () {
    //交通工具 = 游戏地图 交通工具(参数组[0])
    var vehicle = $gameMap.vehicle(this._params[0]);
    //如果(交通工具)
    if (vehicle) {
        //交通工具 设置图像(参数组[1],参数组[2])
        vehicle.setImage(this._params[1], this._params[2]);
    }
    //返回 true
    return true;
};

/** Change Nickname 改变昵称*/
Game_Interpreter.prototype.command324 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色)
    if (actor) {
        //角色 设置昵称(参数组[1])
        actor.setNickname(this._params[1]);
    }
    //返回 true
    return true;
};

/** Change Profile 改变人物简介*/
Game_Interpreter.prototype.command325 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色)
    if (actor) {
        //角色 设置人物简介(参数组[1])
        actor.setProfile(this._params[1]);
    }
    //返回 true
    return true;
};

/** Change Enemy HP 改变敌人hp*/
Game_Interpreter.prototype.command331 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //改变hp(敌人,值,参数组[4])
        this.changeHp(enemy, value, this._params[4]);
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Change Enemy MP 改变敌人mp*/
Game_Interpreter.prototype.command332 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //敌人 获得mp(值)
        enemy.gainMp(value);
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Change Enemy TP 改变敌人tp*/
Game_Interpreter.prototype.command342 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //敌人 获得tp(值)
        enemy.gainTp(value);
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Change Enemy State 改变敌人状态*/
Game_Interpreter.prototype.command333 = function () {
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //已经死的 = 敌人 是死的()
        var alreadyDead = enemy.isDead();
        //如果(参数组[1] === 0 )
        if (this._params[1] === 0) {
            //敌人 添加状态(参数组[2])
            enemy.addState(this._params[2]);
            //否则
        } else {
            //敌人 移除状态(参数组[2])
            enemy.removeState(this._params[2]);
        }
        //如果(敌人 是死的() 并且 不是 已经死的)
        if (enemy.isDead() && !alreadyDead) {
            //敌人 表现死亡()
            enemy.performCollapse();
        }
        //敌人 清除结果()
        enemy.clearResult();
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Enemy Recover All 敌人移除所有*/
Game_Interpreter.prototype.command334 = function () {
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //敌人 完全恢复()
        enemy.recoverAll();
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Enemy Appear 敌人出现*/
Game_Interpreter.prototype.command335 = function () {
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //敌人 出现()
        enemy.appear();
        //游戏敌群 制作唯一名称()
        $gameTroop.makeUniqueNames();
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Enemy Transform 敌人转换*/
Game_Interpreter.prototype.command336 = function () {
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //敌人 转换(参数组[0])
        enemy.transform(this._params[1]);
        //游戏敌群 制作唯一名称()
        $gameTroop.makeUniqueNames();
        //绑定(this))
    }.bind(this));
    //返回 true
    return true;
};

/** Show Battle Animation 显示战斗动画*/
Game_Interpreter.prototype.command337 = function () {
    //如果(参数组[2] == true)
    if (this._params[2] == true) {
        //迭代敌人索引( -1 ,方法(敌人)
        this.iterateEnemyIndex(-1, function (enemy) {
            //如果 (敌人 是活的() )
            if (enemy.isAlive()) {
                //敌人 开始动画( 参数组[1] , false , 0)
                enemy.startAnimation(this._params[1], false, 0);
            }
            //绑定(this))
        }.bind(this));
        //否则
    } else {
        //迭代敌人索引( 参数组[0],方法(敌人)
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            //如果 (敌人 是活的() )
            if (enemy.isAlive()) {
                //敌人 开始动画( 参数组[1] , false , 0)
                enemy.startAnimation(this._params[1], false, 0);
            }
            //绑定(this))
        }.bind(this));
    }
    //返回 true
    return true;
};

/** Force Action 强制动作*/
Game_Interpreter.prototype.command339 = function () {
    //迭代战斗者(参数组[0],参数组[1], 方法(战斗者)
    this.iterateBattler(this._params[0], this._params[1], function (battler) {
        //如果(不是 战斗者 是死亡状态影响() )
        if (!battler.isDeathStateAffected()) {
            //战斗者 强制动作(参数组[2],参数组[3])
            battler.forceAction(this._params[2], this._params[3]);
            //战斗管理器 强制动作(战斗者)
            BattleManager.forceAction(battler);
            //设置等待模式("action"//动作 )
            this.setWaitMode('action');
        }
    }.bind(this));
    //返回 true
    return true;
};

/** Abort Battle 中止战斗*/
Game_Interpreter.prototype.command340 = function () {
    //战斗管理器 中止()
    BattleManager.abort();
    //返回 true
    return true;
};

/** Open Menu Screen 打开菜单画面*/
Game_Interpreter.prototype.command351 = function () {
    //如果(不是 游戏队伍 在战斗() )
    if (!$gameParty.inBattle()) {
        //场景管理器 转到 (场景菜单)
        SceneManager.push(Scene_Menu);
        //窗口菜单命令 初始化命令位置()
        Window_MenuCommand.initCommandPosition();
    }
    //返回 true
    return true;
};

/** Open Save Screen 打开存档画面*/
Game_Interpreter.prototype.command352 = function () {
    //如果(不是 游戏队伍 在战斗() )
    if (!$gameParty.inBattle()) {
        //场景管理器 转到 (场景保存)
        SceneManager.push(Scene_Save);
    }
    //返回 true
    return true;
};

/** Game Over 游戏结束*/
Game_Interpreter.prototype.command353 = function () {
    //场景管理器 转到 (场景游戏结束)
    SceneManager.goto(Scene_Gameover);
    //返回 true
    return true;
};

/** Return to Title Screen 转到标题画面*/
Game_Interpreter.prototype.command354 = function () {
    //场景管理器 转到 (场景标题)
    SceneManager.goto(Scene_Title);
    //返回 true
    return true;
};

/** Script 脚本*/
Game_Interpreter.prototype.change355 = function () {
    //脚本 = 当前命令() 参数组[0]+ "\n" 
    var script = this.currentCommand().parameters[0] + '\n';
    //当(下一个事件编码() === 655 )
    while (this.nextEventCode() === 655) {
        //索引++
        this._index++;
        //脚本 += 当前命令() 参数组[0]+ "\n" 
        script += this.currentCommand().parameters[0] + '\n';
    }
    //运行(脚本)
    var jscode = script;
    this.console(jscode)
    //返回 true
    return true;
};

/** Plugin Command 插件命令*/
Game_Interpreter.prototype.command356 = function () {

    var args = this._params[0].split(" ");

    var command = args.shift();


    var jscode = "this.pluginCommand(" + command + "," + args + ")";

    this.console(jscode)

    //返回 true
    return true;
};
/**插件命令 */
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    // to be overridden by plugins
    //通过插件来覆盖
};

Game_Interpreter.requestImages = function (list, commonList) {
    if (!list) return;

    list.forEach(function (command) {
        var params = command.parameters;
        switch (command.code) {
            // Show Text
            case 101:
                ImageManager.requestFace(params[0]);
                break;

            // Common Event
            case 117:
                var commonEvent = $dataCommonEvents[params[0]];
                if (commonEvent) {
                    if (!commonList) {
                        commonList = [];
                    }
                    if (!commonList.contains(params[0])) {
                        commonList.push(params[0]);
                        Game_Interpreter.requestImages(commonEvent.list, commonList);
                    }
                }
                break;

            // Change Party Member
            case 129:
                var actor = $gameActors.actor(params[0]);
                if (actor && params[1] === 0) {
                    var name = actor.characterName();
                    ImageManager.requestCharacter(name);
                }
                break;

            // Set Movement Route
            case 205:
                if (params[1]) {
                    params[1].list.forEach(function (command) {
                        var params = command.parameters;
                        if (command.code === Game_Character.ROUTE_CHANGE_IMAGE) {
                            ImageManager.requestCharacter(params[0]);
                        }
                    });
                }
                break;

            // Show Animation, Show Battle Animation
            case 212: case 337:
                if (params[1]) {
                    var animation = $dataAnimations[params[1]];
                    var name1 = animation.animation1Name;
                    var name2 = animation.animation2Name;
                    var hue1 = animation.animation1Hue;
                    var hue2 = animation.animation2Hue;
                    ImageManager.requestAnimation(name1, hue1);
                    ImageManager.requestAnimation(name2, hue2);
                }
                break;

            // Change Player Followers
            case 216:
                if (params[0] === 0) {
                    $gamePlayer.followers().forEach(function (follower) {
                        var name = follower.characterName();
                        ImageManager.requestCharacter(name);
                    });
                }
                break;

            // Show Picture
            case 231:
                ImageManager.requestPicture(params[1]);
                break;

            // Change Tileset
            case 282:
                var tileset = $dataTilesets[params[0]];
                tileset.tilesetNames.forEach(function (tilesetName) {
                    ImageManager.requestTileset(tilesetName);
                });
                break;

            // Change Battle Back
            case 283:
                if ($gameParty.inBattle()) {
                    ImageManager.requestBattleback1(params[0]);
                    ImageManager.requestBattleback2(params[1]);
                }
                break;

            // Change Parallax
            case 284:
                if (!$gameParty.inBattle()) {
                    ImageManager.requestParallax(params[0]);
                }
                break;

            // Change Actor Images
            case 322:
                ImageManager.requestCharacter(params[1]);
                ImageManager.requestFace(params[3]);
                ImageManager.requestSvActor(params[5]);
                break;

            // Change Vehicle Image
            case 323:
                var vehicle = $gameMap.vehicle(params[0]);
                if (vehicle) {
                    ImageManager.requestCharacter(params[1]);
                }
                break;

            // Enemy Transform
            case 336:
                var enemy = $dataEnemies[params[1]];
                var name = enemy.battlerName;
                var hue = enemy.battlerHue;
                if ($gameSystem.isSideView()) {
                    ImageManager.requestSvEnemy(name, hue);
                } else {
                    ImageManager.requestEnemy(name, hue);
                }
                break;
        }
    });
};


Game_Interpreter.prototype.console = function (jscode, args) {
    this._jscode += jscode + "\n"
}





if (!!eval("$saolei")) {
    if (!!eval("$saolei.end()")) {
        var z = $saolei.gameEval()
        console.log(z)
        console.log("未标的地雷数", z[0])
        console.log("标错的旗子数", z[1])
        console.log("正确的旗子数", z[2]) 
        if (!!eval("$saolei.win()")) {
            this._eventId > 0 && $gameSelfSwitches.value([this._mapId, this._eventId, "A"]) === true
            var x, y, value;
            x = $gameVariables.value(1)
            y = $gameVariables.value(1)
            value = $gameMap.regionId(x, y)
            $gameVariables.setValue(1, value)
        } else {
            this._eventId > 0 && $gameSelfSwitches.value([this._mapId, this._eventId, "A"]) === true
        }
    } else {
        if (!!eval("Input.isTriggered('ok')")) {
            $saolei.input(1)

            $saolei.input(1, 1)

        } else {
        }
    }
} else {
    $saolei = new SaoLei(2, 5, 5, 6)


} 