
//-----------------------------------------------------------------------------
/**静态的类 定义公用程序方法
 * The static class that defines utility methods.
 * 公用程序
 * @class Utils
 */
function Utils() {
    throw new Error('This is a static class');
}

/** RPG Maker 的名称 ,mv 是当前版本
 * The name of the RPG Maker. 'MV' in the current version.
 *
 * @static
 * @property RPGMAKER_NAME
 * @type String
 * @final
 */
// RPG Maker 的名称 = "MV"
Utils.RPGMAKER_NAME = 'MV';

/** RPG Maker  版本
 * The version of the RPG Maker.
 *
 * @static
 * @property RPGMAKER_VERSION
 * @type String
 * @final
 */
// RPGMaker版本 = "1.3.5"
Utils.RPGMAKER_VERSION = "1.3.5";
/**
/**检查 项目URL字符串是否有(name) 测试游戏时会带
 * Checks whether the option is in the query string.
 *
 * @static
 * @method isOptionValid
 * @param {String} name The option name
 * @return {Boolean} True if the option is in the query string
 */
//是选项有效
Utils.isOptionValid = function(name) {
	//location存放的是你项目所在位置的URL,
	//如file:///D:/RPGMV/Games/test/index.html?test,其中D:/RPGMV/Games/test/为该项目的文件夹,test为项目名
	//location.search会返回一个?x,其中x为你的项目名
	//location.search.slice(0)与location.search.slice(1)分别为?x与x
	//location.search.slice(1).split('&')会返回你的项目名
	//contains是对原生对象string与array的扩展,
	//功能是对输入的参数进行比较,如果大于等于(即存在输入的参数),就返回true,否则返回false
    return location.search.slice(1).split('&').contains(name);
};

/**检查是不是nw.js平台
 * Checks whether the platform is NW.js.
 *
 * @static
 * @method isNwjs
 * @return {Boolean} True if the platform is NW.js
 */
//是nwjs
Utils.isNwjs = function() {
	//如果require与process分别是函数和对象,那么就返回true,整个后台脚本均无这两个参数的声明
	//看起来是 nw.js 平台会有这两个
    return typeof require === 'function' && typeof process === 'object';
};

/**检查平台是不是移动设备
 * Checks whether the platform is a mobile device.
 *
 * @static
 * @method isMobileDevice
 * @return {Boolean} True if the platform is a mobile device
 */
//是移动设备
Utils.isMobileDevice = function() {
	//将r初始化为该正则表达式,这个正则表达式的意思是,不区分大小写,且匹配上面任意一项即为真
    var r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    //navigator.userAgent为字符串,内容为浏览器版本,
    //navigator.userAgent.match(r)则意味着以正则表达式r的规则进行检索,如果不与上面的匹配,返回null
	//!!是将其强制转换为布尔值
    return !!navigator.userAgent.match(r);
};


/**检查浏览器是Mobile Safari(苹果Safari浏览器)
 * Checks whether the browser is Mobile Safari.
 *
 * @static
 * @method isMobileSafari
 * @return {Boolean} True if the browser is Mobile Safari
 */
//是移动苹果
Utils.isMobileSafari = function() {
    var agent = navigator.userAgent;
    return !!(agent.match(/iPhone|iPad|iPod/) && agent.match(/AppleWebKit/) &&
              !agent.match('CriOS'));
};

/**检查浏览器是Android Chrome(安卓Chrome浏览器)
 * Checks whether the browser is Android Chrome.
 *
 * @static
 * @method isAndroidChrome
 * @return {Boolean} True if the browser is Android Chrome
 */
//是安卓Chrome
Utils.isAndroidChrome = function() {
    var agent = navigator.userAgent;
    //同时匹配Android与Chrome即为真,即检测浏览器是否为安卓版的 Chrome 浏览器
    return !!(agent.match(/Android/) && agent.match(/Chrome/));
};

/**检查浏览器能够读文件在游戏文件夹
 * Checks whether the browser can read files in the game folder.
 *
 * @static
 * @method canReadGameFiles
 * @return {Boolean} True if the browser can read files in the game folder
 */
//能读取游戏文件
Utils.canReadGameFiles = function() {

	//将所有脚本元素放入scripts变量中,
    var scripts = document.getElementsByTagName('script');
    //将最末尾的脚本元素放入lastScript里,
    var lastScript = scripts[scripts.length - 1];
    //将ajax实例化
    var xhr = new XMLHttpRequest();
    try {
        xhr.open('GET', lastScript.src);
        //通过overrideMimeType指定接受的资源以什么方式解析,
        //在这里是按照js脚本解析(因为参数为'text/javascript')
        xhr.overrideMimeType('text/javascript');
        //如果没有异常,那么send(),返回true
        xhr.send();
        return true;
    } catch (e) {
	    //否则返回false
        return false;
    }
};

/**制作html 颜色字符串 从 rgb数值
 * Makes a CSS color string from RGB values.
 *
 * @static
 * @method rgbToCssColor
 * @param {Number} r The red value in the range (0, 255)
 * @param {Number} g The green value in the range (0, 255)
 * @param {Number} b The blue value in the range (0, 255)
 * @return {String} CSS color string
 */
Utils.rgbToCssColor = function(r, g, b) {
	//Math.round()方法对输入的参数进行四舍五入,如3.6==4;3.1==3;
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
	//最后返回形如:rgb(0,0,255)的参数,该参数用于css的color属性
    return 'rgb(' + r + ',' + g + ',' + b + ')';
};
