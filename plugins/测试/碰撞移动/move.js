Game_CharacterBase.prototype.moveStraight2 = function(d) {
    this.setMovementSuccess(this.canPass(this._x, this._y, d));
    //如果( 是移动成功的() )
    if (this.isMovementSucceeded()) {
        this.setDirection(d);
        this._x = $gameMap.roundXWithDirection(this._x, d);
        this._y = $gameMap.roundYWithDirection(this._y, d);
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
        this.increaseSteps();
        //否则
    } else {
        //设置方向(d)
        this.setDirection(d);
        //检查正面事件触摸触发(d)
        this.checkEventTriggerTouchFront(d);
    }
};


Game_CharacterBase.prototype.moveTo = function(mx, my) {
    this._toX = mx
    this._toY = my
}



Game_CharacterBase.prototype.isMoving = function() {
    return this._realX !== this._x || this._realY !== this._y;
};




Game_CharacterBase.prototype.canMoveY = function(mx, my) {
    if (!mx && !my) { return }
    if (Math.abs(mx) > Math.abs(my)) {
        var rx = this.canMoveX(mx)
        if (rx) {
            this.moveX(rx)
            mx = this.moveFloor(mx - rx)
        } else {
            mx = 0
        }
    } else {
        var ry = this.canMoveY(my)
        if (ry) {
            this.moveY(ry)
            my = this.moveFloor(my - ry)
        } else {
            my = 0
        }
    }
    this.moveXY(mx, my)
}


Game_CharacterBase.prototype.moveX = function(rx) {
    this._realX = this.moveFloor(this._realX + rx)
    var x = this._x
    this._x = Math.round(this._realX)
    if (x != this._x) {
        this.increaseSteps()
    }
}

Game_CharacterBase.prototype.moveY = function(ry) {
    this._realY = this.moveFloor(this._realY + ry)

    var y = this._y
    this._y = Math.round(this._realX)
    if (y != this._y) {
        this.increaseSteps()
    }
}


Game_CharacterBase.prototype.canMoveX = function(mx) {
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
    mx = this.isCollidedWithX(mx)
    return mx
}



Game_CharacterBase.prototype.canMoveY = function(my) {
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
    my = this.isCollidedWithY(my)
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



Game_CharacterBase.prototype.isCollidedWithX = function(mx) {
    if (!mx) { return 0 }
    var x = this._realX
    var y = this._realY
    var es = $gameMap.events()
    for (var i = 0; i < es.length; i++) {
        var event = es[i]
        if (event && event.isNormalPriority()) {
            mx = this.isCollidedWithXY(x, y, event._realX, event._realY, mx)
            if (!mx) {
                return 0
            }
        }
    }
    mx = this.isCollidedWithXY(x, y, $gameMap.boat()._realX, $gameMap.boat()._realY, mx)
    if (!mx) {
        return 0
    }
    mx = this.isCollidedWithXY(x, y, $gameMap.ship()._realX, $gameMap.ship()._realY, mx)
    if (!mx) {
        return 0
    }
};



Game_CharacterBase.prototype.isCollidedWithY = function(mx) {
    if (!mx) { return 0 }
    var x = this._realX
    var y = this._realY
    var es = $gameMap.events()

    var dx
    var l
    var e
    for (var i = 0; i < es.length; i++) {
        var event = es[i]
        if (event && event.isNormalPriority()) {
            dx = this.isCollidedWithXY(y, x, event._realY, event._realX, mx)
            if (dx != mx) {
                l.push(l)
                e.push(event)
            }
        }
    }
    mx = this.isCollidedWithXY(y, x, $gameMap.boat()._realY, $gameMap.boat()._realX, mx)
    if (!mx) {
        return 0
    }
    mx = this.isCollidedWithXY(y, x, $gameMap.ship()._realY, $gameMap.ship()._realX, mx)
    if (!mx) {
        return 0
    }
};



Game_CharacterBase.prototype.isCollidedWithXY = function(x, y, rx, ry, mx) {
    if (Math.abs(ry - y) < 1) {
        var dx = rx - x
        if (mx > 0) {
            if (dx + 1 <= 0 || dx - 1 >= mx) {} else if (dx - 1 <= mx && dx - 1 >= 0) {
                mx = dx - 1
            } else {
                return 0
            }
            if (mx <= 0) {
                return 0
            }
        } else {
            if (dx - 1 >= 0 || dx - 1 >= mx) {} else if (dx + 1 >= mx && dx + 1 <= 0) {
                mx = dx - 1
            } else {
                return 0
            }
            if (mx >= 0) {
                return 0
            }
        }
    }
    return mx
};