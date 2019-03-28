
var ww = ww || {}
ww.exitsprite = {}
ww.exitsprite.bitmap = "dljl_guanbi"

ww.exitsprite.x = 0
ww.exitsprite.y = 0


ww.exitsprite._SceneManager_onSceneStart = SceneManager.onSceneStart
SceneManager.onSceneStart = function () {

    if (!ww.exitsprite.sprite) {
        ww.exitsprite.sprite = new Sprite_Exit()
    }
    //图形 结束读取中 
    ww.exitsprite._SceneManager_onSceneStart.call(this);
    SceneManager._scene.addChild(ww.exitsprite.sprite)
};

ww.exitsprite._onTrigger = TouchInput._onTrigger
TouchInput._onTrigger = function (x, y) {
    if (ww.exitsprite.sprite) {
        if (ww.exitsprite.sprite.istouchIn(x, y)) {
            TouchInput._onCancel(x, y)
            return
        }
    }
    ww.exitsprite._onTrigger.call(this, x, y)
}


function Sprite_Exit() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_Exit.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Exit.prototype.constructor = Sprite_Exit;
/**初始化 */
Sprite_Exit.prototype.initialize = function () {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);
    this._bitmapname =""
};
/**更新 */
Sprite_Exit.prototype.update = function () {
    //精灵 更新 呼叫(this)
    Sprite.prototype.update.call(this);
    if (this._bitmapname != ww.exitsprite.bitmap) {
        this.bitmap = ImageManager.loadPicture(ww.exitsprite.bitmap)
    }
    this.x = ww.exitsprite.x
    this.y = ww.exitsprite.y
};



Sprite_Exit.prototype.istouchIn = function (x, y) {
    var node = this;
    var x = x
    var y = y
    if (node.worldVisible) {
        var re = node.worldTransform.applyInverse({ x: x, y: y }, {});
        var x = re.x
        var y = re.y
        if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
            return true
        }
    }
    return false
}