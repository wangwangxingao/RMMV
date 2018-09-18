//=============================================================================
//  2w_menuAddLoad.js
//=============================================================================

/*:
 * @plugindesc  
 * 2w_menuAddLoad ,菜单添加读取 
 * @author wangwang
 *   
 * @param  2w_menuAddLoad
 * @desc 插件 菜单添加读取 ,作者:汪汪
 * @default 汪汪
 * 
 * 
 * @help
 *   
 *  
 * 
 */




 (function () {

    var ww = ww || {}; 
    ww.menuAddLoad = {}; 
    ww.menuAddLoad.addSaveCommand = Window_MenuCommand.prototype.addSaveCommand;
    Window_MenuCommand.prototype.addSaveCommand = function () {
        ww.menuAddLoad.addSaveCommand.call(this)
        this.addCommand(TextManager.continue_, 'load', true); 
    }; 
    ww.menuAddLoad.createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        ww.menuAddLoad.createCommandWindow.call(this)
        this._commandWindow.setHandler('load', this.commandLoad.bind(this)); 
    }; 

    Scene_Menu.prototype.commandLoad = function () {
        SceneManager.push(Scene_Load);
    }; 
}
)()