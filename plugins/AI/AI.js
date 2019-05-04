/**
 * Behavior Trees
 */



function BaseNode() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
BaseNode.prototype = Object.create(BaseNode.prototype);
/**设置创造者*/
BaseNode.prototype.constructor = BaseNode;


BaseNode.prototype.initialize = function (name, test, type, parent, actor, states) {
    this.class = ""
    this.name = name;
    this.test = test;
    this.type = type;
    this.parent = parent || null;
    this.actor = actor;
    this.blackBoard = blackBoard || {};
    this.children = [];
}

/**
 * 根节点
 */
BaseNode.prototype.root = function () {
    return this.parent ? this.parent.root() : this
}

/**
 * 能否进行
 */
BaseNode.prototype.can = function () {
    return 0
}

BaseNode.prototype.action = function () {
    /**do something */
    return true
}


/*
class

Composite Node　　组合节点
Decorator Node　　 修饰节点
Condition Node　　 条件节点（叶节点）
Action Node　　　　动作节点（叶节点）
*/
Failure = 0
Success = 1
Running = 2
/** 
 * 失败-Failure；
 * 成功-Success；
 * 运行中-Running；
 */

/**
 * 失败-Failure； 
 */
BaseNode.prototype.isFailure = function () {
    return this._state == Failure
}
/**
 * 成功-Success； 
 */
BaseNode.prototype.isSuccess = function () {
    return this._state == Success
}
/**
 * 运行中-Running； 
 */
BaseNode.prototype.isRunning = function () {
    return this._state == Running
}

/**
 * 失败-Failure； 
 */
BaseNode.prototype.onFailure = function () {
    this._state = Failure
}

BaseNode.prototype.onSuccess = function () {
    this._state = Success
}

BaseNode.prototype.onRunning = function () {
    this._state = Running
}




BaseNode.prototype.run = function(){

}

function sequence(owner, node_name) {
    run_index = get_run_index(node_name)
    while (run_index < len(child_list)) {
        res = child_list[run_index](owner)
        if (res == FAILURE) {
            set_run_index(node_name, 0)
            return res
        } else if (res == RUNNING) {
            set_run_index(node_name, run_index)
            return res
        } else {
            run_index += 1
        }
    }
    set_run_index(node_name, 0)
    return SUCCESS
}

