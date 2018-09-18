
SceneManager.catchException = function(e) {
    if (e instanceof Error) { 
    Graphics.printError(e.toString(), e.stack.toString());
        console.error(e.stack);
    } else {
        Graphics.printError('UnknownError', e);
    }
    AudioManager.stopAll();
    this.stop();
};