

var ww = ww || {};




(function () { 
    ww.hrefchange = function (href) {
        if (!ww.baseUrl) {
            ww.baseUrl = ""
        }
        if (href) {
            var bl = ww.baseUrl.split("/")
            bl.pop()
            var rex = /^((\.+\/)+)((.*))/
            var match = href.match(rex)
            if (match) {
                var l = href.split("./")
                var h = l.pop()
                for (var i = 0; i < l.length; i++) {
                    if (l[i] == ".") {
                        bl.pop()
                    }
                }
                bl.push(h)
                var href = bl.join("/")
            }
        }
        return href
    }

 
    ww.markMarked = function (src, opt, callback) {
 
        var renderer = new marked.Renderer();
        // Override function
        renderer.linkbase = renderer.link

        renderer.changeLink = function (href, text) {
            var href = href || ""

            var match = href.match(/^((\.*\/)+)((.*))/)
            if (match) {
                var href = ww.hrefchange(href) 
                return 'javascript:ww.open("' + href + '")'
            }
            return href
        }
        renderer.link = function (href, title, text) {
            var href = this.changeLink(href, text)
            return this.linkbase(href, title, text);
        };

        renderer.image = function (href, title, text) {
            if (this.options.baseUrl && !originIndependentUrl.test(href)) {
                href = resolveUrl(this.options.baseUrl, href);
            }

            var href = ww.hrefchange(href)
            var out = '<img src="' + href + '" alt="' + text + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += this.options.xhtml ? '/>' : '>';
            return out;
        };
        // Run marked
        var opt = opt || {}
        opt.renderer = opt.renderer ? opt.renderer : renderer

        return function (src) {
            return marked(src, opt, callback)
        }
    };

})();


(function () {

    /** 
     * 高亮显示关键字, 构造函数 
     * @param {} colors 颜色数组，其中每个元素是一个 '背景色,前景色' 组合 
     */
    function Highlighter(colors) {
        this._oldnode = null
        this._oldword = ""
        this._searchIndex = 0
        this._results = []
        this._colors = colors;
        if (!this._colors) {
            //默认颜色  
            this._colors = [
                '#ffff00,#000000',
                '#dae9d1,#000000',
                '#eabcf4,#000000',
                '#c8e5ef,#000000',
                '#f3e3cb, #000000',
                '#e7cfe0,#000000',
                '#c5d1f1,#000000',
                '#deeee4, #000000',
                '#b55ed2,#000000',
                '#dcb7a0,#333333',
                '#7983ab,#000000',
                '#6894b5, #000000'];
        }
    }

    Highlighter.prototype.clear = function (node, keywords) {

        this._oldnode = node || null
        this._oldword = keywords || ""
        this._searchIndex = 0
        this.dehighlight()
    }

    Highlighter.prototype.search = function (node, keywords, index) {

        if (this._oldword == keywords && this._oldnode == node) {
            if (index == undefined) {
                index = this._searchIndex + 1
            }
            console.log(index)
            this.searchIndex(index)

        } else {
            this.clear(node, keywords)
            this.highlight(node, keywords)
            this.searchIndex(0)
        }
        return this._results

    }


    Highlighter.prototype.dehighlight = function () {

        var result
        while (result = this._results.pop()) {
            //console.log(result)
            var data = result[0]
            var node = result[1]
            var childNode = result[2]
            var forkNode = result[3]
            node.replaceChild(childNode, forkNode);
        }
        /* 
        for (var i = 0; i < this._results.length; i++) {
            var result = this._results[i]
            var data = result[0]
            var node = result[1]
            var childNode = result[2]
            var forkNode = result[3]
            node.replaceChild(forkNode, childNode);
        } */
    }

    Highlighter.prototype.searchResult = function () {

        var list = []
        for (var i = 0; i < this._results.length; i++) {
            var result = this._results[i]
            var data = result[0]
            list.push(data)
            console.log(data)
            var node = result[1]
            var childNode = result[2]
            var forkNode = result[3]
            //node.replaceChild(forkNode, childNode);
        }
        return list
    }

    Highlighter.prototype.searchIndex = function (i) {

        i = i || 0
        if (i <= 0 || i >= this._results.length) {
            i = 0
        }
        this._searchIndex = i

        var result = this._results[i]

        if (result) {
            var data = result[0]
            console.log(i, data, result)

            var node = result[1]
            var childNode = result[2]
            var forkNode = result[3]
            scrollTo(0, node.offsetTop)
        }

    }


    /** 
     * 高亮显示关键字 
     * @param {} node    html element 
     * @param {} keywords  关键字， 多个关键字可以通过空格隔开， 其中每个关键字会以一种颜色显式 
     *  
     * 用法： 
     * var hl = new Highlighter(); 
     * hl.highlight(document.body, '这个 世界 需要 和平'); 
     */
    Highlighter.prototype.highlight = function (node, keywords) {

        if (!keywords || !node || !node.nodeType || node.nodeType != 1) {
            keywords = null
        } else {
            keywords = this.parsewords(keywords);
        }
        this.dehighlight()
        if (!keywords) {
            return this._results
        };
        for (var i = 0; i < keywords.length; i++) {
            this.colorword(node, keywords[i]);
        }
        return this._results
    }

    /** 
     * 对所有#text的node进行查找，如果有关键字则进行着色 
     * @param {} node 节点 
     * @param {} keyword 关键字结构体，包含了关键字、前景色、背景色 
     */
    Highlighter.prototype.colorword = function (node, keyword) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var childNode = node.childNodes[i];

            if (childNode.nodeType == 3) {

                //childNode is #text  

                var re = RegexParser(keyword.word, 'i')
                if (childNode.data.search(re) == -1) {
                    //node.replaceChild(oldNode,childNode) 
                    continue
                } else {

                    var forkNode = document.createElement('span');

                    var re = RegexParser('(' + keyword.word + ')', 'gi')

                    forkNode.innerHTML = childNode.data.replace(
                        re, this.span(keyword)
                    );
                    node.replaceChild(forkNode, childNode);
                    this._results.push([childNode.data, node, childNode, forkNode])

                }
            } else if (childNode.nodeType == 1) {
                //childNode is element  
                this.colorword(childNode, keyword);
            }
        }
    }


    Highlighter.prototype.span = function (keyword) {

        var span = '<span ' +
            'style=' +
            'background-color:' + keyword.bgColor +
            ';color:' + keyword.foreColor +
            ' mce_style=background-color:' + keyword.bgColor +
            ';color:' + keyword.foreColor + '>' + '$1' +
            '</span>'
        return span
    }

    /** 
     * 将空格分隔开的关键字转换成对象数组 
     * @param {} keywords 
     * @return {} 
     */
    Highlighter.prototype.parsewords = function (keywords) {

        if (keywords) {
            if (!Array.isArray(keywords)) {
                var keywords = [keywords]
            }
            if (Array.isArray(keywords)) {
                if (keywords.length) {
                    var re = []
                    for (var i = 0; i < keywords.length; i++) {
                        var keyword = {};
                        var color = this._colors[i % this._colors.length].split(',');
                        keyword.word = keywords[i];
                        keyword.bgColor = color[0];
                        keyword.foreColor = color[1];
                        re.push(keyword);
                    }
                    return re;
                }
            }
        }
        return null;
    }

    /** 
     * 按照字符串长度，由长到短进行排序 
     * @param {} list 字符串数组 
     */
    Highlighter.prototype.sort = function (list) {
        list.sort(function (e1, e2) {
            return e1.length < e2.length;
        });
    }


    function RegexParser(input, type) {
        // Validate input
        if (typeof input !== "string") {
            throw new Error("Invalid input. Input must be a string");
        }

        // Parse input
        var m = input.match(/(\/?)(.+)\1([a-z]*)/i);

        // Invalid flags
        if (m[3] && !/^(?!.*?(.).*?\1)[gmixXsuUAJ]+$/.test(m[3])) {
            return RegExp(input, type);
        }

        type = type || m[3]
        // Create the regular expression
        return new RegExp(m[2], type);
    };

    ww.Highlighter = new Highlighter()


})();


