var ww = ww || {}

ww.lsxls = {}
importScripts("xlsxcoremin.js")
/*
ww.lsxls._js = "xls/xlsxcoremin"
importScripts("js/plugins/"+ ww.lsxls._js +".js")
*/
/**
 * 当读取xls数据
 * @param {*} response 
 * @param {*} xhr 
 */
ww.lsxls.onloadxls = function (response, type, xhr) {
    var result = {}
    if (response) {
        var data = new Uint8Array(response)
        var wb = XLS.read(data, {
            type: 'array'
        })
        var result = ww.lsxls.toJson(wb,type)
    }
    return result;
};



ww.lsxls.toJson = function (workbook, type) {
    var result = type ? [
        [],
        []
    ] : {};
    workbook.SheetNames.forEach(function (sheetName) {
        var roa = XLS.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1
        });
        var roa = ww.lsxls.roaclear(roa)
        if (roa.length) {
            if (!type) {
                result[sheetName] = roa;
            } else {
                result[0].push(sheetName)
                result[1].push(roa);
            }
        };
    });
    return result;
};


ww.lsxls.roaclear = function (roa) {
    if (roa.length) {
        var z = 0
        for (var i = 0; i < roa.length; i++) {
            var l = roa[i]
            if (l && l.length > 0) {
                z = i
            }
        }
        roa.length = z + 1
    };
    return roa
};


addEventListener('message', function (e) {
    var d = e.data
    var o = {
        name: d.name,
        data: ww.lsxls.onloadxls(d.data,d.type),
        type:d.type
    }
    postMessage(o);
}, false);