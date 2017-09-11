 Math.random0 = Math.random
 Math.random = function() {
     if (BattleManager._mustRandom) {
         var seed = BattleManager._mustRandomSeed
         seed = (seed * 9301 + 49297) % 233280;
         BattleManager._mustRandomSeed = seed
         var z = seed / 233280.0
     } else {
         var z = Math.random0()
     }
     return z
 }



 Scene_Battle.prototype.start = function() {
     //场景基础 开始 呼叫(this)
     Scene_Base.prototype.start.call(this);
     //开始淡入(淡入速率,false)
     this.startFadeIn(this.fadeSpeed(), false);
     //战斗管理器 播放战斗bgm()
     BattleManager.playBattleBgm();
     if (this._webtype) {
         this._mustRandom = 1
     }
     //战斗管理器 开始战斗()
     BattleManager.startBattle();
 };

 /**
  * 组队成功时使用这个
  * 给每一个成员一个数值,让他们相同 , 
  * 同时设置网络模式为 1 
  */
 BattleManager.setSeed = function(seed) {
     this._webtype = 1
     this._mustRandom = 0
     this._mustRandomSeed = seed
 }


 Game_BattlerBase.prototype.canInput = function() {
     return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle() && !this.isOther();
 };

 Game_BattlerBase.prototype.isOther = function() {
     return this._isOther;
 };

 /** 
  * 设置 对象 的动作组 
  */
 BattleManager.setActions = function(type, id, actions) {
     if (type == 1) {
         var b = $gameParty.pidActor(id)
     } else {
         var b = $gameTroop.members()[id]
     }
     if (b) {
         b.clearActions()
         for (var i = 0; i < actions.length; i++) {
             b.setAction(i, actions[i])
         }
         b.setActionState('waiting');
     }
 };

 BattleManager.startTurn = function() {
     if (this._webtype) {
         this._phase = 'web';

         var actions = JsonEx.stringify($gameActors.actor(1)._actions)
             /**
              * 把数据传输出去
              */
     } else {
         this.startTurn2()
     }
 };

 /**
  * 结束接受时, 使用  BattleManager.startTurn2()
  */


 BattleManager.startTurn2 = function() {
     //阶段 = "turn"  //回合
     this._phase = 'turn';
     //清除角色()
     this.clearActor();
     //游戏敌群 增加回合()
     $gameTroop.increaseTurn();
     //制作动作次序()
     this.makeActionOrders();
     //游戏队伍 请求动作刷新()
     $gameParty.requestMotionRefresh();
     //日志窗口 开始回合()
     this._logWindow.startTurn();
 };







 Game_Actor.prototype.pid = function() {
     return this._pid;
 };
 Game_Actor.prototype.setPid = function(pid) {
     this._pid = pid
 };

 /**初始化*/
 Game_Actors.prototype.initialize = function() {
     this._data = [];
     this._hash = {};
 };
 /**角色*/
 Game_Actors.prototype.pidActor = function(pid) {
     var actorId = this.pidActorId(pid)
     if (this._data[actorId]) {
         return this._data[actorId]
     }
     return null;
 };
 /**设置 */
 Game_Actors.prototype.setPid = function(pid, actorId) {
     this._hash[pid] = actorId
 };
 /**删除 */
 Game_Actors.prototype.delPid = function(pid) {
     delete this._hash[pid]
 };
 /**  */
 Game_Actors.prototype.pidActorId = function(pid) {
     return this._hash[pid]
 };

 Game_Actors.prototype.setActor = function(id, actor) {
     if (id) {
         if (this._data[id]) {
             this.delPid(this._data[id]._pid)
         }
         this._data[id] = actor
         if (actor) {
             this.setPid(actor._pid, id)
         }
     }
 };
 /**id处生成一个pid的基于actorid创造的角色 */
 Game_Actors.prototype.makeActor = function(id, pid, actorId) {
     if (id) {
         var actor = new Game_Actor(actorId)
         actor.setPid(pid)
         this.setActor(id, actor);
     }
 };

 Game_Action.prototype.setSubject = function(subject) {
     if (subject.isActor()) {
         this._subjectActorId = subject.pid();
         this._subjectEnemyIndex = -1;
     } else {
         this._subjectEnemyIndex = subject.index();
         this._subjectActorId = 0;
     }
 };

 Game_Action.prototype.subject = function() {
     if (this._subjectActorId > 0) {
         return $gameActors.pidActor(this._subjectActorId);
     } else {
         return $gameTroop.members()[this._subjectEnemyIndex];
     }
 };


 /**菜单角色*/
 Game_Party.prototype.menuActor = function() {
     var actor = $gameActors.pidActor(this._menuActorId);
     if (!this.members().contains(actor)) {
         actor = this.members()[0];
     }
     return actor;
 };
 Game_Party.prototype.setMenuActor = function(actor) {
     this._menuActorId = actor.pid();
 };
 Game_Party.prototype.targetActor = function() {
     //角色 = 游戏角色组 角色( 目标角色id )
     var actor = $gameActors.pidActor(this._targetActorId);
     //如果(不是 成员组() 包含(角色) )
     if (!this.members().contains(actor)) {
         //角色 = 成员组()[0]
         actor = this.members()[0];
     }
     //返回 角色
     return actor;
 };
 /**设置目标角色*/
 Game_Party.prototype.setTargetActor = function(actor) {
     //目标角色id = 角色 角色id
     this._targetActorId = actor.pid();
 };


















 BattleManager.mustInput = function() {
     if (this._webaction) {
         var battlers = []
         var webbattlers = this._webaction.battlers
         for (var i = 0; i < webbattlers.length; i++)
             var a = webactionBattlers[i]
         if (a.type == 1) {
             var b = $gameParty.actor(a.id)
         } else {
             var b = $gameTroop.members()[a.id]
         }
         if (b) {
             battlers.push(p)
         }
         this._actionBattlers = battlers
         this._mustRandom = true
         this._mustRandomSeed = this._webaction.seed
         this.startTurn2()
         console.log(this._webaction)
     }
     console.log(this._webaction)
 }