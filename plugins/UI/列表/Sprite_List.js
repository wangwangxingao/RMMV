
/**
 * 数组去重
*/
Array.prototype.unique = function () {
    var re = []
    var l = this.splice(0)
    l.sort();
    var re = [l[0]];
    for (var i = 1; i < l.length; i++) {
        if (l[i] !== re[re.length - 1]) {
            re.push(l[i]);
        }
    }
    return re;
}

/**移除某元素 */
Array.prototype.remove = function (value) {
    var index = this.indexOf(value)
    while (index >= 0) {
        this.splice(index, 1)
        var index = this.indexOf(value)
    }
    return this
}




function Sprite_UIList() {
    this.initialize.apply(this, arguments);
}
Sprite_UIList.prototype = Object.create(Sprite.prototype);
Sprite_UIList.prototype.constructor = Sprite_UIList;



Sprite_UIList.prototype.initialize = function (w, h) {
    Sprite.prototype.initialize.call(this)
    this._index = 0
    this._showX = 0
    this._showY = 0
    this._showW = w || 0
    this._showH = h || 0
    this._objectsList = []
    this._objectsMap = {}
    this._objectsMapIn = {}
    this._showMapX = 0
    this._showMapY = 0
    // this._evalInMapIndex = []
};


Sprite_UIList.prototype.spriteInMapXYIndex = function (sprite) {
    if (sprite) {
        return this.inMapXYIndex(sprite.x, sprite.y, sprite.width, sprite.height)
    } else {
        return 0
    }
}

/**xywh数组 */
Sprite_UIList.prototype.xywhInMapXYIndex = function (xywh) {
    if (xywh) {
        return this.inMapXYIndex(xywh[0], xywh[1], xywh[2], xywh[3])
    } else {
        return 0
    }
}

/**在区域地图的xy索引 */
Sprite_UIList.prototype.inMapXYIndex = function (x, y, w, h) {
    if (this._showW != 0) {
        var xi1 = Math.floor(x / this._showW);
        if (w > 0) {
            var xi2 = Math.floor((x + w) / this._showW);
        } else {
            var xi2 = xi1;
        }
    } else {
        var xi1 = 0;
        var xi2 = xi1;
    }
    if (this._showH != 0) {
        var yi1 = Math.floor(y / this._showH);
        if (h > 0) {
            var yi2 = Math.floor((y + h) / this._showH);
        } else {
            var yi2 = yi1;
        }
    } else {
        var yi1 = 0;
        var yi2 = yi1;
    }
    //this._evalInMapIndex[0] = xi1;
    //this._evalInMapIndex[1] = yi1;
    //this._evalInMapIndex[2] = xi2-xi1;
    //this._evalInMapIndex[3] = yi2-yi1;
    return [xi1, yi1, xi2 - xi1, yi2 - yi1];
}


/**添加精灵到列表 */
Sprite_UIList.prototype.addSpriteToList = function (sprite, xywh) {
    if (sprite) {
        var index = this._objectsList.indexOf(sprite)
        if (index < 0) {
            var index = this._objectsList.index
            this._objectsList.push(sprite)
        }
        this.addSpriteToMap(index, sprite, xywh)

    }
}



/**添加精灵到区域地图 */
Sprite_UIList.prototype.addSpriteToMap = function (index, sprite, xywh) {
    if (sprite) {
        var l = this._objectsMapIn[index]
        if (l) {
            for (var i = 0; i < l.length; i++) {
                var n = l[i]
                var map = this._objectsMap[n]
                if (map) {
                    var id = map.indexOf(index)
                    while (id >= 0) {
                        map.splice(id, 1)
                        var id = map.indexOf(index) 
                    }
                }
            }
        } 
        if (xywh) {
            var mapindexs = this.xywhInMapXYIndex(xywh)
        } else {
            var mapindexs = this.spriteInMapXYIndex(sprite)
        }
        if (mapindexs) {
            var xi1 = mapindexs[0]
            var yi1 = mapindexs[1]
            var xi2 = mapindexs[2]
            var yi2 = mapindexs[3]
            for (var xi = xi1; xi <= xi2; xi++) {
                for (var yi = yi1; yi <= yi2; yi++) {


                }

            }
        } else {
            this.addToMap(0, index)
        }
    }
}

/**添加到区域地图 */
Sprite_UIList.prototype.addToMap = function (mapindex, index) {
    this._objectsMap[mapindex] = this._objectsMap[mapindex] || []
    this._objectsMapIn[index] = this._objectsMapIn[index] || []
    this._objectsMap[mapindex].push(index)
    this._objectsMap[index].push(mapindex)
}


