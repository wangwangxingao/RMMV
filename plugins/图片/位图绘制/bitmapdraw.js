var ww = ww || {}


ww.draw = {}

/**
 * 设置参数
 * @param {*} context 
 * @param {*} i 
 * @param {*} p 
 */
ww.draw.drawSetStyle = function (context, i, p) {
    if (!context || !i || !p) {
        return
    }
    if ((i == "fillStyle" || i == "strokeStyle") ||
        Array.isArray(p)) {
        switch (p[0]) {
            case "l":
            case "createLinearGradient":
                var canvasGradient = context.createLinearGradient(p[1], p[2], p[3], p[4]);
                for (var pi = 5; pi < p.length; pi += 2) {
                    canvasGradient.addColorStop(p[pi], p[pi + 1]);
                }
                context[n] = canvasGradient
                break;
            case "r":
            case "createRadialGradient":
                var canvasGradient = context.createRadialGradient(p[1], p[2], p[3], p[4], p[5]);
                for (var pi = 6; pi < p.length; pi += 2) {
                    canvasGradient.addColorStop(p[pi], p[pi + 1]);
                }
                context[n] = canvasGradient
                break;

            default:
                context[n] = p[0]
                break;
        }
    } else {
        context[i] = p
    }
}
/**设置
 * 
 */
ww.draw.drawSet = function (context, style) {
    if (context && style && typeof (style) == "object") {
        for (var i in style) {
            ww.draw.drawSetStyle(context, i, style[i])
        }
    }
}

/**
 * 方法名,
 * [方法名,参数...],
 * [变量名,参数],
 * {变量名:参数},
 * 
 * 
 */
ww.draw.drawFun = function (bitmap, list) {
    //环境 = 环境
    if (!bitmap) {
        return
    }
    if (bitmap instanceof Bitmap) {
        var context = bitmap._context
    } else {
        return
    }
    //环境 保存()
    //context.save(); 
    for (var i = 0; i < list.length; i++) {
        var set = list[i]
        if (!set) {} else if (Array.isArray(set)) {
            var n = set[0]
            var p = set.slice(1)
            if (typeof (context[n]) == "function") {
                context[n].apply(context, p)
            } else {
                ww.draw.drawSetStyle(context, n, p)
            }
        } else if (typeof (set) == "string") {
            if (typeof (context[set]) == "function") {
                context[set]()
            }
        } else {
            ww.draw.drawSet(context, set)
        }
    }
    bitmap._setDirty()
}

/**
 * 绘制方法
 * @param {*} list 
 */
Bitmap.prototype.drawFun = function (list) {
    ww.draw.drawFun(this, list)
}

/**
 * 绘制线
 * @param {*} x 初始点 x坐标
 * @param {*} y 初始点 y坐标
 * @param {*} x2 结束点 设置 
 * @param {*} y2 结束点 设置
 * @param {*} line 线的设置
 */
Bitmap.prototype.drawLine = function (x, y, x2, y2, line) {
    var list = [
        "save",
        line,
        //"beginPath", 
        ["moveTo", x, y],
        ["lineTo", x2, y2],
        //"closePath",
        "restore",
    ]
    this.drawFun(list)
}



/**绘制扇形
 * @param {*} x x坐标
 * @param {*} y y坐标
 * @param {*} r 半径
 * @param {*} start 开始角度
 * @param {*} end 结束角度
 * @param {*} color 颜色
 * @param {*} t 是否过原点
 */

Bitmap.prototype.drawCircleSE = function (x, y, r, start, end, color, t) {
    var type = type == "stroke" || type == "fill" ? type : type ? "fill" : "stroke"
    var unit = Math.PI / 180;
    var start = start || 0
    var end = end === undefined ? 360 : (end || 0)
    var list = [
        "save",
        [type + "Style", color],
        "beginPath",
        !t ? ["moveTo", x, y] : 0,
        ["arc", x, y, r, start * unit, end * unit],
        !t ? ["moveTo", x, y] : 0,
        !t ? "closePath" : "",
        type,
        "restore",
    ]
    this.drawFun(list)

}




/**绘制圆角矩形
 * 
 * @param {*} x x位置
 * @param {*} y y位置
 * @param {*} width 宽
 * @param {*} height 高
 * @param {*} radius 圆角半径
 * @param {*} color 颜色
 * @param {"stroke"|"fill"} type 类型
 * @param {boolean} j0 左上角 是否直角
 * @param {boolean} j1 左下角 是否直角
 * @param {boolean} j2 右下角 是否直角
 * @param {boolean} j3 右上角 是否直角
 */
Bitmap.prototype.drawRoundedRectangle = function (x, y, width, height, radius, color, type, j0, j1, j2, j3) {


    var type = type == "stroke" || type == "fill" ? type : type ? "fill" : "stroke"

    var list = [
        "save",
        [type + "Style", color],
        "beginPath",
    ]

    //往下
    list.push(["moveTo", x, y + radius])
    list.push(["lineTo", x, y + height - radius])

    if (j1) {
        list.push(["lineTo", x, y + height])
        list.push(["lineTo", x + radius, y + height])
    } else {
        list.push(["quadraticCurveTo", x, y + height, x + radius, y + height])
    }
    //往右
    list.push(["lineTo", x + width - radius, y + height])
    //角2处理 
    if (j2) {
        list.push(["lineTo", x + width, y + height])
        list.push(["lineTo", x + width, y + height - radius])
    } else {
        list.push(["quadraticCurveTo", x + width, y + height, x + width, y + height - radius])
    }
    //往上
    list.push(["lineTo", x + width, y + radius])
    //角3处理  
    if (j3) {
        list.push(["lineTo", x + width, y])
        list.push(["lineTo", x + width - radius, y])
    } else {
        list.push(["quadraticCurveTo", x + width, y, x + width - radius, y + height])
    }
    //往左
    list.push(["lineTo", x + radius, y])
    //角0处理 
    if (j0) {
        list.push(["lineTo", x, y])
        list.push(["lineTo", x, y + radius])
    } else {
        list.push(["quadraticCurveTo", x, y, x, y + radius])
    }
    list.push("closePath", type, "restore")
    this.drawFun(list)
}




Bitmap.prototype.fillCircle = function (color, s, e) {
    var x = this.width * 0.5
    var y = this.height * 0.5
    this.drawCircleSE(x, y, Math.min(x, y), s, e, color);
};

Bitmap.prototype.fillRoundedRectangle = function (color, line, type, j0, j1, j2, j3) {
    var r = Math.min(this.width * 0.1, this.height * 0.1)
    this.drawRoundedRectangle(0, 0, this.width, this.height, r, color, line, type, j0, j1, j2, j3);
}




/**
描述

HTML5 <canvas> 标签用于绘制图像（通过脚本，通常是 JavaScript）。

不过，<canvas> 元素本身并没有绘制能力（它仅仅是图形的容器） - 您必须使用脚本来完成实际的绘图任务。

getContext() 方法可返回一个对象，该对象提供了用于在画布上绘图的方法和属性。

本手册提供完整的 getContext("2d") 对象属性和方法，可用于在画布上绘制文本、线条、矩形、圆形等等。
浏览器支持

Internet Explorer 9、Firefox、Opera、Chrome 以及 Safari 支持 <canvas> 及其属性和方法。

注释：Internet Explorer 8 以及更早的版本不支持 <canvas> 元素。
颜色、样式和阴影
属性 	描述
fillStyle 	设置或返回用于填充绘画的颜色、渐变或模式
strokeStyle 	设置或返回用于笔触的颜色、渐变或模式
shadowColor 	设置或返回用于阴影的颜色
shadowBlur 	设置或返回用于阴影的模糊级别
shadowOffsetX 	设置或返回阴影距形状的水平距离
shadowOffsetY 	设置或返回阴影距形状的垂直距离
方法 	描述
createLinearGradient() 	创建线性渐变（用在画布内容上）
createPattern() 	在指定的方向上重复指定的元素
createRadialGradient() 	创建放射状/环形的渐变（用在画布内容上）
addColorStop() 	规定渐变对象中的颜色和停止位置
线条样式
属性 	描述
lineCap 	设置或返回线条的结束端点样式
lineJoin 	设置或返回两条线相交时，所创建的拐角类型
lineWidth 	设置或返回当前的线条宽度
miterLimit 	设置或返回最大斜接长度
矩形
方法 	描述
rect() 	创建矩形
fillRect() 	绘制“被填充”的矩形
strokeRect() 	绘制矩形（无填充）
clearRect() 	在给定的矩形内清除指定的像素
路径
方法 	描述
fill() 	填充当前绘图（路径）
stroke() 	绘制已定义的路径
beginPath() 	起始一条路径，或重置当前路径
moveTo() 	把路径移动到画布中的指定点，不创建线条
closePath() 	创建从当前点回到起始点的路径
lineTo() 	添加一个新点，然后在画布中创建从该点到最后指定点的线条
clip() 	从原始画布剪切任意形状和尺寸的区域
quadraticCurveTo() 	创建二次贝塞尔曲线
bezierCurveTo() 	创建三次方贝塞尔曲线
arc() 	创建弧/曲线（用于创建圆形或部分圆）
arcTo() 	创建两切线之间的弧/曲线
isPointInPath() 	如果指定的点位于当前路径中，则返回 true，否则返回 false
转换
方法 	描述
scale() 	缩放当前绘图至更大或更小
rotate() 	旋转当前绘图
translate() 	重新映射画布上的 (0,0) 位置
transform() 	替换绘图的当前转换矩阵
setTransform() 	将当前转换重置为单位矩阵。然后运行 transform()
文本
属性 	描述
font 	设置或返回文本内容的当前字体属性
textAlign 	设置或返回文本内容的当前对齐方式
textBaseline 	设置或返回在绘制文本时使用的当前文本基线
方法 	描述
fillText() 	在画布上绘制“被填充的”文本
strokeText() 	在画布上绘制文本（无填充）
measureText() 	返回包含指定文本宽度的对象
图像绘制
方法 	描述
drawImage() 	向画布上绘制图像、画布或视频
像素操作
属性 	描述
width 	返回 ImageData 对象的宽度
height 	返回 ImageData 对象的高度
data 	返回一个对象，其包含指定的 ImageData 对象的图像数据
方法 	描述
createImageData() 	创建新的、空白的 ImageData 对象
getImageData() 	返回 ImageData 对象，该对象为画布上指定的矩形复制像素数据
putImageData() 	把图像数据（从指定的 ImageData 对象）放回画布上
合成
属性 	描述
globalAlpha 	设置或返回绘图的当前 alpha 或透明值
globalCompositeOperation 	设置或返回新图像如何绘制到已有的图像上
其他
方法 	描述
save() 	保存当前环境的状态
restore() 	返回之前保存过的路径状态和属性
createEvent()
getContext()
toDataURL()


 */