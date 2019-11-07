# 战斗从BattleManager.setup开始

## RMMV战斗的开始
  
战斗管理器 安装
BattleManager.setup(troopId, canEscape, canLose)  

然后调用  
场景管理器 添加(场景战斗)
SceneManager.push(Scene_Battle)  
或调用  
场景管理器 转到( 场景战斗 )  
SceneManager.goto(Scene_Battle)  

### 战斗开始的三种情况
rmmv中,让战斗开始有三种情况,  

>1. 场景地图 更新遭遇  
>2. 事件的301战斗处理  
>3. 战斗测试  

这三种方法都需要调用   

BattleManager.setup(troopId, canEscape, canLose)   
使用 
SceneManager.push(Scene_Battle)  || SceneManager.goto(Scene_Battle)  
下面简单介绍下这三种情况  

#### 场景地图 更新遭遇

Scene_Map.prototype.updateEncounter

在场景为 场景地图 时会不断调用  
$gamePlayer.executeEncounter()  
当 满足条件时 $gamePlayer.executeEncounter()  
会调用 战斗管理器 安装 并且 返回true  
此时,会进行 场景管理器 添加 (场景战斗)  
SceneManager.push(Scene_Battle)

```js
Scene_Map.prototype.updateEncounter = function() {
    //如果( 游戏游戏者 执行遭遇() )
    if ($gamePlayer.executeEncounter()) {
        //场景管理器 添加(场景战斗)
        SceneManager.push(Scene_Battle);
    }
};
```

#### 事件的301战斗处理

该处理中,会执行  
战斗管理器 安装  
然后
场景管理器 添加(场景战斗)  
SceneManager.push(Scene_Battle);  

#### 设置战斗测试

在 场景引导 Scene_Boot 的开始中,  

```js
    if (DataManager.isBattleTest()) {
        //数据管理器 加载战斗测试()
        DataManager.setupBattleTest();
        //场景管理器 转到( 场景战斗 )
        SceneManager.goto(Scene_Battle);
    }
```
当 数据管理器 是战斗测试 为true 时  
会进行 数据管理器 加载战斗测试  
数据管理器 加载战斗测试 中会进行 战斗管理器 安装  

```js
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
}
```

然后 场景管理器 转到(场景战斗)  
SceneManager.goto(Scene_Battle)  

#### 以上就是rmmv中三种开始战斗的情况 

___

## 战斗管理器 安装 BattleManager.setup(troopId, canEscape, canLose)

BattleManager.setup(troopId, canEscape, canLose)

```js
  @param {number} troopId 敌群id 
  @param {boolean} canEscape 能逃跑
  @param {boolean} canLose 能失败
```
 
传入参数后,会进行以下处理  

### 战斗管理器 初始化成员

BattleManager.initMembers()

会把以下内容赋值,让战斗管理器处于初始化阶段  

```js
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

### 战斗管理器 设置 能逃跑 ,能失败

BattleManager._canEscape  
BattleManager._canLose  

```js
    //能逃跑 = canEscape//能逃跑
    this._canEscape = canEscape;
    //能失败 = canLose//能失败
    this._canLose = canLose;
```

### 游戏敌群 安装(敌群id)

$gameTroop.setup(troopId)  

接下来进行 $gameTroop.setup(troopId) ,对于 troopId 的敌群  的安装  
对于敌群 $gameTroop ,清除内容,设置敌群id,然后根据 敌群数据 安装每一个敌人,然后制作唯一名称  

### 游戏画面 当战斗开始

$gameScreen.onBattleStart()  

然后进行 游戏画面 当战斗开始
对于游戏画面 $gameScreen ,清除淡入淡出,清除闪烁,清除震动,清除缩放,抹去战斗图片

### 战斗管理器 制作逃跑概率

BattleManager.makeEscapeRatio()  

默认为 0.5 * 游戏队伍 敏捷() / 游戏敌群 敏捷()

```js
 this._escapeRatio = 0.5 * $gameParty.agility() / $gameTroop.agility();
```

### 战斗管理器安装结束

如此,战斗管理器的内容就安装完毕了.

___
 

## 切换到战斗场景 SceneManager.push | SceneManager.goto

安装完战斗管理器后,需要切换场景到 战斗场景  Scene_Battle ,

上面三种战斗开始情况中,会调用
场景管理器 添加( 场景战斗 )
SceneManager.push(Scene_Battle)
或调用
场景管理器 转到( 场景战斗 )
SceneManager.goto(Scene_Battle);

场景管理器 添加  
会在 场景管理器中 添加这个场景,当退出时会转到之前的场景,
场景管理器 转到  
则是 场景管理器中 转到这个场景,当退出时会直接关闭,

### 新 场景战斗

无论添加还是转到,
首先会 使用  

```js
new Scene_Battle()
```

new Scene_Battle() 会调用  场景战斗 初始化  

```js
/**初始化 */
Scene_Battle.prototype.initialize = function() {
    //场景基础 初始化 呼叫(this)
    Scene_Base.prototype.initialize.call(this);
};
```


创建一个 场景战斗  
然后切换场景

### 切换场景

如果有上一个场景的 会调用 上一个场景的 结束 ,移除预订 ,  
然后调用 新场景(场景战斗)的 附加预订 和  创建  

```js
//场景 附加预订()
this._scene.attachReservation();
//场景 创建()
this._scene.create();
```

接下来在 场景管理器的 更新中  
会不断判断  是否已经开始 ,  
如果没有,则判断 当这个场景 是否准备好  
当 这个场景 准备好时,调用  

```js
//场景 开始
this._scene.start();
```

当 场景已经开始时  
场景管理器会执行 场景的更新

```js
//场景 更新
this._scene.update();
```

### 以上就是场景管理器 添加或转到 场景战斗 后 的内容

按照顺序 依次会进行以下内容

```js 
//场景初始化()
scene.initialize() 
//场景 附加预订()
scene.attachReservation();
//场景 创建()
scene.create(); 
//场景 开始
scene.start();
```

然后场景更新时 不断调用  

```js
//场景 更新
scene.update();
```

___

## 场景生成 new Scene_Battle()

### 场景战斗 初始化  

```js
new Scene_Battle()
```

会调用 场景战斗 初始化  

```js
/**初始化 */
Scene_Battle.prototype.initialize = function() {
    //场景基础 初始化 呼叫(this)
    Scene_Base.prototype.initialize.call(this);
};
```

(额,他的初始化就是调用 场景基础 的初始化 )

然后是创建,
除了调用  场景基础 的创建
还会 创建显示对象

```js
/**创建  */
Scene_Battle.prototype.create = function() {
    //场景基础 创建 呼叫(this)
    Scene_Base.prototype.create.call(this);
    //创建显示对象()
    this.createDisplayObjects();
};
```

### 创建显示对象,  
会进行  
创建精灵组  
创建窗口层  
创建所有窗口  
战斗管理器 设置记录窗口(记录窗口)  
战斗管理器 设置状态窗口(状态窗口)  
战斗管理器 设置精灵组(精灵组)  
记录窗口 设置精灵组(精灵组)  

```js
/**创建显示对象 */
Scene_Battle.prototype.createDisplayObjects = function() {
    //创建精灵组()
    this.createSpriteset();
    //创建窗口层()
    this.createWindowLayer();
    //创建所有窗口()
    this.createAllWindows();
    //战斗管理器 设置记录窗口(记录窗口)
    BattleManager.setLogWindow(this._logWindow);
    //战斗管理器 设置状态窗口(状态窗口)
    BattleManager.setStatusWindow(this._statusWindow);
    //战斗管理器 设置精灵组(精灵组)
    BattleManager.setSpriteset(this._spriteset);
    //记录窗口 设置精灵组(精灵组)
    this._logWindow.setSpriteset(this._spriteset);
};
```

创建精灵组  
会 生成一个 精灵组战斗  
new Spriteset_Battle()  
并且添加到场景中  

```js
/**创建精灵组 */
Scene_Battle.prototype.createSpriteset = function() {
    //精灵组 = 新 精灵组战斗()
    this._spriteset = new Spriteset_Battle();
    //添加子代(精灵组)
    this.addChild(this._spriteset);
};
```

精灵组战斗 中有 背景,战斗区域,战斗背景  
并且创建敌人的精灵,角色的精灵, 添加到 战斗区域中

精灵组战斗处理战斗的背景,以及战斗的各个战斗者的精灵

并且有 
isAnimationPlaying 是动画播放中

isEffecting 是效果中

isAnyoneMoving 是任何一个移动中

isBusy 是忙碌(是动画播放中 或者 是任何一个移动中)


## 场景开始    Scene_Battle.start()

```js
/**开始 */
Scene_Battle.prototype.start = function() {
    //场景基础 开始 呼叫(this)
    Scene_Base.prototype.start.call(this);
    //开始淡入(淡入速率,false)
    this.startFadeIn(this.fadeSpeed(), false);
    //战斗管理器 播放战斗bgm()
    BattleManager.playBattleBgm();
    //战斗管理器 开始战斗()
    BattleManager.startBattle();
};
```

##  战斗管理器开始战斗 BattleManager.startBattle()

```js 
/**开始战斗 */
BattleManager.startBattle = function() {
    //阶段 = "start" //开始
    this._phase = 'start';
    //游戏系统 当战斗开始()
    $gameSystem.onBattleStart();
    //游戏队伍 当战斗开始()
    $gameParty.onBattleStart();
    //游戏敌群 当战斗开始()
    $gameTroop.onBattleStart();
    //显示开始战斗()
    this.displayStartMessages();
};
```


## 战斗场景 更新
```js
/**更新 */
Scene_Battle.prototype.update = function() {
    //活动 = 是活动()
    var active = this.isActive();
    //游戏时间 更新(活动)
    $gameTimer.update(active);
    //游戏画面 更新()
    $gameScreen.update();
    //更新状态窗口()
    this.updateStatusWindow();
    //更新窗口位置()
    this.updateWindowPositions();
    //如果( 活动 并且 不是 是忙碌())
    if (active && !this.isBusy()) {
	    //更新战斗进行()
        this.updateBattleProcess();
    }
    //场景基础 更新 呼叫(this)
    Scene_Base.prototype.update.call(this);
};
```











## 战斗场景 更新战斗流程
