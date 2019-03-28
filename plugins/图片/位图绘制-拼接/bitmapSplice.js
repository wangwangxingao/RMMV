//拼接
var ww = ww || {}
ww.bitmapSplice = ww.bitmapSplice || {}

/**拼接 */
ww.bitmapSplice.splice = function (to, from, list, w, h, wl, hl, dw, dh, dx, dy) {
    if (to && from && Array.isArray(list)) {
        var w = w || 0
        var h = h || 0
        var wl = wl || 0
        var hl = hl || 0
        var dw = dw || 0
        var dh = dh || 0
        var dx = dx || 0
        var dy = dy || 0
        if (w) {
            if (!wl) {
                wl = Math.ceil(from.width / w)
            }
        } else {
            if (wl) {
                w = Math.ceil(from.width / wl)
            } else {
                w = from.width
                wl = 1
            }
        }
        if (h) {
            if (!hl) {
                hl = Math.ceil(from.height / h)
            }
        } else {
            if (hl) {
                h = Math.ceil(from.height / hl)
            } else {
                h = from.height
                hl = 1
            }
        }

        var all = hl * wl

        if (!dh) {
            var toh = list.length
            var dh = toh * h
        }
        if (!dw) {
            var tow = 0
            for (var y = 0; y < list.length; y++) {
                var l = list[y]
                if (Array.isArray(l)) {
                    tow = Math.max(tow, l.length)
                }
            }
            var dw = tow * w
        }
        to.resize(dw, dh)
        for (var y = 0; y < list.length; y++) {
            var l = list[y]
            if (Array.isArray(l)) {
                var toy = y * h + dy
                for (var x = 0; x < l.length; x++) {
                    var index = l[x]
                    if (index >= 0 && index < all) {
                        var tox = x * w + dx
                        var fx = index % wl
                        var fy = Math.floor(index / wl)
                        var frx = fx * w
                        var fry = fy * h
                        var wf =frx + w > from.width? from.width - frx : w 
                        var hf =fry + h > from.height? from.height - fry : h

                        console.log(from,index, fx, fy, wf, hf, tox, toy, wf, hf)
                        to.blt(from, frx, fry, wf, hf, tox, toy, wf, hf)
                    }
                }
            }
        }
    }
}

/**数值转化为数组 */
ww.bitmapSplice.number = function (number) {
    var l = ("" + (number || 0))
    var list = []
    for (var i = 0; i < l.length; i++) {
        var z = l[i] * 1
        if (z == 0) {
            z = 10
        }
        list.push(z)
    }
    if (list.length) { list.unshift(0) }

    console.log(l,list)
    return [list]
}
/**绘制数值 */
ww.bitmapSplice.drawNumber = function (to, from, number) {
    var l = ww.bitmapSplice.number(number)
    ww.bitmapSplice.splice(to, from, l, 0, 0, 11, 0)
}



ww.bitmapSplice.test = function (number) { 
    b = ImageManager.loadPicture("ying_shuzi")

    if(!this._test){
        this._test = new Sprite()
    }
      s = this._test

    b.addLoadListener(function () {
        var z = new Bitmap()
        ww.bitmapSplice.drawNumber( z , b, number)
        s.bitmap =  z 
    })
    SceneManager._scene.addChild(s)

   

}

