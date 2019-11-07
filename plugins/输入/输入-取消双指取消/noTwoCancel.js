

TouchInput._useCancel = false
TouchInput._onCancel = function(x, y) { 
    if(!TouchInput._useCancel){return } 
    this._events.cancelled = true;
    this._x = x;
    this._y = y;
};