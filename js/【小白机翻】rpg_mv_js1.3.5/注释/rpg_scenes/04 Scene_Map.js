
//-----------------------------------------------------------------------------
// Scene_Map
// 场景地图 
// The scene class of the map screen.
// 处理 地图画面 的 场景类

function Scene_Map() {
    this.initialize.apply(this, arguments);
}
//设置原形 
Scene_Map.prototype = Object.create(Scene_Base.prototype);
//设置创造者
Scene_Map.prototype.constructor = Scene_Map;
//初始化
Scene_Map.prototype.initialize = function() {
	//场景基础 初始化 呼叫(this)
    Scene_Base.prototype.initialize.call(this);
    //等待计数 = 0
    this._waitCount = 0;
    //遭遇效果持续时间 = 0 
    this._encounterEffectDuration = 0;
    //地图读取的 = false
    this._mapLoaded = false;
    //触摸计数 = 0
    this._touchCount = 0;
};
//创建
Scene_Map.prototype.create = function() {
	//场景基础 创建 呼叫(this)
    Scene_Base.prototype.create.call(this);
    //传送 = 游戏游戏者 是传送中
    this._transfer = $gamePlayer.isTransferring();
    //地图id = 如果 传送 为 游戏游戏者 新地图id 否则为 游戏地图 地图id
    var mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
    //数据管理器 读取地图数据(地图id)
    DataManager.loadMapData(mapId);
};
//是准备好
Scene_Map.prototype.isReady = function() {
	//如果 (不是 地图读取的) 并且 (数据管理器 是地图读取后) //地图数据读取后 但地图未读取的 时候
    if (!this._mapLoaded && DataManager.isMapLoaded()) {
	    //当地图读取完成
        this.onMapLoaded();
        //地图读取的 = true
        this._mapLoaded = true;
    }
    //返回 (地图读取的) 并且 (场景基础 是准备好 呼叫(this))
    return this._mapLoaded && Scene_Base.prototype.isReady.call(this);
};
//当地图读取完成
Scene_Map.prototype.onMapLoaded = function() {
	//如果 传送
    if (this._transfer) {
	    //游戏游戏者 表现传送
        $gamePlayer.performTransfer();
    }
    //创建显示对象 
    this.createDisplayObjects();
};
//开始
Scene_Map.prototype.start = function() {
	//场景基础 开始 呼叫(this)
    Scene_Base.prototype.start.call(this);
    //场景管理器 清除堆()
    SceneManager.clearStack();
    //如果( 传送 )
    if (this._transfer) {
	    //淡入为传送()
        this.fadeInForTransfer();
        //地图名称窗口 打开()
        this._mapNameWindow.open();
        //游戏地图 自动播放()
        $gameMap.autoplay();
    //不然 如果 需要淡入
    } else if (this.needsFadeIn()) {
	    //开始淡入(淡入速率,false)
        this.startFadeIn(this.fadeSpeed(), false);
    }
    //窗口呼叫中 = false
    this.menuCalling = false;
};
//更新
Scene_Map.prototype.update = function() {
	//更新目的地
    this.updateDestination();
    //更新主要 增加
    this.updateMainMultiply();
    //如果 是场景改变确定
    if (this.isSceneChangeOk()) {
	    //更新场景
        this.updateScene();
    //不然 如果 场景管理器 是下一个场景(场景战斗)
    } else if (SceneManager.isNextScene(Scene_Battle)) {
	    //更新遭遇效果
        this.updateEncounterEffect();
    }
    //更新等待计数
    this.updateWaitCount();
    //场景基础 更新 呼叫(this)
    Scene_Base.prototype.update.call(this);
};
//更新主要 增加
Scene_Map.prototype.updateMainMultiply = function() {
	//更新主要
    this.updateMain();
    //如果 是快速进行
    if (this.isFastForward()) {
	    //更新主要
        this.updateMain();
    }
};
//更新主要
Scene_Map.prototype.updateMain = function() {
	//活动 = 是活动
    var active = this.isActive();
    //游戏地图 更新(活动)
    $gameMap.update(active);
    //游戏游戏者 更新(活动)
    $gamePlayer.update(active);
    //游戏计时 更新(活动)
    $gameTimer.update(active);
    //游戏画面 更新
    $gameScreen.update();
};
//是快速进行
Scene_Map.prototype.isFastForward = function() {
	//返回 (游戏地图 是事件运行中) 并且 (不是 场景管理器 是场景改变中) 并且 (输入 是长按"ok" 或者 触摸 是长按)
    return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() &&
            (Input.isLongPressed('ok') || TouchInput.isLongPressed()));
};
//停止
Scene_Map.prototype.stop = function() {
	//场景基础 停止 呼叫(this)
    Scene_Base.prototype.stop.call(this);
    //游戏游戏者 改正
    $gamePlayer.straighten();
    //地图名称窗口 关闭
    this._mapNameWindow.close();
    //如果 需要缓慢淡出
    if (this.needsSlowFadeOut()) {
	    //开始淡出 (缓慢淡出速率 ,false)
        this.startFadeOut(this.slowFadeSpeed(), false);
    //不然 如果 场景管理器 是下一个场景(场景地图)
    } else if (SceneManager.isNextScene(Scene_Map)) {
	    //淡出为了传送
        this.fadeOutForTransfer();
    //不然 如果 场景管理器 是下一个场景(场景战斗)
    } else if (SceneManager.isNextScene(Scene_Battle)) {
	    //开始战斗
        this.launchBattle();
    }
};
//是忙碌
Scene_Map.prototype.isBusy = function() {
	//返回 ((消息窗口 并且 消息窗口是关闭中) 或者 等待计数>0 或者 遭遇效果持续时间 >0 或者 场景基础 是忙碌 呼叫(this))
    return ((this._messageWindow && this._messageWindow.isClosing()) ||
            this._waitCount > 0 || this._encounterEffectDuration > 0 ||
            Scene_Base.prototype.isBusy.call(this));
};
//终止
Scene_Map.prototype.terminate = function() {
	//场景基础 终止 呼叫(this)
    Scene_Base.prototype.terminate.call(this);
    //如果 不是 场景管理器 是下一个场景(场景战斗 )
    if (!SceneManager.isNextScene(Scene_Battle)) {
	    //精灵组 更新()
        this._spriteset.update();
        //地图名称窗口 隐藏()
        this._mapNameWindow.hide();
        //场景管理器 拍摄为了背景()
        SceneManager.snapForBackground();
    }
    //游戏画面 清除缩放
    $gameScreen.clearZoom();

    //TODO: Ivan: investigate why is it working, what keeps Scene_Map from freeing stuff
    //TODO: Ivan:调查为什么它工作，什么保持Scene_Map从冻结的东西
    this.removeChild(this._fadeSprite);
    this.removeChild(this._mapNameWindow);
    this.removeChild(this._windowLayer);
    this.removeChild(this._spriteset);
};
//需要淡入
Scene_Map.prototype.needsFadeIn = function() {
	//返回 (场景管理器 是之前的场景(场景战斗)或者(场景读取) )
    return (SceneManager.isPreviousScene(Scene_Battle) ||
            SceneManager.isPreviousScene(Scene_Load));
};
//需要淡出
Scene_Map.prototype.needsSlowFadeOut = function() {
	//返回  (场景管理器 是下一个场景(场景标题)或者(场景游戏结束) )
    return (SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover));
};
//更新等待计数
Scene_Map.prototype.updateWaitCount = function() {
	//如果 等待计数 >0
    if (this._waitCount > 0) {
	    //等待计数 --
        this._waitCount--;
        //返回 true
        return true;
    }
    //返回 false
    return false;
};
//更新目的地
Scene_Map.prototype.updateDestination = function() {
	//如果 是地图触摸确定
    if (this.isMapTouchOk()) {
	    //进行地图触摸
        this.processMapTouch();
    } else {
	    //游戏临时 清除目的地
        $gameTemp.clearDestination();
        //触摸计数 = 0
        this._touchCount = 0;
    }
};
//是地图触摸确定
Scene_Map.prototype.isMapTouchOk = function() {
	//返回 是活动() 并且 游戏游戏者 能移动()
    return this.isActive() && $gamePlayer.canMove();
};
//进行地图触摸
Scene_Map.prototype.processMapTouch = function() {
	//如果( 触摸输入 是刚按下 或者 触摸计数 >0) 
    if (TouchInput.isTriggered() || this._touchCount > 0) {
	    //如果 触摸输入 是按下
        if (TouchInput.isPressed()) {
	        //如果 (触摸计数== 0 或者 触摸计数 >= 15)
            if (this._touchCount === 0 || this._touchCount >= 15) {
	            //x = 游戏地图 画面到地图x (触摸输入x)
                var x = $gameMap.canvasToMapX(TouchInput.x);
	            //y = 游戏地图 画面到地图y (触摸输入y)
                var y = $gameMap.canvasToMapY(TouchInput.y);
                if (!TouchInput.isMousePressed()) {
                    $gameTemp.setIsMapTouched(true);
                }
                //游戏临时 设置目的地 (x,y)
                $gameTemp.setDestination(x, y);
            }
            //触摸计数 ++
            this._touchCount++;
        } else {
	        //触摸计数 = 0
            this._touchCount = 0;
            $gameTemp.setIsMapTouched(false);
        }
    }
};
//是场景改变确定
Scene_Map.prototype.isSceneChangeOk = function() {
	//返回 是活动 并且 不是 游戏消息 是忙碌
    return this.isActive() && !$gameMessage.isBusy();
};
//更新场景
Scene_Map.prototype.updateScene = function() {
	//检查游戏结束
    this.checkGameover();
    //如果 不是 场景管理器 是场景改变中
    if (!SceneManager.isSceneChanging()) {
	    //更新转移角色
        this.updateTransferPlayer();
    }
    //如果 不是 场景管理器 是场景改变中
    if (!SceneManager.isSceneChanging()) {
	    //更新遭遇
        this.updateEncounter();
    }
    //如果 不是 场景管理器 是场景改变中
    if (!SceneManager.isSceneChanging()) {
	    //更新呼叫菜单
        this.updateCallMenu();
    }
    //如果 不是 场景管理器 是场景改变中
    if (!SceneManager.isSceneChanging()) {
	    //更新呼叫调试
        this.updateCallDebug();
    }
};
//创建显示对象
Scene_Map.prototype.createDisplayObjects = function() {
	//创建精灵组
    this.createSpriteset();
	//创建地图名称窗口
    this.createMapNameWindow();
    //创建窗口层
    this.createWindowLayer();
	//创建所有窗口
    this.createAllWindows();
};
//创建精灵组
Scene_Map.prototype.createSpriteset = function() {
	//地图精灵组
    this._spriteset = new Spriteset_Map();
    //添加子代(地图精灵组)
    this.addChild(this._spriteset);
};
//创建所有窗口
Scene_Map.prototype.createAllWindows = function() {
	//创建消息窗口
    this.createMessageWindow();
    //创建滚动文本窗口
    this.createScrollTextWindow();
};
//创建地图名称窗口
Scene_Map.prototype.createMapNameWindow = function() {
	//地图名称窗口
    this._mapNameWindow = new Window_MapName();
    //添加子代(地图名称窗口)
    this.addChild(this._mapNameWindow);
};
//创建消息窗口
Scene_Map.prototype.createMessageWindow = function() {
	//消息窗口
    this._messageWindow = new Window_Message();
    //添加窗口(消息窗口)
    this.addWindow(this._messageWindow);
    ///消息窗口 替代窗口 对每一个 窗口
    this._messageWindow.subWindows().forEach(function(window) {
	    //添加窗口(窗口)
        this.addWindow(window);
    }, this);
};
//创建滚动文本窗口
Scene_Map.prototype.createScrollTextWindow = function() {
	//设置滚动文字窗口
    this._scrollTextWindow = new Window_ScrollText();
    //添加窗口(滚动文字窗口)
    this.addWindow(this._scrollTextWindow);
};
//更新转移角色
Scene_Map.prototype.updateTransferPlayer = function() {
	//如果 游戏游戏者 是传送中
    if ($gamePlayer.isTransferring()) {
	    //场景管理器 转到(场景地图)
        SceneManager.goto(Scene_Map);
    }
};
//更新遭遇
Scene_Map.prototype.updateEncounter = function() {
	//如果 游戏游戏者 执行遭遇
    if ($gamePlayer.executeEncounter()) {
	    //场景管理器 添加(场景战斗)
        SceneManager.push(Scene_Battle);
    }
};
//更新呼叫菜单
Scene_Map.prototype.updateCallMenu = function() {
	//如果 是能够菜单
    if (this.isMenuEnabled()) {
	    //如果 是菜单呼叫后
        if (this.isMenuCalled()) {
	        //菜单呼叫中 = true
            this.menuCalling = true;
        }
        //如果 (菜单呼叫中) 并且 (不是 游戏游戏者 是移动中)
        if (this.menuCalling && !$gamePlayer.isMoving()) {
	        //呼叫菜单
            this.callMenu();
        }
    } else {
	    //菜单呼叫中 = false
        this.menuCalling = false;
    }
};
//是能够菜单
Scene_Map.prototype.isMenuEnabled = function() {
	//返回 (游戏系统 是能够菜单) 并且 (不是 游戏地图 是事件运行中)
    return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
};
//是菜单呼叫后
Scene_Map.prototype.isMenuCalled = function() {
	//返回 输入 刚按下 菜单 或者 触摸输入 是取消
    return Input.isTriggered('menu') || TouchInput.isCancelled();
};
//呼叫菜单
Scene_Map.prototype.callMenu = function() {
	//声音管理器 播放ok
    SoundManager.playOk();
    //场景管理器 添加 (菜单场景)
    SceneManager.push(Scene_Menu);
    //菜单命令窗口 初始化命令位置
    Window_MenuCommand.initCommandPosition();
    //游戏临时 清除目的地
    $gameTemp.clearDestination();
    //地图名称窗口 隐藏
    this._mapNameWindow.hide();
    //等待计数 = 2
    this._waitCount = 2;
};
//更新呼叫调试
Scene_Map.prototype.updateCallDebug = function() {
	//如果 是调试呼叫后
    if (this.isDebugCalled()) {
	    //场景管理器 添加 (调试场景)
        SceneManager.push(Scene_Debug);
    }
};
//是调试呼叫后
Scene_Map.prototype.isDebugCalled = function() {
	//返回 输入 刚按下 调试 并且 游戏临时 是游戏测试
    return Input.isTriggered('debug') && $gameTemp.isPlaytest();
};
//淡入为了传送
Scene_Map.prototype.fadeInForTransfer = function() {
	//淡入种类 = 游戏游戏者 淡入种类
    var fadeType = $gamePlayer.fadeType();
    //检查 淡入种类
    switch (fadeType) {
	//当 0 当 1
    case 0: case 1:
    	//开始淡入 ( 淡入速率 ,淡入种类 ===1 )
        this.startFadeIn(this.fadeSpeed(), fadeType === 1);
        break;
    }
};
//淡出为了传送
Scene_Map.prototype.fadeOutForTransfer = function() {
	//淡入种类 = 游戏游戏者 淡入种类
    var fadeType = $gamePlayer.fadeType();
    //检查 淡入种类
    switch (fadeType) {
	//当 0 当 1
    case 0: case 1:
    	//开始淡入 ( 淡入速率 ,淡入种类 ===1 )
        this.startFadeOut(this.fadeSpeed(), fadeType === 1);
        break;
    }
};
//开始战斗
Scene_Map.prototype.launchBattle = function() {
	//战斗管理器 保存bgm和bgs
    BattleManager.saveBgmAndBgs();
    //停止音频当战斗开始
    this.stopAudioOnBattleStart();
    //声音管理器 播放战斗开始
    SoundManager.playBattleStart();
    //开始遭遇效果
    this.startEncounterEffect();
    //地图名称窗口 隐藏
    this._mapNameWindow.hide();
};
//停止音频当战斗开始
Scene_Map.prototype.stopAudioOnBattleStart = function() {
	//如果 不是 音频管理器 是当前bgm(游戏系统 战斗bgm)
    if (!AudioManager.isCurrentBgm($gameSystem.battleBgm())) {
	    //音频管理器 停止bgm
        AudioManager.stopBgm();
    }
    //音频管理器 停止bgs
    AudioManager.stopBgs();
    //音频管理器 停止me
    AudioManager.stopMe();
    //音频管理器 停止se
    AudioManager.stopSe();
};
//开始遭遇效果
Scene_Map.prototype.startEncounterEffect = function() {
	//精灵组 隐藏人物
    this._spriteset.hideCharacters();
    //遭遇效果持续时间 = 遭遇效果速率
    this._encounterEffectDuration = this.encounterEffectSpeed();
};
//更新遭遇效果
Scene_Map.prototype.updateEncounterEffect = function() {
	//如果 遭遇效果持续时间 > 0
    if (this._encounterEffectDuration > 0) {
	    //遭遇效果持续时间--
        this._encounterEffectDuration--;
        //速率 = 遭遇效果速率
        var speed = this.encounterEffectSpeed();
        // n = 速率 - 遭遇效果持续时间
        var n = speed - this._encounterEffectDuration;
        // p = n  / 速率 
        var p = n / speed;
        //q =  ((p - 1) * 20 * p + 5) * p + 1;
        var q = ((p - 1) * 20 * p + 5) * p + 1;
        //zoomx = 游戏游戏者 画面x
        var zoomX = $gamePlayer.screenX();
        //zoomx = 游戏游戏者 画面y - 24
        var zoomY = $gamePlayer.screenY() - 24;
        //如果 n === 2 
        if (n === 2) {
	        //游戏画面 设置缩放(zoomX, zoomY, 1)
            $gameScreen.setZoom(zoomX, zoomY, 1);
            //拍摄为了背景
            this.snapForBattleBackground();
            //开始闪烁为了遭遇(速率/2)
            this.startFlashForEncounter(speed / 2);
        }
        //游戏画面 设置缩放(zoomX, zoomY, q)
        $gameScreen.setZoom(zoomX, zoomY, q);
        //如果 n == 速率 /6
        if (n === Math.floor(speed / 6)) {
            //开始闪烁为了遭遇(速率/2)
            this.startFlashForEncounter(speed / 2);
        }
        //如果 n == 速率 /2
        if (n === Math.floor(speed / 2)) {
	        //战斗管理器 播放战斗bgm
            BattleManager.playBattleBgm();
            //开始淡出(淡出速率) 
            this.startFadeOut(this.fadeSpeed());
        }
    }
};
//拍摄为了背景
Scene_Map.prototype.snapForBattleBackground = function() {
	//窗口层 可见性 = false
    this._windowLayer.visible = false;
    //场景管理器  拍摄为了背景()
    SceneManager.snapForBackground();
    //窗口层 可见性 = true
    this._windowLayer.visible = true;
};
//开始闪烁为了遭遇(持续时间)
Scene_Map.prototype.startFlashForEncounter = function(duration) {
	//颜色 = [255,255,255,255]
    var color = [255, 255, 255, 255];
    //游戏画面 开始闪烁(颜色,持续时间 ) 
    $gameScreen.startFlash(color, duration);
};
//遭遇效果速率
Scene_Map.prototype.encounterEffectSpeed = function() {
    //返回 60
    return 60;
};
