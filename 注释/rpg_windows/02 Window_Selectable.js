/**----------------------------------------------------------------------------- */
/** Window_Selectable */
/** 窗口选择 */
/** The window class with cursor movement and scroll functions. */
/** 光标活动和滚动方法的窗口类 */

function Window_Selectable() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Window_Selectable.prototype = Object.create(Window_Base.prototype);
/**设置创造者 */
Window_Selectable.prototype.constructor = Window_Selectable;
/**初始化 */
Window_Selectable.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._index = -1;
    this._cursorFixed = false;
    this._cursorAll = false;
    this._stayCount = 0;
    this._helpWindow = null;
    this._handlers = {};
    this._touching = false;
    this._scrollX = 0;
    this._scrollY = 0;
    this.deactivate();
};
/**索引 */
Window_Selectable.prototype.index = function() {
    //返回 _index 
    return this._index;
};
/**光标固定 */
Window_Selectable.prototype.cursorFixed = function() {
    //返回  _cursorFixed
    return this._cursorFixed;
};
/**设置光标固定 */
Window_Selectable.prototype.setCursorFixed = function(cursorFixed) {
    // 光标固定 _cursorFixed  = cursorFixed (true , false)
    this._cursorFixed = cursorFixed;
};
/**光标所有 */
Window_Selectable.prototype.cursorAll = function() {
    //返回 _cursorAll 光标所有
    return this._cursorAll;
};
/**设置光标所有 */
Window_Selectable.prototype.setCursorAll = function(cursorAll) {
    // 光标所有 _cursorAll = cursorAll  (true , false)
    this._cursorAll = cursorAll;
};
/**最大列数 */
Window_Selectable.prototype.maxCols = function() {
    return 1;
};
/**最大项目数 */
Window_Selectable.prototype.maxItems = function() {
    return 0;
};
/**间距 */
Window_Selectable.prototype.spacing = function() {
    return 12;
};
/**项目宽 */
Window_Selectable.prototype.itemWidth = function() {
    /** 示意: 去填充后, 项目3个 间隔2个, 加间隔 ,除列数,得 项目宽 + 间隔 
     *
     *  [                   宽                      ]
     *  [填充][项目宽][间距][项目宽][间距][项目宽][填充]
     *
     */
    // (宽 - 填充* 2 + 间距 ) /  最大列数  - 间距
    return Math.floor((this.width - this.padding * 2 +
        this.spacing()) / this.maxCols() - this.spacing());
};
/**项目高 */
Window_Selectable.prototype.itemHeight = function() {
    //行高
    return this.lineHeight();
};
/**最大行数 */
Window_Selectable.prototype.maxRows = function() {
    //(   (最大项目数/最大列数)向上取整 , 1 )之间最大的
    return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
};
/**使活动 */
Window_Selectable.prototype.activate = function() {
    //使用 Window_Base 里 使活动 的方法
    Window_Base.prototype.activate.call(this);
    //重选
    this.reselect();
};
/**使不活动 */
Window_Selectable.prototype.deactivate = function() {
    //窗口基础 不活动 呼叫(this)
    Window_Base.prototype.deactivate.call(this);
    //重新
    this.reselect();
};
/**选择 */
Window_Selectable.prototype.select = function(index) {
    // _索引 = index
    this._index = index;
    //停留计数 = 0 
    this._stayCount = 0;
    //确定光标可见
    this.ensureCursorVisible();
    //更新光标
    this.updateCursor();
    //呼叫更新帮助
    this.callUpdateHelp();
};
/**取消选择 */
Window_Selectable.prototype.deselect = function() {
    //选择(-1)
    this.select(-1);
};
/**重选 */
Window_Selectable.prototype.reselect = function() {
    //选择  _index
    this.select(this._index);
};
/**行  (从0开始)
 * @return {number}
 *  */
Window_Selectable.prototype.row = function() {
    //返回 数学 向下取整( 索引()/最大列数())
    return Math.floor(this.index() / this.maxCols());
};
/**顶部行 */
Window_Selectable.prototype.topRow = function() {
    //返回 数学 向下取整(滚动y / 项目高())
    return Math.floor(this._scrollY / this.itemHeight());
};
/**最大顶部行 
 * 
 *  示意 : 最大行数 7 ,最大页行数 3 
 * 0
 * 1
 * 2
 * 3  
 * 4  0 最大顶部行
 * 5  0
 * 6  0 
 * 
 * 
 */
Window_Selectable.prototype.maxTopRow = function() {
    //返回  数学 较大值 (0  , 最大行数() - 最大页行数())  
    return Math.max(0, this.maxRows() - this.maxPageRows());
};
/**设置顶部行 */
Window_Selectable.prototype.setTopRow = function(row) {
    // 滚动y =  row(0 - 最大顶部行)之间的 * 项目高
    var scrollY = row.clamp(0, this.maxTopRow()) * this.itemHeight();
    //如果  滚动y  !== 滚动y  
    if (this._scrollY !== scrollY) {
        // 滚动y = 滚动y
        this._scrollY = scrollY;
        //刷新()
        this.refresh();
        //更新光标()
        this.updateCursor();
    }
};
/**重新滚动 */
Window_Selectable.prototype.resetScroll = function() {
    //设置顶部行(0)
    this.setTopRow(0);
};
/**最大页行数 */
Window_Selectable.prototype.maxPageRows = function() {
    // 页高 = 高- 填充 *2
    var pageHeight = this.height - this.padding * 2;
    //页高/项目高
    return Math.floor(pageHeight / this.itemHeight());
};
/**最大页项目 */
Window_Selectable.prototype.maxPageItems = function() {
    //最大页行数 * 最大列数
    return this.maxPageRows() * this.maxCols();
};
/**是水平 */
Window_Selectable.prototype.isHorizontal = function() {
    //返回 最大页行数 === 1 (只有一行)
    return this.maxPageRows() === 1;
};
/**底部行 */
Window_Selectable.prototype.bottomRow = function() {
    /*  示意 : 顶部行 2 ,最大页行数 3
    0
    1 
    2 0 顶部行   2  , 2 + 3 - 1 = 4 
    3 0 
    4 0 底部行   4  , 4 - (3 - 1) = 2
    5 
    */
    // (0 , 顶部行 + 最大页行数 -1)最大的
    return Math.max(0, this.topRow() + this.maxPageRows() - 1);
};
/**设置底部行 */
Window_Selectable.prototype.setBottomRow = function(row) {
    //设置顶部行(row - (页行数 - 1) )
    this.setTopRow(row - (this.maxPageRows() - 1));
};
/**顶部索引 */
Window_Selectable.prototype.topIndex = function() {
    /**示例 : 最大列 3
     *  [0]  0 1 2 
     *  [1]  3 4 5
     *  [2]  6 7 8
     *  [3]  9
     */
    //返回 顶部行*最大列
    return this.topRow() * this.maxCols();
};
/**项目矩形 */
Window_Selectable.prototype.itemRect = function(index) {
    //设置新矩形
    var rect = new Rectangle();
    //最大列数 
    var maxCols = this.maxCols();
    //矩形宽 = 项目宽
    rect.width = this.itemWidth();
    //矩形高 = 项目高
    rect.height = this.itemHeight();
    //矩形x =  索引 % 最大列数  * (矩形 宽 + 间隔() ) - 滚动x
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    //矩形y =  索引/ 最大列数  * 矩形高 - 滚动y
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
    //返回矩形
    return rect;
};
/**项目矩形为了文本 */
Window_Selectable.prototype.itemRectForText = function(index) {
    //矩形
    var rect = this.itemRect(index);
    //矩形x + 文本填充
    rect.x += this.textPadding();
    //矩形宽 - 2 文本填充
    rect.width -= this.textPadding() * 2;
    /* 示例: 
     *   [               矩形              ]
     *   [文本填充][     文本    ][文本填充]
     */
    //返回矩形
    return rect;
};
/**设置帮助窗口 */
Window_Selectable.prototype.setHelpWindow = function(helpWindow) {
    //帮助窗口 __helpWindow = helpWindow
    this._helpWindow = helpWindow;
    //呼叫更新帮助
    this.callUpdateHelp();
};
/**显示帮助窗口 */
Window_Selectable.prototype.showHelpWindow = function() {
    //如果帮助窗口存在
    if (this._helpWindow) {
        //帮助窗口显示
        this._helpWindow.show();
    }
};
/**隐藏帮助窗口 */
Window_Selectable.prototype.hideHelpWindow = function() {
    //如果帮助窗口存在
    if (this._helpWindow) {
        //帮助窗口显示
        this._helpWindow.hide();
    }
};
/**设置处理 */
Window_Selectable.prototype.setHandler = function(symbol, method) {
    // 处理组[ symbol//符号] = method//方法
    this._handlers[symbol] = method;
};
/**是处理 */
Window_Selectable.prototype.isHandled = function(symbol) {
    //返回 !! 处理组[ symbol//符号]
    return !!this._handlers[symbol];
};
/**呼叫处理 */
Window_Selectable.prototype.callHandler = function(symbol) {
    //如果 处理组[symbol//符号] 存在
    if (this.isHandled(symbol)) {
        //运行 _handlers[symbol]
        this._handlers[symbol]();
    }
};
/**是打开和活动的 */
Window_Selectable.prototype.isOpenAndActive = function() {
    //返回 (是打开() 并且 活动)
    return this.isOpen() && this.active;
};
/**是光标能移动 */
Window_Selectable.prototype.isCursorMovable = function() {
    //返回  (是打开和活动的() 并且 不是 光标固定 并且 不是 光标所有 并且 最大项目数() > 0)
    return (this.isOpenAndActive() && !this._cursorFixed &&
        !this._cursorAll && this.maxItems() > 0);
};
/**光标下 */
Window_Selectable.prototype.cursorDown = function(wrap) {
    //索引()
    var index = this.index();
    //最大项目()
    var maxItems = this.maxItems();
    //最大列()
    var maxCols = this.maxCols();
    //如果 索引小于 最大项目数-最大列数 或 (wrap 和 最大列 == 1)
    //   最大列数 3 最大项目数 7 
    //   0 1 2 
    //   3 4 5 
    //   6
    // 索引号 小于 4
    //   所以就是 下面有项目 时,或者  只有一列时
    if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
        //选择 (索引 + 最大列) 除 最大项目数 的余数
        //向下一行  ,只有一列时循环
        this.select((index + maxCols) % maxItems);
    }
};

/**光标上 */
Window_Selectable.prototype.cursorUp = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    //如果 索引 大于等于 最大项目数-最大列数 或 (wrap 和 最大列 == 1)
    //  最大列数 3 最大项目数 7 
    //   0 1 2 
    //   3 4 5 
    //   6
    //  索引号 大于等于 3
    //所以就是 上面有项目 时,或者  只有一列时
    if (index >= maxCols || (wrap && maxCols === 1)) {
        //选择 (索引 - 最大列 + 最大项目数) 除 最大项目数的 余数
        //向上一行  ,只有一列时循环
        this.select((index - maxCols + maxItems) % maxItems);
    }
};
/**光标右 */
Window_Selectable.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    if (maxCols >= 2 && (index < maxItems - 1 || (wrap && this.isHorizontal()))) {
        this.select((index + 1) % maxItems);
    }
};
/**光标左 */
Window_Selectable.prototype.cursorLeft = function(wrap) {
    //索引
    var index = this.index();
    //最大项目数
    var maxItems = this.maxItems();
    //最大列数
    var maxCols = this.maxCols();
    // 最大列数 >=2  并且 (索引>0 或  ( wrap 并且 是水平的) )
    if (maxCols >= 2 && (index > 0 || (wrap && this.isHorizontal()))) {
        //选择 (索引-1 + 最大项目数) 除最大项目数 的余数
        this.select((index - 1 + maxItems) % maxItems);
    }
};
/**光标下页 */
Window_Selectable.prototype.cursorPagedown = function() {
    var index = this.index();
    var maxItems = this.maxItems();
    if (this.topRow() + this.maxPageRows() < this.maxRows()) {
        this.setTopRow(this.topRow() + this.maxPageRows());
        this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
    }
};
/**光标上页 */
Window_Selectable.prototype.cursorPageup = function() {
    var index = this.index();
    if (this.topRow() > 0) {
        this.setTopRow(this.topRow() - this.maxPageRows());
        this.select(Math.max(index - this.maxPageItems(), 0));
    }
};
/**滚动下 */
Window_Selectable.prototype.scrollDown = function() {
    if (this.topRow() + 1 < this.maxRows()) {
        this.setTopRow(this.topRow() + 1);
    }
};
/**滚动上 */
Window_Selectable.prototype.scrollUp = function() {
    if (this.topRow() > 0) {
        this.setTopRow(this.topRow() - 1);
    }
};
/**更新 */
Window_Selectable.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    //更新箭头
    this.updateArrows();
    //处理光标移动
    this.processCursorMove();
    //处理处理者
    this.processHandling();
    //处理滚轮
    this.processWheel();
    //处理触摸
    this.processTouch();
    //停留计数
    this._stayCount++;
};
/**更新箭头 */
Window_Selectable.prototype.updateArrows = function() {
    var topRow = this.topRow();
    var maxTopRow = this.maxTopRow();
    this.downArrowVisible = maxTopRow > 0 && topRow < maxTopRow;
    this.upArrowVisible = topRow > 0;
};
/**进行光标移动 */
Window_Selectable.prototype.processCursorMove = function() {
    //如果光标能移动
    if (this.isCursorMovable()) {
        //最后的索引
        var lastIndex = this.index();
        //是重复 down
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        //是重复 up
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        //是重复 right
        if (Input.isRepeated('right')) {
            this.cursorRight(Input.isTriggered('right'));
        }
        //是重复 left
        if (Input.isRepeated('left')) {
            //光标左
            this.cursorLeft(Input.isTriggered('left'));
        }
        //是pagedown处理者 不存在并且按下 pagedown
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        //是pageup处理者不存在并且按下 pageup
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        //如果 索引 不等于 最后的索引
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};
/**进行处理者 */
Window_Selectable.prototype.processHandling = function() {
    //如果 是打开和活动的
    if (this.isOpenAndActive()) {
        //如果 是允许确定 并且 是 确定触发的
        if (this.isOkEnabled() && this.isOkTriggered()) {
            //进行确定
            this.processOk();
            //如果 是允许取消 并且 是 取消触发的
        } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
            //进行取消
            this.processCancel();
            //如果 是处理者pagedown  并且 是 pagedown 按下
        } else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.processPagedown();
            //如果 是处理者pageup存在  并且 是 pageup 按下
        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.processPageup();
        }
    }
};
/**进行滚动 */
Window_Selectable.prototype.processWheel = function() {
    //是打开和活动的
    if (this.isOpenAndActive()) {
        //临界值=20
        var threshold = 20;
        //如果滚轮y >= 临界
        if (TouchInput.wheelY >= threshold) {
            this.scrollDown();
        }
        //如果滚轮y <= -临界
        if (TouchInput.wheelY <= -threshold) {
            this.scrollUp();
        }
    }
};
/**进行触摸 */
Window_Selectable.prototype.processTouch = function() {
    //如果 是打开和活动的
    if (this.isOpenAndActive()) {
        //触摸输入按下 并且在框内
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            //触摸=true
            this._touching = true;
            //当触摸
            this.onTouch(true);
            //如果 触摸是取消
        } else if (TouchInput.isCancelled()) {
            //是取消允许
            if (this.isCancelEnabled()) {
                //进行取消
                this.processCancel();
            }
        }
        //如果 触摸
        if (this._touching) {
            //如果 是按下
            if (TouchInput.isPressed()) {
                //当触摸
                this.onTouch(false);
            } else {
                //触摸 _touching =false
                this._touching = false;
            }
        }
    } else {
        //触摸 _touching =false
        this._touching = false;
    }
};
/**是触摸内部框 */
Window_Selectable.prototype.isTouchedInsideFrame = function() {
    //x=局部x
    var x = this.canvasToLocalX(TouchInput.x);
    //y=局部y
    var y = this.canvasToLocalY(TouchInput.y);
    //返回 x,y 在框内
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};
/**当触摸 */
Window_Selectable.prototype.onTouch = function(triggered) {
    var lastIndex = this.index();
    //局部x
    var x = this.canvasToLocalX(TouchInput.x);
    //局部y
    var y = this.canvasToLocalY(TouchInput.y);
    //点击索引 = 点击测试(x,y)
    var hitIndex = this.hitTest(x, y);
    //如果 点击索引
    if (hitIndex >= 0) {
        //点击索引 === 索引
        if (hitIndex === this.index()) {
            //  triggered 并且 是允许触摸
            if (triggered && this.isTouchOkEnabled()) {
                //进行确定
                this.processOk();
            }
            //如果 是光标移动允许
        } else if (this.isCursorMovable()) {
            //选择 点击索引
            this.select(hitIndex);
        }
        //如果 停留时间 >= 10
    } else if (this._stayCount >= 10) {
        // y< 填充
        if (y < this.padding) {
            //光标上
            this.cursorUp();
            // y>= 高-填充
        } else if (y >= this.height - this.padding) {
            //光标下
            this.cursorDown();
        }
    }
    //索引 !== 最后的索引
    if (this.index() !== lastIndex) {
        //播放光标
        SoundManager.playCursor();
    }
};
/**点击测试 */
Window_Selectable.prototype.hitTest = function(x, y) {
    //如果是内容区域(x,y)
    if (this.isContentsArea(x, y)) {
        //cx= x - 填充
        var cx = x - this.padding;
        //cy= y - 填充
        var cy = y - this.padding;
        //顶部索引
        var topIndex = this.topIndex();
        //循环在0-最大页项目
        for (var i = 0; i < this.maxPageItems(); i++) {
            //索引
            var index = topIndex + i;
            //如果索引小于最大项目数
            if (index < this.maxItems()) {
                //索引项目的矩形
                var rect = this.itemRect(index);
                //右侧
                var right = rect.x + rect.width;
                //底部
                var bottom = rect.y + rect.height;
                //cx cy 在矩形中
                if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
                    //返回索引
                    return index;
                }
            }
        }
    }
    //返回-1
    return -1;
};
/**是内容区域 */
Window_Selectable.prototype.isContentsArea = function(x, y) {
    //左=填充
    var left = this.padding;
    //上=填充
    var top = this.padding;
    //右= 宽-填充
    var right = this.width - this.padding;
    //底= 高-填充
    var bottom = this.height - this.padding;
    //在窗口内
    return (x >= left && y >= top && x < right && y < bottom);
};
/**是触摸能够确定 */
Window_Selectable.prototype.isTouchOkEnabled = function() {
    //是确定允许
    return this.isOkEnabled();
};
/**是能够确定 */
Window_Selectable.prototype.isOkEnabled = function() {
    //返回 是处理者ok
    return this.isHandled('ok');
};
/**是能够取消 */
Window_Selectable.prototype.isCancelEnabled = function() {
    //返回 是处理者cancel
    return this.isHandled('cancel');
};
/**是确定触发 */
Window_Selectable.prototype.isOkTriggered = function() {
    //是重复 ok
    return Input.isRepeated('ok');
};
/**是取消触发 */
Window_Selectable.prototype.isCancelTriggered = function() {
    //是重复cancel
    return Input.isRepeated('cancel');
};
/**进行 确定 */
Window_Selectable.prototype.processOk = function() {
    //是当前项目允许
    if (this.isCurrentItemEnabled()) {
        //播放确定声音
        this.playOkSound();
        //更新输入数据
        this.updateInputData();
        //解除活动
        this.deactivate();
        //呼叫确定处理者
        this.callOkHandler();
    } else {
        //播放蜂鸣器声音
        this.playBuzzerSound();
    }
};
/**播放 确定声音 */
Window_Selectable.prototype.playOkSound = function() {
    //播放确定声音
    SoundManager.playOk();
};
/**播放蜂鸣器声音 */
Window_Selectable.prototype.playBuzzerSound = function() {
    //播放蜂鸣器声音
    SoundManager.playBuzzer();
};
/**呼叫确定处理 */
Window_Selectable.prototype.callOkHandler = function() {
    //呼叫处理者ok
    this.callHandler('ok');
};
/**进行取消 */
Window_Selectable.prototype.processCancel = function() {
    //播放取消
    SoundManager.playCancel();
    //更新输入数据
    this.updateInputData();
    //解除活动
    this.deactivate();
    //呼叫取消处理
    this.callCancelHandler();
};
/**呼叫取消处理 */
Window_Selectable.prototype.callCancelHandler = function() {
    //呼叫处理者cancel
    this.callHandler('cancel');
};
/**进行上页 */
Window_Selectable.prototype.processPageup = function() {
    //播放光标
    SoundManager.playCursor();
    //更新输入数据
    this.updateInputData();
    //解除活动
    this.deactivate();
    //呼叫处理pageup
    this.callHandler('pageup');
};
/**进行下页 */
Window_Selectable.prototype.processPagedown = function() {
    //播放光标
    SoundManager.playCursor();
    //更新输入数据
    this.updateInputData();
    //解除活动
    this.deactivate();
    //呼叫处理pagedown
    this.callHandler('pagedown');
};
/**更新输入数据 */
Window_Selectable.prototype.updateInputData = function() {
    //输入更新
    Input.update();
    //触摸输入更新
    TouchInput.update();
};
/**更新光标 */
Window_Selectable.prototype.updateCursor = function() {
    //如果光标所有
    if (this._cursorAll) {
        //所有行高 = 最大行数 * 项目高
        var allRowsHeight = this.maxRows() * this.itemHeight();
        //设置光标矩形(0,0,内容宽,所有行高)
        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
        //设置顶部行(0)
        this.setTopRow(0);
    } else if (this.isCursorVisible()) {
        //矩形 = 项目矩形(索引)
        var rect = this.itemRect(this.index());
        //设置光标矩形(矩形x,矩形y,矩形宽,矩形高)
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        //设置光标(0,0,0,0)
        this.setCursorRect(0, 0, 0, 0);
    }
};
/**是光标可见 */
Window_Selectable.prototype.isCursorVisible = function() {
    //行
    var row = this.row();
    //返回  行>= 顶部行 并且 行 <=底部行
    return row >= this.topRow() && row <= this.bottomRow();
};
/**确定光标可见 */
Window_Selectable.prototype.ensureCursorVisible = function() {
    //行 = 行()
    var row = this.row();
    //如果( 行<顶部行())
    if (row < this.topRow()) {
        //设置顶部行(行)
        this.setTopRow(row);
        //否则 如果( 行>底部行())
    } else if (row > this.bottomRow()) {
        //设置底部行(行)
        this.setBottomRow(row);
    }
};
/**呼叫 更新帮助 */
Window_Selectable.prototype.callUpdateHelp = function() {
    //如果( 活动 并且 帮助窗口)
    if (this.active && this._helpWindow) {
        //更新帮助窗口()
        this.updateHelp();
    }
};
/**更新帮助 */
Window_Selectable.prototype.updateHelp = function() {
    //帮助窗口 清除()
    this._helpWindow.clear();
};
/**设置帮助窗口项目 */
Window_Selectable.prototype.setHelpWindowItem = function(item) {
    //如果(帮助窗口)
    if (this._helpWindow) {
        //帮助窗口设置(项目)
        this._helpWindow.setItem(item);
    }
};
/**是当前项目允许 */
Window_Selectable.prototype.isCurrentItemEnabled = function() {
    //返回 true
    return true;
};
/**绘制所有项目 */
Window_Selectable.prototype.drawAllItems = function() {
    //topIndex = 顶部索引()
    var topIndex = this.topIndex();
    //循环 (开始时 i = 0 ; 当 i < 最大页项目数 ;每次 i++ )
    for (var i = 0; i < this.maxPageItems(); i++) {
        //索引 = 头索引 + i
        var index = topIndex + i;
        //如果(索引<最大项目数())
        if (index < this.maxItems()) {
            //绘制项目(索引)
            this.drawItem(index);
        }
    }
};
/**绘制项目 */
Window_Selectable.prototype.drawItem = function(index) {};
/**清除项目 */
Window_Selectable.prototype.clearItem = function(index) {
    //矩形 = 项目矩形(索引)
    var rect = this.itemRect(index);
    //内容 清除矩形(矩形 x ,矩形 y ,矩形 宽 , 矩形 高)
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
};
/**重绘项目 */
Window_Selectable.prototype.redrawItem = function(index) {
    //如果(索引>=0)
    if (index >= 0) {
        //清除项目(索引)
        this.clearItem(index);
        //绘制项目(索引)
        this.drawItem(index);
    }
};
/**重绘当前项目 */
Window_Selectable.prototype.redrawCurrentItem = function() {
    //重绘项目( 索引() )
    this.redrawItem(this.index());
};
/**刷新 */
Window_Selectable.prototype.refresh = function() {
    //如果(内容)
    if (this.contents) {
        //内容 清除()
        this.contents.clear();
        //绘制所有项目组()
        this.drawAllItems();
    }
};