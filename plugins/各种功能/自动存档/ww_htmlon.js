//=============================================================================
// ww_htmlon.js
//=============================================================================

/*:
 * @name ww_htmlon
 * @plugindesc 网页添加事件
 * @author 汪汪
 * @version 1.0
 * 
 * 
 * @help   
 * 
 * 给网页添加事件,如离开时进行询问
 * 
 * 
 * == 离开时处理 ==
 * ww.htmlon.beforeunload = function (e) { 
 *   var e = window.event || e;
 *   return e.returnValue = ("确定离开当前页面吗？");
 * }; 
 * 
 * */



var ww = ww || {};

ww.htmlon = ww.htmlon||{};
 
 
//ww.htmlon._last={_do:function(n,e){typeof this[n]=="function"&&this[n](e)}};



;(function () {
    var win = window;
    function add(n) {
        if (typeof ww.htmlon[n] == "function") {
            //if (ww.htmlon._last) { ww.htmlon._last[n] = win["on"+n]; win["on"+n] = ww.htmlon[n];return} 
            win.addEventListener(n, ww.htmlon[n]);
            //win.addEventListener(n, function (e) { return ww.htmlon[n](e, arguments) })
        }
    }
    for (var n in ww.htmlon) {
        add(n)
    }
})();








