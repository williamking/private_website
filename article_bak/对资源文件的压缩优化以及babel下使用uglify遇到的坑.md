最近发现自己写的网站部署上去之后加载十分缓慢，仔细检查网络状况发现是资源文件太大了，一个webpack打包的文件就有上1M那么大，如下图：
![](/images/articles/1.jpg)
参考了小伙伴的建议，我使用了一些压缩插件来优化代码。

首先我使用了express的[compression](https://www.npmjs.com/package/compression)插件，这个是将响应报文的内容压缩打包成gzip格式再发送给客户端，使用后资源大小明显有变化，缩小到了四分之一左右，如下图：
![](/images/articles/2.jpg)
并且在响应报文头部里可以看到content-type变成了gzip：
![](/images/articles/3.jpg)

除了在服务器上对报文内容进行压缩，还要在资源文件本身进行压缩优化，这里用了[gulp-uglify](https://www.npmjs.com/package/gulp-uglify)插件，在gulp上对打包好的js文件进行“丑化”,也就是进行空格换行去除等大小优化的工作。压缩有代码会挤成一团，可读性极差，所以说也有一种防解读的作用。压缩的代码就像这样：
![](/images/articles/4.jpg)

压缩后大小进一步减小：
![](/images/articles/5.jpg)

然而在使用uglify时我却遇到一个问题，运行gulp时uglify插件部分报错，把错误信息输出，发现错误出现在变量定义语句的let那里，我想难道uglify不支持ES6?可我用了babel插件将ES6转换成ES5，为何还会出现这个问题？我谷歌了好久，终于发现问题：我没有在babel插件上设置preset=ES2015，这个是将转码规则设成ES2015，设置之后原本let就被转换成了var加上函数封闭环境，可以进行压缩了。
![](/images/articles/6.jpg)
