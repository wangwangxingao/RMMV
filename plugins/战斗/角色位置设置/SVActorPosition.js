//=============================================================================
// SVActorPosition.js
//=============================================================================

/*:
 * @plugindesc 调整队员的战斗位置和姿态.
 * @author wangwang
 * 
 *  
 * @param SVActorPosition 
 * @desc  调整队员的战斗位置和姿态
 * @default 汪汪
 * 
 * @param postype
 * @desc  种类 0 默认 , 1 pos1 单个位置设置 2 pos2 中心对齐 3 pos3 不同数量自定义
 * @default 0
 * 
 * 
 * @param pos1
 * @desc 每个角色单独的位置设置
 * @default [[600,280],[632,328],[664,376],[696,424]]
 *
 * 
 * @param pos2
 * @desc  x基础位置, y基础位置,x间隔,y间隔,x是否<形分布,y是否v形分布
 * @default [500,300,0,10,0,0]
 * 
 * @param pos3
 * @desc  不同人数时的位置 
 * @default [[], [[500,300]] , [[500,250],[500,350]] ,[[500,200],[500,300],[500,400]],   [[500,150],[500,250],[500,350],[500,450]]  ]
 * 
 * @help 
 * 
 * 
 * 
 * 
 */
var ww = ww || {};

(function () {

 
  ww.PluginManager = {
    find: function (n) { var l = PluginManager._parameters; var p = l[(n || "").toLowerCase()]; if (!p) { for (var m in l) { if (l[m] && (n in l[m] || l[m][n] == "汪汪")) { p = l[m]; } } }; return p || {} },
    parse: function (i) { try { return JSON.parse(i) } catch (e) { return i } },
    get: function (n) { var m, o = {}, p = this.find(n); for (m in p) { o[m] = this.parse(p[m]) }; return o }
  }

  ww.SVActor = ww.PluginManager.get('SVActorPosition');
 

  Game_System.prototype.SVActorPosition = function (name, set) {
    if (!this.svActorArrayDefined()) {
      this.defineSvActorArray();
    }
    this.svActor[name] = set
  }

  
  var _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function () {
    _Game_System_initialize.call(this);
    this.defineSvActorArray();
  };

  Game_System.prototype.defineSvActorArray = function () {
    this.svActor = {};
  };

  Game_System.prototype.svActorArrayDefined = function () {
    return !!this.svActor;
  };
 
  //设置角色位置
  Sprite_Actor.prototype.setActorHome = function (index) {
    if (!$gameSystem.svActorArrayDefined()) {
      $gameSystem.defineSvActorArray();
    } 
    var x = 600 + index * 32;
    var y = 280 + index * 48;
 
    var type = $gameSystem.svActor.postype || ww.SVActor.postype
    if (type == 1) {
      var set = $gameSystem.svActor.pos1 || ww.SVActor.pos1
      if (set) {
        var pos = set[index]
        if (pos) {
          var x = pos[0]
          var y = pos[1]
        }
      }
    } else if (type == 2) {
      var set = $gameSystem.svActor.pos2 || ww.SVActor.pos2
      if (set) {
        var n = $gameParty.battleMembers().length - 1
        var n2 = n * 0.5

        //基础
        var xb = set[0] || 0
        var yb = set[1] || 0
        //间隔
        var xa = set[2] || 0
        var ya = set[3] || 0
        //种类
        var xt = set[4] || 0
        var yt = set[5] || 0

        //方向
        var xd = (xt && (index - n2 < 0)) ? -1 : 1
        var yd = (yt && (index - n2 < 0)) ? -1 : 1

        var x = xb + xd * xa
        var y = yb + yd * ya
      }
    } else if (type == 3) {
      var set = $gameSystem.svActor.pos3 || ww.SVActor.pos3
      if (set) {
        var posset = set[$gameParty.battleMembers().length]
        if (posset) {
          var pos = posset[index]
          if (pos) { 
            var x = pos[0]
            var y = pos[1]
          }
        }
      }
    } 
    //设置初始位置
    this.setHome(x, y);
  };

   

})();
