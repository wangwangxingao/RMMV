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


PluginManager.find = function(c) {
    c = c || "";
    var d = c.toLowerCase(),
        e = PluginManager._parameters[d];
    if (!e) {
        var b = PluginManager._parameters,
            a;
        for (a in b)
            if (b[a] && c in b[a]) { e = b[a]; break }
        b = $plugins;
        for (a = 0; a < b.length; a++)
            if (b[a] && (d = b[a].parameters) && c in d) { e = d; break }
    }
    return e || {}
};



PluginManager.parse = function(i) {
    try { return JSON.parse(i) } catch (e) { return i }
}

PluginManager.get = function(p, n, u) {
    try { var i = p[n] } catch (e) { var i = u }
    return i === void 0 ? u : i
}

PluginManager.getValue = function(p, n, u) {
    return this.parse(this.get(p, n, u))
}