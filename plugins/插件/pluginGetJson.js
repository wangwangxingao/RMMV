
PluginManager.find = function (n) {
    var l = PluginManager._parameters;
    var p = l[(n || "").toLowerCase()];
    if (!p) { for (var m in l) { if (l[m] && (n in l[m])) { p = l[n]; } } }
    return p || {}
}

PluginManager.parse = function (i) {
    try { return JSON.parse(i) } catch (e) { return i }
}

PluginManager.get = function (n) {
    var m, o = {}, p = this.find(n)
    for (m in p) { o[m] = this.parse(p[m]) }
    return o
}
