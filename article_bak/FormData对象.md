最近写应用经常用到ajax提交post数据，而不用dom表单的默认发送事件处理，后来遇到了向服务器发送文件的问题，我只记得在Dom表单中添加type='file'的input标签，然后用表单的默认发送事件处理传输，那自定义的ajax如何通过post请求发送文件呢，于是我查阅资料，找到了FormData对象。

## 1.什么是FormData对象。
FormData类型是在XMLHttpReqest Level 2 背景下诞生的，原本ajax实现依赖的XMLHttpRequest只含有DomString和Document两种数据类型，前者为数据返回属性中的responseText，等同于常规字符串。后者为数据返回属性的responseXML，可以被解析为XML。
FormData对象是对表单数据内容的一个封装，将表单以键值对的形式来模拟，里面包含了要发送给服务器的表单内容。

## 2.如何创建表单对象？
一般有两种方法：
### 1) 通过已有的dom表单对象进行构造
```
let form = document.getElementById('form'); //这是要发送的dom表单对象
let data = new FormData(form); //通过dom对象作为构造函数参数创建FormData对象。
```
### 2) 先创建一个空FormData，通过append()方法添加表单字段
```
let data = new FormData(form);
data.append('name', 'william');
data.append('age', 15);
```
append方法参数分别为字段的键名和值对应dom中input标签的name和value。

## 3.ajax向服务器发送FormData对象。
```
var data = new FormData();
//向data添加数据
var xmlhttp = new XMLHttpRequest();
xmlhttp.open(url, 'post', false);
xmlhttp.send(data);
xmlhttp.onload = function(e) {
	if (xmlhttp.status == 200 && xmlhttp.responseText) {
		//处理响应
	}
}
```

## 4.向FormData对象中添加文件
如果是通过HTML表单创建FormData对象，可在表单内添加type="file"的input标签来添加文件。
若是通过代码添加，则直接向FormData对象添加一个File对象和Blob对象即可。有关File和Blob对象见另一篇笔记。
```
var data = new FormData();
var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
var oMyBlob = new Blob(aFileParts, { "type" : "text/xml" }); // the blob
data.append("file", oMyBlob);
//ajax发送处理
```

