
//-----------------------------------------------------------------------------
// Game_Interpreter
// 游戏事件解释器
// The interpreter for running event commands.
// 运转事件命令的解释器

function Game_Interpreter() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Interpreter.prototype.initialize = function(depth) {
    this._depth = depth || 0;
    this.checkOverflow();
    this.clear();
    this._branch = {};
    this._params = [];
    this._indent = 0;
    this._frameCount = 0;
    this._freezeChecker = 0;
};
//检查溢出
Game_Interpreter.prototype.checkOverflow = function() {
    if (this._depth >= 100) {
        throw new Error('Common event calls exceeded the limit');
    }
};
//清除
Game_Interpreter.prototype.clear = function() {
    this._mapId = 0;
    this._eventId = 0;
    this._list = null;
    this._index = 0;
    this._waitCount = 0;
    this._waitMode = '';
    this._comments = '';
    this._character = null;
    this._childInterpreter = null;
};
//安装
Game_Interpreter.prototype.setup = function(list, eventId) {
    this.clear();
    this._mapId = $gameMap.mapId();
    this._eventId = eventId || 0;
    this._list = list;
};
//事件id
Game_Interpreter.prototype.eventId = function() {
    return this._eventId;
};
//是在当前地图
Game_Interpreter.prototype.isOnCurrentMap = function() {
    return this._mapId === $gameMap.mapId();
};
//安装储存公共事件
Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        this.setup($gameTemp.reservedCommonEvent().list);
        $gameTemp.clearCommonEvent();
        return true;
    } else {
        return false;
    }
};
//是运转
Game_Interpreter.prototype.isRunning = function() {
    return !!this._list;
};
//更新
Game_Interpreter.prototype.update = function() {
    while (this.isRunning()) {
        if (this.updateChild() || this.updateWait()) {
            break;
        }
        if (SceneManager.isSceneChanging()) {
            break;
        }
        if (!this.executeCommand()) {
            break;
        }
        if (this.checkFreeze()) {
            break;
        }
    }
};
//更新子项
Game_Interpreter.prototype.updateChild = function() {
    if (this._childInterpreter) {
        this._childInterpreter.update();
        if (this._childInterpreter.isRunning()) {
            return true;
        } else {
            this._childInterpreter = null;
        }
    }
    return false;
};
//更新等待
Game_Interpreter.prototype.updateWait = function() {
    return this.updateWaitCount() || this.updateWaitMode();
};
//更新等待计数
Game_Interpreter.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    }
    return false;
};
//更新等待模式
Game_Interpreter.prototype.updateWaitMode = function() {
    var waiting = false;
    switch (this._waitMode) {
    case 'message':
        waiting = $gameMessage.isBusy();
        break;
    case 'transfer':
        waiting = $gamePlayer.isTransferring();
        break;
    case 'scroll':
        waiting = $gameMap.isScrolling();
        break;
    case 'route':
        waiting = this._character.isMoveRouteForcing();
        break;
    case 'animation':
        waiting = this._character.isAnimationPlaying();
        break;
    case 'balloon':
        waiting = this._character.isBalloonPlaying();
        break;
    case 'gather':
        waiting = $gamePlayer.areFollowersGathering();
        break;
    case 'action':
        waiting = BattleManager.isActionForced();
        break;
    case 'video':
        waiting = Graphics.isVideoPlaying();
        break;
    case 'image':
        waiting = !ImageManager.isReady();
        break;
    }
    if (!waiting) {
        this._waitMode = '';
    }
    return waiting;
};
//设置等待模式
Game_Interpreter.prototype.setWaitMode = function(waitMode) {
    this._waitMode = waitMode;
};
//等待
Game_Interpreter.prototype.wait = function(duration) {
    this._waitCount = duration;
};
//淡入速度
Game_Interpreter.prototype.fadeSpeed = function() {
    return 24;
};
//执行命令
Game_Interpreter.prototype.executeCommand = function() {
    var command = this.currentCommand();
    if (command) {
        this._params = command.parameters;
        this._indent = command.indent;
        var methodName = 'command' + command.code;
        if (typeof this[methodName] === 'function') {
            if (!this[methodName]()) {
                return false;
            }
        }
        this._index++;
    } else {
        this.terminate();
    }
    return true;
};
//检查冻结
Game_Interpreter.prototype.checkFreeze = function() {
    if (this._frameCount !== Graphics.frameCount) {
        this._frameCount = Graphics.frameCount;
        this._freezeChecker = 0;
    }
    if (this._freezeChecker++ >= 100000) {
        return true;
    } else {
        return false;
    }
};
//终止
Game_Interpreter.prototype.terminate = function() {
    this._list = null;
    this._comments = '';
};
//跳分支
Game_Interpreter.prototype.skipBranch = function() {
    while (this._list[this._index + 1].indent > this._indent) {
        this._index++;
    }
};
//当前命令
Game_Interpreter.prototype.currentCommand = function() {
    return this._list[this._index];
};
//下一个事件代码
Game_Interpreter.prototype.nextEventCode = function() {
    var command = this._list[this._index + 1];
    if (command) {
        return command.code;
    } else {
        return 0;
    }
};
//迭代角色id
Game_Interpreter.prototype.iterateActorId = function(param, callback) {
    if (param === 0) {
        $gameParty.members().forEach(callback);
    } else {
        var actor = $gameActors.actor(param);
        if (actor) {
            callback(actor);
        }
    }
};
//迭代角色ex
Game_Interpreter.prototype.iterateActorEx = function(param1, param2, callback) {
    if (param1 === 0) {
        this.iterateActorId(param2, callback);
    } else {
        this.iterateActorId($gameVariables.value(param2), callback);
    }
};
//迭代角色索引
Game_Interpreter.prototype.iterateActorIndex = function(param, callback) {
    if (param < 0) {
        $gameParty.members().forEach(callback);
    } else {
        var actor = $gameParty.members()[param];
        if (actor) {
            callback(actor);
        }
    }
};
//迭代敌人索引
Game_Interpreter.prototype.iterateEnemyIndex = function(param, callback) {
    if (param < 0) {
        $gameTroop.members().forEach(callback);
    } else {
        var enemy = $gameTroop.members()[param];
        if (enemy) {
            callback(enemy);
        }
    }
};
//迭代战斗者
Game_Interpreter.prototype.iterateBattler = function(param1, param2, callback) {
    if ($gameParty.inBattle()) {
        if (param1 === 0) {
            this.iterateEnemyIndex(param2, callback);
        } else {
            this.iterateActorId(param2, callback);
        }
    }
};
//人物
Game_Interpreter.prototype.character = function(param) {
    if ($gameParty.inBattle()) {
        return null;
    } else if (param < 0) {
        return $gamePlayer;
    } else if (this.isOnCurrentMap()) {
        return $gameMap.event(param > 0 ? param : this._eventId);
    } else {
        return null;
    }
};
//操作数值
Game_Interpreter.prototype.operateValue = function(operation, operandType, operand) {
    var value = operandType === 0 ? operand : $gameVariables.value(operand);
    return operation === 0 ? value : -value;
};
//改变hp
Game_Interpreter.prototype.changeHp = function(target, value, allowDeath) {
    if (target.isAlive()) {
        if (!allowDeath && target.hp <= -value) {
            value = 1 - target.hp;
        }
        target.gainHp(value);
        if (target.isDead()) {
            target.performCollapse();
        }
    }
};

// Show Text 显示文本
Game_Interpreter.prototype.command101 = function() {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setFaceImage(this._params[0], this._params[1]);
        $gameMessage.setBackground(this._params[2]);
        $gameMessage.setPositionType(this._params[3]);
        while (this.nextEventCode() === 401) {  // Text data
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        switch (this.nextEventCode()) {
        case 102:  // Show Choices
            this._index++;
            this.setupChoices(this.currentCommand().parameters);
            break;
        case 103:  // Input Number
            this._index++;
            this.setupNumInput(this.currentCommand().parameters);
            break;
        case 104:  // Select Item
            this._index++;
            this.setupItemChoice(this.currentCommand().parameters);
            break;
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

// Show Choices 显示选择
Game_Interpreter.prototype.command102 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupChoices(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};
//安装选择
Game_Interpreter.prototype.setupChoices = function(params) {
    var choices = params[0].clone();
    var cancelType = params[1];
    var defaultType = params.length > 2 ? params[2] : 0;
    var positionType = params.length > 3 ? params[3] : 2;
    var background = params.length > 4 ? params[4] : 0;
    if (cancelType >= choices.length) {
        cancelType = -2;
    }
    $gameMessage.setChoices(choices, defaultType, cancelType);
    $gameMessage.setChoiceBackground(background);
    $gameMessage.setChoicePositionType(positionType);
    $gameMessage.setChoiceCallback(function(n) {
        this._branch[this._indent] = n;
    }.bind(this));
};

// When [**] 当
Game_Interpreter.prototype.command402 = function() {
    if (this._branch[this._indent] !== this._params[0]) {
        this.skipBranch();
    }
    return true;
};

// When Cancel  当取消
Game_Interpreter.prototype.command403 = function() {
    if (this._branch[this._indent] >= 0) {
        this.skipBranch();
    }
    return true;
};

// Input Number 输入数字
Game_Interpreter.prototype.command103 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupNumInput(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};
//安装数字输入
Game_Interpreter.prototype.setupNumInput = function(params) {
    $gameMessage.setNumberInput(params[0], params[1]);
};

// Select Item 选择物品
Game_Interpreter.prototype.command104 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupItemChoice(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};
//安装物品选择
Game_Interpreter.prototype.setupItemChoice = function(params) {
    $gameMessage.setItemChoice(params[0], params[1] || 2);
};

// Show Scrolling Text 显示滚动文本
Game_Interpreter.prototype.command105 = function() {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setScroll(this._params[0], this._params[1]);
        while (this.nextEventCode() === 405) {
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

// Comment 注释
Game_Interpreter.prototype.command108 = function() {
    this._comments = [this._params[0]];
    while (this.nextEventCode() === 408) {
        this._index++;
        this._comments.push(this.currentCommand().parameters[0]);
    }
    return true;
};

// Conditional Branch  条件分歧
Game_Interpreter.prototype.command111 = function() {
    var result = false;
    switch (this._params[0]) {
    case 0:  // Switch 开关
        result = ($gameSwitches.value(this._params[1]) === (this._params[2] === 0));
        break;
    case 1:  // Variable 变量
        var value1 = $gameVariables.value(this._params[1]);
        var value2;
        if (this._params[2] === 0) {
            value2 = this._params[3];
        } else {
            value2 = $gameVariables.value(this._params[3]);
        }
        switch (this._params[4]) {
        case 0:  // Equal to 等于
            result = (value1 === value2);
            break;
        case 1:  // Greater than or Equal to  大于等于
            result = (value1 >= value2);
            break;
        case 2:  // Less than or Equal to  小于等于
            result = (value1 <= value2);
            break;
        case 3:  // Greater than  大于
            result = (value1 > value2);
            break;
        case 4:  // Less than  小于
            result = (value1 < value2);
            break;
        case 5:  // Not Equal to  不等于
            result = (value1 !== value2);
            break;
        }
        break;
    case 2:  // Self Switch 独立开关
        if (this._eventId > 0) {
            var key = [this._mapId, this._eventId, this._params[1]];
            result = ($gameSelfSwitches.value(key) === (this._params[2] === 0));
        }
        break;
    case 3:  // Timer  计时器
        if ($gameTimer.isWorking()) {
            if (this._params[2] === 0) {
                result = ($gameTimer.seconds() >= this._params[1]);
            } else {
                result = ($gameTimer.seconds() <= this._params[1]);
            }
        }
        break;
    case 4:  // Actor 角色
        var actor = $gameActors.actor(this._params[1]);
        if (actor) {
            var n = this._params[3];
            switch (this._params[2]) {
            case 0:  // In the Party  在队伍
                result = $gameParty.members().contains(actor);
                break;
            case 1:  // Name 名称
                result = (actor.name() === n);
                break;
            case 2:  // Class 职业
                result = actor.isClass($dataClasses[n]);
                break;
            case 3:  // Skill 技能
                result = actor.isLearnedSkill(n);
                break;
            case 4:  // Weapon 武器
                result = actor.hasWeapon($dataWeapons[n]);
                break;
            case 5:  // Armor 防具
                result = actor.hasArmor($dataArmors[n]);
                break;
            case 6:  // State 状态
                result = actor.isStateAffected(n);
                break;
            }
        }
        break;
    case 5:  // Enemy 敌人
        var enemy = $gameTroop.members()[this._params[1]];
        if (enemy) {
            switch (this._params[2]) {
            case 0:  // Appeared 出现
                result = enemy.isAlive();
                break;
            case 1:  // State 状态
                result = enemy.isStateAffected(this._params[3]);
                break;
            }
        }
        break;
    case 6:  // Character 人物
        var character = this.character(this._params[1]);
        if (character) {
            result = (character.direction() === this._params[2]);
        }
        break;
    case 7:  // Gold 金钱
        switch (this._params[2]) {
        case 0:  // Greater than or equal to 大于等于
            result = ($gameParty.gold() >= this._params[1]);
            break;
        case 1:  // Less than or equal to 小于等于
            result = ($gameParty.gold() <= this._params[1]);
            break;
        case 2:  // Less than 小于
            result = ($gameParty.gold() < this._params[1]);
            break;
        }
        break;
    case 8:  // Item 物品
        result = $gameParty.hasItem($dataItems[this._params[1]]);
        break;
    case 9:  // Weapon 武器
        result = $gameParty.hasItem($dataWeapons[this._params[1]], this._params[2]);
        break;
    case 10:  // Armor 防具
        result = $gameParty.hasItem($dataArmors[this._params[1]], this._params[2]);
        break;
    case 11:  // Button 按键
        result = Input.isPressed(this._params[1]);
        break;
    case 12:  // Script 脚本
        result = !!eval(this._params[1]);
        break;
    case 13:  // Vehicle 交通工具
        result = ($gamePlayer.vehicle() === $gameMap.vehicle(this._params[1]));
        break;
    }
    this._branch[this._indent] = result;
    if (this._branch[this._indent] === false) {
        this.skipBranch();
    }
    return true;
};

// Else 其他的
Game_Interpreter.prototype.command411 = function() {
    if (this._branch[this._indent] !== false) {
        this.skipBranch();
    }
    return true;
};

// Loop 循环
Game_Interpreter.prototype.command112 = function() {
    return true;
};

// Repeat Above 重复上述
Game_Interpreter.prototype.command413 = function() {
    do {
        this._index--;
    } while (this.currentCommand().indent !== this._indent);
    return true;
};

// Break Loop 断开循环
Game_Interpreter.prototype.command113 = function() {
    while (this._index < this._list.length - 1) {
        this._index++;
        var command = this.currentCommand();
        if (command.code === 413 && command.indent < this._indent) {
            break;
        }
    }
    return true;
};

// Exit Event Processing 退出事件处理
Game_Interpreter.prototype.command115 = function() {
    this._index = this._list.length;
    return true;
};

// Common Event 公共事件
Game_Interpreter.prototype.command117 = function() {
    var commonEvent = $dataCommonEvents[this._params[0]];
    if (commonEvent) {
        var eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(commonEvent.list, eventId);
    }
    return true;
};
//安装子项
Game_Interpreter.prototype.setupChild = function(list, eventId) {
    this._childInterpreter = new Game_Interpreter(this._depth + 1);
    this._childInterpreter.setup(list, eventId);
};

// Label 标签
Game_Interpreter.prototype.command118 = function() {
    return true;
};

// Jump to Label 跳到标签
Game_Interpreter.prototype.command119 = function() {
    var labelName = this._params[0];
    for (var i = 0; i < this._list.length; i++) {
        var command = this._list[i];
        if (command.code === 118 && command.parameters[0] === labelName) {
            this.jumpTo(i);
            return;
        }
    }
    return true;
};
//跳到
Game_Interpreter.prototype.jumpTo = function(index) {
    var lastIndex = this._index;
    var startIndex = Math.min(index, lastIndex);
    var endIndex = Math.max(index, lastIndex);
    var indent = this._indent;
    for (var i = startIndex; i <= endIndex; i++) {
        var newIndent = this._list[i].indent;
        if (newIndent !== indent) {
            this._branch[indent] = null;
            indent = newIndent;
        }
    }
    this._index = index;
};

// Control Switches 操作开关
Game_Interpreter.prototype.command121 = function() {
    for (var i = this._params[0]; i <= this._params[1]; i++) {
        $gameSwitches.setValue(i, this._params[2] === 0);
    }
    return true;
};

// Control Variables 操作变量
Game_Interpreter.prototype.command122 = function() {
    var value = 0;
    switch (this._params[3]) {  // Operand 操作数
    case 0:  // Constant 常数
        value = this._params[4];
        break;
    case 1:  // Variable 变量
        value = $gameVariables.value(this._params[4]);
        break;
    case 2:  // Random 随机数
        value = this._params[4] + Math.randomInt(this._params[5] - this._params[4] + 1);
        break;
    case 3:  // Game Data 游戏数据
        value = this.gameDataOperand(this._params[4], this._params[5], this._params[6]);
        break;
    case 4:  // Script 脚本
        value = eval(this._params[4]);
        break;
    }
    for (var i = this._params[0]; i <= this._params[1]; i++) {
        this.operateVariable(i, this._params[2], value);
    }
    return true;
};
//游戏数据
Game_Interpreter.prototype.gameDataOperand = function(type, param1, param2) {
    switch (type) {
    case 0:  // Item 物品
        return $gameParty.numItems($dataItems[param1]);
    case 1:  // Weapon 武器
        return $gameParty.numItems($dataWeapons[param1]);
    case 2:  // Armor 防具
        return $gameParty.numItems($dataArmors[param1]);
    case 3:  // Actor 角色
        var actor = $gameActors.actor(param1);
        if (actor) {
            switch (param2) {
            case 0:  // Level 等级
                return actor.level;
            case 1:  // EXP 经验值
                return actor.currentExp();
            case 2:  // HP
                return actor.hp;
            case 3:  // MP
                return actor.mp;
            default:    // Parameter
                if (param2 >= 4 && param2 <= 11) {
                    return actor.param(param2 - 4);
                }
            }
        }
        break;
    case 4:  // Enemy 敌人
        var enemy = $gameTroop.members()[param1];
        if (enemy) {
            switch (param2) {
            case 0:  // HP
                return enemy.hp;
            case 1:  // MP
                return enemy.mp;
            default:    // Parameter 参数
                if (param2 >= 2 && param2 <= 9) {
                    return enemy.param(param2 - 2);
                }
            }
        }
        break;
    case 5:  // Character  人物
        var character = this.character(param1);
        if (character) {
            switch (param2) {
            case 0:  // Map X 地图x
                return character.x;
            case 1:  // Map Y 地图x
                return character.y;
            case 2:  // Direction 方向
                return character.direction();
            case 3:  // Screen X 画面x
                return character.screenX();
            case 4:  // Screen Y 画面y
                return character.screenY();
            }
        }
        break;
    case 6:  // Party 队伍
        actor = $gameParty.members()[param1];
        return actor ? actor.actorId() : 0;
    case 7:  // Other 其他
        switch (param1) {
        case 0:  // Map ID 地图id
            return $gameMap.mapId();
        case 1:  // Party Members 队伍成员数
            return $gameParty.size();
        case 2:  // Gold  金钱
            return $gameParty.gold();
        case 3:  // Steps 步数
            return $gameParty.steps();
        case 4:  // Play Time 游戏时间
            return $gameSystem.playtime();
        case 5:  // Timer 计时器
            return $gameTimer.seconds();
        case 6:  // Save Count 保存次数
            return $gameSystem.saveCount();
        case 7:  // Battle Count 战斗次数
            return $gameSystem.battleCount();
        case 8:  // Win Count 胜利次数
            return $gameSystem.winCount();
        case 9:  // Escape Count 逃跑次数
            return $gameSystem.escapeCount();
        }
        break;
    }
    return 0;
};
//操作变量
Game_Interpreter.prototype.operateVariable = function(variableId, operationType, value) {
    try {
        var oldValue = $gameVariables.value(variableId);
        switch (operationType) {
        case 0:  // Set 设置
            $gameVariables.setValue(variableId, oldValue = value);
            break;
        case 1:  // Add 加
            $gameVariables.setValue(variableId, oldValue + value);
            break;
        case 2:  // Sub 减
            $gameVariables.setValue(variableId, oldValue - value);
            break;
        case 3:  // Mul 乘
            $gameVariables.setValue(variableId, oldValue * value);
            break;
        case 4:  // Div 除
            $gameVariables.setValue(variableId, oldValue / value);
            break;
        case 5:  // Mod 求余
            $gameVariables.setValue(variableId, oldValue % value);
            break;
        }
    } catch (e) {
        $gameVariables.setValue(variableId, 0);
    }
};

// Control Self Switch 操作独立开关
Game_Interpreter.prototype.command123 = function() {
    if (this._eventId > 0) {
        var key = [this._mapId, this._eventId, this._params[0]];
        $gameSelfSwitches.setValue(key, this._params[1] === 0);
    }
    return true;
};

// Control Timer 操作计时器
Game_Interpreter.prototype.command124 = function() {
    if (this._params[0] === 0) {  // Start 开始
        $gameTimer.start(this._params[1] * 60);
    } else {  // Stop 停止
        $gameTimer.stop();
    }
    return true;
};

// Change Gold 改变金钱
Game_Interpreter.prototype.command125 = function() {
    var value = this.operateValue(this._params[0], this._params[1], this._params[2]);
    $gameParty.gainGold(value);
    return true;
};

// Change Items 改变物品
Game_Interpreter.prototype.command126 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataItems[this._params[0]], value);
    return true;
};

// Change Weapons 改变武器
Game_Interpreter.prototype.command127 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataWeapons[this._params[0]], value, this._params[4]);
    return true;
};

// Change Armors 改变防具
Game_Interpreter.prototype.command128 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataArmors[this._params[0]], value, this._params[4]);
    return true;
};

// Change Party Member 改变队伍成员
Game_Interpreter.prototype.command129 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        if (this._params[1] === 0) {  // Add 增加
            if (this._params[2]) {   // Initialize 初始化
                $gameActors.actor(this._params[0]).setup(this._params[0]);
            }
            $gameParty.addActor(this._params[0]);
        } else {  // Remove 移除
            $gameParty.removeActor(this._params[0]);
        }
    }
    return true;
};

// Change Battle BGM 改变战斗bgm
Game_Interpreter.prototype.command132 = function() {
    $gameSystem.setBattleBgm(this._params[0]);
    return true;
};

// Change Victory ME 改变胜利me
Game_Interpreter.prototype.command133 = function() {
    $gameSystem.setVictoryMe(this._params[0]);
    return true;
};

// Change Save Access 改变存档设置
Game_Interpreter.prototype.command134 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableSave();
    } else {
        $gameSystem.enableSave();
    }
    return true;
};

// Change Menu Access 改变菜单设置
Game_Interpreter.prototype.command135 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableMenu();
    } else {
        $gameSystem.enableMenu();
    }
    return true;
};

// Change Encounter Disable 改变遇敌设置
Game_Interpreter.prototype.command136 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableEncounter();
    } else {
        $gameSystem.enableEncounter();
    }
    $gamePlayer.makeEncounterCount();
    return true;
};

// Change Formation Access 改变队伍设置
Game_Interpreter.prototype.command137 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableFormation();
    } else {
        $gameSystem.enableFormation();
    }
    return true;
};

// Change Window Color 改变窗口颜色
Game_Interpreter.prototype.command138 = function() {
    $gameSystem.setWindowTone(this._params[0]);
    return true;
};

// Change Defeat ME 改变失败me
Game_Interpreter.prototype.command139 = function() {
    $gameSystem.setDefeatMe(this._params[0]);
    return true;
};

// Change Vehicle BGM 改变胜利bgm
Game_Interpreter.prototype.command140 = function() {
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setBgm(this._params[1]);
    }
    return true;
};

// Transfer Player 传送游戏者
Game_Interpreter.prototype.command201 = function() {
    if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
        var mapId, x, y;
        if (this._params[0] === 0) {  // Direct designation 直接指定
            mapId = this._params[1];
            x = this._params[2];
            y = this._params[3];
        } else {  // Designation with variables 变量指定
            mapId = $gameVariables.value(this._params[1]);
            x = $gameVariables.value(this._params[2]);
            y = $gameVariables.value(this._params[3]);
        }
        $gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
        this.setWaitMode('transfer');
        this._index++;
    }
    return false;
};

// Set Vehicle Location 设置交通工具位置
Game_Interpreter.prototype.command202 = function() {
    var mapId, x, y;
    if (this._params[1] === 0) {  // Direct designation 直接指定
        mapId = this._params[2];
        x = this._params[3];
        y = this._params[4];
    } else {  // Designation with variables 变量指定
        mapId = $gameVariables.value(this._params[2]);
        x = $gameVariables.value(this._params[3]);
        y = $gameVariables.value(this._params[4]);
    }
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setLocation(mapId, x, y);
    }
    return true;
};

// Set Event Location 设置事件位置
Game_Interpreter.prototype.command203 = function() {
    var character = this.character(this._params[0]);
    if (character) {
        if (this._params[1] === 0) {  // Direct designation 直接指定
            character.locate(this._params[2], this._params[3]);
        } else if (this._params[1] === 1) {  // Designation with variables 变量指定
            var x = $gameVariables.value(this._params[2]);
            var y = $gameVariables.value(this._params[3]);
            character.locate(x, y);
        } else {  // Exchange with another event 和其他事件交换
            var character2 = this.character(this._params[2]);
            if (character2) {
                character.swap(character2);
            }
        }
        if (this._params[4] > 0) {
            character.setDirection(this._params[4]);
        }
    }
    return true;
};

// Scroll Map 滚动地图
Game_Interpreter.prototype.command204 = function() {
    if (!$gameParty.inBattle()) {
        if ($gameMap.isScrolling()) {
            this.setWaitMode('scroll');
            return false;
        }
        $gameMap.startScroll(this._params[0], this._params[1], this._params[2]);
    }
    return true;
};

// Set Movement Route 设置移动路线
Game_Interpreter.prototype.command205 = function() {
    $gameMap.refreshIfNeeded();
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.forceMoveRoute(this._params[1]);
        if (this._params[1].wait) {
            this.setWaitMode('route');
        }
    }
    return true;
};

// Getting On and Off Vehicles 上下交通工具
Game_Interpreter.prototype.command206 = function() {
    $gamePlayer.getOnOffVehicle();
    return true;
};

// Change Transparency 改变透明度
Game_Interpreter.prototype.command211 = function() {
    $gamePlayer.setTransparent(this._params[0] === 0);
    return true;
};

// Show Animation 显示动画
Game_Interpreter.prototype.command212 = function() {
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.requestAnimation(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('animation');
        }
    }
    return true;
};

// Show Balloon Icon 显示气球图标
Game_Interpreter.prototype.command213 = function() {
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.requestBalloon(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('balloon');
        }
    }
    return true;
};

// Erase Event 抹去事件
Game_Interpreter.prototype.command214 = function() {
    if (this.isOnCurrentMap() && this._eventId > 0) {
        $gameMap.eraseEvent(this._eventId);
    }
    return true;
};

// Change Player Followers 改变游戏者从者
Game_Interpreter.prototype.command216 = function() {
    if (this._params[0] === 0) {
        $gamePlayer.showFollowers();
    } else {
        $gamePlayer.hideFollowers();
    }
    $gamePlayer.refresh();
    return true;
};

// Gather Followers 集合从者
Game_Interpreter.prototype.command217 = function() {
    if (!$gameParty.inBattle()) {
        $gamePlayer.gatherFollowers();
        this.setWaitMode('gather');
    }
    return true;
};

// Fadeout Screen 淡出屏幕
Game_Interpreter.prototype.command221 = function() {
    if (!$gameMessage.isBusy()) {
        $gameScreen.startFadeOut(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        this._index++;
    }
    return false;
};

// Fadein Screen 淡入屏幕
Game_Interpreter.prototype.command222 = function() {
    if (!$gameMessage.isBusy()) {
        $gameScreen.startFadeIn(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        this._index++;
    }
    return false;
};

// Tint Screen 屏幕色调
Game_Interpreter.prototype.command223 = function() {
    $gameScreen.startTint(this._params[0], this._params[1]);
    if (this._params[2]) {
        this.wait(this._params[1]);
    }
    return true;
};

// Flash Screen 屏幕闪烁
Game_Interpreter.prototype.command224 = function() {
    $gameScreen.startFlash(this._params[0], this._params[1]);
    if (this._params[2]) {
        this.wait(this._params[1]);
    }
    return true;
};

// Shake Screen 屏幕震动
Game_Interpreter.prototype.command225 = function() {
    $gameScreen.startShake(this._params[0], this._params[1], this._params[2]);
    if (this._params[3]) {
        this.wait(this._params[2]);
    }
    return true;
};

// Wait 等待
Game_Interpreter.prototype.command230 = function() {
    this.wait(this._params[0]);
    return true;
};

// Show Picture 显示图片
Game_Interpreter.prototype.command231 = function() {
    var x, y;
    if (this._params[3] === 0) {  // Direct designation 直接指定 
        x = this._params[4];
        y = this._params[5];
    } else {  // Designation with variables 变量指定
        x = $gameVariables.value(this._params[4]);
        y = $gameVariables.value(this._params[5]);
    }
    $gameScreen.showPicture(this._params[0], this._params[1], this._params[2],
        x, y, this._params[6], this._params[7], this._params[8], this._params[9]);
    return true;
};

// Move Picture 移动图片
Game_Interpreter.prototype.command232 = function() {
    var x, y;
    if (this._params[3] === 0) {  // Direct designation 直接指定 
        x = this._params[4];
        y = this._params[5];
    } else {  // Designation with variables
        x = $gameVariables.value(this._params[4]);
        y = $gameVariables.value(this._params[5]);
    }
    $gameScreen.movePicture(this._params[0], this._params[2], x, y, this._params[6],
        this._params[7], this._params[8], this._params[9], this._params[10]);
    if (this._params[11]) {
        this.wait(this._params[10]);
    }
    return true;
};

// Rotate Picture 旋转图片
Game_Interpreter.prototype.command233 = function() {
    $gameScreen.rotatePicture(this._params[0], this._params[1]);
    return true;
};

// Tint Picture 图片色调
Game_Interpreter.prototype.command234 = function() {
    $gameScreen.tintPicture(this._params[0], this._params[1], this._params[2]);
    if (this._params[3]) {
        this.wait(this._params[2]);
    }
    return true;
};

// Erase Picture 抹去图片
Game_Interpreter.prototype.command235 = function() {
    $gameScreen.erasePicture(this._params[0]);
    return true;
};

// Set Weather Effect 设置天气效果
Game_Interpreter.prototype.command236 = function() {
    if (!$gameParty.inBattle()) {
        $gameScreen.changeWeather(this._params[0], this._params[1], this._params[2]);
        if (this._params[3]) {
            this.wait(this._params[2]);
        }
    }
    return true;
};

// Play BGM 播放bgm
Game_Interpreter.prototype.command241 = function() {
    AudioManager.playBgm(this._params[0]);
    return true;
};

// Fadeout BGM 淡出bgm
Game_Interpreter.prototype.command242 = function() {
    AudioManager.fadeOutBgm(this._params[0]);
    return true;
};

// Save BGM 保存bgm
Game_Interpreter.prototype.command243 = function() {
    $gameSystem.saveBgm();
    return true;
};

// Resume BGM 重播bgm
Game_Interpreter.prototype.command244 = function() {
    $gameSystem.replayBgm();
    return true;
};

// Play BGS 播放bgs
Game_Interpreter.prototype.command245 = function() {
    AudioManager.playBgs(this._params[0]);
    return true;
};

// Fadeout BGS 淡出bgs
Game_Interpreter.prototype.command246 = function() {
    AudioManager.fadeOutBgs(this._params[0]);
    return true;
};

// Play ME 播放me
Game_Interpreter.prototype.command249 = function() {
    AudioManager.playMe(this._params[0]);
    return true;
};

// Play SE 播放se
Game_Interpreter.prototype.command250 = function() {
    AudioManager.playSe(this._params[0]);
    return true;
};

// Stop SE 停止se
Game_Interpreter.prototype.command251 = function() {
    AudioManager.stopSe();
    return true;
};

// Play Movie 播放影片
Game_Interpreter.prototype.command261 = function() {
    if (!$gameMessage.isBusy()) {
        var name = this._params[0];
        if (name.length > 0) {
            var ext = this.videoFileExt();
            Graphics.playVideo('movies/' + name + ext);
            this.setWaitMode('video');
        }
        this._index++;
    }
    return false;
};
//影片文件提取
Game_Interpreter.prototype.videoFileExt = function() {
    if (Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice()) {
        return '.webm';
    } else {
        return '.mp4';
    }
};

// Change Map Name Display 改变地图名称显示
Game_Interpreter.prototype.command281 = function() {
    if (this._params[0] === 0) {
        $gameMap.enableNameDisplay();
    } else {
        $gameMap.disableNameDisplay();
    }
    return true;
};

// Change Tileset 改变图块组
Game_Interpreter.prototype.command282 = function() {
    var tileset = $dataTilesets[this._params[0]];
    for (var i = 0; i < tileset.tilesetNames.length; i++) {
        ImageManager.loadTileset(tileset.tilesetNames[i]);
    }
    if (ImageManager.isReady()) {
        $gameMap.changeTileset(this._params[0]);
        return true;
    } else {
        return false;
    }
};

// Change Battle Back 更改战斗背景
Game_Interpreter.prototype.command283 = function() {
    $gameMap.changeBattleback(this._params[0], this._params[1]);
    return true;
};

// Change Parallax 更改远景图
Game_Interpreter.prototype.command284 = function() {
    $gameMap.changeParallax(this._params[0], this._params[1],
        this._params[2], this._params[3], this._params[4]);
    return true;
};

// Get Location Info 获得位置消息
Game_Interpreter.prototype.command285 = function() {
    var x, y, value;
    if (this._params[2] === 0) {  // Direct designation 直接指定
        x = this._params[3];
        y = this._params[4];
    } else {  // Designation with variables 变量指定
        x = $gameVariables.value(this._params[3]);
        y = $gameVariables.value(this._params[4]);
    }
    switch (this._params[1]) {
    case 0:     // Terrain Tag 地区标签
        value = $gameMap.terrainTag(x, y);
        break;
    case 1:     // Event ID 事件id
        value = $gameMap.eventIdXy(x, y);
        break;
    case 2:     // Tile ID (Layer 1) 图块id
    case 3:     // Tile ID (Layer 2)
    case 4:     // Tile ID (Layer 3)
    case 5:     // Tile ID (Layer 4)
        value = $gameMap.tileId(x, y, this._params[1] - 2);
        break;
    default:    // Region ID 区域id 
        value = $gameMap.regionId(x, y);
        break;
    }
    $gameVariables.setValue(this._params[0], value);
    return true;
};

// Battle Processing 战斗处理
Game_Interpreter.prototype.command301 = function() {
    if (!$gameParty.inBattle()) {
        var troopId;
        if (this._params[0] === 0) {  // Direct designation 直接指定
            troopId = this._params[1];
        } else if (this._params[0] === 1) {  // Designation with a variable 变量指定
            troopId = $gameVariables.value(this._params[1]);
        } else {  // Same as Random Encounter 随机遭遇
            troopId = $gamePlayer.makeEncounterTroopId();
        }
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, this._params[2], this._params[3]);
            BattleManager.setEventCallback(function(n) {
                this._branch[this._indent] = n;
            }.bind(this));
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_Battle);
        }
    }
    return true;
};

// If Win 如果胜利
Game_Interpreter.prototype.command601 = function() {
    if (this._branch[this._indent] !== 0) {
        this.skipBranch();
    }
    return true;
};

// If Escape 如果逃跑
Game_Interpreter.prototype.command602 = function() {
    if (this._branch[this._indent] !== 1) {
        this.skipBranch();
    }
    return true;
};

// If Lose 如果失败
Game_Interpreter.prototype.command603 = function() {
    if (this._branch[this._indent] !== 2) {
        this.skipBranch();
    }
    return true;
};

// Shop Processing 商店处理
Game_Interpreter.prototype.command302 = function() {
    if (!$gameParty.inBattle()) {
        var goods = [this._params];
        while (this.nextEventCode() === 605) {
            this._index++;
            goods.push(this.currentCommand().parameters);
        }
        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(goods, this._params[4]);
    }
    return true;
};

// Name Input Processing 名称输入处理
Game_Interpreter.prototype.command303 = function() {
    if (!$gameParty.inBattle()) {
        if ($dataActors[this._params[0]]) {
            SceneManager.push(Scene_Name);
            SceneManager.prepareNextScene(this._params[0], this._params[1]);
        }
    }
    return true;
};

// Change HP 改变hp
Game_Interpreter.prototype.command311 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        this.changeHp(actor, value, this._params[5]);
    }.bind(this));
    return true;
};

// Change MP 改变mp
Game_Interpreter.prototype.command312 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.gainMp(value);
    }.bind(this));
    return true;
};

// Change TP 改变tp
Game_Interpreter.prototype.command326 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.gainTp(value);
    }.bind(this));
    return true;
};

// Change State 改变状态
Game_Interpreter.prototype.command313 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        var alreadyDead = actor.isDead();
        if (this._params[2] === 0) {
            actor.addState(this._params[3]);
        } else {
            actor.removeState(this._params[3]);
        }
        if (actor.isDead() && !alreadyDead) {
            actor.performCollapse();
        }
        actor.clearResult();
    }.bind(this));
    return true;
};

// Recover All 移除所有
Game_Interpreter.prototype.command314 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.recoverAll();
    }.bind(this));
    return true;
};

// Change EXP 改变经验值
Game_Interpreter.prototype.command315 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.changeExp(actor.currentExp() + value, this._params[5]);
    }.bind(this));
    return true;
};

// Change Level 改变等级
Game_Interpreter.prototype.command316 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.changeLevel(actor.level + value, this._params[5]);
    }.bind(this));
    return true;
};

// Change Parameter 改变参数
Game_Interpreter.prototype.command317 = function() {
    var value = this.operateValue(this._params[3], this._params[4], this._params[5]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.addParam(this._params[2], value);
    }.bind(this));
    return true;
};

// Change Skill 改变技能
Game_Interpreter.prototype.command318 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        if (this._params[2] === 0) {
            actor.learnSkill(this._params[3]);
        } else {
            actor.forgetSkill(this._params[3]);
        }
    }.bind(this));
    return true;
};

// Change Equipment 改变装备
Game_Interpreter.prototype.command319 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.changeEquipById(this._params[1], this._params[2]);
    }
    return true;
};

// Change Name 改变名称
Game_Interpreter.prototype.command320 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setName(this._params[1]);
    }
    return true;
};

// Change Class 改变职业
Game_Interpreter.prototype.command321 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor && $dataClasses[this._params[1]]) {
        actor.changeClass(this._params[1], false);
    }
    return true;
};

// Change Actor Images 改变角色图片
Game_Interpreter.prototype.command322 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setCharacterImage(this._params[1], this._params[2]);
        actor.setFaceImage(this._params[3], this._params[4]);
        actor.setBattlerImage(this._params[5]);
    }
    $gamePlayer.refresh();
    return true;
};

// Change Vehicle Image 改变交通工具图片
Game_Interpreter.prototype.command323 = function() {
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setImage(this._params[1], this._params[2]);
    }
    return true;
};

// Change Nickname 改变昵称
Game_Interpreter.prototype.command324 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setNickname(this._params[1]);
    }
    return true;
};

// Change Profile 改变人物简介
Game_Interpreter.prototype.command325 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setProfile(this._params[1]);
    }
    return true;
};

// Change Enemy HP 改变敌人hp
Game_Interpreter.prototype.command331 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        this.changeHp(enemy, value, this._params[4]);
    }.bind(this));
    return true;
};

// Change Enemy MP 改变敌人mp
Game_Interpreter.prototype.command332 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.gainMp(value);
    }.bind(this));
    return true;
};

// Change Enemy TP 改变敌人tp
Game_Interpreter.prototype.command342 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.gainTp(value);
    }.bind(this));
    return true;
};

// Change Enemy State 改变敌人状态
Game_Interpreter.prototype.command333 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        var alreadyDead = enemy.isDead();
        if (this._params[1] === 0) {
            enemy.addState(this._params[2]);
        } else {
            enemy.removeState(this._params[2]);
        }
        if (enemy.isDead() && !alreadyDead) {
            enemy.performCollapse();
        }
        enemy.clearResult();
    }.bind(this));
    return true;
};

// Enemy Recover All 敌人移除所有
Game_Interpreter.prototype.command334 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.recoverAll();
    }.bind(this));
    return true;
};

// Enemy Appear 敌人出现
Game_Interpreter.prototype.command335 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.appear();
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};

// Enemy Transform 敌人转变
Game_Interpreter.prototype.command336 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.transform(this._params[1]);
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};

// Show Battle Animation 显示战斗动画
Game_Interpreter.prototype.command337 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        if (enemy.isAlive()) {
            enemy.startAnimation(this._params[1], false, 0);
        }
    }.bind(this));
    return true;
};

// Force Action 强制动作
Game_Interpreter.prototype.command339 = function() {
    this.iterateBattler(this._params[0], this._params[1], function(battler) {
        if (!battler.isDeathStateAffected()) {
            battler.forceAction(this._params[2], this._params[3]);
            BattleManager.forceAction(battler);
            this.setWaitMode('action');
        }
    }.bind(this));
    return true;
};

// Abort Battle 中止战斗
Game_Interpreter.prototype.command340 = function() {
    BattleManager.abort();
    return true;
};

// Open Menu Screen 打开菜单画面
Game_Interpreter.prototype.command351 = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
    }
    return true;
};

// Open Save Screen 打开存档画面
Game_Interpreter.prototype.command352 = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Save);
    }
    return true;
};

// Game Over 游戏结束
Game_Interpreter.prototype.command353 = function() {
    SceneManager.goto(Scene_Gameover);
    return true;
};

// Return to Title Screen 转到标题画面
Game_Interpreter.prototype.command354 = function() {
    SceneManager.goto(Scene_Title);
    return true;
};

// Script 脚本
Game_Interpreter.prototype.command355 = function() {
    var script = this.currentCommand().parameters[0] + '\n';
    while (this.nextEventCode() === 655) {
        this._index++;
        script += this.currentCommand().parameters[0] + '\n';
    }
    eval(script);
    return true;
};

// Plugin Command 插件命令
Game_Interpreter.prototype.command356 = function() {
    var args = this._params[0].split(" ");
    var command = args.shift();
    this.pluginCommand(command, args);
    return true;
};
//插件的命令 
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
};
