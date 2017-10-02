/**-----------------------------------------------------------------------------*/
/** Game_System*/
/** 游戏系统   $gameSystem */
/** The game object class for the system data.*/
/** 游戏系统数据的游戏对象类*/

function Game_System() {
    this.initialize.apply(this, arguments);
}
/**初始化*/
Game_System.prototype.initialize = function() {
    //保存启用 = true
    this._saveEnabled = true;
    //菜单启用 = true
    this._menuEnabled = true;
    //遭遇启用 = true
    this._encounterEnabled = true;
    //编队启用 = true
    this._formationEnabled = true;
    //战斗计数 = 0 
    this._battleCount = 0;
    //胜利计数 = 0
    this._winCount = 0;
    //逃跑计数 = 0
    this._escapeCount = 0;
    //保存计数 = 0
    this._saveCount = 0;
    //版本id = 0 
    this._versionId = 0;
    //帧数当保存 = 0
    this._framesOnSave = 0;
    //bgm当保存 = null
    this._bgmOnSave = null;
    //bgs当保存 = null
    this._bgsOnSave = null;
    //窗口色调 = null
    this._windowTone = null;
    //战斗bgm = null
    this._battleBgm = null;
    //胜利me = null
    this._victoryMe = null;
    //失败me = null
    this._defeatMe = null;
    //保存bgm = null
    this._savedBgm = null;
    //行走bgm = null
    this._walkingBgm = null;
};
/**是日语
 * @return {boolean}
 */
Game_System.prototype.isJapanese = function() {
    //返回 数据系统 区域 存在 ja
    return $dataSystem.locale.match(/^ja/);
};
/**是中文
 * @return {boolean}
 */
Game_System.prototype.isChinese = function() {
    //返回 数据系统 区域 存在 zh
    return $dataSystem.locale.match(/^zh/);
};
/**是韩语
 * @return {boolean}
 */
Game_System.prototype.isKorean = function() {
    //返回 数据系统 区域 存在 ko
    return $dataSystem.locale.match(/^ko/);
};
/**是中文日文韩文
 * @return {boolean}
 */
Game_System.prototype.isCJK = function() {
    //返回 数据系统 区域 存在 ja 或 zh 或 ko 
    return $dataSystem.locale.match(/^(ja|zh|ko)/);
};
/**是俄语
 * @return {boolean}
 */
Game_System.prototype.isRussian = function() {
    //返回 数据系统 区域 存在 ru
    return $dataSystem.locale.match(/^ru/);
};
/**是侧视
 * @return {boolean}
 */
Game_System.prototype.isSideView = function() {
    //返回 数据系统 侧视
    return $dataSystem.optSideView;
};
/**是启用保存
 * @return {boolean}
 */
Game_System.prototype.isSaveEnabled = function() {
    //返回 保存启用
    return this._saveEnabled;
};
/**禁止保存*/
Game_System.prototype.disableSave = function() {
    //保存启用 = false
    this._saveEnabled = false;
};
/**启用保存*/
Game_System.prototype.enableSave = function() {
    //保存启用 = true
    this._saveEnabled = true;
};
/**是启用菜单
 * @return {boolean}
 */
Game_System.prototype.isMenuEnabled = function() {
    //返回 菜单启用
    return this._menuEnabled;
};
/**禁止菜单*/
Game_System.prototype.disableMenu = function() {
    //菜单启用 = false
    this._menuEnabled = false;
};
/**启用菜单*/
Game_System.prototype.enableMenu = function() {
    //菜单启用 = true
    this._menuEnabled = true;
};
/**是启用遭遇
 * @return {boolean}
 */
Game_System.prototype.isEncounterEnabled = function() {
    //返回 遭遇启用
    return this._encounterEnabled;
};
/**禁止遭遇*/
Game_System.prototype.disableEncounter = function() {
    //遭遇启用 = false
    this._encounterEnabled = false;
};
/**启用遭遇*/
Game_System.prototype.enableEncounter = function() {
    //遭遇启用 = true
    this._encounterEnabled = true;
};
/**是启用编队
 * @return {boolean}
 */
Game_System.prototype.isFormationEnabled = function() {
    //返回 编队启用
    return this._formationEnabled;
};
/**禁止编队*/
Game_System.prototype.disableFormation = function() {
    //编队启用 = false
    this._formationEnabled = false;
};
/**启用编队*/
Game_System.prototype.enableFormation = function() {
    //编队启用 = true
    this._formationEnabled = true;
};
/**战斗计数
 * @return {number}
 */
Game_System.prototype.battleCount = function() {
    //返回 战斗计数
    return this._battleCount;
};
/**胜利计数
 * @return {number}
 */
Game_System.prototype.winCount = function() {
    //返回 胜利计数
    return this._winCount;
};
/**逃跑计数
 * @return {number}
 */
Game_System.prototype.escapeCount = function() {
    //返回 逃跑计数
    return this._escapeCount;
};
/**保存计数 
 * @return {number}
 */
Game_System.prototype.saveCount = function() {
    //返回 保存计数
    return this._saveCount;
};
/**版本id 
 * @return {number}
 */
Game_System.prototype.versionId = function() {
    //返回 版本id
    return this._versionId;
};
/**窗口色调
 * @return {[number]}
 */
Game_System.prototype.windowTone = function() {
    //返回 窗口色调 或者 数据系统 窗口色调
    return this._windowTone || $dataSystem.windowTone;
};
/**设置窗口色调
 * @param {[number]} value 值色调数组
 */
Game_System.prototype.setWindowTone = function(value) {
    //窗口色调 = value
    this._windowTone = value;
};
/**战斗bgm
 * @return {{}}  
 */
Game_System.prototype.battleBgm = function() {
    //返回 战斗bgm 或者 数据系统 战斗bgm
    return this._battleBgm || $dataSystem.battleBgm;
};
/**设置战斗bgm
 * @param {{}}  value bgm值
 * 
 */
Game_System.prototype.setBattleBgm = function(value) {
    //战斗bgm = value
    this._battleBgm = value;
};
/**胜利me
 * @return {{}}
 */
Game_System.prototype.victoryMe = function() {
    //返回 胜利me 或者 数据系统 胜利me
    return this._victoryMe || $dataSystem.victoryMe;
};
/**设置胜利me
 * @param {{}} value  
 */
Game_System.prototype.setVictoryMe = function(value) {
    //胜利me = value
    this._victoryMe = value;
};
/**失败me
 * @return {{}} 
 */
Game_System.prototype.defeatMe = function() {
    //返回 失败me 或者 数据系统 失败me
    return this._defeatMe || $dataSystem.defeatMe;
};
/**设置失败me
 * @param {{}} value    
 */
Game_System.prototype.setDefeatMe = function(value) {
    //失败me = value
    this._defeatMe = value;
};
/**当战斗开始*/
Game_System.prototype.onBattleStart = function() {
    //战斗计数++
    this._battleCount++;
};
/**当战斗胜利*/
Game_System.prototype.onBattleWin = function() {
    //胜利计数++
    this._winCount++;
};
/**当战斗逃跑*/
Game_System.prototype.onBattleEscape = function() {
    //逃跑计数 ++
    this._escapeCount++;
};
/**当保存之前*/
Game_System.prototype.onBeforeSave = function() {
    //保存计数 ++
    this._saveCount++;
    //版本id = 数据系统 版本id
    this._versionId = $dataSystem.versionId;
    //帧数当保存 =  图形 帧计数
    this._framesOnSave = Graphics.frameCount;
    //bgm当保存 =  音频管理器 保存bgm
    this._bgmOnSave = AudioManager.saveBgm();
    //bgs当保存 =  音频管理器 保存bgs
    this._bgsOnSave = AudioManager.saveBgs();
};
/**当读取以后*/
Game_System.prototype.onAfterLoad = function() {
    //图形 帧计数 =  帧数当保存
    Graphics.frameCount = this._framesOnSave;
    //音频管理器 播放bgm(bgm当保存) 
    AudioManager.playBgm(this._bgmOnSave);
    //音频管理器 播放bgs(bgs当保存) 
    AudioManager.playBgs(this._bgsOnSave);
};
/**游戏时间
 * @return {number}
 */
Game_System.prototype.playtime = function() {
    //返回 向下取整( 图形 帧计数  / 60 ) 
    return Math.floor(Graphics.frameCount / 60);
};
/**播放时间文本
 * @return {string} 
 */
Game_System.prototype.playtimeText = function() {
    // Math.floor  小于等于 x，且与 x 最接近的整数  (向下取整)
    //小时 = 向下取整 (游戏时间 除 60 除 60)
    var hour = Math.floor(this.playtime() / 60 / 60);
    //分钟 = 向下取整 ( (游戏时间 除 60 ) 除 60 的 余数 )
    var min = Math.floor(this.playtime() / 60) % 60;
    //秒 = 游戏时间 除 60 的余数
    var sec = this.playtime() % 60;
    //返回 小时( 填充0(2位) ) + ":" + 分钟( 填充0(2位) )  + ":" + 秒( 填充0(2位) )  
    return hour.padZero(2) + ':' + min.padZero(2) + ':' + sec.padZero(2);
};
/**保存bgm*/
Game_System.prototype.saveBgm = function() {
    //保存bgm = 音频管理器 保存bgm
    this._savedBgm = AudioManager.saveBgm();
};
/**重播bgm*/
Game_System.prototype.replayBgm = function() {
    //如果 保存bgm (保存bgm存在)
    if (this._savedBgm) {
        //音频管理器 重播bgm (保存bgm)
        AudioManager.replayBgm(this._savedBgm);
    }
};
/**保存行走bgm*/
Game_System.prototype.saveWalkingBgm = function() {
    //行走bgm = 音频管理器 保存bgm
    this._walkingBgm = AudioManager.saveBgm();
};
/**重播行走bgm*/
Game_System.prototype.replayWalkingBgm = function() {
    //如果 行走bgm (行走bgm存在)
    if (this._walkingBgm) {
        //音频管理器 播放bgm (行走bgm)
        AudioManager.playBgm(this._walkingBgm);
    }
};