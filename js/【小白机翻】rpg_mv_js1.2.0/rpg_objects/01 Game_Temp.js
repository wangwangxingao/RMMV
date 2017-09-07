
//-----------------------------------------------------------------------------
// Game_Temp
// 游戏临时  $gameTemp
// The game object class for temporary data that is not included in save data.
// 不包含在保存数据中的临时数据的游戏对象

function Game_Temp() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Temp.prototype.initialize = function() {
	//是游戏测试 = 公用程序 是选项有效('test')
    this._isPlaytest = Utils.isOptionValid('test');
    //公共事件id = 0
    this._commonEventId = 0;
    //目的地x = null
    this._destinationX = null;
    //目的地y = null
    this._destinationY = null;
};
//是游戏测试
Game_Temp.prototype.isPlaytest = function() {
	//返回 是游戏测试
    return this._isPlaytest;
};
//储存公共事件
Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
	//公共事件id = commonEventId
    this._commonEventId = commonEventId;
};
//清除公共事件
Game_Temp.prototype.clearCommonEvent = function() {
	//公共事件id = 0
    this._commonEventId = 0;
};
//是公共事件储存  (是否有公共事件)
Game_Temp.prototype.isCommonEventReserved = function() {
	//返回 公共事件id > 0 
    return this._commonEventId > 0;
};
//储存的公共事件
Game_Temp.prototype.reservedCommonEvent = function() {
	//返回 数据公共事件[公共事件id]
    return $dataCommonEvents[this._commonEventId];
};
//设置目的地
Game_Temp.prototype.setDestination = function(x, y) {
	//目的地x = x
    this._destinationX = x;
    //目的地y = y
    this._destinationY = y;
};
//清除目的地
Game_Temp.prototype.clearDestination = function() {
	//目的地x = null
    this._destinationX = null;
    //目的地y = null
    this._destinationY = null;
};
//是有效的目的地
Game_Temp.prototype.isDestinationValid = function() {
	//返回 目的地x !== null 
    return this._destinationX !== null;
};
//目的地x
Game_Temp.prototype.destinationX = function() {
	//返回 目的地x
    return this._destinationX;
};
//目的地y
Game_Temp.prototype.destinationY = function() {
	//返回 目的地y
    return this._destinationY;
};
