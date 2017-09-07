
/**----------------------------------------------------------------------------- */
/** Scene_MenuBase */
/** 场景菜单基础  */
/** The superclass of all the menu-type scenes. */
/** 所有 菜单种类 的 超级类 */

function Scene_MenuBase() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Scene_MenuBase.prototype = Object.create(Scene_Base.prototype);
/**设置创造者 */
Scene_MenuBase.prototype.constructor = Scene_MenuBase;
/**初始化 */
Scene_MenuBase.prototype.initialize = function() {
    //场景基础 初始化 呼叫(this)
    Scene_Base.prototype.initialize.call(this);
};
/**创建 */
Scene_MenuBase.prototype.create = function() {
    //场景基础 创建 呼叫(this)
    Scene_Base.prototype.create.call(this);
    //创建背景()
    this.createBackground();
    //更新角色()
    this.updateActor();
    //创建窗口层()
    this.createWindowLayer();
};
/**角色 */
Scene_MenuBase.prototype.actor = function() {
    //返回 角色
    return this._actor;
};
/**更新角色 */
Scene_MenuBase.prototype.updateActor = function() {
    //角色 = 游戏队伍 菜单角色()
    this._actor = $gameParty.menuActor();
};
/**创建背景 */
Scene_MenuBase.prototype.createBackground = function() {
    //背景精灵 = 新 精灵()
    this._backgroundSprite = new Sprite();
    //背景精灵 位图 = 场景管理器 背景位图()
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    //添加子项(背景精灵)
    this.addChild(this._backgroundSprite);
};
/**设置背景不透明度 */
Scene_MenuBase.prototype.setBackgroundOpacity = function(opacity) {
    //背景精灵 不透明读 = 不透明度
    this._backgroundSprite.opacity = opacity;
};
/**创建帮助窗口 */
Scene_MenuBase.prototype.createHelpWindow = function() {
    //帮助窗口 = 新 窗口帮助()
    this._helpWindow = new Window_Help();
    //添加窗口(帮助窗口)
    this.addWindow(this._helpWindow);
};
/**下一个角色 */
Scene_MenuBase.prototype.nextActor = function() {
    //游戏队伍 制作菜单角色下一个()
    $gameParty.makeMenuActorNext();
    //更新角色()
    this.updateActor();
    //当角色改变()
    this.onActorChange();
};
/**之前的角色 */
Scene_MenuBase.prototype.previousActor = function() {
    //游戏队伍 制作菜单角色之前的()
    $gameParty.makeMenuActorPrevious();
    //更新角色()
    this.updateActor();
    //当角色改变()
    this.onActorChange();
};
/**当角色改变 */
Scene_MenuBase.prototype.onActorChange = function() {
};
