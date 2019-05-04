(function () {
    var Scene_Map_prototype_snapForBattleBackground = Scene_Map.prototype.snapForBattleBackground
    Scene_Map.prototype.snapForBattleBackground = function () {
        this._spriteset._pictureContainer.visible = false
        Scene_Map_prototype_snapForBattleBackground.call(this)
        this._spriteset._pictureContainer.visible = true
    };
    var Scene_MenuBase_prototype_create = Scene_MenuBase.prototype.create
    Scene_MenuBase.prototype.create = function () {
        this._interpreter = new Game_Interpreter();
        Scene_MenuBase_prototype_create.call(this);
        this.createPictures()
    };

    Scene_MenuBase.prototype.createPictures = function () {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight;
        var x = (Graphics.width - width) / 2;
        var y = (Graphics.height - height) / 2;
        this._pictureContainer = new Sprite();
        this._pictureContainer.setFrame(x, y, width, height);
        for (var i = 1; i <= $gameScreen.maxPictures(); i++) {
            this._pictureContainer.addChild(new Sprite_Picture(i));
        }
        this.addChild(this._pictureContainer);
    };


    Scene_MenuBase.prototype.update = function() {
        this.updateInterpreter()
        //场景基础 初始化 呼叫(this)
        Scene_Base.prototype.update.call(this);
        
    };


    Scene_MenuBase.prototype.isEventRunning = function () {
        //返回 事件解释器 是运转() 或者 是任何事件开始()
        return this._interpreter.isRunning() 
    };

    /**更新事件解释器*/
    Scene_MenuBase.prototype.updateInterpreter = function () {
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

    /**安装开始事件*/
    Scene_MenuBase.prototype.setupStartingEvent = function () { 
        //如果( 事件解释器 安装储存公共事件() )
        if (this._interpreter.setupReservedCommonEvent()) {
            //返回 true 
            return true;
        }
        //如果( 安装自动公共事件() )
        if (this.setupAutorunCommonEvent()) {
            //返回 true 
            return true;
        }
        //返回 false 
        return false;
    };
    /**安装自动公共事件*/
    Scene_MenuBase.prototype.setupAutorunCommonEvent = function () {
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
   














})()