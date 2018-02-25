//=============================================================================
// addELE.js
//=============================================================================
/*:
 * @plugindesc 网页元素添加  
 * @author wangwang
 *
 * @param  addELE
 * @desc 插件 网页元素添加,作者:汪汪
 * @default 汪汪 
 *
 * @help  
 *
 *
 */




Graphics._createAllElements = function () {
    this._createErrorPrinter();
    this._createCanvas();
    this._createVideo();
    this._createUpperCanvas();
    this._createRenderer();
    this._createFPSMeter();
    this._createModeBox();
    this._createGameFontLoader();

    this._createInputs() //修改
};

/**更新所有成分
 * @static
 * @method _updateAllElements
 * @private
 */
Graphics._updateAllElements = function () {
    this._updateRealScale();
    this._updateErrorPrinter();
    this._updateCanvas();
    this._updateVideo();
    this._updateUpperCanvas();
    this._updateRenderer();

    this._updateInputs(); //添加

    this._paintUpperCanvas();
};


Graphics._createInputs = function () {
    this._inputs = {}
};
 
//创建输入
Graphics._createInput = function (id, type, set) {
    this._removeInput(id)
    this._inputs[id] = document.createElement(type);
    this._setInput(id, set)
    this._inputs[id].style.zIndex = 12;
    document.body.appendChild(this._inputs[id]);
    return this._inputs[id]
};


Graphics._setInput = function (id, set, type) {
    var input = this._inputs[id]
    if (input && set) {
        var sz = input
        if (type) {
            sz = input[type]
        }
        if (sz) {
            for (var i in set) {
                sz[i] = set[i]
            }
        }
    }
    this._updateInput(id)
    return this._inputs[id]
}



//移除输入
Graphics._removeInput = function (id) {
    var input = this._inputs[id]
    if (input) {
        input.remove()
        delete this._inputs[id]
    }
};


//更新输入
Graphics._updateInputs = function () {
    for (var id in this._inputs) {
        this._updateInput(id)
    }
}


Graphics._getInput = function (id) {
    return this._inputs[id]
};



Graphics._updateInput = function (id) {
    var input = this._inputs[id]
    if (input) {
        var sz = input.sz
        if (sz) {
            var x = sz.x * this._realScale + (window.innerWidth - this._width * this._realScale) / 2
            var y = sz.y * this._realScale + (window.innerHeight - this._height * this._realScale) / 2
            var width = sz.width * this._realScale;
            var height = sz.height * this._realScale;
            var fontSize = sz.fontSize * this._realScale;
            input.style.position = 'absolute';
            input.style.margin = 'auto';
            input.style.top = y + 'px';
            input.style.left = x + 'px';
            input.style.width = width + 'px';
            input.style.height = height + 'px';
            input.style.fontSize = fontSize + 'px';
        }

    }
}



//防止默认
Input._onKeyDown = function (event) {
    //如果 需要避免默认 (键值) 
    if (document.activeElement.type == "text") {
        if (event.keyCode == 13 || event.keyCode == 27) {
        } else {
            return
        }
    } else {
        //需要避免默认
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