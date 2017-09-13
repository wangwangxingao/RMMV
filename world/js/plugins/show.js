Graphics._createAllElements = function() {
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
Graphics._updateAllElements = function() {
    this._updateRealScale();
    this._updateErrorPrinter();
    this._updateCanvas();
    this._updateVideo();
    this._updateUpperCanvas();
    this._updateRenderer();

    this._updateInputs(); //添加

    this._paintUpperCanvas();
};


//创建输入组
Graphics._createInputs = function() {
    this._inputs = {}
};


//返回
Graphics._input = function(id) {
    return this._inputs[id]
};


//移除输入
Graphics._removeInput = function(id) {
    if (this._inputs[id]) {
        this._inputs[id].remove()
    }
};

Graphics._removeInputs = function() {
    for (var i in this._inputs) {
        this._removeInput(this._inputs[i])
    }
};



//添加输入
Graphics._addInput = function(id, type, style, set) {
    this._removeInput(id)
    var input = document.createElement("input");
    input.id = id;
    input.setAttribute("type", type || "text")
    input.style.zIndex = 12;
    input.style.position = 'absolute';
    input.style.margin = 'auto';
    input.style.background = 'transparent'
    input.style.border = 10
    input.style.color = "#fff" //"#FFF"
    input.style["font-weight"] = "bold"
    this._setInput(input, set)
    this._setInputStyle(input, style)
    document.body.appendChild(input);
    return this._inputs[id] = input
};


Graphics._setInput = function(input, style) {
    if (input && style) {
        for (var i in style) {
            input[i] = style[i]
        }
    };
}


Graphics._setInputStyle = function(input, style) {
    if (input && style) {
        input._style = { x: 0, y: 0, width: 120, height: 20, fontSize: 18 }
        for (var i in style) {
            if (i in input._style) {
                input._style[i] = style[i]
            } else {
                input.style[i] = style[i]
            }
        }
        this._updateInput(input)
    };
}


Graphics._updateInputs = function() {
    for (var i in this._inputs) {
        this._updateInput(this._inputs[i])
    }
}

//更新输入
Graphics._updateInput = function(input) {
    if (input) {
        var s = input._style
        var x = s.x * this._realScale + (window.innerWidth - this._width * this._realScale) / 2
        var y = s.y * this._realScale + (window.innerHeight - this._height * this._realScale) / 2
        var width = s.width * this._realScale;
        var height = s.height * this._realScale;
        var fontSize = s.fontSize * this._realScale;
        input.style.top = y + 'px';
        input.style.left = x + 'px';
        input.style.width = width + 'px';
        input.style.height = height + 'px';
        input.style.fontSize = fontSize + 'px';
    }
}