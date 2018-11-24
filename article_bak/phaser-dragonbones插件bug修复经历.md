最近在用phaser框架做一个H5小游戏，由于设计给的一个动效是骨骼动画，而骨骼动画没有没被phaser支持（phaser依赖的pixi.js已经支持spine格式的骨骼动画了，然而phaser用的还是旧版本......）。于是在github上找到一个叫dragonbone-phaser的插件[](https://github.com/raksa/phaser-dragonbones)，然而用了之后才发现这个插件有不少bug，并且有的功能甚至没有写完。。。。。。

其中的一个问题就在于动画播放时产生的丢帧。下面是来自插件github的README的一个例子：
```
{

    init: function() {

        this.dragonBonesPlugin = this.game.plugins.add(Rift.DragonBonesPlugin);

    },

    preload: function () {

        this.dragonBonesPlugin.addResourceByNames("key",
            "path/to/skeleton.json", "path/to/texture.json", "path/to/texture.png");

        this.dragonBonesPlugin.loadResources();
    },

    create: function () {

        var x = this.world.width / 2;

        var y = 3 * this.world.height / 4;

        var sprite = this.dragonBonesPlugin.getArmature("key");

        sprite.position.setTo(x, y);

        sprite.scale.setTo(0.6);

        this.world.add(sprite);

        var names = sprite.animation._animationNames;

        sprite.animation.play(names[0]);
    }

}
```
这里看是没什么问题，但是如果在addResourceByNames和getAmature之间插一个延时，则掉帧现象就出现了，这种掉帧并不是因为卡顿，而是来自于动画计算该播放的帧时间错误，导致中间一段时间的帧被跳过了。为什么会出现这个问题，下面就来说明一下。

先看addResourceByNames的源码：
```
        DragonBonesPlugin.prototype.addResourceByNames = function (key, skeletonJson, textureJson, texturePng) {
            this.addResources(key, new Array(new Resource(ResType.Image, texturePng), new Resource(ResType.TextureMap, textureJson), new Resource(ResType.Bones, skeletonJson)));
        };
        DragonBonesPlugin.prototype.addResources = function (key, resources) {
            for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
                var resource = resources_1[_i];
                this.addResource(key, resource);
            }
        };
        DragonBonesPlugin.prototype.addResource = function (key, res) {
            key = key.toLowerCase();
            var updated = false;
            for (var resKey in DragonBonesPlugin.objDictionary) {
                if (resKey == key) {
                    if (DragonBonesPlugin.objDictionary[resKey].resources.filter(function (resource) {
                        return resource.type === res.type;
                    }).length == 0)
                        DragonBonesPlugin.objDictionary[resKey].resources.push(res);
                    updated = true;
                    break;
                }
            }
            if (!updated) {
                DragonBonesPlugin.objDictionary[key] = new DragonBonesObject(this.game, new Array());
                DragonBonesPlugin.objDictionary[key].resources.push(res);
            }
        };
```
好吧，这里也没能看出啥。。。。注意这里新建了一个DragonBonesObject对象。dragonbones本来是egret框架开发的一个骨骼动画的格式，官方开发了基于Pixi.js的用于h5游戏的dragonbones库，由于Phaser也是基于phaser，因此才能在phaser中使用dragonbones，这里的DragonBonesObject就是引用到dragonebones库的对象。

下面看下DragonBonesObject的定义：
```
    var DragonBonesObject = (function () {
        function DragonBonesObject(game, resources) {
            this.factory = new dragonBones.PhaserFactory(null, game);
            this.resources = resources;
        }
        return DragonBonesObject;
    }());
```
这里用了dragonbones库的factory接口，看下定义：
```
    var PhaserFactory = (function (_super) {
        __extends(PhaserFactory, _super);
        function PhaserFactory(dataParser, game) {
            if (dataParser === void 0) { dataParser = null; }
            var _this = _super.call(this, dataParser) || this;
            _this.game = game;
            if (!PhaserFactory._eventManager) {
                PhaserFactory._eventManager = new dragonBones.PhaserArmatureDisplay(game);
                PhaserFactory._clock = new dragonBones.WorldClock();
            }
            return _this;
        }
        PhaserFactory._clockHandler = function (passedTime) {
            PhaserFactory._clock.advanceTime(-1); // passedTime !?
        };
				// 以下代码省略
			}
	}
```
可以看到这里的\_clockHandler函数里创建了一个worldClock对象，这个对象是做什么的呢，实际上这个是一个计时对象，每次更新帧的时候都会往里面更新一个帧时间，用于每次更新帧的时候，计算与上一帧的时间差。
下面是advanceTime的部分定义：
```
        WorldClock.prototype.advanceTime = function (passedTime) {
            if (passedTime != passedTime) {
                passedTime = 0;
            }
            if (passedTime < 0) {
                passedTime = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND - this.time;
            }
            passedTime *= this.timeScale;
            if (passedTime < 0) {
                this.time -= passedTime;
            }
            else {
                this.time += passedTime;
            }
						// 省略
				}
```
可以看到由于传的参数是-1，因此函数内是直接将当前时间减去上一次的this.time来计算时间差的，然后会将这个passedTime传给dragonbones对象，告诉它距离上一次更新已经过了多少时间，从而算出当前该渲染的动画状态，并且更新WorldClock对象的time属性。
那么问题来了，这个advanceTime的调用是被赋给\_clockHandler方法里的，这个方法什么时候被调用的？请看下面代码：
```
        DragonBonesPlugin.prototype.getArmature = function (key, armatureName) {
            var item = this.createFactoryItem(key);
            if (armatureName == null)
                armatureName = item.skeleton.armatureNames[0];
            var armature = item.factory.buildArmatureDisplay(armatureName);
            item.armature = armature;
            this.refreshClock();
            return item.armature;
        };
        DragonBonesPlugin.prototype.refreshClock = function () {
            var hasEvent = false;
            var callback = dragonBones.PhaserFactory._clockHandler;
            this.game.time.events.events.forEach(function (event, index, events) {
                if (event.callback == callback) {
                    hasEvent = true;
                    return;
                }
            });
            if (!hasEvent)
                this.game.time.events.loop(20, dragonBones.PhaserFactory._clockHandler, dragonBones.PhaserFactory); // 这里启动了一个20毫秒间隔的时间循环，第二个参数是要执行的函数，第三个参数是执行函数的this对象
        };
```
当调用getAmature方法时，里面会调用一个refreshClock方法，这里面利用phaser的game.time.events.loop接口启动了定时循环调用了\_clockHandler，也就是说这里会每20毫秒更新一次帧的时间。因此我们可以看出问题的来源了：当调用addResourceByName时，WorldClock被创建，此时WorldClock实例里的time属性被初始化为当前时间（此时循环更新并没有启动）。如果延时调用getArmature方法，定时更新时间也会被延迟，因此延迟后，第一次执行advanceTime(-1)的时候，算出的passedTime就会很大，因此导致的效果是（假设延时了1秒）：动画一开始播放初始状态（0s状态），然后马上跳到了1s的帧状态，0-1s中间的动画就完全被跳过了。

那么如何解决这个问题？我尝试了在getArmature的函数里，强行将WorldClock的time属性改为当前时间，缩短第一次计算的帧时间差。然而好像Phaser的时间循环接口有延时问题，还是有1s左右的跳帧。最后我只能修改dragonbones的源码，在advanceTime里加了一小段代码：
```
        WorldClock.prototype.advanceTime = function (passedTime) {
            if (passedTime != passedTime) {
                passedTime = 0;
            }
            if (passedTime < 0) {
                passedTime = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND - this.time;
            }
            passedTime *= this.timeScale;
            if (passedTime < 0) {
                this.time -= passedTime;
            }
            else {
                this.time += passedTime;
            }
						// 下面是我自行附加的代码，将第一次计算的帧时间差强行赋值为0
            if (!this.firstAdvance) {
              this.time = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND;
              passedTime = 0;
              this.firstAdvance = true;
            }
					  // 以下代码省略
				}
```
这样总算把问题解决了，其实我还是不懂问题的根源出在那边，究竟是dragonbones库自身的问题，还是phaser-dradonbones这个插件调用的方法不对，值得深思。