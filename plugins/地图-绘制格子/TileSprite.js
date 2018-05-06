
function Sprite_Tile() {
    //调用 初始化
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_Tile.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Tile.prototype.constructor = Sprite_Tile;

Sprite_Tile.prototype.initialize = function (w, h) {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);


    this._list = []
    this._bitmapColor = []
    this._bitmapList = []

    this._width = w || 10
    this._height = h || 10

    for (var x = 0; x < this._width; x++) {
        for (var y = 0; y < this._height; y++) {
            var i = x * this._height + y
            var r = Math.randomInt(255)
            var g = Math.randomInt(255)
            var b = Math.randomInt(255)
            var a = 1
            var blackColor = "rgba(" + r + "," + g + "," + b + "," + a + ")"
            var bitmap = new Bitmap(48, 48)
            bitmap.fillAll(blackColor)
            this._bitmapColor[i] = blackColor
            this._bitmapList[i] = bitmap
        }
    }

    for (var x = 0; x < this._width; x++) {
        for (var y = 0; y < this._height; y++) {
            var i = x * this._height + y
            var s = new Sprite(bitmap)
            s.x = x * 48
            s.y = y * 48
            this.addChild(s)
            this._list[i] = s
            s.bitmap = new Bitmap(48, 48)
        }
    }
};
 


Sprite_Tile.prototype.update = function () {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.update.call(this);

    var displayX = $gameMap.displayX()
    var displayY = $gameMap.displayY()
    var floorX = Math.floor(displayX)
    var floorY = Math.floor(displayY)

    if (this._floorX != floorX || this._floorY != floorY) {
        this._floorX = floorX
        this._floorY = floorY
        this.refesh()
    }
    var x = this._floorX - displayX
    var y = this._floorY - displayY
    this.x = x * $gameMap.tileWidth()
    this.y = y * $gameMap.tileWidth()
    //console.log(x, y)
};


Sprite_Tile.prototype.refesh = function () { 
    for (var x = 0; x < this._width; x++) {
        for (var y = 0; y < this._height; y++) {
            var s = this._list[x * this._height + y]
            s.bitmap = this._bitmapList[(x + this._floorX) * this._height + y + this._floorY] 
        }
    } 
};