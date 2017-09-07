
//-----------------------------------------------------------------------------
// Game_CommonEvent
// 游戏公共事件
// The game object class for a common event. It contains functionality for
// running parallel process events.
// 公共事件的游戏对象类.它包含运转事件的功能

function Game_CommonEvent() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_CommonEvent.prototype.initialize = function(commonEventId) {
    this._commonEventId = commonEventId;
    this.refresh();
};
//事件
Game_CommonEvent.prototype.event = function() {
    return $dataCommonEvents[this._commonEventId];
};
//列表
Game_CommonEvent.prototype.list = function() {
    return this.event().list;
};
//刷新
Game_CommonEvent.prototype.refresh = function() {
    if (this.isActive()) {
        if (!this._interpreter) {
            this._interpreter = new Game_Interpreter();
        }
    } else {
        this._interpreter = null;
    }
};
//是活动的
Game_CommonEvent.prototype.isActive = function() {
    var event = this.event();
    return event.trigger === 2 && $gameSwitches.value(event.switchId);
};
//更新
Game_CommonEvent.prototype.update = function() {
    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this._interpreter.setup(this.list());
        }
        this._interpreter.update();
    }
};
