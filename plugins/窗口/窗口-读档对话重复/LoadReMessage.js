//=============================================================================
// LoadReMessage.js
//=============================================================================

/*:
 * @plugindesc 读档时还原对话 
 * @author 汪汪
 * @version 1.0
 *  
 * @param LoadReMessage 
 * @desc  读档时还原对话 1.0 
 * @default 汪汪
 * 
 * @help  
 * 使用请注明作者 
 * 
 * 在对话时即时存档,读档后会导致跳过该对话,
 * 如果有选项则会导致选项出现问题,
 * 本插件试图解决该问题,
 * 修改了 Game_Interpreter  
 * 目前bug未知,简单测试正常,复杂测试未进行
 **/

var ww = ww || {}

ww.loadReMessage = {}
ww.loadReMessage.command101 = Game_Interpreter.prototype.command101

/** Show Text 显示文本*/
Game_Interpreter.prototype.command101 = function () {
    //如果(不是 游戏消息 是忙碌的() )
    if (!$gameMessage.isBusy()) {
        var index = this._index
        ww.loadReMessage.command101.call(this)
        $gameMessage._messageIndex = this._index
        this._index = index
    }
    //返回 false
    return false;
};

ww.loadReMessage.command102 = Game_Interpreter.prototype.command102
/** Show Choices 显示选择*/
Game_Interpreter.prototype.command102 = function () {
    //如果(不是 游戏消息 是忙碌的() )
    if (!$gameMessage.isBusy()) {
        var index = this._index
        ww.loadReMessage.command102.call(this)
        $gameMessage._messageIndex = this._index
        this._index = index
    }
    //返回 false
    return false;
};

ww.loadReMessage.command103 = Game_Interpreter.prototype.command103

Game_Interpreter.prototype.command103 = function () {
    //如果(不是 游戏消息 是忙碌的() )
    if (!$gameMessage.isBusy()) {
        var index = this._index
        ww.loadReMessage.command103.call(this)
        $gameMessage._messageIndex = this._index
        this._index = index
    }
    //返回 false
    return false;
};
ww.loadReMessage.command104 = Game_Interpreter.prototype.command104
/** Select Item 选择物品*/
Game_Interpreter.prototype.command104 = function () {
    //如果(不是 游戏消息 是忙碌的() )
    if (!$gameMessage.isBusy()) {
        var index = this._index
        ww.loadReMessage.command104.call(this)
        $gameMessage._messageIndex = this._index
        this._index = index
    }
    //返回 false 
    return false;
};

ww.loadReMessage.updateWaitMode = Game_Interpreter.prototype.updateWaitMode

Game_Interpreter.prototype.updateWaitMode = function () {
    if (this._waitMode == 'message' &&
        !$gameMessage.isBusy() &&
        $gameMessage._messageIndex
    ) {
        this._index = $gameMessage._messageIndex
    }
    return ww.loadReMessage.updateWaitMode.call(this);
};