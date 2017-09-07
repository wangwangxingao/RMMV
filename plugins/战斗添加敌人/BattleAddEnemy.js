//=============================================================================
// BattleAddEnemy.js
//=============================================================================

/*:
 * @plugindesc 战斗添加敌人
 * @author wangwang
 *   
 * @param BattleAddEnemy
 * @desc 插件 战斗添加敌人 ,作者 汪汪
 * @default 汪汪
 * 
 * 
 * @help  
 *  
 * 
 * $gameTroop.addEnemy (敌人id, 显示x, 显示y, 是否隐藏) 
 * xy为中下点的位置
 * 
 * 
 **/

Spriteset_Battle.prototype.update_ww = Spriteset_Battle.prototype.update
Spriteset_Battle.prototype.update = function () {
    this.update_ww()
    this.updateEnemys();
};
Spriteset_Battle.prototype.updateEnemys = function () {
    if ($gameTroop._adde) {
        var enemies = $gameTroop._adde;
        for (var i = 0; i < enemies.length; i++) {
            var s = new Sprite_Enemy(enemies[i])
            this._battleField.addChild(s);
            this._enemySprites.push(s);
        }
        $gameTroop._adde = null
    }
}
Game_Troop.prototype.addEnemy = function (enemyId, x, y, hidden) {
    if ($dataEnemies[enemyId]) {
        var enemyId = enemyId;
        var x = x;
        var y = y;
        var enemy = new Game_Enemy(enemyId, x, y);
        if (hidden) {
            enemy.hide();
        }
        this._enemies.push(enemy);
        this._adde = this._adde || []
        this._adde.push(enemy)
        //表 = 字母表()
        var table = this.letterTable();
        if (enemy.isAlive() && enemy.isLetterEmpty()) {
            var name = enemy.originalName();
            var n = this._namesCount[name] || 0;
            enemy.setLetter(table[n % table.length]);
            this._namesCount[name] = n + 1;
        }
        var name = enemy.originalName();
        if (this._namesCount[name] >= 2) {
            enemy.setPlural(true);
        }
    }
};


