var ww = ww || {}
ww.PluginManager = {}
ww.PluginManager.get = function (n) {
    var find = function (n) {
        var l = PluginManager._parameters;
        var p = l[(n || "").toLowerCase()];
        if (!p) { for (var m in l) { if (l[m] && (n in l[m])) { p = l[m]; } } }
        return p || {}
    }
    var parse = function (i) {
        try { return JSON.parse(i) } catch (e) { return i }
    }
    var m, o = {}, p = find(n)
    for (m in p) { o[m] = parse(p[m]) }
    return o
}
