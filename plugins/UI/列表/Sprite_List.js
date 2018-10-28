



function Sprite_UIList() {
    this.initialize.apply(this, arguments);
}
Sprite_UIList.prototype = Object.create(Sprite.prototype);
Sprite_UIList.prototype.constructor = Sprite_UIList;



Sprite_UIList.prototype.initialize = function (w, h) {
    Sprite.prototype.initialize.call(this)
    this._index = -1
    this._showX = 0
    this._showY = 0
    this._showW = w || 0
    this._showH = h || 0

    this.width = w || 0
    this.height = h || 0


    this._allW = 0
    this._allH = 0


    this._objectsList = []

    this._showSprite = new Sprite()
    this._showSprite.x = 0
    this._showSprite.y = 0


    var b = new Bitmap(5, h)
    this._pagePosSprite = new Sprite()
    this._pagePosSprite.bitmap = b
    b.fillAll("#ffffff")  

    this._pagePosSprite.visible = false // = new Bitmap(10,h)
    this._pagePosSprite.x = this.width - 5 

    this.addChild(this._showSprite)
    this.addChild(this._pagePosSprite)
    this.makeMask(0, 0, w, h)
    // this._evalInMapIndex = []
};


Sprite_UIList.prototype.addSpriteToEnd = function (s, h) {
    if (h !== undefined) {
        s.x = s.x
        s.y = this._showSprite.height
        this._allH = this._showSprite.height += h
    } else {
        s.x = s.x
        s.y = this._showSprite.height
        this._allH = this._showSprite.height += s.height
    }
    if (this._allH > this._showH) { 
        var scale = this._showH / this._allH
        this._pagePosSprite.scale.y = scale 
        this._pagePosSprite.visible = true 
    }else{
        this._pagePosSprite.visible = false
    } 
    this.addSprite(s)
};


Sprite_UIList.prototype.addSprite = function (s) {
    this._objectsList.push(s)
    this._showSprite.addChild(s)
};

 
 
 
Sprite_UIList.prototype.__updateInput = function () {
    if (Input.isKeyTriggered("touch2")) {
        console.log("click,click")
    }
    this.TouchInputisTouchIn()
    this.TouchInputisTouchInPressMove()
}


Sprite_UIList.prototype.__pagetoO = [{fr:{opacity:255} , t:0},60,{t:255,up:{opacity:-1}}]
Sprite_UIList.prototype.showSpriteToY = function (y) {
    this._showSprite.y = Math.min(Math.max(y, -this._allH + this._showH), 0)
    this._showY = -this._showSprite.y
 
    if(this._allH){
        var y   = ( this._showH  / this._allH ) * this._showY 
        this._pagePosSprite.y = y  
        this._pagePosSprite.anmSt("o",this.__pagetoO)
    }else{
        this._pagePosSprite.visible = false   
    }
}


Sprite_UIList.prototype.showToY = function (y) {
    this.showSpriteToY(-y)
}



Sprite_UIList.prototype.__TouchInputisTouchInPressMove = function (x, y) {
    if (y) {
        this.showSpriteToY(this._showSprite.y + y)
        console.log(y)
    }
} 



/**

var s = new Sprite_UIList(300,400)
SceneManager._scene.addChild(s)

b = ImageManager.loadEnemy("actor1_3") 

a = new Sprite(b)


a = new Sprite(b) ; s.addSpriteToEnd(a)
a = new Sprite(b) ; s.addSpriteToEnd(a)
a = new Sprite(b) ; s.addSpriteToEnd(a)
a = new Sprite(b) ; s.addSpriteToEnd(a)
a = new Sprite(b) ; s.addSpriteToEnd(a)
a = new Sprite(b) ; s.addSpriteToEnd(a)
a = new Sprite(b) ; s.addSpriteToEnd(a)
a = new Sprite(b) ; s.addSpriteToEnd(a)

  */