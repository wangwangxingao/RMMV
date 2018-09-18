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


PluginManager.find = function(n) {
    var l = PluginManager._parameters;
    var p = l[(n || "").toLowerCase()];
    if (!p) { for (var m in l) { if (l[m] && (n in l[m])) { p = l[n]; } } }
    return p || {}
}

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