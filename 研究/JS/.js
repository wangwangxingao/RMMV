function s(x, y) {

    this.x = x
    this.y = y
}
s.prototype.add = function (v) {
    this.x += v.x
    this.y += v.y
}
s.prototype.add2 = function (x, y) {
    this.x += x
    this.y += y
}
s.make1 = function () {
    return new s(Math.random(), Math.random())
}
s.make2 = function () {
    return { x: Math.random(), y: Math.random() }
}

s.add = function (v1, v2) {
    v1.x += v2.x
    v1.y += v2.y
}
s.add2 = function (v1, x, y) {
    v1.x += x
    v1.y += y
}




var i = 10000

console.time('one')

var z = s.make1()
var v = i
while (v--) {
    z.add(s.make1())
}
console.timeEnd('one')

console.time('one')

var z = s.make1()
var v = i
while (v--) {
    z.add(s.make2())
}
console.timeEnd('one')

console.time('one')

var z = s.make1()
var v = i
while (v--) {
    s.add(z, s.make1())
}
console.timeEnd('one')

console.time('one')

var z = s.make1()
var v = i
while (v--) {
    s.add(z, s.make2())
}
console.timeEnd('one')


console.time('one')
var z = s.make1()
var v = i
while (v--) {
    s.add2(z, Math.random(), Math.random())
}
console.timeEnd('one')

 
