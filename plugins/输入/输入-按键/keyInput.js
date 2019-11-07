var ww = ww || {

}


ww.keyInput = {};


function KeyInput() {
    this.initialize.apply(this, arguments);
}
/**设置创造者 */
KeyInput.prototype.constructor = KeyInput;
KeyInput.prototype.initialize = function () {
    this._keys = {}
    this._time = 0
    this._todoKeys = []
    this._allKeys = {}
    this._downKeys = {}
    this._moveKeys = {}
    this._upKeys = {}
};

KeyInput.prototype.update = function () {
    this._keys = {}
    this._nowKeys = {}
    /**全部按键 */
    this._allKeys = {}

    /**按下状态 */
    this._downKeys = {}
    /**移动状态 */
    this._moveKeys = {}
    /**抬起状态 */
    this._upKeys = {}

    this._todoKeys = []

    this._listKeys = {}
};

KeyInput.prototype.push = function (key) {
    this._todoKeys.push(key)
};
KeyInput.prototype.do = function () {
    this._time++
    var todokeys = this._todoKeys
    for (var i = 0; i < todokeys.length; i++) {
        this.doKey(todokeys[i])
    }
};

/**
 * 添加键
 * @param {*} o 
 * @param {*} key 
 */
KeyInput.prototype.pushKey = function (o, name, value) {
    if (!o[name]) {
        o[name] = []
    }
    o[name].push(value)
}

/**
 * 最后键
 * @param {*} o 
 * @param {*} name 
 */
KeyInput.prototype.lastKey = function (o, name) {
    if (!o[name]) {
        o[name] = []
    }
    return this.lastArray(o[name])
}

KeyInput.prototype.lastArray = function (l) {
    return l[l.length - 1]
}
KeyInput.prototype.startArray = function (l) {
    return l[0]
}


/**
 * 设置键
 * @param {*} o 
 * @param {*} key 
 * @param {*} value 
 */
KeyInput.prototype.setKey = function (o, name, value) {
    o[name] = value
}
/**
 * 获取键
 * @param {*} o 
 * @param {*} name 
 */
KeyInput.prototype.getKey = function (o, name) {
    return o[name]
}

/**
 * 处理键
 * @param {*} key 
 */
KeyInput.prototype.doKey = function (key) {
    if (key) {
        key.time = this._time
        this.pushKey(this._allKeys, key)
        switch (key.type) {
            case "up":
                this.pushKey(this._listKeys, key.name, [
                    [time, 1, key.value]
                ])
                this.setKey(this._upKeys, key.name, time)
                this.setKey(this._nowKeys, key.name, true)
                break;
            case "down":
                this.setKey(this._downKeys, key.name, time)
                this.setKey(this._nowKeys, key.name, false)
                var l = this.lastKey(this._listKeys, key.name)
                if (l) {
                    l.push([time, 0, key.value])
                }
                break;
            case "move":
                this.setKey(this._moveKeys, key.name, time)
                if (l) {
                    l.push([time, 2, key.value])
                }
                break;
            default:
                break;
        }
    }
};



KeyInput.prototype.isUp = function () {
    return
}