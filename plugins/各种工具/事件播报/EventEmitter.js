var EventEmitter = (function () {
    'use strict';

    var has = Object.prototype.hasOwnProperty;
    //   , prefix = '~';

    /**
     * Constructor to create a storage for our `EE` objects.
     * An `Events` instance is a plain object whose properties are event names.
     *
     * @constructor
     * @private
     */
    /*function Events() { }

    //
    // We try to not inherit from `Object.prototype`. In some engines creating an
    // instance in this way is faster than calling `Object.create(null)` directly.
    // If `Object.create(null)` is not supported we prefix the event names with a
    // character to make sure that the built-in object properties are not
    // overridden or used as an attack vector.
    //
    if (Object.create) {
        Events.prototype = Object.create(null);

        //
        // This hack is needed because the `__proto__` property is still inherited in
        // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
        //
        if (!new Events().__proto__) prefix = false;
    }*/

    /**
     * Representation of a single event listener.
     *
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
     * @constructor
     * @private
     */
    /*function EE(fn, context, once, flag) {
        this.fn = fn;
        this.context = context;
        this.once = once || false;
        this.flag = flag
    }

    function EE(fn, context, once, flag) {
        return { fn: fn, context: context, once: once || false, flag: flag }
        this.fn = fn;
        this.context = context;
        this.once = once || false;
    }*/

    /**
     * Add a listener for a given event.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {Boolean} once Specify if the listener is a one-time listener.
     * @returns {EventEmitter}
     * @private
     */
    function addListener(emitter, event, fn, context, once, flag, up) {
        if (typeof fn !== 'function') {
            // console.error('The listener must be a function')
            return false
            //throw new TypeError('The listener must be a function');
        }

        var listener = { fn: fn, context: context || emitter, once: once || false, flag: flag } //EE(fn, context || emitter, once,flag)  // new EE(fn, context || emitter, once,flag)
            , evt = event;//prefix ? prefix + event : event;

        if (!emitter._$events[evt]) {
            emitter._$events[evt] = listener, emitter._$eventsCount++;
        } else if (!emitter._$events[evt].fn) {
            if (up) {
                emitter._$events[evt].unshift(listener);
            } else {
                emitter._$events[evt].push(listener);
            }
        } else {
            if (up) {
                emitter._$events[evt] = [listener, emitter._$events[evt]];
            } else {
                emitter._$events[evt] = [emitter._$events[evt], listener];
            }
        }
        return emitter;
    }

    /**
     * Clear event by name.
     *
     * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
     * @param {(String|Symbol)} evt The Event name.
     * @private
     */
    function clearEvent(emitter, evt) {
        if (--emitter._$eventsCount === 0) {
            emitter._$events = {} //new Events();
        } else { delete emitter._$events[evt]; }
    }

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     *
     * @constructor
     * @public
     */
    function EventEmitter() {
        this._$events = {} //new Events();
        this._$eventsCount = 0;
    }

    /**
     * Return an array listing the events for which the emitter has registered
     * listeners.
     *
     * @returns {Array}
     * @public
     */
    EventEmitter.prototype.$eventNames = function eventNames() {
        var names = []
            , events
            , name;

        if (this._$eventsCount === 0) return names;

        for (name in (events = this._$events)) {
            if (has.call(events, name)) { names.push(name); }//names.push(prefix ? name.slice(1) : name);
        }

        if (Object.getOwnPropertySymbols) {
            return names.concat(Object.getOwnPropertySymbols(events));
        }

        return names;
    };

    /**
     * Return the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Array} The registered listeners.
     * @public
     */
    EventEmitter.prototype.$listeners = function listeners(event) {
        var evt = event,//prefix ? prefix + event : event
            handlers = this._$events[evt];

        if (!handlers) return [];
        if (handlers.fn) return [handlers.fn];

        for (var i = 0, l = handlers.length, ee = []; i < l; i++) {
            ee[i] = handlers[i].fn;
        }

        return ee;
    };

    /**
     * Return the number of listeners listening to a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Number} The number of listeners.
     * @public
     */
    EventEmitter.prototype.$listenerCount = function listenerCount(event) {
        var evt = event //prefix ? prefix + event : event
            , listeners = this._$events[evt];

        if (!listeners) return 0;
        if (listeners.fn) return 1;
        return listeners.length;
    };

 
    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @returns {Boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    EventEmitter.prototype.$emit = function emit(event, a1, a2, a3, a4, a5) {
        var evt = event;//prefix ? prefix + event : event;

        if (!this._$events[evt]) return false; 
        /*if (event != "onEmit") {
            this.emit("onEmit", arguments)
        } */
        var listeners = this._$events[evt]
            , len = arguments.length
            , args
            , i;

        if (listeners.fn) {
            if (listeners.once) { this.removeListener(event, listeners.fn, undefined, true); }

            switch (len) {
                case 1: return listeners.fn.call(listeners.context), true;
                case 2: return listeners.fn.call(listeners.context, a1), true;
                case 3: return listeners.fn.call(listeners.context, a1, a2), true;
                case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
                case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
                case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
            }

            for (i = 1, args = new Array(len - 1); i < len; i++) {
                args[i - 1] = arguments[i];
            }

            listeners.fn.apply(listeners.context, args);
        } else {
            var length = listeners.length
                , j;

            for (i = 0; i < length; i++) {
                if (listeners[i].once) { this.removeListener(event, listeners[i].fn, undefined, true); }
                switch (len) {
                    case 1: listeners[i].fn.call(listeners[i].context); break;
                    case 2: listeners[i].fn.call(listeners[i].context, a1); break;
                    case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
                    case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
                    default:
                        // if (!args) for (j = 1, args =[]  new Array(len - 1); j < len; j++) {
                        if (!args) for (j = 1, args = []; j < len; j++) {
                            args[j - 1] = arguments[j];
                        }
                        listeners[i].fn.apply(listeners[i].context, args);
                }
            }
        }
        return true;
    };

    /**
     * Add a listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @param {(String|Symbol)} flag  The event flag.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.$on = function on(event, fn, context, flag) {
        if (event != "onAddListener") {
            this.emit("onAddListener", arguments)
        }
        return addListener(this, event, fn, context, false, flag);
    };

    /**
     * Add a one-time listener for a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @param {(String|Symbol)} flag  The event flag.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.$once = function once(event, fn, context, flag) {
        if (event != "onAddListener") {
            this.emit("onAddListener", arguments)
        }
        return addListener(this, event, fn, context, true, flag);
    };

    /**
     * Remove the listeners of a given event.
     *
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn Only remove the listeners that match this function.
     * @param {*} context Only remove the listeners that have this context.
     * @param {Boolean} once Only remove one-time listeners.
     * @param {(String|Symbol)} flag  The event flag.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.$removeListener = function removeListener(event, fn, context, once, flag) {
        var evt = event;//prefix ? prefix + event : event;
        /*if (event != "onRemoveListener") {
            this.emit("onRemoveListener",arguments)
        }*/
        if (!this._$events[evt]) return this;
        if (!fn) {
            clearEvent(this, evt);
            return this;
        }

        var listeners = this._$events[evt];

        if (listeners.fn) {
            if (listeners.flag && listeners.flag == flag) {
                clearEvent(this, evt);
            } else if (
                listeners.fn === fn &&
                (!once || listeners.once) &&
                (!context || listeners.context === context)
            ) {
                clearEvent(this, evt);
            }
        } else {
            for (var i = 0, events = [], length = listeners.length; i < length; i++) {
                if (listeners.flag && listeners.flag != flag) {
                    events.push(listeners[i]);
                } else if (
                    listeners[i].fn !== fn ||
                    (once && !listeners[i].once) ||
                    (context && listeners[i].context !== context)
                ) {
                    events.push(listeners[i]);
                }
            }

            //
            // Reset the array, or remove it completely if we have no more listeners.
            //
            if (events.length) {
                this._$events[evt] = events.length === 1 ? events[0] : events;
            } else {
                clearEvent(this, evt);
            }
        }

        return this;
    };

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    EventEmitter.prototype.$removeAllListeners = function removeAllListeners(event) {
        var evt;
        /*if (event != "onRemoveAllListeners") {
            this.emit("onRemoveAllListeners",arguments)
        }*/

        if (event) {
            evt = event;//prefix ? prefix + event : event;
            if (this._$events[evt]) { clearEvent(this, evt); }
        } else {
            this._$events = {} //new Events();
            this._$eventsCount = 0;
        }

        return this;
    };

    //
    // Alias methods names because people roll like that.
    //
    EventEmitter.prototype.$off = EventEmitter.prototype.$removeListener;
    EventEmitter.prototype.$addListener = EventEmitter.prototype.$on;

    //
    // Expose the prefix.
    //
    //EventEmitter.prefixed = prefix;

    //
    // Allow `EventEmitter` to be imported as module namespace.
    //
    EventEmitter.EventEmitter = EventEmitter;

    //
    // Expose the module.
    //

    return EventEmitter
})()