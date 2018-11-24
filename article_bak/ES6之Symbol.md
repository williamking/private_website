# Symbol

## 1.简介
Symbol是ES6引进的一种新的原始数据类型，它的特点是独一无二性，即新建的每一个Symbol变量都是不相等的，这种特性可以用于作为对象属性名(键)，防止属性名的冲突。相对于ES5的使用字符串作为属性值，更具有安全性。

Symbol的创建方法如下:
```
let s = Symbol();
let t = Symbol();

s === t // false
```
不能使用new命令创建，因为Symbol是原始数据类型值，不是对象。

Symbol也可以用一个字符串作参数为其添加描述，从而方便区分:
```
let s = Symbol('example');
s // Symbol(example)
s.toString() // "Symbol(example)"
```
Symbol可以转为字符串和布尔值，但不能参与运算。

## 2.Symbol的使用
Symbol用于对象的属性名:
```
name = Symbol('name');

// 方式1
let obj = {};
obj[name] = 'william';

//方式2
let obj = {
	[name] : 'william'
};

//方式3
let obj = {};
obj.defineProperty(obj, name, { value: 'william' });

//结果
obj[name]; // william
//不能这样调用
obj.name // undefined
```
如上代码所属，Symbol作为对象的属性名时，只能通过方括号来获取该属性，不能用点运算符，因为会与字符串类型的属性名混淆。

Symbol还可以用于一些枚举类型的常量:
```
const MALE = Symbol();
const FEMALE = Symbol();
```
这样保证了常量不会混淆，相比于用其它类型做枚举更有安全性。

## 3.对象Symbol的遍历
Symbol作为对象属性名时，不能通过for...in、for...of来遍历对应属性，也不能通过Object.keys()和Object.getOwnPropertyNames()获取。

通过Object.getOwnPropertySymbols()获取对象所有的Symbol属性名。

Object.ownKeys()会返回包括Symbol类型的对象所有属性名。

## 4.Symbol.for()与Symbol.keyFor()
Symbol.for()是一种生成Symbol类型变量的方法，它和Symbol的不同点在于它需要传入字符串参数，
生成的Symbol会在全局环境中登记，将该字符串参数与该Symbol进行绑定，若是之后用同样的字符串
参数来调用Symbol.for()，则会在全局环境中查找，发现该字符串参数已经绑定了Symbol，就不会创建新的
Symbol，而是直接返回绑定的Symbol值。
```
let a = Symbol.for('dog'),
    b = Symbol.for('dog');
a === b // true
```
Symbol.KeyFor()会返回Symbol.for()创建的Symbol变量绑定的字符串:
```
let a = Symbol.for('dog');
Symbol.keyFor(a); // dog

let b = Symbol.for('cat');
Symbol.keyFor(b); // undefined
```

## 5.ES6内置的Symbol值
ES6提供了11个内置的Symbol值，这些Symbol值在一般的对象中作为属性名都有对应的属性或方法，可以用来进行对象的属性和方法的重载。

1) Symbol.hasInstance
指向一个内部方法，该方法在对象作为instanceof运算符的运算对象(判断是否为该对象实例)时调用。

2) Symbol.isContatSpreadable
指向一个布尔值属性，表示对象使用Array.prototype.concat()时，是否能展开。默认为true。

3) Symbol.species
指向一个方法，该方法在对象作为构造函数创建实例时调用。

4) Symbol.match
指向一个方法，方法的返回值作为执行str.match(obj)的结果。

5) Symbol.replace
指向一个方法，方法的返回值作为执行String.prototype.replace的结果。
```
String.prototype.replace(searchValue, replaceValue);
// 等同
searchValue[Symbol.replace](this, replaceValue);
```

6) Symbol.search
指向一个方法，方法的返回值作为执行String.prototype.search的结果。

7) Symbol.split
指向一个方法，方法的返回值作为执行String.prototype.split()的结果。
```
String.prototype.split(seperator, limit);
// 等同
seperator[Symbol.replace](this, limit);
```

8) Symbol.iterator
指向对象的默认遍历器方法。该方法会在使用for...of循环时调用。

9) Symbol.toPrimitive
指向一个方法，该方法接受一个字符串参数，会将对象转为该参数代表的原始类型，
参数有'number', 'string'和'default'。

10) Symbol.toStringTag
指向一个方法，一般对象调用Object.prototype.toString方法时，会出现[object xxx]这样的结果，
而该Symbol指向的方法就是决定返回的结果中xxx的值。

11) Symbol.unscopables
指向一个对象，该对象指定使用with关键字时，哪些属性会被排除。