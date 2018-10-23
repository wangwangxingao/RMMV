//=============================================================================
//  moveCanType.js
//=============================================================================

/*:
 * @plugindesc  moveCanType 移动种类
 * @author wangwang
 *   
 * @param  moveCanType
 * @desc 插件 移动种类 ,作者:汪汪
 * @default 汪汪
 * 
 * @help
 * 
 * $gameMap.eventMoveCanType(id,moveCanType)
 * id 事件id ,为0时为角色,<0时为随从
 * 
 * moveCanType 为数组 
 *   数组可以填入取以下值(也可以为后面的数字)
 *   "isValid",   //是在地图中 0
 *   "isPassable",  //是普通角色通行 1
 *   "isBoatPassable", //是小船通行 2
 *   "isShipPassable", //是大船通行 3
 *   "isAirshipLandOk", //是天空船的允许的陆地 4
 *   "isLadder", //是梯子 5
 *   "isBush", //是灌木丛 6
 *   "isCounter", //是柜台 7
 *   "isDamageFloor", //是伤害地形 8
 *   "terrainTag", //地域标签 9  当为这个时,下一个参数为标签值
 *   "regionId",//区域id  10   当为这个时,下一个参数为区域值或区域的数组
 *   "isCollidedWithCharacters" //是与事件碰撞 11
 *   
 * 当数组不为空,并且所有的检查都符合时,才能移动
 * 
 * 也可以不填值,填入一个数组
 * 数组内容为上面那些,不过是当数组为空或者有一个可以行动的时候,允许通行
 * 
 * 
 * 举例
 * 
 * $gameMap.eventMoveCanType(0,[])
 * 不能行走
 * 
 * $gameMap.eventMoveCanType(0,[10,1])
 * 只能在 区域1行走
 * 
 * $gameMap.eventMoveCanType(0,[1,10,1])
 * 只能在 在普通陆地和区域1重叠的地方 行走
 * 
 * $gameMap.eventMoveCanType(0,[[10,1]])
 * 可以在 区域1 行走
 * 
 * $gameMap.eventMoveCanType(0,[[1,10,1]])
 * 可以在 普通陆地 或 区域1 的地方行走
 * 
 *  
 * 
 * */


Game_Map.prototype.eventMoveCanType = function (id, moveCanType) {
    if(id == 0){
        var e = $gamePlayer
    }else if(id<0){
        var e = $gamePlayer.followers()[-id-1]
    }else{
        var e = this.event(id) 
    } 
    if (e) {
        e.setMoveCanType(moveCanType)
    }
}

/**移动种类列表 */
Game_CharacterBase.prototype._moveCanTypeList = [
    "isValid",   //是在地图中 0
    "isPassable",  //是普通角色通行 1
    "isBoatPassable", //是小船通行 2
    "isShipPassable", //是大船通行 3
    "isAirshipLandOk", //是天空船的允许的陆地 4
    "isLadder", //是梯子 5
    "isBush", //是灌木丛 6
    "isCounter", //是柜台 7
    "isDamageFloor", //是伤害地形 8
    "terrainTag", //地域标签 9  当为这个时,下一个参数为标签值
    "regionId",//区域id  10   当为这个时,下一个参数为区域值或区域的数组
    "isCollidedWithCharacters" //是与事件碰撞 11
]



Game_CharacterBase.prototype.moveCanType = function(){
    return this._moveCanType  
}

Game_CharacterBase.prototype.setMoveCanType = function(type){
    return this._moveCanType = type
}


Game_CharacterBase.prototype.canPass = function(x, y, d) {
    if(this.moveCanType()){ 
        return this.moveIsCan( x, y, d ,this.moveCanType())
    }  
    //x2 = 游戏地图 环x和方向(x,d)
    var x2 = $gameMap.roundXWithDirection(x, d);
    //y2 = 游戏地图 环y和方向(y,d)
    var y2 = $gameMap.roundYWithDirection(y, d);
    //如果( 不是 游戏地图 是有效的(x2,y2) )
    if (!$gameMap.isValid(x2, y2)) {
        //返回 false
        return false;
    }
    //如果(  是穿越() 或者 是除错穿越() )
    if (this.isThrough() || this.isDebugThrough()) {
        //返回 true
        return true;
    }
    //如果( 不是 是地图可通行(x,y,d) )
    if (!this.isMapPassable(x, y, d)) {
        //返回 false
        return false;
    }
    //如果( 是和人物碰撞(x2,y2) )
    if (this.isCollidedWithCharacters(x2, y2)) {
        //返回 false
        return false;
    }
    //返回 true
    return true;
};




Game_CharacterBase.prototype.moveIsCan = function (x, y, d, list) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    //y2 = 游戏地图 环y和方向(y,d)
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (!$gameMap.isValid(x2, y2)) {
        //返回 false
        return false;
    }
    if(!Array.isArray(list)){
        list= [list] 
    }
    return this.moveIsAnd(x, y, d, x2, y2, list)

}

/**
 * 当数组全部符合时,返回true
 * 当数组为空时或者有一个不符合时返回false 
 */
Game_CharacterBase.prototype.moveIsAnd = function (x, y, d, x2, y2, list) { 
    if (!list.length) {
        return false
    }
    for (var i = 0; i < list.length; i++) {
        var type = list[i]
        var re = false
        if (Array.isArray(type)) {
            re = this.moveIsOr(x, y, d, x2, y2, type)
        } else {
            if (typeof (type) != "number") {
                type = this._moveCanTypeList.indexOf(type)
            }
            var value = 0
            if (type == 9 || type == 10) {
                var value = list[i + 1]
                i++
            }
            re = this.moveIsTypeCan(x, y, d, x2, y2, type, value)
        }
        if (!re) {
            return false
        }
    }
    return true
}



/**
 * 当数组为空或者有一个符合时,返回true  
 */
Game_CharacterBase.prototype.moveIsOr = function (x, y, d, x2, y2, list) {
    if (!list.length) {
        return true
    }
    for (var i = 0; i < list.length; i++) {
        var type = list[i]
        var re = false
        if (Array.isArray(type)) {
            re = this.moveIsOr(x, y, d, x2, y2, type)
        } else {
            if (typeof (type) != "number") {
                type = this._moveCanTypeList.indexOf(type)
            }
            var value = 0
            if (type == 9 || type == 10) {
                var value = list[i + 1]
                i++
            }
            re = this.moveIsTypeCan(x, y, d, x2, y2, type, value)
        }
        if (re) {
            return true
        }
    }
    return false
}



Game_CharacterBase.prototype.moveIsTypeCan = function (x, y, d, x2, y2, type, value) {
    if (type == 0) {
        if ($gameMap.isValid(x2, y2)) {
            return true;
        }
    } else if (type == 1) {
        if ($gameMap.isPassable(x, y, d)) {
            return true;
        }
    } else if (type == 2) {
        if ($gameMap.isBoatPassable(x2, y2)) {
            return true;
        }
    } else if (type == 3) {
        if ($gameMap.isShipPassable(x2, y2)) {
            return true;
        }
    } else if (type == 4) {
        if ($gameMap.isAirshipLandOk(x2, y2)) {
            return true;
        }
    } else if (type == 5) {
        if ($gameMap.isLadder(x2, y2)) {
            return true;
        }
    } else if (type == 6) {
        if ($gameMap.isBush(x2, y2)) {
            return true;
        }
    } else if (type == 7) {
        if ($gameMap.isCounter(x2, y2)) {
            return true;
        }
    } else if (type == 8) {
        if ($gameMap.isDamageFloor(x2, y2)) {
            return true;
        }
    } else if (type == 9) {
        var tag = $gameMap.terrainTag(x2, y2)
        if (Array.isArray(value)) {
            if (value.indexOf(tag) >= 0) {
                return true;
            }
        } else {
            if (value == tag) {
                return true;
            }
        }
    } else if (type == 10) {
        var tag = $gameMap.regionId(x2, y2)
        if (Array.isArray(value)) {
            if (value.indexOf(tag) >= 0) {
                return true;
            }
        } else {
            if (value == tag) {
                return true;
            }
        }
    } else if( type == 11){
        if(this.isCollidedWithCharacters(x2,y2)) {
            return true 
        }
    }
    return false
}
