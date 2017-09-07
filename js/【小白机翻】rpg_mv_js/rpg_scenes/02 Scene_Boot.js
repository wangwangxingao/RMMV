
//-----------------------------------------------------------------------------
// Scene_Boot
// 引导场景 
// The scene class for initializing the entire game.
// 这个场景类为了初始化整个游戏

function Scene_Boot() {
	//调用 初始化
    this.initialize.apply(this, arguments);
}
//设置原形 
Scene_Boot.prototype = Object.create(Scene_Base.prototype);
//设置创造者
Scene_Boot.prototype.constructor = Scene_Boot;
//初始化
Scene_Boot.prototype.initialize = function() {
	//继承 基础场景 初始化
    Scene_Base.prototype.initialize.call(this);
    //记录开始时间
    this._startDate = Date.now();
};
//创造
Scene_Boot.prototype.create = function() {
	//继承 基础场景 创造
    Scene_Base.prototype.create.call(this);
    //数据管理器 读取基本数据
    DataManager.loadDatabase();
    //配置管理器 读取
    ConfigManager.load();
    //读取系统图片
    this.loadSystemImages();
};
//读取系统图片
Scene_Boot.prototype.loadSystemImages = function() {
    ImageManager.loadSystem('Window');
    ImageManager.loadSystem('IconSet');
    ImageManager.loadSystem('Balloon');
    ImageManager.loadSystem('Shadow1');
    ImageManager.loadSystem('Shadow2');
    ImageManager.loadSystem('Damage');
    ImageManager.loadSystem('States');
    ImageManager.loadSystem('Weapons1');
    ImageManager.loadSystem('Weapons2');
    ImageManager.loadSystem('Weapons3');
    ImageManager.loadSystem('ButtonSet');
};
//是准备好
Scene_Boot.prototype.isReady = function() {
	//如果 (继承 基础场景 是准备好)
    if (Scene_Base.prototype.isReady.call(this)) {
	    //返回  数据管理器 基础数据 读取完成  并且  游戏字体加载完成
        return DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
    } else {
        return false;
    }
};
//游戏字体加载完成
Scene_Boot.prototype.isGameFontLoaded = function() {
	//如果 (图形 'GameFont' 字体加载完成)
    if (Graphics.isFontLoaded('GameFont')) {
        return true;
    } else {
	    //过去的时间 =  时间 - 开始时间
        var elapsed = Date.now() - this._startDate;
        //如果过去的时间 大于 20000
        if (elapsed >= 20000) {
	        //抛出新错误 读取'GameFont' 失败
            throw new Error('Failed to load GameFont');
        }
    }
};
//开始
Scene_Boot.prototype.start = function() {
	//继承 场景基础开始
    Scene_Base.prototype.start.call(this);
    //声音管理器 预加载重要的声音
    SoundManager.preloadImportantSounds();
    //如果数据管理器 是战斗测试
    if (DataManager.isBattleTest()) {
	    //数据管理器 加载战斗测试
        DataManager.setupBattleTest();
        //场景管理器 转到 战斗场景
        SceneManager.goto(Scene_Battle);
        //如果 数据管理器 是事件测试 
    } else if (DataManager.isEventTest()) {
	    //数据管理器 加载事件测试
        DataManager.setupEventTest();
        //场景管理器 转到 地图场景
        SceneManager.goto(Scene_Map);
    } else {
	    //检查游戏者位置
        this.checkPlayerLocation();
        //数据管理器 加载新的游戏
        DataManager.setupNewGame();
        //场景管理器 转到 标题场景
        SceneManager.goto(Scene_Title);
        //标题选择窗口 初始命令位置
        Window_TitleCommand.initCommandPosition();
    } 
    //更新 文件标题
    this.updateDocumentTitle();
};
//更新 文件标题
Scene_Boot.prototype.updateDocumentTitle = function() {
	//设置文件标题 为  数据:系统的游戏标题
    document.title = $dataSystem.gameTitle;
};
//检查游戏者位置
Scene_Boot.prototype.checkPlayerLocation = function() {
	//如果 数据:系统的开始地图id 全等于 0 
    if ($dataSystem.startMapId === 0) {
	    //抛出新的错误 游戏者的 开始位置没有设置 
        throw new Error('Player\'s starting position is not set');
    }
};
