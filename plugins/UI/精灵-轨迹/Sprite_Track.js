var ww = ww || {}

ww.draw = {}





ww.draw.drawSetStyle = function (context, style) {
    if (context && style && typeof (style) == "object") {
        for (var i in style) {
            context[i] = style[i]
        }
    }
}
ww.draw.drawFun = function (bitmap, list) {

    //环境 = 环境 
    if (bitmap && (bitmap instanceof Bitmap)) {
        context = bitmap._context
    } else {
        return
    }
    //环境 保存()
    //context.save(); 
    for (var i = 0; i < list.length; i++) {
        var set = list[i]
        if (Array.isArray(set)) {
            var n = set[0]
            var p = set.slice(1)
            if (typeof (context[n]) == "function") {
                context[n].apply(context, p)
            } else {
                context[n] = p[0]
            }
        } else if (typeof (set) == "string") {
            if (typeof (context[set]) == "function") {
                context[set]()
            }
        } else {
            ww.draw.drawSetStyle(context, set)
        }
    }
    bitmap._setDirty()
}


Bitmap.prototype.drawFun = function (list) {
    ww.draw.drawFun(this, list)
}

/**
 * 
 * 精灵轨迹  
 * 
 * 
 */


function Sprite_Track() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_Track.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Track.prototype.constructor = Sprite_Track;
/**初始化 */
Sprite_Track.prototype.initialize = function (w, h, add) {
    Sprite.prototype.initialize.call(this);
    this.resizeBitmap(w, h)
    this._pointX = 0
    this._pointY = 0
    this._lineSet = {
        strokeStyle: "#f00",
        lineWidth: 5,
        lineCap: "round",
        //shadowBlur: 20,
        // shadowColor: "black"
    };
    this._isTouch = false
    this._canTouch = true

    this._strokeId = 0

    this._char = new ww.track.char()

    if (!add) {
        this._add = new Sprite_Track(w, h, true)
        this._add._canTouch = false
        this._add._lineSet = {
            strokeStyle: "#00f",
            lineWidth: 3,
            lineCap: "round",
            //shadowBlur: 20,
            // shadowColor: "black"
        };
        this.addChild(this._add)
    }
};



Sprite_Track.prototype.resizeBitmap = function (w, h) {
    this.bitmap = new Bitmap(w, h)
};


Sprite_Track.prototype.setLineSet = function (set) {
    this._lineSet = set
};


Sprite_Track.prototype.char = function () {
    ww.track.eval(this._char)
    this.drawAdd()
    return this._char
};

Sprite_Track.prototype.drawAdd = function () {
    if (this._add) {
        this._add.clear()
        var character = this._char.eval
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            var tmpPoint = 0;
            for (var j = 0; j < stroke.length; j++) {
                if (tmpPoint) {
                    tmpPoint = stroke[j];
                    this._add.lineTo(tmpPoint.x, tmpPoint.y)
                } else {
                    tmpPoint = stroke[j];
                    this._add.moveTo(tmpPoint.x, tmpPoint.y)
                }
            }
        }
    }

}


Sprite_Track.prototype.clear = function () {
    this.bitmap.clear()
    this._strokeId = 0
    this._char.clear()
    if (this._add) {
        this._add.clear()
    }
};


Sprite_Track.prototype.moveTo = function (x, y) {
    this._pointX = x
    this._pointY = y
    //console.log(x, y)
    this._char.addPoint(this._strokeId, x, y)
};


Sprite_Track.prototype.lineTo = function (x, y) {
    var x0 = this._pointX
    var y0 = this._pointY
    this.drawLine(x0, y0, x, y, this._lineSet)
    this.moveTo(x, y)

};

Sprite_Track.prototype.drawLine = function (x, y, x2, y2, line) {
    var list = [
        "save",
        "beginPath",
        ["moveTo", x, y],
        ["lineTo", x2, y2],
        line,
        "stroke",
        "restore",
    ]
    ww.draw.drawFun(this.bitmap, list)

};

Sprite_Track.prototype.setCanTouch = function (v) {
    this._canTouch = v
    if (v == false) {
        this._isTouch = false
    }
};



Sprite_Track.prototype.update = function () {
    Sprite.prototype.update.call(this)

    if (this.visible && this._canTouch) {
        this.updateDraw()
    }
};

Sprite_Track.prototype.updateDraw = function () {
    if (TouchInput.isPressed()) {
        if (TouchInput.isTriggered() || TouchInput.isMoved()) {
            if (!this._isTouch) {
                this._isTouch = true
                this._strokeId++
                var xyv = this.xyToThis(TouchInput.x, TouchInput.y)
                this.moveTo(xyv[0], xyv[1])
            } else {
                var xyv = this.xyToThis(TouchInput.x, TouchInput.y)
                this.lineTo(xyv[0], xyv[1])
            }
        }
    } else {
        if (this._isTouch) {
            console.log(this.char())
            this._isTouch = false
        }
    }
};



Sprite_Track.prototype.xyToThis = function (x, y) {

    var node = this;

    var loc = node.worldTransform.applyInverse({ x: x, y: y }, { visible: node.worldVisible });

    var x = loc.x
    var y = loc.y
    var v = loc.visible

    if (this.anchor) {
        var x = x + this.anchor.x * this.width
        var y = y + this.anchor.y * this.height
    }
    if (this._realFrame) {
        var x = x + this._realFrame.x
        var y = y + this._realFrame.y
    }
    return [x, y, v]

};




/**
 * 手写轨迹
 * 
 * 
 * 参考内容:
 * Technology-手写汉字识别 
 * http://www.linyibin.cn/2016/11/10/technology-IME-HandWritingRecognization/
 *  
 * 
*/

var ww = ww || {}


ww.track = (function () {

    var MAXFLOAT = Infinity
    var MAX_DIFF_PER_STROKE = 35

    var MaxValue = 1000
    function getMax() {
        return MaxValue
    }

    function setMax(v) {
        return MaxValue = v
    }

    var MaxDirValue = Math.PI / 180 * 20
    function getDirMax() {
        return MaxDirValue
    }

    function setDirMax(v) {
        return MaxDirValue = v
    }

    /**
     * 
     * @param {Point} lastPoint  
     * @param {Point} startPoint 
     */
    function dir(lastPoint, startPoint) {
        var result = Math.atan2(startPoint.y - lastPoint.y, startPoint.x - lastPoint.x) * 10;
        return result;
    }


    function xydist(lastPoint, startPoint) {
        var result = Math.abs(startPoint.x - lastPoint.x) + Math.abs(startPoint.y - lastPoint.y);
        return result;
    }

    function distance(lastPoint, startPoint) {
        var x = startPoint.x - lastPoint.x
        var y = startPoint.y - lastPoint.y
        return x * x + y * y
    }

    /**
     * 
     * @param {Character} character 
     */
    function evalDir(character) {
        var lastPoint = 0
        var tmpPoint;
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            for (var j = 0; j < stroke.length; j++) {
                tmpPoint = stroke[j];
                tmpPoint.dir = (lastPoint) ? dir(lastPoint, tmpPoint) : 0;
                lastPoint = tmpPoint;
            }
        }
    };

    /**
     * 计算的长度
     * @param {Character} character 
     */
    function evalDist(character) {
        var lastPoint = 0
        var tmpPoint;
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            for (var j = 0; j < stroke.length; j++) {
                tmpPoint = stroke[j];
                tmpPoint.dist = lastPoint ? distance(lastPoint, tmpPoint) : 0;
                lastPoint = tmpPoint;
            }
        }
    };



    /**
     * 全部轨迹跨度
     * @param {Character} character  
     */
    function characterSize(character) {
        var maxx = 0
        var minx = 0
        var maxy = 0
        var miny = 0
        var startpoint = 0
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            for (var i2 = 0; i2 < stroke.length; i2++) {
                var point = stroke[i2];
                if (point) {
                    if (!startpoint) {
                        var maxx = point.x
                        var minx = point.x
                        var maxy = point.y
                        var miny = point.y
                        var startpoint = point
                    } else {
                        var x = point.x
                        var y = point.y
                        if (x > maxx) { maxx = x } else if (x < minx) { minx = x }
                        if (y > maxy) { maxy = y } else if (y < miny) { miny = y }
                    }
                }
            }
        }

        var z = Math.max(maxx - minx, maxy - miny)
        return z
    }



    /**
     * 单个轨迹跨度
     * @param {Stroke} stroke   
     */
    function strokeSize(stroke) {
        var maxx = 0
        var minx = 0
        var maxy = 0
        var miny = 0
        var startpoint = 0
        var maxdist = 0
        var index = -1
        for (var i2 = 0; i2 < stroke.length; i2++) {
            var point = stroke[i2];
            if (point) {
                if (!startpoint) {
                    var maxx = point.x
                    var minx = point.x
                    var maxy = point.y
                    var miny = point.y
                    var startpoint = point
                } else {
                    var dist = xydist(point, startpoint)
                    if (dist > maxdist) {
                        maxdist = dist
                        index = i2
                    }
                    var x = point.x
                    var y = point.y
                    if (x > maxx) { maxx = x } else if (x < minx) { minx = x }
                    if (y > maxy) { maxy = y } else if (y < miny) { miny = y }
                }
            }
        }
        var z = Math.max(maxx - minx, maxy - miny)
        return [z, index]
    }


    /**
     * 跳转点
     * @param {Stroke} stroke  轨迹
     * @param {[]} points 输出数组
     * @param {number} pointIndex1 开始索引
     * @param {number} pointIndex2 结束索引
     * @param {number} size 轨迹大小
     */
    function turnPoints(stroke, points, pointIndex1, pointIndex2, size) {
        if (pointIndex1 < 0 || pointIndex2 <= 0 || pointIndex1 >= pointIndex2 - 1) {
            return;
        }
        var a = stroke[pointIndex2].x - stroke[pointIndex1].x;
        var b = stroke[pointIndex2].y - stroke[pointIndex1].y;
        var c = stroke[pointIndex1].x * stroke[pointIndex2].y - stroke[pointIndex2].x * stroke[pointIndex1].y;
        var max = getMax() * size;
        var maxDistPointIndex = -1;
        console.log(max)
        for (var i = pointIndex1 + 1; i < pointIndex2; i++) {
            var point = stroke[i];
            var dist = Math.abs((a * point.y) - (b * point.x) + c);
            console.log(dist)
            if (dist > max) {
                max = dist;
                maxDistPointIndex = i;
            }
        }
        if (maxDistPointIndex != -1) {
            turnPoints(stroke, points, pointIndex1, maxDistPointIndex, size);
            points.push(stroke[maxDistPointIndex]);
            turnPoints(stroke, points, maxDistPointIndex, pointIndex2, size);
        }
    }

    function turnPoints2(stroke, points, pointIndex1, pointIndex2, size) {
        if (pointIndex1 < 0 || pointIndex2 <= 0 || pointIndex1 >= pointIndex2 - 1) {
            return;
        }
        var a = stroke[pointIndex1];
        var b = stroke[pointIndex2];

        var dist = xydist(a, b)
        var max = dist;
        var maxDistPointIndex = -1;
        for (var i = pointIndex1 + 1; i < pointIndex2; i++) {
            var c = stroke[i];
            var dist = xydist(a, c);
            if (dist > max) {
                max = dist;
                maxDistPointIndex = i;
            }
        }
        if (maxDistPointIndex != -1) {
            turnPoints(stroke, points, pointIndex1, maxDistPointIndex, size);
            points.push(stroke[maxDistPointIndex]);
            turnPoints(stroke, points, maxDistPointIndex, pointIndex2, size);
        }
    }



    /**
     *  获取跳转点
     * @param {Character} character 
     */
    function getTurnPoints(character) {
        var c = new Character()
        var size = characterSize(character)
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            //获取结果缓存
            if (character.evals[i]) {
                c.strokes.push(character.evals[i]);
            } else if (stroke.length > 1) {
                var stroke2 = [];
                var size = strokeSize(stroke)
                var index = size[1]
                var size = (size[0] * size[0]) * 0.0001

                stroke2.push(stroke[0]);
                if (index > 0 && index != stroke2.length - 1) {
                    turnPoints(stroke, stroke2, 0, index, size);
                    stroke2.push(stroke[index]);
                } else {
                    index = 0
                }
                turnPoints(stroke, stroke2, index, stroke.length - 1, size);
                stroke2.push(stroke[stroke.length - 1]);

                character.evals[i] = stroke2

                c.strokes.push(stroke2);
                console.log(i, stroke2.length)
            }
        }
        //console.log(charccter);
        return c
    }


    /**
     * 计算
     * @param {Character} character 
     * 
     */
    function evalCharacter(character) {
        if (!character.eval) {
            character.eval = getTurnPoints(character)
            evalDir(character.eval)
            evalDist(character.eval)
        }
        return character.eval
    }

    /**
     * 
     * @param {Stroke} stroke1 
     * @param {Stroke} stroke2 
     */
    function distBetweenStrokes(stroke1, stroke2) {
        var strokeDist = MAXFLOAT;
        var dist = 0// 0.0f;
        var minLength = Math.min(stroke1.length, stroke2.length);
        var largeStroke = stroke1.length > minLength ? stroke1 : stroke2;
        var smallStroke = stroke1.length > minLength ? stroke2 : stroke1;
        for (var j = 1; j < minLength; j++) {
            var diretion1 = largeStroke[j].dir;
            var diretion2 = smallStroke[j].dir;

            dist += Math.abs(diretion1 - diretion2);
        }
        // 当前笔与上一笔的largeStroke位置
        dist += Math.abs(largeStroke[0].dir - smallStroke[0].dir);
        strokeDist = dist / minLength;
        //std:: cout << strokeDist << std:: endl;
        return strokeDist;
    }


    var allMax = 0, allMin = MAXFLOAT;
    /**
     *  
     * @param {Character} c1  
     * @param {Character} c2 
     */
    function chardist(c1, c2) {
        var character1 = evalCharacter(c1)
        var character2 = evalCharacter(c2)
        var dist = MAXFLOAT;
        if (character2.strokes.length >= character1.strokes.length && character2.strokes.length <= character1.strokes.length + 2) {
            var allStrokeDist = 0.0;
            for (var i = 0; i < character1.strokes.length; i++) {
                var stroke1 = character1.strokes[i];
                var stroke2 = character2.strokes[i];
                var strokeDist = distBetweenStrokes(stroke1, stroke2);

                //笔画距离  > 全部最大
                if (strokeDist > allMax) {
                    allMax = strokeDist;
                }
                if (strokeDist < allMin) {
                    allMin = strokeDist;
                }

                allStrokeDist += strokeDist;

                if (strokeDist > MAX_DIFF_PER_STROKE) {
                    allStrokeDist = MAXFLOAT;
                    return allStrokeDist;
                }
            }
            // 笔画更接近的优先级更高
            return allStrokeDist / character1.strokes.length + character2.strokes.length - character1.strokes.length;
        }
        return dist;
    }




    function Character() {
        this.clear();
    };


    Character.prototype.clear = function () {
        this.lastStrokeId = -1;
        this.strokes = [];
        this.eval = false
        this.evals = []
    }



    /**
     * 添加点
     */
    Character.prototype.addPoint = function (strokeId, x, y) {
        if (strokeId < 0) {
            return false;
        }
        if (strokeId != this.lastStrokeId) {
            this.lastStrokeId = strokeId;
            var stroke = [];
            this.strokes.push(stroke);
        }
        var x = x || 0
        var y = y || 0
        var id = this.strokes.length - 1
        this.strokes[id].push({ x: x, y: y });
        this.evals[id] = false
        this.eval = false
        return this
    };

    Character.prototype.setDirectionList = function (list) {
        this.clear()

        for (var i = 0; i < list.length; i++) {
            var l2 = list[i]
            if (l2) {
                var stroke = [];
                this.strokes.push(stroke);
                for (var i2 = 0; i2 < l2.length; i2++) {
                    stroke.push({ dir: l2[i2] });
                }
                this.evals[this.strokes.length - 1] = stroke
            }
        }
        this.eval = this
        return this
    }

    Character.prototype.setPointList = function (list) {
        this.clear()
        for (var i = 0; i < list.length; i++) {
            var l2 = list[i]
            if (l2) {
                var stroke = [];
                this.strokes.push(stroke);
                for (var i2 = 0; i2 < l2.length; i2++) {
                    if (l2[i2]) {
                        if (Array.isArray(l2[i2])) {
                            var x = l2[i2][0]
                            var y = l2[i2][1]
                        } else {
                            var x = l2[i2].x
                            var y = l2[i2].y
                        }
                        var x = x || 0
                        var y = y || 0
                        stroke.push({ x: x, y: y });
                    }
                }
            }
        }
        this.eval = false
        return this
    }


    Character.prototype.clone = function () {
        var c = new Character()
        c.formPoints(this.strokes)
        return c
    }

    Character.prototype.evalthis = function () {
        evalCharacter(this)
    }

    function formPoints(list) {
        var c = new Character()
        c.setPointList(list)
        evalCharacter(c)
        return c
    }


    function formDirs(list) {
        var c = new Character()
        c.setDirectionList(list)
        return c
    }

    return {
        eval: evalCharacter,
        char: Character,
        chardist: chardist,
        formPoints: formPoints,
        formDirs: formDirs,
        setMax: setMax,
        getMax: getMax
    }
})();



ww.track.test = function () {


    if (!ww.track._test) {
        s = new Sprite_Track(620, 350);
        SceneManager._scene.addChild(s)
        ww.track._test = s
        return s
    }

}

ww.track.clear = function () {


    ww.track.test()

    ww.track._test.clear()


}

ww.track.test()