

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
    //this.next()
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

    if (typeof opts === 'string') { opts = { url: opts, responseType: "string" } };
    ///

    var url = opts.url;
    var data = opts.data;
    var async = opts.async !== false //true 异步 , false 同步

    var username = opts.username
    var password = opts.password

    var method = opts.method || (opts.data ? 'POST' : 'GET');
    var format = opts.format;
    var headers = opts.headers;
    var responseType = opts.responseType;
    var withCredentials = opts.withCredentials || false;
    var onloadend = opts.onloadend || this.onloadend;

    var onprogress = opts.onprogress || this.onprogress;
    var onupprogress = opts.onupprogress || this.onprogress;

    var onreadystatechange = opts.onreadystatechange
    var onload = opts.onload
    var onerror = opts.onerror
    var onabort = opts.onabort


    var xhr = new XMLHttpRequest();

    xhr.open(method, url, async, username, password);

    if (headers) {
        for (var type in headers) {
            xhr.setRequestHeader(type, headers[type]);
        }
    } else if (data) { // set the default headers for POST
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    if (format === 'binary') { //- default to responseType="blob" when supported
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        }
    }
    if (withCredentials) {
        xhr.withCredentials = 'true';
    }



    if (responseType) {
        xhr.responseType = responseType;
    }


    xhr.onloadend = onloadend
    xhr.onprogress = onprogress
    if (xhr.upload) {
        xhr.upload.onprogress = onupprogress
    }
    xhr.onabort = onabort
    xhr.onerror = onerror;
    xhr.onload = onload;

    xhr.onreadystatechange = onreadystatechange


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

requestList.prototype._defaultonprogress = function (event) {
    if (event.lengthComputable) {
        var completedPercent = event.loaded / event.total;
        // console.log(event.loaded, event.total, completedPercent)
        if (this._requestList) {
            this._requestList._progress[this._index] = ([event.loaded, event.total, completedPercent])
        }
    }

}

/*
requestList.prototype._defaultonerror = function () {
    return this._defaultonload()
}

requestList.prototype._defaultonabort = function () {
    return this._defaultonload()
}
 */


 