//=============================================================================
// lockUsePage.js
//=============================================================================
/*:
 * @plugindesc lockUsePage,事件使用限定页
 * @author wangwang
 *
 * @param  lockUsePage
 * @desc 插件 事件队列 ,作者:汪汪  
 * @default 汪汪
 * 
 * 
 * 
 * @help
 * 
 * 
 * 
 * */


var ww = ww || {}
ww.lockUsePage = {} 
ww.EventBatch = ww.EventBatch || {};

/**通过数组设置事件锁定
 *
 * [事件id,事件值,事件id,事件值,事件id,事件值,.....]
 * ww.EventBatch.setEventLock([1,0,2,1,3,3])
 * 把1事件设置为0 ,2事件设置为1,3事件设置为3
 *
 * 如果第二个参数有值则调用 ww.EventBatch.setEventLock2
 *
 */
ww.EventBatch.setEventLock = function (l, l2, l3) {
    if (l2 !== undefined) { return this.setEventLock2(l, l2, l3) }
    if (!Array.isArray(l)) { l = [l] }
    for (var i = 0; i < l.length; i += 2) {
        var e = $gameMap.event(l[i])
        if (e) { e.refreshLockUse(l[i + 1]) }
    }
}


/**通过数组和数组设置事件锁定
 * 如果第二个参数为值,则前面事件都改为该值
 * 如果第3个参数为true,则前面的数组视为值
 *
 * [事件id,事件id,事件id,.....] ,[事件值,事件值,事件值,.....]
 *
 * ww.EventBatch.setEventLock2([1,2,3],[0,1,3])
 * 把1事件设置为0 ,2事件设置为1,3事件设置为3
 */
ww.EventBatch.setEventLock2 = function (l, l2, l3) {
    if (!l3 && Array.isArray(l2)) {
        if (!Array.isArray(l)) { l = [l] }
        for (var i = 0; i < l.length; i++) {
            var e = $gameMap.event(l[i])
            e && e.refreshLockUse(l2[i])
        }
    } else {
        ww.EventBatch.setEventLockV(l, l2)
    }
}


/**通过数组和值设置事件
 *
 * [事件id,事件id,事件id,.....] ,值
 * ww.EventBatch.setVarV([1,2,3],3)
 * 把1,2,3事件设置为0
 */
ww.EventBatch.setEventLockV = function (l, l2) {
    if (!Array.isArray(l)) { l = [l] }
    for (var i = 0; i < l.length; i++) {
        var e = $gameMap.event(l[i])
        e && e.refreshLockUse(l2[i])
    }
}


Game_Event.prototype.getCanUsePage = function (l) {
    if (l > 0) {
        var pages = this.event().pages;
        if (!pages[l - 1]) {
            return -l
        }
    }
    return l
}


/**设置锁定使用页 */
Game_Event.prototype.refreshLockUse = function (lock) {
    if (Array.isArray(lock)) {
        this.refreshLockUse2(0, lock)
    } else {
        this.refreshLockUse2(lock, 0)
    }
};

/**设置锁定使用页 */
Game_Event.prototype.refreshLockUse2 = function (lock, use) {
    this.setLockPage(lock)
    this.setUsePages(use)
    this.refresh()
};


/**设置锁定页 */
Game_Event.prototype.refreshLockPage = function (lock) {
    this.setLockPage(lock)
    this.refresh()
};


/**设置使用页 */
Game_Event.prototype.refreshLockPage = function (use) {
    this.setUsePages(use)
    this.refresh()
};

/**设置锁定页 */
Game_Event.prototype.setLockPage = function (l) {
    this._lockPage = this.getCanUsePage(l)
};


/**设置使用页 */
Game_Event.prototype.setUsePages = function (l) {
    var l2 = []
    if (Array.isArray(l)) {
        for (var i = 0; i < l.length; i++) {
            l2.push(this.getCanUsePage(l[i]) - 1)
        }
    } else {
        l2.push(this.getCanUsePage(l[i]) - 1)
    }
    this._usePages = l2

};



Game_Event.prototype.findLockPage = function () {
    return this._lockPage
};

Game_Event.prototype.findUsePages = function () {
    var l = this._usePages
    var pages = this.event().pages;
    for (var i = 0; i < l.length; i++) {
        var page = pages[l[i]];
        if (page && this.meetsConditions(page)) {
            return i;
        }
    }
    return -1;
};

ww.lockUsePage.findProperPageIndex = Game_Event.prototype.findProperPageIndex



Game_Event.prototype.findProperPageIndex = function () {
    if (this._lockPage) { return this._lockPage - 1 }
    if (this._usePages) { return this.findUsePages() }
    return ww.lockUsePage.findProperPageIndex.call(this);
};











