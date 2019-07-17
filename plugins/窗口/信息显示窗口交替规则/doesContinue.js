/**
 * 设置后面有显示文本时窗口交替模式
 * 
 * ww.doesContinue.type = 0 
 * 窗口关闭后才会开启 
 * 
 * ww.doesContinue.type = 1
 * 窗口会立刻开启 
 * 
 * ww.doesContinue.type = 2
 * 窗口根据原版设置处理
 * 如果有文本,且不是横向模式且不是位置改变时,立刻开启,否则等待关闭
 * 
 * 
 * */


var ww = ww || {}
ww.doesContinue = {}
ww.doesContinue.type = 0
 

Window_Message.prototype.doesContinue = function () {
    if (ww.doesContinue.type == 1) {
        return true
    } else if (ww.doesContinue.type == 2) {
        return ($gameMessage.hasText() && !$gameMessage.scrollMode() &&
            !this.areSettingsChanged());
    } else {
        return false
    }
};