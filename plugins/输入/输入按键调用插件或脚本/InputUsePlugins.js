//=============================================================================
// InputUsePlugins.js
//=============================================================================
/*:
 * @plugindesc 按键调用插件
 * @author wangwang
 *
 * @param  InputUsePlugins 
 * @desc 确定是按键调用插件的参数,请勿修改
 * @default 汪汪 
 * 
 * @param KeyName
 * @desc 键对应名，请勿与mv默认设置冲突
 * @default "65":"A","68":"D"
 *
 * @param UsePlugin
 * @desc 键名调用方法
 * @default "A":{"isTriggerLongPressed":"IUP test isTriggerLongPressed","isTriggered":"IUP test1 isTriggered","isKeyUpTriggered":"IUP test2 isKeyUpTriggered"}
 * 
 * @param UseEval
 * @desc 键名调用脚本
 * @default "D":"console.log('D')"
 * 
 * @help
 * 帮助的信息
 * 
 * kayname 用来扩展mv的按键
 * 是给键盘按键设置一个名称，不同的键可以设置相同的名称，
 * 前面的是键对应的值，具体哪个按键对应的什么值可以上网上查询 键盘键值，比如 65 对应的是 键盘上 的 A键
 * 后面的是键对应的名称，可以任意设置，比如 我们把 65 设置为 "A" , 68 （d键） 设置为 "D" ，当然你也可以吧 65 设置为 "随便起个名"，
 * 写法是  
 * "数字"："名称"   
 * 如 
 * "65":"A"
 * 
 * mv本事也设置了一些 ，如下
 * 9: 'tab',       // tab
 * 13: 'ok',       // enter
 * 16: 'shift',    // shift
 * 17: 'control',  // control
 * 18: 'control',  // alt
 * 27: 'escape',   // escape
 * 32: 'ok',       // space
 * 33: 'pageup',   // pageup
 * 34: 'pagedown', // pagedown
 * 37: 'left',     // left arrow
 * 38: 'up',       // up arrow
 * 39: 'right',    // right arrow
 * 40: 'down',     // down arrow
 * 45: 'escape',   // insert
 * 81: 'pageup',   // Q
 * 87: 'pagedown', // W
 * 88: 'escape',   // X
 * 90: 'ok',       // Z
 * 96: 'escape',   // numpad 0
 * 98: 'down',     // numpad 2
 * 100: 'left',    // numpad 4
 * 102: 'right',   // numpad 6
 * 104: 'up',      // numpad 8
 * 120: 'debug'    // F9
 * 
 * UsePlugin 是用来调用插件方法 相当于事件里最后一页的 插件指令
 * UseEval 是用来调用脚本 相当于事件里最后一页的 脚本
 * 前面写用于判断的键名，如 "A" 就是指对于键名 "A" 的调用 ，
 * 当然，你也可以使用mv原有的那些名字比如 "ok" ,"shift" 不过不建议，因为那样可能影响正常游戏操作
 * 
 * 后面有两种写法 
 * 1，字符串， 比如 "IUP test isTriggerLongPressed" 
 * 这样就是调用 插件指令 IUP test isTriggerLongPressed ，记得字符串两边加""
 * 当然也可以是脚本 比如 "$gameVariables.setValue(1,100)"  
 * 设置1号变量为100
 * 这种情况下，默认是按下键的瞬间调用它
 * 2,对象，使用{"isTriggerLongPressed":"IUP test isTriggerLongPressed","isTriggered":"IUP test1 isTriggered"} 这样的写法
 * 这种情况下， 会在 
 * "isTriggered"
 * 按下瞬间（按下，只触发一次）调用 插件指令 "IUP test1 isTriggered"
 * "isTriggerLongPressed" 
 * 长按下瞬间（长按一会，只触发一次）调用 插件指令 "IUP test isTriggerLongPressed"
 * 
 * isPressed 是按下
 * isTriggered 是刚按下 (推荐)
 * isRepeated 是重复按下 
 * isLongPressed 是长按下
 * isTriggerLongPressed 是长按下瞬间 (添加，推荐)
 * isKeyUpTriggered 是抬起瞬间(添加) 
 * 
 * 一个键写完后要写另一个键用 , 隔开
 * 如 "A":"XXXXXXX","D":"YYYYYYYYY"
 * 
 * 
 * 
 */

(function () {


    var _Game_Interpreter_pluginCommand =
        Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'IUP') {
            switch (args[0]) {
                case 'start':
                    ww.InputUsePlugins.start()
                    break;
                case 'open':
                    ww.InputUsePlugins.open()
                    break;
                case 'close':
                    ww.InputUsePlugins.close()
                    break;
                case 'test': 
                    console.log("测试  " + args[1] + " 是长按下瞬间")
                    break;
                case 'test1':
                    console.log("测试 1  " + args[1] + " 是按下")
                    break;
                case 'test2':
                    console.log("测试 2  " + args[1] + " 是抬起")
                    break;
            }
        }
    };




    //长按后瞬间
    Input.isTriggerLongPressed = function (keyName) {
        if (this._isEscapeCompatible(keyName) && this.isLongPressed('escape')) {
            return true;
        } else {
            return (this._latestButton === keyName &&
                this._pressedTime === this.keyRepeatWait);
        }
    };    
    
    //抬起按键
    Input.isKeyUpTriggered = function (keyName) {
        if (this._isEscapeCompatible(keyName) && this.isLongPressed('escape')) {
            return true;
        } else {
            return ( !this._currentState[keyName]&& this._previousState[keyName]);
        }  
    };
 


    ww = {}
    ww.InputUsePlugins = {}

    ww.InputUsePlugins._keyname = {}
    ww.InputUsePlugins._useplugin = {}
    ww.InputUsePlugins._useeval = {}

    ww.InputUsePlugins.SceneManager_updateInputData = SceneManager.updateInputData
    SceneManager.updateInputData = function () {
        if (ww.InputUsePlugins.open) {
            ww.InputUsePlugins.use()
        }
        ww.InputUsePlugins.SceneManager_updateInputData.call(this)
    };

    ww.InputUsePlugins.init = function (p) {
        var p = p
        var keyname = p.parameters["KeyName"] || ""
        var useplugin = p.parameters["UsePlugin"] || ""
        var useeval = p.parameters["UseEval"] || ""

        try { eval('this._keyname = {' + keyname + '}') } catch (e) { console.log( "keyname is error")}
        try { eval('this._useplugin = {' + useplugin + '}') } catch (e) {console.log( "useplugin is error") }
        try { eval('this._useeval = {' + useeval + '}') } catch (e) {console.log( "useeval is error") }


        var kn = this._keyname
        for (var i in kn) {
            if (!Input.keyMapper[i]) {
                Input.keyMapper[i] = kn[i]
            }
        }
    }

    ww.InputUsePlugins.use = function () {
        var use = this._useeval
        for (var name in use) {
            try {
                var nr = use[name]
                var type = typeof (nr)
                if (type === "string") {
                    if (Input.isTriggered(name)) {
                        eval(nr)
                    }
                } else if (type === "object") {
                    for (var f in nr) {
                        if (Input[f] && Input[f](name)) {
                            var nr2 = nr[f]
                            if (typeof (nr2) === "string") {
                                eval(nr2)
                            }
                        }
                    }
                }
            } catch (e) {
            }
        }


        var use = this._useplugin
        for (var name in use) {
            try {
                var nr = use[name]
                var type = typeof (nr)
                if (type === "string") {
                    if (Input.isTriggered(name)) {
                        this.usepc(nr)
                    }
                } else if (type === "object") {
                    for (var f in nr) {
                        if (Input[f] && Input[f](name)) {
                            var nr2 = nr[f]
                            if (typeof (nr2) === "string") {
                                this.usepc(nr2)
                            }
                        }
                    }
                }
            } catch (e) {
            }
        }

    }
    ww.InputUsePlugins.usepc = function (s) {
        var pc = Game_Interpreter.prototype.pluginCommand
        var args = s.split(" ");
        var command = args.shift();
        pc(command, args);
    }






    ww.InputUsePlugins.start = function () {
        this._open = true
        this.load()
    }

    ww.InputUsePlugins.open = function () {
        this._open = true
    }

    ww.InputUsePlugins.close = function () {
        this._open = false
    }


    ww.InputUsePlugins.load = function () {
        for (var i = 0; i < $plugins.length; i++) {
            var plugin = $plugins[i]
            if (plugin.parameters["InputUsePlugins"]) {
                if (plugin.status == true) {
                    ww.InputUsePlugins.init(plugin)
                }
            }
        }
    }
    ww.InputUsePlugins.start()



})();
