
//-----------------------------------------------------------------------------
// Game_SelfSwitches
// 游戏独立开关组      $gameSelfSwitches
// The game object class for self switches.
// 独立开关的游戏对象类

function Game_SelfSwitches() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_SelfSwitches.prototype.initialize = function() {
	//清除
    this.clear();
};
//清除
Game_SelfSwitches.prototype.clear = function() {
	//数据 = {}
    this._data = {};
};
//值
Game_SelfSwitches.prototype.value = function(key) {
	//返回 !! 数据[键] (数据[键])
    return !!this._data[key];
};
//设置值
Game_SelfSwitches.prototype.setValue = function(key, value) {
	//如果 值
    if (value) {
	    //数据[键] = true
        this._data[key] = true;
    //否则
    } else {
	    //删除 数据[键]
        delete this._data[key];
    }
    //当改变
    this.onChange();
};
//当改变
Game_SelfSwitches.prototype.onChange = function() {
	//游戏地图 请求刷新
    $gameMap.requestRefresh();
};
