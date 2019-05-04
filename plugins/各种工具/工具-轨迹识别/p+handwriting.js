p = new pdollarplus.PDollarPlusRecognizer()



AddGesture =function  (s) {
    for(var i in s){

var sts =s[i]
var l= []
for(var i2 = 0;i2<sts.length;i2++){ 
    var l1 = sts[i2]
    for(var i3= 0 ;i3<l1.length;i3+=2){ 
        l.push(new pdollarplus.Point(l1[i3],l1[i3+1],i2))
    } 
}


        p.AddGesture(i,l)
    }
}

AddGesture(simpleHandwriting)

console.log(p)

