之前提到过开发H5小游戏项目使用了phaser框架，其中使用了一个[粒子效果插件](https://github.com/Ezelia/EPSy)，然而运行游戏时，却发现粒子效果在IOS下的浏览器竟然什么也没有显示，这可把我急坏了，于是我就开始了艰难的查bug过程。。。。。

开始的查bug方式是使用iphone连接电脑进行调试。然而我没有mac。。。。。。只好下了一个[软件](https://github.com/RemoteDebug/remotedebug-ios-webkit-adapter)以使用chrome调试手机上的safari，使用后才发现这个软件并没有适配IOS11，无奈下只好借了同事的iphone7进行调试。。。。。。这下chrome的inspect页面总算检测到了手机上的页面，我打开调试界面，发现报了一个错误，然而，上面的错误没有描述！！！！！查了下才发现这个软件没法使用调试器的全部功能，比如错误显示。。。。。但起码我知道了错误发生的范围了，我在这个范围内打断店，发现了插件上的粒子的update()函数并没有执行，而在安卓和电脑浏览器是执行了的。这部分代码大致是这样的（根据逻辑写的相似代码）：
```
  update: function() {
     var image = new Image();
		 image.src = xxx;
	   image.onload = function() {
	     this.loaded = true;
	   }
		 image.anonymous = '';
		 if (this.loaded) {
		   updateParticles();
		 }
	}
```
问题在与onload并没有执行，导致updateParitcles()也没有执行。我就想难道是图片加载出错了？一看调试器，发现粒子图片是成功下载了的，还能看到图片预览。于是我又在这段代码里加上了这句：
```
  document.body.appendChild(image);
```
然后在页面看这个图片标签，发现竟然也是啥都没有，把鼠标移到标签，发现是有图片预览的，只是大小显示是0X0。。。。。事情越来越奇怪了。。。。。

我查了好久，也没查到有什么代码改了图片的大小。这时我想到了前面的蜜汁报错，错误信息没有显示，于是我拿着手机到同事的mac电脑进行调试。总算是看到了错误信息：Cross-origin image load denied by Cross-Origin Resource Sharing policy。这是我就想到了是跨域问题，看了下粒子图片的URL，是一个base64URL，相当于是本地的资源，是不需要跨域的，于是我尝试删掉了语句`image.anonymous = ''`，粒子果然显示出来了。。。。

会出现这个bug的原因应该是safari和chrome对于base64URL图片的加载跨域策略不同，chrome是允许在设置了anonymous属性情况下加载base64URL图片了，而safari不允许。这个插件内都是使用base64URL来加载图片的，因此我就直接删去了anonymous设置的语句，问题总算解决了。。。。