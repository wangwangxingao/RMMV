

 

Graphics.makeList = function (ele, list) {
    if (ele && ele.options) {
        this.clearList(ele)
        if (list) { 
            for (var i = 0; i < list.length; i++) {
                var option = new Option(list[i], i);
                modelList.options.add(option);
            }
        }
    }
}

 
Graphics.clearList = function (ele) {
    if (ele && ele.options) {
        while (ele.options.length) {
            ele.remove(0);
        }
    }
}


/*
Graphics.makeSelect = fun
*/