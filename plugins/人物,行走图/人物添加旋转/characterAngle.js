//=============================================================================
// characterAngle.js
//=============================================================================

/*:
 * @plugindesc 人物行走图旋转
 * @author wangwang
 *   
 * @param characterAngle
 * @desc 插件 人物行走图旋转
 * @default 汪汪
 * 
 * 
 * @help 
 * characterAngle 
 * 人物行走图进行旋转
 * 
 * $gameMap.eventAngle(id,angle) 
 * id  事件id  为0时为玩家,<0时为追随者 >0时为相应事件
 * angle  角度
 * 
 * 
 * $gameMap.eventAnchor(id,x,y) 
 * id  事件id  为0时为玩家,<0时为追随者 >0时为相应事件
 * x  锚点x  0为最左边  1为最右边
 * y  锚点y  0为最上面  1为最下面
 * 
 * 
 */



(function () {

    Game_Map.prototype.eventAngle = function (id, angle) {
        if (id == 0) {
            var e = $gamePlayer
        } else if (id < 0) {
            var e = $gamePlayer.followers()[-id - 1]
        } else {
            var e = this.event(id)
        }
        if (e) {
            e.setAngle(angle)
        }
    }

    Game_Map.prototype.eventAnchor = function (id, x, y) {
        if (id == 0) {
            var e = $gamePlayer
        } else if (id < 0) {
            var e = $gamePlayer.followers()[-id - 1]
        } else {
            var e = this.event(id)
        }
        if (e) {
            e.setAnchor(x, y)
        }
    }


    /**初始化 */
    var _Game_CharacterBase_prototype_initialize = Game_CharacterBase.prototype.initialize
    Game_CharacterBase.prototype.initialize = function () {
        //初始化成员
        _Game_CharacterBase_prototype_initialize.call(this)
        this._angle = 0;
        this._anchorX = 0.5
        this._anchorY = 1
    };
    /**角度 */
    Game_CharacterBase.prototype.angle = function () {
        return this._angle || 0;
    };

    Game_CharacterBase.prototype.setAngle = function (angle) {
        return this._angle = angle || 0;
    };




    /**角度 */
    Game_CharacterBase.prototype.setAnchor = function (x, y) {
        this._anchorX = x || 0;
        this._anchorY = y || 0;
    };

    /**角度 */
    Game_CharacterBase.prototype.anchorX = function () {
        return this._anchorX;
    };
    /**角度 */
    Game_CharacterBase.prototype.anchorY = function () {
        return this._anchorY;
    };

    /**更新其他 */
    var _Sprite_Character_prototype_updateOther = Sprite_Character.prototype.updateOther
    Sprite_Character.prototype.updateOther = function () {
        _Sprite_Character_prototype_updateOther.call(this)
        this.rotation = this._character.angle() * Math.PI / 180;

        var anchorX = this._character.anchorX()
        var anchorY = this._character.anchorY()
        this.anchor.x = anchorX
        this.anchor.y = anchorY
        if(this._upperBody){
            this._upperBody.anchor.x = anchorX
            this._upperBody.anchor.y = anchorY
        }
        if (this._lowerBody) {
            this._lowerBody.anchor.x = anchorX
            this._lowerBody.anchor.y = anchorY
        }
    };

})()


