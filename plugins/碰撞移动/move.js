Game_CharacterBase.prototype.moveXY = function(mx, my) {
    if (!mx && !my) { return }
    if (Math.abs(mx) > Math.abs(my)) {
        var rx = this.moveX(mx)
        if (rx) {
            this._realX = this.moveFloor(this._realX + rx)
            this._x = Math.round(this._realX)
            mx = this.moveFloor(mx - rx)
        } else {
            mx = 0
        }
    } else {
        var ry = this.moveY(my)
        if (ry) {
            this._realY = this.moveFloor(this._realY + ry)
            this._y = Math.round(this._realX)
            my = this.moveFloor(my - ry)
        } else {
            my = 0
        }
    }
    this.moveXY(mx, my)
}


Game_CharacterBase.prototype.moveX = function(mx) {
    if (!mx) { return 0 }
    var rx = this._realX
    var ry = this._realY
    var x0 = Math.floor(rx)
    var y0 = Math.floor(ry)
    var x1 = Math.ceil(rx)
    var y1 = Math.ceil(ry)
        //console.log(x0, y0, x1, y1)
        //x值在基础时
    if (x1 == x0) {
        //y值在基础时
        if (y1 == y0) {
            //往右
            if (mx > 0) {
                if (this.canPass(x0, y0, 6)) {
                    if (mx > 1) {
                        mx = 1
                    }
                } else {
                    mx = 0
                }
                //往左
            } else {
                if (this.canPass(x0, y0, 4)) {
                    if (mx < -1) {
                        mx = -1
                    }
                } else {
                    mx = 0
                }
            }
        } else {
            //往右
            if (mx > 0) {
                if (this.canPass(x0, y0, 6) && this.canPass(x1, y1, 6)) {
                    if (mx > 1) {
                        mx = 1
                    }
                } else {
                    mx = 0
                }
                //往左
            } else {
                if (this.canPass(x0, y0, 4) && this.canPass(x1, y1, 4)) {
                    if (mx < -1) {
                        mx = -1
                    }
                } else {
                    mx = 0
                }
            }
        }
        //不在基础时
    } else {
        //往右
        if (mx > 0) {
            var dx = x1 - rx
            if (mx > dx) {
                mx = dx
            }
        } else {
            var dx = x0 - rx
            if (mx < dx) {
                mx = dx
            }
        }
    }
    return mx
}



Game_CharacterBase.prototype.moveY = function(my) {
    if (!my) { return }
    var rx = this._realX
    var ry = this._realY
    var x0 = Math.floor(rx)
    var y0 = Math.floor(ry)
    var x1 = Math.ceil(rx)
    var y1 = Math.ceil(ry)
        // console.log(x0, y0, x1, y1)
        //y值在基础时
    if (y1 == y0) {
        //x值在基础时
        if (x1 == x0) {
            //往下
            if (my > 0) {
                if (this.canPass(x0, y0, 2)) {
                    if (my > 1) {
                        my = 1
                    }
                } else {
                    my = 0
                }
                //往上
            } else {
                if (this.canPass(x0, y0, 8)) {
                    if (my < -1) {
                        my = -1
                    }
                } else {
                    my = 0
                }
            }
        } else {
            //往下
            if (my > 0) {
                if (this.canPass(x0, y0, 2) && this.canPass(x1, y1, 2)) {
                    if (my > 1) {
                        my = 1
                    }
                } else {
                    my = 0
                }
                //往上
            } else {
                if (this.canPass(x0, y0, 8) && this.canPass(x1, y1, 8)) {
                    if (my < -1) {
                        my = -1
                    }
                } else {
                    my = 0
                }
            }
        }
        //不在基础时(说明已经判断)
    } else {
        //往右
        if (my > 0) {
            var dy = y1 - ry
            if (my > dy) {
                my = dy
            }
        } else {
            var dy = y0 - ry
            if (my < dy) {
                my = dy
            }
        }
    }
    return my
}





Game_CharacterBase.prototype.moveFloor = function(mx) {
    var x0 = Math.floor(mx)
    var x1 = Math.ceil(mx)
    if (Math.abs(mx - x0) < 0.00000001) {
        return x0
    } else if (Math.abs(mx - x1) < 0.00000001) {
        return x1
    } else {
        return mx
    }
}




/**能通过
 * @param {number} x 人物x
 * @param {number} y 人物y
 * @param {number} d 人物方向
 * @return {boolean} 
 */
Game_CharacterBase.prototype.canMovePass = function(x, y, d) {
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
    //返回 true
    return true;
};



Game_CharacterBase.prototype.isCollidedWithCharactersX = function(x, y) {
    //返回 是和事件碰撞(x,y) 或者 是和交通工具碰撞(x,y)
    return this.isCollidedWithEventsX(x, y) || this.isCollidedWithVehicles(x, y);
};
/**是和事件碰撞*/
Game_CharacterBase.prototype.isCollidedWithEventsX = function(x, y) {
    //事件组 = 游戏地图 xy处事件无穿越(x,y)
    var events = $gameMap.eventsXyNt(x, y);
    //返回 事件组 一些 方法(事件)
    return events.some(function(event) {
        //返回 事件 是正常优先级()
        return event.isNormalPriority();
    });
};
Game_CharacterBase.prototype.isCollidedWithVehiclesX = function(x) {

    var rx = this._realX
    var ry = this._realY
    var rd
    if (this)
        $gameMap.boat()._realX || $gameMap.ship()._realX;
};