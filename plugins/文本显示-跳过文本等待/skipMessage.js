 
 

Window_Message.prototype.updateWait = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        if(this.isTriggered()){
            this._waitCount = 0
        }
        return true;
    } else {
        return false;
    }
};


