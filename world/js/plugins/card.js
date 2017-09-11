Math.PI2 = 1 / Math.PI

/**
 * 弧度
 * @param {number} jd 角度 
 * @return {number} 弧度
 */
function hd(jd) {
    Math.PIHD = Math.PIHD || Math.PI / 180
    return Math.PIHD * jd
}

/**
 * 角度
 * @param {number} hd 弧度
 * @return {number} 角度
 */
function jd(hd) {
    Math.PIJD = Math.PI180 || 180 / Math.PI
    return Math.PIJD * hd;
}




/**-----------------------------------------------------------------------------*/
/** Card_Interpreter*/
/** 游戏事件解释器*/
/** The interpreter for running event commands.*/
/** 运转事件命令的解释器*/

function Card_Interpreter() {
    this.initialize.apply(this, arguments);
}
/**初始化*/
Card_Interpreter.prototype.initialize = function(depth) {
    //深度 = depth//深度 || 0
    this._depth = depth || 0;
    //检查溢出()
    this.checkOverflow();
    //清除()
    this.clear();

};
/**检查溢出*/
Card_Interpreter.prototype.checkOverflow = function() {
    //如果 (深度 >= 100 )
    if (this._depth >= 100) {
        //抛出 新 错误 ("Common event calls exceeded the limit" //事件调用超出限制)
        throw new Error('Common event calls exceeded the limit');
    }
};
/**清除*/
Card_Interpreter.prototype.clear = function() {
    this._obj = null;
    //列表 = null
    this._list = null;
    //索引 = 0
    this._index = 0;
    //等待计数 = 0
    this._waitCount = 0;
    //等待模式 = ''
    this._waitMode = '';
    //注释 = ''
    this._comments = [];
    //返回
    this._return = {};
    //分支 = {}
    this._branch = {};
    //参数组 = []
    this._params = [];
    //缩进 = 0
    this._indent = 0;
    //帧计数 = 0
    this._frameCount = 0;
    //冻结检查 = 0
    this._freezeChecker = 0;
};
/**安装*/
Card_Interpreter.prototype.setup = function(obj) {
    //清除()
    this.clear();
    //对象 = 对象
    this._obj = obj;
    //列表 = list//列表
    this._list = obj.list;
};
/**对象*/
Card_Interpreter.prototype.obj = function() {
    //返回 对象
    return this._obj;
};

/**是运转*/
Card_Interpreter.prototype.isRunning = function() {
    //返回 !!列表
    return !!this._list;
};
/**更新*/
Card_Interpreter.prototype.update = function() {
    //当( 是运转() )
    while (this.isRunning()) {
        //如果( 更新子项() 或者 更新等待())
        if (this.updateChild() || this.updateWait()) {
            //中断
            break;
        }
        /**  
        //如果 (场景管理器 是场景改变() )
        if (SceneManager.isSceneChanging()) {
            //中断
            break;
        }
        */
        //如果( 不是 执行命令() )
        if (!this.executeCommand()) {
            //中断
            break;
        }
        //如果 (检查冻结() )
        if (this.checkFreeze()) {
            //中断
            break;
        }
    }
};
/**更新子项*/
Card_Interpreter.prototype.updateChild = function() {
    //如果( 子事件解释器 )
    if (this._childInterpreter) {
        //子事件解释器 更新()
        this._childInterpreter.update();
        //如果( 子事件解释器 是运转() )
        if (this._childInterpreter.isRunning()) {
            //返回 true
            return true;
            //否则
        } else {
            this._childReturn = this._childInterpreter.return()
                //子事件解释器 = null
            this._childInterpreter = null;
        }
    }
    //返回 false
    return false;
};

/**子返回*/
Card_Interpreter.prototype.childReturn = function() {
    //返回 更新等待计数() 或者 更新等待模式() 
    return this._childReturn;
};
/**子项返回*/
Card_Interpreter.prototype.setChildReturn = function(re) {
    //返回 更新等待计数() 或者 更新等待模式() 
    this._childReturn = re;
};

/**设置返回*/
Card_Interpreter.prototype.setReturn = function(re) {
    this._return = re;
};
/**返回*/
Card_Interpreter.prototype.return = function() {
    //返回 更新等待计数() 或者 更新等待模式() 
    return this._return;
};

/**设置返回*/
Card_Interpreter.prototype.setReturn = function(re) {
    this._return = re;
};
/**更新等待*/
Card_Interpreter.prototype.updateWait = function() {
    //返回 更新等待计数() 或者 更新等待模式() 
    return this.updateWaitCount() || this.updateWaitMode();
};
/**更新等待计数*/
Card_Interpreter.prototype.updateWaitCount = function() {
    //如果 等待计数 > 0
    if (this._waitCount > 0) {
        //等待计数 -- 
        this._waitCount--;
        //返回 true
        return true;
    }
    //返回 false
    return false;
};
/**更新等待模式*/
Card_Interpreter.prototype.updateWaitMode = function() {
    //等待中 = false
    var waiting = false;
    //检查( 等待模式)
    switch (this._waitMode) {
        case '':
            waiting = true
                //中断
            break;
    }
    //如果 不是 等待中
    if (!waiting) {
        //等待模式 = ""
        this._waitMode = '';
    }
    //返回 等待中
    return waiting;
};
/**设置等待模式*/
Card_Interpreter.prototype.setWaitMode = function(waitMode) {
    //等待模式 = 等待模式 
    this._waitMode = waitMode;
};
/**等待*/
Card_Interpreter.prototype.wait = function(duration) {
    //等待计数 = 持续时间
    this._waitCount = duration;
};

/**执行命令*/
Card_Interpreter.prototype.executeCommand = function() {
    //命令 =  当前命令()
    var command = this.currentCommand();
    //如果(命令)
    if (command) {
        //参数组 = 命令 参数组
        this._params = command.parameters;
        //缩进 = 命令 缩进
        this._indent = command.indent;
        //方法名称 = "command"//命令 + 命令 编码
        var methodName = 'command' + command.code;
        //如果 (类型 [方法名称] === "function"//方法 )
        if (typeof this[methodName] === 'function') {
            //如果(不是 [methodName]())
            if (!this[methodName]()) {
                //返回 false
                return false;
            }
        }
        //索引++ 
        this._index++;
        //否则 
    } else {
        //终止()
        this.terminate();
    }
    //返回 true
    return true;
};
/**检查冻结*/
Card_Interpreter.prototype.checkFreeze = function() {
    //如果( 帧计数  !== 图形 帧计数)
    if (this._frameCount !== Graphics.frameCount) {
        //帧计数  = 图形 帧计数
        this._frameCount = Graphics.frameCount;
        //冻结检查 = 0 
        this._freezeChecker = 0;
    }
    //如果 冻结检查++ >= 100000
    if (this._freezeChecker++ >= 100000) {
        //返回 true
        return true;
        //否则
    } else {
        //返回 false
        return false;
    }
};
/**终止*/
Card_Interpreter.prototype.terminate = function() {
    //列表 = null 
    this._list = null;
};
/**跳分支*/
Card_Interpreter.prototype.skipBranch = function() {
    //当 (列表[索引+1] 缩进 > 缩进 )

};
/**当前命令*/
Card_Interpreter.prototype.currentCommand = function() {
    //返回 列表[索引]
    return this._list[this._index];
};

/**下一个事件编码*/
Card_Interpreter.prototype.nextCommand = function() {
    return this._list[this._index + 1];
};

/**下一个事件编码*/
Card_Interpreter.prototype.nextEventCode = function() {
    //命令 = 列表[索引 + 1]
    var command = this._list[this._index + 1];
    //如果(命令)
    if (command) {
        //返回 命令 编码
        return command.code;
        //否则 
    } else {
        //返回 0
        return 0;
    }
};




get = function(list) {
    var indent = 0
    var list2 = []

    var hash = {}

    var dl = []
    var dl2 = []
    for (var i = 0; i < list.length; i++) {
        var code = list[i]
        switch (code) {
            /**条件分歧 */
            case "010":
                dl.push(i)
                var o = { code: code, indent: indent }
                indent++
                break;
                /**当 */
            case "011":
                var lasti = dl.pop()
                hash[lasti] = i
                dl.push(i)
                indent--
                var o = { code: code, indent: indent }
                indent++
                break;
                /**结束 */
            case "012":
                var lasti = dl.pop()
                hash[lasti] = i
                indent--
                var o = { code: code, indent: indent }
                break;
                /**循环 */
            case "020":
                dl.push(i)


                var o = { code: code, indent: indent }
                indent++
                break;
                /**循环结束 */
            case "021":
                var lasti = dl.pop()
                hash[lasti] = i


                list.push(i)
                indent--
                var o = { code: code, indent: indent }
                break;

            case "031":
                var lasti = dl.pop()
                hash[lasti] = i


                list.push(i)
                indent--
                var o = { code: code, indent: indent }
                break;
            default:
                var o = { code: code, indent: indent }
                break;
        }
        list2.push(o)
    }
    return list2
}





get = function(list) {
    var s = function(l) {
        var t = "-"
        for (var i = 0; i < l; i++) {
            t += "  "
        }
        return t
    }
    var end = function(arr, v) {
        v !== void(0) && (arr[arr.length - 1] = v)
        return arr[arr.length - 1]
    }
    var start = function(arr, v) {
        v !== void(0) && (arr[0] = v)
        return arr[0]
    }
    var hash = {}
    var hash2 = {}


    var dl = []
    var dladd = function(type) {
        var o = { type: type, list: [] }
        if (type == "switch") {
            o.break = []
        }
        if (type == "do") {
            o.next = [];
            o.break = []
        }
        dl.push(o)
        return o
    }
    var dltype = function() {
        var o = dlend()
        return (o && o.type) || void(0)
    }
    var dlend = function() {
        return end(dl)
    }
    var dli = function() {
        var o = dlend()
        var v = (o && end(o.list))
        return isFinite(v) ? v : void(0)
    }

    var dladdi = function(i) {
        var o = dlend()
        o && o.list.push(i)
    }
    var dlbreak = function(i) {
        var o = dlend()
        return (o && o.break) || []
    }
    var dlnext = function(i) {
        var o = dlend()
        return (o && o.next) || []
    }
    hash3 = []
    var log = function() {
        console.log(arguments)
        hash3.push(arguments)
    }

    var la = {}
    var tola = {}

    var indent = 0

    for (var i = 0; i < list.length; i++) {
        var code = list[i][0]
        var params = list[i][1]
        switch (code) {
            /**条件分歧 */
            case "switch":
                log(s(dl.length), "流程", i)
                dladd("switch")
                break
                /**当 */
            case "when":
            case "case":
            case "default":
                if (!end(dl)) { dladd("switch") }
                log(s(dl.length - 1), "当", i)
                hash[dli()] = i - 1
                dladdi(i)
                break;
                /**结束 */
            case "switchend":
                if (dltype() != "switch") { break }
                hash[dli()] = i
                var l = dlbreak()
                do {
                    hash[l.pop()] = i
                } while (l.length)
                dl.pop()
                log(s(dl.length), "结束流程", i)
                break
            case "if":
                log(s(dl.length), "条件分歧", i)
                dladd("if")
                dladdi(i)
                break
            case "else":
                log(s(dl.length - 1), "否则", i)
                if (!end(dl)) { break }
                hash[dli()] = i
                dladdi(i)
                break
            case "ifend":
                if (dltype() != "if") { break }
                hash[dli()] = i
                dl.pop()
                log(s(dl.length), "条件分歧结束", i)
                break
                /**循环 */
            case "do":
                log(s(dl.length), "循环", i)
                dladd("if")
                dladdi(i)
                break;
                /**循环结束 */
            case "while":
                if (dltype() != "do") { break }
                hash[i] = dli() - 1
                var l = dlbreak()
                do {
                    hash[l.pop()] = i
                } while (l.length)
                var l = dlnext()
                do {
                    hash[l.pop()] = hash[i]
                } while (l.length)
                dl.pop()
                log(s(dl.length), "循环结束", i)
                break;
            case "end":
                if (!end(dl)) { break }
                var type = dltype()
                if (type == "do") {
                    hash[i] = dli() - 1
                    var l = dlbreak()
                    do {
                        hash[l.pop()] = i
                    } while (l.length)
                    var l = dlnext()
                    do {
                        hash[l.pop()] = hash[i]
                    } while (l.length)
                    dl.pop()
                    log(s(dl.length), "循环结束", i)
                } else if (type == "switch") {
                    hash[dli()] = i
                    var l = dlbreak()
                    do {
                        hash[l.pop()] = i
                    } while (l.length)
                    dl.pop()
                    log(s(dl.length), "结束流程", i)
                } else if (type == "if") {
                    hash[dli()] = i
                    dl.pop()
                    log(s(dl.length), "条件分歧结束", i)
                    break
                }
                break;
                /**循环断开 */
            case "break":
                if (!end(dl)) { break }
                log(s(dl.length), "断开", i)
                for (var li = dl.length - 1; li >= 0; li--) {
                    var l = dl[li]
                    if (l.break) { l.break.push(i); break }
                }
                break
                /**下一个 */
            case "next":
                if (!end(dl)) { break }
                log(s(dl.length), "断开", i)
                for (var z = dl.length - 1; z >= 0; z--) {
                    var l = dl[z]
                    if (l.next) { l.next.push(i); break }
                }
                break;
                /**标签 */
            case "label":
                var id = params[0]
                la[id] === void(0) && (la[id] = i)
                    //获取跳转标签并赋值
                tola[l] = tola[l] || []
                do {
                    hash[tola[l].pop()] = la[id]
                } while (tola[l].length)
                log(s(dl.length), "标签", i, id)
                break;
                /**跳转标签 */
            case "to":
                var id = params[0]
                la[id] === void(0) ? (tola[id] = (tola[id] || []).push(i)) : (hash[i] = la[id])
                log(s(dl.length), "跳转标签", i, id)
                break;
                /**结束事件 */
            case "exit":
                log(s(dl.length), "结束", i)
                hash[i] = list.length
                break;
            default:
                log(s(dl.length), "other", i)
                break;
        }

        switch (code) {
            /**条件分歧 */
            case "do":
            case "if":
            case "switch":
                hash2[i] = indent
                indent++
                break
                /**当 */
            case "when":
            case "case":
            case "default":
            case "else":
                hash2[i] = indent - 1
                break;
                /**结束 */
            case "ifend":
            case "switchend":
            case "while":
            case "end":
                indent--
                hash2[i] = indent
                break
            default:
                hash2[i] = indent
                break;
        }

    }

    console.log(hash)

    delete hash[void(0)]
    console.log(hash3)



    for (var i = 0; i < hash3.length; i++) {
        var c = hash3[i]
        var l = []
        for (var o = 0; o < c.length; o++) {
            l[o] = c[o]
        }
        console.log(l.join(""), "  " + i + "->" + hash[i])
    }
    return hash
}


get(
    [
        ["if"],
        ["sd1f35"],
        ["else"],
        ["end"],
        ["switch"],
        ["case"],
        ["case"],
        ["if"],
        ["sd1f35"],
        ["else if"],
        ["else"],
        ["break"],
        ["end"],
        ["case"],
        ["if"],
        ["sd1f35"],
        ["else if"],
        ["else"],
        ["break"],
        ["end"],
        ["case"],
        ["if"],
        ["sd1f35"],
        ["else if"],
        ["else"],
        ["break"],
        ["end"],
        ["case"],
        ["do"],
        ["do"],
        ["end"],
        ["while"],
        ["end"],
        ["end"],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ]
)




/**执行命令*/
Card_Interpreter.prototype.executeCommand = function() {
    //命令 =  当前命令()
    var command = this.currentCommand();
    //如果(命令)
    if (command) {
        //参数组 = 命令 参数组
        this._params = command.parameters;
        //方法名称 = "command"//命令 + 命令 编码
        var methodName = 'command' + command.code;
        //如果 (类型 [方法名称] === "function"//方法 )
        if (typeof this[methodName] === 'function') {
            //如果(不是 [methodName]())
            if (!this[methodName]()) {
                //返回 false
                return false;
            }
        }
        //索引++ 
        this._index++;
        //否则 
    } else {
        //终止()
        this.terminate();
    }
    //返回 true
    return true;
};



Card_Interpreter.prototype.command000 = function() {
    if (this._params === void(0)) {
        this.jumpTo(this.jumplist[this._index])
    } else {
        if (this.paramsResult(this._params)) {
            this.jumpTo(this.jumplist[this._index])
        }
    }
    return true
}

/** 分歧开始*/
Card_Interpreter.prototype.command010 = function() {
    //返回 true
    return true;
};
/**
 * 
 * 
 * 如果 001 
 * 否 跳分支
 * 是 继续 
 * 
 * 分支 002   
 */
/** Conditional Branch  条件分歧*/

/** When [**] 当*/
Card_Interpreter.prototype.command011 = function() {
    //如果 (分支[缩进] !== 参数组[0])
    if (this.paramsResult(this._params)) {
        //跳分支()
        this.skipBranch();
    }
    //返回 true
    return true;
};

/** 条件分歧结束*/
Card_Interpreter.prototype.command012 = function() {
    //返回 true
    return true;
};

/** Comment 注释*/
Card_Interpreter.prototype.command108 = function() {
    //注释 = [参数组[0]]
    this._comments = [this._params[0]];
    //当 (下一个事件编码() == 408 )
    while (this.nextEventCode() === 408) {
        //索引++
        this._index++;
        //注释 添加 (当前命令() 参数组[0] )
        this._comments.push(this.currentCommand().parameters[0]);
    }
    //返回 true
    return true;
};

/** Loop 循环*/
Card_Interpreter.prototype.command020 = function() {
    //返回 true
    return true;
};

/** Repeat Above 重复上述*/
Card_Interpreter.prototype.command021 = function() {
    //运行{
    this.skipBranch();
    //返回 true
    return true;
};


/** Break Loop 断开循环*/
Card_Interpreter.prototype.command030 = function() {
    //当(索引 < 列表 长度 - 1 )
    while (this._index < this._list.length - 1) {
        //索引++
        this._index++;
        //命令 = 当前命令()
        var command = this.currentCommand();
        if (command.code === "003" || command.code === "004" && command.indent < this._indent) {
            //中断
            break;
        }
    }
    //返回 true 
    return true;
};


/**安装子项*/
Card_Interpreter.prototype.setupChild = function(obj) {
    if (this.nextEventCode()) {
        //子事件解释器 = 新 游戏事件解释器 (深度 + 1)
        this._childInterpreter = new Card_Interpreter(this._depth + 1);
        //子事件解释器 安装(列表, 事件id)
        this._childInterpreter.setup(obj);
    } else {
        this.setup(obj)
    }
};

/** la 标签*/
Card_Interpreter.prototype.command031 = function() {
    //返回 true 
    return true;
};

/** Jump to Label 跳到标签*/
Card_Interpreter.prototype.command032 = function() {
    //标签名 = 参数[0]
    this.skipBranch();
    //返回 true
    return true;
};




/** Exit Event Processing 退出事件处理*/
Card_Interpreter.prototype.command034 = function() {
    //索引 = 列表 长度 
    this._index = this._list.length;
    //返回 true
    return true;
};

/** Wait 等待*/
Card_Interpreter.prototype.command230 = function() {
    //等待(参数组[0])
    this.wait(this._params[0]);
    //返回 true
    return true;
};



/** Script 脚本*/
Card_Interpreter.prototype.command355 = function() {
    //脚本 = 当前命令() 参数组[0]+ "\n" 
    var script = this.currentCommand().parameters[0] + '\n';
    //当(下一个事件编码() === 655 )
    while (this.nextEventCode() === 655) {
        //索引++
        this._index++;
        //脚本 += 当前命令() 参数组[0]+ "\n" 
        script += this.currentCommand().parameters[0] + '\n';
    }
    //运行(脚本)
    eval(script);
    //返回 true
    return true;
};

/** Plugin Command 插件命令*/
Card_Interpreter.prototype.command356 = function() {
    //参数 = 参数组[0] 切割(" ")
    var args = this._params[0].split(" ");
    //命令 = 参数 移除头部()
    var command = args.shift();
    //插件命令(命令 ,参数)
    this.pluginCommand(command, args);
    //返回 true
    return true;
};
/**插件命令 */
Card_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
    //通过插件来覆盖
};