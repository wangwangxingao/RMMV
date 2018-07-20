/**对话基础 */
function Sprite_UITalkBase() {
    this.initialize.apply(this, arguments);
}


Sprite_UITalkBase.prototype = Object.create(Sprite.prototype);
Sprite_UITalkBase.prototype.constructor = Sprite_UITalkBase;

Sprite_UITalkBase.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this)
    this._openness = 0
    this.visible = false
    this._opening = false;
    this._closing = false;
    this.close()
};


/**是打开的 */
Sprite_UITalkBase.prototype.isOpen = function () {
    return this._openness >= 255;
};

/**是关闭的 */
Sprite_UITalkBase.prototype.isClosed = function () {
    return this._openness <= 0;
};
/**更新 */
Sprite_UITalkBase.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateOpen();
    this.updateClose();
};



/**更新打开 */
Sprite_UITalkBase.prototype.updateOpen = function () {
    if (this._opening) {
        this._openness += 32;
        if (this.isOpen()) {
            this._opening = false;
            this.onOpen()
        }
    }
};
/**更新关闭 */
Sprite_UITalkBase.prototype.updateClose = function () {
    if (this._closing) {
        this._openness -= 32;
        if (this.isClosed()) {
            this._closing = false;
            this.onClose()
        }
    }
};
/**打开 */
Sprite_UITalkBase.prototype.open = function () {
    if (!this.isOpen()) {
        this._opening = true;
    }
    this._closing = false;
};
/**关闭 */
Sprite_UITalkBase.prototype.close = function () {
    if (!this.isClosed()) {
        this._closing = true;
    }
    this._opening = false;
};

/**快速打开 */
Sprite_UITalkBase.prototype.openFast = function () {
    if (!this.isOpen()) {
        this._opening = true;
        this._openness = 255
    }
    this._closing = false;
};
/**快速关闭 */
Sprite_UITalkBase.prototype.closeFast = function () {
    if (!this.isClosed()) {
        this._closing = true;
        this._openness = 0
    }
    this._opening = false;
};


/**是打开中 */
Sprite_UITalkBase.prototype.isOpening = function () {
    return this._opening;
};
/**是关闭中 */
Sprite_UITalkBase.prototype.isClosing = function () {
    return this._closing;
};

/**当打开后 */
Sprite_UITalkBase.prototype.onOpen = function () {
    this.visible = true
};
/**当关闭后 */
Sprite_UITalkBase.prototype.onClose = function () {
    this.visible = false
};


