/*
b = ImageManager.loadTitle1($dataSystem.title1Name)
c = ImageManager.loadSystem("1 (1)")
a = new Bitmap()
a.setTransitions(b,c)
s = new Sprite_Base()
SceneManager._scene.addChild(s)
s.bitmap = a 
s.setTransitions(200,10,256,-1)


b = ImageManager.loadTitle1($dataSystem.title1Name)
c = ImageManager.loadSystem("1 (12)")
a.setTransitions(b,c)
s.setTransitions(50,10,-1,256,1)

*/











Bitmap.prototype.setTransitions = function(bitmap0, bitmap1) {
    if (bitmap0 && bitmap1) {
        this._loadingState = "transitions"
            //this._isLoading = true
        this._transitionsBitamp = 0
        var that = this
        var bitmap0 = bitmap0
        var bitmap1 = bitmap1
        bitmap0.addLoadListener(
            function() {
                if (that._transitionsBitamp == 1) {
                    that.setTransitionsBitamp(bitmap0, bitmap1)
                } else {
                    that._transitionsBitamp = 1
                }
            }
        )
        bitmap1.addLoadListener(
            function() {
                if (that._transitionsBitamp == 1) {
                    that.setTransitionsBitamp(bitmap0, bitmap1)
                } else {
                    that._transitionsBitamp = 1
                }
            }
        )
        return true
    }
    return false
}



Bitmap.prototype.setTransitionsBitamp = function(bitmap0, bitmap1) {
    this._transitionsBitamp = 2
    var b0 = bitmap0
    var b1 = new Bitmap(b0.width, b0.height)
    b1.blt(bitmap1, 0, 0, bitmap1.width, bitmap1.height, 0, 0, b0.width, b0.height)
    this._transitionsBitamp0 = b0
    this._transitionsBitamp1 = b1

    this.resize(b0.width, b0.height);
    this.clear()
        //this.blt(b0,0,0,b0.width,b0.height,0,0,b0.width,b0.height)

    this.setTransitionsDate(this._transitionsBitamp1)
    this._transitionsAlpha = 256

    this._loadingState = "loaded"

    //设置发生更改()
    this._setDirty();
    this._callLoadListeners();

}

Bitmap.prototype.setTransitionsDate = function(bitmap) {
    var context = bitmap._context;
    var imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);
    var pixels = imageData.data;
    var data = { 0: {}, 1: {}, 2: {}, 3: {} }
    for (var i = 0; i < pixels.length; i += 4) {
        var k = [
            pixels[i + 0],
            pixels[i + 1],
            pixels[i + 2],
            pixels[i + 3]
        ]
        data[k] = data[k] || []
        data[k].push(i)
        var z = 0
        data[z][pixels[i + z]] = data[z][pixels[i + z]] || []
        data[z][pixels[i + z]].push(i)

        var z = 1
        data[z][pixels[i + z]] = data[z][pixels[i + z]] || []
        data[z][pixels[i + z]].push(i)

        var z = 2
        data[z][pixels[i + z]] = data[z][pixels[i + z]] || []
        data[z][pixels[i + z]].push(i)

        var z = 3
        data[z][pixels[i + z]] = data[z][pixels[i + z]] || []
        data[z][pixels[i + z]].push(i)

    }
    this._transitionsData = data
}



Bitmap.prototype.transitionsToAlpha = function(a) {
    if (this._transitionsBitamp == 2 && this.width > 0 && this.height > 0) {
        var a = a || 0
        a = Math.floor(a)
        this._transitionsAlpha = a
        var context0 = this._transitionsBitamp0._context;
        var imageData0 = context0.getImageData(0, 0, this.width, this.height);
        var pixels0 = imageData0.data;
        var context = this._context;
        var imageData = context.getImageData(0, 0, this.width, this.height);
        var pixels = imageData.data;
        var context1 = this._transitionsBitamp1._context;
        var imageData1 = context1.getImageData(0, 0, this.width, this.height);
        var pixels1 = imageData1.data;

        for (var i = 0; i < pixels.length; i += 4) {
            if (pixels1[i + 0] >= a) {
                pixels[i + 0] = pixels0[i + 0]
                pixels[i + 1] = pixels0[i + 1]
                pixels[i + 2] = pixels0[i + 2]
                pixels[i + 3] = pixels0[i + 3]
            } else {
                pixels[i + 0] = 0
                pixels[i + 1] = 0
                pixels[i + 2] = 0
                pixels[i + 3] = 0
            }
        }
        context.putImageData(imageData, 0, 0);
        this._setDirty();
        return true
    }
    return false
};


Bitmap.prototype.transitionsAlphaTo = function(a) {
    if (this._transitionsBitamp == 2 && this.width > 0 && this.height > 0) {
        var a = a || 0
        a = Math.floor(a)
        if (this._transitionsAlpha != a) {
            var data = this._transitionsData

            var context0 = this._transitionsBitamp0._context;
            var imageData0 = context0.getImageData(0, 0, this.width, this.height);
            var pixels0 = imageData0.data;
            var context = this._context;
            var imageData = context.getImageData(0, 0, this.width, this.height);
            var pixels = imageData.data;
            //删除
            if (this._transitionsAlpha < a) {
                while (this._transitionsAlpha < a) {
                    var l = data[0][this._transitionsAlpha]
                    if (l) {
                        for (var li = 0; li < l.length; li++) {
                            var i = l[li]
                            pixels[i + 0] = 0
                            pixels[i + 1] = 0
                            pixels[i + 2] = 0
                            pixels[i + 3] = 0
                        }
                    }
                    this._transitionsAlpha += 1
                }
            } else {
                while (this._transitionsAlpha <= a) {
                    var l = data[0][this._transitionsAlpha]
                    if (l) {
                        for (var li = 0; li < l.length; li++) {
                            var i = l[li]
                            pixels[i + 0] = pixels0[i + 0]
                            pixels[i + 1] = pixels0[i + 0]
                            pixels[i + 2] = pixels0[i + 0]
                            pixels[i + 3] = pixels0[i + 0]
                        }
                    }
                    this._transitionsAlpha -= 1
                }

            }
            this._transitionsAlpha = a
            context.putImageData(imageData, 0, 0);
            this._setDirty();
        }
    }
};

//更新
Sprite.prototype.update0 = Sprite.prototype.update
Sprite.prototype.update = function() {
    this.update0()
    this.updateTransitions()
};

Sprite.prototype.updateTransitions = function() {
    if (this.bitmap && this.bitmap._transitionsBitamp == 2 && this._transitionsDuration > 0) {
        if (this._transitionsDuration % this._transitionsDuration2 == 1) {
            var d = Math.floor(this._transitionsDuration / this._transitionsDuration2) + 1;
            var a = this._transitionsAlpha || 0
            a = (a * (d - 1) + this._transitionsTargetAlpha) / d;
            this.bitmap.transitionsAlphaTo(a)
        }
        this._transitionsDuration--;
    }
};


Sprite.prototype.setTransitions = function(d, d2, a, ta, cs) {
    this._transitionsDuration = d || 0
    this._transitionsDuration2 = d2 || 1
    this._transitionsAlpha = a || 0
    this._transitionsTargetAlpha = ta || 0
    this.bitmap.transitionsToAlpha(this._transitionsAlpha)
};