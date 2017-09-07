//=============================================================================
// Record.js
//=============================================================================

/*:
 * @plugindesc 录像
 * @author wangwang
 *   
 * @param Record
 * @desc 插件 录像
 * @default 汪汪
 *    
 * 
 * @help  
 * //开始录像
 * Record.start ()
 * //播放 
 * Record.play(file) 播放一个录像文件,不选为当前这个
 * //结束
 * Record.end()  结束录像/播放
 * //文件列表
 * Record.files  =>  []
 * //最后文件 
 * Record.fileend ()
 * 
 * //保存储存
 * Record.save(name ,file)   name :名称  file :一个录像文件
 * //读取储存
 * Record.load(name  )   name :名称 返回一个录像文件 
 */

function Record() {
    throw new Error('This is a static class');
}
Record.mode = "空"
Record.files = []
Record.wait = false


Record.fileend = function() {
    return Record.files[Record.files.length - 1]
}

/**开始 */
Record.start = function() {
    this.mode = "录制"
    this.file = { save: this.saveData(), infos: this.infos = [] }
    this.files.push(this.file)
    this.pos = 0
    this.counts = 0
    this.kind = 0
    this.waiton(2)
}

/**播放 */
Record.play = function(file) {
    if (file) { this.file = file }
    if (this.file) {
        this.loadData(this.file.save)
        this.infos = this.file.infos
    }
    this.mode = "播放"
    this.pos = 0
    this.counts = 0
    this.kind = 0
    this.waiton(2)
}

/**结束 */
Record.end = function() {
    if (this.file) {
        if (this.mode == "录制") {
            Record.push({})
        }
        console.log(this.file)
    }
    this.mode = "空"
    this.pos = 0
    this.counts = 0
    this.kind = 0
    this.waitoff(2)
}

/**记录键 */
Record.push = function(result) {
    var result = result === false ? 0 : result === true ? 1 : result
    if (this.kind != result) {
        if (this.counts) {
            this.infos.push([this.kind, this.counts || 1])
            this.pos += 1
            this.counts = 0
        }
        this.kind = result
    }
    this.counts = (this.counts || 0) + 1
    return result
}



/**还原键 */
Record.pop = function(re) {
    if (!this.counts) {
        var key = this.infos[this.pos++]
        if (!key) {
            this.end()
            return re
        }
        this.counts = key[1]
        this.kind = key[0]
        this.counts -= 1
        return this.kind
    } else {
        this.counts -= 1
        return this.kind
    }
}

/**获取值 */
Record.value = function(that, fun, arr) {
    var result = this._call[fun].apply(that, arr)
    if (this.wait) {
        this.v.push(fun)
        if (fun != "Math_random" && fun != "Math_randomInt") {
            return 0 //result
        }
    }
    this.v = []
    if (this.mode == "录制") {
        var re = this.push(result)
        this.v1.push([re, fun, this.counts])
        return re
    }
    if (this.mode == "播放") {
        var re = this.pop(result)
        this.v2.push([re, fun, this.counts])
        this.diff()
        return re
    }
    return result
}
Record.diff = function() {
    var i = this.v2.length - 1
    if (!this.v1[i] || !this.v2[i] || this.v1[i][0] != this.v2[i][0] || this.v1[i][1] != this.v2[i][1]) {
        this.show(i)
        this.end()
    }
}
Record.show = function(i) {

    console.log(i, this.v1[i], this.v2[i], this.pos)

}
Record.show2 = function(i1, i2) {
    for (var i = i1; i < i2; i++) {
        console.log(i, this.v1[i], this.v2[i])

    }
}

/**等待开 */
Record.waiton = function(value) {
    if (value > this.wait) {
        this.wait = value
    }
}

/**等待关 */
Record.waitoff = function(value) {
    if (value >= this.wait && this.wait) {
        this.wait = 0
        console.log(value)
    }
}


Record.sn = function(constructor) {
    return constructor.name
}
Record.ns = function(name) {
    return window[name]
}

/**获取存档 */
Record.saveData = function(scene) {
    $gameSystem.onBeforeSave();
    var data = {}
    data.scene = null
    data.stack = []
    if (scene) {
        data.scene = scene
        SceneManager._stack = []
    } else {
        data.scene = this.sn(SceneManager._scene.constructor)
        for (var i = 0; i < SceneManager._stack.length; i++) {
            data.stack[i] = this.sn(SceneManager._stack[i])
        }
    }
    if (data.scene == "Scene_Title" || data.scene == "Scene_Boot") {
        data.save = 0
    } else {
        data.save = DataManager.makeSaveContents()
    }
    data.config = ConfigManager.makeData()
    SceneManager.goto(this.ns(data.scene));
    return JsonEx.stringify(data)
}

/**读取存档 */
Record.loadData = function(json) {
    DataManager.createGameObjects();
    var data = JsonEx.parse(json)
    if (data) {
        if (data.save) {
            DataManager.extractSaveContents(data.save);
            if ($gameSystem.versionId() !== $dataSystem.versionId) {
                $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
                $gamePlayer.requestMapReload();
            }
        }
        if (data.config) {
            ConfigManager.applyData(data.config)
        }
        SceneManager._stack = []
        if (data.stack) {
            for (var i = 0; i < data.stack.length; i++) {
                SceneManager._stack[i] = this.ns(data.stack[i])
            }
        }
        if (data.scene) {
            SceneManager.goto(this.ns(data.scene));
        }
    }
}

/**到json */
Record.tojson = function(file) {
    return JSON.stringify(file)
}

/**到文件 */
Record.tofile = function(json) {
    return JSON.parse(json)
}




/**保存id */
Record.saveId = function(name, id) {
    this.save(name, this.files[id])
}

/**保存最后 */
Record.saveEnd = function(name) {
    this.save(name, this.fileend())
}

/**保存 */
Record.save = function(name, file) {
    StorageManager.save("record_" + name, this.tojson(file))
}

/**读取 */
Record.load = function(name) {
    return this.tofile(StorageManager.load("record_" + name))
}

/**读取并播放 */
Record.loadPlay = function(name) {
    this.play(this.load(name))
}

Record._call = {}

/**更新场景 */
SceneManager.updateScene = function() {
    if (this._scene) {
        if (!this._sceneStarted && this._scene.isReady()) {
            this._scene.start();
            this._sceneStarted = true;
            this.onSceneStart();
        }
        if (this.isCurrentSceneStarted()) {
            this._scene.update();
            Record.waitoff(1)
        }
    }
};



Scene_Base.prototype.start = function() {
    Record.waitoff(2)
    Record.waiton(1)
    this._active = true;
};
SceneManager.goto = function(sceneClass) {
    Record.waiton(2)
    if (sceneClass) {
        this._nextScene = new sceneClass();
    }
    if (this._scene) {
        this._scene.stop();
    }
};



Record._call.Math_random = Math.random
Math.random = function() {
    return Record.value(this, "Math_random", arguments);
};
Record._call.Math_randomInt = function(max) {
    return Math.floor(max * Record._call.Math_random())
}
Math.randomInt = function(max) {
    return Record.value(this, "Math_randomInt", arguments);
};
Record._call.value = function(i) {
    return i
}
Record._call.Input_isPressed = Input.isPressed
Input.isPressed = function(keyName) {
    return Record.value(this, "Input_isPressed", arguments);
};
Record._call.Input_isTriggered = Input.isTriggered
Input.isTriggered = function(keyName) {
    return Record.value(this, "Input_isTriggered", arguments);
};
Record._call.Input_isRepeated = Input.isRepeated
Input.isRepeated = function(keyName) {
    return Record.value(this, "Input_isRepeated", arguments);
};
Record._call.Input_isLongPressed = Input.isLongPressed
Input.isLongPressed = function(keyName) {
    return Record.value(this, "Input_isLongPressed", arguments);
};
Object.defineProperty(Input, 'dir4', {
    get: function() {
        return Record.value(this, "value", [this._dir4, "Input.dir8"]);
    },
    configurable: true
});
Object.defineProperty(Input, 'dir8', {
    get: function() {
        return Record.value(this, "value", [this._dir8, "Input.dir8"]);
    },
    configurable: true
});
Object.defineProperty(Input, 'date', {
    get: function() {
        return Record.value(this, "value", [this._date, "Input._date"]);
    },
    configurable: true
});
Record._call.TouchInput_isPressed = TouchInput.isPressed
TouchInput.isPressed = function() {
    return Record.value(this, "TouchInput_isPressed", arguments);
};
Record._call.TouchInput_isTriggered = TouchInput.isTriggered
TouchInput.isTriggered = function() {
    var re = Record._call.TouchInput_isTriggered.call(this)
    return Record.value(this, "TouchInput_isTriggered", arguments);
};
Record._call.TouchInput_isRepeated = TouchInput.isRepeated
TouchInput.isRepeated = function() {
    return Record.value(this, "TouchInput_isRepeated", arguments);
};
Record._call.TouchInput_isLongPressed = TouchInput.isLongPressed
TouchInput.isLongPressed = function() {
    return Record.value(this, "TouchInput_isLongPressed", arguments);
};
Record._call.TouchInput_isCancelled = TouchInput.isCancelled
TouchInput.isCancelled = function() {
    return Record.value(this, "TouchInput_isCancelled", arguments);
};
Record._call.TouchInput_isMoved = TouchInput.isMoved
TouchInput.isMoved = function() {
    return Record.value(this, "TouchInput_isMoved", arguments);
};
Record._call.TouchInput_isReleased = TouchInput.isReleased
TouchInput.isReleased = function() {
    return Record.value(this, "TouchInput_isReleased", arguments);
};
Object.defineProperty(TouchInput, 'wheelX', {
    get: function() {
        var re = this._wheelX
        return Record.value(this, "value", [this._wheelX, "TouchInput._wheelX"]);
    },
    configurable: true
});
Object.defineProperty(TouchInput, 'wheelY', {
    get: function() {
        var re = this._wheelY
        return Record.value(this, "value", [this._wheelY, "TouchInput._wheelY"]);
    },
    configurable: true
});

Object.defineProperty(TouchInput, 'x', {
    get: function() {
        return Record.value(this, "value", [this._x, "TouchInput._x"]);
    },
    configurable: true
});
Object.defineProperty(TouchInput, 'y', {
    get: function() {
        return Record.value(this, "value", [this._y, "TouchInput._y"]);
    },
    configurable: true
});
Object.defineProperty(TouchInput, 'date', {
    get: function() {
        return Record.value(this, "value", [this._date, "TouchInput._date"]);
    },
    configurable: true
});