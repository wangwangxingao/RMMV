

/**
 * 角色对敌人
 * ai 角色id   0时为全部, -1为 队伍(此时为队伍内角色id)
 * lv  等级   角色id-1时无用
 * ei  敌人id  0时为全部, -1为 敌群(此时为敌群内敌人id)
 * 
 *  ww.testDamage.testAE (ai,  lv , ei,  formula)   
 *
 * 敌人对敌人
 *  
 * ai  敌人id  0时为全部, -1为 敌群(此时为敌群内敌人id)
 * ei  敌人id  0时为全部, -1为 敌群(此时为敌群内敌人id)
 *  
 *  ww.testDamage.testEE (ai,   ei,  formula) 
 * 
 * 角色对角色
 * 
 * ai 角色id   0时为全部, -1为 队伍(此时为队伍内角色id)
 * lv  目标等级,-1时无用
 * ei 目标角色id   0时为全部, -1为 队伍(此时为队伍内角色id) 
 * elv  角色id-1时无用
 *  ww.testDamage.testAA (ai, lv, ei, elv, formula)  
 */


var ww = ww || {}
ww.testDamage = {}


 
ww.testDamage.markas = function(ai,lv){ 
    var ms = []
    if(ai<0){ 
        return $gameParty.members() 
    }else  if (ai == 0) { 
        for (var i = 0; i < $dataActors.length; i++) {
            var a = $dataActors[i]
            if (a) {
                ms[i] = this.markActor(i, lv)
            }
        }
    } else {
        ms[ai] = $dataActors[ai] ? this.markActor(ai) : 0
    } 
    return  ms 
}



ww.testDamage.markes = function(ai){  
    var ms = []
    if(ai<0){ 
        return $gameTroop.members() 
    }else if (ai == 0) { 
        for (var i = 0; i < $dataEnemies.length; i++) {
            var a = $dataEnemies[i]
            if (a) {
                ms[i] = this.markEnemy(i)
            }
        }
    } else {
        ms[ai] = $dataEnemies[ai] ? this.markEnemy(ai) : 0
    } 
    return  ms 
}

/**
 * 角色对敌人
 * ai 角色id   0时为全部, -1为 队伍(此时为队伍内角色id)
 * lv  等级   角色id-1时无用
 * ei  敌人id  0时为全部, -1为 敌群(此时为敌群内敌人id)
 * 
 */
ww.testDamage.testAE = function (ai, lv, ei, formula) { 
    var ps = this.markas(ai,lv) 
    var ts = this.markes(ei)
    this.test(ps,ts,formula)
    
}


/**
 * 敌人对敌人
 *  
 * ai  敌人id  0时为全部, -1为 敌群(此时为敌群内敌人id)
 * ei  敌人id  0时为全部, -1为 敌群(此时为敌群内敌人id)
 * 
 */
ww.testDamage.testEE = function (ai, ei, formula) {
    
    var ps = this.markes(ai) 
    var ts = this.markes(ei)
    this.test(ps,ts,formula)
 
}


/**
 * 
 * 角色对角色
 * 
 * ai 角色id   0时为全部, -1为 队伍(此时为队伍内角色id)
 * lv  目标等级,-1时无用
 * ei 目标角色id   0时为全部, -1为 队伍(此时为队伍内角色id) 
 * elv  角色id-1时无用
 */
ww.testDamage.testAA = function (ai, lv, ei, elv, formula) {

    var ps = this.markas(ai,lv) 
    var ts = this.markas(ei,elv)
    this.test(ps,ts,formula)   
}



ww.testDamage.test =function(ps,ts,formula){ 
    for (var ai = 0; ai < ps.length; ai++) {
        var a = ps[ai]
        if (a) {
            for (var ei = 0; ei < ts.length; ei++) {
                var e = ts[ei]
                if (e) {
                    var v = this.evalDamageFormula(a, e, formula) 
                    console.log("使用id:  " + ai, "目标id:   " + ei, "公式值:  " + v)
                }
            }
        }
    } 
}


ww.testDamage.markActor = function (id, lv) {
    var actor = new Game_Actor(id)
    actor.changeLevel(lv)
    actor.recoverAll()
    return actor;
};


ww.testDamage.markEnemy = function (id) {
    var actor = new Game_Enemy(id, 0, 0)
    return actor;
};


ww.testDamage.evalDamageFormula = function (subject, target, formula
) {
    try {
        var item = $dataSkills[1];
        var a = subject;
        var b = target;
        var v = $gameVariables._data;
        var value = Math.max(eval(formula), 0);
        if (isNaN(value)) value = 0;
        return value;
    } catch (e) {
        return 0;
    }
};