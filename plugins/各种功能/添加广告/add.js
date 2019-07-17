var Graphics_createAllElements = Graphics._createAllElements

Graphics._createAllElements = function () {
    Graphics_createAllElements.call(this);
    Graphics._createUpperIframe()
};


Graphics._createUpperIframe = function () {



    this._upperiframe = document.createElement('iframe');
    this._upperiframe.id = 'UpperIframe';
    this._upperiframe.src = "https://v.qq.com/cartoon"

    this._upperC = document.createElement('input');
    this._upperC.type = 'button';
    this._upperC.onclick = function () {
        Graphics._setUpperIframeHidden(true)
    }
    this._upperC.value = "关闭"
    this._updateUpperIframe();
    document.body.appendChild(this._upperiframe);
    document.body.appendChild(this._upperC);
};
var Graphics_updateAllElements = Graphics._updateAllElements
Graphics._updateAllElements = function () {
    Graphics_updateAllElements.call(this);
    this._updateUpperIframe();
};

/**更新上层画布
 * @static
 * @method _updateUpperCanvas
 * @private
 */
Graphics._updateUpperIframe = function () {
    this._upperiframe.style.zIndex = 99;
    this._upperC.style.zIndex = 100;


    this._upperiframe.set = {
        x:0,y:0,w:1,h:0.5
    } 
    this._upperC.set = {
        x:0,y:0.5,w:1,h:0.05
    }
    this._centerUpperElement(this._upperiframe);
    this._centerUpperElement(this._upperC);
};

Graphics._setUpperIframeHidden = function (v) {
    var v = v === undefined ? true : v
    Graphics._upperiframe.hidden = v
    Graphics._upperC.hidden = v
};

Graphics._setUpperIframe = function (name, set) {
    this._upperiframe[name] = set
};

Graphics._centerUpperElementPos = function (v, vt, vz) {

    var v = v || 0
    var vt = vt || 0
    var vz = vz || 0
    switch (vt) {
        case 2:
            v = v
            break;
        case 1:
            v = v * this._realScale + "px"
            break;
        default:
            v = vz * v * this._realScale + "px"
            break;
    }
    return v
}
Graphics._centerUpperElement = function (element) {
    if (element.set) {
        var set = element.set

        var width = this._centerUpperElementPos(
            set.w, set.wt, this._width
        )
        var height = this._centerUpperElementPos(
            set.h, set.ht, this._height
        )
        var x = this._centerUpperElementPos(
            set.x, set.xt, this._width
        )
        var y = this._centerUpperElementPos(
            set.y, set.yt, this._height
        ) 
        element.style.position = 'fixed';
        //element.style.margin = 'auto';
        element.style["margin-left"] = 'auto';
        element.style["margin-right"] = 'auto';
        element.style.top = y;
        element.style.left = x;
        element.style.right = 0;
        element.style.bottom = 0;
        element.style.width = width;
        element.style.height = height;
    }
};
