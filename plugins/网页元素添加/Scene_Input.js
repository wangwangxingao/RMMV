
//=============================================================================
// Scene_Input.js
//=============================================================================
/*:
 * @plugindesc 输入场景  
 * @author wangwang
 *
 * @param  Scene_Input
 * @desc 插件 输入场景,作者:汪汪
 * @default 汪汪 
 *
 * @help  
 * 事件脚本或脚本中使用
 * SceneManager.push(Scene_Input)
 * 进入输入场景
 */ 

function Scene_Input() {
    this.initialize.apply(this, arguments);
}



Scene_Input.prototype = Object.create(Scene_Base.prototype);
Scene_Input.prototype.constructor = Scene_Input;
//初始化
Scene_Input.prototype.initialize = function () {
    Scene_Base.prototype.initialize.call(this);
    this._set = {
        "okp": ["ok", 200, 400],
        "nop": ["no", 300, 400],
        "input": [["name", "input", {
            "type": "text",
            "sz": { "x": 200, "y": 250, "width": 200, "height": 40, "fontSize": 35 }
        }], ["pass", "input", {
            "type": "password",
            "sz": { "x": 200, "y": 300, "width": 200, "height": 40, "fontSize": 35 }
        }], ["pass1", "input", {
            "type": "password",
            "sz": { "x": 200, "y": 350, "width": 200, "height": 40, "fontSize": 35 }
        }]
        ]
    }
};
//准备
Scene_Input.prototype.prepare = function (set) {
    this._set = set ||  this._set
};



//创建
Scene_Input.prototype.create = function () {
    Scene_Base.prototype.create.call(this);
    this.createBackground()
    this.createInputs()

    this.createButton()
};

Scene_Input.prototype.createBackground = function () {
    //背景精灵1 = 新 精灵
    this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
    //背景精灵2 = 新 精灵
    this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
    //添加子项(  背景精灵1 )
    this.addChild(this._backSprite1);
    //添加子项(  背景精灵2 )
    this.addChild(this._backSprite2);
};

Scene_Input.prototype.createInputs = function () {
    console.log(this._set, this)
    this._inputs = {}
    if (this._set && this._set.input) {
        var h = this._set.input
        for (var i = 0; i < h.length; i++) {
            var l = h[i]
            if (Array.isArray) {
                this._inputs[l[0]] = Graphics._createElement.apply(Graphics, l)
            }
        }
    }
};


Scene_Input.prototype.createButton = function () {
    this._okSprite = new Sprite()

    if (this._set && this._set.okp) {
        var h = this._set.okp
        this._okSprite.bitmap = ImageManager.loadPicture(h[0]);
        this._okSprite.x = h[1]
        this._okSprite.y = h[2]
    }
    this._noSprite = new Sprite()

    if (this._set && this._set.nop) {
        var h = this._set.nop
        this._noSprite.bitmap = ImageManager.loadPicture(h[0]);
        this._noSprite.x = h[1]
        this._noSprite.y = h[2]
    }
    this.addChild(this._okSprite)
    this.addChild(this._noSprite)
};


//开始
Scene_Input.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
};


//输入初始化 

Scene_Input.prototype.trim = function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}
Scene_Input.prototype.ltrim = function (s) {
    return s.replace(/(^\s*)/g, "");
}
Scene_Input.prototype.rtrim = function (s) {
    return s.replace(/(\s*$)/g, "");
}


Scene_Input.prototype.update = function () {
    Scene_Base.prototype.update.call(this)

    this.updateInput()
    this.updateTouchInput()
};



Scene_Input.prototype.updateInput = function () {
    if (Input.isTriggered("ok")) {
        this.onInputOk()
    } else if (Input.isTriggered("escape")) {
        this.onInputNo()
    }
};



Scene_Input.prototype.updateTouchInput = function () {
    if(TouchInput.isTriggered()){
        if (this.isButtonTouched(this._okSprite)) {
            this.onInputOk()
        } else if (this.isButtonTouched(this._noSprite)) {
            this.onInputNo()
        } 
    }

};



Scene_Input.prototype.trim = function (s) {
    return ("" + s).replace(/(^\s*)|(\s*$)/g, "");
}
Scene_Input.prototype.ltrim = function (s) {
    return ("" + s).replace(/(^\s*)/g, "");
}
Scene_Input.prototype.rtrim = function (s) {
    return ("" + s).replace(/(\s*$)/g, "");
}



Scene_Input.prototype.isButtonTouched = function (s) {
    if (!s) { return false }
    //x = 画布到局部x(触摸输入 x)
    var x = this.canvasToLocalX(TouchInput.x, s);
    //y = 画布到局部y(触摸输入 y)
    var y = this.canvasToLocalY(TouchInput.y, s);
    //返回 x >=0 并且 y >=0 并且 x < 宽 并且 y < 高
    return x >= 0 && y >= 0 && x < s.width && y < s.height;
};

Scene_Input.prototype.canvasToLocalX = function (x, s) {
    var node = s || this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};

Scene_Input.prototype.canvasToLocalY = function (y, s) {
    var node = s || this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};


//当输入确定
Scene_Input.prototype.onInputOk = function () {
    var o = {}
    for (var i in this._inputs) {
        o[i] = "" + this._inputs[i].value
    }
    alert(JSON.stringify(o))
};

Scene_Input.prototype.onInputNo = function () {
    var o = {}
    for (var i in this._inputs) {
        o[i] = "" + this._inputs[i].value
    }
    alert(JSON.stringify(o)) 
};