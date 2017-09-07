
//-----------------------------------------------------------------------------
/**这不是一个类,但是包含一些方法添加到标准js中方法
 * This is not a class, but contains some methods that will be added to the
 * standard Javascript objects.
 * js扩展
 * @class JsExtensions
 */
 
//js扩展
function JsExtensions() {
    throw new Error('This is not a class');
}

/**返回在min max 之间的 这个数 
 * Returns a number whose value is limited to the given range.
 *
 * @method Number.prototype.clamp
 * @param {Number} min The lower boundary
 * @param {Number} max The upper boundary
 * @return {Number} A number in the range (min, max)
 */
//在之间
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/**求余数(正)
 * Returns a modulo value which is always positive.
 *
 * @method Number.prototype.mod
 * @param {Number} n The divisor
 * @return {Number} A modulo value
 */
//求余数
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

/**替换%1,%2
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @method String.prototype.format
 * @param {Any} ...args The objects to format
 * @return {String} A formatted string
 */
//替换
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/%([0-9]+)/g, function(s, n) {
        return args[Number(n) - 1];
    });
};

/**制作一个数字 头是0
 * Makes a number string with leading zeros.
 *
 * @method String.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */
//补零
String.prototype.padZero = function(length){
    var s = this;
    while (s.length < length) {
        s = '0' + s;
    }
    return s;
};

/**制作一个数字 头是0 (length位)
 * Makes a number string with leading zeros.
 *
 * @method Number.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */
//补零
Number.prototype.padZero = function(length){
    return String(this).padZero(length);
};

//定义属性
Object.defineProperties(Array.prototype, {
    /**比较两个数组
     * Checks whether the two arrays are same.
     *
     * @method Array.prototype.equals
     * @param {Array} array The array to compare to
     * @return {Boolean} True if the two arrays are same
     */
    //相同
    equals: {
        enumerable: false,
        value: function(array) {
            if (!array || this.length !== array.length) {
                return false;
            }
            for (var i = 0; i < this.length; i++) {
                if (this[i] instanceof Array && array[i] instanceof Array) {
                    if (!this[i].equals(array[i])) {
                        return false;
                    }
                } else if (this[i] !== array[i]) {
                    return false;
                }
            }
            return true;
        }
    },
    /**制作一个数组副本
     * Makes a shallow copy of the array.
     *
     * @method Array.prototype.clone
     * @return {Array} A shallow copy of the array
     */
    //克隆
    clone: {
        enumerable: false,
        value: function() {
            return this.slice(0);
        }
    },
    /**数组包含
     * Checks whether the array contains a given element.
     *
     * @method Array.prototype.contains
     * @param {Any} element The element to search for
     * @return {Boolean} True if the array contains a given element
     */
    //包含
    contains : {
        enumerable: false,
        value: function(element) {
            return this.indexOf(element) >= 0;
        }
    }
});
 

/**字符串包含
 * Checks whether the string contains a given string.
 *
 * @method String.prototype.contains
 * @param {String} string The string to search for
 * @return {Boolean} True if the string contains a given string
 */
//包含
String.prototype.contains = function(string) {
    return this.indexOf(string) >= 0;
};

/** 0-max-1 的随机数 包括0 不包括 max-1
 * Generates a random integer in the range (0, max-1).
 *
 * @static
 * @method Math.randomInt
 * @param {Number} max The upper boundary (excluded)
 * @return {Number} A random integer
 */
//随机整数
Math.randomInt = function(max) {
    return Math.floor(max * Math.random());
};
