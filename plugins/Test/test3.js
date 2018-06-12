
Bitmap.prototype.getColors = function () {
    var o = {}
    if (this.width > 0 && this.height > 0) {
        //环境 = 环境 
        var context = this._context;
        var imageData = context.getImageData(0, 0, this.width, this.height);
        var pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            var r = Math.floor(pixels[i + 0] / 10)
            var g = Math.floor(pixels[i + 1] / 10)
            var b = Math.floor(pixels[i + 2] / 10)
            var a = Math.floor(pixels[i + 3] / 10)
            var z = [r, g, b, a]
            o[z] = o[z] || 0
            o[z]++
        }
    }
    return o
};




Bitmap.prototype.getColorsNumber = function (colors) {
    var i = 0
    for (var color in colors) {
        colors[color] = i
        i++
    }

    return i
}


Bitmap.prototype.makeUni = function () {
    var o = this.getColors()
    var n = this.getColorsNumber(o)

    var list = []
    if (this.width > 0 && this.height > 0) {
        if (length == 0) {
            var context = this._context;
            var imageData = context.getImageData(0, 0, this.width, this.height);
            var pixels = imageData.data;
            for (var i = 0; i < pixels.length; i += 4) {
                var r = Math.floor(pixels[i + 0] / 10)
                var g = Math.floor(pixels[i + 1] / 10)
                var b = Math.floor(pixels[i + 2] / 10)
                var a = Math.floor(pixels[i + 3] / 10)
                var z = [r, g, b, a]
                var v = o[z]
                list.push(v)
            }
        }
    }
    return list
}

s3 = ImageManager.loadFace("A-01")


s3.makeUni()




/**变长字节 */
makeChangeLength = function (number) {

    var list = []
    var have = 0
    do { 
        var z = number & 127
        var number = number >> 7
        if (have) {
            z = z | 128
        }
        have = 1
        list.unshift(z)
    } while (number)
    return list
}

/**变长字节解析 */
getList = function (list, st) {
    console.log(list)
    var st = st || 0
    var i = 0
    var all = 0
    do {
        var number = list[st + i]
        var have = number >> 7
        var number = number & 127 
        var all = all << 7 | number
        i++
        console.log( have.toString(2),number.toString(2) ,all.toString(2),number , all)
    } while (have)
    return [all,i]  
}

getList(makeChangeLength(5236))