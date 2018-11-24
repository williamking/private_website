# 正则表达式扩展

## 1.正则的表示
在ES6中，正则表达式的表达有两种：
```
var reg = /abc+/g;
var reg = new RegExp(/abd/g, 'i'); //相当于reg = /abd/i， 模式g被覆盖，当第二个参数省略时才为/abd/g。
```
从例子得出，正则的表示以/pattern/attr的形式表示，其中attr为修饰符，代表不同的匹配模式。

ES5的含有修饰符如下：
i : 大小写不敏感匹配。
g : 全局匹配，查找所有匹配，而不是在找到第一个匹配后停止。
m : 多行匹配

ES6下正则对象含有flags属性，代表其修饰符。

下面介绍ES6新增的修饰符

## 2.u修饰符

u修饰符用于对码点超过0XFFFF的字符的识别匹配，见下例：
```
var reg = /^.$/;
var reg2 = /^.$/u;

reg.test('王'); //返回false,因为无法识别该字符
reg.test('王'); //返回true, 成功识别
```
总而言之，对于含有码点超过0XFFFF的字符的字符串的正则匹配，都需要带上u修饰符来进行匹配。

## 3.y修饰符
y修饰符类似g修饰符的全局匹配，但是加了一个限制，后续的匹配串必须紧跟在前一个匹配串之后:
y修饰符对应正则对象的sticky属性。
```
var s = 'aa_aaa_aaaa_a';
do {
	var result = /a+/.exec(s)''
    console.log(result);
} while(result != null);
//输出aaaaaaaaaanull,成功匹配4次。

do {
	var result = /a+/y.exec(s)''
    console.log(result);
} while(result != null);
//输出aanull，只匹配一次(aa后面是'_'，停止匹配)

do {
	var result = /a+_/y.exec(s)''
    console.log(result);
} while(result != null);
//输出aa_aaa_aaaa_null
```