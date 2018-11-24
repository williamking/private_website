# 数组的扩展

## 1.Array.from()

ES6提供的数组对象新方法，可以将带有itertator的对象转换成数组并返回。

常用的转换的对象有：类似数组的对象(带有length属性）、Set、Map、字符串

下面为例子:
```
let obj = {
	'0' : 'a',
	'1' : 'b',
	'2' : 'c',
	length: 3
}
var arr = Array.from(obj);
console.log(arr); //['a', 'b', 'c']
```

只要有length属性，对象就可以转换为数组：
```
var arr = Array.from({length:3});
console.log(arr); // [undefined, undefined, undefined]
```

Array.from()还能传入一个函数对象作为第二个参数，该函数用于对生成数组的每一个元素进行处理：
```
var arr = Array.from({length : 3}, function() {
	var val = 0;
	return function(value) {
		return val++;
    };
}());
```
这是一种生成特定长度的值与下标相等的数组的小技巧。
传入函数中的参数value为当前处理的元素值，返回值为处理后代替的元素值。

## 2.Array.of()
该方法可将一组值转换为数组
```
var arr = Array.of(1, 2, 3);
console.log(arr); // [1,2,3]
```
此方法解决了Array构造函数参数个数不同返回结果不同的问题。可用之替代Array()或new Array().

## 3.Array.prototype.copyWithin(target, start = 0, end = this.length)

在数组内部，将指定位置的成员复制到其他位置中，返回当前数组。
target: 替换数据的位置起点。
start: 读取数据起点。
end: 到该位置前停止读取数据。
从函数原型看，后两个参数有默认值，可省略。
例子：
```
[1, 3, 5, 7, 9].copyWithin(0, 2, 4);
// [5, 7, 5, 7, 9]
```

## 4.Array.prototype.find(func)和Array.prototype.findIndex(func)

第一个方法传入一个函数，返回第一个使函数返回true的数组成员。
```
[-1,-2,0,1,2].find(function(value, index, arr) {
	return value > 0;
}); // 1
```
传入的回调函数可接受三个参数，分别为当前判断的数组成员值、当前位置、原数组。
findIndex方法与find类似，只是返回的是下标，而不是值。

## 5.Array.prototype.fill(value, start = 0, end = this.length)

此方法用一个值填充数组或部分数组：
```
Array.of(1, 2, 3).fill(0, 1, 2); // [1, 0, 3]
```
后两个参数与前面的copyWithin意义相同，为填充范围。

## 6.entries(), keys(), values()
这三个方法分别返回数组的键值对、键、值的Iterator对象。

## 7.Array.includes(value)

判断数组是否包含传入的参数值，返回布尔值。

## 8.空位的问题

ES6中，数组的空位全会被转换成undefined。

