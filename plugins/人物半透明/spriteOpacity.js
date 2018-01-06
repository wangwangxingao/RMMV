//=============================================================================
// spriteOpacity.js
//=============================================================================

/*:
 * @plugindesc 精灵遮盖半透明
 * @author wangwang
 *   
 * @param spriteOpacity
 * @desc 插件 精灵遮盖半透明
 * @default 汪汪
 * 
 * @param opacity
 * @desc   精灵遮盖半透明比例
 * @default 0.4
 * 
 */


function Sprite_Character2() {
    this.initialize.apply(this, arguments);
}

(function() {
    var f = function(n) {
        var l = PluginManager._parameters;
        var p = l[(n || "").toLowerCase()];
        if (!p) { for (var m in l) { if (l[m] && (n in l[m])) { p = l[n]; } } }
        return p || {}
    }
    var g = function(p, n, u) {
        try { var i = p[n] } catch (e) { var i = u }
        return i === void 0 ? u : i
    }
    Sprite_Character2.opacity = g(f("spriteOpacity"), "opacity", 0.4) * 1

    Sprite_Character2.prototype = Object.create(Sprite_Character.prototype);
    Sprite_Character2.prototype.constructor = Sprite_Character2;

    Sprite_Character2.prototype.updateOther = function() {
        Sprite_Character.prototype.updateOther.call(this)
        this.opacity *= Sprite_Character2.opacity;
    };
    Sprite_Character2.prototype.updatePosition = function() {
        Sprite_Character.prototype.updatePosition.call(this)
        this.z = 100 - this.z;
    };


    var _Spriteset_Map_prototype_createCharacters = Spriteset_Map.prototype.createCharacters
    Spriteset_Map.prototype.createCharacters = function() {
        _Spriteset_Map_prototype_createCharacters.call(this)
        for (var i = this._characterSprites.length - 1; i >= 0; i--) {
            var c = this._characterSprites[i]._character
            var s = new Sprite_Character2(c)
            this._characterSprites.push(s)
            this._tilemap.addChild(s);
        }
    };



    Spriteset_Map.prototype.addcreateCharacters = function(c) {
        if (c) {
            var s = new Sprite_Character(c)
            this._characterSprites.unshift(s)
            this._tilemap.addChild(s);
            var s = new Sprite_Character2(c)
            this._characterSprites.push(s)
            this._tilemap.addChild(s);
        }
    };





})()