
/**var 1.6 */ 
StorageManager.localFileDirectoryPath = function() { 
    var path = process.mainModule.filename.replace(/(\/www|)\/[^\/]*$/, '/save/');
    if (path.match(/^\/([A-Z]\:)/)) {
        path = path.slice(1);
    }
    return decodeURIComponent(path); 
};
