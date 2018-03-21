//=============================================================================
//  2w_addChoices.js
//=============================================================================

/*:
 * @plugindesc  
 * 2w_addChoices ,选择窗口扩增
 * @author wangwang
 *   
 * @param  2w_addChoices
 * @desc 插件 选择窗口扩增 ,作者:汪汪
 * @default 汪汪
 * 
 * 
 * @help
 * 在显示选项之前调用脚本 
 * 
 * this.setChoices(n)
 * 拼接下面的显示选项及以下的n个显示选项
 * (如n为2,则为下面的显示选项 + 往后的显示选项 , 共3个显示选项拼在一起)
 * 
 * 
 *  
 */





Game_Interpreter.prototype.addChoicesClear =  Game_Interpreter.prototype.clear  

Game_Interpreter.prototype.clear = function () {
    this.addChoicesClear()
    this._addChoices = 0
    this._choicesBranch = {}
};

/**增加显示选项
 * @param {number} n
 */
Game_Interpreter.prototype.addChoices = function (n) {
    this._addChoices = n  
    delete this._choicesBranch[this._indent] 
};

 
/** Show Text 显示文本*/
Game_Interpreter.prototype.command101 = function () {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setFaceImage(this._params[0], this._params[1]);
        $gameMessage.setBackground(this._params[2]);
        $gameMessage.setPositionType(this._params[3]);
        while (this.nextEventCode() === 401) {
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        switch (this.nextEventCode()) {
            case 102:  // Show Choices 显示选项 
                this._index++;
                this.setupAddChoices()
                //this.setupChoices(this.currentCommand().parameters);
                break;
            case 103:  // Input Number 输入数字 
                this._index++;
                this.setupNumInput(this.currentCommand().parameters);
                break;
            case 104:  // Select Item 选择物品 
                this._index++;
                this.setupItemChoice(this.currentCommand().parameters);
                break;
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/** Show Choices 显示选择*/
Game_Interpreter.prototype.command102 = function () { 
    if (this._choicesBranch[this._indent] && this._choicesBranch[this._indent].length) {
        var n = this._choicesBranch[this._indent].shift()
        this._branch[this._indent] -= n
        this._index++;
    } else {
        if (!$gameMessage.isBusy()) {
            this.setupAddChoices()
            this._index++;
            this.setWaitMode('message');
        }
    }
    return false;
};


 
/** 安装增加显示选项*/
Game_Interpreter.prototype.setupAddChoices = function () {
    //当前索引
    var index = this._index
    //当前命令 
    var command = this._list[index];
    //当前命令层级 
    var indent = command.indent
    //添加长度
    var addLength = [] 
    //添加选项
    var addNumber = this._addChoices
    this._addChoices = 0
    //选项组
    var choices = []

    var params = this.currentCommand().parameters 
    addLength.push(params[0].length)
    choices = choices.concat(params[0]) 

    var addParams = []
    for (var i = 0; i < params.length; i++) {
        addParams[i] = params[i]
    }

    while (addNumber) {
        index++
        var command = this._list[index];
        if (command) {
            if (command.code == 102 && command.indent == indent) {
                var params = command.parameters
                addLength.push(params[0].length)
                choices = choices.concat(params[0])
                addNumber--
            }
        } else {
            break
        }
    }
    //删除最后的长度
    addLength.pop()
    //设置本分支长度 
    this._choicesBranch[indent] = addLength

    //添加新选项组
    addParams[0] = choices
    this.setupChoices(addParams);
    return;
};


 