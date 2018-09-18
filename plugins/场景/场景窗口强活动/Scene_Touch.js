Window_Selectable.prototype.touchOn = function () {
    if (this._canTouchActive) {
        var list = this._canTouchActive
        var active = false
        if (Array.isArray(list)) {
            for (var i = 0; i < list.length; i++) {
                var w = list[i]
                w && w.callHandler && w.callHandler(this._touchName)
                active = active || w.active
            }
        }
    }
}





Window_Selectable.prototype.touchOut = function () {
}



/**进行触摸 */
Window_Selectable.prototype.processTouch = function () {
    //如果 是打开和活动的
    if (this.isOpen()) {
        if (TouchInput.isMoved() || TouchInput.isCancelled() || TouchInput.isTriggered()) {
            if (this.isTouchedInsideFrame()) {
                if (!this._touchIn) {
                    this._touchIn = true
                    this.touchOn()
                }
            } else {
                if (this._touchIn) {
                    this._touchIn = false
                    this.touchOut()
                }
            }
        }
    }
    if (this.isOpenAndActive()) {
        //触摸输入按下 并且在框内
        if (this.isTouchedInsideFrame()) {
            var v = TouchInput.isTriggered()
            this._touching = v;
            this.onTouch(v);
            //如果 触摸是取消
        } else if (TouchInput.isCancelled()) {
            //是取消允许
            if (this.isCancelEnabled()) {
                //进行取消
                this.processCancel();
            }
        }
    } else {
        //触摸 _touching =false
        this._touching = false;
    }
};
/**是触摸内部框 */
Window_Selectable.prototype.isTouchedInsideFrame = function () {
    //x=局部x
    var x = this.canvasToLocalX(TouchInput.x);
    //y=局部y
    var y = this.canvasToLocalY(TouchInput.y);
    //返回 x,y 在框内
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};


Scene_Menu.prototype.createCommandWindow = function () {
    //命令窗口 = 新 命令窗口(0,0)
    this._commandWindow = new Window_MenuCommand(0, 0);
    //命令窗口 设置处理("item"//物品 , 命令物品 绑定(this))
    this._commandWindow.setHandler('item', this.commandItem.bind(this));
    //命令窗口 设置处理("skill"//技能 , 命令个人 绑定(this))
    this._commandWindow.setHandler('skill', this.commandPersonal.bind(this));
    //命令窗口 设置处理("equip"//装备 , 命令个人 绑定(this))
    this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
    //命令窗口 设置处理("status"//状态 , 命令个人 绑定(this))
    this._commandWindow.setHandler('status', this.commandPersonal.bind(this));
    //命令窗口 设置处理("formation"//编队 , 命令编队 绑定(this))
    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    //命令窗口 设置处理("options"//选项 , 命令选项 绑定(this))
    this._commandWindow.setHandler('options', this.commandOptions.bind(this));
    //命令窗口 设置处理("save"//保存 , 命令保存 绑定(this))
    this._commandWindow.setHandler('save', this.commandSave.bind(this));
    //命令窗口 设置处理("gameEnd"//游戏结束 , 命令结束游戏 绑定(this))
    this._commandWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
    //命令窗口 设置处理("cancel"//取消 , 删除场景 绑定(this))
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    //添加窗口(命令窗口)
    this.addWindow(this._commandWindow);
};

Scene_Menu.prototype.moveStatusWindow = function () {
    var s = this._commandWindow.currentSymbol()
    switch (s) {
        case "skill":
        case "equip":
        case "status":


            this.deactivate();
            this.commandPersonal()
            break;
        case "formation":
            this.deactivate();
            this.commandFormation()
            break;
        default:
            //this.commandOther()
            break;
    }
}






Scene_Menu.prototype.createStatusWindow = function () {
    //状态窗口 = 新 窗口菜单状态(命令窗口 宽 , 0 )
    this._statusWindow = new Window_MenuStatus(this._commandWindow.width, 0);
    this._statusWindow.reserveFaceImages();
    //添加窗口(状态窗口)
    this.addWindow(this._statusWindow);

    this._statusWindow._touchName = "statusWindow"
};


Scene_Menu.prototype.create = function () {
    //场景菜单基础 创建 呼叫(this)
    Scene_MenuBase.prototype.create.call(this);
    //创建命令窗口()
    this.createCommandWindow();
    //创建金钱窗口()
    this.createGoldWindow();
    //创建状态窗口()
    this.createStatusWindow();




    this._commandWindow._touchName = "commandWindow"

    this._commandWindow._canTouchActive = [this._statusWindow]
    this._commandWindow.setHandler('statusWindow', this.moveStatusWindow.bind(this));
    this._statusWindow._touchName = "statusWindow"
    this._statusWindow._canTouchActive = [this._commandWindow]

};




/**命令个人 */
Scene_Menu.prototype.commandPersonal = function () {
    this._statusWindow.setFormationMode(false);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok', this.onPersonalOk.bind(this));
    this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
    this._statusWindow.setHandler('commandWindow', this.onPersonalCancel.bind(this));
};

/**命令编队 */
Scene_Menu.prototype.commandFormation = function () {
    this._statusWindow.setFormationMode(true);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok', this.onFormationOk.bind(this));
    this._statusWindow.setHandler('cancel', this.onFormationCancel.bind(this));
    this._statusWindow.setHandler('commandWindow', this.onFormationCancel.bind(this));
};