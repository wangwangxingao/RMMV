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
 * Record.play(file) 播放一个录像文件,不选为最后这个
 * //结束
 * Record.end()  结束录像/播放
 * 
 * 
 * //录像文件列表
 * Record.files   是一个数组  []
 * //最后文件 
 * Record.fileend ()
 * 
 * //保存储存
 * Record.save(name ,file)   name :名称  file :一个录像文件
 * //保存id的录像 到 name 文件
 * Record.saveId(name, id) 
 * 
 * //保存最后的录像 到 name 文件 
 * Record.saveEnd(name)  
 * 
 * 
 * //读取储存
 * Record.load(name)   name :名称     返回一个录像文件 
 * //读取name文件 并播放  
 * Record.loadPlay(name)  
 * 
 * 
 */




function Record() {
    throw new Error('This is a static class');
}

Record.mode = "空"
Record.files = []
Record.wait = 0


/**
 * 
 * 键的记录读取
 * 
 */


/**等待开 */
Record.waitOpen = function(value) {
    if (value > this.wait) {
        this.wait = value
    }
}

/**等待关 */
Record.waitClose = function(value) {
    if (value >= this.wait && this.wait) {
        this.wait = 0
    }
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
Record.pop = function(result) {
    if (!this.counts) {
        var key = this.infos[this.pos++]
        if (!key) {
            this.end(true)
            return result
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
        if (fun != "Math_random" && fun != "Math_randomInt") {
            return 0
        }
    }
    if (this.mode == "录制") {
        return this.push(result)
    }
    if (this.mode == "播放") {
        return this.pop(result)
    }
    return result
}






/**
 * 
 * 录像数据处理
 * 
 */
/**场景名称 */
Record.sn = function(constructor) {
        return constructor.name
    }
    /**名称场景 */
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

/**录像文件到json */
Record.tojson = function(file) {
    return JSON.stringify(file)
}

/**json到录像文件 */
Record.tofile = function(json) {
    return JSON.parse(json)
}

/**
 * 录像的操作
 */


/**开始 */
Record.start = function() {
    this.end()
    this.mode = "录制"
    this.file = { save: this.saveData(), infos: this.infos = [] }
    this.files.push(this.file)
    this.pos = 0
    this.counts = 0
    this.kind = 0
}

/**播放 */
Record.play = function(file) {
    this.end()
    if (file) { this.file = file }
    if (this.file) {
        this.loadData(this.file.save)
        this.infos = this.file.infos
        this.mode = "播放"
        this.pos = 0
        this.counts = 0
        this.kind = 0
    }
}

/**结束 */
Record.end = function(v) {
    if (this.file) {
        if (this.mode == "录制") {
            Record.push({})
        }
    }
    this.mode = "空"
    this.pos = 0
    this.counts = 0
    this.kind = 0
    this.waitClose(2)
        //console.log("end", this.file)
    if (v) { alert("end") }
}


/**
 * 
 * 录像数据保存
 * 
 */

/**保存 */
Record.save = function(name, file) {
    StorageManager.save("record_" + name, this.tojson(file))
}

/**保存id的录像 到 name 文件*/
Record.saveId = function(name, id) {
    this.save(name, this.files[id])
}

/**最后一个文件 */
Record.fileend = function() {
    return Record.files[Record.files.length - 1]
}

/**保存最后的录像 到 name 文件 */
Record.saveEnd = function(name) {
    this.save(name, this.fileend())
}


/**读取 */
Record.load = function(name) {
    return this.tofile(StorageManager.load("record_" + name))
}

/**读取并播放 */
Record.loadPlay = function(name) {
    this.play(this.load(name))
}



/**
 * 
 * 录像卡点
 * 
 */


SceneManager.updateScene = function() {
    if (this._scene) {
        if (!this._sceneStarted && this._scene.isReady()) {
            Record.waitClose(2)
            this._scene.start();
            this._sceneStarted = true;
            this.onSceneStart();
        }
        if (this.isCurrentSceneStarted()) {
            if (this._scene.isReady()) {
                Record.waitClose(1)
                this._scene.update();
            } else {
                Record.waitOpen(1)
            }
        }
    }
};
SceneManager.goto = function(sceneClass) {
    Record.waitOpen(2)
    if (sceneClass) {
        this._nextScene = new sceneClass();
    }
    if (this._scene) {
        this._scene.stop();
    }
};




/**
 * 
 * 请求录像记录
 * 
 */
Record._call = {}
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
        return Record.value(this, "value", [this._wheelX, "TouchInput._wheelX"]);
    },
    configurable: true
});
Object.defineProperty(TouchInput, 'wheelY', {
    get: function() {
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