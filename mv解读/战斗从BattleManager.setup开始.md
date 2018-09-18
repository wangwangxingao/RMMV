


[RMMV战斗的开始](#RMMV战斗的开始)
[RMMV战斗的初始化](#RMMV战斗的初始化)

 
# RMMV战斗的开始
  
rmmv中,让战斗开始有三种情况,

1. [游戏者的执行遭遇](#游戏者执行遭遇)
2. [事件的301战斗处理](#事件的301战斗处理)
2. [设置战斗测试](#设置战斗测试)

这三种方法都需要调用 [BattleManager.setup 战斗管理器安装](#BattleManager.setup)  

 
> BattleManager.setup(troopId, canEscape, canLose) 有三个参数 
```
  @param {number} troopId 敌群id 
  @param {boolean} canEscape 能逃跑
  @param {boolean} canLose 能失败
```


# RMMV战斗的初始化

传入参数后,会进行 [BattleManager.initMembers 初始化成员](#BattleManager.initMembers) 
[$gameTroop.setup  游戏敌群 安装(地群id)](#gameTroop.setup) 
[$gameScreen.onBattleStart 游戏画面 当战斗开始](#gameScreen.onBattleStart)
[BattleManager.makeEscapeRatio 制作逃跑概率](#BattleManager.makeEscapeRatio)

 
```
    //阶段 = "init" 初始化
    this._phase = 'init';
    //能逃跑 = false 
    this._canEscape = false;
    //能失败 = false
    this._canLose = false;
    //战斗测试 = false
    this._battleTest = false;
    //事件呼叫返回 = null
    this._eventCallback = null;
    //优先权 = false
    this._preemptive = false;
    //突然袭击 = false
    this._surprise = false;
    //角色id = -1
    this._actorIndex = -1;
    //动作强制战斗者 = null
    this._actionForcedBattler = null;
    //地图音乐 = null
    this._mapBgm = null;
    //地图bgs = null
    this._mapBgs = null;
    //动作战斗者组 = []
    this._actionBattlers = [];
    //主体 = null
    this._subject = null;
    //动作 = null
    this._action = null;
    //目标组 = []
    this._targets = [];
    //日志窗口 = null
    this._logWindow = null;
    //状态窗口 = null
    this._statusWindow = null;
    //精灵组 = null
    this._spriteset = null;
    //逃跑概率 = 0
    this._escapeRatio = 0;
    //逃跑的 = false
    this._escaped = false;
    //奖励 = {}
    this._rewards = {};
    //回合强制的 = false
    this._turnForced = false;
```
 






















































### 游戏者执行遭遇
```
/**执行遭遇*/
Game_Player.prototype.executeEncounter = function() {
    //如果( 不是 游戏地图 是事件运转() 并且 遭遇计数 <= 0  )
    if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
        //制作遭遇计数()
        this.makeEncounterCount();
        //敌群id = 制作遭遇敌群id()
        var troopId = this.makeEncounterTroopId();
        //如果( 数据敌群[敌群id] )
        if ($dataTroops[troopId]) {
            //战斗管理器 安装( 敌群id , true , false )
            BattleManager.setup(troopId, true, false);
            //战斗管理器 当遭遇()
            BattleManager.onEncounter();
            //返回 true
            return true;
            //否则
        } else {
            //返回 false
            return false;
        }
        //否则 
    } else {
        //返回 false
        return false;
    }
};
```
 

### 事件的301战斗处理 

``` 
/** Battle Processing 战斗处理*/
Game_Interpreter.prototype.command301 = function () {
    //如果( 不是 游戏队伍 在战斗() )
    if (!$gameParty.inBattle()) {
        //敌群id
        var troopId;
        //如果(参数组[0] === 0 )
        if (this._params[0] === 0) {  // Direct designation 直接指定
            //敌群id = 参数组[1]
            troopId = this._params[1];
            //否则 如果(参数组[0] === 1 )
        } else if (this._params[0] === 1) {  // Designation with a variable 变量指定
            //敌群id = 游戏变量组 值(参数组[1])
            troopId = $gameVariables.value(this._params[1]);
            //否则
        } else {  // Same as Random Encounter 随机遭遇
            //敌群id = 游戏游戏者 制作遭遇敌群id()
            troopId = $gamePlayer.makeEncounterTroopId();
        }
        //如果(数据敌群组[敌群id])
        if ($dataTroops[troopId]) {
            //战斗管理器 安装(敌群id ,参数组[2],参数组[3])
            BattleManager.setup(troopId, this._params[2], this._params[3]);
            //战斗管理器 设置事件呼叫返回 方法(n)
            BattleManager.setEventCallback(function (n) {
                //分支[缩进] = n
                this._branch[this._indent] = n;
                //绑定 (this)
            }.bind(this));
            //游戏游戏者 制作遭遇计数()
            $gamePlayer.makeEncounterCount();
            //场景管理器 添加(场景战斗)
            SceneManager.push(Scene_Battle);
        }
    }
    //返回 true
    return true;
};
```
 


### 设置战斗测试
```
/**设置战斗测试 */
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
```



 ## BattleManager.setup
 ```

/**
 * 安装
 * @param {number} troopId 敌群id
 * @param {boolean} canEscape 能逃跑
 * @param {boolean} canLose 能失败
 */
BattleManager.setup = function(troopId, canEscape, canLose) {
    //初始化成员
    this.initMembers();
    //能逃跑 = canEscape//能逃跑
    this._canEscape = canEscape;
    //能失败 = canLose//能失败
    this._canLose = canLose;
    //游戏敌群 安装(敌群id)
    $gameTroop.setup(troopId);
    //游戏画面 当战斗开始()
    $gameScreen.onBattleStart();
    //制作逃跑概率()
    this.makeEscapeRatio();
};

```


## BattleManager.initMembers 
```
/**初始化成员 */
BattleManager.initMembers = function() {
    //阶段 = "init" 初始化
    this._phase = 'init';
    //能逃跑 = false 
    this._canEscape = false;
    //能失败 = false
    this._canLose = false;
    //战斗测试 = false
    this._battleTest = false;
    //事件呼叫返回 = null
    this._eventCallback = null;
    //优先权 = false
    this._preemptive = false;
    //突然袭击 = false
    this._surprise = false;
    //角色id = -1
    this._actorIndex = -1;
    //动作强制战斗者 = null
    this._actionForcedBattler = null;
    //地图音乐 = null
    this._mapBgm = null;
    //地图bgs = null
    this._mapBgs = null;
    //动作战斗者组 = []
    this._actionBattlers = [];
    //主体 = null
    this._subject = null;
    //动作 = null
    this._action = null;
    //目标组 = []
    this._targets = [];
    //日志窗口 = null
    this._logWindow = null;
    //状态窗口 = null
    this._statusWindow = null;
    //精灵组 = null
    this._spriteset = null;
    //逃跑概率 = 0
    this._escapeRatio = 0;
    //逃跑的 = false
    this._escaped = false;
    //奖励 = {}
    this._rewards = {};
    //回合强制的 = false
    this._turnForced = false;
};
```