var ww = ww ||{}

ww.changeColor = {}
ww.changeColor.to16 = function (v) {
    var v = v || 0
    return v.toString(16)
}
ww.changeColor.fr16 = function (v) {
    var v = "" + (v || 0)
    return parseInt(v, 16)
}


ww.changeColor.torgba = function (v, a) {
    var v = "" + v
    var a = a === undefined ? 1 : (a || 0)
    var r = 0
    var g = 0
    var b = 0
    if (v[0] == "#") {
        if (v.length == 7) {
            var r = this.fr16(v.slice(1, 3))
            var g = this.fr16(v.slice(3, 5))
            var b = this.fr16(v.slice(5, 7))
        } else if (v.length == 4) {
            var r = this.fr16(v.slice(1, 2)) * 15
            var g = this.fr16(v.slice(2, 3)) * 15
            var b = this.fr16(v.slice(3, 4)) * 15
        }
    }
    return "rgba(" + r + "," + g + "," + b + "," + a + ")"
}


bitmapChange = {}

/**保存图片到png格式(图片,文件名,文件夹名)*/

/**图片 获取 dataurl */
bitmapChange.bitmap2DataURL = function (bitmap, type) {
    var imgData = ""
    if (!bitmap) {
    } else if (typeof bitmap == "string") {
        imgData = bitmap
    } else if (bitmap instanceof Bitmap) {
        imgData = bitmap.canvas && bitmap.canvas.toDataURL(type)
    } else {
        imgData = bitmap.toDataURL && bitmap.toDataURL(type)
    }
    return imgData || ""
}


/**
 * 
 * dataURL 转化为 buffer
 * @param {*} imgData 
 * 
 */
bitmapChange.dataURL2Buffer = function (imgData) {
    if (!imgData) {
        var dataBuffer = new Buffer(0);
    } else {
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
    }
    return dataBuffer;
}

bitmapChange.bitmapid = 0

/**
 * 
 * bitmap  转化为 buffer
 * @param {*} bitmap 
 * @param {*} type 
 */
bitmapChange.bitmapChange = function (bitmap, type) {
    var imgData = this.bitmap2DataURL(bitmap, type)
    return this.dataURL2Buffer(imgData);
}

bitmapChange.date = function () {
    var s = new Date()
    return s.getUTCFullYear() + "-" + (s.getMonth() + 1) + "-" + s.getDate() + " " + s.getHours() + "-" + s.getMinutes() + "-" + s.getSeconds()
}

bitmapChange.saveBitmap = function (bitmap, name) {


    var fs = require('fs');
    if (!fs.existsSync("savebitmap")) {
        /**制作文件夹 */
        fs.mkdirSync("savebitmap");
    }

    var name = name || "" + bitmapChange.bitmapid++
    var data = bitmapChange.bitmapChange(bitmap)
    fs.writeFileSync("savebitmap/" + name + ".png", data)
}

bitmapChange.toWidth = 1920
bitmapChange.toHeight = 1080
bitmapChange.cutBitmapH = function (bitmap, y, h) {
    var b2 = new Bitmap(bitmap.width, h)
    b2.blt(bitmap, 0, y, bitmap.width, h, 0, 0)
    return b2
}

bitmapChange.conbitmap = function (bitmap, x, y, ax, ay, b2) {

    var b2 = b2 || new Bitmap(bitmapChange.toWidth, bitmapChange.toHeight)
    b2.clear()

    var w = b2.width
    var h = b2.height

    var x = x === undefined ? (b2.width) * 0.5 : x
    var y = y === undefined ? (b2.height) * 0.5 : y
    var ax = ax || 0
    var ay = ay || 0

    var bw = bitmap.width
    var bh = bitmap.height

    var px = x - bw * ax
    var py = y - bh * ay


    var fx = 0
    var fw = bw
    if (px >= 0) {
        var fx = 0
        if (px + bw >= w) {
            var fw = w - px
        }
    } else {

        var fx = -px
        if (px + bw >= w) {
            var fw = w
        } else {
            var fw = px + bw
        }
        var px = 0
    }

    var fy = 0
    var fh = bh
    if (py >= 0) {
        var fy = 0
        if (py + bh >= h) {
            var fh = h - py
        }
    } else {
        var fy = -py
        if (py + bh >= h) {
            var fh = h
        } else {
            var fh = bh - fy
        }
        var py = 0
    }
    b2.blt(bitmap, fx, fy, fw, fh, px, py)
    return b2
}


/**
 * 转化为使用的文本
 * @param {string} text 
 * @returns {string} 
 */
bitmapChange.text2use = function (text) {
    var re = text || ""
    re = re.replace(/#/g, " ")
    re = re.replace(/,/g, "，")
    re = re.replace(/\./g, "。")
    re = re.replace(/:/g, "：")
    re = re.replace(/\*/g, " ")
    re = re.replace(/\?/g, "？")
    re = re.replace(/!/g, "！")
    re = re.replace(/^\s+|\s+$/g, "")
    re = re.replace(/ /g, "，")
    return re
};
/**
 * 转化为文件名
 * @param {string} text
 * @returns {string} 
 */
bitmapChange.text2fm = function (text) {
    var re = ""
    if (text.length > 43) {
        re = text.slice(0, 20) + " --- " + text.slice(-20)
    } else {
        re = text
    }
    re = re.replace(/#/g, " ")
    re = re.replace(/</g, " ")
    re = re.replace(/>/g, " ")
    re = re.replace(/\//g, " ")
    re = re.replace(/\\/g, " ")
    re = re.replace(/\|/g, " ")
    re = re.replace(/:/g, "：")
    re = re.replace(/"/g, " ")
    re = re.replace(/\*/g, " ")
    re = re.replace(/\?/g, "？")
    re = re.replace(/!/g, "！")
    re = re.replace(/^\s+|\s+$/g, "")
    console.log(re)
    return re
}