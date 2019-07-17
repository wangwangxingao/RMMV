//=============================================================================
// sprite_track.js
//=============================================================================

/*: 
 *
 * @name sprite_track 
 * @plugindesc 轨迹显示
 * @author 汪汪
 * @version 2.0
 * 
 * 
 * @param lineSet 
 * @desc  线段绘制设置
 * @default {"strokeStyle": "#f00","lineWidth": 5,"lineCap": "round"}
 * 
 * 
 * @param lineSet2 
 * @desc  线段处理后处理线段绘制设置
 * @default {"strokeStyle": "#00f","lineWidth": 3,"lineCap": "round"}
 * 
 * @help
 * 
 * 放在 p+.js 和  ww_track.js  插件后
 * 
 * 
 * 
 * 轨迹显示
 * 线段绘制设置
 * ww.track.lineSet = { strokeStyle: "#f00",lineWidth: 5,lineCap: "round"};
 * 线段处理后处理线段绘制设置
 * ww.track.lineSet2 = {strokeStyle: "#00f",lineWidth: 3,lineCap: "round"}; 
 * 设置轨迹的strokeStyle颜色,lineWidth宽度,
 * 
 * 
 * 
 * 如果添加阴影可以添加以下内容
 * shadowBlur: 20,
 * shadowColor: "black",
 * 
 * 轨迹的返回值
 * ww.track._reName
 * 
 * 轨迹的偏差值
 * ww.track._reScore 
 * 如果错误/没有结果为-1  如果是录入情况返回-2
 * 其他返回大于等于0的值 
 * 
 * 设置录入状态
 * ww.track.setAdd(name) 设置录入的名称 之后进行的轨迹处理视为录入轨迹
 * 此时返回的为 录入名称 , -2 
 * 名称为空时视为识别状态,
 * 在f8中会console.log  录入值的识别内容 , 方便判断录入效果
 * 
 * 设置识别状态
 * ww.track.setGet()  设置识别状态
 * 此时返回的为 识别名称 , -1/偏差值
 * 
 * 
 * 清空录入
 * ww.track.clear()
 * 
 * 删除上一条录入
 * ww.track.pop()
 * 
 * 保存录入成一个插件
 * ww.track.save()
 * 生成simpleHandwriting.js插件,此插件放在本插件后,可以读取之前录入的内容
 * 
 * 
 * 一个轨迹显示精灵
 * new Sprite_Track(width, height, eventid, type,  lineSet, showeval);
 * 参数说明  
 * weight height 精灵的长和宽 ,但只是绘制的区域,不是捕捉的区域,超出范围的部分也会视为轨迹,但只是不绘制
 * eventid  手绘轨迹结束后调用的事件,为0时不运行
 * type  捕捉的类型  0  左键一笔画,画完调用(并清除) , 1 左键一笔画,右键结束调用(不清除,再画清除),如果不右键,左键再画则为重画(之前的不进行调用)  2左键n笔画,右键结束调用(不清除,再画清除)
 * lineSet  线段设置 ,如果为0则使用  ww.track.lineSet  的值 
 * 
 * 
 * 测试
 * ww.track.test() 创建并添加到场景中
 * 创建的为 new Sprite_Track(1000, 1000, 4, 1, 0, 1); 
 * 
 * 
 * 
 * 
 */









var ww = ww || {};

ww.plugin = { find: function (n, l, p, m) { l = PluginManager._parameters; p = l[(n || "").toLowerCase()]; if (!p) { for (m in l) { if (l[m] && n in l[m]) { p = l[m] } } }; return p || {} }, parse: function (i) { try { return JSON.parse(i) } catch (e) { try { return eval(i) } catch (e2) { return i } } }, get: function (n, o, p) { o = o || {}; p = this.find(n); for (n in p) { o[n] = this.parse(p[n]) }; return o } };

ww.track = ww.track || {};
ww.track.lineSet = { strokeStyle: "#f00", lineWidth: 5, lineCap: "round" };
ww.track.lineSet2 = { strokeStyle: "#00f", lineWidth: 3, lineCap: "round" };
ww.track.stop = false;


/**轨迹绘制部分 */
;(function () {
    ww.track.drawSetStyle = function (context, style) {
        if (context && style && typeof (style) == "object") {
            for (var i in style) {
                context[i] = style[i]
            }
        }
    };
    ww.track.drawFun = function (bitmap, list) {

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
                ww.track.drawSetStyle(context, set)
            }
        }
        bitmap._setDirty()
    };

    /*
    ww.track.lineSet = {
        strokeStyle: "#f00",
        lineWidth: 5,
        lineCap: "round",
        //shadowBlur: 20,
        //shadowColor: "black",
    };

    ww.track.lineSet2 = {
        strokeStyle: "#00f",
        lineWidth: 3,
        lineCap: "round"
    };
    */
    ww.plugin.get("sprite_track", ww.track)
})();



/**
 * 
 * 精灵轨迹  
 * 
 * 
 */


;function Sprite_Track() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_Track.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Track.prototype.constructor = Sprite_Track;
/**初始化 */
Sprite_Track.prototype.initialize = function (w, h, id, type, lineSet, add) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(w, h)
    this._trackWidth = w
    this._trackHeight = h
    this._id = id || 0
    this._pointX = 0
    this._pointY = 0
    this._type = type
    this._lineSet = lineSet || ww.track.lineSet || {
        strokeStyle: "#f00",
        lineWidth: 5,
        lineCap: "round",
        //shadowBlur: 20,
        //shadowColor: "black"
    };
    this._isTouch = false
    this._canTouch = true

    this._touchId = 0

    this._char = new ww.track.char(w, h)

    this.createAdd(add)
};




Sprite_Track.prototype.createAdd = function (add) {
    if (add) {
        this._add = new Sprite_Track(this._trackWidth, this._trackHeight)
        this._add._canTouch = false
        this._add._lineSet = ww.track.lineSet2 || {
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



Sprite_Track.prototype.onEnd = function () {
    if(ww.track.stop){return}
    //track的计算
    ww.track.eval(this._char)
    this.drawAdd()
    //添加到轨迹
    this._result = ww.track.doPdollar(this._char)
    ww.track.onEnd(this._result)

    if (this._id) {
        if (!this._interpreter) {
            this._interpreter = new Game_Interpreter();
            this._interpreter.setup($dataCommonEvents[this._id] && $dataCommonEvents[this._id].list)
            this._interpreter.update()
        }
    }

}

Sprite_Track.prototype.drawAdd = function () {
    if (this._add) {
        this._add.clear()
        var tmpPoint = null
        var character = this._char.eval
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            var tmpPoint;
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
    this._touchId = 0
    this._char.clear()
    if (this._add) {
        this._add.clear()
    }
};


Sprite_Track.prototype.moveTo = function (x, y) {
    this._pointX = x
    this._pointY = y
    //console.log(x, y)

    this._char.addPoint(this._touchId, x, y)

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
        //"closePath",
        "stroke",
        "restore",
    ]
    ww.track.drawFun(this.bitmap, list)

};

Sprite_Track.prototype.setCanTouch = function (v) {
    this._canTouch = v
    if (v == false) {
        this._isTouch = false
    }
};



Sprite_Track.prototype.update = function () {
    Sprite.prototype.update.call(this)

    if (this.worldVisible && this._canTouch) {
        this.updateDraw()
    }

    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this._interpreter = null;
        }
        if (this._interpreter) {
            this._interpreter.update();
        }
    }
};

Sprite_Track.prototype.updateDraw = function () {
    if (TouchInput.isPressed() && !ww.track.stop) {
        if (TouchInput.isTriggered() || TouchInput.isMoved()) {
            if (this._end) {
                this._end = false
                this.clear()
            }
            if (!this._isTouch) {
                this._isTouch = true
                this._touchId++
                var xyv = this.xyToThis(TouchInput.x, TouchInput.y)
                this.moveTo(xyv[0], xyv[1])
            } else {
                var xyv = this.xyToThis(TouchInput.x, TouchInput.y)
                this.lineTo(xyv[0], xyv[1])
            }
        }
    } else {
        if (this._isTouch) {
            if (!this._type) {
                this.onEnd()
                this.clear()
            }
            if (this._type == 1) {
                this._end = true
            }
            //console.log(this.char())
            this._isTouch = false
        } else {
            if (this._type == 2 || this._type == 1) {
                if (TouchInput.isCancelled()) {
                    this.onEnd()
                    this._end = true
                }
            }
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









ww.track.test = function () {
    if (!ww.track._test) {
        s = new Sprite_Track(1000, 1000, 4, 1, 0, 1);
        SceneManager._scene.addChild(s)
        ww.track._test = s
        return s
    }
} 