
//-----------------------------------------------------------------------------
// SoundManager
// 声音管理器
// The static class that plays sound effects defined in the database.
// 这个静态的类 定义 数据库 播放 声音 效果

function SoundManager() {
    throw new Error('This is a static class');
}
//预加载重要的声音
SoundManager.preloadImportantSounds = function() {
    this.loadSystemSound(0);
    this.loadSystemSound(1);
    this.loadSystemSound(2);
    this.loadSystemSound(3);
};
//加载系统声音
SoundManager.loadSystemSound = function(n) {
    if ($dataSystem) {
        AudioManager.loadStaticSe($dataSystem.sounds[n]);
    }
};
//播放系统声音
SoundManager.playSystemSound = function(n) {
    if ($dataSystem) {
        AudioManager.playStaticSe($dataSystem.sounds[n]);
    }
};
//播放指针
SoundManager.playCursor = function() {
    this.playSystemSound(0);
};
//播放确定
SoundManager.playOk = function() {
    this.playSystemSound(1);
};
//播放取消
SoundManager.playCancel = function() {
    this.playSystemSound(2);
};
//播放蜂鸣器
SoundManager.playBuzzer = function() {
    this.playSystemSound(3);
};
//播放装备
SoundManager.playEquip = function() {
    this.playSystemSound(4);
};
//播放保存
SoundManager.playSave = function() {
    this.playSystemSound(5);
};
//播放读取
SoundManager.playLoad = function() {
    this.playSystemSound(6);
};
//播放战斗开始
SoundManager.playBattleStart = function() {
    this.playSystemSound(7);
};
//播放逃跑
SoundManager.playEscape = function() {
    this.playSystemSound(8);
};
//播放敌人攻击
SoundManager.playEnemyAttack = function() {
    this.playSystemSound(9);
};
//播放敌人伤害
SoundManager.playEnemyDamage = function() {
    this.playSystemSound(10);
};
//播放敌人死亡
SoundManager.playEnemyCollapse = function() {
    this.playSystemSound(11);
};
//播放boss死亡1
SoundManager.playBossCollapse1 = function() {
    this.playSystemSound(12);
};
//播放boss死亡2
SoundManager.playBossCollapse2 = function() {
    this.playSystemSound(13);
};
//播放角色伤害
SoundManager.playActorDamage = function() {
    this.playSystemSound(14);
};
//播放角色死亡
SoundManager.playActorCollapse = function() {
    this.playSystemSound(15);
};
//播放恢复
SoundManager.playRecovery = function() {
    this.playSystemSound(16);
};
//播放未击中
SoundManager.playMiss = function() {
    this.playSystemSound(17);
};
//播放闪避
SoundManager.playEvasion = function() {
    this.playSystemSound(18);
};
//播放魔法闪避
SoundManager.playMagicEvasion = function() {
    this.playSystemSound(19);
};
//播放魔法反射
SoundManager.playReflection = function() {
    this.playSystemSound(20);
};
//播放商店
SoundManager.playShop = function() {
    this.playSystemSound(21);
};
//播放使用物品
SoundManager.playUseItem = function() {
    this.playSystemSound(22);
};
//播放使用技能
SoundManager.playUseSkill = function() {
    this.playSystemSound(23);
};
