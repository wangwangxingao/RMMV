//
//  並び替えシーン ver1.09果酱dalao魔改
//
// ------------------------------------------------------
// Copyright (c) 2016 Yana
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------
//
// author Yana
//

var Imported = Imported || {};
Imported['SceneFormation'] = 1.09;

/*:
 * @plugindesc ver1.09/並び替えシーンを追加します。
 * @author Yana
 *
 * 
 * @param Stand Members Size
 * @desc 待機メンバーの最大数です。
 * 11を超えると、ウィンドウが2行になります。
 * @default 8
 * 
 * @param Max Battle Members Size
 * @desc 最大戦闘メンバー人数です。
 * 3人以下や、5人以上にも設定できます。
 * @default 4
 * 
 * @param Use Menu Formation Scene
 * @desc メニューの並び替えの項目を、並び替えシーンに
 * 置き換えるかどうかの設定です。true/falseで設定してください。
 * @default true
 * 
 * @param Formation Scene Battle Name
 * @desc 戦闘メンバーの上に表示されるテキストです。
 * @default 戦闘メンバー
 * 
 * @param Formation Scene Stand Name
 * @desc 待機メンバーの上に表示されるテキストです。
 * @default 待機メンバー
 * 
 * @param Use Battle Formation Switch ID
 * @desc 戦闘時にパーティコマンドに並び替えの項目の
 * 追加を許可を設定するスイッチのIDです。
 * @default 20
 * 
 * @param Battle Command Formation
 * @desc 戦闘時にパーティコマンドに追加される
 * 並び替えの項目のテキストです。
 * @default Formation
 * 
 * @param Status Window Font Size
 * @desc ステータスウィンドウの文字サイズです。
 * @default 24
 * 
 * @param Status Block Width
 * @desc ステータスウィンドウのパラメータ表示部の横幅です。
 * @default 372
 *
 * @param Cursor height
 * @desc Definição X-Axis do layout da janela de status.
 * @default 0
 *
 * @param Cursor width
 * @desc Definição Y-Axis do layout da janela de status.
 * @default 0
 * 
 * @param Cursor space
 * @desc Definição Y-Axis do layout da janela de status.
 * @default 0
 * @help ------------------------------------------------------
 * プラグインコマンド
 * ------------------------------------------------------
 * ※スペースは必ず半角で入力してください。
 * 
 * ・並び替えシーンを呼び出します。
 * 並び替えシーン 呼び出し
 * SceneFormation call
 * 
 * ・ID番のアクターの並びを固定します。
 * 並び替えシーン 固定 ID
 * SceneFormation fixed ID
 * 
 * ・ID番のアクターの並びの固定を解除します。
 * 並び替えシーン 固定解除 ID
 * SceneFormation unpin ID
 * 
 * ・全アクターの並びを固定します。
 * 並び替えシーン 全固定
 * SceneFormation all_fixed
 * 
 * ・ID番のアクターの並びを固定します。
 * 並び替えシーン 全固定解除
 * SceneFormation all_unpin
 *
 * ・最大戦闘参加人数を変更します。
 * 最大戦闘参加人数変更 人数
 * MaxBattleMembersSize number
 * ※戦闘中は変更できません！
 *
 * ------------------------------------------------------
 * 利用規約
 * ------------------------------------------------------
 * 当プラグインはMITライセンスで公開されています。
 * 使用に制限はありません。商用、アダルト、いずれにも使用できます。
 * 二次配布も制限はしませんが、サポートは行いません。
 * 著作表示は任意です。行わなくても利用できます。
 * 要するに、特に規約はありません。
 * バグ報告や使用方法等のお問合せはネ実ツクールスレ、または、Twitterにお願いします。
 * https://twitter.com/yanatsuki_
 * 素材利用は自己責任でお願いします。
 * ------------------------------------------------------
 * 更新履歴:
 * ver1.09:170228
 * 最大戦闘参加人数を変更するプラグインコマンドを追加。
 * ver1.08:170105
 * パーティが最大人数-1の時にアクター加入時の動作が正常でなかったバグを修正。
 * ver1.07:
 * Use Menu Formation Sceneをfalseにするとエラーが発生するバグを修正。
 * ver1.06:
 * パラメータ表示部の幅を設定する項目を追加。
 * 全体の文字サイズを設定する項目を追加。
 * ウィンドウ外の領域をクリックすることで、キャンセルとして働くように機能を追加。
 * このプラグインより下に入れたプラグインで右クリックが正常に動作しないことのあるバグを修正。
 * サイドビューで戦闘中に人数の増減を行った場合、正常に表示されないバグを修正。
 * ver1.05:
 * Window_FormationのcheckBltがloadFaceしていたバグを修正。
 * 待機メンバーで空白を選択した後、戦闘メンバーの最後のアクターを選択できないバグを修正。
 * ver1.04:
 * Window_FormationNameがWindow_Selectableのinitializeを呼んでいたバグを修正。
 * ver1.03:
 * 戦闘中、並び替えがアクティブでない時もクリックが可能だったバグを修正。
 * ver1.02:
 * Stand Members SizeとMax Battle Members Sizeが正常に動作していなかったバグを修正。
 * 空欄を選択して空欄で決定するとエラーが発生するバグを修正。
 * ver1.01:
 * addActorが正常に動作していなかったバグを修正。
 * ver1.00:
 * 公開
 */



function Scene_Formation() {
    this.initialize.apply(this, arguments);
};

(function() {

    'use strict';

    var parameters = PluginManager.parameters('SceneFormation');
    var standMembersSize = Number(parameters['Stand Members Size'] || 11);
    var maxBattleMembersSize = Number(parameters['Max Battle Members Size'] || 4);
    var useMenuFormationScene = String(parameters['Use Menu Formation Scene'] || true) == 'true';
    var formationSceneBattleName = String(parameters['Formation Scene Battle Name'] || '戦闘メンバー');
    var formationSceneStandName = String(parameters['Formation Scene Stand Name'] || '待機メンバー');
    var useBattleFormationSwitchId = String(parameters['Use Battle Formation Switch ID'] || 11);
    var battleFormationText = String(parameters['Battle Command Formation'] || 'Formation');
    var statusWindowFontSize = Number(parameters['Status Window Font Size'] || 24);
    var statusBlockWidth = Number(parameters['Status Block Width'] || 372);
    var cursorH = Number(parameters['Cursor width'] || 0);
    var cursorW = Number(parameters['Cursor height'] || 0);
    var cursorspace = Number(parameters['Cursor space'] || 0);

    var _Form_GInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        if (command === '並び替えシーン' || command === 'SceneFormation') {
            switch (args[0]) {
                case '呼び出し':
                case 'call':
                    this.callSceneFormation();
                    break;
                case '固定':
                case 'fixed':
                    $gameActors.actor(Number(args[1]))._fixed = true;
                    break;
                case '固定解除':
                case 'unpin':
                    $gameActors.actor(Number(args[1]))._fixed = false;
                    break;
                case '全固定':
                case 'all_fixed':
                    $gameParty.allMembers.forEach(function(actor) { actor._fixed = true });
                    break;
                case '全固定解除':
                case 'all_unpin':
                    $gameParty.allMembers.forEach(function(actor) { actor._fixed = false });
                    break;
            }
        } else if (command === '最大戦闘参加人数変更' || command === 'ChangeMaxBattleMembersSize') {
            if (!$gameParty.inBattle()) $gameParty.setMaxBattleMembersSize(Number(args[0]));
        } else {
            _Form_GInterpreter_pluginCommand.call(this, command, args);
        }
    };

    Game_Interpreter.prototype.callSceneFormation = function() {
        SceneManager.push(Scene_Formation);
    };

    Array.prototype.minusArray = function(array) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            var flag = true;
            for (var j = 0; j < array.length; j++) {
                if (this[i] === array[j]) {
                    flag = false;
                }
            }
            if (flag) {
                result.push(this[i]);
            }
        }
        return result.compact();
    };

    Array.prototype.compact = function() {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            if (this[i] !== null && this[i] !== undefined) {
                result.push(this[i]);
            }
        }
        return result;
    };

    function Window_Formation() {
        this.initialize.apply(this, arguments);
    };

    Window_Formation.prototype = Object.create(Window_Selectable.prototype);
    Window_Formation.prototype.constructor = Window_Formation;

    Window_Formation.prototype.initialize = function(type, x, y) {
        this._type = type;
        this.refreshMembers();
        var h = 144 * this.maxPageRows() + 32;
        var w = this._type == 'battle' ? 144 * $gameParty.fullMemberSize() + 24 : this.sw();
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this._lockIndex = null;
        this.refresh();
        console.log(this)
    };

    Window_Formation.prototype.sw = function() {
        var w = Graphics.boxWidth;
        var w1 = standMembersSize * 144 + this.standardPadding() * 2;
        var w2 = w - 196;
        return Math.min(w1, w2);
    };

    Window_Formation.prototype.standardPadding = function() {
        return 12;
    };

    Window_Formation.prototype.maxRows = function() {
        if (this._type === 'battle') {
            return 1
        };
        return Math.ceil(this.maxItems() / 6);
    };

    Window_Formation.prototype.spacing = function() {
        return 0;
    };

    Window_Formation.prototype.contentsWidth = function() {
        return this.maxCols() * this.itemWidth();
    };

    Window_Formation.prototype.contentsHeight = function() {
        return Math.ceil((this.maxItems() / this.colItemNum())) * this.itemHeight();
    };

    Window_Formation.prototype.isTopIndex = function() {
        return this._index < this.maxCols();
    };

    Window_Formation.prototype.colItemNum = function() {
        return Math.floor((this.width - this.standardPadding()) / this.itemWidth());
    };

    Window_Formation.prototype.itemRect = function(index) {
        var rect = Window_Selectable.prototype.itemRect.call(this, index);
        rect.width = 144 + cursorH;
        rect.height = 144 + cursorW;
        rect.x = (index % this.maxCols()) * (this.itemWidth() + this.spacing() + cursorspace);
        rect.y = 0 + (Math.floor(index / this.maxCols()) - this.topRow()) * this.itemHeight();
        return rect;
    };

    Window_Formation.prototype.itemWidth = function() {
        return 144;
    };

    Window_Formation.prototype.itemHeight = function() {
        return 144;
    };

    Window_Formation.prototype.maxCols = function() {
        var n = (this.width - (this.standardPadding() * 2)) / this.itemWidth();
        return Math.ceil(n);
    };

    Window_Formation.prototype.maxItems = function() {
        if (this._type === 'battle') {
            return Math.min(this._members.length + 99, $gameParty.fullMemberSize());
        } else {
            return this._members.length + 1;
        }
    };

    Window_Formation.prototype.maxPageRows = function() {
        return 2;
    };

    Window_Formation.prototype.maxPageItems = function() {
        return 12;
    };

    Window_Formation.prototype.select = function(index) {
        var result = Window_Selectable.prototype.select.call(this, index);
        if (this._statusWindow && this.active) {
            this._statusWindow._actor = this._members[index];
            this._statusWindow.refresh();
        }
        return result;
    };

    Window_Formation.prototype.processHandling = function() {
        if (this.isOpenAndActive()) {
            if (this._type === 'battle' && Input.isTriggered('shift')) {
                this.processRelease();
            } else if (this._type === 'stand' && Input.isTriggered('shift')) {
                this.processAdd();
            } else if (this._type === 'battle' && Input.isTriggered('down')) {
                this.processDown();
            } else {
                Window_Selectable.prototype.processHandling.call(this);
            }
        }
    };

    Window_Formation.prototype.cursorUp = function(wrap) {
        if (this._type === 'stand' && this.isTopIndex()) {
            return this.processUp();
        }
        Window_Selectable.prototype.cursorUp.call(this, wrap);
    };

    Window_Formation.prototype.isAliveOk = function() {
        return $gameParty.aliveBattleMembers().length > 1;
    };

    Window_Formation.prototype.isCurrentItemEnabled = function() {
        var sIndex = SceneManager._scene._scopeIndex;
        if (sIndex < 0 && !this.actor()) { return false }
        var fixed = (this.actor() && !this.actor().isFixed());
        var alive = (this.actor() && this.actor().isAlive());
        var flag1 = !this.actor() ? true : fixed;
        var flag2 = (this.isAliveOk() || !this.actor() || !sIndex || alive);
        var flag3 = (this.isAliveOk() || sIndex || sIndex === -1 || alive || this._type == 'battle');
        return flag1 && flag2 && flag3;
    };

    Window_Formation.prototype.processRelease = function() {
        if (this._members.length > 1 && this.actor() && !this.actor().isFixed() && (this.isAliveOk() || !this.actor().isAlive())) {
            SoundManager.playOk();
            this.updateInputData();
            this.callReleaseHandler();
        } else {
            SoundManager.playBuzzer();
        }
    };

    Window_Formation.prototype.processAdd = function() {
        var r = ($gameParty.allMembers().length - this._members.length) < $gameParty.fullMemberSize();
        if (r && this.actor() && !this.actor().isFixed()) {
            SoundManager.playOk();
            this.updateInputData();
            this.callAddHandler();
        } else {
            SoundManager.playBuzzer();
        }
    };


    Window_Formation.prototype.processDown = function() {
        SoundManager.playCursor();
        this.updateInputData();
        this.callHandler('down');
    };

    Window_Formation.prototype.processUp = function() {
        this.updateInputData();
        this.callHandler('up');
    };

    Window_Formation.prototype.callReleaseHandler = function() {
        this.updateInputData();
        this.callHandler('release');
    };

    Window_Formation.prototype.callAddHandler = function() {
        this.updateInputData();
        this.callHandler('add');
    };

    Window_Formation.prototype.refreshMembers = function() {
        if (this._type === 'battle') {
            this._members = this.battleMembers();
        } else if (this._type === 'stand') {
            this._members = $gameParty.allMembers().minusArray(this.battleMembers()).compact();
        }
    };



    Window_Formation.prototype.battleMembers = function() {
        var max = $gameParty.maxBattleMembers();
        var members = [];
        var allMembers = $gameParty.allMembers();
        allMembers.forEach(function(member) {
            if (member && (member.isAppeared() || member.isEscaped())) {
                members.push(member);
            }
        });
        return members.slice(0, max);
    };

    Window_Formation.prototype.refresh = function() {
        this.refreshMembers();
        this.createContents();
        this.checkBlt();
        this._setRefresh = true;
    };

    Window_Formation.prototype.refreshContents = function() {
        Window_Selectable.prototype.refresh.call(this);
    };

    Window_Formation.prototype.drawItem = function(i) {
        var x = this.itemWidth() * Math.floor((i % this.maxCols()));
        var y = 0 + this.itemHeight() * (Math.floor((i / this.maxCols())) - this.topRow());
        if (i == this._lockIndex) {
            this.contents.fillRect(x, y - 3, 144, 144, 'rgba(0,0,0,0.5)')
        }
        if (this._members[i]) {
            if (this._members[i].isFixed()) {
                this.contents.fillRect(x, y - 3, 144, 144, 'rgba(128,0,0,0.5)')
            }
            this.drawActorFace(this._members[i], x + 0, y + 0);
        } else {
            this.drawText('-', x, y, 144, 'center');
        }
    };

    Window_Formation.prototype.checkBlt = function() {
        var bitmap2 = new Bitmap(1, 1);
        $gameParty.allMembers().forEach(function(actor) {
            var bitmap = ImageManager.loadCharacter(actor.characterName());
            bitmap2.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0);
            bitmap = null;
        });
        bitmap2 = null;
    };

    Window_Formation.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        if (this._setRefresh) {
            if (ImageManager.isReady()) {
                this.refreshContents();
                this._setRefresh = false;
            } else {
                this.checkBlt();
            }
        }
    };

    Window_Formation.prototype.actor = function() {
        return this._members[this._index];
    };

    Window_Formation.prototype.lockIndex = function() {
        this._lockIndex = this._index;
        this.refresh();
    };

    Window_Formation.prototype.releaseIndex = function() {
        this._lockIndex = null;
        this.refresh();
    };

    Window_Formation.prototype.onTouch = function(triggered) {
        if ($gameParty.inBattle() && !BattleManager._formation) { return false }
        var lastIndex = this.index();
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var hitIndex = this.hitTest(x, y);
        if (hitIndex >= 0) {
            if (this._type === 'stand' && !this.active) {
                this.activate();
                this.callHandler('battleOff');
            } else if (this._type === 'battle' && !this.active) {
                this.activate();
                this.callHandler('standOff');
            }
            this.select(hitIndex);
            if (triggered && this.isTouchOkEnabled()) {
                this.processOk();
            }
        }
    };

    Window_Formation.prototype.processTouch = function() {
        if (!this.isOpen()) { return }
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            this._touching = true;
            this.onTouch(true);
        } else if (TouchInput.isCancelled()) {
            if (this.isCancelEnabled()) {
                this.processCancel();
            }
        }
        if (this._touching) {
            if (TouchInput.isPressed()) {
                this.onTouch(false);
            } else {
                this._touching = false;
            }
        }
    };

    Window_Formation.prototype.hitTest = function(x, y) {
        if (this.isContentsArea(x, y)) {
            var cx = x - this.padding;
            var cy = y - this.padding;
            var topIndex = this.topIndex();
            for (var i = 0; i < this.maxPageItems(); i++) {
                var index = topIndex + i;
                if (index < this.maxItems()) {
                    var rect = this.itemRect(index);
                    var right = rect.x + rect.width;
                    var bottom = rect.y + rect.height;
                    if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
                        return index;
                    }
                }
            }
        }
        return -1;
    };

    function Window_FormationStatus() {
        this.initialize.apply(this, arguments);
    };

    Window_FormationStatus.prototype = Object.create(Window_Base.prototype);
    Window_FormationStatus.prototype.constructor = Window_FormationStatus;

    Window_FormationStatus.prototype.initialize = function() {
        Window_Base.prototype.initialize.call(this, 0, Graphics.boxHeight - 240, 320, 440);
        this._actor = null
    };

    Window_FormationStatus.prototype.standardPadding = function() {
        return 8;
    };

    Window_FormationStatus.prototype.refresh = function() {
        this._setRefresh = true;
        this.checkBlt();
        this.contents.clear();
        if (this._actor) {
            if (!this._faceSprite) { this.createFaceSprite() };
            this.refreshFaceSprite();
        };
    };

    Window_FormationStatus.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._setRefresh) {
            if (ImageManager.isReady()) {
                this.refreshContents();
                this._setRefresh = false;
            } else {
                this.checkBlt();
            }
        }
        this._faceSprite.opacity = this.contentsOpacity;
        if (this._actor === undefined) this._faceSprite.opacity = 0;
    };


    Window_FormationStatus.prototype.checkBlt = function() {
        var bitmap = null;
        var bitmap2 = new Bitmap(1, 1);
        $gameParty.allMembers().forEach(function(actor) {
            bitmap = ImageManager.loadFace(actor.faceName());
            bitmap2.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0);
        });
        bitmap = null;
        bitmap2 = null;
    };

    Window_FormationStatus.prototype.refreshContents = function() {
        this.contents.clear();
        if (this._actor) {
            this.contents.fontSize = statusWindowFontSize;
            this.drawActorName(this._actor, 16, 0);
            this.drawActorLevel(this._actor, 16, 36);
            this.drawActorClass(this._actor, 280, 0);
            this.drawActorIcons(this._actor, 6, 32);
            this.drawParameters(172, 76);
            this.resetFontSettings();
        }
    };

    Window_FormationStatus.prototype.drawParameters = function(x, y) {
        var lineHeight = this.lineHeight();
        var blockWidth = statusBlockWidth / 2 - 6;
        var paramWidth = blockWidth / 3;
        this.contents.fontSize = 20;
        for (var i = 0; i < 7; i++) {
            var paramId = i;
            var y2 = y + 36 * i;
            this.drawText(this._actor.param(paramId), x, y2, paramWidth, 'right');
        }
    };

    Window_FormationStatus.prototype.createFaceSprite = function() {
        this._faceSprite = new Sprite();
        this._faceSprite.x = 150;
        this._faceSprite.y = -15;
        this.addChild(this._faceSprite);
    };

    Window_FormationStatus.prototype.refreshFaceSprite = function() {
        this._faceSprite.bitmap = ImageManager.loadMenusFaces1("Actor_" + this._actor._actorId);
    };

    function Window_FormationName() {
        this.initialize.apply(this, arguments);
    };

    Window_FormationName.prototype = Object.create(Window_Base.prototype);
    Window_FormationName.prototype.constructor = Window_FormationName;

    Window_FormationName.prototype.initialize = function(x, y, text) {
        Window_Base.prototype.initialize.call(this, x, y, 216, 56);
        this.drawText(text, 0, 0, 192, 1);
    };

    Window_FormationName.prototype.standardPadding = function() {
        return 9;
    };

    ////////////////////////////////////////////////////////////////////////////////////

    Scene_Formation.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Formation.prototype.constructor = Scene_Formation;

    Scene_Formation.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createAllWindows();
        this._scopeIndex = null;
    };

    Scene_Formation.prototype.createAllWindows = function() {
        this.createFormationStatusWindow();
        this.createBattlerWindow();
        this.createStanderWindow();
        this.createNameWindow();
    };


    Scene_Formation.prototype.createBattlerWindow = function() {
        this._battlerWindow = new Window_Formation('battle', 96, 72);
        this._battlerWindow.setHandler('ok', this.onMemberOk.bind(this));
        this._battlerWindow.setHandler('cancel', this.onMemberCancel.bind(this));
        this._battlerWindow.setHandler('release', this.onRelease.bind(this));
        this._battlerWindow.setHandler('down', this.onDown.bind(this));
        this._battlerWindow.setHandler('standOff', this.onStandOff.bind(this));

        this._battlerWindow._statusWindow = this._fStatusWindow;
        this._battlerWindow.activate();
        this._battlerWindow.select(0);
        this._fStatusWindow._actor = this._battlerWindow.actor();
        this._fStatusWindow.refresh();
        this.addWindow(this._battlerWindow);
    };

    Scene_Formation.prototype.createStanderWindow = function() {
        this._standerWindow = new Window_Formation('stand', 96, 264);
        this._standerWindow.setHandler('ok', this.onStandOk.bind(this));
        this._standerWindow.setHandler('cancel', this.onStandCancel.bind(this));
        this._standerWindow.setHandler('add', this.onAdd.bind(this));
        this._standerWindow.setHandler('up', this.onUp.bind(this));
        this._standerWindow.setHandler('battleOff', this.onBattleOff.bind(this));

        this._standerWindow._statusWindow = this._fStatusWindow;
        this._standerWindow.deactivate();
        this._standerWindow.deselect
        var n = this._standerWindow.height + this._standerWindow.y
        if (n > this._fStatusWindow.y) {
            this._standerWindow.y = this._fStatusWindow.y - this._standerWindow.height;
        }
        this.addWindow(this._standerWindow);

    };


    Scene_Formation.prototype.createFormationStatusWindow = function() {
        this._fStatusWindow = new Window_FormationStatus();
        this.addWindow(this._fStatusWindow);
    };

    Scene_Formation.prototype.createNameWindow = function() {
        this._nameWindow1 = new Window_FormationName(96, this._battlerWindow.y - 48, formationSceneBattleName);
        this.addWindow(this._nameWindow1);
        this._nameWindow2 = new Window_FormationName(96, this._standerWindow.y - 48, formationSceneStandName);
        this.addWindow(this._nameWindow2);
    };

    Scene_Formation.prototype.clearWindows = function() {
        this._scopeIndex = null;
        this._battlerWindow.refreshMembers();
        this._standerWindow.refreshMembers();
        this._battlerWindow.releaseIndex();
        this._standerWindow.releaseIndex();
    };

    Scene_Formation.prototype.returnScene = function() {
        this.popScene(this);
    };

    Scene_Formation.prototype.onMemberOk = function() {
        if (this._scopeIndex !== null && this._scopeIndex !== undefined) {
            var a = null;
            if (this._scopeIndex >= 0) {
                a = $gameParty._actors[this._scopeIndex];
                if (this._battlerWindow.actor()) {
                    var index = $gameParty.allMembers().indexOf(this._battlerWindow.actor());
                    $gameParty._actors[this._scopeIndex] = $gameParty._actors[index];
                    $gameParty._actors[index] = a;
                    a = null;
                } else {
                    var ary = this.getFrontAndStand(a, this._battlerWindow._members.length);
                    ary[0].push(a);
                    ary[0] = ary[0].concat(ary[1]);
                    $gameParty._actors = ary[0].compact();
                    if (this._scopeIndex >= this._battlerWindow._members.length) {
                        $gameParty._battleMemberSize = this._battlerWindow._members.length + 1;
                    } else {
                        $gameParty._battleMemberSize = this._battlerWindow._members.length
                    }
                    a = null;
                }
            } else if (this._scopeIndex === -2) {
                if (this._battlerWindow.actor()) {
                    if (this._battlerWindow._members.length === 1) {
                        return
                    }
                    a = this._battlerWindow.actor()._actorId;
                    var ary = this.getFrontAndStand(a, this._battlerWindow._members.length);
                    ary[1].push(a);
                    ary[0] = ary[0].concat(ary[1]);
                    $gameParty._actors = ary[0].compact();
                    $gameParty._battleMemberSize = this._battlerWindow._members.length - 1;
                    a = null;
                }
            } else if (this._scopeIndex === -1) {
                a = this._battlerWindow.actor()._actorId;
                var ary = this.getFrontAndStand(a, this._battlerWindow._members.length);
                ary[0].push(a);
                ary[0] = ary[0].concat(ary[1]);
                $gameParty._actors = ary[0].compact();
            }
            this.clearWindows();
            this._battlerWindow.updateInputData();
            this._battlerWindow.activate();
            this._battlerWindow.select(this._battlerWindow._index);
            $gamePlayer.refresh();
            $gameParty._battleMemberSize = this._battlerWindow._members.length;
        } else {
            this._scopeIndex = $gameParty.allMembers().indexOf(this._battlerWindow.actor());
            if (this._scopeIndex === null || this._scopeIndex === undefined) {
                this._scopeIndex = -1
            }
            this._battlerWindow.lockIndex();
            this._battlerWindow.updateInputData();
            this._battlerWindow.activate();
        }
    };

    Scene_Formation.prototype.onStandOk = function() {
        if (this._scopeIndex !== null && this._scopeIndex !== undefined) {
            var a = null;
            if (!(this._battlerWindow._members.length === 1 && !this._standerWindow.actor())) {
                if (this._scopeIndex >= 0) {
                    a = $gameParty._actors[this._scopeIndex];
                    if (this._standerWindow.actor()) {
                        var index = $gameParty.allMembers().indexOf(this._standerWindow.actor());
                        $gameParty._actors[this._scopeIndex] = $gameParty._actors[index];
                        $gameParty._actors[index] = a;
                        a = null;
                    } else {
                        var ary = this.getFrontAndStand(a, this._battlerWindow._members.length);
                        ary[1].push(a);
                        ary[0] = ary[0].concat(ary[1]);
                        $gameParty._actors = ary[0].compact();
                        if (this._scopeIndex < this._battlerWindow._members.length) {
                            $gameParty._battleMemberSize = this._battlerWindow._members.length - 1;
                        } else {
                            $gameParty._battleMemberSize = this._battlerWindow._members.length;
                        }
                        a = null;
                    }
                } else if (this._scopeIndex === -1) {
                    if (this._standerWindow.actor()) {
                        a = this._standerWindow.actor()._actorId;
                        var ary = this.getFrontAndStand(a, this._battlerWindow._members.length);
                        ary[0].push(a);
                        ary[0] = ary[0].concat(ary[1]);
                        $gameParty._actors = ary[0].compact();
                        $gameParty._battleMemberSize = this._battlerWindow._members.length + 1;
                        a = null;
                    }
                } else if (this._scopeIndex === -2) {
                    a = this._standerWindow.actor()._actorId;
                    var ary = this.getFrontAndStand(a, this._battlerWindow._members.length);
                    ary[1].push(a);
                    ary[0] = ary[0].concat(ary[1]);
                    $gameParty._actors = ary[0].compact();
                } else {

                }
            }
            this.clearWindows();
            this._standerWindow.updateInputData();
            this._standerWindow.activate();
            this._standerWindow.select(this._standerWindow._index);
            $gamePlayer.refresh();
            $gameParty._battleMemberSize = this._battlerWindow._members.length;
        } else {
            this._scopeIndex = $gameParty.allMembers().indexOf(this._standerWindow.actor());
            if (this._scopeIndex === null || this._scopeIndex === undefined || this._scopeIndex === -1) {
                this._scopeIndex = -2
            }
            this._standerWindow.lockIndex();
            this._standerWindow.updateInputData();
            this._standerWindow.activate();
        }
    };

    Scene_Formation.prototype.getFrontAndStand = function(a, length) {
        var ary1 = [];
        var ary2 = [];

        for (var i = 0; i < $gameParty._actors.length; i++) {
            if ($gameParty._actors[i] !== a) {
                if (i < length) {
                    ary1.push($gameParty._actors[i]);
                } else {
                    ary2.push($gameParty._actors[i]);
                }
            }
        }
        return [ary1, ary2];
    };

    Scene_Formation.prototype.scopeIndex = function() {
        return this._scopeIndex;
    };

    Scene_Formation.prototype.onMemberCancel = function() {
        if (this._scopeIndex === null) {
            console.log('exit Formation')
            this.returnScene();
        } else {
            this._scopeIndex = null;
            this._battlerWindow.releaseIndex();
            this._standerWindow.releaseIndex();
            this._battlerWindow.updateInputData();
            this._battlerWindow.activate();
        }
    };

    Scene_Formation.prototype.onStandCancel = function() {
        if (this._scopeIndex === null) {
            console.log('exit Formation2')
            this.returnScene();

        } else {

            this._scopeIndex = null;
            this._battlerWindow.releaseIndex();
            this._standerWindow.releaseIndex();
            this._standerWindow.updateInputData();
            this._standerWindow.activate();
        }
    };

    Scene_Formation.prototype.onRelease = function() {
        var actor = this._battlerWindow.actor();
        var ary = this.getFrontAndStand(actor._actorId, this._battlerWindow._members.length - 1);
        ary[1].push(actor._actorId);
        ary[0] = ary[0].concat(ary[1]);
        $gameParty._actors = ary[0].compact();
        $gameParty._battleMemberSize = this._battlerWindow._members.length - 1;
        this.clearWindows();
        this._battlerWindow.activate();
        this._battlerWindow.select(this._battlerWindow._index);
        $gamePlayer.refresh();
    };

    Scene_Formation.prototype.onAdd = function() {
        var a = this._standerWindow.actor()._actorId;
        var ary = this.getFrontAndStand(a, this._battlerWindow._members.length);
        ary[0].push(a);
        ary[0] = ary[0].concat(ary[1]);
        $gameParty._actors = ary[0].compact();
        $gameParty._battleMemberSize = this._battlerWindow._members.length + 1;
        this.clearWindows();
        this._standerWindow.activate();
        this._standerWindow.select(this._standerWindow._index);
        $gamePlayer.refresh();
    };

    Scene_Formation.prototype.onDown = function() {
        var index = Math.min(this._battlerWindow._index, this._standerWindow.maxItems() - 1);
        this._battlerWindow.deactivate();
        this._battlerWindow.deselect();
        this._standerWindow.activate();
        this._standerWindow.select(index);
    };

    Scene_Formation.prototype.onUp = function() {
        var index = Math.min(this._standerWindow._index, this._battlerWindow.maxItems() - 1);
        this._standerWindow.deactivate();
        this._standerWindow.deselect();
        this._battlerWindow.activate();
        this._battlerWindow.select(index);
    };

    Scene_Formation.prototype.onStandOff = function() {
        this._standerWindow.deactivate();
        this._standerWindow.deselect();
    };

    Scene_Formation.prototype.onBattleOff = function() {
        this._battlerWindow.deactivate();
        this._battlerWindow.deselect();
    };


    Scene_Formation.prototype.onTouchCancelFormation = function() {
        if (TouchInput.isTriggered()) {
            var x = TouchInput.x;
            var y = TouchInput.y;
            var ax = this._battlerWindow.x;
            var xw = ax + this._battlerWindow.width;
            var ay = this._battlerWindow.y;
            var yh = ay + this._battlerWindow.height;
            var flag = x >= ax && x <= xw && y >= ay && y <= yh;
            ax = this._standerWindow.x;
            xw = ax + this._standerWindow.width;
            ay = this._standerWindow.y;
            yh = ay + this._standerWindow.height;
            return !(flag || (x >= ax && x <= xw && y >= ay && y <= yh));
        }
        return false;
    };

    Scene_Formation.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        if (this.onTouchCancelFormation()) {
            if (this._battlerWindow.active) {
                SoundManager.playCancel();
                this.onMemberCancel();
            } else if (this._standerWindow.active) {
                SoundManager.playCancel();
                this.onStandCancel();
            }
        }
    };

    ////////////////////////////////////////////////////////////////////////////////////    

    var _Form_WPartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
    Window_PartyCommand.prototype.makeCommandList = function() {
        _Form_WPartyCommand_makeCommandList.call(this);
        if ($gameSwitches.value(useBattleFormationSwitchId)) {
            this.addCommand(battleFormationText, 'formation')
        }
    };

    // 再定義　パーティ全員のアクションを作成する
    Game_Party.prototype.makeActions = function() {
        this.allMembers().forEach(function(member) {
            member.makeActions();
        });
    };


    ////////////////////////////////////////////////////////////////////////////////////

    Game_Actor.prototype.isFixed = function() {
        if (this._fixed === undefined) {
            this._fixed = this.initFixed();
        }
        return this._fixed === true;
    };

    Game_Actor.prototype.initFixed = function() {
        return this.actor().note.match(/<並び替え固定>/) !== null;
    };

    Game_Actor.prototype.escape = function() {
        Game_Battler.prototype.escape.call(this);
        this._escaped = true;
    };

    Game_Actor.prototype.onBattleStart = function() {
        this._escaped = false;
        Game_Battler.prototype.onBattleStart.call(this);
    };

    Game_Actor.prototype.isEscaped = function() {
        return this._escaped;
    };

    // 再定義
    Game_Party.prototype.maxBattleMembers = function() {
        return this._maxBattleMembersSize || maxBattleMembersSize;
    };

    Game_Party.prototype.setMaxBattleMembersSize = function(number) {
        this._maxBattleMembersSize = number;
        if (this._battleMemberSize > number) {
            this._battleMemberSize = number;
        }
    };

    // 再定義したものを更にエイリアス
    var _Form_GParty_maxBattleMembers = Game_Party.prototype.maxBattleMembers;
    Game_Party.prototype.maxBattleMembers = function() {
        if (!this._battleMemberSize) {
            this._battleMemberSize = this.fullMemberSize()
        }
        return this._battleMemberSize;
    };

    Game_Party.prototype.fullMemberSize = function() {
        return _Form_GParty_maxBattleMembers.call(this)
    };

    var _Form_GParty_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        this._battleMemberSize = this.fullMemberSize();
        _Form_GParty_initialize.call(this);
    };

    Game_Party.prototype.aliveBattleMembers = function() {
        return this.battleMembers().filter(function(member) {
            return member.isAlive()
        });
    };

    var _Form_GParty_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function(actorId) {
        var size = this._battleMemberSize;
        if (this._battleMemberSize != this.fullMemberSize()) {
            this._battleMemberSize = Math.min(this._battleMemberSize + 1, this.fullMemberSize());
        }
        _Form_GParty_addActor.call(this, actorId);
        if (size != this.fullMemberSize()) {
            var ary1 = this._actors.slice(0, this._battleMemberSize - 1);
            var ary2 = this._actors.minusArray(ary1);
            delete ary1[ary1.indexOf(actorId)];
            delete ary2[ary2.indexOf(actorId)];
            ary1 = ary1.compact();
            ary2 = ary2.compact();
            ary1.push(actorId);
            ary1 = ary1.concat(ary2);
            this._actors = ary1.compact();
            $gamePlayer.refresh();
        }
        this._actors = this._actors.compact();
    };

    var _Form_GParty_onBattleEnd = Game_Party.prototype.onBattleEnd;
    Game_Party.prototype.onBattleEnd = function() {
        _Form_GParty_onBattleEnd.call(this);
        $gamePlayer.refresh();
    };

    // 再定義　メニューを入れ替え
    var _Form_SMenu_commandFormation = Scene_Menu.prototype.commandFormation;
    Scene_Menu.prototype.commandFormation = function() {
        if (useMenuFormationScene) {
            SceneManager.push(Scene_Formation);
        } else {
            _Form_SMenu_commandFormation.call(this);
        }
    };

    var _Form_SsBattle_createActors = Spriteset_Battle.prototype.createActors;
    Spriteset_Battle.prototype.createActors = function() {
        var n = $gameParty.maxBattleMembers();
        $gameParty._battleMemberSize = $gameParty.fullMemberSize();
        _Form_SsBattle_createActors.call(this);
        $gameParty._battleMemberSize = n;
    };

    if (Imported['YEP_BattleEngineCore']) {
        var _Form_SActor_setActorHome = Sprite_Actor.prototype.setActorHome;
        Sprite_Actor.prototype.setActorHome = function(index) {
            var n = $gameParty.maxBattleMembers();
            $gameParty._battleMemberSize = $gameParty.fullMemberSize();
            _Form_SActor_setActorHome.call(this, index);
            $gameParty._battleMemberSize = n;
        };
    }
})();