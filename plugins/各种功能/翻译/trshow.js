
//=============================================================================
// trshow.js
//=============================================================================
/*:
 * @plugindesc 可视化进行翻译
 * @author wangwang
 * 
 * @param  trshow 
 * @desc 插件 可视化进行翻译 ,作者:汪汪
 * @default  汪汪
 *
 * @help 
 * 
 * SceneManager.push(Scene_TranslateOptions)
 * 
 * 
 */





function Scene_TranslateOptions() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Scene_TranslateOptions.prototype = Object.create(Scene_MenuBase.prototype);
/**设置创造者 */
Scene_TranslateOptions.prototype.constructor = Scene_TranslateOptions;
/**初始化 */
Scene_TranslateOptions.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};
/**创建 */
Scene_TranslateOptions.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow()
    this.createOptionsWindow();

    this._optionsWindow.setHelpWindow(this._helpWindow)
};
/**终止 */
Scene_TranslateOptions.prototype.terminate = function () {
    var i = this._optionsWindow._language
    if (i >= 0) {
        ConfigManager.language = i
        ConfigManager.save();
    }
    Scene_MenuBase.prototype.terminate.call(this);

};


/**创建选项窗口 */
Scene_TranslateOptions.prototype.createOptionsWindow = function () {
    this._optionsWindow = new Window_TranslateOptions();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
};



function Window_TranslateOptions() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Window_TranslateOptions.prototype = Object.create(Window_Command.prototype);
/**设置创造者 */
Window_TranslateOptions.prototype.constructor = Window_TranslateOptions;
/**初始化 */
Window_TranslateOptions.prototype.initialize = function () {

    this._language = ww.trch.language
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.select(this._language);

};
/**窗口宽 */
Window_TranslateOptions.prototype.windowWidth = function () {
    return 400;
};
/**窗口高 */
Window_TranslateOptions.prototype.windowHeight = function () {
    return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
};
/**更新位置 */
Window_TranslateOptions.prototype.updatePlacement = function () {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};
/**制作命令列表 */
Window_TranslateOptions.prototype.makeCommandList = function () {
    var l = ww.trch.languages
    for (var i = 0; i < l.length; i++) {
        var n = l[i]
        this.addCommand(n, n);
    }
};
/**绘制项目 */
Window_TranslateOptions.prototype.drawItem = function (index) {
    var rect = this.itemRectForText(index);
    // var statusWidth = this.statusWidth(); 
    this.resetTextColor();
    this.changePaintOpacity((index == this._language ? true : false));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'left');
    //this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
};



Window_TranslateOptions.prototype.isOkEnabled = function () {
    //返回 是处理者ok
    return true;
};
/**处理确定 */
Window_TranslateOptions.prototype.processOk = function () {
    var index = this.index();
    this._language = index
    ww.trch.changeLanguageData("translate", this._language)
    this.refresh()
    this.callUpdateHelp()
};

/**更新帮助 */
Window_TranslateOptions.prototype.updateHelp = function () {
    //帮助窗口 清除()
    if (ww.trch.translates && this._helpWindow) {
        this._helpWindow.setText("当前语言:" + ww.trch.translates["语言"] || "")
    }
    //this._helpWindow.clear();
};






var Scene_Title_prototype_createCommandWindow = Scene_Title.prototype.createCommandWindow 
Scene_Title.prototype.createCommandWindow = function () {
    Scene_Title_prototype_createCommandWindow.call(this) 
    this._commandWindow.setHandler('trans', this.commandTrans.bind(this));
 

};



Scene_Title.prototype.commandTrans = function () {
    //命令窗口 关闭()
    this._commandWindow.close();
    //场景管理器 转到(Scene_Map//场景读取)
    SceneManager.push(Scene_TranslateOptions);
};




var Window_TitleCommand_prototype_makeCommandList = Window_TitleCommand.prototype.makeCommandList 
Window_TitleCommand.prototype.makeCommandList = function () {
    Window_TitleCommand_prototype_makeCommandList.call(this)
    this.addCommand(ww.trch.translates["语言"], 'trans');
};


var Scene_Menu_prototype_createCommandWindow= Scene_Menu.prototype.createCommandWindow
Scene_Menu.prototype.createCommandWindow = function () {
    Scene_Menu_prototype_createCommandWindow.call(this)
    this._commandWindow.setHandler('trans', this.commandTrans.bind(this));
};


Scene_Menu.prototype.commandTrans = function () {
    SceneManager.push(Scene_TranslateOptions);
};



var Window_MenuCommand_prototype_addOptionsCommand = Window_MenuCommand.prototype.addOptionsCommand
Window_MenuCommand.prototype.addOptionsCommand = function () {
    Window_MenuCommand_prototype_addOptionsCommand.call(this)
    this.addCommand(ww.trch.translates["语言"], 'trans', true);
};