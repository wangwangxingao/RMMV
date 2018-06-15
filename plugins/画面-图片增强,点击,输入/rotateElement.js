
Graphics._getRotateSet = function (rotate) {
    var rotate = rotate ? "rotate(" + rotate + "deg)" : ""
    var set = {
        "-webkit-transform": rotate,
        "-moz-transform": rotate,
        "-ms-transform": rotate,
        "transform": rotate,
    }
    return set
}



Graphics._getRotateOriginSet = function (ox, oy) {
    var ox = ox ? "" + ox + "%" : "0"
    var oy = ox ? "" + oy + "%" : "0"
    var origin = ox + " " + oy
    var set = {
        "-webkit-transform-origin": origin,
        "-moz-transform-origin": origin,
        "-ms-transform-origin": origin,
        "transform-origin": origin,
    }
    return set
}



Graphics._rotateElement = function (id, rotate, ox, oy) {
    var rotateset = this._getRotateSet(rotate)
    var originset = this._getRotateOriginSet(ox, oy) 
    var element = this._getElement(id)
    this._setElementSet(element, rotateset, "style")
    this._setElementSet(element, originset, "style") 
}

