//=============================================================================
// NameInput.js
//=============================================================================
/*:
 * @plugindesc 名字输入 请放在 TDDP_xxx 后面
 * @author wangwang
 *
 *
 * @help
 * 帮助的信息
 * 用网页输入代替原本的名字输入
 * 请放在 TDDP_xxx 后面
 *
 *
 */



(function() {

    Scene_Name.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Name.prototype.constructor = Scene_Name;
    //初始化
    Scene_Name.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    //准备
    Scene_Name.prototype.prepare = function(actorId, maxLength) {
        this._actorId = actorId;
        this._maxLength = 20 || maxLength;
    };
    //创建
    Scene_Name.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._actor = $gameActors.actor(this._actorId);
        if (this._actorId == 12) {
            this._actor.setName("")
        }
        this.createEditWindow();
        this.createBCWindow();
    };
    //开始
    Scene_Name.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._editWindow.refresh();
    };

    //创建编辑窗口
    Scene_Name.prototype.createEditWindow = function() {
        this._editWindow = new Window_NameEdit(this._actor, this._maxLength);
        this.addWindow(this._editWindow);
        this._touchhash = new TouchCallHash()
    };

    Scene_Name.prototype.createBCWindow = function() {
        var ew = this._editWindow

        var height = ew.lineHeight()
        var width1 = ew.width - ew.faceWidth() - ew.standardPadding() * 4

        var width2 = ew.charWidth() * this._maxLength
        var width = Math.min(width1, width2)
        var x = ew.x + ew.faceWidth() + ew.standardPadding() * 2 + (width1 - width) / 2
        var y = ew.y + (ew.height - height) / 2

        Graphics._addInput("text", x, y, width, height, ew.standardFontSize())
        Graphics._input.maxLength = this._maxLength
        Graphics._input.value = this._actor.name().slice(0, this._maxLength);


        var add = {
            "obj": {
                "type": "text",
                "textbox": [70, 52],
                "text": "\\C[#D3BC89]确认",
                "pos": [ew.x + ew.width - 120, ew.y + ew.height - 50]
            }
        }

        this._bcWindow = new Sprite_add()
        this._bcWindow.setAdd(add)

        this._touchhash.set(this._bcWindow, this.onInputOk.bind(this))

        this.addChild(this._bcWindow);
        var add = {
            "obj": {
                "type": "text",
                "textbox": [70, 52],
                "text": "\\C[#D3BC89]还原",
                "pos": [ew.x + ew.width - 210, ew.y + ew.height - 50]
            }
        }
        this._csWindow = new Sprite_add()
        this._csWindow.setAdd(add)
        this._touchhash.set(this._csWindow, this.oncs.bind(this))
        this.addChild(this._csWindow);


        this._tsWindow = new Sprite_add()
        ew.addChild(this._tsWindow);
        var add = {
            "obj": {
                "type": "text",
                "textbox": [300, 50],
                "text": "\\C[9]输入:",
                "pos": [this._actorId == 12 ? 20 : 144 + 20, 20]
            }
        }
        this._tsWindow.setAdd(add)
    };

    //输入初始化
    Scene_Name.prototype.oncs = function() {
        Graphics._input.value = this._actor.name().slice(0, this._maxLength);
        if (this._actorId == 12) {
            var add = {
                "obj": {
                    "type": "text",
                    "textbox": [300, 50],
                    "text": "\\C[9]重新输入",
                    "pos": [144 + 20, 20]
                }
            }
        } else {
            var add = {
                "obj": {
                    "type": "text",
                    "textbox": [300, 50],
                    "text": "\\C[9]重新命名",
                    "pos": [144 + 20, 20]
                }
            }
        }

        this._tsWindow.setAdd(add)
    };

    Scene_Name.prototype.trim = function(s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    }
    Scene_Name.prototype.ltrim = function(s) {
        return s.replace(/(^\s*)/g, "");
    }
    Scene_Name.prototype.rtrim = function(s) {
        return s.replace(/(\s*$)/g, "");
    }

    //当输入确定
    Scene_Name.prototype.onInputOk = function() {
        var name = "" + Graphics._input.value
        if (name || this._actorId == 12) {
            var name = this.trim(name)
            if (name || this._actorId == 12) {
                this._actor.setName(name);
                this.popScene();
                Graphics._removeInput()
            } else {
                var add = {
                    "obj": {
                        "type": "text",
                        "textbox": [300, 50],
                        "text": "\\C[18]不能空白 ",
                        "pos": [144 + 20, 20]
                    }
                }
                this._tsWindow.setAdd(add)

            }
        } else {
            var add = {
                "obj": {
                    "type": "text",
                    "textbox": [300, 50],
                    "text": "\\C[18]不能无名 ",
                    "pos": [144 + 20, 20]
                }
            }
            this._tsWindow.setAdd(add)
        }

    };

    Scene_Name.prototype.update0 = Scene_Name.prototype.update
        //当输入确定
    Scene_Name.prototype.update = function() {
        this.update0()
        this._touchhash.processInput()
        if (Input.isTriggered("ok")) {
            this.onInputOk()
        } else if (TouchInput.isCancelled()) {
            this.onInputOk()
        }
    };



    //名称编辑窗口
    Window_NameEdit.prototype = Object.create(Window_Base.prototype);
    Window_NameEdit.prototype.constructor = Window_NameEdit;
    //初始化
    Window_NameEdit.prototype.initialize = function(actor, maxLength) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        var x = (Graphics.boxWidth - width) / 2;
        var y = (Graphics.boxHeight - (height + this.fittingHeight(3) + 8)) / 2;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._actor = actor;
        this._name = actor.name().slice(0, this._maxLength);
        this._index = this._name.length;
        this._maxLength = maxLength;
        this._defaultName = this._name;
        this.deactivate();
        this.refresh();
        ImageManager.loadFace(actor.faceName());
    };

    //窗口宽
    Window_NameEdit.prototype.windowWidth = function() {
        return 480;
    };

    //窗口高
    Window_NameEdit.prototype.windowHeight = function() {
        return this.fittingHeight(4);
    };

    //名称
    Window_NameEdit.prototype.name = function() {
        return this._name;
    };


    //脸宽
    Window_NameEdit.prototype.faceWidth = function() {
        if (this._actor && this._actor.actorId() == 12) {
            return 0
        }
        return 144;
    };
    //字符宽
    Window_NameEdit.prototype.charWidth = function() {
        var text = '--';
        return this.textWidth(text);
    };


    //刷新
    Window_NameEdit.prototype.refresh = function() {
        this.contents.clear();
        this.drawActorFace(this._actor, 0, 0);
    };




    Graphics._createAllElements = function() {
        this._createErrorPrinter();
        this._createCanvas();
        this._createVideo();
        this._createUpperCanvas();
        this._createRenderer();
        this._createFPSMeter();
        this._createModeBox();
        this._createGameFontLoader();

        this._createInput() //修改
    };

    /**更新所有成分
     * @static
     * @method _updateAllElements
     * @private
     */
    Graphics._updateAllElements = function() {
        this._updateRealScale();
        this._updateErrorPrinter();
        this._updateCanvas();
        this._updateVideo();
        this._updateUpperCanvas();
        this._updateRenderer();

        this._updateInput(); //添加

        this._paintUpperCanvas();
    };



    //创建输入
    Graphics._createInput = function() {
        this._input = document.createElement("input");;
        this._input.id = 'Input';
        this._input.type = "text"
        this._input._sx = {}
        var sx = this._input._sx
        sx.xs = false
        sx.x = 0
        sx.y = 0
        sx.width = 100
        sx.height = 20
        sx.fontSize = 18
            //document.body.appendChild(this._input);
    };

    Graphics._inputshow = function() {
        return Graphics && Graphics._input && Graphics._input._sx && Graphics._input._sx.xs
    };
    //添加输入
    Graphics._addInput = function(type, x, y, width, height, fontSize) {
        this._input.type = type || "text"
        var sx = this._input._sx
        sx.x = x
        sx.y = y
        sx.width = width || 100
        sx.height = height || 20
        sx.fontSize = fontSize || 18
        this._updateInput()
        sx.xs = true
        document.body.appendChild(this._input);
    };

    //移除输入
    Graphics._removeInput = function() {
        this._input.remove()
        this._input.value = null
        this._input.maxLength = 1000000
        this._input._sx.xs = false
    };
    //更新输入
    Graphics._updateInput = function() {
        this._input.style.zIndex = 512;
        var sx = this._input._sx
        var x = sx.x * this._realScale + (window.innerWidth - this._width * this._realScale) / 2
        var y = sx.y * this._realScale + (window.innerHeight - this._height * this._realScale) / 2
        var width = sx.width * this._realScale;
        var height = sx.height * this._realScale;
        var fontSize = sx.fontSize * this._realScale;
        this._input.style.position = 'absolute';
        this._input.style.margin = 'auto';
        this._input.style.top = y + 'px';
        this._input.style.left = x + 'px';
        this._input.style.width = width + 'px';
        this._input.style.height = height + 'px';
        this._input.style.fontSize = fontSize + 'px';
        this._input.style.background = 'transparent';
        this._input.style.border = 10;
        this._input.style.color = "#D3BC89" //"#FFF"
        this._input.style["font-weight"] = "bold"
    }

    //防止默认
    Input._onKeyDown = function(event) {
        //如果 需要避免默认 (键值)
        if (Graphics && Graphics._input && Graphics._input._sx && Graphics._input._sx.xs) {
            if (event.keyCode == 13 || event.keyCode == 27) {} else {
                return
            }
        } else {
            if (this._shouldPreventDefault(event.keyCode)) {
                //避免默认
                event.preventDefault();
            }
        }


        //键值===144
        if (event.keyCode === 144) { // Numlock  数字开关
            //清除
            this.clear();
        }
        var buttonName = this.keyMapper[event.keyCode];
        //如果 键名
        if (buttonName) {
            //当前状态 键 =true
            this._currentState[buttonName] = true;
        }
    };



    TouchInput._activateClickEvents = function(x, y) {
        var found_click_event = false;
        if (SceneManager.isCurrentSceneStarted() && TDDP_MouseSystemEx._isSceneMap() && $gameMap !== null && $dataMap !== null && !$gameMessage.isBusy()) {
            var x = $gameMap.canvasToMapX(x);
            var y = $gameMap.canvasToMapY(y);
            var _events = $gameMap.eventsXy(x, y);
            if (_events.length > 0) {
                var game_event = _events[_events.length - 1];
                if (game_event.TDDP_MS.clickActivate) {
                    game_event.start();
                    found_click_event = true;
                };
                if (game_event.TDDP_MS.clickSwitch) {
                    var key = [$gameMap._mapId, game_event._eventId, game_event.TDDP_MS.clickSwitch.key]
                    $gameSelfSwitches.setValue(key, game_event.TDDP_MS.clickSwitch.val === 'true');
                    found_click_event = true;
                };
            }
        }
        return found_click_event;
    }

})();