//=============================================================================
// debug.js
//=============================================================================

/*:
 * @plugindesc 可以通过腾讯邮箱的邮我发送信息
 * @author wangwang  
 * @version  1.0
 * 
 * @help
 * 在游戏bug时显示出出问题的js位置
 * 
 * 
 *
 **/ 
SceneManager.catchException = function(e) {
    if (e instanceof Error) { 
    Graphics.printError(e.toString(), e.stack.toString());
        console.error(e.stack);
    } else {
        Graphics.printError('UnknownError', e);
    }
    AudioManager.stopAll();
    this.stop();
};