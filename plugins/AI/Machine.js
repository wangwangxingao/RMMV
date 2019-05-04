
/*
  Machine.js
  by mary rose cook
  http://github.com/maryrosecook/machinejs
  Make behaviour trees in JavaScript.
  See index.html for an example.
  Uses Base.js by Dean Edwards.  Thanks, Dean.
*/

(function () {
  /*
    The tree generator.  Instantiate and then call generateTree(),
    passing the JSON definition of the tree and the object the tree controls.
    树生成器。实例化然后调用generateTree（），
    传递树的JSON定义和树控制的对象。
  */
  var Machine = Base.extend({
    constructor: function () { },

    // makes behaviour tree from passed json and returns the root node
    //使行为树从传递的json中返回并返回根节点
    generateTree: function (treeJson, actor, states) {
      states = states || actor;
      return this.read(treeJson, null, actor, states);
    },

    // reads in all nodes in passed json, constructing a tree of nodes as it goes
    //读取传递的json中的所有节点，构建节点树
    read: function (subTreeJson, parent, actor, states) {
      var node = null;
      if (subTreeJson.pointer == true) {
        node = new Pointer(subTreeJson.identifier,
          subTreeJson.test,
          subTreeJson.strategy,
          parent,
          actor,
          states);
      } else {
        node = new State(subTreeJson.identifier,
          subTreeJson.test,
          subTreeJson.strategy,
          parent,
          actor,
          states);
      }
      node.report = subTreeJson.report;

      if (subTreeJson.children !== undefined)
        for (var i = 0; i < subTreeJson.children.length; i++) {
          node.children[node.children.length] = this.read(subTreeJson.children[i],
            node, actor, states);
        }

      return node;
    }
  }, {
      getClassName: function () {
        return "Machine";
      }
    });

  // EXPORT
  window['Machine'] = Machine;

  /*
    The object for nodes in the tree.
    树中节点的对象。
  */
  var Node = Base.extend({
    identifier: null,
    test: null,
    strategy: null,
    parent: null,
    children: null,
    actor: null,
    states: null,
    report: null,

    constructor: function (identifier, test, strategy, parent, actor, states) {
      this.identifier = identifier;
      this.test = test;
      this.strategy = strategy;
      this.parent = parent;
      this.actor = actor;
      this.states = states;
      this.children = [];
    },

    // A tick of the clock.  Returns the next state.
    //时钟的刻度。返回下一个状态。
    tick: function () {
      if (this.isAction()) { 
        // run an actual action 运行实际操作
        this.run();
      }
      var potentialNextState = this.nextState();
      var actualNextState = null;
      if (potentialNextState !== null) {
        actualNextState = potentialNextState.transition();
      } else if (this.can()) {
        // no child state, try and stay in this one
        //没有孩子的状态，试着留在这里
        actualNextState = this;
      } else { // can't stay in this one, so back up the tree
        //不能留在这一个，所以备份树
        actualNextState = this.nearestRunnableAncestor().transition();
      }
      return actualNextState;
    },


    // gets next state that would be moved to from current state
    //获取将从当前状态移动到的下一个状态
    nextState: function () {
      var strategy = this.strategy;
      if (strategy === undefined) {
        var ancestor = this.nearestAncestorWithStrategy();
        if (ancestor !== null) {
          strategy = ancestor.strategy;
        }
      }

      if (strategy !== null)
        return this[strategy].call(this);
      else
        return null;
    },

    //是转型
    isTransition: function () {
      return this.children.length > 0 || this instanceof Pointer;
    },

    //是行动
    isAction: function () {
      return !this.isTransition();
    },

    // returns true if actor allowed to enter this state
    //如果actor允许进入此状态，则返回true
    can: function () {
      var functionName = this.test; // can specify custom test function name
      if (functionName === undefined){ // no override so go with default function name
        functionName = "can" + this.identifier[0].toUpperCase() + this.identifier.substring(1, this.identifier.length);
      }
      if (this.states[functionName] !== undefined) {
        return this.states[functionName].call(this.actor);
      } else { // no canX() function defined - assume can 
        //没有定义canX（）函数 - 假设可以
        return true;
      }
    },

    // switches state to direct child of root state with passed identifier
    // use very sparingly - really only for important events that
    // require machine to temporarily relinquish control over actor
    // e.g. a soldier who is mostly autonomous, but occasionally receives orders
    //非常谨慎地使用 - 实际上只适用于重要事件
    //要求机器暂时放弃对演员的控制权
    //例如一名大多数是自主的士兵，但偶尔会收到命令
    warp: function (identifier) {
      var rootNodeChildren = this.getRootNode().children;
      for (var i = 0; i < rootNodeChildren.length; i++) {
        if (rootNodeChildren[i].identifier == identifier) {
          return rootNodeChildren[i];
        }
      }
      return this; // couldn't find node - stay in current state 找不到节点 - 保持当前状态
    },

    // returns first child that can run
    //返回可以运行的第一个子节点
    prioritised: function () {
      return this.nextRunnable(this.children);
    },

    // gets next runnable node in passed list
    //在传递的列表中获取下一个可运行的节点
    nextRunnable: function (nodes) {
      for (var i = 0; i < nodes.length; i++)
        if (nodes[i].can()) {
          return nodes[i];
        }
      return null;
    },

    // runs all runnable children in order, then kicks up to children's closest runnable ancestor
    //依次运行所有可运行的孩子，然后踢到孩子最近的可运行的祖先
    sequential: function () {
      var nextState = null;
      if (this.isAction()) // want to get next runnable child or go back up to grandparent
      //想要下一个可运行的孩子或者回到祖父母
      {
        var foundThis = false;
        for (var i = 0; i < this.parent.children.length; i++) {
          var sibling = this.parent.children[i];
          if (this.identifier == sibling.identifier) {
            foundThis = true;
          } else if (foundThis && sibling.can()) {
            return sibling;
          }
        }
      }
      else // at a sequential parent so try to run first runnable child//在顺序父级，所以尝试运行第一个可运行的子级
      {
        var firstRunnableChild = this.nextRunnable(this.children);
        if (firstRunnableChild !== null)
          return firstRunnableChild;
      }

      return this.nearestRunnableAncestor(); // no more runnable children in the sequence so return first runnable ancestor
      //序列中没有更多可运行的子节点，因此返回第一个可运行的祖先
    },

    // returns first namesake forebear encountered when going directly up tree
    //返回直接上到树时遇到的第一个同名前辈
    nearestAncestor: function (test) {
      if (this.parent === null){
        return null;
      }else if (test.call(this.parent) === true){
        return this.parent;
      }else{
        return this.parent.nearestAncestor(test);
      }
    },

    // returns root node of whole tree
    //返回整棵树的根节点
    getRootNode: function () {
      if (this.parent === null)
        return this;
      else
        return this.parent.getRootNode();
    },

    nearestAncestorWithStrategy: function () {
      return this.nearestAncestor(function () {
        return this.strategy !== undefined && this.strategy !== null;
      });
    },

    // returns nearest ancestor that can run
    //返回可以运行的最近的祖先
    nearestRunnableAncestor: function () {
      return this.nearestAncestor(function () {
        return this.can();
      });
    },

    nearestNamesakeAncestor: function (identifier) {
      return this.nearestAncestor(function () {
        return this.identifier == identifier;
      });
    }
  }, {
      getClassName: function () {
        return "Node";
      }
    });


  /*
    A normal state in the tree.
    树中的正常状态。
  */
  var State = Node.extend({
    transition: function () {
      return this;
    },

    // run the behaviour associated with this state
    //运行与此状态关联的行为
    run: function () {
      this.states[this.identifier].call(this.actor); // run the action运行动作
    }
  }, {
      getClassName: function () {
        return "State";
      }
    });

  /*
    A pointer state in the tree.  Directs the actor to a synonymous state
    further up the tree.  Which synonymous state the actor transitions to
    is dependent on the pointer's strategy.
    树中的指针状态。将actor指向同义状态
    进一步上了树。演员过渡到哪个同义状态
    取决于指针的策略。
  */
  var Pointer = Node.extend({
    // transition out of this state using the state's strategy
    //使用州的策略转换出这种状态
    transition: function () {
      return this[this.strategy].call(this);
    },

    // a strategy that moves to the first synonymous ancestor
    //一个转移到第一个同义祖先的策略
    hereditory: function () {
      return this.nearestNamesakeAncestor(this.identifier);
    }
  }, {
      getClassName: function () {
        return "Pointer";
      }
    });
})(); 