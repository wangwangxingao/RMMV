/*
 * Undo.js - A undo/redo framework for JavaScript
 * 
 * http://jzaefferer.github.com/undo
 *
 * Copyright (c) 2011 Jörn Zaefferer
 * MIT licensed.
 */
(function () {

    // based on Backbone.js' inherits	
    var ctor = function () { };
    //继承
    var inherits = function (parent, protoProps) {
        var child;

        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () { return parent.apply(this, arguments); };
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        if (protoProps) extend(child.prototype, protoProps);

        child.prototype.constructor = child;
        child.__super__ = parent.prototype;
        return child;
    };

    //延伸
    function extend(target, ref) {
        for (name in ref) {
            var value = ref[name];
            if (value !== undefined) {
                target[name] = value;
            }
        }
        return target;
    };

    var Undo;
    if (typeof exports !== 'undefined') {
        Undo = exports;
    } else {
        Undo = this.Undo = {};
    }

    //堆
    Undo.Stack = function () {
        this.commands = [];
        this.stackPosition = -1;
        this.savePosition = -1;
    };

    //延伸
    extend(Undo.Stack.prototype, {
        ///执行
        execute: function (command) {
            this._clearRedo();
            command.execute();
            this.commands.push(command);
            this.stackPosition++;
            this.changed();
        },
        //解开
        undo: function () {
            if (!this.canUndo()) return;
            this.commands[this.stackPosition].undo();
            this.stackPosition--;
            this.changed();
        },
        //可以撤消
        canUndo: function () {
            return this.stackPosition >= 0;
        },
        //重做
        redo: function () {
            if (!this.canRedo()) return;
            this.stackPosition++;
            this.commands[this.stackPosition].redo();
            this.changed();
        },
        //可以重做
        canRedo: function () {
            return this.stackPosition < this.commands.length - 1;
        },
        //保存
        save: function () {
            this.savePosition = this.stackPosition;
            this.changed();
        },
        //脏
        dirty: function () {
            return this.stackPosition != this.savePosition;
        },
        //清除堆栈
        clearStack: function () {
            this.commands = [];
            this.stackPosition = -1;
            this.savePosition = -1;
            this.changed();
        },
        //清除重做
        _clearRedo: function () {
            // TODO there's probably a more efficient way for this
            this.commands = this.commands.slice(0, this.stackPosition + 1);
        },
        //变
        changed: function () {
            // do nothing, override
        }
    });

    //命令
    Undo.Command = function (name) {
        this.name = name;
    }

    var up = new Error("override me!");

    //延伸
    extend(Undo.Command.prototype, {
        execute: function () {
            throw up;
        },
        undo: function () {
            throw up;
        },
        redo: function () {
            this.execute();
        }
    });

    //延伸
    Undo.Command.extend = function (protoProps) {
        var child = inherits(this, protoProps);
        child.extend = Undo.Command.extend;
        return child;
    };

    //扩展wopop 2.0撤销框架 by renzhen
    var undo_stack = new Undo.Stack();
    //撤消容器
    var Undo_Container = Undo.Command.extend({
        constructor: function () {
            this.undoarr = [];
        },
        execute: function () { },
        undo: function () {
            var undoarr = this.undoarr;
            for (var i = 0; i < undoarr.length; i++) {
                var undoobj = undoarr[i];
                undoobj.undo();
            }
        },
        redo: function () {
            var undoarr = this.undoarr;
            for (var i = 0; i < undoarr.length; i++) {
                var undoobj = undoarr[i];
                undoobj.redo();
            }
        },
        //
        add: function (undoobj) {
            this.undoarr.push(undoobj);
        },
        insert: function () {
            if (this.undoarr.length == 0) return;
            if (this.undoarr.length == 1) {
                undo_stack.execute(this.undoarr[0]);
            } else {
                undo_stack.execute(this);
            }
        }
    });

    window.undo_stack = undo_stack;
    var stack_is_open = true;
    var undo__multi_container = null;
    var defaultcommandobj = {
        execute: $.noop,
        setOldVal: function (val) {
            this.oldValue = val;
        },
        setNewVal: function (val) {
            this.newValue = val;
        },
        insert: function () {
            if (stack_is_open && !this.equals()) {
                if (undo__multi_container != null) {
                    undo__multi_container.add(this);
                } else {
                    undo_stack.execute(this);
                }
            }
        },
        insertWithNewVal: function (newval) {
            this.setNewVal(newval);
            this.insert();
        },
        insertWithVals: function (oldval, newval) {
            this.setOldVal(oldval);
            this.setNewVal(newval);
            this.insert();
        }
    };

    //交易
    Undo.Transaction = {
        start: function (is_open) {
            if (undo__multi_container != null) {
                Undo.Transaction.end();
            }
            if (typeof (is_open) == 'undefined') {
                is_open = true;
            }
            stack_is_open = is_open ? true : false;
            undo__multi_container = new Undo_Container();
        },
        end: function () {
            stack_is_open = true;
            if (undo__multi_container != null) {
                undo__multi_container.insert();
                undo__multi_container = null;
            }
        }
    };

    Undo.Command.DefaultEqAct = function (oldval, newval) {
        if ($.isPlainObject(oldval) && $.isPlainObject(newval)) {
            var mergedobj = $.extend({}, oldval, newval);
            for (var k in mergedobj) {
                if (!Undo.Command.DefaultEqAct(oldval[k], newval[k])) return false;
            }
            return true;
        } else if ($.isArray(oldval) && $.isArray(newval)) {
            if (oldval.length != newval.length) return false;
            for (var i = 0; i < oldval.length; i++) {
                if (!Undo.Command.DefaultEqAct(oldval[i], newval[i])) return false;
            }
            return true;
        } else {
            return oldval == newval;
        }
    }

    Undo.Command.createGlobalCommand = function (undoobj, options) {
        var undofunc;
        var redofunc;
        if ($.isFunction(undoobj)) {
            undofunc = redofunc = undoobj;
        } else {
            var obj = $.extend({ undo: $.noop, redo: $.noop }, undoobj);
            undofunc = obj.undo;
            redofunc = obj.redo;
        }
        var opts = $.extend({ returntype: 'obj', equalact: 'default' }, options);
        var eqact = opts.equalact;
        if (eqact == 'default') eqact = Undo.Command.DefaultEqAct;
        else if (!$.isFunction(eqact)) {
            eqact = function () { return false; }
        }
        var cmdclass = Undo.Command.extend($.extend({ constructor: function () { } }, defaultcommandobj, {
            undo: function () {
                undofunc(this.oldValue);
            },
            equals: function () {
                return eqact(this.oldValue, this.newValue);
            },
            redo: function () {
                redofunc(this.newValue);
            }
        }));
        if (opts.returntype == 'class') return cmdclass;
        else return new cmdclass();
    }

    Undo.Command.createModuleCommand = function (undoobj, blockid, options) {
        var undofunc;
        var redofunc;
        if ($.isFunction(undoobj)) {
            undofunc = redofunc = undoobj;
        } else {
            var obj = $.extend({ undo: $.noop, redo: $.noop }, undoobj);
            undofunc = obj.undo;
            redofunc = obj.redo;
        }
        var opts = $.extend({ returntype: 'obj', equalact: 'default' }, options);
        var eqact = opts.equalact;
        if (eqact == 'default') eqact = Undo.Command.DefaultEqAct;
        else if (!$.isFunction(eqact)) {
            eqact = function () { return false; }
        }
        var cmdclass = Undo.Command.extend($.extend({
            constructor: function (modid) {
                this.blockid = modid;
            }
        }, defaultcommandobj, {
                undo: function () {
                    undofunc(this.blockid, this.oldValue);
                },
                equals: function () {
                    return eqact(this.oldValue, this.newValue);
                },
                redo: function () {
                    redofunc(this.blockid, this.newValue);
                }
            }));
        if (opts.returntype == 'class') return cmdclass;
        else return new cmdclass(blockid);
    }

}).call(this);
