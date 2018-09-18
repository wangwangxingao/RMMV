//=============================================================================
//  TouchEx.js
//=============================================================================

/*:
 * @plugindesc  
 * TouchEx,触摸增强,其他触摸需要
 * @author wangwang
 *   
 * @param  TouchEx
 * @desc 插件 触摸增强 ,作者:汪汪
 * @default 汪汪
 * 
 * 
 * @help
 * 
 * 
 * */




TouchInput._onMouseMove = function(event) {
    //画布x
    var x = Graphics.pageToCanvasX(event.pageX);
    //画布y
    var y = Graphics.pageToCanvasY(event.pageY);
    //当移动(x,y)
    this._onMove(x, y);
};