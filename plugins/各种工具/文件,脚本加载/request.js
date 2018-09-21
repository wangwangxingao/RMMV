/*----------------------------------------------------------
    util / Request : 0.1.1 : 2015 - 03 - 26
----------------------------------------------------------
    util.request({
        url: './dir/something.extension',
        data: 'test!',
        format: 'text', // text | xml | json | binary
        responseType: 'text', // arraybuffer | blob | document | json | text
        headers: {},
        withCredentials: true, // true | false
        ///
        onerror: function (evt, percent) {
            console.log(evt);
        },
        onsuccess: function (evt, responseText) {
            console.log(responseText);
        },
        onprogress: function (evt, percent) {
            percent = Math.round(percent * 100);
            loader.create('thread', 'loading... ', percent);
        }
    });
*/



(function (root) {

    var util = root.util || (root.util = {});

    util.request = function (opts, onsuccess, onerror, onprogress) {
        'use strict';
        if (typeof opts === 'string') opts = { url: opts };
        ///
        var data = opts.data;
        var url = opts.url;
        var method = opts.method || (opts.data ? 'POST' : 'GET');
        var format = opts.format;
        var headers = opts.headers;
        var responseType = opts.responseType;
        var withCredentials = opts.withCredentials || false;
        ///
        var onsuccess = onsuccess || opts.onsuccess;
        var onerror = onerror || opts.onerror;
        var onprogress = onprogress || opts.onprogress;
        ///
        if (typeof NodeFS !== 'undefined' && root.loc.isLocalUrl(url)) {
            NodeFS.readFile(url, 'utf8', function (err, res) {
                if (err) {
                    onerror && onerror(err);
                } else {
                    onsuccess && onsuccess({ responseText: res });
                }
            });
            return;
        }
        ///
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        ///
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
        if (responseType) {
            xhr.responseType = responseType;
        }
        if (withCredentials) {
            xhr.withCredentials = 'true';
        }
        if (onerror && 'onerror' in xhr) {
            xhr.onerror = onerror;
        }
        if (onprogress && xhr.upload && 'onprogress' in xhr.upload) {
            if (data) {
                xhr.upload.onprogress = function (evt) {
                    onprogress.call(xhr, evt, event.loaded / event.total);
                };
            } else {
                xhr.addEventListener('progress', function (evt) {
                    var totalBytes = 0;
                    if (evt.lengthComputable) {
                        totalBytes = evt.total;
                    } else if (xhr.totalBytes) {
                        totalBytes = xhr.totalBytes;
                    } else {
                        var rawBytes = parseInt(xhr.getResponseHeader('Content-Length-Raw'));
                        if (isFinite(rawBytes)) {
                            xhr.totalBytes = totalBytes = rawBytes;
                        } else {
                            return;
                        }
                    }
                    onprogress.call(xhr, evt, evt.loaded / totalBytes);
                });
            }
        }
        ///
        xhr.onreadystatechange = function (evt) {
            if (xhr.readyState === 4) { // The request is complete
                if (xhr.status === 200 || // Response OK
                    xhr.status === 304 || // Not Modified
                    xhr.status === 308 || // Permanent Redirect
                    xhr.status === 0 && root.client.cordova // Cordova quirk
                ) {
                    if (onsuccess) {
                        var res;
                        if (format === 'xml') {
                            res = evt.target.responseXML;
                        } else if (format === 'text') {
                            res = evt.target.responseText;
                        } else if (format === 'json') {
                            try {
                                res = JSON.parse(evt.target.response);
                            } catch (err) {
                                onerror && onerror.call(xhr, evt);
                            }
                        }
                        ///
                        onsuccess.call(xhr, evt, res);
                    }
                } else {
                    onerror && onerror.call(xhr, evt);
                }
            }
        };
        xhr.send(data);
        return xhr;
    };

    /// NodeJS 

})(this);



/*
	-----------------------------------------------------------
	dom.loadScript.js : 0.1.4 : 2014/02/12 : http://mudcu.be
	-----------------------------------------------------------
	Copyright 2011-2014 Mudcube. All rights reserved.
	-----------------------------------------------------------
	/// No verification
	dom.loadScript.add("../js/jszip/jszip.js");
	/// Strict loading order and verification.
	dom.loadScript.add({
		strictOrder: true,
		urls: [
			{
				url: "../js/jszip/jszip.js",
				verify: "JSZip",
				onsuccess: function() {
					console.log(1)
				}
			},
			{ 
				url: "../inc/downloadify/js/swfobject.js",
				verify: "swfobject",
				onsuccess: function() {
					console.log(2)
				}
			}
		],
		onsuccess: function() {
			console.log(3)
		}
	});
	/// Just verification.
	dom.loadScript.add({
		url: "../js/jszip/jszip.js",
		verify: "JSZip",
		onsuccess: function() {
			console.log(1)
		}
	});
*/



(function () {
    "use strict";
    var dom = root.util || (root.util = {});

    dom.loadScript = function () {
        this.loaded = {};
        this.loading = {};
        return this;
    };

    dom.loadScript.prototype.add = function (config) {
        var that = this;
        if (typeof (config) === "string") {
            config = { url: config };
        }
        var urls = config.urls;
        if (typeof (urls) === "undefined") {
            urls = [{
                url: config.url,
                verify: config.verify
            }];
        }
        ///将元素添加到头部 adding the elements to the head
        var doc = document.getElementsByTagName("head")[0];
        /// 
        var testElement = function (element, test) {
            if (that.loaded[element.url]) return;
            if (test && globalExists(test) === false) return;
            that.loaded[element.url] = true;
            //
            if (that.loading[element.url]) that.loading[element.url]();
            delete that.loading[element.url];
            //
            if (element.onsuccess) element.onsuccess();
            if (typeof (getNext) !== "undefined") getNext();
        };
        ///有错误
        var hasError = false;
        var batchTest = [];
        var addElement = function (element) {
            if (typeof (element) === "string") {
                element = {
                    url: element,
                    verify: config.verify
                };
            }
            if (/([\w\d.\[\]\'\"])$/.test(element.verify)) { //检查它是否是变量引用 check whether its a variable reference
                var verify = element.test = element.verify;
                if (typeof (verify) === "object") {
                    for (var n = 0; n < verify.length; n++) {
                        batchTest.push(verify[n]);
                    }
                } else {
                    batchTest.push(verify);
                }
            }
            if (that.loaded[element.url]) return;
            var script = document.createElement("script");
            script.onreadystatechange = function () {
                if (this.readyState !== "loaded" && this.readyState !== "complete") return;
                testElement(element);
            };
            script.onload = function () {
                testElement(element);
            };
            script.onerror = function () {
                hasError = true;
                delete that.loading[element.url];
                if (typeof (element.test) === "object") {
                    for (var key in element.test) {
                        removeTest(element.test[key]);
                    }
                } else {
                    removeTest(element.test);
                }
            };
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", element.url);
            doc.appendChild(script);
            that.loading[element.url] = function () { };
        };
        ///检查一切是否正确加载 checking to see whether everything loaded properly
        var removeTest = function (test) {
            var ret = [];
            for (var n = 0; n < batchTest.length; n++) {
                if (batchTest[n] === test) continue;
                ret.push(batchTest[n]);
            }
            batchTest = ret;
        };
        var onLoad = function (element) {
            if (element) {
                testElement(element, element.test);
            } else {
                for (var n = 0; n < urls.length; n++) {
                    testElement(urls[n], urls[n].test);
                }
            }
            var istrue = true;
            for (var n = 0; n < batchTest.length; n++) {
                if (globalExists(batchTest[n]) === false) {
                    istrue = false;
                }
            }
            if (!config.strictOrder && istrue) { //完成加载所有请求的脚本 finished loading all the requested scripts
                if (hasError) {
                    if (config.error) {
                        config.error();
                    }
                } else if (config.onsuccess) {
                    config.onsuccess();
                }
            } else { //继续回电功能 keep calling back the function
                setTimeout(function () { //随着时间的推移会变慢吗？- should get slower over time?
                    onLoad(element);
                }, 10);
            }
        };
        ///装载方法;严格的订购或松散的订购 loading methods;  strict ordering or loose ordering
        if (config.strictOrder) {
            var ID = -1;
            var getNext = function () {
                ID++;
                if (!urls[ID]) { //ll元素已加载 all elements are loaded
                    if (hasError) {
                        if (config.error) {
                            config.error();
                        }
                    } else if (config.onsuccess) {
                        config.onsuccess();
                    }
                } else { //加载新脚本 loading new script
                    var element = urls[ID];
                    var url = element.url;
                    if (that.loading[url]) { //已经从另一个电话加载（附加到事件） already loading from another call (attach to event)
                        that.loading[url] = function () {
                            if (element.onsuccess) element.onsuccess();
                            getNext();
                        }
                    } else if (!that.loaded[url]) { //创建脚本元素 create script element
                        addElement(element);
                        onLoad(element);
                    } else { //它已经成功加载 it's already been successfully loaded
                        getNext();
                    }
                }
            };
            getNext();
        } else { // loose ordering
            for (var ID = 0; ID < urls.length; ID++) {
                addElement(urls[ID]);
                onLoad(urls[ID]);
            }
        }
    };

    dom.requestScript = new dom.loadScript();

    //全球存在
    var globalExists = function (path, root) {
        try {
            path = path.split('"').join('').split("'").join('').split(']').join('').split('[').join('.');
            var parts = path.split(".");
            var length = parts.length;
            var object = root || window;
            for (var n = 0; n < length; n++) {
                var key = parts[n];
                if (object[key] == null) {
                    return false;
                } else { //
                    object = object[key];
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    };

})();
