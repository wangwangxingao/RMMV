/**----------------------------------------------------------------------------- */
/** Spriteset_Battle */
/** 精灵组战斗 */
/** The set of sprites on the battle screen. */
/** 在战斗画面上 的 精灵组 */

function Spriteset_Battle() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Spriteset_Battle.prototype = Object.create(Spriteset_Base.prototype);
/**设置创造者 */
Spriteset_Battle.prototype.constructor = Spriteset_Battle;
/**初始化 */
Spriteset_Battle.prototype.initialize = function() {
    //精灵组基础 初始化 呼叫(this)
    Spriteset_Base.prototype.initialize.call(this);
    //
    this._battlebackLocated = false;
};
/**创建较下的层 */
Spriteset_Battle.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBackground();
    this.createBattleField();
    this.createBattleback();
    this.createEnemies();
    this.createActors();
};
/**创建背景 */
Spriteset_Battle.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._baseSprite.addChild(this._backgroundSprite);
};
/**更新 */
Spriteset_Battle.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateActors();
    this.updateBattleback();
};
/**创建战斗区域 */
Spriteset_Battle.prototype.createBattleField = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    //战斗区域 = 新 精灵()
    this._battleField = new Sprite();
    //战斗区域 设置框(x,y,宽,高)
    this._battleField.setFrame(x, y, width, height);
    //战斗区域 x = x 
    this._battleField.x = x;
    //战斗区域 y = y
    this._battleField.y = y;
    //基础精灵 添加子项( 战斗区域 )
    this._baseSprite.addChild(this._battleField);
};
/**创建战斗背景 */
Spriteset_Battle.prototype.createBattleback = function() {
    var margin = 32;
    var x = -this._battleField.x - margin;
    var y = -this._battleField.y - margin;
    var width = Graphics.width + margin * 2;
    var height = Graphics.height + margin * 2;
    this._back1Sprite = new TilingSprite();
    this._back2Sprite = new TilingSprite();
    this._back1Sprite.bitmap = this.battleback1Bitmap();
    this._back2Sprite.bitmap = this.battleback2Bitmap();
    this._back1Sprite.move(x, y, width, height);
    this._back2Sprite.move(x, y, width, height);
    this._battleField.addChild(this._back1Sprite);
    this._battleField.addChild(this._back2Sprite);
};
/**更新战斗背景 */
Spriteset_Battle.prototype.updateBattleback = function() {
    if (!this._battlebackLocated) {
        this.locateBattleback();
        this._battlebackLocated = true;
    }
};
/**设于战斗背景 */
Spriteset_Battle.prototype.locateBattleback = function() {
    //宽 = 战斗区域 宽
    var width = this._battleField.width;
    //高 = 战斗区域 高
    var height = this._battleField.height;
    //精灵1 = 背景1精灵
    var sprite1 = this._back1Sprite;
    //精灵2 = 背景2精灵
    var sprite2 = this._back2Sprite;
    //精灵1 原点 x = 精灵1 x + (精灵1 位图 宽 - 宽 ) / 2
    sprite1.origin.x = sprite1.x + (sprite1.bitmap.width - width) / 2;
    //精灵2 原点 x = 精灵1 y + (精灵2 位图 宽 - 宽 ) / 2
    sprite2.origin.x = sprite1.y + (sprite2.bitmap.width - width) / 2;
    //如果(游戏系统 是侧视())
    if ($gameSystem.isSideView()) {
        //精灵1 原点 y = 精灵1 y + 精灵1 位图 高 - 高
        sprite1.origin.y = sprite1.x + sprite1.bitmap.height - height;
        //精灵2 原点 y = 精灵1 y + 精灵2 位图 高 - 高
        sprite2.origin.y = sprite1.y + sprite2.bitmap.height - height;
    }
};
/**战斗背景1位图 */
Spriteset_Battle.prototype.battleback1Bitmap = function() {
    //返回 图像管理器 读取战斗背景1(战斗背景1名称())
    return ImageManager.loadBattleback1(this.battleback1Name());
};
/**战斗背景2位图 */
Spriteset_Battle.prototype.battleback2Bitmap = function() {
    //返回 图像管理器 读取战斗背景2(战斗背景2名称())
    return ImageManager.loadBattleback2(this.battleback2Name());
};
/**战斗背景1名称 */
Spriteset_Battle.prototype.battleback1Name = function() {
    //如果(战斗管理器 是战斗测试())
    if (BattleManager.isBattleTest()) {
        //返回 数据系统 战斗背景1名称
        return $dataSystem.battleback1Name;
    //否则 如果(游戏地图 战斗背景1名称())
    } else if ($gameMap.battleback1Name()) {
        //返回 游戏地图 战斗背景1名称()
        return $gameMap.battleback1Name();
    //否则 如果(游戏地图 是大地图())
    } else if ($gameMap.isOverworld()) {
        //返回 大地图战斗背景1名称()
        return this.overworldBattleback1Name();
    //否则
    } else {
        //返回 ""
        return '';
    }
};
/**战斗背景2名称 */
Spriteset_Battle.prototype.battleback2Name = function() {
    //如果(战斗管理器 是战斗测试())
    if (BattleManager.isBattleTest()) {
        //返回 数据系统 战斗背景2名称
        return $dataSystem.battleback2Name;
    //否则 如果(游戏地图 战斗背景2名称())
    } else if ($gameMap.battleback2Name()) {
        //返回 游戏地图 战斗背景2名称()
        return $gameMap.battleback2Name();
    //否则 如果(游戏地图 是大地图())
    } else if ($gameMap.isOverworld()) {
        //返回 大地图战斗背景2名称()
        return this.overworldBattleback2Name();
    //否则
    } else {
        //返回 ""
        return '';
    }
};
/**大地图战斗背景1名称 */
Spriteset_Battle.prototype.overworldBattleback1Name = function() {
    //如果(游戏地图 战斗背景1名称() === "" ) 返回 ""
    if ($gameMap.battleback1Name() === '') return '';
    //如果(游戏游戏者 是在交通工具())
    if ($gamePlayer.isInVehicle()) {
        //返回  船战斗背景1名称()
        return this.shipBattleback1Name();
    //否则
    } else {
        //返回 正常战斗背景1名称()
        return this.normalBattleback1Name();
    }
};
/**大地图战斗背景2名称 */
Spriteset_Battle.prototype.overworldBattleback2Name = function() {
    //如果(游戏地图 战斗背景2名称() === "" ) 返回 ""
    if ($gameMap.battleback2Name() === '') return '';
    //如果(游戏游戏者 是在交通工具())
    if ($gamePlayer.isInVehicle()) {
        //返回  船战斗背景2名称()
        return this.shipBattleback2Name();
    //否则
    } else {
        //返回 正常战斗背景2名称()
        return this.normalBattleback2Name();
    }
};
/**正常战斗背景1名称 */
Spriteset_Battle.prototype.normalBattleback1Name = function() {
    //返回 (范围战斗背景1名称(自动图块种类(1)) 或者
    return (this.terrainBattleback1Name(this.autotileType(1)) ||
        //范围战斗背景1名称(自动图块种类(0)) 或者 
        this.terrainBattleback1Name(this.autotileType(0)) ||
        // 默认战斗背景1名称() )
        this.defaultBattleback1Name());
};
/**正常战斗背景2名称 */
Spriteset_Battle.prototype.normalBattleback2Name = function() {
    //返回 (范围战斗背景2名称(自动图块种类(1)) 或者
    return (this.terrainBattleback2Name(this.autotileType(1)) ||
        //范围战斗背景2名称(自动图块种类(0)) 或者 
        this.terrainBattleback2Name(this.autotileType(0)) ||
        // 默认战斗背景2名称() )
        this.defaultBattleback2Name());
};
/**范围战斗背景1名称  */
Spriteset_Battle.prototype.terrainBattleback1Name = function(type) {
    switch (type) {
        case 24:
        case 25:
            return 'Wasteland';
        case 26:
        case 27:
            return 'DirtField';
        case 32:
        case 33:
            return 'Desert';
        case 34:
            return 'Lava1';
        case 35:
            return 'Lava2';
        case 40:
        case 41:
            return 'Snowfield';
        case 42:
            return 'Clouds';
        case 4:
        case 5:
            return 'PoisonSwamp';
        default:
            return null;
    }
};
/**范围战斗背景2名称  */
Spriteset_Battle.prototype.terrainBattleback2Name = function(type) {
    switch (type) {
        case 20:
        case 21:
            return 'Forest';
        case 22:
        case 30:
        case 38:
            return 'Cliff';
        case 24:
        case 25:
        case 26:
        case 27:
            return 'Wasteland';
        case 32:
        case 33:
            return 'Desert';
        case 34:
        case 35:
            return 'Lava';
        case 40:
        case 41:
            return 'Snowfield';
        case 42:
            return 'Clouds';
        case 4:
        case 5:
            return 'PoisonSwamp';
    }
};
/**默认战斗背景1名称 */
Spriteset_Battle.prototype.defaultBattleback1Name = function() {
    return 'Grassland';
};
/**默认战斗背景2名称 */
Spriteset_Battle.prototype.defaultBattleback2Name = function() {
    return 'Grassland';
};
/**船战斗背景1名称 */
Spriteset_Battle.prototype.shipBattleback1Name = function() {
    return 'Ship';
};
/**船战斗背景2名称 */
Spriteset_Battle.prototype.shipBattleback2Name = function() {
    return 'Ship';
};
/**自动图块种类 */
Spriteset_Battle.prototype.autotileType = function(z) {
    //返回 游戏地图 自动图块种类(游戏游戏者 x , 游戏游戏者 y, z )
    return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
};
/**创建敌人 */
Spriteset_Battle.prototype.createEnemies = function() {
    //敌人组 = 游戏敌群 成员组()
    var enemies = $gameTroop.members();
    //精灵组 = []
    var sprites = [];
    //循环 (开始时 i = 0 ; 当 i <  敌人组 长度 ;每一次 i++)
    for (var i = 0; i < enemies.length; i++) {
        //精灵组[i] = 新 精灵敌人(敌人组[i])
        sprites[i] = new Sprite_Enemy(enemies[i]);
    }
    //精灵组排序 (比较敌人精灵 绑定(this) )
    sprites.sort(this.compareEnemySprite.bind(this));
    //循环 (开始时 j = 0 ; 当 j <  精灵组 长度 ;每一次 j++)
    for (var j = 0; j < sprites.length; j++) {
        //战斗区域 添加子项(精灵组[j])
        this._battleField.addChild(sprites[j]);
    }
    //敌人精灵组 = 精灵组
    this._enemySprites = sprites;
};
/**比较敌人精灵 */
Spriteset_Battle.prototype.compareEnemySprite = function(a, b) {
    //如果(a.y !== b.y)
    if (a.y !== b.y) {
        //返回 a.y !== b.y
        return a.y - b.y;
    //否则
    } else {
        //返回 b 精灵id  - a 精灵id
        return b.spriteId - a.spriteId;
    }
};
/**创建角色 */
Spriteset_Battle.prototype.createActors = function() {
    //角色精灵组 = []
    this._actorSprites = [];
    //循环 (开始时 i = 0 ; 当 i <  游戏队伍 最大战斗成员数() ;每一次 i++)
    for (var i = 0; i < $gameParty.maxBattleMembers(); i++) {
        //角色精灵组[i] = 新 精灵角色()
        this._actorSprites[i] = new Sprite_Actor();
        //战斗区域 添加子项(角色精灵组[i])
        this._battleField.addChild(this._actorSprites[i]);
    }
};
/**更新角色 */
Spriteset_Battle.prototype.updateActors = function() {
    //成员组 = 游戏队伍 战斗成员组()
    var members = $gameParty.battleMembers();
    //循环 (开始时 i = 0 ; 当 i <  角色精灵组 长度 ;每一次 i++)
    for (var i = 0; i < this._actorSprites.length; i++) {
        //角色精灵组[i] 设置战斗者(角色[i])       
        this._actorSprites[i].setBattler(members[i]);
    }
};
/**战斗者精灵组 */
Spriteset_Battle.prototype.battlerSprites = function() {
    //返回 敌人精灵组 连接(角色精灵组)
    return this._enemySprites.concat(this._actorSprites);
};
/**是动画播放中 */
Spriteset_Battle.prototype.isAnimationPlaying = function() {
    //返回 战斗精灵组() 一些 (精灵)
    return this.battlerSprites().some(function(sprite) {
        //返回 精灵 是动画播放中()
        return sprite.isAnimationPlaying();
    });
};
/**是效果中 */
Spriteset_Battle.prototype.isEffecting = function() {
    //返回 战斗精灵组() 一些 (精灵)
    return this.battlerSprites().some(function(sprite) {
        //返回 精灵 是效果中()    
        return sprite.isEffecting();
    });
};
/**是任何一个移动中 */
Spriteset_Battle.prototype.isAnyoneMoving = function() {
    //返回 战斗精灵组() 一些 (精灵)
    return this.battlerSprites().some(function(sprite) {
        //返回 精灵 是移动中()
        return sprite.isMoving();
    });
};
/**是忙碌 */
Spriteset_Battle.prototype.isBusy = function() {
    //返回 是动画播放中() 或者 是任何一个移动中()
    return this.isAnimationPlaying() || this.isAnyoneMoving();
};