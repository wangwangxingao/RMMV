
function requestList() {
    this.initialize.apply(this, arguments);
}

requestList.prototype.constructor = requestList;


requestList.prototype.initialize = function (onend, order, request, onloadend, onprogress) {
    this._xhrs = []
    this._requests = []
    this._returns = []
    this._progress = []
    this._style = ""
    this._index = 0
    this._order = order || 0
    this.request = request || this._defaultRequset
    this.onloadend = onloadend || this._defaultonloadend
    this.onprogress = onprogress || this._defaultonprogress
    this.onend = onend || this._defaultonend
}


/**添加
 * 
 */
requestList.prototype.add = function () {
    var arguments = arguments
    for (var i = 0; i < arguments.length; i++) {
        var opts = arguments[i]
        if (opts) {
            this._requests.push(opts)
        }
    }
}


/**运行 */
requestList.prototype.run = function () {
    var arguments = arguments
    for (var i = 0; i < arguments.length; i++) {
        var opts = arguments[i]
        if (opts) {
            this._requests.push(opts)
        }
    }
    this.next()
}

/**进行下一个 */
requestList.prototype.next = function (z) {
    if (this._order) {
        if (this._style != "run" || z) {
            var set = this._requests[this._index]
            if (set) {
                this._style = "run"
                this.request(set)
                this._index++
            } else {
                this._style = "end"
                this.onend()
            }
        }
    } else {
        if (z) { this._index++ }
        var i = this._xhrs.length
        var set
        while (set = this._requests[i++]) {
            this._style = "run"
            this.request(set)
        }
        if (this._index == this._xhrs.length) {
            this._style = "end"
            this.onend()
        }
    }
}


requestList.prototype._defaultRequset = function (opts) {

    if (typeof opts === 'string') { opts = { url: opts } };


    var url = opts.url;

    var xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.responseType = "string";

    xhr.onloadend = this.onloadend
    //xhr.onprogress = onprogress

    xhr._index = this._xhrs.push(xhr) - 1
    xhr._requestList = this

    xhr.send()
    return xhr

}

requestList.prototype._defaultonend = function () {
    console.log(this)
}



requestList.prototype._defaultonloadend = function () {
    //if (xhr.status < 400) {
    // console.log(this._index, this._requestList)
    if (this._requestList) {
        this._requestList._returns[this._index] = this.response
        this._requestList.next(1)
    }
    //} 
    //.bind(this)
}




var ww = ww || {}


ww.scriptDeection = {}


ww.scriptDeection.findFunction = function (text) {

    var list = []
    text = "" + (text || "")
    if (typeof text == 'string') {
        var reg = /([;|,|\n]\s*)([\w|\.]*)\s*(=|)\s*function\s*([\w|\.]*)\s*\(/


        /**开始 */
        var start = 0

        var m = text.slice(start).match(reg)
        while (m) {
            /**索引 */
            var i = m.index
            /**长度 */
            var l = m[0].length
            if (m[2] && m[3] || m[4]) {
 
                /**头部 */
                var h = start + i+ m[1].length

                var lt = text.slice(0, h)
                var ll = lt.split(/\n|\f/)
                var y = ll.length   
                var x = (ll[y-1] || "").length

                list.push({ x: x, y: y, h: h, name: m[2] || m[4] })

            }
            //下一次
            var start = start + i + l
            var m = text.slice(start).match(reg)
        }

    }
    return list
}






ww.scriptDeection.loadPlugins = function () {

    this.requestList = new requestList(
        this.onend.bind(this)
    )
    this.pluginsList = []
    var p = $plugins
    for (var i = 0; i < $plugins.length; i++) {
        if ($plugins[i] && $plugins[i].status) {
            this.requestList.add("js/plugins/" + $plugins[i].name + ".js")
            this.pluginsList.push($plugins[i].name)
        }
    }
    this.requestList.run()

}

ww.scriptDeection.getPluginFuncion = function () {
    var re = []
    var rl = this.requestList
    var pl = this.pluginsList
    var list = rl._requests

    for (var i = 0; i < list.length; i++) {
        var sc = list[i]
        var name = pl[i]
        var r = rl._returns[i]
        if (r) {
            var l = this.findFunction(r)
            re.push([name, l])
        }
    }
    this._allFunction = re
    console.log(re) 
 
}



ww.scriptDeection.findDiff = function (o) {


    var o =this._allFunction
    var re = {}
    for (var i = 0; i < o.length; i++) {
        var p = o[i]

        var name = p[0]
        var l = p[1]
        for (var li = 0; li < l.length; li++) {
            var f = l[li]
            f.plugins = name
            re[f.name] = re[f.name] || []
            re[f.name].push(f)
        }
    }
    this._allFunctionFrom = re
    console.log(re) 

}


ww.scriptDeection.showDiff = function () {

    var re = {}
    for (var i in this._allFunctionFrom) {
        var l = this._allFunctionFrom[i]
        if (Array.isArray(l) && l.length) {
            if (l.length >= 2) {
                re[i] =  l.map(function(f){ return f.plugins })
            } 
        }
    } 
    this._allFunctionDiff = re 
    console.log(re)
}



ww.scriptDeection.onend = function () { 
    this.getPluginFuncion()
    this.findDiff()
    this.showDiff()
}


ww.scriptDeection.loadPlugins()