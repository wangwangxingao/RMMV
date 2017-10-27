function Scene_Title() {
    this.initialize.apply(this, arguments);
}

Scene_Title.prototype = Object.create(Scene_Base.prototype);
Scene_Title.prototype.constructor = Scene_Title;

Scene_Title.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Title.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.map = []
    this.move = this.makeZhangai()
};

Scene_Title.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
};

Scene_Title.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    this.updateMain()
    this.updateMap()
};


Scene_Title.prototype.isBusy = function() {
    return Scene_Base.prototype.isBusy.call(this);
};

Scene_Title.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    SceneManager.snapForBackground();
};



Scene_Title.prototype.updateMain = function() {
    if (Input.dir4) {
        var move = this.move
        var x = -(5 - Input.dir4) % 3
        var y = (5 - Input.dir4 + x) / 3
        move.x += x
        move.y += y
        if (!Input.isPressed("ok")) {
            if (move.x < 0 || move.y < 0 || move.x > 860 || move.y > 640) {
                move.x -= x
                move.y -= y
            } else {
                for (var i = 1; i < this.map.length; i++) {
                    if (!this.map[i]) { continue }
                    var move2 = this.map[i]
                    if (Collides.collidesWith(move, move2)) {
                        if (Input.isPressed("shift") || move.size > move2.size) {
                            this.eat(move, i)
                        } else {
                            this.move.x -= x
                            this.move.y -= y
                            break
                        }
                    }
                }
            }
        }
    }
    if (TouchInput.isPressed()) {
        this.move.x = TouchInput.x
        this.move.y = TouchInput.y
    }
    this.move.sprite.x = this.move.x
    this.move.sprite.y = this.move.y
}



Scene_Title.prototype.updateMap = function() {
    for (var i = 1; i < this.map.length; i++) {
        if (!this.map[i]) { continue }
        var move = this.map[i]
        move.x += move.vx * 0.1
        move.y += move.vy * 0.2
        if (move.x < 0 || move.y < 0 || move.x > 860 || move.y > 640) {
            move.x -= move.vx
            move.y -= move.vy
            move.vx = -move.vx
            move.vy = -move.vy
        } else {
            for (var z = 0; z < this.map.length; z++) {
                if (!this.map[z]) { continue }
                if (z == i) { continue }
                var move2 = this.map[z]
                if (Collides.collidesWith(move, move2)) {
                    if (move.size > move2.size) {
                        if (Math.random() > 0.4) {
                            this.eat(move, z)
                        }
                    } else if (move.size == move2.size) {
                        if (Math.random() > 0.9) {
                            this.eat(move, z)
                        }
                    } else {
                        move.x -= move.vx
                        move.y -= move.vy
                        move.x -= move.vx
                        move.y -= move.vy
                        move.vx = -move.vx
                        move.vy = -move.vy
                        break
                    }
                }

            }
        }
        move.sprite.x = move.x
        move.sprite.y = move.y

    }
}



Scene_Title.prototype.makeBitmap = function(size, color) {
    var b = new Bitmap(size, size)
    var color = color || '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
    b.fillAll(color);
    b.color = color
    return b
}

Scene_Title.prototype.makeZhangai = function() {
    var size = Math.randomInt(15) + 15
    var move = new AABB(size, size)
    move.size = size
    move.sprite = new Sprite(this.makeBitmap(size))
    this.addChild(move.sprite)
    move.x = Math.randomInt(860)
    move.y = Math.randomInt(640)
    move.vx = (Math.randomInt(30) - 10)
    move.vy = (Math.randomInt(30) - 10)
    move.sprite.x = move.x
    move.sprite.y = move.y
    this.map.push(move)
    console.log(move)
    return move
}


Scene_Title.prototype.makeZhangais = function(z) {
    var z = z || 2
    while (z--) {
        this.makeZhangai()
    }
}


Scene_Title.prototype.eat = function(move, i) {
    if (i == 0) {
        return false
    }
    this.removeChild(this.map[i].sprite)
    var size = this.map[i].size
    this.map[i] = null
    this.big(move, size)
    return true
}


Scene_Title.prototype.big = function(move, size) {

    var size = move.size + 1 + size / 10
    move.set(size, size)
    move.size = size
    move.sprite.bitmap = this.makeBitmap(size, move.sprite.bitmap.color)
    move.vx = (Math.randomInt(30) - 10)
    move.vy = (Math.randomInt(30) - 10)
    return true
}