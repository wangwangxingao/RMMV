
/**----------------------------------------------------------------------------- */
/** DataManager */
/** 数据管理器 */
/** The static class that manages the database and game objects. */
/** 这个静态的类 管理 数据库 和 游戏对象 */

function DataManager() {
    throw new Error('This is a static class');
}
/**数据角色组 = null */
var $dataActors       = null;
/**数据职业组 = null */
var $dataClasses      = null;
/**数据技能组 = null */
var $dataSkills       = null;
/**数据物品组 = null */
var $dataItems        = null;
/**数据武器组 = null */
var $dataWeapons      = null;
/**数据防具组 = null */
var $dataArmors       = null;
/**数据敌人组 = null */
var $dataEnemies      = null;
/**数据敌群组 = null */
var $dataTroops       = null;
/**数据状态组 = null */
var $dataStates       = null;
/**数据动画组 = null */
var $dataAnimations   = null;
/**数据图块设置 = null */
var $dataTilesets     = null;
/**数据公共事件组 = null */
var $dataCommonEvents = null;
/**数据系统 = null */
var $dataSystem       = null;
/**数据地图信息组 = null */
var $dataMapInfos     = null;
/**数据地图 = null */
var $dataMap          = null;
/**游戏临时 = null */
var $gameTemp         = null;
/**游戏系统 = null */
var $gameSystem       = null;
/**游戏画面 = null */
var $gameScreen       = null;
/**游戏计时 = null */
var $gameTimer        = null;
/**游戏消息 = null */
var $gameMessage      = null;
/**游戏开关组 = null */
var $gameSwitches     = null;
/**游戏变量组 = null */
var $gameVariables    = null;
/**游戏独立开关组 = null */
var $gameSelfSwitches = null;
/**游戏角色组 = null */
var $gameActors       = null;
/**游戏队伍 = null */
var $gameParty        = null;
/**游戏敌群 = null */
var $gameTroop        = null;
/**游戏地图 = null */
var $gameMap          = null;
/**游戏游戏者 = null */
var $gamePlayer       = null;
/**测试事件 = null */
var $testEvent        = null;
/**全局id */
DataManager._globalId       = 'RPGMV';
/**上次访问ID = 1 */
DataManager._lastAccessedId = 1;
/**错误url = null  */
DataManager._errorUrl       = null;
/**数据库文件列表 */
DataManager._databaseFiles = [
    { name: '$dataActors',       src: 'Actors.json'       },
    { name: '$dataClasses',      src: 'Classes.json'      },
    { name: '$dataSkills',       src: 'Skills.json'       },
    { name: '$dataItems',        src: 'Items.json'        },
    { name: '$dataWeapons',      src: 'Weapons.json'      },
    { name: '$dataArmors',       src: 'Armors.json'       },
    { name: '$dataEnemies',      src: 'Enemies.json'      },
    { name: '$dataTroops',       src: 'Troops.json'       },
    { name: '$dataStates',       src: 'States.json'       },
    { name: '$dataAnimations',   src: 'Animations.json'   },
    { name: '$dataTilesets',     src: 'Tilesets.json'     },
    { name: '$dataCommonEvents', src: 'CommonEvents.json' },
    { name: '$dataSystem',       src: 'System.json'       },
    { name: '$dataMapInfos',     src: 'MapInfos.json'     }
];
/**加载数据库 */
DataManager.loadDatabase = function() {
	//测试 = 是战斗测试() || 是事件测试()
    var test = this.isBattleTest() || this.isEventTest();
    //前缀 =  测试 ?  "Test_"  : ""
    var prefix = test ? 'Test_' : '';
    //循环,读取所有 数据库文件列表 里的项目
    for (var i = 0; i < this._databaseFiles.length; i++) {
        var name = this._databaseFiles[i].name;
        var src = this._databaseFiles[i].src;
        this.loadDataFile(name, prefix + src);
    }
    //如果( 是事件测试时() )
    if (this.isEventTest()) {
        //读取数据文件( '$testEvent'//测试事件, prefix + 'Event.json' )
        this.loadDataFile('$testEvent', prefix + 'Event.json');
    }
};
/**加载数据文件 */
DataManager.loadDataFile = function(name, src) {
	//网址请求 = 新 XML网址请求()
    var xhr = new XMLHttpRequest();
    //url位置 = "data" + src
    var url = 'data/' + src;
    //网址请求 打开( 'GET' , url位置)
    xhr.open('GET', url);
    //网址请求 文件类型('application/json')
    xhr.overrideMimeType('application/json');
    //网址请求 当读取
    xhr.onload = function() {
	    //如果 网址请求 状态 < 400
        if (xhr.status < 400) {
	        //窗口[name] = json解析(网址请求 返回text)
            window[name] = JSON.parse(xhr.responseText);
            //数据管理器 当读取(窗口[name] )
            DataManager.onLoad(window[name]);
        }
    };
    //网址请求 当错误
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    //窗口[name] = null
    window[name] = null;
    //网址请求 发出
    xhr.send();
};
/**是数据库加载后 */
DataManager.isDatabaseLoaded = function() {
	//检查错误()
    this.checkError();
    //循环( 开始时 i = 0 ; 当 i < 数据库文件列表 长度 时 ;每一次 i++)
    for (var i = 0; i < this._databaseFiles.length; i++) {
	    //如果 (不是 窗口[数据库文件列表[i] 名称])
        if (!window[this._databaseFiles[i].name]) {
	        //返回 false
            return false;
        }
    }
    //返回 true
    return true;
};
/**加载地图数据 */
DataManager.loadMapData = function(mapId) {
	//如果 (地图id > 0)
    if (mapId > 0) {
	    // 文件名 = 'Map%1.json' 替换 (mapId 填充0(3位)  )
        var filename = 'Map%1.json'.format(mapId.padZero(3));
        this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
       //读取数据文件(数据地图 ,文件名)
        this.loadDataFile('$dataMap', filename);
    //否则
    } else {
	    //制作空地图()
        this.makeEmptyMap();
    }
};
/**作空地图 */
DataManager.makeEmptyMap = function() {
	//数据地图 = {}
    $dataMap = {};
    //数据地图 数据 = []
    $dataMap.data = [];
    //数据地图 事件 = []
    $dataMap.events = [];
    //数据地图 宽 = 100
    $dataMap.width = 100;
    //数据地图 高 = 100
    $dataMap.height = 100;
    //数据地图 滚动种类 = 3
    $dataMap.scrollType = 3;
};
/**在地图已加载 */
DataManager.isMapLoaded = function() {
	//检查错误()
    this.checkError();
    //返回 !!数据地图
    return !!$dataMap;
};
/**装载 */
DataManager.onLoad = function(object) {
	//数组
    var array;
    //如果( 对象 是 $dataMap)
    if (object === $dataMap) {
	    //提取元数据(对象)
        this.extractMetadata(object);
        //数组 = 对象 事件组
        array = object.events;
    } else {
	    //数组 = 对象
        array = object;
    }
    //如果 数组 是一个数组
    if (Array.isArray(array)) {
	    //循环( 开始时i=0 ;当 i<数组 长度 时; 每一次i++ )
        for (var i = 0; i < array.length; i++) {
	        //数据 = 数组[i]
            var data = array[i];
            //如果 (数据 并且 数据 注释 不等于 undefined)
            if (data && data.note !== undefined) {
	            //提取元数据(数据)
                this.extractMetadata(data);
            }
        }
    }
    if (object === $dataSystem) {
        Decrypter.hasEncryptedImages = !!object.hasEncryptedImages;
        Decrypter.hasEncryptedAudio = !!object.hasEncryptedAudio;
        Scene_Boot.loadSystemImages();
    }
};
/**提取元数据 */
DataManager.extractMetadata = function(data) {
    var re = /<([^<>:]+)(:?)([^>]*)>/g;
    data.meta = {};
    for (;;) {
        var match = re.exec(data.note);
        if (match) {
            if (match[2] === ':') {
                data.meta[match[1]] = match[3];
            } else {
                data.meta[match[1]] = true;
            }
        } else {
            break;
        }
    }
};
/**检查错误 */
DataManager.checkError = function() {
	//如果 数据管理器 错误url (数据管理器 错误url 存在 )
    if (DataManager._errorUrl) {
	    //抛出 新 错误( "Failed to load"//读取失败 + 数据管理器 错误url   )
        throw new Error('Failed to load: ' + DataManager._errorUrl);
    }
};
/**是战斗测试 */
DataManager.isBattleTest = function() {
	//返回 公用程序 是选项有效("btest")
    return Utils.isOptionValid('btest');
};
/**是事件测试 */
DataManager.isEventTest = function() {
	//返回 公用程序 是选项有效("etest")
    return Utils.isOptionValid('etest');
};
/**是技能 */
DataManager.isSkill = function(item) {
	//返回 项目 并且 数据技能 包含 (项目)
    return item && $dataSkills.contains(item);
};
/**是物品 */
DataManager.isItem = function(item) {
	//返回 项目 并且 数据物品 包含 (项目)
    return item && $dataItems.contains(item);
};
/**是武器 */
DataManager.isWeapon = function(item) {
	//返回 项目 并且 数据武器 包含 (项目)
    return item && $dataWeapons.contains(item);
};
/**是防具 */
DataManager.isArmor = function(item) {
	//返回 项目 并且 数据防具 包含 (项目)
    return item && $dataArmors.contains(item);
};
/**创建游戏对象 */
DataManager.createGameObjects = function() {
    //$gameTemp         = 新 游戏临时()
    $gameTemp          = new Game_Temp();
    //$gameSystem       = 新 游戏系统()
    $gameSystem        = new Game_System();
    //$gameScreen       = 新 游戏画面()
    $gameScreen         = new Game_Screen();
    //$gameTimer        = 新 游戏计时()
    $gameTimer         = new Game_Timer();
    //$gameMessage      = 新 游戏消息()
    $gameMessage       = new Game_Message();
    //$gameSwitches     = 新 游戏开关组()
    $gameSwitches      = new Game_Switches();
    //$gameVariables    = 新 游戏变量组()
    $gameVariables     = new Game_Variables();
    //$gameSelfSwitches = 新 游戏独立开关组()
    $gameSelfSwitches  = new Game_SelfSwitches();
    //$gameActors       = 新 游戏角色组()
    $gameActors        = new Game_Actors();
    //$gameParty        = 新 游戏队伍()
    $gameParty         = new Game_Party();
    //$gameTroop        = 新 游戏敌群()
    $gameTroop         = new Game_Troop();
    //$gameMap          = 新 游戏地图()
    $gameMap           = new Game_Map();
    //$gamePlayer       = 新 游戏角色()
    $gamePlayer        = new Game_Player();
};
/**安装新游戏 */
DataManager.setupNewGame = function() {
	//创建游戏对象()
    this.createGameObjects();
    //选择保存文件对于新游戏()
    this.selectSavefileForNewGame();
    //游戏队伍 安装开始成员()
    $gameParty.setupStartingMembers();
    //游戏游戏者 预约传送(数据系统 开始地图id ,数据系统 开始x ,数据系统 开始y)
    $gamePlayer.reserveTransfer($dataSystem.startMapId,
        $dataSystem.startX, $dataSystem.startY);
    //图形 帧计数 = 0
    Graphics.frameCount = 0;
};
/**安装战斗测试 */
DataManager.setupBattleTest = function() {
	//创建游戏对象()
    this.createGameObjects();
    //游戏队伍 安装战斗测试()
    $gameParty.setupBattleTest();
    //战斗管理器 安装 数据系统 测试敌群id 能逃跑 true  能失败 false
    BattleManager.setup($dataSystem.testTroopId, true, false);
    //战斗管理器 设置战斗测试(true)
    BattleManager.setBattleTest(true);
    //战斗管理器 播放战斗bgm()
    BattleManager.playBattleBgm();
};
/**设置事件测试 */
DataManager.setupEventTest = function() {
	//创建游戏对象()
    this.createGameObjects();
    //选择保存文件对于新游戏()
    this.selectSavefileForNewGame();
    //游戏队伍 安装开始成员()
    $gameParty.setupStartingMembers();
    //游戏游戏者 预约传送(-1,8,6)
    $gamePlayer.reserveTransfer(-1, 8, 6);
    //游戏游戏者 设置透明(false)
    $gamePlayer.setTransparent(false);
};
/**加载全局信息 */
DataManager.loadGlobalInfo = function() {
	//jsom
    var json;
    //测试
    try {
	    //json = 存储管理器 读取(0)
        json = StorageManager.load(0);
    //如果错误(e)
    } catch (e) {
	    //控制台 错误(e)
        console.error(e);
        //返回 []
        return [];
    }
    //如果 json
    if (json) {
	    //全局信息 = json解析(json)
        var globalInfo = JSON.parse(json);
        //循环( 开始时 i = 1 ; 当 i < 最大储存文件数 时 ; 每一次 i++)
        for (var i = 1; i <= this.maxSavefiles(); i++) {
	        //如果( 不是 存储管理器 存在(i) )
            if (!StorageManager.exists(i)) {
	            //删除 全局信息[i]
                delete globalInfo[i];
            }
        }
        //返回 全局信息
        return globalInfo;
    } else {
	    //返回 []
        return [];
    }
};
/**保存全局信息 */
DataManager.saveGlobalInfo = function(info) {
	//存储管理器 保存 ( 0 ,json转换(info信息))
    StorageManager.save(0, JSON.stringify(info));
};
/**是这个游戏档案 */
DataManager.isThisGameFile = function(savefileId) {
	//全局信息 = 加载全局信息()
    var globalInfo = this.loadGlobalInfo();
    //如果 全局信息 并且 全局信息[存档文件id]
    if (globalInfo && globalInfo[savefileId]) {
	    //如果 存储管理器 是本地模式()
        if (StorageManager.isLocalMode()) {
	        //返回 true
            return true;
        } else {
	        //存档文件 = 全局信息[存档文件id]
            var savefile = globalInfo[savefileId];
            //返回 存档文件 全局id  === 全局id 并且 存档文件 标题 === 数据系统 游戏标题
            return (savefile.globalId === this._globalId &&
                    savefile.title === $dataSystem.gameTitle);
        }
    } else {
	    //返回 false
        return false;
    }
};
/**是任何保存文件存在 */
DataManager.isAnySavefileExists = function() {
	//全局信息 = 加载全局信息()
    var globalInfo = this.loadGlobalInfo();
    //如果 全局信息
    if (globalInfo) {
	    //循环 开始时 i = 1 ; 当 i < 全局信息 长度 时 ; 每一次 i++
        for (var i = 1; i < globalInfo.length; i++) {
	        //如果( 是这个游戏档案(i) )
            if (this.isThisGameFile(i)) {
	            //返回 true
                return true;
            }
        }
    }
    return false;
};
/**最新的保存文件 */
DataManager.latestSavefileId = function() {
	//全局信息 = 加载全局信息()
    var globalInfo = this.loadGlobalInfo();
    //存档文件id = 1
    var savefileId = 1;
    //时间临时 = 0
    var timestamp = 0;
    //如果 全局信息 
    if (globalInfo) {
	    //循环 开始时 i = 1 ; 当 i < 全局信息 长度 时 ; 每一次 i++
        for (var i = 1; i < globalInfo.length; i++) {
	        //如果 是这个游戏文件(i) 并且 全局信息[i].时间临时 > 时间临时
            if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
	            //时间临时 = 全局信息[i].时间临时
                timestamp = globalInfo[i].timestamp;
                //存档文件id = 1
                savefileId = i;
            }
        }
    }
    //返回 存档文件id
    return savefileId;
};
/**加载所有保存文件中的图像 */
DataManager.loadAllSavefileImages = function() {
	//全局信息 = 加载全局信息()
    var globalInfo = this.loadGlobalInfo();
    //如果 全局信息
    if (globalInfo) {
	    //循环( 开始时 i = 1 ; 当 i < 全局信息 长度 时 ; 每一次 i++)
        for (var i = 1; i < globalInfo.length; i++) {
	        //如果 是这个游戏文件(i)
            if (this.isThisGameFile(i)) {
	            //信息 = 全局信息[i]
                var info = globalInfo[i];
                //读取存档文件图像(信息)
                this.loadSavefileImages(info);
            }
        }
    }
};
/**读取保存文件中的图像 */
DataManager.loadSavefileImages = function(info) {
	//如果 信息 行走图组
    if (info.characters) {
	    //循环( 开始时 i = 0 ; 当 i < 信息 行走图组 长度 时 ; 每一次 i++)
        for (var i = 0; i < info.characters.length; i++) {
	        //图像管理器 读取行走图(信息 行走图组[i][0])
            ImageManager.reserveCharacter(info.characters[i][0]);
        }
    }
	//如果 信息 脸图组
    if (info.faces) {
	    //循环( 开始时 i = 0 ; 当 i < 信息 脸图组 长度 时 ; 每一次 i++)
        for (var j = 0; j < info.faces.length; j++) {
	        //图像管理器 读取脸图(信息 脸图组[i][0])
            ImageManager.reserveFace(info.faces[j][0]);
        }
    }
};
/**最大保存文件 */
DataManager.maxSavefiles = function() {
	//返回 20
    return 20;
};
/**保存游戏 */
DataManager.saveGame = function(savefileId) {
	//测试
    try {
	    //存储管理器 备份(存档文件id)
	    StorageManager.backup(savefileId);
	    //返回 保存游戏无救援(存档文件id)
        return this.saveGameWithoutRescue(savefileId);
    //如果错误(e)
    } catch (e) {
	    //控制台 错误(e)
        console.error(e);
        //测试
        try {
	        //存储管理器 删除(存档文件id)
            StorageManager.remove(savefileId); 
	        //存储管理器 还原备份(存档文件id)
            StorageManager.restoreBackup(savefileId);
        //如果错误(e2)
        } catch (e2) {
        }
        //返回 false
        return false;
    }
};
/**加载游戏 */
DataManager.loadGame = function(savefileId) {
	//测试
    try {
	    //加载游戏无救援(存档文件id)
        return this.loadGameWithoutRescue(savefileId);
    //如果错误(e)
    } catch (e) {
	    //控制台 错误(e)
        console.error(e);
        //返回 false
        return false;
    }
};
/**加载保存文件信息 */
DataManager.loadSavefileInfo = function(savefileId) {
	//全局信息 = 加载全局信息()
    var globalInfo = this.loadGlobalInfo();
    //返回 如果 (全局信息 并且 全局信息[存档文件id]) 返回  全局信息[存档文件id] 否则 null
    return (globalInfo && globalInfo[savefileId]) ? globalInfo[savefileId] : null;
};
/**上次访问保存文件ID */
DataManager.lastAccessedSavefileId = function() {
	//返回 上次访问ID
    return this._lastAccessedId;
};
/**保存游戏无救援 */
DataManager.saveGameWithoutRescue = function(savefileId) {
	//json  = json扩展 转换 ( 制作保存内容 )
    var json = JsonEx.stringify(this.makeSaveContents());
    //如果 json 长度 >= 20000
    if (json.length >= 200000) {
	    //控制台 警告(保存数据太大)
        console.warn('Save data too big!');
    }
    //存储管理器 保存( 存档文件id , json )
    StorageManager.save(savefileId, json);
    //上次访问ID = 存档文件id
    this._lastAccessedId = savefileId;
    //全局信息 = 加载全局信息() || []
    var globalInfo = this.loadGlobalInfo() || [];
    //全局信息[存档文件id] = 制作保存文件信息
    globalInfo[savefileId] = this.makeSavefileInfo();
    //保存全局信息(全局信息) 
    this.saveGlobalInfo(globalInfo);
    //返回 true
    return true;
};
/**加载游戏无救援 */
DataManager.loadGameWithoutRescue = function(savefileId) {
    //全局信息 = 加载全局信息()
    var globalInfo = this.loadGlobalInfo();
    //如果 (是这个游戏文件(存档文件id) )
    if (this.isThisGameFile(savefileId)) {
        //json = 存储管理器 读取 ( 存档文件id )
        var json = StorageManager.load(savefileId);
        //创建游戏对象()
        this.createGameObjects();
        //提取保存内容(json扩展 解析(json) )
        this.extractSaveContents(JsonEx.parse(json));
        //上次访问ID = 存档文件id
        this._lastAccessedId = savefileId;
        //返回 true
        return true;
    //否则 
    } else {
        //返回 false
        return false;
    }
};
/**选择保存文件对于新游戏 */
DataManager.selectSavefileForNewGame = function() {
    //全局信息 = 加载全局信息()
    var globalInfo = this.loadGlobalInfo();
    //上次访问ID = 1
    this._lastAccessedId = 1;
    //如果 (全局信息)
    if (globalInfo) {
        //保存文件个数 = 数学 最大值 ( 0 , 全局信息 长度 - 1 )
        var numSavefiles = Math.max(0, globalInfo.length - 1);
        //如果(保存文件个数 < 最大保存文件)
        if (numSavefiles < this.maxSavefiles()) {
            //上次访问ID = 保存文件个数 + 1 
            this._lastAccessedId = numSavefiles + 1;
        //否则
        } else {
            //时间临时 = 数字 最大值
            var timestamp = Number.MAX_VALUE;
            //循环 ( 开始时 i = 1 ; 当 i < 全局信息 长度 ;每一次 i++)
            for (var i = 1; i < globalInfo.length; i++) {
                //如果 (不是 全局信息[i])
                if (!globalInfo[i]) {
                    //上次访问ID = i
                    this._lastAccessedId = i;
                    //中断
                    break;
                }
                //如果 (全局信息[i] 时间临时 < 时间临时 )
                if (globalInfo[i].timestamp < timestamp) {
                    //时间临时 = 全局信息[i] 时间临时
                    timestamp = globalInfo[i].timestamp;
                    //上次访问ID = i
                    this._lastAccessedId = i;
                }
            }
        }
    }
};
/**制作保存文件信息 */
DataManager.makeSavefileInfo = function() {
    //信息 = {}
    var info = {};
    //信息 全局id = 全局id
    info.globalId   = this._globalId;
    //信息 标题 = 数据系统 游戏标题
    info.title      = $dataSystem.gameTitle;
    //信息 行走图 = 游戏队伍 行走图为了存档文件
    info.characters = $gameParty.charactersForSavefile();
    //信息 脸图 = 游戏队伍 脸图为了存档文件
    info.faces      = $gameParty.facesForSavefile();
    //信息 游戏时间 = 游戏系统 游戏时间文本
    info.playtime   = $gameSystem.playtimeText();
    //信息 时间临时 = 时间 现在()
    info.timestamp  = Date.now();
    //返回 信息
    return info;
};
/**制作保存内容 */
DataManager.makeSaveContents = function() {
    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
    //一个保存数据 但 不包括 游戏临时 , 游戏消息 和 游戏敌群 
    
    //内容 ={}
    var contents = {};
    //内容 系统 = 游戏系统
    contents.system       = $gameSystem;
    //内容 画面 = 游戏画面
    contents.screen       = $gameScreen;
    //内容 计时 = 游戏计时 
    contents.timer        = $gameTimer;
    //内容 开关组 = 游戏开关组
    contents.switches     = $gameSwitches;
    //内容 变量组 = 游戏变量组 
    contents.variables    = $gameVariables;
    //内容 独立开关组 = 游戏独立开关组
    contents.selfSwitches = $gameSelfSwitches;
    //内容 角色组 = 游戏角色组
    contents.actors       = $gameActors;
    //内容 队伍 = 游戏队伍
    contents.party        = $gameParty;
    //内容 地图 = 游戏地图
    contents.map          = $gameMap;
    //内容 游戏者 = 游戏游戏者
    contents.player       = $gamePlayer;
    //返回 内容
    return contents;
};
/**提取保存内容 */
DataManager.extractSaveContents = function(contents) {
    //游戏系统 = 内容 系统
    $gameSystem        = contents.system;
    //游戏画面 = 内容 画面
    $gameScreen        = contents.screen;
    //游戏计时 = 内容 计时
    $gameTimer         = contents.timer;
    //游戏开关组 = 内容 开关组
    $gameSwitches      = contents.switches;
    //游戏变量组 =  内容 变量组
    $gameVariables     = contents.variables;
    //游戏独立开关组 = 内容 独立开关组
    $gameSelfSwitches  = contents.selfSwitches;
    //游戏角色组 = 内容 角色组
    $gameActors        = contents.actors;
    //游戏队伍 = 内容 队伍
    $gameParty         = contents.party;
    //游戏地图 = 内容 地图
    $gameMap           = contents.map;
    //游戏游戏者 = 内容 游戏者
    $gamePlayer        = contents.player;
};
