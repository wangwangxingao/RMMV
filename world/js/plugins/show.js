Input._onKeyDown = function(event) {
    //如果 需要避免默认 (键值)
    var focusedElement = document.activeElement;
    if (focusedElement && focusedElement.type == "text") {
        if (event.keyCode != 13) {
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



Graphics._createAllElements = function() {
    this._createErrorPrinter();
    this._createCanvas();
    this._createVideo();
    this._createUpperCanvas();
    this._createRenderer();
    this._createFPSMeter();
    this._createModeBox();
    this._createGameFontLoader();

    this._createElements() //修改
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

    this._updateElements(); //添加

    this._paintUpperCanvas();
};


//创建输入组
Graphics._createElements = function() {
    this._elements = {}
};


//返回
Graphics._element = function(id) {
    return this._elements[id]
};


//移除输入
Graphics._removeElement = function(id) {
    if (this._elements[id]) {
        this._elements[id].remove()
    }
};

Graphics._removeElements = function() {
    for (var i in this._elements) {
        this._removeElement(this._elements[i])
    }
};


//添加输入
Graphics._inputAdd = function(id, type, style, set) {
    return this._elementAdd(id, "input", type || "text", style, set)
};

//添加输入
Graphics._elementAdd = function(id, ele, type, style, set) {
    return this._addElement(document.body, id, ele, type, style, set)
};

//添加输入
Graphics._addElement = function(body, id, ele, type, style, set) {
    this._removeElement(id)
    if (body) {
        var element = document.createElement(ele);
        element.id = id;
        element.setAttribute("type", type)
        element.style.zIndex = 12;
        element.style.position = 'absolute';
        element.style.margin = 'auto';
        element.style.background = 'transparent'
        element.style.border = 10
        element.style.color = "#fff" //"#FFF"
        element.style["font-weight"] = "bold"
        this._setElement(element, set)
        this._setElementStyle(element, style)
        body.appendChild(element);
        return this._elements[id] = element
    }
};



Graphics._setElement = function(element, style) {
    if (element && style) {
        for (var i in style) {
            element[i] = style[i]
        }
    };
}


Graphics._setElementStyle = function(element, style) {
    if (element && style) {
        element._style = { x: 0, y: 0, width: 120, height: 20, fontSize: 18 }
        for (var i in style) {
            if (i in element._style) {
                element._style[i] = style[i]
            } else {
                element.style[i] = style[i]
            }
        }
        this._updateElement(element)
    };
}

/**更新输入组 */
Graphics._updateElements = function() {
    for (var i in this._elements) {
        this._updateElement(this._elements[i])
    }
}

//更新输入
Graphics._updateElement = function(element) {
    if (element) {
        var s = element._style
        var x = s.x * this._realScale + (window.innerWidth - this._width * this._realScale) / 2
        var y = s.y * this._realScale + (window.innerHeight - this._height * this._realScale) / 2
        var width = s.width * this._realScale;
        var height = s.height * this._realScale;
        var fontSize = s.fontSize * this._realScale;
        element.style.top = y + 'px';
        element.style.left = x + 'px';
        element.style.width = width + 'px';
        element.style.height = height + 'px';
        element.style.fontSize = fontSize + 'px';
    }
}