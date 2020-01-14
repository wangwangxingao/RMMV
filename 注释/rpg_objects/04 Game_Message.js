
/**-----------------------------------------------------------------------------  
 * Game_Message  
 * 游戏消息   $gameMessage  
 * The game object class for the state of the message window that displays text  
 * or selections, etc.  
 * 显示文本,选项或其他 消息窗口 的游戏数据类
 * */

function Game_Message() {
    this.initialize.apply(this, arguments);
}
/**初始化*/
Game_Message.prototype.initialize = function() {
	//清除
    this.clear();
};
/**清除*/
Game_Message.prototype.clear = function() {
	//文本组 = []
    this._texts = [];
    //选择组 = []
    this._choices = [];
    //脸图名称 = ''
    this._faceName = '';
    //脸图索引 = 0
    this._faceIndex = 0;
    //背景 = 0 
    this._background = 0;
    //位置种类 = 2
    this._positionType = 2;
    //选择默认种类 = 0
    this._choiceDefaultType = 0;
    //选择取消种类 = 0 
    this._choiceCancelType = 0;
    //选择背景 = 0
    this._choiceBackground = 0;
    //选择位置种类 = 2
    this._choicePositionType = 2;
    //数字输入变量id = 0
    this._numInputVariableId = 0;
    //数字输入位数 = 0 
    this._numInputMaxDigits = 0;
    //物品选择变量id = 0
    this._itemChoiceVariableId = 0;
    //物品选择种类id = 0
    this._itemChoiceItypeId = 0;
    //滚动模式 = false 
    this._scrollMode = false;
    //滚动速度 = 2
    this._scrollSpeed = 2;
    //滚动不快速 = false
    this._scrollNoFast = false;
    //选择呼叫返回 = null 
    this._choiceCallback = null;
};
/**选择组
 * @return {[String]}
*/
Game_Message.prototype.choices = function() {
	//选择组
    return this._choices;
};
/**脸图名称
 * @return {string}
*/
Game_Message.prototype.faceName = function() {
    //返回 脸图名称
    return this._faceName;
};
/**脸图索引
 * @return {number}
*/
Game_Message.prototype.faceIndex = function() {
    //返回 脸图索引
    return this._faceIndex;
};
/**背景
 * @return {string} 
*/
Game_Message.prototype.background = function() {
    //返回 背景
    return this._background;
};
/**位置种类
 * @return {number} 
*/
Game_Message.prototype.positionType = function() {
    //返回 位置种类
    return this._positionType;
};
/**选择默认种类
 * @return {number} 
*/
Game_Message.prototype.choiceDefaultType = function() {
    //返回 选择默认种类
    return this._choiceDefaultType;
};
/**选择取消种类
 * @return {number} 
*/ 
Game_Message.prototype.choiceCancelType = function() {
    //返回 选择取消种类
    return this._choiceCancelType;
};
/**选择背景
 * @return {string} 
 * 
*/
Game_Message.prototype.choiceBackground = function() {
    //返回 选择背景
    return this._choiceBackground;
};
/**选择位置种类
 * @return {number} 
 * 
*/
Game_Message.prototype.choicePositionType = function() {
    //返回 选择位置种类
    return this._choicePositionType;
};
/**数字输入变量id
 * @return {number} 
 * 
*/
Game_Message.prototype.numInputVariableId = function() {
    //返回 数字输入变量id
    return this._numInputVariableId;
};
/**数字输入最大位数
 * @return {number} 
 * 
*/
Game_Message.prototype.numInputMaxDigits = function() {
    //返回 数字输入最大位数
    return this._numInputMaxDigits;
};
/**物品选择变量id
 * @return {number}  
*/
Game_Message.prototype.itemChoiceVariableId = function() {
    //返回 物品选择变量id
    return this._itemChoiceVariableId;
};
/**物品选择种类id
 * @return {number}  
*/
Game_Message.prototype.itemChoiceItypeId = function() {
    //返回 物品选择种类id
    return this._itemChoiceItypeId;
};
/**滚动方式
 * @return {boolean} 
*/
Game_Message.prototype.scrollMode = function() {
    //返回 滚动方式
    return this._scrollMode;
};
/**滚动速度
 * @return {number}  
*/
Game_Message.prototype.scrollSpeed = function() {
    //返回 滚动速度
    return this._scrollSpeed;
};
/**滚动不快速
 * @return {number}  
*/
Game_Message.prototype.scrollNoFast = function() {
	//返回 滚动不快速
    return this._scrollNoFast;
};
/**添加
 * @param {string} 
 * 
*/
Game_Message.prototype.add = function(text) {
	//文本组 添加(文本)
    this._texts.push(text);
};
/**设置脸图
 * @param {string} faceName 脸图名称
 * @param {number} faceIndex 脸图索引
*/
Game_Message.prototype.setFaceImage = function(faceName, faceIndex) {
	//脸图名称 =  faceName//脸图名称
    this._faceName = faceName;
    //脸图索引 = faceIndex//脸图索引
    this._faceIndex = faceIndex;
};
/**设置背景
 * @param {string} background 背景 
*/
Game_Message.prototype.setBackground = function(background) {
	//背景 = background//背景
    this._background = background;
};
/**设置位置种类*/
Game_Message.prototype.setPositionType = function(positionType) {
	//位置种类 = positionType//位置种类
    this._positionType = positionType;
};
/**设置选择组*/
Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
	//选择组 = choices//选择组
    this._choices = choices;
    //选择默认种类 = defaultType//默认种类
    this._choiceDefaultType = defaultType;
    //选择取消种类 = cancelType//取消种类
    this._choiceCancelType = cancelType;
};
/**设置选择背景*/
Game_Message.prototype.setChoiceBackground = function(background) {
	//选择背景 = background//背景
    this._choiceBackground = background;
};
/**设置选择位置种类*/
Game_Message.prototype.setChoicePositionType = function(positionType) {
	//选择位置种类 = positionType//位置种类
    this._choicePositionType = positionType;
};
/**设置数字输入*/
Game_Message.prototype.setNumberInput = function(variableId, maxDigits) {
    //数字输入变量id = variableId//变量id
    this._numInputVariableId = variableId;
    //数字输入最大位数 = maxDigits//最大位数
    this._numInputMaxDigits = maxDigits;
};
/**设置物品选择*/
Game_Message.prototype.setItemChoice = function(variableId, itemType) {
    //物品选择变量id = variableId//变量id
    this._itemChoiceVariableId = variableId;
    //物品选择种类id = itemType//物品种类
    this._itemChoiceItypeId = itemType;
};
/**设置滚动*/
Game_Message.prototype.setScroll = function(speed, noFast) {
	//滚动模式 = true 
    this._scrollMode = true;
    //滚动速度 = speed//速度
    this._scrollSpeed = speed;
    //滚动不快速 = noFast//不快速
    this._scrollNoFast = noFast;
};
/**设置选择呼叫返回*/
Game_Message.prototype.setChoiceCallback = function(callback) {
    //选择呼叫返回 = callback//呼叫返回
    this._choiceCallback = callback;
};
/**当选择*/
Game_Message.prototype.onChoice = function(n) {
    //如果 (选择呼叫返回)
    if (this._choiceCallback) {
	    //选择呼叫返回(n)
        this._choiceCallback(n);
        //选择呼叫返回 = null
        this._choiceCallback = null;
    }
};
/**有文本*/
Game_Message.prototype.hasText = function() {
	//返回 文本组 长度 > 0 
    return this._texts.length > 0;
};
/**是选择*/
Game_Message.prototype.isChoice = function() {
	//返回 选择组 长度 > 0
    return this._choices.length > 0;
};
/**是数字输入*/
Game_Message.prototype.isNumberInput = function() {
	//返回 数字输入变量id > 0
    return this._numInputVariableId > 0;
};
/**是物品选择*/
Game_Message.prototype.isItemChoice = function() {
    //返回 物品选择变量id > 0
    return this._itemChoiceVariableId > 0;
};
/**是忙碌*/
Game_Message.prototype.isBusy = function() {
	//返回 有文本 或者 是选择 或者 是数字输入 或者 是物品选择
    return (this.hasText() || this.isChoice() ||
            this.isNumberInput() || this.isItemChoice());
};
/**新页*/
Game_Message.prototype.newPage = function() {
	//如果 文本组 长度 > 0 
    if (this._texts.length > 0) {
	    //文本组[文本组 长度 - 1 ] += "\f"
        this._texts[this._texts.length - 1] += '\f';
    }
};
/**所有文本
 * @returns {string} 所有文本
*/
Game_Message.prototype.allText = function() {
    return this._texts.join('\n');
};
