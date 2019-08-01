var ww = ww || {}


ww.houtai = {}
ww.houtai._timenext = 0

ww.houtai._use = true
ww.houtai._qttime = 0;
ww.houtai._httime = 0;

ww.houtai._time = 1000 / 60;

/**
 * 打开
 * 
 */
ww.houtai.open = function () {
    //ww.worker.open("houtai", this._js, this.do)
    //this.push(0)
    if (!ww.houtai._timenext) {
        ww.houtai.do(0)
    }
}

/**
 * 关闭
 */
ww.houtai.close = function () {
    clearTimeout(ww.houtai._timenext)
    ww.houtai._timenext = 0
    //ww.worker.del("houtai")
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
    SceneManager.update2()
    //ww.houtai.push(data)
    ww.houtai._timenext = setTimeout(ww.houtai.do, 1000 / 60, data)
}
/**
 * 发送信息到后台
 * @param {*} data 数据
 */
//ww.houtai.push = function (data) {
//  ww.worker.push("houtai", data)
//}


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
            // console.log(this._httime-this._qttime)
            return true
        }
    }
}


SceneManager.run_houtai = SceneManager.run
SceneManager.run = function (sceneClass) {
    this.run_houtai(sceneClass)
    ww.houtai.open()
}


SceneManager.update_houtai = SceneManager.update
SceneManager.update = function () {
    ww.houtai.updateTongbu()
    this._norenderScene = false
    this.update_houtai()
};


SceneManager.update2 = function () {
    if (!ww.houtai.mustUpdate()) {
        return
    }
    this._norenderScene = true
    this.update_houtai()
};
SceneManager.renderScene_houtai = SceneManager.renderScene
//ww.houtai.SceneManager.renderScene =SceneManager.renderScene
SceneManager.renderScene = function () {
    if (this._norenderScene) {
        return
    }
    this.renderScene_houtai()
};

SceneManager.requestUpdate_houtai = SceneManager.requestUpdate

SceneManager.requestUpdate = function () {
    if (this._norenderScene) {
        return
    }
    this.requestUpdate_houtai()
};