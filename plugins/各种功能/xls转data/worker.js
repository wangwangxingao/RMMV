var ww = ww || {}

/**
 * 后台运行
 */
ww.worker = {}


/**
 * 后台运行组
 */
ww.worker._workers = {}


/**
 * 打开
 * @param {string|number} name 名称 
 * @param {string} js js文本 不设置则名称为js脚本文件名
 * @param {function} fun 运行方法
 * @param {function} err 错误
 */
ww.worker.open = function (name, js, fun, err) {
   // try {
        this.del(name)
        if (js) {
            var blob = new Blob([js]);
            var url = window.URL.createObjectURL(blob);
        } else {
            var url = PluginManager._path + name + ".js"
        }
        var worker = new Worker(url, {
            name: name
        });
        this._workers[name] = {
            worker: worker,
            do: typeof fun == "function" ? fun : null,
            err: typeof err == "function" ? err : null,
        }

        worker.onmessage = function (e) {
            ww.worker.do(name, e.data, e)
        }

        worker.onerror = function (e) {
            ww.worker.err(name, e)
        }
        worker.onmessageerror = function (e) {
            ww.worker.err(name, e, 1)
        }
        return true
    //} catch (error) {
        this._workers[name] = false
        console.error(name, js, fun, err)
        return false
   // }
}
/**
 * 接受信息后运行
 * @param {string|number} name 
 * @param {*} data 
 * @param {*} e 
 */
ww.worker.do = function (name, data, e) {
    var set = this._workers[name]
    if (set) {
        if (set.do) {
            set.do(data, e, name)
        }
    }
}

/**
 * 当错误
 * @param {string|number} name 
 * @param {*} e 
 * @param {*} t 
 */
ww.worker.err = function (name, e, t) {
    var set = this._workers[name]
    if (set) {
        if (set.err) {
            set.err(e, t)
        }
    }
}
/**
 * 设置运行
 * @param {string|number} name 
 * @param {function} fun 
 */
ww.worker.setdo = function (name, fun) {
    var set = this._workers[name]
    if (set) {
        set.do = typeof fun == "function" ? fun : null
    }
}
/**
 * 设置错误 
 * @param {string|number} name 
 * @param {function} fun 
 */
ww.worker.seterr = function (name, fun) {
    var set = this._workers[name]
    if (set) {
        set.err = typeof fun == "function" ? fun : null
    }
}
/**
 * 推送消息
 * @param {string|number} name 
 * @param {*} data 
 */
ww.worker.push = function (name, data) {
    var set = this._workers[name]
    if (set && set.worker) {
        set.worker.postMessage(data)
    }
}


ww.worker.setItem = function (name, item, value) {
    var set = this._workers[name]
    if (set) {
        set.items = set.items || {}
        set.items[item] = value || {} 
    }
}

ww.worker.setItemType = function (name, item, type, value) {
    var set = this._workers[name]
    if (set) {
        set.items = set.items || {}
        set.items[item] = set.items[item] || {}
        set.items[item][type] = value
    }
}

ww.worker.getItem = function (name, item) {
    var set = this._workers[name]
    if (set) {
        set.items = set.items || {}
        set.items[item] = set.items[item] || {}
        return set.items[item]
    } else {
        return {}
    }
}
ww.worker.getItemType = function (name, item, type) {
    var i = ww.worker.getItem(name, item)
    return i[type]
}

/**
 * 关闭
 * @param {string|number} name 
 */
ww.worker.close = function (name) {
    var set = this._workers[name]
    if (set && set.worker) {
        set.worker.terminate()
    }
}
/**
 * 删除
 * @param {string|number} name 
 */
ww.worker.del = function (name) {
    this.close(name)
    delete this._workers[name]
}


