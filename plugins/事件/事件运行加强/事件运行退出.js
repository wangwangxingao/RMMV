Game_Interpreter.prototype.update = function() {
    while (this.isRunning()) {
        if (this.updateExit()) {
            this.command115()
            break;
        }
        if (this.updateChild() || this.updateWait()) {
            break;
        }
        if (SceneManager.isSceneChanging()) {
            break;
        }
        if (!this.executeCommand()) {
            break;
        }
        if (this.checkFreeze()) {
            break;
        }
    }
};


Game_Interpreter.prototype.updateExit = function() {
    if (this._mustExit && Input.isPressed('escape')) {
        return true
    }
    return false
};



Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
    //通过插件来覆盖
    if (command == "exiton") {
        this._mustExit = true
    }
    if (command == "exitoff") {
        this._mustExit = false
    }
};