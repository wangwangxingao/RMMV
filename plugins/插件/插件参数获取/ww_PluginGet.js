//=============================================================================
// ww_plugin.js
//=============================================================================
/*: 
 * @name ww_plugin 
 * @plugindesc 插件处理
 * @author 汪汪
 * @version 2.0
 * 
 * 
 * @param ww_plugin 
 * @desc  插件版本
 * @default 2.0
 * 
 * @help
 * 插件获取
 * ww.plugin.find(n)  寻找插件
 * 
 * ww.plugin.parse(v)  解析参数
 *
 * ww.plugin.get(n,o)  获取插件并转化参数,储存到o中
 * 
 * 
 * 
 */

var ww = ww || {};
ww.plugin={find:function(n,l,p,m){l=PluginManager._parameters;p=l[(n||"").toLowerCase()];if(!p){for(m in l){if(l[m]&&n in l[m]){p=l[m]}}};return p||{}},parse:function(i){try{return JSON.parse(i)}catch(e){try{return eval(i)}catch(e2){return i}}},get:function(n,o,p){o=o||{};p=this.find(n);for(n in p){o[n]=this.parse(p[n])};return o}};
ww.plugin.get("ww_plugin",ww.plugin);