var ww = ww||{}
ww.deepCopy = function (that) {
    var obj, i;
    if (that && typeof (that) === "object") {
        if (Array.isArray(that)) { //Object.prototype.toString.call(that) === '[object Array]') { 
            obj = [];
            for (var i = 0; i < that.length; i++) {
                obj.push(ww.deepCopy(that[i]));
            }
        } else {
            obj = {}
            for (i in that) {
                obj[i] = ww.deepCopy(that[i])
            }
        }
    } else {
        obj = that
    }
    return obj;
};