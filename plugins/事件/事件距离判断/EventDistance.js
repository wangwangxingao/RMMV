var ww = ww || {}

ww.EventDistance = {}

/**
 * 
 * 事件距离和(如果没有则为false) 
 * 
 * 
 */
Game_Interpreter.prototype.eventDistance = function (a, b) {
    var ea = this.character(a)
    var eb = this.character(b)
    if (ea && eb) {
        return Math.abs(ea.x - eb.x) + Math.abs(ea.y - eb.y)
    }
    return false
};


/**
 * 
 * 事件距离的平方
 * 
 * 
 */
Game_Interpreter.prototype.eventDistance2 = function (a, b) {
    var ea = this.character(a)
    var eb = this.character(b)
    if (ea && eb) {
        var x = (ea.x - eb.x)
        var y = (ea.y - eb.y)
        return x * x + y * y
    }
    return false
};



/**
 * 
 * 返回a事件与b事件x距离小于c ,y距离小于d
 * 
 * 
 */
Game_Interpreter.prototype.eventDistanceInRect = function (a, b, c, d) {
    var ea = this.character(a)
    var eb = this.character(b)
    if (ea && eb) {
        return Math.abs(ea.x - eb.x) <= c && Math.abs(ea.y - eb.y) <= d
    }
    return false
};

/**
 * 返回a事件与b事件xy距离和小于c
 * 
 */
Game_Interpreter.prototype.eventDistanceInRect2 = function (a, b, c) {
    var ea = this.character(a)
    var eb = this.character(b)
    if (ea && eb) {
        return Math.abs(ea.x - eb.x) + Math.abs(ea.y - eb.y) <= c
    }
    return false
};

/**
 * 返回a事件与b事件xy距离平方和小于c
 * 
 */

Game_Interpreter.prototype.eventDistanceIn = function (a, b, c) {
    var ea = this.character(a)
    var eb = this.character(b)
    if (ea && eb) {
        var x = (ea.x - eb.x)
        var y = (ea.y - eb.y)
        return x * x + y * y <= c
    }
    return false
};