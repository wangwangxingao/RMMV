(function () {



    var ww = ww || {}

    ww.deepClone = function (that) {
        var that = that
        var obj, i;
        if (typeof (that) === "object") {
            if (that === null) {
                obj = null;
            } else if (Array.isArray(that)) {  //Object.prototype.toString.call(that) === '[object Array]') { 
                obj = [];
                for (var i = 0; i < that.length; i++) {
                    obj.push(ww.deepClone(that[i]));
                }
            } else {
                obj = {}
                for (i in that) {
                    obj[i] = ww.deepClone(that[i])
                }
            }
        } else {
            obj = that
        }
        return obj;
    };


    ww.anm = {}


    ww.anm.anmToObj = function (obj) {
        var tl = typeof obj
        if (tl == "number") {
            return { t: obj }
        } else if (tl && tl == "object") {
            return ww.deepClone(obj)
        } else {
            return 0
        }
    }

    /**
     * 数值初始化
     * @param {sprite} s 精灵
     * @param {{n:{}|function}} set 设置
     * @param {string} n 设置名称 
     * @param {{tv:{},break:boolean}} oa 当前动画对象
     * @param {} anmGroup 动画组
     *  
     * 
     * 
     * {fr:{x:0}} 
     * {fr:{x:0}} , "fr" , ""  
     * v = {x:0}
     * 
     * 
     * {fr:0} , "fr" , "x"  
     * 
     * 
     */
    ww.anm.evalini = function (s, oa, n, anmGroup) {
        if (oa) {
            //该设置
            var v = oa[n]
            //种类
            var t = typeof v
            //是方法时
            if (t == "function") {
                //运行方法
                v(s, oa, n, anmGroup)
                //是对象时
            } else if (v && t == "object") {
                //对于所有对象
                for (var i in v) {
                    //如果是 方法
                    if (typeof s[i] == "function") {
                        if (typeof (v[i]) == "function") {
                            s[i](
                                v[i](s, oa, n, anmGroup),
                                s, oa, n, anmGroup
                            )
                        } else {
                            s[i](
                                v[i],
                                s, oa, n, anmGroup
                            )
                        }
                    } else {
                        s[i] = v[i]
                    }
                }
            }
        }
    }


    /**
     * 
     * 
     *  fr: function () { } || { x: 1 },
     *  t: 10 || function () { } || { x: 1 },
     *  d: 10 || function () { } || { x: 1 },
     *  up: function () { } || { x: 1 },
     *  ed: function () { } || { x: 1 }
     * 
     * 
     * 
     */

    ww.anm.ini = function (oa) {
        oa.uv = {}
        oa.tv = {}
        oa.tr = {}
        oa.ds = {}
        oa.dv = {}
    }

    /**
     * 
     * 计算数值运转
     * 
     * 
     */
    ww.anm.evalRun = function (s, oa, n, anmGroup) {
        if (oa) {
            var v = oa[n]
            var t = typeof v
            var n2 = "__" + n

            oa.trz = false
            //为数值时,判断值 
            if (t == "number") {
                oa.tv[n2] = oa.tv[n2] || 0
                oa.tv[n2]++
                //值是否小于预设值 
                oa.trz = oa.tv[n2] <= v 
            } else if (!v) {
                //主设置没有时不继续运行
                oa.trz = false
            } else if (t == "function") {
                oa.trz = v(s, oa, n, anmGroup)
            } else if (t == "object") {
                var z = false
                //为对象时,判断值是否符合范围
                for (var i in v) {
                    var vt = typeof (v[i])
                    if (vt == "function") {
                        oa.tr[i] = v[i](s, oa, n, anmGroup)
                    } else if (vt == "number") {
                        oa.tv[i] = oa.tv[i] || 0
                        oa.tv[i]++
                        //值是否小于预设值 
                        oa.tr[i] = oa.tv[i] <= v[i]
                    }
                    z = z || oa.tr[i]
                }
                oa.trz = z
            } else {
                oa.trz = false
            }
            return oa.trz
        }
        return false
    }


    /**计算暂停 
     * 
    */
    ww.anm.evalStop = function (s, oa, n, anmGroup) {
        if (oa) {
            var v = oa[n]
            var t = typeof v
            var n2 = "__" + n

            oa.dsz = false
            //为数值时,判断值 
            if (t == "number") {
                //预计间隔的帧数
                oa.dv[n2] = oa.dv[n2] || 0
                oa.dv[n2]++
                //值是否小于预设值 
                //1 ,2, 3   3
                oa.dsz = oa.dv[n2] <= v
                if (!oa.dsz) {
                    oa.dv[n2] = 0
                }
            } else if (!v) {
                //主设置没有时不继续运行
                oa.dsz = false
            } else if (t == "function") {
                oa.dsz = v(s, oa, n, anmGroup)
            } else if (t == "object") {
                //为对象时,判断值是否符合范围
                for (var i in v) {
                    var vt = typeof (v[i])
                    if (vt == "function") {
                        oa.ds[i] = v[i](s, oa, n, anmGroup)
                    } else if (vt == "number") {
                        oa.dv[i] = oa.dv[i] || 0
                        oa.dv[i]++
                        //到达预设值 
                        oa.ds[i] = oa.dv[i] <= v[i]
                        //重制
                        if (!oa.ds[i]) {
                            oa.dv[i] = 0
                        }
                    }
                }
                oa.dsz = false
            } else {
                oa.dsz = false
            }
            return oa.dsz
        }
        return false
    }



    /**
     * 计算更新
     * 对于分设定 
     * oa n 为数值时
     * 增加值
     * 为对象时  
     * 如果是数组 ,进行计算
     * 如果是对象 ,对对象名对应的值进行计算
     * 
     * 否则 赋值
     * 
     * 
     * {up:{x:0}} 
     * {up:{x:0}} , "up" , "" , oa  
     * v = {x:0}
     *  
     * {oa:{x:{up:0}}}
     * {up:0} , "up" , "x"  
     *  
     * 
     * 
     */
    ww.anm.evalUpdate = function (s, oa, n, anmGroup) {
        if (oa) {
            var n2 = "__" + "t" 
            if (oa.trz && !oa.dsz) {
                //该设置
                var v = oa[n]
                //种类
                var t = typeof v
                //是方法时
                if (t == "function") {
                    //运行方法
                    v(s, oa, n, anmGroup)
                    //是对象时
                } else if (v && t == "object") {
                    //对于所有对象
                    for (var i in v) {
                        if (oa.tr[i] !== false && oa.ds[i] !== true) {
                            ww.anm.evalUpdateValue(v[i], i, s, oa, n, anmGroup)
                        }
                    }
                }
            }
        }
    }


    ww.anm.evalUpdateValue = function (v, i, s, oa, n, anmGroup) {

        //如果是 方法
        if (typeof s[i] == "function") {
            if (typeof (v) == "function") {
                s[i](
                    v(s, oa, n, anmGroup),
                    s, oa, n, anmGroup
                )
            } else {
                s[i](
                    v,
                    s, oa, n, anmGroup
                )
            }
        } else {
            if (typeof v == "number") {
                if (oa.ue && oa.ue[i]) {
                    if (oa.ue[i].type) {
                    }
                } else {
                    s[i] += v
                }
            } else {
                s[i] = v
            }
        }
    }


    ww.anm.getoa = function (name, s) {

    }

    /**
     * {fr:{x:0}} 
     * oa , "fr" , "" , oa  
     * 
     * {oa:{x:{fr:0}}}
     * {fr:0} , "fr" , "x" 
     *  
     * 
     * 
     */
    ww.anm.runAnmSt = function (name, s) {
        var name = name
        s.__anm = s.__anm || {}
        var anmGroup = s.__anm[name]
        if (!anmGroup) {
            s.anmClear(name)
            return
        }
        var list = anmGroup.list
        var index = anmGroup.index
        var oa = list[index]
        if (oa) {
            ww.anm.ini(oa)
            ww.anm.evalini(s, oa, "fr", anmGroup)
        } else {
            s.anmClear(name)
        }
    };

    ww.anm.runAnmRun = function (name, s) {
        var name = name
        s.__anm = s.__anm || {}
        var anmGroup = s.__anm[name]
        if (!anmGroup) {
            s.anmClear(name)
            return
        }
        var list = anmGroup.list
        var index = anmGroup.index
        var oa = list[index] 
        if (oa) {
            return ww.anm.evalRun(s, oa, "t", anmGroup)
        }
        return false
    }

    ww.anm.runAnmUpdate = function (name, s) {
        var name = name
        s.__anm = s.__anm || {}
        var anmGroup = s.__anm[name]
        if (!anmGroup) {
            s.anmClear(name)
            return
        }
        var list = anmGroup.list
        var index = anmGroup.index
        var oa = list[index]
        if (oa) {
            ww.anm.evalStop(s, oa, "d", anmGroup)
            ww.anm.evalUpdate(s, oa, "up", anmGroup)
        }
    }


    /**动画结束 */
    ww.anm.runAnmEnd = function (name, s) {
        var name = name
        s.__anm = s.__anm || {}
        var anmGroup = s.__anm[name]
        if (!anmGroup) {
            s.anmClear(name)
            return
        }
        var list = anmGroup.list
        var index = anmGroup.index
        var oa = list[index]
        if (oa) {
            ww.anm.evalini(s, oa, "ed", anmGroup)
        }
        anmGroup.index++
        if (anmGroup.re && list.length) {
            anmGroup.index = anmGroup.index % list.length
        }
        if (!oa.break) {
            ww.anm.runAnmSt(name, s)
        }
    };






    var Sprite_prototype_initialize = Sprite.prototype.initialize
    /**初始化 */
    Sprite.prototype.initialize = function (bitmap) {
        //精灵 初始化 呼叫(this)
        Sprite_prototype_initialize.call(this, bitmap);
        this.__anm = this.__anm || {}
    };

    var Sprite_prototype_update = Sprite.prototype.update
    /**更新 */
    Sprite.prototype.update = function () {
        //精灵 更新 呼叫(this)
        Sprite_prototype_update.call(this);
        this.updateAnm()
    };

    /**更新所有动画 */
    Sprite.prototype.updateAnm = function () {
        this.__anming = false
        for (var name in this.__anm) {
            this.__anming = true
            for (var i = this.getAnmStep(); i >= 0; i--) {
                //更新动画
                this.anmUpdate(name, this.__anm[name])
            }
        }
    };



    /**
     * 获取动画步数
     * 
     */
    Sprite.prototype.getAnmStep = function () {
        return this.__anmStep || 0
    };

    /**
     * 设置动画步数
     */
    Sprite.prototype.setAnmStep = function (i) {
        return this.__anmStep = i
    };


    /**
     * 动画播放中
     * 
     */
    Sprite.prototype.anmPlaying = function (name, c) {
        if (name) {
            if (this.__anm[name]) {
                return true
            }
        } else {
            if (this.__anming) {
                return true
            }
        }
        if (c && this.children) {
            var c = c - 1
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i] && this.children[i].anmPlaying && this.children[i].anmPlaying(name)) {
                    return true
                }
            }
        }
        return false
    }


    /**动画开始 */
    Sprite.prototype.anmSt = function (name, list, re) {
        if (!list) {
            //清除动画
            return this.anmClear(name, list)
        }
        //如果不是数组  
        var l = []

        if (Array.isArray(list)) {
            for (var i = 0; i < list.length; i++) {
                var o = ww.anm.anmToObj(list[i])
                if (o) {
                    l.push(o)
                }
            }
        } else {
            var o = ww.anm.anmToObj(list)
            if (o) {
                l.push(o)
            }
        }

        var oa = l[0]
        if (!oa) {
            return this.anmClear(name, l)
        }
        var anmGroup = {
            name: name,
            index: 0,
            list: l,
            re: re
        }
        this.__anm = this.__anm || {}
        this.__anm[name] = anmGroup
        this.__anming = true

        ww.anm.runAnmSt(name, this)
    };



    Sprite.prototype.anmAdd = function (name, list) {
        this.__anm = this.__anm || {}
        var oa = this.__anm[name]
        if (oa && oa.list.length) {
            if (list) {
                var l = []
                if (Array.isArray(list)) {
                    for (var i = 0; i < list.length; i++) {
                        var o = ww.anm.anmToObj(list[i])
                        if (o) {
                            l.push(o)
                        }
                    }
                } else {
                    var o = ww.anm.anmToObj(list)
                    if (o) {
                        l.push(o)
                    }
                }
                this.__anm[name] = oa.list.concat(l)
            }
        } else {
            this.anmSt(name, list)
        }
    };


    /**单个动画更新 */
    Sprite.prototype.anmUpdate = function (name) {
        if (ww.anm.runAnmRun(name, this)) {
            ww.anm.runAnmUpdate(name, this)
            return
        }
        ww.anm.runAnmEnd(name, this)
    }

    Sprite.prototype.anmEnd = function (name) {
        ww.anm.runAnmEnd(name, this)
    }

    /**
     * 动画清除
     */
    Sprite.prototype.anmClear = function (name, list) {
        if (name) {
            this.__anm = this.__anm || {}
            this.__anm[name] = null
            delete this.__anm[name]
        } else {
            this.__anm = {}
        }
    };


})();
