
/** 
 * 
 * 四方向选项
 * 
*/

function Sprite_UIFourChioce() {
    this.initialize.apply(this, arguments);
}


Sprite_UIFourChioce.prototype = Object.create(Sprite_UIWaitChioce.prototype);
Sprite_UIFourChioce.prototype.constructor = Sprite_UIFourChioce;

Sprite_UIFourChioce.prototype.initialize = function (w) {
    Sprite_UIWaitChioce.prototype.initialize.call(this, w)

    this._four = []
    this._texts = []
    this.createFour()

    this.centerSprite()
};

/**当开始 */
Sprite_UIFourChioce.prototype.onStart = function () {
    this.createFour()
}

/**创建命令列表 */
Sprite_UIFourChioce.prototype.makeCommandList = function () {
    var choices = $gameMessage.choices();

    this._items = []
    for (var i = 0; i < this._texts.length; i++) {
        var ts = this._texts[i]
        var fs = this._four[i]
        if (i < choices.length) {
            ts.text = "\\wt[1]\\ht[1]\\C[#000]\\OW[0]" + choices[i]
            this._items.push(fs)
            fs.visible = true
        } else {
            ts.text = ""
            fs.visible = false
        }
    }
};


/**创建四方向 */
Sprite_UIFourChioce.prototype.createFour = function () {

    var anchors = [[1, 0.5], [0, 0.5], [0.5, 1], [0.5, 0]]
    var xys = [[-10, 0], [10, 0], [0, -10], [0, 10]]
    var xys2 = [[- 35, 0], [35, 0], [0, -40], [0, 40]]

    for (var i = 0; i < 4; i++) {
        if (!this._four[i]) {
            var s = new Sprite()
            var t = new Sprite_UIString(160, 57)
            this.addChild(s)
            s.addChild(t)
            this._four[i] = s
            this._texts[i] = t
        } else {
            var t = this._texts[i] 
            var s = this._four[i]
        }
        var name = "VerticalChoice" + (i + 1)
        s.bitmap = ImageManager.loadTextUI(name)

        s.opacity = 255

        var anchor = anchors[i]

        var xy = xys[i]
        s.anchor.x = anchor[0]
        s.anchor.y = anchor[1]

        s.x = xy[0]
        s.y = xy[1]

        t.anchor.x = anchor[0]
        t.anchor.y = anchor[1]

        var xy = xys2[i]

        t.x = xy[0]
        t.y = xy[1]
    }

    this._items = this._four
};



/**点击测试 */
Sprite_UIFourChioce.prototype.hitTest2 = function (x, y) {
    var items = this.items()
    if (items) {
        for (var i = 0; i < items.length; i++) {
            var s = items[i]
            if (s && s.isTouchThis(x, y, 0)) {
                return i
            }
        }
    }
    return -1;
};

/**当选择 */
Sprite_UIFourChioce.prototype.onSelect = function (index) {
    this._index = index
 
    for (var i = 0; i < 4; i++) {
        var name = "VerticalChoice" + (i + 1) + (index == i ? "_" + 1 : "")
        this._four[i].bitmap = ImageManager.loadTextUI(name)
    }
};
 



/**更新等待 */
Sprite_UIFourChioce.prototype.updateEndTime = function () {
    var moves = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    for (var i = 0; i < 4; i++) {
        if (this._index != i) {
            var s = this._four[i]
            var move = moves[i]
            s.x += move[0]
            s.y += move[1]
            s.opacity -= 10
        } else {
            if (this._waitOkTime < 10) {
                var s = this._four[i]
                var move = moves[i]
                s.x += move[0]
                s.y += move[1]
                s.opacity -= 10
            }
        }
    }
};

 