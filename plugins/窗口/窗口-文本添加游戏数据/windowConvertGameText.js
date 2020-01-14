//=============================================================================
// windowConvertGameText.js
//=============================================================================

/*:
 * @plugindesc 窗口中用游戏文本替换
 * @authorw wangwang
 * 
 * 
 * @help 
 * 角色 \a[1 name] hp \a[1 hp] 敌人 \e[1 name] hp \e[1 hp]
 * \o[ConfigManager bgmVolume] 
 * \oe[[Graphics.frameCount]] 
 * */
var ww = ww || {}
ww.windowConvertGameText = {}
ww.windowConvertGameText.convertEscapeCharacters =
    Window_Base.prototype.convertEscapeCharacters
 
Window_Base.prototype.getEvalValue = function (e) {
    return eval(e)
}

Window_Base.prototype.getGameValue = function (l) {
    var a = window
    if (a && Array.isArray(l)) {
        for (var i = 0; i < l.length; i++) {
            var t = typeof a
            if (t == "object" || t == "function") {
                var n = l[i]
                var t = typeof a[n]
                if (i != 0 || i == l.length - 1) {
                    if (t == "function") {
                        var a = a[n]()
                    } else {
                        var a = a[n]
                    }
                } else {
                    var a = a[n]
                }
            } else {
                if (a === undefined) {
                    return ""
                } else if (a === null) {
                    return ""
                } else {
                    return "" + a
                }
            }
        }
        var t = typeof a
        if (t == "object") {
            return ""
        } else if (t == "function") {
            var a = a()
        }
        if (a === undefined) {
            return ""
        } else if (a === null) {
            return ""
        } else {
            return "" + a
        }
    }
    return ""
}
Window_Base.prototype.getActorValue = function (i, l) {
    var a = $gameActors.actor(i)
    if (a && Array.isArray(l)) {
        for (var i = 0; i < l.length; i++) {
            var n = l[i]
            var t = typeof a[n]
            if (t == "function") {
                var a = a[n]()
            } else {
                var a = a[n]
            }
            if (a === undefined) {
                return ""
            } else if (a === null) {
                return ""
            } else if (typeof a != "object") {
                return "" + a
            }
        }
    }
    return ""
}

Window_Base.prototype.getEnemyValue = function (i, l) {
    if (!Window_Base._enemy) {
        Window_Base._enemy = new Game_Enemy(i, 0, 0)
    } else {
        Window_Base._enemy.setup(i, 0, 0)
    }
    var a = Window_Base._enemy
    if (a && Array.isArray(l)) {
        for (var i = 0; i < l.length; i++) {
            var n = l[i]
            var t = typeof a[n]
            if (t == "function") {
                var a = a[n]()
            } else {
                var a = a[n]
            }
            if (a === undefined) {
                return ""
            } else if (a === null) {
                return ""
            } else if (typeof a != "object") {
                return "" + a
            }
        }
    }
    return ""
}

Window_Base.prototype.convertEscapeCharacters = function (text) {
    var text = ww.windowConvertGameText.convertEscapeCharacters.call(this, text)
    text = text.replace(/\x1bA\[(.*?)\]/gi, function () {
        var l = arguments[1].split(" ")
        var i = l.shift()
        return this.getActorValue(i, l);
    }.bind(this));
    text = text.replace(/\x1bE\[(.*?)\]/gi, function () {
        var l = arguments[1].split(" ")
        var i = l.shift()
        return this.getEnemyValue(i, l);
    }.bind(this));
    text = text.replace(/\x1bOE\[\[(.*?)\]\]/gi, function () {
        var l = arguments[1]
        return this.getEvalValue(l);
    }.bind(this));
    text = text.replace(/\x1bO\[(.*?)\]/gi, function () {
        var l = arguments[1].split(" ")
        return this.getGameValue(l);
    }.bind(this));
    return text;
};