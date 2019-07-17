//=============================================================================
// 2w_bubbleup.js
//=============================================================================
/*:
 * @plugindesc 事件气泡
 * @author wangwang
 *
 * @param  2w_bubbleup 
 * @desc 插件 事件气泡 ,作者:汪汪
 * @default  汪汪
 *
 * @param bshowup
 * @desc  显示并弹出时默认设置 图片id,原点,开始时的x,y,x比例,y比例,透明度,结束时的x,y,x比例,y比例,透明度,时间
 * @default [1,0,0,-100,100,100,0,0,-200,100,100,255,30]
 * 
 * @param bshowdown
 * @desc 显示并弹回时默认设置 图片id,原点,开始时的x,y,x比例,y比例,透明度,结束时的x,y,x比例,y比例,透明度,时间
 * @default [1,0,0,-200,100,100,255,0,-100,100,100,0,30]
 * 
 * @param bmoveup
 * @desc  移动弹出时的默认设置 图片id,原点,开始时的x,y,x比例,y比例,透明度,结束时的x,y,x比例,y比例,透明度,时间
 * @default [1,0,0,-100,100,100,0,0,-200,100,100,255,30]
 * 
 * @param bmovedown
 * @desc  移动弹回时的默认设置 图片id,原点,开始时的x,y,x比例,y比例,透明度,结束时的x,y,x比例,y比例,透明度,时间
 * @default [1,0,0,-200,100,100,255,0,-100,100,100,0,30]
 *  
 * @param bmovese
 * @desc  移动开始到结束的设置  图片id,原点,开始时的x,y,x比例,y比例,透明度,结束时的x,y,x比例,y比例,透明度,时间
 * @default [1,0,0,-200,100,100,255,0,-100,100,100,0,30]
 *   
 * @param bmoveto
 * @desc  移动到目标的默认设置   结束时的 图片id,原点,x,y,x比例,y比例,透明度,时间
 * @default [1,0,0,-200,100,100,0,60]
 *    
 * 
 * @help 
 *
 *=========================================
 * 注释写法
 *=========================================
 *
 *  写在注释中,一个设置用一条注释
 * 条件及处理  [条件,参数1,参数2,处理操作] 
 * 条件   "nearin"  进入区域  "nearout" 离开区域
 *  
 *  参数1 为数组时(x,y,x,y)
 *  参数2  为0时, 角色坐标在其中时为进入区域
 *  参数2  为1时, 角色到事件的xy差距(有方向)在其中时为进入区域
 *  参数2  为2时, 角色到事件的xy距离(无方向)在其中时为进入区域
 *  
 *  参数1 为数字 并且参数2 为 正数  角色到事件的x距离小于参数1,y距离小于参数2时  为进入
 *  参数1 为数字 并且参数2 为 -1  角色到事件的xy距离和小于参数1 时为进入
 *  参数1 为数字 并且参数2 为 -2  角色到事件的距离小于参数1 时为进入
 *
 *
 *  
 *  ◆注释：这样是在进入x<=2并且y<=2时触发,弹出一个图片,
 *  ：　　：参数为 1号图片,原点0,
 *  ：　　：初始x 0, 初始y -100 , x比例100,y比例100,透明度0 
 *  ：　　：目标x 0,目标y -200 , x比例100,y比例100,透明度255
 *  ：　　：图片名为 w/[200,100,"test"]  
 *  ◆注释：如果设置第二行参数,则为默认
 *  ：　　：bup 显示并向上弹出,bdown 显示并向下弹出
 *  ：　　：bmoveup 只移动向上弹出,bmovedown 只移动向下弹出
 *  ：　　：bmovest 只移动,bmoveto 移动到
 *  ：　　：bup和bdown会初始化一个图片,其他不会
 *  ◆注释：["nearin",1,1,"bshowup"]
 *  ：　　：[1,0,0,-100,100,100,0,0,-200,100,100,255,30]
 *  ：　　：w/[200,100,"test"]
 *  ◆注释：这样是在离开x<=2并且y<=2时触发,移动一个图片 
 *  ：　　：参数为 1号图片,原点0,
 *  ：　　：初始x 0, y -200 , x比例100,y比例100,透明度255
 *  ：　　：目标x 0, y -100 , x比例100,y比例100,透明度0 
 *  ：　　：如果不设置第二行内容,则为默认设置
 *  ：　　：bmoveup 为默认向上移动, bmovedown 为默认向下移动 ,他们不会初始化事件
 *  ◆注释：["nearout",1,1,"bmovedown"]
 *  ：　　：[1,0,0,-200,100,100,255,0,-100,100,100,50,30]
 *  ◆注释：["nearout",[3,0,4,0],2,"bmoveto"]
 *  ：　　：[1,0,100,-200,100,100,255,30]
 *
 *
 *=========================================
 * 图片id
 *=========================================
 * 图片id为 
 * event-地图id-事件id-图片id
 * 如
 * "event-5-1-1"
 *  
 *  
 * 
 */

var ww = ww || {};
ww.bubbleup = {};

ww.plugin = ww.plugin || { find: function (n, l, p, m) { l = PluginManager._parameters; p = l[(n || "").toLowerCase()]; if (!p) { for (m in l) { if (l[m] && n in l[m]) { p = l[m] } } }; return p || {} }, parse: function (i) { try { return JSON.parse(i) } catch (e) { try { return eval(i) } catch (e2) { return i } } }, get: function (n, o, p) { o = o || {}; p = this.find(n); for (n in p) { o[n] = this.parse(p[n]) }; return o } };



ww.bubbleup.bshowup =[1,0,0,-100,100,100,0,0,-200,100,100,255,30]
ww.bubbleup.bshowdown =[1,0,0,-200,100,100,255,0,-100,100,100,0,30]

ww.bubbleup.bmoveup =[1,0,0,-100,100,100,0,0,-200,100,100,255,30]
ww.bubbleup.bmovedown =[1,0,0,-200,100,100,255,0,-100,100,100,0,30]
ww.bubbleup.bmovese =[1,0,0,-200,100,100,255,0,-100,100,100,0,30]
ww.bubbleup.bmoveto  = [1,0,0,-200,100,100,0,30]


ww.plugin.get("2w_bubbleup", ww.bubbleup)




ww.bubbleup.Game_CharacterBase_prototype_initialize = Game_CharacterBase.prototype.initialize


Game_CharacterBase.prototype.initialize = function () {
    ww.bubbleup.Game_CharacterBase_prototype_initialize.apply(this, arguments);
    if (!this._screen) {
        this._screen = new Game_Picture()
        this._screen._worldId = "char"
        this._screen._worldPictureId = "char"
    }
};

ww.bubbleup.Game_CharacterBase_prototype_update = Game_CharacterBase.prototype.update
Game_CharacterBase.prototype.update = function () {
    ww.bubbleup.Game_CharacterBase_prototype_update.apply(this, arguments);
    if (this._screen) {
        this._screen.update()
    }
};



ww.bubbleup.Game_Player_prototype_initialize = Game_Player.prototype.initialize
Game_Player.prototype.initialize = function () {
    ww.bubbleup.Game_Player_prototype_initialize.apply(this, arguments);
    if (!this._screen) {
        this._screen = new Game_Picture()
    }
    this._screen._worldId = "party0"
    this._screen._worldPictureId = "party0"
};


ww.bubbleup.Game_Follower_prototype_initialize = Game_Follower.prototype.initialize
Game_Follower.prototype.initialize = function (memberIndex) {
    ww.bubbleup.Game_Player_prototype_initialize.apply(this, arguments);
    if (!this._screen) {
        this._screen = new Game_Picture()
    }
    this._screen._worldId = "party" + memberIndex
    this._screen._worldPictureId = "party" + memberIndex
};

ww.bubbleup.Game_Event_prototype_initialize = Game_Event.prototype.initialize
Game_Event.prototype.initialize = function (mapId, eventId) {
    ww.bubbleup.Game_Event_prototype_initialize.apply(this, arguments);
    if (!this._screen) {
        this._screen = new Game_Picture()
    }
    this._screen._worldId = "event"+"-" + mapId + "-" + eventId
    this._screen._worldPictureId = "event"+"-" +   mapId + "-" + eventId
};

ww.bubbleup.Game_Event_prototype_update = Game_Event.prototype.update 
Game_Event.prototype.update = function (mapId, eventId) {
    ww.bubbleup.Game_Event_prototype_update.apply(this, arguments);
    this.updatePageInterPerter()
};




ww.bubbleup.Sprite_Character_prototype_initialize = Sprite_Character.prototype.initialize
Sprite_Character.prototype.initialize = function (character) {
    //精灵基础 初始化 呼叫(this)
    ww.bubbleup.Sprite_Character_prototype_initialize.apply(this, arguments);

    if (character._screen) {
        this._screen = new Sprite_MorePicture(character._screen)
        this.addChild(this._screen)
    } 
};


ww.bubbleup.Sprite_Character_prototype_update = Sprite_Character.prototype.update
Sprite_Character.prototype.update = function () {
    //精灵基础 更新 呼叫(this)
    ww.bubbleup.Sprite_Character_prototype_update.call(this);
    //更新其他()
    this.updatePictures();
};

Sprite_Character.prototype.updatePictures = function () {
    if (this._screen) {
        this._screen.update()
    }
};





/**开始事件 
 * @param {number} id 事件id
 * @param {[number]} x x坐标
 * @param {[number]} y y坐标
 * 
 * */
Game_Map.prototype.eventStart = function (id, x,y) {
    if (label) {
        var e = this.event(id)
        if(e){ 
            e.checkEventNear(x,y) 
        }
    }
};


ww.bubbleup.Game_Event_prototype_setupPage = Game_Event.prototype.setupPage
Game_Event.prototype.setupPage = function () {
    ww.bubbleup.Game_Event_prototype_setupPage.call(this)
    this.setupLabel()
};

/**安装标签 */
Game_Event.prototype.setupLabel = function () {
    this._label = null // 
    var have = false
    var list=this.event()&&this.page()&&this.list()
    if (list) {
        var label = new Game_Label(this)
        var l = []
        for (var i = 0; i < list.length; i++) {
            var command = list[i];
            if (command.code === 108) {
                have = true
                var l = label.addLabel(command.parameters[0])
            } else if (command.code === 408) {
                l.push(command.parameters[0]);
            }
        }
    }
    this._label = have ? label : null
    return
}

/**
 *运行页面
 */
Game_Event.prototype.startPage = function (id) {
       var id = id -1 
    if (!this._pageinterpreter) {
        this._pageinterpreter = new Game_Interpreter()
    }
    this._pageinterpreter.setup( this.event().pages[id] && this.event().pages[id].list,this._eventId);
    this._pageinterpreter.update();
};

/**更新页内容 */
Game_Event.prototype.updatePageInterPerter = function ( ) { 
    if (this._pageinterpreter) {
        //如果 (不是 事件解释器 是运转() )
        if (!this._pageinterpreter.isRunning()) {
            //事件解释器 安装(列表(),事件id)
            this._pageinterpreter = null;
        }
        if(this._pageinterpreter){
            //事件解释器 更新()
            this._pageinterpreter.update();
        }
    }
};


/**检查靠近*/
Game_Event.prototype.checkEventNear = function (x,y) {
    if (this._label) {
        this._label.startNear(x,y)
    }
};

ww.bubbleup.Game_Event_prototype_checkEventTriggerAuto =  
Game_Event.prototype.checkEventTriggerAuto  
Game_Event.prototype.checkEventTriggerAuto = function () {
    
    ww.bubbleup.Game_Event_prototype_checkEventTriggerAuto.call(this)
    this.checkEventNear($gamePlayer.x ,$gamePlayer.y )
};



Game_Event.prototype.isNearPlayer = function (v,x,y) {     
 
        if(!v){return 0}
        var isnear = false
        var x2 = x
        var y2 = y
        var v1 = v[1]  
        var v2 = v[2]  
            if(Array.isArray(v1)){ 
                if(v2==1){
                    x2 =  this.deltaXFrom(x) 
                    y2 =  this.deltaYFrom(y) 
                }else if(v2==2){
                    x2 = Math.abs(this.deltaXFrom(x))
                    y2 = Math.abs(this.deltaYFrom(y))
                }
                for(var i = 0;i<v1.length;i+=2){
                    if(v1[i]==x2 && v1[i+1]==y2){
                        var isnear = true
                    }
                }
            } else{ 
                x2 = Math.abs(this.deltaXFrom(x))
                y2 = Math.abs(this.deltaYFrom(y))
                var v1 = v1 * 1
                var v2 = v2 * 1
                if (v2 == -1) {
                    var isnear = (x2 + y2 <= v1)
                } else if (v2 == -2) {
                    var isnear = (Math.pow(x2, 2) + Math.pow(y2, 2) <= Math.pow(v1, 2))
                } else {
                    var isnear = (x2 <= v1 && y2 <= v2)
                }
            }
    return isnear
};


Game_Interpreter.prototype.thisEvent = function (param) {
    return $gameMap.event(param > 0 ? param : this._eventId);
};

Game_Interpreter.prototype.thisPicture = function (param) {
    return $gameScreen.picture(param > 0 ? param : 0);
};



function Game_Label() {
    this.initialize.apply(this, arguments);
}

Game_Label.prototype.initialize = function (event) {
    this.clear()
    this.event = event 
}

Game_Label.prototype.clear = function () {
    this.near = []
    this.stute = {}
}

Game_Label.prototype.addLabel = function (str) {
    if (str) {
        try {
            var v = JSON.parse( str) 
            if (v) {
                if  (v[0] == "nearout" || v[0] == "nearin") {
                    this.near.push(v)
                    return v
                }
            }
        } catch (error) {
        }
    }
    return []
}


/*
Game_Label.prototype.startEvent = function (str) {
    this._start = str
    if (this.event) {
        this.event.start(str)
    }
}
*/


Game_Label.prototype.defineParam = function (v, v2) {
    var l = []
    for (var i = 0; i < v.length; i++) {
        l[i] = v[i] === undefined ? v2[i] : v[i]
    }
    return l
} 
 
Game_Label.prototype.trim = function (s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}
Game_Label.prototype.ltrim = function (s) {
    return s.replace(/(^\s*)/g, "");
}
Game_Label.prototype.rtrim = function (s) {
    return s.replace(/(\s*$)/g, "");
}

Game_Label.prototype.startPage = function (v, s ,set) { 
    //console.log(v)
    if (v[4]) {
        var pageIndex = v[4] * 1
        this.event.startPage(pageIndex) 
    }
}

Game_Label.prototype.startbubble  = function (v, s ,set) { 
    var z = 4
    if (v[4]) {
        try {
            var o = JSON.parse(v[4] )
            var z = 5
        } catch (error) {
            var o = []
            var z = 4
        }
        var l = this.defineParam(o, set)
        var pi = l[0]
        var origin = l[1]
        var stx = l[2]
        var sty = l[3]
        var stsx = l[4]
        var stsy = l[5]
        var sto = l[6]
        var edx = l[7]
        var edy = l[8]
        var edsx = l[9]
        var edsy = l[10]
        var edo = l[11]
        var time = l[12] 
        var t = ""
        for (; z < v.length; z++) {
            t += v[z]
        } 
        if (t) {
            var n = this.trim(t)
        } else {
            var n = ""
        } 
        if (s==1) {
            this.event._screen.showPicture(pi, n, origin, stx, sty, stsx, stsy, sto, 0)
        }else if(s == 0){
            this.event._screen.movePicture(pi,  origin, stx, sty, stsx, stsy, sto, 0,0)
        }else if(s== 2 ){ 
            this.event._screen.movePicture(pi,  origin, stx, sty, stsx, stsy, sto, 0,edx) 
            return 
        }
        this.event._screen.movePicture(pi, origin, edx, edy, edsx, edsy, edo, 0, time)
    }
}

/**开始处理 */
Game_Label.prototype.start = function (v) { 
    if (v) {
        switch (v[3]) {
            case "bup":
            case "bshowup":
                this.startbubble(v, 1,ww.bubbleup.bshowup)
                break;
            case "bdown":
            case "bshowdown":
                this.startbubble(v, 1,ww.bubbleup.bshowdown)
                break;
            case "bmoveup":
                this.startbubble(v, 0,ww.bubbleup.bmoveup)
                break;
            case "bmovedown":
                this.startbubble(v, 0,ww.bubbleup.bmovedown)
                break;
            case "bmovese":
                this.startbubble(v, 0,ww.bubbleup.bmovese)
                break; 
            case "bmoveto":
                this.startbubble(v, 2,ww.bubbleup.bmoveto)
                break;
            case "eval":
                this.startEval(v)
                break;
            case "page":
                this.startPage(v)
            default:
                break;
        } 
    }
}

Game_Label.prototype.startEval = function (v) {

    var z = 4
    var t = ""
    for (; z < v.length; z++) {
        t += v[z] + ";"
    }
    var e = this.event
    var p = this.event._screen
    var s = p
    try {
        eval(t)
    } catch (error) {
        console.log(t)
    } 
}

/**开始标签 */
Game_Label.prototype.startNear = function (x, y) {
    var t = this.stuteCheck("x", x)
    t = this.stuteCheck("y", y) || t

    if (t && this.near) {
        for (var vi = 0; vi < this.near.length; vi++) {
            var v = this.near[vi]
            var isnear = this.event.isNearPlayer(v,x,y)
            var key = v[0] + "," + vi
            if (this.stuteCheck(key, isnear)) {
                if (isnear) {
                    if (v[0] == "nearin") {
                        this.start(v)
                     }
                } else {
                    if (v[0] == "nearout") {
                        this.start(v) 
                    }
                }
            }
        }
    }
}




/**状态检查 */
Game_Label.prototype.stuteCheck = function (i, v) {
    if (this.stute[i] === v) {
        return false
    } else {
        this.stute[i] = v
        return true
    }
}

/**获取状态 */
Game_Label.prototype.getStute = function (i) {
    return this.stute[i]
}
/**设置状态 */
Game_Label.prototype.setStute = function (i, v) {
    this.stute[i] = v
}


