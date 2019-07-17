var bt = {};
(function (bt) {
    bt.VERSION = '0.2.2';
    bt.SUCCESS = 1;
    bt.FAILURE = 2;
    bt.RUNNING = 3;
    bt.ERROR = 4;
    bt.COMPOSITE = 'composite';
    bt.DECORATOR = 'decorator';
    bt.ACTION = 'action';
    bt.CONDITION = 'condition';

    /**获取uuid
     * 
     */
    var generateUUID = (function () {
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
        var lut = [];
        for (var i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }
        return function generateUUID() {
            var d0 = Math.random() * 0xffffffff | 0;
            var d1 = Math.random() * 0xffffffff | 0;
            var d2 = Math.random() * 0xffffffff | 0;
            var d3 = Math.random() * 0xffffffff | 0;
            var uuid = lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
            // .toUpperCase() here flattens concatenated strings to save heap memory space.
            return uuid.toUpperCase();
        };

    })();


    /**克隆 */
    var clone = function (that) {
        var obj
        if (that && typeof (that) === "object") {
            if (Array.isArray(that)) { //Object.prototype.toString.call(that) === '[object Array]') { 
                obj = [];
                for (var i = 0; i < that.length; i++) {
                    obj[i] = this.deepCopy(that[i]);
                }
                return obj;
            } else {
                obj = {}
                for (var i in that) {
                    obj[i] = this.deepCopy(that[i])
                }
                return obj;
            }
        }
        return obj = that;
    };


    /**设置 */
    var setDefault = function (o, set) {
        var o = o || {}
        var set = set || {}
        var defaultset = defaultset || {}
        for (var n in set) {
            o[n] = clone(set[n])
        }
        var l = arguments
        for (var i = 2; i < arguments.length; i++) {
            if (arguments[i]) {
                var defaultset = arguments[i] || {}
                for (var n in defaultset) {
                    if (o[n] === undefined) {
                        o[n] = clone(defaultset[n])
                    }
                }
            }
        }
    };



    /**
     * 背景板
     */
    function Blackboard() {
        this.initialize.apply(this, arguments);
    };

    /**设置原形 */
    Blackboard.prototype = Object.create(Blackboard.prototype);
    /**设置创造者*/
    Blackboard.prototype.constructor = Blackboard;
    /**
     * 初始化方法。
     * @method initialize
     * @constructor
     **/
    Blackboard.prototype.initialize = function () {
        this._baseMemory = {};
        this._treeMemory = {};
    }

    /**
     * 检索树上下文内存的内部方法。如果记忆确实如此
     *不存在，此方法创建它。
     *
     * @method _getTreeMemory
     * @param {String} treeScope The id of the tree in scope.
     * @return {Object} 树的记忆。
     * @protected
     **/
    Blackboard.prototype._getTreeMemory = function (treeScope) {
        if (!this._treeMemory[treeScope]) {
            this._treeMemory[treeScope] = {
                'nodeMemory': {},
                'openNodes': [],
                'traversalDepth': 0,
                'traversalCycle': 0,
            };
        }
        return this._treeMemory[treeScope];
    }

    /**
     * 给定树的内部方法来检索节点上下文内存
     * 记忆。如果内存不存在，则此方法创建为。
     *
     * @method _getNodeMemory
     * @param {String} treeMemory the tree memory.
     * @param {String} nodeScope The id of the node in scope.
     * @return {Object} The node memory.
     * @protected
     **/
    Blackboard.prototype._getNodeMemory = function (treeMemory, nodeScope) {
        var memory = treeMemory.nodeMemory;
        if (!memory[nodeScope]) {
            memory[nodeScope] = {};
        }

        return memory[nodeScope];
    }

    /**
     * Internal method to retrieve the context memory. If treeScope and
     * nodeScope are provided, this method returns the per node per tree
     * memory. If only the treeScope is provided, it returns the per tree
     * memory. If no parameter is provided, it returns the global memory.
     * Notice that, if only nodeScope is provided, this method will still
     * return the global memory.
     * 
     * 检索上下文内存的内部方法。如果是treeScope和
     * 提供了nodeScope，此方法返回每个树的每个节点
     * 记忆。如果仅提供treeScope，则返回每棵树
     * 记忆。如果未提供参数，则返回全局内存。
     * 请注意，如果仅提供nodeScope，则此方法仍然存在
     * 返回全局内存。
     * 
     * @method _getMemory
     * @param {String} treeScope The id of the tree scope.
     * @param {String} nodeScope The id of the node scope.
     * @return {Object} A memory object.
     * @protected
     **/
    Blackboard.prototype._getMemory = function (treeScope, nodeScope) {
        var memory = this._baseMemory;
        if (treeScope) {
            memory = this._getTreeMemory(treeScope);
            if (nodeScope) {
                memory = this._getNodeMemory(memory, nodeScope);
            }
        }

        return memory;
    }

    /**
     * 在黑板上存储一个值。如果是treeScope和nodeScope
     * 提供，此方法将值保存到每个树的每个节点
     * 记忆。如果仅提供了treeScope，则会将值保存到
     * 每树记忆。如果未提供参数，则此方法将保存
     * 将值传入全局内存。请注意，如果只有nodeScope
     * 提供（但不支持treeScope），此方法仍将保存值
     * 全球记忆。
     *
     * @method set
     * @param {String} key The key to be stored.
     * @param {String} value The value to be stored.
     * @param {String} treeScope The tree id if accessing the tree or node
     *                           memory.
     * @param {String} nodeScope The node id if accessing the node memory.
     **/
    Blackboard.prototype.set = function (key, value, treeScope, nodeScope) {
        var memory = this._getMemory(treeScope, nodeScope);
        memory[key] = value;
    }

    /**
     *检索黑板中的值。如果是treeScope和nodeScope
     *提供，此方法将从每个树的每个节点检索值
     *记忆。如果仅提供了treeScope，它将检索该值
     *来自每棵树的记忆。如果没有提供参数，则此方法将
     *从全局内存中检索。如果只提供了nodeScope（但是
     * treeScope not），这种方法仍然会尝试从全局检索
     *记忆。
     *
     * @method get
     * @param {String} key The key to be retrieved.
     * @param {String} treeScope The tree id if accessing the tree or node
     *                           memory.
     * @param {String} nodeScope The node id if accessing the node memory.
     * @return {Object} The value stored or undefined.
     **/
    Blackboard.prototype.get = function (key, treeScope, nodeScope) {
        var memory = this._getMemory(treeScope, nodeScope);
        return memory[key];
    }


    function Tick() {
        this.initialize.apply(this, arguments);
    }

    /**设置原形 */
    Tick.prototype = Object.create(Tick.prototype);
    /**设置创造者*/
    Tick.prototype.constructor = Tick;


    /**
     * Initialization method.
     * @method initialize
     * @constructor
     **/
    Tick.prototype.initialize = function () {
        // set by BehaviorTree 
        /**
         * The tree reference.
         * @property {b3.BehaviorTree} tree
         * @readOnly
         **/
        this.tree = null;

        /**
         * The debug reference.
         * @property {Object} debug
         * @readOnly
         */
        this.debug = null;

        /**
         * The target object reference.
         * @property {Object} target
         * @readOnly
         **/
        this.target = null;

        /**
         * The blackboard reference.
         * @property {b3.Blackboard} blackboard
         * @readOnly
         **/
        this.blackboard = null;

        // updated during the tick signal

        /**
         * The list of open nodes. Update during the tree traversal.
         * @property {Array} _openNodes
         * @protected
         * @readOnly
         **/
        this._openNodes = [];

        /**
         * The number of nodes entered during the tick. Update during the tree
         * traversal.
         *
         * @property {Integer} _nodeCount
         * @protected
         * @readOnly
         **/
        this._nodeCount = 0;
    }

    /**
     * Called when entering a node (called by BaseNode).
     * @method _enterNode
     * @param {Object} node The node that called this method.
     * @protected
     **/
    Tick.prototype._enterNode = function (node) {
        this._nodeCount++;
        this._openNodes.push(node);
        // TODO: call debug here
    }

    /**
     * Callback when opening a node (called by BaseNode).
     * @method _openNode
     * @param {Object} node The node that called this method.
     * @protected
     **/
    Tick.prototype._openNode = function (node) {
        // TODO: call debug here
    }
    /**
     * Callback when ticking a node (called by BaseNode).
     * @method _tickNode
     * @param {Object} node The node that called this method.
     * @protected
     **/
    Tick.prototype._tickNode = function (node) {
        // TODO: call debug here
    }

    /**
     * Callback when closing a node (called by BaseNode).
     * @method _closeNode
     * @param {Object} node The node that called this method.
     * @protected
     **/
    Tick.prototype._closeNode = function (node) {
        // TODO: call debug here
        this._openNodes.pop();
    }

    /**
     * Callback when exiting a node (called by BaseNode).
     * @method _exitNode
     * @param {Object} node The node that called this method.
     * @protected
     **/
    Tick.prototype._exitNode = function (node) {
        // TODO: call debug here
    }




    /**基础节点 */
    function BaseNode() {
        this.initialize.apply(this, arguments);
    }

    /**设置原形 */
    BaseNode.prototype = Object.create(BaseNode.prototype);
    /**设置创造者*/
    BaseNode.prototype.constructor = BaseNode;
    BaseNode.defaultset = {
        /**分类 */
        category: "",
        /**名称 */
        name: "",
        /**标题 */
        title: "",
        /**说明 */
        description: "",
        /**参数 */
        //param: {},
        /**子项 */
        child: [],
        /**d3 属性 */
        properties: {},
        /**d3 参数 */
        parameters: {},

    }
    /**初始化 */
    BaseNode.prototype.initialize = function (set) {
        setDefault(this, set, BaseNode.defaultset)
        if (this.id === undefined) {
            this.id = generateUUID();
        }
    }



    /**
     * This is the main method to propagate the tick signal to this node. This
     * method calls all callbacks: `enter`, `open`, `tick`, `close`, and
     * `exit`. It only opens a node if it is not already open. In the same
     * way, this method only close a node if the node  returned a status
     * different of `bt.RUNNING`.
     * 
     *这是将滴答信号传播到该节点的主要方法。这个
     *方法调用所有回调：`enter`，`open`，`tick`，`close`，和
     *`退出`。它只在尚未打开的情况下打开一个节点。在相同的
     *方式，此方法仅在节点返回状态时关闭节点
     *不同的'bt.RUNNING`。
     *
     * @method _execute
     * @param {Tick} tick A tick instance.
     * @return {Constant} The tick state.
     * @protected
     **/
    BaseNode.prototype._execute = function (tick) {
        // ENTER
        this._enter(tick);

        // OPEN
        if (!tick.blackboard.get('isOpen', tick.tree.id, this.id)) {
            this._open(tick);
        }

        // TICK
        var status = this._tick(tick);

        // CLOSE
        if (status !== bt.RUNNING) {
            this._close(tick);
        }

        // EXIT
        this._exit(tick);

        return status;
    }

    /**
     * Wrapper for enter method.
     *  
     * @method _enter
     * @param {Tick} tick A tick instance.
     * @protected
     **/
    BaseNode.prototype._enter = function (tick) {
        tick._enterNode(this);
        return this.enter(tick);
    }

    /**
     * Wrapper for open method.
     * @method _open
     * @param {Tick} tick A tick instance.
     * @protected
     **/
    BaseNode.prototype._open = function (tick) {
        tick._openNode(this);
        tick.blackboard.set('isOpen', true, tick.tree.id, this.id);
        return this.open(tick);
    }

    /**
     * Wrapper for tick method.
     * 用于滴答方法的包装。
     * @method _tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     * @protected
     **/
    BaseNode.prototype._tick = function (tick) {
        tick._tickNode(this);
        return this.tick(tick);
    }

    /**
     * Wrapper for close method.
     * @method _close
     * @param {Tick} tick A tick instance.
     * @protected
     **/
    BaseNode.prototype._close = function (tick) {
        tick._closeNode(this);
        tick.blackboard.set('isOpen', false, tick.tree.id, this.id);
        return this.close(tick);
    }

    /**
     * Wrapper for exit method.
     * @method _exit
     * @param {Tick} tick A tick instance.
     * @protected
     **/
    BaseNode.prototype._exit = function (tick) {
        tick._exitNode(this);
        return this.exit(tick);
    }

    /**
     * Enter method, override this to use. It is called every time a node is
     * asked to execute, before the tick itself.
     *
     * @method enter
     * @param {Tick} tick A tick instance.
     **/
    BaseNode.prototype.enter = function (tick) { }

    /**
     * Open method, override this to use. It is called only before the tick
     * callback and only if the not isn't closed.
     *
     * Note: a node will be closed if it returned `bt.RUNNING` in the tick.
     * 打开方法，覆盖此使用。它只在滴答声之前调用
     * 回调，仅当not未关闭时。
     *
     * 注意：如果一个节点在勾选中返回“RUNNING”，它将被关闭。
     *
     * @method open
     * @param {Tick} tick A tick instance.
     **/
    BaseNode.prototype.open = function (tick) { }

    /**
     * Tick method, override this to use. This method must contain the real
     * execution of node (perform a task, call children, etc.). It is called
     * every time a node is asked to execute.
     * 
     * 方法必须包含真实的
     * 执行节点（执行任务，呼叫孩子等）。它被称为
     * 每次要求节点执行时。
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     **/
    BaseNode.prototype.tick = function (tick) { }

    /**
     * Close method, override this to use. This method is called after the tick
     * callback, and only if the tick return a state different from
     * `bt.RUNNING`.
     *
     * @method close
     * @param {Tick} tick A tick instance.
     **/
    BaseNode.prototype.close = function (tick) { }



    /**
     * Exit method, override this to use. Called every time in the end of the
     * execution.
     * 退出方法，覆盖此使用。每次在最后调用
     * 执行。
     * @method exit
     * @param {Tick} tick A tick instance.
     **/
    BaseNode.prototype.exit = function (tick) { }





    /**
     * 行为树
     */
    function BehaviorTree() {
        this.initialize.apply(this, arguments);
    }

    /**设置原形 */
    BehaviorTree.prototype = Object.create(BaseNode.prototype);
    /**设置创造者*/
    BehaviorTree.prototype.constructor = BehaviorTree;

    BehaviorTree.defaultset = {
        category: "BehaviorTree",
        /**名称 */
        name: "BehaviorTree",

        title: 'The behavior tree',
        description: 'Default description',
        //param: {},
        root: null,
        debug: "",
        /**d3参数 */
        properties: {},
    }


    /**
     * 初始化
     **/
    BehaviorTree.prototype.initialize = function (set) {
        setDefault(this, set, BehaviorTree.defaultset)
        BaseNode.prototype.initialize.call(this)
    }

    /**
     * This method loads a Behavior Tree from a data structure, populating this
     * object with the provided data. Notice that, the data structure must
     * follow the format specified by Behavior3JS. Consult the guide to know
     * more about this format.
     *
     * You probably want to use custom nodes in your BTs, thus, you need to
     * provide the `names` object, in which this method can find the nodes by
     * `names[NODE_NAME]`. This variable can be a namespace or a dictionary,
     * as long as this method can find the node by its name, for example:
     *
     *     //json
     *     ...
     *     'node1': {
     *       'name': MyCustomNode,
     *       'title': ...
     *     }
     *     ...
     *
     *     //code
     *     var bt = new b3.BehaviorTree();
     *     bt.load(data, {'MyCustomNode':MyCustomNode})
     *
     *
     * @method load
     * @param {Object} data The data structure representing a Behavior Tree.
     * @param {Object} [names] A namespace or dict containing custom nodes.
     **/

    BehaviorTree.prototype.load = function (data, names) {
        var id, temp, node;

        names = names || bt || {};

        /**设置树的数据 */
        this.title = data.title || this.title;
        this.description = data.description || this.description;


        //setDefault(this.param, data.param, data.properties)

        /**d3参数 */
        setDefault(this.properties, data.properties)


        var nodes = {};

        // Create the node list (without connection between them)
        for (id in data.nodes) {
            temp = data.nodes[id];
            var Cls;

            if (temp.name in names) {
                // Look for the name in custom nodes
                Cls = names[temp.name];
            } else {
                // Invalid node name
                throw new EvalError('BehaviorTree.load: Invalid node name + "' +
                    temp.name + '".');
            }
            node = new Cls(temp.properties);
            node.id = temp.id || node.id;
            node.title = spec.title || node.title;
            node.description = spec.description || node.description;


            /**
             * b3 
             */
            node.properties = spec.properties || node.properties;

            /**设置参数 */
            //setDefault(node.param, spec.param, spec.properties, node.properties, node.param)


            nodes[id] = node;
        }

        // Connect the nodes
        /**链接节点 */
        for (id in data.nodes) {
            temp = data.nodes[id];
            node = nodes[id];
            if (temp.category === bt.COMPOSITE && temp.children) {
                for (var i = 0; i < temp.children.length; i++) {
                    var cid = temp.children[i];
                    var cnode = nodes[cid]
                    cnode.parent = id
                    node.children.push(cnode);
                }
            } else if (temp.category === bt.DECORATOR) {
                if (temp.child) {
                    var cnode = nodes[cid];
                    cnode.parent = id;
                    node.children.push(cnode);
                } else if (temp.children) {
                    for (var i = 0; i < temp.children.length; i++) {
                        var cid = temp.children[i];
                        var cnode = nodes[cid]
                        cnode.parent = id
                        node.children.push(cnode);
                    }
                }
            }

            /*if (temp.children) {
                for (var i = 0; i < temp.children.length; i++) {
                    var cid = temp.children[i];
                    var cnode = nodes[cid]
                    cnode.parent = id
                    node.children.push(cnode);
                }
            } else if (temp.child) {
                var cid = temp.child
                var cnode = nodes[cid]
                cnode.parent = id
                node.children.push(cnode);
            }
            */
        }
        this.root = nodes[data.root];

        this.nodes = nodes
    }

    /**
     * This method dump the current BT into a data structure.
     *
     * Note: This method does not record the current node parameters. Thus,
     * it may not be compatible with load for now.
     *
     * 该方法将当前BT转储到数据结构中。
     *
     * 注意：此方法不记录当前节点参数。从而，
     * 它现在可能与负载不兼容。
     * 
     * @method dump
     * @return {Object} A data object representing this tree.
     **/
    BehaviorTree.prototype.save = function () {
        var data = {};
        var customNames = [];

        data.title = this.title;
        data.description = this.description;
        data.root = (this.root) ? this.root.id : null;
        data.properties = this.properties;

        //data.param = this.param ||this.properties


        data.nodes = {};
        data.custom_nodes = [];

        if (!this.root) return data;

        var stack = [this.root];
        while (stack.length > 0) {
            var node = stack.pop();
            var temp = {};
            temp.id = node.id;
            temp.name = node.name;
            temp.title = node.title;
            temp.description = node.description;
            temp.properties = node.properties;
            temp.parameters = node.parameters;

            //temp.param = node.param


            // verify custom node
            var proto = (node.constructor && node.constructor.prototype);
            var nodeName = (proto && proto.name) || node.name;
            if (!bt[nodeName] && customNames.indexOf(nodeName) < 0) {
                var subdata = {};
                subdata.name = nodeName;
                subdata.title = (proto && proto.title) || node.title;
                subdata.category = node.category;

                customNames.push(nodeName);
                data.custom_nodes.push(subdata);
            }


            if (node.category === bt.COMPOSITE && node.children) {
                var children = [];
                for (var i = node.children.length - 1; i >= 0; i--) {
                    children.push(node.children[i].id);
                    stack.push(node.children[i]);
                }
                temp.children = children;
            } else if (node.category === bt.DECORATOR && node.child) {
                stack.push(node.child);
                temp.child = node.child.id;
            }

            // store children/child
            if (node.category === bt.COMPOSITE) {
                if (node.children) {
                    var children = [];
                    for (var i = node.children.length - 1; i >= 0; i--) {
                        children.push(node.children[i].id);
                        stack.push(node.children[i]);
                    }
                    temp.children = children;
                }
            } else if (node.category === bt.DECORATOR) {

                if (node.child) {
                    stack.push(node.child);
                    temp.child = node.child.id;
                } else if (node.children) {
                    var children = [];
                    for (var i = node.children.length - 1; i >= 0; i--) {
                        children.push(node.children[i].id);
                        stack.push(node.children[i]);
                    }
                    temp.children = children;
                }
            }
            data.nodes[node.id] = temp;
        }

        return data;
    }


    /**
     * 让决策树也变成一个节点...
     * 
     */
    BehaviorTree.prototype._tick = function (tick) {
        tick._tickNode(this);
        return this.tick(tick);
    }



    /**
     * Propagates the tick signal through the tree, starting from the root.
     *
     * This method receives a target object of any type (Object, Array,
     * DOMElement, whatever) and a `Blackboard` instance. The target object has
     * no use at all for all Behavior3JS components, but surely is important
     * for custom nodes. The blackboard instance is used by the tree and nodes
     * to store execution variables (e.g., last node running) and is obligatory
     * to be a `Blackboard` instance (or an object with the same interface).
     *
     * Internally, this method creates a Tick object, which will store the
     * target and the blackboard objects.
     *
     * Note: BehaviorTree stores a list of open nodes from last tick, if these
     * nodes weren't called after the current tick, this method will close them
     * automatically.
     * 从根开始通过树传播滴答信号。
     *
     * 此方法接收任何类型的目标对象（Object，Array，
     * DOMElement，无论如何）和一个`Blackboard`实例。目标对象有
     * 对于所有Behavior3JS组件都没有用，但肯定很重要
     * 用于自定义节点。黑板实例由树和节点使用
     * 存储执行变量（例如，最后一个节点运行）并且是强制性的
     * 是一个`Blackboard`实例（或具有相同接口的对象）。
     *
     * 在内部，此方法创建一个Tick对象，该对象将存储
     * 目标和黑板对象。
     *
     * 注意：如果有的话，BehaviorTree会存储最后一个tick的开放节点列表
     * 当前tick后没有调用节点，此方法将关闭它们
     * 自动。
     *
     * 
     * @method tick
     * @param {Object} target A target object.
     * @param {Blackboard} blackboard An instance of blackboard object.
     * @return {Constant} The tick signal state.
     **/
    BehaviorTree.prototype.tick2 = function (target, blackboard) {
        if (!blackboard) {
            blackboard = new Blackboard()
            //throw 'The blackboard parameter is obligatory and must be an ' + 'instance of b3.Blackboard';
        }

        /* CREATE A TICK OBJECT */
        var tick = new Tick();
        tick.debug = this.debug;
        tick.target = target;
        tick.blackboard = blackboard;
        tick.tree = this;
        return this.tick(tick)
    }



    BehaviorTree.prototype.tick = function (tick) {
        var blackboard = tick.blackboard
        /* TICK NODE */
        var state = this.root._execute(tick);
        /* CLOSE NODES FROM LAST TICK, IF NEEDED */
        /**如果需要，请关闭最后一刻的节点 */
        var lastOpenNodes = blackboard.get('openNodes', this.id);
        var currOpenNodes = tick._openNodes.slice(0);

        // does not close if it is still open in this tick
        //如果在此刻度中仍然打开，则不会关闭
        var start = 0;
        var i;
        for (i = 0; i < Math.min(lastOpenNodes.length, currOpenNodes.length); i++) {
            start = i + 1;
            if (lastOpenNodes[i] !== currOpenNodes[i]) {
                break;
            }
        }

        // close the nodes
        //关闭节点
        for (i = lastOpenNodes.length - 1; i >= start; i--) {
            lastOpenNodes[i]._close(tick);
        }

        /* POPULATE BLACKBOARD */
        /**填充黑板 */
        /**设置当前打开的节点 */
        blackboard.set('openNodes', currOpenNodes, this.id);
        /**节点计数 */
        blackboard.set('nodeCount', tick._nodeCount, this.id);

        return state;
    }




    /**
     * 创建一个Action实例 
     */
    function Action() {
        this.initialize.apply(this, arguments)
    }

    /**设置原形 */
    Action.prototype = Object.create(BaseNode.prototype);
    /**设置创造者*/
    Action.prototype.constructor = Action;
    Action.defaultset = {
        category: bt.ACTION,
        name: 'Action',
    }
    /**初始化 */
    Action.prototype.initialize = function (set) {
        setDefault(this, set, Action.defaultset)
        BaseNode.prototype.initialize.call(this)
    }






    /**
     * Composite是所有复合节点的基类。因此，如果你想
     *创建新的自定义复合节点，您需要从此类继承。
     * 
    */


    function Composite() {
        this.initialize.apply(this, arguments)
    }

    /**设置原形 */
    Composite.prototype = Object.create(BaseNode.prototype);
    /**设置创造者*/
    Composite.prototype.constructor = Composite;
    Composite.defaultset = {
        category: bt.COMPOSITE,
        name: 'Composite',
    }
    /**初始化 */
    Composite.prototype.initialize = function (set) {
        setDefault(this, set, Composite.defaultset)
        BaseNode.prototype.initialize.call(this)
    }

    /**
     * Condition是所有条件节点的基类。因此，如果你想
     * 创建新的自定义条件节点，您需要从此类继承。
     *
     */
    function Condition() {
        this.initialize.apply(this, arguments)
    }

    /**设置原形 */
    Condition.prototype = Object.create(BaseNode.prototype);
    /**设置创造者*/
    Condition.prototype.constructor = Condition;

    Condition.defaultset = {
        category: bt.CONDITION,
        name: 'Condition',
    }


    /**初始化 */
    Condition.prototype.initialize = function (set) {
        setDefault(this, set, Condition.defaultset)
        BaseNode.prototype.initialize.call(this)
    }

    /**
     * 
     * 新的自定义装饰器节点，你需要继承这个类。   
     */
    function Decorator() {
        this.initialize.apply(this, arguments)
    }

    /**设置原形 */
    Decorator.prototype = Object.create(BaseNode.prototype);
    /**设置创造者*/
    Decorator.prototype.constructor = Decorator;

    Decorator.defaultset = {
        category: bt.DECORATOR,
        name: 'Decorator',
    }
    /**初始化 */
    Decorator.prototype.initialize = function (set) {
        setDefault(this, set, Decorator.defaultset)
        BaseNode.prototype.initialize.call(this)
    }


    setDefault(bt,
        {
            setDefault: setDefault,
            generateUUID: generateUUID,
            Blackboard: Blackboard,
            Tick: Tick,
            BaseNode: BaseNode,
            BehaviorTree: BehaviorTree,
            Action: Action,
            Decorator: Decorator,
        })
    return bt
})(bt);