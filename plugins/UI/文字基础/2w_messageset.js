//=============================================================================
// 2w_messageset.js
//=============================================================================
/*: 
 * @name 2w_messageset
 * @plugindesc 插件处理
 * @author 汪汪
 * @version 2.0
 * 
 * 
 * @param 2w_messageset 
 * @desc  插件版本
 * @default 2.0
 * 
 * 
 * @param standardFontFace 
 * @desc  基础字体
 * @default "GameFont"
 * 
 * 
 * @param standardTextColor 
 * @desc 默认文字颜色
 * @default "#ffffff" 
 * 
 * 
 * @param standardFontSize 
 * @desc 默认文字字号
 * @default 20 
 * 
 * 
 * @param standardFontSize 
 * @desc 默认文字字号
 * @default 20 
 * 
 * @param standardOutlineColor 
 * @desc 默认文字阴影颜色
 * @default "rgba(0, 0, 0, 0.5)" 
 * 
 * @param standardOutlineWidth
 * @desc 默认文字阴影宽度
 * @default 4
 * 
 * @param standardPadding 
 * @desc  基础间隔
 * @default 18
 * 
 * 
 * @param standardFontBold 
 * @desc  默认黑体
 * @default false
 * 
 * @param standardFontItalic 
 * @desc  默认斜体
 * @default false
 *  
 * 
 * 
 * @help 
 * 
 * 
 */

var ww = ww || {};
ww.plugin={find:function(n,l,p,m){l=PluginManager._parameters;p=l[(n||"").toLowerCase()];if(!p){for(m in l){if(l[m]&&n in l[m]){p=l[m]}}};return p||{}},parse:function(i){try{return JSON.parse(i)}catch(e){try{return eval(i)}catch(e2){return i}}},get:function(n,o,p){o=o||{};p=this.find(n);for(n in p){o[n]=this.parse(p[n])};return o}}; 
ww.messageset= {}
ww.plugin.get("2w_messageset" ,ww.messageset)



Window_Base.prototype.standardFontFace = function() {
    return ww.messageset.standardFontFace; 
};
 

Window_Base.prototype.standardPadding = function() {
    return ww.messageset.standardPadding;
};
 

Window_Base.prototype.standardFontBold = function () {
    return ww.messageset.standardFontBold;
    return false
};

/** */
Window_Base.prototype.standardFontItalic = function () {
    return ww.messageset.standardFontItalic;
    return false
};


Window_Base.prototype.standardTextColor = function () {
    return ww.messageset.standardTextColor;
    return '#ffffff';
};

Window_Base.prototype.standardFontSize = function () {
    return ww.messageset.standardFontSize;
    return 20;
};

/**文本高 */
Window_Base.prototype.standardOutlineColor = function () {
    return ww.messageset.standardOutlineColor;

    return 'rgba(0, 0, 0, 0.5)';
};
Window_Base.prototype.standardOutlineWidth = function () {
    return ww.messageset.standardOutlineWidth;
    return 4;
};

 