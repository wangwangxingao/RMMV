













$gameSystem.onBeforeSave();
if(DataManager.saveGame(100)){ 
StorageManager.cleanBackup(100);//SoundManager.playSave();
}//else{ SoundManager.playBuzzer(); } 
