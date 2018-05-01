 

var h = {}
var w = {}


function add(o, i, x, y) {
    o[i] = o[i] || []
    o[i].push([x, y])
    o[i].sort(
        function (a, b) {
            return a[0] - b[0]
        }
    )
}


function addH(i, x, y) {
    add(w, i, x, y)
}


function addW(i, x, y) {
    add(h, i, x, y)
}



