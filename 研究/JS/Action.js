(function (bt) {

    function Wait() {
        this.initialize.apply(this, arguments)
    }

    /**设置原形 */
    Wait.prototype = Object.create(Action.prototype);
    /**设置创造者*/
    Wait.prototype.constructor = Wait;
    Wait.defaultset = {
        name: 'Wait',
        title: 'Wait',
        milliseconds: 0,
        properties: { milliseconds: 0 },
    }

    
    /**初始化 */
    Wait.prototype.initialize = function (set) {
        setDefault(this, set, Wait.defaultset)
        setDefault(this, set && set.properties)

        Action.prototype.initialize.call(this)

        this.endTime = this.milliseconds;

    }

    /**
     * Wait a few seconds.
     *
     * @module b3
     * @class Wait
     * @extends Action
     **/
    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     **/
    Wait.prototype.open = function (tick) {
        var startTime = Data.now()
        tick.blackboard.set('startTime', startTime, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    Wait.prototype.tick = function (tick) {
        var currTime = Data.now();
        var startTime = tick.blackboard.get('startTime', tick.tree.id, this.id);

        if (currTime - startTime > this.endTime) {
            return bt.SUCCESS;
        }

        return bt.RUNNING;
    };


    bt.Wait = Wait;
})(bt)
