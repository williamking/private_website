以下笔记来自于[MDN的canvas教程文档](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

这些api有的是新标准中加入的，平时看的书中并没有，有的是平时少用没有印象，因此记录下来.

# 1.ctx.canvas
返回context对象对应的canvas元素。

# 2.ctx.curremtTransform[- value]
传入一个matrix(矩阵)对象，使canvas发生线性变化.
```
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var matrix = canvas.currentTransform;
matrix.a = 1;
matrix.b = 1;
matrix.c = 0;
matrix.d = 1;
matrix.e = 1;
matrix.f = 1;
ctx.currentTransform = matrix;
```
这段代码中设置了变换矩阵，变换矩阵的格式为[a,c,e;b,d,f;0,0,1]

# 3.ctx.direction = "ltr" || "rtl" || "inherit"
设置文本的方向，可选值有从左到右，从右到左以及继承canvas元素的设置


# 4.ctx.filter
该属性接收以下函数作为参数，以产生滤镜效果，具体效果见[filter](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#url\(\))

# 5.ctx.imageSmoothingEnabled
该属性设置canvas显示是否经过平滑处理,可选值为true(或default)和false

# 6.ctx.linecap
该属性设置canvas画线时线段两段的形状，候选值有"butt"(无方形),"round"(圆角)和"square"(末端加上方形)

# 7.ctx.lineJoin
该属性设置折线转折处拐角的样式，候选值有"bevel"(横切去一个角),"round"(钝化)和"miter"(默认折角)，效果见[此](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin)
