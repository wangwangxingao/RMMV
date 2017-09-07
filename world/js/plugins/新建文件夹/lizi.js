
function Lizi_Spriteset() {
    this.initialize.apply(this, arguments);
}

Lizi_Spriteset.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Lizi_Spriteset.prototype.constructor = Lizi_Spriteset;

Lizi_Spriteset.prototype.initialize = function (maxSize, properties, batchSize) {
    Sprite.prototype.initialize.call(this);
    this._maxSize = maxSize || 10000
    this._properties = properties || {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
    }
    this._batchSize = batchSize || 10000;
    this._lizis = []
    this._containers = {};
    this.clear()
    console.log(this)
};

Lizi_Spriteset.prototype.clear = function () {
    this.clearLizi()
};

Lizi_Spriteset.prototype.clearLizi = function () {
    this._lizis.forEach(function (lizi) {
        this.dieout(lizi)
    }, this)
};


Lizi_Spriteset.prototype.update = function () {
    this._lizis.forEach(function (lizi) {
        lizi.update && lizi.update()
    })
    //Sprite.prototype.update.call(this);
}


Lizi_Spriteset.prototype.shoot = function (lizi) {
    var argumentsLength = arguments.length;
    if (argumentsLength > 1) {
        for (var i = 0; i < argumentsLength; i++) {
            this.shoot(arguments[i]);
        }
    } else {
        if (lizi.name) {
            this._lizis.push(lizi);
            var name = lizi.name
            var container = this.getContainer(name)
            container.shoot(lizi)
        }
    }
}


Lizi_Spriteset.prototype.dieout = function (lizi) {
    var argumentsLength = arguments.length;
    if (argumentsLength > 1) {
        for (var i = 0; i < argumentsLength; i++) {
            this.dieout(arguments[i]);
        }
    } else {
        var index = this._lizis.indexOf(lizi);
        if (index === -1) {
            return;
        }
        if (lizi.name) {
            this._lizis.splice(index, 1)
            var name = lizi.name
            var container = this.getContainer(name)
            container.dieout(lizi)
            if (container.length() <= 0) {
                this.removeContainer(name)
            }
        }
    }
}



Lizi_Spriteset.prototype.getContainer = function (name) {
    var name = name || ""
    if (!this._containers[name]) {
        this.addContainer(name)
    }
    return this._containers[name]
}



Lizi_Spriteset.prototype.addContainer = function (name) {
    this._containers[name] = new Lizi_Container(this._maxSize, this._properties, this._batchSize)
    if (name) {
        this.addChild(this._containers[name])
    }
    return this._containers[name]
}

Lizi_Spriteset.prototype.removeContainer = function (name) {
    if (name) {
        this.removeChild(this._containers[name])
    }
    delete this._containers[name]
}


function Lizi_Container() {
    this.initialize.apply(this, arguments);
}

Lizi_Container.prototype = Object.create(PIXI.particles.ParticleContainer.prototype);
Lizi_Container.prototype.constructor = Lizi_Container;



Lizi_Container.prototype.initialize = function (maxSize, properties, batchSize) {
    PIXI.particles.ParticleContainer.call(this, maxSize, properties, batchSize);
}

/**
 * The opacity of the sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */
Object.defineProperty(Lizi_Container.prototype, 'opacity', {
    get: function () {
        return this.alpha * 255;
    },
    set: function (value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});


Lizi_Container.prototype.length = function () {
    return this.children.length
};

Lizi_Container.prototype.shoot = function (lizi) {
    lizi._cellSprites.forEach(function (i) {
        this.addChild(i)
    }, this)
};


Lizi_Container.prototype.dieout = function (lizi) {
    lizi._cellSprites.forEach(function (i) {
        this.removeChild(i)
    }, this)
};

/**
 * Updates the sprite for each frame.
 *
 * @method update
 */
Lizi_Container.prototype.update = function () {
    this.children.forEach(function (child) {
        if (child.update) {
            child.update();
        }
    });
};


/**
 * Sets the x and y at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the sprite
 * @param {Number} y The y coordinate of the sprite
 */
Lizi_Container.prototype.move = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z
};



function Lizi() {
    this.initialize.apply(this, arguments);
}


/**
 * 
 * @param target {{lizi:true, vlist:[] ,d:0 }}
 */
Lizi.prototype.initialize = function (name) {
    this.name = name || ""
    this._target = null
    this._cellSprites = []
    this.x = 0
    this.y = 0
    this.realx = 0
    this.realy = 0
}


Lizi.prototype.update = function () {
    if (this._target) {
        this.updateLiziXY()
        this.updateLiziS()
        this.updateLiziD()
    }
}


Lizi.prototype.updateLiziXY = function () {
    if (this._target.vlist) {
        var vlist = this._target.vlist
        var vx = 0
        var vy = 0
        for (var i = vlist.length - 1; i >= 0; i--) {
            var v = vlist[i]
            v[0] += vx
            v[1] += vy
            vx = v[0]
            vy = v[1]
        }
        this.x = vx
        this.y = vy
    }
}

Lizi.prototype.updateLiziD = function () {
    this._target.d = this._target.d || 0
    this._target.d--
    if (this._target.d <= 0) {
        this.todieout()
    }
}
Lizi.prototype.todieout = function () {
    $liziSpriteset.dieout(this) 
}


Lizi.prototype.updateLiziS = function () {
    if (this._target.shoot) {
        var shoot = this._target.shoot
        shoot.d = shoot.d || 0
        shoot.newd = shoot.newd || 0
        shoot.newd--
        if (shoot.newd <= 0) {
            shoot.fun && shoot.fun(this)
            shoot.newd = shoot.d
        }
    }
}
 

function Lizi_Sprite() {
    this.initialize.apply(this, arguments);
}


Lizi_Sprite.prototype = Object.create(Lizi.prototype);
Lizi_Sprite.prototype.constructor = Lizi_Sprite;


Lizi_Sprite.prototype.initialize = function (name, target, bitmap, hide) {
    Lizi.prototype.initialize.call(this, name);
    this.parent = null
    this._target = target
    this._cellSprites = []
    var s = new Sprite(bitmap)
    if (hide) { s.opacity = 0 }
    this._cellSprites.push(s)
}

Lizi_Sprite.prototype.update = function () {
    Lizi.prototype.update.call(this);
    this.updateMain();
};

Lizi_Sprite.prototype.updateMain = function () {
    this._cellSprites[0].x = this.x
    this._cellSprites[0].y = this.y
};

 

function Lizi_Animation() {
    this.initialize.apply(this, arguments);
}

Lizi_Animation.prototype = Object.create(Lizi.prototype);
Lizi_Animation.prototype.constructor = Lizi_Animation;

Lizi_Animation._checker1 = {};
Lizi_Animation._checker2 = {};

Lizi_Animation.prototype.initialize = function (name, target, animation, mirror, delay) {
    Lizi.prototype.initialize.call(this, name);
    this.initMembers();
    this.setup(target, animation, mirror, delay)
};

Lizi_Animation.prototype.initMembers = function () {
    this._target = null;
    this._animation = null;
    this._mirror = false;
    this._delay = 0;
    this._rate = 4;
    this._duration = 0;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._screenFlashDuration = 0;
    this._hidingDuration = 0;
    this._bitmap1 = null;
    this._bitmap2 = null;
    this._cellSprites = [];
    this._screenFlashSprite = null;
    this._duplicated = false;
    this.z = 8;
};

Lizi_Animation.prototype.setup = function (target, animation, mirror, delay) {
    this._target = target;
    this._animation = animation;
    this._mirror = mirror || false;
    this._delay = delay || 0;
    if (this._animation) {
        this.todieout();
        this.setupRate();
        this.setupDuration();
        this.loadBitmaps();
        this.createSprites();
    }
};



Lizi_Animation.prototype.setupRate = function () {
    this._rate = 4;
};

Lizi_Animation.prototype.setupDuration = function () {
    this._duration = this._animation.frames.length * this._rate + 1;
};

Lizi_Animation.prototype.update = function () {
    Lizi.prototype.update.call(this);
    this.updateMain();
    Lizi_Animation._checker1 = {};
    Lizi_Animation._checker2 = {};
};



Lizi_Animation.prototype.isPlaying = function () {
    return this._duration > 0;
};

Lizi_Animation.prototype.loadBitmaps = function () {
    var name1 = this._animation.animation1Name;
    var name2 = this._animation.animation2Name;
    var hue1 = this._animation.animation1Hue;
    var hue2 = this._animation.animation2Hue;
    this._bitmap1 = ImageManager.loadAnimation(name1, hue1);
    this._bitmap2 = ImageManager.loadAnimation(name2, hue2);
    this.bitmap = ImageManager.loadAnimation(name1, hue1);
};

Lizi_Animation.prototype.isReady = function () {
    return ImageManager.isReady();
};

Lizi_Animation.prototype.createSprites = function () {
    if (!Lizi_Animation._checker2[this._animation]) {
        this.createCellSprites();
        if (this._animation.position === 3) {
            Lizi_Animation._checker2[this._animation] = true;
        }
    }
    if (Lizi_Animation._checker1[this._animation]) {
        this._duplicated = true;
    } else {
        this._duplicated = false;
        if (this._animation.position === 3) {
            Lizi_Animation._checker1[this._animation] = true;
        }
    }
};

Lizi_Animation.prototype.createCellSprites = function () {
    this._cellSprites = [];

    var max = 0 
    for(var fi =0 ; fi< this._animation.frames.length ; fi++){
        var f = this._animation.frames[fi]
        max = Math.max( max , f.length) 
    }   
    for (var i = 0; i < max; i++) {
        var sprite = new Sprite();
        sprite.bitmap = this._bitmap1
        sprite.opacity = 0
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        this._cellSprites.push(sprite);
    }
};

Lizi_Animation.prototype.updateMain = function () {
    if (this.isPlaying() && this.isReady()) {
        if (this._delay > 0) {
            this._delay--;
        } else {
            this._duration--;
            this.updatePosition();
            if (this._duration % this._rate === 0) {
                this.updateFrame();
            }
        }
        if (!this.isPlaying()) {
            this.setupDuration()
        }
    }
};

Lizi_Animation.prototype.updatePosition = function () { 
    /* if (this._animation.position === 3) {
         
     } else {
         var parent = this._target.parent;
         var grandparent = parent ? parent.parent : null;
         this.x = this._target.x;
         this.y = this._target.y;
         if (this.parent === grandparent) {
             this.x += parent.x;
             this.y += parent.y;
         }
         if (this._animation.position === 0) {
             this.y -= this._target.height;
         } else if (this._animation.position === 1) {
             this.y -= this._target.height / 2;
         }
     }*/
};

Lizi_Animation.prototype.updateFrame = function () {
    if (this._duration > 0) {
        var frameIndex = this.currentFrameIndex();
        this.updateAllCellSprites(this._animation.frames[frameIndex]);
    }
};

Lizi_Animation.prototype.currentFrameIndex = function () {
    return (this._animation.frames.length -
        Math.floor((this._duration + this._rate - 1) / this._rate));
};

Lizi_Animation.prototype.updateAllCellSprites = function (frame) {
    for (var i = 0; i < this._cellSprites.length; i++) {
        var sprite = this._cellSprites[i];
        if (i < frame.length) {
            this.updateCellSprite(sprite, frame[i]);
        } else {
            sprite.opacity = 0;
        }
    }
};

Lizi_Animation.prototype.updateCellSprite = function (sprite, cell) {
    var pattern = cell[0];
    if (pattern >= 0) {
        var sx = pattern % 5 * 192;
        var sy = Math.floor(pattern % 100 / 5) * 192;
        var mirror = this._mirror;
        sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
        sprite.setFrame(sx, sy, 192, 192);
        sprite.x = this.x + cell[1];
        sprite.y = this.y + cell[2];
        if (this._mirror) {
            sprite.x *= -1;
        }
        sprite.rotation = cell[4] * Math.PI / 180;
        sprite.scale.x = cell[3] / 100;
        if ((cell[5] && !mirror) || (!cell[5] && mirror)) {
            sprite.scale.x *= -1;
        }
        sprite.scale.y = cell[3] / 100;
        sprite.opacity = cell[6];
        sprite.blendMode = cell[7];
    } else {
        sprite.opacity = 0;
    }
};




$liziSpriteset = new Lizi_Spriteset()














/*
SceneManager._scene.addChild($liziSpriteset)



a = new Lizi_Animation("name",
    {
        vlist: [[0, 0],[10,10],[0,-0.25]],
        d: 100,
        shoot: {
            d: 1,
            fun: function (a) {
                for(var i =0 ; i <=10 ; i++){
                    var x = Math.random() - 0.5 ;var y = Math.random() - 0.5 
                    var b = new Lizi_Animation("name",
                        {
                            vlist: [[a.x,a.y],[x *1,y*1]],
                            d: 20,
                        },$dataAnimations[1]
                    ) 
                   $liziSpriteset.shoot(b)  
                }
            }
        }
    },$dataAnimations[1]
) 
$liziSpriteset.shoot(a) 






SceneManager._scene.addChild($liziSpriteset)



a = new Lizi_Sprite("name",
    {
        vlist: [[0, 0],[10,10],[0,-0.25]],
        d: 100,
        shoot: {
            d: 1,
            fun: function (a) {
                for(var i =0 ; i <=10 ; i++){
                    var x = Math.random() - 0.5 ;var y = Math.random() - 0.5 
                    var b = new Lizi_Sprite("name",
                        {
                            vlist: [[a.x,a.y],[x *1,y*1]],
                            d: 20,
                        },ImageManager.loadAnimation("Attack1")
                    ) 
                   $liziSpriteset.shoot(b)  
                }
            }
        }
    },ImageManager.loadAnimation("Attack1")
) 
$liziSpriteset.shoot(a) 




*/
/*
var sprites = new PIXI.particles.ParticleContainer
for (var i = 0; i < totalSprites; i++) {
    // create a new Sprite
    var dude = new Sprite('img/animations/Attack1.png');


    // set the anchor point so the texture is centerd on the sprite
    dude.anchor.set(0.5);

    // different maggots, different sizes
    dude.scale.set(0.8 + Math.random() * 0.3);

    // scatter them all
    dude.x = Math.random() * app.renderer.width;
    dude.y = Math.random() * app.renderer.height;


    // create a random direction in radians
    dude.direction = Math.random() * Math.PI * 2;

    // this number will be used to modify the direction of the sprite over time
    dude.turningSpeed = Math.random() - 0.8;

    // create a random speed between 0 - 2, and these maggots are slooww
    dude.speed = (2 + Math.random() * 2) * 0.2;

    dude.offset = Math.random() * 100;

    // finally we push the dude into the maggots array so it it can be easily accessed later
    maggots.push(dude);

    sprites.addChild(dude);
}





 

s = new Lizi_Container()
a = new Lizi_Sprite(
    {
        vlist: [[0.01, 0.01], [0.01, 0.02]],
        d: 1000,
  
    },ImageManager.loadAnimation("Attack1")
)
a.x = 0
a.y = 0
SceneManager._scene.addChild(s)
a.shoot(a, s)




s = new Lizi_Container()

SceneManager._scene.addChild(s) 



a = new  Lizi_Animation({
        vlist: [[0.01, 0.01], [0.01, 0.02]],
        d: 1000,
  
    },$dataAnimations[1],


)

a.x = 0
a.y = 0
s.shoot(a)





a = new Lizi_Sprite(
    {
        vlist: [[1, 1]],
        d: 1000,
        shoot: {
            alld: 10,
            fun: function (a,s) {

                for(var i =0 ; i < 10 ; i++){
                    var x = Math.random() - 1 
                    var b = new Lizi_Sprite(
                        {
                            vlist: [[x,-0.1]],
                            d: 1000,


                        },ImageManager.loadAnimation("Attack1")
                    )
                    b.x = a.x
                    b.y = a.y
                    s.shoot(b) 

                }
            }
        }
    }
)
a.x = 0
a.y = 0
s.shoot(a)



s = new Lizi_Spriteset()




SceneManager._scene.addChild($liziSpriteset)



a = new Lizi_Animation(
    {
        vlist: [[200, 300]],
        d: 1000,
        shoot: {
            d: 1000,
            fun: function (a,s) { 
                for(var i =0 ; i < 10 ; i++){
                    var x = Math.random() - 0.5 ;var y = Math.random() - 0.5 
                    var b = new Lizi_Animation(
                        {
                            vlist: [[a.x,a.y],[x,y]],
                            d: 1000,
                        },$dataAnimations[1]
                    )
                    s.shoot(b)  
                }
            }
        }
    },$dataAnimations[1]
) 
s.shoot(a) 
*/
