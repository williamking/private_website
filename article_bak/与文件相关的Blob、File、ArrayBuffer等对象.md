## 1.Blob对象
Blob是HTML5标准中定义的一个包含有只读原始数据的类文件对象。File对象是其继承和扩展，之后会详细说明。
Blob对象用于大量二进制数据的处理与传输。

## 2.Blob对象的创建
Blob对象可通过Blob()构造函数创建，可传入参数，分别是ArrayBuffer数据和设置Blob属性的对象。
下面是例子：
```
var blob = new Blob(['Hello world!'], {type:'text/plain'});
```
关于Blob属性对象参数，其能设置的属性一般只有type，原本的endings参数已废弃。
type属性一般为文件的MIME类型，比如'text/xml'、'text/javascript'等等。

## 3.slice()方法
这个方法用于截取Blob对象的制定范围数据，返回包含该数据的Blob对象。参数有start,end与contentType，分别为起始、结束位置(类似数组的slice)和返回对象的MIME类型。
这个方法可用于大文件的分割传输。
在浏览器实现方面，可见(https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)相关部分，其中webkit内核浏览器一般带webkit前缀，firefox(Gecko内核)则带有moz前缀。

## 4.到url的转换
Blob对象可作为URL.createObjectURL()的参数，返回该对象对应的URL地址，这个地址可以放在a标签提供用户此Blob对象文件下载，如果数据为图片则可以赋值到其src属性进行显示。
例子如下：
```
var blob = new Blob([data], {type:'text/csv'});
var url = URL.createObjectURL(blob);
var downloadLink = document.createElement('a');
downloadLink.href = url;
```

## 5.Blob对象的获取
可以通过ajax从服务器获取Blob对象封装的数据：
```
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('get', url, true);
xmlhttp.responseType = 'blob'; //这一句是关键，指定获取的返回数据为Blob类型
xmlhttp.onload = function() {
	if (this.status == 200 && xmlhttp.response) {
		var blob = this.response; //reponse属性即为返回的Blob数据对象
		//对Blob对象进行处理
	}
}
```
但是要注意跨域限制的问题，只有请求的站点在Access-Control-Allow-Origin设置中允许本机客户端的请求时，才能获取数据资源。

## 5.ArrayBuffer
ArrayBuffer是HTML5标准中定义的用于保存原生二进制数据的对象，相当于二进制数组。
通过构造函数ArrayBuffer(length)创建，参数为创建数据的长度(以字节为单位)。
ArrayBuffer可作为Blob构造函数的参数，可以理解为ArrayBuffer是最底层的数据类型，Blob是对其进行的一个封装。
ArrayBuffer与一般Array类型的不同点是，Array是使用哈希进行查找访问，数据并不是连续存储的，而ArrayBuffer的数据则是写入内存中一块固定大小的空间，数据是连续的。因此对ArrayBuffer的访问速度会比Array快得多。适用于ajax，Canvas，WebGL等大容量数据的处理。
ArrayBuffer本身并不能读写，需要转化成类型化数组或者DataView对象来处理。
转化的方式为通过将ArrayBuffer作为类型化数组构造函数的参数创建对应类型化数组。
类型化数组的类型有：

| type         | size | description  |
| ------------ | ---- | ----------:  |
| Int8Array    | 1    | 8位有符号整数  |
| Uint8Array   | 1    | 8位无符号整数  |
| Int16Array   | 1    | 16位有符号整数 |
| Uint16Array  | 1    | 16位无符号整数 |
| Int32Array   | 1    | 32位有符号整数 |
| Uint32Array  | 1    | 32位无符号整数 |
| Float32Array | 1    | 32位浮点数    |
| Float64Array | 1    | 64位浮点数    |

通过atob(data)函数，可将ArrayBuffer类型的数据转换成对应的Base64Sting,反之，通过atob(string)，可将Base64String转换为ArrayBuffer类型的数据。这其实是一个编码与解码的过程。

ArrayBuffer也有slice方法，用法和字符串的slice一致，通过传入start和end参数，返回截取的数据段。
```
var buf1 = new Buffer(10);
var buf2 = buf1.slice(0); //在第二个参数缺省情况下，end的默认值为数据末尾，因此这个语句相当于复制了buf1然后赋值到buf2中。
```


## 6.File对象
File对象是继承于Blob对象，意为“文件”。通常为表单控件<input type="file">选择的FileList对象或是拖拽文件产生的DataTransfer对象。
File对象支持的属性有：
*File.lastModifiedDate*：文件最后修改日期
*File.name*：文件名
*Blob.isClosed*：表示其是否调用了Blob的close()方法，若已调用，则该文件无法读取。
*Blob.size*：字节大小
*Blob.type*：MIME类型，空字符串代表未知。

File对象可转换为Data base64 url格式，其对应转换的方法为readAsBinaryString、readAsText和readAsDataURL。

## 7.DataView对象。
这是一个用于读写ArrayBuffer的对象，可以各种类型进行数据读取:
```
var buf = new ArrayBuffer(10);
var num = new DataView(buf).getInt16(0);
num += 10;
newDataView(buf).setInt16(0, num);
```
上面的代码新建了一个ArrayBuffer对象，读取第一个Int16大小的数据得到一个数字，将其加10，在以Int16的大小数据赋值到ArrayBuffer的第0个Int16区域。可以看出DataView对象主要有getType()方法和setType方法，Type的种类有Int8、Uint8、Int16、Uint16、Int32、Uint32、Float32、Float64。get方法接受一个参数，为以该类型为单位的偏移位置，set方法接受两个参数，为以该类型为单位的偏移位置以及要赋值的该类型的数据。

## 8.总结
随着HTML5标准的推出，各种新类型层出不穷，但它们的出现都是为了方便地进行开发，满足前端程序员的开发需求。这次记录的是文件数据处理方面相关的对象和API，要熟悉它们还是需要真正的实战，才能体会到它们给开发带来的方便，之后的计划是学习写一个文件断点续传的web组件，完成后应该也会写一篇笔记，主要记录对前端数据处理和传输的应用。希望能够做好规划，踏实的学习。
这次笔记参考了以下链接（感谢张鑫旭大牛，博客写的很不错，语言也挺有趣）：
* [http://www.zhangxinxu.com/wordpress/2013/10/understand-domstring-document-formdata-blob-file-arraybuffer/]
* [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView]
* [https://developer.mozilla.org/en-US/docs/Web/API/File]
* [https://developer.mozilla.org/en-US/docs/Web/API/Blob]
* [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer]
* [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray]


