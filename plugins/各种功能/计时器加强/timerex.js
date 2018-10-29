//=============================================================================
//  timerex.js
//=============================================================================

/*:
 * @plugindesc  计时器加强 
 * @author wangwang
 * 
 * 
 * 
 * 
 * @help
 * $gameTimer.setName(名称,初始值,更新值,结束值,是否暂停)
 * 创建一个计时器 
 * $gameTimer.getName(名称) 
 * 返回一个计时器
 * $gameTimer.delName(名称) 
 * 删除一个计时器
 * 
 * 
 * $gameTimer.setNameValue(名称,初始值)
 * 设置计时器初始值 
 * 
 * $gameTimer.setNameAdd(名称,更新值 )
 * 设置计时器更新值
 * 
 * $gameTimer.setNameEnd(名称, 结束值)
 * 设置计时器结束值
 * 
 * $gameTimer.setNameRun(名称)
 * 设置计时器运行
 * 
 * $gameTimer.setNameRun(名称)
 * 设置计时器暂停
 * 
 * 
 * $gameTimer.setName(名称,初始值,更新值,结束值)
 * 创建一个计时器 
 * 
 *  
 *  
 * $gameTimer.getNameValue(名称) 
 * 返回计时器的值
 *  
 * $gameTimer.getNameEnd(名称) 
 * 返回计时器的是否到达结束值
 * 
 */


 
function Game_Timer2() {
    this.initialize.apply(this, arguments);
} 

Game_Timer2.prototype.constructor = Game_Timer2;

(function () {
 

    var initialize = Game_Timer.prototype.initialize
    Game_Timer.prototype.initialize = function () {
        initialize.call(this)
        this._timers = {}
    };
    var update = Game_Timer.prototype.update
    Game_Timer.prototype.update = function (v) {
        update.call(this, v)
        if (v) {
            for (var i in this._timers) {
                var t = this._timers[i]
                if (t) {
                    t.update()
                }
            }
        }

    }

    Game_Timer.prototype.setName = function (name, v, add, end, stop) {
        this._timers[name] = new Game_Timer2(v, add, end, stop)
    }

    Game_Timer.prototype.setNameValue = function (name, v) {
        if (!this._timers[name]) {
            this._timers[name] = new Game_Timer2() 
        }
        this._timers[name].setValue(v) 
    }
    Game_Timer.prototype.setNameAdd = function (name, v) {
        if (!this._timers[name]) {
            this._timers[name] = new Game_Timer2() 
        }
        this._timers[name].setAdd(v) 
    }

    Game_Timer.prototype.setNameEnd = function (name, v) {
        if (!this._timers[name]) {
            this._timers[name] = new Game_Timer2() 
        }
        this._timers[name].setEnd(v) 
    }

    Game_Timer.prototype.setNameRun= function (name, v) {
        if (!this._timers[name]) {
            this._timers[name] = new Game_Timer2() 
        }
        this._timers[name].setRun(v) 
    }

    Game_Timer.prototype.setNameStop= function (name, v) {
        if (!this._timers[name]) {
            this._timers[name] = new Game_Timer2() 
        }
        this._timers[name].setStop(v) 
    }

    Game_Timer.prototype.getName = function (name) {
        return this._timers[name]
    }

    Game_Timer.prototype.delName = function (name, v, add, end, stop) {
        delete this._timers[name]
    }

 
    Game_Timer.prototype.getNameValue = function (name) {
        var t = this.getName(name)
        return t && t.value
    }

    Game_Timer.prototype.getNameEnd = function (name) {
        var t = this.getName(name)
        return t && t.isEnd()
    }

 

    Game_Timer2.prototype.initialize = function(v,add,end,stop){ 
        this.value = v||0
        this.add = add||0
        this.end = end||0
        this.stop = stop||0 
    }
    Game_Timer2.prototype.update = function () {
        if (this.stop) {
            return this.value
        }
        return this.value += this.add
    }

    Game_Timer2.prototype.isMore = function (value) {
        if (this.add >= 0) {
            return this.value >= value
        } else {
            return this.value <= value
        }
    }

    Game_Timer2.prototype.isEnd = function () {
        if (this.add >= 0) {
            return this.value >= this.end
        } else {
            return this.value <= this.end
        }
    }


    Game_Timer2.prototype.setAdd = function (v) {
        this.add = v || 0
    }


    Game_Timer2.prototype.setValue = function (v) {
        this.value = v || 0
    }

    Game_Timer2.prototype.setEnd = function (v) {
        this.end = v || 0
    }

    Game_Timer2.prototype.setStop = function (v) {
        if (v || v === void (0)) {
            this.stop = true
        } else {
            this.stop = false
        }
    }

    Game_Timer2.prototype.setRun = function (v) {
        if (v || v === void (0)) {
            this.stop = false
        } else {
            this.stop = true
        }
    }

})()
