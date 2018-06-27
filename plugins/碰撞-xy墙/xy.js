  
 



find = function find(i, l, r, list) { 
    while( l!= r && l+1!= r ){ 
        var m = (l + r) >> 1 
        if (list[m] == i) {
            return m
        } else if (list[m] < i) {
            l = m
        } else {
            r = m 
        } 
    }
    return l 
}


 