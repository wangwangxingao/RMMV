//=============================================================================
// EventBatch.js
//=============================================================================
/*:
 * @plugindesc EventBatch,事件队列
 * @author wangwang
 *
 * @param  EventBatch
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



ww.EventBatch = {}

/**
 * 运行方法并把数组的每个值传入
 * 举例 ,123事件erase
 * ww.EventBatch.do([1,2,3],function(i){var e = $gameMap.event(i); e && e.erase()}) 
 */
ww.EventBatch.do = function (l, f) {
    if (!Array.isArray(l)) { l = [l] }
    if (typeof f == "function") {
        for (var i = 0; i < l.length; i++) {
            f(l[i])
        }
    }
}

/**
 * 运行方法并把数组对应的事件传入
 * 
 * 举例 ,123事件erase
 * ww.EventBatch.doEvent([1,2,3],function(e){ e.erase()}) 
 * 
 */
ww.EventBatch.doEvent = function (l, f) {
    if (!Array.isArray(l)) { l = [l] }
    if (typeof f == "function") {
        for (var i = 0; i < l.length; i++) {
            var e = $gameMap.event(l[i])
            e && f(e)
        }
    }
}

/**
 * 运行数组对应事件的某个方法
 * 如 ww.EventBatch.doEventRun([1,2,3],"erase")
 * 运行 1,2,3事件的 "erase" 方法
 */
ww.EventBatch.doEventRun = function (l, f, v0, v1, v2, v3, v4, v5) {
    if (!Array.isArray(l)) { l = [l] }
    for (var i = 0; i < l.length; i++) {
        var e = $gameMap.event(l[i])
        e && e[f] && e[f](v0, v1, v2, v3, v4, v5)
    }
}



/**通过数组设置变量
 * 
 * [变量id,变量值,变量id,变量值,变量id,变量值,.....]
 * ww.EventBatch.setVar([1,0,2,1,3,3])
 * 把1变量设置为0 ,2变量设置为1,3变量设置为3
 * 
 */
ww.EventBatch.setVar = function (l,l2) {
    if(l2!==undefined){return this.setVar2(l,l2)}

    if (!Array.isArray(l)) { l = [l] }
    for (var i = 0; i < l.length; i += 2) {
        $gameVariables._data[l[i]] = l[i + 1];
    }
    $gameVariables.onChange()
}


/**通过数组和数组设置变量
 * 如果第二个参数为值,则前面变量都改为该值
 * 
 * [变量id,变量id,变量id,.....] ,[变量值,变量值,变量值,.....]
 * 
 * ww.EventBatch.setVar2([1,2,3],[0,1,3])
 * 把1变量设置为0 ,2变量设置为1,3变量设置为3 
 */
ww.EventBatch.setVar2 = function (l, l2) {
    if (Array.isArray(l2)) {
        if (!Array.isArray(l)) { l = [l] }
        for (var i = 0; i < l.length; i++) {
            $gameVariables._data[l[i]] = l2[i];
        }
        $gameVariables.onChange()
    } else {
        ww.EventBatch.setVarV(l, l2)
    }
}


/**通过数组和值设置变量
 * 
 * [变量id,变量id,变量id,.....] ,值
 * 
 * ww.EventBatch.setVarV([1,2,3],3)
 * 把123变量设置为3
 */
ww.EventBatch.setVarV = function (l, l2) {
    if (!Array.isArray(l)) { l = [l] }
    for (var i = 0; i < l.length; i++) {
        $gameVariables._data[l[i]] = l2;
    }
    $gameVariables.onChange()
}



/**
 * 通过数组设置开关 0为关,其他值为开
 * 
 */
ww.EventBatch.setSw = function (l) {
    if(l2!==undefined){return this.setSw2(l,l2)}

    if (!Array.isArray(l)) { l = [l] }
    for (var i = 0; i < l.length; i += 2) {
        $gameSwitches._data[l[i]] = l[i + 1];
    }
    $gameSwitches.onChange()
}


/**通过数组和数组设置开关 0为关,其他值为开
 */
ww.EventBatch.setSw2 = function (l, l2) {
    if (Array.isArray(l2)) {
        if (!Array.isArray(l)) { l = [l] }
        for (var i = 0; i < l.length; i++) {
            $gameSwitches._data[l[i]] = l2[i];
        }
        $gameSwitches.onChange()
    } else {
        ww.EventBatch.setVarV(l, l2)
    }
}


/**通过数组和值设置开关 0为关,其他值为开
 */
ww.EventBatch.setSwV = function (l, l2) {
    if (!Array.isArray(l)) { l = [l] }
    for (var i = 0; i < l.length; i++) {
        $gameSwitches._data[l[i]] = l2;
    }
    $gameSwitches.onChange()
}






/**
 * 地图id , 独立开关名称, 事件及值的数组
 * 通过数组设置开关 0为关,其他值为开
 * 
 */
ww.EventBatch.setSs = function (mapId, selfSwitchCh, l,l2) {
    if(l2!==undefined){return this.setSs2(l,l2)}
    if (!Array.isArray(l)) { l = [l] }
    for (var i = 0; i < l.length; i += 2) {
        $gameSelfSwitches._data[[mapId, l[i], selfSwitchCh]] = l[i + 1];
    }
    $gameSelfSwitches.onChange()
}


/**通过数组和数组设置开关 0为关,其他值为开
 */
ww.EventBatch.setSs2 = function (l, l2) {
    if (Array.isArray(l2)) {
        if (!Array.isArray(l)) { l = [l] }
        for (var i = 0; i < l.length; i++) {
            $gameSelfSwitches._data[[mapId, l[i], selfSwitchCh]] = l2[i];
        }
        $gameSelfSwitches.onChange()
    } else {
        ww.EventBatch.setVarV(l, l2)
    }
}


/**通过数组和值设置开关 0为关,其他值为开
 */
ww.EventBatch.setSsV = function (l, l2) {
    if (!Array.isArray(l)) { l = [l] }
    for (var i = 0; i < l.length; i++) {
        $gameSelfSwitches._data[[mapId, l[i], selfSwitchCh]] = l2;

    }
    $gameSelfSwitches.onChange()
}


