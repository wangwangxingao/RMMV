




/**安装公共事件并且更新直到结束 */
Game_Interpreter.prototype.setupChildToEnd = function (i,z) {
    //公共事件 = 数据公共事件组[参数组[0]]
    var commonEvent = $dataCommonEvents[i];
    //如果 (公共事件)
    if (commonEvent) {
        //事件id = 如果 是在当前地图() 返回 事件id 否则 返回 0 
        var eventId = this.isOnCurrentMap() ? this._eventId : 0;
        //安装子项 (公共事件 列表 ,事件id)
        this.setupChild(commonEvent.list, eventId);
        this.updateChildToEnd(z)
    }
    //返回 true
    return true;
};


/**更新直到结束 */
Game_Interpreter.prototype.updateToEnd = function (z) {
    var i = 0
    var z = z || 0
    while (this.isRunning()) {
        this.updateChildToEnd(z)
        if (SceneManager.isSceneChanging()) {
            break;
        }
        if (!this.executeCommand()) {
            break;
        }
        if (this.checkFreeze()) { 
            if (i++ >= z) {
                break;
            }
        }
    }
};

/**更新子项直到结束 */
Game_Interpreter.prototype.updateChildToEnd = function (z) {
    if (this._childInterpreter) {
        this._childInterpreter.updateToEnd(z);
    }
    this._childInterpreter = null;
};