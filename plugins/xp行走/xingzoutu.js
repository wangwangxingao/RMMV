



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
    if (this._tileId > 0) {
        return $gameMap.tileWidth();
    } else if (this._isBigCharacter) {
        return this.bitmap.width / 4;
    } else {
        return this.bitmap.width / 16;
    }
};   
/**最大图案*/
Game_CharacterBase.prototype.maxPattern = function() {
    //返回 4
    return 4;
};
/**图案*/
Game_CharacterBase.prototype.pattern = function() { 
    return this._pattern 
};


