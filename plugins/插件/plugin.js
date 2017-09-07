var parse = function (i, type) {
    try {
        if (type) {
            return i
        }
        return JSON.parse(i)
    } catch (e) {
        return i
    }
}
var find = function (name) {
    var name = (name||"").toLowerCase()
    var parameters = PluginManager._parameters[name];
    if (parameters) {
    } else {
        var pls = PluginManager._parameters
        for (var n in pls) {
            if (pls[n] && (name in pls[n])) {
                parameters = pls[n]
            }
        }
    }
    return parameters = parameters || {}
}
var get = function (p, n, unde) {
    try {
        var i = p[n]
    } catch (e) {
        var i = unde
    }
    return i === undefined ? unde : i
}



