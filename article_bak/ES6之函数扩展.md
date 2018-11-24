## 1.参数默认值与结构赋值

ES6中，函数参数可通过如下方式设置默认值:
```
function(a, b = 0) {
}
```
注意默认值的赋值只能是在末尾的变量，否则无法判断省略的是哪个参数，除非显示对该参数传入undefined值。
同样解构赋值可用于函数的参数的默认值设定，具体见解构赋值的笔记。

## 2.函数的length属性
函数的length属性为其未指定默认值的参数个数：
```
(function(a, b, c = 0){}).length; //2
```

## 3.参数的赋值时机
函数内语句执行前，会先进行参数的实参和默认值赋值。

## 4.利用参数默认值禁止参数省略
只需能够禁止省略的参数设定默认值为执行一个抛出错误函数即可：
```
var missingThrow = function() {
	throw new Error('Missing parameter');
}

function foo(x = missingThrow()) {
	
}
foo()
// Error: missing parameter
```

## 5.rest参数
rest参数用在函数的最后一个形参中，在最后一个形参前加上符号"..."即可：
```
let foo = function(x, ...rest) {
	console.log(x);
	console.log(rest);
}

foo(1, 2, 3, 4);
//1
//[2, 3, 4]
```

## 6.扩展运算符...
该运算符加在数组参数前，将数组转换为用逗号分隔的参数序列：
```
console.log('a', ...['b', 'c', 'd'], e); //a b c d e
```
该方法可用于替代apply函数：
```
let a = ['1', '2', '3'], b = ['4', '5'];

Array.prototype.push.apply(a, b); //ES5拼接两数组

a.push(...b); //ES6拼接两数组

[...a, ...b] //更简洁的拼接方式
```
更可用于解构赋值，但只可放在参数最后一个:
```
let [a, ...rest] = [1, 2, 3];
a //1
rest //2, 3
```
也可用于转换字符串为字符数组：
```
[...'will'] // ['w', 'i', 'l', 'l']
[...'w\uD83D'].length // 3
//这种扩展能够识别大于32为unicode字符
```
实际上，扩展运算符能用在任何有Iterator接口的对象上，但对于没有该接口的对象，运用扩展运算符会出错。

## 7.箭头函数
ES6中新增一种新型箭头表达式来定义函数：
```
let foo = (a, b) => a * 2 + b;
```
等同于：
```
let foo = function(a, b) {
	return a * 2 + b;
}
```
多语句用大括号：
```
let foo = (a, b) => {
	//....
}
```
箭头函数的注意点：
* 函数内的this对象为其定义时环境的this对象，而不是使用时环境。
* 不可用于构造函数，即不能用new。
* 不能用arguments对象，请用扩展运算符结合rest参数代替。
* 不能用作generator函数，即不能用field命令。
