//=============================================================================
// nameInput.js
//=============================================================================
/*:
 * @plugindesc 名字输入  
 * @author wangwang
 *
 *
 * @param  nameInput
 * @desc 插件 名字输入,作者:汪汪
 * @default 汪汪 
 * 
 * @param  background
 * @desc 背景颜色,默认'transparent' ,可以为:"#ffffff","#fff" 或者"rbga(255,255,255,0.5)"之类的
 * @default transparent
 *  
 * @param  border
 * @desc 边框的宽度
 * @default 10
 *  
 * @param  textcolor
 * @desc 文字颜色,可以为:"#ffffff","#fff" 或者"rbga(255,255,255,0.5)"之类的
 * @default #ffffff
 * 
 * 
 * @help 
 * enter 确定
 * esc 还原
 *
 *
 */



(function () {
    
    
        var ww = ww || {};
        ww.nameInput = {};
        ww.nameInput.Parameters = PluginManager.parameters('nameInput');
    
        ww.nameInput.background = ww.nameInput.Parameters["background"];
        ww.nameInput.border = ww.nameInput.Parameters["border"] * 1;
        ww.nameInput.textcolor = ww.nameInput.Parameters["textcolor"];
    
    
        Graphics._addText = function (id, x, y, width, height, fontSize) {
            var set = {
                type: "text",
                id: id,
                sz: {
                    x: x,
                    y: y,
                    width: width || 100,
                    height: height || 20,
                    fontSize: fontSize || 18
                }
            }
            this._createInput(id, "input", set)
            var set2 = {
                background: ww.nameInput.background || 'transparent',
                border: ww.nameInput.border || 0,
                color: ww.nameInput.textcolor || "#fff",
                "font-weight": "bold"
            }
            this._setInput(id, set2, "style")
            return this._inputs[id]
        };
    
    
    
        Scene_Name.prototype = Object.create(Scene_MenuBase.prototype);
        Scene_Name.prototype.constructor = Scene_Name;
        //初始化
        Scene_Name.prototype.initialize = function () {
            Scene_MenuBase.prototype.initialize.call(this);
        };
        //准备
        Scene_Name.prototype.prepare = function (actorId, maxLength) {
            this._actorId = actorId;
            this._maxLength = 20 || maxLength;
        };
        //创建
        Scene_Name.prototype.create = function () {
            Scene_MenuBase.prototype.create.call(this);
            this._actor = $gameActors.actor(this._actorId);
    
            this.createEditWindow();
            this.createBCWindow();
        };
        //开始
        Scene_Name.prototype.start = function () {
            Scene_MenuBase.prototype.start.call(this);
            this._editWindow.refresh();
        };
    
        //创建编辑窗口
        Scene_Name.prototype.createEditWindow = function () {
            this._editWindow = new Window_NameEdit(this._actor, this._maxLength);
            this.addWindow(this._editWindow);
        };
    
        Scene_Name.prototype.createBCWindow = function () {
            var ew = this._editWindow
    
            var height = ew.lineHeight()
            var width1 = ew.width - ew.faceWidth() - ew.standardPadding() * 4
    
            var width2 = ew.charWidth() * this._maxLength
            var width = Math.min(width1, width2)
            var x = ew.x + ew.faceWidth() + ew.standardPadding() * 2 + (width1 - width) / 2
            var y = ew.y + (ew.height - height) / 2
    
            this._input = Graphics._addText("text", x, y, width, height, ew.standardFontSize())
    
            this._input.maxLength = this._maxLength
            this._input.value = this._actor.name().slice(0, this._maxLength)
    
    
    
        };
    
        //输入初始化
        Scene_Name.prototype.oncs = function () {
            this._input.value = this._actor.name().slice(0, this._maxLength);
    
        };
    
        Scene_Name.prototype.trim = function (s) {
            return s.replace(/(^\s*)|(\s*$)/g, "");
        }
        Scene_Name.prototype.ltrim = function (s) {
            return s.replace(/(^\s*)/g, "");
        }
        Scene_Name.prototype.rtrim = function (s) {
            return s.replace(/(\s*$)/g, "");
        }
    
        //当输入确定
        Scene_Name.prototype.onInputOk = function () {
            var name = "" + this._input.value
    
            var name = this.trim(name)
            if (name) {
                this._actor.setName(name);
                this.popScene();
                this._input = null
                Graphics._removeInput("text")
    
            } else {
                this.oncs()
            }
        };
    
        Scene_Name.prototype.update0 = Scene_Name.prototype.update
        //当输入确定
        Scene_Name.prototype.update = function () {
            this.update0()
            if (Input.isTriggered("ok")) {
                this.onInputOk()
            } else if (Input.isTriggered("escape")) {
                this.oncs()
            } else if (TouchInput.isCancelled()) {
                this.onInputOk()
            }
        };
    
    
    
        //名称编辑窗口
        Window_NameEdit.prototype = Object.create(Window_Base.prototype);
        Window_NameEdit.prototype.constructor = Window_NameEdit;
        //初始化
        Window_NameEdit.prototype.initialize = function (actor, maxLength) {
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
        Window_NameEdit.prototype.windowWidth = function () {
            return 480;
        };
    
        //窗口高
        Window_NameEdit.prototype.windowHeight = function () {
            return this.fittingHeight(4);
        };
    
        //名称
        Window_NameEdit.prototype.name = function () {
            return this._name;
        };
    
    
        //脸宽
        Window_NameEdit.prototype.faceWidth = function () {
            if (this._actor && this._actor.actorId() == 12) {
                return 0
            }
            return 144;
        };
        //字符宽
        Window_NameEdit.prototype.charWidth = function () {
            var text = '--';
            return this.textWidth(text);
        };
    
    
        //刷新
        Window_NameEdit.prototype.refresh = function () {
            this.contents.clear();
            this.drawActorFace(this._actor, 0, 0);
        };
    
    
    
    })();