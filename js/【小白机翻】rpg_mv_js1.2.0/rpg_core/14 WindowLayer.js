
//-----------------------------------------------------------------------------
/**包含游戏窗口的层
 * The layer which contains game windows.
 * 窗口层
 * @class WindowLayer
 * @constructor
 */
function WindowLayer() {
    this.initialize.apply(this, arguments);
}

WindowLayer.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
WindowLayer.prototype.constructor = WindowLayer;
//初始化
WindowLayer.prototype.initialize = function() {
    PIXI.DisplayObjectContainer.call(this);
    this._width = 0;
    this._height = 0;
    this._tempCanvas = null;
    this._vertexBuffer = null;
    this._translationMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    this._dummySprite = new Sprite(new Bitmap(1, 1));
};

/**在窗口层的宽度
 * The width of the window layer in pixels.
 *
 * @property width
 * @type Number
 */
//定义属性 
Object.defineProperty(WindowLayer.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        this._width = value;
    },
    configurable: true
});

/**在窗口层中高度
 * The height of the window layer in pixels.
 *
 * @property height
 * @type Number
 */
//定义属性 
Object.defineProperty(WindowLayer.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        this._height = value;
    },
    configurable: true
});

/**设置X，Y，宽度和高度
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {Number} x The x coordinate of the window layer
 * @param {Number} y The y coordinate of the window layer
 * @param {Number} width The width of the window layer
 * @param {Number} height The height of the window layer
 */
WindowLayer.prototype.move = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

/**更新窗口层对于每一帧
 * Updates the window layer for each frame.
 *
 * @method update
 */
WindowLayer.prototype.update = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**给予画布
 * @method _renderCanvas
 * @param {Object} renderSession
 * @private
 */
WindowLayer.prototype._renderCanvas = function(renderSession) {
    if (!this.visible) {
        return;
    }

    if (!this._tempCanvas) {
        this._tempCanvas = document.createElement('canvas');
    }

    this._tempCanvas.width = Graphics.width;
    this._tempCanvas.height = Graphics.height;

    var realCanvasContext = renderSession.context;
    var context = this._tempCanvas.getContext('2d');

    context.save();
    context.clearRect(0, 0, Graphics.width, Graphics.height);
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.closePath();
    context.clip();

    renderSession.context = context;

    for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        if (child._isWindow && child.visible && child.openness > 0) {
            this._canvasClearWindowRect(renderSession, child);
            context.save();
            child._renderCanvas(renderSession);
            context.restore();
        }
    }

    context.restore();

    renderSession.context = realCanvasContext;
    renderSession.context.setTransform(1, 0, 0, 1, 0, 0);
    renderSession.context.globalCompositeOperation = 'source-over';
    renderSession.context.globalAlpha = 1;
    renderSession.context.drawImage(this._tempCanvas, 0, 0);

    for (var j = 0; j < this.children.length; j++) {
        if (!this.children[j]._isWindow) {
            this.children[j]._renderCanvas(renderSession);
        }
    }
};

/**画布清除窗口矩形
 * @method _canvasClearWindowRect
 * @param {Object} renderSession
 * @param {Window} window
 * @private
 */
WindowLayer.prototype._canvasClearWindowRect = function(renderSession, window) {
    var rx = this.x + window.x;
    var ry = this.y + window.y + window.height / 2 * (1 - window._openness / 255);
    var rw = window.width;
    var rh = window.height * window._openness / 255;
    renderSession.context.clearRect(rx, ry, rw, rh);
};

/**给予webgl
 * @method _renderWebGL
 * @param {Object} renderSession
 * @private
 */
WindowLayer.prototype._renderWebGL = function(renderSession) {
    if (!this.visible) {
        return;
    }

    var gl = renderSession.gl;

    if (!this._vertexBuffer) {
        this._vertexBuffer = gl.createBuffer();
    }

    this._dummySprite._renderWebGL(renderSession);

    renderSession.spriteBatch.stop();
    gl.enable(gl.STENCIL_TEST);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    this._webglMaskOutside(renderSession);
    renderSession.spriteBatch.start();

    for (var i = this.children.length - 1; i >= 0; i--) {
        var child = this.children[i];
        if (child._isWindow && child.visible && child.openness > 0) {
            gl.stencilFunc(gl.EQUAL, 0, 0xFF);
            child._renderWebGL(renderSession);
            renderSession.spriteBatch.stop();
            this._webglMaskWindow(renderSession, child);
            renderSession.spriteBatch.start();
        }
    }

    gl.disable(gl.STENCIL_TEST);

    for (var j = 0; j < this.children.length; j++) {
        if (!this.children[j]._isWindow) {
            this.children[j]._renderWebGL(renderSession);
        }
    }
};

/**webgl遮蔽外面
 * @method _webglMaskOutside
 * @param {Object} renderSession
 * @private
 */
WindowLayer.prototype._webglMaskOutside = function(renderSession) {
    var x1 = this.x;
    var y1 = this.y;
    var x2 = this.x + this.width;
    var y2 = this.y + this.height;
    this._webglMaskRect(renderSession, 0, 0, Graphics.width, y1);
    this._webglMaskRect(renderSession, 0, y2, Graphics.width, Graphics.height - y2);
    this._webglMaskRect(renderSession, 0, 0, x1, Graphics.height);
    this._webglMaskRect(renderSession, x2, 0, Graphics.width - x2, Graphics.height);
};

/**webgl遮蔽窗口
 * @method _webglMaskWindow
 * @param {Object} renderSession
 * @param {Window} window
 * @private
 */
WindowLayer.prototype._webglMaskWindow = function(renderSession, window) {
    var rx = this.x + window.x;
    var ry = this.y + window.y + window.height / 2 * (1 - window._openness / 255);
    var rw = window.width;
    var rh = window.height * window._openness / 255;
    this._webglMaskRect(renderSession, rx, ry, rw, rh);
};

/**webgl遮蔽矩形
 * @method _webglMaskRect
 * @param {Object} renderSession
 * @param {Number} x
 * @param {Number} y
 * @param {Number} w
 * @param {Number} h
 * @private
 */
WindowLayer.prototype._webglMaskRect = function(renderSession, x, y, w, h) {
    if (w > 0 && h > 0) {
        var gl = renderSession.gl;

        var projection = renderSession.projection;
        var offset = renderSession.offset;
        var shader = renderSession.shaderManager.primitiveShader;

        renderSession.shaderManager.setShader(shader);

        gl.uniformMatrix3fv(shader.translationMatrix, false, this._translationMatrix);
        gl.uniform1f(shader.flipY, 1);
        gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
        gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);

        gl.stencilFunc(gl.EQUAL, 0, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

        var data = new Float32Array([x, y, x+w, y, x, y+h, x, y+h, x+w, y, x+w, y+h]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(shader.aVertexPosition);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    }
};

// The important members from Pixi.js
//Pixi.js的重要成员

/**窗口层的x坐标
 * The x coordinate of the window layer.
 *
 * @property x
 * @type Number
 */

/**窗口层的y坐标
 * The y coordinate of the window layer.
 *
 * @property y
 * @type Number
 */

/**[只读]窗口层子项的数组
 * [read-only] The array of children of the window layer.
 *
 * @property children
 * @type Array
 */

/**[只读]包含窗口层的对象
 * [read-only] The object that contains the window layer.
 *
 * @property parent
 * @type Object
 */

/**容器增加子项
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 */

/**添加一个子项到容器中指定索引处
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 */

/**从容器中删除一个子项
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 */

/**从指定索引位置的删除一个子项
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 */

