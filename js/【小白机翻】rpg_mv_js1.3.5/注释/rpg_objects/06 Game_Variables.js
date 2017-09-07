
//-----------------------------------------------------------------------------
// Game_Variables
// 游戏变量组  $gameVariables
// The game object class for variables.
// 变量的游戏对象类

function Game_Variables() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Variables.prototype.initialize = function() {
	//清除
    this.clear();
};
//清除
Game_Variables.prototype.clear = function() {
	//数据 = []
    this._data = [];
};
//值
Game_Variables.prototype.value = function(variableId) {
	//返回 数据[变量id] || 0
    return this._data[variableId] || 0;
};
//设置值
Game_Variables.prototype.setValue = function(variableId, value) {
	//如果 变量id > 0 并且 变量id < 数据系统 变量组 长度
    if (variableId > 0 && variableId < $dataSystem.variables.length) {
	    //如果( 类型 值 === "number" //数字)
        if (typeof value === 'number') {
	        //值 = 向下取整(值)
            value = Math.floor(value);
        }
        //数据[变量id] = 值
        this._data[variableId] = value;
        //当改变
        this.onChange();
    }
};
//当改变
Game_Variables.prototype.onChange = function() {
	//游戏地图 请求刷新
    $gameMap.requestRefresh();
};
