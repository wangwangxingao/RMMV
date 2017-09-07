
//-----------------------------------------------------------------------------
/**处理与JSON对象信息的静态类
 * The static class that handles JSON with object information.
 * json扩展
 * @class JsonEx
 */
function JsonEx() {
    throw new Error('This is a static class');
}

/**对象的最大深度
 * The maximum depth of objects.
 *
 * @static
 * @property maxDepth
 * @type Number
 * @default 100
 */
//最大深度
JsonEx.maxDepth = 100;

/**一个对象转换为JSON字符串对象的信息
 * Converts an object to a JSON string with object information.
 *
 * @static
 * @method stringify
 * @param {Object} object The object to be converted
 * @return {String} The JSON string
 */
//转换
JsonEx.stringify = function(object) {
	//返回 json转换( 编码 (对象))
    return JSON.stringify(this._encode(object));
};

/**解析JSON字符串，并重建了相应的对象
 * Parses a JSON string and reconstructs the corresponding object.
 *
 * @static
 * @method parse
 * @param {String} json The JSON string
 * @return {Object} The reconstructed object
 */
JsonEx.parse = function(json) {
	//返回 解码 (json解析(json))
    return this._decode(JSON.parse(json));
};

/**制作指定对象的深层副本
 * Makes a deep copy of the specified object.
 *
 * @static
 * @method makeDeepCopy
 * @param {Object} object The object to be copied
 * @return {Object} The copied object
 */
//制作深层副本
JsonEx.makeDeepCopy = function(object) {
	//返回 解析 (转换 (对象))
    return this.parse(this.stringify(object));
};

/**编码
 * @static
 * @method _encode
 * @param {Object} value
 * @param {Number} depth
 * @return {Object}
 * @private
 */
//编码
JsonEx._encode = function(value, depth) {
    depth = depth || 0;
    if (++depth >= this.maxDepth) {
        throw new Error('Object too deep');
    }
    var type = Object.prototype.toString.call(value);
    if (type === '[object Object]' || type === '[object Array]') {
        var constructorName = this._getConstructorName(value);
        if (constructorName !== 'Object' && constructorName !== 'Array') {
            value['@'] = constructorName;
        }
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                value[key] = this._encode(value[key], depth + 1);
            }
        }
    }
    depth--;
    return value;
};

/**解码
 * @static
 * @method _decode
 * @param {Object} value
 * @return {Object}
 * @private
 */
JsonEx._decode = function(value) {
    var type = Object.prototype.toString.call(value);
    if (type === '[object Object]' || type === '[object Array]') {
        if (value['@']) {
            var constructor = window[value['@']];
            if (constructor) {
                value = this._resetPrototype(value, constructor.prototype);
            }
        }
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                value[key] = this._decode(value[key]);
            }
        }
    }
    return value;
};

/**获得建设者名称
 * @static
 * @method _getConstructorName
 * @param {Object} value
 * @return {String}
 * @private
 */
JsonEx._getConstructorName = function(value) {
    var name = value.constructor.name;
    if (name === undefined) {
        var func = /^\s*function\s*([A-Za-z0-9_$]*)/;
        name = func.exec(value.constructor)[1];
    }
    return name;
};

/**重设原形
 * @static
 * @method _resetPrototype
 * @param {Object} value
 * @param {Object} prototype
 * @return {Object}
 * @private
 */
JsonEx._resetPrototype = function(value, prototype) {
    if (Object.setPrototypeOf !== undefined) {
        Object.setPrototypeOf(value, prototype);
    } else if ('__proto__' in value) {
        value.__proto__ = prototype;
    } else {
        var newValue = Object.create(prototype);
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                newValue[key] = value[key];
            }
        }
        value = newValue;
    }
    return value;
};
