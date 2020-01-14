/**-----------------------------------------------------------------------------   
 * Spriteset_Map   
 * 精灵组地图   
 * The set of sprites on the map screen.   
 * 在地图画面 的 精灵 组 */

function Spriteset_Map() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Spriteset_Map.prototype = Object.create(Spriteset_Base.prototype);
/**设置创造者 */
Spriteset_Map.prototype.constructor = Spriteset_Map;
/**初始化 */
Spriteset_Map.prototype.initialize = function() {
    //精灵组基础 初始化 呼叫(this)
    Spriteset_Base.prototype.initialize.call(this);
};
/**-----------------------------------------------------------------------------   
 *创建较下的层   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.createLowerLayer = function() {
    //精灵组基础 创建较下的层 呼叫(this)
    Spriteset_Base.prototype.createLowerLayer.call(this);
    //创建远景图()
    this.createParallax();
    //创建图块地图()
    this.createTilemap();
    //创建人物()
    this.createCharacters();
    //创建阴影()
    this.createShadow();
    //创建方向()
    this.createDestination();
    //创建天气()
    this.createWeather();
};
/**-----------------------------------------------------------------------------   
 *更新   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.update = function() {
    //精灵组基础 更新 呼叫(this)
    Spriteset_Base.prototype.update.call(this);
    //更新图块设置()
    this.updateTileset();
    //更新远景图()
    this.updateParallax();
    //更新图块地图()
    this.updateTilemap();
    //更新阴影()
    this.updateShadow();
    //更新天气()
    this.updateWeather();
};
/**-----------------------------------------------------------------------------   
 *隐藏人物   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.hideCharacters = function() {
    //循环 (开始时 i = 0 ; 当 i <  人物精灵组 长度 ;每一次 i++)
    for (var i = 0; i < this._characterSprites.length; i++) {
        //精灵 = 人物精灵组[i]
        var sprite = this._characterSprites[i];
        //如果(不是 精灵 是图块())
        if (!sprite.isTile()) {
            //精灵 隐藏()
            sprite.hide();
        }
    }
};
/**-----------------------------------------------------------------------------   
 *创建远景图   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.createParallax = function() {
    //远景图 = 新 平铺精灵()
    this._parallax = new TilingSprite();
    //远景图 移动(0,0,图像 宽,图像高)
    this._parallax.move(0, 0, Graphics.width, Graphics.height);
    //基础精灵 添加子项(远景图)
    this._baseSprite.addChild(this._parallax);
};
/**-----------------------------------------------------------------------------   
 *创建图块地图   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.createTilemap = function() {
    //如果(图像 是webgl())
    if (Graphics.isWebGL()) {
        //图块地图 = 新 着色器图块地图()
        this._tilemap = new ShaderTilemap();
    //否则
    } else {
        //图块地图 = 新 图块地图()
        this._tilemap = new Tilemap();
    }
    //图块地图 图块宽 = 游戏地图 图块宽()
    this._tilemap.tileWidth = $gameMap.tileWidth();
    //图块地图 图块高 = 游戏地图 图块高()
    this._tilemap.tileHeight = $gameMap.tileHeight();
    //图块地图 设置地图(游戏地图 宽() ,游戏地图 高(),游戏地图 数据())
    this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    //图块地图 横循环 = 游戏地图 是横循环()
    this._tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    //图块地图 纵循环 = 游戏地图 是纵循环()
    this._tilemap.verticalWrap = $gameMap.isLoopVertical();
    //读取图块设置()
    this.loadTileset();
    //基础精灵 添加子项(图块精灵)
    this._baseSprite.addChild(this._tilemap);
};
/**-----------------------------------------------------------------------------   
 *读取图块设置   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.loadTileset = function() {
    //图块设置 = 游戏地图 图块设置()
    this._tileset = $gameMap.tileset();
    //如果(摊图块设置)
    if (this._tileset) {
        //读取图块设置名字组 = 图块设置 图块设置名称组
        var tilesetNames = this._tileset.tilesetNames;
        //循环 (开始时 i = 0 ; 当 i <  图块设置名称组 长度 ;每一次 i++)
        for (var i = 0; i < tilesetNames.length; i++) {
            //图块地图 位图[i] = 图像管理器 读取图块设置(图块设置名称组[i])
            this._tilemap.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
        }
        //新图块设置标志组 = 游戏地图 图块设置标志组()
        var newTilesetFlags = $gameMap.tilesetFlags();
        //图块地图 刷新图块设置()
        this._tilemap.refreshTileset();
        //如果(不是 图块地图 标志组 等于 (新图块地图标志组 ) )
        if (!this._tilemap.flags.equals(newTilesetFlags)) {
            //图块地图 刷新()
            this._tilemap.refresh();
        }
        //图块地图 标志组 = 新图块地图标志组
        this._tilemap.flags = newTilesetFlags;
    }
};
/**-----------------------------------------------------------------------------   
 *创建人物   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.createCharacters = function() {
    //人物精灵组 = []
    this._characterSprites = [];
    //游戏地图 事件组 对每一个(事件)  
    $gameMap.events().forEach(function(event) {
        //人物精灵组 添加(新 精灵人物(事件))
        this._characterSprites.push(new Sprite_Character(event));
    }, this);
    //游戏地图 交通工具组 对每一个(交通工具)  
    $gameMap.vehicles().forEach(function(vehicle) {
        //人物精灵组 添加(新 精灵人物(交通工具))
        this._characterSprites.push(new Sprite_Character(vehicle));
    }, this);
    //游戏游戏者 随从组() 倒序每一个 (随从)
    $gamePlayer.followers().reverseEach(function(follower) {
        //人物精灵组 添加(新 精灵人物(随从))
        this._characterSprites.push(new Sprite_Character(follower));
    }, this);
    //人物精灵组 添加(新 精灵人物(游戏游戏者))
    this._characterSprites.push(new Sprite_Character($gamePlayer));
    //循环 (开始时 i = 0 ; 当 i <  人物精灵组 长度 ;每一次 i++)
    for (var i = 0; i < this._characterSprites.length; i++) {
        //图块地图 添加子项(人物精灵组[i])
        this._tilemap.addChild(this._characterSprites[i]);
    }
};
/**-----------------------------------------------------------------------------   
 *创建阴影   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.createShadow = function() {
    //阴影精灵 = 新 精灵()
    this._shadowSprite = new Sprite();
    //阴影精灵 位图 = 图像管理器 读取系统("Shadow1")
    this._shadowSprite.bitmap = ImageManager.loadSystem('Shadow1');
    //阴影精灵 锚点 x = 0.5
    this._shadowSprite.anchor.x = 0.5;
    //阴影精灵 锚点 y = 1
    this._shadowSprite.anchor.y = 1;
    //阴影精灵 z = 6  
    this._shadowSprite.z = 6;
    //图块地图 添加子项(阴影精灵)
    this._tilemap.addChild(this._shadowSprite);
};
/**-----------------------------------------------------------------------------   
 *创建目的地   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.createDestination = function() {
    //目的地精灵 = 新 精灵目的地()
    this._destinationSprite = new Sprite_Destination();
    //目的地精灵 z = 9
    this._destinationSprite.z = 9;
    //图块地图 添加子项(目的地精灵)
    this._tilemap.addChild(this._destinationSprite);
};
/**-----------------------------------------------------------------------------   
 *创建天气   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.createWeather = function() {
    //天气 = 新 天气()
    this._weather = new Weather();
    //添加子项(天气)
    this.addChild(this._weather);
};
/**-----------------------------------------------------------------------------   
 *更新图块设置   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.updateTileset = function() {
    //如果(图块设置 !== 游戏地图 图块设置() )
    if (this._tileset !== $gameMap.tileset()) {
        //读取图块设置()
        this.loadTileset();
    }
};

/**-----------------------------------------------------------------------------   
 *画布重新添加远景图   
 *----------------------------------------------------------------------------- */
/*
 * Simple fix for canvas parallax issue, destroy old parallax and readd to the tree.
 */
Spriteset_Map.prototype._canvasReAddParallax = function() {
    //索引 = 基础精灵 子组 索引在(远景图)
    var index = this._baseSprite.children.indexOf(this._parallax);
    //基础精灵 移除子项(远景图)
    this._baseSprite.removeChild(this._parallax);
    //远景图 = 新 平铺精灵()
    this._parallax = new TilingSprite();
    //远景图 移动(0,0,图像 宽,图像高)
    this._parallax.move(0, 0, Graphics.width, Graphics.height);
    //远景图 位图 =  图像管理器 读取远景图(远景图名称)
    this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
    //基础精灵 添加子项在(远景图 , 索引)
    this._baseSprite.addChildAt(this._parallax, index);
};
/**-----------------------------------------------------------------------------   
 *更新远景图   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.updateParallax = function() {
    //如果(远景图名称 !== 游戏地图 远景图名称())
    if (this._parallaxName !== $gameMap.parallaxName()) {
        //远景图名称 = 游戏地图 远景图名称()
        this._parallaxName = $gameMap.parallaxName();
        //如果(远景图 位图 并且 图像 是webgl()!= true  )
        if (this._parallax.bitmap && Graphics.isWebGL() != true) {
            //画布重新添加远景图()
            this._canvasReAddParallax();
        } else {
            //远景图 位图  =  图像管理器 读取远景图(远景图名称)
            this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
        }
    }
    //如果(远景图 位图)
    if (this._parallax.bitmap) {
        //远景图 原点 x = 游戏地图 远景图ox()
        this._parallax.origin.x = $gameMap.parallaxOx();
        //远景图 原点 y = 游戏地图 远景图oy()
        this._parallax.origin.y = $gameMap.parallaxOy();
    }
};
/**-----------------------------------------------------------------------------   
 *更新图块地图   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.updateTilemap = function() {
    //图块地图 原点 x = 游戏地图 显示x() * 游戏地图 图块宽()
    this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    //图块地图 原点 y = 游戏地图 显示y() * 游戏地图 图块高()
    this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
};
/**-----------------------------------------------------------------------------   
 *更新阴影   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.updateShadow = function() {
    //天空船 = 游戏地图 天空船()
    var airship = $gameMap.airship();
    //阴影精灵 x = 天空船 阴影x()
    this._shadowSprite.x = airship.shadowX();
    //阴影精灵 y = 天空船 阴影y()
    this._shadowSprite.y = airship.shadowY();
    //阴影精灵 透明度 = 天空船 阴影透明度)
    this._shadowSprite.opacity = airship.shadowOpacity();
};
/**-----------------------------------------------------------------------------   
 *更新天气   
 *----------------------------------------------------------------------------- */
Spriteset_Map.prototype.updateWeather = function() {
    //天气 种类 = 游戏画面 天气种类()
    this._weather.type = $gameScreen.weatherType();
    //天气 强度 = 游戏画面 天气强度()
    this._weather.power = $gameScreen.weatherPower();
    //天气 原点 x = 游戏地图 显示x() * 游戏地图 图块宽()
    this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    //天气 原点 y = 游戏地图 显示y() * 游戏地图 图块高()
    this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
};