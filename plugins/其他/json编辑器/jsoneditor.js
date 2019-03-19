/**
 * @file jsoneditor.js
 *
 * @brief
 * JSONEditor is a web-based tool to view, edit, and format JSON.
 * It shows data a clear, editable treeview.
 *
 * Supported browsers: Chrome, Firefox, Safari, Opera, Internet Explorer 8+
 *
 * @license
 * This json editor is open sourced with the intention to use the editor as
 * a component in your own application. Not to just copy and monetize the editor
 * as it is.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Copyright (c) 2011-2012 Jos de Jong, http://jsoneditoronline.org
 *
 * @author  Jos de Jong, <wjosdejong@gmail.com>
 * @date    2012-12-08
 */
// Internet Explorer 8 and older does not support Array.indexOf,
// so we define it here in that case
// http://soledadpenades.com/2007/05/17/arrayindexof-in-internet-explorer/
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (obj) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == obj) {
				return i;
			}
		}
		return -1;
	}
}

// Internet Explorer 8 and older does not support Array.forEach,
// so we define it here in that case
// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (fn, scope) {
		for (var i = 0, len = this.length; i < len; ++i) {
			fn.call(scope || this, this[i], i, this);
		}
	}
}

// define variable JSON, needed for correct error handling on IE7 and older
//定义变量JSON，用于在IE7及更早版本上进行正确的错误处理
var JSON;

/**
 *
 * @param {Element}  container  容器元素
 * @param {Object} [options] 带选项的对象。可用选项：
 * {String}模式编辑器模式。可用值：
 *'编辑'（默认），'查看'。
 * {Boolean} 搜索 启用搜索框。
 *默认为True
 * {Boolean} history 启用历史记录（撤消/重做）。
 *默认为True
 * {function} 更改回调方法，触发
 *关于内容的变更
 * {String} name 根节点的字段名称。
 *
 * 
 * 
 * JSONEditor
 * @param {Element} container    Container element
 * @param {Object}  [options]    Object with options. available options:
 *                               {String} mode      Editor mode. Available values:
 *                                                  'editor' (default), 'viewer'.
 *                               {Boolean} search   Enable search box.
 *                                                  True by default
 *                               {Boolean} history  Enable history (undo/redo).
 *                                                  True by default
 *                               {function} change  Callback method, triggered
 *                                                  on change of contents
 *                               {String} name      Field name for the root node.
 * @param {Object | undefined} json JSON object
 */
JSONEditor = function (container, options, json) {
	// check availability of JSON parser (not available in IE7 and older)
	if (!JSON) {
		throw new Error('您当前使用的浏览器不支持 JSON. \n\n' +
			'请下载安装最新版本的浏览器, 本站推荐Google Chrome.\n' +
			'(PS: 当前主流浏览器都支持JSON).');
	}

	if (!container) {
		throw new Error('没有提供容器元素.');
	}
	this.container = container;
	this.dom = {};

	this._setOptions(options);

	if (this.options.history && this.editable) {
		this.history = new JSONEditor.History(this);
	}

	this._createFrame();
	this._createTable();

	this.set(json || {});
};

/**
 * 
 * *初始化并设置默认选项
 * @param {Object} [options]  带选项的对象。可用选项：
 * {String}模式编辑器模式。可用值：
 *'编辑'（默认），'查看'。
 * {Boolean}搜索启用搜索框。
 *默认为True。
 * {Boolean} history启用历史记录（撤消/重做）。
 *默认为True。
 * {function}更改回调方法，触发
 *关于内容的变更。
 * {String} name根节点的字段名称。
 *
 * 
 * 
 * Initialize and set default options
 * @param {Object}  [options]    Object with options. available options:
 *                               {String} mode      Editor mode. Available values:
 *                                                  'editor' (default), 'viewer'.
 *                               {Boolean} search   Enable search box.
 *                                                  True by default.
 *                               {Boolean} history  Enable history (undo/redo).
 *                                                  True by default.
 *                               {function} change  Callback method, triggered
 *                                                  on change of contents.
 *                               {String} name      Field name for the root node.
 * @private
 */
JSONEditor.prototype._setOptions = function (options) {
	this.options = {
		search: true,
		history: true,
		mode: 'editor',
		name: undefined // field name of root node
	};

	// copy all options
	if (options) {
		for (var prop in options) {
			if (options.hasOwnProperty(prop)) {
				this.options[prop] = options[prop];
			}
		}

		//检查已弃用的选项
		// check for deprecated options
		if (options.enableSearch) {
			//检查已弃用的选项
			// deprecated since version 1.6.0, 2012-11-03
			this.options.search = options.enableSearch;
			// console.log('WARNING: Option "enableSearch" is deprecated. Use "search" instead.');
		}
		if (options.enableHistory) {
			// deprecated since version 1.6.0, 2012-11-03
			this.options.search = options.enableHistory;
			// console.log('WARNING: Option "enableHistory" is deprecated. Use "history" instead.');
		}
	}

	// interpret the options
	this.editable = (this.options.mode != 'viewer');
};

//当前正在编辑的节点
// node currently being edited
JSONEditor.focusNode = undefined;

/**
 * 在编辑器中设置JSON对象
 * 
 * Set JSON object in editor
 * @param {Object | undefined} json      JSON data  JSON数据
 * @param {String}             [name]    Optional field name for the root node.   根节点的可选字段名称。
 *                                       Can also be set using setName(name).  也可以使用setName（name）进行设置。
 */
JSONEditor.prototype.set = function (json, name) {
	// adjust field name for root node
	if (name) {
		this.options.name = name;
	}

	// verify if json is valid JSON, ignore when a function
	if (json instanceof Function || (json === undefined)) {
		this.clear();
	} else {
		this.content.removeChild(this.table); // Take the table offline

		// replace the root node
		var params = {
			'field': this.options.name,
			'value': json
		};
		var node = new JSONEditor.Node(this, params);
		this._setRoot(node);

		// expand
		var recurse = false;
		this.node.expand(recurse);

		this.content.appendChild(this.table); // Put the table online again
	}

	// TODO: maintain history, store last state and previous document
	if (this.history) {
		this.history.clear();
	}
};

/**
 * 
 * 从编辑器中获取JSON对象
 * Get JSON object from editor
 * @return {Object | undefined} json
 */
JSONEditor.prototype.get = function () {
	// remove focus from currently edited node
	if (JSONEditor.focusNode) {
		JSONEditor.focusNode.blur();
	}

	if (this.node) {
		return this.node.getValue();
	} else {
		return undefined;
	}
};

/**
 * 为根节点设置字段名称。
 * Set a field name for the root node.
 * @param {String | undefined} name
 */
JSONEditor.prototype.setName = function (name) {
	this.options.name = name;
	if (this.node) {
		this.node.updateField(this.options.name);
	}
};

/**
 * 获取根节点的字段名称。
 * Get the field name for the root node.
 * @return {String | undefined} name
 */
JSONEditor.prototype.getName = function () {
	return this.options.name;
};

/**
 * 从编辑器中删除根节点
 * Remove the root node from the editor
 */
JSONEditor.prototype.clear = function () {
	if (this.node) {
		this.node.collapse();
		this.tbody.removeChild(this.node.getDom());
		delete this.node;
	}
};

/**
 * 设置json编辑器的根节点
 * Set the root node for the json editor
 * @param {JSONEditor.Node} node
 * @private
 */
JSONEditor.prototype._setRoot = function (node) {
	this.clear();

	this.node = node;

	// append to the dom
	this.tbody.appendChild(node.getDom());
};

/**
 * 在所有节点中搜索文本
 *当找到其中一个孩子的文本时，节点将被展开，
 *否则它将被折叠。搜索不区分大小写。
 * @param {String}文字
 * @return {Object []} results包含包含搜索结果的节点的Array
 *结果对象包含字段：
 *  -  {JSONEditor.Node}节点，
 *  -  {String} elem dom元素名称在哪里
 *结果被找到（'field'或
 *'价值'）
 * 
 * Search text in all nodes
 * The nodes will be expanded when the text is found one of its childs,
 * else it will be collapsed. Searches are case insensitive.
 * @param {String} text
 * @return {Object[]} results  Array with nodes containing the search results
 *                             The result objects contains fields:
 *                             - {JSONEditor.Node} node,
 *                             - {String} elem  the dom element name where
 *                                              the result is found ('field' or
 *                                              'value')
 */
JSONEditor.prototype.search = function (text) {
	var results;
	if (this.node) {
		this.content.removeChild(this.table); // Take the table offline
		results = this.node.search(text);
		this.content.appendChild(this.table); // Put the table online again
	} else {
		results = [];
	}

	return results;
};

/**
 * 展开所有节点
 * Expand all nodes
 */
JSONEditor.prototype.expandAll = function () {
	if (this.node) {
		this.content.removeChild(this.table); // Take the table offline
		this.node.expand();
		this.content.appendChild(this.table); // Put the table online again
	}
};

/**
 * 折叠所有节点
 * Collapse all nodes
 */
JSONEditor.prototype.collapseAll = function () {
	if (this.node) {
		this.content.removeChild(this.table); // Take the table offline
		this.node.collapse();
		this.content.appendChild(this.table); // Put the table online again
	}
};

/**
 * 
 * 
 * *无论何时更改，创建字段或值，都会调用onChange方法，
 *删除，复制等
 * @param {String}操作更改操作。可用值：“editField”，
 *“editValue”，“changeType”，“appendNode”，
 *“removeNode”，“duplicateNode”，“moveNode”，“expand”，
 *                         “坍方”。
 * @param {Object} params包含描述更改的参数的对象。
 *参数中的参数取决于动作（for
 *示例“editValue”Node，旧值和new
 *提供价值）。 params包含所有信息
 *需要撤消或重做动作。
 * 
 * 
 * 
 * The method onChange is called whenever a field or value is changed, created,
 * deleted, duplicated, etc.
 * @param {String} action  Change action. Available values: "editField",
 *                         "editValue", "changeType", "appendNode",
 *                         "removeNode", "duplicateNode", "moveNode", "expand",
 *                         "collapse".
 * @param {Object} params  Object containing parameters describing the change.
 *                         The parameters in params depend on the action (for
 *                         example for "editValue" the Node, old value, and new
 *                         value are provided). params contains all information
 *                         needed to undo or redo the action.
 */
JSONEditor.prototype.onAction = function (action, params) {
	// add an action to the history
	if (this.history) {
		this.history.add(action, params);
	}

	// trigger the onChange callback
	if (this.options.change) {
		try {
			this.options.change();
		} catch (err) {
			//console.log('Error in change callback: ', err);
		}
	}
};

/**
 * 将焦点设置为JSONEditor。将创建隐藏的输入字段
 * 捕获关键事件
 * 
 * Set the focus to the JSONEditor. A hidden input field will be created
 * which captures key events
 */
// TODO: use the focus method?
JSONEditor.prototype.focus = function () {
	/*
    if (!this.dom.focus) {
        this.dom.focus = document.createElement('input');
        this.dom.focus.className = 'jsoneditor-hidden-focus';

        var editor = this;
        this.dom.focus.onblur = function () {
            // remove itself
            if (editor.dom.focus) {
                var focus = editor.dom.focus;
                delete editor.dom.focus;
                editor.frame.removeChild(focus);
            }
        };

        // attach the hidden input box to the DOM
        if (this.frame.firstChild) {
            this.frame.insertBefore(this.dom.focus, this.frame.firstChild);
        }
        else {
            this.frame.appendChild(this.dom.focus);
        }
    }
    this.dom.focus.focus();
    */
};

/**
 * *调整滚动位置，使给定的顶部位置显示为1/4
 *窗户高度。
 * Adjust the scroll position such that given top position is shown at 1/4
 * of the window height.
 * @param {Number} top
 */
JSONEditor.prototype.scrollTo = function (top) {
	var content = this.content;
	if (content) {
		// cancel any running animation
		var editor = this;
		if (editor.animateTimeout) {
			clearTimeout(editor.animateTimeout);
			delete editor.animateTimeout;
		}

		// calculate final scroll position
		var height = content.clientHeight;
		var bottom = content.scrollHeight - height;
		var finalScrollTop = Math.min(Math.max(top - height / 4, 0), bottom);

		// animate towards the new scroll position
		var animate = function () {
			var scrollTop = content.scrollTop;
			var diff = (finalScrollTop - scrollTop);
			if (Math.abs(diff) > 3) {
				content.scrollTop += diff / 3;
				editor.animateTimeout = setTimeout(animate, 50);
			}
		};
		animate();
	}
};


/**
 * @constructor JSONEditor.History
 * Store action history, enables undo and redo
 * @param {JSONEditor} editor
 */
JSONEditor.History = function (editor) {
	this.editor = editor;
	this.clear();

	// map with all supported actions
	this.actions = {
		'editField': {
			'undo': function (obj) {
				obj.params.node.updateField(obj.params.oldValue);
			},
			'redo': function (obj) {
				obj.params.node.updateField(obj.params.newValue);
			}
		},
		'editValue': {
			'undo': function (obj) {
				obj.params.node.updateValue(obj.params.oldValue);
			},
			'redo': function (obj) {
				obj.params.node.updateValue(obj.params.newValue);
			}
		},
		'appendNode': {
			'undo': function (obj) {
				obj.params.parent.removeChild(obj.params.node);
			},
			'redo': function (obj) {
				obj.params.parent.appendChild(obj.params.node);
			}
		},
		'removeNode': {
			'undo': function (obj) {
				var parent = obj.params.parent;
				var beforeNode = parent.childs[obj.params.index] || parent.append;
				parent.insertBefore(obj.params.node, beforeNode);
			},
			'redo': function (obj) {
				obj.params.parent.removeChild(obj.params.node);
			}
		},
		'duplicateNode': {
			'undo': function (obj) {
				obj.params.parent.removeChild(obj.params.clone);
			},
			'redo': function (obj) {
				// TODO: insert after instead of insert before
				obj.params.parent.insertBefore(obj.params.clone, obj.params.node);
			}
		},
		'changeType': {
			'undo': function (obj) {
				obj.params.node.changeType(obj.params.oldType);
			},
			'redo': function (obj) {
				obj.params.node.changeType(obj.params.newType);
			}
		},
		'moveNode': {
			'undo': function (obj) {
				obj.params.startParent.moveTo(obj.params.node, obj.params.startIndex);
			},
			'redo': function (obj) {
				obj.params.endParent.moveTo(obj.params.node, obj.params.endIndex);
			}
		}

		// TODO: restore the original caret position and selection with each undo
		// TODO: implement history for actions "expand", "collapse", "scroll", "setDocument"
	};
};

/**
 * The method onChange is executed when the History is changed, and can
 * be overloaded.
 */
JSONEditor.History.prototype.onChange = function () {};

/**
 * Add a new action to the history
 * @param {String} action  The executed action. Available actions: "editField",
 *                         "editValue", "changeType", "appendNode",
 *                         "removeNode", "duplicateNode", "moveNode"
 * @param {Object} params  Object containing parameters describing the change.
 *                         The parameters in params depend on the action (for
 *                         example for "editValue" the Node, old value, and new
 *                         value are provided). params contains all information
 *                         needed to undo or redo the action.
 */
JSONEditor.History.prototype.add = function (action, params) {
	this.index++;
	this.history[this.index] = {
		'action': action,
		'params': params,
		'timestamp': new Date()
	};

	// remove redo actions which are invalid now
	if (this.index < this.history.length - 1) {
		this.history.splice(this.index + 1, this.history.length - this.index - 1);
	}

	// fire onchange event
	this.onChange();
};

/**
 * Clear history
 */
JSONEditor.History.prototype.clear = function () {
	this.history = [];
	this.index = -1;

	// fire onchange event
	this.onChange();
};

/**
 * Check if there is an action available for undo
 * @return {Boolean} canUndo
 */
JSONEditor.History.prototype.canUndo = function () {
	return (this.index >= 0);
};

/**
 * Check if there is an action available for redo
 * @return {Boolean} canRedo
 */
JSONEditor.History.prototype.canRedo = function () {
	return (this.index < this.history.length - 1);
};

/**
 * Undo the last action
 */
JSONEditor.History.prototype.undo = function () {
	if (this.canUndo()) {
		var obj = this.history[this.index];
		if (obj) {
			var action = this.actions[obj.action];
			if (action && action.undo) {
				action.undo(obj);
			} else {
				//console.log('Error: unknown action "' + obj.action + '"');
			}
		}
		this.index--;

		// fire onchange event
		this.onChange();
	}
};

/**
 * Redo the last action
 */
JSONEditor.History.prototype.redo = function () {
	if (this.canRedo()) {
		this.index++;

		var obj = this.history[this.index];
		if (obj) {
			if (obj) {
				var action = this.actions[obj.action];
				if (action && action.redo) {
					action.redo(obj);
				} else {
					//console.log('Error: unknown action "' + obj.action + '"');
				}
			}
		}

		// fire onchange event
		this.onChange();
	}
};


/**
 * @constructor JSONEditor.Node
 * Create a new Node
 * @param {JSONEditor} editor
 * @param {Object} params   Can contain parameters: field, fieldEditable, value.
 */
JSONEditor.Node = function (editor, params) {
	this.editor = editor;
	this.dom = {};
	this.expanded = false;

	if (params && (params instanceof Object)) {
		this.setField(params.field, params.fieldEditable);
		this.setValue(params.value);
	} else {
		this.setField();
		this.setValue();
	}
};

/**
 * Set parent node
 * @param {JSONEditor.Node} parent
 */
JSONEditor.Node.prototype.setParent = function (parent) {
	this.parent = parent;
};

/**
 * Get parent node. Returns undefined when no parent node is set.
 * @return {JSONEditor.Node} parent
 */
JSONEditor.Node.prototype.getParent = function () {
	return this.parent;
};

/**
 * 获取字段
 * 
 * Set field
 * @param {String} field
 * @param {boolean} fieldEditable
 */
JSONEditor.Node.prototype.setField = function (field, fieldEditable) {
	this.field = field;
	this.fieldEditable = (fieldEditable == true);
};

/**
 * 获取字段
 * 
 * 
 * Get field
 * @return {String}
 */
JSONEditor.Node.prototype.getField = function () {
	if (this.field === undefined) {
		this._getDomField();
	}

	return this.field;
};

/**
 * 设定值。值是JSON结构或元素String，Boolean等。
 * 
 * 
 * Set value. Value is a JSON structure or an element String, Boolean, etc.
 * @param {*} value
 */
JSONEditor.Node.prototype.setValue = function (value) {
	var childValue, child;

	// first clear all current childs (if any)
	var childs = this.childs;
	if (childs) {
		while (childs.length) {
			this.removeChild(childs[0]);
		}
	}

	// TODO: remove the DOM of this Node

	this.type = this._getType(value);
	if (this.type == 'array') {
		// array
		this.childs = [];
		for (var i = 0, iMax = value.length; i < iMax; i++) {
			childValue = value[i];
			if (childValue !== undefined && !(childValue instanceof Function)) {
				// ignore undefined and functions
				child = new JSONEditor.Node(this.editor, {
					'value': childValue
				});
				this.appendChild(child);
			}
		}
		this.value = '';
	} else if (this.type == 'object') {
		// object
		this.childs = [];
		for (var childField in value) {
			if (value.hasOwnProperty(childField)) {
				childValue = value[childField];
				if (childValue !== undefined && !(childValue instanceof Function)) {
					// ignore undefined and functions
					child = new JSONEditor.Node(this.editor, {
						'field': childField,
						'value': childValue
					});
					this.appendChild(child);
				}
			}
		}
		this.value = '';
	} else {
		// value
		this.childs = undefined;
		this.value = value;
		/* TODO
         if (typeof(value) == 'string') {
         var escValue = JSON.stringify(value);
         this.value = escValue.substring(1, escValue.length - 1);
         console.log('check', value, this.value);
         }
         else {
         this.value = value;
         }
         */
	}
};

/**
 * 获得价值。值是JSON结构
 * 
 * 
 * Get value. Value is a JSON structure
 * @return {*} value
 */
JSONEditor.Node.prototype.getValue = function () {
	//var childs, i, iMax;

	if (this.type == 'array') {
		var arr = [];
		this.childs.forEach(function (child) {
			arr.push(child.getValue());
		});
		return arr;
	} else if (this.type == 'object') {
		var obj = {};
		this.childs.forEach(function (child) {
			obj[child.getField()] = child.getValue();
		});
		return obj;
	} else {
		if (this.value === undefined) {
			this._getDomValue();
		}

		return this.value;
	}
};

/**
 * 获取此节点的嵌套级别
 * 
 * 
 * Get the nesting level of this node
 * @return {Number} level
 */
JSONEditor.Node.prototype.getLevel = function () {
	return (this.parent ? this.parent.getLevel() + 1 : 0);
};

/**
 * 创建节点的克隆
 * 复制克隆的完整状态，包括是否展开或
 * 不是。不克隆DOM元素。
 * 
 * 
 * 
 * Create a clone of a node
 * The complete state of a clone is copied, including whether it is expanded or
 * not. The DOM elements are not cloned.
 * @return {JSONEditor.Node} clone
 */
JSONEditor.Node.prototype.clone = function () {
	var clone = new JSONEditor.Node(this.editor);
	clone.type = this.type;
	clone.field = this.field;
	clone.fieldInnerText = this.fieldInnerText;
	clone.fieldEditable = this.fieldEditable;
	clone.value = this.value;
	clone.valueInnerText = this.valueInnerText;
	clone.expanded = this.expanded;

	if (this.childs) {
		// an object or array
		var cloneChilds = [];
		this.childs.forEach(function (child) {
			var childClone = child.clone();
			childClone.setParent(clone);
			cloneChilds.push(childClone);
		});
		clone.childs = cloneChilds;
	} else {
		// a value
		clone.childs = undefined;
	}

	return clone;
};

/**
 * 折叠此节点及其子节点。
 * 
 * Expand this node and optionally its childs.
 * @param {boolean} recurse   Optional recursion, true by default. When
 *                            true, all childs will be expanded recursively
 */
JSONEditor.Node.prototype.expand = function (recurse) {
	if (!this.childs) {
		return;
	}

	// set this node expanded
	this.expanded = true;
	if (this.dom.expand) {
		this.dom.expand.className = 'jsoneditor-expanded';
	}

	this.showChilds();

	if (recurse != false) {
		this.childs.forEach(function (child) {
			child.expand(recurse);
		});
	}
};

/**
 * 折叠此节点及其子项。
 * 
 * Collapse this node and optionally its childs.
 * @param {Number} recurse   Optional recursion, true by default. When
 *                            true, all childs will be collapsed recursively
 */
JSONEditor.Node.prototype.collapse = function (recurse) {
	if (!this.childs) {
		return;
	}

	this.hideChilds();

	// collapse childs in case of recurse
	if (recurse != false) {
		this.childs.forEach(function (child) {
			child.collapse(recurse);
		});

	}

	// make this node collapsed
	if (this.dom.expand) {
		this.dom.expand.className = 'jsoneditor-collapsed';
	}
	this.expanded = false;
};

/**
 * 
 * 在扩展时递归显示所有孩子
 * 
 * 
 * Recursively show all childs when they are expanded
 */
JSONEditor.Node.prototype.showChilds = function () {
	var childs = this.childs;
	if (!childs) {
		return;
	}
	if (!this.expanded) {
		return;
	}

	var tr = this.dom.tr;
	var table = tr ? tr.parentNode : undefined;
	if (table) {
		// show row with append button
		var append = this.getAppend();
		var nextTr = tr.nextSibling;
		if (nextTr) {
			table.insertBefore(append, nextTr);
		} else {
			table.appendChild(append);
		}

		// show childs
		this.childs.forEach(function (child) {
			table.insertBefore(child.getDom(), append);
			child.showChilds();
		});
	}
};

/**
 * 隐藏包含其所有子节点的节点
 * Hide the node with all its childs
 */
JSONEditor.Node.prototype.hide = function () {
	var tr = this.dom.tr;
	var table = tr ? tr.parentNode : undefined;
	if (table) {
		table.removeChild(tr);
	}
	this.hideChilds();
};


/**
 * 递归隐藏所有孩子
 * Recursively hide all childs
 */
JSONEditor.Node.prototype.hideChilds = function () {
	var childs = this.childs;
	if (!childs) {
		return;
	}
	if (!this.expanded) {
		return;
	}

	// hide append row
	var append = this.getAppend();
	if (append.parentNode) {
		append.parentNode.removeChild(append);
	}

	// hide childs
	this.childs.forEach(function (child) {
		child.hide();
	});
};


/**
 *将新子项添加到节点。
 *仅在Node值为array或object类型时适用
 *
 * 
 * Add a new child to the node.
 * Only applicable when Node value is of type array or object
 * @param {JSONEditor.Node} node
 */
JSONEditor.Node.prototype.appendChild = function (node) {
	if (this.type == 'array' || this.type == 'object') {
		// adjust the link to the parent
		node.setParent(this);
		node.fieldEditable = (this.type == 'object');
		if (this.type == 'array') {
			node.index = this.childs.length;
		}
		this.childs.push(node);

		if (this.expanded) {
			// insert into the DOM, before the appendRow
			var newtr = node.getDom();
			var appendTr = this.getAppend();
			var table = appendTr ? appendTr.parentNode : undefined;
			if (appendTr && table) {
				table.insertBefore(newtr, appendTr);
			}

			node.showChilds();
		}

		this.updateDom({
			'updateIndexes': true
		});
		node.updateDom({
			'recurse': true
		});
	}
};


/**
 * 将节点从其当前父节点移动到此节点
 * 仅在Node值为array或object类型时适用
 *
 * 
 * Move a node from its current parent to this node
 * Only applicable when Node value is of type array or object
 * @param {JSONEditor.Node} node
 * @param {JSONEditor.Node} beforeNode
 */
JSONEditor.Node.prototype.moveBefore = function (node, beforeNode) {
	if (this.type == 'array' || this.type == 'object') {
		// create a temporary row, to prevent the scroll position from jumping
		// when removing the node
		var tbody = (this.dom.tr) ? this.dom.tr.parentNode : undefined;
		if (tbody) {
			var trTemp = document.createElement('tr');
			trTemp.style.height = tbody.clientHeight + 'px';
			tbody.appendChild(trTemp);
		}

		var parent = node.getParent();
		if (parent) {
			parent.removeChild(node);
		}
		if (beforeNode instanceof JSONEditor.AppendNode) {
			this.appendChild(node);
		} else {
			this.insertBefore(node, beforeNode);
		}

		if (tbody) {
			tbody.removeChild(trTemp);
		}
	}
};

/**
 *  
 *将节点从其当前父节点移动到此节点
 *仅在Node值为array或object类型时适用。
 *如果索引超出范围，节点将附加到末尾
 * 
 * Move a node from its current parent to this node
 * Only applicable when Node value is of type array or object.
 * If index is out of range, the node will be appended to the end
 * @param {JSONEditor.Node} node
 * @param {Number} index
 */
JSONEditor.Node.prototype.moveTo = function (node, index) {
	if (node.parent == this) {
		// same parent
		var currentIndex = this.childs.indexOf(node);
		if (currentIndex < index) {
			// compensate the index for removal of the node itself
			index++;
		}
	}

	var beforeNode = this.childs[index] || this.append;
	this.moveBefore(node, beforeNode);
};

/**
 * 在给定节点之前插入一个新子节点
 * 仅在Node值为array或object类型时适用
 * 
 * 
 * Insert a new child before a given node
 * Only applicable when Node value is of type array or object
 * @param {JSONEditor.Node} node
 * @param {JSONEditor.Node} beforeNode
 */
JSONEditor.Node.prototype.insertBefore = function (node, beforeNode) {
	if (this.type == 'array' || this.type == 'object') {
		if (beforeNode == this.append) {
			// append to the child nodes

			// adjust the link to the parent
			node.setParent(this);
			node.fieldEditable = (this.type == 'object');
			this.childs.push(node);
		} else {
			// insert before a child node
			var index = this.childs.indexOf(beforeNode);
			if (index == -1) {
				throw new Error('节点未找到.');
			}

			// adjust the link to the parent
			node.setParent(this);
			node.fieldEditable = (this.type == 'object');
			this.childs.splice(index, 0, node);
		}

		if (this.expanded) {
			// insert into the DOM
			var newTr = node.getDom();
			var nextTr = beforeNode.getDom();
			var table = nextTr ? nextTr.parentNode : undefined;
			if (nextTr && table) {
				table.insertBefore(newTr, nextTr);
			}

			node.showChilds();
		}

		this.updateDom({
			'updateIndexes': true
		});
		node.updateDom({
			'recurse': true
		});
	}
};

/**
 * 在此节点中搜索
 * 当找到其中一个子文本时，该节点将被展开，否则
 * 它会崩溃。搜索不区分大小写。
 * 
 * 
 * Search in this node
 * The node will be expanded when the text is found one of its childs, else
 * it will be collapsed. Searches are case insensitive.
 * @param {String} text
 * @return {JSONEditor.Node[]} results  Array with nodes containing the search text
 */
JSONEditor.Node.prototype.search = function (text) {
	var results = [];
	var index;
	var search = text ? text.toLowerCase() : undefined;

	// delete old search data
	delete this.searchField;
	delete this.searchValue;

	// search in field
	if (this.field != undefined) {
		var field = String(this.field).toLowerCase();
		index = field.indexOf(search);
		if (index != -1) {
			this.searchField = true;
			results.push({
				'node': this,
				'elem': 'field'
			});
		}

		// update dom
		this._updateDomField();
	}

	// search in value
	if (this.type == 'array' || this.type == 'object') {
		// array, object

		// search the nodes childs
		if (this.childs) {
			var childResults = [];
			this.childs.forEach(function (child) {
				childResults = childResults.concat(child.search(text));
			});
			results = results.concat(childResults);
		}

		// update dom
		if (search != undefined) {
			var recurse = false;
			if (childResults.length == 0) {
				this.collapse(recurse);
			} else {
				this.expand(recurse);
			}
		}
	} else {
		// string, auto
		if (this.value != undefined) {
			var value = String(this.value).toLowerCase();
			index = value.indexOf(search);
			if (index != -1) {
				this.searchValue = true;
				results.push({
					'node': this,
					'elem': 'value'
				});
			}
		}

		// update dom
		this._updateDomValue();
	}

	return results;
};

/**
 * 该节点位于可见区域。
 * 节点无法获得焦点
 * 
 * 
 * Move the scroll position such that this node is in the visible area.
 * The node will not get the focus
 */
JSONEditor.Node.prototype.scrollTo = function () {
	if (!this.dom.tr || !this.dom.tr.parentNode) {
		// if the node is not visible, expand its parents
		var parent = this.parent;
		var recurse = false;
		while (parent) {
			parent.expand(recurse);
			parent = parent.parent;
		}
	}

	if (this.dom.tr && this.dom.tr.parentNode) {
		this.editor.scrollTo(this.dom.tr.offsetTop);
	}
};

/**
 * 将焦点设置为此节点的值
 * 
 * 
 * Set focus to the value of this node
 * @param {String} [field]  The field name of the element to get the focus
 *                          available values: 'field', 'value'
 */
JSONEditor.Node.prototype.focus = function (field) {
	if (this.dom.tr && this.dom.tr.parentNode) {
		if (field != 'value' && this.fieldEditable) {
			var domField = this.dom.field;
			if (domField) {
				domField.focus();
			}
		} else {
			var domValue = this.dom.value;
			if (domValue) {
				domValue.focus();
			}
		}
	}
};

/**
 * 更新DOM字段中的值和此节点的值
 * 
 * Update the values from the DOM field and value of this node
 */
JSONEditor.Node.prototype.blur = function () {
	// retrieve the actual field and value from the DOM.
	this._getDomValue(false);
	this._getDomField(false);
};

/**
 * 
 * 复制给定的子节点
 * 将在克隆节点之前添加新结构
 * 
 * Duplicate given child node
 * new structure will be added right before the cloned node
 * @param {JSONEditor.Node} node           the childNode to be duplicated
 * @return {JSONEditor.Node} clone         the clone of the node
 * @private
 */
JSONEditor.Node.prototype._duplicate = function (node) {
	var clone = node.clone();

	/* TODO: adjust the field name (to prevent equal field names)
     if (this.type == 'object') {
     }
     */

	// TODO: insert after instead of insert before
	this.insertBefore(clone, node);

	return clone;
};

/**
 * 检查给定节点是否为子节点。该方法将递归检查以查找
 * 这个节点。
 * 
 * Check if given node is a child. The method will check recursively to find
 * this node.
 * @param {JSONEditor.Node} node
 * @return {boolean} containsNode
 */
JSONEditor.Node.prototype.containsNode = function (node) {
	if (this == node) {
		return true;
	}

	var childs = this.childs;
	if (childs) {
		// TOOD: use the js5 Array.some() here?
		for (var i = 0, iMax = childs.length; i < iMax; i++) {
			if (childs[i].containsNode(node)) {
				return true;
			}
		}
	}

	return false;
};

/**
 * 将给定节点移动到此节点
 * 
 * Move given node into this node
 * @param {JSONEditor.Node} node           the childNode to be moved
 * @param {JSONEditor.Node} beforeNode     node will be inserted before given
 *                                         node. If no beforeNode is given,
 *                                         the node is appended at the end
 * @private
 */
JSONEditor.Node.prototype._move = function (node, beforeNode) {
	if (node == beforeNode) {
		// nothing to do...
		return;
	}

	//检查此节点是否不是要在此处移动的节点的子节点
	// check if this node is not a child of the node to be moved here
	if (node.containsNode(this)) {
		throw new Error('不能把区域移动到自身的子节点.');
	}

	//删除原始节点
	// remove the original node
	if (node.parent) {
		node.parent.removeChild(node);
	}

	//创建节点的克隆
	// create a clone of the node
	var clone = node.clone();
	node.clearDom();

	//插入或附加节点
	// insert or append the node
	if (beforeNode) {
		this.insertBefore(clone, beforeNode);
	} else {
		this.appendChild(clone);
	}

	/* TODO: adjust the field name (to prevent equal field names)
     if (this.type == 'object') {
     }
     */
};

/**
 * 从节点中删除一个孩子。
 * 仅在Node值为array或object类型时适用
 * 
 * Remove a child from the node.
 * Only applicable when Node value is of type array or object
 * @param {JSONEditor.Node} node   The child node to be removed;
 * @return {JSONEditor.Node | undefined} node  The removed node on success,
 *                                             else undefined
 */
JSONEditor.Node.prototype.removeChild = function (node) {
	if (this.childs) {
		var index = this.childs.indexOf(node);

		if (index != -1) {
			node.hide();

			// delete old search results
			delete node.searchField;
			delete node.searchValue;

			var removedNode = this.childs.splice(index, 1)[0];

			this.updateDom({
				'updateIndexes': true
			});

			return removedNode;
		}
	}

	return undefined;
};

/**
 * 从此节点中删除子节点节点
 * 此方法等于Node.removeChild，除了_remove firex an
 * onChange事件。
 * 
 * Remove a child node node from this node
 * This method is equal to Node.removeChild, except that _remove firex an
 * onChange event.
 * @param {JSONEditor.Node} node
 * @private
 */
JSONEditor.Node.prototype._remove = function (node) {
	this.removeChild(node);
};

/**
 * 更改此节点的值的类型
 * 
 * Change the type of the value of this Node
 * @param {String} newType
 */
JSONEditor.Node.prototype.changeType = function (newType) {
	var oldType = this.type;

	if ((newType == 'string' || newType == 'auto') && (oldType == 'string' || oldType == 'auto')) {
		// this is an easy change
		this.type = newType;
	} else {
		// change from array to object, or from string/auto to object/array

		var table = this.dom.tr ? this.dom.tr.parentNode : undefined;
		var lastTr;
		if (this.expanded) {
			lastTr = this.getAppend();
		} else {
			lastTr = this.getDom();
		}
		var nextTr = (lastTr && lastTr.parentNode) ? lastTr.nextSibling : undefined;

		// hide current field and all its childs
		this.hide();
		this.clearDom();

		// adjust the field and the value
		this.type = newType;

		// adjust childs
		if (newType == 'object') {
			if (!this.childs) {
				this.childs = [];
			}

			this.childs.forEach(function (child, index) {
				child.clearDom();
				delete child.index;
				child.fieldEditable = true;
				if (child.field == undefined) {
					child.field = index;
				}
			});

			if (oldType == 'string' || oldType == 'auto') {
				this.expanded = true;
			}
		} else if (newType == 'array') {
			if (!this.childs) {
				this.childs = [];
			}

			this.childs.forEach(function (child, index) {
				child.clearDom();
				child.fieldEditable = false;
				child.index = index;
			});

			if (oldType == 'string' || oldType == 'auto') {
				this.expanded = true;
			}
		} else {
			this.expanded = false;
		}

		// create new DOM
		if (table) {
			if (nextTr) {
				table.insertBefore(this.getDom(), nextTr);
			} else {
				table.appendChild(this.getDom());
			}
		}
		this.showChilds();
	}

	if (newType == 'auto' || newType == 'string') {
		// cast value to the correct type
		if (newType == 'string') {
			this.value = String(this.value);
		} else {
			this.value = this._stringCast(String(this.value));
		}

		this.focus();
	}

	this.updateDom({
		'updateIndexes': true
	});
};

/**
 * 从DOM中检索值
 * 
 * Retrieve value from DOM
 * @param {boolean} silent.   If true (default), no errors will be thrown in
 *                            case of invalid data
 * @private
 */
JSONEditor.Node.prototype._getDomValue = function (silent) {
	if (this.dom.value && this.type != 'array' && this.type != 'object') {
		this.valueInnerText = JSONEditor.getInnerText(this.dom.value);
	}

	if (this.valueInnerText != undefined) {
		try {
			// retrieve the value
			var value;
			if (this.type == 'string') {
				value = this._unescapeHTML(this.valueInnerText);
			} else {
				var str = this._unescapeHTML(this.valueInnerText);
				value = this._stringCast(str);
			}
			if (value !== this.value) {
				var oldValue = this.value;
				this.value = value;
				this.editor.onAction('editValue', {
					'node': this,
					'oldValue': oldValue,
					'newValue': value
				});
			}
		} catch (err) {
			this.value = undefined;
			// TODO: sent an action with the new, invalid value?
			if (silent != true) {
				throw err;
			}
		}
	}
};

/**
 * 更新dom值：
 *  - 值的文本颜色，具体取决于值的类型
 *  - 场地的高度，取决于宽度
 *  - 背景颜色，以防它是空的
 * 
 * Update dom value:
 * - the text color of the value, depending on the type of the value
 * - the height of the field, depending on the width
 * - background color in case it is empty
 * @private
 */
JSONEditor.Node.prototype._updateDomValue = function () {
	var domValue = this.dom.value;
	if (domValue) {
		// set text color depending on value type
		var v = this.value;
		var t = (this.type == 'auto') ? typeof (v) : this.type;
		var color = '';
		if (t == 'string') {
			color = 'green';
		} else if (t == 'number') {
			color = 'red';
		} else if (t == 'boolean') {
			color = 'blue';
		} else if (this.type == 'object' || this.type == 'array') {
			// note: typeof(null)=="object", therefore check this.type instead of t
			color = '';
		} else if (v === null) {
			color = 'purple';
		} else if (v === undefined) {
			// invalid value
			color = 'green';
		}
		domValue.style.color = color;

		// make backgound color lightgray when empty
		var isEmpty = (String(this.value) == '' && this.type != 'array' && this.type != 'object');
		if (isEmpty) {
			JSONEditor.addClassName(domValue, 'jsoneditor-empty');
		} else {
			JSONEditor.removeClassName(domValue, 'jsoneditor-empty');
		}

		// highlight when there is a search result
		if (this.searchValueActive) {
			JSONEditor.addClassName(domValue, 'jsoneditor-search-highlight-active');
		} else {
			JSONEditor.removeClassName(domValue, 'jsoneditor-search-highlight-active');
		}
		if (this.searchValue) {
			JSONEditor.addClassName(domValue, 'jsoneditor-search-highlight');
		} else {
			JSONEditor.removeClassName(domValue, 'jsoneditor-search-highlight');
		}

		// strip formatting from the contents of the editable div
		JSONEditor.stripFormatting(domValue);
	}
};

/**
 * 更新dom字段：
 *  - 字段的文本颜色，具体取决于文本
 *  - 场地的高度，取决于宽度
 *  - 背景颜色，以防它是空的
 * 
 * 
 * Update dom field:
 * - the text color of the field, depending on the text
 * - the height of the field, depending on the width
 * - background color in case it is empty
 * @private
 */
JSONEditor.Node.prototype._updateDomField = function () {
	var domField = this.dom.field;
	if (domField) {
		// make backgound color lightgray when empty
		var isEmpty = (String(this.field) == '');
		if (isEmpty) {
			JSONEditor.addClassName(domField, 'jsoneditor-empty');
		} else {
			JSONEditor.removeClassName(domField, 'jsoneditor-empty');
		}

		// highlight when there is a search result
		if (this.searchFieldActive) {
			JSONEditor.addClassName(domField, 'jsoneditor-search-highlight-active');
		} else {
			JSONEditor.removeClassName(domField, 'jsoneditor-search-highlight-active');
		}
		if (this.searchField) {
			JSONEditor.addClassName(domField, 'jsoneditor-search-highlight');
		} else {
			JSONEditor.removeClassName(domField, 'jsoneditor-search-highlight');
		}

		// strip formatting from the contents of the editable div
		JSONEditor.stripFormatting(domField);
	}
};

/**
 * 从DOM中检索字段
 * 
 * Retrieve field from DOM
 * @param {boolean} silent.   If true (default), no errors will be thrown in
 *                            case of invalid data
 * @private
 */
JSONEditor.Node.prototype._getDomField = function (silent) {
	if (this.dom.field && this.fieldEditable) {
		this.fieldInnerText = JSONEditor.getInnerText(this.dom.field);
	}

	if (this.fieldInnerText != undefined) {
		try {
			var field = this._unescapeHTML(this.fieldInnerText);

			if (field !== this.field) {
				var oldField = this.field;
				this.field = field;
				this.editor.onAction('editField', {
					'node': this,
					'oldValue': oldField,
					'newValue': field
				});
			}
		} catch (err) {
			this.field = undefined;
			// TODO: sent an action here, with the new, invalid value?
			if (silent != true) {
				throw err;
			}
		}
	}
};

/**
 * 清除节点的dom
 * Clear the dom of the node
 */
JSONEditor.Node.prototype.clearDom = function () {
	// TODO: hide the node first?
	//this.hide();
	// TOOD: recursively clear dom?

	this.dom = {};
};

/**
 * 
 * 获取节点的HTML DOM TR元素。
 * 尚未创建时将生成dom
 * 
 * Get the HTML DOM TR element of the node.
 * The dom will be generated when not yet created
 * @return {Element} tr    HTML DOM TR Element
 */
JSONEditor.Node.prototype.getDom = function () {
	var dom = this.dom;
	if (dom.tr) {
		return dom.tr;
	}

	// 创建行
	// create row
	dom.tr = document.createElement('tr');
	dom.tr.className = 'jsoneditor-tr';
	dom.tr.node = this;

	if (this.editor.editable) {
		//创建可拖动区域
		// create draggable area
		var tdDrag = document.createElement('td');
		tdDrag.className = 'jsoneditor-td';
		dom.drag = this._createDomDragArea();
		if (dom.drag) {
			tdDrag.appendChild(dom.drag);
		}
		dom.tr.appendChild(tdDrag);
	}

	
	// 创建树和字段
	// create tree and field
	var tdField = document.createElement('td');
	tdField.className = 'jsoneditor-td';
	dom.tr.appendChild(tdField);
	dom.expand = this._createDomExpandButton();
	dom.field = this._createDomField();
	dom.value = this._createDomValue();
	dom.tree = this._createDomTree(dom.expand, dom.field, dom.value);
	tdField.appendChild(dom.tree);

	if (this.editor.editable) {

		//创建类型选择框
		// create type select box
		var tdType = document.createElement('td');
		tdType.className = 'jsoneditor-td jsoneditor-td-edit';
		dom.tr.appendChild(tdType);
		dom.type = this._createDomTypeButton();
		tdType.appendChild(dom.type);

		//创建重复按钮
		// create duplicate button
		var tdDuplicate = document.createElement('td');
		tdDuplicate.className = 'jsoneditor-td jsoneditor-td-edit';
		dom.tr.appendChild(tdDuplicate);
		dom.duplicate = this._createDomDuplicateButton();
		if (dom.duplicate) {
			tdDuplicate.appendChild(dom.duplicate);
		}

		//  创建删除按钮
		// create remove button
		var tdRemove = document.createElement('td');
		tdRemove.className = 'jsoneditor-td jsoneditor-td-edit';
		dom.tr.appendChild(tdRemove);
		dom.remove = this._createDomRemoveButton();
		if (dom.remove) {
			tdRemove.appendChild(dom.remove);
		}
	}

	this.updateDom(); // TODO: recurse here?

	return dom.tr;
};

/**
 * DragStart事件，在节点左侧的dragarea上的mousedown上触发
 * DragStart event, fired on mousedown on the dragarea at the left side of a Node
 * @param {Event} event
 * @private
 */
JSONEditor.Node.prototype._onDragStart = function (event) {
	event = event || window.event;

	var node = this;
	if (!this.mousemove) {
		this.mousemove = JSONEditor.Events.addEventListener(document, 'mousemove',

		function (event) {
			node._onDrag(event);
		});
	}

	if (!this.mouseup) {
		this.mouseup = JSONEditor.Events.addEventListener(document, 'mouseup',

		function (event) {
			node._onDragEnd(event);
		});
	}

	/* TODO: correct highlighting when the TypeDropDown is visible (And has highlighting locked)
     if (JSONEditor.freezeHighlight) {
     console.log('heee');
     JSONEditor.freezeHighlight = false;
     this.setHighlight(true);
     }
     */
	JSONEditor.freezeHighlight = true;
	this.drag = {
		'oldCursor': document.body.style.cursor,
		'startParent': this.parent,
		'startIndex': this.parent.childs.indexOf(this)
	};
	document.body.style.cursor = 'move';

	JSONEditor.Events.preventDefault(event);
};

/**
 * 拖动事件，在拖动节点时移动鼠标时触发
 * Drag event, fired when moving the mouse while dragging a Node
 * @param {Event} event
 * @private
 */
JSONEditor.Node.prototype._onDrag = function (event) {
	event = event || window.event;
	var trThis = this.dom.tr;

	// TODO：添加ESC选项，重置为原始位置
	// TODO: add an ESC option, which resets to the original position

	var topThis = JSONEditor.getAbsoluteTop(trThis);
	var heightThis = trThis.offsetHeight;
	var mouseY = event.pageY || (event.clientY + document.body.scrollTop);
	if (mouseY < topThis) {
		// 提升
		// move up
		var trPrev = trThis.previousSibling;
		var topPrev = JSONEditor.getAbsoluteTop(trPrev);
		var nodePrev = JSONEditor.getNodeFromTarget(trPrev);
		while (trPrev && mouseY < topPrev) {
			nodePrev = JSONEditor.getNodeFromTarget(trPrev);
			trPrev = trPrev.previousSibling;
			topPrev = JSONEditor.getAbsoluteTop(trPrev);
		}

		if (nodePrev) {
			trPrev = nodePrev.dom.tr;
			topPrev = JSONEditor.getAbsoluteTop(trPrev);
			if (mouseY > topPrev + heightThis) {
				nodePrev = undefined;
			}
		}

		if (nodePrev && nodePrev.parent) {
			nodePrev.parent.moveBefore(this, nodePrev);
		}
	} else {
		//向下移动
		// move down
		var trLast = (this.expanded && this.append) ? this.append.getDom() : this.dom.tr;
		var trFirst = trLast ? trLast.nextSibling : undefined;
		if (trFirst) {
			var topFirst = JSONEditor.getAbsoluteTop(trFirst);

			var nodeNext = undefined;
			var trNext = trFirst.nextSibling;
			var topNext = JSONEditor.getAbsoluteTop(trNext);
			var heightNext = trNext ? (topNext - topFirst) : 0;
			while (trNext && mouseY > topThis + heightNext) {
				nodeNext = JSONEditor.getNodeFromTarget(trNext);
				trNext = trNext.nextSibling;
				topNext = JSONEditor.getAbsoluteTop(trNext);
				heightNext = trNext ? (topNext - topFirst) : 0;
			}

			if (nodeNext && nodeNext.parent) {
				nodeNext.parent.moveBefore(this, nodeNext);
			}
		}
	}
	JSONEditor.Events.preventDefault(event);
};

/**
 * 拖动事件，在拖动节点后触发鼠标
 * 
 * Drag event, fired on mouseup after having dragged a node
 * @param {Event} event
 * @private
 */
JSONEditor.Node.prototype._onDragEnd = function (event) {
	event = event || window.event;

	var params = {
		'node': this,
		'startParent': this.drag.startParent,
		'startIndex': this.drag.startIndex,
		'endParent': this.parent,
		'endIndex': this.parent.childs.indexOf(this)
	};
	if ((params.startParent != params.endParent) || (params.startIndex != params.endIndex)) {
		//如果节点实际移动到另一个地方，则仅注册此操作
		// only register this action if the node is actually moved to another place
		this.editor.onAction('moveNode', params);
	}

	document.body.style.cursor = this.drag.oldCursor;
	delete JSONEditor.freezeHighlight;
	delete this.drag;
	this.setHighlight(false);

	if (this.mousemove) {
		JSONEditor.Events.removeEventListener(document, 'mousemove', this.mousemove);
		delete this.mousemove;
	}
	if (this.mouseup) {
		JSONEditor.Events.removeEventListener(document, 'mouseup', this.mouseup);
		delete this.mouseup;
	}

	JSONEditor.Events.preventDefault(event);
};

/**
 * 创建一个显示在节点左侧的拖动区域
 * Create a drag area, displayed at the left side of the node
 * @return {Element | undefined} domDrag
 * @private
 */
JSONEditor.Node.prototype._createDomDragArea = function () {
	if (!this.parent) {
		return undefined;
	}

	var domDrag = document.createElement('button');
	domDrag.className = 'jsoneditor-dragarea';
	domDrag.title = 'Move field (drag and drop)';

	return domDrag;
};

/**
 * 创建一个可编辑的字段
 * 
 * Create an editable field
 * @return {Element} domField
 * @private
 */
JSONEditor.Node.prototype._createDomField = function () {
	return document.createElement('div');
};

/**
 * 为此节点及其所有子节点设置突出显示。
 * 仅适用于当前可见（扩展的孩子）
 * 
 * Set highlighting for this node and all its childs.
 * Only applied to the currently visible (expanded childs)
 * @param {boolean} highlight
 */
JSONEditor.Node.prototype.setHighlight = function (highlight) {
	if (JSONEditor.freezeHighlight) {
		return;
	}

	if (this.dom.tr) {
		this.dom.tr.className = 'jsoneditor-tr' + (highlight ? ' jsoneditor-tr-highlight' : '');

		if (this.append) {
			this.append.setHighlight(highlight);
		}

		if (this.childs) {
			this.childs.forEach(function (child) {
				child.setHighlight(highlight);
			});
		}
	}
};

/**
 * 更新节点的值。只允许原始类型，不允许使用Object
 * 或数组是允许的。
 * 
 * Update the value of the node. Only primitive types are allowed, no Object
 * or Array is allowed.
 * @param {String | Number | Boolean | null} value
 */
JSONEditor.Node.prototype.updateValue = function (value) {
	this.value = value;
	this.updateDom();
};

/**
 * 更新节点的字段。
 * Update the field of the node.
 * @param {String} field
 */
JSONEditor.Node.prototype.updateField = function (field) {
	this.field = field;
	this.updateDom();
};

/**
 * HTML DOM，可选择通过子进程递归
 * Update the HTML DOM, optionally recursing through the childs
 * @param {Object} [options] Available parameters:
 *                          {boolean} [recurse]         If true, the
 *                          DOM of the childs will be updated recursively.
 *                          False by default.
 *                          {boolean} [updateIndexes]   If true, the childs
 *                          indexes of the node will be updated too. False by
 *                          default.
 */
JSONEditor.Node.prototype.updateDom = function (options) {
	//更新级别缩进
	// update level indentation
	var domTree = this.dom.tree;
	if (domTree) {
		domTree.style.marginLeft = this.getLevel() * 24 + 'px';
	}

	//更新字段
	// update field
	var domField = this.dom.field;
	if (domField) {
		if (this.fieldEditable == true) {
			// 亲 是一个对象
			// parent is an object
			domField.contentEditable = this.editor.editable;
			domField.spellcheck = false;
			domField.className = 'jsoneditor-field';
		} else {
			// parent是一个数组，这是根节点
			// parent is an array this is the root node
			domField.className = 'jsoneditor-readonly';
		}

		var field;
		if (this.index != undefined) {
			field = this.index;
		} else if (this.field != undefined) {
			field = this.field;
		} else if (this.type == 'array' || this.type == 'object') {
			field = this.type;
		} else {
			field = 'field';
		}
		domField.innerHTML = this._escapeHTML(field);
	}

	//更新值
	// update value
	var domValue = this.dom.value;
	if (domValue) {
		var count = this.childs ? this.childs.length : 0;
		if (this.type == 'array') {
			domValue.innerHTML = '[' + count + ']';
			domValue.title = this.type + ' containing ' + count + ' items';
		} else if (this.type == 'object') {
			domValue.innerHTML = '{' + count + '}';
			domValue.title = this.type + ' containing ' + count + ' items';
		} else {
			domValue.innerHTML = this._escapeHTML(this.value);
			delete domValue.title;
		}
	}

	//更新字段和值
	// update field and value
	this._updateDomField();
	this._updateDomValue();

	//更新子索引

	// update childs indexes
	if (options && options.updateIndexes == true) {
		// updateIndexes为true或undefined 

		// updateIndexes is true or undefined
		this._updateDomIndexes();
	}

	if (options && options.recurse == true) {
		// recurse是true还是undefined。递归更新子项
		// recurse is true or undefined. update childs recursively
		if (this.childs) {
			this.childs.forEach(function (child) {
				child.updateDom(options);
			});
		}

		//使用追加按钮更新行
		// update row with append button
		if (this.append) {
			this.append.updateDom();
		}
	}
};

/**
 * 更新节点子节点的DOM：更新索引和未定义字段
 * 名字。
 * 仅在结构是数组或对象时适用
 * Update the DOM of the childs of a node: update indexes and undefined field
 * names.
 * Only applicable when structure is an array or object
 * @private
 */
JSONEditor.Node.prototype._updateDomIndexes = function () {
	var domValue = this.dom.value;
	var childs = this.childs;
	if (domValue && childs) {
		if (this.type == 'array') {
			childs.forEach(function (child, index) {
				child.index = index;
				var childField = child.dom.field;
				if (childField) {
					childField.innerHTML = index;
				}
			});
		} else if (this.type == 'object') {
			childs.forEach(function (child) {
				if (child.index != undefined) {
					delete child.index;

					if (child.field == undefined) {
						child.field = 'field';
					}
				}
			});
		}
	}
};

/**
 * 创建可编辑的值
 * 
 * Create an editable value
 * @private
 */
JSONEditor.Node.prototype._createDomValue = function () {
	var domValue;

	if (this.type == 'array') {
		domValue = document.createElement('div');
		domValue.className = 'jsoneditor-readonly';
		domValue.innerHTML = '[...]';
	} else if (this.type == 'object') {
		domValue = document.createElement('div');
		domValue.className = 'jsoneditor-readonly';
		domValue.innerHTML = '{...}';
	} else if (this.type == 'string') {
		domValue = document.createElement('div');
		domValue.contentEditable = this.editor.editable;
		domValue.spellcheck = false;
		domValue.className = 'jsoneditor-value';
		domValue.innerHTML = this._escapeHTML(this.value);
	} else {
		domValue = document.createElement('div');
		domValue.contentEditable = this.editor.editable;
		domValue.spellcheck = false;
		domValue.className = 'jsoneditor-value';
		domValue.innerHTML = this._escapeHTML(this.value);
	}

	// TODO: in FF spel/check of editable divs is done via the body. quite ugly
	// document.body.spellcheck = false;

	return domValue;
};

/**
 * 创建展开/折叠按钮
 * 
 * Create an expand/collapse button
 * @return {Element} expand
 * @private
 */
JSONEditor.Node.prototype._createDomExpandButton = function () {
	// create expand button
	var expand = document.createElement('button');
	var expandable = (this.type == 'array' || this.type == 'object');
	if (expandable) {
		expand.className = this.expanded ? 'jsoneditor-expanded' : 'jsoneditor-collapsed';
		expand.title =
			'Click to expand/collapse this field. \n' +
			'Ctrl+Click to expand/collapse including all childs.';
	} else {
		expand.className = 'jsoneditor-invisible';
		expand.title = '';
	}

	return expand;
};


/**
 * 
 * 创建一个DOM树元素，其中包含展开/折叠按钮
 * Create a DOM tree element, containing the expand/collapse button
 * @param {Element} domExpand
 * @param {Element} domField
 * @param {Element} domValue
 * @return {Element} domTree
 * @private
 */
JSONEditor.Node.prototype._createDomTree = function (domExpand, domField, domValue) {
	var dom = this.dom;
	var domTree = document.createElement('table');
	var tbody = document.createElement('tbody');
	domTree.style.borderCollapse = 'collapse'; // TODO: put in css
	domTree.appendChild(tbody);
	var tr = document.createElement('tr');
	tbody.appendChild(tr);

	// create expand button
	var tdExpand = document.createElement('td');
	tdExpand.className = 'jsoneditor-td-tree';
	tr.appendChild(tdExpand);
	tdExpand.appendChild(domExpand);
	dom.tdExpand = tdExpand;

	// add the field
	var tdField = document.createElement('td');
	tdField.className = 'jsoneditor-td-tree';
	tr.appendChild(tdField);
	tdField.appendChild(domField);
	dom.tdField = tdField;

	// add a separator
	var tdSeparator = document.createElement('td');
	tdSeparator.className = 'jsoneditor-td-tree';
	tr.appendChild(tdSeparator);
	if (this.type != 'object' && this.type != 'array') {
		tdSeparator.appendChild(document.createTextNode(':'));
		tdSeparator.className = 'jsoneditor-separator';
	}
	dom.tdSeparator = tdSeparator;

	// add the value
	var tdValue = document.createElement('td');
	tdValue.className = 'jsoneditor-td-tree';
	tr.appendChild(tdValue);
	tdValue.appendChild(domValue);
	dom.tdValue = tdValue;

	return domTree;
};

/**
 * 处理一个事件。该活动由编辑集中收集
 * 
 * 
 * Handle an event. The event is catched centrally by the editor
 * @param {Event} event
 */
JSONEditor.Node.prototype.onEvent = function (event) {
	var type = event.type;
	var target = event.target || event.srcElement;
	var dom = this.dom;
	var node = this;
	var expandable = (this.type == 'array' || this.type == 'object');

	//值事件
	// value events
	var domValue = dom.value;
	if (target == domValue) {
		switch (type) {
			case 'focus':
				JSONEditor.focusNode = this;
				break;

			case 'blur':
			case 'change':
				this._getDomValue(true);
				this._updateDomValue();
				if (this.value) {
					domValue.innerHTML = this._escapeHTML(this.value);
				}
				break;

			case 'keyup':
				this._getDomValue(true);
				this._updateDomValue();
				break;

			case 'cut':
			case 'paste':
				setTimeout(function () {
					node._getDomValue(true);
					node._updateDomValue();
				}, 1);
				break;
		}
	}

	//场事件
	// field events
	var domField = dom.field;
	if (target == domField) {
		switch (type) {
			case 'focus':
				JSONEditor.focusNode = this;
				break;

			case 'change':
			case 'blur':
				this._getDomField(true);
				this._updateDomField();
				if (this.field) {
					domField.innerHTML = this._escapeHTML(this.field);
				}
				break;

			case 'keyup':
				this._getDomField(true);
				this._updateDomField();
				break;

			case 'cut':
			case 'paste':
				setTimeout(function () {
					node._getDomField(true);
					node._updateDomField();
				}, 1);
				break;
		}
	}

	//拖动事件
	// drag events
	var domDrag = dom.drag;
	if (target == domDrag) {
		switch (type) {
			case 'mousedown':
				this._onDragStart(event);
				break;
			case 'mouseover':
				this.setHighlight(true);
				break;
			case 'mouseout':
				this.setHighlight(false);
				break;
		}
	}
	//展开事件
	// expand events
	var domExpand = dom.expand;
	if (target == domExpand) {
		if (type == 'click') {
			if (expandable) {
				this._onExpand(event);
			}
		}
	}

	//重复按钮
	// duplicate button
	var domDuplicate = dom.duplicate;
	if (target == domDuplicate) {
		switch (type) {
			case 'click':
				var clone = this.parent._duplicate(this);

				this.editor.onAction('duplicateNode', {
					'node': this,
					'clone': clone,
					'parent': this.parent
				});
				break;
			case 'mouseover':
				this.setHighlight(true);
				break;
			case 'mouseout':
				this.setHighlight(false);
				break;
		}
	}

	//删除按钮
	// remove button
	var domRemove = dom.remove;
	if (target == domRemove) {
		switch (type) {
			case 'click':
				this._onRemove();
				break;
			case 'mouseover':
				this.setHighlight(true);
				break;
			case 'mouseout':
				this.setHighlight(false);
				break;
		}
	}

	//键入按钮
	// type button
	var domType = dom.type;
	if (target == domType) {
		switch (type) {
			case 'click':
				this._onChangeType(event);
				break;
			case 'mouseover':
				this.setHighlight(true);
				break;
			case 'mouseout':
				this.setHighlight(false);
				break;
		}
	}

	//焦点
	//当从字段或值左侧或右侧单击空白时，设置焦点

	// focus
	// when clicked in whitespace left or right from the field or value, set focus
	var domTree = dom.tree;
	if (target == domTree.parentNode) {
		switch (type) {
			case 'click':
				var left = (event.offsetX != undefined) ? (event.offsetX < (this.getLevel() + 1) * 24) : (event.clientX < JSONEditor.getAbsoluteLeft(dom.tdSeparator)); // for FF
				if (left || expandable) {
					// node is expandable when it is an object or array
					if (domField) {
						JSONEditor.setEndOfContentEditable(domField);
						domField.focus();
					}
				} else {
					if (domValue) {
						JSONEditor.setEndOfContentEditable(domValue);
						domValue.focus();
					}
				}
				break;
		}
	}

	if ((target == dom.tdExpand && !expandable) || target == dom.tdField || target == dom.tdSeparator) {
		switch (type) {
			case 'click':
				if (domField) {
					JSONEditor.setEndOfContentEditable(domField);
					domField.focus();
				}
				break;
		}
	}
};

/**
 * Handle the expand event, when clicked on the expand button
 * @param {Event} event
 * @private
 */
JSONEditor.Node.prototype._onExpand = function (event) {
	event = event || window.event;
	var recurse = event.ctrlKey; // with ctrl-key, expand/collapse all

	if (recurse) {
		// Take the table offline
		var table = this.dom.tr.parentNode; // TODO: not nice to access the main table like this
		var frame = table.parentNode;
		var scrollTop = frame.scrollTop;
		frame.removeChild(table);
	}

	if (this.expanded) {
		this.collapse(recurse);
	} else {
		this.expand(recurse);
	}

	if (recurse) {
		// Put the table online again
		frame.appendChild(table);
		frame.scrollTop = scrollTop;
	}
};

JSONEditor.Node.types = [{
	'value': 'array',
	'className': 'jsoneditor-option-array',
	'title': '"array" 类型: 一个包含了有序值集合的数组.'
}, {
	'value': 'auto',
	'className': 'jsoneditor-option-auto',
	'title': '"auto" 类型: 节点类型将自动从值中获取, 可以是: string, number, boolean, 或者 null.'
}, {
	'value': 'object',
	'className': 'jsoneditor-option-object',
	'title': '"object" 类型: 对象包含了一些无序的键/值对.'
}, {
	'value': 'string',
	'className': 'jsoneditor-option-string',
	'title': '"string" 类型: 节点类型不从值中自动获取, 但永远返回 string.'
}];

/**
 * Create a DOM select box containing the node type
 * @return {Element} domType
 * @private
 */
JSONEditor.Node.prototype._createDomTypeButton = function () {
	var node = this;
	var domType = document.createElement('button');
	domType.className = 'jsoneditor-type-' + node.type;
	domType.title = '改变节点类型';

	return domType;
};

/**
 * Remove this node
 * @private
 */
JSONEditor.Node.prototype._onRemove = function () {
	this.setHighlight(false);
	var index = this.parent.childs.indexOf(this);

	this.parent._remove(this);

	this.editor.onAction('removeNode', {
		'node': this,
		'parent': this.parent,
		'index': index
	});
};

/**
 * Handle a click on the Type-button
 * @param {Event} event
 * @private
 */
JSONEditor.Node.prototype._onChangeType = function (event) {
	JSONEditor.Events.stopPropagation(event);

	var domType = this.dom.type;

	var node = this;
	var x = JSONEditor.getAbsoluteLeft(domType);
	var y = JSONEditor.getAbsoluteTop(domType) + domType.clientHeight;
	var callback = function (newType) {
		var oldType = node.type;
		node.changeType(newType);
		node.editor.onAction('changeType', {
			'node': node,
			'oldType': oldType,
			'newType': newType
		});
		domType.className = 'jsoneditor-type-' + node.type;
	};
	JSONEditor.showDropDownList({
		'x': x,
		'y': y,
		'node': node,
		'value': node.type,
		'values': JSONEditor.Node.types,
		'className': 'jsoneditor-select',
		'optionSelectedClassName': 'jsoneditor-option-selected',
		'optionClassName': 'jsoneditor-option',
		'callback': callback
	});
};

/**
 * 显示下拉列表
 * Show a dropdown list
 * @param {Object} params    Available parameters:
 *                           {Number} x  The absolute horizontal position
 *                           {Number} y  The absolute vertical position
 *                           {JSONEditor.Node} node node used for highlighting
 *                           {String} value current selected value
 *                           {Object[]} values the available values. Each object
 *                                             contains a value, title, and
 *                                             className
 *                           {String} optionSelectedClassName
 *                           {String} optionClassName
 *                           {function} callback   Callback method, called when
 *                                                 the selected value changed.
 */
JSONEditor.showDropDownList = function (params) {
	var select = document.createElement('div');
	select.className = params.className || '';
	select.style.position = 'absolute';
	select.style.left = (params.x || 0) + 'px';
	select.style.top = (params.y || 0) + 'px';

	params.values.forEach(function (v) {
		var text = v.value || String(v);
		var className = 'jsoneditor-option';
		var selected = (text == params.value);
		if (selected) {
			className += ' ' + params.optionSelectedClassName;
		}
		var option = document.createElement('div');
		option.className = className;
		if (v.title) {
			option.title = v.title;
		}

		var divIcon = document.createElement('div');
		divIcon.className = (v.className || '');
		option.appendChild(divIcon);

		var divText = document.createElement('div');
		divText.className = 'jsoneditor-option-text';
		divText.innerHTML = '<div>' + text + '</div>';
		option.appendChild(divText);

		option.onmousedown = (function (value) {
			return function () {
				params.callback(value);
			};
		})(v.value);
		select.appendChild(option);
	});

	document.body.appendChild(select);
	params.node.setHighlight(true);
	JSONEditor.freezeHighlight = true;

	// TODO: change to onclick? -> but be sure to remove existing dropdown first
	var onmousedown = JSONEditor.Events.addEventListener(document, 'mousedown', function () {
		JSONEditor.freezeHighlight = false;
		params.node.setHighlight(false);
		if (select && select.parentNode) {
			select.parentNode.removeChild(select);
		}
		JSONEditor.Events.removeEventListener(document, 'mousedown', onmousedown);
	});
	var onmousewheel = JSONEditor.Events.addEventListener(document, 'mousewheel', function () {
		JSONEditor.freezeHighlight = false;
		params.node.setHighlight(false);
		if (select && select.parentNode) {
			select.parentNode.removeChild(select);
		}
		JSONEditor.Events.removeEventListener(document, 'mousewheel', onmousewheel);
	});
};

/**
 * 使用追加按钮创建表格行。
 * 
 * Create a table row with an append button.
 * @return {Element | undefined} buttonAppend or undefined when inapplicable  buttonAppend或undefined在不适用时
 */
JSONEditor.Node.prototype.getAppend = function () {
	if (!this.append) {
		this.append = new JSONEditor.AppendNode(this.editor);
		this.append.setParent(this);
	}
	return this.append.getDom();
};

/**
 * 创建一个删除按钮。当结构不能时，返回undefined
 * 被删除
 * 
 * Create a remove button. Returns undefined when the structure cannot
 * be removed
 * @return {Element | undefined} removeButton, or undefined when inapplicable
 * @private
 */
JSONEditor.Node.prototype._createDomRemoveButton = function () {
	if (this.parent && (this.parent.type == 'array' || this.parent.type == 'object')) {
		var buttonRemove = document.createElement('button');
		buttonRemove.className = 'jsoneditor-remove';
		buttonRemove.title = '删除节点 (包括所有子节点)';

		return buttonRemove;
	} else {
		return undefined;
	}
};

/**
 * 创建一个重复按钮。
 * 如果节点是根节点，则没有重复按钮可用且未定义
 * 将被退回
 * 
 * Create a duplicate button.
 * If the Node is the root node, no duplicate button is available and undefined
 * will be returned
 * @return {Element | undefined} buttonDuplicate
 * @private
 */
JSONEditor.Node.prototype._createDomDuplicateButton = function () {
	if (this.parent && (this.parent.type == 'array' || this.parent.type == 'object')) {
		var buttonDupliate = document.createElement('button');
		buttonDupliate.className = 'jsoneditor-duplicate';
		buttonDupliate.title = '复制节点 (包括所有子节点)';

		return buttonDupliate;
	} else {
		return undefined;
	}
};

/**
 * 获取值的类型
 * 
 * get the type of a value
 * @param {*} value
 * @return {String} type   Can be 'object', 'array', 'string', 'auto'
 * @private
 */
JSONEditor.Node.prototype._getType = function (value) {
	if (value instanceof Array) {
		return 'array';
	}
	if (value instanceof Object) {
		return 'object';
	}
	if (typeof (value) == 'string' && typeof (this._stringCast(value)) != 'string') {
		return 'string';
	}

	return 'auto';
};

/**
 * 将字符串的内容强制转换为正确的类型。这可以是一个字符串，
 * 数字，布尔值等
 * 
 * 
 * cast contents of a string to the correct type. This can be a string,
 * a number, a boolean, etc
 * @param {String} str
 * @return {*} castedStr
 * @private
 */
JSONEditor.Node.prototype._stringCast = function (str) {
	var lower = str.toLowerCase(),
		num = Number(str), // will nicely fail with '123ab'
		numFloat = parseFloat(str); // will nicely fail with '  '

	if (str == '') {
		return '';
	} else if (lower == 'null') {
		return null;
	} else if (lower == 'true') {
		return true;
	} else if (lower == 'false') {
		return false;
	} else if (!isNaN(num) && !isNaN(numFloat)) {
		return num;
	} else {
		return str;
	}
};

/**
 * 转义文本，以便它可以安全地显示在HTML元素中
 * 
 * escape a text, such that it can be displayed safely in an HTML element
 * @param {String} text
 * @return {String} escapedText
 * @private
 */
JSONEditor.Node.prototype._escapeHTML = function (text) {
	var htmlEscaped = String(text)
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/  /g, ' &nbsp;') // replace double space with an nbsp and space
	.replace(/^ /, '&nbsp;') // space at start
	.replace(/ $/, '&nbsp;'); // space at end

	var json = JSON.stringify(htmlEscaped);
	return json.substring(1, json.length - 1);
};

/**
 * 逃避json
 * 
 * unescape a string.
 * @param {String} escapedText
 * @return {String} text
 * @private
 */
JSONEditor.Node.prototype._unescapeHTML = function (escapedText) {
	var json = '"' + this._escapeJSON(escapedText) + '"';
	var htmlEscaped = JSONEditor.parse(json);
	return htmlEscaped.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ');
};

/**
 * 转义文本以使其成为有效的JSON字符串。该方法将：
 *  - 用'\''替换未转义的双引号
 *  - 用'\\'替换未转义的反斜杠
 *  - 用'\ n'替换返回
 * 
 * escape a text to make it a valid JSON string. The method will:
 *   - replace unescaped double quotes with '\"'
 *   - replace unescaped backslash with '\\'
 *   - replace returns with '\n'
 * @param {String} text
 * @return {String} escapedText
 * @private
 */
JSONEditor.Node.prototype._escapeJSON = function (text) {
	// TODO: replace with some smart regex (only when a new solution is faster!)
	var escaped = '';
	var i = 0,
		iMax = text.length;
	while (i < iMax) {
		var c = text.charAt(i);
		if (c == '\n') {
			escaped += '\\n';
		} else if (c == '\\') {
			escaped += c;
			i++;

			c = text.charAt(i);
			if ('"\\/bfnrtu'.indexOf(c) == -1) {
				escaped += '\\'; // no valid escape character
			}
			escaped += c;
		} else if (c == '"') {
			escaped += '\\"';
		} else {
			escaped += c;
		}
		i++;
	}

	return escaped;
};

/**
 * @constructor JSONEditor.AppendNode
 * @extends JSONEditor.Node
 * @param {JSONEditor} editor
 * Create a new AppendNode. This is a special node which is created at the
 * end of the list with childs for an object or array
 * 
 * 创建一个新的AppendNode。这是一个特殊的节点，它是在
 * 带有子对象或数组的列表末尾
 * 
 */
JSONEditor.AppendNode = function (editor) {
	this.editor = editor;
	this.dom = {};
};

JSONEditor.AppendNode.prototype = new JSONEditor.Node();

/**
 * 返回带有追加按钮的表格行。
 * 
 * Return a table row with an append button.
 * @return {Element} dom   TR element
 */
JSONEditor.AppendNode.prototype.getDom = function () {
	if (this.dom.tr) {
		return this.dom.tr;
	}

	/**
	 * Create a TD element, and give it the provided class name (if any)
	 * @param {String} [className]
	 * @return {Element} td
	 */
	function newTd(className) {
		var td = document.createElement('td');
		td.className = className || '';
		return td;
	}

	// a row for the append button
	var trAppend = document.createElement('tr');
	trAppend.node = this;

	// TODO: do not create an appendNode at all when in viewer mode
	if (!this.editor.editable) {
		return trAppend;
	}

	// a cell for the drag area column
	trAppend.appendChild(newTd('jsoneditor-td'));

	// a cell for the append button
	var tdAppend = document.createElement('td');
	trAppend.appendChild(tdAppend);
	tdAppend.className = 'jsoneditor-td';

	// create the append button
	var buttonAppend = document.createElement('button');
	buttonAppend.className = 'jsoneditor-append';
	buttonAppend.title = '添加';
	this.dom.append = buttonAppend;
	tdAppend.appendChild(buttonAppend);

	trAppend.appendChild(newTd('jsoneditor-td jsoneditor-td-edit'));
	trAppend.appendChild(newTd('jsoneditor-td jsoneditor-td-edit'));
	trAppend.appendChild(newTd('jsoneditor-td jsoneditor-td-edit'));

	this.dom.tr = trAppend;
	this.dom.td = tdAppend;

	this.updateDom();

	return trAppend;
};

/**
 * Update the HTML dom of the Node
 */
JSONEditor.AppendNode.prototype.updateDom = function () {
	var tdAppend = this.dom.td;
	if (tdAppend) {
		tdAppend.style.paddingLeft = (this.getLevel() * 24 + 26) + 'px';
		// TODO: not so nice hard coded offset
	}
};

/**
 * 
 * 处理一个事件。该活动由编辑集中收集
 * 
 * Handle an event. The event is catched centrally by the editor
 * @param {Event} event
 */
JSONEditor.AppendNode.prototype.onEvent = function (event) {
	var type = event.type;
	var target = event.target || event.srcElement;
	var dom = this.dom;

	var domAppend = dom.append;
	if (target == domAppend) {
		switch (type) {
			case 'click':
				this._onAppend();
				break;

			case 'mouseover':
				this.parent.setHighlight(true);
				break;

			case 'mouseout':
				this.parent.setHighlight(false);
		}
	}
};

/**
 * 处理追加事件
 * 
 * Handle append event
 * @private
 */
JSONEditor.AppendNode.prototype._onAppend = function () {
	var newNode = new JSONEditor.Node(this.editor, {
		'field': 'field',
		'value': 'value'
	});
	this.parent.appendChild(newNode);
	this.parent.setHighlight(false);
	newNode.focus();

	this.editor.onAction('appendNode', {
		'node': newNode,
		'parent': this.parent
	});
};

/**
 * 
 * 创建主框架
 * 
 * 
 * Create main frame
 * @private
 */
JSONEditor.prototype._createFrame = function () {
	// create the frame
	this.container.innerHTML = '';
	this.frame = document.createElement('div');
	this.frame.className = 'jsoneditor-frame';
	this.container.appendChild(this.frame);

	// create one global event listener to handle all events from all nodes
	var editor = this;
	// TODO: move this onEvent to JSONEditor.prototype.onEvent
	var onEvent = function (event) {
		event = event || window.event;
		var target = event.target || event.srcElement;

		/* TODO: Enable quickkeys Ctrl+F and F3.
        //       Requires knowing whether the JSONEditor has focus or not
        //       (use a global event listener for that?)
        // Check for search quickkeys, Ctrl+F and F3
        if (editor.options.search) {
            if (event.type == 'keydown') {
                var keynum = event.which || event.keyCode;
                if (keynum == 70 && event.ctrlKey) { // Ctrl+F
                    if (editor.searchBox) {
                        editor.searchBox.dom.search.focus();
                        editor.searchBox.dom.search.select();
                        JSONEditor.Events.preventDefault(event);
                        JSONEditor.Events.stopPropagation(event);
                    }
                }
                else if (keynum == 114) { // F3
                    if (!event.shiftKey) {
                        // select next search result
                        editor.searchBox.next();
                    }
                    else {
                        // select previous search result
                        editor.searchBox.previous();
                    }
                    editor.searchBox.focusActiveResult();

                    // set selection to the current
                    JSONEditor.Events.preventDefault(event);
                    JSONEditor.Events.stopPropagation(event);
                }
            }
        }
        */

		var node = JSONEditor.getNodeFromTarget(target);
		if (node) {
			node.onEvent(event);
		}
	};
	this.frame.onclick = function (event) {
		onEvent(event);

		// prevent default submit action when JSONEditor is located inside a form
		JSONEditor.Events.preventDefault(event);
	};
	this.frame.oncontextmenu = function (event) {
		onEvent(event);

		console.log(event)
		// prevent default submit action when JSONEditor is located inside a form
		JSONEditor.Events.preventDefault(event);
	};

	
	this.frame.onchange = onEvent;
	this.frame.onkeydown = onEvent;
	this.frame.onkeyup = onEvent;
	this.frame.oncut = onEvent;
	this.frame.onpaste = onEvent;
	this.frame.onmousedown = onEvent;
	this.frame.onmouseup = onEvent;
	this.frame.onmouseover = onEvent;
	this.frame.onmouseout = onEvent;
	// Note: focus and blur events do not propagate, therefore they defined
	// using an eventListener with useCapture=true
	// see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
	JSONEditor.Events.addEventListener(this.frame, 'focus', onEvent, true);
	JSONEditor.Events.addEventListener(this.frame, 'blur', onEvent, true);
	this.frame.onfocusin = onEvent; // for IE
	this.frame.onfocusout = onEvent; // for IE

	// create menu
	this.menu = document.createElement('div');
	this.menu.className = 'jsoneditor-menu';
	this.frame.appendChild(this.menu);

	// create expand all button
	var expandAll = document.createElement('button');
	expandAll.className = 'jsoneditor-menu jsoneditor-expand-all';
	expandAll.title = '展开';
	expandAll.onclick = function () {
		editor.expandAll();
	};
	this.menu.appendChild(expandAll);

	// create expand all button
	var collapseAll = document.createElement('button');
	collapseAll.title = '折叠';
	collapseAll.className = 'jsoneditor-menu jsoneditor-collapse-all';
	collapseAll.onclick = function () {
		editor.collapseAll();
	};
	this.menu.appendChild(collapseAll);

	// create expand/collapse buttons
	if (this.history) {
		// create separator
		var separator = document.createElement('span');
		separator.innerHTML = '&nbsp;';
		this.menu.appendChild(separator);

		// create undo button
		var undo = document.createElement('button');
		undo.className = 'jsoneditor-menu jsoneditor-undo';
		undo.title = '撤销';
		undo.onclick = function () {
			// undo last action
			editor.history.undo();

			// trigger change callback
			if (editor.options.change) {
				editor.options.change();
			}
		};
		this.menu.appendChild(undo);
		this.dom.undo = undo;

		// create redo button
		var redo = document.createElement('button');
		redo.className = 'jsoneditor-menu jsoneditor-redo';
		redo.title = '重做';
		redo.onclick = function () {
			// redo last action
			editor.history.redo();

			// trigger change callback
			if (editor.options.change) {
				editor.options.change();
			}
		};
		this.menu.appendChild(redo);
		this.dom.redo = redo;

		// register handler for onchange of history
		this.history.onChange = function () {
			undo.disabled = !editor.history.canUndo();
			redo.disabled = !editor.history.canRedo();
		};
		this.history.onChange();
	}

	// create search box
	if (this.options.search) {
		this.searchBox = new JSONEditor.SearchBox(this, this.menu);
	}
};


/**
 * 创建主表
 * 
 * Create main table
 * @private
 */
JSONEditor.prototype._createTable = function () {
	var contentOuter = document.createElement('div');
	contentOuter.className = 'jsoneditor-content-outer';
	this.contentOuter = contentOuter;

	this.content = document.createElement('div');
	this.content.className = 'jsoneditor-content';
	contentOuter.appendChild(this.content);

	this.table = document.createElement('table');
	this.table.className = 'jsoneditor-table';
	this.content.appendChild(this.table);

	// IE8 does not handle overflow='auto' correctly.
	// Therefore, set overflow to 'scroll'
	var ieVersion = JSONEditor.getInternetExplorerVersion();
	if (ieVersion == 8) {
		this.content.style.overflow = 'scroll';
	}

	// create colgroup where the first two columns don't have a fixed
	// width, and the edit columns do have a fixed width
	var col;
	this.colgroupContent = document.createElement('colgroup');
	col = document.createElement('col');
	col.width = "24px";
	this.colgroupContent.appendChild(col);
	col = document.createElement('col');
	this.colgroupContent.appendChild(col);
	col = document.createElement('col');
	col.width = "24px";
	this.colgroupContent.appendChild(col);
	col = document.createElement('col');
	col.width = "24px";
	this.colgroupContent.appendChild(col);
	col = document.createElement('col');
	col.width = "24px";
	this.colgroupContent.appendChild(col);
	this.table.appendChild(this.colgroupContent);

	this.tbody = document.createElement('tbody');
	this.table.appendChild(this.tbody);

	this.frame.appendChild(contentOuter);
};

/**
 * 从事件目标中查找节点
 * 
 * Find the node from an event target
 * @param {Element} target
 * @return {JSONEditor.Node | undefined} node  or undefined when not found
 */
JSONEditor.getNodeFromTarget = function (target) {
	while (target) {
		if (target.node) {
			return target.node;
		}
		target = target.parentNode;
	}

	return undefined;
};

/**
 * 
 * 创建一个JSONFormatter并将其附加到给定的容器
 * 
 * Create a JSONFormatter and attach it to given container
 * @constructor JSONFormatter
 * @param {Element} container
 * @param {Object} [options]         Object with options. available options:
 *                                   {Number} indentation  Number of indentation
 *                                                         spaces. 4 by default.
 *                                   {function} change     Callback method
 *                                                         triggered on change
 * @param {JSON | String} [json]     initial contents of the formatter
 */
JSONFormatter = function (container, options, json) {
	// check availability of JSON parser (not available in IE7 and older)
	if (!JSON) {
		throw new Error('您当前使用的浏览器不支持 JSON. \n\n' +
			'请下载安装最新版本的浏览器, 本站推荐Google Chrome.\n' +
			'(PS: 当前主流浏览器都支持JSON).');
	}

	this.container = container;
	this.indentation = 4; // number of spaces

	this.width = container.clientWidth;
	this.height = container.clientHeight;

	this.frame = document.createElement('div');
	this.frame.className = "jsoneditor-frame";
	this.frame.onclick = function (event) {
		// prevent default submit action when JSONFormatter is located inside a form
		JSONEditor.Events.preventDefault(event);
	};

	// create menu
	this.menu = document.createElement('div');
	this.menu.className = 'jsoneditor-menu';
	this.frame.appendChild(this.menu);

	// create format button
	var buttonFormat = document.createElement('button');
	//buttonFormat.innerHTML = 'Format';
	buttonFormat.className = 'jsoneditor-menu jsoneditor-format';
	buttonFormat.title = '格式化JSON数据';
	//buttonFormat.className = 'jsoneditor-button';
	this.menu.appendChild(buttonFormat);

	// create compact button
	var buttonCompact = document.createElement('button');
	//buttonCompact.innerHTML = 'Compact';
	buttonCompact.className = 'jsoneditor-menu jsoneditor-compact';
	buttonCompact.title = '压缩JSON数据, 清除所有空白字符';
	//buttonCompact.className = 'jsoneditor-button';
	this.menu.appendChild(buttonCompact);

	this.content = document.createElement('div');
	this.content.className = 'jsonformatter-content';
	this.frame.appendChild(this.content);

	this.textarea = document.createElement('textarea');
	this.textarea.className = "jsonformatter-textarea";
	this.textarea.spellcheck = false;
	this.content.appendChild(this.textarea);

	var textarea = this.textarea;

	// read the options
	if (options) {
		if (options.change) {
			// register on change event
			if (this.textarea.oninput === null) {
				this.textarea.oninput = function () {
					options.change();
				}
			} else {
				// oninput is undefined. For IE8-
				this.textarea.onchange = function () {
					options.change();
				}
			}
		}
		if (options.indentation) {
			this.indentation = Number(options.indentation);
		}
	}

	var me = this;
	buttonFormat.onclick = function () {
		try {
			var json = JSONEditor.parse(textarea.value);
			textarea.value = JSON.stringify(json, null, me.indentation);
		} catch (err) {
			me.onError(err);
		}
	};
	buttonCompact.onclick = function () {
		try {
			var json = JSONEditor.parse(textarea.value);
			textarea.value = JSON.stringify(json);
		} catch (err) {
			me.onError(err);
		}
	};

	this.container.appendChild(this.frame);

	// load initial json object or string
	if (typeof (json) == 'string') {
		this.setText(json);
	} else {
		this.set(json);
	}
};

/**
 * This method is executed on error.
 * It can be overwritten for each instance of the JSONFormatter
 * @param {String} err
 */
JSONFormatter.prototype.onError = function (err) {
	// action should be implemented for the instance
};

/**
 * Set json data in the formatter
 * @param {Object} json
 */
JSONFormatter.prototype.set = function (json) {
	this.textarea.value = JSON.stringify(json, null, this.indentation);
};

/**
 * 从格式化程序中获取json数据
 * Get json data from the formatter
 * @return {Object} json
 */
JSONFormatter.prototype.get = function () {
	return JSONEditor.parse(this.textarea.value);
};

/**
 * 获取JSONFormatter的文本内容
 * Get the text contents of the JSONFormatter
 * @return {String} text
 */
JSONFormatter.prototype.getText = function () {
	return this.textarea.value;
};

/**
 * 格式化程序
 * Set the text contents of the JSONFormatter
 * @param {String} text
 */
JSONFormatter.prototype.setText = function (text) {
	this.textarea.value = text;
};

/**
 * @constructor JSONEditor.SearchBox
 * Create a search box in given HTML container
 * @param {JSONEditor} editor   The JSON Editor to attach to
 * @param {Element} container   HTML container element of where to create the
 *                              search box
 */
JSONEditor.SearchBox = function (editor, container) {
	var searchBox = this;

	this.editor = editor;
	this.timeout = undefined;
	this.delay = 200; // ms
	this.lastText = undefined;

	this.dom = {};
	this.dom.container = container;

	var table = document.createElement('table');
	this.dom.table = table;
	table.className = 'jsoneditor-search';
	container.appendChild(table);
	var tbody = document.createElement('tbody');
	this.dom.tbody = tbody;
	table.appendChild(tbody);
	var tr = document.createElement('tr');
	tbody.appendChild(tr);

	var td = document.createElement('td');
	td.className = 'jsoneditor-search';
	tr.appendChild(td);
	var results = document.createElement('div');
	this.dom.results = results;
	results.className = 'jsoneditor-search-results';
	td.appendChild(results);

	td = document.createElement('td');
	td.className = 'jsoneditor-search';
	tr.appendChild(td);
	var divInput = document.createElement('div');
	this.dom.input = divInput;
	divInput.className = 'jsoneditor-search';
	divInput.title = '查找区块和值';
	td.appendChild(divInput);

	// table to contain the text input and search button
	var tableInput = document.createElement('table');
	tableInput.className = 'jsoneditor-search-input';
	divInput.appendChild(tableInput);
	var tbodySearch = document.createElement('tbody');
	tableInput.appendChild(tbodySearch);
	tr = document.createElement('tr');
	tbodySearch.appendChild(tr);

	var refreshSearch = document.createElement('button');
	refreshSearch.className = 'jsoneditor-search-refresh';
	td = document.createElement('td');
	td.appendChild(refreshSearch);
	tr.appendChild(td);

	var search = document.createElement('input');
	this.dom.search = search;
	search.className = 'jsoneditor-search';
	search.oninput = function (event) {
		searchBox.onDelayedSearch(event);
	};
	search.onchange = function (event) { // For IE 8
		searchBox.onSearch(event);
	};
	search.onkeydown = function (event) {
		searchBox.onKeyDown(event);
	};
	search.onkeyup = function (event) {
		searchBox.onKeyUp(event);
	};
	refreshSearch.onclick = function (event) {
		search.select();
	};

	// TODO: ESC in FF restores the last input, is a FF bug, https://bugzilla.mozilla.org/show_bug.cgi?id=598819
	td = document.createElement('td');
	td.appendChild(search);
	tr.appendChild(td);

	var searchNext = document.createElement('button');
	searchNext.title = '下一个 (Enter)';
	searchNext.className = 'jsoneditor-search-next';
	searchNext.onclick = function () {
		searchBox.next();
	};
	td = document.createElement('td');
	td.appendChild(searchNext);
	tr.appendChild(td);

	var searchPrevious = document.createElement('button');
	searchPrevious.title = '上一个 (Shift+Enter)';
	searchPrevious.className = 'jsoneditor-search-previous';
	searchPrevious.onclick = function () {
		searchBox.previous();
	};
	td = document.createElement('td');
	td.appendChild(searchPrevious);
	tr.appendChild(td);

};

/**
 * 转到下一个搜索结果
 * Go to the next search result
 */
JSONEditor.SearchBox.prototype.next = function () {
	if (this.results != undefined) {
		var index = (this.resultIndex != undefined) ? this.resultIndex + 1 : 0;
		if (index > this.results.length - 1) {
			index = 0;
		}
		this.setActiveResult(index);
	}
};

/**
 * 转到上一个搜索结果
 * 
 * Go to the prevous search result
 */
JSONEditor.SearchBox.prototype.previous = function () {
	if (this.results != undefined) {
		var max = this.results.length - 1;
		var index = (this.resultIndex != undefined) ? this.resultIndex - 1 : max;
		if (index < 0) {
			index = max;
		}
		this.setActiveResult(index);
	}
};

/**
 * 为当前活动结果设置新值
 * Set new value for the current active result
 * @param {Number} index
 */
JSONEditor.SearchBox.prototype.setActiveResult = function (index) {
	// de-activate current active result
	if (this.activeResult) {
		var prevNode = this.activeResult.node;
		var prevElem = this.activeResult.elem;
		if (prevElem == 'field') {
			delete prevNode.searchFieldActive;
		} else {
			delete prevNode.searchValueActive;
		}
		prevNode.updateDom();
	}

	if (!this.results || !this.results[index]) {
		// out of range, set to undefined
		this.resultIndex = undefined;
		this.activeResult = undefined;
		return;
	}

	this.resultIndex = index;

	// set new node active
	var node = this.results[this.resultIndex].node;
	var elem = this.results[this.resultIndex].elem;
	if (elem == 'field') {
		node.searchFieldActive = true;
	} else {
		node.searchValueActive = true;
	}
	this.activeResult = this.results[this.resultIndex];
	node.updateDom();

	node.scrollTo();
};

/**
 * 将焦点设置为当前活动的结果。如果目前没有
 * 有效结果，下一个搜索结果将获得焦点
 * 
 * Set the focus to the currently active result. If there is no currently
 * active result, the next search result will get focus
 */
JSONEditor.SearchBox.prototype.focusActiveResult = function () {
	if (!this.activeResult) {
		this.next();
	}

	if (this.activeResult) {
		this.activeResult.node.focus(this.activeResult.elem);
	}
};

/**
 * *取消任何正在运行的onDelayedSearch。
 * 
 * Cancel any running onDelayedSearch.
 */
JSONEditor.SearchBox.prototype.clearDelay = function () {
	if (this.timeout != undefined) {
		clearTimeout(this.timeout);
		delete this.timeout;
	}
};

/**
 * 启动计时器以在短暂延迟后执行搜索。
 * 用于在键入时减少搜索次数。
 * 
 * Start a timer to execute a search after a short delay.
 * Used for reducing the number of searches while typing.
 * @param {Event} event
 */
JSONEditor.SearchBox.prototype.onDelayedSearch = function (event) {
	// execute the search after a short delay (reduces the number of
	// search actions while typing in the search text box)
	this.clearDelay();
	var searchBox = this;
	this.timeout = setTimeout(function (event) {
		searchBox.onSearch(event);
	},
	this.delay);
};

/**
 * 处理onSearch事件
 * 
 * Handle onSearch event
 * @param {Event} event
 * @param {boolean} [forceSearch]  If true, search will be executed again even
 *                                 when the search text is not changed.
 *                                 Default is false.
 */
JSONEditor.SearchBox.prototype.onSearch = function (event, forceSearch) {
	this.clearDelay();

	var value = this.dom.search.value;
	var text = (value.length > 0) ? value : undefined;
	if (text != this.lastText || forceSearch) {
		// only search again when changed
		this.lastText = text;
		this.results = this.editor.search(text);
		this.setActiveResult(undefined);

		// display search results
		if (text != undefined) {
			var resultCount = this.results.length;
			switch (resultCount) {
				case 0:
					this.dom.results.innerHTML = '区块/值未找到';
					break;
				default:
					this.dom.results.innerHTML = '找到&nbsp;' + resultCount + '&nbsp;个结果';
					break;
			}
		} else {
			this.dom.results.innerHTML = '';
		}
	}
};

/**
 * 在输入框中处理onKeyDown事件
 * 
 * Handle onKeyDown event in the input box
 * @param {Event} event
 */
JSONEditor.SearchBox.prototype.onKeyDown = function (event) {
	event = event || window.event;
	var keynum = event.which || event.keyCode;
	if (keynum == 27) { // ESC
		this.dom.search.value = ''; // clear search
		this.onSearch(event);
		JSONEditor.Events.preventDefault(event);
		JSONEditor.Events.stopPropagation(event);
	} else if (keynum == 13) { // Enter
		if (event.ctrlKey) {
			// force to search again
			this.onSearch(event, true);
		} else if (event.shiftKey) {
			// move to the previous search result
			this.previous();
		} else {
			// move to the next search result
			this.next();
		}
		JSONEditor.Events.preventDefault(event);
		JSONEditor.Events.stopPropagation(event);
	}
};

/**
 * 在输入框中处理onKeyUp事件
 * 
 * Handle onKeyUp event in the input box
 * @param {Event} event
 */
JSONEditor.SearchBox.prototype.onKeyUp = function (event) {
	event = event || window.event;
	var keynum = event.which || event.keyCode;
	if (keynum != 27 && keynum != 13) { // !ESC and !Enter
		this.onDelayedSearch(event); // For IE 8
	}
};

// create namespace for event methods
JSONEditor.Events = {};

/**
 * 添加和事件监听器。适用于所有浏览器
 * 
 * Add and event listener. Works for all browsers
 * @param {Element}     element    An html element
 * @param {string}      action     The action, for example "click",
 *                                 without the prefix "on"
 * @param {function}    listener   The callback function to be executed
 * @param {boolean}     useCapture
 * @return {function}   the created event listener
 */
JSONEditor.Events.addEventListener = function (element, action, listener, useCapture) {
	if (element.addEventListener) {
		if (useCapture === undefined) useCapture = false;

		if (action === "mousewheel" && navigator.userAgent.indexOf("Firefox") >= 0) {
			action = "DOMMouseScroll"; // For Firefox
		}

		element.addEventListener(action, listener, useCapture);
		return listener;
	} else {
		// IE browsers
		var f = function () {
			return listener.call(element, window.event);
		};
		element.attachEvent("on" + action, f);
		return f;
	}
};

/**
 * 从元素中删除事件侦听器
 * 
 * Remove an event listener from an element
 * @param {Element}  element   An html dom element
 * @param {string}   action    The name of the event, for example "mousedown"
 * @param {function} listener  The listener function
 * @param {boolean}  useCapture
 */
JSONEditor.Events.removeEventListener = function (element, action, listener, useCapture) {
	if (element.removeEventListener) {
		// non-IE browsers
		if (useCapture === undefined) useCapture = false;

		if (action === "mousewheel" && navigator.userAgent.indexOf("Firefox") >= 0) {
			action = "DOMMouseScroll"; // For Firefox
		}

		element.removeEventListener(action, listener, useCapture);
	} else {
		// IE browsers
		element.detachEvent("on" + action, listener);
	}
};


/**
 * 停止事件传播
 * 
 * Stop event propagation
 * @param {Event} event
 */
JSONEditor.Events.stopPropagation = function (event) {
	if (!event) event = window.event;

	if (event.stopPropagation) {
		event.stopPropagation(); // non-IE browsers
	} else {
		event.cancelBubble = true; // IE browsers
	}
};


/**
 * 如果事件可以取消，则取消该事件，而不停止事件的进一步传播。
 * 
 * Cancels the event if it is cancelable, without stopping further propagation of the event.
 * @param {Event} event
 */
JSONEditor.Events.preventDefault = function (event) {
	if (!event) event = window.event;

	if (event.preventDefault) {
		event.preventDefault(); // non-IE browsers
	} else {
		event.returnValue = false; // IE browsers
	}
};



/**
 * 检索DOM元素的绝对左值
 * 
 * Retrieve the absolute left value of a DOM element
 * @param {Element} elem    A dom element, for example a div
 * @return {Number} left    The absolute left position of this element
 *                          in the browser page.
 */
JSONEditor.getAbsoluteLeft = function (elem) {
	var left = 0;
	var body = document.body;
	while (elem != null && elem != body) {
		left += elem.offsetLeft;
		left -= elem.scrollLeft;
		elem = elem.offsetParent;
	}
	return left;
};

/**
 * 检索DOM元素的绝对顶值
 * 
 * Retrieve the absolute top value of a DOM element
 * @param {Element} elem    A dom element, for example a div
 * @return {Number} top    The absolute top position of this element
 *                          in the browser page.
 */
JSONEditor.getAbsoluteTop = function (elem) {
	var top = 0;
	var body = document.body;
	while (elem != null && elem != body) {
		top += elem.offsetTop;
		top -= elem.scrollTop;
		elem = elem.offsetParent;
	}
	return top;
};

/**
 * 将className添加到给定的元素样式
 * 
 * add a className to the given elements style
 * @param {Element} elem
 * @param {String} className
 */
JSONEditor.addClassName = function (elem, className) {
	var classes = elem.className.split(' ');
	if (classes.indexOf(className) == -1) {
		classes.push(className); // add the class to the array
		elem.className = classes.join(' ');
	}
};

/**
 * 将className添加到给定的元素样式
 * 
 * add a className to the given elements style
 * @param {Element} elem
 * @param {String} className
 */
JSONEditor.removeClassName = function (elem, className) {
	var classes = elem.className.split(' ');
	var index = classes.indexOf(className);
	if (index != -1) {
		classes.splice(index, 1); // remove the class from the array
		elem.className = classes.join(' ');
	}
};

/** 
 * 从div的内容中删除格式
 * div本身的格式不会被剥离，只能从其子节点中删除。
 * 
 * 
 * Strip the formatting from the contents of a div
 * the formatting from the div itself is not stripped, only from its childs.
 * @param {Element} divElement
 */
JSONEditor.stripFormatting = function (divElement) {
	var childs = divElement.childNodes;
	for (var i = 0, iMax = childs.length; i < iMax; i++) {
		var child = childs[i];

		// remove the style
		if (child.style) {
			// TODO: test if child.attributes does contain style
			child.removeAttribute('style');
		}

		// remove all attributes
		var attributes = child.attributes;
		if (attributes) {
			for (var j = attributes.length - 1; j >= 0; j--) {
				var attribute = attributes[j];
				if (attribute.specified == true) {
					child.removeAttribute(attribute.name);
				}
			}
		}

		// recursively strip childs
		JSONEditor.stripFormatting(child);
	}
};

/** 
 * 将焦点设置为可编辑div的末尾
 * 来自Nico Burns的代码
 * 
 * Set focus to the end of an editable div
 * code from Nico Burns
 * http://stackoverflow.com/users/140293/nico-burns
 * http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
 * @param {Element} contentEditableElement
 */
JSONEditor.setEndOfContentEditable = function (contentEditableElement) {
	var range, selection;
	if (document.createRange) { //Firefox, Chrome, Opera, Safari, IE 9+
		range = document.createRange(); //Create a range (a range is a like the selection but invisible)
		range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
		range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
		selection = window.getSelection(); //get the selection object (allows you to change selection)
		selection.removeAllRanges(); //remove any selections already made
		selection.addRange(range); //make the range you have just created the visible selection
	} else if (document.selection) { //IE 8 and lower
		range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
		range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
		range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
		range.select(); //Select the range (make it the visible selection
	}
};

/**
 * 
 * 获取HTML元素的内部文本（例如div元素）
 * 
 * Get the inner text of an HTML element (for example a div element)
 * @param {Element} element
 * @param {Object} [buffer]
 * @return {String} innerText
 */
JSONEditor.getInnerText = function (element, buffer) {
	var first = (buffer == undefined);
	if (first) {
		buffer = {
			'text': '',
			'flush': function () {
				var text = this.text;
				this.text = '';
				return text;
			},
			'set': function (text) {
				this.text = text;
			}
		};
	}

	// 文本节点
	// text node
	if (element.nodeValue) {
		return buffer.flush() + element.nodeValue;
	}

	// div或其他HTML元素
	// divs or other HTML elements
	if (element.hasChildNodes()) {
		var childNodes = element.childNodes;
		var innerText = '';

		for (var i = 0, iMax = childNodes.length; i < iMax; i++) {
			var child = childNodes[i];

			if (child.nodeName == 'DIV' || child.nodeName == 'P') {
				var prevChild = childNodes[i - 1];
				var prevName = prevChild ? prevChild.nodeName : undefined;
				if (prevName && prevName != 'DIV' && prevName != 'P' && prevName != 'BR') {
					innerText += '\n';
					buffer.flush();
				}
				innerText += JSONEditor.getInnerText(child, buffer);
				buffer.set('\n');
			} else if (child.nodeName == 'BR') {
				innerText += buffer.flush();
				buffer.set('\n');
			} else {
				innerText += JSONEditor.getInnerText(child, buffer);
			}
		}

		return innerText;
	} else {
		if (element.nodeName == 'P' && JSONEditor.getInternetExplorerVersion() != -1) {
			//在Internet Explorer上，带有hasChildNodes（）== false的<p>是
			//用新行渲染。注意一个<p>用
			// hasChildNodes（）== true呈现时没有换行
			//其他浏览器总是确保<p>中有一个<br>，
			//如果没有，<p>不会呈现新行

			// On Internet Explorer, a <p> with hasChildNodes()==false is
			// rendered with a new line. Note that a <p> with
			// hasChildNodes()==true is rendered without a new line
			// Other browsers always ensure there is a <br> inside the <p>,
			// and if not, the <p> does not render a new line
			return buffer.flush();
		}
	}

	// br or unknown
	return '';
};

/**
 * 返回Internet Explorer的版本或-1
 *（表示使用其他浏览器）。
 * 
 * Returns the version of Internet Explorer or a -1
 * (indicating the use of another browser).
 * Source: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx
 * @return {Number} Internet Explorer version, or -1 in case of an other browser
 */
JSONEditor._ieVersion = undefined;
JSONEditor.getInternetExplorerVersion = function () {
	if (JSONEditor._ieVersion == undefined) {
		var rv = -1; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null) {
				rv = parseFloat(RegExp.$1);
			}
		}

		JSONEditor._ieVersion = rv;
	}

	return JSONEditor._ieVersion;
};

JSONEditor.ieVersion = JSONEditor.getInternetExplorerVersion();

/**
 * 使用浏览器内置的解析器解析JSON。
 * 异常时，验证jsonString并抛出详细错误。
 * 
 * Parse JSON using the parser built-in in the browser.
 * On exception, the jsonString is validated and a detailed error is thrown.
 * @param {String} jsonString
 */
JSONEditor.parse = function (jsonString) {
	try {
		return JSON.parse(jsonString);
	} catch (err) {
		// get a detailed error message using validate
		var message = JSONEditor.validate(jsonString) || err;
		throw new Error(message);
	}
};

/**
 * 验证包含JSON对象的字符串
 * 此方法使用JSONLint验证String。如果没有JSONLint
 * 可用，使用浏览器的内置JSON解析器。
 * 
 * 
 * Validate a string containing a JSON object
 * This method uses JSONLint to validate the String. If JSONLint is not
 * available, the built-in JSON parser of the browser is used.
 * @param {String} jsonString   String with an (invalid) JSON object
 * @return {String | undefined} Returns undefined when the string is valid JSON,
 *                              returns a string with an error message when
 *                              the data is invalid
 */
JSONEditor.validate = function (jsonString) {
	var message = undefined;

	try {
		if (window.jsonlint) {
			window.jsonlint.parse(jsonString);
		} else {
			JSON.parse(jsonString);
		}
	} catch (err) {
		message = '<pre class="error">' + err.toString() + '</pre>';
		if (window.jsonlint) {
			message +=
				'<div id="by-jsonlint">由 <a class="error" href="http://zaach.github.com/jsonlint/" target="_blank">' +
				'JSONLint' +
				'</a> 提供验证.</div>';
		}
	}

	return message;
};