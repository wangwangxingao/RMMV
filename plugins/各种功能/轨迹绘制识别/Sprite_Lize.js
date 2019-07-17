//=============================================================================
// Sprite_Lizi.js
//=============================================================================

/*: 
 *
 * @name Sprite_Lizi 
 * @plugindesc 轨迹粒子
 * @author 汪汪
 * @version 1.0 
 * 
 * @param Sprite_Lizi 
 * @desc  版本
 * @default 1.0
 * 
 * 
 * @param number
 * @desc  默认数目(一次显示的粒子数) 
 * @default 6
 * 
 * @param life
 * @desc  粒子默认存在时间(帧数) 
 * @default 100
 * 
 * @param minr
 * @desc  粒子最小圆取值 
 * @default 2
 * 
 * @param maxr
 * @desc  粒子最大圆取值
 * @default 4
 * 
 * @param vx
 * @desc  粒子随机移动x速度 (随机 -vx/2 - vx/2  )
 * @default 1
 * 
 * 
 * @param vy
 * @desc  粒子随机移动y速度 (随机 -vy/2 - vy/2  )
 * @default 1
 * 
 * 
 * @param colors
 * @desc  默认随机颜色 
 * @default ['355,85,80','9,80,100','343,81,45']
 
 * @param opacitys
 * @desc 默认随机透明度设置
 * @default [255] 
 * 
 * @help
 * 放在 sprite_track.js 后面
 * 
 * 在绘制轨迹时显示一个粒子特效
 * 
 */




var ww = ww || {}

ww.spriteLizi = {}


/**默认数目(一次输入内容) */
ww.spriteLizi.number = 6

/**默认存在时间(帧数) */
ww.spriteLizi.life = 100

/**最小 */
ww.spriteLizi.minr = 2
/**最大 */
ww.spriteLizi.maxr = 4

/**x速度 (随机 -vx/2 - vx/2  )*/
ww.spriteLizi.vx = 1
/**y速度 (随机 -vy/2 - vy/2  )*/
ww.spriteLizi.vy = 1

/**颜色默认 */
ww.spriteLizi.colors = [
    '355,85,80',
    '9,80,100',
    '343,81,45',
]
/**透明度设置 */
ww.spriteLizi.opacitys = [
    255
];
  
ww.plugin.get("Sprite_Lize",ww.spriteLizi);








function Sprite_Lizi() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_Lizi.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Lizi.prototype.constructor = Sprite_Lizi;
/**初始化 */
Sprite_Lizi.prototype.initialize = function (x, y, radius, vx, vy, rgb, opacity, life) {
    Sprite.prototype.initialize.call(this);
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.minRadius = radius;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.time = 0
    this.opacity = opacity;
    this.baseopacity = opacity;
    this.rgb = rgb

    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.drawBitmap(this.radius)
};


Sprite_Lizi.prototype.drawBitmap = function (r) {
    var r = r || 0
    var l = r + r
    if (!this.bitmap) {
        this.bitmap = new Bitmap(l, l)
    }
    var w = this.bitmap.width
    if (w < l) {
        this.bitmap = new Bitmap(l, l)
        w = l
    }
    var x = w * 0.5
    this.bitmap.drawCircle(x, x, r, 'rgba(' + this.rgb + ',' + this.opacity + ')')
};



Sprite_Lizi.prototype.update = function () {
    this.time++
    this.x += this.vx;
    this.y += this.vy;
    this.opacity = (1 - (this.time / this.life)) * this.baseopacity;
    if (this.time > this.life) {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}



function Sprite_LiziTrack() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_LiziTrack.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_LiziTrack.prototype.constructor = Sprite_LiziTrack;
/**初始化 */
Sprite_LiziTrack.prototype.initialize = function (set, w, h,noout) {
    Sprite.prototype.initialize.call(this);

    this._showWidth = w||0
    this._showHeigth = h||0
    this._noout = noout||0

    if (set) {
        for (var i in set) {
            this[i] = set[i]
        }
    }
    if (ww.spriteLizi) {
        for (var i in ww.spriteLizi) {
            this[i] = this[i] || ww.spriteLizi[i]
        }
    }
};

/**添加点 */
Sprite_LiziTrack.prototype.addPoint = function (x, y) { 
    if(this._noout){
        if(x<0||y<0||x>this._showWidth ||y>this._showHeigth){
            return
        }
    }
    for (var i = 0; i < this.number; i++) {
        var radius = Math.randomInt(this.maxr - this.minr) + this.minr;
        var vx = (Math.random() * this.vx) - this.vx * 0.5;
        var vy = (Math.random() * this.vy) - this.vy * 0.5;
        var rgb = this.colors[Math.randomInt(this.colors.length)];
        var opacity = this.opacitys[Math.randomInt(this.opacitys.length)];
        var life = this.life;
        var s = new Sprite_Lizi(x, y, radius, vx, vy, rgb, opacity, life)
        this.addChild(s);
    }
};





/**添加粒子 */
Sprite_Track.prototype.createAdd = function (add) {
    if (add) {
        this._add = new Sprite_Track(this._trackWidth, this._trackHeight)
        this._add._canTouch = false
        this._add._lineSet = {
            strokeStyle: "#00f",
            lineWidth: 3,
            lineCap: "round",
            //shadowBlur: 20,
            // shadowColor: "black"
        };
        this.addChild(this._add)
    }
    this._lizi = new Sprite_LiziTrack(0,this._trackWidth, this._trackHeight)
    this.addChild(this._lizi)
};


/**移动 */
Sprite_Track.prototype.moveTo = function (x, y) {
    this._pointX = x
    this._pointY = y
    //console.log(x, y)
    this._char.addPoint(this._touchId, x, y)
    this._lizi.addPoint(x, y)
};
