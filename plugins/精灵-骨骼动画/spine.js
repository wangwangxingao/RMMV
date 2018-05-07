
function Spine() {
    this.initialize.apply(this, arguments);
}

Spine.prototype = Object.create(PIXI.Container.prototype);
Spine.prototype.constructor = Spine;

Spine._spines = {}
Spine._spinescall = {}


Spine.request = function (name, fun) {
    if (!Spine._spines[name]) {
        if (!Spine._spinescall[name]) {
            Spine._spinescall[name] = []
            Spine._spinescall[name].push(fun)
            var loader = new PIXI.loaders.Loader();
            loader.add(name, 'spine/' + name + '.json').load(function (l, r) {
                Spine._spines[name] = r[name] && r[name].spineData
                while (Spine._spinescall[name].length) {
                    var f = Spine._spinescall[name].shift()
                    if (typeof f === 'function') {
                        f()
                    }
                }
            })
        } else {
            Spine._spinescall[name].push(fun)
        }
    } else {
        if (typeof fun === 'function') {
            fun()
        }
    }
}


Spine.prototype.initialize = function (name) {
    PIXI.Container.call(this);
    this.interactive = false; 
    this._loadListeners = []
    this._loading = false
    this._spine = null
    this._updateTime = 0.01
    this.spineName = name;
};

Object.defineProperty(Spine.prototype, 'spineName', {
    get: function () {
        return this._spineName;
    },
    set: function (value) {
        var value = value || ""
        if (this._spineName != value) {
            this.load(value)
        }
    },
    configurable: true
});

Object.defineProperty(Spine.prototype, 'updateTime', {
    get: function () {
        return this._updateTime;
    },
    set: function (value) {
        if (this._updateTime != value) {
            this._updateTime = value
        }
    },
    configurable: true
});


Object.defineProperty(Spine.prototype, 'spine', {
    get: function () {
        return this._spine;
    },
    set: function (value) {
        if (this._spine != value) {
            if (this._spine) {
                this.removeChild(this._spine)
            }
            this._spine = value
            if (value) {
                this.addChild(this._spine)
            }
        }
    },
    configurable: true
});



Object.defineProperty(Spine.prototype, 'state', {
    get: function () {
        return this._spine && this._spine.state;
    },
    configurable: false
});


Spine.prototype.load = function (name) {  
    this._spineName = name;
    this._loading = true
    this._loadListeners = []
    if (name) {
        Spine.request(name,
            this.setSpineDate.bind(this, name)
        )
    } else {
        this.setSpineDate("")
    }
}

Spine.prototype.setSpineDate = function (name) {
    if (this.spineName == name) {
        this._loading = false
        var data = Spine._spines[name] || null
        if (name && data) {
            var spine = new PIXI.spine.Spine(data);
            spine.skeleton.setToSetupPose(); 
            spine.update(0);
            spine.autoUpdate = false; 
            this.spine = spine  
        } else {
            this.spine = null
        }
 
        this._callLoadListeners()
    }
    
}


Spine.prototype.update = function () {
    if (this.spine) {
        this.spine.update(this._updateTime)
    }
}


Spine.prototype.isReady = function () {
    return !this._loading 
};


Spine.prototype.addLoadListener = function (listner) {
    if (!this.isReady()) {
        this._loadListeners.push(listner);
    } else {
        listner(this);
    }
};


Spine.prototype._callLoadListeners = function () {
    while (this._loadListeners.length > 0) {
        var listener = this._loadListeners.shift();
        listener(this);
    }
};


