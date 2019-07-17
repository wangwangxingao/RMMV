//=============================================================================
// 2w_mapclone.js
//=============================================================================
/*:
 * @plugindesc 克隆地图
 * @author wangwang
 *
 * @param  2w_mapclone
 * @desc 插件 克隆地图,作者:汪汪
 * @default 汪汪 
 *
 * @help  
 * 
 * 
 * 设置角色显示  
 * $gameScreen.setCharacterShow(id,type)
 * @param {number} id  id , 0 游戏玩家 -n 随从(-1为第一个)   n 事件(事件id)
 * @param {number} type 种类 0 只显示下面的, 1 只显示上面的 , 2 都显示 
 * $gameScreen.setCharacterShow(id, type) 
 * 设置遮罩名称,控制显示区域
 * @param {string} name 遮罩名称  
 * $gameScreen.setMapMask  (name) 
 * 设置遮罩位置
 * @param {[number,number]} pos 遮罩位置 如[100,200] 移动到  100,200 
 * $gameScreen.setMapMaskPos  (pos)  
 * 设置地图渲染值
 * @param {number} type 种类 0为正常 -1 为黑白 其他值...自己尝试看看吧
 * $gameScreen.setMapFilterType  (type) 
 * 设置遮罩比例
 * @param {number} scale 遮罩比例
 * $gameScreen.setMaskScale   (scale) 
 * 
 *
 * 
 * 
 * 
 */






/**
 * 设置角色显示  
 * $gameScreen.setCharacterShow(id,type)
 * @param {number} id  id , 0 游戏玩家 -n 随从(-1为第一个)   n 事件(事件id)
 * @param {number} type 种类 0 只显示下面的, 1 只显示上面的 , 2 都显示 
 */
Game_Screen.prototype.setCharacterShow = function (id, type) {
    var character
    if (id < 0) {
        character = $gamePlayer.followers().follower(-id - 1)
    } else if (id == 0) {
        character = $gamePlayer
    } else {
        character = $gameMap.event(id);
    }
    if (character) {
        character._mapShowType = type
    }
    return character
}

/** 
 * 设置遮罩名称,控制显示区域
 * @param {string} name 遮罩名称  
 */
Game_Screen.prototype.setMapMask = function (name) {
    this._maskName = name
}

/** 
 * 设置遮罩位置
 * @param {[number,number]} pos 遮罩位置 如[100,200] 移动到  100,200 
 */
Game_Screen.prototype.setMapMaskPos = function (pos) {
    this._maskPos = pos
}
 

/** 
 * 设置地图渲染值
 * @param {number} type 种类 0为正常 -1 为黑白 其他值...自己尝试看看吧
 */
Game_Screen.prototype.setMapFilterType = function (type) {
    this._tilemapfilterType = type
}


/** 
 * 设置遮罩比例
 * @param {number} scale 遮罩比例
 */
Game_Screen.prototype.setMaskScale = function (scale) {
    this._maskScale = scale
}
 



Scene_Map.prototype.setMask = function (s) {
    if (this._tilemapClone.mask) {
        this._tilemapClone.removeChild(this._tilemapClone.mask)
    }
    this._tilemapClone.mask = s
    if (this._tilemapClone.mask) {
        this._tilemapClone.addChild(this._tilemapClone.mask)
    }
}


Scene_Map.prototype.updateFilter = function () {
    if (this._tilemapfilterType != $gameScreen._tilemapfilterType) {
        this._tilemapfilterType = $gameScreen._tilemapfilterType || 0
        this._tilemapfilter.saturate(this._tilemapfilterType)
    }
}

Scene_Map.prototype.updateMask = function () {
    var maskname = $gameScreen ? $gameScreen._maskName : ""
    if (maskname != this._maskName) {
        this._maskName = maskname || ""
        if (this._maskName) {
            this.setMask(new Sprite(ImageManager.loadPicture(this._maskName)))
        } else {
            this.setMask(null)
        }
    }
    var mask = this._tilemapClone.mask
    if (mask) {
        var tone = $gameScreen ? $gameScreen._maskTone : null
        if (tone) {
            if (!this._maskTone || !this._maskTone.equals(tone)) {
                this._maskTone = tone
                mask.setColorTone(tone)
            }
            ///$gameScreen._maskTone = null
        }
        var scale = $gameScreen ? $gameScreen._maskScale : null
        scale = scale || 1
        if (scale && scale != mask.iscale) {
            mask.scale.x = scale
            mask.scale.y = scale
            mask.iscale = scale
        }
        var pos = $gameScreen ? $gameScreen._maskPos : null
        if (pos) {
            mask.x = pos[0]
            mask.y = pos[1]
        }
    }
}



Scene_Map.prototype._sortChildren = function () {
    this._tilemapUp.children.sort(function (a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    });
};


Scene_Map.prototype.createClone = function () {

    this._tilemapUp = new Sprite()

    var brt = new PIXI.BaseRenderTexture(Graphics._width, Graphics._height, PIXI.SCALE_MODES.LINEAR, 1);
    var rt = new PIXI.RenderTexture(brt);
    var sprite = new PIXI.Sprite(rt);
    this._tilemapClone = sprite
    this._tilemapCloneRt = rt
    this._tilemapClone.z = 0
    this._tilemap = this._spriteset._tilemap
    this._tilemapUp.addChild(this._tilemapClone)
    this._tilemapfilter = new PIXI.filters.ColorMatrixFilter()
    this._tilemapfilter.saturate(0)
    this._tilemapClone.filters = [this._tilemapfilter]

    this._characterSprites = [];
    //游戏地图 事件组 对每一个(事件)  
    $gameMap.events().forEach(function (event) {
        //人物精灵组 添加(新 精灵人物(事件))
        this._characterSprites.push(new Sprite_Character(event));
    }, this);
    //游戏地图 交通工具组 对每一个(交通工具)  
    $gameMap.vehicles().forEach(function (vehicle) {
        //人物精灵组 添加(新 精灵人物(交通工具))
        this._characterSprites.push(new Sprite_Character(vehicle));
    }, this);
    //游戏游戏者 随从组() 倒序每一个 (随从)
    $gamePlayer.followers().reverseEach(function (follower) {
        //人物精灵组 添加(新 精灵人物(随从))
        this._characterSprites.push(new Sprite_Character(follower));
    }, this);
    //人物精灵组 添加(新 精灵人物(游戏游戏者))
    this._characterSprites.push(new Sprite_Character($gamePlayer));
    //循环 (开始时 i = 0 ; 当 i <  人物精灵组 长度 ;每一次 i++)
    for (var i = 0; i < this._characterSprites.length; i++) {
        var c = this._characterSprites[i]
        c._mapShowType = 1
        this._tilemapUp.addChild(c);
    }

    this.addChild(this._tilemapUp)
};



SceneManager.renderScene = function () {
    if (this.isCurrentSceneStarted()) {
        if (SceneManager._scene.constructor == Scene_Map) {
            SceneManager._scene.torender()
        }
        Graphics.render(this._scene);
    } else if (this._scene) {
        this.onSceneLoading();
    }
}



Scene_Map.prototype.createDisplayObjects = function () {
    //创建精灵组()
    this.createSpriteset();


    this.createClone()

    //创建地图名称窗口()
    this.createMapNameWindow();
    //创建窗口层()
    this.createWindowLayer();
    //创建所有窗口()
    this.createAllWindows();
};

Scene_Map.prototype.torender = function () {
    if (this._tilemap) {
        this._sortChildren()
        this.updateFilter()
        this.updateMask()
        Graphics._renderer.render(this._tilemap, this._tilemapCloneRt)
    }
};




Sprite_Character.prototype.updateVisibility = function () {
    //精灵 更新可见度 呼叫(this)
    Sprite_Base.prototype.updateVisibility.call(this);
    if (this._character.isTransparent()) {
        this.visible = false;
    }
    if (this._character._mapShowType != 2 && this._character._mapShowType != this._mapShowType) {
        this.visible = false;
    }
};














