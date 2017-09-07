
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
    //等级
    level           : TextManager.getter('basic', 0),
    //等级缩写
    levelA          : TextManager.getter('basic', 1),
    //hp
    hp              : TextManager.getter('basic', 2),
    //hp缩写
    hpA             : TextManager.getter('basic', 3),
    //mp
    mp              : TextManager.getter('basic', 4),
    //mp缩写
    mpA             : TextManager.getter('basic', 5),
    //tp
    tp              : TextManager.getter('basic', 6),
    //tp缩写
    tpA             : TextManager.getter('basic', 7),
    //经验值
    exp             : TextManager.getter('basic', 8),
    //经验值缩写
    expA            : TextManager.getter('basic', 9),
    //战斗
    fight           : TextManager.getter('command', 0),
    //逃跑
    escape          : TextManager.getter('command', 1),
    //攻击
    attack          : TextManager.getter('command', 2),
    //防御
    guard           : TextManager.getter('command', 3),
    //物品
    item            : TextManager.getter('command', 4),
    //技能
    skill           : TextManager.getter('command', 5),
    //装备
    equip           : TextManager.getter('command', 6),
    //状态
    status          : TextManager.getter('command', 7),
    //队形
    formation       : TextManager.getter('command', 8),
    //保存
    save            : TextManager.getter('command', 9),
    //游戏结束
    gameEnd         : TextManager.getter('command', 10),
    //选项
    options         : TextManager.getter('command', 11),
    //武器
    weapon          : TextManager.getter('command', 12),
    //防具
    armor           : TextManager.getter('command', 13),
    //关键物品
    keyItem         : TextManager.getter('command', 14),
    //装备2
    equip2          : TextManager.getter('command', 15),
    //最强装备
    optimize        : TextManager.getter('command', 16),
    //清除
    clear           : TextManager.getter('command', 17),
    //新游戏
    newGame         : TextManager.getter('command', 18),
    //继续
    continue_       : TextManager.getter('command', 19),
    //回到标题
    toTitle         : TextManager.getter('command', 21),
    //取消
    cancel          : TextManager.getter('command', 22),
    //买
    buy             : TextManager.getter('command', 24),
    //卖
    sell            : TextManager.getter('command', 25),
    //始终冲刺
    alwaysDash      : TextManager.getter('message', 'alwaysDash'),
    //命令记忆
    commandRemember : TextManager.getter('message', 'commandRemember'),
    //bgm音量
    bgmVolume       : TextManager.getter('message', 'bgmVolume'),
    //bgs音量
    bgsVolume       : TextManager.getter('message', 'bgsVolume'),
    //me音量
    meVolume        : TextManager.getter('message', 'meVolume'),
    //se音量
    seVolume        : TextManager.getter('message', 'seVolume'),
    //持有数
    possession      : TextManager.getter('message', 'possession'),
    //经验值到下一级
    expTotal        : TextManager.getter('message', 'expTotal'),
    //当前经验
    expNext         : TextManager.getter('message', 'expNext'),
    //保存消息
    saveMessage     : TextManager.getter('message', 'saveMessage'),
    //读取消息
    loadMessage     : TextManager.getter('message', 'loadMessage'),
    //文件
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
