//=============================================================================
// MapCharacterNamePop.js
//=============================================================================

/*:
 * @plugindesc 地图显示人物名称
 * @author wangwang
 *   
 * @param MapCharacterNamePop
 * @desc 地图显示人物名称 ,作者 汪汪
 * @default 汪汪 
 *   
 * @help
 * 
 * 
 * 注释方法加入标签 
 * 种类标签
 * <nametype:nametext>  显示nametext的内容
 * <nametype:name>   显示名称
 * <nametype:nickname>  显示昵称 (事件不支持)  
 * 不设置时为默认,事件默认为nametext ,角色默认为 name
 * 
 * nametext显示内容标签:
 * <nametext:名称> 种类为 nametext 时 显示的默认值
 * 
 * 颜色标签
 * <namecolor:#ffffff> 颜色 ,没有设置时为默认的 #ffffff
 * 
 * 名称隐藏标签
 * <namehide:true> 名称隐藏 ,没有设置时为 显示
 * 
 * 对于事件,一开始就设置为注释中的值
 * event.setNamePop(name,color)  ​
 * 设置名称name,值为字符串 如 "名称" , 
 * 设置颜色color 值为字符串 如 "#ffffff" 
 * event.setNameHide(hide)  
 * 设置隐藏hide ,  隐藏值为 true 显示值为 false
 * event.setNameHide(true)  隐藏
 * event.setNameHide(false) 显示 
 * 
 * 
 * 对于角色
 * actor._nametype = type 
 * 种类,可以设置的值为: "nametext" 自己设置的内容, "name" 名字, "nickname" 昵称, "" 默认
 *  
 * actor._nametext = "例子"  
 * 设置名称为 "例子" 
 * 当种类为 "nametext"  或者 默认时有效
 *   
 * actor._namecolor = "#ffffff"
 * 设置颜色color, 值为字符串 如 "#ffffff" ,  
 *  
 * actor._namehide = true
 * 设置隐藏 
 * actor._namehide = false
 * 设置显示
 *  
 * 角色修改后使用 $gamePlayer.refresh() 请求刷新
 * 
 * 
 * (可以使用 $gameMap.event(id) 获取事件 )
 * (可以使用 $gameActors.actor(id) 或者 $gameParty.members()[index]  获取角色 )
 * 
 * */

(function() {

    /**设置名称
     * @param  {string} name   名称 ,字符串格式 ,如 "test"
     * @param  {string} color   颜色 ,字符串格式,如 '#ffffff'
     *  
     */
    Game_Character.prototype.setNamePop = function(name, color) {
        this._nametext = name || ""
        this._namecolor = color || '#ffffff'
    };
    /**设置名称隐藏 
     * @param  {boolean} hide  值 true (隐藏) / false (显示)
     * 
     */
    Game_Character.prototype.setNameHide = function(hide) {
        return this._namehide = hide || false
    };

    _Game_Event_prototype_initialize = Game_Event.prototype.initialize
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_prototype_initialize.call(this, mapId, eventId);

        this._nametype = this.event().meta.nametype

        var name = this.getNametext(this._nametype);
        var color = this.getNamecolor()
        var hide = this.getNameHide()

        this.setNamePop(name, color);
        this.setNameHide(hide)
    };

    /**获取名称文本
     * @param {string}  nametype 种类 
     */
    Game_Event.prototype.getNametext = function(nametype) {
        if (nametype == "name") {
            var name = this.event().name || "";
        } else if (nametype == "nametext") {
            var name = this.event().meta.nametext || "";
        } else {
            var name = this.event().meta.nametext || "";
        }
        return name
    };

    Game_Event.prototype.getNamecolor = function() {
        return this.event().meta.namecolor || '#ffffff';
    };

    Game_Event.prototype.getNameHide = function() {
        return this.event().meta.namehide || false;
    };


    _Game_Actor_prototype_initialize = Game_Actor.prototype.initialize
    Game_Actor.prototype.initialize = function(actorId) {
        _Game_Actor_prototype_initialize.call(this, actorId)

        this._nametype = this.actor().meta.nametype
        this._nametext = this.actor().meta.nametext || ""
        this._namecolor = this.actor().meta.namecolor || '#ffffff'
        this._namehide = this.actor().meta.namehide || false
    };


    _Game_Player_prototype_refresh = Game_Player.prototype.refresh
    Game_Player.prototype.refresh = function() {
        _Game_Player_prototype_refresh.call(this)

        var actor = $gameParty.leader();
        this.refreshNamePop(actor)
    };

    Game_Player.prototype.refreshNamePop = function(actor) {
        var name = this.getNametext(actor)
        var color = this.getNamecolor(actor)
        var hide = this.getNameHide(actor)
        this.setNamePop(name, color)
        this.setNameHide(hide)
    };


    /**获取名称文本 */
    Game_Player.prototype.getNametext = function(actor) {
        if (actor) {
            if (actor._nametype == "name") {
                var name = actor.name() || "";
            } else if (actor._nametype == "nickname") {
                var name = actor.nickname() || "";
            } else if (actor._nametype == "nametext") {
                var name = actor._nametext || ""
            } else {
                var name = actor.name() || "";
            }
            return name
        } else {
            return ""
        }
    };

    Game_Player.prototype.getNamecolor = function(actor) {
        if (actor) {
            return actor._namecolor || '#ffffff'
        } else {
            return '#ffffff'
        }
    };

    Game_Player.prototype.getNameHide = function(actor) {
        if (actor) {
            return actor._namehide || false
        } else {
            return false
        }
    };

    _Game_Follower_prototype_refresh = Game_Follower.prototype.refresh
    Game_Follower.prototype.refresh = function() {
        _Game_Follower_prototype_refresh.call(this)

        var actor = this.isVisible() ? this.actor() : null;
        this.refreshNamePop(actor)
    };

    Game_Follower.prototype.refreshNamePop = function(actor) {
        var name = this.getNametext(actor)
        var color = this.getNamecolor(actor)
        var hide = this.getNameHide(actor)
        this.setNamePop(name, color)
        this.setNameHide(hide)
    };


    /**获取名称文本 */
    Game_Follower.prototype.getNametext = function(actor) {
        if (actor) {
            if (actor._nametype == "name") {
                var name = actor.name() || "";
            } else if (actor._nametype == "nickname") {
                var name = actor.nickname() || "";
            } else if (actor._nametype == "nametext") {
                var name = actor._nametext || ""
            } else {
                var name = actor.name() || "";
            }
            return name
        } else {
            return ""
        }
    };

    Game_Follower.prototype.getNamecolor = function(actor) {
        if (actor) {
            return actor._namecolor || '#ffffff'
        } else {
            return '#ffffff'
        }
    };

    Game_Follower.prototype.getNameHide = function(actor) {
        if (actor) {
            return actor._namehide || false
        } else {
            return false
        }
    };

    _Sprite_Character_prototype_initialize = Sprite_Character.prototype.initialize;
    Sprite_Character.prototype.initialize = function(character) {
        _Sprite_Character_prototype_initialize.call(this, character);
        this.createNamePop();
    };

    /**创建名称显示 */
    Sprite_Character.prototype.createNamePop = function() {
        this._namePopSprite = new Sprite();
        this.addChild(this._namePopSprite);
    };

    _Sprite_Character_prototype_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_prototype_update.call(this);
        this.updateNamePop()
    };

    /**更新名称显示 */
    Sprite_Character.prototype.updateNamePop = function() {
        if (this._namePopSprite) {
            this._namePopSprite.y = -this.height;
            if (this._character) {
                if (this._nametext != this._character._nametext ||
                    this._namecolor != this._character._namecolor) {
                    this.changeNamePop(this._character._nametext, this._character._namecolor)
                }
                this._namePopSprite.visible = !this._character._namehide
            } else {
                this._namePopSprite.visible = false
            }
        }
    }

    /**改变名称显示 */
    Sprite_Character.prototype.changeNamePop = function(showname, showcolor) {
        this._nametext = showname
        this._namecolor = showcolor
        var h = 15;
        var w = h * Math.max(10, (showname || "").length)
        this._namePopSprite.bitmap = new Bitmap(w, h);
        this._namePopSprite.bitmap.fontSize = 12;
        this._namePopSprite.bitmap.textColor = showcolor;
        this._namePopSprite.bitmap.drawText(showname, 0, 0, w, h, 'center');
        this._namePopSprite.anchor.x = 0.5;
        this._namePopSprite.anchor.y = 1;
    };


}());