
Scene_ItemBase.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);

    this._interpreter = new Game_Interpreter();

};



Scene_ItemBase.prototype.checkCommonEvent = function () {
    if ($gameTemp.isCommonEventReserved()) {
        //SceneManager.goto(Scene_Map);
    }
};



Scene_ItemBase.prototype.update = function () {
    Scene_MenuBase.prototype.update.call(this)
    this.updateInterpreter()
};


Scene_ItemBase.prototype.updateInterpreter = function () {
    //循环(;;)
    for (; ;) {

        /** 2w: 
         * 
         * 当事件解释器 不运转时
         *     list没有时,或者 终止时(命令没有了时)  
         * 可以运行下面的 
         * 
         * 当运转时,跳出循环
         * 
         */

        //事件解释器 更新()
        this._interpreter.update();
        //如果( 事件解释器 是运转() )
        if (this._interpreter.isRunning()) {
            //返回
            return;
        }

        /** 2w: 
         * 
         * 如果没有安装了事件,退出循环
         * 如果安装了事件,继续循环 
         * 
         */

        //如果(不是 安装开始事件() )
        if (!this.setupStartingEvent()) {
            //返回 
            return;
        }

    }
};




Scene_ItemBase.prototype.setupStartingEvent = function () {
    if (this._interpreter.setupReservedCommonEvent()) {
        //返回 true 
        return true;
    }
    if (this.setupAutorunCommonEvent()) {
        return true;
    }
    //返回 false 
    return false;
};




Scene_ItemBase.prototype.setupAutorunCommonEvent = function () {
    //循环 (开始时 i = 0 ; 当 i < 数据公共事件组 长度 ;每次 i++ )
    for (var i = 0; i < $dataCommonEvents.length; i++) {
        //事件 = 数据公共事件组[i]
        var event = $dataCommonEvents[i];
        //如果( 事件 并且 事件 触发 === 1 并且 游戏开关组 值(事件 开关id) )
        if (event && event.trigger === 1 && $gameSwitches.value(event.switchId)) {
            //事件解释器 安装 (事件 列表)
            this._interpreter.setup(event.list);
            //返回 true 
            return true;
        }
    }
    //返回 false 
    return false;
};

