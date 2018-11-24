最近在复习《深入浅出Node.js》的异步编程部分，上面讲了异步实现中的promise方法，并介绍了其中一种实现。于是我看着并实现了一下，感觉多了一丝的理解。。。。。。

## 1.Promise/A与Promise/Deferred模式
书上讲的是Promise/A的一种实现，称为Promise/Deferred模式。Promise对象负责暴露在外的接口，Deferred负责内部异步任务的管理实现，是隐藏的对象。

## 2.Promise对象
Promise规范中Promise对象暴露的接口有then、catch方法，我这里实现了then、catch和done方法，Promise对象实现代码如下:

```
class Promise {
	constructor() {
		this.queue = []; // 用于维护连续的回调任务
	}
    
    /*
     * 设置promise成功态、失败态的回调函数，失败态回调可省略
     */
	then(fulfilledHandler, errorHandler) {
		let handler = {
			onFulfilled: null,
			onRejected: null
		}

		if (typeof fulfilledHandler == 'function')
		    handler.onFulfilled = fulfilledHandler;

		if (typeof errorHandler == 'function')
		    handler.onRejected = errorHandler;

		this.queue.push(handler);

		return this;
	}

    /*
     * 设置promise失败态的回调函数，必须在调用then后才能调用
     */
	catch(errorHandler) {
		if (this.queue.length == 0)
			throw new Error('You must call this method after calling "then"');
		let handler = this.queue[this.queue.length - 1];
		handler.onRejected = errorHandler;
		return this;
	}
}
```
这里的Promise对象暴露了then和catch方法使用，通过这些方法添加回调任务。这模式中变化的逻辑部分。
而任务中固定的调用逻辑则被封装在了Deferred对象中。

在Promise对象中，维护着一个回调队列，这是用于Promise对象连续调用then的状态维护。后面会配合Deferred对象进行说明。

二、Deferred对象
如上所述，Deffered对象负责的是异步回调中固定的逻辑也就是通过传统回调函数判断状态并调用响应的状态回调函数，内置一个Promise对象，通过promise对象来调用回调函数。
先看实现：
```
class Deferred {
	constructor() {
        this.promise = new Promise();
	}

    // 进入成功态时调用promise成功态的回调函数
	resolve(obj) {
        let promise = this.promise;
        let handler = null;
        while (handler = promise.queue.shift()) {
        	if (typeof handler.onFulfilled == 'function') {
        		let ret = handler.onFulfilled(obj);
        		if (ret instanceof Promise) {
                	ret.queue = ret.queue.concat(promise.queue);
        			this.promise = ret;
        			return;
        		}
        	} else {
        		return;
        	}
        }
	}
    
    // 进入失败态时调用promise失败态的回调函数
	reject(err) {
        let promise = this.promise;
        let handler = null;
        while (handler = promise.queue.shift()) {
        	if (typeof handler.onRejected == 'function') {
        		let ret = handler.onRejected(err);
        		if (ret instanceof Promise) {
                	ret.queue = ret.queue.concat(promise.queue);
        			this.promise = ret;
        			return;
        		}
        	} else {
        		return;
        	}
        }
	}

    // 生成promise化的回调函数，内含状态的判断逻辑
	callback() {
      return (err, data) => {
        if (err) {
        	this.reject(err);
        } else {
        	this.resolve(data);
        }
      };
	}
}
```
先看callback方法，这个方法返回一个传统样式的回调函数，通过err参数来判断进入任务进入成功态还是失败态，从而调用相应的resolve和reject方法。而resolve和reject方法取出内置promise对象的回调队列的最前一个状态回调并执行。这里说下里面的一段代码，以reject方法为例：
```
while (handler = promise.queue.shift()) {
    if (typeof handler.onRejected == 'function') {
        let ret = handler.onRejected(err);
   		if (ret instanceof Promise) {
        	ret.queue = ret.queue.concat(promise.queue);
   			this.promise = ret;
   			return;
   		}
   	} else {
   		return;
   	}
}
```
因为一般连续调用then是在前一个then设置的回调函数返回一个新的promise的情况，这时需要等这个返回的promise完成之后才会执行后面的回调函数。因此这种情况出现时会将后面的回调函数队列添加到这个新返回的promise的回调队列之后，并且代替Deferred对象维护的Promise，相当于一个嫁接的过程。

## 三、promisify函数
这里可能还是有点看得一头雾水，因此要结合promisify函数这个例子来进行说明，promisify函数是将一个传统的异步函数封装成一个promise函数的形式：
```
function promisify(func) {
  return function() {
  	let deferred = new Deferred();
  	let args = Array.prototype.slice.call(arguments, 0);
  	args.push(deferred.callback());
    func.apply(null, args);
    return deferred.promise;
  }
}
```
代码并不多，返回的promise化后的函数主要是维护了一个Deferred闭包对象，将传统的异步函数放在内部调用，其回调替换成deffered对象的回调函数，来实现与Deferred对象的对接。最后返回deferred对象的promise子对象作为暴露的接口供用户进行使用，Deferred内部固定的逻辑则被隐藏了起来。


## 四、all函数
all函数是将多个promise对象结合成一个promise对象返回的函数，只有所有promise对象最终为成功态时，该promise对象才会进入成功态，否则进入失败态，实现如下：
```
function all(promises) {
	if (!promises instanceof Array)
		throw new Error('Argument must be array');
    let length = promises.length;
    let datas = [];
    let deferred = new Deferred();
    for (let promise of promises) {
    	if (!promise instanceof Promise)
    		return new Error('Argument must be array of promises');
    	promise.then(data => {
            datas.push(data);
            if (--length == 0) {
            	deferred.resolve(datas);
            }
    	})
    	.catch(err => {
            deferred.reject(err);
    	});
    }
    return deferred.promise;
}
```

Promise是对异步任务执行逻辑的一种优雅的封装，运用了闭包来进行状态的维护，感觉理解其实现也是一种对js语言的一种深入了解吧。

以下是对promisify和all函数的测试代码：
```
import { promisify, all } from './api';
import { readFile } from 'fs';

let mSetTimeout = promisify(function (delay, success, callback) {
	setTimeout(() => {
		if (success)
		    callback(null, 'Delay for ' + delay);
		else
			callback('Delay failed');
	}, delay);
});

mSetTimeout(1000, true).then((data) => {
	console.log('test 1');
    console.log(data);
})
.catch(err => {
    console.log(err);
});

// test1
// Delay for 1000

let allSetTimeout = all([
    mSetTimeout(1000, true),
    mSetTimeout(2000, true)
]);

allSetTimeout.then((data) => {
	console.log('test 2');
    console.log(data);
})
.catch(err => {
    console.log(err);
});

// test 2
// [ 'Delay for 1000', 'Delay for 2000' ]

let allSetTimeout2 = all([
    mSetTimeout(1000, false),
    mSetTimeout(2000, true)
]);

allSetTimeout2.then(() => {
	console.log('test 3');
})
.then((data) => {
    console.log(data);
})
.catch(err => {
    console.log(err);
});

// test 3
// Delay failed
```

源代码放置在我的[github仓库](https://github.com/williamking/my-promise)
