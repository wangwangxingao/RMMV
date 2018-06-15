/**----------------------------------------------------------------------------- */
/** Sprite_Character */
/** 精灵人物 */
/** The sprite for displaying a character. */
/** 显示人物的精灵 */

function Sprite_Character() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_Character.prototype = Object.create(Sprite_Base.prototype);
/**设置创造者 */
Sprite_Character.prototype.constructor = Sprite_Character;
/**初始化 
 * @param {Game_Character|Game_Player|Game_Follower|Game_Vehicle|Game_Event} 人物
*/
Sprite_Character.prototype.initialize = function(character) {
    //精灵基础 初始化 呼叫(this)
    Sprite_Base.prototype.initialize.call(this);
    //初始化成员组()
    this.initMembers();
    //设置人物(人物)
    this.setCharacter(character);
};
/**初始化成员组 */
Sprite_Character.prototype.initMembers = function() {
    //锚 x  = 0.5
    this.anchor.x = 0.5;
    //锚 y  = 1
    this.anchor.y = 1;
    //人物 = null
    this._character = null;
    //气泡方向
    this._balloonDuration = 0;
    //图块设置id = 0
    this._tilesetId = 0;
    //上层身体 = null
    this._upperBody = null;
    //下层身体 = null
    this._lowerBody = null;
};
/**设置人物 
 * @param {Game_Character} character 人物 
 */
Sprite_Character.prototype.setCharacter = function(character) {
    //人物 = character//人物
    this._character = character;
};
/**更新 */
Sprite_Character.prototype.update = function() {
    //精灵基础 更新 呼叫(this)
    Sprite_Base.prototype.update.call(this);
    //更新位图() 
    this.updateBitmap();
    //更新帧()
    this.updateFrame();
    //更新位置()
    this.updatePosition();
    //更新动画()
    this.updateAnimation();
    //更新气球()
    this.updateBalloon();
    //更新其他()
    this.updateOther();
};
/**更新可见度 */
Sprite_Character.prototype.updateVisibility = function() {
    //精灵 更新可见度 呼叫(this)
    Sprite_Base.prototype.updateVisibility.call(this);
    //如果(人物 是透明() )
    if (this._character.isTransparent()) {
        //可见度 = false
        this.visible = false;
    }
};
/**是图块 */
Sprite_Character.prototype.isTile = function() {
    //返回 角色 图块id > 0 
    return this._character.tileId > 0;
};
/**图块位图
 * @param {number} tileId 图块id
 * @return {Bitmap} 位图
 */
Sprite_Character.prototype.tilesetBitmap = function(tileId) {
    //图块设置 = 游戏地图 图块设置()
    var tileset = $gameMap.tileset();
    //设置数目 = 5 + 数学 向下取整(图块id / 256)
    var setNumber = 5 + Math.floor(tileId / 256);
    //返回 图像管理器 读取图块设置(图块设置 图块设置名称组[设置数目])
    return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};
/**更新位图 */
Sprite_Character.prototype.updateBitmap = function() {
    //如果(是图像改变的())
    if (this.isImageChanged()) {
        //图块设置id = 游戏地图 图块设置id()
        this._tilesetId = $gameMap.tilesetId();
        //图块id = 人物 图块id()
        this._tileId = this._character.tileId();
        //行走图名称 = 人物 行走图名称()
        this._characterName = this._character.characterName();
        //行走图索引 = 人物 行走图索引()
        this._characterIndex = this._character.characterIndex();
        //如果(图块id > 0)
        if (this._tileId > 0) {
            //设置图块位图()
            this.setTileBitmap();
        //否则
        } else {
            //设置人物位图()
            this.setCharacterBitmap();
        }
    }
};
/**是图像变化 */
Sprite_Character.prototype.isImageChanged = function() {
    //返回 ( 图块设置id !== 游戏地图 图块设置id() || 
    return (this._tilesetId !== $gameMap.tilesetId() ||
        //图块id !== 人物 图块id ||
        this._tileId !== this._character.tileId() ||
        //行走图名称 !== 人物 行走图名称 || 
        this._characterName !== this._character.characterName() ||
        //行走图索引 !== 人物 行走图索引 )
        this._characterIndex !== this._character.characterIndex());
};
/**设置图块位图 */
Sprite_Character.prototype.setTileBitmap = function() {
    //位图 = 图块设置位图(图块id)
    this.bitmap = this.tilesetBitmap(this._tileId);
};
/**设置人物位图 */
Sprite_Character.prototype.setCharacterBitmap = function() {
    //位图 = 图像管理器 读取行走图(行走图名称)
    this.bitmap = ImageManager.loadCharacter(this._characterName);
    //是大特征 = 图像管理器 是大特征(行走图名称)
    this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};
/**更新帧 */
Sprite_Character.prototype.updateFrame = function() {
    //如果(图块id > 0 )
    if (this._tileId > 0) {
        //更新图块帧()
        this.updateTileFrame();
    //否则 
    } else {
        //更新人物帧
        this.updateCharacterFrame();
    }
};
/**更新图块帧 */
Sprite_Character.prototype.updateTileFrame = function() {
    //pw = 图案宽()
    var pw = this.patternWidth();
    //ph = 图案高()
    var ph = this.patternHeight();
    //sx = (数学 向下取整 (图块id /128) % 2 * 8 + 图块id % 8 ) * 图案宽
    var sx = (Math.floor(this._tileId / 128) % 2 * 8 + this._tileId % 8) * pw;
    //sx = 数学 向下取整 (图块id /256) % 16 * 图案高
    var sy = Math.floor(this._tileId % 256 / 8) % 16 * ph;
    //设置帧(sx,sy,pw,ph)
    this.setFrame(sx, sy, pw, ph);
};
/**更新人物帧 */
Sprite_Character.prototype.updateCharacterFrame = function() {
    //pw = 图案宽()
    var pw = this.patternWidth();
    //ph = 图案高()
    var ph = this.patternHeight();
    //sx = (人物块x() + 人物图案x()) * 图案宽
    var sx = (this.characterBlockX() + this.characterPatternX()) * pw;
    //sy = (人物块y() + 人物图案y()) * 图案高
    var sy = (this.characterBlockY() + this.characterPatternY()) * ph;
    //更新一半身体精灵()
    this.updateHalfBodySprites();
    //如果 (灌木丛深度 > 0)
    if (this._bushDepth > 0) {
        //d = 灌木丛深度 
        var d = this._bushDepth;
        //上层身体 设置帧(sx,sy,pw,ph-d)
        this._upperBody.setFrame(sx, sy, pw, ph - d);
        //上层身体 设置帧(sx,sy + ph - d ,pw, d)
        this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
        //设置帧(sx,sy,0,ph)
        this.setFrame(sx, sy, 0, ph);
    //否则
    } else {
        //设置帧(sx,sy,pw,ph)
        this.setFrame(sx, sy, pw, ph);
    }
};
/**人物块x */
Sprite_Character.prototype.characterBlockX = function() {
    //如果(是大特征)
    if (this._isBigCharacter) {
        //返回 0
        return 0;
    //否则
    } else {
        //索引 = 人物 行走图索引()
        var index = this._character.characterIndex();
        //返回 索引 % 4 * 3
        return index % 4 * 3;
    }
};
/**人物块y */
Sprite_Character.prototype.characterBlockY = function() {
    //如果(是大特征)
    if (this._isBigCharacter) {
        //返回 0
        return 0;
    //否则
    } else {
        //索引 = 人物 行走图索引()
        var index = this._character.characterIndex();
        //返回 数学 向下取整(索引 / 4) * 4
        return Math.floor(index / 4) * 4;
    }
};
/**人物图案x */
Sprite_Character.prototype.characterPatternX = function() {
    //返回 人物 图案()
    return this._character.pattern();
};
/**人物图案y */
Sprite_Character.prototype.characterPatternY = function() {
    //返回 (人物 方向() -2 ) / 2 
    return (this._character.direction() - 2) / 2;
};
/**图案宽 */
Sprite_Character.prototype.patternWidth = function() {
    //如果(图块id > 0)
    if (this._tileId > 0) {
        //返回 游戏地图 图块宽()
        return $gameMap.tileWidth();
    //否则 如果(是大特征)
    } else if (this._isBigCharacter) {
        //返回 位图 宽 / 3 
        return this.bitmap.width / 3;
    //否则
    } else {
        //返回 位图 宽 / 12 
        return this.bitmap.width / 12;
    }
};
/**图案高 */
Sprite_Character.prototype.patternHeight = function() {
    //如果(图块id > 0)
    if (this._tileId > 0) {
        //返回 游戏地图 图块高()
        return $gameMap.tileHeight();
    //否则 如果(是大特征)
    } else if (this._isBigCharacter) {
        //返回 位图 高 / 4
        return this.bitmap.height / 4;
    //否则
    } else {
        //返回 位图 宽 / 8
        return this.bitmap.height / 8;
    }
};
/**更新一半身体精灵 */
Sprite_Character.prototype.updateHalfBodySprites = function() {
    if (this._bushDepth > 0) {
        this.createHalfBodySprites();
        this._upperBody.bitmap = this.bitmap;
        this._upperBody.visible = true;
        this._upperBody.y = -this._bushDepth;
        this._lowerBody.bitmap = this.bitmap;
        this._lowerBody.visible = true;
        this._upperBody.setBlendColor(this.getBlendColor());
        this._lowerBody.setBlendColor(this.getBlendColor());
        this._upperBody.setColorTone(this.getColorTone());
        this._lowerBody.setColorTone(this.getColorTone());
    } else if (this._upperBody) {
        this._upperBody.visible = false;
        this._lowerBody.visible = false;
    }
};
/**创建一半身体精灵 */
Sprite_Character.prototype.createHalfBodySprites = function() {
    if (!this._upperBody) {
        this._upperBody = new Sprite();
        this._upperBody.anchor.x = 0.5;
        this._upperBody.anchor.y = 1;
        this.addChild(this._upperBody);
    }
    if (!this._lowerBody) {
        this._lowerBody = new Sprite();
        this._lowerBody.anchor.x = 0.5;
        this._lowerBody.anchor.y = 1;
        this._lowerBody.opacity = 128;
        this.addChild(this._lowerBody);
    }
};
/**更新位置 */
Sprite_Character.prototype.updatePosition = function() {
    this.x = this._character.screenX();
    this.y = this._character.screenY();
    this.z = this._character.screenZ();
};
/**更新动画 */
Sprite_Character.prototype.updateAnimation = function() {
    this.setupAnimation();
    if (!this.isAnimationPlaying()) {
        this._character.endAnimation();
    }
    if (!this.isBalloonPlaying()) {
        this._character.endBalloon();
    }
};
/**更新其他 */
Sprite_Character.prototype.updateOther = function() {
    this.opacity = this._character.opacity();
    this.blendMode = this._character.blendMode();
    this._bushDepth = this._character.bushDepth();
};
/**安装动画 */
Sprite_Character.prototype.setupAnimation = function() {
    if (this._character.animationId() > 0) {
        var animation = $dataAnimations[this._character.animationId()];
        this.startAnimation(animation, false, 0);
        this._character.startAnimation();
    }
};
/**安装气球 */
Sprite_Character.prototype.setupBalloon = function() {
    if (this._character.balloonId() > 0) {
        this.startBalloon();
        this._character.startBalloon();
    }
};
/**开始气球 */
Sprite_Character.prototype.startBalloon = function() {
    if (!this._balloonSprite) {
        this._balloonSprite = new Sprite_Balloon();
    }
    this._balloonSprite.setup(this._character.balloonId());
    this.parent.addChild(this._balloonSprite);
};
/**更新气球 */
Sprite_Character.prototype.updateBalloon = function() {
    this.setupBalloon();
    if (this._balloonSprite) {
        this._balloonSprite.x = this.x;
        this._balloonSprite.y = this.y - this.height;
        if (!this._balloonSprite.isPlaying()) {
            this.endBalloon();
        }
    }
};
/**结束气球 */
Sprite_Character.prototype.endBalloon = function() {
    if (this._balloonSprite) {
        this.parent.removeChild(this._balloonSprite);
        this._balloonSprite = null;
    }
};
/**是气球播放中 */
Sprite_Character.prototype.isBalloonPlaying = function() {
    return !!this._balloonSprite;
};