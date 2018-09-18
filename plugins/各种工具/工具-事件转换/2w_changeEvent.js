//=============================================================================
// 2w_changeEvent.js
//=============================================================================

/*:
 * @plugindesc 事件转脚本
 * @author 汪汪
 * 
 * @help 
 * 
 * 打开f8
 * changeEventPage(ei,pi)
 * ei 事件id 当pi小于0时为公共事件 
 * pi 事件的某页
 * 
 * 有选项等待的无法转化
 * 一些角色敌人的操作目前没有转化
 * 移动没有转化
 * 仅供参考
 * 
 * 
 */



Game_Interpreter.prototype.changeCommand = function () {
    //命令 =  当前命令()
    this._index = 0

    this._jscode = ""
    while (1) {
        var command = this.currentCommand();

        if (command) {
            this._params = command.parameters;
            this._indent = command.indent;
            var methodName = 'change' + command.code;

            if (typeof this[methodName] === 'function') {
                this[methodName]()
            } else {

                if (command.code) {
                    var jscode = "//本项不支持!!"
                    this.console(jscode)
                } else {
                    var jscode = ""
                    this.console(jscode)

                }
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
Game_Interpreter.prototype.change102 = function () {




    var jscode = "//选项:" + JSON.stringify(this._params)
    this.console(jscode)


    //返回 false
    return false;
};
/** When [**] 当*/
Game_Interpreter.prototype.change402 = function () {


    var jscode = "//当:" + this._params[0]
    this.console(jscode)

    //返回 true
    return true;
};

/** When Cancel  当取消*/
Game_Interpreter.prototype.change403 = function () {


    var jscode = "//当取消"
    this.console(jscode)

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
Game_Interpreter.prototype.change108 = function () {


    var jscode = "//" + this._params[0]
    this.console(jscode)
    while (this.nextEventCode() === 408) {
        //索引++
        this._index++;
        //注释 添加 (当前命令() 参数组[0] )

        var jscode = "//" + this.currentCommand().parameters[0]

        this.console(jscode)
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

            jscode += "$gameSwitches.value(" + this.changeParam(1) + ")" + "=== " + (this.changeParam(2) === 0)


            break;
        //当 1
        case 1:  // Variable 变量

            //值1 = 游戏变量组 值(参数组[1]) 
            var jscode1 = "$gameVariables.value(" + this.changeParam(1) + ")";

            if (this._params[2] === 0) {


                var jscode2 = this.changeParam(3);
            } else {

                var jscode2 = "$gameVariables.value(" + this.changeParam(3) + ")"


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

                jscode = "$gameSelfSwitches.value(" + "[this._mapId, this._eventId," + this.changeParam(1) + "]) " + " === " + (this._params[2] === 0)

            }
            //中断
            break;
        //当 3
        case 3:  // Timer  计时器


            jscode += "$gameTimer.isWorking() &&  "


            //如果(参数组[2] === 0 )
            if (this._params[2] === 0) {

                jscode += " ($gameTimer.seconds() >=" + this.changeParam(1) + ")"
                //否则
            } else {

                jscode += " ($gameTimer.seconds() <=" + this.changeParam(1) + ")"
            }
            //中断
            break;
        //当 4
        case 4:  // Actor 角色
            //角色 = 游戏角色组 角色( 参数组[1] ) 

            var jscode1 = "$gameActors.actor(" + this.changeParam(1) + ")"

            jscode += jscode1 + "&&"
            //n = 参数组[3]
            var n = this.changeParam(3);
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


            var jscode1 = "$gameTroop.members()[" + this.changeParam(1) + "]"
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
                    jscode += jscode1 + ".isStateAffected( " + this.changeParam(3) + ")"
                    //中断
                    break;
            }
            //中断
            break;
        //当 6
        case 6:  // Character 人物
            //人物 = 人物( 参数组[1] )

            var jscode1 = "this.character(" + this.changeParam(1) + ")"


            jscode += jscode1 + "&&"
            //结果 = (人物 方向() === 参数组[2] ) 
            jscode += jscode1 + ".direction()" + "===" + this.changeParam(2)
            //中断
            break;
        //当 7
        case 7:  // Gold 金钱
            //检查 (参数组[2])
            switch (this._params[2]) {
                //当 0
                case 0:  // Greater than or equal to 大于等于
                    //结果 = (游戏队伍 金钱() >= 参数组[1] )


                    jscode += "$gameParty.gold() >= " + this.changeParam(1)
                    //中断
                    break;
                //当 1
                case 1:  // Less than or equal to 小于等于
                    //结果 = (游戏队伍 金钱() <= 参数组[1] ) 
                    jscode += "$gameParty.gold() <= " + this.changeParam(1)
                    //中断
                    break;
                //当 2
                case 2:  // Less than 小于
                    //结果 = (游戏队伍 金钱() < 参数组[1] ) 
                    jscode += "$gameParty.gold() < " + this.changeParam(1)
                    //中断
                    break;
            }
            //中断
            break;
        //当 8
        case 8:  // Item 物品
            //结果 = 游戏队伍 有项目(数据物品组[ 参数组[1] ] ) 

            jscode += "$gameParty.hasItem($dataItems[" + this.changeParam(1) + "])"
            //中断
            break;
        //当 9
        case 9:  // Weapon 武器
            //结果 = 游戏队伍 有项目(数据武器组[ 参数组[1] ] )
            jscode += "$gameParty.hasItem($dataWeapons[" + this.changeParam(1) + "]," + this.changeParam(2) + ")"
            //中断
            break;
        //当 10
        case 10:  // Armor 防具
            //结果 = 游戏队伍 有项目(数据防具组[ 参数组[1] ] )
            jscode += "$gameParty.hasItem($dataArmors[" + this.changeParam(1) + "]," + this.changeParam(2) + ")"
            //中断
            break;
        //当 11
        case 11:  // Button 按键
            //结果 = 输入 是按下( 参数组[1] )
            jscode += "Input.isPressed(" + this.changeParam(1) + ")"
            //中断
            break;
        //当 12
        case 12:  // Script 脚本
            //结果 = !!运行(参数组[1] )
            jscode += "!!eval(" + this.changeParam(1) + ")"
            //中断
            break;
        //当 13
        case 13:  // Vehicle 交通工具
            //结果 = (游戏游戏者 交通工具() === 游戏地图 交通工具(参数[1])  ) 
            jscode += "$gamePlayer.vehicle() === $gameMap.vehicle(" + this.changeParam(1) + ")"
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
Game_Interpreter.prototype.change117 = function () {
    //公共事件 = 数据公共事件组[参数组[0]]

    var jscode = "//公共事件 " + this._params[0];
    this.console(jscode)
    return true;
};

/** Label 标签*/
Game_Interpreter.prototype.change118 = function () {
    //返回 true
    var jscode = "//标签 " + this.changeParam(0);
    this.console(jscode)

    return true;
};

/** Jump to Label 跳到标签*/
Game_Interpreter.prototype.command119 = function () {


    //返回 true
    var jscode = "//跳到标签 " + this.changeParam(0);
    this.console(jscode)
    //返回 true
    return true;
}; 

/** Control Switches 操作开关*/
Game_Interpreter.prototype.change121 = function () {


    var jscode = " for (var i = " + this.changeParam(0) + "; i <=" + this.changeParam(1) + "; i++) {" + "$gameSwitches.setValue(i," + (this._params[2] === 0) + ")}";

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
            var jscode1 = this.changeParam(4)
            //中断
            break;
        //当 1
        case 1:  // Variable 变量
            //值 = 游戏变量组 值( 参数组[4] ) 
            var jscode1 = "$gameVariables.value(" + this.changeParam(4) + ")"
            //中断
            break;
        //当 2
        case 2:  // Random 随机数
            //值 = 参数组[4] + 数学 随机整数 (参数组[5] - 参数组[4] +1 )

            for (var i = this._params[0]; i <= this._params[1]; i++) {
                jscode += "this.operateVariable(" + i + ", " + this.changeParam(2) + "," + this.changeParam(4) + "+ Math.randomInt(" + this.changeParam(5) - this.changeParam(4) + 1 + "))";
            }
            return true;
            //中断
            break;
        //当 2
        case 3:  // Game Data 游戏数据 
            var jscode1 = "this.gameDataOperand(" + this.changeParam(4) + "," + this.changeParam(5) + "," + this._params[6] + ")";
            //中断
            break;
        //当 4
        case 4:  // Script 脚本 
            var jscode1 = "eval(" + this.changeParam(4) + ")";
            //中断
            break;
    }

    jscode += "var value = " + jscode1 + ";"
    //循环 (开始时 i = 参数组[0] ; 当 i <= 参数组[1] ; i++)
    for (var i = this._params[0]; i <= this._params[1]; i++) {
        jscode += ";this.operateVariable(" + i + "," + this.changeParam(2) + ", value)";
    }
    //返回 true
    this.console(jscode)
    return true;
};



/** Control Self Switch 操作独立开关*/
Game_Interpreter.prototype.change123 = function () {

    var jscode = "this._eventId > 0 && $gameSelfSwitches.value(" + "[this._mapId, this._eventId," + this.changeParam(0) + "]) " + " === " + (this._params[1] === 0)
    //返回 true
    this.console(jscode)
    return true;
};

/** Control Timer 操作计时器*/
Game_Interpreter.prototype.change124 = function () {
    if (this._params[0] === 0) {
        var jscode = "$gameTimer.start(" + this.changeParam(1) + " * 60)"

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
    var jscode1 = " this.operateValue(" + this.changeParam(0) + "," + this.changeParam(1) + "," + this.changeParam(2) + ")";
    //游戏队伍 获得金钱(值)

    var jscode = " $gameParty.gainGold(" + jscode1 + ")"

    //返回 true
    this.console(jscode)
    return true;
};

/** Change Items 改变物品*/
Game_Interpreter.prototype.change126 = function () {

    var jscode1 = " this.operateValue(" + this.changeParam(1) + "," + this.changeParam(2) + "," + this.changeParam(3) + ")";

    var jscode = "$gameParty.gainItem($dataItems[" + this.changeParam(0) + "] ," + jscode1 + ")"

    //返回 true
    this.console(jscode)
    return true;
};

/** Change Weapons 改变武器*/
Game_Interpreter.prototype.change127 = function () {

    var jscode1 = " this.operateValue(" + this.changeParam(1) + "," + this.changeParam(2) + "," + this.changeParam(3) + ")";


    var jscode = "$gameParty.gainItem($dataWeapons[" + this.changeParam(0) + "] ," + jscode1 + "," + this.changeParam(4) + ")"
    //返回 true
    this.console(jscode)
    return true;
};

/** Change Armors 改变防具*/
Game_Interpreter.prototype.change128 = function () {
    var jscode1 = " this.operateValue(" + this.changeParam(1) + "," + this.changeParam(2) + "," + this.changeParam(3) + ")";

    var jscode = "$gameParty.gainItem($dataArmors[" + this.changeParam(0) + "] ," + jscode1 + "," + this.changeParam(4) + ")"

    //返回 true
    this.console(jscode)
    return true;
};

/** Change Party Member 改变队伍成员*/
Game_Interpreter.prototype.change129 = function () {

    var jscode1 = " $gameActors.actor(" + this.changeParam(0) + ")"

    var jscode = "if(" + jscode1 + "){"

    //如果 (参数组[1] === 0 )
    if (this._params[1] === 0) {  // Add 增加
        //如果 ( 参数组[2] )
        if (this._params[2]) {   // Initialize 初始化
            //游戏角色组 角色( 参数组[0] 安装(参数组[0]) )
            jscode += "$gameActors.actor(" + this.changeParam(0) + ").setup(" + this.changeParam(0) + ");";
        }
        //游戏队伍 增加角色( 参数组[0] )
        jscode += "$gameParty.addActor(" + this.changeParam(0) + ") ";
    } else {  // Remove 移除
        //游戏队伍 移除角色( 参数组[0] )
        jscode += "$gameParty.removeActor(" + this.changeParam(0) + ")";
    }

    jscode += "}"
    //返回 true
    this.console(jscode)
    return true;
};

/** Change Battle BGM 改变战斗bgm*/
Game_Interpreter.prototype.change132 = function () {
    //游戏系统 设置战斗bgm( 参数组[0] ) 
    var jscode = " $gameSystem.setBattleBgm(" + this.changeParam(0) + ")"

    //返回 true
    this.console(jscode)
    return true;
};

/** Change Victory ME 改变胜利me*/
Game_Interpreter.prototype.change133 = function () {
    var jscode = " $gameSystem.setVictoryMe(" + this.changeParam(0) + ")"
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
    var jscode = " $gameSystem.setWindowTone(" + this.changeParam(0) + ")"

    this.console(jscode)
    return true;
};

/** Change Defeat ME 改变失败me*/
Game_Interpreter.prototype.change139 = function () {
    //游戏系统 设置失败me( 参数组[0] )
    var jscode = " $gameSystem.setDefeatMe(" + this.changeParam(0) + ")"


    this.console(jscode)
    return true;
};

/** Change Vehicle BGM 改变交通工具bgm*/
Game_Interpreter.prototype.change140 = function () {


    var jscode1 = " $gameMap.vehicle(" + this.changeParam(0) + ")"
    var jscode = jscode1 + " && " + jscode1 + ".setBgm(" + this.changeParam(1) + ")"

    this.console(jscode)
    return true;
};

/** Transfer Player 传送游戏者*/
Game_Interpreter.prototype.change201 = function () {
    //如果( 不是 游戏队伍 在战斗() 并且 不是 游戏消息 是忙碌的() )





    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 false
    return false;
};

/** Set Vehicle Location 设置交通工具位置*/
Game_Interpreter.prototype.change202 = function () {
    //地图id  , x , y
    var mapId, x, y;
    //如果(参数组[1] === 0 )
    if (this._params[1] === 0) {  // Direct designation 直接指定
        //地图id = 参数组[2]
        mapId = this.changeParam(2);


        x = this.changeParam(3)
        y = this.changeParam(4)


    } else {

        mapId = "$gameVariables.value(" + this.changeParam(2) + ")"
        x = "$gameVariables.value(" + this.changeParam(3) + ")"
        y = "$gameVariables.value(" + this.changeParam(4) + ")"

    }

    var vehicle = "$gameMap.vehicle(" + this.changeParam(0) + ")";

    var jscode = vehicle + " &&  " + vehicle + ".setLocation(" + mapId + "," + x + "," + y + ")"
    this.console(jscode)
    //返回 true
    return true;
};

/** Set Event Location 设置事件位置*/
Game_Interpreter.prototype.change203 = function () {

    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Scroll Map 滚动地图*/
Game_Interpreter.prototype.change204 = function () {

    var jscode = "//本项不支持!!"
    this.console(jscode)



    //返回 true
    return true;
};

/** Set Movement Route 设置移动路线*/
Game_Interpreter.prototype.change205 = function () {
    var jscode = "//本项不支持!!"
    this.console(jscode)

    //返回 true
    return true;
};

/** Getting On and Off Vehicles 上下交通工具*/
Game_Interpreter.prototype.change206 = function () {


    var jscode = " $gamePlayer.getOnOffVehicle()"
    this.console(jscode)

    //返回 true
    return true;
};

/** Change Transparency 改变透明度*/
Game_Interpreter.prototype.change211 = function () {

    var jscode = "$gamePlayer.setTransparent(" + this._params[0] === 0 + ")"
    this.console(jscode)
    //返回 true
    return true;
};

/** Show Animation 显示动画*/
Game_Interpreter.prototype.change212 = function () {
    var jscode = "//本项不支持!!"
    this.console(jscode)

    //返回 true
    return true;
};

/** Show Balloon Icon 显示气球图标*/
Game_Interpreter.prototype.change213 = function () {
    var jscode = "//本项不支持!!"
    this.console(jscode)

    //返回 true
    return true;
};

/** Erase Event 抹去事件*/
Game_Interpreter.prototype.change214 = function () {
    //如果( 是在当前地图() 并且 事件id > 0 )



    var jscode = "if (this.isOnCurrentMap() && this._eventId > 0) { $gameMap.eraseEvent(this._eventId); }"
    this.console(jscode)

    //返回 true
    return true;
};

/** Change Player Followers 改变游戏者从者*/
Game_Interpreter.prototype.change216 = function () {

    var jscode = ""
    //如果(参数组[0] === 0 )
    if (this._params[0] === 0) {
        //游戏游戏者 显示从者()
        jscode += " $gamePlayer.showFollowers()";
        //否则
    } else {
        //游戏游戏者 隐藏从者()
        jscode += " $gamePlayer.hideFollowers()";

    }
    //游戏游戏者 刷新() 

    jscode = " ;$gamePlayer.refresh();"
    this.console(jscode)



    //返回 true
    return true;
};

/** Gather Followers 集合从者*/
Game_Interpreter.prototype.change217 = function () {
    var jscode = "//本项不支持!!"
    this.console(jscode)

    //返回 true
    return true;
};

/** Fadeout Screen 淡出屏幕*/
Game_Interpreter.prototype.change221 = function () {

    var jscode = "//本项不支持!!"
    this.console(jscode)

    //返回 false
    return false;
};

/** Fadein Screen 淡入屏幕*/
Game_Interpreter.prototype.change222 = function () {

    var jscode = "//本项不支持!!"
    this.console(jscode)

    //返回 false
    return false;
};

/** Tint Screen 屏幕色调*/
Game_Interpreter.prototype.change223 = function () {


    var jscode = "//本项不支持!!"
    this.console(jscode)



    //返回 true
    return true;
};

/** Flash Screen 屏幕闪烁*/
Game_Interpreter.prototype.change224 = function () {
    var jscode = "//本项不支持!!"
    this.console(jscode)

    //返回 true
    return true;
};

/** Shake Screen 屏幕震动*/
Game_Interpreter.prototype.change225 = function () {


    var jscode = "//本项不支持!!"
    this.console(jscode)

    //返回 true
    return true;
};

/** Wait 等待*/
Game_Interpreter.prototype.change230 = function () {



    var jscode = "//本项不支持!!"
    this.console(jscode)

    //返回 true
    return true;
};

/** Show Picture 显示图片*/
Game_Interpreter.prototype.change231 = function () {
    //x,y
    var x, y;
    //如果(参数组[3] === 0 )
    if (this._params[3] === 0) {  // Direct designation 直接指定 
        //x = 参数组[4]
        x = this.changeParam(4);
        //y = 参数组[5]
        y = this.changeParam(5);
        //否则
    } else {  // Designation with variables 变量指定
        //x = 游戏变量组 值(参数组[4])
        x = "$gameVariables.value(" + this.changeParam(4) + ")"
        y = "$gameVariables.value(" + this.changeParam(5) + ")"

    }

    var jscode = "$gameScreen.showPicture(" +
        this.changeParam(0) + "," + this.changeParam(1) + "," + this.changeParam(2) + "," +
        x + "," + y + "," + this.changeParam(6) + "," + this.changeParam(7) + "," + this.changeParam(8) + "," + this.changeParam(9) + ")";
    this.console(jscode)


    //返回 true
    return true;
};

/** Move Picture 移动图片*/
Game_Interpreter.prototype.change232 = function () {
    //x,y
    var x, y;
    //如果(参数组[3] === 0 )
    if (this._params[3] === 0) {  // Direct designation 直接指定 
        x = this.changeParam(4);
        //y = 参数组[5]
        y = this.changeParam(5);
        //否则
    } else {  // Designation with variables 变量指定
        //x = 游戏变量组 值(参数组[4])
        x = "$gameVariables.value(" + this.changeParam(4) + ")"
        y = "$gameVariables.value(" + this.changeParam(5) + ")"
    }


    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Rotate Picture 旋转图片*/
Game_Interpreter.prototype.change233 = function () {


    var jscode = "$gameScreen.rotatePicture(" + this.changeParam(0) + "," + this.changeParam(1) + ")";
    this.console(jscode)
    //返回 true
    return true;
};

/** Tint Picture 图片色调*/
Game_Interpreter.prototype.change234 = function () {


    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Erase Picture 抹去图片*/
Game_Interpreter.prototype.change235 = function () {

    var jscode = "$gameScreen.erasePicture(" + this.changeParam(0) + ")";
    this.console(jscode)
    //返回 true
    return true;
};

/** Set Weather Effect 设置天气效果*/
Game_Interpreter.prototype.change236 = function () {

    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Play BGM 播放bgm*/
Game_Interpreter.prototype.change241 = function () {
    //音频管理器 播放bgm(参数组[0]) 

    var jscode = "AudioManager.playBgm(" + this.changeParam(0) + ")";
    this.console(jscode)
    //返回 true
    return true;
};

/** Fadeout BGM 淡出bgm*/
Game_Interpreter.prototype.change242 = function () {


    var jscode = "AudioManager.fadeOutBgm(" + this.changeParam(0) + ")";
    this.console(jscode)
    //返回 true
    return true;
};

/** Save BGM 保存bgm*/
Game_Interpreter.prototype.change243 = function () {

    var jscode = "gameSystem.saveBgm()";
    this.console(jscode)
    //返回 true
    return true;
};

/** Resume BGM 重播bgm*/
Game_Interpreter.prototype.change244 = function () {


    var jscode = "gameSystem.replayBgm()";
    this.console(jscode)
    //返回 true
    return true;
};

/** Play BGS 播放bgs*/
Game_Interpreter.prototype.change245 = function () {



    var jscode = "AudioManager.playBgs(" + this.changeParam(0) + ")";
    this.console(jscode)
    //返回 true
    return true;
};

/** Fadeout BGS 淡出bgs*/
Game_Interpreter.prototype.change246 = function () {


    var jscode = "AudioManager.fadeOutBgs(" + this.changeParam(0) + ")";
    this.console(jscode)
    //返回 true
    return true;
};

/** Play ME 播放me*/
Game_Interpreter.prototype.change249 = function () {

    var jscode = "AudioManager.playMe(" + this.changeParam(0) + ")";
    this.console(jscode)
    //返回 true
    return true;
};

/** Play SE 播放se*/
Game_Interpreter.prototype.change250 = function () {


    var jscode = "AudioManager.playSe(" + this.changeParam(0) + ")";
    this.console(jscode)
    //返回 true
    return true;
};

/** Stop SE 停止se*/
Game_Interpreter.prototype.change251 = function () {
    //音频管理器 停止se()
    AudioManager.stopSe();

    var jscode = "AudioManager.stopSe()";
    this.console(jscode)
    //返回 true
    return true;
};

/** Play Movie 播放影片*/
Game_Interpreter.prototype.change261 = function () {



    var jscode = "//本项不支持!!"
    this.console(jscode)
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
Game_Interpreter.prototype.change281 = function () {


    var jscode = ""

    //如果(参数组[0] === 0 )
    if (this._params[0] === 0) {
        //游戏地图 能够名称显示()
        var jscode = "$gameMap.enableNameDisplay()";
        //否则
    } else {
        //游戏地图 禁止名称显示()
        var jscode = "$gameMap.disableNameDisplay()";

    }


    this.console(jscode)
    //返回 true
    return true;
};

/** Change Tileset 改变图块设置*/
Game_Interpreter.prototype.change282 = function () {
    var jscode = "//本项不支持!!"
    this.console(jscode)
    return true;


};

/** Change Battle Back 更改战斗背景*/
Game_Interpreter.prototype.change283 = function () {




    var jscode = "$gameMap.changeBattleback(" + this.changeParam(0) + "," + this.changeParam(1) + ")";
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Parallax 更改远景图*/
Game_Interpreter.prototype.change284 = function () {
    //游戏地图 改变远景图(参数组[0], 参数组[1], 参数组[2], 参数组[3], 参数组[4])





    var jscode = "$gameMap.changeParallax(" + this.changeParam(0) + "," +
        this.changeParam(1) + this.changeParam(2) + "," +
        this.changeParam(3) + this.changeParam(4) + ")";
    this.console(jscode)
    //返回 true
    return true;
};

/** Get Location Info 获得位置消息*/
Game_Interpreter.prototype.change285 = function () {


    var jscode = ""
    var x, y, value;
    if (this._params[2] === 0) {  // Direct designation 直接指定

        x = this.changeParam(3)
        y = this.changeParam(4)

    } else {  // Designation with variables 变量指定        
        //x = 游戏变量组 值( 参数组[3])

        x = "$gameVariables.value(" + this.changeParam(3) + ")"
        y = "$gameVariables.value(" + this.changeParam(4) + ")"

    }
    //检查(参数组[1])
    switch (this._params[1]) {
        //当 0 
        case 0:     // Terrain Tag 地区标签
            //值 = 游戏地图 地域标签(x,y) 
            value = "$gameMap.terrainTag( " + x + "," + y + ")"
            break;
        //当 1
        case 1:     // Event ID 事件id
            //值 = 游戏地图 xy处事件id(x,y) 
            value = "$gameMap.eventIdXy( " + x + "," + y + ")"
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
            value = "$gameMap.tileId( " + x + "," + y + "," + + this.changeParam(1) - 2 + ")"

            //中断
            break;
        //缺省
        default:    // Region ID 区域id   
            value = "$gameMap.regionId( " + x + "," + y + ")"
            //中断
            break;
    }
    jscode += "$gameVariables.setValue( " + this.changeParam(0) + "," + value + ")"
    //返回 true

    this.console(jscode)
    return true;
};

/** Battle Processing 战斗处理*/
Game_Interpreter.prototype.change301 = function () {

    var jscode = "//本项不支持!!"
    this.console(jscode)

    //返回 true
    return true;
};

/** If Win 如果胜利*/
Game_Interpreter.prototype.change601 = function () {
    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** If Escape 如果逃跑*/
Game_Interpreter.prototype.chagne602 = function () {
    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** If Lose 如果失败*/
Game_Interpreter.prototype.chagne603 = function () {
    //如果 ( 分支[缩进] !==  2 )
    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Shop Processing 商店处理*/
Game_Interpreter.prototype.change302 = function () {
    //如果( 不是 游戏队伍 在战斗() )

    var jscode = ""
    jscode += " if (!$gameParty.inBattle()) { \n"
    var goods = [this._params];
    //当 (下一个事件编码() === 605 )
    while (this.nextEventCode() === 605) {
        this._index++;
        goods.push(this.currentCommand().parameters);
    }
    jscode += "  SceneManager.push(Scene_Shop)  \n";
    //场景管理器 准备下一个场景(货物组 , 参数组[4])
    jscode += "SceneManager.prepareNextScene(" + JSON.stringify(goods) + "," + this.changeParam(4) + ")  \n";

    jscode += " } \n"
        ;


    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Name Input Processing 名称输入处理*/
Game_Interpreter.prototype.change303 = function () {

    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change HP 改变hp*/
Game_Interpreter.prototype.change311 = function () {
    //值 = 操作数值(参数组[2] ,参数组[3],参数组[4] )
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //改变hp(角色 ,值, 参数组[5])
        this.changeHp(actor, value, this._params[5]);
    }.bind(this));

    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change MP 改变mp*/
Game_Interpreter.prototype.change312 = function () {
    //值 = 操作数值(参数组[2] ,参数组[3],参数组[4] )
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 获得mp(值)
        actor.gainMp(value);
    }.bind(this));


    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change TP 改变tp*/
Game_Interpreter.prototype.change326 = function () {
    //值 = 操作数值(参数组[2] ,参数组[3],参数组[4] )
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 获得tp(值)
        actor.gainTp(value);
    }.bind(this));


    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change State 改变状态*/
Game_Interpreter.prototype.change313 = function () {
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


    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Recover All 移除所有*/
Game_Interpreter.prototype.change314 = function () {
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 完全恢复()
        actor.recoverAll();
        //绑定(this))
    }.bind(this));


    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change EXP 改变经验值*/
Game_Interpreter.prototype.change315 = function () {
    //值 = 操作数值(参数组[2] ,参数组[3],参数组[4] )
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 改变经验值(角色 当前经验值 () + 值 ,参数组[3])
        actor.changeExp(actor.currentExp() + value, this._params[5]);
        //绑定(this))
    }.bind(this));



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Level 改变等级*/
Game_Interpreter.prototype.change316 = function () {
    //值 = 操作数值(参数组[2] ,参数组[3],参数组[4] )
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 改变等级(角色 等级 + 值 , 参数组[5])
        actor.changeLevel(actor.level + value, this._params[5]);
        //绑定(this))
    }.bind(this));



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Parameter 改变参数*/
Game_Interpreter.prototype.change317 = function () {
    //值 = 操作数值(参数组[3] ,参数组[4],参数组[5] )
    var value = this.operateValue(this._params[3], this._params[4], this._params[5]);
    //迭代角色ex(参数组[0], 参数组[1], 方法(角色)
    this.iterateActorEx(this._params[0], this._params[1], function (actor) {
        //角色 增加参数(参数组[2],值)
        actor.addParam(this._params[2], value);
        //绑定(this))
    }.bind(this));



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Skill 改变技能*/
Game_Interpreter.prototype.change318 = function () {
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



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Equipment 改变装备*/
Game_Interpreter.prototype.change319 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色)
    if (actor) {
        //角色 改变装备通过id(参数组[1] ,参数组[2] ) 
        actor.changeEquipById(this._params[1], this._params[2]);
    }



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Name 改变名称*/
Game_Interpreter.prototype.change320 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色)
    if (actor) {
        //角色 设置名称(参数组[1])
        actor.setName(this._params[1]);
    }



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Class 改变职业*/
Game_Interpreter.prototype.change321 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色 并且 数据职业组[参数组[1]]  )
    if (actor && $dataClasses[this._params[1]]) {
        //角色 改变职业(参数组[1],参数组[2])
        actor.changeClass(this._params[1], this._params[2]);
    }



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Actor Images 改变角色图片*/
Game_Interpreter.prototype.change322 = function () {
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



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Vehicle Image 改变交通工具图片*/
Game_Interpreter.prototype.change323 = function () {
    //交通工具 = 游戏地图 交通工具(参数组[0])
    var vehicle = $gameMap.vehicle(this._params[0]);
    //如果(交通工具)
    if (vehicle) {
        //交通工具 设置图像(参数组[1],参数组[2])
        vehicle.setImage(this._params[1], this._params[2]);
    }



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Nickname 改变昵称*/
Game_Interpreter.prototype.change324 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色)
    if (actor) {
        //角色 设置昵称(参数组[1])
        actor.setNickname(this._params[1]);
    }



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Profile 改变人物简介*/
Game_Interpreter.prototype.change325 = function () {
    //角色 = 游戏角色组 角色(参数组[0])
    var actor = $gameActors.actor(this._params[0]);
    //如果(角色)
    if (actor) {
        //角色 设置人物简介(参数组[1])
        actor.setProfile(this._params[1]);
    }
    //返回 true



    var jscode = "//本项不支持!!"
    this.console(jscode)
    return true;
};

/** Change Enemy HP 改变敌人hp*/
Game_Interpreter.prototype.change331 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //改变hp(敌人,值,参数组[4])
        this.changeHp(enemy, value, this._params[4]);
        //绑定(this))
    }.bind(this));



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Enemy MP 改变敌人mp*/
Game_Interpreter.prototype.change332 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //敌人 获得mp(值)
        enemy.gainMp(value);
        //绑定(this))
    }.bind(this));



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Enemy TP 改变敌人tp*/
Game_Interpreter.prototype.change342 = function () {
    //值 = 操作数值(参数组[1] ,参数组[2],参数组[3] )
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //敌人 获得tp(值)
        enemy.gainTp(value);
        //绑定(this))
    }.bind(this));



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Change Enemy State 改变敌人状态*/
Game_Interpreter.prototype.change333 = function () {
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



    var jscode = "//本项不支持!!"
    this.console(jscode)
    return true;
};

/** Enemy Recover All 敌人移除所有*/
Game_Interpreter.prototype.change334 = function () {
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //敌人 完全恢复()
        enemy.recoverAll();
        //绑定(this))
    }.bind(this));



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Enemy Appear 敌人出现*/
Game_Interpreter.prototype.change335 = function () {
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //敌人 出现()
        enemy.appear();
        //游戏敌群 制作唯一名称()
        $gameTroop.makeUniqueNames();
        //绑定(this))
    }.bind(this));



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Enemy Transform 敌人转换*/
Game_Interpreter.prototype.change336 = function () {
    //迭代敌人索引( 参数组[0],方法(敌人)
    this.iterateEnemyIndex(this._params[0], function (enemy) {
        //敌人 转换(参数组[0])
        enemy.transform(this._params[1]);
        //游戏敌群 制作唯一名称()
        $gameTroop.makeUniqueNames();
        //绑定(this))
    }.bind(this));



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Show Battle Animation 显示战斗动画*/
Game_Interpreter.prototype.change337 = function () {
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



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Force Action 强制动作*/
Game_Interpreter.prototype.change339 = function () {
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



    var jscode = "//本项不支持!!"
    this.console(jscode)
    //返回 true
    return true;
};

/** Abort Battle 中止战斗*/
Game_Interpreter.prototype.change340 = function () {
    //战斗管理器 中止() 
    var jscode = "BattleManager.abort() "
    //返回 true
    this.console(jscode)
    return true;
};

/** Open Menu Screen 打开菜单画面*/
Game_Interpreter.prototype.change351 = function () {
    //如果(不是 游戏队伍 在战斗() )

    var jscode = "if (!$gameParty.inBattle()) { SceneManager.push(Scene_Menu); Window_MenuCommand.initCommandPosition(); }"

    //返回 true
    this.console(jscode)
    return true;
};

/** Open Save Screen 打开存档画面*/
Game_Interpreter.prototype.change352 = function () {

    var jscode = "if (!$gameParty.inBattle()){SceneManager.goto(Scene_Save)}";
    //返回 true
    this.console(jscode)
    return true;
};

/** Game Over 游戏结束*/
Game_Interpreter.prototype.change353 = function () {

    var jscode = "SceneManager.goto(Scene_Gameover)";
    //返回 true
    this.console(jscode)
    return true;
};

/** Return to Title Screen 转到标题画面*/
Game_Interpreter.prototype.change354 = function () {
    //场景管理器 转到 (场景标题)
    ;
    var jscode = "SceneManager.goto(Scene_Title)";
    //返回 true
    this.console(jscode)
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
    return true;
};

/** Plugin Command 插件命令*/
Game_Interpreter.prototype.change356 = function () {

    var args = this._params[0].split(" ");

    var command = args.shift();


    var jscode = "this.pluginCommand(" + command + "," + args + ")";

    this.console(jscode)

    return true;
};



Game_Interpreter.prototype.console = function (jscode, args) {
    this._jscode += jscode + "\n"
}



Game_Interpreter.prototype.changeParam = function (i) {
    var v = this._params[i];
    if (typeof (v) == "string") {
        return '"' + v + '"'
    } else {
        return v
    }
}


changeEventPage = function (ei, pi) {
    var pi = pi || 0

    var interpreter = new Game_Interpreter()
    if (pi < 0) {
        var page = $dataCommonEvents[ei]
    } else {
        var page = $dataMap.events[ei] && $dataMap.events[ei].pages[pi]

    }

    if (page) {
        interpreter.setup(page.list)
    }
    return interpreter.changeCommand()

}


