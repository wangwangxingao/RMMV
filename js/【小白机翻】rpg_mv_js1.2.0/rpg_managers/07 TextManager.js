
//-----------------------------------------------------------------------------
// TextManager
// 文本管理器
// The static class that handles terms and messages.
// 这个静态的类 操作 术语 和 消息

function TextManager() {
    throw new Error('This is a static class');
}
//基本
TextManager.basic = function(basicId) {
	//数据系统 术语 基本[基本id]
    return $dataSystem.terms.basic[basicId] || '';
};
//参数
TextManager.param = function(paramId) {
	//数据系统 术语 参数[参数id]
    return $dataSystem.terms.params[paramId] || '';
};
//命令
TextManager.command = function(commandId) {
	//数据系统 术语 命令[命令id]
    return $dataSystem.terms.commands[commandId] || '';
};
//消息
TextManager.message = function(messageId) {
	//数据系统 术语 消息[消息id]
    return $dataSystem.terms.messages[messageId] || '';
};
//获得者
TextManager.getter = function(method, param) {
    return {
        get: function() {
            return this[method](param);
        },
        configurable: true
    };
};
//定义属性 货币单位
Object.defineProperty(TextManager, 'currencyUnit', {
    get: function() { return $dataSystem.currencyUnit; },
    configurable: true
});
//定义属性 见数据库
Object.defineProperties(TextManager, {
    level           : TextManager.getter('basic', 0),
    levelA          : TextManager.getter('basic', 1),
    hp              : TextManager.getter('basic', 2),
    hpA             : TextManager.getter('basic', 3),
    mp              : TextManager.getter('basic', 4),
    mpA             : TextManager.getter('basic', 5),
    tp              : TextManager.getter('basic', 6),
    tpA             : TextManager.getter('basic', 7),
    exp             : TextManager.getter('basic', 8),
    expA            : TextManager.getter('basic', 9),
    fight           : TextManager.getter('command', 0),
    escape          : TextManager.getter('command', 1),
    attack          : TextManager.getter('command', 2),
    guard           : TextManager.getter('command', 3),
    item            : TextManager.getter('command', 4),
    skill           : TextManager.getter('command', 5),
    equip           : TextManager.getter('command', 6),
    status          : TextManager.getter('command', 7),
    formation       : TextManager.getter('command', 8),
    save            : TextManager.getter('command', 9),
    gameEnd         : TextManager.getter('command', 10),
    options         : TextManager.getter('command', 11),
    weapon          : TextManager.getter('command', 12),
    armor           : TextManager.getter('command', 13),
    keyItem         : TextManager.getter('command', 14),
    equip2          : TextManager.getter('command', 15),
    optimize        : TextManager.getter('command', 16),
    clear           : TextManager.getter('command', 17),
    newGame         : TextManager.getter('command', 18),
    continue_       : TextManager.getter('command', 19),
    toTitle         : TextManager.getter('command', 21),
    cancel          : TextManager.getter('command', 22),
    buy             : TextManager.getter('command', 24),
    sell            : TextManager.getter('command', 25),
    alwaysDash      : TextManager.getter('message', 'alwaysDash'),
    commandRemember : TextManager.getter('message', 'commandRemember'),
    bgmVolume       : TextManager.getter('message', 'bgmVolume'),
    bgsVolume       : TextManager.getter('message', 'bgsVolume'),
    meVolume        : TextManager.getter('message', 'meVolume'),
    seVolume        : TextManager.getter('message', 'seVolume'),
    possession      : TextManager.getter('message', 'possession'),
    expTotal        : TextManager.getter('message', 'expTotal'),
    expNext         : TextManager.getter('message', 'expNext'),
    saveMessage     : TextManager.getter('message', 'saveMessage'),
    loadMessage     : TextManager.getter('message', 'loadMessage'),
    file            : TextManager.getter('message', 'file'),
    //队伍名
    partyName       : TextManager.getter('message', 'partyName'),
    //出现
    emerge          : TextManager.getter('message', 'emerge'),
    //先发制人
    preemptive      : TextManager.getter('message', 'preemptive'),
    //突然袭击
    surprise        : TextManager.getter('message', 'surprise'),
    //逃跑开始
    escapeStart     : TextManager.getter('message', 'escapeStart'),
    //逃跑失败
    escapeFailure   : TextManager.getter('message', 'escapeFailure'),
    //胜利
    victory         : TextManager.getter('message', 'victory'),
    //失败
    defeat          : TextManager.getter('message', 'defeat'),
    //获得经验值			
    obtainExp       : TextManager.getter('message', 'obtainExp'),
    //获得金钱
    obtainGold      : TextManager.getter('message', 'obtainGold'),
    //获得道具
    obtainItem      : TextManager.getter('message', 'obtainItem'),
    //等级提高
    levelUp         : TextManager.getter('message', 'levelUp'),
    //获得技能
    obtainSkill     : TextManager.getter('message', 'obtainSkill'),
    //使用道具 
    useItem         : TextManager.getter('message', 'useItem'),
    //会心对敌人
    criticalToEnemy : TextManager.getter('message', 'criticalToEnemy'),
    //会心对角色
    criticalToActor : TextManager.getter('message', 'criticalToActor'),
    //角色伤害
    actorDamage     : TextManager.getter('message', 'actorDamage'),
    //角色恢复
    actorRecovery   : TextManager.getter('message', 'actorRecovery'),
    //角色获得
    actorGain       : TextManager.getter('message', 'actorGain'),
    //角色失去
    actorLoss       : TextManager.getter('message', 'actorLoss'),
    //角色吸收
    actorDrain      : TextManager.getter('message', 'actorDrain'),
    //角色无伤害
    actorNoDamage   : TextManager.getter('message', 'actorNoDamage'),
    //角色未命中
    actorNoHit      : TextManager.getter('message', 'actorNoHit'),
    //敌人伤害
    enemyDamage     : TextManager.getter('message', 'enemyDamage'),
    //敌人恢复
    enemyRecovery   : TextManager.getter('message', 'enemyRecovery'),
    //敌人获得
    enemyGain       : TextManager.getter('message', 'enemyGain'),
    //敌人失去
    enemyLoss       : TextManager.getter('message', 'enemyLoss'),
    //敌人吸收
    enemyDrain      : TextManager.getter('message', 'enemyDrain'),
    //敌人无伤害
    enemyNoDamage   : TextManager.getter('message', 'enemyNoDamage'),
    //敌人未命中
    enemyNoHit      : TextManager.getter('message', 'enemyNoHit'),
    //闪避
    evasion         : TextManager.getter('message', 'evasion'),
    //魔法闪避 
    magicEvasion    : TextManager.getter('message', 'magicEvasion'),
    //魔法反射
    magicReflection : TextManager.getter('message', 'magicReflection'),
    //反击
    counterAttack   : TextManager.getter('message', 'counterAttack'),
    //替代
    substitute      : TextManager.getter('message', 'substitute'),
    //正面效果添加
    buffAdd         : TextManager.getter('message', 'buffAdd'),
    //减益效果添加
    debuffAdd       : TextManager.getter('message', 'debuffAdd'),
    //效果移除
    buffRemove      : TextManager.getter('message', 'buffRemove'),
    //动作失败
    actionFailure   : TextManager.getter('message', 'actionFailure'),
});
