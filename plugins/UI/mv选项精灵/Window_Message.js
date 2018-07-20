 
 
Window_Message.prototype.createSubWindows = function () {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new Sprite_UIFourChioce(this);
    this._numberWindow = new Window_NumberInput(this);
    this._itemWindow = new Window_EventItem(this); 
};


 