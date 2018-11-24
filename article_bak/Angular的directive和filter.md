最近在matrix项目中重构members页面，因为要把每个成员的信息一个个显示，并且还有分页，因此打算使用angular的directive和filter实现。下面是学习的一些笔记。

# 一、directive
"directive"意为指令，它相当于一个自定义的HTML元素，也可以看作是HTML元素标签的一种扩展。
 
指令的类型有两种：组件型指令和装饰型指令。

## 1.组件型指令
组件型指令是独立的一个标签，和React的Component有异曲同工的感觉。对于一些复用性强的view，可以通过组件型指令进行分离，像是我项目中的应用：显示成员信息，则可以将一个成员显示的块封装成一个组件型指令。

以下是一个组件指令的声明例子：
```
angular.module('matrix.course')
  .directive('memberBlock', memberBlockDirective);


memberBlockDirective.$inject = [];
function memberBlockDirective() {
  return {
    restrict: 'E',
    template: getTemplate(),
    controller: memberCtrl,
    scope: getScopeObject()
  };
}
```

声明通过一个回调函数进行，回调函数返回一个对象，称为“指令定义对象”。

restrict属性表示这个指令的应用方式，取值为“E（元素）”、“A（属性）”、“C（类名）”、“M（注释）”这几个字母的组合。

组件型指令标准用法是E，但有时为了兼容IE8，也会用“EA”的方式声明。

scope属性定义其作用域的模式，取值有true、false和哈希对象。true表明这个组件需要一个独立的新作用域，若这个节点上有其他的独立作用域指令，则会与其共享作用域，否则会新建一个。false表明这个组件不需要新作用域，scope对象指向其同一节点的作用域或独立作用域指令队的作用域或父级作用域（前者不存在时）。

哈希对象比较特殊，是一个完全独立的作用域，与父作用域隔离，独立作用域在一个节点只能出现一个。下面说明哈希对象的声明:
```javascript
{
  name: '@',
	details: '=',
	onChange: '&'
}
```
哈希对象的属性值有上面三种。以指令例子来进行说明：
```html
<member-block name='william' details='details' onChange='update(value)'></member-block>
```
如上面的声明，'@'表示name取值为字符串“william”，'='表示取值为父作用域中名为details的变量，而'@'用于绑定回调函数，它相当于一个angular表达式，说明在父作用域中执行“update(value)”这个语句。'@'也可以绑定到变量，但要通过绑定表达式，如“{{ name }}”的形式。

## 2.装饰器型指令
装饰器型指令是对现有DOM标签的行为扩展，保持View和Model的同步。下面是一个装饰器型指令的声明例子:
```javascript
angualr.module('matrix.course').directive('twTitle', () => {
  return {
	  restrict: 'A',
		require: '^ngModel',
		link: (scope, element, attrs, modelCtrl) =>
		  // ....
		}
	};
});
```

```html
<div twTitle="title"></div>
```

装饰器型指令的restrict属性通常为A（属性声明），说明其不是内容主体，只附加行为能力。

装饰器型指令通常不使用新作用域或独立作用域，若要访问绑定的属性，则可以通过link属性的函数的参数来获取：
* @型绑定通过attrs获取
* =型绑定通过scope.$eval获取，scope.$eval(attrs.details)等价于details'='。
* 而&型的绑定，由于其实angualr表达式，一般表达式是执行一个函数，因此可以传一个参数表，如下：
```javascript
scope.$eval(onChange, { name: 'william' });
```
这里的参数表是一个对象，对象的键对应视图中的参数名，如on-update='onChange(name)'中的name.

## 3.controller和link的区别
在上面的两种指令中，我们可以发现逻辑打码主要写在controller或link属性对应的函数上，那么他们有什么不同呢？

我在网上找到一个stackoverflow上[赞同率高的回答](http://stackoverflow.com/questions/12546945/difference-between-the-controller-link-and-compile-functions-when-definin)

按照上面的说法，link用于注册监听函数，controller用于与其他controller的交互（父级和子级）。

当然，他们都能够获取作用域、元素、属性的引用，link通过上面的scope、element、attrs参数获取，而controller则通过$scope、$element、$attrs获取。

不同点在于它们的执行时间、controller在directive编译之前执行，而controller在directive编译之后执行。另外子级指令的link（pre-link和post-link）函数必定在父级指令的post-link函数执行之前执行。

controller可以暴露出一个api，而由子级指令通过require属性获取，在link函数中进行操作：
```javascript
angualr.module('matrix.course').directive('twTitle', () => {
  return {
	  restrict: 'A',
		require: '^ngModel',
		link: (scope, element, attrs, modelCtrl) =>
		  // ....
		}
	};
```

关于link函数，这里有一篇我感觉挺详细的[解析博文](http://www.ifeenan.com/angularjs/2014-09-04-[%E8%AF%91]NG%E6%8C%87%E4%BB%A4%E4%B8%AD%E7%9A%84compile%E4%B8%8Elink%E5%87%BD%E6%95%B0%E8%A7%A3%E6%9E%90/)

link函数分pre-link和post-link函数，当单独定义时是作为post-link函数进行调用的，关于它们的区别，用下面一张图解释:
![file](/attachments/article-images/1478938731092image-1478938731069.png)

就像是事件捕获和时间冒泡的区别，pre-link和post-link在父子级组件间调用顺序上相反。post-link调用时自组件上的post-link函数一定已经调用，因此也是安全的业务逻辑代码的执行处。

controller函数可对其他组件提供api操作，那么如何获取组件的controller呢？先看一个例子:
```javascript
angular
  .module('matrixui.components.radio', [])
  .directive('muRadioGroup', muRadioGroupDirective)
  .directive('muRadio', muRadioDirective);


muRadioGroupDirective.$inject = [];
function muRadioGroupDirective() {

  RadioGroupController.prototype = { // 这里我通过定义controller对象的方法来提供对外的api接口
  };

  return {
    restrict: 'E',
    controller: ['$scope', RadioGroupController],
    // scope: true,
    // scope: {
    //   ngModel: '='
    // },
  }

  function linkRadioGroup(scope, element, attrs, ctrls) {
  }

  function RadioGroupController($scope) {
  }

}
 

muRadioDirective.$inject = [];

function muRadioDirective() {

  return {
    restrict: 'EA',
    transclude: true,
    require: '^muRadioGroup',
    template: `<div class="radio-container">` +
                `<div class="radio">` +
                  `<input type="radio" class="regular-radio"></input>` +
                  `<label class="mu-radio"></label>` +
                `</div>` +
                `<label ng-transclude class="mu-label"></label>` +
              `</div>`,
    link: link
  };

  function link(scope, element, attrs, rgCtrl) {
  }

}
```

```html
<mu-radio-group>
  <mu-radio></mu-radio>
</mu-radio-group>
```
如之前说过的，组件通过require属性获取其他组件的controller对象，属性值为组件名，可加上^、?修饰，^代表往上的节点查找组件，若是没有^则只会在当前节点查找。?代表找不到组件时，用null代替。组件对象在link函数的第四个参数中，通过link函数进行api的调用。require属性值也可以为组件名的数组，这样能依赖多个对象，同时link函数的第四个参数也会是数组，通过设置的顺序进行操作调用。
***
关于组件的机制还有许多，这里只是我学习记录的一部分。

# 二、filter
filter是一个特殊的函数，先看代码：
```javascript
angular.module('matrix.course').filter('memberFilter', function() {
  return function(members, role, key = '', page = null, pageSize = null) {
    let result =  members.filter(function(member) {  
      return (member.role == role
        && (key == '' ||
        member.nickname.includes(key) ||
        member.realname.includes(key) ||
        (member.email && member.email.includes(key))));
    });
    if (page && pageSize) {
      result = result.slice((page - 1) * pageSize, page * pageSize);
    }
    return result;
  };
});
```
```html
<div ng-repeat="member in members | memberFilter: 'teacher': role"></div>
```
从代码看出，filter返回一个函数，它第一个参数是要过滤的变量，后面的参数是自己定义的过滤条件变量。而在视图中的调用形式则是过滤变量 | 过滤器名: 过滤条件1: 过滤条件2.....在上面的代码中实现的是对一个数组进行条件筛选，返回筛选后的数组供视图使用。

在js代码中也可以调用filter，只要在controller中添加$filter依赖，通过执行$filter(过滤器名)(参数)调用过滤器。


