//=============================================================================
// SaveVer.js
//=============================================================================

/*:
 * @plugindesc 存档版本修改
 * @author wangwang 
 * 
 * @param SaveVer
 * @desc 插件的版本(不是游戏的版本)
 * @default 0.01
 * 
 * @param ver
 * @desc 版本 ,没有设置时不修改
 * @default 0.01
 *
 * @param changeMap
 * @desc 数组,版本不同时,包含的id的map会重置事件
 * @default []
 *  
 * @param changeActor
 * @desc 布尔值,版本不同时,角色会重置技能,并卸下不能使用的装备
 * @default true
 * 
 * @help
 * 最初版. 001
 * 
 * 额,不知道会有什么问题,需要测试...
 *  
 */
(function () {
    SaveVer = {}
    SaveVer.get = function () {
        var parse = function (i, type) {
            try {
                if (type) {
                    return i
                }
                return JSON.parse(i)
            } catch (e) {
                return i
            }
        }
        var parameters = PluginManager._parameters['SaveVer'];
        if (parameters) {
        } else {
            var pls = PluginManager._parameters
            for (var n in pls) {
                if (pls[n] && ("SaveVer" in pls[n])) {
                    parameters = pls[n]
                }
            }
        }
        parameters = parameters || {}
        SaveVer.changeMap = parse(parameters['changeMap'] || "[]" ) || []
        SaveVer.changeActor = parse(parameters['changeActor'] || "false") || false
        SaveVer.saveid = parameters['ver'] || ""
    }
    SaveVer.get()

    SaveVer.save = function (contents) {
        contents.saveid = this.saveid
        return contents
    }
    SaveVer.load = function (contents) {
        if (this.saveid && (contents.saveid != this.saveid)) {
            if (this.changeActor) {
                contents.actors._data.forEach(function (actor, id) {

                    if (actor) {
                        actor.initSkills();
                        actor.releaseUnequippableItems(false);
                    }

                })
            }
            var map = contents.map
            var id = map._mapId
            if (Array.isArray(this.changeMap) && (this.changeMap.indexOf(id) >= 0)) {
                map._interpreter = new Game_Interpreter()
                map.setupEvents()
            }
        }
        return contents
    }
    DataManager.makeSaveContents0 = DataManager.makeSaveContents
    //制作保存内容
    DataManager.makeSaveContents = function () {
        var contents = DataManager.makeSaveContents0()
        var contents = SaveVer.save(contents)
        //返回 内容
        return contents;
    };
    DataManager.extractSaveContents0 = DataManager.extractSaveContents
    //提取保存内容
    DataManager.extractSaveContents = function (contents) {
        var contents = SaveVer.load(contents)
        DataManager.extractSaveContents0(contents)
    };
})()