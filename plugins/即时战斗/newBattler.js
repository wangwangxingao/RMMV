 BattleManager.isBusy = function() {
     //返回 (游戏消息 是忙碌()  或者 精灵组 是忙碌() 或者 日志窗口 是忙碌() )
     return $gameMessage.isBusy() // || this._spriteset.isBusy()  //  ||  this._logWindow.isBusy());
 };





 BattleManager.startInput = function() {
     //阶段 = "input" //输入
     this._phase = 'input';
     //游戏队伍 制作动作()
     $gameParty.makeActions();
     //游戏敌群 制作动作()
     $gameTroop.makeActions();
     //清除角色()
     //this.clearActor();

     //如果 (突然袭击) 或者 (不是 游戏队伍 能输入)
     //if (this._surprise || !$gameParty.canInput()) {
     //开始回合()
     //    this.startTurn();
     // }
 };

 /**获取下一个对象 */
 BattleManager.getNextSubject = function() {
     //循环
     //for (;;) {
     //战斗者 = 动作战斗者组 移除头部()
     var battler = this._actionBattlers.shift();
     //如果 不是 战斗者(战斗者 不存在) 
     if (!battler) {
         return null;
     }
     //如果 战斗者 是战斗成员 并且 战斗者 是活的
     if (battler.isBattleMember() && battler.isAlive()) {
         //返回 战斗者
         return battler;
     }
     // }
 };




 /**开始回合 */
 BattleManager.startTurn = function() {
     //阶段 = "turn"  //回合
     this._phase = 'turn';
     //清除角色()
     this.clearActor();
     //游戏敌群 增加回合()
     $gameTroop.increaseTurn();
     //制作动作次序()
     //this.makeActionOrders();
     //游戏队伍 请求动作刷新()
     $gameParty.requestMotionRefresh();
     //日志窗口 开始回合()
     this._logWindow.startTurn();
 };