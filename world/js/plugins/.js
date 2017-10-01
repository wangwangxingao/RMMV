function Card() {
    this.initialize.apply(this, arguments);
}

Card.prototype.constructor = Card;
/**初始化 */
Card.prototype.initialize = function(id) {
    this._name = id
    this._childern = []
    this._father = null
    this._type = {}
};


Card.prototype.setFather = function(father) {
    this._father = father
}

Card.prototype.childindex = function(card) {
    return this._childern.indexOf(card)
};

Card.prototype.addchild = function(card) {
    var index = this.childindex(card)
    if (index < 0) {
        this._childern.push(card)
        card.setFather(this)
    }
};

Card.prototype.removechild = function(card) {
    var index = this.childindex(card)
    if (index >= 0) {
        this._childern.slice(index.indexOf(card), 1)
        card.setFather(null)
    }
};

Card.prototype.addType = function(type, value) {
    this._type = this._type || {}
    this._type[type] = this._type[type] || []
    this._type[type].push(value)
};

cards = {
    1: [
        { type: "名称", value: "测试卡牌" },
        { type: "种类", value: "战魂" },
        { type: "属性", value: "火" },
        { type: "法力石", value: "火" },
        { type: "费用", value: "火2无2" },
        { type: "攻击", value: 10 },
        { type: "防守", value: 10 },
        { type: "组卡", value: 3 },
    ]
}


制作卡牌 = function(z) {
    var card = new Card("卡")
    for (var i = 0; i < z.length; i++) {
        var o = z[i]
        card.addType(o.type, o.value)
    }
    return card
}
制作卡牌组 = function() {
    var cz = []
    var list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    for (var i = 0; i < list.length; i++) {
        var z = list[i]
        var card = 制作卡牌(cards[z])
        cz.push(card)
    }
    return cz
}



制作区域 = function() {

    var 游戏区域 = {
        A: {
            主卡组: [],
            额外卡组: [],
            手牌: [],
            场上: {
                攻击: {
                    1: null,
                    2: null,
                    3: null
                },
                防守: {
                    1: null,
                    2: null,
                    3: null
                },
                魔法: []
            },
            使用中: [],
            墓地: [],
            除外: []
        },
        B: {
            主卡组: [],
            额外卡组: [],
            手牌: [],
            场上: {
                攻击: {
                    1: null,
                    2: null,
                    3: null
                },
                防守: {
                    1: null,
                    2: null,
                    3: null
                },
                魔法: []
            },
            使用中: [],
            墓地: [],
            除外: []
        },
    }

    var makeCard = function(o, c) {
        for (var i in o) {
            var card = new Card(i)
            c.addchild(card)
            makeCard(o[i], card)
        }
        return c
    }
    return makeCard(游戏区域, new Card("游戏区域"))
}



function Scene_Card() {
    this.initialize.apply(this, arguments);
}

Scene_Card.prototype = Object.create(Scene_Base.prototype);
Scene_Card.prototype.constructor = Scene_Card;

Scene_Card.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Card.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    制作区域()
    制作卡组()
};

Scene_Card.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
};

Scene_Card.prototype.update = function() {

    Scene_Base.prototype.update.call(this);
};

Scene_Card.prototype.isBusy = function() {
    return Scene_Base.prototype.isBusy.call(this);
};

Scene_Card.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
};




function Character(position, state) {
    this.state = state;
    this.position = position;

    Character.prototype.setBuff(buff) {
        this.buff = buff;
    }

    Character.prototype.removeBuff(buff) {
        this.buff = "没有光环了哦";
    }

    Character.prototype.spellBuff = function(buff) {
        this.buffmanager = new BuffManager(this, buff);
    }
    Character.prototype.updateBuff = function() {
        if (state != "我不受影响") {
            BuffManager.trigger(this)
        } else if (state === "我不受影响") {
            BuffManager.remove(this);
        }
        return buff;
    }

}

function BuffManager(character, buff) {
    this.buff = buff;
    this.CharacterSpeller = character;
    BuffManager.prototype.trigger = function(CharacterAccepter) {
        if (CharacterSpeller.postion + buff.scope > CharacterAccepter.position) {
            CharacterAccepter.setBuff(buff);
        }
    }
    BuffManager.prototype.remove = function(CharacterAccepter) {
        CharacterAccepter.removeBuff(buff);
    }
}

function Buff(name, scope) {
    this.name = name
    this.scope = scope;
}




var 施法者 = new Character([2, 3], "我受影响")
var 受影响者 = new Character([1, 3], "我受影响")
var 怪胎 = new Character([3, 4], "我不受影响")

var 你的光环接好了 = new Buff("你的益达", 1);

施法者.spellBuff(你的光环接好了)

游戏.update = () => {
    for (var 每个角色 in o) {
        每个角色.updateBuff()
    }
}