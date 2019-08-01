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
    try {
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
        worker.onerror(function (e) {
            ww.worker.err(name, e)
        })
        worker.onmessageerror = function (e) {
            ww.worker.err(name, e, 1)
        }
        return true
    } catch (error) {
        this._workers[name] = false
        console.error(name, js, fun, err)
        return false
    }
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














var ww = ww || {}


ww.houtai = {}

ww.houtai._use = true
ww.houtai._qttime = 0;
ww.houtai._httime = 0;

ww.houtai._time = 1000 / 60;
/**
 * 后台运行的js函数
 */
ww.houtai._js = "addEventListener('message', function (e) { postMessage(e.data); }, false);"
/**
 * 打开
 * 
 */
ww.houtai.open = function () {
    ww.worker.open("houtai", this._js, this.do)
    this.push(0)
}

/**
 * 关闭
 */
ww.houtai.close = function () {
    ww.worker.del("houtai")
}

/**
 * 使用
 */
ww.houtai.use = function (v) {
    this._use = v === undefined ? true : v
}


/**运行当获取数据
 * @param {*} data 数据
 */
ww.houtai.do = function (data) {
    //console.log(data + 1)
    setTimeout(ww.houtai.push, 1000 / 60, data + 1)
    SceneManager.update2()
}
/**
 * 发送信息到后台
 * @param {*} data 数据
 */
ww.houtai.push = function (data) {
    ww.worker.push("houtai", data)
}


/**更新同步
 * 
 */
ww.houtai.updateTongbu = function () {
    this._qttime = this._httime
}


/**需要更新 (后台时间大于前台时间)*/
ww.houtai.mustUpdate = function () {
    if (ww.houtai._use) {
        this._httime++
        if (this._httime - this._qttime > 60) {
            return true
        }
    }
}




SceneManager.run = function (sceneClass) {
    try {
        this.initialize();
        this.goto(sceneClass);
        this.requestUpdate();
        ww.houtai.open()
    } catch (e) {
        this.catchException(e);
    }
};


SceneManager.update = function () {
    ww.houtai.updateTongbu()
    this._norenderScene = false
    try {
        //标记开始
        this.tickStart();
        if (Utils.isMobileSafari()) {
            this.updateInputData();
        }
        this.updateManagers();
        //更新主要
        this.updateMain();
        //标记结束
        this.tickEnd();
    } catch (e) {
        //捕捉异常(e)
        this.catchException(e);
    }
};


SceneManager.update2 = function () {
    if (!ww.houtai.mustUpdate()) {
        return
    }
    this._norenderScene = true
    try {
        //标记开始
        this.tickStart();
        if (Utils.isMobileSafari()) {
            this.updateInputData();
        }
        this.updateManagers();
        //更新主要
        this.updateMain();
        //标记结束
        this.tickEnd();
    } catch (e) {
        //捕捉异常(e)
        this.catchException(e);
    }
};


SceneManager.renderScene = function () {
    if (this._norenderScene) {
        return
    }
    //如果 是当前的场景开始后
    if (this.isCurrentSceneStarted()) {
        //图形 转化(场景)
        Graphics.render(this._scene);
        //否则 如果 场景 (场景存在)
    } else if (this._scene) {
        //当场景读取中
        this.onSceneLoading();
    }
};