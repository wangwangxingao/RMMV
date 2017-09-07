//=============================================================================
// XPMVCharacter.js
//=============================================================================

/*:
 * @plugindesc xp行走图兼容
 * @author wangwang
 *   
 * @param XPMVCharacter
 * @desc 插件 xp行走图兼容
 * @default 汪汪
 *   
 * @param xp
 * @desc 文件名包含有 xx 的字符串
 * @default xp 
 * 
 * @help  
 * 行走图文件名包含有 参数 xp 的为xp的行走图 ,兼容之
 * 
 */
ImageManager.isXPCharacter = function(characterName) {
    if (this._xp) {
        if (this._xp === true) {
            return false
        }
        if (characterName.indexOf(this._xp) >= 0) {
            return true
        }
    } else {
        this._load_xp()
        this.isXPCharacter(characterName)
    }
    return false
};

ImageManager._load_xp = function() {
    var find = function(name) {
        var parameters = PluginManager.parameters[name];
        if (parameters) {} else {
            var pls = PluginManager._parameters
            for (var n in pls) {
                if (pls[n] && (name in pls[n])) {
                    parameters = pls[n]
                }
            }
        }
        return parameters = parameters || {}
    }
    var get = function(p, n, unde) {
        try {
            var i = p[n]
        } catch (e) {
            var i = unde
        }
        return i === undefined ? unde : i
    }
    var p = find("XPMVCharacter")
    this._xp = get(p, "xp")
    if (!this._xp) {
        this._xp = true
    }
}


/**人物块x */
Sprite_Character.prototype.characterBlockX = function() {
    if (this._isBigCharacter) {
        return 0;
    } else {
        var index = this._character.characterIndex();
        return index % 4 * 4;
    }
};

/**图案宽 */
Sprite_Character.prototype.patternWidth = function() {
    var p = this._isXPCharacter ? 4 : 3
    if (this._tileId > 0) {
        return $gameMap.tileWidth();
    } else if (this._isBigCharacter) {
        return this.bitmap.width / p;
    } else {
        return this.bitmap.width / (4 * p);
    }
};


Sprite_Character.prototype.characterPatternX = function() {
    var p = this._character.pattern()
    return (this._isXPCharacter || p < 3) ? p : 1;
};

Sprite_Character.prototype.characterBlockX = function() {
    var p = this._isXPCharacter ? 4 : 3
    if (this._isBigCharacter) {
        return 0;
    } else {
        var index = this._character.characterIndex();
        return index % 4 * p;
    }
};


Sprite_Character.prototype.setCharacterBitmap = function() {
    this._isXPCharacter = ImageManager.isXPCharacter(this._characterName)
    this.bitmap = ImageManager.loadCharacter(this._characterName);
    this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

/**图案*/
Game_CharacterBase.prototype.pattern = function() {
    return this._pattern
};