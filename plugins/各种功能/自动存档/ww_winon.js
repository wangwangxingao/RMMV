//=============================================================================
// ww_winon.js
//=============================================================================

/*:
 * @name ww_winon
 * @plugindesc 窗口添加事件
 * @author 汪汪
 * @version 1.0
 * 
 * 
 * @help   
 * 窗口添加事件,如关闭时进行询问
 * 
 * == 关闭 ==
 * ww.winon.close = function (win) {
 *     if (confirm("是否关闭")) {
 *         win.hide()
 *         win.close(true)
 *     }
 * };
 * 
 * 
 * 
 * == 最小化 ==
 * ww.winon.minimize = function (win) {
 *     console.log("最小化")
 * };
 * 
 * 
 * == 窗口恢复大小 ==
 * ww.winon.restore = function () {
 *     console.log("窗口恢复大小")
 * }
 * 
 * == 最大化 ==
 * ww.winon.maximize = function (win) {
 *     console.log("最大化")
 * };
 * 
 * == 退出最大化 ==
 * ww.winon.unmaximize = function () {
 *     console.log("退出最大化")
 * }
 * 
 * == 进入全屏 ==
 * ww.winon["enter-fullscreen"] = function () {
 *     console.log("进入全屏")
 * }
 * 
 * == 退出全屏 ==
 * ww.winon["leave-fullscreen"] = function () {
 *     console.log("退出全屏")
 * }
 * 
 * == 获得焦点 ==
 * ww.winon.focus = function (win) {
 *     console.log("获得焦点")
 * };
 * 
 * == 失去焦点 ==
 * ww.winon.blur = function (win) {
 *     console.log("失去焦点")
 * };
 * 
 * == 窗口移动 ==
 * a : [x,y]
 * ww.winon.move = function (win, a) {
 *     console.log("移动", a)
 * };
 * 
 * == 尺寸 ==
 * a : [width,height]
 * ww.winon.resize = function (win, a) {
 *     console.log("尺寸", a)
 * };
 *  
 * 
 * */


var ww = ww || {};

ww.winon = ww.winon || {};



; (function () {
    if (Utils.isNwjs()) {
        function add(n) {
            win.removeAllListeners(n)
            if (typeof ww.winon[n] == "function") {
                win.on(n, function () { return ww.winon[n](win, arguments) });
            }
        }
        var nw = require('nw.gui');
        var win = nw.Window.get();
        for (var n in ww.winon) {
            add(n)
        }
        ww.winon.nw = nw
        ww.winon.win = win
    } else {
        ww.winon = false
    }
})();




