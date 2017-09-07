//=============================================================================
// WindowCharacterSprite.js
//=============================================================================

/*:
 * @plugindesc 窗口添加行走图
 * @author wangwang
 *   
 * @param WindowCharacterSprite
 * @desc 插件 窗口添加行走图 ,作者 汪汪
 * @default 汪汪
 * 
 * 
 * @help  
 *  
 * 对于窗口 window  
 * window.addCharacter(index , 行走图名称,索引, x,y)
 * 添加一个行走图  
 * 注意,xy是行走图正下方的位置
 * window.getCharacter(index ) 
 * 返回索引对应对象 {c:物体 ,s:精灵}
 * c的设置同游戏角色的设置 
 * 比如  window.getCharacter(index ).c.setStepAnime(true) 设置停止动画
 * window.delCharacter(index) 
 * 删除索引对应
 * 
 * 举例:
 * SceneManager._scene._commandWindow.addCharacter(2,"Actor1",1,10,10).c.setStepAnime(true)
 * SceneManager._scene._commandWindow.getCharacter(2).c.setStepAnime(false)
 * 
 * 
 * 
 **/



function Sprite_Character2() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_Character2.prototype = Object.create(Sprite_Character.prototype);
/**设置创造者 */
Sprite_Character2.prototype.constructor = Sprite_Character2;
/**初始化 */
Sprite_Character2.prototype.initialize = function (character) {
    Sprite_Character.prototype.initialize.call(this, character);
};



Sprite_Character2.prototype.update = function () {
    this._character && this._character.update && this._character.update()
    Sprite_Character.prototype.update.call(this);
};


function Game_Character2() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
Game_Character2.prototype = Object.create(Game_CharacterBase.prototype);
/**设置创造者*/
Game_Character2.prototype.constructor = Game_Character2;


Game_Character2.prototype.screenX = function () {
    return this._realX
};
/**画面y*/
Game_Character2.prototype.screenY = function () {
    return this._realY
};


Window_Base.prototype.addCharacter = function (index, characterName, characterIndex, x, y) {
    this._characters = this._characters || {}
    if (this._characters[index]) {
        var o = this._characters[index]
        var s = o.s
        this._windowContentsSprite.removeChild(s)
        delete this._characters[index]
    }
    if (characterName) {
        var c = new Game_Character2()
        c.setPosition(x, y)
        c.setImage(characterName, characterIndex)
        var s = new Sprite_Character2(c)
        this._windowContentsSprite.addChild(s)
        return this._characters[index] = { "c": c, "s": s }
    }
};
Window_Base.prototype.delCharacter = function (index) {
    this.addCharacter(index)
};

Window_Base.prototype.getCharacter = function (index) {
    this._characters = this._characters || {}
    return this._characters[index]
};




