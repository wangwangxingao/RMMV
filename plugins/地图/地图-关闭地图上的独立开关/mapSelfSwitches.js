//=============================================================================
// mapSelfSwitches.js
//=============================================================================
/*:
 * @plugindesc  独立开关增强
 * @author wangwang
 * 
 * 
 * @help
 *  
 *  $gameSelfSwitches.setMapId(mapid)  删除mapid地图的所有事件的独立开关
 *  $gameSelfSwitches.setMapIdEvent(mapid,eventid)  删除mapid地图的eventid事件的独立开关
 *  $gameSelfSwitches.setMapIdSwitch(mapid,switch)  删除mapid地图的所有的开关为switch的独立开关
 * 
 * 
 *  $gameSelfSwitches.setMapIdInEvent(mapid,eventid)  删除mapid地图的是eventid事件的独立开关
 * eventid 可以是数组
 * 
 *  $gameSelfSwitches.setMapIdNoEvent(mapid,eventid)  删除mapid地图的不是eventid事件的独立开关
 * eventid 可以是数组
 *  
 *  
 *  $gameSelfSwitches.setMapIdInSwitch(mapid,switchid)  删除mapid地图的是switchid开关的独立开关
 * switchid 可以是数组
 * 
 *  $gameSelfSwitches.setMapIdNoSwitch(mapid,switchid)  删除mapid地图的不是switchid开关的独立开关
 * switchid 可以是数组
 *  
 * 
 *  
 *  
 */


Game_SelfSwitches.prototype.value2 = function (key) {
    //返回 !! 数据[键] (数据[键])
    return this._data[key];
};
/**设置值*/
Game_SelfSwitches.prototype.setValue2 = function (key, value) {
    this._data[key] = value;
    //当改变
    this.onChange();
};



/**通过地图id,事件id,键id 获得一个键 */
Game_SelfSwitches.prototype.getEventKey = function (mapId, eventId, switcheId) {
    return [mapId, eventId, switcheId]
}


/**获取 键 的 地图id 事件id */
Game_SelfSwitches.prototype.getKeyEvent = function (key) {
    try {
        if (key) {
            return key.split(",")
        }
        return false
    } catch (error) {
        return false
    }
}


Game_SelfSwitches.prototype.getMapId = function (mapId) {
    var mapId = "" + mapId
    var o = []
    for (var key in this._data) {
        var keys = this.getKeyEvent(key)
        if (keys && keys[0] == mapId) {
            o.push(key)
        }
    }
    return o
}



Game_SelfSwitches.prototype.getMapIdSwitch = function (mapId, switchid) {
    var mapId = "" + mapId
    var switchid = "" + switchid
    var o = []
    for (var key in this._data) {
        var keys = this.getKeyEvent(key)
        if (keys && keys[0] == mapId && keys[2] == switchid) {
            o.push(key)
        }
    }
    return o
}


Game_SelfSwitches.prototype.getMapIdEvent = function (mapId, eventid) {
    var mapId = "" + mapId
    var eventid = "" + eventid
    var o = []
    for (var key in this._data) {
        var keys = this.getKeyEvent(key)
        if (keys && keys[0] == mapId && keys[1] == eventid) {
            o.push(key)
        }
    }
    return o
}



/**设置目前所有的 地图id 的独立开关 */
Game_SelfSwitches.prototype.setMapId = function (mapId, value) {
    var mapId = "" + mapId
    for (var key in this._data) {
        var keys = this.getKeyEvent(key)
        if (keys && keys[0] == mapId) {
            if (value) {
                this._data[key] = value;
            } else {
                delete this._data[key]
            }
        }
    }
    this.onChange()
}



/**设置目前所有的 地图id ,事件id 的独立开关 */
Game_SelfSwitches.prototype.setMapIdEvent = function (mapId, eventid, value) {
    var mapId = "" + mapId
    var eventid = "" + eventid
    for (var key in this._data) {
        var keys = this.getKeyEvent(key)
        if (keys && keys[0] == mapId && keys[1] == eventid) {
            if (value) {
                this._data[key] = value;
            } else {
                delete this._data[key]
            }
        }
    }
    this.onChange()

}

/**设置目前所有的 地图id 开关id 的独立开关 */
Game_SelfSwitches.prototype.setMapIdSwitch = function (mapId, switchid, value) {
    var mapId = "" + mapId
    var switchid = "" + switchid
    for (var key in this._data) {
        var keys = this.getKeyEvent(key)
        if (keys && keys[0] == mapId && keys[2] == switchid) {
            if (value) {
                this._data[key] = value;
            } else {
                delete this._data[key]

            }
        }
    }
    this.onChange()
}


Game_SelfSwitches.prototype.setMapIdInEvent = function (mapId, eventid, value) {
    var mapId = "" + mapId
    var l = []
    if (Array.isArray()) {
        for (var i = 0; i < eventid.length; i++) {
            var event = "" + eventid[i]
            l.push(event)
        }
    }else{
        l = ["" + eventid]
    } 
    for (var key in this._data) {
        var keys = this.getKeyEvent(key)
        if (keys && keys[0] == mapId && l.indexOf(keys[1]) >= 0) {
            if (value) {
                this._data[key] = value;
            } else {
                delete this._data[key]
            }
        }
    }
    this.onChange()

}


Game_SelfSwitches.prototype.setMapIdNoEvent = function (mapId, eventid, value) {
    var mapId = "" + mapId
    var l = []
    if (Array.isArray()) {
        for (var i = 0; i < eventid.length; i++) {
            var event = "" + eventid[i]
            l.push(event)
        }
    }else{
        l = ["" + eventid]
    } 
    for (var key in this._data) {
        var keys = this.getKeyEvent(key)
        if (keys && keys[0] == mapId && l.indexOf(keys[1]) < 0) {
            if (value) {
                this._data[key] = value;
            } else {
                delete this._data[key]
            }
        }
    }
    this.onChange()

}




Game_SelfSwitches.prototype.setMapIdInSwitch = function (mapId, eventid, value) {
    var mapId = "" + mapId
    var l = []
    if (Array.isArray()) {
        for (var i = 0; i < eventid.length; i++) {
            var event = "" + eventid[i]
            l.push(event)
        }
    }else{
        l = ["" + eventid]
    } 
    for (var key in this._data) {
        var keys = this.getKeyEvent(key)
        if (keys && keys[0] == mapId && l.indexOf(keys[2]) >= 0) {
            if (value) {
                this._data[key] = value;
            } else {
                delete this._data[key]
            }
        }
    }
    this.onChange()

}


Game_SelfSwitches.prototype.setMapIdNoSwitch = function (mapId, switchid, value) {
    var mapId = "" + mapId
    var l = []
    if (Array.isArray()) {
        for (var i = 0; i < switchid.length; i++) {
            var event = "" + switchid[i]
            l.push(event)
        }
    }else{
        l = ["" + switchid]
    }
     for (var key in this._data) {
        var keys = this.getKeyEvent(key)
        if (keys && keys[0] == mapId && l.indexOf(keys[2]) < 0) {
            if (value) {
                this._data[key] = value;
            } else {
                delete this._data[key]
            }
        }
    }
    this.onChange()

}