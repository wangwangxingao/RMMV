//=============================================================================
// CharacterHZ.js
//=============================================================================
/*:
 * @plugindesc 
 * CharacterHZ,换装系统, 
 * @author wangwang
 *
 * @param  CharacterHZ
 * @desc 插件 换装系统 ,作者:汪汪
 * @default  汪汪
 *  
 * @help 
 * 
 * $gamePlayer.setCharacterHZ(name, cm,ci ,zs, dt,pt)
 * 
 * name : 一个换装(唯一的,确定这一层)
 * cm : 行走图名称
 * ci : 行走图索引
 * zs : 各个方向的行走图高度,当角色朝向某方向时该层的位置 [0,0,3,0,8,0,9,0,5,0] 
 * dt : 方向种类(显示的行走图纵列) ,如果不设置,方向默认为与角色一致,
 * pt : 图案种类(显示的行走图横列) ,如果不设置,图案默认为与角色一致,否则为自己的() 
 * 换装基于 Game_CharacterBase, 可以使用  Game_CharacterBase 中的方法
 * 
 * 
 */



function Game_CharacterHZ() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
Game_CharacterHZ.prototype = Object.create(Game_CharacterBase.prototype);
/**设置创造者*/
Game_CharacterHZ.prototype.constructor = Game_CharacterHZ;

Game_CharacterHZ.prototype.initMembers = function() {
    Game_CharacterBase.prototype.initMembers.call(this);
    this._screenX = 0
    this._screenY = 0
    this._screenZ = 0;
};



Game_CharacterHZ.prototype.setDirectionType = function(z) {
    this._directionType = z || 0
};

Game_CharacterHZ.prototype.setPatternType = function(z) {
    this._patternType = z || 0
};


Game_CharacterHZ.prototype.setZIndexHash = function(o) {
    if (typeof(o) == "number") {
        this._zIndexHash = [o, o, o, o, o, o, o, o, o, o]
    } else {
        this._zIndexHash = o;
    }
};


Game_CharacterHZ.prototype.setZIndexD = function(d, z) {
    if (!this._zIndexHash) {
        this._zIndexHash = []
    }
    this._zIndexHash[d] = z;
};


/**更新 */
Game_CharacterHZ.prototype.update = function(that) {
    if (that) {
        if (this._patternType) {
            this.updateAnimation()
        } else {
            this._pattern = that._pattern
        }

        var d = that._direction
        if (this._directionType) {} else {
            this._direction = d
        }

        if (typeof((this._zIndexHash || 0)) == "number") {
            this._screenZ = this._zIndexHash || 0
        } else {
            this._screenZ = this._zIndexHash[d] || 0
        }
        // console.log(d, this._screenZ, this._zIndexHash)
    } else {
        this._transparent = true
    }
}
Game_CharacterHZ.prototype.screenX = function() {
    return this._screenX;
};
/**画面y*/
Game_CharacterHZ.prototype.screenY = function() {
    return this._screenY;
};


Game_CharacterHZ.prototype.screenZ = function() {
    return this._screenZ;
};


Game_CharacterBase.prototype.characterHZs = function() {
    return this._characterHZs;
};



Game_CharacterBase.prototype.setCharacterHZs = function(name, hz) {
    if (!this._characterHZs) {
        this._characterHZs = {}
    }
    this._characterHZs[name] = hz
    if (!this._characterHZsChange) {
        this._characterHZsChange = {}
    }
    this._characterHZsChange[name] = hz

};


Game_CharacterBase.prototype.makeCharacterHz = function(cm, ci, zs, dt, pt) {
    var hz = new Game_CharacterHZ()
    hz.setImage(cm, ci)
    hz.setZIndexHash(zs)
    hz.setDirectionType(dt)
    hz.setPatternType(pt)
    return hz
};


Game_CharacterBase.prototype.getCharacterHZ = function(name) {
    if (!this._characterHZs) {
        this._characterHZs = {}
    }
    return this._characterHZs[name]
};



Game_CharacterBase.prototype.setCharacterHZ = function(name, cm, ci, zs, dt, pt) {
    var hz = this.getCharacterHZ(name)
    if (hz) {
        hz.setImage(cm, ci)
        hz.setZIndexHash(zs)
        hz.setDirectionType(dt)
        hz.setPatternType(pt)
    } else {
        this.setCharacterHZs(name, this.makeCharacterHz(cm, ci, zs, dt, pt))
    }
};



Game_CharacterHZ._Game_CharacterBase_prototype_update = Game_CharacterBase.prototype.update
Game_CharacterBase.prototype.update = function() {
    Game_CharacterHZ._Game_CharacterBase_prototype_update.call(this);
    this.updateHZ();
};

Game_CharacterBase.prototype.updateHZ = function() {
    if (this._characterHZs) {
        for (var i in this._characterHZs) {
            var hz = this._characterHZs[i]
            hz && hz.update && hz.update(this)
        }
    }
}


Game_CharacterHZ._Sprite_Character_prototype_update = Sprite_Character.prototype.update
Sprite_Character.prototype.update = function() {
    Game_CharacterHZ._Sprite_Character_prototype_update.call(this);
    this.updateHZ();
};



Sprite_Character.prototype.updateHZ = function() {
    if (this._character) {
        var hzs = this._character._characterHZs
        var hgs = this._character._characterHZsChange
        if (!this._characterHZs) {
            this._characterHZs = {}
            if (hzs) {
                for (var i in hzs) {
                    this._characterHZs[i] = new Sprite_Character(hzs[i])
                    this.addChild(this._characterHZs[i])
                }
            }
        } else if (hgs) {
            for (var i in hgs) {
                var hz = hgs[i]
                if (hz) {
                    if (!this._characterHZs[i]) {
                        this._characterHZs[i] = new Sprite_Character(hz)
                        this.addChild(this._characterHZs[i])
                    } else {
                        var s = this._characterHZs[i]
                        s.setCharacter(hz)
                    }
                } else {
                    if (this._characterHZs[i]) {
                        var s = this._characterHZs[i]
                        this.removeChild(s)
                        delete this._characterHZs[i]
                    }
                }
            }
        }
        this._character._characterHZsChange = null

    } else {
        if (this._characterHZs) {
            for (var i in this._characterHZs) {
                var s = this._characterHZs[i]
                this.removeChild(s)
            }
        }
        this._characterHZs = null
    }
    this._sortChildren()
}




Sprite_Character.prototype._sortChildren = function() {
    this.children.sort(this._compareChildOrder.bind(this));
};

Sprite_Character.prototype._compareChildOrder = function(a, b) {
    var az = a.z || 0
    var bz = b.z || 0
    if (az !== bz) {
        return az - bz;
    } else {
        return a.spriteId - b.spriteId;
    }
};