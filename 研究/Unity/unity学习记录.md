# unity 学习记录

## bug修复记录

### litjson 读取JsonData 出问题

Hashtable转化还原bug等..  

使用此版本 https://github.com/JunC74/litjson#compiling

### 'Color' is an ambiguous reference between 'UnityEngine.Color' and 'System.Drawing.Color' 报错

```js
`Object` is an ambiguous reference between `UnityEngine.Object` and `object`
```

在引用 using UnityEngine; 和 using System; 会产生这种冲突，使用下面代码决定使用哪个类作为默认类

```cs
using Object = System.Object;
```
