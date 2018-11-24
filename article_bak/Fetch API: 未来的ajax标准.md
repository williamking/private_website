最近几天在学习文件上传交互方面的内容，查找相关知识的时候，看到了Fetch API这个浏览器的新API标准，于是便学习了下，现在作下记录。

# 一、什么是Fetch API

在说Fetch API之前，得先说Ajax，想必对于开发前端的朋友都对它十分熟悉，在web2.0时代中，它是一个技术的里程碑，从静态页面到交互的动态页面少不了Ajax交互作为基础。那么我们是如何去使用Ajax的呢？在一些比较大型的项目开发中，我们很多时候都是用前端框架中的一些封装好的API去发送ajax请求。

然而，这些封装的API都是以浏览器环境提供的原生XMLHttpRequest对象作为基础的(IE除外。。。)，然而我们使用原生的XMLHttpRequest对象去发送ajax请求时，总会觉得十分不好用，原因是在技术变迁的现在，对于前后端的异步交互早就以Promise，Generator,Async/Await等方式作为主流，XMLHttpRequest这种事件监听式的交互方式反而在如今会显得格格不入，所以我们才会使用各种框架、库封装好的Ajax API来进行开发。但现在Fetch API作为一个新的Ajax实现接口标准被提出，更加地符合了如今的前后端异步交互的模式。

# 二、Fetch API的简单使用

Fetch API是以fetch函数为基础核心的，比如我们想向百度主页发一个get请求，原生的XMLHttpRequest方式是这样的:
```javascript
let xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', 'www.baidu.com', true);
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.status == 200) {
	  handler(xmlhttp.responseText);
	}
};
xmlhttp.send();
```
而使用Fetch API是这样子的:
```
fetch('www.baidu.com').then(function(res) {
  handler(res);
});
```
没错，fetch函数最基本的参数就是请求的URL（默认GET请求），返回的是一个Promise对象，通过Promise的then和catch方式来处理请求的响应。

如果我们要发送其它类型的请求怎么办呢？这时需要使用fetch函数的第二个参数:
```
fetch(URL, {
  method: 'POST',
	headers: myHeaders
}).then(myHandler);
```
fetch函数的第二个参数是一个对象，这个对象可以用来进行请求报文的一些参数定义。

若请求失败，则通过fetch返回的Promise对象的catch方法进行错误捕捉:
```
let errHandler = function(err) {
  console.log(err.message);
};
fetch(URL).then(successHandler).then(errHandler);
```
以上是Fetch API的一些基本使用方法。

# 3.Request对象

Fetch API标准提供的不仅仅是fetch这个全局请求函数接口，还对请求和响应报文进行了规范的对象封装，下面先来介绍下Request对象。

万事先从例子说起:
```
let config = {
  method: 'GET',
	headers: myHeaders,
};
let request = new Request('www.baidu.com', config);
fetch(request).then(successHandler);
```
上面是发送GET请求的另一种方式，fetch函数不仅可以接受URL作为参数，也可以接受一个Request对象。Request对象就是对请求报文的一个封装，我们可以通过Request()构造函数创建Request对象并对请求报文进行各种设置。Request对象的第一个参数为URL，第二个参数为自定义设置对象，之前的fetch方式可以说是省去了Request对象构建的一种简化版方法。

# 4.Headers对象

在上面的Request对象构造中，我在第二个参数的自定义对象中进行了headers的设置(myHeaders)，那么headers属性可以是什么类型的值呢？

首先可以是普通的对象，如:
```
{
  'Content-Type': 'text/plain'
}
```
其实对于headers，Fetch API标准提供了更为严谨的对象封装，那就是Headers()对象，惯例，先看代码:
```
let myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
let config = {
   method: 'POST',
	 headers: myHeaders
};
fetch(URL, config).then(successHandler);
```
Headers对象提供了append、set、get、delete等方法对请求报文头进行键值对的添加、修改、获取和删除。

# 5.Response对象

既然有了Request对象，自然有Response对象。我们可以使用Response构造函数创建，不过我们一般不这么做，而是从fetch函数返回的promise的回调函数的参数中获取:
```
fetch('www.baidu.com').then(function(res) {
  console.log(res);
});
```
代码中回调函数的res参数就是一个Response对象。

常用到的Response对象属性有:
* status: 状态码
* statusText: 与状态码对应的消息
* Reponse.ok: 布尔值，检测请求是否成功（状态码在200-299之间）。

# 6.Body对象

无论是Request对象和Response对象都含有body属性，其对应的就是Body对象。
Body对象可以是以下几个对象的实例:
* ArrayBuffer
* ArrayBufferView
* Blob/File
* string
* URLSearchParams(就是get请求常带有的URL上的参数query字符串内容）
* FormData
而Body对象、Request对象、Response对象都提供以下几个方法对body内容进行上面几个对象的解析转义:
* arraybuffer()
* blob()
* json()
* text()
* formData()
下面给一个例子，是对response对象的json转义:
```
fetch(URL).then(res => res.json()).then(json => console.log(json));
```
由于上面几个转义方法返回的都是是Promise对象，所以需要像上面那样用类似流的方式去获取转义后的结果。

# 7.兼容性
Fetch API作为一个新提出的标准，还没有被完全普及到所有浏览器，当然，在一些新版本的浏览器(比如Chrome)，当然是资瓷的。详细的兼容性可以看下面的参考链接介绍，这里不作赘述。

那如果不兼容怎么办的，老办法：引入兼容库：[fetch-polyfill](https://github.com/github/fetch)

Fetch API可以说是对我们用的各种封装的Ajax请求方法进行了一个标准统一，相信不久之后会完全取代XMLHttpRequest对象。其实关于Fetch API的内容还有不少，比如说自定义请求的各种属性值设置，这里只是做了一些常用属性的简单记录，详细可以去下面的参考链接学习。

下面是参考链接:
* [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
* [【翻译】这个API很“迷人”——(新的Fetch API)](https://www.w3ctech.com/topic/854)