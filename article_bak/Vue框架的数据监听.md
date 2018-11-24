# 1.vue的数据监听原理
vue在初始化数据实例的时候，会对其对象属性执行getter/setter的转化，即每次对对象属性的修改和获取都会被vue所监听捕获处理。然而由于javascript标准废弃了Object.Observe，vue无法检测对象属性的增加或删除，因此如果在原有的数据实例添加新的属性，该属性的修改和获取不会被vue所监听到。

# 2.解决方法
使用Vue.set(Object, propName, value)方法来为vue组件的数据实例添加属性，这样vue能在set方法中对其getter/setter进行转化，其修改和获取也就能监听到了。