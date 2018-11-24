# Flex布局

## 1.基本介绍

Flex布局是css盒模型的一种新式布局，意为灵活(flexible)

## 2.属性概念

* 在Flex中，盒模型布局分容器(flex container)和子结点(flex items)，两者有相应的各种属性的设置,下面是对各种属性的介绍

### 1) flex container

```
display: flex;
```
* 此属性定义了该结点为flex container


```
flex-direction: row | row-reverse | column | column-reverse
```

* flex容器定义有一条主轴和与其垂直的交叉轴，此属性定义了主轴的方向，上面的预选值依次分别为，从左到右、从右到左、从上到下、从下到上

```
flex-wrap: nowrap | wrap | wrap-reverse;
```

* 此属性定义了容器内部子节点的排列方式，上面的值依次为单行(默认)、换行且第一行上方、换行且第一行下方

```
flex-flow: <flex-direction> || <flex-wrap>
```

* flex-direction和flex-wrap属性的简写

```
justify-content: flex-start | flex-end | center | space-between | space-around

```

* 定义了字结点在主轴的对齐方式，预选值依次为对齐开头(默认)、对齐末尾、居中、两端对齐且结点间间距相等、结点两边都有固定相等的间距

```
align-items: flex-start | flex-end | center | baseline | stretch
```

* 定义了子结点在交叉轴的对齐方式，预选值依次是开头对齐、末尾对齐、居中、基线对齐、填充整条交叉轴(默认)

```
align-content: flex-start | flex-end | space-between | space-around
```

* 此属性只作用于多条主轴(例如多行，行为主轴)的排布，预选值含义与justify-content相同, 只需记住此属性定义的是多行之间的排布关系


### 2) flex-items

```
order: <integer>;
```

* 属性值为整数，定义了结点的排列顺序，值小的排在主轴的开头

```
flex-grow: <number>;
```

* 定义了结点在该主轴上所占的放大比例，是根据该值该行的所有结点的flex-grow值之和所占比例决定的，默认为0，即存在剩余空间也不会放大。

```
flex-shrink: <number>;
```

* 定义了子结点的缩小比例，默认为1，若为0，则当空间不足时，结点不会缩小，为1时当空间不足会等比例缩小。

```
flex-basis: <length> | auto;
```

* 定义了分配剩余空间前结点在主轴的占比，默认为auto，即原本大小。

```
flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
```

* 如代码所示，为上面几个属性的简写，其中后面两个值可以省略。可以使用快捷值auto(1 1 auto)和none(0 0 auto)，建议使用这个属性。

```
align-self: auto | flex-start | flex-end | center | baseline | stretch
```

定义特定的一个子结点在主轴的对齐方式，属性值与前面的justify-conetent的值相同。

## 3.引用

以上的资料来自于[这里](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)和[这里](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool)
关于详细的布局的示例，可见[这里](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

