
/**----------------------------------------------------------------------------- */
/** Window_PartyCommand */
/** 窗口队伍命令 */
/** The window for selecting whether to fight or escape on the battle screen. */
/** 战斗画面选择打架或逃跑的窗口 */

function Window_PartyCommand() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Window_PartyCommand.prototype = Object.create(Window_Command.prototype);
/**设置创造者 */
Window_PartyCommand.prototype.constructor = Window_PartyCommand;
/**初始化 */
Window_PartyCommand.prototype.initialize = function() {
    //y = 图形 盒高 - 窗口高()
    var y = Graphics.boxHeight - this.windowHeight();
    //窗口命令 初始化 呼叫(this,0,y)
    Window_Command.prototype.initialize.call(this, 0, y);
    //开放性 = 0
    this.openness = 0;
    //不活动()
    this.deactivate();
};
/**窗口宽 */
Window_PartyCommand.prototype.windowWidth = function() {
    //返回 192
    return 192;
};
/**可见行数目 */
Window_PartyCommand.prototype.numVisibleRows = function() {
    //返回 4
    return 4;
};
/**制作命令列表 */
Window_PartyCommand.prototype.makeCommandList = function() {
    //添加命令(文本管理器 战斗 ,"fight")
    this.addCommand(TextManager.fight,  'fight');
    //添加命令(文本管理器 逃跑 ,"escape" ,战斗管理器 能逃跑() )
    this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
};
/**安装 */
Window_PartyCommand.prototype.setup = function() {
    //清除命令列表()
    this.clearCommandList();
    //制作命令列表()
    this.makeCommandList();
    //刷新()
    this.refresh();
    //选择(0)
    this.select(0);
    //活动()
    this.activate();
    //打开()
    this.open();
};
