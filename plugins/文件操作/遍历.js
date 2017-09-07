var rd = require('rd');

// 异步列出目录下的所有文件
rd.read('/tmp', function (err, files) {
    if (err) throw err;
    // files是一个数组，里面是目录/tmp目录下的所有文件（包括子目录）
});

// 同步列出目录下的所有文件
var files = rd.readSync('/tmp');

// 异步遍历目录下的所有文件
rd.each('/tmp', function (f, s, next) {
    // 每找到一个文件都会调用一次此函数
    // 参数s是通过 fs.stat() 获取到的文件属性值
    console.log('file: %s', f);
    // 必须调用next()才能继续
    next();
}, function (err) {
    if (err) throw err;
    // 完成
});

// 同步遍历目录下的所有文件
rd.eachSync('/tmp', function (f, s) {
    // 每找到一个文件都会调用一次此函数
    // 参数s是通过 fs.stat() 获取到的文件属性值
    console.log('file: %s', f);
});

function walk(path, floor, handleFile) {
    handleFile(path, floor);
    floor++;
    fs.readdir(path, function (err, files) {
        if (err) {
            console.log('read dir error');
        } else {
            files.forEach(function (item) {
                var tmpPath = path + '/' + item;
                fs.stat(tmpPath, function (err1, stats) {
                    if (err1) {
                        console.log('stat error');
                    } else {
                        if (stats.isDirectory()) {
                            walk(tmpPath, floor, handleFile);
                        } else {
                            handleFile(tmpPath, floor);
                        }
                    }
                })
            });

        }
    });
}

function get(path, floor, handleFile) {
    handleFile(path, floor);
    floor++;
    fs.readdir(path, function (err, files) {
        if (err) {
            console.log('read dir error');
        } else {
            files.forEach(function (item) {
                var tmpPath = path + '/' + item;
                fs.stat(tmpPath, function (err1, stats) {
                    if (err1) {
                        console.log('stat error');
                    } else {
                        if (stats.isDirectory()) {
                            walk(tmpPath, floor, handleFile);
                        } else {
                            handleFile(tmpPath, floor);
                        }
                    }
                })
            });

        }
    });
}




 getlist = function (path) { 
    var dir = ""
    var get = function (f) {
        var p = f ? dir + "/" + f : dir
        var fs = require('fs');
        var stats = fs.statSync(p)
        if (stats.isDirectory()) {

            var files = fs.readdirSync(p)
            files.forEach(function (n) {
                var f2 = f ? f + '/' + n : n
                get(f2, o)
            })
        } else {
            o[f] = stats
        }
    }
    get(path)
    return o
};