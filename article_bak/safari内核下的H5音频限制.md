# 一、问题来源
最近在开发一个H5宣传小游戏，发现里面的音效在iphone下的微信打开时并没有播放，而是需要点击后才能播放。网上查了下原因才知道IOS下微信使用的是safari内核，移动版safari对音频播放具有一些限制。

# 二、safari的音频播放限制
在移动版的safari中，是不能自动播放音频文件的，必须触发用户解除事件，比如mouseclick、mousedown、touchstart等，音频才能进行播放，据说是为了防止音频播放未经用户同意消耗用户流量。。。。。。
解决方式是模拟一个点击事件触发，在触发回调中播放音频：
···
// run on page load
var button = document.getElementById('button');
var audio = document.getElementById('audio');
 
var onClick = function() {
    audio.play(); // audio will load and then play
};
 
button.addEventListener('click', onClick, false);
···
然而我在游戏中这样使用却没有效果，后来又找到了一个方法，那就是使用微信jssdk的接口:
```
wx.ready(function() {
  var audio = document.getElementById('audio');
	audio.play();
});
```
这样音频就成功自动播放了，具体是什么原因我也不太清楚。。。。。。或许是微信客户端通过这个接口调用触发了用户的点击事件吧。

资料参考:
[克服 iOS HTML5 音频的局限](https://www.ibm.com/developerworks/cn/web/wa-ioshtml5/index.html)