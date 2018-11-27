/**----------------------------------------------------------------------------- */
/**处理与JSON对象信息的静态类
 * The static class that handles JSON with object information.
 * json扩展
 * @class JsonEx
 */
function JsonEx() {
    throw new Error('This is a static class');
}

/**最大深度
 * 
 * 对象的最大深度
 * The maximum depth of objects.
 *
 * @static
 * @property maxDepth
 * @type Number
 * @default 100
 */
JsonEx.maxDepth = 100;

JsonEx._id = 1;

//生成id
JsonEx._generateId = function() {
    return JsonEx._id++;
};

/**转换
 * 
 * 一个对象转换为JSON字符串对象的信息
 * Converts an object to a JSON string with object information.
 *
 * @static
 * @method stringify
 * @param {{}} object The object to be converted
 * @return {string} The JSON string
 */
JsonEx.stringify = function(object) {
    //循环的
    var circular = [];
    JsonEx._id = 1;
    var json = JSON.stringify(this._encode(object, circular, 0));
    this._cleanMetadata(object);
    this._restoreCircularReference(circular);

    return json;
};

JsonEx._restoreCircularReference = function(circulars) {
    circulars.forEach(function(circular) {
        var key = circular[0];
        var value = circular[1];
        var content = circular[2];

        value[key] = content;
    });
};

/**解析JSON字符串，并重建了相应的对象
 * Parses a JSON string and reconstructs the corresponding object.
 *
 * @static
 * @method parse
 * @param {string} json The JSON string
 * @return {{}} The reconstructed object
 */
JsonEx.parse = function(json) {
    var circular = [];
    var registry = {};
    var contents = this._decode(JSON.parse(json), circular, registry);
    this._cleanMetadata(contents);
    this._linkCircularReference(contents, circular, registry);

    return contents;
};

JsonEx._linkCircularReference = function(contents, circulars, registry) {
    circulars.forEach(function(circular) {
        var key = circular[0];
        var value = circular[1];
        var id = circular[2];

        value[key] = registry[id];
    });
};

JsonEx._cleanMetadata = function(object) {
    if (!object) return;

    delete object['@'];
    delete object['@c'];

    if (typeof object === 'object') {
        Object.keys(object).forEach(function(key) {
            var value = object[key];
            if (typeof value === 'object') {
                JsonEx._cleanMetadata(value);
            }
        });
    }
};

/**制作深层副本
 * 
 * 制作指定对象的深层副本
 * Makes a deep copy of the specified object.
 *
 * @static
 * @method makeDeepCopy
 * @param {{}} object The object to be copied
 * @return {{}} The copied object
 */
JsonEx.makeDeepCopy = function(object) {
    //返回 解析 (转换 (对象))
    return this.parse(this.stringify(object));
};

/**编码
 * @static
 * @method _encode
 * @param {{}} value 值
 * @param {[]} circular 循环
 * @param {number} depth 深度
 * @return {{}} 返回 对象
 * @private
 */
JsonEx._encode = function(value, circular, depth) {
    depth = depth || 0;
    if (++depth >= this.maxDepth) {
        throw new Error('Object too deep');
    }
    var type = Object.prototype.toString.call(value);
    if (type === '[object Object]' || type === '[object Array]') {
        //值["@c"] = 生成id()
        value['@c'] = JsonEx._generateId();

        //构造函数名称 = 获取构造函数名称(值)
        var constructorName = this._getConstructorName(value);
        //如果(构造函数名称 !==  'Object' 并且 构造函数名称 !== 'Array')
        if (constructorName !== 'Object' && constructorName !== 'Array') {
            //值["@"] = 构造函数名称
            value['@'] = constructorName;
        }
        //循环 键 在 值
        for (var key in value) {
            //如果(值 拥有自己的属性(键) 并且 键不存在 !@)
            if (value.hasOwnProperty(key) && !key.match(/^@./)) {
                //如果(值[键] 并且 种类 值[键] === 'object' )
                if (value[key] && typeof value[key] === 'object') {
                    //如果(值[键]['@c'])  
                    //     这个对象已经被转化过
                    if (value[key]['@c']) {
                        //循环 添加([键,值,值[键] ])
                        circular.push([key, value, value[key]]);
                        //值[键] = {'@r' : 值[键]["@c"]}
                        value[key] = { '@r': value[key]['@c'] };
                    } else {
                        //值[键] = 编码(值[键],循环,深度+1)
                        value[key] = this._encode(value[key], circular, depth + 1);
                        //如果 值键 是 数组
                        if (value[key] instanceof Array) {
                            //wrap array
                            //循环 添加 ([])
                            circular.push([key, value, value[key]]);
                            //值[键] = {'@c': 值[键]['@c'],'@a': 值[键]}
                            value[key] = {
                                '@c': value[key]['@c'],
                                '@a': value[key]
                            };
                        }
                    }
                } else {
                    //值[键] = 编码(值[键],循环,深度+1)
                    value[key] = this._encode(value[key], circular, depth + 1);
                }
            }
        }
    }
    depth--;
    return value;
};

/**解码
 * @static
 * @method _decode 
 * @param {{}} value 值
 * @param {[]} circular 循环
 * @param {{}} registry 注册处
 * @return {{}} 对象
 * @private
 */

JsonEx._decode = function(value, circular, registry) {
    var type = Object.prototype.toString.call(value);
    if (type === '[object Object]' || type === '[object Array]') {

        //注册[值['@c'] = 值]
        registry[value['@c']] = value;

        //如果(值["@"])
        if (value['@']) {
            //构造函数 = 窗口[值['@']]
            var constructor = window[value['@']];
            if (constructor) {
                //值 = 重设原形(值,)
                value = this._resetPrototype(value, constructor.prototype);
            }
        }
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (value[key] && value[key]['@a']) {
                    //object is array wrapper
                    var body = value[key]['@a'];
                    body['@c'] = value[key]['@c'];
                    value[key] = body;
                }
                if (value[key] && value[key]['@r']) {
                    //object is reference
                    circular.push([key, value, value[key]['@r']])
                }
                value[key] = this._decode(value[key], circular, registry);
            }
        }
    }
    return value;
};

/**获得建设者名称
 * @static
 * @method _getConstructorName
 * @param {{}} value
 * @return {string}
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
 * @param {{}} value
 * @param {{}} prototype
 * @return {{}}
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