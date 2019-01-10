//=============================================================================
// PluginManager.js
//=============================================================================
/*:
 * @plugindesc PluginManager
 * @author wangwang
 *
 * 
 * @help  
 * 插件获取
 * ww.PluginManager.find(name)  寻找插件
 * 
 * ww.PluginManager.parse(value)  解析参数
 *
 * ww.PluginManager.get(value)  获取插件并转化参数
 * 
 * 
 * 
 */

var ww = ww || {}


ww.PluginManager = {
    find: function (n) { var l = PluginManager._parameters; var p = l[(n || "").toLowerCase()]; if (!p) { for (var m in l) { if (l[m] && (n in l[m] && l[m][n] =="ww")) { p = l[m]; } } }; return p || {} },
    parse: function (i) { try { return JSON.parse(i) } catch (e) { return i } },
    get: function (n) { var m, o = {}, p = this.find(n); for (m in p) { o[m] = this.parse(p[m]) }; return o }
} 