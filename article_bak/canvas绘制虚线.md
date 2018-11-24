# canvas绘制虚线

## 1.ctx.setLineDash()

此API设置canvas接下来绘制的是虚线，函数接受一个数组作为参数，此数组设置了虚线中实线的长度以及间隔.
* 如参数为[5, 10]，则实线长度为5,间隔为10。若参数为[5, 10, 8]，则其看作[5, 10, 8, 5, 10, 8]即实线和间隔会以5, 10, 8, 5, 10, 8的长度进行循环.

## 2.ctx.getLineDash()

返回设置的虚线参数数组

## 3.ctx.lineDashOffset

设置虚线的相位(偏移)，参数为数字.可动态设置，形成Marching ants的动画效果:
```
var ctx = canvas.getContext("2d");
var offset = 0;

function draw() {
      ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.setLineDash([4, 2]);
          ctx.lineDashOffset = -offset;
            ctx.strokeRect(10,10, 100, 100);
}

function march() {
      offset++;
        if (offset > 16) {
                offset = 0;
                  }
                    draw();
                      setTimeout(march, 20);
}

march();
```
![实例效果](https://mdn.mozillademos.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineDashOffset$samples/Marching_ants?revision=891339)
