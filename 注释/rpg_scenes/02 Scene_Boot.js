
/**----------------------------------------------------------------------------- */
/** Scene_Boot */
/** 场景引导 */
/** The scene class for initializing the entire game. */
/** 这个场景类为了初始化整个游戏 */

function Scene_Boot() {
	//调用 初始化
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Scene_Boot.prototype = Object.create(Scene_Base.prototype);
/**设置创造者 */
Scene_Boot.prototype.constructor = Scene_Boot;
/**初始化 */
Scene_Boot.prototype.initialize = function() {
	//场景基础 初始化 呼叫(this)
    Scene_Base.prototype.initialize.call(this);
    //记录开始时间
    this._startDate = Date.now();
};
/**创造 */
Scene_Boot.prototype.create = function() {
	//场景基础 创造 呼叫(this)
    Scene_Base.prototype.create.call(this);
    //数据管理器 读取基本数据
    DataManager.loadDatabase();
    //配置管理器 读取
    ConfigManager.load();
    //读取系统窗口图片
    this.loadSystemWindowImage();
};
/**读取系统窗口图片 */
Scene_Boot.prototype.loadSystemWindowImage = function() {
    //图像管理器 预订系统("Window")
    ImageManager.reserveSystem('Window');
};

/**读取系统图片 */
Scene_Boot.prototype.loadSystemImages = function() {
    //图像管理器 预订系统("IconSet")
    ImageManager.reserveSystem('IconSet');
    //图像管理器 预订系统("Balloon")
    ImageManager.reserveSystem('Balloon');
    //图像管理器 预订系统("Shadow1")
    ImageManager.reserveSystem('Shadow1');
    //图像管理器 预订系统("Shadow2")
    ImageManager.reserveSystem('Shadow2');
    //图像管理器 预订系统("Damage")
    ImageManager.reserveSystem('Damage');
    //图像管理器 预订系统("States")
    ImageManager.reserveSystem('States');
    //图像管理器 预订系统("Weapons1")
    ImageManager.reserveSystem('Weapons1');
    //图像管理器 预订系统("Weapons2")
    ImageManager.reserveSystem('Weapons2');
    //图像管理器 预订系统("Weapons3")
    ImageManager.reserveSystem('Weapons3');
    //图像管理器 预订系统("ButtonSet")
    ImageManager.reserveSystem('ButtonSet');
};
/**是准备好
 * @return {boolean}
 */
Scene_Boot.prototype.isReady = function() {
	//如果 (场景基础 是准备好 呼叫(this))
    if (Scene_Base.prototype.isReady.call(this)) {
	    //返回  数据管理器 是数据库加载后()  并且  是游戏字体加载完成()
        return DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
    //否则
    } else {
        //返回 false
        return false;
    }
};
/**游戏字体加载完成 
 * @return {boolean}
*/
Scene_Boot.prototype.isGameFontLoaded = function() {
	//如果 (图形 'GameFont' 字体加载完成)
    if (Graphics.isFontLoaded('GameFont')) {
        //返回 true
        return true;
    //否则
    } else if (!Graphics.canUseCssFontLoading()){
        var elapsed = Date.now() - this._startDate;
        if (elapsed >= 60000) {
            throw new Error('Failed to load GameFont');
        }
    }
};
/**开始 */
Scene_Boot.prototype.start = function() {
	//场景基础 开始 呼叫(this)
    Scene_Base.prototype.start.call(this);
    //声音管理器 预加载重要的声音()
    SoundManager.preloadImportantSounds();
    //如果( 数据管理器 是战斗测试())
    if (DataManager.isBattleTest()) {
	    //数据管理器 加载战斗测试()
        DataManager.setupBattleTest();
        //场景管理器 转到( 场景战斗 )
        SceneManager.goto(Scene_Battle);
    //否则 如果 (数据管理器 是事件测试())
    } else if (DataManager.isEventTest()) {
	    //数据管理器 加载事件测试()
        DataManager.setupEventTest();
        //场景管理器 转到( 场景地图 )
        SceneManager.goto(Scene_Map);
    } else {
	    //检查游戏者位置()
        this.checkPlayerLocation();
        //数据管理器 加载新的游戏()
        DataManager.setupNewGame();
        //场景管理器 转到 ( 场景标题 )
        SceneManager.goto(Scene_Title);
        //窗口标题选择 初始命令位置()
        Window_TitleCommand.initCommandPosition();
    } 
    //更新文件标题
    this.updateDocumentTitle();
};
/**更新文件标题 */
Scene_Boot.prototype.updateDocumentTitle = function() {
	//文件 标题 =  数据系统 游戏标题
    document.title = $dataSystem.gameTitle;
};
/**检查游戏者位置 */
Scene_Boot.prototype.checkPlayerLocation = function() {
	//如果( 数据系统 开始地图id === 0 )
    if ($dataSystem.startMapId === 0) {
	    //抛出 新 错误 ('Player\'s starting position is not set'//游戏者的 开始位置没有设置 )
        throw new Error('Player\'s starting position is not set');
    }
};
