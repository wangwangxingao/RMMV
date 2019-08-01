//=============================================================================
// Sprite_XinXiPicture.js
//=============================================================================

/*:
 * @plugindesc 显示图片的信息窗口
 * @author 汪汪
 * @version 1.0
 *
 * 
 * @param ww_xinxipicture
 * @desc   显示图片的信息窗口
 * @default 0.1
 *  
 * 
 * @help 
 * 
 * type 种类  "picture" 显示图片的信息窗口 
 * 
 * folder : 基础文件夹 / 种类区分  字符串
 * default  : 默认图片名
 * 
 * w : 200  显示内容宽
 * h : 300  显示内容高
 * 
 * ixn:3    横排显示数量
 * iyn:3    竖排显示数量(用于初始化精灵,比如如果正常排列可以放3行,则建议为5,这样最上面的滑动上去时可以显示出下面的) 
 * ix: 100  图片x的差值
 * iy: 100  图片y的差值
 * 
 * 
 * iax : 0.5  不设置为0.5
 * iay : 0.5  不设置为0.5
 * ipx : 0.5  不设置为0.5
 * ipy : 0.5  不设置为0.5
 * anim: [1,5,0.8,3,1]  动画设置   [参数 ,间隔帧数 ,参数,间隔帧数 , 参数] 以此类推 
 *  
 * cclick C键调用的公共事件  为0则为默认设置
 * lclick 左键点击调用的公共事件 为0则为默认设置
 * rclick 右键点击用的公共事件  为0则为默认设置 
 * tid  赋值的变量id 如果为0则不设置 ,左键右键都会赋值,赋值的为 目前的 fold 的值
 * vid  赋值的变量id 如果为0则不设置 ,左键右键都会赋值,赋值的为 目前的 图片 的值  
 * 
 * 
 * bjb 背景图片名
 * bjx 背景x坐标
 * bjy 背景y坐标
 * 
 * cblb 侧边栏图片名
 * cblx 侧边栏x坐标  相对窗口的页面右侧
 * cbly 侧边栏y坐标   点击侧边栏时可以移动滑块到该位置
 * 
 * cbhkb 侧边滑块名 
 * cbhkx 侧边滑块x坐标  相对窗口的页面右侧
 * cbhkw 侧边滑块的宽
 * cbhkh 侧边滑块的最小高
 * cbhkl 侧边滑块黑框的宽度
 * 
 * cbb C按钮图片名 
 * cbx C按钮x坐标  
 * cby C按钮y坐标  按下时隐藏窗口
 *  
 * 
 * 
 *  
 * 
//设置 
ww.xinxi.set(10, {
    type: "picture", folder: "Helmet",w:500,h:600,   
    ixn: 3,iyn:3, ix:150,iy:200,anim: [1,5,0.8,3,1],
    bjb: "bag-0", bjx: -28, bjy: -90,
    cbhkw:30,cbhkh:30,cbhkl:4,
    cblb: "bag-1",
    cbb: "bag-2", vid:999,tid:998,rclick:926,lclick:925
})
//用图片显示10号窗口
$gameScreen.showPicture(100,"x/10", 0,125, 130,100, 100, 255, 0); 

*/


var ww = ww || {}
ww.xinxipicture = {}
ww.plugin.get("ww_xinxipicture", ww.xinxipicture);

ImageManager.loadPictureByFolder = function (folder, filename) {
    if (folder) {
        var folder = folder + "/"
    }
    //返回 读取图片
    return this.loadBitmap('img/pictures/' + folder, filename, 0, true);
};

function Sprite_XinXiPicture() {
    this.initialize.apply(this, arguments);
}
//设置原形 
Sprite_XinXiPicture.prototype = Object.create(Sprite_XinXi.prototype);
//设置创造者
Sprite_XinXiPicture.prototype.constructor = Sprite_XinXiPicture;
//初始化
Sprite_XinXiPicture.prototype.initialize = function (w, h, get) {
    Sprite_XinXi.prototype.initialize.call(this, w, h, get);
};


Sprite_XinXiPicture.prototype.initGet = function (w, h, get) {
    Sprite_XinXi.prototype.initGet.call(this, w, h, get);
    this._folder = this.get("folder") || ""
    this._default = this.get("default") || ""
    this.getAnim()
}

ww.xinxi.sprites["picture"] = Sprite_XinXiPicture


/**创建页面 */
Sprite_XinXiPicture.prototype.createSprites = function () {
    this._ix = this.get("ix") || 0
    this._iy = this.get("iy") || 0
    this._ixn = this.get("ixn") || 0
    this._iyn = this.get("iyn") || 0

    var v = this.get("iax")
    this._iax = v === undefined ? 0.5 : v || 0
    var v = this.get("iay")
    this._iay = v === undefined ? 0.5 : v || 0
    var v = this.get("ipx")
    this._ipx = v === undefined ? 0.5 : v || 0
    var v = this.get("ipy")
    this._ipy = v === undefined ? 0.5 : v || 0

    this._sprites = []
    for (var y = 0; y < this._iyn; y++) {
        for (var x = 0; x < this._ixn; x++) {
            var s = new Sprite()
            s.anchor.x = this._iax;
            s.anchor.y = this._iay;
            this.setSpriteXy(s)
            this._sprites.push(s)
            this._showSprite.addChild(s)
        }
    }
}

Sprite_XinXiPicture.prototype.setSpriteXy = function (s, x, y) {
    if (s) {
        s.x = x * this._ix + this._ix * this._ipx
        s.y = y * this._iy + this._iy * this._ipy
    }
}

Sprite_XinXiPicture.prototype.setSpriteXyByIndex = function (s, index) {
    var x = Math.floor(index % this._ixn)
    var y = Math.floor(index / this._ixn)
    this.setSpriteXy(s, x, y)
}


Sprite_XinXiPicture.prototype.allmessage = function () {
    return this.get("_all") || []
}

Sprite_XinXiPicture.prototype.getmessage = function (index) {
    return this.allmessage()[index] || ""
}

/**获取项目高 */
Sprite_XinXiPicture.prototype.testItem = function (index) {
    return this._iy
}


Sprite_XinXiPicture.prototype.showToRefresh = function () {
    this.refreshShowY()
}


/**全部高 */
Sprite_XinXiPicture.prototype.allh = function () {
    if (this._allH < 0) {
        var l = this.allmessage()
        var allh = Math.ceil(l.length / this._ixn) * this._iy
        this._allH = allh
    }
    return this._allH
}

/**绘制文本 */
Sprite_XinXiPicture.prototype.drawText = function (text) {
    var text = text || this._default
    return ImageManager.loadPictureByFolder(this._folder || "", text)
}


/**绘制精灵 */
Sprite_XinXiPicture.prototype.drawSprite = function (index) {
    var text = this.getmessage(index)
    var s = this.getSprite(index)
    if (s._index !== index) {
        this.setSpriteAnim(s, 0)
    }
    if (s._value !== text) {
        s._value = text
        s.bitmap = this.drawText(text)
        this.setSpriteAnim(s, 0)
    }
    s._index = index
    this.setSpriteXyByIndex(s, index)
}


Sprite_XinXiPicture.prototype.drawAllItem = function (y) {
    this.allh()
    var up = Math.floor(y / this._iy) * this._ixn
    var up = Math.max(0, up)
    for (var i = 0; i < this.spriteLength(); i++) {
        this.drawSprite(i + up)
    }
}

Sprite_XinXiPicture.prototype.onDefaultCClick = function () {
    this._get.hide()
}


Sprite_XinXiPicture.prototype.onRClickSet = function (s) {
    this.setItem(s)
    this.setHelp(s)
    this._animId = 0
}


Sprite_XinXiPicture.prototype.onLClickSet = function (s) {
    this.setItem(s)
    this.setHelp(s)
    this._animId = 0
}

/**设置物品 */
Sprite_XinXiPicture.prototype.setItem = function (item) {
    if (this._item) {
        this.setSpriteAnim(this._item, 0)
    }
    this._item = item
    if (!item) { return }
    var vid = this.get("vid") || 0
    if (vid) {
        var index = item._index
        var v = this.getmessage(index)
        $gameVariables.setValue(vid, v)
    }
    var tid = this.get("tid") || 0
    if (tid) {
        var v = this._folder
        $gameVariables.setValue(tid, v)
    }
}


/**物品 */
Sprite_XinXiPicture.prototype.item = function () {
    return this._item
};

Sprite_XinXiPicture.prototype.updateAnim = function () {
    if (this._item && this._animId >= 0 && this._animId < this._animl) {
        this.setSpriteAnim(this._item, this._animId)
        this._animId++
    } else {
        this._animId
    }
};

Sprite_XinXiPicture.prototype.setSpriteAnim = function (s, i) {
    if (s && this._animl) {
        s.scale.x = this.getAnimI(i)
        s.scale.y = this.getAnimI(i)
    }
};

Sprite_XinXiPicture.prototype.getAnimI = function (i) {
    if (this._animl) {
        var l = this._animl - 1
        if (i >= l) {
            i = l
        }
        if (i < 0) {
            i = 0
        }
        return this._anim[i] || 0
    } else {
        return 1
    }
};



Sprite_XinXiPicture.prototype.getAnim = function () {
    var anim = this.get("anim")
    var l
    if (anim) {
        var l = []
        for (var i = 0; i < anim.length - 2; i += 2) {
            var p = anim[i] || 0
            l.push(p)
            var z = anim[i + 1] || 0
            var p2 = anim[i + 2] || 0
            if (z) {
                var zd = z + 1
                var ppd = p2 - p
                var d = ppd / zd
                var p2 = p
                for (var zi = 0; zi < z; zi++) {
                    p2 += d
                    l.push(p2)
                }
            }
        }
        var p2 = anim[anim.length - 1] || 0
        l.push(p2)
    }
    this._animl = (l && l.length) || 0
    this._anim = l
}