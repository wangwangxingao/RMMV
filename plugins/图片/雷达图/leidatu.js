

var ww = ww || {}

/**雷达图 */
ww.ldt = {}

/**弧度 */
ww.ldt.rad = Math.PI / 180

/**
 * 旋转.数据记录
 */
ww.ldt._rotate = {
    0: [1, 0],
    90: [0, 1],
    180: [-1, 0],
    270: [0, -1]
}

/**旋转
 * @param {number} a 角度  0-360
 * @returns {[number,number]}  [x坐标,y坐标]
 */
ww.ldt.rotate = function (a) {
    var a = (a % 360 + 360) % 360
    if (!ww.ldt._rotate[a]) {
        var a = a * ww.ldt.rad
        var x = Math.cos(a)
        var y = Math.sin(a)
        ww.ldt._rotate[a] = [x, y]
    }
    return ww.ldt._rotate[a]
}

/**反方向旋转
 * @param {number} a 角度  0-360
 * @returns {[number,number]}  [x坐标,y坐标]
 *
 * */
ww.ldt.rotate2 = function (a) {
    return ww.ldt.rotate(- a)
}


/**
 * 旋转圆形的储存
 */
ww.ldt._rotateCircle = {}

/**
 * 旋转圆形
 * 
 * @param {number} d 分割数量  >1 
 * @param {number} f 开始角度
 * @returns {[[number,number]]}  [x坐标,y坐标] 的列表
 */
ww.ldt.rotateCircle = function (d, f) {
    var f = f || 0
    var d = d || 1
    var z = d + "," + f
    if (!ww.ldt._rotateCircle[z]) {
        //角度间隔
        var da = 360 / d
        //角度列表
        var l = []
        for (var i = 0, a = f; i < d; i++ , a += da) {
            l.push(ww.ldt.rotate(a))
        }
        ww.ldt._rotateCircle[z] = l
    }
    return ww.ldt._rotateCircle[z]
}



/**
 * 旋转圆形位置
 * 
 * @param {number} d 分割数量  >1 
 * @param {number} f 开始角度
 * @param {number} c 长度
 * @param {number} dx 偏移位置x
 * @param {number} dy 偏移位置y
 * @returns {[[number,number]]}  [x坐标,y坐标] 的列表
 */
ww.ldt.ldtpos = function (d, f, c, dx, dy) {
    var dx = dx || 0
    var dy = dy || 0
    //旋转圆形的位置
    var l = ww.ldt.rotateCircle(d, f)
    //按比例扩大
    var list = []
    for (var i = 0; i < l.length; i++) {
        var p = l[i]
        var x = p[0] * c + dx
        var y = p[1] * c + dy
        list.push([x, y])
    }
    return list
}

/**
 * 制作雷达图绘制数组
 * 
 * 
 * @param {number} d 分割数量  >1 
 * @param {number} f 开始角度
 * @param {number} c 长度
 * @param {number} dx 偏移位置x
 * @param {number} dy 偏移位置y
 * @returns {[["moveTo"|"lineTo",number,number]]}  直接绘制可用的列表
 * 
 * 
 */
ww.ldt.makeLdtDraw = function (d, f, c, dx, dy) {
    var dx = dx || 0
    var dy = dy || 0
    //旋转圆形的位置
    var l = ww.ldt.rotateCircle(d, f)
    //按比例扩大
    var list = []
    for (var i = 0; i < l.length; i++) {
        var p = l[i]
        var x = p[0] * c + dx
        var y = p[1] * c + dy
        if (i) {
            list.push(["lineTo", x, y])
        } else {
            list.push(["moveTo", x, y])
        }
    }
    return list
}


/**
 * 绘制雷达图
 * @param {number} x  x坐标
 * @param {number} y  y坐标
 * @param {number} d  切分的个数
 * @param {number} f  初始角度
 * @param {number} c  雷达图大小
 * @param {number} w  雷达图宽度
 * @param {number} color  雷达图颜色
 * @param {number} type 是填充还是描边
 *  
 * 
 */

Bitmap.prototype.drawLDT = function (x, y, d, f, c,w , color,type) {

    var l = ww.ldt.ldtpos(d, f, c, x, y)


    var type = type ? "stroke" : "fill"
    //环境 = 环境
    var context = this._context;
    //环境 保存()
    context.save();


    context[type + 'Style'] = color;

    context.lineWidth = width
    context.beginPath();
    for (var i = 0; i < l.length; i++) {
        var p = l[i]
        var x = p[0]
        var y = p[1]
        if (i == 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y)
        }
    }
    context.closePath();
    context[type]();

    //环境 恢复()
    context.restore();
    //设置发生更改()
    this._setDirty();

}


