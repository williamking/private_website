# 一、引言
之前在MIAC俱乐部做了个关于web组件化的分享，现在打算做一篇总结，主要是自己对web组件化的一些介绍和个人理解。自身学渣一枚，若是有什么差错疏漏也请多多包涵，也可以在评论区和我进行讨论。

# 二、Web组件化的概念
组件是用于构建大型应用的、具有一定通用性的代码封装，通常用于完成一个小的任务功能。web组件分为UI组件和纯逻辑的代码组件，在标准浏览器的环境中，`<a></a>`、`<input></input>`这些标签就可以算是一种基本的UI组件，稍微新型复杂的就有html5标准中的`<video></video>`。而标准浏览器的javascript执行环境中，一般就带有像xmlhttp这样的ajax服务的纯代码组件，类似的纯代码组件还有HTML5标准中的LocalStorage等。所谓的web组件化开发其实就是对一些重用性高的代码、资源的封装使用，提高开发、管理维护的效率。

# 三、Web组件的特点。
## 1.模块化
组件和模块其实可以看作是相同的定义，模块化其实是代码的一种封装、隔离的方式，模块化也是组件化的实现方式。对于web的模块化，由于javascript作为嵌入式脚本，自身不带有组织代码的功能特性，需要开发者模拟出类似的功能。于是各种模块化的方案和实现一一出现，如源于Node.js的CommonJS规范、CMD规范、AMD规范。甚至到后来，在ES6中也提出了模块标准，模块化实现了代码执行环境的隔离，为组件化提供了一种基础。

## 2.高内聚
组件需要具有资源的高度内聚和管理控制的能力，资源包括HTML、CSS、Javascript代码以及图片等等，这些在组件的内部有一套加载控制的方式，使得组件的资源紧密联系起来，这些在前面谈到的模块化的实现中都有体现，如RequireJS、Sea.js以及Webpack等等模块化类库，都有一套自己的资源依赖加载体系，实现了资源的高内聚特性。

## 3.重用性
这是组件化能加强开发效率的很重要的一点原因，组件自身实现的功能可以在多个环境、情景下进行复用，减少了代码的冗余。提高代码重用性也是软件开发工程化的一个重要要求。然而也并不是封装代码资源做成组件，重用性就强了。在一些情况下，组件化只是为了增强代码的管理维护效率，其重用度也并非很高。

## 4.互换性强
互换性指的是组件自身是否能在多种不同的环境下运行使用的特性。一个组件的互换性在于其接口是否规范、依赖性是否弱等因素。这需要开发者有良好的组件设计思想，实现组件的松耦合。

# 四、组件化思想以及实现
## 1.组件化思想
在没有组件化和模块化的时期，我们编写代码很多都是一种”面向过程的形式“，比如一个页面的javascript代码，其中有很多”流程"，比如页面的事件处理、页面资源的加载、页面数据的获取等，我们一般都是将他们划分成一个个任务和子任务，每个任务对应一个函数的定义，定义完函数、我们就执行最基本的几个任务函数即可。我在初学javascript时就是这样写的代码，不知道大神们都是怎么写的（笑）。然而，这种“面向过程”的代码，当页面逻辑变得复杂，代码内容变多的时候，会显得及其复杂，难以管理，试想自己面对一个1000多行的代码，里面定义了十多个函数，在debug调试时，还经常用CTRL+F的搜索方式去定位到自己想要调试的函数的那一行，是多么的麻烦和痛苦。

![file](/attachments/article-images/1482412654995image-1482412654925.png)

那么组件化又是怎么操作的呢？模块化给我们带来了代码的分离，不仅使冗长的代码文件成为了过去，也为项目带来了逻辑性的层次划分。在web页面中，我们可以总结出很多通用的流程、如DOM元素的加载、DOM事件的触发、异步数据的请求、处理等等。我们可以给这些流程抽象成组件自身的一种生命周期，一个组件从产生到销毁，经过了哪些操作，发生了哪些行为，都以生命周期的形式来定义。抽象出生命周期，我们把组件当成一个类（对象），生命周期就是其方法，在类内部的实现中，我们封装这些方法的执行顺序过程，也就是定义了组件的生命周期机制。在组件开发时，我们只需要在这些生命周期方法中编写我们自身的逻辑代码即可。这种方式给组件开发定制了一个规范、使得团队中的协作更加搞笑，代码也更加容易管理维护。

在我的理解中，一个web组件包含的内容特性有：
* 相对独立的作用域（css、javascript）
* 模板（UI组件对应的HTML片段）
* 组件间规范化的交互接口（数据的输入输出）
* 组件内嵌组合方式
* 生命周期机制
* 资源的内聚

## 2.组件化在一些框架的实现

下面谈下我使用过的一些框架组件化的实现。

AngularJS框架可以通过定义directive（指令）来实现组件化，directive可以看作是一种自定义的HTML标签或者属性，定义了标签或者属性直接在HTML中使用即可。Directive实现在javascript中的作用域独立，在内部的代码中我们一般是对`$scope`变量进行操作改变组件的状态，direcitve同时也具有模板功能，我们可以用一段HTML片段字符串赋予组件的模板属性，也可以把一个HTML片段文件的地址赋予其中。Directive的生命周期机制我感觉比较隐性，并不像之前提出的思想那样，把生命周期作为对外编写逻辑的类方法。一般我们是在controller或者link属性中赋予的回调函数中编写逻辑代码。

[ReactJS](https://facebook.github.io/react/)则很好的实行了上面的生命周期思想，其遵循![file](/attachments/article-images/1482412229120image-1482412228998.png)的生命周期，我们在定义组件时，可以在其组件类的构造函数中重载这些生命周期方法，即根据需求在合适的生命周期方法中编写自己的逻辑代码。在作用域上，React组件也是独立的，通过对组件对象的state属性进行操作来改变对象的状态，各个组件间通过props进行数据的传递，互相独立不受影响。在资源内聚性上，由于JSX那奇葩的语法，模板的内容都写在了JS代码中，虽然有点丑，也不妨是一种HTML资源内聚的实现。

对于组件内部资源的内聚，正如我之前在模块化上所提到的，模块化规范标准和类库实现都为我们提供了一套资源的依赖加载管理机制，通过这种机制来把资源聚集在一个模块中使用。模块化框架中我比较熟悉的有[webpack](https://webpack.github.io/)这个框架，这个框架以CommonJS规范为基础，通过`require(url)`的形式来实现对资源的依赖，对于一个模块，只需要一个入口js文件，webpack就能从这个入口文件分析出层层的依赖关系，从而把这些资源打包成一个JS文件供组件内部使用。对于不同类型的资源，我们可以设置不同的loader来进行预处理，如javascript代码的babel转译、sass的转译、代码的压缩等等。由于webpack是静态打包，因此没有涉及动态加载，当然也有处理动态加载的插件供我们使用。

对于css作用域的独立，有很多大牛前辈都有做过研究实践，很通常的一种做法是用sass进行嵌套加强编译后选择器的复杂性，避免污染。但sass并不是为了组件化设计的，对于组件化来说应该是一个片段性的css代码，而不是以页面为单位写在一个大的css文件中。webpack的css-loader使用了一种方案解决这个问题，我们通过require函数请求组件css文件的依赖，编译打包时将其css以style的形式内嵌入对应的dom中。最后的样式都变成了对应组件内dom的行内样式，实现了css的组件内作用域独立。关于css作用域，还有人提出了css模块化的概念，有兴趣的可以看这篇[文章](http://glenmaddern.com/articles/css-modules)。

# 五、Web Components标准
随着web组件化潮流的火热，w3c组织也定制了一套组件化标准规范——Web Components，未来有可能会成为组件化的主流，成为浏览器的原生实现。
在这套标准中，其为组件定义了四个技术：
* Custom Elements（自定义标签）
* HTML Template（模板）
* Shadow Dom
* HTML Imports
下面我一一解释这四个技术。

## 1.Custom Elements
这个是Web Components的使用方式，和Angular的Directive类似，我们可以自定义一个HTML标签在HTML中使用：
```javascript
var MyElement = Object.create(HTMLElement.prototype, {
  createCallback: function() {
    // dealWithTheElement
  }
});

// 注册新标签，名为my-element
document.registerElement('my-element', {
  prototype: MyElement
});
```
```html
<!-- This is a HTML file -->
<my-element></my-element>
```
## 2.HTML Template
显而易见，这是我之前提到的组件具有的模板功能，在Web Components里是通过`<template></template>`标签进行模板的定义：
```html
<!-- This is a HTML file -->

<template id="my-template">
  <li><span></span></li>
</template>
```
模板的使用：
```javascript
let template = document.querySelector('#my-template')[0];
let content = template.content;

// 这里是让模板内容复制出一个真正的dom片段，在复制前可对content（dom）进行数据的内容转化操作
let clone = document.importNode(content, true);
// 将复制出的片段插入html内
document.body.appendChild(clone);
```
从上面的用法上看，感觉只是单纯的HTML片段复制，并没有React和Angular的数据占位符，更没有数据绑定功能，仍需要手动写dom操作来将数据转化为显示内容，十分原始。。。。。。

## 3.Shadow Dom
这个技术是对组件内容的封装隐藏，我们可以在组件内创建一个Shadow Dom作为组件内部的HTML片段。更重要的特点是，在这个Shadow Dom内，css作用是和外界隔离的，这使得css作用域独立化成为了现实。

不仅是自定义标签，在其它标签我们也能创建Shadow Dom:
```javascript
document.createElement('div');

var shadowRoot = div.createShadowRoot();

shadowRoot.innerHTML = '<p>This is a shadow dom</p>';
```

## 4.HTML Imports
HTML导入技术实现了组件间资源的依赖加载以及结合，下面是使用的方式:
```html
<link rel="import" href="./my_component.html" />
```
通过Web Components标准，我们可以把组件的HTML资源、CSS资源、Javascript资源全部写在一个HTML文件中，通过link标签进行组件间的依赖加载组合。

然而，Web Components标准在目前的浏览器中并没有完全实现，我们可以引入一个叫[webcomponentsjs](https://github.com/WebComponents/webcomponentsjs)的库来实现Web Components标准特性。

Google开发了一款基于Web Components的框架——[Polymer](https://www.polymer-project.org/1.0/)，我没有用过，因此先不作评论。但从刚才的四个技术的使用看来，这套方案还不成熟，不如React和Angular中的组件化方案那么好用，希望w3c未来能够改进出更加优秀的Web Components标准。

# 六、总结
web组件化是一个很大的研究领域，其中有许多深入的知识，我的了解也仅仅是皮毛。正如我开头所说，难免会有理解错误和疏漏之处，请多多谅解。不过无论以后推出什么样的技术、什么样的框架，我们只需要把握组件化中根本的思想，在以后的团队开发中探索出适合自身的技术和方法即可。

下面是本文章所参考引用的一些资料：
* [致我们终将组件化的web](http://www.alloyteam.com/2015/11/we-will-be-componentized-web-long-text/)
* [javascript模块化历程](http://web.jobbole.com/83761/)
* [组件化的web王国](http://www.cnblogs.com/BruceWan/p/5845654.html)
* [Web Components是个什么样的东西](http://blog.csdn.net/fengyinchao/article/details/52382913)
* [A Guide To Web Components](https://css-tricks.com/modular-future-web-components/)
* [MDN中WebComponents的文档](https://developer.mozilla.org/en-US/docs/Web/Web_Components)