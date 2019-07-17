

//=============================================================================
// ww_autosl.js
//=============================================================================

/*: 
 *
 * @name ww_autosl 
 * @plugindesc 自动存档
 * @author 汪汪
 * @version 1.0 
 * 
 * @param ww_autosl 
 * @desc  自动存档 版本
 * @default 1.0
 * 
 * @param saveid
 * @desc  使用的存档id,为0时不保存
 * @default  0
 * 
 * @param wait 
 * @desc  定时保存的帧数,为0时不保存
 * @default  36000
 * 
 * @param out 
 * @desc  离开时是否保存(地图或者菜单中有效)
 * @default  true
 * 
 * @param ask 
 * @desc  离开时是否询问,没有则不询问
 * @default  "是否离开游戏"
 * 
 */


var ww = ww || {};

ww.plugin = ww.plugin || { find: function (n, l, p, m) { l = PluginManager._parameters; p = l[(n || "").toLowerCase()]; if (!p) { for (m in l) { if (l[m] && n in l[m]) { p = l[m] } } }; return p || {} }, parse: function (i) { try { return JSON.parse(i) } catch (e) { try { return eval(i) } catch (e2) { return i } } }, get: function (n, o, p) { o = o || {}; p = this.find(n); for (n in p) { o[n] = this.parse(p[n]) }; return o } };


ww.autosl = {
    ww_autosl: 1.0,
    saveid: 1,
    wait: 3600,
    out: true,
    ask: "是否离开游戏",
};
/**获取设置 */
ww.plugin.get("ww_autosl", ww.autosl);



/**
 * 保存游戏
 * 
 */
ww.autosl.save = function () {
    if (this.saveid) {
        if (!$gameParty.inBattle()) {
            console.log("save")
            this.time = 0
            return ww.fastsl.save(this.saveid)
        }
    }
};

/**
 * 自动保存调用
 */
ww.autosl.autosave = function () {
    if (this.saveid) {
        if ($gameSystem.isSaveEnabled() && !$gameMap.isEventRunning()) {
            return this.save()
        }
    }
};

/**
 * 按时间保存
 */
ww.autosl.timeSave = function () {
    if (this.saveid && this.wait>0) {
        if (this.time > this.wait) {
            this.autosave()
        } else {
            this.time++
        }
    }
};

/**是地图场景 */
ww.autosl.isMap = function () {
    return SceneManager._scene && SceneManager._scene.constructor == Scene_Map
};

/**
 * 自动保存调用
 */
ww.autosl.mapSave = function () {
    this.autosave()
};

/**
 * 时间保存
 */
ww.autosl.mapTimeSave = function () {
    this.timeSave()
};


/**是有效菜单 */
ww.autosl.isMenu = function () {
    return SceneManager._stack[0] == Scene_Map
};

/**
 * 菜单保存
 * 
 */
ww.autosl.menuSave = function () {
    if (this.saveid && this.isMenu()) {
        return this.autosave()
    }
}

/**
 * 菜单自动保存
 * 
 */
ww.autosl.menuTimeSave = function () {
    if (this.saveid && this.isMenu()) {
        this.timeSave()
    }
}



/**
 * 离开时保存
 * 
 */
ww.autosl.outSave = function () {
    if (this.saveid && this.out) {
        if(this.isMap()||this.isMenu()){
            this.autosave() 
        }
    }
}




/**地图保存 */
ww.autosl._Scene_Map_prototype_start = Scene_Map.prototype.start
Scene_Map.prototype.start = function () {
    ww.autosl._Scene_Map_prototype_start.call(this)
    ww.autosl.mapSave()
};

/**地图自动保存 */
ww.autosl._Scene_Map_prototype_update = Scene_Map.prototype.update
Scene_Map.prototype.update = function () {
    ww.autosl._Scene_Map_prototype_update.call(this);
    ww.autosl.mapTimeSave()
};

/**菜单保存 */
ww.autosl._Scene_MenuBase_prototype_start = Scene_MenuBase.prototype.start
Scene_MenuBase.prototype.start = function () {
    ww.autosl._Scene_MenuBase_prototype_start.call(this)
    ww.autosl.menuSave()
};

/**菜单自动保存 */
ww.autosl._Scene_MenuBase_prototype_update = Scene_MenuBase.prototype.update
Scene_MenuBase.prototype.update = function () {
    ww.autosl._Scene_MenuBase_prototype_update.call(this);
    ww.autosl.menuTimeSave()
};




ww.htmlon = ww.htmlon || {};
ww.htmlon.beforeunload = function (e) {
    ww.autosl.outSave()
    if (ww.autosl.ask) {
        var e = window.event || e;
        return e.returnValue = ww.autosl.ask
    }
};

ww.winon = ww.winon || {};
ww.winon.close = function (win) {
    ww.autosl.outSave()
    if (!ww.autosl.ask || confirm(ww.autosl.ask)) {
        win.hide()
        win.close(true)
    }
};