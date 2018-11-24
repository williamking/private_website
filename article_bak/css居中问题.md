# css居中 
css的元素居中是一个老生常谈的问题，下面我来总结下学习以来知道的几种实现方式:

HTML:
```
<div class="parent">
	<div class="item"></div>
</div>
```

## 1.居中元素宽、高已知

CSS:
```
.parent {
	position: relative;
	width: 500px;
	height: 500px;
}

.item {
	position: absolute;
	width: 300px;
	height: 300px;
	left: 50%;
	right: 50%;

    /*
    这里我加了个padding，主要是提醒其对margin-left和margin-top的影响，必须要算进去
    */

	padding: 20px;

	margin-left: -170px;
	margin-top: -170px;
}
```
## 2.居中元素宽高未知

CSS:
```
.parent: {
	position: relative;
}

.item {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

## 3.使用flex-box

CSS:
```
.parent {
	display: flex;
	justify-content: center;
	align-items: center;
}

flex-box可以实现多元素的居中布局
}

## 4.使用display: table-cell

CSS:
```
.item {
	display: table-cell;
	text-align: center;
	vertical-align: middle;
}
```

## 5.利用margin

CSS:
```
.parent {
	position: relative;
}
.item {
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	margin : auto;
}
```