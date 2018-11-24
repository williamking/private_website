最近被组里一位大神教了点bash命令的皮毛，请看下面的例子：
```
for i in  `cat ../tmp2/dking.txt`;do echo $i; cp $i/example.txt ../tmp2/dking/$i.png;done
```
这条命令是读取某文件的文件夹名列表（一行一个），然后拷贝对应文件夹里面某文件到某文件夹，并重命名为该文件夹的名称