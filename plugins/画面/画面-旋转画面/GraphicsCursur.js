//=============================================================================
// CursurIcon.js
//=============================================================================
/*:
 * @plugindesc 鼠标光标
 * @author wangwang
 * 
 *  
 * @param CursurIcon
 * @desc 鼠标光标 
 * @default 汪汪
 *  
 * @param CursurIconSet
 * @desc 选项名称 
 * @default ["","ra2.ico","img/pictures/1.png"] 
 * 
 * 
 * @param icon
 * @desc 默认鼠标光标 
 * @default 0
 * 
 * 
*/









var ww = ww || {}
ww.CursurIcon = {}
 

Graphics._cursur = ""
Graphics._lastcursur = ""

Graphics._setCursur = function (v) {
    var body = document.body;
    body.style.cursor = v || ""
};

Graphics._getCursurImg = function (v) {
    return 'url("' + v + '"),auto'
};

ww.CursurIcon.getBase = function () {
    if (!ww.CursurIcon._params) {
        ww.CursurIcon._params = PluginManager.get("CursurIcon")
    }
    return ww.CursurIcon._params
}

 
Graphics._getCursurType = function (v) {
    var p =   ww.CursurIcon.getBase()

    var l = p["CursurIconSet"]

    var n = l[v]


    return n ? this._getCursurImg(n) : ""

};
Graphics._setCursurType = function (v) {
    Graphics._cursur = this._getCursurType(v) || Graphics._cursur
};

Graphics._setCursurBase = function () {
    var p =   ww.CursurIcon.getBase() 
    var v = p["icon"]
    Graphics._cursur = this._getCursurType(v) || ""
};

SceneManager.updateInputData = function () {
    Input.update();
    TouchInput.update();
    if (TouchInput.isMoved()) {
        Graphics._setCursurBase()
    }
};

 

SceneManager.tickEnd = function () {

    if (Graphics._lastcursur != Graphics._cursur) {
        Graphics._lastcursur = Graphics._cursur
        Graphics._setCursur(Graphics._cursur)
    }
    Graphics.tickEnd();
};
