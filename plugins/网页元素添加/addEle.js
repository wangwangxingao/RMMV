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
 * 网页动态添加元素
 *
 */




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


Graphics._createElements = function() {
    this._elements = {}
};

//创建输入
Graphics._createElement = function(id, type, set, set2) {
    this._removeElement(id)
    this._elements[id] = document.createElement(type);
    this._elements[id].id = id;
    if (set) {
        this._setElement(id, set)
    }
    this._elements[id].style.zIndex = 112;
    if (set2) {
        this._setElement(id, set, "style")
    }
    document.body.appendChild(this._elements[id]);
    return this._elements[id]
};


Graphics._setElement = function(id, set, type) {
    var element = this._elements[id]
    if (element && set) {
        var sz = element
        if (type) {
            sz = element[type]
        }
        if (sz) {
            for (var i in set) {
                sz[i] = set[i]
            }
        }
    }
    this._updateElement(id)
    return this._elements[id]
}


//是添加元素
Graphics._isElement = function(element) {
    if (element && this._elements[element.id] == element) {
        return true
    } else {
        return false
    }
};

//移除输入
Graphics._removeElement = function(id) {
    var element = this._elements[id]
    if (element) {
        element.remove()
        delete this._elements[id]
    }
};


//更新输入
Graphics._updateElements = function() {
    for (var id in this._elements) {
        this._updateElement(id)
    }
}


Graphics._getElement = function(id) {
    return this._elements[id]
};



Graphics._updateElement = function(id) {
    var element = this._elements[id]
    if (element) {
        var sz = element.sz
        if (sz) {
            var x = sz.x * this._realScale + (window.innerWidth - this._width * this._realScale) / 2
            var y = sz.y * this._realScale + (window.innerHeight - this._height * this._realScale) / 2
            var width = sz.width * this._realScale;
            var height = sz.height * this._realScale;
            var fontSize = sz.fontSize * this._realScale;
            element.style.position = 'absolute';
            element.style.margin = 'auto';
            element.style.top = y + 'px';
            element.style.left = x + 'px';
            element.style.width = width + 'px';
            element.style.height = height + 'px';
            element.style.fontSize = fontSize + 'px';
        }
    }
}



//防止默认
Input._onKeyDown = function(event) {
    //如果 需要避免默认 (键值) 
    if (Graphics._isElement(document.activeElement)) {
        if (event.keyCode == 13 || event.keyCode == 27) {} else {
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




ww_ElE = {
    "button": {},
    "checkbox": {},
    "date": {},
    "datetime": {},
    "datetime-local": {},
    "email": {},
    "file": {},
    "hidden": {},
    "image": {},
    "month": {},
    "number": {},
    "password": {},
    "radio": {},
    "range": {},
    "reset": {},
    "submit": {},
    "text": {},
    "time": {},
    "url": {},
    "week": {}
}