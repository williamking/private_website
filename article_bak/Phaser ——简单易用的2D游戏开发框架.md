# 一、引言
最近1个月在做一个H5游戏项目，正好组里的人开发游戏使用一个叫phaser的2D游戏框架，于是经过预研，决定使用这款框架开发H5游戏，现将开发学习的一些总结记录于此。

# 二、简介
phaser是一款专门用于2d游戏开发的框架，它基于一款叫Pixi的2d渲染引擎。特点表现为以下几点：
1.简单朴素，扩展性强。这款框架内并没有复杂的继承OO特性，开发场景、对象完全可以
用其提供的类解决，不需要强制自行扩展创建类。当然，这也提供了不错的扩展性，同事就以phaser的类基础封装继承了一套开发框架，用于特定的游戏开发。
2.资源加载简单易用。phaser使用其内部定义的Loader对象进行资源加载，提供多种资源的加载接口，包括音频、精灵表、纹理图、JSON、bitmap字体等等，意味着可以使用许多游戏通用的资源格式，并进行加载
解析使用。


总而言之，phaser给我的印象就是简单易上手、易扩展的特点，是一款优秀的游戏框架。

# 三、对游戏特性的支持
下表是phaser对游戏功能的一些支持情况:

![file](/attachments/article-images/1507963641017image-1507963601250.png)

# 四、搭建phaser小游戏
html部分十分简单，只需要搭建一个空的页面，里面加一个div容器就可以了。主要在js代码部分。
```
   var game = new Phaser.Game(360, 640, Phaser.CANVAS, 'game-wrapper',  {
	    init: function() {
			  // 初始化游戏对象，在这里可以自定义一些状态数据
			},
			preload: function() {
			  // 游戏资源加载的周期，此时可以调用game.loader加载游戏资源
				this.game.loader.image('xxxx');
			},
			create: function() {
			  // 游戏创建周期，在这里可以初始创建起始的UI实例
			},
			update: function() {
			  // 在每次更新帧的使用调用的周期，这里可以实现一些更新的逻辑
			}
	 });
```
这是一个phaser的game对象创建的例子，上面创建了一个宽360px，高64px，使用CANVAS渲染的游戏实例，创建的canvas以id为'game-wrapper'的元素作为父元素。最后一个参数是对游戏对象生命周期逻辑的设置。
上面4个函数是phaser游戏对象主要的几个生命周期，通过在不同的周期编辑逻辑代码，从而实现游戏的运行。当然我们也可以额外往里添加自定义封装的方法以便自身的设计开发和扩展。

# 五、phaser的一些问题
使用phaser开发了一个多月，也踩了不少的坑，发现了phaser的一些问题，现在记录如下：


1.phaser使用的pixi版本较低。虽然phaser基于pixi，但是其内置的pixi版本仍然低于官方的版本许多，以至于pixi的一些特性无法在phaser中使用，这点会在后面几个问题体现。据说phaser打算减少对pixi的依赖，只能看后续如何更新了。

2.不支持骨骼动画。项目中突然提出要用到骨骼动画的需求，这是才发现phaser官方并没有提供骨骼动画的接口，虽然pixi.js已经实现骨骼动画的加载和播放了，但是phaser使用的是低版本的pixi。。。。。。目前只能通过第三方phaser插件来实现，使用了dragonbones库，通过[phaser-dragonbones](https://github.com/raksa/phaser-dragonbones)插件来引入（实现不完整，有许多坑和bug，花了不少时间修补）。

3.没有成熟的开发工具。不像unity、cocos2d、egret等框架带有游戏编辑工具，很多的设计开发都只能通过代码进行，预览只能通过打开网页预览（在组件UI的排布上就花了我不少时间）。目前有个第三方的phaser[编辑器](http://phasereditor.boniatillo.com/)，然而功能不太完善成熟。

# 六、总结
phaser这个框架简单易上手，对于一些小型游戏的开发无疑是一个好的选择，但它也有对一些游戏特性不支持的问题。只能说在选择游戏框架的时候要仔细调研框架的支持性，在简单的需求下，使用phaser开发还是很好的，官网的例子很多，学习可以结合api文档和例子进行。

下面是参考的一些文章：
* [HTML5游戏引擎深度测评](https://zhuanlan.zhihu.com/p/20768495)
* [HTML5游戏框架大军中的一乘轻骑Phaser](http://www.csdn.net/article/2015-10-08/2825865)

[phaser官网](https://phaser.io)