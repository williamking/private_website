谈到React的状态管理，我们会想到一个蛋疼的问题：对象的更新检测，React内部的更新检测是引用检测，也就是说如果对象引用没有变，仅仅更改对象的内部属性，是不会触发更新的，要触发更新，只能更换整个对象的引用来实现，即深拷贝。然而这种深拷贝，在状态对象层级深且复杂的时候特别麻烦，因此一个工具库出现了——那就是Imutable.JS。

Immutable意为不可改变的，即通过这个库定义的所有数据都是不会改变的，数据内的增、删、改等修改操作都是返回一个新的数据引用，这种方式十分契合React的更新逻辑，因此用在React应用中十分方便，在数据复杂的应用中，一般与flux模式开发结合。

Immutable支持的数据类型有Map、List等等，对应为原生JS的Object、Array等对象。
下面仅说最简单的Immutable数据与JS原生数据类型的转换:
```
   const Immutable = require('immutable');
	 let a = {
	   names: ['a', 'b']
	 };
	 let b = Immutable.fromJS(a); // 原生转Immutable
	 let c = b.toJS(); // Immutable转原生
```
上面的转换，原生Array对应Immutable的List，Object对应Immutable的Map。

这里是Immutable的官方文档:[http://facebook.github.io/immutable-js/docs/#/](http://facebook.github.io/immutable-js/docs/#/)