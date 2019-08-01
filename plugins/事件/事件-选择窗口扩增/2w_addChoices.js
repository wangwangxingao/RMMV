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
 * this.addChoices(n)
 * 拼接下面的显示选项及以下的n个显示选项
 * (如n为2,则为下面的显示选项 + 往后的显示选项 , 共3个显示选项拼在一起)
 * 
 * 
 * 设置显示选项
 * this.setAddChoices(list)
 * @param {[number]} list 数组,为显示选项的索引,第一个选项为0
 * 
 * 设置id处显示选项为index
 * this.setAddChoice(id,index)
 * @param {number} id 显示的id位置处的选项
 * @param {number} index 设置为的选项id
 * 
 * 添加显示选项
 * this.pushAddChoice(index)
 * @param {number} index 添加的选项id 
 * 
 */





Game_Interpreter.prototype.addChoicesClear = Game_Interpreter.prototype.clear

Game_Interpreter.prototype.clear = function () {
    this.addChoicesClear()
    this._addChoices = 0
    this._addChoicesParams = []
    this._setChoices = []
    this._choicesBranch = {}

};

/**增加显示选项
 * 
 * @param {number} n 
 */
Game_Interpreter.prototype.addChoices = function (n) {
    this._addChoices = n
    delete this._choicesBranch[this._indent]
};

/**增加显示选项 
 * @param {number} type 种类
 * @param {number} index 索引
 */
Game_Interpreter.prototype.setChoicesParams = function (type, index) {
    if (!Array.isArray(this._addChoicesParams)) {
        this._addChoicesParams = []
    }
    this._addChoicesParams[type] = index
};


/**设置显示选项
 * @param {[number]} list 数组,为显示选项的索引,第一个选项为0
 */
Game_Interpreter.prototype.setAddChoices = function (list) {
    this._setChoices = list || []
};


/**设置id处显示选项为index
 * @param {number} id 显示的id位置处的选项
 * @param {number} index 设置为的选项id
 */
Game_Interpreter.prototype.setAddChoice = function (id, index) {
    if (!Array.isArray(this._setChoices)) {
        this._setChoices = []
    }
    this._setChoices[id] = index
};

/**添加显示选项
 * @param {number} index 添加的选项id 
 */
Game_Interpreter.prototype.pushAddChoice = function (index) {
    if (!Array.isArray(this._setChoices)) {
        this._setChoices = []
    }
    this._setChoices[id] = index
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

    var l = params
    if (Array.isArray(l)) {
        for (var i = 0; i < l.length; i++) {
            if (l[i] !== undefined) {
                addParams[i] = l[i]
            }
        }
    }

    var l = this._addChoicesParams
    if (Array.isArray(l)) {
        for (var i = 0; i < l.length; i++) {
            if (l[i] !== undefined) {
                addParams[i] = l[i]
            }
        }
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





/**安装选择组*/
Game_Interpreter.prototype.setupChoices = function (params) {

    var choices = params[0].clone();

    var setChoices = this._setChoices
    if (setChoices && setChoices.length > 0) {
        var l = [];
        for (var i = 0; i < setChoices.length; i++) {
            l.push(choices[setChoices[i]])
        }
    }
    choices = l
    this._setChoices = []

    //选择组 = 参数组[0] 克隆()
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
        if (setChoices) {
            this._branch[this._indent] = setChoices[n];
        } else {
            this._branch[this._indent] = n;
        }
        //分支[缩进] = n
        //绑定(this) )
    }.bind(this));
};