






var ww = ww || {}


ww.changeDescriptionByActor = {}
/*

Window_EquipSlot.prototype.updateHelp = function() {
    Window_Selectable.prototype.updateHelp.call(this);
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setTempActor(null);
    }
};
*/


ww.changeDescriptionByActor.changeDescription = function () {
    console.log(arguments)

    var actor = this._actor
    var type = arguments[1] * 1
    var n = arguments[2] * 1

    var xf = false
    if (type >= 10) {
        type -= 10
        xf = true
    }
    var show = arguments[3]
    var change = false
    if (actor) {
        if (type == 0) {
            change = actor.isStateAffected(n)
        } else if (type == 1) {
            change = actor.isClass($dataClasses[n]);
        } else if (type == 2) {
            change = actor.hasSkill(n);
        } else if (type == 3) {
            change = actor.hasWeapon($dataWeapons[n]);
        } else if (type == 4) {
            change = actor.hasArmor($dataArmors[n]);
        }
    }
    if (type == 5) {
        change = $gameParty.hasItem($dataItems[n])
    } else if (type == 6) {
        change = $gameParty.members().contains($gameActors.actor(n))
    } else if (type == 7) {
        change = $gameParty.gold() >= n
    } else if (type == 8) {
        change = $gameParty.steps() >= n
    } else if (type == 9) {
        change = $gameParty.size() >= n
    } 
    if (xf) {
        change = !change
    }
    if (change) {
        return show
    } else {
        return ""
    }
 
}

Window_EquipSlot.prototype.setHelpWindowItem = function (item) {
    //如果(帮助窗口)
    if (this._helpWindow) {

        var description = item && item.description || '' 
        var rex = /\#\[(\d+),(\d+),(.?)\]\#/g 

        description.replace(rex, ww.changeDescriptionByActor.changeDescription.bind(this))
         
        this._helpWindow.setItem({ description: description });
    }
}; 