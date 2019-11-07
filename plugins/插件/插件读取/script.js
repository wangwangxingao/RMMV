//=============================================================================
// ww_plugin.js
//=============================================================================
/*: 
 * @name ww_script 
 * @plugindesc 插件加载
 * @author 汪汪
 * @version 2.0
 * 
 * 
 * @param ww_script 
 * @desc  插件
 * @default ww
 * 
 * @help
 * 插件加载 
 * ww.script.load(l,p)  加载插件, 
 * ww.script.load(["t1.js" ],"test/")  js/plugins/test/t1.js
 * ww.script.loadText(['console.log("loadText")' ] )  
 * 
 */
var ww = ww || {}
ww.script = {
    t: 'text/javascript',
    s: 'script',
    l: 'javascript',
    _path: PluginManager._path, //'js/plugins/'
    load: function (l, p, c) {
        var p = p || ""
        var t = l && !Array.isArray(l) && typeof l
        l = t == "string" ? [l] : t == "object" ? Object.getOwnPropertyNames(l) : l
        for (var i = 0; l && i < l.length; i++) {
            var n = l[i]
            var url = (c || this._path) + p + n+".js";
            if (!p && !c) {
                var o = $plugins,
                    q = PluginManager._parameters;
                if (o) {
                    for (var u = 0; u < o.length; u++) {
                        var z = o[u];
                        if (z && z.name == n) {
                            q[z.name.toLowerCase()] = z.parameters
                        };
                    }
                }
            }
            var s = document.createElement(this.s);
            s.type = this.t;
            s.src = url;
            s.async = false;
            s.onerror = console.log;
            document.body.appendChild(s);
        }
    },

    loadText: function (l) {
        var t = l && typeof l
        l = Array.isArray(l) ? l : t == "string" ? [l] : []
        for (var i = 0; l && i < l.length; i++) {
            this.run(l[i])
        }
    },
    run: function (r, o) {
        try {
            if (r) {
                o = document.createElement(this.s);
                o.language = this.l;
                o.type = this.t;
                // os.id = re.url;
                o.defer = true;
                try {
                    o.appendChild(document.createTextNode(r));
                } catch (ex) {
                    o.text = r;
                }
                document.body.appendChild(os)
            }
        } catch (e) {
            try {
                eval(r)
            } catch (e2) {
                console.log(r)
            }
        }
    }
}