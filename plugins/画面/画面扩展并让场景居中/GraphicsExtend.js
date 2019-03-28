/**
 * 画面拉伸
*/


Graphics.initialize2 = Graphics.initialize
Graphics.initialize = function (width, height, type) {
    this._baseWidth = width
    this._baseHeight = height
    this.initialize2(width, height, type)
}

Graphics._updateRealScale = function () {
    if (this._stretchEnabled) {
        var margin = "auto"
        if (this._rotate == 1 || this._rotate == 3) {
            this.innerWidth = window.innerHeight
            this.innerHeight = window.innerWidth
            if (this.innerWidth > this.innerHeight) {
                var w = (this.innerWidth - this.innerHeight) * 0.5
                var margin = "" + w + "px " + -w + "px " + -w + "px " + -w + "px "
            }
        } else {
            this.innerWidth = window.innerWidth
            this.innerHeight = window.innerHeight
        }
        var h = this.innerWidth / this._baseWidth;
        var v = this.innerHeight / this._baseHeight;

        var set = { width: this.innerWidth + "px", height: this.innerHeight + "px", margin: margin }

        this._setElementSet(
            this._base,
            set,
            "style"
        )

        if (h >= 1 && h - 0.01 <= 1) h = 1;
        if (v >= 1 && v - 0.01 <= 1) v = 1;
        this._realScale = Math.min(h, v);
    } else {
        this._realScale = this._scale;
    }
    Graphics.extend()

};



Graphics._deltX = 0
Graphics._deltY = 0


Graphics.extend = function () {
    var set = { width: this.innerWidth + "px" ,heigth:this.innerHeight+"px"}
    this._setElementSet(
        this._canvas,
        set,
        "style"
    )
    Graphics._width = this.innerWidth / this._realScale
    Graphics._height = this.innerHeight / this._realScale
    Graphics._deltX = (Graphics._width - this._baseWidth) * 0.5
    Graphics._height = this.innerHeight / this._realScale
}

 



Graphics._updateElement = function (id) {
    var element = this._elements[id]
    if (element) {
        var sz = element.sz
        if (sz) {
            var x = (sz.x ) * this._realScale+ this._deltX
            var y = sz.y * this._realScale
            var width = sz.width * this._realScale;
            var height = sz.height * this._realScale;
            var fontSize = sz.fontSize * this._realScale;
            element.style.position = 'absolute';
            element.style.margin = 'auto';
            element.style.top = y + 'px';
            element.style.left = x + 'px';
            element.style.width = width + 'px';
            element.style.height = height + 'px';
            element.style.fontSize = fontSize + 'px';
        }
    }
}


