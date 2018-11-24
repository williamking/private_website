在弄项目的一个输入自动查询补全，需求是在输入框输入关键词，自动进行查询，结果以自动补全的形式显示。但是每次输入改变都要发送一次查询请求太没有效率了，因为在用户输入过程中是没必要进行查询的，只有用户输入关键词完毕后，再进行查询才是理想的效果。这让我想起了以前的看过的一篇叫函数节流的文章。

## 1.函数节流

在写前端时，我们经常会定义一些事件监听，然而有的事件很容易短时间内被触发多次，就像上面我遇到的例子一样，而这多次事件的触发又是不必要的，若是事件回调函数里有dom操作之类的大开销操作，则会加大浏览器的负担，使网页响应变慢甚至崩溃，所以我们需要函数节流。

## 2.思想
函数节流的思想如同其名字，也就是节制流量，即对一定时间内函数执行的次数进行节制，也就是执行间隔。现在以我上面遇到的问题为例，不多说，先上代码:
```
function throttle(fn, context, delay) { // 节流下的setTimeout函数，参数依次为回调函数、上下文对象(this)、延时时间
    let timer = null;
    return function() {
    	if (timer) {
    	    clearTimeout(fn.timer); // 清除当前的定时
    	}
    	timer = setTimeout(() => {
    	  fn.call(context);
    	}, delay); // 重新进行定时
	}
}

function autoComplete() {
	// 自动补全查询
}

document.getElementById('key').addEventListener(throttle(autoComplete, window, 1000));
// 这里的上下文对象我用了window，实际应根据需求调整
```
上面的代码时间实现了监听输入框的输入事件，只有停止输入1秒钟后才会进行自动补全查询，若一直保持输入状态，则查询会一直延时下去。

## 3.扩展
如上所述，上面的代码在用户输入的时候查询一直被延时不执行，但对于一些需求情况，我们只想减少短时间内大量的函数执行，并不是要让其长期不执行。因此在上面的基础上，我们可以作一些改进，那就是加一个最大延时的设置。

下面只列出改进后的throttle的代码，调用略:
```
function throttle(fn, context, delay, duration) { // 增加了最大延时间隔参数duration
    let timer = null, lastCallTime = new Date(); // 增加了上一次调用时间的记录变量lastCallTime
    return function() {
    	if (timer) {
    	    clearTimeout(fn.timer); // 清除当前的定时
    	}

    	let currentTime = new Date();

    	if (currentTime - lastCallTime > duration) { // 判断是否达到最大延时，达到则立即执行，否则继续延时
    	    fn.call(context);
    	    lastCallTime = currentTime; // 更新上一次调用时间记录变量
    	} else {
        	timer = setTimeout(() => {
        	  fn.call(context);
        	}, delay); // 重新进行定时
        }
	}
}
```

以上就是我对函数节流的学习总结.