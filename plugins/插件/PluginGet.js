//=============================================================================
//  PluginGet.js
//=============================================================================

/*:
 * @plugindesc  
 * PluginGet,插件获取加强 
 * @author wangwang
 *   
 * @param  PluginGet
 * @desc 插件 插件获取增强 ,作者:汪汪
 * @default 汪汪
 * 
 * 
 * @help
 * 
 * 获取插件数据
 * 
 * 
 * 
 * 
 * */



PluginManager.find = function(name) {
    var name = name || ""
    var pm = name.toLowerCase()
    var parameters = PluginManager._parameters[pm];
    if (parameters) {} else {
        var pls = PluginManager._parameters
        for (var n in pls) {
            if (pls[n] && (name in pls[n])) {
                parameters = pls[n]
            }
        }
    }
    return parameters || {}
}


PluginManager.parse = function(i, type) {
    try {
        if (type) {
            return i
        }
        return JSON.parse(i)
    } catch (e) {
        return i
    }
}

PluginManager.get = function(p, n, unde) {
    try {
        var i = p[n]
    } catch (e) {
        var i = unde
    }
    return i === undefined ? unde : i
}

PluginManager.getValue = function(p, n, unde, type) {
    var i = this.get(p, n, unde)
    try {
        if (type) {
            return i
        }
        return JSON.parse(i)
    } catch (e) {
        return i
    }
}