
//-----------------------------------------------------------------------------
// Game_Switches
// 游戏开关组    $gameSwitches
// The game object class for switches.
// 开关组的游戏对象类

function Game_Switches() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Switches.prototype.initialize = function() {
	//清除
    this.clear();
};
//清除
Game_Switches.prototype.clear = function() {
	//数据 = []
    this._data = [];
};
//值
Game_Switches.prototype.value = function(switchId) {
	//返回 !!数据[开关id] (数据[开关id]true或者false)
    return !!this._data[switchId];
};
//设置值
Game_Switches.prototype.setValue = function(switchId, value) {
	//如果 开关id > 0 并且 开关id < 数据系统 开关组 长度
    if (switchId > 0 && switchId < $dataSystem.switches.length) {
	    //数据[开关id] = 值
        this._data[switchId] = value;
        //当改变
        this.onChange();
    }
};
//当改变
Game_Switches.prototype.onChange = function() {
	//游戏地图 请求刷新
    $gameMap.requestRefresh();
};
