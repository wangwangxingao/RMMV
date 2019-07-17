//=============================================================================
// ww_fastsl.js
//=============================================================================

/*:
 * @name ww_fastsl
 * @plugindesc 读档存档
 * @author 汪汪
 * @version 1.0
 * 
 * 
 * @help
 * ww.fastsl.save(id)  保存
 * ww.fastsl.load(id)  读取
 * 
 */


var ww = ww || {};
ww.fastsl = ww.fastsl || {};
/**
 * 保存
 * @name ww.fastsl.save  
 * @description  保存存档
 * @param {number|string} saveid 保存id 
 * @returns {true|false}  返回值  
 * true 保存成功  
 * false 保存失败  
 * @example ww.fastsl.save(10)
 */
ww.fastsl.save = function (saveid) {
    $gameSystem.onBeforeSave();
    if (DataManager.saveGame(saveid)) {
        StorageManager.cleanBackup(saveid)
        return true
    }
    return false
}

/**
 * 读取
 * @name ww.fastsl.load 
 * @description  读取存档
 * @param {number|string} saveid 保存id 
 * @returns {true|false}  返回值  
 * true 读取成功  
 * false 读取失败  
 * @example ww.fastsl.load(10)
 */
ww.fastsl.load = function (saveid) {
    if (DataManager.loadGame(saveid)) {
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            $gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
            $gamePlayer.requestMapReload();
        }
        SceneManager.goto(Scene_Map);
        $gameSystem.onAfterLoad()
        return true
    }
    return false
}


/**
 * 删除
 * @name ww.fastsl.remove 
 * @description  删除存档
 * @param {number|string} saveid 保存id 
 * @returns {true|false}  返回值  
 * true 删除成功  
 * false 删除失败  
 * @example ww.fastsl.remove(10)
 */


ww.fastsl.remove = function (saveid) { 
    try {
        //存储管理器 删除(存档文件id)
        StorageManager.remove(saveid);
        var globalInfo = DataManager.loadGlobalInfo() || [];
        //全局信息[存档文件id] = 制作保存文件信息
        delete globalInfo[saveid] 
        //保存全局信息(全局信息) 
        DataManager.saveGlobalInfo(globalInfo);
        return true
        //如果错误(e2)
    } catch (e2) {
        return false
    }
};





